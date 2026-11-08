pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        timeout(time: 45, unit: 'MINUTES')
    }

    tools {
        nodejs 'NodeJS 22'
    }

    environment {
        DOCKER_BUILDKIT = '1'
        TRIVY_CACHE_DIR = "${WORKSPACE}/.trivy-cache"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.IMAGE_TAG = sh(
                        script: 'git rev-parse --short=7 HEAD',
                        returnStdout: true
                    ).trim()
                }
            }
        }

        stage('Install dependencies') {
            parallel {
                stage('Frontend dependencies') {
                    steps {
                        dir('frontend') {
                            sh 'npm ci'
                        }
                    }
                }
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

        stage('Automated tests') {
            parallel {
                stage('Frontend tests and lint') {
                    steps {
                        dir('frontend') {
                            sh 'npm test'
                            sh 'npm run lint'
                            sh 'npm run build'
                        }
                    }
                }
                stage('API tests') {
                    steps {
                        dir('api') {
                            sh 'npm test'
                        }
                    }
                }
            }
        }

        stage('Secret scan — Gitleaks') {
            steps {
                script {
                    docker.image('zricethezav/gitleaks:latest').inside('--entrypoint=""') {
                        sh 'gitleaks detect --source=. --exit-code 1'
                    }
                }
            }
        }

        stage('SAST — Semgrep') {
            steps {
                script {
                    docker.image('semgrep/semgrep:latest').inside('--entrypoint=""') {
                        sh '''
                            export HOME="$WORKSPACE"
                            mkdir -p "$HOME/.semgrep"
                            semgrep scan --config p/javascript --config p/nodejs --error frontend api
                        '''
                    }
                }
            }
        }

        stage('Node.js dependency audit') {
            parallel {
                stage('Frontend npm audit') {
                    steps {
                        dir('frontend') {
                            sh 'npm audit --audit-level=critical'
                        }
                    }
                }
                stage('API npm audit') {
                    steps {
                        dir('api') {
                            sh 'npm audit --audit-level=critical'
                        }
                    }
                }
            }
        }

        stage('OWASP Dependency-Check') {
            steps {
                sh 'mkdir -p reports/dependency-check'
                script {
                    docker.image('owasp/dependency-check:latest').inside(
                        '-v dependency-check-data:/usr/share/dependency-check/data --entrypoint=""'
                    ) {
                        sh '''
                            /usr/share/dependency-check/bin/dependency-check.sh \
                              --scan frontend --scan api \
                              --format HTML --out reports/dependency-check \
                              --log reports/dependency-check/dependency-check.log \
                              --failOnCVSS 9.0
                        '''
                    }
                }
            }
        }

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

        stage('Critical image scan — Trivy') {
            steps {
                sh 'mkdir -p "$TRIVY_CACHE_DIR"'
                script {
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
            archiveArtifacts artifacts: 'reports/dependency-check/**', allowEmptyArchive: true
        }
    }
}
