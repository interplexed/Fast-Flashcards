import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [vue()],
    //build: {
    //  sourcemap: true // Optional debugging
    //},
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    server: {
      port: 8080,
      proxy: {
        '/api': {
          target: `http://${env.DOCKER_HOST_IP_ADDRESS}:3000`,
          changeOrigin: true
        }
      }
    }
  }
})
