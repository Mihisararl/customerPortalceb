import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        open: true,
        proxy: {
            '/api': {
                target: 'http://10.128.1.59:6001',
                changeOrigin: true,
                secure: false,
            },
            '/shared-api': {
                target: 'http://10.128.1.227:8080/SharedService',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/shared-api/, ''),
            }
        }
    }
})
