pipeline {
    agent any
    
    tools {
        jdk 'jdk17'
        nodejs 'node18'
    }
    
    environment {
        SCANNER_HOME = tool 'sonar-scanner'
        APP_NAME = "home-service-provider"
        RELEASE = "1.0.0"
        DOCKER_USER = "sayak03"
        DOCKER_PASS = 'dockerhub'
        IMAGE_NAME = "${DOCKER_USER}/${APP_NAME}"
        IMAGE_TAG = "${RELEASE}-${BUILD_NUMBER}"
    }
    
    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout from Git') {
            steps {
                git branch: 'main', 
                    credentialsId: 'github', 
                    url: 'https://github.com/sayak0p3/Home-service-provider.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube-server') {
                    sh '''
                        $SCANNER_HOME/bin/sonar-scanner \
                        -Dsonar.projectName=home-service-provider \
                        -Dsonar.projectKey=home-service-provider
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    waitForQualityGate abortPipeline: false, 
                        credentialsId: 'sonarqube-token'
                }
            }
        }

        // 🧩 Fix version conflicts
        stage('Fix Version Dependencies') {
            steps {
                echo 'Checking and fixing dependency version conflicts...'
                sh '''
                    if grep -q '"react": "19' package.json; then
                        echo "React 19 detected — downgrading to 18.x for compatibility..."
                        npm install react@18.3.1 react-dom@18.3.1 --save
                    else
                        echo "React version is compatible — continuing..."
                    fi
                '''
            }
        }

        // 📦 Install and secure dependencies
        stage('Install Dependencies') {
            steps {
                sh '''
                    echo "Installing dependencies..."
                    npm install --legacy-peer-deps
                    echo "Fixing vulnerable dependencies..."
                    npm audit fix || true
                '''
            }
        }

        stage('Trivy FS Scan') {
            steps {
                sh 'trivy fs . > trivyfs.txt'
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub') {
                        def dockerImage = docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
                        dockerImage.push()
                        dockerImage.push('latest')
                    }
                }
            }
        }

        stage('Trivy Image Scan') {
            steps {
                sh 'trivy image ${IMAGE_NAME}:${IMAGE_TAG} > trivyimage.txt'
            }
        }

        stage('Cleanup Artifacts') {
            steps {
                sh 'docker rmi ${IMAGE_NAME}:${IMAGE_TAG}'
                sh 'docker rmi ${IMAGE_NAME}:latest'
            }
        }

        stage('Trigger CD Pipeline') {
            steps {
                script {
                    sh '''
                        curl -X POST http://localhost:8080/job/home-service-cd/buildWithParameters \
                        --user admin:YOUR_JENKINS_API_TOKEN \
                        --data token=gitops-token \
                        --data IMAGE_TAG=${IMAGE_TAG}
                    '''
                }
            }
        }
    }

    post {
        always {
            emailext attachLog: true,
                subject: "'${currentBuild.result}'",
                body: "Project: ${env.JOB_NAME}<br/>" +
                      "Build Number: ${env.BUILD_NUMBER}<br/>" +
                      "URL: ${env.BUILD_URL}<br/>",
                to: 'dassayak2003@gmail.com',
                attachmentsPattern: 'trivyfs.txt,trivyimage.txt'
        }
    }
}
