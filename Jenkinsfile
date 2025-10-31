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
        DOCKER_USER = "sayak03"  // Change this
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
                    url: 'https://github.com/sayak0p3/Home-service-provider.git'  // Change this
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
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
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
                to: 'dassayak2003@gmail.com',  // Change this
                attachmentsPattern: 'trivyfs.txt,trivyimage.txt'
        }
    }
}
