import { defineConfig } from 'vite'
import { resolve } from 'path'
import { glob } from 'glob'

// Automatically discover all HTML files in the root directory
const htmlFiles = glob.sync('*.html').reduce((entries, file) => {
    // Get filename without extension for the entry name
    const name = file.replace('.html', '')
    // Use 'main' for index.html, otherwise use the filename
    const entryName = name === 'index' ? 'main' : name
    entries[entryName] = resolve(__dirname, file)
    return entries
}, {})

export default defineConfig({
    server: {
        port: 5173,
        open: true
    },
    build: {
        outDir: 'dist',
        minify: 'terser',
        rollupOptions: {
            input: htmlFiles
        }
    }
})
