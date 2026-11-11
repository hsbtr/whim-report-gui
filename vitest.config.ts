import { fileURLToPath } from 'node:url';
import { defineConfig, configDefaults } from 'vitest/config';
import viteConfig from './vite.config.ts';

export default defineConfig(({ mode }) => ({
  ...viteConfig({ mode, command: 'serve' }),
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'e2e/**'],
    root: fileURLToPath(new URL('./', import.meta.url))
  }
}));
