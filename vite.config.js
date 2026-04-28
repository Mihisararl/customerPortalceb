import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const otpDebugLoggerPlugin = () => ({
    name: 'otp-debug-logger',
    configureServer(server) {
        server.middlewares.use('/dev/otp-log', (req, res, next) => {
            if (req.method !== 'POST') {
                next();
                return;
            }

            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });

            req.on('end', () => {
                try {
                    const payload = body ? JSON.parse(body) : {};
                    const logFilePath = path.resolve(process.cwd(), 'otp-debug.log');
                    const logLine = `${new Date().toISOString()} | account=${payload.accountNumber || 'N/A'} | mobile=${payload.mobileNo || 'N/A'} | otp=${payload.otp || 'N/A'}\n`;

                    fs.appendFileSync(logFilePath, logLine, 'utf8');
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ success: true }));
                } catch (error) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ success: false, message: error.message }));
                }
            });
        });
    }
})

export default defineConfig({
    plugins: [react(), otpDebugLoggerPlugin()],
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
            },
            '/customer-details-api': {
                target: 'http://10.128.1.59:5020',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/customer-details-api/, ''),
            }
        }
    }
})
