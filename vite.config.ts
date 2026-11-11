import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import VueDevTools from 'vite-plugin-vue-devtools';
import { viteMockServe } from 'vite-plugin-mock';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  console.log(env);
  return {
    plugins: [
      vue(),
      vueJsx(),
      VueDevTools(),
      viteMockServe({
        mockPath: 'mock',
        enable: env.VITE_MOCK_ENABLE === 'on',
        watchFiles: true
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: env.VITE_DEV_SERVER_HOST,
      port: Number(env.VITE_DEV_SERVER_PORT)
    }
  }
});
