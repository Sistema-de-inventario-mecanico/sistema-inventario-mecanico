import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.VITE_API_TARGET || 'http://127.0.0.1:8000';

  return {
    plugins: [react()],
    server: {
      host: true,
      allowedHosts: true,
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: target,
          changeOrigin: true
        }
      }
    }
  }
})