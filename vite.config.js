import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    server: {
        port: 5173,
        open: true
    },
    build: {
        outDir: 'dist',
        minify: 'terser',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                'aamantran-cards': resolve(__dirname, 'aamantran-cards.html'),
                'lagna-kankotri': resolve(__dirname, 'lagna-kankotri.html'),
                'mundan-cards': resolve(__dirname, 'mundan-cards.html'),
                'custom-design': resolve(__dirname, 'custom-design.html'),
                contact: resolve(__dirname, 'contact.html'),
                'thank-you': resolve(__dirname, 'thank-you.html'),
                'privacy-policy': resolve(__dirname, 'privacy-policy.html'),
                'refund-policy': resolve(__dirname, 'refund-policy.html'),
                'terms-conditions': resolve(__dirname, 'terms-conditions.html'),
            }
        }
    }
})
