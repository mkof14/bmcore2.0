
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  // Global ignores
  { ignores: ['dist', 'node_modules', 'tests/load.k6.js'] },

  // Base configs
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Config for React source files
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      react: react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      parserOptions: {
        project: 'tsconfig.app.json',
        ecmaFeatures: { jsx: true },
      },
      globals: { ...globals.browser, ...globals.es2021 },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'error',
        { allowConstantExport: true },
      ],
      'react-hooks/exhaustive-deps': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },

  // Config for config files (e.g., Vite, Tailwind)
  {
    files: ['*.{js,ts}', 'scripts/*.mjs'],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },

  // Config for Node.js scripts in `tools`
  {
    files: ['tools/**/*.{js,mjs}'],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },

  // Config for vanilla JS files in `public`
  {
    files: ['public/**/*.js'],
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
        'no-undef': 'warn', // Still might have some specific globals
    }
  },

  // Special config for Service Worker
  {
    files: ['public/sw.js'],
    languageOptions: {
      globals: { ...globals.serviceworker },
    },
  },

  // Config for test files
  {
    files: ['tests/**/*.{ts,mjs,js}'],
    languageOptions: {
      globals: { ...globals.node }, // Or appropriate test environment
    },
  },

  // Prettier config must be last
  prettier,
);
