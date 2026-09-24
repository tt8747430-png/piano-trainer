import { defineConfig, globalIgnores } from 'eslint/config'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import boundaries from 'eslint-plugin-boundaries'
import globals from 'globals'

// Feature-Sliced Design: a layer imports from its own layer or the layers below it.
const FSD_LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared']
const fsdDependencyRules = FSD_LAYERS.map((from) => ({
  from: { type: from },
  allow: FSD_LAYERS.slice(FSD_LAYERS.indexOf(from)).map((type) => ({ to: { type } })),
}))

export default defineConfig(
  globalIgnores([
    'dist',
    'dev-dist',
    'coverage',
    'node_modules',
    'legacy',
    'public',
    '.superpowers',
    '.agents',
    '.claude',
    '.codex',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      'react-refresh': reactRefresh,
      boundaries,
    },
    settings: {
      'import/resolver': {
        typescript: { project: './tsconfig.json' },
        node: true,
      },
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app' },
        { type: 'pages', pattern: 'src/pages/*' },
        { type: 'widgets', pattern: 'src/widgets/*' },
        { type: 'features', pattern: 'src/features/*' },
        { type: 'entities', pattern: 'src/entities/*' },
        { type: 'shared', pattern: 'src/shared' },
      ],
      'boundaries/ignore': ['**/*.test.{ts,tsx}'],
    },
    rules: {
      'no-empty': ['error', { allowEmptyCatch: true }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/pages/*/**', '@/widgets/*/**', '@/features/*/**', '@/entities/*/**'],
              message:
                'Import another slice through its index.ts (e.g. @/entities/settings), never a deep path. See CLAUDE.md → Architecture.',
            },
          ],
        },
      ],
      'boundaries/dependencies': ['error', { default: 'disallow', rules: fsdDependencyRules }],
    },
  },
  {
    files: [
      'src/app/router.tsx',
      'src/shared/ui/primitives/**/*.{ts,tsx}',
      'src/app/testing/**',
      'src/shared/test/**',
      '**/*.test.{ts,tsx}',
    ],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
)
