import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5173,
    open: false,
    proxy: {
      // Forwards relative '/api/...' calls (see urlConstant.js) to the
      // backend during local dev, so the client code doesn't need to know
      // whether it's running against localhost or the deployed server.
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});
