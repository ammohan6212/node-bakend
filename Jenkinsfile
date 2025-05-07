pipeline {
    agent any

    stages {
        // stage('Clear Workspace') {
        //     steps {
        //         cleanWs()
        //     }
        // }

        stage("Clone the Repository") {
            agent any
            steps {
                script {
                    // Clone the dev branch
                    git branch: 'dev',url: "https://github.com/ammohan6212/node-bakend.git"
                    // git branch: 'dev',credentialsId: 'github-token',url: "https://github.com/ammohan6212/front-end.git"

                    // Fetch all tags
                    sh 'git fetch --tags'

                    // Get the latest tag correctly
                    def VERSION = sh(
                        script: "git describe --tags \$(git rev-list --tags --max-count=1)",
                        returnStdout: true
                    ).trim()
                    
                    // Make version available as environment variable
                    env.VERSION = VERSION
                    
                    echo "VERSION=${env.VERSION}"
                }
            }
        }
        stage('get the current application version'){
            steps{
                script{
                    echo "VERSION=${env.version}"
                }
            }
        }
        stage("install the go modules"){
            agent { label 'security-agent' }
            steps{
                script{
                    sh 'npm install'

                }
            }
        }
        // stage("Linting the Code") {
        //     agent { label 'security-agent' }
        //     steps {
        //         script{
        //             sh '''
        //             npx eslint app.js
        //             '''
        //         }
        //     }
        // }

        // stage("measring the code coverage"){
        //     agent { label 'security-agent' }
        //     steps{
        //         script{
        //             sh 'go test'
        //         }
        //     }
        // }
        // stage("check the dependecy scanning in go "){
        //     steps{
        //         script{
        //             sh '''


        //                 '''
        //         }

        // }
        // stage("Run Unit Tests & Coverage") {
        //     steps {
        //         sh '''

        //         '''
        //     }
        // }
         stage("getting the version in other node"){
            agent { label 'security-agent' }
            steps{
                echo "Using version ${env.VERSION} on node2"
            }
        }     

        stage("trivy and snyk dependency and code test") {
            agent { label 'security-agent' }
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                sh '''
                snyk auth 9d262b22-1f2c-4069-adb9-696793789926
                snyk code test  
                snyk test 
                trivy fs . --vuln-type=library --security-checks=vuln 
                ls -l 
            '''
            }
            }
        }


        stage("sonar-scanner stage"){
            agent { label 'security-agent' }
            steps{
                script{
                    sh """
                    ls -la
                    /opt/sonar-scanner/bin/sonar-scanner"""
                }
            }

        }
        //  stage("SonarQube Quality Gate") {
        //     steps {
        //         script {
        //             waitForQualityGate abortPipeline: true
        //         }
        //     }
        // }



        
       stage("Perform Snyk and Trivy Code Analysis") {
            agent { label 'security-agent' }
            steps {
                script {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                 sh '''
                # Authenticate Snyk
                snyk auth 9d262b22-1f2c-4069-adb9-696793789926

                # Run Snyk Code Analysis (for static code issues)
                snyk code test 

                # Run Trivy for OS & library vulnerabilities
                trivy fs . --vuln-type=library --security-checks=vuln --format json --output trivy-vuln.json

                # Run Trivy for secrets
                trivy fs . --scanners secret --format json --output trivy-secrets.json

                # Run full Trivy FS scan
                trivy fs . --format json --output trivy-fs-report.json
            '''
            }
            }
       }
       }


        stage("perform the build"){
            agent { label 'security-agent' }
            steps{
                script{
                    sh '''
                        mkdir build 
                        cp app.js  build/ || true
                        cd build && zip -r go-artifact.zip .
                    '''
                }
            }
        }

        stage("Docker Build Stage") {
            agent { label 'security-agent' }
            steps {
                script {
                    echo "VERSION=${env.VERSION}"
                    sh """
                    docker build -t node:${env.VERSION} .
                    """
                }
            }
        }
        stage("perform the snyk and trivy image scanning "){
            agent { label 'security-agent' }
            steps{
                script { 
                    sh """
                        ls -l
                        snyk container test node:${env.VERSION}  --file=Dockerfile
                        trivy image node:${env.VERSION}                 
                    """
                }
                
               
            }
        }
        stage("perform the image scanning using the dockle and Grype"){
            agent { label 'security-agent' }
            steps{
                script{
                    sh """
                    dockle node:${env.VERSION}
                    grype node:${env.VERSION} > grype-image-scan.txt
                    """
                }
            }
        }
        stage("tagging docker container") {
            agent { label 'security-agent' }
            steps {
                sh """
                docker tag node:${env.VERSION} mohan14242/node:${env.VERSION}
                """
            }
            
        }
    }
}
