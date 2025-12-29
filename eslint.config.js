

import vue from 'eslint-plugin-vue';
import typescript from '@typescript-eslint/eslint-plugin';
import vueParser from 'vue-eslint-parser';

export default [
  {
    files: ['src/**/*.{js,ts,vue}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
        parser: '@typescript-eslint/parser'
      }
    },
    plugins: {
      vue,
      '@typescript-eslint': typescript
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-unused-vars': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }]
    }
  }
];
