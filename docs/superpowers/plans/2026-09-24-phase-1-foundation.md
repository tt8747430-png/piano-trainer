# Phase 1 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-file app's repo with a tested, linted, documented React + Vite + TypeScript shell: every
route of the new app as an empty screen, English and Russian, light/dark/system theme, installable offline, checked in
CI and deployable to Vercel, while the legacy app keeps running on GitHub Pages.

**Architecture:** Feature-Sliced Design (`app → pages → widgets → features → entities → shared`) enforced by
`eslint-plugin-boundaries` plus a barrel-only import rule. One saved entity (`settings`: theme + locale) in a
versioned zustand `persist` store over `safeLocalStorage()`. Code-based TanStack Router with lazy screens. i18next with
TypeScript locale modules, Russian typed against English. A boot script in `index.html` paints the saved theme before
first paint; `ThemeProvider` keeps it.

**Tech Stack:** React 19.3, Vite 8, TypeScript 6.0, TanStack Router 1, zustand 5, i18next 26 + react-i18next 17,
Tailwind CSS 4 + shadcn (base-nova on Base UI), lucide-react, vite-plugin-pwa 1, Vitest 4 + jsdom 29 + Testing
Library, ESLint 10 + typescript-eslint 8 + eslint-plugin-boundaries 6, Prettier 3, `@vercel/config`.

**Spec:** `docs/superpowers/specs/2026-09-24-piano-trainer-rewrite-design.md` (Phase 1 of §11). Read §2, §3, §6, §8,
§10 before starting.

## Global Constraints

- Branch: `rewrite-design` (it holds the spec). Commit after every task. Merge to `main` only after CI is green.
- Node **24** (`.nvmrc`), npm. `package.json` `"engines": { "node": "24.x" }`.
- Pinned majors — do **not** take newer majors in this phase: `typescript@~6.0`, `vitest@^4`, `@vitest/coverage-v8@^4`,
  `jsdom@^29`, `@testing-library/jest-dom@^6`, `eslint-plugin-boundaries@^6`. (TypeScript 7, Vitest 5, jsdom 30,
  jest-dom 7 and boundaries 7 exist; bumping any is its own change.) Everything else: latest stable of the major named
  in Tech Stack.
- TypeScript: `strict`, `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`,
  `noFallthroughCasesInSwitch`, `noImplicitOverride`, `verbatimModuleSyntax` (→ `import type`). No `any`.
- Prettier: `semi: false`, `singleQuote: true`, `trailingComma: 'all'`, `printWidth: 100`, `tabWidth: 2`. Format only
  files you touched: `npx prettier --write <files>`.
- Tests colocated as `*.test.ts(x)`; Vitest `globals: false` → import `describe`, `it`, `expect`, `vi` from `vitest`.
- Layers: import from your own layer or below; another slice only through its `index.ts`; `@/` → `src/`.
- **Every interface string in both `en` and `ru`.** No sentence that repeats what a label already says; no how-to text.
- **Tokens only:** components use semantic utilities (`bg-card`, `text-muted-foreground`); no raw colours, no
  `dark:` classes in app code; class variants are lookup maps of complete strings, composed with `cn()`.
- Touch targets at least 44px (`min-h-11` / `size-11`); every control has an accessible name.
- Commit messages: imperative sentence, blank line, body if useful, then the line
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Never stage `.superpowers/`. Never run `npm run format` on the whole repo.

## Review Focus

1. **Storage blocked or failing** (Safari private mode, quota full, site data blocked) → the app still opens and
   choices hold for the session. Pinned by: Task 4 (`safe-storage.test.ts`), Task 5 (store with blocked storage),
   Task 8 (`renderApp` with blocked storage).
2. **Saved settings that are corrupt, from an older version, or hold unknown values** → valid fields kept, the rest
   default, never a crash. Pinned by: Task 5 (`store.test.ts`).
3. **Browser languages we do not speak, an empty list, or regional tags** (`de-DE`, `[]`, `RU`, `ru-RU`) → English,
   or Russian when any preferred language is Russian. Pinned by: Task 5 (`types.test.ts`).
4. **A deep link or reload on a nested route** (`/theory/scales`, `/songs/bz5`) → that screen, not a 404. Pinned by:
   Task 8 (`router.test.tsx`), Task 11 (compiled Vercel rewrite).
5. **The OS switching dark/light while the app is open on "System"** → the app follows; after choosing Light or Dark
   it stops following. Pinned by: Task 7 (`ThemeProvider.test.tsx`).

---

## File map

```
.github/workflows/pages.yml         modify — deploy legacy/index.html only
.github/workflows/ci.yml            create — typecheck, lint, test:cov, build
.gitignore .nvmrc .prettierrc.json .prettierignore
package.json tsconfig.json vite.config.ts eslint.config.js components.json vercel.ts
index.html                          Vite entry + #theme-boot script
legacy/index.html                   moved from ./index.html (unchanged)
public/                             favicon.svg + generated PWA icons
CLAUDE.md README.md
docs/CODE_STYLE.md docs/UBIQUITOUS_LANGUAGE.md docs/adr/0001…0006 docs/agents/{issue-tracker,triage-labels,domain}.md
src/main.tsx src/vite-env.d.ts
src/styles/{index,tokens,theme}.css
src/app/App.tsx router.tsx lazy-screen.ts RootLayout.tsx TheoryLayout.tsx RouteError.tsx
src/app/routes/{home,songs,player,theory}-screens.ts
src/app/providers/{LocaleSync,ThemeProvider,UpdatePrompt,UpdateBanner}.tsx resolve-theme.ts
src/app/testing/render-app.tsx
src/app/{router,RouteError,architecture,theme-boot}.test.ts(x)
src/pages/{path,songs,piece,player,theory-chords,theory-scales,theory-symbols,theory-quiz,settings,not-found}/
src/widgets/{app-nav,theory-nav}/
src/features/set-preference/
src/entities/settings/
src/shared/lib/{cn,safe-storage,store-context}.ts(x) index.ts
src/shared/ui/{ScreenTitle,SectionTitle}.tsx index.ts primitives/button.tsx
src/shared/i18n/index.ts types.ts i18next.d.ts locales/{en,ru}/*.ts
src/shared/test/{setup,match-media,pwa-register-stub}.ts
```

---

### Task 1: Move the legacy app aside and keep it deployed

**Files:**
- Move: `index.html` → `legacy/index.html`
- Modify: `.github/workflows/pages.yml` (whole file)
- Create: `.gitignore`, `.nvmrc`

**Interfaces:**
- Consumes: nothing.
- Produces: `legacy/index.html` (the reading reference, never imported); a Pages workflow that only reacts to
  `legacy/**`.

- [ ] **Step 1: Move the file with history**

```bash
mkdir -p legacy && git mv index.html legacy/index.html
```

- [ ] **Step 2: Replace `.github/workflows/pages.yml`**

```yaml
# Serves the legacy single-file app (legacy/index.html) on GitHub Pages until the
# new app takes production on Vercel (spec §11, Phase 4). Pull requests only run
# the check; pushes to main also deploy.
name: Deploy legacy app to GitHub Pages

on:
  push:
    branches: [main]
    paths: ['legacy/**', '.github/workflows/pages.yml']
  pull_request:
    branches: [main]
    paths: ['legacy/**', '.github/workflows/pages.yml']
  workflow_dispatch:

permissions:
  contents: read

# One deployment at a time and never cancel one mid-flight;
# superseded pull request checks are cancelled.
concurrency:
  group: ${{ github.event_name == 'pull_request' && format('pages-pr-{0}', github.ref) || 'pages' }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}

jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - name: Checkout
        uses: actions/checkout@v7
        with:
          persist-credentials: false

      - name: Check inline scripts for syntax errors
        run: |
          node -e '
            const fs = require("fs");
            const html = fs.readFileSync("legacy/index.html", "utf8");
            const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
            let m, i = 0;
            while ((m = re.exec(html))) fs.writeFileSync(`${process.env.RUNNER_TEMP}/inline-${i++}.js`, m[1]);
            if (!i) { console.error("No inline scripts found in legacy/index.html"); process.exit(1); }
            console.log(`Found ${i} inline script(s)`);
          '
          for f in "$RUNNER_TEMP"/inline-*.js; do node --check "$f"; done

      - name: Stage site files
        run: |
          mkdir _site
          cp legacy/index.html _site/index.html
          echo "Publishing:" && find _site -type f | sort

      - name: Upload Pages artifact
        if: github.event_name != 'pull_request'
        uses: actions/upload-pages-artifact@v5
        with:
          path: _site

  deploy:
    if: github.event_name != 'pull_request'
    needs: build
    runs-on: ubuntu-latest
    timeout-minutes: 10
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

- [ ] **Step 3: Create `.gitignore`**

```gitignore
node_modules
dist
dev-dist
coverage
.vercel
.env*.local
.superpowers/
.DS_Store
*.tsbuildinfo
```

- [ ] **Step 4: Create `.nvmrc`**

```
24
```

- [ ] **Step 5: Run the workflow's check locally**

Run:
```bash
node -e '
  const fs = require("fs"); const os = require("os");
  const html = fs.readFileSync("legacy/index.html", "utf8");
  const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
  let m, i = 0;
  while ((m = re.exec(html))) fs.writeFileSync(`${os.tmpdir()}/pt-inline-${i++}.js`, m[1]);
  console.log(`Found ${i} inline script(s)`);
' && for f in "${TMPDIR:-/tmp}"/pt-inline-*.js; do node --check "$f" && echo "ok $f"; done
```
Expected: `Found 1 inline script(s)` and one `ok` line.

- [ ] **Step 6: Commit**

```bash
git add legacy/index.html .github/workflows/pages.yml .gitignore .nvmrc
git commit -m "Move the legacy app to legacy/ and deploy only it to Pages

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Toolchain — Vite, TypeScript, Vitest, ESLint, Prettier

**Files:**
- Create: `package.json`, `package-lock.json` (by npm), `tsconfig.json`, `vite.config.ts`, `eslint.config.js`,
  `.prettierrc.json`, `.prettierignore`, `index.html`, `src/main.tsx`, `src/app/App.tsx` (temporary shell, replaced
  in Task 8), `src/vite-env.d.ts`, `src/shared/test/setup.ts`, `src/shared/test/match-media.ts`
- Test: `src/shared/test/setup.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: scripts `dev · build · preview · typecheck · lint · test · test:watch · test:cov · format`; the `@` alias;
  `stubMatchMedia({ dark }) → { setDark(next: boolean): void; listenerCount(): number }` in
  `src/shared/test/match-media.ts`; a setup that stubs `matchMedia` as light before each test and cleans up after.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "piano-trainer",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "description": "Piano Trainer: learn songs, chords and scales at the piano. Installable, offline, English and Russian.",
  "engines": {
    "node": "24.x"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:cov": "vitest run --coverage",
    "format": "prettier --write ."
  }
}
```

- [ ] **Step 2: Install the toolchain**

```bash
npm install react@^19.3 react-dom@^19.3
npm install -D vite@^8 @vitejs/plugin-react@^6 typescript@~6.0 @types/react@^19 @types/react-dom@^19 @types/node@^24 \
  vitest@^4 @vitest/coverage-v8@^4 jsdom@^29 @testing-library/react@^16 @testing-library/dom@^10 \
  @testing-library/user-event@^14 @testing-library/jest-dom@^6 \
  eslint@^10 @eslint/js@^10 typescript-eslint@^8 eslint-plugin-boundaries@^6 eslint-plugin-react-hooks@^7 \
  eslint-plugin-react-refresh@^0.5 eslint-import-resolver-typescript@^4 globals@^17 prettier@^3
```
Expected: installs without peer-dependency errors. Check `npx tsc -v` prints `Version 6.0.x` and
`npx vitest --version` prints `4.x`.

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "useDefineForClassFields": true,
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "moduleDetection": "force",
    "jsx": "react-jsx",
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "noEmit": true,
    "skipLibCheck": true,

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "noUncheckedIndexedAccess": true,

    "paths": { "@/*": ["./src/*"] },
    "types": ["vite/client", "node"]
  },
  "include": ["src", "vite.config.ts"]
}
```

- [ ] **Step 4: Create `vite.config.ts`**

```ts
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fromRoot('./src') },
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./src/shared/test/setup.ts'],
    css: false,
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
```

- [ ] **Step 5: Create `.prettierrc.json` and `.prettierignore`**

`.prettierrc.json`:
```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

`.prettierignore`:
```
legacy
dist
dev-dist
coverage
package-lock.json
.superpowers
.agents
.claude
.codex
skills-lock.json
docs/superpowers
public
```

- [ ] **Step 6: Create `eslint.config.js`**

```js
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

export default tseslint.config(
  {
    ignores: [
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
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      'react-hooks': reactHooks,
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
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
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
```
(The layer and barrel rules are proven by `src/app/architecture.test.ts` in Task 8, once real slices exist to import.)

- [ ] **Step 7: Write the failing test `src/shared/test/setup.test.ts`**

```ts
import { describe, expect, it } from 'vitest'

describe('test setup', () => {
  it('installs the jest-dom matchers', () => {
    const paragraph = document.createElement('p')
    document.body.append(paragraph)
    expect(paragraph).toBeInTheDocument()
  })

  it('answers prefers-color-scheme with light until a test says otherwise', () => {
    expect(window.matchMedia('(prefers-color-scheme: dark)').matches).toBe(false)
  })
})
```

- [ ] **Step 8: Run it to verify it fails**

Run: `npx vitest run src/shared/test/setup.test.ts`
Expected: FAIL — the setup file `./src/shared/test/setup.ts` does not exist.

- [ ] **Step 9: Create `src/shared/test/match-media.ts`**

```ts
import { vi } from 'vitest'

/**
 * A controllable `prefers-color-scheme` for jsdom, which has no matchMedia. Every query answers
 * with the same dark flag; `setDark` flips it and notifies listeners, like an OS theme switch.
 */
export function stubMatchMedia({ dark }: { dark: boolean }) {
  const state = { dark }
  const listeners = new Set<() => void>()
  const matchMedia = vi.fn((media: string) => ({
    media,
    get matches() {
      return state.dark
    },
    onchange: null,
    addEventListener: (_type: 'change', listener: () => void) => void listeners.add(listener),
    removeEventListener: (_type: 'change', listener: () => void) => void listeners.delete(listener),
    addListener: (listener: () => void) => void listeners.add(listener),
    removeListener: (listener: () => void) => void listeners.delete(listener),
    dispatchEvent: () => false,
  }))
  vi.stubGlobal('matchMedia', matchMedia)
  return {
    setDark(next: boolean) {
      state.dark = next
      for (const listener of listeners) listener()
    },
    listenerCount: () => listeners.size,
  }
}
```

- [ ] **Step 10: Create `src/shared/test/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import { stubMatchMedia } from './match-media'

beforeEach(() => {
  stubMatchMedia({ dark: false })
})

// `globals: false` means Testing Library cannot register its own cleanup.
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  localStorage.clear()
  delete document.documentElement.dataset.theme
})
```

- [ ] **Step 11: Run the test to verify it passes**

Run: `npx vitest run src/shared/test/setup.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 12: Create the entry files**

`index.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>Piano Trainer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`src/vite-env.d.ts`:
```ts
/// <reference types="vite/client" />
```

`src/app/App.tsx` (temporary; Task 8 replaces it):
```tsx
export function App() {
  return <main>Piano Trainer</main>
}
```

`src/main.tsx`:
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('index.html has no #root element')

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 13: Verify the whole toolchain**

Run: `npm run typecheck && npm run lint && npm run test && npm run build`
Expected: all four succeed; `dist/index.html` exists. Then run
`npx prettier --check package.json tsconfig.json vite.config.ts eslint.config.js index.html src` — expected
"All matched files use Prettier code style!" (fix with `--write` on those paths if not).

- [ ] **Step 14: Commit**

```bash
git add package.json package-lock.json tsconfig.json vite.config.ts eslint.config.js .prettierrc.json .prettierignore index.html src
git commit -m "Scaffold the React, Vite, TypeScript, Vitest and ESLint toolchain

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Tailwind, tokens, `cn()` and shadcn

**Files:**
- Create: `src/styles/index.css`, `src/styles/tokens.css`, `src/styles/theme.css`, `src/shared/lib/cn.ts`,
  `src/shared/lib/index.ts`, `components.json`, `src/shared/ui/primitives/button.tsx` (generated by the shadcn CLI)
- Modify: `vite.config.ts` (add the Tailwind plugin), `src/main.tsx` (import the stylesheet)
- Test: `src/shared/lib/cn.test.ts`, `src/shared/ui/primitives/button.test.tsx`

**Interfaces:**
- Consumes: the toolchain from Task 2.
- Produces: `cn(...inputs: ClassValue[]): string` exported from `@/shared/lib`; `Button` from
  `@/shared/ui/primitives/button` (shadcn, variants `default | outline | secondary | ghost | destructive | link`);
  Tailwind utilities for every semantic token (`bg-background`, `text-foreground`, `bg-card`, `bg-primary`,
  `text-primary-foreground`, `bg-muted`, `text-muted-foreground`, `bg-accent`, `border-border`, `ring-ring`,
  `bg-role-root` … `bg-role-13th`, `text-on-role`); `dark:` bound to `[data-theme=dark]`.

- [ ] **Step 1: Install**

```bash
npm install clsx@^2 tailwind-merge@^3 class-variance-authority@^0.7 lucide-react@^1 @base-ui/react@^1 \
  @fontsource-variable/bricolage-grotesque@^5
