pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        timeout(time: 45, unit: 'MINUTES')
        // Avoid concurrent builds of this job accessing the same workspace-local database.
        disableConcurrentBuilds()
    }

    tools {
        nodejs 'NodeJS 22'
    }

    environment {
        DOCKER_BUILDKIT = '1'
        HARBOR_REGISTRY = '192.168.122.149'
        TRIVY_CACHE_DIR = "${WORKSPACE}/.trivy-cache"
    }

    stages {
        // Check out the source and derive a traceable image tag from the commit.
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    // Use the checked-out commit as an immutable image tag for traceability.
                    env.IMAGE_TAG = sh(
                        script: 'git rev-parse --short=7 HEAD',
                        returnStdout: true
                    ).trim()
                }
            }
        }

        // Install locked dependencies and generate the API database client in parallel.
        stage('Install dependencies') {
            parallel {
                // Install the frontend's exact lockfile dependencies.
                stage('Frontend dependencies') {
                    steps {
                        dir('frontend') {
                            sh 'npm ci'
                        }
                    }
                }
                // Install API dependencies and generate the database client.
                stage('API dependencies') {
                    steps {
                        dir('api') {
                            sh 'npm ci'
                            sh 'npm run db:generate'
                        }
                    }
                }
            }
        }

        // Run frontend quality checks and API tests in parallel.
        stage('Automated tests') {
            parallel {
                // Test, lint, and build the frontend.
                stage('Frontend tests and lint') {
                    steps {
                        dir('frontend') {
                            sh 'npm test'
                            sh 'npm run lint'
                            sh 'npm run build'
                        }
                    }
                }
                // Run the API test suite.
                stage('API tests') {
                    steps {
                        dir('api') {
                            sh 'npm test'
                        }
                    }
                }
            }
        }

        // Fail the pipeline if repository content contains detected secrets.
        stage('Secret scan — Gitleaks') {
            steps {
                script {
                    docker.image('zricethezav/gitleaks:latest').inside('--entrypoint=""') {
                        sh 'gitleaks detect --source=. --exit-code 1'
                    }
                }
            }
        }

        // Scan frontend and API source for JavaScript and Node.js security issues.
        stage('SAST — Semgrep') {
            steps {
                script {
                    docker.image('semgrep/semgrep:latest').inside('--entrypoint=""') {
                        sh '''
                            # Semgrep writes its user-level files under HOME; use the writable workspace.
                            export HOME="$WORKSPACE"
                            mkdir -p "$HOME/.semgrep"
                            semgrep scan --config p/javascript --config p/nodejs --error frontend api
                        '''
                    }
                }
            }
        }

        // Check frontend and API packages for known critical vulnerabilities.
        stage('Node.js dependency audit') {
            parallel {
                // Audit frontend package dependencies.
                stage('Frontend npm audit') {
                    steps {
                        dir('frontend') {
                            sh 'npm audit --audit-level=critical'
                        }
                    }
                }
                // Audit API package dependencies.
                stage('API npm audit') {
                    steps {
                        dir('api') {
                            sh 'npm audit --audit-level=critical'
                        }
                    }
                }
            }
        }

        // Scan the complete locked npm dependency graphs without scanning generated bundles.
        stage('OWASP Dependency-Check') {
            steps {
                sh 'mkdir -p "$WORKSPACE/.dependency-check-data" reports/dependency-check'
                // Builds are serialized and this database is workspace-local; clear a stale marker left by an aborted update.
                sh 'rm -f "$WORKSPACE/.dependency-check-data/odc.update.lock"'
                script {
                    // Keep the database persistent for this job without sharing it with other Jenkins jobs.
                    // Version 13.0.0 rejects a missing NVD API key; 12.1.0 supports keyless updates.
                    docker.image('owasp/dependency-check:12.1.0').inside('--entrypoint=""') {
                        withCredentials([string(credentialsId: 'nvd-api-key', variable: 'NVD_API_KEY')]) {
                            // Fail the build only for vulnerabilities at or above this CVSS score.
                            sh '''
                                /usr/share/dependency-check/bin/dependency-check.sh \
                                  --scan frontend/package-lock.json \
                                  --scan api/package-lock.json \
                                  --data "$WORKSPACE/.dependency-check-data" \
                                  --nvdApiKey "$NVD_API_KEY" \
                                  --disableOssIndex \
                                  --format HTML --out reports/dependency-check \
                                  --log reports/dependency-check/dependency-check.log \
                                  --failOnCVSS 9.0
                            '''
                        }
                    }
                }
            }
        }

        // Build frontend and API Docker images tagged with the checked-out commit.
        stage('Build SHA-tagged Docker images') {
            steps {
                script {
                    docker.build("devsecops-portfolio:${env.IMAGE_TAG}", './frontend')
                    docker.build("devsecops-api:${env.IMAGE_TAG}", './api')
                    echo "Built devsecops-portfolio:${env.IMAGE_TAG}"
                    echo "Built devsecops-api:${env.IMAGE_TAG}"
                }
            }
        }

        // Scan exported image archives so Trivy does not need access to the Docker socket.
        stage('Critical image scan — Trivy') {
            steps {
                sh '''
                    mkdir -p "$TRIVY_CACHE_DIR" "$WORKSPACE/.trivy-image-archives"
                    docker save --output "$WORKSPACE/.trivy-image-archives/frontend.tar" \
                      "devsecops-portfolio:${IMAGE_TAG}"
                    docker save --output "$WORKSPACE/.trivy-image-archives/api.tar" \
                      "devsecops-api:${IMAGE_TAG}"
                '''
                script {
                    docker.image('aquasec/trivy:latest').inside(
                        "-v ${env.TRIVY_CACHE_DIR}:/root/.cache/ --entrypoint=\"\""
                    ) {
                        sh 'trivy image --input .trivy-image-archives/frontend.tar --exit-code 1 --severity CRITICAL'
                        sh 'trivy image --input .trivy-image-archives/api.tar --exit-code 1 --severity CRITICAL'
                    }
                }
            }
            post {
                always {
                    sh '''
                        if [ -d "$WORKSPACE/.trivy-image-archives" ]; then
                            rm -f "$WORKSPACE/.trivy-image-archives/frontend.tar" \
                                  "$WORKSPACE/.trivy-image-archives/api.tar"
                            rmdir "$WORKSPACE/.trivy-image-archives"
                        fi
                    '''
                }
            }
        }

        stage('Push images to Harbor') {
            when {
                anyOf {
                    branch 'main'
                    expression { env.GIT_BRANCH == 'origin/main' }
                }
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'harbor-ci-pusher',
                    usernameVariable: 'HARBOR_ROBOT_USER',
                    passwordVariable: 'HARBOR_ROBOT_TOKEN'
                )]) {
                    sh '''
                        set +x
                        printf '%s' "$HARBOR_ROBOT_TOKEN" |
                          docker login "$HARBOR_REGISTRY" \
                            --username "$HARBOR_ROBOT_USER" \
                            --password-stdin
                        trap 'docker logout "$HARBOR_REGISTRY" >/dev/null 2>&1 || true' EXIT

                        docker tag "devsecops-api:${IMAGE_TAG}" \
                          "$HARBOR_REGISTRY/portfolio/devsecops-api:${IMAGE_TAG}"
                        docker push "$HARBOR_REGISTRY/portfolio/devsecops-api:${IMAGE_TAG}"

                        docker tag "devsecops-portfolio:${IMAGE_TAG}" \
                          "$HARBOR_REGISTRY/portfolio/devsecops-portfolio:${IMAGE_TAG}"
                        docker push "$HARBOR_REGISTRY/portfolio/devsecops-portfolio:${IMAGE_TAG}"
                    '''
                }
            }
        }
    }

    post {
        always {
            // Preserve the Dependency-Check report and diagnostic log even when a later stage fails.
            archiveArtifacts artifacts: 'reports/dependency-check/**', allowEmptyArchive: true
        }
    }
}
