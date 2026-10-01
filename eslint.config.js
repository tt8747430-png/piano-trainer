import { defineConfig, globalIgnores } from 'eslint/config'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import boundaries from 'eslint-plugin-boundaries'
import globals from 'globals'

// Feature-Sliced Design: a layer imports from its own layer or the layers below it.
const FSD_LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared']
const SLICED_LAYERS = ['pages', 'widgets', 'features', 'entities']
// The theory kernel, the notation kernel, the accompaniment engine and the exercises sit inside shared,
// fenced tighter: every layer may use them, music imports only itself, notation only music and itself,
// arrangement only music and itself, and exercise music, arrangement (a Performance) and itself.
const KERNEL = ['music', 'notation', 'arrangement', 'exercise']
const fsdDependencyRules = [
  ...FSD_LAYERS.map((from) => ({
    from: { type: from },
    allow: [...FSD_LAYERS.slice(FSD_LAYERS.indexOf(from)), ...KERNEL].map((type) => ({
      to: { type },
    })),
  })),
  { from: { type: 'music' }, allow: [{ to: { type: 'music' } }] },
  { from: { type: 'notation' }, allow: [{ to: { type: 'music' } }, { to: { type: 'notation' } }] },
  {
    from: { type: 'arrangement' },
    allow: [{ to: { type: 'music' } }, { to: { type: 'arrangement' } }],
  },
  {
    from: { type: 'exercise' },
    allow: [
      { to: { type: 'music' } },
      { to: { type: 'arrangement' } },
      { to: { type: 'exercise' } },
    ],
  },
  // Another slice only through its index.ts, whatever the import path (boundaries does not check a
  // slice's imports of its own files). Rules are last-match-wins, so this narrows the ones above.
  {
    disallow: { to: { type: SLICED_LAYERS, internalPath: '!index.ts' } },
    message:
      'Import another slice through its index.ts (e.g. @/entities/settings), never a deep path. See CLAUDE.md → Architecture.',
  },
]

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
    '.impeccable',
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
        // Before shared: the first matching element wins.
        { type: 'music', pattern: 'src/shared/lib/music' },
        { type: 'notation', pattern: 'src/shared/lib/notation' },
        { type: 'arrangement', pattern: 'src/shared/lib/arrangement' },
        { type: 'exercise', pattern: 'src/shared/lib/exercise' },
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
      'boundaries/dependencies': ['error', { default: 'disallow', rules: fsdDependencyRules }],
    },
  },
  {
    // boundaries does not check packages: the kernels import none at all, only their own files.
    files: ['src/shared/lib/{music,notation,arrangement,exercise}/**/*.ts'],
    ignores: ['**/*.test.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^(?!\\.{1,2}/|@/)',
              message:
                'The music kernel, the notation kernel, the arrangement engine and the exercises import no package. See CLAUDE.md → Architecture.',
            },
          ],
        },
      ],
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
