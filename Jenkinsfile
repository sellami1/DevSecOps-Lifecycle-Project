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

        // Scan project dependencies against the cached OWASP vulnerability database.
        stage('OWASP Dependency-Check') {
            steps {
                sh 'mkdir -p "$WORKSPACE/.dependency-check-data" reports/dependency-check'
                script {
                    // Keep the database persistent for this job without sharing it with other Jenkins jobs.
                    docker.image('owasp/dependency-check:latest').inside('--entrypoint=""') {
                        // Fail the build only for vulnerabilities at or above this CVSS score.
                        sh '''
                            /usr/share/dependency-check/bin/dependency-check.sh \
                              --scan frontend --scan api \
                              --data "$WORKSPACE/.dependency-check-data" \
                              --format HTML --out reports/dependency-check \
                              --log reports/dependency-check/dependency-check.log \
                              --failOnCVSS 9.0
                        '''
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

        // Fail the pipeline if either built image contains critical vulnerabilities.
        stage('Critical image scan — Trivy') {
            steps {
                sh 'mkdir -p "$TRIVY_CACHE_DIR"'
                script {
                    // Mount the Docker socket so Trivy can inspect images built by this pipeline.
                    docker.image('aquasec/trivy:latest').inside(
                        "-v /var/run/docker.sock:/var/run/docker.sock -v ${env.TRIVY_CACHE_DIR}:/root/.cache/ --entrypoint=\"\""
                    ) {
                        sh "trivy image --exit-code 1 --severity CRITICAL devsecops-portfolio:${env.IMAGE_TAG}"
                        sh "trivy image --exit-code 1 --severity CRITICAL devsecops-api:${env.IMAGE_TAG}"
                    }
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
