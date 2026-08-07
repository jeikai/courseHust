import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const backendTarget = env.VITE_BASE_URL || 'http://localhost:5500'

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['js-big-decimal'],
    },
    server: {
      // Safety net: any relative "/api" request that isn't sent through the
      // Axios instance (whose baseURL comes from VITE_BASE_URL) still reaches
      // the real backend instead of falling through to the Vite dev server
      // and returning a 404/405 for the current SPA route.
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
