import { fileURLToPath } from 'node:url';
import { defineConfig, configDefaults } from 'vitest/config';
import viteConfig from './vite.config.ts';

export default defineConfig(({ mode }) => ({
  ...viteConfig({ mode, command: 'serve' }),
  test: {
    environment: 'jsdom',
    exclude: [
      ...configDefaults.exclude,
      'build/**',
      'dist/**',
      'dist-ssr/**',
      'coverage/**',
      'cypress/**',
      '.vscode/**',
      '.idea/**',
      '.history/**',
      '.worktrees/**'
    ],
    root: fileURLToPath(new URL('./', import.meta.url))
  }
}));
