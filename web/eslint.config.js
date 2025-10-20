/*
 * Qué hace este archivo: configura ESLint para el proyecto React con Vite.
 * Qué debe mirar el estudiante: cómo se combinan configuraciones recomendadas y
 * cómo se definen reglas propias. Es un buen ejemplo de archivo de tooling.
 * Puntos clave (anchors): no hay PASO numerados porque la configuración es declarativa.
 */

import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

const browserGlobals = {
  window: 'readonly',
  document: 'readonly',
  console: 'readonly',
};

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: browserGlobals,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'semi': ['error', 'always'],
    },
  },
]);