npm install -D tailwindcss@^4 @tailwindcss/vite@^4
```

- [ ] **Step 2: Write the failing test `src/shared/lib/cn.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('lets a later utility win over a conflicting earlier one', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('drops falsy inputs and flattens conditionals', () => {
    const active = false
    expect(cn('rounded-lg', active && 'bg-primary', { 'text-muted-foreground': !active }, undefined)).toBe(
      'rounded-lg text-muted-foreground',
    )
  })
})
```

- [ ] **Step 3: Run it to verify it fails**

Run: `npx vitest run src/shared/lib/cn.test.ts`
Expected: FAIL — cannot resolve `./cn`.

- [ ] **Step 4: Create `src/shared/lib/cn.ts` and the barrel**

`src/shared/lib/cn.ts`:
```ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Joins class names and resolves conflicting Tailwind utilities (the later wins). A custom theme
 * name tailwind-merge does not know (a new text size, radius or shadow) must be registered here
 * with `extendTailwindMerge`, with a test, or cn() will drop classes it misfiles.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
```

`src/shared/lib/index.ts`:
```ts
export { cn } from './cn'
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/shared/lib/cn.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 6: Create the stylesheets**

`src/styles/tokens.css`:
```css
/*
 * Two layers (docs/CODE_STYLE.md §5): primitives (--p-*) hold raw values; semantic roles name
 * what a colour is for. Components use roles through Tailwind utilities, never primitives.
 * The values carry the legacy app's palette until Phase 3 chooses the visual direction.
 */
:root {
  --p-slate-50: #eef1f5;
  --p-white: #ffffff;
  --p-ink-900: #161a22;
  --p-gray-600: #525b69;
  --p-gray-200: #d6dce5;
  --p-gray-100: #e3e8ef;
  --p-navy-800: #22314f;
  --p-red-600: #c4322a;
  --p-green-700: #0b7a56;
  --p-blue-600: #2b59c3;
  --p-rose-600: #c22e60;
  --p-steel-500: #5f6b7e;
  --p-ochre-700: #8f6100;
  --p-violet-600: #7445c4;
  --p-teal-700: #0a7493;

  --p-night-990: #0d1016;
  --p-night-950: #11141a;
  --p-night-900: #1a1f28;
  --p-night-800: #252c38;
  --p-night-700: #2c3340;
  --p-mist-100: #e8ecf2;
  --p-mist-400: #a3adbc;
  --p-periwinkle-300: #a9bdff;
  --p-red-400: #ff6a5e;
  --p-green-400: #3ccb97;
  --p-blue-400: #6e95ff;
  --p-rose-400: #ff6f9c;
  --p-steel-300: #a3aec0;
  --p-ochre-300: #f2b632;
  --p-violet-300: #b794ff;
  --p-teal-300: #4cc7ea;

  --radius: 0.75rem;

  --background: var(--p-slate-50);
  --foreground: var(--p-ink-900);
  --card: var(--p-white);
  --card-foreground: var(--p-ink-900);
  --popover: var(--p-white);
  --popover-foreground: var(--p-ink-900);
  --primary: var(--p-navy-800);
  --primary-foreground: var(--p-white);
  --secondary: var(--p-gray-100);
  --secondary-foreground: var(--p-ink-900);
  --muted: var(--p-gray-100);
  --muted-foreground: var(--p-gray-600);
  --accent: var(--p-gray-100);
  --accent-foreground: var(--p-ink-900);
  --destructive: var(--p-red-600);
  --success: var(--p-green-700);
  --border: var(--p-gray-200);
  --input: var(--p-gray-200);
  --ring: var(--p-blue-600);

  /* Chord-tone roles (spec §8): shared by the keyboard, the legend and the chart. */
  --role-root: var(--p-blue-600);
  --role-3rd: var(--p-rose-600);
  --role-5th: var(--p-steel-500);
  --role-7th: var(--p-ochre-700);
  --role-9th: var(--p-green-700);
  --role-11th: var(--p-violet-600);
  --role-13th: var(--p-teal-700);
  --on-role: var(--p-white);
}

[data-theme='dark'] {
  --background: var(--p-night-950);
  --foreground: var(--p-mist-100);
  --card: var(--p-night-900);
  --card-foreground: var(--p-mist-100);
  --popover: var(--p-night-900);
  --popover-foreground: var(--p-mist-100);
  --primary: var(--p-periwinkle-300);
  --primary-foreground: var(--p-night-950);
  --secondary: var(--p-night-800);
  --secondary-foreground: var(--p-mist-100);
  --muted: var(--p-night-800);
  --muted-foreground: var(--p-mist-400);
  --accent: var(--p-night-800);
  --accent-foreground: var(--p-mist-100);
  --destructive: var(--p-red-400);
  --success: var(--p-green-400);
  --border: var(--p-night-700);
  --input: var(--p-night-700);
  --ring: var(--p-blue-400);

  --role-root: var(--p-blue-400);
  --role-3rd: var(--p-rose-400);
  --role-5th: var(--p-steel-300);
  --role-7th: var(--p-ochre-300);
  --role-9th: var(--p-green-400);
  --role-11th: var(--p-violet-300);
  --role-13th: var(--p-teal-300);
  --on-role: var(--p-night-990);
}
```

`src/styles/theme.css`:
```css
/* `dark:` follows the app's theme attribute, not the OS, so shadcn primitives obey the setting. */
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));

@theme inline {
  --font-sans:
    'Bricolage Grotesque Variable', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-success: var(--success);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  --color-role-root: var(--role-root);
  --color-role-3rd: var(--role-3rd);
  --color-role-5th: var(--role-5th);
  --color-role-7th: var(--role-7th);
  --color-role-9th: var(--role-9th);
  --color-role-11th: var(--role-11th);
  --color-role-13th: var(--role-13th);
  --color-on-role: var(--on-role);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

@layer base {
  * {
    border-color: var(--color-border);
  }
  html {
    color-scheme: light;
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }
  html[data-theme='dark'] {
    color-scheme: dark;
  }
  body {
    @apply bg-background font-sans text-foreground antialiased;
    -webkit-tap-highlight-color: transparent;
  }
  :focus-visible {
    outline: 3px solid var(--color-ring);
    outline-offset: 2px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

`src/styles/index.css`:
```css
@import '@fontsource-variable/bricolage-grotesque';

@import 'tailwindcss' source(none);
@source '../../index.html';
@source '../';

@import './tokens.css';
@import './theme.css';
```

- [ ] **Step 7: Wire Tailwind into Vite and the entry**

In `vite.config.ts`, add the import `import tailwindcss from '@tailwindcss/vite'` and change the plugins line to
`plugins: [react(), tailwindcss()],`.

In `src/main.tsx`, add `import './styles/index.css'` as the last import.

- [ ] **Step 8: Create `components.json`**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/shared/ui",
    "ui": "@/shared/ui/primitives",
    "lib": "@/shared/lib",
    "utils": "@/shared/lib/cn",
    "hooks": "@/shared/lib"
  },
  "menuColor": "default",
  "menuAccent": "subtle",
  "registries": {}
}
```

- [ ] **Step 9: Preview, then add the Button primitive with the CLI**

Run: `npx shadcn@latest add button --dry-run`
Expected: it plans `src/shared/ui/primitives/button.tsx` (and may plan CSS or dependency changes).

Run: `npx shadcn@latest add button --yes`
Then run `git diff --stat` and `git status --short`. Expected new file `src/shared/ui/primitives/button.tsx`, which
imports `cn` from `@/shared/lib/cn`. If the CLI edited `src/styles/index.css`: keep any `@import` lines it added
(for example `shadcn/tailwind.css`, `tw-animate-css`), but delete any `:root { … }`, `.dark { … }` or
`@theme inline { … }` blocks it inserted — our tokens live in `tokens.css` / `theme.css` and must stay the only
definitions.

- [ ] **Step 10: Write the failing test `src/shared/ui/primitives/button.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('renders a button painted from the primary role by default', () => {
    render(<Button>Play</Button>)
    expect(screen.getByRole('button', { name: 'Play' }).className).toContain('bg-primary')
  })

  it('takes its look from a variant, not from ad-hoc classes', () => {
    render(<Button variant="ghost">Later</Button>)
    expect(screen.getByRole('button', { name: 'Later' }).className).not.toContain('bg-primary')
  })
})
```

- [ ] **Step 11: Run it**

Run: `npx vitest run src/shared/ui/primitives/button.test.tsx`
Expected: PASS (the primitive was generated in Step 9). If it fails because the import path is wrong, fix
`components.json` aliases, delete the file and re-run Step 9 — do not hand-edit the generated import.

- [ ] **Step 12: Verify the build produces the dark variant and the font**

Run: `npm run build && grep -c "data-theme=dark" dist/assets/*.css && ls dist/assets | grep -c woff2`
Expected: build succeeds; both counts are at least `1`.

- [ ] **Step 13: Full check and commit**

Run: `npm run typecheck && npm run lint && npm run test`
Expected: all pass.

```bash
npx prettier --write src/styles src/shared/lib src/shared/ui vite.config.ts src/main.tsx components.json
git add package.json package-lock.json vite.config.ts components.json src
git commit -m "Add Tailwind tokens for both themes, cn() and the shadcn Button

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Storage that never breaks the app, and store context

**Files:**
- Create: `src/shared/lib/safe-storage.ts`, `src/shared/lib/store-context.tsx`
- Modify: `src/shared/lib/index.ts`
- Test: `src/shared/lib/safe-storage.test.ts`, `src/shared/lib/store-context.test.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces (all from `@/shared/lib`):
  - `safeLocalStorage(): Storage` — `localStorage` guarded so failed reads return `null` and failed writes are lost
    silently; an in-memory storage if `localStorage` cannot be written at all.
  - `createMemoryStorage(): Storage`
  - `createStoreContext<State>(name: string) → { Provider: (props: { store: StoreApi<State>; children: ReactNode }) => JSX.Element; useStoreApi(): StoreApi<State>; useSelector<T>(selector: (state: State) => T): T }`
    — `useStoreApi` outside a provider throws `use<Name>Store must be used inside <<Name>StoreProvider>`.

- [ ] **Step 1: Install zustand**

```bash
npm install zustand@^5
```

- [ ] **Step 2: Write the failing test `src/shared/lib/safe-storage.test.ts`**

```ts
import { describe, expect, it, vi } from 'vitest'
import { createMemoryStorage, safeLocalStorage } from './safe-storage'

const blockWrites = () =>
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('The quota has been exceeded.', 'QuotaExceededError')
  })

describe('safeLocalStorage', () => {
  it('reads and writes the real localStorage when the browser allows it', () => {
    const storage = safeLocalStorage()
    storage.setItem('k', 'v')
    expect(localStorage.getItem('k')).toBe('v')
    expect(storage.getItem('k')).toBe('v')
  })

  it('falls back to memory when localStorage cannot be written at all', () => {
    blockWrites()
    const storage = safeLocalStorage()
    storage.setItem('k', 'v')
    expect(storage.getItem('k')).toBe('v')
  })

  it('loses a write instead of throwing when storage starts failing later', () => {
    const storage = safeLocalStorage()
    blockWrites()
    expect(() => storage.setItem('k', 'v')).not.toThrow()
    expect(storage.getItem('k')).toBeNull()
  })

  it('answers null instead of throwing when a read fails', () => {
    const storage = safeLocalStorage()
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Access denied', 'SecurityError')
    })
    expect(storage.getItem('k')).toBeNull()
  })
})

describe('createMemoryStorage', () => {
  it('behaves like Storage', () => {
    const storage = createMemoryStorage()
    storage.setItem('a', '1')
    storage.setItem('b', '2')
    expect(storage.length).toBe(2)
    expect(storage.key(0)).toBe('a')
    storage.removeItem('a')
    expect(storage.getItem('a')).toBeNull()
    storage.clear()
    expect(storage.length).toBe(0)
  })
})
```

- [ ] **Step 3: Run it to verify it fails**

Run: `npx vitest run src/shared/lib/safe-storage.test.ts`
Expected: FAIL — cannot resolve `./safe-storage`.

- [ ] **Step 4: Implement `src/shared/lib/safe-storage.ts`**

```ts
const PROBE_KEY = '__pt_probe__'

/**
 * localStorage when this browser lets us write to it, otherwise memory (private mode, blocked site
 * data). Either way nothing the app does with it can throw: settings then last for the session.
 */
export function safeLocalStorage(): Storage {
  try {
    const storage = window.localStorage
    storage.setItem(PROBE_KEY, PROBE_KEY)
    storage.removeItem(PROBE_KEY)
    return guarded(storage)
  } catch {
    return createMemoryStorage()
  }
}

export function createMemoryStorage(): Storage {
  const items = new Map<string, string>()
  return {
    get length() {
      return items.size
    },
    clear: () => items.clear(),
    getItem: (key) => items.get(key) ?? null,
    key: (index) => [...items.keys()][index] ?? null,
    removeItem: (key) => {
      items.delete(key)
    },
    setItem: (key, value) => {
      items.set(key, String(value))
    },
  }
}

/** A quota filling up, or access revoked mid-session, loses the write instead of breaking the app. */
function guarded(storage: Storage): Storage {
  return {
    get length() {
      return storage.length
    },
    clear: () => {
      try {
        storage.clear()
      } catch {}
    },
    getItem: (key) => {
      try {
        return storage.getItem(key)
      } catch {
        return null
      }
    },
    key: (index) => {
      try {
        return storage.key(index)
      } catch {
        return null
      }
    },
    removeItem: (key) => {
      try {
        storage.removeItem(key)
      } catch {}
    },
    setItem: (key, value) => {
      try {
        storage.setItem(key, value)
      } catch {}
    },
  }
}
```

- [ ] **Step 5: Run it to verify it passes**

Run: `npx vitest run src/shared/lib/safe-storage.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 6: Write the failing test `src/shared/lib/store-context.test.tsx`**

```tsx
import { act, render, renderHook, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { createStore } from 'zustand/vanilla'
import { createStoreContext } from './store-context'

interface Counter {
  count: number
}

const { Provider, useSelector, useStoreApi } = createStoreContext<Counter>('Counter')

function Count() {
  const count = useSelector((state) => state.count)
  return <output>{count}</output>
}

describe('createStoreContext', () => {
  it('reads the provided store through a selector and re-renders on change', () => {
    const store = createStore<Counter>()(() => ({ count: 1 }))
    render(
      <Provider store={store}>
        <Count />
      </Provider>,
    )
    expect(screen.getByRole('status')).toHaveTextContent('1')
    act(() => store.setState({ count: 2 }))
    expect(screen.getByRole('status')).toHaveTextContent('2')
  })

  it('hands out the store itself for writes', () => {
    const store = createStore<Counter>()(() => ({ count: 0 }))
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useStoreApi(), { wrapper })
    expect(result.current).toBe(store)
  })

  it('names the missing provider when used outside one', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useStoreApi())).toThrow(
      'useCounterStore must be used inside <CounterStoreProvider>',
    )
  })
})
```

- [ ] **Step 7: Run it to verify it fails**

Run: `npx vitest run src/shared/lib/store-context.test.tsx`
Expected: FAIL — cannot resolve `./store-context`.

- [ ] **Step 8: Implement `src/shared/lib/store-context.tsx`**

```tsx
import { createContext, type ReactNode, use } from 'react'
import { type StoreApi, useStore } from 'zustand'

/**
 * A React context for one zustand store, so screens read a store they were handed (tests hand in
 * their own) instead of a module singleton. Reads go through a selector; writes through the store.
 */
export function createStoreContext<State>(name: string) {
  const Context = createContext<StoreApi<State> | null>(null)
  Context.displayName = `${name}StoreContext`

  function Provider({ store, children }: { store: StoreApi<State>; children: ReactNode }) {
    return <Context value={store}>{children}</Context>
  }

  function useStoreApi(): StoreApi<State> {
    const store = use(Context)
    if (!store) throw new Error(`use${name}Store must be used inside <${name}StoreProvider>`)
    return store
  }

  function useSelector<Selected>(selector: (state: State) => Selected): Selected {
    return useStore(useStoreApi(), selector)
  }

  return { Provider, useStoreApi, useSelector }
}
```

- [ ] **Step 9: Export from the barrel**

`src/shared/lib/index.ts`:
```ts
export { cn } from './cn'
export { createMemoryStorage, safeLocalStorage } from './safe-storage'
export { createStoreContext } from './store-context'
```

- [ ] **Step 10: Run the tests and the checks**

Run: `npx vitest run src/shared/lib && npm run typecheck && npm run lint`
Expected: PASS; no type or lint errors.

- [ ] **Step 11: Commit**

```bash
npx prettier --write src/shared/lib
git add package.json package-lock.json src/shared/lib
git commit -m "Add storage that cannot break the app, and a zustand store context

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: The settings entity and the set-preference commands

**Files:**
- Create: `src/entities/settings/model/types.ts`, `src/entities/settings/model/store.ts`,
  `src/entities/settings/model/selectors.ts`, `src/entities/settings/model/context.ts`,
  `src/entities/settings/index.ts`, `src/features/set-preference/set-theme.ts`,
  `src/features/set-preference/set-locale.ts`, `src/features/set-preference/index.ts`
- Test: `src/entities/settings/model/types.test.ts`, `src/entities/settings/model/store.test.ts`,
  `src/features/set-preference/set-preference.test.ts`

