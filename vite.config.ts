import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import VueDevTools from 'vite-plugin-vue-devtools';
import { viteMockServe } from 'vite-plugin-mock';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      vue(),
      vueJsx(),
      VueDevTools(),
      mode !== 'test' &&
        (env.VITE_MOCK_ENABLE === 'on' || env.VITE_APP_MOCK === 'enable') &&
        viteMockServe({ mockPath: 'mock' })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: env.VITE_DEV_SERVER_HOST || '0.0.0.0',
      port: Number(env.VITE_DEV_SERVER_PORT || 5173)
    }
  };
});
