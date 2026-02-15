import { defineConfig } from 'vite'
import { resolve } from 'path'
import { glob } from 'glob'

// Automatically discover all HTML files in the root directory
const htmlFiles = glob.sync('*.html').reduce((entries, file) => {
    const name = file.replace('.html', '')
    const entryName = name === 'index' ? 'main' : name
    entries[entryName] = resolve(__dirname, file)
    return entries
}, {})

export default defineConfig({
    base: './',
    server: {
        port: 5173,
        open: true
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        minify: 'terser',
        rollupOptions: {
            input: htmlFiles
        }
    }
})