**Interfaces:**
- Consumes: `safeLocalStorage`, `createStoreContext`, `createMemoryStorage` from `@/shared/lib`.
- Produces (from `@/entities/settings`):
  - `THEMES = ['system', 'light', 'dark'] as const`, `type Theme`; `LOCALES = ['en', 'ru'] as const`, `type Locale`;
    `interface SettingsState { theme: Theme; locale: Locale }`
  - `isTheme(value: unknown): value is Theme`, `isLocale(value: unknown): value is Locale`
  - `detectLocale(languages: readonly string[] | undefined): Locale`
  - `SETTINGS_STORAGE_KEY = 'pt-settings'`, `SETTINGS_VERSION = 1`, `type SettingsStore = StoreApi<SettingsState>`
  - `createSettingsStore(options?: { storage?: Storage; languages?: readonly string[] }): SettingsStore`
    — saved as `{"state":{"theme":…,"locale":…},"version":1}` under `pt-settings`.
  - `selectTheme(state): Theme`, `selectLocale(state): Locale`
  - `SettingsStoreProvider`, `useSettings(selector)`, `useSettingsStoreApi()`
- Produces (from `@/features/set-preference`): `setTheme(store: SettingsStore, theme: Theme): void`,
  `setLocale(store: SettingsStore, locale: Locale): void`

- [ ] **Step 1: Write the failing test `src/entities/settings/model/types.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { detectLocale, isLocale, isTheme } from './types'

describe('detectLocale', () => {
  it.each([
    [['ru-RU'], 'ru'],
    [['RU'], 'ru'],
    [['de-DE', 'ru'], 'ru'],
    [['en-GB', 'ru'], 'en'],
    [['de-DE'], 'en'],
    [[], 'en'],
    [undefined, 'en'],
  ] as const)('%j → %s', (languages, expected) => {
    expect(detectLocale(languages)).toBe(expected)
  })
})

describe('guards', () => {
  it('recognise only the themes and locales the app has', () => {
    expect(isTheme('dark')).toBe(true)
    expect(isTheme('sepia')).toBe(false)
    expect(isLocale('ru')).toBe(true)
    expect(isLocale('fr')).toBe(false)
    expect(isLocale(undefined)).toBe(false)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/entities/settings/model/types.test.ts`
Expected: FAIL — cannot resolve `./types`.

- [ ] **Step 3: Implement `src/entities/settings/model/types.ts`**

```ts
export const THEMES = ['system', 'light', 'dark'] as const
export type Theme = (typeof THEMES)[number]

export const LOCALES = ['en', 'ru'] as const
export type Locale = (typeof LOCALES)[number]

export interface SettingsState {
  theme: Theme
  locale: Locale
}

export const isTheme = (value: unknown): value is Theme => THEMES.includes(value as Theme)
export const isLocale = (value: unknown): value is Locale => LOCALES.includes(value as Locale)

/** The first of the browser's preferred languages the app speaks decides; English otherwise. */
export function detectLocale(languages: readonly string[] | undefined): Locale {
  for (const tag of languages ?? []) {
    const base = tag.toLowerCase().split('-')[0]
    if (isLocale(base)) return base
  }
  return 'en'
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `npx vitest run src/entities/settings/model/types.test.ts`
Expected: PASS (8 tests).

- [ ] **Step 5: Write the failing test `src/entities/settings/model/store.test.ts`**

```ts
import { describe, expect, it, vi } from 'vitest'
import { createMemoryStorage } from '@/shared/lib'
import { createSettingsStore, SETTINGS_STORAGE_KEY } from './store'

const saved = (storage: Storage, state: unknown, version = 1) =>
  storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ state, version }))

describe('createSettingsStore', () => {
  it('starts on the system theme and the browser language', () => {
    const store = createSettingsStore({ storage: createMemoryStorage(), languages: ['ru-RU'] })
    expect(store.getState()).toEqual({ theme: 'system', locale: 'ru' })
  })

  it('saves under pt-settings with its version', () => {
    const storage = createMemoryStorage()
    const store = createSettingsStore({ storage, languages: ['en'] })
    store.setState({ theme: 'dark' })
    expect(JSON.parse(storage.getItem('pt-settings') ?? 'null')).toEqual({
      state: { theme: 'dark', locale: 'en' },
      version: 1,
    })
  })

  it('restores what was saved', () => {
    const storage = createMemoryStorage()
    saved(storage, { theme: 'light', locale: 'ru' })
    expect(createSettingsStore({ storage, languages: ['en'] }).getState()).toEqual({
      theme: 'light',
      locale: 'ru',
    })
  })

  it('keeps valid saved fields and defaults the ones it does not recognise', () => {
    const storage = createMemoryStorage()
    saved(storage, { theme: 'sepia', locale: 'ru', extra: true })
    expect(createSettingsStore({ storage, languages: ['en'] }).getState()).toEqual({
      theme: 'system',
      locale: 'ru',
    })
  })

  it('starts fresh, without throwing, when the saved JSON is corrupt', () => {
    const storage = createMemoryStorage()
    storage.setItem(SETTINGS_STORAGE_KEY, '{oops')
    expect(createSettingsStore({ storage, languages: ['en'] }).getState()).toEqual({
      theme: 'system',
      locale: 'en',
    })
  })

  it('keeps a theme saved by an older version', () => {
    const storage = createMemoryStorage()
    saved(storage, { theme: 'dark' }, 0)
    expect(createSettingsStore({ storage, languages: ['en'] }).getState().theme).toBe('dark')
  })

  it('works on blocked storage, holding choices for the session', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError')
    })
    const store = createSettingsStore({ languages: ['en'] })
    expect(() => store.setState({ theme: 'dark' })).not.toThrow()
    expect(store.getState().theme).toBe('dark')
  })
})
```

- [ ] **Step 6: Run it to verify it fails**

Run: `npx vitest run src/entities/settings/model/store.test.ts`
Expected: FAIL — cannot resolve `./store`.

- [ ] **Step 7: Implement `src/entities/settings/model/store.ts`**

```ts
import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore, type StoreApi } from 'zustand/vanilla'
import { safeLocalStorage } from '@/shared/lib'
import { detectLocale, isLocale, isTheme, type SettingsState } from './types'

/** Read before first paint by index.html's #theme-boot script: keep the key and shape in step. */
export const SETTINGS_STORAGE_KEY = 'pt-settings'
export const SETTINGS_VERSION = 1

export type SettingsStore = StoreApi<SettingsState>

export function createSettingsStore({
  storage = safeLocalStorage(),
  languages = navigator.languages,
}: { storage?: Storage; languages?: readonly string[] } = {}): SettingsStore {
  const initial: SettingsState = { theme: 'system', locale: detectLocale(languages) }
  return createStore<SettingsState>()(
    persist(() => initial, {
      name: SETTINGS_STORAGE_KEY,
      version: SETTINGS_VERSION,
      storage: createJSONStorage(() => storage),
      // Every earlier shape is sanitised field by field in `merge`, so migrating is passing it on.
      migrate: (persisted) => persisted as SettingsState,
      merge: (persisted, current) => sanitize(persisted, current),
    }),
  )
}

/** Stored JSON is untrusted: keep each field that is still valid, and the current value otherwise. */
function sanitize(persisted: unknown, current: SettingsState): SettingsState {
  const saved = (typeof persisted === 'object' && persisted !== null ? persisted : {}) as Partial<
    Record<keyof SettingsState, unknown>
  >
  return {
    theme: isTheme(saved.theme) ? saved.theme : current.theme,
    locale: isLocale(saved.locale) ? saved.locale : current.locale,
  }
}
```

- [ ] **Step 8: Run it to verify it passes**

Run: `npx vitest run src/entities/settings/model/store.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 9: Create selectors, context and the barrel**

`src/entities/settings/model/selectors.ts`:
```ts
import type { Locale, SettingsState, Theme } from './types'

export const selectTheme = (state: SettingsState): Theme => state.theme
export const selectLocale = (state: SettingsState): Locale => state.locale
```

`src/entities/settings/model/context.ts`:
```ts
import { createStoreContext } from '@/shared/lib'
import type { SettingsState } from './types'

const context = createStoreContext<SettingsState>('Settings')

export const SettingsStoreProvider = context.Provider
export const useSettings = context.useSelector
export const useSettingsStoreApi = context.useStoreApi
```

`src/entities/settings/index.ts`:
```ts
export {
  detectLocale,
  isLocale,
  isTheme,
  LOCALES,
  THEMES,
  type Locale,
  type SettingsState,
  type Theme,
} from './model/types'
export {
  createSettingsStore,
  SETTINGS_STORAGE_KEY,
  SETTINGS_VERSION,
  type SettingsStore,
} from './model/store'
export { selectLocale, selectTheme } from './model/selectors'
export { SettingsStoreProvider, useSettings, useSettingsStoreApi } from './model/context'
```

- [ ] **Step 10: Write the failing test `src/features/set-preference/set-preference.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { createSettingsStore } from '@/entities/settings'
import { createMemoryStorage } from '@/shared/lib'
import { setLocale, setTheme } from './index'

describe('set-preference', () => {
  it('setTheme changes and saves the theme', () => {
    const storage = createMemoryStorage()
    const store = createSettingsStore({ storage, languages: ['en'] })
    setTheme(store, 'dark')
    expect(store.getState().theme).toBe('dark')
    expect(storage.getItem('pt-settings')).toContain('"theme":"dark"')
  })

  it('setLocale changes and saves the language', () => {
    const storage = createMemoryStorage()
    const store = createSettingsStore({ storage, languages: ['en'] })
    setLocale(store, 'ru')
    expect(store.getState().locale).toBe('ru')
    expect(storage.getItem('pt-settings')).toContain('"locale":"ru"')
  })
})
```

- [ ] **Step 11: Run it to verify it fails**

Run: `npx vitest run src/features/set-preference`
Expected: FAIL — cannot resolve `./index`.

- [ ] **Step 12: Implement the commands**

`src/features/set-preference/set-theme.ts`:
```ts
import type { SettingsStore, Theme } from '@/entities/settings'

export function setTheme(store: SettingsStore, theme: Theme): void {
  store.setState({ theme })
}
```

`src/features/set-preference/set-locale.ts`:
```ts
import type { Locale, SettingsStore } from '@/entities/settings'

export function setLocale(store: SettingsStore, locale: Locale): void {
  store.setState({ locale })
}
```

`src/features/set-preference/index.ts`:
```ts
export { setLocale } from './set-locale'
export { setTheme } from './set-theme'
```

- [ ] **Step 13: Run the tests and checks**

Run: `npx vitest run src/entities src/features && npm run typecheck && npm run lint`
Expected: PASS; no errors.

- [ ] **Step 14: Commit**

```bash
npx prettier --write src/entities src/features
git add src/entities src/features
git commit -m "Add the saved settings entity and the theme and language commands

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: English and Russian with i18next

**Files:**
- Create: `src/shared/i18n/types.ts`, `src/shared/i18n/index.ts`, `src/shared/i18n/i18next.d.ts`,
  `src/shared/i18n/locales/en/{common,path,songs,piece,player,theory,quiz,settings,index}.ts`,
  `src/shared/i18n/locales/ru/{common,path,songs,piece,player,theory,quiz,settings,index}.ts`,
  `src/app/providers/LocaleSync.tsx`
- Modify: `src/shared/test/setup.ts`
- Test: `src/shared/i18n/locales.test.ts`, `src/app/providers/LocaleSync.test.tsx`

**Interfaces:**
- Consumes: `useSettings`, `selectLocale`, `SettingsStoreProvider`, `createSettingsStore`, `type Locale` from
  `@/entities/settings`; `setLocale` from `@/features/set-preference`.
- Produces: `i18n` (initialised, synchronous, `en` default) and `NAMESPACES` and `type LocaleResources` from
  `@/shared/i18n`; typed `useTranslation('<namespace>')` keys (listed in Step 3); `LocaleSync` component
  (renders nothing; keeps `i18n.language` and `<html lang>` on the saved locale).

- [ ] **Step 1: Install**

```bash
npm install i18next@^26 react-i18next@^17
```

- [ ] **Step 2: Create the shared type `src/shared/i18n/types.ts`**

```ts
import type { en } from './locales/en'

/** The same keys as English, every leaf a string: a missing or extra Russian key fails tsc. */
export type DeepStrings<T> = {
  readonly [K in keyof T]: T[K] extends string ? string : DeepStrings<T[K]>
}

export type LocaleResources = DeepStrings<typeof en>
```

- [ ] **Step 3: Create the English namespaces**

`src/shared/i18n/locales/en/common.ts`:
```ts
export const common = {
  appName: 'Piano Trainer',
  nav: {
    label: 'Main navigation',
    path: 'Path',
    songs: 'Songs',
    theory: 'Theory',
    settings: 'Settings',
  },
  errors: { title: 'Something went wrong', reload: 'Reload' },
  notFound: { title: 'Page not found', toSongs: 'Go to Songs' },
  update: { available: 'A new version is ready', update: 'Update', later: 'Later' },
} as const
```

`src/shared/i18n/locales/en/path.ts`:
```ts
export const path = { title: 'Path' } as const
```

`src/shared/i18n/locales/en/songs.ts`:
```ts
export const songs = { title: 'Songs' } as const
```

`src/shared/i18n/locales/en/piece.ts`:
```ts
export const piece = { title: 'Piece' } as const
```

`src/shared/i18n/locales/en/player.ts`:
```ts
export const player = { title: 'Player' } as const
```

`src/shared/i18n/locales/en/theory.ts`:
```ts
export const theory = {
  title: 'Theory',
  tabs: {
    label: 'Theory sections',
    chords: 'Chords',
    scales: 'Scales',
    symbols: 'Symbols',
    quiz: 'Quiz',
  },
} as const
```

`src/shared/i18n/locales/en/quiz.ts`:
```ts
export const quiz = { title: 'Quiz' } as const
```

`src/shared/i18n/locales/en/settings.ts`:
```ts
export const settings = {
  title: 'Settings',
  language: { label: 'Language', en: 'English', ru: 'Русский' },
  theme: { label: 'Theme', system: 'System', light: 'Light', dark: 'Dark' },
} as const
```

`src/shared/i18n/locales/en/index.ts`:
```ts
import { common } from './common'
import { path } from './path'
import { piece } from './piece'
import { player } from './player'
import { quiz } from './quiz'
import { settings } from './settings'
import { songs } from './songs'
import { theory } from './theory'

export const en = { common, path, songs, piece, player, theory, quiz, settings } as const
```

- [ ] **Step 4: Create the Russian namespaces**

`src/shared/i18n/locales/ru/common.ts`:
```ts
import type { LocaleResources } from '../../types'

export const common: LocaleResources['common'] = {
  appName: 'Тренажёр фортепиано',
  nav: {
    label: 'Основная навигация',
    path: 'Путь',
    songs: 'Песни',
    theory: 'Теория',
    settings: 'Настройки',
  },
  errors: { title: 'Что-то пошло не так', reload: 'Перезагрузить' },
  notFound: { title: 'Страница не найдена', toSongs: 'К песням' },
  update: { available: 'Готова новая версия', update: 'Обновить', later: 'Позже' },
}
```

`src/shared/i18n/locales/ru/path.ts`:
```ts
import type { LocaleResources } from '../../types'

export const path: LocaleResources['path'] = { title: 'Путь' }
```

`src/shared/i18n/locales/ru/songs.ts`:
```ts
import type { LocaleResources } from '../../types'

export const songs: LocaleResources['songs'] = { title: 'Песни' }
```

`src/shared/i18n/locales/ru/piece.ts`:
```ts
import type { LocaleResources } from '../../types'

export const piece: LocaleResources['piece'] = { title: 'Произведение' }
```

`src/shared/i18n/locales/ru/player.ts`:
```ts
import type { LocaleResources } from '../../types'

export const player: LocaleResources['player'] = { title: 'Практика' }
```

`src/shared/i18n/locales/ru/theory.ts`:
```ts
import type { LocaleResources } from '../../types'

export const theory: LocaleResources['theory'] = {
  title: 'Теория',
  tabs: {
    label: 'Разделы теории',
    chords: 'Аккорды',
    scales: 'Гаммы',
    symbols: 'Обозначения',
    quiz: 'Тест',
  },
}
```

`src/shared/i18n/locales/ru/quiz.ts`:
```ts
import type { LocaleResources } from '../../types'

export const quiz: LocaleResources['quiz'] = { title: 'Тест' }
```

`src/shared/i18n/locales/ru/settings.ts`:
```ts
import type { LocaleResources } from '../../types'

export const settings: LocaleResources['settings'] = {
  title: 'Настройки',
  language: { label: 'Язык', en: 'English', ru: 'Русский' },
  theme: { label: 'Тема', system: 'Как в системе', light: 'Светлая', dark: 'Тёмная' },
}
```

`src/shared/i18n/locales/ru/index.ts`:
```ts
import type { LocaleResources } from '../../types'
import { common } from './common'
import { path } from './path'
import { piece } from './piece'
import { player } from './player'
import { quiz } from './quiz'
import { settings } from './settings'
import { songs } from './songs'
import { theory } from './theory'

export const ru: LocaleResources = { common, path, songs, piece, player, theory, quiz, settings }
```

- [ ] **Step 5: Write the failing test `src/shared/i18n/locales.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { en } from './locales/en'
import { ru } from './locales/ru'

type Tree = { readonly [key: string]: string | Tree }

function leaves(tree: Tree, prefix = ''): [key: string, text: string][] {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === 'string'
      ? [[`${prefix}${key}`, value] as [string, string]]
      : leaves(value, `${prefix}${key}.`),
  )
}

