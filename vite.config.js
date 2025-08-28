/*import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({ 
    plugins: [react()], 
    //server: { port: 5173 } })
    build: {
        outDir: 'dist'
    }
})*/

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        host: true
    },
    preview: {
        port: 4173,
        allowedHosts: ['.onrender.com']   // permite cualquier dominio de Render
    },
    build: {
        outDir: 'dist'
    }
})

