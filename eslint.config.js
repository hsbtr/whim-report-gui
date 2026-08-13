import { globalIgnores } from 'eslint/config';
import pluginCypress from 'eslint-plugin-cypress';
import pluginVue from 'eslint-plugin-vue';
import { withVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import skipFormattingConfig from '@vue/eslint-config-prettier/skip-formatting';

export default withVueTs(
  globalIgnores(['dist/**', 'dist-ssr/**', 'coverage/**', 'cypress/videos/**', 'cypress/screenshots/**']),
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    rules: {
      semi: ['error', 'always'],
      eqeqeq: ['error', 'always'],
      'object-curly-spacing': ['error', 'always'],
      'comma-spacing': ['error', { before: false, after: true }],
      '@typescript-eslint/no-unused-vars': 'warn'
    }
  },
  {
    files: ['cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}', 'cypress/support/**/*.{js,ts,jsx,tsx}'],
    extends: [pluginCypress.configs.recommended]
  },
  skipFormattingConfig
);