describe('locales', () => {
  it('give Russian exactly the keys English has', () => {
    const keys = (tree: Tree) => leaves(tree).map(([key]) => key).sort()
    expect(keys(ru)).toEqual(keys(en))
  })

  it('leave no string empty in either language', () => {
    for (const [key, text] of [...leaves(en), ...leaves(ru)]) expect(text.trim(), key).not.toBe('')
  })
})
```

- [ ] **Step 6: Run it to verify it passes the parity it describes**

Run: `npx vitest run src/shared/i18n/locales.test.ts`
Expected: PASS (2 tests). Then prove the type guard works: temporarily delete `later: 'Позже'` from
`ru/common.ts`, run `npm run typecheck` — expected: an error in `ru/common.ts` naming the missing `later` property.
Restore the line.

- [ ] **Step 7: Create the i18n instance and its typing**

`src/shared/i18n/index.ts`:
```ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en } from './locales/en'
import { ru } from './locales/ru'

export const NAMESPACES = [
  'common',
  'path',
  'songs',
  'piece',
  'player',
  'theory',
  'quiz',
  'settings',
] as const

// Resources are bundled, so initialisation is synchronous: the first render already has text.
void i18n.use(initReactI18next).init({
  resources: { en, ru },
  lng: 'en',
  fallbackLng: 'en',
  ns: [...NAMESPACES],
  defaultNS: 'common',
  interpolation: { escapeValue: false },
  initAsync: false,
})

export { i18n }
export type { LocaleResources } from './types'
```

`src/shared/i18n/i18next.d.ts`:
```ts
import type { en } from './locales/en'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: typeof en
  }
}
```

- [ ] **Step 8: Initialise i18n in every test and reset the language after each**

Replace `src/shared/test/setup.ts` with:
```ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import { i18n } from '@/shared/i18n'
import { stubMatchMedia } from './match-media'

beforeEach(() => {
  stubMatchMedia({ dark: false })
})

// `globals: false` means Testing Library cannot register its own cleanup.
afterEach(async () => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  localStorage.clear()
  delete document.documentElement.dataset.theme
  document.documentElement.lang = 'en'
  await i18n.changeLanguage('en')
})
```

- [ ] **Step 9: Write the failing test `src/app/providers/LocaleSync.test.tsx`**

```tsx
import { act, render, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createSettingsStore, type Locale, SettingsStoreProvider } from '@/entities/settings'
import { setLocale } from '@/features/set-preference'
import { i18n } from '@/shared/i18n'
import { createMemoryStorage } from '@/shared/lib'
import { LocaleSync } from './LocaleSync'

function renderWith(locale: Locale) {
  const store = createSettingsStore({ storage: createMemoryStorage(), languages: [locale] })
  render(
    <SettingsStoreProvider store={store}>
      <LocaleSync />
    </SettingsStoreProvider>,
  )
  return store
}

describe('LocaleSync', () => {
  it('puts i18next and <html lang> on the saved language', async () => {
    renderWith('ru')
    await waitFor(() => expect(i18n.language).toBe('ru'))
    expect(document.documentElement.lang).toBe('ru')
  })

  it('follows a change of language', async () => {
    const store = renderWith('en')
    act(() => setLocale(store, 'ru'))
    await waitFor(() => expect(i18n.language).toBe('ru'))
    expect(document.documentElement.lang).toBe('ru')
  })
})
```

- [ ] **Step 10: Run it to verify it fails**

Run: `npx vitest run src/app/providers/LocaleSync.test.tsx`
Expected: FAIL — cannot resolve `./LocaleSync`.

- [ ] **Step 11: Implement `src/app/providers/LocaleSync.tsx`**

```tsx
import { useLayoutEffect } from 'react'
import { selectLocale, useSettings } from '@/entities/settings'
import { i18n } from '@/shared/i18n'

/** Keeps i18next and <html lang> on the learner's saved language. Renders nothing. */
export function LocaleSync() {
  const locale = useSettings(selectLocale)

  useLayoutEffect(() => {
    void i18n.changeLanguage(locale)
    document.documentElement.lang = locale
  }, [locale])

  return null
}
```

- [ ] **Step 12: Run the tests and checks**

Run: `npx vitest run src/shared/i18n src/app && npm run typecheck && npm run lint`
Expected: PASS; no errors.

- [ ] **Step 13: Commit**

```bash
npx prettier --write src/shared/i18n src/app src/shared/test
git add package.json package-lock.json src/shared/i18n src/app src/shared/test
git commit -m "Add English and Russian, with Russian typed against English

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Theme — painted before first paint, kept by ThemeProvider

**Files:**
- Modify: `index.html` (add the `#theme-boot` script and `theme-color`)
- Create: `src/app/providers/resolve-theme.ts`, `src/app/providers/ThemeProvider.tsx`
- Test: `src/app/providers/resolve-theme.test.ts`, `src/app/providers/ThemeProvider.test.tsx`,
  `src/app/theme-boot.test.ts`

**Interfaces:**
- Consumes: `createSettingsStore`, `SettingsStoreProvider`, `useSettings`, `selectTheme`, `type Theme` from
  `@/entities/settings`; `setTheme` from `@/features/set-preference`; `stubMatchMedia` from
  `src/shared/test/match-media.ts`.
- Produces: `resolveTheme(theme: Theme, prefersDark: boolean): 'light' | 'dark'`;
  `ThemeProvider({ children })` — sets `document.documentElement.dataset.theme`; follows the OS only while the
  theme is `system`. `index.html` `<script id="theme-boot">` does the same before React loads.

- [ ] **Step 1: Write the failing test `src/app/providers/resolve-theme.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { resolveTheme } from './resolve-theme'

describe('resolveTheme', () => {
  it.each([
    ['light', false, 'light'],
    ['light', true, 'light'],
    ['dark', false, 'dark'],
    ['system', false, 'light'],
    ['system', true, 'dark'],
  ] as const)('%s with a dark OS = %s → %s', (theme, prefersDark, expected) => {
    expect(resolveTheme(theme, prefersDark)).toBe(expected)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/app/providers/resolve-theme.test.ts`
Expected: FAIL — cannot resolve `./resolve-theme`.

- [ ] **Step 3: Implement `src/app/providers/resolve-theme.ts`**

```ts
import type { Theme } from '@/entities/settings'

export const DARK_QUERY = '(prefers-color-scheme: dark)'

/** Mirrored by index.html's #theme-boot script; src/app/theme-boot.test.ts holds the two together. */
export function resolveTheme(theme: Theme, prefersDark: boolean): 'light' | 'dark' {
  if (theme !== 'system') return theme
  return prefersDark ? 'dark' : 'light'
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `npx vitest run src/app/providers/resolve-theme.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Write the failing test `src/app/providers/ThemeProvider.test.tsx`**

```tsx
import { act, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createSettingsStore, SettingsStoreProvider, type Theme } from '@/entities/settings'
import { setTheme } from '@/features/set-preference'
import { createMemoryStorage } from '@/shared/lib'
import { stubMatchMedia } from '@/shared/test/match-media'
import { ThemeProvider } from './ThemeProvider'

function renderWith(theme: Theme, { osDark = false } = {}) {
  const media = stubMatchMedia({ dark: osDark })
  const store = createSettingsStore({ storage: createMemoryStorage(), languages: ['en'] })
  setTheme(store, theme)
  render(
    <SettingsStoreProvider store={store}>
      <ThemeProvider>
        <p>app</p>
      </ThemeProvider>
    </SettingsStoreProvider>,
  )
  return { media, store }
}

const painted = () => document.documentElement.dataset.theme

describe('ThemeProvider', () => {
  it('renders its children', () => {
    renderWith('light')
    expect(screen.getByText('app')).toBeInTheDocument()
  })

  it('paints a chosen theme whatever the OS says', () => {
    renderWith('dark', { osDark: false })
    expect(painted()).toBe('dark')
  })

  it('paints the OS scheme on system', () => {
    renderWith('system', { osDark: true })
    expect(painted()).toBe('dark')
  })

  it('follows the OS while on system', () => {
    const { media } = renderWith('system', { osDark: false })
    act(() => media.setDark(true))
    expect(painted()).toBe('dark')
    act(() => media.setDark(false))
    expect(painted()).toBe('light')
  })

  it('stops following the OS once a theme is chosen', () => {
    const { media, store } = renderWith('system', { osDark: false })
    act(() => setTheme(store, 'light'))
    act(() => media.setDark(true))
    expect(painted()).toBe('light')
    expect(media.listenerCount()).toBe(0)
  })
})
```

- [ ] **Step 6: Run it to verify it fails**

Run: `npx vitest run src/app/providers/ThemeProvider.test.tsx`
Expected: FAIL — cannot resolve `./ThemeProvider`.

- [ ] **Step 7: Implement `src/app/providers/ThemeProvider.tsx`**

```tsx
import { type ReactNode, useLayoutEffect } from 'react'
import { selectTheme, useSettings } from '@/entities/settings'
import { DARK_QUERY, resolveTheme } from './resolve-theme'

/** Keeps `data-theme` on the saved theme; on "system" it follows the OS for as long as it stays so. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSettings(selectTheme)

  useLayoutEffect(() => {
    const media = window.matchMedia(DARK_QUERY)
    const paint = () => {
      document.documentElement.dataset.theme = resolveTheme(theme, media.matches)
    }
    paint()
    if (theme !== 'system') return
    media.addEventListener('change', paint)
    return () => media.removeEventListener('change', paint)
  }, [theme])

  return children
}
```

- [ ] **Step 8: Run it to verify it passes**

Run: `npx vitest run src/app/providers/ThemeProvider.test.tsx`
Expected: PASS (5 tests).

- [ ] **Step 9: Write the failing test `src/app/theme-boot.test.ts`**

```ts
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { createSettingsStore, SETTINGS_STORAGE_KEY } from '@/entities/settings'
import { setTheme } from '@/features/set-preference'
import { stubMatchMedia } from '@/shared/test/match-media'

const html = readFileSync('index.html', 'utf8')
const boot = html.match(/<script id="theme-boot">([\s\S]*?)<\/script>/)?.[1]

/** Runs index.html's boot script as the browser would, before any module loads. */
function runBoot() {
  if (!boot) throw new Error('index.html has no <script id="theme-boot">')
  new Function(boot)()
  return document.documentElement.dataset.theme
}

describe('the #theme-boot script in index.html', () => {
  it('paints the theme the settings store saved', () => {
    stubMatchMedia({ dark: false })
    setTheme(createSettingsStore({ languages: ['en'] }), 'dark')
    expect(runBoot()).toBe('dark')
  })

  it('asks the OS when the saved theme is system', () => {
    stubMatchMedia({ dark: true })
    setTheme(createSettingsStore({ languages: ['en'] }), 'system')
    expect(runBoot()).toBe('dark')
  })

  it('asks the OS when nothing is saved', () => {
    stubMatchMedia({ dark: true })
    expect(runBoot()).toBe('dark')
  })

  it('asks the OS when the saved JSON is corrupt', () => {
    stubMatchMedia({ dark: false })
    localStorage.setItem(SETTINGS_STORAGE_KEY, '{oops')
    expect(runBoot()).toBe('light')
  })
})
```

- [ ] **Step 10: Run it to verify it fails**

Run: `npx vitest run src/app/theme-boot.test.ts`
Expected: FAIL — `index.html has no <script id="theme-boot">`.

- [ ] **Step 11: Add the boot script to `index.html`**

Replace `index.html` with:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#22314f" />
    <title>Piano Trainer</title>
    <script id="theme-boot">
      ;(function () {
        // Paint the saved theme before first paint, so a dark-mode learner never sees a white
        // flash. Mirrors resolveTheme (src/app/providers/resolve-theme.ts) and reads what
        // createSettingsStore saves under 'pt-settings'; src/app/theme-boot.test.ts holds them.
        var theme = 'system'
        try {
          var saved = JSON.parse(localStorage.getItem('pt-settings') || 'null')
          var chosen = saved && saved.state && saved.state.theme
          if (chosen === 'light' || chosen === 'dark') theme = chosen
        } catch (_) {}
        if (theme === 'system') {
          try {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          } catch (_) {
            theme = 'light'
          }
        }
        document.documentElement.dataset.theme = theme
      })()
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 12: Run the tests and checks**

Run: `npx vitest run src/app && npm run typecheck && npm run lint && npm run build`
Expected: PASS; build succeeds and `dist/index.html` still contains `id="theme-boot"`
(`grep -c theme-boot dist/index.html` → `1`).

- [ ] **Step 13: Commit**

```bash
npx prettier --write index.html src/app
git add index.html src/app
git commit -m "Paint the saved theme before first paint and keep it in ThemeProvider

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Routes, empty screens, navigation, not-found and error screens

**Files:**
- Create: `src/shared/ui/ScreenTitle.tsx`, `src/shared/ui/SectionTitle.tsx`, `src/shared/ui/index.ts`
- Create pages (each `ui/<Name>Page.tsx` + `index.ts`): `src/pages/path`, `src/pages/songs`, `src/pages/piece`,
  `src/pages/player`, `src/pages/theory-chords`, `src/pages/theory-scales`, `src/pages/theory-symbols`,
  `src/pages/theory-quiz`, `src/pages/settings`, `src/pages/not-found`
- Create widgets: `src/widgets/app-nav/ui/AppNav.tsx`, `src/widgets/app-nav/index.ts`,
  `src/widgets/theory-nav/ui/TheoryNav.tsx`, `src/widgets/theory-nav/index.ts`
- Create app: `src/app/lazy-screen.ts`, `src/app/router.tsx`, `src/app/RootLayout.tsx`, `src/app/TheoryLayout.tsx`,
  `src/app/RouteError.tsx`, `src/app/routes/home-screens.ts`, `src/app/routes/songs-screens.ts`,
  `src/app/routes/player-screens.ts`, `src/app/routes/theory-screens.ts`, `src/app/testing/render-app.tsx`
- Modify: `src/app/App.tsx` (replace the Task 2 shell), `src/main.tsx`
- Test: `src/app/router.test.tsx`, `src/app/RouteError.test.tsx`, `src/app/architecture.test.ts`

**Interfaces:**
- Consumes: everything from Tasks 3–7.
- Produces:
  - `createAppRouter(history?: RouterHistory)`, `type AppRouter = ReturnType<typeof createAppRouter>` from
    `src/app/router.tsx`; route ids `/`, `/songs`, `/songs/$pieceId`, `/play/$pieceId`, `/theory/chords`,
    `/theory/scales`, `/theory/symbols`, `/theory/quiz`, `/settings`; `/theory` redirects to `/theory/chords`.
  - `App({ settingsStore, router })` — the provider stack.
  - `renderApp(path, { locale?, storage? }) → RenderResult & { router, settingsStore }` from
    `src/app/testing/render-app.tsx` — whole-app tests.
  - `RouteError({ reload? })` — the router's default error screen.
  - `ScreenTitle`, `SectionTitle` from `@/shared/ui`; `AppNav` from `@/widgets/app-nav`; `TheoryNav` from
    `@/widgets/theory-nav`; one `<Name>Page` from each page slice.

- [ ] **Step 1: Install the router**

```bash
npm install @tanstack/react-router@^1
```

- [ ] **Step 2: Write the failing test `src/app/router.test.tsx`**

```tsx
import { createMemoryHistory } from '@tanstack/react-router'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { safeLocalStorage } from '@/shared/lib'
import { createAppRouter } from './router'
import { renderApp } from './testing/render-app'

const ROUTES = [
  ['/', '/'],
  ['/songs', '/songs'],
  ['/songs/bz5', '/songs/$pieceId'],
  ['/play/bz5', '/play/$pieceId'],
  ['/theory/chords', '/theory/chords'],
  ['/theory/scales', '/theory/scales'],
  ['/theory/symbols', '/theory/symbols'],
  ['/theory/quiz', '/theory/quiz'],
  ['/settings', '/settings'],
] as const

async function open(path: string) {
  const router = createAppRouter(createMemoryHistory({ initialEntries: [path] }))
  await router.load()
  return router
}

describe('routes', () => {
  it.each(ROUTES)('%s opens %s', async (path, routeId) => {
    const router = await open(path)
    expect(router.state.matches.at(-1)?.routeId).toBe(routeId)
  })

  it('sends /theory to Chords', async () => {
    const router = await open('/theory')
    expect(router.state.location.pathname).toBe('/theory/chords')
  })

  it('keeps every screen a lazy route component, so it loads on demand', async () => {
    // The route tree is module state and a loaded lazy component drops `preload`: only a fresh
    // module shows screens nothing has loaded yet.
    vi.resetModules()
    const fresh = await import('./router')
    const router = fresh.createAppRouter(createMemoryHistory())
    for (const path of ['/', '/songs', '/songs/$pieceId', '/play/$pieceId', '/settings'] as const) {
      const component = router.routesByPath[path].options.component as { preload?: unknown }
      expect(component.preload, path).toBeTypeOf('function')
    }
  })
})

