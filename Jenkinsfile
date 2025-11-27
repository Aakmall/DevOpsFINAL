pipeline {
    agent any

    // Pastikan plugin "NodeJS" sudah terinstall di Jenkins dan dikonfigurasi di Global Tool Configuration dengan nama "NodeJS"
    tools {
        nodejs 'NodeJS' 
    }

    environment {
        // Ganti dengan IP server tujuan deployment Anda
        SERVER_IP = '103.191.92.246'
        // Ganti dengan username di server (misal: root atau ubuntu)
        SERVER_USER = 'root'
        // Ganti dengan folder tujuan di server tempat website akan disimpan
        DEPLOY_DIR = '/var/www/aposmart'
        // ID Credential yang Anda buat di Jenkins (lihat panduan LANGKAH_SELANJUTNYA.md)
        SSH_CREDENTIAL_ID = 'vps-ssh-key'
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Mengambil code terbaru dari Branch yang mentrigger build
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install library yang dibutuhkan
                sh 'npm install'
            }
        }

        stage('Build Application') {
            steps {
                // Membuat file .env dari credential Jenkins (Best Practice)
                // Atau Anda bisa hardcode sementara jika untuk belajar (tidak disarankan untuk production)
                // sh 'echo "VITE_SUPABASE_URL=isi_url_disini" > .env'
                // sh 'echo "VITE_SUPABASE_ANON_KEY=isi_key_disini" > .env'
                
                // Proses build menjadi folder 'dist'
                sh 'npm run build'
            }
        }

        stage('Deploy to Server') {
            steps {
                // Menggunakan plugin SSH Agent untuk connect ke server tanpa password manual
                sshagent(credentials: [SSH_CREDENTIAL_ID]) {
                    // 1. Buat folder tujuan jika belum ada
                    sh "ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_IP} 'mkdir -p ${DEPLOY_DIR}'"
                    
                    // 2. Copy file hasil build (folder dist) ke server menggunakan rsync
                    // Flag -avz: Archive mode, Verbose, Compress
                    // --delete: Hapus file di server yang tidak ada di source (agar sinkron)
                    sh "rsync -avz --delete -e 'ssh -o StrictHostKeyChecking=no' dist/ ${SERVER_USER}@${SERVER_IP}:${DEPLOY_DIR}"
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment Berhasil! Website sudah live.'
        }
        failure {
            echo 'Deployment Gagal. Silakan cek logs.'
        }
    }
}
