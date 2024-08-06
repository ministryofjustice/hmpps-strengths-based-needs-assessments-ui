// import _import from "eslint-plugin-import";
import noOnlyTests from 'eslint-plugin-no-only-tests'
// import { fixupPluginRules } from '@eslint/compat'
import globals from 'globals'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: ['**/node_modules', '**/public', '**/assets', '**/cypress.json', '**/reporter-config.json', '**/dist/'],
  },
  ...compat.extends(
    // "airbnb-base",
    'plugin:prettier/recommended',
  ),
  {
    plugins: {
      // import: fixupPluginRules(_import),
      'no-only-tests': noOnlyTests,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },

    settings: {
      // "import/parsers": {
      //     "@typescript-eslint/parser": [".ts", ".tsx"],
      // },
      //
      // "import/resolver": {
      //     typescript: {
      //         alwaysTryTypes: true,
      //     },
      //
      //     node: {
      //         extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
      //     },
      // },
    },

    rules: {
      'no-unused-vars': [
        1,
        {
          argsIgnorePattern: 'res|next|^err|_',
          ignoreRestSiblings: true,
        },
      ],

      'no-use-before-define': 0,
      semi: 0,
      // "import/no-unresolved": "error",
      //
      // "import/extensions": ["error", "ignorePackages", {
      //     js: "never",
      //     mjs: "never",
      //     jsx: "never",
      //     ts: "never",
      //     tsx: "never",
      // }],

      'comma-dangle': ['error', 'always-multiline'],

      // "import/no-extraneous-dependencies": ["error", {
      //     devDependencies: [
      //         "**/*.test.js",
      //         "**/*.test.ts",
      //         "**/testutils/**",
      //         "cypress.config.ts",
      //         "esbuild/**/*",
      //     ],
      // }],

      'no-only-tests/no-only-tests': 'error',

      'prettier/prettier': [
        'error',
        {
          trailingComma: 'all',
          singleQuote: true,
          printWidth: 120,
          semi: false,
        },
      ],
    },
  },
  ...compat
    .extends(
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    )
    .map(config => ({
      ...config,
      files: ['**/*.ts'],
      ignores: ['**/*.js'],
    })),
  {
    files: ['**/*.ts'],
    ignores: ['**/*.js'],

    plugins: {
      '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
      parser: tsParser,
    },

    rules: {
      '@typescript-eslint/no-use-before-define': 0,
      'class-methods-use-this': 0,
      'no-useless-constructor': 0,
      'no-continue': 0,
      'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],

      '@typescript-eslint/no-unused-vars': [
        1,
        {
          argsIgnorePattern: 'res|next|^err|_',
          ignoreRestSiblings: true,
        },
      ],

      '@typescript-eslint/semi': 0,
      // "import/no-unresolved": "error",

      'prettier/prettier': [
        'error',
        {
          trailingComma: 'all',
          singleQuote: true,
          printWidth: 120,
          semi: false,
        },
      ],
    },
  },
  {
    files: ['esbuild/**/*'],

    rules: {
      'no-console': 'off',
    },
  },
]