describe('the app shell', () => {
  it('shows the Path screen at /', async () => {
    renderApp('/')
    expect(await screen.findByRole('heading', { level: 1, name: 'Path' })).toBeInTheDocument()
  })

  it('offers Path, Songs and Theory in the main navigation, marking the current one', async () => {
    renderApp('/songs')
    const nav = await screen.findByRole('navigation', { name: 'Main navigation' })
    const links = within(nav).getAllByRole('link')
    expect(links.map((link) => link.textContent)).toEqual(['Path', 'Songs', 'Theory'])
    expect(within(nav).getByRole('link', { name: 'Songs' })).toHaveAttribute('aria-current', 'page')
  })

  it('marks Theory current on every Theory section', async () => {
    renderApp('/theory/quiz')
    const nav = await screen.findByRole('navigation', { name: 'Main navigation' })
    expect(within(nav).getByRole('link', { name: 'Theory' })).toHaveAttribute('aria-current', 'page')
  })

  it('opens a deep link to a Theory section with its tab selected', async () => {
    renderApp('/theory/scales')
    expect(await screen.findByRole('heading', { level: 2, name: 'Scales' })).toBeInTheDocument()
    const tabs = screen.getByRole('navigation', { name: 'Theory sections' })
    expect(within(tabs).getByRole('link', { name: 'Scales' })).toHaveAttribute('aria-current', 'page')
  })

  it('reaches Settings from the Path screen', async () => {
    const user = userEvent.setup()
    renderApp('/')
    await user.click(await screen.findByRole('link', { name: 'Settings' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Settings' })).toBeInTheDocument()
  })

  it('shows a not-found screen for an unknown address', async () => {
    renderApp('/nowhere')
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Go to Songs' })).toHaveAttribute('href', '/songs')
  })

  it('speaks Russian when the learner chose it', async () => {
    renderApp('/', { locale: 'ru' })
    expect(await screen.findByRole('heading', { level: 1, name: 'Путь' })).toBeInTheDocument()
  })

  it('still opens when the browser blocks storage', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError')
    })
    renderApp('/', { storage: safeLocalStorage() })
    expect(await screen.findByRole('heading', { level: 1, name: 'Path' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run it to verify it fails**

Run: `npx vitest run src/app/router.test.tsx`
Expected: FAIL — cannot resolve `./router` / `./testing/render-app`.

- [ ] **Step 4: Create the shared titles**

`src/shared/ui/ScreenTitle.tsx`:
```tsx
import type { ReactNode } from 'react'

export function ScreenTitle({ children }: { children: ReactNode }) {
  return <h1 className="mb-4 text-2xl font-extrabold tracking-tight text-balance">{children}</h1>
}
```

`src/shared/ui/SectionTitle.tsx`:
```tsx
import type { ReactNode } from 'react'

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-3 text-lg font-semibold text-balance">{children}</h2>
}
```

`src/shared/ui/index.ts`:
```ts
export { ScreenTitle } from './ScreenTitle'
export { SectionTitle } from './SectionTitle'
```

- [ ] **Step 5: Create the pages**

`src/pages/path/ui/PathPage.tsx`:
```tsx
import { Link } from '@tanstack/react-router'
import { Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ScreenTitle } from '@/shared/ui'

export function PathPage() {
  const { t } = useTranslation('path')
  const { t: tCommon } = useTranslation('common')
  return (
    <div className="flex items-start justify-between gap-2">
      <ScreenTitle>{t('title')}</ScreenTitle>
      <Link
        to="/settings"
        aria-label={tCommon('nav.settings')}
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <Settings aria-hidden className="size-5" />
      </Link>
    </div>
  )
}
```

`src/pages/path/index.ts`:
```ts
export { PathPage } from './ui/PathPage'
```

`src/pages/songs/ui/SongsPage.tsx`:
```tsx
import { useTranslation } from 'react-i18next'
import { ScreenTitle } from '@/shared/ui'

export function SongsPage() {
  const { t } = useTranslation('songs')
  return <ScreenTitle>{t('title')}</ScreenTitle>
}
```

`src/pages/songs/index.ts`:
```ts
export { SongsPage } from './ui/SongsPage'
```

`src/pages/piece/ui/PiecePage.tsx`:
```tsx
import { useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ScreenTitle } from '@/shared/ui'

export function PiecePage() {
  const { t } = useTranslation('piece')
  const { pieceId } = useParams({ strict: false })
  return (
    <>
      <ScreenTitle>{t('title')}</ScreenTitle>
      <p className="text-muted-foreground">{pieceId}</p>
    </>
  )
}
```

`src/pages/piece/index.ts`:
```ts
export { PiecePage } from './ui/PiecePage'
```

`src/pages/player/ui/PlayerPage.tsx`:
```tsx
import { useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ScreenTitle } from '@/shared/ui'

export function PlayerPage() {
  const { t } = useTranslation('player')
  const { pieceId } = useParams({ strict: false })
  return (
    <>
      <ScreenTitle>{t('title')}</ScreenTitle>
      <p className="text-muted-foreground">{pieceId}</p>
    </>
  )
}
```

`src/pages/player/index.ts`:
```ts
export { PlayerPage } from './ui/PlayerPage'
```

`src/pages/theory-chords/ui/TheoryChordsPage.tsx`:
```tsx
import { useTranslation } from 'react-i18next'
import { SectionTitle } from '@/shared/ui'

export function TheoryChordsPage() {
  const { t } = useTranslation('theory')
  return <SectionTitle>{t('tabs.chords')}</SectionTitle>
}
```

`src/pages/theory-chords/index.ts`:
```ts
export { TheoryChordsPage } from './ui/TheoryChordsPage'
```

`src/pages/theory-scales/ui/TheoryScalesPage.tsx`:
```tsx
import { useTranslation } from 'react-i18next'
import { SectionTitle } from '@/shared/ui'

export function TheoryScalesPage() {
  const { t } = useTranslation('theory')
  return <SectionTitle>{t('tabs.scales')}</SectionTitle>
}
```

`src/pages/theory-scales/index.ts`:
```ts
export { TheoryScalesPage } from './ui/TheoryScalesPage'
```

`src/pages/theory-symbols/ui/TheorySymbolsPage.tsx`:
```tsx
import { useTranslation } from 'react-i18next'
import { SectionTitle } from '@/shared/ui'

export function TheorySymbolsPage() {
  const { t } = useTranslation('theory')
  return <SectionTitle>{t('tabs.symbols')}</SectionTitle>
}
```

`src/pages/theory-symbols/index.ts`:
```ts
export { TheorySymbolsPage } from './ui/TheorySymbolsPage'
```

`src/pages/theory-quiz/ui/TheoryQuizPage.tsx`:
```tsx
import { useTranslation } from 'react-i18next'
import { SectionTitle } from '@/shared/ui'

export function TheoryQuizPage() {
  const { t } = useTranslation('theory')
  return <SectionTitle>{t('tabs.quiz')}</SectionTitle>
}
```

`src/pages/theory-quiz/index.ts`:
```ts
export { TheoryQuizPage } from './ui/TheoryQuizPage'
```

`src/pages/settings/ui/SettingsPage.tsx` (Task 9 adds the controls):
```tsx
import { useTranslation } from 'react-i18next'
import { ScreenTitle } from '@/shared/ui'

export function SettingsPage() {
  const { t } = useTranslation('settings')
  return <ScreenTitle>{t('title')}</ScreenTitle>
}
```

`src/pages/settings/index.ts`:
```ts
export { SettingsPage } from './ui/SettingsPage'
```

`src/pages/not-found/ui/NotFoundPage.tsx`:
```tsx
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ScreenTitle } from '@/shared/ui'

export function NotFoundPage() {
  const { t } = useTranslation('common')
  return (
    <>
      <ScreenTitle>{t('notFound.title')}</ScreenTitle>
      <Link
        to="/songs"
        className="inline-flex min-h-11 items-center font-semibold text-primary underline-offset-4 hover:underline"
      >
        {t('notFound.toSongs')}
      </Link>
    </>
  )
}
```

`src/pages/not-found/index.ts`:
```ts
export { NotFoundPage } from './ui/NotFoundPage'
```

- [ ] **Step 6: Create the navigation widgets**

`src/widgets/app-nav/ui/AppNav.tsx`:
```tsx
import { Link } from '@tanstack/react-router'
import { BookOpen, Music, Route } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const ITEMS = [
  { to: '/', label: 'nav.path', icon: Route, exact: true },
  { to: '/songs', label: 'nav.songs', icon: Music, exact: false },
  { to: '/theory', label: 'nav.theory', icon: BookOpen, exact: false },
] as const

/** Bottom bar on phones, a left rail from 1024px. */
export function AppNav() {
  const { t } = useTranslation('common')
  return (
    <nav
      aria-label={t('nav.label')}
      className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] lg:top-0 lg:right-auto lg:w-24 lg:border-t-0 lg:border-r lg:pt-4"
    >
      <ul className="flex lg:flex-col lg:gap-2">
        {ITEMS.map(({ to, label, icon: Icon, exact }) => (
          <li key={to} className="flex-1 lg:flex-none">
            <Link
              to={to}
              activeOptions={{ exact }}
              className="flex min-h-14 flex-col items-center justify-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-primary"
            >
              <Icon aria-hidden className="size-5" />
              {t(label)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

`src/widgets/app-nav/index.ts`:
```ts
export { AppNav } from './ui/AppNav'
```

`src/widgets/theory-nav/ui/TheoryNav.tsx`:
```tsx
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

const TABS = [
  { to: '/theory/chords', label: 'tabs.chords' },
  { to: '/theory/scales', label: 'tabs.scales' },
  { to: '/theory/symbols', label: 'tabs.symbols' },
  { to: '/theory/quiz', label: 'tabs.quiz' },
] as const

export function TheoryNav() {
  const { t } = useTranslation('theory')
  return (
    <nav aria-label={t('tabs.label')} className="mb-4">
      <ul className="flex gap-1 rounded-xl bg-muted p-1">
        {TABS.map(({ to, label }) => (
          <li key={to} className="flex-1">
            <Link
              to={to}
              className="flex min-h-11 items-center justify-center rounded-lg px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-card data-[status=active]:text-foreground data-[status=active]:shadow-sm"
            >
              {t(label)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

`src/widgets/theory-nav/index.ts`:
```ts
export { TheoryNav } from './ui/TheoryNav'
```

- [ ] **Step 7: Create the route split points**

`src/app/lazy-screen.ts`:
```ts
import { lazyRouteComponent, type RouteComponent } from '@tanstack/react-router'

/** A route component loaded on demand from a module of screens; each module becomes one chunk. */
export function lazyScreen<Exports extends Record<string, unknown>>(load: () => Promise<Exports>) {
  return <Name extends keyof Exports & string>(name: Name) =>
    lazyRouteComponent(load, name) as unknown as RouteComponent
}
```

`src/app/routes/home-screens.ts`:
```ts
export { PathPage } from '@/pages/path'
export { SettingsPage } from '@/pages/settings'
```

`src/app/routes/songs-screens.ts`:
```ts
export { PiecePage } from '@/pages/piece'
export { SongsPage } from '@/pages/songs'
```

`src/app/routes/player-screens.ts`:
```ts
export { PlayerPage } from '@/pages/player'
```

`src/app/routes/theory-screens.ts`:
```ts
export { TheoryChordsPage } from '@/pages/theory-chords'
export { TheoryQuizPage } from '@/pages/theory-quiz'
export { TheoryScalesPage } from '@/pages/theory-scales'
export { TheorySymbolsPage } from '@/pages/theory-symbols'
```

- [ ] **Step 8: Create the layouts and the error screen**

`src/app/RootLayout.tsx`:
```tsx
import { Outlet } from '@tanstack/react-router'
import { AppNav } from '@/widgets/app-nav'

export function RootLayout() {
  return (
    <>
      <main className="mx-auto max-w-3xl px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-28 lg:pb-8">
        <Outlet />
      </main>
      <AppNav />
    </>
  )
}
```

`src/app/TheoryLayout.tsx`:
```tsx
import { Outlet } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ScreenTitle } from '@/shared/ui'
import { TheoryNav } from '@/widgets/theory-nav'

export function TheoryLayout() {
  const { t } = useTranslation('theory')
  return (
    <>
      <ScreenTitle>{t('title')}</ScreenTitle>
      <TheoryNav />
      <Outlet />
    </>
  )
}
```

`src/app/RouteError.tsx`:
```tsx
import type { ErrorComponentProps } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'
import { ScreenTitle } from '@/shared/ui'

type RouteErrorProps = Partial<ErrorComponentProps> & { reload?: () => void }

/** The router's error screen for a route that throws while rendering; other routes are unaffected. */
export function RouteError({ reload = () => window.location.reload() }: RouteErrorProps) {
  const { t } = useTranslation('common')
  return (
    <div role="alert">
      <ScreenTitle>{t('errors.title')}</ScreenTitle>
      <Button className="min-h-11" onClick={reload}>
        {t('errors.reload')}
      </Button>
    </div>
  )
}
```

- [ ] **Step 9: Create the router `src/app/router.tsx`**

```tsx
import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  type RouterHistory,
} from '@tanstack/react-router'
import { NotFoundPage } from '@/pages/not-found'
import { lazyScreen } from './lazy-screen'
import { RootLayout } from './RootLayout'
import { RouteError } from './RouteError'
import { TheoryLayout } from './TheoryLayout'

const home = lazyScreen(() => import('./routes/home-screens'))
const songs = lazyScreen(() => import('./routes/songs-screens'))
const player = lazyScreen(() => import('./routes/player-screens'))
const theory = lazyScreen(() => import('./routes/theory-screens'))

const rootRoute = createRootRoute({ component: RootLayout, notFoundComponent: NotFoundPage })

const pathRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: home('PathPage'),
})
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: home('SettingsPage'),
})
const songsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/songs',
  component: songs('SongsPage'),
})
const pieceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/songs/$pieceId',
  component: songs('PiecePage'),
})
const playerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/play/$pieceId',
  component: player('PlayerPage'),
})

const theoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/theory',
  component: TheoryLayout,
})
const theoryIndexRoute = createRoute({
  getParentRoute: () => theoryRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/theory/chords' })
  },
})
const chordsRoute = createRoute({
  getParentRoute: () => theoryRoute,
  path: 'chords',
  component: theory('TheoryChordsPage'),
})
const scalesRoute = createRoute({
  getParentRoute: () => theoryRoute,
  path: 'scales',
  component: theory('TheoryScalesPage'),
})
const symbolsRoute = createRoute({
  getParentRoute: () => theoryRoute,
  path: 'symbols',
  component: theory('TheorySymbolsPage'),
})
const quizRoute = createRoute({
  getParentRoute: () => theoryRoute,
  path: 'quiz',
  component: theory('TheoryQuizPage'),
})

const routeTree = rootRoute.addChildren([
  pathRoute,
  settingsRoute,
  songsRoute,
  pieceRoute,
  playerRoute,
  theoryRoute.addChildren([theoryIndexRoute, chordsRoute, scalesRoute, symbolsRoute, quizRoute]),
])

export function createAppRouter(history?: RouterHistory) {
  return createRouter({
    routeTree,
    history,
    defaultPreload: 'intent',
    defaultErrorComponent: RouteError,
  })
}

export type AppRouter = ReturnType<typeof createAppRouter>

declare module '@tanstack/react-router' {
  interface Register {
    router: AppRouter
  }
}
```

- [ ] **Step 10: Replace the app shell and the entry**

`src/app/App.tsx`:
```tsx
import { RouterProvider } from '@tanstack/react-router'
import { type SettingsStore, SettingsStoreProvider } from '@/entities/settings'
import { LocaleSync } from './providers/LocaleSync'
import { ThemeProvider } from './providers/ThemeProvider'
import type { AppRouter } from './router'

export function App({ settingsStore, router }: { settingsStore: SettingsStore; router: AppRouter }) {
  return (
    <SettingsStoreProvider store={settingsStore}>
      <LocaleSync />
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </SettingsStoreProvider>
  )
}
```

`src/main.tsx`:
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createSettingsStore } from '@/entities/settings'
import '@/shared/i18n'
import { App } from './app/App'
import { createAppRouter } from './app/router'
import './styles/index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('index.html has no #root element')

createRoot(rootElement).render(
  <StrictMode>
    <App settingsStore={createSettingsStore()} router={createAppRouter()} />
  </StrictMode>,
)
```

`src/app/testing/render-app.tsx`:
```tsx
import { createMemoryHistory } from '@tanstack/react-router'
import { render } from '@testing-library/react'
import { createSettingsStore, type Locale } from '@/entities/settings'
import { createMemoryStorage } from '@/shared/lib'
import { App } from '../App'
import { createAppRouter } from '../router'

/** The whole app at `path`, on in-memory storage unless told otherwise, in the given language. */
export function renderApp(
  path: string,
  { locale = 'en', storage = createMemoryStorage() }: { locale?: Locale; storage?: Storage } = {},
) {
  const settingsStore = createSettingsStore({ storage, languages: [locale] })
  const router = createAppRouter(createMemoryHistory({ initialEntries: [path] }))
  const view = render(<App settingsStore={settingsStore} router={router} />)
  return { ...view, router, settingsStore }
}
```

- [ ] **Step 11: Run the router tests to verify they pass**

Run: `npx vitest run src/app/router.test.tsx`
Expected: PASS (all tests in both `describe` blocks).

- [ ] **Step 12: Write and run `src/app/RouteError.test.tsx`**

```tsx
import { createMemoryHistory } from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createAppRouter } from './router'
import { RouteError } from './RouteError'

describe('RouteError', () => {
  it('says something went wrong and offers a reload', async () => {
    const reload = vi.fn()
    const user = userEvent.setup()
    render(<RouteError reload={reload} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong')
    await user.click(screen.getByRole('button', { name: 'Reload' }))
    expect(reload).toHaveBeenCalledOnce()
  })

  it('is the router’s default error screen', () => {
    const router = createAppRouter(createMemoryHistory())
    expect(router.options.defaultErrorComponent).toBe(RouteError)
  })
})
```

Run: `npx vitest run src/app/RouteError.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 13: Write `src/app/architecture.test.ts` — prove the layer and barrel rules**

```ts
// @vitest-environment node
import { resolve } from 'node:path'
import { ESLint } from 'eslint'
import { describe, expect, it } from 'vitest'

const eslint = new ESLint({ cwd: process.cwd() })

async function rulesBrokenBy(file: string, code: string) {
  const [result] = await eslint.lintText(code, { filePath: resolve(file) })
  return (result?.messages ?? []).map((message) => message.ruleId)
}

describe('architecture rules (eslint)', { timeout: 60_000 }, () => {
  it('let a page import an entity through its barrel', async () => {
    const broken = await rulesBrokenBy(
      'src/pages/path/ui/Example.tsx',
      "import { selectTheme } from '@/entities/settings'\nexport const example = selectTheme\n",
    )
    expect(broken).not.toContain('boundaries/dependencies')
    expect(broken).not.toContain('no-restricted-imports')
  })

  it('let a slice import another slice of its own layer through its barrel', async () => {
    const broken = await rulesBrokenBy(
      'src/widgets/app-nav/ui/Example.tsx',
      "import { TheoryNav } from '@/widgets/theory-nav'\nexport const example = TheoryNav\n",
    )
    expect(broken).not.toContain('boundaries/dependencies')
  })

  it('refuse an import from a higher layer', async () => {
    const broken = await rulesBrokenBy(
      'src/entities/settings/model/example.ts',
      "import { PathPage } from '@/pages/path'\nexport const example = PathPage\n",
    )
    expect(broken).toContain('boundaries/dependencies')
  })

  it('refuse shared reaching up into an entity', async () => {
    const broken = await rulesBrokenBy(
      'src/shared/lib/example.ts',
      "import { selectTheme } from '@/entities/settings'\nexport const example = selectTheme\n",
    )
    expect(broken).toContain('boundaries/dependencies')
  })

  it('refuse a deep import into another slice', async () => {
    const broken = await rulesBrokenBy(
      'src/pages/path/ui/Example.tsx',
      "import { createSettingsStore } from '@/entities/settings/model/store'\nexport const example = createSettingsStore\n",
    )
    expect(broken).toContain('no-restricted-imports')
  })
})
```

Run: `npx vitest run src/app/architecture.test.ts`
Expected: PASS (5 tests). If "refuse a deep import" fails, the `no-restricted-imports` group pattern in
`eslint.config.js` is not matching; fix the pattern (not the test) until it passes.

- [ ] **Step 14: Full check**

Run: `npm run typecheck && npm run lint && npm run test && npm run build`
Expected: all pass. `ls dist/assets/*.js | wc -l` is at least 5 (the entry plus one chunk per screen module).

- [ ] **Step 15: Manual smoke test**

Run: `npm run dev`, open http://localhost:5173 at phone width (DevTools device toolbar, 390px). Check: the bottom
bar shows Path · Songs · Theory; `/theory` lands on Chords with its tab selected; `/songs/bz5` shows `bz5`;
`/nowhere` shows "Page not found"; at 1280px wide the nav is a left rail. Stop the server.

- [ ] **Step 16: Commit**

```bash
npx prettier --write src
git add package.json package-lock.json src
git commit -m "Add every route as an empty screen, the navigation, not-found and error screens

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Settings — choose language and theme

**Files:**
- Create: `src/pages/settings/ui/ChoiceGroup.tsx`
- Modify: `src/pages/settings/ui/SettingsPage.tsx`, `src/app/router.test.tsx` (one test added)
- Test: `src/pages/settings/ui/SettingsPage.test.tsx`

**Interfaces:**
- Consumes: `LOCALES`, `THEMES`, `selectLocale`, `selectTheme`, `useSettings`, `useSettingsStoreApi`, `type Locale`,
  `type Theme`, `createSettingsStore`, `SettingsStoreProvider` from `@/entities/settings`; `setLocale`, `setTheme`
  from `@/features/set-preference`; `renderApp` from `src/app/testing/render-app.tsx`.
- Produces: a Settings screen with two radio groups ("Language", "Theme") whose choices save immediately.

- [ ] **Step 1: Write the failing test `src/pages/settings/ui/SettingsPage.test.tsx`**

```tsx
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { createSettingsStore, type Locale, SettingsStoreProvider } from '@/entities/settings'
import { createMemoryStorage } from '@/shared/lib'
import { SettingsPage } from './SettingsPage'

function renderPage(locale: Locale = 'en') {
  const store = createSettingsStore({ storage: createMemoryStorage(), languages: [locale] })
  render(
    <SettingsStoreProvider store={store}>
      <SettingsPage />
    </SettingsStoreProvider>,
  )
  return store
}

describe('SettingsPage', () => {
  it('shows the saved language and theme as chosen', () => {
    renderPage('en')
    expect(screen.getByRole('radio', { name: 'English' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'System' })).toBeChecked()
  })

  it('groups each choice under its own heading', () => {
    renderPage()
    const language = screen.getByRole('group', { name: 'Language' })
    expect(within(language).getAllByRole('radio').map((radio) => radio.getAttribute('value'))).toEqual([
      'en',
      'ru',
    ])
    const theme = screen.getByRole('group', { name: 'Theme' })
    expect(within(theme).getAllByRole('radio').map((radio) => radio.getAttribute('value'))).toEqual([
      'system',
      'light',
      'dark',
    ])
  })

  it('saves a new language', async () => {
    const user = userEvent.setup()
    const store = renderPage()
    await user.click(screen.getByRole('radio', { name: 'Русский' }))
    expect(store.getState().locale).toBe('ru')
  })

  it('saves a new theme', async () => {
    const user = userEvent.setup()
    const store = renderPage()
    await user.click(screen.getByRole('radio', { name: 'Dark' }))
    expect(store.getState().theme).toBe('dark')
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/pages/settings`
Expected: FAIL — no radio named "English".

- [ ] **Step 3: Create `src/pages/settings/ui/ChoiceGroup.tsx`**

```tsx
interface Choice<Value extends string> {
  value: Value
  label: string
}

/** One fieldset of radio choices; the whole row is the target, at least 44px tall. */
export function ChoiceGroup<Value extends string>({
  legend,
  name,
  value,
  choices,
  onChange,
}: {
  legend: string
  name: string
  value: Value
  choices: readonly Choice<Value>[]
  onChange: (value: Value) => void
}) {
  return (
    <fieldset>
      <legend className="mb-2 font-semibold">{legend}</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {choices.map((choice) => (
          <label
            key={choice.value}
            className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-border bg-card px-3 transition-colors hover:bg-accent has-checked:border-primary"
          >
            <input
              type="radio"
              name={name}
              value={choice.value}
              checked={value === choice.value}
              onChange={() => onChange(choice.value)}
              className="size-4 accent-primary"
            />
            {choice.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
```

- [ ] **Step 4: Replace `src/pages/settings/ui/SettingsPage.tsx`**

```tsx
import { useTranslation } from 'react-i18next'
import {
  type Locale,
  LOCALES,
  selectLocale,
  selectTheme,
  type Theme,
  THEMES,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { setLocale, setTheme } from '@/features/set-preference'
import { ScreenTitle } from '@/shared/ui'
import { ChoiceGroup } from './ChoiceGroup'

const LOCALE_LABEL = {
  en: 'language.en',
  ru: 'language.ru',
} as const satisfies Record<Locale, string>

const THEME_LABEL = {
  system: 'theme.system',
  light: 'theme.light',
  dark: 'theme.dark',
} as const satisfies Record<Theme, string>

export function SettingsPage() {
  const { t } = useTranslation('settings')
  const store = useSettingsStoreApi()
  const locale = useSettings(selectLocale)
  const theme = useSettings(selectTheme)

  return (
    <>
      <ScreenTitle>{t('title')}</ScreenTitle>
      <div className="space-y-6">
        <ChoiceGroup
          legend={t('language.label')}
          name="locale"
          value={locale}
          choices={LOCALES.map((value) => ({ value, label: t(LOCALE_LABEL[value]) }))}
          onChange={(value) => setLocale(store, value)}
        />
        <ChoiceGroup
          legend={t('theme.label')}
          name="theme"
          value={theme}
          choices={THEMES.map((value) => ({ value, label: t(THEME_LABEL[value]) }))}
          onChange={(value) => setTheme(store, value)}
        />
      </div>
    </>
  )
}
```

- [ ] **Step 5: Run it to verify it passes**

Run: `npx vitest run src/pages/settings`
Expected: PASS (4 tests).

- [ ] **Step 6: Add the whole-app test to `src/app/router.test.tsx`**

Append inside `describe('the app shell', () => { … })`:
```tsx
  it('relabels the app as soon as the learner switches to Russian', async () => {
    const user = userEvent.setup()
    renderApp('/settings')
    await user.click(await screen.findByRole('radio', { name: 'Русский' }))
    const nav = await screen.findByRole('navigation', { name: 'Основная навигация' })
    expect(within(nav).getByRole('link', { name: 'Путь' })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('ru')
  })

  it('repaints the app as soon as the learner picks a theme', async () => {
    const user = userEvent.setup()
    renderApp('/settings')
    await user.click(await screen.findByRole('radio', { name: 'Dark' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
```

Run: `npx vitest run src/app/router.test.tsx`
Expected: PASS.

- [ ] **Step 7: Full check and commit**

Run: `npm run typecheck && npm run lint && npm run test`
Expected: all pass.

```bash
npx prettier --write src/pages/settings src/app/router.test.tsx
git add src/pages/settings src/app/router.test.tsx
git commit -m "Let the learner choose the language and the theme in Settings

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Installable and offline — PWA, icons, update prompt

**Files:**
- Create: `public/favicon.svg`, generated icons in `public/`, `src/app/providers/UpdateBanner.tsx`,
  `src/app/providers/UpdatePrompt.tsx`, `src/shared/test/pwa-register-stub.ts`
- Modify: `vite.config.ts`, `src/vite-env.d.ts`, `index.html` (icon links), `src/app/RootLayout.tsx`
- Test: `src/app/providers/UpdateBanner.test.tsx`

**Interfaces:**
- Consumes: `Button` from `@/shared/ui/primitives/button`; `common.update.*` strings.
- Produces: a precaching service worker (`dist/sw.js`) and manifest (`dist/manifest.webmanifest`);
  `UpdateBanner({ onUpdate, onLater })`; `UpdatePrompt()` mounted in `RootLayout` — shows the banner only when a
  new version is waiting, never reloads on its own.

- [ ] **Step 1: Install**

```bash
npm install -D vite-plugin-pwa@^1 @vite-pwa/assets-generator@^2
```

- [ ] **Step 2: Create `public/favicon.svg`** (a placeholder mark; Phase 3's visual direction replaces it)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#22314f"/>
  <rect x="10" y="14" width="44" height="36" rx="4" fill="#fdfdfb"/>
  <path d="M21 14v36M32 14v36M43 14v36" stroke="#c9cfd8" stroke-width="1.5"/>
  <rect x="17.5" y="14" width="7" height="21" rx="1.5" fill="#1b1e24"/>
  <rect x="28.5" y="14" width="7" height="21" rx="1.5" fill="#1b1e24"/>
</svg>
```

- [ ] **Step 3: Generate the icons**

Run: `npx pwa-assets-generator --preset minimal-2023 public/favicon.svg && ls public`
Expected `public/` now holds: `apple-touch-icon-180x180.png`, `favicon.ico`, `favicon.svg`,
`maskable-icon-512x512.png`, `pwa-192x192.png`, `pwa-512x512.png`, `pwa-64x64.png`. If the generator names differ,
use its names in Steps 4 and 6.

- [ ] **Step 4: Add the PWA plugin and the test alias to `vite.config.ts`**

Replace `vite.config.ts` with:
```ts
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vitest/config'

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: 'Piano Trainer',
        short_name: 'Piano',
        description: 'Learn songs, chords and scales at the piano.',
        lang: 'en',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        theme_color: '#22314f',
        background_color: '#eef1f5',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: { '@': fromRoot('./src') },
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./src/shared/test/setup.ts'],
    css: false,
    include: ['src/**/*.test.{ts,tsx}'],
    alias: {
      // vite-plugin-pwa's virtual module does not exist outside a Vite build.
      'virtual:pwa-register/react': fromRoot('./src/shared/test/pwa-register-stub.ts'),
    },
  },
})
```

- [ ] **Step 5: Add types and the test stand-in**

`src/vite-env.d.ts`:
```ts
/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />
```

`src/shared/test/pwa-register-stub.ts`:
```ts
/** Test stand-in for vite-plugin-pwa's virtual module: no service worker, nothing waiting. */
export function useRegisterSW() {
  return {
    needRefresh: [false, () => {}] as const,
    offlineReady: [false, () => {}] as const,
    updateServiceWorker: async () => {},
  }
}
```

- [ ] **Step 6: Link the icons in `index.html`**

In `index.html`, directly after the `theme-color` meta, add:
```html
    <link rel="icon" href="/favicon.ico" sizes="48x48" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png" />
    <meta name="description" content="Learn songs, chords and scales at the piano." />
```

- [ ] **Step 7: Write the failing test `src/app/providers/UpdateBanner.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { UpdateBanner } from './UpdateBanner'

describe('UpdateBanner', () => {
  it('announces the waiting version and updates on request', async () => {
    const onUpdate = vi.fn()
    const user = userEvent.setup()
    render(<UpdateBanner onUpdate={onUpdate} onLater={vi.fn()} />)
    expect(screen.getByRole('status')).toHaveTextContent('A new version is ready')
    await user.click(screen.getByRole('button', { name: 'Update' }))
    expect(onUpdate).toHaveBeenCalledOnce()
  })

  it('can be put off', async () => {
    const onLater = vi.fn()
    const user = userEvent.setup()
    render(<UpdateBanner onUpdate={vi.fn()} onLater={onLater} />)
    await user.click(screen.getByRole('button', { name: 'Later' }))
    expect(onLater).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 8: Run it to verify it fails**

Run: `npx vitest run src/app/providers/UpdateBanner.test.tsx`
Expected: FAIL — cannot resolve `./UpdateBanner`.

- [ ] **Step 9: Implement the banner and the prompt**

`src/app/providers/UpdateBanner.tsx`:
```tsx
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'

export function UpdateBanner({ onUpdate, onLater }: { onUpdate: () => void; onLater: () => void }) {
  const { t } = useTranslation('common')
  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-20 z-20 mx-auto flex max-w-md items-center gap-2 rounded-xl border border-border bg-card p-3 shadow-lg lg:bottom-4"
    >
      <p className="flex-1 font-medium">{t('update.available')}</p>
      <Button variant="ghost" className="min-h-11" onClick={onLater}>
        {t('update.later')}
      </Button>
      <Button className="min-h-11" onClick={onUpdate}>
        {t('update.update')}
      </Button>
    </div>
  )
}
```

`src/app/providers/UpdatePrompt.tsx`:
```tsx
import { useRegisterSW } from 'virtual:pwa-register/react'
import { UpdateBanner } from './UpdateBanner'

/** Registers the service worker; offers a waiting version, and never reloads on its own. */
export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  return needRefresh ? (
    <UpdateBanner
      onUpdate={() => void updateServiceWorker(true)}
      onLater={() => setNeedRefresh(false)}
    />
  ) : null
}
```

In `src/app/RootLayout.tsx`, add `import { UpdatePrompt } from './providers/UpdatePrompt'` and render
`<UpdatePrompt />` after `<AppNav />`.

- [ ] **Step 10: Run the tests**

Run: `npx vitest run src/app`
Expected: PASS, including every earlier `src/app` test (the stub keeps `UpdatePrompt` silent).

- [ ] **Step 11: Verify the build ships a worker and a manifest**

Run: `npm run typecheck && npm run lint && npm run build && ls dist | grep -E '^(sw\.js|manifest\.webmanifest)$' && grep -c '"display":"standalone"' dist/manifest.webmanifest`
Expected: `sw.js` and `manifest.webmanifest` listed; count `1`.

- [ ] **Step 12: Manual offline check**

Run: `npm run preview` and open the printed URL in Chrome. DevTools → Application: the Manifest shows no errors and
an installable icon; Service workers shows `sw.js` activated. Tick **Offline** in the Network tab, reload, then
open `/theory/scales` and `/songs/bz5` — each still renders. Stop the server.

- [ ] **Step 13: Commit**

```bash
npx prettier --write vite.config.ts index.html src/app src/shared/test src/vite-env.d.ts
git add package.json package-lock.json vite.config.ts index.html public src
git commit -m "Make the app installable and offline, with an update prompt

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: CI, the coverage gate and Vercel

**Files:**
- Create: `.github/workflows/ci.yml`, `vercel.ts`
- Modify: `vite.config.ts` (coverage), `tsconfig.json` (include `vercel.ts`)

**Interfaces:**
- Consumes: the scripts from Task 2.
- Produces: a `CI / check` job on every push and pull request; `test:cov` failing below 90% lines on
  `src/shared/lib/**` or `src/entities/*/model/**`; Vercel config compiled from `vercel.ts`.

- [ ] **Step 1: Add the coverage gate**

In `vite.config.ts`, inside `test: { … }` after `alias`, add:
```ts
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        'src/**/testing/**',
        'src/shared/test/**',
        'src/main.tsx',
      ],
      thresholds: {
        'src/shared/lib/**': { lines: 90 },
        'src/entities/*/model/**': { lines: 90 },
      },
    },
```

Run: `npm run test:cov`
Expected: PASS, with a coverage table; no "ERROR: Coverage for lines … does not meet" line. Then prove the gate
bites: temporarily add `export function unused(a: number) { if (a > 1) return a * 2; if (a > 0) return a; return 0 }`
repeated as ten differently named functions to `src/shared/lib/cn.ts`, run `npm run test:cov` — expected: FAIL
naming `src/shared/lib/**`. Remove them.

- [ ] **Step 2: Create `.github/workflows/ci.yml`**

```yaml
# Every push to main and every pull request: typecheck, lint (including the layer rules),
# tests with the coverage gate, and a production build. Nothing merges red.
name: CI

on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: read

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}

jobs:
  check:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - name: Checkout
        uses: actions/checkout@v7
        with:
          persist-credentials: false

      - name: Set up Node
        uses: actions/setup-node@v7
        with:
          node-version-file: .nvmrc
          cache: npm

      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run test:cov
      - run: npm run build
```

- [ ] **Step 3: Install and write the Vercel config**

```bash
npm install -D @vercel/config@^0.7
```

`vercel.ts`:
```ts
import { routes, type VercelConfig } from '@vercel/config/v1'

// Static SPA. Hashed assets are cached forever; the shell, the service worker and the manifest
// must revalidate so a deploy reaches learners. Every other path falls back to the app (deep links).
export const config: VercelConfig = {
  framework: 'vite',
  buildCommand: 'npm run build',
  rewrites: [routes.rewrite('/(.*)', '/index.html')],
  headers: [
    routes.cacheControl('/assets/(.*)', { public: true, maxAge: '1year', immutable: true }),
    routes.cacheControl('/index.html', { public: true, maxAge: '0s', mustRevalidate: true }),
    routes.cacheControl('/sw.js', { public: true, maxAge: '0s', mustRevalidate: true }),
    routes.cacheControl('/manifest.webmanifest', {
      public: true,
      maxAge: '0s',
      mustRevalidate: true,
    }),
  ],
}
```

In `tsconfig.json`, change `"include"` to `["src", "vite.config.ts", "vercel.ts"]`.

- [ ] **Step 4: Verify the compiled config**

Run: `npx @vercel/config compile`
Expected JSON containing: a rewrite from `/(.*)` to `/index.html`; `Cache-Control` for `/assets/(.*)` including
`max-age=31536000` and `immutable`; and for `/index.html`, `/sw.js`, `/manifest.webmanifest` including
`max-age=0` and `must-revalidate`. If a `TimeString` is rejected, use the form the error names (e.g. `'365days'`,
`'0 seconds'`) and re-run until the JSON matches.

Run: `npm run typecheck && npm run lint`
Expected: pass.

- [ ] **Step 5: Commit**

```bash
npx prettier --write vite.config.ts vercel.ts tsconfig.json .github/workflows/ci.yml
git add package.json package-lock.json vite.config.ts vercel.ts tsconfig.json .github/workflows/ci.yml
git commit -m "Add CI with a coverage gate, and the Vercel config

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 6: Owner steps — outward-facing, do not perform without the owner's go-ahead**

Ask the owner to do these (or to explicitly authorise doing them):
1. Push the branch and open a pull request into `main`; confirm the `CI / check` job goes green.
2. In Vercel: **Add New → Project**, import `tt8747430-png/piano-trainer`, keep the detected Vite framework, deploy.
   Confirm the pull request gets a preview URL, and on it that `/theory/scales` loads directly (deep link) and a
   reload keeps it.
3. In GitHub → Settings → Branches: protect `main`, requiring the `CI / check` status.

---

### Task 12: CLAUDE.md, the docs, and the spec amendments

**Files:**
- Create: `CLAUDE.md`, `README.md`, `docs/CODE_STYLE.md`, `docs/UBIQUITOUS_LANGUAGE.md`,
  `docs/adr/0001-clean-rewrite.md`, `docs/adr/0002-content-as-code-one-file-per-piece.md`,
  `docs/adr/0003-view-state-in-url-saved-state-in-stores.md`, `docs/adr/0004-audio-and-midi-behind-ports.md`,
  `docs/adr/0005-levels-live-on-the-path.md`, `docs/adr/0006-gaps-from-quiz-evidence-only.md`,
  `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`, `docs/agents/domain.md`
- Modify: `docs/superpowers/specs/2026-09-24-piano-trainer-rewrite-design.md` (§2 and §8)

**Interfaces:**
- Consumes: the file layout and names from Tasks 1–11 (every path the docs name must exist).
- Produces: the documents Claude and contributors read first.

- [ ] **Step 1: Create `CLAUDE.md`**

````markdown
# CLAUDE.md

## Answer style

Concise. Answer first. No preamble, no recap.

Piano Trainer: an offline-first PWA for learning songs, chords and scales at the piano. React 19 + Vite + strict
TypeScript, **Feature-Sliced Design** (lint-enforced), English + Russian, deployed on Vercel. Design:
[spec](docs/superpowers/specs/2026-09-24-piano-trainer-rewrite-design.md). The old single-file app is
`legacy/index.html`: a reading reference, never imported, deleted at the Phase 4 switch-over.

## Skills — before writing code

- `tdd` → every module, test first (red → green → refactor).
- `vite-react-best-practices` / `vercel-react-best-practices` → performance, bundle, Vite SPA
  ([CODE_STYLE](docs/CODE_STYLE.md) §7).
- `vercel-composition-patterns` → component APIs (§4).
- `shadcn` → anything in `src/shared/ui/primitives` (add with the CLI, never by hand).
- `impeccable` → visual design work (Phase 3 chooses the direction).
- `vercel:knowledge-update` → before touching `vercel.ts` or anything Vercel.
- **Not applicable:** React Native, Next.js and Angular skills.

Non-trivial feature → `superpowers:brainstorming` first; specs in `docs/superpowers/specs/`, plans in
`docs/superpowers/plans/`.

## Change rules

- **Latest stable dependencies, no legacy in code.** Pinned majors: TypeScript 6, Vitest 4, jsdom 29, jest-dom 6,
  eslint-plugin-boundaries 6. Bumping one is its own change.
- **Saved data keeps working.** Persisted stores (`pt-settings`, later `pt-progress`) carry a `version`; a shape
  change ships a `migrate` and a sanitising `merge`, never a reset.
- **Staged is deliberate.** Never `git checkout`/`restore`/`stash`/`reset` the owner's work unprompted.
- **New code copies the nearest slice's shape.** Writes → a feature command. Reads → selectors. Pure logic →
  `shared/lib` or `entities/*/model` with a colocated test.
- **Complete, not placeholder.** Every UI string in both `en` and `ru`. Loading, empty, error and offline states.
- **Verify before claiming done:** `npm run typecheck && npm run lint && npm run test`; after touching startup,
  routing, the PWA or config, also `npm run build`.

## Commands

`dev` · `build` · `preview` · `typecheck` · `lint` (includes the layer rules) · `test` / `test:watch` / `test:cov`
(90% lines on `src/shared/lib/**` and `src/entities/*/model/**`).
One file: `npx vitest run src/shared/lib/cn.test.ts` · one test: `npx vitest run -t "saves a new language"`.
**Never `npm run format`** on the whole repo: `npx prettier --write <files you touched>`.

## Architecture — FSD (lint-enforced)

`app → pages → widgets → features → entities → shared`. Import from your own layer or below, never above
(`eslint-plugin-boundaries`). Another slice only through its `index.ts` (`no-restricted-imports` refuses deep paths;
`src/app/architecture.test.ts` proves both). `@` → `src`.

- **app/**: `router.tsx` (code-based TanStack Router; screens are lazy through `routes/*-screens.ts`),
  `App.tsx` (the provider stack), `providers/` (`LocaleSync`, `ThemeProvider`, `UpdatePrompt`), `RouteError`,
  layouts. From Phase 2, `composition-root.ts` → `createServices()` (audio + MIDI).
- **pages/<x>/ui/**: one per route; composes widgets + `shared/ui`.
- **widgets/<x>/**: composite UI tied to screens (`app-nav`, `theory-nav`).
- **features/<x>/**: commands, one use case per file (`set-preference/set-theme.ts`).
- **entities/<x>/**: `model/types.ts` (types, guards, validating constructors; no IO, no React),
  `model/store.ts` (zustand `persist` over `safeLocalStorage()`, versioned, sanitising `merge`),
  `model/selectors.ts`, `model/context.ts` (`createStoreContext`), `content/` (authored data), `index.ts`.
- **shared/**: `lib` (`cn`, `safeLocalStorage`, `createStoreContext`; from Phase 2 `music`, `arrangement`,
  `schedule`, `services`), `api` (ports + adapters), `ui` (design system; shadcn in `ui/primitives`), `i18n`, `test`.

**State:** what you look at → URL search params. What must be remembered → a persisted entity store. Everything
else → component state.
**Theme:** `index.html`'s `#theme-boot` script paints `data-theme` before first paint from `pt-settings`;
`ThemeProvider` keeps it. `src/app/theme-boot.test.ts` holds the two together.

## Read before you touch

- **Any UI** → [CODE_STYLE](docs/CODE_STYLE.md).
- **Naming anything** → [UBIQUITOUS_LANGUAGE](docs/UBIQUITOUS_LANGUAGE.md). "Piece" in code, "Song" or "Exercise"
  in the UI. A "Skill" is a quiz-rated chord quality or scale kind, nothing else.
- **Why it is this way** → [docs/adr](docs/adr).
- **Music logic** (from Phase 2) → CODE_STYLE §8 and spec §4.

## Conventions

- Strict TS: `noUncheckedIndexedAccess`, `noUnusedLocals/Parameters`, `verbatimModuleSyntax` → `import type`.
  No `any`.
- Tests colocated as `*.test.ts(x)`; Vitest + jsdom with **`globals: false`** (import `describe/it/expect/vi`).
  Setup: `src/shared/test/setup.ts` (jest-dom, a light `matchMedia` stub, cleanup, English). Whole-app tests:
  `renderApp(path, { locale })` from `src/app/testing/render-app.tsx`. OS theme: `stubMatchMedia`.
- Prettier: no semicolons, single quotes, trailing commas `all`, printWidth 100.
- i18n: interface strings in `src/shared/i18n/locales/{en,ru}/<namespace>.ts`. Russian is typed against English,
  so a missing key fails `tsc`.

## Agent skills

Issues and specs → `.scratch/<feature-slug>/` ([issue tracker](docs/agents/issue-tracker.md)). Labels:
[triage-labels](docs/agents/triage-labels.md). Domain docs: [domain](docs/agents/domain.md).
````

- [ ] **Step 2: Create `README.md`**

````markdown
# Piano Trainer

Learn to play songs at the piano: a path from easy to hard, the chords and scales each song needs, and a practice
player that plays along, steps through, or waits for you. Installable, works offline, in English and Russian.

> The rewrite is in progress. The current app is `legacy/index.html`, still served on GitHub Pages; the new app
> replaces it at the end of Phase 4 ([spec](docs/superpowers/specs/2026-09-24-piano-trainer-rewrite-design.md)).

## Run it

Needs Node 24 (`nvm use`).

```bash
npm install
npm run dev                        # http://localhost:5173
npm run test                       # all tests
npm run build && npm run preview   # the production build, with the service worker
```

## Work on it

- How code is organised and written: [CLAUDE.md](CLAUDE.md), [docs/CODE_STYLE.md](docs/CODE_STYLE.md).
- The words we use: [docs/UBIQUITOUS_LANGUAGE.md](docs/UBIQUITOUS_LANGUAGE.md).
- Decisions and why: [docs/adr](docs/adr).
- Every push and pull request runs typecheck, lint, tests with coverage and the build
  (`.github/workflows/ci.yml`). Vercel builds a preview of each pull request.

How to add a song arrives with the content format in Phase 2 (`docs/CONTENT.md`).
````

- [ ] **Step 3: Create `docs/CODE_STYLE.md`**

````markdown
# Code Style

How code is written in Piano Trainer. Builds on [CLAUDE.md](../CLAUDE.md); adapted from Mindscape's
(memory-palaces) style guide, keeping only what applies here. Goal: small, single-responsibility, tested units.

## 1. Compose small components

A container wires data to presentational children. One job each.

| What                            | Where                                                          |
| ------------------------------- | -------------------------------------------------------------- |
| App-wide, purely presentational | `shared/ui/`                                                   |
| shadcn primitive                | `shared/ui/primitives/` (added with the shadcn CLI, not by hand) |
| Composite, tied to screens      | `widgets/<x>/ui/`                                              |
| Screen root                     | `pages/<x>/ui/`                                                |
| Subpart of one parent           | beside it, in the same `ui/` folder                            |

- About 200 lines per file. Past it, extract children, or move state into `model/`.
- **One exported component per file, named for the file.** Private helpers may stay.
- A page composes widgets and `shared/ui`, with little markup of its own.
- Promote to `shared/ui` only what is app-wide and presentational.

## 2. Logic into hooks; components render

- Stateful or effectful logic (subscriptions, timers, audio, MIDI, DOM measurement) goes in a hook: reusable ones
  in `shared/lib`, one-offs beside their component.
- **Pure domain logic never lives in a component or a hook.** It goes in `shared/lib` or `entities/*/model`,
  tested without React.

## 3. Complex state → a reducer or a machine

- Several values changing together, or distinct phases → a pure reducer or discriminated-union machine outside the
  component, with its own tests (from Phase 2: `features/practice/practice-machine.ts`,
  `features/quiz/quiz-machine.ts`). The component dispatches.
- A page with many acts exposes **one** hook, `pages/<x>/model/use-<thing>.ts`. That hook is the test surface
  (`renderHook`), not the page.
- **A confirmation or multi-step flow is one union value, never a flag each**
  (`stage: 'idle' | 'confirm' | 'working'`).
- A lone toggle stays `useState`.

## 4. Composition over configuration

- No boolean-prop proliferation (`isPrimary`, `isCompact`): use variants or `children` slots.
- **Variants are lookup maps of complete static class strings.** Never `` `bg-${x}` ``: Tailwind cannot see it.
- Multi-part UI → compound components sharing context, not a wide list of props.
- `children` over `renderX`; a render prop only when the parent injects per-item data.
- **React 19:** `ref` is a normal prop (no `forwardRef`); `use(Context)`; `<Context value>` without `.Provider`.

## 5. Tailwind and tokens

Tailwind v4 with two layers: primitives (`--p-*`) → semantic roles (`--primary`, `--card`, `--role-root`, …) in
`src/styles/tokens.css`, exposed as utilities by `@theme inline` in `src/styles/theme.css`.

- **Semantic utilities only** (`bg-card`, `text-muted-foreground`, `bg-role-3rd`): never a raw colour, never a
  primitive, never `p-[13px]`. No role yet → add one to `tokens.css`, in both themes.
- **Compose with `cn()`** (`shared/lib/cn.ts`). A custom theme name `tailwind-merge` does not know (a new text size,
  radius or shadow) must be registered in `cn.ts`, with a test, or `cn()` drops classes.
- **Dark mode is the token remap under `[data-theme='dark']`.** App code writes no `dark:` classes. `dark:` is bound
  to `data-theme` only so shadcn primitives follow the app's setting rather than the OS.
- **Chord-tone colours are role tokens** (`--role-root` … `--role-13th`). A coloured key always also shows its
  degree or finger label, so colour is never the only cue.
- Interactive elements: hover, `focus-visible`, `disabled`, and a transition. Icon-only controls get an
  `aria-label`. Minimum target 44px (`min-h-11`, `size-11`).
- Mobile-first: the base style is the phone; layer up with `sm:` and `lg:`.
- Motion animates `transform` and `opacity` only, and must mean something. `prefers-reduced-motion` is honoured
  globally in `theme.css`.

## 6. TypeScript and imports

`import type` for type-only imports · no `any` (take `unknown` and narrow) · small domain types over bare numbers
and strings (`PitchClass`, `Midi`, `StepId`) · another slice only through its `index.ts` · the `@/` alias, never
`../../` across slices.

## 7. Performance

- **Subscribe narrowly:** `useSettings(selectTheme)`, never the whole state. State a handler needs only when it runs
  → `useSettingsStoreApi().getState()` at call time.
- **Derive during render. `useEffect` only syncs with the outside world** (DOM attributes, audio, MIDI,
  `matchMedia`).
- Never define a component inside a component. Hoist static JSX and lookup maps to module scope.
- `memo` deliberately: a list row under a busy parent, with stable props.
- Every screen is a lazy route (`app/routes/*-screens.ts` through `lazyScreen`), so the first paint carries only
  the shell.
- A ternary, not `cond && <X />` (a `0` renders).
- `startTransition` or `useDeferredValue` for expensive, non-urgent updates (search, filters).

## 8. Music code

- **Spelling comes from letter steps + semitones,** never from a table of sharp or flat names. That is what keeps
  C♭, E♯, F𝄪 and 𝄫7 right. Name tables are for display only where no key exists.
- Domain time is **ticks** (12 per beat). Seconds exist only in `shared/lib/schedule` and the audio adapter.
- Audio and MIDI are reached **only** through `useServices()` (ports in `shared/api`). No component or hook creates
  an `AudioContext` or calls `requestMIDIAccess`.
- Randomness is injected (`random: () => number`), so every quiz test is deterministic.
- Content is data validated by tests: a chart that does not parse, an unknown chord symbol, or a missing Russian
  text fails CI.

## 9. Tests

- **Test first** (`tdd` skill). A test names behaviour a learner or caller can observe ("saves a new language"),
  not an implementation detail.
- Components: Testing Library, by role and accessible name; `userEvent.setup()` for interaction. No snapshots.
- Ports are replaced by **fakes** (`createMemoryStorage()`, from Phase 2 `FakeAudio` and `FakeMidi`), not by
  mocking modules.
- Whole-app behaviour: `renderApp(path, { locale })` from `src/app/testing/render-app.tsx`.
- `globals: false`: import `describe`, `it`, `expect` and `vi` from `vitest`.

## 10. Copy and i18n

- **No sentence that repeats what a label, icon or layout already says. No how-to paragraphs.** Empty states and
  errors get one short line.
- Every interface string goes through i18next, in **both** `en` and `ru`
  (`src/shared/i18n/locales/{en,ru}/<namespace>.ts`; Russian is typed against English).
- Content text a learner reads is `LocalText { en, ru }` (from Phase 2). Credits stay as printed.
- Note and chord names are the same in both languages (B, not H).

## 11. Build and deploy

- The Vercel config is `vercel.ts` (`@vercel/config`): SPA rewrite; `/assets/*` immutable; `index.html`, `sw.js`
  and the manifest revalidate. Read `vercel:knowledge-update` before changing it.
- Check a production build with `npm run build && npm run preview`: it catches lazy-chunk, asset and
  service-worker problems `dev` hides.
- A `VITE_` variable is public. Never put a secret in one.
````

- [ ] **Step 4: Create `docs/UBIQUITOUS_LANGUAGE.md`**

````markdown
# Ubiquitous Language

Canonical terms for code, UI copy, commits and discussion. Code uses the **Term**; where the interface says it
differently, the UI column says how.

## Content

| Term            | Means                                                                                          | UI                            | Avoid                      |
| --------------- | ---------------------------------------------------------------------------------------------- | ----------------------------- | -------------------------- |
| **Piece**       | Anything that opens in the Player: a song, an exercise or a progression (`kind`)               | Song / Exercise / Progression | item, track, tune          |
| **Listing**     | A songbook entry with no chart yet; shown in Songs, never opened in the Player                  | Song, "no chart yet"          | stub, placeholder          |
| **Collection**  | An ordered group of Pieces and Listings from one source («Боже, спасибо», Called to Play…)     | Collection                    | book, category             |
| **Chart**       | A song's or exercise's chords by section, line and bar, in the chart format                    | Chords                        | sheet, score, lead sheet   |
| **Progression** | A Piece written as degrees + functions, whose chords grow with the chosen Voicing              | Progression                   | chord flow, sequence       |
| **Section**     | A labelled part of a Chart: intro, verse, chorus, ending, practice, hymn, part                 | Verse, Chorus, …              | block, segment             |
| **Bar**         | One measure of a Chart                                                                         | Bar                           | measure (in code), segment |
| **Method code** | A per-chord playing technique from the source book (`:t1`, `:3ch`)                             | —                             | style code                 |
| **LocalText**   | Content text in both languages, `{ en, ru }`                                                   | —                             | translation, i18n string   |

## Music

| Term                       | Means                                                                                                 | Avoid                |
| -------------------------- | ----------------------------------------------------------------------------------------------------- | -------------------- |
| **Pitch class**            | One of the 12 notes, whatever the octave (0–11)                                                       | note number          |
| **Spelled note**           | A note with its letter and accidental (E♭, not D♯)                                                    | note-name string     |
| **Chord quality**          | The kind of chord: `maj`, `m7`, `hd`, … (33)                                                          | chord type (in code) |
| **Chord family**           | A group of qualities: triads; 6th & add; 7ths; 9ths & more; altered 7ths                              | chord group          |
| **Chord symbol**           | The written name, `F#m7b5/C`                                                                          | chord name           |
| **Chord tone**             | One note of a chord, with its **Role** (root, 3rd, 5th, 7th, 9th, 11th, 13th) and **Degree** label (`♭3`) | chord note       |
| **Voicing**                | How much of each chord a Progression plays: triads, sevenths or ninths                                | colour               |
| **Inversion**              | Which chord tone is lowest                                                                            | position             |
| **Scale kind**             | major; natural, harmonic or melodic minor; major or minor pentatonic; blues                          | scale type, mode     |
| **Degree** (progression)   | A Roman numeral from the tonic on the major scale (`ii`, `♭VII`)                                      | step                 |
| **Function** (progression) | How a degree's chord grows with the Voicing: `maj`, `min`, `dom`, `domb9`, `hd`, or fixed `=quality`   | chord role           |

## Practice

| Term                          | Means                                                                                    | Avoid                   |
| ----------------------------- | ---------------------------------------------------------------------------------------- | ----------------------- |
| **Pattern**                   | A named accompaniment style for the right and left hand                                  | rhythm, style (in code) |
| **Performance**               | Everything `arrange` produces for a Piece: bars, beats, notes on a timeline              | playback, song data     |
| **Tick**                      | The domain's unit of time: 12 per beat                                                   | step (as time)          |
| **Beat group**                | Notes sharing an onset: what Step mode walks through                                     | chord (as time), group  |
| **Listen / Step / Your turn** | The Player's modes: the app plays / you move through it / the app waits for your notes   | auto, manual            |
| **Setup**                     | The Player's sheet: key, tempo, hands, pattern, voicing and toggles                      | options, settings       |

## Path and progress

| Term         | Means                                                                                       | Avoid                     |
| ------------ | ------------------------------------------------------------------------------------------- | ------------------------- |
| **Level**    | 1 Beginner · 2 Elementary · 3 Intermediate · 4 Advanced: a Step's place on the Path          | difficulty, grade         |
| **Path**     | Every Step in order, level by level; the one source of levels                               | course, curriculum        |
| **Step**     | One entry on the Path: a Piece, a chord family or a scale kind (`piece:bz5`, `chords:sev`)   | lesson, item, task        |
| **Learned**  | A Step the learner marked, or that marked itself after a passed Check                       | done, completed, mastered |
| **Continue** | The one suggestion on the Path screen: what to do next                                      | resume, next up           |

## Theory gaps

| Term                      | Means                                                                                       | Avoid               |
| ------------------------- | ------------------------------------------------------------------------------------------- | ------------------- |
| **Skill**                 | Something rated from quiz answers: one chord quality or one scale kind (`chord:m7`)          | ability, topic      |
| **Evidence**              | The last 5 quiz answers on a Skill                                                          | history, attempts   |
| **Known / Gap / Unknown** | A Skill's rating: 4 of the last 5 right including the latest / tried, not known / never tried | mastered, weak, new |
| **Check**                 | A short quiz scoped to some Skills (a Piece's chords, a Step's family)                      | test, exam          |
| **My gaps**               | The quiz mode that asks Gap Skills first                                                    | review, weak spots  |

## Settings and app

| Term         | Means                                                        | Avoid                |
| ------------ | ------------------------------------------------------------ | -------------------- |
| **Theme**    | `system`, `light` or `dark`; `system` follows the OS          | mode, appearance     |
| **Locale**   | The interface language, `en` or `ru`                          | language code, lang  |
| **Services** | The audio and MIDI ports the app hands down (`useServices()`) | engine, context      |
````

- [ ] **Step 5: Create the six ADRs**

`docs/adr/0001-clean-rewrite.md`:
````markdown
# ADR 0001 — A clean rewrite, not a migration

- **Status:** accepted · **Date:** 2026-09-24

## Context

The app was one 1,882-line `index.html`: vanilla JS in a single global scope, with no build, types, tests or docs.
The owner wants new features, other people using it, a redesign, and a Path-first structure that changes every
screen at once. Three ways were weighed: build the new app beside the old one, checked against golden fixtures
recorded from the legacy code; modularise the old page and swap its tabs one at a time; or rewrite cleanly, reading
the old code as a reference.

## Decision

Rewrite cleanly (the owner's choice). The legacy file moves to `legacy/index.html`, stays live on GitHub Pages until
the switch-over (Phase 4), and is never imported. No golden fixtures are recorded from it: tests assert music-theory
facts and specified behaviour, written before the code.

## Consequences

- The new structure and the redesign are not bound to the old DOM.
- Musical correctness rests on tests written from theory, and on the spec's parity checklist (§12), walked by hand
  before the switch-over.
- Until Phase 4 there are two apps. `legacy/` and the Pages workflow are deleted at the switch-over.
````

`docs/adr/0002-content-as-code-one-file-per-piece.md`:
````markdown
# ADR 0002 — Content is code, one file per piece

- **Status:** accepted · **Date:** 2026-09-24

## Context

Songs, exercises, progressions and accompaniment patterns were object literals inside the legacy script, keyed by
short codes, with English and Russian mixed into strings such as `'Verse · Куплет'`. The app has no backend and must
work offline.

## Decision

Content is TypeScript under `entities/<x>/content/`: one file per piece, written with `definePiece` and listed in
its collection's `index.ts`. The chart format the owner already writes is kept. Text a learner reads is
`LocalText { en, ru }`. Catalog tests parse and arrange every piece in all 12 keys, and check every chord symbol
and every text in both languages.

## Consequences

- A broken chart cannot ship: CI fails.
- Adding a piece is one file, one index line and one Path entry, reviewed like code.
- Content ships in the bundle and is precached, so it is there offline without a fetch.
- Editing content needs a pull request; acceptable while the owner writes it.
````

`docs/adr/0003-view-state-in-url-saved-state-in-stores.md`:
````markdown
# ADR 0003 — What you look at is in the URL; what must be remembered is in a store

- **Status:** accepted · **Date:** 2026-09-24

## Context

The legacy app kept everything in one `localStorage` object (`piano-v3`): the chord on screen, the tempo, the quiz
score, the last tab. Stale view state survived reloads, and nothing could be linked to.

## Decision

- **View state** (an explorer's root and quality; the Player's key, tempo, hands, mode and pattern) lives in typed,
  validated URL search params. An invalid value falls back to the default.
- **Remembered state** lives in versioned zustand `persist` stores: `settings` (`pt-settings`) and, from Phase 2,
  `progress` (`pt-progress`). Each has a `version`, a `migrate`, and a `merge` that keeps only valid stored fields.
- Nothing is imported from `piano-v3`: it held nothing worth carrying over.

## Consequences

- Links can be shared, and the back button works.
- A store shape change ships a migration, never a reset.
- Blocked or full storage never breaks the app: `safeLocalStorage()` falls back to memory and loses failed writes
  instead of throwing.
````

`docs/adr/0004-audio-and-midi-behind-ports.md`:
````markdown
# ADR 0004 — Audio and MIDI sit behind ports

- **Status:** accepted · **Date:** 2026-09-24

## Context

The legacy app called `AudioContext` and `navigator.requestMIDIAccess` wherever it needed them. Neither exists in
tests, Web MIDI does not exist on Safari or iOS, and browsers start audio suspended until a user gesture.

## Decision

`shared/api/audio` defines the `AudioOutput` port and `shared/api/midi` the `MidiInput` port.
`app/composition-root.ts` builds the WebAudio and Web MIDI adapters in `createServices()`, with `midi: null` where
Web MIDI is missing. Components and hooks reach them only through `useServices()`. Tests pass `FakeAudio` and
`FakeMidi`, which record calls.

## Consequences

- Practice and quiz logic is tested without a browser audio stack.
- Scheduling is pure (`shared/lib/schedule` turns ticks into seconds); the adapter only plays.
- A missing capability is a `null` the interface reads, not an exception.
````

`docs/adr/0005-levels-live-on-the-path.md`:
````markdown
# ADR 0005 — Levels live on the Path, nowhere else

- **Status:** accepted · **Date:** 2026-09-24

## Context

Every Step has a level from 1 to 4, and Songs filters by level. A `level` on each piece as well as the piece's
place on the Path would be two sources of truth, and no test could say which is right when they disagree.

## Decision

`entities/path/content/path.ts` is the only place a level is written: a Step's level is the list it sits in. Pieces
carry no `level`; Songs reads a piece's level through `levelOf(stepId)`. Tests require every Piece on the Path
exactly once and no Listing on it; from Phase 4, every level must hold at least one Step.

## Consequences

- Re-levelling is moving a line in one file.
- Until Phase 4 everything sits at level 1, and the every-level test is off.
````

`docs/adr/0006-gaps-from-quiz-evidence-only.md`:
````markdown
# ADR 0006 — Theory gaps come from quiz answers only

- **Status:** accepted · **Date:** 2026-09-24

## Context

The owner wants the app to find and fill gaps in a learner's theory, without lesson text. Two signals exist: quiz
answers, and wrong notes in the Player's Your turn.

## Decision

A **Skill** (one chord quality or one scale kind) is rated from its **Evidence**, the last 5 quiz answers: Known =
at least 4 of 5 right, including the latest; Gap = tried but not Known; Unknown = never tried. Player mistakes are
not evidence: a wrong note there is as likely rhythm or hand position as theory. Gaps surface on the Piece screen
(Check these chords), on chord and scale Steps (Check yourself, which marks the Step learned once its family is
Known), in the quiz's My gaps mode, and as one line on the Continue card.

## Consequences

- The rating is pure (`entities/progress/model/mastery.ts`) and exhaustively tested.
- A learner who only plays and never quizzes sees Unknowns, not Gaps: the Checks are the way in.
- Five answers per Skill keeps storage small (40 Skills × 5).
````

- [ ] **Step 6: Create the agent docs**

`docs/agents/issue-tracker.md`:
````markdown
# Issue tracker: local Markdown

Issues and specs for this repo live as Markdown files in `.scratch/`.

## Conventions

- One feature per directory: `.scratch/<feature-slug>/`.
- The spec is `.scratch/<feature-slug>/spec.md`. (Design specs from brainstorming live in
  `docs/superpowers/specs/`; implementation plans in `docs/superpowers/plans/`.)
- Implementation issues are one file per ticket, `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from
  `01`; never one combined tickets file.
- Triage state is a `Status:` line near the top of each issue (role strings in `triage-labels.md`).
- Comments and history append at the bottom under a `## Comments` heading.

## When a skill says "publish to the issue tracker"

Create a file under `.scratch/<feature-slug>/`, creating the directory if needed.

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The owner normally passes the path or the issue number.
````

`docs/agents/triage-labels.md`:
````markdown
# Triage labels

The skills speak of five triage roles. This maps them to the strings used in this repo's issue files.

| Role in the skills | Label here        | Meaning                                  |
| ------------------ | ----------------- | ---------------------------------------- |
| `needs-triage`     | `needs-triage`    | The owner needs to evaluate this issue   |
| `needs-info`       | `needs-info`      | Waiting on the reporter for information  |
| `ready-for-agent`  | `ready-for-agent` | Fully specified, ready for an AFK agent  |
| `ready-for-human`  | `ready-for-human` | Needs a human to implement               |
| `wontfix`          | `wontfix`         | Will not be done                         |
````

`docs/agents/domain.md`:
````markdown
# Domain docs

How the engineering skills should read this repo's domain documentation.

**Layout: single context.** The glossary is [`docs/UBIQUITOUS_LANGUAGE.md`](../UBIQUITOUS_LANGUAGE.md) (treat it as
`CONTEXT.md`); decisions are in [`docs/adr/`](../adr).

## Before exploring, read

- `docs/UBIQUITOUS_LANGUAGE.md`.
- The ADRs in `docs/adr/` that touch the area you are about to work in.
- The design spec in `docs/superpowers/specs/` for the feature.

## Use the glossary's words

When output names a domain concept (an issue title, a refactor proposal, a test name), use the glossary's term, not
a synonym it lists under "Avoid". A concept missing from the glossary is a signal: either the language is invented
(reconsider) or there is a real gap (add it through `/domain-modeling`).

## Flag ADR conflicts

If output contradicts an ADR, say so explicitly instead of silently overriding it:

> _Contradicts ADR 0005 (levels live on the Path), but worth reopening because…_
````

- [ ] **Step 7: Amend the spec**

In `docs/superpowers/specs/2026-09-24-piano-trainer-rewrite-design.md`:

Replace the sentence `Versions follow memory-palaces so the two repos share habits.` with:
```markdown
Versions follow memory-palaces so the two repos share habits, and majors are pinned as memory-palaces proved them
(TypeScript 6, Vitest 4, jsdom 29, jest-dom 6, eslint-plugin-boundaries 6) even where newer majors exist; bumping
one is its own change.
```

Replace the bullet that begins `- **Interface strings** are in namespaces` (two lines, ending
`A test fails if the two locales' key sets differ.`) with:
```markdown
- **Interface strings** are in namespaces `common, path, songs, piece, player, theory, quiz, settings`, one
  TypeScript module per namespace per locale in `shared/i18n/locales/{en,ru}/<namespace>.ts`. Russian is typed
  against English's shape, so a missing or extra key fails `tsc`; a test also checks parity and that no string is
  empty.
```

- [ ] **Step 8: Check the docs**

Run:
```bash
npx prettier --write CLAUDE.md README.md docs/CODE_STYLE.md docs/UBIQUITOUS_LANGUAGE.md docs/adr docs/agents
node -e '
  const fs = require("fs"), path = require("path");
  const files = ["CLAUDE.md", "README.md", "docs/CODE_STYLE.md", "docs/agents/domain.md"];
  let bad = 0;
  for (const file of files) {
    for (const [, target] of fs.readFileSync(file, "utf8").matchAll(/\]\(([^)#]+)\)/g)) {
      if (/^https?:/.test(target)) continue;
      const resolved = path.join(path.dirname(file), target);
      if (!fs.existsSync(resolved)) { console.error(`${file} → ${target} (missing)`); bad++; }
    }
  }
  if (bad) process.exit(1); console.log("all links resolve");
'
```
Expected: `all links resolve`. Also confirm every path named in CLAUDE.md's Architecture section exists
(`ls src/app/router.tsx src/app/App.tsx src/app/providers src/app/testing/render-app.tsx src/shared/lib/cn.ts src/app/architecture.test.ts src/app/theme-boot.test.ts`).

- [ ] **Step 9: Final verification of the whole phase**

Run: `npm run typecheck && npm run lint && npm run test:cov && npm run build`
Expected: all pass.

- [ ] **Step 10: Commit**

```bash
git add CLAUDE.md README.md docs/CODE_STYLE.md docs/UBIQUITOUS_LANGUAGE.md docs/adr docs/agents docs/superpowers/specs/2026-09-24-piano-trainer-rewrite-design.md
git commit -m "Add CLAUDE.md, the code style, the glossary, six ADRs and the agent docs

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```
