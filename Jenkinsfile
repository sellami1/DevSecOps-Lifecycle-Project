pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    tools {
        nodejs 'NodeJS 22'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                dir('web-cv-nextjs') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Next.js') {
            steps {
                dir('web-cv-nextjs') {
                    sh 'npm run build'
                }
            }
        }
    }
}
