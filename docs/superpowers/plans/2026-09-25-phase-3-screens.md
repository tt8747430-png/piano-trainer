# Phase 3 — Screens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every screen of Piano Trainer built in the owner's reference world (Clefs, Flowkey's player): the design
system, Path, Songs, Piece, the Player with its Setup sheet, Theory (Chords, Scales, Symbols, Quiz), the Check, and
Settings, rendering what Phase 2 built.

**Architecture:** Tokens and fonts first, then the shadcn primitives and an app-wide kit in `shared/ui` (the
`PianoKeyboard` above all). Pure logic the screens need (search params, voicings, scale runs, the Continue rule,
the arrangement choice, check scopes) lands in `shared/lib`, `entities/*/model` and `features/*/model` with tests
first. Screens are thin pages composing widgets; each route validates its search params with a page-owned
`validateSearch`.

**Tech Stack:** React 19, TypeScript 6, Vite 8, TanStack Router 1.170 (code-based), Tailwind v4, shadcn base-nova on
Base UI 1.8, lucide-react, zustand 5, i18next, Vitest 4 + Testing Library. New packages: `@fontsource-variable/onest`,
`@fontsource/noto-music` (and whatever the shadcn CLI adds for its primitives).

**Spec:** `docs/superpowers/specs/2026-09-25-phase-3-screens-design.md` (read it first), on top of the master spec
`docs/superpowers/specs/2026-09-24-piano-trainer-rewrite-design.md` (§5–§9). Product record: `PRODUCT.md`. Direction
contract: `.impeccable/surfaces/src-app.md`. Approved comp: `.impeccable/mocks/decision/sage.png`.

## Global Constraints

- Work on `main` (the owner's rule, memory `commit-on-main`); commit after every task; do not push unless asked.
- Pinned majors unchanged: TypeScript 6, Vitest 4, jsdom 29, jest-dom 6, eslint-plugin-boundaries 6.
- Layers `app → pages → widgets → features → entities → shared`; another slice only through its `index.ts`.
- **Tokens only** (CODE_STYLE §5): semantic utilities (`bg-card`, `text-muted-foreground`, `bg-role-3rd`,
  `bg-hand-rh`); no raw colours, no primitives, no arbitrary values (`p-[13px]`), no `dark:` in app code.
- **Palette law:** role colours only on chord tones (keys, legend, chord-chip edges); hand colours only in the Player.
- shadcn primitives are added with `npx shadcn@latest add`, then edited only to meet this plan (44px targets, variants,
  no `"use client"` lines).
- Every UI string in `en` **and** `ru` (`src/shared/i18n/locales/{en,ru}/<namespace>.ts`); Russian is typed against
  English. Note and chord names are the same in both (B, `#`, `♭`).
- Search params: a page-owned `validateSearch(input: Partial<S> & SearchSchemaInput): S` that returns defaults for
  anything invalid; `search: { middlewares: [stripSearchParams(DEFAULTS)] }`; control changes navigate with
  `replace: true`.
- Selectors return stable values; lists subscribe to one slice (`selectAllAnswers`) and derive in render.
- Tests colocated, `globals: false`, by role and name, fakes not module mocks (CODE_STYLE §9). Test first.
- Prettier on touched files only: `npx prettier --write <files>`. Never `npm run format`.
- Verify before each commit: `npm run typecheck && npm run lint && npm run test`; after touching startup, routing, the
  PWA or config also `npm run build`.
- Commit messages: imperative sentence, optional body, then `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Keep a progress log at `.superpowers/sdd/2026-09-25-phase-3-screens/progress.md`: one line per finished task, and a
  "Ruling:" line for any deviation from this plan (what, why, cost if wrong), as Phase 2 did.

## Review Focus

1. **Stale or hand-edited URLs** (`/play/bz5?key=H&tempo=999&mode=x&pattern=r5`, `/theory/chords?inversion=7`) →
   every param falls back to its default, a melody pattern on a piece without a melody still plays (`r4`), nothing
   throws. Pinned by: Task 6 (validators), Task 14 (`arrangePiece`), Task 24 (Player search).
2. **Saved progress naming a piece a later version removed** (`practised: { gone: … }`, `learned: { 'piece:gone': … }`)
   → Continue and My gaps skip it; counts ignore it. Pinned by: Task 10 (`selectSuggestedStep`), Task 15 (`myGaps`).
3. **Quick repeated taps** on chords, bars and explorer chips → the previous sound stops before the next plays; no
   pile-up. Pinned by: Task 9 (`usePlay`).
4. **Switching language on an open screen** → titles, section headings, chord names and credits switch at once.
   Pinned by: Task 11 (`entryTitles`, `useSectionHeading`), Task 18 (Piece in Russian).
5. **A chord wider than the default keyboard** (Name chord on B13, a B♭ root in the explorer) → the keyboard range grows
   to hold every tone. Pinned by: Task 4 (`rangeFor`), Task 15 (`quizKeyboardRange`).
6. **MIDI that changes under the learner** (unplugged during Your turn, permission denied) → the status line follows,
   taps on the screen keep working. Pinned by: Task 13, Task 24.

---

## File map

```
package.json                                   modify — fonts (Task 1), shadcn deps (Task 2)
index.html public/favicon.svg public/*.png     modify — theme colour, sage icon (Task 1)
src/main.tsx                                   modify — font CSS imports (Task 1)
src/styles/tokens.css theme.css                rewrite / modify (Task 1; landscape-phone variant Task 26)
src/shared/config/theme-colors.ts (+test)      modify (Task 1)

src/shared/ui/primitives/                      toggle toggle-group switch slider popover drawer input alert-dialog
                                               separator progress item empty spinner; button variants (Task 2)
src/shared/ui/                                 ScreenHeader RoundButton Segmented ChipRow RoleLegend RatingMark
                                               LevelMark Sheet role-classes (Task 3); piano-keyboard/ (Task 4)
src/app/                                       AppShell FullScreenLayout TheoryLayout RouteError RoutePending
                                               UpdateBanner (Task 5); routes/search.ts + router (Task 16, 18)
src/app/screens/*.test.tsx                     screen integration tests (Tasks 17–27)
src/widgets/app-nav theory-nav                 restyle (Task 5)
src/pages/not-found                            restyle (Task 5)

src/shared/lib/music/voicing.ts scale.ts note.ts   (Task 6)
src/shared/lib/search-params.ts fold-text.ts   (Task 7)
src/shared/lib/schedule/sounds.ts              barSounds chordSounds scaleRun PRACTICE_RHYTHMS (Task 8)
src/shared/lib/services/use-play.ts            (Task 9)
src/entities/progress/model/                   selectSuggestedStep selectAllAnswers skillsToCheck knownCount (Task 10)
src/shared/i18n/use-language.ts                (Task 11)
src/entities/piece/model/titles.ts ui/         entryTitles; Credits SourceLine useSectionHeading (Task 11);
                                               barLength (Task 24)
src/features/mark-learned/ui/LearnedToggle     (Task 12)
src/shared/api/midi current()                  (Task 13)
src/features/connect-midi/                     useMidiConnection MidiControl MidiButton (Task 13); useHeldKeys (Task 26)
src/features/practice/                         choice arrange-piece note-names bar-columns marks (Task 14)
src/features/quiz/                             check-plan my-gaps quiz-keys use-quiz (Task 15)
src/entities/path/ui/use-step-title.ts         (Task 16)

src/widgets/quiz-board quiz-choice             (Task 17)   src/pages/theory-quiz
src/pages/check                                (Task 18)
src/widgets/chord-explorer step-panel          (Task 19)   src/pages/theory-chords
src/widgets/scale-explorer                     (Task 20)   src/pages/theory-scales
src/pages/theory-symbols                       (Task 21)
src/widgets/continue-card path-levels          (Task 22)   src/pages/path
src/widgets/piece-list                         (Task 23)   src/pages/songs (+ model/songs-view.ts)
src/widgets/chord-chart piece-skills           (Task 24)   src/pages/piece
src/widgets/player-setup                       (Task 25)
src/pages/player (+ model/resolve-choice.ts)   (Task 26)
src/pages/settings                             (Task 27)
CLAUDE.md docs/CODE_STYLE.md docs/UBIQUITOUS_LANGUAGE.md README.md docs/adr/0007-…   (Task 28)
DESIGN.md                                      (Task 29, by the impeccable documenter)
```

---

### Task 1: Tokens, fonts and the sage icon

**Files:**
- Modify: `package.json` (install), `src/main.tsx`, `src/styles/tokens.css` (rewrite), `src/styles/theme.css`,
  `src/shared/config/theme-colors.ts`, `public/favicon.svg`, regenerated `public/*.png`
- Test: `src/shared/config/theme-colors.test.ts` (existing, must stay green), `src/shared/lib/cn.test.ts`

**Interfaces:**
- Produces: utilities `bg-attention text-attention bg-glass bg-hand-rh bg-hand-lh bg-hand-melody text-hand-*
  bg-key-white border-key-white-edge bg-key-black bg-key-pressed`, the retuned `role-*`, `font-sans` = Onest,
  `ease-out` = the one curve, utilities `pt-safe pb-safe bottom-safe`.

- [ ] **Step 1: Install the fonts**

```bash
npm install @fontsource-variable/onest @fontsource/noto-music
```

- [ ] **Step 2: Check that nothing uses `--success` or `--accent` beyond shadcn**

Run: `grep -rn "success\|accent" src --include=*.tsx --include=*.ts --include=*.css | grep -v "accent-foreground\|primitives"`
Expected: only `tokens.css`/`theme.css` definitions and `src/pages/settings/ui/ChoiceGroup.tsx` (`accent-primary`,
`hover:bg-accent`; the file is deleted in Task 26). `--success` goes; `--accent` stays (shadcn primitives hover with it).

- [ ] **Step 3: Rewrite `src/styles/tokens.css`**

```css
/*
 * Two layers (docs/CODE_STYLE.md §5): primitives (--p-*) hold raw values; semantic roles name what a
 * colour is for. Components use roles through Tailwind utilities, never primitives. The world is
 * the owner's reference apps (PRODUCT.md): a sage ground, deep teal actions, mint soft surfaces.
 */
:root {
  --p-white: #ffffff;
  --p-sage-50: #f3f6f3;
  --p-sage-100: #e8ede9;
  --p-sage-200: #dce3de;
  --p-sage-300: #d3dad5;
  --p-sage-400: #c9d6cf;
  --p-mint-200: #d3e6de;
  --p-teal-950: #1f4d41;
  --p-teal-800: #2d6657;
  --p-teal-600: #1e7f69;
  --p-ink-950: #131816;
  --p-ink-900: #1e2321;
  --p-slate-600: #5e6964;
  --p-amber-800: #9a5a0b;
  --p-red-700: #b3261e;
  --p-terracotta-600: #c2552b;
  --p-plum-600: #7a4fc4;
  --p-role-blue: #2e5bd0;
  --p-role-rose: #cc3363;
  --p-role-steel: #5b6878;
  --p-role-ochre: #a86a00;
  --p-role-green: #0e8f5b;
  --p-role-violet: #7847c8;
  --p-role-cyan: #0a83ad;

  --p-night-990: #050706;
  --p-night-950: #0d1210;
  --p-night-900: #171e1b;
  --p-night-850: #1f2824;
  --p-night-800: #2a3430;
  --p-night-600: #5a6a63;
  --p-night-500: #7d8a84;
  --p-mist-50: #e9eeea;
  --p-mist-100: #e6ede9;
  --p-mist-400: #97a59f;
  --p-teal-900: #1e3a32;
  --p-teal-300: #8ccbb8;
  --p-teal-400: #5cccb0;
  --p-mint-100: #bfe3d7;
  --p-amber-300: #e7a64b;
  --p-red-300: #ff8a80;
  --p-terracotta-300: #ff8a5c;
  --p-plum-300: #b99bff;
  --p-role-blue-300: #6f95ff;
  --p-role-rose-300: #ff6f9d;
  --p-role-steel-300: #a6b1c0;
  --p-role-ochre-300: #f0b43c;
  --p-role-green-300: #3ccb97;
  --p-role-violet-300: #b794ff;
  --p-role-cyan-300: #4cc7ea;

  --radius: 1rem;

  --background: var(--p-sage-50);
  --foreground: var(--p-ink-950);
  --card: var(--p-white);
  --card-foreground: var(--p-ink-950);
  --popover: var(--p-white);
  --popover-foreground: var(--p-ink-950);
  --primary: var(--p-teal-800);
  --primary-foreground: var(--p-white);
  --secondary: var(--p-mint-200);
  --secondary-foreground: var(--p-teal-950);
  --muted: var(--p-sage-100);
  --muted-foreground: var(--p-slate-600);
  --accent: var(--p-sage-100);
  --accent-foreground: var(--p-ink-950);
  --attention: var(--p-amber-800);
  --destructive: var(--p-red-700);
  --border: var(--p-sage-200);
  --input: var(--p-sage-200);
  --ring: var(--p-teal-800);
  --glass: rgb(255 255 255 / 0.72);

  /* Chord-tone roles (spec §8): only on chord tones — keys, the legend, a chord chip's edge. */
  --role-root: var(--p-role-blue);
  --role-3rd: var(--p-role-rose);
  --role-5th: var(--p-role-steel);
  --role-7th: var(--p-role-ochre);
  --role-9th: var(--p-role-green);
  --role-11th: var(--p-role-violet);
  --role-13th: var(--p-role-cyan);
  --on-role: var(--p-white);

  /* The Player's hands; never in the explorers. */
  --hand-rh: var(--p-teal-600);
  --hand-lh: var(--p-terracotta-600);
  --hand-melody: var(--p-plum-600);

  --key-white: var(--p-white);
  --key-white-edge: var(--p-sage-300);
  --key-black: var(--p-ink-900);
  --key-pressed: var(--p-sage-400);
}

[data-theme='dark'] {
  --background: var(--p-night-950);
  --foreground: var(--p-mist-100);
  --card: var(--p-night-900);
  --card-foreground: var(--p-mist-100);
  --popover: var(--p-night-900);
  --popover-foreground: var(--p-mist-100);
  --primary: var(--p-teal-300);
  --primary-foreground: var(--p-night-950);
  --secondary: var(--p-teal-900);
  --secondary-foreground: var(--p-mint-100);
  --muted: var(--p-night-850);
  --muted-foreground: var(--p-mist-400);
  --accent: var(--p-night-850);
  --accent-foreground: var(--p-mist-100);
  --attention: var(--p-amber-300);
  --destructive: var(--p-red-300);
  --border: var(--p-night-800);
  --input: var(--p-night-800);
  --ring: var(--p-teal-300);
  --glass: rgb(23 30 27 / 0.72);

  --role-root: var(--p-role-blue-300);
  --role-3rd: var(--p-role-rose-300);
  --role-5th: var(--p-role-steel-300);
  --role-7th: var(--p-role-ochre-300);
  --role-9th: var(--p-role-green-300);
  --role-11th: var(--p-role-violet-300);
  --role-13th: var(--p-role-cyan-300);
  --on-role: var(--p-night-990);

  --hand-rh: var(--p-teal-400);
  --hand-lh: var(--p-terracotta-300);
  --hand-melody: var(--p-plum-300);

  --key-white: var(--p-mist-50);
  --key-white-edge: var(--p-night-500);
  --key-black: var(--p-night-990);
  --key-pressed: var(--p-night-600);
}
```

- [ ] **Step 4: Extend `src/styles/theme.css`**

In the `@theme inline` block, delete `--color-success`, and add after `--color-ring`:

```css
  --color-attention: var(--attention);
  --color-glass: var(--glass);

  --color-hand-rh: var(--hand-rh);
  --color-hand-lh: var(--hand-lh);
  --color-hand-melody: var(--hand-melody);

  --color-key-white: var(--key-white);
  --color-key-white-edge: var(--key-white-edge);
  --color-key-black: var(--key-black);
  --color-key-pressed: var(--key-pressed);

  --font-sans: 'Onest Variable', 'Noto Music', system-ui, sans-serif;
```

Replace the four `--radius-*` lines with (the same names, so `cn()` needs no registration):

```css
  --radius-sm: calc(var(--radius) - 6px);
  --radius-md: calc(var(--radius) - 4px);
  --radius-lg: calc(var(--radius) - 2px);
  --radius-xl: var(--radius);
  --radius-2xl: calc(var(--radius) + 2px);
  --radius-3xl: calc(var(--radius) + 10px);
```

After the `@theme inline` block add a plain `@theme` block that retunes Tailwind's own names (known to `cn()`):

```css
/* The type scale and the one easing, on Tailwind's own names so cn() keeps sorting them. */
@theme {
  --text-lg: 1.0625rem;
  --text-lg--line-height: 1.4;
  --text-xl: 1.375rem;
  --text-xl--line-height: 1.2;
  --text-4xl: 2.125rem;
  --text-4xl--line-height: 1.1;
  --text-6xl: 4rem;
  --text-6xl--line-height: 1;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}
```

In `@layer base`, after the `body` rule add the browser surfaces:

```css
  ::selection {
    background: color-mix(in oklab, var(--color-primary) 22%, transparent);
  }
  input,
  textarea {
    caret-color: var(--color-primary);
  }
  html {
    scrollbar-color: var(--color-border) transparent;
  }
```

After `@utility pb-safe` add:

```css
@utility bottom-safe {
  bottom: max(--spacing(4), env(safe-area-inset-bottom));
}
```

- [ ] **Step 5: Import the fonts in `src/main.tsx`**

Add as the first imports (before `./styles/index.css`):

```ts
import '@fontsource-variable/onest/wght.css'
import '@fontsource/noto-music/music-400.css'
```

- [ ] **Step 6: Point `THEME_COLORS` at the new background and run its test red → green**

Run: `npx vitest run src/shared/config/theme-colors.test.ts`
Expected: FAIL (`#eef1f5` ≠ `#f3f6f3`). Then set:

```ts
export const THEME_COLORS = { light: '#f3f6f3', dark: '#0d1210' } as const
```

Run again. Expected: PASS. Also check `index.html` for a hard-coded `theme-color` or background and update it the
same way (the theme-boot test holds the script to the store; keep that test green).

- [ ] **Step 7: Repaint the icon in the world's colours and regenerate the PNGs**

`public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="#2d6657"/>
  <rect x="10" y="15" width="44" height="34" rx="5" fill="#ffffff"/>
  <path d="M21 15v34M32 15v34M43 15v34" stroke="#d3e6de" stroke-width="1.5"/>
  <rect x="17.5" y="15" width="7" height="20" rx="2" fill="#131816"/>
  <rect x="28.5" y="15" width="7" height="20" rx="2" fill="#131816"/>
  <rect x="39.5" y="15" width="7" height="20" rx="2" fill="#1e7f69"/>
</svg>
```

Run: `npm run icons`
Expected: the PNG icons in `public/` are rewritten.

- [ ] **Step 8: Verify and commit**

Run: `npm run typecheck && npm run lint && npm run test && npm run build`
Expected: all green; the build output lists `onest-*.woff2` and `noto-music-music-*.woff2` assets.

```bash
npx prettier --write src/styles/tokens.css src/styles/theme.css src/main.tsx src/shared/config/theme-colors.ts
git add -A package.json package-lock.json index.html public src/main.tsx src/styles src/shared/config
git commit -m "Paint the app in the sage world with Onest and a music-symbol fallback

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: The shadcn primitives

**Files:**
- Create (CLI): `src/shared/ui/primitives/{toggle,toggle-group,switch,slider,popover,drawer,input,alert-dialog,separator,progress,item,empty,spinner}.tsx`
- Modify: `src/shared/ui/primitives/button.tsx`, the added files (sizes, variants, directives)
- Test: `src/shared/ui/primitives/button.test.tsx` (extend)

**Interfaces:**
- Produces: `Button` variants `default outline secondary soft surface ghost destructive link`, sizes `default lg icon
  icon-lg pill play`; `toggleVariants` variants `default outline chip segment`, one size `default` (h-11); `Switch` 32×52;
  `Slider` with a 24px thumb; the rest as the registry ships them (`Drawer*`, `Popover*`, `AlertDialog*`, `Item*`,
  `Empty*`, `Progress`, `Input`, `Separator`, `Spinner`).

- [ ] **Step 1: Add the primitives**

```bash
npx shadcn@latest add toggle toggle-group switch slider popover drawer input alert-dialog separator progress item empty spinner
```

Expected: the files land in `src/shared/ui/primitives/`; imports use `cn` and `@/shared/ui/primitives/...`.

- [ ] **Step 2: Review what landed**

Read every added file. Remove each `"use client"` line (a Vite SPA has no server components). Check each `Button`
use inside them names only sizes this project has (`default lg icon icon-lg pill`); replace `size="sm"` with
`size="default"`. Replace any icon library other than lucide.

- [ ] **Step 3: Write the failing button test for the new variants**

Append to `src/shared/ui/primitives/button.test.tsx`:

```tsx
  it('offers a round surface button and a mint soft button, both at least 44px', () => {
    render(
      <>
        <Button variant="surface" size="icon" aria-label="Settings" />
        <Button variant="soft">Arpeggio</Button>
        <Button size="pill">Next</Button>
      </>,
    )
    expect(screen.getByRole('button', { name: 'Settings' })).toHaveClass('rounded-full', 'size-11')
    expect(screen.getByRole('button', { name: 'Arpeggio' })).toHaveClass('bg-secondary', 'h-11')
    expect(screen.getByRole('button', { name: 'Next' })).toHaveClass('h-14', 'rounded-full')
  })
```

Run: `npx vitest run src/shared/ui/primitives/button.test.tsx`
Expected: FAIL (unknown variants).

- [ ] **Step 4: Add the variants and sizes to `button.tsx`**

In `buttonVariants`: change the base class `rounded-lg` to `rounded-2xl` and `text-sm font-medium` to
`text-base font-semibold`; add to `variant`:

```ts
        soft: 'bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_6%)]',
        surface:
          'rounded-full bg-card text-foreground shadow-sm ring-1 ring-border hover:bg-muted aria-expanded:bg-muted',
```

and to `size`:

```ts
        pill: 'h-14 gap-2 rounded-full px-6 text-lg has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5',
        // The Player's one round Play/Stop, 72px.
        play: "size-18 rounded-full [&_svg:not([class*='size-'])]:size-7",
```

Run the test. Expected: PASS.

- [ ] **Step 5: Make the toggles 44px and add the `chip` and `segment` looks (`toggle.tsx`)**

Replace `toggleVariants` with:

```ts
const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1.5 text-base font-semibold whitespace-nowrap transition-all duration-200 ease-out outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'rounded-xl bg-transparent hover:bg-muted aria-pressed:bg-muted data-[pressed]:bg-muted',
        outline: 'rounded-xl border border-input bg-transparent hover:bg-muted',
        // A choice in a scrolling row: roots, families, keys.
        chip: 'rounded-full bg-card px-4 text-foreground ring-1 ring-border hover:bg-muted data-[pressed]:bg-primary data-[pressed]:text-primary-foreground data-[pressed]:ring-primary',
        // A segment of a pill segmented control.
        segment:
          'flex-1 rounded-xl px-3 text-muted-foreground hover:text-foreground data-[pressed]:bg-card data-[pressed]:text-foreground data-[pressed]:shadow-sm',
      },
      size: {
        default: 'h-11 min-w-11 px-3',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)
```

(Base UI marks a pressed toggle with `data-pressed` and `aria-pressed`; confirm the attribute name in
`node_modules/@base-ui/react/toggle` and use the one it sets.)

- [ ] **Step 6: Size the switch and slider for fingers**

`switch.tsx`: default size `h-8 w-13`, thumb `size-7`, checked translate `translate-x-5`, keep the `after:-inset-*`
hit area. `slider.tsx`: track `data-horizontal:h-1.5`; thumb `size-6 border-0 bg-white shadow-md ring-0` with
`after:-inset-2.5` (a 44px hit area); always pass `value` as an array from callers (the registry's single-value
fallback renders two thumbs).

- [ ] **Step 7: Verify and commit**

Run: `npm run typecheck && npm run lint && npm run test`
Expected: all green.

```bash
npx prettier --write src/shared/ui/primitives
git add -A package.json package-lock.json src/shared/ui/primitives components.json
git commit -m "Add the shadcn primitives the screens need, at finger size

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: The app-wide kit in `shared/ui`

**Files:**
- Create: `src/shared/ui/{ScreenHeader,RoundButton,Segmented,ChipRow,RoleLegend,RatingMark,LevelMark,Sheet}.tsx`,
  `src/shared/ui/role-classes.ts`, `src/shared/ui/kit.test.tsx`
- Modify: `src/shared/ui/index.ts`; `src/shared/i18n/locales/{en,ru}/common.ts`; every `ScreenTitle` /
  `SectionTitle` user (Path, Settings, Player, Theory layout, RouteError, NotFound) — switch to `ScreenHeader`;
  delete `ScreenTitle.tsx` and `SectionTitle.tsx`

**Interfaces:**
- Consumes: `Button`, `buttonVariants` (Task 2), `ToggleGroup`, `ToggleGroupItem`, `Drawer*`.
- Produces:
  - `ScreenHeader({ title, back?, actions? }: { title: ReactNode; back?: ReactNode; actions?: ReactNode })` — renders
    the `h1`.
  - `RoundButton({ label, icon, render?, ...ButtonProps })` — `aria-label={label}`; `render` makes it a link.
  - `Segmented<V extends string>({ label, value, options, onChange }: { label: string; value: V; options: readonly
    { value: V; label: string }[]; onChange: (value: V) => void })`
  - `ChipRow<V extends string>({ label, value, options, onChange })` — same props; `options[i].title?` for an
    accessible name different from the visible label.
  - `ROLE_BG: Record<ChordRole, string>`, `ROLE_TEXT: Record<ChordRole, string>` (complete class strings).
  - `RoleLegend({ roles }: { roles: readonly ChordRole[] })`
  - `RatingMark({ rating }: { rating: 'known' | 'gap' | 'unknown' })`
  - `LevelMark({ level }: { level: 1 | 2 | 3 | 4 })`
  - `Sheet` (= `Drawer`), `SheetTrigger`, `SheetClose`, `SheetContent({ title, children, footer? })`

- [ ] **Step 1: Add the common strings**

`src/shared/i18n/locales/en/common.ts` gains (keep the existing keys):

```ts
  close: 'Close',
  more: 'More',
  level: 'Level {{level}}',
  levelName: { 1: 'Beginner', 2: 'Elementary', 3: 'Intermediate', 4: 'Advanced' },
  rating: { known: 'Known', gap: 'Gap', unknown: 'Not checked yet' },
  roles: {
    root: 'Root',
    '3rd': '3rd',
    '5th': '5th',
    '7th': '7th',
    '9th': '9th',
    '11th': '11th',
    '13th': '13th',
  },
  hands: { both: 'Both hands', rh: 'Right hand', lh: 'Left hand' },
  key: { natural: '{{letter}}{{octave}}', sharp: '{{letter}} sharp {{octave}}' },
  keyboard: 'Keyboard',
```

`ru/common.ts`:

```ts
  close: 'Закрыть',
  more: 'Ещё',
  level: 'Уровень {{level}}',
  levelName: { 1: 'Начальный', 2: 'Базовый', 3: 'Средний', 4: 'Продвинутый' },
  rating: { known: 'Знаю', gap: 'Пробел', unknown: 'Ещё не проверено' },
  roles: {
    root: 'Основной тон',
    '3rd': 'Терция',
    '5th': 'Квинта',
    '7th': 'Септима',
    '9th': 'Нона',
    '11th': 'Ундецима',
    '13th': 'Терцдецима',
  },
  hands: { both: 'Обе руки', rh: 'Правая рука', lh: 'Левая рука' },
  key: { natural: '{{letter}}{{octave}}', sharp: '{{letter}}-диез {{octave}}' },
  keyboard: 'Клавиатура',
```

- [ ] **Step 2: Write the failing kit tests**

`src/shared/ui/kit.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Settings } from 'lucide-react'
import { describe, expect, it, vi } from 'vitest'
import { ChipRow } from './ChipRow'
import { LevelMark } from './LevelMark'
import { RatingMark } from './RatingMark'
import { RoleLegend } from './RoleLegend'
import { RoundButton } from './RoundButton'
import { ScreenHeader } from './ScreenHeader'
import { Segmented } from './Segmented'

const MODES = [
  { value: 'listen', label: 'Listen' },
  { value: 'step', label: 'Step' },
  { value: 'turn', label: 'Your turn' },
] as const

describe('ScreenHeader', () => {
  it('titles the screen with its level-1 heading and holds its actions', () => {
    render(<ScreenHeader title="Path" actions={<button type="button">Settings</button>} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Path' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
  })
})

describe('RoundButton', () => {
  it('is named by its label, not its icon', () => {
    render(<RoundButton label="Settings" icon={Settings} />)
    expect(screen.getByRole('button', { name: 'Settings' })).toHaveClass('rounded-full')
  })
})

describe('Segmented', () => {
  it('marks the chosen segment and reports another choice', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Segmented label="Mode" value="step" options={MODES} onChange={onChange} />)
    expect(screen.getByRole('button', { name: 'Step' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'Your turn' }))
    expect(onChange).toHaveBeenCalledWith('turn')
  })

  it('keeps a choice when the chosen segment is pressed again', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Segmented label="Mode" value="step" options={MODES} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Step' }))
    expect(onChange).not.toHaveBeenCalled()
  })
})

describe('ChipRow', () => {
  it('names chips by their title when they have one', () => {
    render(
      <ChipRow
        label="Quality"
        value="d7"
        options={[
          { value: 'maj7', label: 'Maj7', title: 'Major 7th' },
          { value: 'd7', label: '7', title: 'Dominant 7th' },
        ]}
        onChange={() => {}}
      />,
    )
    expect(screen.getByRole('button', { name: 'Dominant 7th' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('group', { name: 'Quality' })).toBeInTheDocument()
  })
})

describe('marks', () => {
  it('names a rating in words', () => {
    render(<RatingMark rating="gap" />)
    expect(screen.getByText('Gap')).toHaveClass('sr-only')
  })

  it('names a level in words', () => {
    render(<LevelMark level={2} />)
    expect(screen.getByRole('img', { name: 'Level 2' })).toBeInTheDocument()
  })

  it('lists the roles it is given, in that order', () => {
    render(<RoleLegend roles={['root', '3rd', '5th', '7th']} />)
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      'Root',
      '3rd',
      '5th',
      '7th',
    ])
  })
})
```

Run: `npx vitest run src/shared/ui/kit.test.tsx`
Expected: FAIL (modules missing).

- [ ] **Step 3: Implement the kit**

`src/shared/ui/role-classes.ts`:

```ts
import type { ChordRole } from '@/shared/lib/music'

/** Complete class strings per chord role, so Tailwind sees every one (CODE_STYLE §4). */
export const ROLE_BG: Readonly<Record<ChordRole, string>> = {
  root: 'bg-role-root',
  '3rd': 'bg-role-3rd',
  '5th': 'bg-role-5th',
  '7th': 'bg-role-7th',
  '9th': 'bg-role-9th',
  '11th': 'bg-role-11th',
  '13th': 'bg-role-13th',
}

export const ROLE_TEXT: Readonly<Record<ChordRole, string>> = {
  root: 'text-role-root',
  '3rd': 'text-role-3rd',
  '5th': 'text-role-5th',
  '7th': 'text-role-7th',
  '9th': 'text-role-9th',
  '11th': 'text-role-11th',
  '13th': 'text-role-13th',
}
```

`src/shared/ui/ScreenHeader.tsx`:

```tsx
import type { ReactNode } from 'react'

/** A screen's large title, with an optional way back before it and actions after it. */
export function ScreenHeader({
  title,
  back,
  actions,
}: {
  title: ReactNode
  back?: ReactNode
  actions?: ReactNode
}) {
  return (
    <header className="flex items-center gap-3 pt-2 pb-4">
      {back}
      <h1 className="min-w-0 flex-1 text-4xl font-bold tracking-tight text-balance">{title}</h1>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  )
}
```

`src/shared/ui/RoundButton.tsx`:

```tsx
import type { LucideIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { Button } from './primitives/button'

/** A 44px round icon button, named by its label; `render` turns it into a link. */
export function RoundButton({
  label,
  icon: Icon,
  render,
  ...props
}: { label: string; icon: LucideIcon } & Omit<ComponentProps<typeof Button>, 'children'>) {
  return (
    <Button
      variant="surface"
      size="icon"
      aria-label={label}
      render={render}
      nativeButton={render === undefined}
      {...props}
    >
      <Icon aria-hidden />
    </Button>
  )
}
```

`src/shared/ui/Segmented.tsx`:

```tsx
import { ToggleGroup, ToggleGroupItem } from './primitives/toggle-group'

export interface Option<V extends string> {
  readonly value: V
  readonly label: string
  /** The accessible name, when the label alone is not enough (`7` → "Dominant 7th"). */
  readonly title?: string
}

/** One choice of a few, always one chosen: a pill segmented control. */
export function Segmented<V extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: V
  options: readonly Option<V>[]
  onChange: (value: V) => void
}) {
  return (
    <ToggleGroup
      aria-label={label}
      value={[value]}
      onValueChange={(next: unknown[]) => {
        const chosen = options.find((option) => option.value !== value && next.includes(option.value))
        if (chosen) onChange(chosen.value)
      }}
      variant="segment"
      spacing={0}
      className="flex w-full gap-1 rounded-2xl bg-muted p-1"
    >
      {options.map((option) => (
        <ToggleGroupItem key={option.value} value={option.value} aria-label={option.title}>
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
```

`src/shared/ui/ChipRow.tsx`:

```tsx
import { ToggleGroup, ToggleGroupItem } from './primitives/toggle-group'
import type { Option } from './Segmented'

/** One choice of many in a row that scrolls sideways past the screen's edge. */
export function ChipRow<V extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: V
  options: readonly Option<V>[]
  onChange: (value: V) => void
}) {
  return (
    <ToggleGroup
      aria-label={label}
      value={[value]}
      onValueChange={(next: unknown[]) => {
        const chosen = options.find((option) => option.value !== value && next.includes(option.value))
        if (chosen) onChange(chosen.value)
      }}
      variant="chip"
      spacing={2}
      className="-mx-4 flex w-auto snap-x overflow-x-auto px-4 pb-1 [scrollbar-width:none]"
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          aria-label={option.title}
          className="snap-start"
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
```

`src/shared/ui/RoleLegend.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import type { ChordRole } from '@/shared/lib/music'
import { cn } from '@/shared/lib'
import { ROLE_BG } from './role-classes'

/** What each key colour means, for the roles on the keyboard now. */
export function RoleLegend({ roles }: { roles: readonly ChordRole[] }) {
  const { t } = useTranslation('common')
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
      {roles.map((role) => (
        <li key={role} className="flex items-center gap-1.5">
          <span aria-hidden className={cn('size-2.5 rounded-full', ROLE_BG[role])} />
          {t(`roles.${role}`)}
        </li>
      ))}
    </ul>
  )
}
```

`src/shared/ui/RatingMark.tsx`:

```tsx
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const LOOK = {
  known: 'bg-primary text-primary-foreground',
  gap: 'bg-attention',
  unknown: 'ring-2 ring-inset ring-border',
} as const

/** Known (a check), a gap (an amber dot) or not checked yet (a ring), named in words. */
export function RatingMark({ rating }: { rating: 'known' | 'gap' | 'unknown' }) {
  const { t } = useTranslation('common')
  return (
    <span className="inline-flex items-center">
      <span
        aria-hidden
        className={`inline-grid place-items-center rounded-full ${rating === 'known' ? 'size-4' : 'size-2.5'} ${LOOK[rating]}`}
      >
        {rating === 'known' ? <Check className="size-3" strokeWidth={3} /> : null}
      </span>
      <span className="sr-only">{t(`rating.${rating}`)}</span>
    </span>
  )
}
```

(Use `cn()` instead of the template string if the linter or a reviewer prefers; both are complete class strings.)

`src/shared/ui/LevelMark.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'

const PIPS = [1, 2, 3, 4] as const

/** A level as four pips, the first `level` filled. */
export function LevelMark({ level }: { level: 1 | 2 | 3 | 4 }) {
  const { t } = useTranslation('common')
  return (
    <span role="img" aria-label={t('level', { level })} className="inline-flex items-end gap-0.5">
      {PIPS.map((pip) => (
        <span
          key={pip}
          className={cn('w-1 rounded-full', pip <= level ? 'bg-primary' : 'bg-border')}
          style={{ height: `${4 + pip * 2}px` }}
        />
      ))}
    </span>
  )
}
```

`src/shared/ui/Sheet.tsx`:

```tsx
import type { ReactNode } from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './primitives/drawer'

export const Sheet = Drawer
export const SheetTrigger = DrawerTrigger
export const SheetClose = DrawerClose

/** A bottom sheet: grab handle, title, a body that scrolls, and an optional footer. */
export function SheetContent({
  title,
  children,
  footer,
}: {
  title: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <DrawerContent className="mx-auto w-full max-w-2xl rounded-t-3xl bg-card">
      <div aria-hidden className="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-border" />
      <DrawerHeader className="px-5 pt-3 text-left">
        <DrawerTitle className="text-xl font-bold">{title}</DrawerTitle>
      </DrawerHeader>
      <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-5 pb-6">{children}</div>
      {footer ? <DrawerFooter className="px-5 pb-safe">{footer}</DrawerFooter> : null}
    </DrawerContent>
  )
}
```

`src/shared/ui/index.ts`:

```ts
export { ChipRow } from './ChipRow'
export { LevelMark } from './LevelMark'
export { RatingMark } from './RatingMark'
export { ROLE_BG, ROLE_TEXT } from './role-classes'
export { RoleLegend } from './RoleLegend'
export { RoundButton } from './RoundButton'
export { ScreenHeader } from './ScreenHeader'
export { Segmented, type Option } from './Segmented'
export { Sheet, SheetClose, SheetContent, SheetTrigger } from './Sheet'
```

Run: `npx vitest run src/shared/ui/kit.test.tsx`
Expected: PASS. If Base UI's `onValueChange` types its argument differently, type the parameter as its declared type
and keep the `includes` check.

- [ ] **Step 4: Replace `ScreenTitle` and `SectionTitle` everywhere**

`grep -rln "ScreenTitle\|SectionTitle" src` and switch each to `ScreenHeader` (`<ScreenHeader title={t('title')} />`;
Path puts its settings link in `actions` as
`<RoundButton label={tCommon('nav.settings')} icon={Settings} render={<Link to="/settings" />} />`; the Player's
`BackButton` becomes the `back` slot). Delete `ScreenTitle.tsx` and `SectionTitle.tsx`.

- [ ] **Step 5: Verify and commit**

Run: `npm run typecheck && npm run lint && npm run test`
Expected: all green (the router tests still find the level-1 headings by name).

```bash
npx prettier --write src/shared/ui src/shared/i18n/locales src/pages src/app
git add -A src/shared/ui src/shared/i18n src/pages src/app
git commit -m "Build the app-wide kit: header, round buttons, segmented rows, marks, sheets

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: `PianoKeyboard`

**Files:**
- Create: `src/shared/ui/piano-keyboard/layout.ts`, `layout.test.ts`, `PianoKeyboard.tsx`, `PianoKeyboard.test.tsx`,
  `index.ts`
- Modify: `src/shared/ui/index.ts`

**Interfaces:**
- Produces:
  - `isBlackKey(midi: number): boolean`
  - `keyboardLayout(from: Midi, to: Midi): { keys: KeyGeometry[]; whites: number }` with
    `KeyGeometry = { midi: Midi; black: boolean; left: number; width: number }` (percent of the width). `from` is
    moved down and `to` up to white keys.
  - `rangeFor(midis: readonly Midi[], fallback: { from: Midi; to: Midi }): { from: Midi; to: Midi }` — the lowest C
    at or below the lowest note to the highest B at or above the highest; the fallback when empty.
  - `KeyTone = ChordRole | 'rh' | 'lh' | 'melody' | 'selected'`; `KeyMark = { tone: KeyTone; label?: string }`
  - `PianoKeyboard(props: { label: string; from: Midi; to: Midi; marks?: ReadonlyMap<Midi, KeyMark>;
    pressed?: ReadonlySet<Midi>; outlined?: ReadonlySet<Midi>; wrong?: ReadonlySet<Midi>; selectable?: boolean;
    selected?: ReadonlySet<Midi>; onKeyPress?: (midi: Midi) => void; minWhiteWidth?: number; centre?: Midi | null;
    className?: string })`

- [ ] **Step 1: Write the failing layout tests**

`layout.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { isBlackKey, keyboardLayout, rangeFor } from './layout'

describe('keyboardLayout', () => {
  it('lays one octave out as 7 white keys with 5 black keys between them', () => {
    const { keys, whites } = keyboardLayout(midi(60), midi(71))
    expect(whites).toBe(7)
    expect(keys.filter((key) => key.black).map((key) => key.midi)).toEqual([61, 63, 66, 68, 70])
    const c = keys.find((key) => key.midi === 60)
    const cSharp = keys.find((key) => key.midi === 61)
    expect(c).toMatchObject({ left: 0, width: 100 / 7, black: false })
    expect(cSharp?.left).toBeCloseTo(100 / 7 - (100 / 7) * 0.31)
    expect(cSharp?.width).toBeCloseTo((100 / 7) * 0.62)
  })

  it('widens a range that starts or ends on a black key to the white keys beside it', () => {
    const { keys } = keyboardLayout(midi(61), midi(70))
    expect(keys[0]?.midi).toBe(60)
    expect(keys.at(-1)?.midi).toBe(70)
    expect(keys.filter((key) => !key.black).at(-1)?.midi).toBe(71)
  })

  it('knows the black keys', () => {
    expect([60, 61, 62, 63, 64, 65, 66].map(isBlackKey)).toEqual([
      false, true, false, true, false, false, true,
    ])
  })
})

describe('rangeFor', () => {
  it('runs from the C below the lowest note to the B above the highest', () => {
    expect(rangeFor([midi(62), midi(79)], { from: midi(60), to: midi(71) })).toEqual({
      from: 60,
      to: 83,
    })
  })

  it('falls back when there are no notes', () => {
    expect(rangeFor([], { from: midi(48), to: midi(71) })).toEqual({ from: 48, to: 71 })
  })
})
```

Run: `npx vitest run src/shared/ui/piano-keyboard/layout.test.ts`
Expected: FAIL.

- [ ] **Step 2: Implement `layout.ts`**

```ts
import { midi, type Midi } from '@/shared/lib/music'

const BLACK = new Set([1, 3, 6, 8, 10])
/** A black key sits over the gap between two white keys, 62% as wide as a white key. */
const BLACK_WIDTH = 0.62

export const isBlackKey = (key: number): boolean => BLACK.has(((key % 12) + 12) % 12)

export interface KeyGeometry {
  readonly midi: Midi
  readonly black: boolean
  /** Percent of the keyboard's width. */
  readonly left: number
  readonly width: number
}

/** Every key from `from` to `to` (widened to white keys), placed in percent of the width. */
export function keyboardLayout(from: Midi, to: Midi): { keys: KeyGeometry[]; whites: number } {
  let low: number = from
  let high: number = to
  while (isBlackKey(low)) low--
  while (isBlackKey(high)) high++
  const whiteKeys: number[] = []
  for (let key = low; key <= high; key++) if (!isBlackKey(key)) whiteKeys.push(key)
  const width = 100 / whiteKeys.length
  const keys: KeyGeometry[] = []
  for (let key = low; key <= high; key++) {
    if (!isBlackKey(key)) {
      keys.push({ midi: midi(key), black: false, left: whiteKeys.indexOf(key) * width, width })
    } else {
      const below = whiteKeys.indexOf(key - 1)
      const left = (below + 1) * width - (width * BLACK_WIDTH) / 2
      keys.push({ midi: midi(key), black: true, left, width: width * BLACK_WIDTH })
    }
  }
  return { keys, whites: whiteKeys.length }
}

/** From the C at or below the lowest note to the B at or above the highest; the fallback if none. */
export function rangeFor(
  keys: readonly Midi[],
  fallback: { from: Midi; to: Midi },
): { from: Midi; to: Midi } {
  if (keys.length === 0) return fallback
  const low = Math.min(...keys)
  const high = Math.max(...keys)
  return { from: midi(low - (low % 12)), to: midi(high + 11 - (high % 12)) }
}
```

Run the layout tests. Expected: PASS.

- [ ] **Step 3: Write the failing component tests**

`PianoKeyboard.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { midi, type Midi } from '@/shared/lib/music'
import { type KeyMark, PianoKeyboard } from './PianoKeyboard'

const C4 = midi(60)
const B4 = midi(71)

describe('PianoKeyboard', () => {
  it('is a labelled group of keys named by note', () => {
    render(<PianoKeyboard label="Keyboard" from={C4} to={B4} />)
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    const names = within(keyboard).getAllByRole('button').map((key) => key.getAttribute('aria-label'))
    expect(names).toEqual([
      'C4', 'C sharp 4', 'D4', 'D sharp 4', 'E4', 'F4', 'F sharp 4', 'G4', 'G sharp 4', 'A4',
      'A sharp 4', 'B4',
    ])
  })

  it('reports a pressed key', async () => {
    const user = userEvent.setup()
    const onKeyPress = vi.fn()
    render(<PianoKeyboard label="Keyboard" from={C4} to={B4} onKeyPress={onKeyPress} />)
    await user.click(screen.getByRole('button', { name: 'F sharp 4' }))
    expect(onKeyPress).toHaveBeenCalledWith(66)
  })

  it('shows a mark with its label and colour', () => {
    const marks = new Map<Midi, KeyMark>([[midi(62), { tone: 'root', label: '1' }]])
    render(<PianoKeyboard label="Keyboard" from={C4} to={B4} marks={marks} />)
    const d = screen.getByRole('button', { name: 'D4' })
    expect(d).toHaveTextContent('1')
    expect(d).toHaveClass('bg-role-root')
  })

  it('makes keys toggles when they are selectable', () => {
    render(
      <PianoKeyboard label="Keyboard" from={C4} to={B4} selectable selected={new Set([C4])} />,
    )
    expect(screen.getByRole('button', { name: 'C4' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'D4' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('shows a wrong key and an outlined one', () => {
    render(
      <PianoKeyboard
        label="Keyboard"
        from={C4}
        to={B4}
        wrong={new Set([midi(64)])}
        outlined={new Set([midi(67)])}
      />,
    )
    expect(screen.getByRole('button', { name: 'E4' })).toHaveClass('bg-destructive')
    expect(screen.getByRole('button', { name: 'G4' })).toHaveClass('ring-primary')
  })
})
```

Run: `npx vitest run src/shared/ui/piano-keyboard/PianoKeyboard.test.tsx`
Expected: FAIL.

- [ ] **Step 4: Implement `PianoKeyboard.tsx`**

```tsx
import { memo, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { ChordRole, Midi } from '@/shared/lib/music'
import { cn } from '@/shared/lib'
import { ROLE_BG } from '../role-classes'
import { keyboardLayout } from './layout'

export type KeyTone = ChordRole | 'rh' | 'lh' | 'melody' | 'selected'
export interface KeyMark {
  readonly tone: KeyTone
  readonly label?: string
}

const TONE_BG: Readonly<Record<KeyTone, string>> = {
  ...ROLE_BG,
  rh: 'bg-hand-rh',
  lh: 'bg-hand-lh',
  melody: 'bg-hand-melody',
  selected: 'bg-primary',
}

const LETTERS = ['C', 'C', 'D', 'D', 'E', 'F', 'F', 'G', 'G', 'A', 'A', 'B'] as const

interface KeyProps {
  readonly midi: Midi
  readonly black: boolean
  readonly left: number
  readonly width: number
  readonly name: string
  readonly mark: KeyMark | undefined
  readonly pressed: boolean
  readonly outlined: boolean
  readonly wrong: boolean
  readonly selectable: boolean
  readonly selected: boolean
  readonly onKeyPress: ((midi: Midi) => void) | undefined
}

const Key = memo(function Key(props: KeyProps) {
  const { black, mark } = props
  const face = props.wrong
    ? 'bg-destructive text-on-role'
    : mark
      ? cn(TONE_BG[mark.tone], 'text-on-role')
      : props.pressed
        ? 'bg-key-pressed'
        : black
          ? 'bg-key-black'
          : 'bg-key-white'
  return (
    <button
      type="button"
      aria-label={props.name}
      data-midi={props.midi}
      aria-pressed={props.selectable ? props.selected : undefined}
      onClick={props.onKeyPress ? () => props.onKeyPress?.(props.midi) : undefined}
      className={cn(
        'absolute top-0 flex items-end justify-center transition-colors duration-100 ease-out outline-none focus-visible:z-20 focus-visible:ring-3 focus-visible:ring-ring',
        black
          ? 'z-10 h-[62%] rounded-b-md pb-1.5'
          : 'h-full rounded-b-lg border border-t-0 border-key-white-edge pb-2.5',
        face,
        props.outlined && 'ring-3 ring-primary ring-inset',
      )}
      style={{ left: `${props.left}%`, width: `${props.width}%` }}
    >
      {mark?.label ? (
        <span aria-hidden className="text-sm font-bold tabular-nums">
          {mark.label}
        </span>
      ) : null}
    </button>
  )
})

/** The one keyboard (spec §8): keys are buttons named by note; marks colour and label them. */
export function PianoKeyboard({
  label,
  from,
  to,
  marks,
  pressed,
  outlined,
  wrong,
  selectable = false,
  selected,
  onKeyPress,
  minWhiteWidth = 0,
  centre = null,
  className,
}: {
  label: string
  from: Midi
  to: Midi
  marks?: ReadonlyMap<Midi, KeyMark>
  pressed?: ReadonlySet<Midi>
  outlined?: ReadonlySet<Midi>
  /** Keys shown red: a wrong key in Your turn, the extra keys of a quiz answer. */
  wrong?: ReadonlySet<Midi>
  selectable?: boolean
  selected?: ReadonlySet<Midi>
  onKeyPress?: (midi: Midi) => void
  /** Pixels; past it the keyboard scrolls sideways instead of shrinking the keys. */
  minWhiteWidth?: number
  /** A key to keep in view while the keyboard scrolls. */
  centre?: Midi | null
  className?: string
}) {
  const { t } = useTranslation('common')
  const { keys, whites } = keyboardLayout(from, to)
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = scroller.current
    const key = keys.find((k) => k.midi === centre)
    if (!element || !key || element.scrollWidth <= element.clientWidth) return
    const middle = ((key.left + key.width / 2) / 100) * element.scrollWidth
    element.scrollTo({ left: middle - element.clientWidth / 2, behavior: 'smooth' })
  }, [centre, keys])

  const nameOf = (key: Midi) => {
    const octave = Math.floor(key / 12) - 1
    const letter = LETTERS[key % 12] ?? 'C'
    return t(isSharp(key) ? 'key.sharp' : 'key.natural', { letter, octave })
  }

  return (
    <div ref={scroller} className={cn('overflow-x-auto [scrollbar-width:none]', className)}>
      <div
        role="group"
        aria-label={label}
        className="relative h-full"
        style={minWhiteWidth ? { minWidth: `${whites * minWhiteWidth}px` } : undefined}
      >
        {keys.map((key) => (
          <Key
            key={key.midi}
            midi={key.midi}
            black={key.black}
            left={key.left}
            width={key.width}
            name={nameOf(key.midi)}
            mark={marks?.get(key.midi)}
            pressed={pressed?.has(key.midi) ?? false}
            outlined={outlined?.has(key.midi) ?? false}
            wrong={wrong?.has(key.midi) ?? false}
            selectable={selectable}
            selected={selected?.has(key.midi) ?? false}
            onKeyPress={onKeyPress}
          />
        ))}
      </div>
    </div>
  )
}

const isSharp = (key: number) => [1, 3, 6, 8, 10].includes(key % 12)
```

`index.ts`:

```ts
export { isBlackKey, keyboardLayout, rangeFor, type KeyGeometry } from './layout'
export { PianoKeyboard, type KeyMark, type KeyTone } from './PianoKeyboard'
```

and export them from `src/shared/ui/index.ts`. The `h-[62%]` is a geometry ratio, not a spacing value; if the lint or
review rejects it, add `--keyboard-black-height: 62%` to `theme.css` as `@utility h-black-key` and use that.

Run both keyboard test files. Expected: PASS. (`useTranslation` works without a provider: the i18n instance is
initialised by the test setup.)

- [ ] **Step 5: Verify and commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
npx prettier --write src/shared/ui
git add -A src/shared/ui
git commit -m "Draw one keyboard for every screen, keys named by note and marked by role or hand

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: The shell in the new world

**Files:**
- Modify: `src/widgets/app-nav/ui/AppNav.tsx`, `src/widgets/theory-nav/ui/TheoryNav.tsx`, `src/app/AppShell.tsx`,
  `src/app/FullScreenLayout.tsx`, `src/app/TheoryLayout.tsx`, `src/app/RouteError.tsx`,
  `src/app/update-prompt/UpdateBanner.tsx`, `src/pages/not-found/ui/NotFoundPage.tsx`, `src/app/router.tsx`
- Create: `src/app/RoutePending.tsx`
- Test: `src/app/router.test.tsx` (existing tests stay green; add one), `src/app/RouteError.test.tsx`

**Interfaces:**
- Produces: `RoutePending` (the router's `defaultPendingComponent`), the floating tab bar.

- [ ] **Step 1: Write the failing test for the pending screen**

Append to `src/app/router.test.tsx` inside `describe('routes', …)`:

```tsx
  it('waits for a slow screen with a spinner, not a blank page', async () => {
    const router = await open('/')
    expect(router.options.defaultPendingComponent).toBeDefined()
    expect(router.options.defaultPendingMs).toBe(300)
  })
```

Run: `npx vitest run src/app/router.test.tsx -t "slow screen"`
Expected: FAIL.

- [ ] **Step 2: Add `RoutePending` and wire it**

`src/app/RoutePending.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { Spinner } from '@/shared/ui/primitives/spinner'

/** Shown while a screen's chunk loads, after 300ms; chunks are precached, so rarely seen. */
export function RoutePending() {
  const { t } = useTranslation('common')
  return (
    <div role="status" aria-label={t('loading')} className="grid min-h-[50dvh] place-items-center">
      <Spinner />
    </div>
  )
}
```

Add `loading: 'Loading'` / `loading: 'Загрузка'` to `common`. In `createAppRouter` add
`defaultPendingComponent: RoutePending, defaultPendingMs: 300`. (`min-h-[50dvh]`: if lint objects, use `min-h-96`.)

Run the test. Expected: PASS.

- [ ] **Step 3: The floating tab bar (`AppNav.tsx`)**

```tsx
import { Link } from '@tanstack/react-router'
import { BookOpen, Music, Route } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const ITEMS = [
  { to: '/', label: 'nav.path', icon: Route, exact: true },
  { to: '/songs', label: 'nav.songs', icon: Music, exact: false },
  { to: '/theory', label: 'nav.theory', icon: BookOpen, exact: false },
] as const

/** A floating glass pill on phones; a left rail from 1024px. */
export function AppNav() {
  const { t } = useTranslation('common')
  return (
    <nav
      aria-label={t('nav.label')}
      className="fixed inset-x-0 bottom-safe z-30 flex justify-center px-4 lg:inset-y-0 lg:right-auto lg:left-0 lg:block lg:w-24 lg:px-0"
    >
      <ul className="flex gap-1 rounded-full bg-glass p-1.5 shadow-lg ring-1 ring-border backdrop-blur-xl lg:h-full lg:flex-col lg:gap-2 lg:rounded-none lg:bg-card lg:px-2 lg:pt-6 lg:shadow-none lg:ring-0 lg:backdrop-blur-none">
        {ITEMS.map(({ to, label, icon: Icon, exact }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact }}
              className="flex h-14 w-24 flex-col items-center justify-center gap-0.5 rounded-full text-xs font-semibold text-foreground transition-colors duration-200 ease-out hover:text-primary data-[status=active]:bg-primary/12 data-[status=active]:text-primary lg:w-20 lg:rounded-2xl"
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

`AppShell.tsx`: `<main className="mx-auto max-w-2xl px-4 pt-safe pb-32 lg:pb-10">`.
`FullScreenLayout.tsx`: `<main className="mx-auto flex min-h-dvh max-w-5xl flex-col px-4 pt-safe pb-safe">`.
`UpdateBanner.tsx`: `bottom-28 lg:bottom-4`, `rounded-3xl`, `shadow-lg`.

- [ ] **Step 4: Theory's section switch as segmented links (`TheoryNav.tsx`)**

```tsx
<nav aria-label={t('tabs.label')} className="mb-5">
  <ul className="flex gap-1 rounded-2xl bg-muted p-1">
    {TABS.map(({ to, label }) => (
      <li key={to} className="flex-1">
        <Link
          to={to}
          className="flex h-11 items-center justify-center rounded-xl px-2 text-sm font-semibold text-muted-foreground transition-colors duration-200 ease-out hover:text-foreground data-[status=active]:bg-card data-[status=active]:text-foreground data-[status=active]:shadow-sm"
        >
          {t(label)}
        </Link>
      </li>
    ))}
  </ul>
</nav>
```

`TheoryLayout.tsx` uses `<ScreenHeader title={t('title')} />`.

- [ ] **Step 5: Not found and the route error as `Empty`**

`NotFoundPage.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from '@/shared/ui/primitives/empty'

export function NotFoundPage() {
  const { t } = useTranslation('common')
  return (
    <Empty className="min-h-[60dvh]">
      <EmptyHeader>
        <EmptyTitle render={<h1 />}>{t('notFound.title')}</EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <Button render={<Link to="/songs" />} nativeButton={false}>
          {t('notFound.toSongs')}
        </Button>
      </EmptyContent>
    </Empty>
  )
}
```

(If the registry's `EmptyTitle` is a plain `div` without `render`, render `<h1 className="text-xl font-bold">`
inside `EmptyHeader` instead; the router test finds the heading by name.) `RouteError.tsx` gets the same `Empty`
shape inside `role="alert"`, keeping its title and Reload button.

- [ ] **Step 6: Verify and commit**

Run: `npm run typecheck && npm run lint && npm run test && npm run build`
Expected: all green, including the existing navigation tests (`aria-current="page"` on the active link).

```bash
npx prettier --write src/app src/widgets src/pages/not-found src/shared/i18n/locales
git add -A src/app src/widgets src/pages/not-found src/shared/i18n
git commit -m "Float the tab bar and restyle the shell, not found and errors

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---
### Task 6: Kernel additions — explorer voicing, scale steps, relatives, URL spelling

**Files:**
- Create: `src/shared/lib/music/voicing.ts`, `voicing.test.ts`
- Modify: `src/shared/lib/music/scale.ts`, `scale.test.ts`, `note.ts`, `note.test.ts`, `index.ts`

**Interfaces:**
- Produces:
  - `chordVoicing(root: SpelledNote, quality: ChordQuality, options: { inversion: number; bothHands: boolean }):
    ChordVoicing` with `ChordVoicing = { rh: readonly PlacedTone[]; lh: readonly PlacedTone[] }`,
    `PlacedTone = { tone: Tone; midi: Midi }`. The right hand starts on the root at or above middle C; each inversion
    moves the lowest tone up an octave (at most 3); `bothHands` adds the root an octave below in the left hand.
  - `ScaleStep = 'H' | 'W' | 'W+H'`; `scaleSteps(kind: ScaleKind): ScaleStep[]`
  - `relativeScale(root: SpelledNote, kind: ScaleKind): { root: SpelledNote; kind: ScaleKind } | null`
  - `noteParam(note: SpelledNote): string` — `Bb`, `F#`, read back by `parseNoteName`.

- [ ] **Step 1: Write the failing tests**

`voicing.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { chordVoicing } from './voicing'
import { note } from './note'

const keys = (placed: readonly { midi: number }[]) => placed.map((p) => p.midi)

describe('chordVoicing', () => {
  it('plays C major from middle C in root position', () => {
    const voicing = chordVoicing(note('C'), 'maj', { inversion: 0, bothHands: false })
    expect(keys(voicing.rh)).toEqual([60, 64, 67])
    expect(voicing.lh).toEqual([])
  })

  it('moves the lowest tone up an octave for each inversion', () => {
    expect(keys(chordVoicing(note('C'), 'maj', { inversion: 1, bothHands: false }).rh)).toEqual([
      64, 67, 72,
    ])
    expect(keys(chordVoicing(note('C'), 'maj', { inversion: 2, bothHands: false }).rh)).toEqual([
      67, 72, 76,
    ])
    expect(keys(chordVoicing(note('G'), 'd7', { inversion: 3, bothHands: false }).rh)).toEqual([
      77, 79, 83, 86,
    ])
  })

  it('keeps to the inversions a chord has, and at most the third', () => {
    expect(keys(chordVoicing(note('C'), 'maj', { inversion: 5, bothHands: false }).rh)).toEqual([
      67, 72, 76,
    ])
    expect(
      keys(chordVoicing(note('C'), 'm69', { inversion: 4, bothHands: false }).rh),
    ).toEqual(keys(chordVoicing(note('C'), 'm69', { inversion: 3, bothHands: false }).rh))
  })

  it('adds the root an octave below in the left hand for both hands', () => {
    const voicing = chordVoicing(note('B', -1), 'maj7', { inversion: 0, bothHands: true })
    expect(keys(voicing.lh)).toEqual([58])
    expect(voicing.lh[0]?.tone.role).toBe('root')
    expect(voicing.rh.map((p) => p.tone.degree)).toEqual(['1', '3', '5', '7'])
  })
})
```

Append to `scale.test.ts`:

```ts
describe('scaleSteps', () => {
  it('names the steps up to the octave', () => {
    expect(scaleSteps('major')).toEqual(['W', 'W', 'H', 'W', 'W', 'W', 'H'])
    expect(scaleSteps('harmonic')).toEqual(['W', 'H', 'W', 'W', 'H', 'W+H', 'H'])
    expect(scaleSteps('blues')).toEqual(['W+H', 'W', 'H', 'H', 'W+H', 'W'])
  })
})

describe('relativeScale', () => {
  it('pairs a major scale with the natural minor on its 6th', () => {
    expect(relativeScale(note('E', -1), 'major')).toEqual({ root: note('C'), kind: 'natural' })
  })

  it('gives the minors their relative major on the 3rd', () => {
    expect(relativeScale(note('A'), 'natural')).toEqual({ root: note('C'), kind: 'major' })
    expect(relativeScale(note('G', 1), 'harmonic')).toEqual({ root: note('B'), kind: 'major' })
  })

  it('pairs the pentatonics, and has none for the blues', () => {
    expect(relativeScale(note('C'), 'pent')).toEqual({ root: note('A'), kind: 'mpent' })
    expect(relativeScale(note('A'), 'mpent')).toEqual({ root: note('C'), kind: 'pent' })
    expect(relativeScale(note('C'), 'blues')).toBeNull()
  })
})
```

(import `relativeScale`, `scaleSteps` from `./scale` and `note` from `./note` at the top of the file.)

Append to `note.test.ts`:

```ts
describe('noteParam', () => {
  it('writes a note for a URL with ASCII accidentals that parseNoteName reads back', () => {
    for (const spelled of [note('B', -1), note('F', 1), note('C'), note('E', -2)]) {
      expect(parseNoteName(noteParam(spelled))).toEqual(spelled)
    }
    expect(noteParam(note('B', -1))).toBe('Bb')
    expect(noteParam(note('F', 1))).toBe('F#')
  })
})
```

Run: `npx vitest run src/shared/lib/music`
Expected: FAIL (missing exports).

- [ ] **Step 2: Implement**

`voicing.ts`:

```ts
import { spellChord, type ChordQuality } from './chord'
import { pitchClassOf, type SpelledNote } from './note'
import { midi, type Midi } from './pitch'
import type { Tone } from './tone'

export interface PlacedTone {
  readonly tone: Tone
  readonly midi: Midi
}

export interface ChordVoicing {
  readonly rh: readonly PlacedTone[]
  readonly lh: readonly PlacedTone[]
}

const MIDDLE_C = 60
/** The explorer offers root position and the first three inversions. */
const LAST_INVERSION = 3

/**
 * A chord as the Chords explorer shows it: the right hand from the root at or above middle C, each
 * inversion moving the lowest tone up an octave, and for both hands the root an octave below.
 */
export function chordVoicing(
  root: SpelledNote,
  quality: ChordQuality,
  options: { readonly inversion: number; readonly bothHands: boolean },
): ChordVoicing {
  const tones = spellChord(root, quality)
  const base = MIDDLE_C + pitchClassOf(root)
  const placed = tones.map((tone) => ({ tone, key: base + tone.semitones }))
  const inversion = Math.max(0, Math.min(options.inversion, tones.length - 1, LAST_INVERSION))
  for (let k = 0; k < inversion; k++) {
    placed.sort((a, b) => a.key - b.key)
    const lowest = placed[0]
    if (lowest) lowest.key += 12
  }
  placed.sort((a, b) => a.key - b.key)
  const first = tones[0]
  return {
    rh: placed.map(({ tone, key }) => ({ tone, midi: midi(key) })),
    lh: options.bothHands && first ? [{ tone: first, midi: midi(base - 12) }] : [],
  }
}
```

`scale.ts` — add:

```ts
export type ScaleStep = 'H' | 'W' | 'W+H'
const STEP_NAMES: Readonly<Record<number, ScaleStep>> = { 1: 'H', 2: 'W', 3: 'W+H' }

/** The steps between neighbouring notes up to the octave: W, H, or W+H for three semitones. */
export function scaleSteps(kind: ScaleKind): ScaleStep[] {
  const semitones = [...scaleIntervals(kind).map((interval) => interval.semitones), 12]
  return semitones.slice(1).map((above, i) => {
    const step = STEP_NAMES[above - (semitones[i] ?? 0)]
    if (!step) throw new RangeError(`${kind} has a step of ${above - (semitones[i] ?? 0)}`)
    return step
  })
}

/** Each scale's relative: which kind, on which of its degrees (index into its notes). */
const RELATIVES: Partial<Record<ScaleKind, { readonly kind: ScaleKind; readonly degree: number }>> = {
  major: { kind: 'natural', degree: 5 },
  natural: { kind: 'major', degree: 2 },
  harmonic: { kind: 'major', degree: 2 },
  melodic: { kind: 'major', degree: 2 },
  pent: { kind: 'mpent', degree: 4 },
  mpent: { kind: 'pent', degree: 1 },
}

/** The relative major or minor, spelled from the scale's own notes; none for the blues. */
export function relativeScale(
  root: SpelledNote,
  kind: ScaleKind,
): { root: SpelledNote; kind: ScaleKind } | null {
  const relative = RELATIVES[kind]
  const tone = relative ? spellScale(root, kind)[relative.degree] : undefined
  return relative && tone ? { root: tone.note, kind: relative.kind } : null
}
```

`note.ts` — add:

```ts
/** A note as a URL writes it, ASCII `b` and `#` (`Bb`, `F#`); parseNoteName reads it back. */
export const noteParam = (spelled: SpelledNote): string =>
  spelled.letter +
  (spelled.accidental < 0 ? 'b'.repeat(-spelled.accidental) : '#'.repeat(spelled.accidental))
```

`index.ts` — export `noteParam` from `./note`, `relativeScale, scaleSteps, type ScaleStep` from `./scale`, and
`export { chordVoicing, type ChordVoicing, type PlacedTone } from './voicing'`.

Run: `npx vitest run src/shared/lib/music`
Expected: PASS.

- [ ] **Step 3: Commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
npx prettier --write src/shared/lib/music
git add src/shared/lib/music
git commit -m "Voice explorer chords, name scale steps and relatives, spell notes for URLs

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Search-param validators and search folding

**Files:**
- Create: `src/shared/lib/search-params.ts`, `search-params.test.ts`, `fold-text.ts`, `fold-text.test.ts`
- Modify: `src/shared/lib/index.ts`

**Interfaces:**
- Produces:
  - `valueOr<T>(is: (value: unknown) => value is T, raw: unknown, fallback: T): T`
  - `wholeIn(raw: unknown, min: number, max: number, fallback: number): number`
  - `noteIn(raw: unknown, fallback: string): string` — a note with at most one accidental, re-written by `noteParam`
  - `foldText(text: string): string`; `matchesQuery(fields: readonly string[], query: string): boolean`

- [ ] **Step 1: Write the failing tests**

`search-params.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { isOneOf } from './is-one-of'
import { noteIn, valueOr, wholeIn } from './search-params'

const isMode = isOneOf(['listen', 'step', 'turn'] as const)

describe('valueOr', () => {
  it('keeps a value the guard accepts and replaces anything else', () => {
    expect(valueOr(isMode, 'step', 'listen')).toBe('step')
    expect(valueOr(isMode, 'dance', 'listen')).toBe('listen')
    expect(valueOr(isMode, 3, 'listen')).toBe('listen')
  })
})

describe('wholeIn', () => {
  it('reads a whole number in range, written as a number or as text', () => {
    expect(wholeIn(72, 40, 160, 80)).toBe(72)
    expect(wholeIn('96', 40, 160, 80)).toBe(96)
  })

  it('falls back for anything out of range, fractional or not a number', () => {
    for (const raw of [999, 39, 72.5, 'fast', '', null, undefined, [72]]) {
      expect(wholeIn(raw, 40, 160, 80)).toBe(80)
    }
  })
})

describe('noteIn', () => {
  it('reads a note with at most one sharp or flat, written the URL way', () => {
    expect(noteIn('Bb', 'C')).toBe('Bb')
    expect(noteIn('B♭', 'C')).toBe('Bb')
    expect(noteIn('F#', 'C')).toBe('F#')
  })

  it('falls back for a double accidental, H, lower case or not a note', () => {
    for (const raw of ['Ebb', 'H', 'c', '', 7]) expect(noteIn(raw, 'C')).toBe('C')
  })
})
```

`fold-text.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { foldText, matchesQuery } from './fold-text'

describe('foldText', () => {
  it('ignores case, accents and the dots on ё', () => {
    expect(foldText('Ёлочка')).toBe(foldText('елочка'))
    expect(foldText('Café')).toBe('cafe')
  })
})

describe('matchesQuery', () => {
  it('finds the query in any field', () => {
    expect(matchesQuery(['Мир, душа, храни', 'Still, my soul'], 'ДУША')).toBe(true)
    expect(matchesQuery(['Silent Night'], 'night')).toBe(true)
    expect(matchesQuery(['Silent Night'], 'grace')).toBe(false)
  })

  it('matches everything for an empty or blank query', () => {
    expect(matchesQuery(['Silent Night'], '   ')).toBe(true)
  })
})
```

Run: `npx vitest run src/shared/lib/search-params.test.ts src/shared/lib/fold-text.test.ts`
Expected: FAIL.

- [ ] **Step 2: Implement**

`search-params.ts`:

```ts
import { noteParam, parseNoteName } from '@/shared/lib/music'

/** `raw` when the guard accepts it, else the fallback: the one rule for a search param. */
export const valueOr = <T>(is: (value: unknown) => value is T, raw: unknown, fallback: T): T =>
  is(raw) ? raw : fallback

/** A whole number from min to max, as a number or as text; else the fallback. */
export function wholeIn(raw: unknown, min: number, max: number, fallback: number): number {
  const value = typeof raw === 'string' && raw.trim() !== '' ? Number(raw) : raw
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max
    ? value
    : fallback
}

/** A note with at most one sharp or flat, written back the URL way (`Bb`); else the fallback. */
export function noteIn(raw: unknown, fallback: string): string {
  const note = typeof raw === 'string' ? parseNoteName(raw) : null
  return note && Math.abs(note.accidental) <= 1 ? noteParam(note) : fallback
}
```

`fold-text.ts`:

```ts
/** Text as search compares it: lower case, without accents (so ё reads as е). */
export const foldText = (text: string): string =>
  text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

/** Whether any field holds the query; a blank query matches everything. */
export function matchesQuery(fields: readonly string[], query: string): boolean {
  const wanted = foldText(query.trim())
  return wanted === '' || fields.some((field) => foldText(field).includes(wanted))
}
```

Add to `src/shared/lib/index.ts`:

```ts
export { foldText, matchesQuery } from './fold-text'
export { noteIn, valueOr, wholeIn } from './search-params'
```

Run the two test files. Expected: PASS.

- [ ] **Step 3: Commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
npx prettier --write src/shared/lib
git add src/shared/lib
git commit -m "Validate search params and fold text for search

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Sounds for bars, chords and scale practice

**Files:**
- Create: `src/shared/lib/schedule/sounds.ts`, `sounds.test.ts`
- Modify: `src/shared/lib/schedule/index.ts`

**Interfaces:**
- Consumes: `schedule(performance, options)`, `Audible`, `Hands`, `NoteSound`, `Sound` (schedule).
- Produces:
  - `barSounds(performance: Performance, bar: number, options: { tempo: number; hands: Audible }): Sound[]`
  - `chordSounds(keys: readonly Midi[], options: { arpeggio: boolean }): NoteSound[]`
  - `PRACTICE_RHYTHMS: Record<PracticeRhythm, readonly number[]>`, `PRACTICE_RHYTHM_IDS: readonly PracticeRhythm[]`,
    `PracticeRhythm = 'even' | 'long-short' | 'short-long' | 'long-short-short-short' | 'short-short-short-long'`
  - `scaleRun(keys: readonly Midi[], options: { rhythm: PracticeRhythm; tempo: number; hands: Hands }): ScaleRun`
    with `ScaleRun = { sounds: readonly NoteSound[]; steps: readonly { key: Midi; at: number }[]; end: number }`.
    `keys` are the scale's keys ascending including the octave, as the keyboard shows them; the run goes up and back
    down in eighth notes; `steps` name the shown key sounding at each time.

- [ ] **Step 1: Write the failing tests**

`sounds.test.ts` (the fixture is built the way `schedule.test.ts` builds its own; `shared` may not import the
Player's fixtures in `features`):

```ts
import { describe, expect, it } from 'vitest'
import { arrange, parseFigure, type Chart } from '@/shared/lib/arrangement'
import { midi, note, parseChordSymbol, type Midi } from '@/shared/lib/music'
import { audibleHands } from './schedule'
import { barSounds, chordSounds, PRACTICE_RHYTHMS, scaleRun } from './sounds'

const bar = (symbol: string) => ({ chords: [{ ...parseChordSymbol(symbol), beats: 4 }], beats: 4 })
const TWO_BARS_CHART: Chart = {
  key: { tonic: note('C'), mode: 'major' },
  beatsPerBar: 4,
  sections: [{ lines: [[bar('C'), bar('G')]] }],
}
const BEATS = {
  id: 'beats',
  rh: { kind: 'events', events: parseFigure('0/4 C,4/4 C,8/4 C,12/4 C') },
  lh: { kind: 'events', events: parseFigure('0/16 L1') },
} as const
const FIXTURE = arrange(TWO_BARS_CHART, { tonic: note('C'), pattern: BEATS })
const C_MAJOR: Midi[] = [60, 62, 64, 65, 67, 69, 71, 72].map(midi)

describe('barSounds', () => {
  it('plays only the bar asked for, from its first beat', () => {
    const sounds = barSounds(FIXTURE, 1, { tempo: 60, hands: audibleHands('both') })
    expect(sounds.length).toBeGreaterThan(0)
    expect(Math.min(...sounds.map((s) => s.at))).toBe(0)
    expect(Math.max(...sounds.map((s) => s.at))).toBeLessThan(4)
  })

  it('plays nothing for a bar the piece does not have', () => {
    expect(barSounds(FIXTURE, 9, { tempo: 60, hands: audibleHands('both') })).toEqual([])
  })
})

describe('chordSounds', () => {
  it('strikes a chord at once, low to high', () => {
    const sounds = chordSounds([midi(67), midi(60), midi(64)], { arpeggio: false })
    expect(sounds.map((s) => [s.midi, s.at])).toEqual([
      [60, 0],
      [64, 0],
      [67, 0],
    ])
  })

  it('rolls an arpeggio upwards', () => {
    const at = chordSounds([midi(60), midi(64), midi(67)], { arpeggio: true }).map((s) => s.at)
    expect(at[0]).toBe(0)
    expect(at[1]).toBeGreaterThan(0)
    expect(at[2]).toBeGreaterThan(at[1] ?? 0)
  })
})

describe('scaleRun', () => {
  it('goes up and back down in even eighth notes', () => {
    const run = scaleRun(C_MAJOR, { rhythm: 'even', tempo: 60, hands: 'rh' })
    expect(run.steps.map((s) => s.key)).toEqual([
      60, 62, 64, 65, 67, 69, 71, 72, 71, 69, 67, 65, 64, 62, 60,
    ])
    expect(run.steps[1]?.at).toBeCloseTo(0.5)
    expect(run.end).toBeCloseTo(15 * 0.5)
  })

  it('repeats the rhythm’s lengths', () => {
    const run = scaleRun(C_MAJOR, { rhythm: 'long-short', tempo: 60, hands: 'rh' })
    expect(run.steps.slice(0, 3).map((s) => s.at)).toEqual([0, 0.75, 1])
    expect(PRACTICE_RHYTHMS['long-short']).toEqual([1.5, 0.5])
  })

  it('plays the left hand an octave lower, and both hands together', () => {
    expect(scaleRun(C_MAJOR, { rhythm: 'even', tempo: 60, hands: 'lh' }).sounds[0]?.midi).toBe(48)
    const both = scaleRun(C_MAJOR, { rhythm: 'even', tempo: 60, hands: 'both' })
    expect(both.sounds.filter((s) => s.at === 0).map((s) => s.midi).sort()).toEqual([48, 60])
  })
})
```

Run: `npx vitest run src/shared/lib/schedule/sounds.test.ts`
Expected: FAIL.

- [ ] **Step 2: Implement `sounds.ts`**

```ts
import type { Performance } from '@/shared/lib/arrangement'
import { midi, type Midi } from '@/shared/lib/music'
import { schedule, type Audible, type Hands, type NoteSound, type Sound } from './schedule'

/** One bar on its own at a tempo: what a tap on a bar plays. */
export function barSounds(
  performance: Performance,
  bar: number,
  options: { readonly tempo: number; readonly hands: Audible },
): Sound[] {
  const placed = performance.bars[bar]
  if (!placed) return []
  const { sounds } = schedule(performance, { ...options, fromTick: placed.startTick })
  const end = (placed.beats * 60) / options.tempo
  return sounds.filter((sound) => sound.at < end - 1e-9)
}

const BLOCK = { duration: 1.6, velocity: 0.18 } as const
const ARPEGGIO = { gap: 0.22, duration: 1.4, velocity: 0.2 } as const

/** A chord struck at once or rolled upwards: the explorers' Play and Arpeggio. */
export function chordSounds(
  keys: readonly Midi[],
  options: { readonly arpeggio: boolean },
): NoteSound[] {
  return [...keys]
    .sort((a, b) => a - b)
    .map((key, i) => ({
      kind: 'note',
      midi: key,
      at: options.arpeggio ? i * ARPEGGIO.gap : 0,
      duration: options.arpeggio ? ARPEGGIO.duration : BLOCK.duration,
      velocity: options.arpeggio ? ARPEGGIO.velocity : BLOCK.velocity,
    }))
}

/** The five practice rhythms: note lengths in eighth notes, repeating through the run. */
export const PRACTICE_RHYTHMS = {
  even: [1],
  'long-short': [1.5, 0.5],
  'short-long': [0.5, 1.5],
  'long-short-short-short': [2, 2 / 3, 2 / 3, 2 / 3],
  'short-short-short-long': [2 / 3, 2 / 3, 2 / 3, 2],
} as const satisfies Record<string, readonly number[]>
export type PracticeRhythm = keyof typeof PRACTICE_RHYTHMS
export const PRACTICE_RHYTHM_IDS = Object.keys(PRACTICE_RHYTHMS) as readonly PracticeRhythm[]

export interface ScaleRun {
  readonly sounds: readonly NoteSound[]
  /** The shown key sounding at each time, for lighting it. */
  readonly steps: readonly { readonly key: Midi; readonly at: number }[]
  readonly end: number
}

const OCTAVES_BY_HANDS: Readonly<Record<Hands, readonly number[]>> = {
  rh: [0],
  lh: [-12],
  both: [-12, 0],
}

/** A scale up and back down in eighth notes, in a practice rhythm, for one hand or both. */
export function scaleRun(
  keys: readonly Midi[],
  options: { readonly rhythm: PracticeRhythm; readonly tempo: number; readonly hands: Hands },
): ScaleRun {
  const lengths = PRACTICE_RHYTHMS[options.rhythm]
  const eighth = 60 / options.tempo / 2
  const path = [...keys, ...keys.slice(0, -1).reverse()]
  const offsets = OCTAVES_BY_HANDS[options.hands]
  const velocity = offsets.length > 1 ? 0.16 : 0.2
  const sounds: NoteSound[] = []
  const steps: { key: Midi; at: number }[] = []
  let at = 0
  path.forEach((key, i) => {
    const length = (lengths[i % lengths.length] ?? 1) * eighth
    steps.push({ key, at })
    for (const offset of offsets) {
      sounds.push({
        kind: 'note',
        midi: midi(key + offset),
        at,
        duration: Math.max(0.25, length * 1.1),
        velocity,
      })
    }
    at += length
  })
  return { sounds, steps, end: at }
}
```

Export from `schedule/index.ts`:

```ts
export {
  barSounds,
  chordSounds,
  PRACTICE_RHYTHM_IDS,
  PRACTICE_RHYTHMS,
  scaleRun,
  type PracticeRhythm,
  type ScaleRun,
} from './sounds'
```

Run the tests. Expected: PASS.

- [ ] **Step 3: Commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
npx prettier --write src/shared/lib/schedule
git add src/shared/lib/schedule
git commit -m "Sound a bar, a chord struck or rolled, and a scale in its practice rhythms

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: `usePlay`

**Files:**
- Create: `src/shared/lib/services/use-play.ts`, `use-play.test.tsx`
- Modify: `src/shared/lib/services/index.ts`

**Interfaces:**
- Produces: `usePlay(): (sounds: readonly Sound[]) => number` — unlocks audio, stops what sounds, plays from just after
  now, and returns that start time on the audio clock.

- [ ] **Step 1: Write the failing test**

```tsx
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { createFakeAudio } from '@/shared/api/audio'
import { midi } from '@/shared/lib/music'
import type { Sound } from '@/shared/lib/schedule'
import { ServicesProvider } from './ServicesProvider'
import { usePlay } from './use-play'

const NOTE: Sound = { kind: 'note', midi: midi(60), at: 0, duration: 1, velocity: 0.2 }

function setup() {
  const audio = createFakeAudio()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ServicesProvider services={{ audio, midi: null }}>{children}</ServicesProvider>
  )
  const { result } = renderHook(() => usePlay(), { wrapper })
  return { audio, play: result.current }
}

describe('usePlay', () => {
  it('unlocks audio and plays from just after now', () => {
    const { audio, play } = setup()
    audio.setNow(2)
    const at = play([NOTE])
    expect(audio.unlocks).toBe(1)
    expect(audio.played).toEqual([{ sounds: [NOTE], at }])
    expect(at).toBeCloseTo(2.1)
  })

  it('cuts off what was sounding before the next tap sounds', () => {
    const { audio, play } = setup()
    play([NOTE])
    play([NOTE])
    expect(audio.stops).toBe(2)
    expect(audio.played).toHaveLength(2)
  })
})
```

Run: `npx vitest run src/shared/lib/services/use-play.test.tsx`
Expected: FAIL.

- [ ] **Step 2: Implement**

```ts
import { useCallback } from 'react'
import { PLAY_DELAY } from '@/shared/api/audio'
import type { Sound } from '@/shared/lib/schedule'
import { useServices } from './use-services'

/**
 * Sounds something now, cutting off what was sounding: a chord, a bar, a scale run. Returns when it
 * starts on the audio clock, so a caller can light keys in time.
 */
export function usePlay(): (sounds: readonly Sound[]) => number {
  const { audio } = useServices()
  return useCallback(
    (sounds) => {
      void audio.unlock()
      audio.stop()
      const at = audio.now() + PLAY_DELAY
      audio.play(sounds, at)
      return at
    },
    [audio],
  )
}
```

Export `usePlay` from `services/index.ts`. Run the test. Expected: PASS.

- [ ] **Step 3: Commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
npx prettier --write src/shared/lib/services
git add src/shared/lib/services
git commit -m "Play a sound now, cutting off the one before

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Continue, and which skills to check

**Files:**
- Modify: `src/entities/progress/model/selectors.ts`, `selectors.test.ts`, `mastery.ts`, `mastery.test.ts`,
  `src/entities/progress/index.ts`

**Interfaces:**
- Consumes: `pathSteps(): readonly PlacedStep[]` (entities/path).
- Produces:
  - `selectAllAnswers(state): ProgressState['answers']`
  - `selectSuggestedStep(state): PlacedStep | null` — the most recently practised piece still on the path, if not
    learned; else the first unlearned step in path order; else null. Returns the path's own objects (stable).
  - `skillsToCheck(skills: readonly SkillId[], answers: ProgressState['answers']): SkillId[]` (gap or unknown)
  - `knownCount(skills: readonly SkillId[], answers: ProgressState['answers']): number`

- [ ] **Step 1: Write the failing tests**

Append to `selectors.test.ts`:

```ts
describe('selectSuggestedStep', () => {
  const steps = pathSteps()
  const first = steps[0]
  const bz5 = steps.find((s) => s.id === 'piece:bz5')

  it('suggests the first step on a first run', () => {
    expect(selectSuggestedStep(EMPTY_PROGRESS)).toBe(first)
  })

  it('suggests the piece practised last while it is not learned', () => {
    const state = { ...EMPTY_PROGRESS, practised: { ex3: '2026-09-01T10:00:00Z', bz5: '2026-09-02T10:00:00Z' } }
    expect(selectSuggestedStep(state)).toBe(bz5)
  })

  it('moves on to the first unlearned step once that piece is learned', () => {
    const state = {
      ...EMPTY_PROGRESS,
      practised: { bz5: '2026-09-02T10:00:00Z' },
      learned: { 'piece:bz5': '2026-09-03T10:00:00Z' },
    }
    expect(selectSuggestedStep(state)).toBe(first)
  })

  it('passes over a practised piece the path no longer has', () => {
    const state = {
      ...EMPTY_PROGRESS,
      practised: { bz5: '2026-09-02T10:00:00Z', gone: '2026-09-05T10:00:00Z' },
    }
    expect(selectSuggestedStep(state)).toBe(bz5)
  })

  it('suggests nothing when every step is learned', () => {
    const learned = Object.fromEntries(steps.map((s) => [s.id, '2026-09-01T10:00:00Z']))
    expect(selectSuggestedStep({ ...EMPTY_PROGRESS, learned })).toBeNull()
  })
})
```

(import `pathSteps` from `@/entities/path`, `EMPTY_PROGRESS` from `./types`, `selectSuggestedStep` from
`./selectors`.)

Append to `mastery.test.ts`:

```ts
describe('skillsToCheck and knownCount', () => {
  const right = (n: number) => Array.from({ length: n }, () => ({ correct: true, at: '2026-09-01' }))
  const answers = { 'chord:maj': right(5), 'chord:min': [{ correct: false, at: '2026-09-01' }] }

  it('keeps gaps and unknowns in the order given', () => {
    expect(skillsToCheck(['chord:maj', 'chord:min', 'chord:dim'], answers)).toEqual([
      'chord:min',
      'chord:dim',
    ])
  })

  it('counts the known ones', () => {
    expect(knownCount(['chord:maj', 'chord:min', 'chord:dim'], answers)).toBe(1)
  })
})
```

Run: `npx vitest run src/entities/progress`
Expected: FAIL.

- [ ] **Step 2: Implement**

`selectors.ts` — add (import `pathSteps, type PlacedStep` from `@/entities/path`):

```ts
export const selectAllAnswers = (state: ProgressState) => state.answers

/**
 * Continue (spec §5): the most recently practised piece still on the path, while it is not learned;
 * else the first unlearned step in path order; null when everything is learned.
 */
export function selectSuggestedStep(state: ProgressState): PlacedStep | null {
  const steps = pathSteps()
  let latest: { step: PlacedStep; at: number } | null = null
  for (const [pieceId, date] of Object.entries(state.practised)) {
    const step = steps.find((s) => s.step.kind === 'piece' && s.step.pieceId === pieceId)
    const at = Date.parse(date ?? '')
    if (step && (!latest || at > latest.at)) latest = { step, at }
  }
  if (latest && state.learned[latest.step.id] === undefined) return latest.step
  return steps.find((s) => state.learned[s.id] === undefined) ?? null
}
```

`mastery.ts` — add:

```ts
const NONE: readonly Answer[] = []

/** The skills a check should ask about: gaps and unknowns, in the order given. */
export const skillsToCheck = (
  skills: readonly SkillId[],
  answers: ProgressState['answers'],
): SkillId[] => skills.filter((skill) => rate(answers[skill] ?? NONE) !== 'known')

export const knownCount = (skills: readonly SkillId[], answers: ProgressState['answers']): number =>
  skills.filter((skill) => rate(answers[skill] ?? NONE) === 'known').length
```

Export all four from `src/entities/progress/index.ts`. Run the tests. Expected: PASS.

- [ ] **Step 3: Commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
npx prettier --write src/entities/progress
git add src/entities/progress
git commit -m "Suggest the step to continue and name the skills a check should ask

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Piece titles, credits, source and section headings

**Files:**
- Create: `src/shared/i18n/use-language.ts`, `src/entities/piece/model/titles.ts`, `titles.test.ts`,
  `src/entities/piece/ui/{Credits,SourceLine}.tsx`, `src/entities/piece/ui/use-section-heading.ts`,
  `src/entities/piece/ui/piece-ui.test.tsx`
- Modify: `src/shared/i18n/index.ts`, `src/shared/i18n/locales/{en,ru}/piece.ts`, `src/entities/piece/index.ts`

**Interfaces:**
- Produces:
  - `useLanguage(): Language` with `Language = keyof LocalText` (`'en' | 'ru'`), following i18next's language.
  - `entryTitles(entry: { title: string; titleEn?: string }, language: Language): { primary: string; secondary?: string }`
  - `Credits({ credits }: { credits: readonly Credit[] })`, `SourceLine({ source }: { source: Source })`
  - `useSectionHeading(): (section: Section) => string`

- [ ] **Step 1: Add the piece strings**

`en/piece.ts`:

```ts
export const piece = {
  title: 'Song',
  credit: {
    authors: 'Authors',
    'words-and-music': 'Words and music',
    words: 'Words',
    music: 'Music',
    'russian-text': 'Russian text',
    harmony: 'Harmony',
    accompaniment: 'Accompaniment',
    unknown: 'Author unknown',
  },
  source: { number: 'No. {{n}}', page: 'p. {{n}}' },
  section: {
    intro: 'Intro',
    verse: 'Verse',
    verseNumbered: 'Verse {{n}}',
    chorus: 'Chorus',
    lastChorus: 'Last chorus',
    ending: 'Ending',
    lastEnding: 'Last ending',
    practice: 'Exercise',
    hymn: 'Hymn',
    part: 'Part',
    partLabelled: 'Part {{label}}',
  },
} as const
```

`ru/piece.ts`:

```ts
export const piece = {
  title: 'Песня',
  credit: {
    authors: 'Авторы',
    'words-and-music': 'Слова и музыка',
    words: 'Слова',
    music: 'Музыка',
    'russian-text': 'Русский текст',
    harmony: 'Гармонизация',
    accompaniment: 'Аккомпанемент',
    unknown: 'Автор неизвестен',
  },
  source: { number: '№ {{n}}', page: 'с. {{n}}' },
  section: {
    intro: 'Вступление',
    verse: 'Куплет',
    verseNumbered: '{{n}}-й куплет',
    chorus: 'Припев',
    lastChorus: 'Последний припев',
    ending: 'Окончание',
    lastEnding: 'Последнее окончание',
    practice: 'Упражнение',
    hymn: 'Гимн',
    part: 'Часть',
    partLabelled: 'Часть {{label}}',
  },
} as const satisfies DeepStrings<typeof import('../en/piece').piece>
```

(Match the existing Russian modules' typing pattern exactly; if they type through `LocaleResources` in `ru/index.ts`
instead, drop the `satisfies`.)

- [ ] **Step 2: Write the failing tests**

`titles.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { entryTitles } from './titles'

const bz5 = { title: 'Мир, душа, храни', titleEn: 'Still, my soul, be still' }
const silent = { title: 'Silent Night' }

describe('entryTitles', () => {
  it('shows English the English title over the printed one', () => {
    expect(entryTitles(bz5, 'en')).toEqual({ primary: 'Still, my soul, be still', secondary: 'Мир, душа, храни' })
  })

  it('shows Russian the printed title alone', () => {
    expect(entryTitles(bz5, 'ru')).toEqual({ primary: 'Мир, душа, храни' })
  })

  it('shows a title printed in English as it is, in both languages', () => {
    expect(entryTitles(silent, 'en')).toEqual({ primary: 'Silent Night' })
    expect(entryTitles(silent, 'ru')).toEqual({ primary: 'Silent Night' })
  })
})
```

`piece-ui.test.tsx`:

```tsx
import { act, render, renderHook, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { i18n } from '@/shared/i18n'
import { Credits } from './Credits'
import { SourceLine } from './SourceLine'
import { useSectionHeading } from './use-section-heading'

afterEach(() => act(() => void i18n.changeLanguage('en')))

describe('section headings', () => {
  it('assembles kind, number, last and detail in the learner’s language', () => {
    const { result } = renderHook(() => useSectionHeading())
    const verse4 = { kind: 'verse', n: 4, detail: { en: 'and ending', ru: 'и окончание' }, lines: [] } as const
    const lastChorus = { kind: 'chorus', last: true, detail: { en: 'in A minor', ru: 'в ля миноре' }, lines: [] } as const
    expect(result.current(verse4)).toBe('Verse 4 and ending')
    expect(result.current(lastChorus)).toBe('Last chorus in A minor')
    expect(result.current({ kind: 'part', label: 'B', lines: [] })).toBe('Part B')
  })

  it('follows a switch to Russian at once', () => {
    const { result } = renderHook(() => useSectionHeading())
    act(() => void i18n.changeLanguage('ru'))
    expect(result.current({ kind: 'verse', n: 4, detail: { en: 'and ending', ru: 'и окончание' }, lines: [] })).toBe(
      '4-й куплет и окончание',
    )
  })
})

describe('credits and source', () => {
  it('labels each credit’s role and keeps the names as printed', () => {
    render(<Credits credits={[{ role: 'words-and-music', names: 'Надежда Боброва' }, { role: 'unknown' }]} />)
    expect(screen.getByText('Words and music:')).toBeInTheDocument()
    expect(screen.getByText('Надежда Боброва')).toBeInTheDocument()
    expect(screen.getByText('Author unknown')).toBeInTheDocument()
  })

  it('cites the book, number and page', () => {
    render(<SourceLine source={{ book: 'bozhe-spasibo', number: 5, page: 16 }} />)
    expect(screen.getByText('«Боже, спасибо» · No. 5 · p. 16')).toBeInTheDocument()
  })
})
```

Run: `npx vitest run src/entities/piece/model/titles.test.ts src/entities/piece/ui`
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/shared/i18n/use-language.ts`:

```ts
import { useTranslation } from 'react-i18next'
import type { LocalText } from './local-text'

export type Language = keyof LocalText

/** The language the interface speaks now; LocaleSync keeps i18next on the saved setting. */
export function useLanguage(): Language {
  const { i18n } = useTranslation()
  return i18n.resolvedLanguage === 'ru' ? 'ru' : 'en'
}
```

Export `useLanguage, type Language` from `src/shared/i18n/index.ts`.

`src/entities/piece/model/titles.ts`:

```ts
import type { Language } from '@/shared/i18n'

export interface EntryTitles {
  readonly primary: string
  /** The printed title, under an English one. */
  readonly secondary?: string
}

/** English shows the English title over the printed one; Russian shows the printed title (spec §8). */
export function entryTitles(
  entry: { readonly title: string; readonly titleEn?: string },
  language: Language,
): EntryTitles {
  return language === 'en' && entry.titleEn
    ? { primary: entry.titleEn, secondary: entry.title }
    : { primary: entry.title }
}
```

`src/entities/piece/ui/use-section-heading.ts`:

```ts
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { localText, useLanguage } from '@/shared/i18n'
import type { Section } from '../model/types'

/** A section's heading in the learner's language: "Verse 4 and ending", "Последний припев в ля миноре". */
export function useSectionHeading(): (section: Section) => string {
  const { t } = useTranslation('piece')
  const language = useLanguage()
  return useCallback(
    (section) => {
      const base =
        section.kind === 'verse' && section.n !== undefined
          ? t('section.verseNumbered', { n: section.n })
          : section.kind === 'chorus' && section.last
            ? t('section.lastChorus')
            : section.kind === 'ending' && section.last
              ? t('section.lastEnding')
              : section.kind === 'part' && section.label
                ? t('section.partLabelled', { label: section.label })
                : t(`section.${section.kind}`)
      return section.detail ? `${base} ${localText(section.detail, language)}` : base
    },
    [t, language],
  )
}
```

`src/entities/piece/ui/Credits.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import type { Credit } from '../model/types'

/** Who wrote it: each role in the learner's language, the names as printed. */
export function Credits({ credits }: { credits: readonly Credit[] }) {
  const { t } = useTranslation('piece')
  return (
    <dl className="flex flex-col gap-0.5 text-sm">
      {credits.map((credit, i) =>
        credit.role === 'unknown' ? (
          <dd key={i} className="text-muted-foreground">
            {t('credit.unknown')}
          </dd>
        ) : (
          <div key={i} className="flex flex-wrap gap-x-1.5">
            <dt className="text-muted-foreground">{t(`credit.${credit.role}`)}:</dt>
            <dd>{credit.names}</dd>
          </div>
        ),
      )}
    </dl>
  )
}
```

`src/entities/piece/ui/SourceLine.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { BOOKS } from '../content/books'
import type { Source } from '../model/types'

/** The printed book it comes from, with its number and page there. */
export function SourceLine({ source }: { source: Source }) {
  const { t } = useTranslation('piece')
  const parts = [
    BOOKS[source.book].title,
    source.number === undefined ? null : t('source.number', { n: source.number }),
    source.page === undefined ? null : t('source.page', { n: source.page }),
  ].filter((part): part is string => part !== null)
  return <p className="text-sm text-muted-foreground">{parts.join(' · ')}</p>
}
```

Export from `src/entities/piece/index.ts`: `entryTitles, type EntryTitles` (model) and `Credits, SourceLine,
useSectionHeading` (ui). Run the tests. Expected: PASS.

- [ ] **Step 4: Commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
npx prettier --write src/shared/i18n src/entities/piece
git add src/shared/i18n src/entities/piece
git commit -m "Title, credit and head a piece in the learner's language

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: The learned toggle

**Files:**
- Create: `src/features/mark-learned/ui/LearnedToggle.tsx`, `LearnedToggle.test.tsx`
- Modify: `src/features/mark-learned/index.ts`, `src/shared/i18n/locales/{en,ru}/common.ts`,
  `src/entities/progress/index.ts` (if `createProgressStore` test helpers are needed)

**Interfaces:**
- Consumes: `markLearned`, `unmarkLearned`, `useProgress`, `useProgressStoreApi`, `selectIsLearned`, `recordAnswer`.
- Produces: `LearnedToggle({ step, title, variant }: { step: StepId; title: string; variant?: 'icon' | 'text' })`.

- [ ] **Step 1: Strings** — `common.learned`:
  en `{ toggle: '{{title}}: learned', done: 'Learned' }`; ru `{ toggle: '{{title}}: выучено', done: 'Выучено' }`.

- [ ] **Step 2: Write the failing tests**

```tsx
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { createProgressStore, ProgressStoreProvider } from '@/entities/progress'
import { recordAnswer } from '@/features/record-answer'
import { createMemoryStorage } from '@/shared/lib'
import { chordSkill, qualitiesIn } from '@/shared/lib/music'
import { LearnedToggle } from './LearnedToggle'

function renderToggle(variant?: 'icon' | 'text') {
  const store = createProgressStore({ storage: createMemoryStorage() })
  render(
    <ProgressStoreProvider store={store}>
      <LearnedToggle step="chords:tri" title="Triads" variant={variant} />
    </ProgressStoreProvider>,
  )
  return store
}

describe('LearnedToggle', () => {
  it('marks a step learned and unmarks it', async () => {
    const user = userEvent.setup()
    const store = renderToggle()
    const toggle = screen.getByRole('button', { name: 'Triads: learned' })
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    expect(store.getState().learned['chords:tri']).toBeDefined()
    await user.click(toggle)
    expect(store.getState().learned['chords:tri']).toBeUndefined()
  })

  it('shows a step the quiz marked learned', () => {
    const store = renderToggle('text')
    act(() => {
      for (const quality of qualitiesIn('tri'))
        for (let i = 0; i < 4; i++) recordAnswer(store, { skill: chordSkill(quality), correct: true }, new Date())
    })
    expect(screen.getByRole('button', { name: 'Learned' })).toHaveAttribute('aria-pressed', 'true')
  })
})
```

Run: `npx vitest run src/features/mark-learned/ui`
Expected: FAIL.

- [ ] **Step 3: Implement**

```tsx
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { StepId } from '@/entities/path'
import { selectIsLearned, useProgress, useProgressStoreApi } from '@/entities/progress'
import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui/primitives/button'
import { markLearned } from '../mark-learned'
import { unmarkLearned } from '../unmark-learned'

/** Marks a step learned or unmarks it: a round check on rows, a labelled button on a screen. */
export function LearnedToggle({
  step,
  title,
  variant = 'icon',
}: {
  step: StepId
  title: string
  variant?: 'icon' | 'text'
}) {
  const { t } = useTranslation('common')
  const store = useProgressStoreApi()
  const learned = useProgress(selectIsLearned(step))
  const toggle = () => (learned ? unmarkLearned(store, step) : markLearned(store, step, new Date()))
  const check = (
    <span
      aria-hidden
      className={cn(
        'grid size-7 shrink-0 place-items-center rounded-full ring-2 transition-colors duration-200 ease-out ring-inset',
        learned ? 'bg-primary text-primary-foreground ring-primary' : 'ring-border',
      )}
    >
      {learned ? <Check className="size-4" strokeWidth={3} /> : null}
    </span>
  )
  if (variant === 'text') {
    return (
      <Button variant="soft" aria-pressed={learned} onClick={toggle}>
        {check}
        {t('learned.done')}
      </Button>
    )
  }
  return (
    <button
      type="button"
      aria-pressed={learned}
      aria-label={t('learned.toggle', { title })}
      onClick={toggle}
      className="grid size-11 shrink-0 place-items-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring"
    >
      {check}
    </button>
  )
}
```

Export `LearnedToggle` from `src/features/mark-learned/index.ts`. Run the test. Expected: PASS.

- [ ] **Step 4: Commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
npx prettier --write src/features/mark-learned src/shared/i18n/locales
git add src/features/mark-learned src/shared/i18n
git commit -m "Add the learned toggle every screen marks steps with

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 13: Connecting a MIDI keyboard

**Files:**
- Modify: `src/shared/api/midi/types.ts`, `web-midi.ts`, `web-midi.test.ts`, `fake-midi.ts`, `fake-midi.test.ts`
- Create: `src/features/connect-midi/{index.ts,use-midi-connection.ts,use-midi-connection.test.tsx}`,
  `src/features/connect-midi/ui/{MidiControl,MidiButton}.tsx`, `ui/MidiControl.test.tsx`
- Modify: `src/shared/i18n/locales/{en,ru}/common.ts`

**Interfaces:**
- Produces:
  - `MidiInput.current(): MidiStatus | null` — the last status, null before any `connect()`; `connect()` also emits
    the status it resolves with.
  - `MidiConnection = { kind: 'unsupported' } | { kind: 'idle' } | { kind: 'connecting' } | { kind: 'ready'; status:
    MidiStatus }`
  - `useMidiConnection(): { connection: MidiConnection; connect(): void }`
  - `MidiControl()` — the status line (`aria-live="polite"`) and Connect / Try again; `MidiButton()` — a round
    button with a status dot opening a popover holding `MidiControl`; renders nothing without Web MIDI.

- [ ] **Step 1: Strings** — `common.midi`:

```ts
// en
midi: {
  label: 'MIDI keyboard',
  connect: 'Connect a MIDI keyboard',
  connecting: 'Connecting…',
  retry: 'Try again',
  connected: 'Connected: {{devices}}',
  noDevice: 'No MIDI keyboard found. Plug one in by USB.',
  denied: 'MIDI access was blocked.',
  unsupported: 'This browser can’t connect a MIDI keyboard.',
},
// ru
midi: {
  label: 'MIDI-клавиатура',
  connect: 'Подключить MIDI-клавиатуру',
  connecting: 'Подключение…',
  retry: 'Ещё раз',
  connected: 'Подключено: {{devices}}',
  noDevice: 'MIDI-клавиатура не найдена. Подключите её по USB.',
  denied: 'Доступ к MIDI запрещён.',
  unsupported: 'Этот браузер не может подключить MIDI-клавиатуру.',
},
```

- [ ] **Step 2: Write the failing port tests**

Append to `fake-midi.test.ts`:

```ts
  it('has no status before it is connected, then keeps the last one', async () => {
    const keyboard = createFakeMidi()
    expect(keyboard.current()).toBeNull()
    await keyboard.connect()
    expect(keyboard.current()).toEqual({ state: 'connected', devices: ['Keyboard'] })
    keyboard.setStatus({ state: 'no-device' })
    expect(keyboard.current()).toEqual({ state: 'no-device' })
  })
```

Append the same expectation to `web-midi.test.ts` using its existing fake `navigator.requestMIDIAccess` harness:
`current()` is null before `connect()`, equals the resolved status after, and follows a `statechange`.

Run: `npx vitest run src/shared/api/midi`
Expected: FAIL.

- [ ] **Step 3: Implement the port change**

`types.ts` — add to `MidiInput`:

```ts
  /** The last status, or null before any connect(). */
  current(): MidiStatus | null
```

`fake-midi.ts`:

```ts
export function createFakeMidi(
  status: MidiStatus = { state: 'connected', devices: ['Keyboard'] },
): FakeMidi {
  let current: MidiStatus | null = null
  const notes = createListeners<NoteEvent>()
  const statuses = createListeners<MidiStatus>()
  const report = (next: MidiStatus) => {
    current = next
    statuses.emit(next)
  }
  return {
    async connect() {
      report(current ?? status)
      return current ?? status
    },
    current: () => current,
    onNote: notes.add,
    onStatus: statuses.add,
    press: (key) => notes.emit({ midi: key, on: true, velocity: 100 }),
    release: (key) => notes.emit({ midi: key, on: false, velocity: 0 }),
    setStatus: report,
  }
}
```

`web-midi.ts`: keep a `let current: MidiStatus | null = null`; wherever the adapter computes a status (after access
is granted or denied, and on `statechange`) set `current` and emit it; `current: () => current`. Run the tests.
Expected: PASS.

- [ ] **Step 4: Write the failing hook and control tests**

`use-midi-connection.test.tsx`:

```tsx
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi, type FakeMidi } from '@/shared/api/midi'
import { ServicesProvider } from '@/shared/lib/services'
import { useMidiConnection } from './use-midi-connection'

function setup(midi: FakeMidi | null) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ServicesProvider services={{ audio: createFakeAudio(), midi }}>{children}</ServicesProvider>
  )
  return renderHook(() => useMidiConnection(), { wrapper })
}

describe('useMidiConnection', () => {
  it('is unsupported without Web MIDI', () => {
    expect(setup(null).result.current.connection).toEqual({ kind: 'unsupported' })
  })

  it('connects and then follows the keyboard being unplugged', async () => {
    const keyboard = createFakeMidi()
    const { result } = setup(keyboard)
    expect(result.current.connection).toEqual({ kind: 'idle' })
    await act(async () => result.current.connect())
    expect(result.current.connection).toEqual({
      kind: 'ready',
      status: { state: 'connected', devices: ['Keyboard'] },
    })
    act(() => keyboard.setStatus({ state: 'no-device' }))
    expect(result.current.connection).toEqual({ kind: 'ready', status: { state: 'no-device' } })
  })
})
```

`ui/MidiControl.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { ServicesProvider } from '@/shared/lib/services'
import { MidiControl } from './MidiControl'

describe('MidiControl', () => {
  it('says in one line when the browser cannot connect a keyboard', () => {
    render(
      <ServicesProvider services={{ audio: createFakeAudio(), midi: null }}>
        <MidiControl />
      </ServicesProvider>,
    )
    expect(screen.getByText('This browser can’t connect a MIDI keyboard.')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('connects and names the keyboard', async () => {
    const user = userEvent.setup()
    render(
      <ServicesProvider services={{ audio: createFakeAudio(), midi: createFakeMidi() }}>
        <MidiControl />
      </ServicesProvider>,
    )
    await user.click(screen.getByRole('button', { name: 'Connect a MIDI keyboard' }))
    expect(await screen.findByText('Connected: Keyboard')).toBeInTheDocument()
  })

  it('offers to try again when access was blocked', async () => {
    const user = userEvent.setup()
    render(
      <ServicesProvider
        services={{ audio: createFakeAudio(), midi: createFakeMidi({ state: 'denied' }) }}
      >
        <MidiControl />
      </ServicesProvider>,
    )
    await user.click(screen.getByRole('button', { name: 'Connect a MIDI keyboard' }))
    expect(await screen.findByText('MIDI access was blocked.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })
})
```

Run: `npx vitest run src/features/connect-midi`
Expected: FAIL.

- [ ] **Step 5: Implement the feature**

`use-midi-connection.ts`:

```ts
import { useCallback, useState, useSyncExternalStore } from 'react'
import type { MidiStatus } from '@/shared/api/midi'
import { useServices } from '@/shared/lib/services'

export type MidiConnection =
  | { readonly kind: 'unsupported' }
  | { readonly kind: 'idle' }
  | { readonly kind: 'connecting' }
  | { readonly kind: 'ready'; readonly status: MidiStatus }

const NO_STATUS = () => null
const NO_SUBSCRIPTION = () => () => {}

/** The MIDI keyboard's connection, following the port's status as keyboards come and go. */
export function useMidiConnection(): { connection: MidiConnection; connect: () => void } {
  const { midi } = useServices()
  const [connecting, setConnecting] = useState(false)
  const status = useSyncExternalStore(
    midi ? (onChange) => midi.onStatus(onChange) : NO_SUBSCRIPTION,
    midi ? () => midi.current() : NO_STATUS,
  )
  const connect = useCallback(() => {
    if (!midi) return
    setConnecting(true)
    void midi.connect().finally(() => setConnecting(false))
  }, [midi])
  const connection: MidiConnection = !midi
    ? { kind: 'unsupported' }
    : connecting
      ? { kind: 'connecting' }
      : status
        ? { kind: 'ready', status }
        : { kind: 'idle' }
  return { connection, connect }
}
```

`ui/MidiControl.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'
import { Spinner } from '@/shared/ui/primitives/spinner'
import { useMidiConnection, type MidiConnection } from '../use-midi-connection'

function statusLine(connection: MidiConnection, t: (key: string, o?: object) => string) {
  switch (connection.kind) {
    case 'unsupported':
      return t('midi.unsupported')
    case 'ready':
      return connection.status.state === 'connected'
        ? t('midi.connected', { devices: connection.status.devices.join(', ') })
        : connection.status.state === 'denied'
          ? t('midi.denied')
          : t('midi.noDevice')
    default:
      return null
  }
}

/** The keyboard's status in one line, and the one action it needs (spec §7). */
export function MidiControl() {
  const { t } = useTranslation('common')
  const { connection, connect } = useMidiConnection()
  const line = statusLine(connection, t)
  const connected = connection.kind === 'ready' && connection.status.state === 'connected'
  return (
    <div className="flex flex-col gap-3">
      <p aria-live="polite" className="text-muted-foreground empty:hidden">
        {line}
      </p>
      {connection.kind === 'unsupported' || connected ? null : (
        <Button
          variant="soft"
          onClick={connect}
          disabled={connection.kind === 'connecting'}
          className="self-start"
        >
          {connection.kind === 'connecting' ? <Spinner data-icon="inline-start" /> : null}
          {connection.kind === 'connecting'
            ? t('midi.connecting')
            : connection.kind === 'ready'
              ? t('midi.retry')
              : t('midi.connect')}
        </Button>
      )}
    </div>
  )
}
```

(Type `t` through `TFunction<'common'>` from i18next rather than the loose signature if typecheck asks.)

`ui/MidiButton.tsx`:

```tsx
import { Cable } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { Button } from '@/shared/ui/primitives/button'
import { useMidiConnection } from '../use-midi-connection'
import { MidiControl } from './MidiControl'

/** The Player's MIDI button: a dot shows the status; the popover connects. Hidden without Web MIDI. */
export function MidiButton() {
  const { t } = useTranslation('common')
  const { connection } = useMidiConnection()
  if (connection.kind === 'unsupported') return null
  const connected = connection.kind === 'ready' && connection.status.state === 'connected'
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="surface" size="icon" aria-label={t('midi.label')} className="relative" />
        }
      >
        <Cable aria-hidden />
        <span
          aria-hidden
          className={cn(
            'absolute top-2 right-2 size-2 rounded-full',
            connected ? 'bg-primary' : 'bg-border',
          )}
        />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 rounded-3xl p-4">
        <p className="mb-2 font-semibold">{t('midi.label')}</p>
        <MidiControl />
      </PopoverContent>
    </Popover>
  )
}
```

`index.ts`: `export { useMidiConnection, type MidiConnection } from './use-midi-connection'`,
`export { MidiButton } from './ui/MidiButton'`, `export { MidiControl } from './ui/MidiControl'`.

Run: `npx vitest run src/features/connect-midi src/shared/api/midi`
Expected: PASS.

- [ ] **Step 6: Commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
npx prettier --write src/shared/api/midi src/features/connect-midi src/shared/i18n/locales
git add src/shared/api/midi src/features/connect-midi src/shared/i18n
git commit -m "Connect a MIDI keyboard and keep its status in one line

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 14: The Player's pure logic

**Files:**
- Create in `src/features/practice/`: `choice.ts`, `arrange-piece.ts`, `arrange-piece.test.ts`, `note-names.ts`,
  `bar-columns.ts`, `bar-columns.test.ts`, `marks.ts`, `marks.test.ts`
- Modify: `src/features/practice/index.ts`

**Interfaces:**
- Consumes: `chartOf`, `melodyOf`, `hasMethodCodes`, `Piece`, `Voicing` (piece); `PATTERNS`, `METHOD_PATTERNS`,
  `RIGHT_FIGURES`, `LEFT_FIGURES`, `PatternId`, `RightFigureId`, `LeftFigureId` (pattern); `arrange`; `rangeFor`,
  `KeyMark` (shared/ui).
- Produces:
  - `PracticeChoice = { tonic: SpelledNote; pattern: PatternId | 'chart'; rh: RightFigureId | null; lh:
    LeftFigureId | null; voicing: Voicing | null; melody: boolean }`
  - `defaultPattern(piece: Piece): PatternId | 'chart'`
  - `arrangePiece(piece: Piece, choice: PracticeChoice): Performance`
  - `spellPerformedNote(performance: Performance, note: PerformanceNote): { name: string; octave: number }`,
    `noteLabel(name: { name: string; octave: number }): string` (`F#3`)
  - `beatLabel(ticksIntoBar: number): string`; `barColumns(performance: Performance, bar: number): NoteColumn[]`
    with `NoteColumn = { beatGroup: number; beat: string; notes: Record<NoteHand, readonly PlayedNote[]> }`,
    `PlayedNote = { label: string; finger?: Finger }`
  - `practiceMarks(performance: Performance, beatGroup: number, options: { fingers: boolean; received?:
    readonly PitchClass[] }): Map<Midi, KeyMark>` — the beat group's notes by hand; label = finger when asked and
    known, else the note name; a received pitch class is labelled `✓`.
  - `playerRange(performance: Performance): { from: Midi; to: Midi }`

- [ ] **Step 1: Write the failing tests**

`arrange-piece.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { hasMethodCodes, PIECES, pieceById } from '@/entities/piece'
import { note } from '@/shared/lib/music'
import { arrangePiece, defaultPattern } from './arrange-piece'
import type { PracticeChoice } from './choice'

const piece = (id: string) => {
  const found = pieceById(id)
  if (!found) throw new Error(id)
  return found
}
const choice = (overrides: Partial<PracticeChoice> = {}): PracticeChoice => ({
  tonic: note('G'),
  pattern: 'r4',
  rh: null,
  lh: null,
  voicing: null,
  melody: false,
  ...overrides,
})

describe('arrangePiece', () => {
  it('plays a piece in its own key and in another', () => {
    const bz5 = piece('bz5')
    expect(arrangePiece(bz5, choice()).chords[0]?.symbol).toBe('G')
    expect(arrangePiece(bz5, choice({ tonic: note('A') })).chords[0]?.symbol).toBe('A')
  })

  it('follows the chart’s own methods when asked', () => {
    const withCodes = PIECES.find((p) => hasMethodCodes(p))
    if (!withCodes) throw new Error('no piece names its methods')
    expect(defaultPattern(withCodes)).toBe('chart')
    const patterns = new Set(
      arrangePiece(withCodes, choice({ tonic: note('C'), pattern: 'chart' })).chords.map((c) => c.pattern),
    )
    expect(patterns.size).toBeGreaterThan(0)
    expect([...patterns].every((id) => typeof id === 'string')).toBe(true)
  })

  it('falls back to r4 for a melody pattern on a piece without a melody', () => {
    const performance = arrangePiece(piece('bz5'), choice({ pattern: 'r5' }))
    expect(performance.chords.every((c) => c.pattern === 'r4')).toBe(true)
  })

  it('grows a progression’s chords with the voicing that it lets the learner choose', () => {
    const twofive = piece('twofive')
    const symbols = (voicing: 'triads' | 'ninths') =>
      arrangePiece(twofive, choice({ tonic: note('C'), pattern: 'jazz', voicing })).chords.map((c) => c.symbol)
    expect(symbols('triads')[0]).toBe('Dm')
    expect(symbols('ninths')[0]).toBe('Dm9')
  })
})
```

(Check `PIECES` is exported by `@/entities/piece` — it is (`BOOKS, COLLECTIONS, PIECES`). Check the exact symbols
the kernel writes for D minor 9 before asserting; adjust the literal if the kernel spells it otherwise.)

`bar-columns.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { pieceById } from '@/entities/piece'
import { note } from '@/shared/lib/music'
import { arrangePiece } from './arrange-piece'
import { barColumns, beatLabel } from './bar-columns'

describe('beatLabel', () => {
  it('counts beats and names their subdivisions', () => {
    expect([0, 3, 6, 9, 12, 16, 20].map(beatLabel)).toEqual(['1', '1e', '1&', '1a', '2', '2⅓', '2⅔'])
  })
})

describe('barColumns', () => {
  it('lists each beat group of a bar with its notes, high to low, by hand', () => {
    const bz5 = pieceById('bz5')
    if (!bz5) throw new Error('bz5')
    const performance = arrangePiece(bz5, {
      tonic: note('G'),
      pattern: 'M1',
      rh: null,
      lh: null,
      voicing: null,
      melody: false,
    })
    const columns = barColumns(performance, 0)
    expect(columns[0]?.beat).toBe('1')
    expect(columns.every((column) => performance.beatGroups[column.beatGroup]?.bar === 0)).toBe(true)
    const rh = columns[0]?.notes.rh.map((n) => n.label) ?? []
    expect(rh.length).toBeGreaterThan(0)
    expect(rh.every((label) => /^[A-G](#|♭)?\d$/.test(label))).toBe(true)
  })

  it('is empty for a bar the piece does not have', () => {
    const bz5 = pieceById('bz5')
    if (!bz5) throw new Error('bz5')
    const performance = arrangePiece(bz5, { tonic: note('G'), pattern: 'M1', rh: null, lh: null, voicing: null, melody: false })
    expect(barColumns(performance, 999)).toEqual([])
  })
})
```

`marks.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { pieceById } from '@/entities/piece'
import { note, pitchClass } from '@/shared/lib/music'
import { arrangePiece } from './arrange-piece'
import { playerRange, practiceMarks } from './marks'
import { spellPerformedNote } from './note-names'

const bz5 = pieceById('bz5')
if (!bz5) throw new Error('bz5')
const performance = arrangePiece(bz5, { tonic: note('G'), pattern: 'M1', rh: null, lh: null, voicing: null, melody: false })

describe('practiceMarks', () => {
  it('marks the beat group’s notes by hand, labelled with note names', () => {
    const marks = practiceMarks(performance, 0, { fingers: false })
    const group = performance.beatGroups[0]
    expect(marks.size).toBeGreaterThan(0)
    for (const index of group?.notes ?? []) {
      const played = performance.notes[index]
      if (!played || played.hand === 'melody') continue
      const mark = marks.get(played.midi)
      expect(mark?.tone).toBe(played.hand)
      expect(mark?.label).toBe(spellPerformedNote(performance, played).name)
    }
  })

  it('labels a note already played in Your turn with a tick', () => {
    const group = performance.beatGroups[0]
    const first = performance.notes[group?.notes[0] ?? -1]
    if (!first) throw new Error('empty group')
    const marks = practiceMarks(performance, 0, { fingers: false, received: [pitchClass(first.midi)] })
    expect(marks.get(first.midi)?.label).toBe('✓')
  })
})

describe('playerRange', () => {
  it('holds every note of the piece between a C and a B', () => {
    const { from, to } = playerRange(performance)
    const keys = performance.notes.map((n) => n.midi)
    expect(from % 12).toBe(0)
    expect(to % 12).toBe(11)
    expect(Math.min(...keys)).toBeGreaterThanOrEqual(from)
    expect(Math.max(...keys)).toBeLessThanOrEqual(to)
  })
})
```

Run: `npx vitest run src/features/practice`
Expected: FAIL (missing modules).

- [ ] **Step 2: Implement**

`choice.ts`:

```ts
import type { LeftFigureId, PatternId, RightFigureId } from '@/entities/pattern'
import type { Voicing } from '@/entities/piece'
import type { SpelledNote } from '@/shared/lib/music'

/** What the learner chose to practise a piece with: the Player's URL, read. */
export interface PracticeChoice {
  readonly tonic: SpelledNote
  /** A pattern for every chord, or the chart's own method codes. */
  readonly pattern: PatternId | 'chart'
  readonly rh: RightFigureId | null
  readonly lh: LeftFigureId | null
  /** Null plays the piece's own voicing. */
  readonly voicing: Voicing | null
  /** The melody switch: the tune an octave up too. */
  readonly melody: boolean
}
```

`arrange-piece.ts`:

```ts
import {
  LEFT_FIGURES,
  METHOD_PATTERNS,
  PATTERNS,
  RIGHT_FIGURES,
  type PatternId,
} from '@/entities/pattern'
import { chartOf, hasMethodCodes, melodyOf, type Piece } from '@/entities/piece'
import { arrange, type Performance } from '@/shared/lib/arrangement'
import type { PracticeChoice } from './choice'

/** The chart's own methods when it names them, else the piece's pattern. */
export const defaultPattern = (piece: Piece): PatternId | 'chart' =>
  hasMethodCodes(piece) ? 'chart' : piece.pattern

/** A piece as the Player plays it: the learner's key, pattern, hands' figures, voicing and melody. */
export function arrangePiece(piece: Piece, choice: PracticeChoice): Performance {
  const melody = melodyOf(piece)
  const fromChart = choice.pattern === 'chart'
  return arrange(chartOf(piece, choice.voicing ?? undefined), {
    tonic: choice.tonic,
    pattern: PATTERNS[choice.pattern === 'chart' ? piece.pattern : choice.pattern].pattern,
    ...(fromChart ? { methods: METHOD_PATTERNS } : {}),
    ...(choice.rh ? { rh: RIGHT_FIGURES[choice.rh].figure } : {}),
    ...(choice.lh ? { lh: LEFT_FIGURES[choice.lh].figure } : {}),
    ...(melody ? { melody, doubleMelody: choice.melody } : {}),
  })
}
```

`note-names.ts`:

```ts
import type { Performance, PerformanceNote } from '@/shared/lib/arrangement'
import { keyPrefersSharps, noteName, pitchClass, rootSpelling } from '@/shared/lib/music'

export interface NoteName {
  readonly name: string
  readonly octave: number
}

/** A played note named from the chord it was played for; a note outside it from the key. */
export function spellPerformedNote(performance: Performance, played: PerformanceNote): NoteName {
  const pc = pitchClass(played.midi)
  const tone = performance.chords[played.chord]?.tones.find((t) => t.pitchClass === pc)
  const spelled = tone?.note ?? rootSpelling(pc, keyPrefersSharps(performance.key))
  return {
    name: noteName(spelled),
    octave: Math.floor((played.midi - spelled.accidental) / 12) - 1,
  }
}

export const noteLabel = ({ name, octave }: NoteName): string => `${name}${octave}`
```

`bar-columns.ts`:

```ts
import {
  TICKS_PER_BEAT,
  type NoteHand,
  type Performance,
  type PerformanceNote,
} from '@/shared/lib/arrangement'
import type { Finger } from '@/shared/lib/music'
import { noteLabel, spellPerformedNote } from './note-names'

export interface PlayedNote {
  readonly label: string
  readonly finger?: Finger
}
export interface NoteColumn {
  readonly beatGroup: number
  readonly beat: string
  readonly notes: Readonly<Record<NoteHand, readonly PlayedNote[]>>
}

/** Sixteenths as e & a, triplet eighths as ⅓ ⅔. */
const SUBDIVISIONS: Readonly<Record<number, string>> = { 0: '', 3: 'e', 6: '&', 9: 'a', 4: '⅓', 8: '⅔' }

export function beatLabel(ticksIntoBar: number): string {
  const beat = Math.floor(ticksIntoBar / TICKS_PER_BEAT) + 1
  return `${beat}${SUBDIVISIONS[ticksIntoBar % TICKS_PER_BEAT] ?? '·'}`
}

/** The note grid: each beat group of a bar, its notes high to low by hand. */
export function barColumns(performance: Performance, bar: number): NoteColumn[] {
  const placed = performance.bars[bar]
  if (!placed) return []
  return performance.beatGroups.flatMap((group, beatGroup) => {
    if (group.bar !== bar) return []
    const played = group.notes
      .map((index) => performance.notes[index])
      .filter((n): n is PerformanceNote => n !== undefined)
      .sort((a, b) => b.midi - a.midi)
    const of = (hand: NoteHand) =>
      played
        .filter((n) => n.hand === hand)
        .map((n) => ({
          label: noteLabel(spellPerformedNote(performance, n)),
          ...(n.finger ? { finger: n.finger } : {}),
        }))
    return [
      {
        beatGroup,
        beat: beatLabel(group.tick - placed.startTick),
        notes: { rh: of('rh'), lh: of('lh'), melody: of('melody') },
      },
    ]
  })
}
```

`marks.ts`:

```ts
import type { Performance } from '@/shared/lib/arrangement'
import { midi, pitchClass, type Midi, type PitchClass } from '@/shared/lib/music'
import { rangeFor, type KeyMark } from '@/shared/ui'
import { spellPerformedNote } from './note-names'

/** The Player's keyboard: the beat group's notes by hand, the tune under them. */
export function practiceMarks(
  performance: Performance,
  beatGroup: number,
  options: { readonly fingers: boolean; readonly received?: readonly PitchClass[] },
): Map<Midi, KeyMark> {
  const marks = new Map<Midi, KeyMark>()
  const notes = (performance.beatGroups[beatGroup]?.notes ?? [])
    .map((index) => performance.notes[index])
    .filter((n) => n !== undefined)
    // The tune first, so a hand playing the same key wins it.
    .sort((a, b) => Number(b.hand === 'melody') - Number(a.hand === 'melody'))
  for (const played of notes) {
    const label = options.received?.includes(pitchClass(played.midi))
      ? '✓'
      : options.fingers && played.finger
        ? String(played.finger)
        : spellPerformedNote(performance, played).name
    marks.set(played.midi, { tone: played.hand, label })
  }
  return marks
}

const DEFAULT_RANGE = { from: midi(48), to: midi(71) }

/** Every note of the piece on the keyboard, from a C to a B. */
export const playerRange = (performance: Performance) =>
  rangeFor(
    performance.notes.map((n) => n.midi),
    DEFAULT_RANGE,
  )
```

Export all of them from `src/features/practice/index.ts`
(`type PracticeChoice`, `arrangePiece`, `defaultPattern`, `spellPerformedNote`, `noteLabel`, `type NoteName`,
`barColumns`, `beatLabel`, `type NoteColumn`, `type PlayedNote`, `practiceMarks`, `playerRange`).

Run: `npx vitest run src/features/practice`
Expected: PASS.

- [ ] **Step 3: Commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
npx prettier --write src/features/practice
git add src/features/practice
git commit -m "Arrange a piece from the learner's choice and name what the Player shows

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 15: Checks, My gaps and the quiz hook

**Files:**
- Create in `src/features/quiz/`: `check-plan.ts`, `check-plan.test.ts`, `my-gaps.ts`, `my-gaps.test.ts`,
  `quiz-keys.ts`, `quiz-keys.test.ts`, `use-quiz.ts`, `use-quiz.test.tsx`
- Modify: `src/features/quiz/index.ts`

**Interfaces:**
- Consumes: `quizReducer`, `createQuestion`, `answerOf`, `isFinished`, `INITIAL_QUIZ`, `QuizConfig`, `Question`
  (quiz machine); `recordAnswer`; `usePlay`; `chordSounds`; `chordVoicing`, `spellScale`; `pathSteps`,
  `skillsOfStep`; `pieceById`, `skillsOfPiece`, `chordRootsOfPiece`; `rate`, `ProgressState`; `rangeFor`, `KeyMark`.
- Produces:
  - `CheckPlan = { of: StepId; skills: readonly SkillId[]; config: QuizConfig; length: number; marks: StepId |
    null }`; `checkPlan(of: StepId): CheckPlan | null`
  - `myGaps(answers: ProgressState['answers'], practised: ProgressState['practised']): SkillId[]`
  - `QUIZ_RANGE = { from: 60, to: 76 }`; `targetKeys(question: Question): Midi[]`;
    `quizKeyboardRange(question: Question | null): { from: Midi; to: Midi }`;
    `answerKeys(question: Question, selected: readonly Midi[]): { marks: Map<Midi, KeyMark>; outlined: Set<Midi>;
    wrong: Set<Midi> }`
  - `Quiz = { state: QuizState; finished: boolean; toggleKey(key: Midi): void; clear(): void; check(): void;
    choose(symbol: string): void; next(): void; hear(): void }`;
    `useQuiz(config: QuizConfig, options?: { random?: () => number }): Quiz` — the first question is drawn on the
    first render; a new config needs a new `key` on the caller.

- [ ] **Step 1: Write the failing pure tests**

`check-plan.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { chordRootsOfPiece, pieceById, skillsOfPiece } from '@/entities/piece'
import { qualitiesIn } from '@/shared/lib/music'
import { checkPlan } from './check-plan'

describe('checkPlan', () => {
  it('checks a piece’s chords on its own roots, six questions, building them', () => {
    const bz5 = pieceById('bz5')
    if (!bz5) throw new Error('bz5')
    const plan = checkPlan('piece:bz5')
    expect(plan?.length).toBe(6)
    expect(plan?.marks).toBeNull()
    expect(plan?.config).toEqual({
      chordMode: 'build-chord',
      scope: { skills: skillsOfPiece(bz5), roots: chordRootsOfPiece(bz5), length: 6 },
    })
  })

  it('asks every quality of a family in turn, twice each', () => {
    const plan = checkPlan('chords:sev')
    const count = qualitiesIn('sev').length
    expect(plan?.length).toBe(Math.max(6, count * 2))
    expect(plan?.config.scope.ordered).toBe(true)
    expect(plan?.marks).toBe('chords:sev')
  })

  it('builds a scale six times', () => {
    expect(checkPlan('scale:harmonic')).toMatchObject({
      length: 6,
      skills: ['scale:harmonic'],
      marks: 'scale:harmonic',
    })
  })

  it('has no plan for a piece that is not there', () => {
    expect(checkPlan('piece:gone')).toBeNull()
  })
})
```

`my-gaps.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { pieceById, skillsOfPiece } from '@/entities/piece'
import { myGaps } from './my-gaps'

const wrong = [{ correct: false, at: '2026-09-01T10:00:00Z' }]

describe('myGaps', () => {
  it('puts gaps first, then unknown skills of pieces the learner has opened', () => {
    const bz5 = pieceById('bz5')
    if (!bz5) throw new Error('bz5')
    const gaps = myGaps({ 'scale:blues': wrong }, { bz5: '2026-09-02T10:00:00Z' })
    expect(gaps[0]).toBe('scale:blues')
    expect(gaps.slice(1)).toEqual(skillsOfPiece(bz5))
  })

  it('skips a practised piece the app no longer has', () => {
    expect(myGaps({}, { gone: '2026-09-02T10:00:00Z' })).toEqual([])
  })
})
```

`quiz-keys.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { chordSkill, chordSymbol, midi, note, spellChord } from '@/shared/lib/music'
import type { Question } from './quiz-machine'
import { answerKeys, QUIZ_RANGE, quizKeyboardRange, targetKeys } from './quiz-keys'

const chord = (letter: 'C' | 'B', quality: 'maj' | 'n13'): Question => {
  const root = note(letter)
  return {
    mode: 'build-chord',
    skill: chordSkill(quality),
    root,
    quality,
    symbol: chordSymbol({ root, quality }),
    tones: spellChord(root, quality),
  }
}

describe('quiz keys', () => {
  it('builds on one octave and a third from middle C', () => {
    expect(quizKeyboardRange(chord('C', 'maj'))).toEqual(QUIZ_RANGE)
  })

  it('widens the keyboard to show a wide chord whole', () => {
    const question = { ...chord('B', 'n13'), mode: 'name-chord' as const, options: [] }
    const { from, to } = quizKeyboardRange(question)
    for (const key of targetKeys(question)) {
      expect(key).toBeGreaterThanOrEqual(from)
      expect(key).toBeLessThanOrEqual(to)
    }
  })

  it('shows the answer: right keys by role, missing ones outlined, extra ones wrong', () => {
    const { marks, outlined, wrong } = answerKeys(chord('C', 'maj'), [midi(60), midi(63), midi(67)])
    expect(marks.get(midi(60))?.tone).toBe('root')
    expect(marks.get(midi(67))?.tone).toBe('5th')
    expect([...outlined]).toEqual([64])
    expect([...wrong]).toEqual([63])
  })
})
```

Run: `npx vitest run src/features/quiz`
Expected: FAIL.

- [ ] **Step 2: Implement the pure modules**

`check-plan.ts`:

```ts
import { pathSteps, skillsOfStep, type StepId } from '@/entities/path'
import { chordRootsOfPiece, pieceById, skillsOfPiece } from '@/entities/piece'
import type { SkillId } from '@/shared/lib/music'
import type { QuizConfig } from './quiz-machine'

export interface CheckPlan {
  readonly of: StepId
  readonly skills: readonly SkillId[]
  readonly config: QuizConfig
  readonly length: number
  /** The step whose skills this check can make Known, marking it learned. */
  readonly marks: StepId | null
}

const PIECE_CHECK = 6
const LEAST = 6

/** A Check's questions (spec §4.6): a piece's chords, a chord family in turn, or a scale. */
export function checkPlan(of: StepId): CheckPlan | null {
  const placed = pathSteps().find((s) => s.id === of)
  if (!placed) return null
  const { step } = placed
  if (step.kind === 'piece') {
    const piece = pieceById(step.pieceId)
    if (!piece) return null
    const skills = skillsOfPiece(piece)
    return {
      of,
      skills,
      length: PIECE_CHECK,
      marks: null,
      config: {
        chordMode: 'build-chord',
        scope: { skills, roots: chordRootsOfPiece(piece), length: PIECE_CHECK },
      },
    }
  }
  const skills = skillsOfStep(step)
  const length = step.kind === 'chords' ? Math.max(LEAST, skills.length * 2) : LEAST
  return {
    of,
    skills,
    length,
    marks: of,
    config: {
      chordMode: 'build-chord',
      scope: step.kind === 'chords' ? { skills, length, ordered: true } : { skills, length },
    },
  }
}
```

`my-gaps.ts`:

```ts
import { pieceById, skillsOfPiece } from '@/entities/piece'
import { rate, type ProgressState } from '@/entities/progress'
import { SKILLS, type SkillId } from '@/shared/lib/music'

/** My gaps (spec §4.6 ③): gap skills first, then unknown skills of pieces the learner has opened. */
export function myGaps(
  answers: ProgressState['answers'],
  practised: ProgressState['practised'],
): SkillId[] {
  const ratingOf = (skill: SkillId) => rate(answers[skill] ?? [])
  const used = new Set(
    Object.keys(practised).flatMap((id) => {
      const piece = pieceById(id)
      return piece ? skillsOfPiece(piece) : []
    }),
  )
  return [
    ...SKILLS.filter((skill) => ratingOf(skill) === 'gap'),
    ...SKILLS.filter((skill) => used.has(skill) && ratingOf(skill) === 'unknown'),
  ]
}
```

`quiz-keys.ts`:

```ts
import {
  chordVoicing,
  midi,
  pitchClass,
  pitchClassOf,
  spellScale,
  type Midi,
  type Tone,
} from '@/shared/lib/music'
import { rangeFor, type KeyMark } from '@/shared/ui'
import type { Question } from './quiz-machine'

/** Middle C to the E above the next C: room to build any chord or scale, any octave counting. */
export const QUIZ_RANGE = { from: midi(60), to: midi(76) }

const tonesOf = (question: Question): readonly Tone[] =>
  question.mode === 'build-scale' ? question.notes : question.tones

/** The question's answer on the keyboard: a chord voiced from middle C, a scale up from its root. */
export function targetKeys(question: Question): Midi[] {
  if (question.mode === 'build-scale') {
    const base = 60 + pitchClassOf(question.root)
    return spellScale(question.root, question.kind).map((tone) => midi(base + tone.semitones))
  }
  return chordVoicing(question.root, question.quality, { inversion: 0, bothHands: false }).rh.map(
    (placed) => placed.midi,
  )
}

/** Building keeps the quiz range; naming shows the chord whole, however wide. */
export function quizKeyboardRange(question: Question | null): { from: Midi; to: Midi } {
  if (!question || question.mode !== 'name-chord') return QUIZ_RANGE
  return rangeFor(targetKeys(question), QUIZ_RANGE)
}

/** After Check: the right keys by role, the missing tones outlined where the answer has them, extras wrong. */
export function answerKeys(
  question: Question,
  selected: readonly Midi[],
): { marks: Map<Midi, KeyMark>; outlined: Set<Midi>; wrong: Set<Midi> } {
  const tones = tonesOf(question)
  const marks = new Map<Midi, KeyMark>()
  const wrong = new Set<Midi>()
  for (const key of selected) {
    const tone = tones.find((t) => t.pitchClass === pitchClass(key))
    if (tone) marks.set(key, { tone: tone.role, label: tone.degree })
    else wrong.add(key)
  }
  const played = new Set(selected.map((key) => pitchClass(key)))
  const outlined = new Set(
    targetKeys(question).filter((key) => !played.has(pitchClass(key))),
  )
  return { marks, outlined, wrong }
}
```

Run the pure tests. Expected: PASS.

- [ ] **Step 3: Write the failing hook test**

`use-quiz.test.tsx`:

```tsx
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { createProgressStore, ProgressStoreProvider } from '@/entities/progress'
import { createFakeAudio } from '@/shared/api/audio'
import { createMemoryStorage } from '@/shared/lib'
import { pitchClass } from '@/shared/lib/music'
import { ServicesProvider } from '@/shared/lib/services'
import type { QuizConfig } from './quiz-machine'
import { targetKeys } from './quiz-keys'
import { useQuiz } from './use-quiz'

const ONLY_C_MAJOR: QuizConfig = {
  chordMode: 'build-chord',
  scope: { skills: ['chord:maj'], roots: [pitchClass(0)], length: 2 },
}

function setup(config: QuizConfig) {
  const store = createProgressStore({ storage: createMemoryStorage() })
  const audio = createFakeAudio()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ProgressStoreProvider store={store}>
      <ServicesProvider services={{ audio, midi: null }}>{children}</ServicesProvider>
    </ProgressStoreProvider>
  )
  const hook = renderHook(() => useQuiz(config, { random: () => 0 }), { wrapper })
  return { ...hook, store, audio }
}

describe('useQuiz', () => {
  it('asks a question at once and records a right answer as evidence', () => {
    const { result, store, audio } = setup(ONLY_C_MAJOR)
    const question = result.current.state.question
    if (!question) throw new Error('no question')
    act(() => {
      for (const key of targetKeys(question)) result.current.toggleKey(key)
    })
    act(() => result.current.check())
    expect(result.current.state.result?.correct).toBe(true)
    expect(store.getState().answers['chord:maj']).toHaveLength(1)
    expect(store.getState().quiz.correct).toBe(1)
    expect(audio.played.length).toBeGreaterThan(0)
  })

  it('records a wrong answer once, however often Check is pressed', () => {
    const { result, store } = setup(ONLY_C_MAJOR)
    act(() => result.current.check())
    act(() => result.current.check())
    expect(store.getState().answers['chord:maj']).toEqual([expect.objectContaining({ correct: false })])
  })

  it('finishes after the scope’s length', () => {
    const { result } = setup(ONLY_C_MAJOR)
    act(() => result.current.check())
    act(() => result.current.next())
    act(() => result.current.check())
    expect(result.current.finished).toBe(true)
    act(() => result.current.next())
    expect(result.current.state.asked).toBe(2)
  })
})
```

Run: `npx vitest run src/features/quiz/use-quiz.test.tsx`
Expected: FAIL.

- [ ] **Step 4: Implement `use-quiz.ts`**

```ts
import { useEffect, useMemo, useReducer, useRef } from 'react'
import { useProgressStoreApi } from '@/entities/progress'
import { recordAnswer } from '@/features/record-answer'
import type { Midi } from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlay } from '@/shared/lib/services'
import {
  answerOf,
  createQuestion,
  INITIAL_QUIZ,
  isFinished,
  quizReducer,
  type Question,
  type QuizConfig,
  type QuizEvent,
  type QuizState,
} from './quiz-machine'
import { targetKeys } from './quiz-keys'

export interface Quiz {
  readonly state: QuizState
  readonly finished: boolean
  toggleKey(key: Midi): void
  clear(): void
  check(): void
  choose(symbol: string): void
  next(): void
  /** Sounds the question's chord: Name chord's "Play again". */
  hear(): void
}

/**
 * Drives the quiz machine: draws questions, records each answer once as evidence, sounds Name
 * chord questions and every answer. A new config needs a new `key` on the caller.
 */
export function useQuiz(config: QuizConfig, options: { random?: () => number } = {}): Quiz {
  const random = options.random ?? Math.random
  const store = useProgressStoreApi()
  const play = usePlay()
  const [state, dispatch] = useReducer(quizReducer, undefined, () =>
    quizReducer(INITIAL_QUIZ, { type: 'ask', question: createQuestion(config, { index: 0, random }) }),
  )
  const latest = useRef(state)
  useEffect(() => {
    latest.current = state
  })

  const sound = (question: Question | null, arpeggio = false) => {
    if (question) play(chordSounds(targetKeys(question), { arpeggio }))
  }

  // Name chord is asked by ear: the first question sounds as soon as it is shown.
  useEffect(() => {
    if (latest.current.question?.mode === 'name-chord') sound(latest.current.question)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, for the first question
  }, [])

  const actions = useMemo(() => {
    const act = (event: QuizEvent) => {
      const current = latest.current
      const next = quizReducer(current, event)
      if (next === current) return
      latest.current = next
      dispatch(event)
      if (!current.result && next.result) {
        const answer = answerOf(next)
        if (answer) recordAnswer(store, answer, new Date())
        if (next.question?.mode !== 'name-chord')
          sound(next.question, next.question?.mode === 'build-scale')
      }
    }
    return {
      toggleKey: (key: Midi) => act({ type: 'toggleKey', midi: key }),
      clear: () => act({ type: 'clear' }),
      check: () => act({ type: 'check' }),
      choose: (symbol: string) => act({ type: 'choose', symbol }),
      next() {
        const current = latest.current
        if (!current.result || isFinished(current, config.scope)) return
        const question = createQuestion(config, {
          index: current.asked,
          random,
          previous: current.question,
        })
        act({ type: 'ask', question })
        if (question.mode === 'name-chord') sound(question)
      },
      hear: () => sound(latest.current.question),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- config and random are fixed per key
  }, [store, play])

  return { state, finished: isFinished(state, config.scope), ...actions }
}
```

Check: the machine's `ask` counts `asked` (so `asked` after the first question is 1 and the next index is 1). If
`createQuestion`'s `index` expects the zero-based number of the question being asked, `current.asked` is right.

Export from `src/features/quiz/index.ts`: `checkPlan, type CheckPlan`, `myGaps`,
`answerKeys, QUIZ_RANGE, quizKeyboardRange, targetKeys`, `useQuiz, type Quiz`.

Run: `npx vitest run src/features/quiz`
Expected: PASS.

- [ ] **Step 5: Commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
npx prettier --write src/features/quiz
git add src/features/quiz
git commit -m "Plan checks, find my gaps and drive the quiz with evidence and sound

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---
### Task 16: Names for steps, chords and scales; every route's search params

The explorers, the Check, Songs and the Player link to each other, so every route learns its search params here,
before any screen needs them. The validators live in the app layer (`src/app/routes/search.ts`): a page's `index.ts`
may not be imported by the router, or the page would leave its lazy chunk.

**Files:**
- Create: `src/entities/path/ui/use-step-title.ts`, `src/entities/path/ui/use-step-title.test.tsx`,
  `src/app/routes/search.ts`, `src/app/routes/search.test.ts`
- Modify: `src/entities/path/index.ts`, `src/shared/i18n/locales/{en,ru}/{theory,path}.ts`, `src/app/router.tsx`,
  `src/app/router.test.tsx`

**Interfaces:**
- Produces:
  - `StepKind = 'chords' | 'scale' | 'exercise' | 'song' | 'progression'`;
    `useStepTitle(): (step: PathStep) => { primary: string; secondary?: string; kind: StepKind }`
  - theory strings: `family.<ChordFamily>`, `quality.<ChordQuality>` (full names), `scaleKind.<ScaleKind>` (chip
    labels), `scaleName.<ScaleKind>` (after a note: "E♭ harmonic minor")
  - validators and defaults: `validateSongsSearch`, `SONGS_DEFAULTS`, `SongsSearch = { q: string; collection:
    CollectionId | 'all'; level: Level | 'any' }`; `validateChordsSearch`, `CHORDS_DEFAULTS`, `ChordsSearch = { root:
    string; quality: ChordQuality; inversion: number; hands: 'rh' | 'both'; step?: ChordsStepId }`;
    `validateScalesSearch`, `SCALES_DEFAULTS`, `ScalesSearch = { root: string; kind: ScaleKind; view: 'degrees' |
    'rh' | 'lh'; rhythm: PracticeRhythm; tempo: number; hands: Hands; chords: 3 | 4; step?: ScaleStepId }`;
    `validateQuizSearch`, `QUIZ_DEFAULTS`, `QuizSearch = { mode: QuizTab }` with `QuizTab = 'build-chord' |
    'name-chord' | 'build-scale' | 'gaps'`; `validateCheckSearch`, `CheckSearch = { of?: StepId }`;
    `validatePlayerSearch`, `PLAYER_DEFAULTS`, `PlayerSearch = { key?: string; tempo?: number; hands: Hands; mode:
    PracticeMode; pattern?: PatternId | 'chart'; rh?: RightFigureId; lh?: LeftFigureId; voicing?: Voicing }`
    (absent = the piece's own).
  - route ids used by pages: `/shell/songs`, `/shell/songs/$pieceId`, `/shell/theory/chords`,
    `/shell/theory/scales`, `/shell/theory/quiz`, `/full-screen/play/$pieceId`; `notFound()` for an unknown entry at
    `/songs/$pieceId` and for anything but a piece at `/play/$pieceId`.

- [ ] **Step 1: Add the theory and path names**

`en/theory.ts` gains (keep `title` and `tabs`):

```ts
  family: {
    tri: 'Triads',
    six: '6th & add',
    sev: '7th chords',
    nin: '9ths & more',
    alt: 'Altered 7ths',
  },
  quality: {
    maj: 'Major triad',
    min: 'Minor triad',
    dim: 'Diminished triad',
    aug: 'Augmented triad',
    sus2: 'Suspended 2nd',
    sus4: 'Suspended 4th',
    six: 'Major 6th',
    m6: 'Minor 6th',
    s69: 'Major 6/9',
    m69: 'Minor 6/9',
    add9: 'Added 9th',
    maj7: 'Major 7th',
    m7: 'Minor 7th',
    d7: 'Dominant 7th',
    hd: 'Half-diminished 7th',
    o7: 'Diminished 7th',
    mM7: 'Minor-major 7th',
    sus7: 'Dominant 7th sus4',
    M7s11: 'Major 7th sharp 11',
    M7s5: 'Augmented major 7th',
    m9: 'Minor 9th',
    maj9: 'Major 9th',
    n9: 'Dominant 9th',
    m11: 'Minor 11th',
    n13: 'Dominant 13th',
    b9: '7th flat 9',
    s9: '7th sharp 9',
    b5: '7th flat 5',
    s5: '7th sharp 5',
    s11: '7th sharp 11 (Lydian dominant)',
    b13: '7th flat 13',
    b9s5: '7th flat 9 sharp 5',
    alt: 'Altered dominant',
  },
  scaleKind: {
    major: 'Major',
    natural: 'Natural minor',
    harmonic: 'Harmonic minor',
    melodic: 'Melodic minor',
    pent: 'Major pentatonic',
    mpent: 'Minor pentatonic',
    blues: 'Blues',
  },
  scaleName: {
    major: 'major',
    natural: 'natural minor',
    harmonic: 'harmonic minor',
    melodic: 'melodic minor',
    pent: 'major pentatonic',
    mpent: 'minor pentatonic',
    blues: 'blues scale',
  },
```

`ru/theory.ts`:

```ts
  family: {
    tri: 'Трезвучия',
    six: 'Секста и add',
    sev: 'Септаккорды',
    nin: 'Нонаккорды и выше',
    alt: 'Альтерированные',
  },
  quality: {
    maj: 'Мажорное трезвучие',
    min: 'Минорное трезвучие',
    dim: 'Уменьшенное трезвучие',
    aug: 'Увеличенное трезвучие',
    sus2: 'Трезвучие с задержанной секундой',
    sus4: 'Трезвучие с задержанной квартой',
    six: 'Мажорное трезвучие с секстой',
    m6: 'Минорное трезвучие с секстой',
    s69: 'Мажорное трезвучие с секстой и ноной',
    m69: 'Минорное трезвучие с секстой и ноной',
    add9: 'Трезвучие с добавленной ноной',
    maj7: 'Большой мажорный септаккорд',
    m7: 'Малый минорный септаккорд',
    d7: 'Доминантсептаккорд',
    hd: 'Полууменьшенный септаккорд',
    o7: 'Уменьшенный септаккорд',
    mM7: 'Большой минорный септаккорд',
    sus7: 'Доминантсептаккорд с квартой',
    M7s11: 'Большой мажорный септаккорд с увеличенной квартой',
    M7s5: 'Большой увеличенный септаккорд',
    m9: 'Малый минорный нонаккорд',
    maj9: 'Большой мажорный нонаккорд',
    n9: 'Доминантнонаккорд',
    m11: 'Минорный ундецимаккорд',
    n13: 'Доминантовый терцдецимаккорд',
    b9: 'Септаккорд с пониженной ноной',
    s9: 'Септаккорд с повышенной ноной',
    b5: 'Септаккорд с пониженной квинтой',
    s5: 'Септаккорд с повышенной квинтой',
    s11: 'Септаккорд с повышенной квартой (лидийский)',
    b13: 'Септаккорд с пониженной терцдецимой',
    b9s5: 'Септаккорд с пониженной ноной и повышенной квинтой',
    alt: 'Альтерированный доминантсептаккорд',
  },
  scaleKind: {
    major: 'Мажор',
    natural: 'Натуральный минор',
    harmonic: 'Гармонический минор',
    melodic: 'Мелодический минор',
    pent: 'Мажорная пентатоника',
    mpent: 'Минорная пентатоника',
    blues: 'Блюз',
  },
  scaleName: {
    major: 'мажор',
    natural: 'натуральный минор',
    harmonic: 'гармонический минор',
    melodic: 'мелодический минор',
    pent: 'мажорная пентатоника',
    mpent: 'минорная пентатоника',
    blues: 'блюзовая гамма',
  },
```

`en/path.ts` → `{ title: 'Path', kind: { chords: 'Chords', scale: 'Scale', exercise: 'Exercise', song: 'Song',
progression: 'Progression' } }`; `ru/path.ts` → `{ title: 'Путь', kind: { chords: 'Аккорды', scale: 'Гамма',
exercise: 'Упражнение', song: 'Песня', progression: 'Последовательность' } }`.

- [ ] **Step 2: Write the failing step-title test**

`use-step-title.test.tsx`:

```tsx
import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { i18n } from '@/shared/i18n'
import { useStepTitle } from './use-step-title'

afterEach(() => act(() => void i18n.changeLanguage('en')))

describe('useStepTitle', () => {
  it('names a chord step by its family, a scale step by its kind', () => {
    const { result } = renderHook(() => useStepTitle())
    expect(result.current({ kind: 'chords', family: 'sev' })).toEqual({ primary: '7th chords', kind: 'chords' })
    expect(result.current({ kind: 'scale', scale: 'harmonic' })).toEqual({
      primary: 'Harmonic minor',
      kind: 'scale',
    })
  })

  it('names a piece by its titles and its kind', () => {
    const { result } = renderHook(() => useStepTitle())
    expect(result.current({ kind: 'piece', pieceId: 'bz5' })).toEqual({
      primary: 'Still, my soul, be still',
      secondary: 'Мир, душа, храни',
      kind: 'song',
    })
    act(() => void i18n.changeLanguage('ru'))
    expect(result.current({ kind: 'piece', pieceId: 'bz5' })).toEqual({
      primary: 'Мир, душа, храни',
      kind: 'song',
    })
  })
})
```

Run: `npx vitest run src/entities/path/ui`
Expected: FAIL.

- [ ] **Step 3: Implement `use-step-title.ts`**

```ts
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { entryTitles, pieceById } from '@/entities/piece'
import { useLanguage } from '@/shared/i18n'
import type { PathStep } from '../model/types'

export type StepKind = 'chords' | 'scale' | 'exercise' | 'song' | 'progression'

export interface StepTitle {
  readonly primary: string
  readonly secondary?: string
  readonly kind: StepKind
}

/** A step's name in the learner's language, and what kind of step it is. */
export function useStepTitle(): (step: PathStep) => StepTitle {
  const { t } = useTranslation('theory')
  const language = useLanguage()
  return useCallback(
    (step) => {
      switch (step.kind) {
        case 'chords':
          return { primary: t(`family.${step.family}`), kind: 'chords' }
        case 'scale':
          return { primary: t(`scaleKind.${step.scale}`), kind: 'scale' }
        case 'piece': {
          const piece = pieceById(step.pieceId)
          if (!piece) return { primary: step.pieceId, kind: 'song' }
          return { ...entryTitles(piece, language), kind: piece.kind }
        }
      }
    },
    [t, language],
  )
}
```

Export `useStepTitle, type StepKind, type StepTitle` from `src/entities/path/index.ts`. Run the test. Expected: PASS.

- [ ] **Step 4: Write the failing validator tests**

`src/app/routes/search.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import {
  CHORDS_DEFAULTS,
  PLAYER_DEFAULTS,
  QUIZ_DEFAULTS,
  SCALES_DEFAULTS,
  SONGS_DEFAULTS,
  validateCheckSearch,
  validateChordsSearch,
  validatePlayerSearch,
  validateQuizSearch,
  validateScalesSearch,
  validateSongsSearch,
} from './search'

/** What the router hands a validator: anything a URL can hold. */
const raw = (search: Record<string, unknown>) => search as never

describe('search params', () => {
  it('fill every default for an empty URL', () => {
    expect(validateSongsSearch(raw({}))).toEqual(SONGS_DEFAULTS)
    expect(validateChordsSearch(raw({}))).toEqual(CHORDS_DEFAULTS)
    expect(validateScalesSearch(raw({}))).toEqual(SCALES_DEFAULTS)
    expect(validateQuizSearch(raw({}))).toEqual(QUIZ_DEFAULTS)
    expect(validatePlayerSearch(raw({}))).toEqual(PLAYER_DEFAULTS)
    expect(validateCheckSearch(raw({}))).toEqual({})
  })

  it('keep what is valid', () => {
    expect(
      validateChordsSearch(raw({ root: 'Bb', quality: 'm7', inversion: 2, hands: 'both', step: 'chords:sev' })),
    ).toEqual({ root: 'Bb', quality: 'm7', inversion: 2, hands: 'both', step: 'chords:sev' })
    expect(
      validatePlayerSearch(
        raw({ key: 'A', tempo: 96, hands: 'lh', mode: 'turn', pattern: 'chart', rh: 't1', lh: 'o', voicing: 'ninths' }),
      ),
    ).toEqual({ key: 'A', tempo: 96, hands: 'lh', mode: 'turn', pattern: 'chart', rh: 't1', lh: 'o', voicing: 'ninths' })
    expect(validateSongsSearch(raw({ q: 'душа', collection: 'hymns', level: 1 }))).toEqual({
      q: 'душа',
      collection: 'hymns',
      level: 1,
    })
  })

  it('drop anything stale or hand-edited back to its default', () => {
    expect(
      validatePlayerSearch(raw({ key: 'H', tempo: 999, mode: 'dance', pattern: 'waltz', rh: 'zz', voicing: 'elevenths' })),
    ).toEqual(PLAYER_DEFAULTS)
    expect(validateChordsSearch(raw({ quality: 'maj13', inversion: 7, step: 'scale:major' }))).toEqual({
      ...CHORDS_DEFAULTS,
      inversion: 3,
    })
    expect(validateScalesSearch(raw({ kind: 'dorian', tempo: 10, chords: 5, step: 'chords:tri' }))).toEqual(
      SCALES_DEFAULTS,
    )
    expect(validateCheckSearch(raw({ of: 'nothing:here' }))).toEqual({})
  })
})
```

(`inversion: 7` clamps to 3, the last inversion there is; any other invalid value takes the default.)

Run: `npx vitest run src/app/routes/search.test.ts`
Expected: FAIL.

- [ ] **Step 5: Implement `src/app/routes/search.ts`**

```ts
import type { SearchSchemaInput } from '@tanstack/react-router'
import { isStepId, LEVELS, type Level, type StepId } from '@/entities/path'
import {
  isLeftFigureId,
  isPatternId,
  isRightFigureId,
  type LeftFigureId,
  type PatternId,
  type RightFigureId,
} from '@/entities/pattern'
import { COLLECTIONS, VOICINGS, type CollectionId, type Voicing } from '@/entities/piece'
import type { PracticeMode } from '@/features/practice'
import { isOneOf, noteIn, valueOr, wholeIn } from '@/shared/lib'
import {
  CHORD_FAMILIES,
  CHORD_QUALITIES,
  SCALE_KINDS,
  type ChordFamily,
  type ChordQuality,
  type ScaleKind,
} from '@/shared/lib/music'
import { PRACTICE_RHYTHM_IDS, type Hands, type PracticeRhythm } from '@/shared/lib/schedule'

type Input<S> = Partial<S> & SearchSchemaInput
const fieldsOf = <S>(input: Input<S>): Record<string, unknown> => input as Record<string, unknown>

const isHands = isOneOf(['both', 'rh', 'lh'] as const)
const isQuality = isOneOf(CHORD_QUALITIES)
const isScaleKind = isOneOf(SCALE_KINDS)
const isCollection = isOneOf([...COLLECTIONS.map((c) => c.id), 'all'] as const)
const isLevel = (value: unknown): value is Level | 'any' =>
  value === 'any' || (LEVELS as readonly unknown[]).includes(value)

// Songs
export interface SongsSearch {
  readonly q: string
  readonly collection: CollectionId | 'all'
  readonly level: Level | 'any'
}
export const SONGS_DEFAULTS: SongsSearch = { q: '', collection: 'all', level: 'any' }
export function validateSongsSearch(input: Input<SongsSearch>): SongsSearch {
  const raw = fieldsOf(input)
  return {
    q: typeof raw.q === 'string' ? raw.q : SONGS_DEFAULTS.q,
    collection: valueOr(isCollection, raw.collection, SONGS_DEFAULTS.collection),
    level: valueOr(isLevel, raw.level, SONGS_DEFAULTS.level),
  }
}

// Theory → Chords
export type ChordsStepId = `chords:${ChordFamily}`
export interface ChordsSearch {
  readonly root: string
  readonly quality: ChordQuality
  readonly inversion: number
  readonly hands: 'rh' | 'both'
  readonly step?: ChordsStepId
}
export const CHORDS_DEFAULTS: ChordsSearch = { root: 'C', quality: 'maj', inversion: 0, hands: 'rh' }
const isChordsStep = (value: unknown): value is ChordsStepId =>
  typeof value === 'string' &&
  value.startsWith('chords:') &&
  (CHORD_FAMILIES as readonly string[]).includes(value.slice('chords:'.length))
export function validateChordsSearch(input: Input<ChordsSearch>): ChordsSearch {
  const raw = fieldsOf(input)
  const inversion = wholeIn(raw.inversion, 0, Number.MAX_SAFE_INTEGER, CHORDS_DEFAULTS.inversion)
  return {
    root: noteIn(raw.root, CHORDS_DEFAULTS.root),
    quality: valueOr(isQuality, raw.quality, CHORDS_DEFAULTS.quality),
    inversion: Math.min(inversion, 3),
    hands: valueOr(isOneOf(['rh', 'both'] as const), raw.hands, CHORDS_DEFAULTS.hands),
    ...(isChordsStep(raw.step) ? { step: raw.step } : {}),
  }
}

// Theory → Scales
export type ScaleStepId = `scale:${ScaleKind}`
export interface ScalesSearch {
  readonly root: string
  readonly kind: ScaleKind
  readonly view: 'degrees' | 'rh' | 'lh'
  readonly rhythm: PracticeRhythm
  readonly tempo: number
  readonly hands: Hands
  readonly chords: 3 | 4
  readonly step?: ScaleStepId
}
export const SCALES_DEFAULTS: ScalesSearch = {
  root: 'C',
  kind: 'major',
  view: 'degrees',
  rhythm: 'even',
  tempo: 80,
  hands: 'rh',
  chords: 3,
}
const isScaleStep = (value: unknown): value is ScaleStepId =>
  typeof value === 'string' && value.startsWith('scale:') && isScaleKind(value.slice('scale:'.length))
export function validateScalesSearch(input: Input<ScalesSearch>): ScalesSearch {
  const raw = fieldsOf(input)
  return {
    root: noteIn(raw.root, SCALES_DEFAULTS.root),
    kind: valueOr(isScaleKind, raw.kind, SCALES_DEFAULTS.kind),
    view: valueOr(isOneOf(['degrees', 'rh', 'lh'] as const), raw.view, SCALES_DEFAULTS.view),
    rhythm: valueOr(isOneOf(PRACTICE_RHYTHM_IDS), raw.rhythm, SCALES_DEFAULTS.rhythm),
    tempo: wholeIn(raw.tempo, 40, 160, SCALES_DEFAULTS.tempo),
    hands: valueOr(isHands, raw.hands, SCALES_DEFAULTS.hands),
    chords: raw.chords === 4 ? 4 : 3,
    ...(isScaleStep(raw.step) ? { step: raw.step } : {}),
  }
}

// Theory → Quiz
export const QUIZ_TABS = ['build-chord', 'name-chord', 'build-scale', 'gaps'] as const
export type QuizTab = (typeof QUIZ_TABS)[number]
export interface QuizSearch {
  readonly mode: QuizTab
}
export const QUIZ_DEFAULTS: QuizSearch = { mode: 'build-chord' }
export const validateQuizSearch = (input: Input<QuizSearch>): QuizSearch => ({
  mode: valueOr(isOneOf(QUIZ_TABS), fieldsOf(input).mode, QUIZ_DEFAULTS.mode),
})

// Check
export interface CheckSearch {
  readonly of?: StepId
}
export function validateCheckSearch(input: Input<CheckSearch>): CheckSearch {
  const of = fieldsOf(input).of
  return isStepId(of) ? { of } : {}
}

// Player
export interface PlayerSearch {
  readonly key?: string
  readonly tempo?: number
  readonly hands: Hands
  readonly mode: PracticeMode
  readonly pattern?: PatternId | 'chart'
  readonly rh?: RightFigureId
  readonly lh?: LeftFigureId
  readonly voicing?: Voicing
}
export const PLAYER_DEFAULTS: PlayerSearch = { hands: 'both', mode: 'listen' }
const NO_TEMPO = -1
export function validatePlayerSearch(input: Input<PlayerSearch>): PlayerSearch {
  const raw = fieldsOf(input)
  const key = noteIn(raw.key, '')
  const tempo = wholeIn(raw.tempo, 40, 160, NO_TEMPO)
  const pattern = raw.pattern === 'chart' || isPatternId(raw.pattern) ? raw.pattern : undefined
  return {
    ...(key ? { key } : {}),
    ...(tempo === NO_TEMPO ? {} : { tempo }),
    hands: valueOr(isHands, raw.hands, PLAYER_DEFAULTS.hands),
    mode: valueOr(isOneOf(['listen', 'step', 'turn'] as const), raw.mode, PLAYER_DEFAULTS.mode),
    ...(pattern ? { pattern } : {}),
    ...(isRightFigureId(raw.rh) ? { rh: raw.rh } : {}),
    ...(isLeftFigureId(raw.lh) ? { lh: raw.lh } : {}),
    ...(isOneOf(VOICINGS)(raw.voicing) ? { voicing: raw.voicing } : {}),
  }
}
```

(`isStepId` accepts `piece:gone`; the Check route rejects it in `beforeLoad` through `checkPlan`, Task 18.)

Run the tests. Expected: PASS.

- [ ] **Step 6: Wire the router**

In `src/app/router.tsx` import the validators, defaults, `stripSearchParams`, `notFound`, and
`entryById, pieceById` from `@/entities/piece`, and give each route its search:

```ts
const songsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/songs',
  validateSearch: validateSongsSearch,
  search: { middlewares: [stripSearchParams(SONGS_DEFAULTS)] },
  component: lazyRouteComponent(songsScreens, 'SongsPage'),
})
const pieceRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/songs/$pieceId',
  beforeLoad: ({ params }) => {
    if (!entryById(params.pieceId)) throw notFound()
  },
  component: lazyRouteComponent(songsScreens, 'PiecePage'),
})
```

the same shape for `chordsRoute` (`validateChordsSearch`, `CHORDS_DEFAULTS`), `scalesRoute`, `quizRoute`, and:

```ts
const playerRoute = createRoute({
  getParentRoute: () => fullScreenRoute,
  path: '/play/$pieceId',
  validateSearch: validatePlayerSearch,
  search: { middlewares: [stripSearchParams(PLAYER_DEFAULTS)] },
  beforeLoad: ({ params }) => {
    if (!pieceById(params.pieceId)) throw notFound()
  },
  component: lazyRouteComponent(playerScreens, 'PlayerPage'),
})
```

A `notFound()` from a full-screen route renders the root `notFoundComponent` (the shell with the not-found page).

Add router tests:

```tsx
describe('routes that name a piece', () => {
  it('show not found for a piece that is not there', async () => {
    renderApp('/songs/nothing')
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })

  it('show not found for a listing in the Player', async () => {
    const listing = COLLECTIONS.flatMap((c) => c.entries).find((e) => e.kind === 'listing')
    renderApp(`/play/${listing?.id}`)
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})
```

(import `COLLECTIONS` from `@/entities/piece`.)

- [ ] **Step 7: Verify and commit**

Run: `npm run typecheck && npm run lint && npm run test && npm run build`
Expected: all green; the build's main chunk does not contain page components (check `dist/assets` names: the
screens stay in their `*-screens` chunks).

```bash
npx prettier --write src/entities/path src/app src/shared/i18n/locales
git add src/entities/path src/app src/shared/i18n
git commit -m "Name steps, chords and scales, and let every route read its search params

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 17: The quiz board and Theory → Quiz

**Files:**
- Create: `src/widgets/quiz-board/{index.ts,ui/QuizBoard.tsx,ui/QuizBoard.test.tsx}`,
  `src/widgets/quiz-choice/{index.ts,ui/QuizChoiceSheet.tsx,ui/QuizChoiceSheet.test.tsx}`
- Modify: `src/pages/theory-quiz/ui/TheoryQuizPage.tsx`; create `src/app/screens/theory-quiz.test.tsx`;
  `src/shared/i18n/locales/{en,ru}/quiz.ts`

**Interfaces:**
- Consumes: `useQuiz`, `Quiz`, `answerKeys`, `quizKeyboardRange`, `targetKeys`, `myGaps` (Task 15); `PianoKeyboard`,
  `Segmented`, `Sheet*`; `selectQuizChoice`, `useSettings`, `useSettingsStoreApi`, `DEFAULT_QUIZ_CHOICE`;
  `setQuizFamilies`, `setQuizScales`; `selectQuizStats`, `selectAllAnswers`, `selectPractised`; `QUIZ_TABS`,
  `QuizTab` (app routes are not importable from pages — define the same four tab names in the page).
- Produces: `QuizBoard({ quiz, onDone }: { quiz: Quiz; onDone?: () => void })` — when the quiz is finished and
  answered, its action button says Done and calls `onDone`; `QuizChoiceSheet()` — the trigger button and sheet.

- [ ] **Step 1: Strings**

`en/quiz.ts`:

```ts
export const quiz = {
  title: 'Quiz',
  modes: {
    label: 'Quiz mode',
    'build-chord': 'Build chord',
    'name-chord': 'Name chord',
    'build-scale': 'Build scale',
    gaps: 'My gaps',
  },
  prompt: {
    buildChord: 'Build {{symbol}}',
    nameChord: 'Which chord is this?',
    buildScale: 'Build {{scale}}',
  },
  playAgain: 'Play again',
  answers: 'Answers',
  check: 'Check',
  clear: 'Clear',
  next: 'Next',
  done: 'Done',
  right: 'Right',
  itWas: 'It’s {{answer}}',
  stats: { correct: 'Correct', streak: 'Streak', best: 'Best' },
  choice: {
    open: 'Chords and scales',
    families: 'Chord families',
    scales: 'Scales',
    common: 'Select common',
    clear: 'Clear all',
    apply: 'Apply',
  },
  gaps: { none: 'No gaps found yet.', whole: 'Whole quiz' },
  checkTitle: 'Check: {{title}}',
  progress: 'Question {{n}} of {{total}}',
  score: '{{correct}} of {{total}}',
  marked: '{{title}} is now marked learned.',
  openChords: 'Open in Chords',
  openScales: 'Open in Scales',
} as const
```

`ru/quiz.ts`:

```ts
export const quiz = {
  title: 'Тест',
  modes: {
    label: 'Режим теста',
    'build-chord': 'Построить аккорд',
    'name-chord': 'Назвать аккорд',
    'build-scale': 'Построить гамму',
    gaps: 'Мои пробелы',
  },
  prompt: {
    buildChord: 'Постройте {{symbol}}',
    nameChord: 'Какой это аккорд?',
    buildScale: 'Постройте: {{scale}}',
  },
  playAgain: 'Ещё раз',
  answers: 'Ответы',
  check: 'Проверить',
  clear: 'Сбросить',
  next: 'Дальше',
  done: 'Готово',
  right: 'Верно',
  itWas: 'Это {{answer}}',
  stats: { correct: 'Верно', streak: 'Подряд', best: 'Рекорд' },
  choice: {
    open: 'Аккорды и гаммы',
    families: 'Группы аккордов',
    scales: 'Гаммы',
    common: 'Основные',
    clear: 'Снять все',
    apply: 'Применить',
  },
  gaps: { none: 'Пробелов пока нет.', whole: 'Весь тест' },
  checkTitle: 'Проверка: {{title}}',
  progress: 'Вопрос {{n}} из {{total}}',
  score: '{{correct}} из {{total}}',
  marked: '«{{title}}» отмечено как выученное.',
  openChords: 'Открыть в аккордах',
  openScales: 'Открыть в гаммах',
} as const
```

(Keep the `ru` module's typing pattern as the other Russian modules do.)

- [ ] **Step 2: Write the failing board tests**

`QuizBoard.test.tsx` (renders the board around a real `useQuiz` with a fixed random):

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { createProgressStore, ProgressStoreProvider } from '@/entities/progress'
import { targetKeys, useQuiz, type QuizConfig } from '@/features/quiz'
import { createFakeAudio } from '@/shared/api/audio'
import { createMemoryStorage } from '@/shared/lib'
import { pitchClass } from '@/shared/lib/music'
import { ServicesProvider } from '@/shared/lib/services'
import { QuizBoard } from './QuizBoard'

function Board({ config }: { config: QuizConfig }) {
  const quiz = useQuiz(config, { random: () => 0 })
  return <QuizBoard quiz={quiz} />
}

function renderBoard(config: QuizConfig) {
  const store = createProgressStore({ storage: createMemoryStorage() })
  render(
    <ProgressStoreProvider store={store}>
      <ServicesProvider services={{ audio: createFakeAudio(), midi: null }}>
        <Board config={config} />
      </ServicesProvider>
    </ProgressStoreProvider>,
  )
  return store
}

const C = [pitchClass(0)]

describe('QuizBoard', () => {
  it('asks to build a chord and answers a right build', async () => {
    const user = userEvent.setup()
    renderBoard({ chordMode: 'build-chord', scope: { skills: ['chord:maj'], roots: C } })
    expect(screen.getByRole('heading', { name: 'Build C' })).toBeInTheDocument()
    const check = screen.getByRole('button', { name: 'Check' })
    expect(check).toBeDisabled()
    for (const name of ['C4', 'E4', 'G4']) await user.click(screen.getByRole('button', { name }))
    await user.click(check)
    expect(screen.getByText('Right')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled()
  })

  it('names the answer after a wrong build', async () => {
    const user = userEvent.setup()
    renderBoard({ chordMode: 'build-chord', scope: { skills: ['chord:min'], roots: C } })
    await user.click(screen.getByRole('button', { name: 'C4' }))
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(screen.getByText('It’s Cm · Minor triad')).toBeInTheDocument()
  })

  it('asks to name a chord from four answers', async () => {
    const user = userEvent.setup()
    renderBoard({ chordMode: 'name-chord', scope: { skills: ['chord:d7'], roots: C } })
    expect(screen.getByRole('heading', { name: 'Which chord is this?' })).toBeInTheDocument()
    const answers = screen.getByRole('group', { name: 'Answers' })
    await user.click(screen.getByRole('button', { name: 'C7' }))
    expect(answers).toBeInTheDocument()
    expect(screen.getByText('Right')).toBeInTheDocument()
  })

  it('asks to build a scale', () => {
    renderBoard({ chordMode: 'build-chord', scope: { skills: ['scale:harmonic'], roots: [pitchClass(9)] } })
    expect(screen.getByRole('heading', { name: 'Build A harmonic minor' })).toBeInTheDocument()
  })
})
```

(`targetKeys` is imported to keep the test honest if the default keyboard range changes; drop the import if unused.)

Run: `npx vitest run src/widgets/quiz-board`
Expected: FAIL.

- [ ] **Step 3: Implement `QuizBoard.tsx`**

```tsx
import { Volume2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { answerKeys, quizKeyboardRange, targetKeys, type Quiz } from '@/features/quiz'
import { cn } from '@/shared/lib'
import { noteName, type Midi } from '@/shared/lib/music'
import { PianoKeyboard, RoundButton, type KeyMark } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** One question at a time: the prompt, the keyboard, the answer, and one action. */
export function QuizBoard({ quiz, onDone }: { quiz: Quiz; onDone?: () => void }) {
  const { t } = useTranslation(['quiz', 'theory', 'common'])
  const { question, selected, result } = quiz.state
  if (!question) return null

  const { from, to } = quizKeyboardRange(question)
  const building = question.mode !== 'name-chord'
  const scaleName =
    question.mode === 'build-scale'
      ? `${noteName(question.root)} ${t(`theory:scaleName.${question.kind}`)}`
      : ''
  const answerName =
    question.mode === 'build-scale'
      ? scaleName
      : `${question.symbol} · ${t(`theory:quality.${question.quality}`)}`
  const prompt =
    question.mode === 'build-chord'
      ? t('quiz:prompt.buildChord', { symbol: question.symbol })
      : question.mode === 'name-chord'
        ? t('quiz:prompt.nameChord')
        : t('quiz:prompt.buildScale', { scale: scaleName })

  let marks: ReadonlyMap<Midi, KeyMark> | undefined
  let outlined: ReadonlySet<Midi> | undefined
  let wrong: ReadonlySet<Midi> | undefined
  if (result && building) ({ marks, outlined, wrong } = answerKeys(question, selected))
  else if (!building)
    marks = new Map(
      targetKeys(question).map((key) => [key, { tone: 'selected' } satisfies KeyMark]),
    )

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <h2 className="min-w-0 flex-1 text-4xl font-bold tracking-tight text-balance">{prompt}</h2>
        {question.mode === 'name-chord' ? (
          <RoundButton label={t('quiz:playAgain')} icon={Volume2} onClick={quiz.hear} />
        ) : null}
      </div>

      <PianoKeyboard
        label={t('common:keyboard')}
        from={from}
        to={to}
        className="h-44"
        selectable={building && !result}
        selected={new Set(selected)}
        marks={marks}
        outlined={outlined}
        wrong={wrong}
        onKeyPress={building && !result ? quiz.toggleKey : undefined}
      />

      <p aria-live="polite" className="min-h-7 text-lg font-semibold">
        {result ? (result.correct ? t('quiz:right') : t('quiz:itWas', { answer: answerName })) : null}
      </p>

      {question.mode === 'name-chord' && !result ? (
        <div role="group" aria-label={t('quiz:answers')} className="grid grid-cols-2 gap-3">
          {question.options.map((option) => (
            <Button key={option} variant="outline" size="lg" onClick={() => quiz.choose(option)}>
              {option}
            </Button>
          ))}
        </div>
      ) : null}

      {!result && building ? (
        <div className="flex gap-3">
          {selected.length > 0 ? (
            <Button variant="soft" size="pill" onClick={quiz.clear}>
              {t('quiz:clear')}
            </Button>
          ) : null}
          <Button size="pill" className={cn('flex-1')} disabled={selected.length === 0} onClick={quiz.check}>
            {t('quiz:check')}
          </Button>
        </div>
      ) : null}

      {result ? (
        quiz.finished ? (
          onDone ? (
            <Button size="pill" onClick={onDone}>
              {t('quiz:done')}
            </Button>
          ) : null
        ) : (
          <Button size="pill" onClick={quiz.next}>
            {t('quiz:next')}
          </Button>
        )
      ) : null}
    </section>
  )
}
```

(`className={cn('flex-1')}` → just `className="flex-1"`; layout classes on a primitive are allowed.) Run the tests.
Expected: PASS. If the Name-chord test finds the options by a different accessible name (e.g. `C7` spelled `C7`),
use the symbol the kernel writes.

- [ ] **Step 4: Write the failing choice-sheet test, then implement**

`QuizChoiceSheet.test.tsx` (widgets may not import `app`, so the test builds its own settings store):

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { createSettingsStore, SettingsStoreProvider } from '@/entities/settings'
import { createMemoryStorage } from '@/shared/lib'
import { QuizChoiceSheet } from './QuizChoiceSheet'

function renderSheet() {
  const store = createSettingsStore({ storage: createMemoryStorage(), languages: ['en'] })
  render(
    <SettingsStoreProvider store={store}>
      <QuizChoiceSheet />
    </SettingsStoreProvider>,
  )
  return store
}

describe('QuizChoiceSheet', () => {
  it('saves the chosen families and scales on Apply', async () => {
    const user = userEvent.setup()
    const store = renderSheet()
    await user.click(screen.getByRole('button', { name: 'Chords and scales' }))
    await user.click(screen.getByRole('switch', { name: 'Triads' }))
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    expect(store.getState().quiz.families).toEqual(['tri', 'sev', 'nin'])
  })

  it('cannot apply an empty choice', async () => {
    const user = userEvent.setup()
    renderSheet()
    await user.click(screen.getByRole('button', { name: 'Chords and scales' }))
    await user.click(screen.getByRole('button', { name: 'Clear all' }))
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()
  })
})
```

`QuizChoiceSheet.tsx`:

```tsx
import { SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DEFAULT_QUIZ_CHOICE,
  selectQuizChoice,
  useSettings,
  useSettingsStoreApi,
  type QuizChoice,
} from '@/entities/settings'
import { setQuizFamilies, setQuizScales } from '@/features/set-preference'
import { CHORD_FAMILIES, SCALE_KINDS } from '@/shared/lib/music'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Switch } from '@/shared/ui/primitives/switch'

const toggled = <T,>(list: readonly T[], item: T, on: boolean): T[] =>
  on ? [...list, item] : list.filter((x) => x !== item)

/** Which chord families and scales the open-ended quiz asks: switches, then Apply. */
export function QuizChoiceSheet() {
  const { t } = useTranslation(['quiz', 'theory'])
  const store = useSettingsStoreApi()
  const saved = useSettings(selectQuizChoice)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<QuizChoice>(saved)

  const openWith = (next: boolean) => {
    if (next) setDraft(saved)
    setOpen(next)
  }
  const apply = () => {
    setQuizFamilies(store, draft.families)
    setQuizScales(store, draft.scales)
    setOpen(false)
  }
  const row = (label: string, checked: boolean, onChange: (on: boolean) => void) => (
    <label key={label} className="flex min-h-13 items-center justify-between gap-4 border-b border-border text-lg">
      {label}
      <Switch aria-label={label} checked={checked} onCheckedChange={onChange} />
    </label>
  )

  return (
    <Sheet open={open} onOpenChange={openWith}>
      <SheetTrigger render={<Button variant="soft" />}>
        <SlidersHorizontal data-icon="inline-start" />
        {t('quiz:choice.open')}
      </SheetTrigger>
      <SheetContent
        title={t('quiz:choice.open')}
        footer={
          <Button
            size="pill"
            onClick={apply}
            disabled={draft.families.length === 0 || draft.scales.length === 0}
          >
            {t('quiz:choice.apply')}
          </Button>
        }
      >
        <div className="flex gap-4 pb-2">
          <Button variant="link" className="px-0" onClick={() => setDraft(DEFAULT_QUIZ_CHOICE)}>
            {t('quiz:choice.common')}
          </Button>
          <Button variant="link" className="px-0" onClick={() => setDraft({ families: [], scales: [] })}>
            {t('quiz:choice.clear')}
          </Button>
        </div>
        <h3 className="pt-2 text-sm font-semibold text-muted-foreground">{t('quiz:choice.families')}</h3>
        {CHORD_FAMILIES.map((family) =>
          row(t(`theory:family.${family}`), draft.families.includes(family), (on) =>
            setDraft((d) => ({ ...d, families: toggled(d.families, family, on) })),
          ),
        )}
        <h3 className="pt-4 text-sm font-semibold text-muted-foreground">{t('quiz:choice.scales')}</h3>
        {SCALE_KINDS.map((kind) =>
          row(t(`theory:scaleKind.${kind}`), draft.scales.includes(kind), (on) =>
            setDraft((d) => ({ ...d, scales: toggled(d.scales, kind, on) })),
          ),
        )}
        <SheetClose className="sr-only">{t('common:close')}</SheetClose>
      </SheetContent>
    </Sheet>
  )
}
```

(`min-h-13` is 52px on Tailwind v4's spacing scale.) Run the sheet tests. Expected: PASS. If Base UI's drawer needs
pointer APIs jsdom lacks, add the smallest stub to `src/shared/test/setup.ts` (e.g. `Element.prototype.setPointerCapture`)
with a comment naming why.

- [ ] **Step 5: The Theory → Quiz page**

`TheoryQuizPage.tsx`:

```tsx
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { selectAllAnswers, selectPractised, selectQuizStats, useProgress } from '@/entities/progress'
import { selectQuizChoice, useSettings } from '@/entities/settings'
import { myGaps, useQuiz, type QuizConfig } from '@/features/quiz'
import { chordSkill, qualitiesIn, scaleSkill } from '@/shared/lib/music'
import { Segmented } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { QuizBoard } from '@/widgets/quiz-board'
import { QuizChoiceSheet } from '@/widgets/quiz-choice'

const TABS = ['build-chord', 'name-chord', 'build-scale', 'gaps'] as const
type Tab = (typeof TABS)[number]

function Quiz({ config }: { config: QuizConfig }) {
  return <QuizBoard quiz={useQuiz(config)} />
}

export function TheoryQuizPage() {
  const { t } = useTranslation('quiz')
  const { mode } = useSearch({ from: '/shell/theory/quiz' })
  const navigate = useNavigate({ from: '/theory/quiz' })
  const choice = useSettings(selectQuizChoice)
  const answers = useProgress(selectAllAnswers)
  const practised = useProgress(selectPractised)
  const stats = useProgress(selectQuizStats)
  const setMode = (next: Tab) => void navigate({ search: { mode: next }, replace: true })

  const skills =
    mode === 'build-scale'
      ? choice.scales.map(scaleSkill)
      : mode === 'gaps'
        ? myGaps(answers, practised)
        : choice.families.flatMap((family) => qualitiesIn(family)).map(chordSkill)
  const config: QuizConfig = {
    chordMode: mode === 'name-chord' ? 'name-chord' : 'build-chord',
    scope: mode === 'gaps' ? { skills, ordered: true } : { skills },
  }

  return (
    <div className="flex flex-col gap-6">
      <Segmented
        label={t('modes.label')}
        value={mode}
        options={TABS.map((tab) => ({ value: tab, label: t(`modes.${tab}`) }))}
        onChange={setMode}
      />
      {skills.length === 0 ? (
        <div className="flex flex-col items-start gap-3">
          <p className="text-lg">{t('gaps.none')}</p>
          <Button variant="soft" onClick={() => setMode('build-chord')}>
            {t('gaps.whole')}
          </Button>
        </div>
      ) : (
        <Quiz key={`${mode}:${skills.join(',')}`} config={config} />
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <dl className="flex gap-5 text-sm text-muted-foreground">
          <div>
            <dt className="inline">{t('stats.correct')} </dt>
            <dd className="inline font-semibold text-foreground tabular-nums">
              {stats.correct} / {stats.total}
            </dd>
          </div>
          <div>
            <dt className="inline">{t('stats.streak')} </dt>
            <dd className="inline font-semibold text-foreground tabular-nums">{stats.streak}</dd>
          </div>
          <div>
            <dt className="inline">{t('stats.best')} </dt>
            <dd className="inline font-semibold text-foreground tabular-nums">{stats.best}</dd>
          </div>
        </dl>
        {mode === 'gaps' ? null : <QuizChoiceSheet />}
      </div>
    </div>
  )
}
```

Note: `myGaps` builds a new array every render, so the `key` string (not the array) decides when the quiz restarts;
a new evidence answer can change My gaps' scope and restart it — to keep the current question, freeze the gaps
scope when the tab opens: `const [gapsScope] = useState(() => myGaps(...))` inside a small `GapsQuiz` component
keyed on the tab. Do that.

Screen tests run the whole app through `renderApp`, which lives in `app`; a page may not import `app`, so they sit
in `src/app/screens/` as integration tests (every screen task below does the same):

```tsx
// src/app/screens/theory-quiz.test.tsx
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '../testing/render-app'

describe('Theory → Quiz', () => {
  it('switches modes through the URL', async () => {
    const user = userEvent.setup()
    const { router } = renderApp('/theory/quiz')
    await user.click(await screen.findByRole('button', { name: 'Build scale' }))
    expect(router.state.location.search).toEqual({ mode: 'build-scale' })
    expect(await screen.findByRole('heading', { name: /^Build .+ (major|minor)/ })).toBeInTheDocument()
  })

  it('says so when there are no gaps and offers the whole quiz', async () => {
    const user = userEvent.setup()
    renderApp('/theory/quiz?mode=gaps')
    expect(await screen.findByText('No gaps found yet.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Whole quiz' }))
    expect(await screen.findByRole('heading', { name: /^Build / })).toBeInTheDocument()
  })

  it('counts an answer in the stats', async () => {
    const user = userEvent.setup()
    const { progressStore } = renderApp('/theory/quiz')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    await user.click(within(keyboard).getByRole('button', { name: 'C4' }))
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(progressStore.getState().quiz.total).toBe(1)
  })
})
```

(The default choice's families are 7ths and 9ths, so "Build …" headings name 7th or 9th chords; the regexes above
avoid depending on the random draw.)

- [ ] **Step 6: Verify and commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
npx prettier --write src/widgets/quiz-board src/widgets/quiz-choice src/pages/theory-quiz src/app/screens src/shared/i18n/locales
git add src/widgets src/pages/theory-quiz src/app/screens src/shared
git commit -m "Build the quiz board and the Theory quiz with its choice sheet and My gaps

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 18: The Check

**Files:**
- Create: `src/pages/check/{index.ts,ui/CheckPage.tsx,ui/CheckResult.tsx}`, `src/app/screens/check.test.tsx`
- Modify: `src/app/router.tsx`, `src/app/routes/theory-screens.ts`, `src/app/router.test.tsx` (route list)

**Interfaces:**
- Consumes: `checkPlan`, `useQuiz`, `QuizBoard`, `validateCheckSearch`, `useStepTitle`, `RatingMark`,
  `selectAllAnswers`, `selectIsLearned`, `rate`, `Progress` primitive, `skillOf`.
- Produces: route `/check` (id `/full-screen/check`), `CheckPage`.

- [ ] **Step 1: Write the failing integration tests**

`src/app/screens/check.test.tsx`:

```tsx
import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { recordAnswer } from '@/features/record-answer'
import { chordSkill, qualitiesIn } from '@/shared/lib/music'
import { renderApp } from '../testing/render-app'

describe('Check', () => {
  it('checks a piece’s chords in six questions with a progress bar', async () => {
    renderApp('/check?of=piece:bz5')
    expect(await screen.findByRole('heading', { level: 1, name: 'Check: Still, my soul, be still' })).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '6')
  })

  it('shows the score and each skill’s rating at the end', async () => {
    const user = userEvent.setup()
    renderApp('/check?of=scale:blues')
    for (let i = 0; i < 6; i++) {
      const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
      await user.click(within(keyboard).getByRole('button', { name: 'C4' }))
      await user.click(screen.getByRole('button', { name: 'Check' }))
      await user.click(screen.getByRole('button', { name: i < 5 ? 'Next' : 'Done' }))
    }
    expect(await screen.findByText('0 of 6')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open in Scales' })).toBeInTheDocument()
  })

  it('says when the check marked its step learned', async () => {
    const user = userEvent.setup()
    const { progressStore } = renderApp('/check?of=chords:tri')
    await screen.findByRole('progressbar')
    act(() => {
      for (const quality of qualitiesIn('tri'))
        for (let i = 0; i < 4; i++)
          recordAnswer(progressStore, { skill: chordSkill(quality), correct: true }, new Date())
    })
    // Finish the check (answers wrong or right do not matter for the line: the step is now learned).
    while (!screen.queryByText(/is now marked learned/)) {
      const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
      await user.click(within(keyboard).getByRole('button', { name: 'C4' }))
      await user.click(screen.getByRole('button', { name: 'Check' }))
      const next = screen.queryByRole('button', { name: 'Next' }) ?? screen.getByRole('button', { name: 'Done' })
      await user.click(next)
    }
    expect(screen.getByText('Triads is now marked learned.')).toBeInTheDocument()
  })

  it('shows not found for a check of nothing', async () => {
    renderApp('/check?of=piece:gone')
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})
```

Run: `npx vitest run src/app/screens/check.test.tsx`
Expected: FAIL.

- [ ] **Step 2: Implement**

Router: add to the full-screen group

```ts
const checkRoute = createRoute({
  getParentRoute: () => fullScreenRoute,
  path: '/check',
  validateSearch: validateCheckSearch,
  beforeLoad: ({ search }) => {
    if (!search.of || !checkPlan(search.of)) throw notFound()
  },
  component: lazyRouteComponent(theoryScreens, 'CheckPage'),
})
```

(import `checkPlan` from `@/features/quiz`; add `checkRoute` to `fullScreenRoute.addChildren([...])`; export
`CheckPage` from `app/routes/theory-screens.ts`; add `['/check?of=chords:tri', '/check']` to the router test's
`ROUTES`.)

`src/pages/check/ui/CheckPage.tsx`:

```tsx
import { useCanGoBack, useRouter, useSearch } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { pathSteps, useStepTitle } from '@/entities/path'
import { useProgressStoreApi } from '@/entities/progress'
import { checkPlan, useQuiz, type CheckPlan } from '@/features/quiz'
import { RoundButton } from '@/shared/ui'
import { Progress } from '@/shared/ui/primitives/progress'
import { QuizBoard } from '@/widgets/quiz-board'
import { CheckResult } from './CheckResult'

function CheckFlow({ plan }: { plan: CheckPlan }) {
  const { t } = useTranslation('quiz')
  const router = useRouter()
  const canGoBack = useCanGoBack()
  const store = useProgressStoreApi()
  const stepTitle = useStepTitle()
  const step = pathSteps().find((s) => s.id === plan.of)
  const title = step ? stepTitle(step.step).primary : ''
  const quiz = useQuiz(plan.config)
  const [learnedBefore] = useState(() => plan.marks !== null && store.getState().learned[plan.marks] !== undefined)
  const [done, setDone] = useState(false)
  const close = () => (canGoBack ? router.history.back() : void router.navigate({ to: '/' }))
  const answered = quiz.state.asked - (quiz.state.result ? 0 : 1)

  return (
    <div className="flex flex-1 flex-col gap-5 pt-2">
      <header className="flex items-center gap-3">
        <RoundButton label={t('common:close')} icon={X} onClick={close} />
        <Progress
          value={answered}
          max={plan.length}
          aria-label={t('progress', { n: Math.min(answered + 1, plan.length), total: plan.length })}
          className="flex-1"
        />
      </header>
      <h1 className="text-xl font-bold">{t('checkTitle', { title })}</h1>
      {done ? (
        <CheckResult
          plan={plan}
          correct={quiz.state.correct}
          title={title}
          newlyLearned={!learnedBefore}
          onDone={close}
        />
      ) : (
        <QuizBoard quiz={quiz} onDone={() => setDone(true)} />
      )}
    </div>
  )
}

export function CheckPage() {
  const { of } = useSearch({ from: '/full-screen/check' })
  const plan = useMemo(() => (of ? checkPlan(of) : null), [of])
  return plan ? <CheckFlow key={plan.of} plan={plan} /> : null
}
```

`CheckResult.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { rate, selectAllAnswers, selectIsLearned, useProgress, type ProgressState } from '@/entities/progress'
import type { CheckPlan } from '@/features/quiz'
import { skillOf, type SkillId } from '@/shared/lib/music'
import { RatingMark } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

const NONE = [] as const

export function CheckResult({
  plan,
  correct,
  title,
  newlyLearned,
  onDone,
}: {
  plan: CheckPlan
  correct: number
  title: string
  newlyLearned: boolean
  onDone: () => void
}) {
  const { t } = useTranslation(['quiz', 'theory'])
  const answers = useProgress(selectAllAnswers)
  const learned = useProgress(selectIsLearned(plan.marks ?? plan.of))
  const ratingOf = (skill: SkillId, all: ProgressState['answers']) => rate(all[skill] ?? NONE)

  return (
    <section className="flex flex-1 flex-col gap-6">
      <p className="text-6xl font-extrabold tracking-tight tabular-nums">
        {t('score', { correct, total: plan.length })}
      </p>
      {plan.marks && learned && newlyLearned ? (
        <p className="text-lg font-semibold text-primary">{t('marked', { title })}</p>
      ) : null}
      <ul className="flex flex-col divide-y divide-border rounded-3xl bg-card ring-1 ring-border">
        {plan.skills.map((skillId) => {
          const skill = skillOf(skillId)
          const rating = ratingOf(skillId, answers)
          const name =
            skill.kind === 'chord' ? t(`theory:quality.${skill.quality}`) : t(`theory:scaleKind.${skill.scale}`)
          return (
            <li key={skillId} className="flex min-h-14 items-center gap-3 px-4">
              <RatingMark rating={rating} />
              <span className="flex-1">{name}</span>
              {rating === 'known' ? null : skill.kind === 'chord' ? (
                <Link to="/theory/chords" search={{ quality: skill.quality }} className="font-semibold text-primary">
                  {t('openChords')}
                </Link>
              ) : (
                <Link to="/theory/scales" search={{ kind: skill.scale }} className="font-semibold text-primary">
                  {t('openScales')}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
      <Button size="pill" className="mt-auto" onClick={onDone}>
        {t('done')}
      </Button>
    </section>
  )
}
```

`src/pages/check/index.ts`: `export { CheckPage } from './ui/CheckPage'`.

The result's links are named per row, so several "Open in Chords" links exist; the test's `getByRole('link', { name:
'Open in Scales' })` works for the one-skill blues check. Run the tests. Expected: PASS.

- [ ] **Step 3: Verify and commit**

Run: `npm run typecheck && npm run lint && npm run test && npm run build`

```bash
npx prettier --write src/pages/check src/app
git add src/pages/check src/app
git commit -m "Run a piece's or a step's check full screen, with a score and each skill's rating

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 19: The Chords explorer and the step panel

**Files:**
- Create: `src/widgets/chord-explorer/{index.ts,ui/ChordExplorer.tsx}`, `src/widgets/step-panel/{index.ts,ui/StepPanel.tsx}`,
  `src/app/screens/theory-chords.test.tsx`
- Modify: `src/pages/theory-chords/ui/TheoryChordsPage.tsx`, `src/shared/i18n/locales/{en,ru}/theory.ts`

**Interfaces:**
- Consumes: `chordVoicing`, `chordRootSpelling`, `chordSymbol`, `qualitiesIn`, `chordFamily`, `CHORD_FAMILIES`,
  `qualitySuffix`, `noteParam`, `parseNoteName`, `pitchClassOf`, `pitchClass`; `chordSounds`; `usePlay`;
  `PianoKeyboard`, `ChipRow`, `Segmented`, `RoleLegend`, `rangeFor`, `ROLE_BG`; `LearnedToggle`; `useStepTitle`.
- Produces:
  - `ChordView = { root: string; quality: ChordQuality; inversion: number; hands: 'rh' | 'both' }`;
    `ChordExplorer({ view, onChange }: { view: ChordView; onChange: (patch: Partial<ChordView>) => void })` — every
    change also sounds the new chord.
  - `StepPanel({ step }: { step: StepId })`

- [ ] **Step 1: Strings** — `theory`: `root: 'Root'`, `familyLabel: 'Chord family'`, `qualityLabel: 'Chord'`,
  `inversionLabel: 'Inversion'`, `inversion: { 0: 'Root', 1: '1st', 2: '2nd', 3: '3rd' }`, `handsLabel: 'Hands'`,
  `play: 'Play'`, `arpeggio: 'Arpeggio'`, `checkYourself: 'Check yourself'`, `major: 'M'` (the chip label of the
  major triad, whose suffix is empty); ru: `root: 'Основной тон'`, `familyLabel: 'Группа'`, `qualityLabel: 'Аккорд'`,
  `inversionLabel: 'Обращение'`, `inversion: { 0: 'Основной', 1: '1-е', 2: '2-е', 3: '3-е' }`, `handsLabel: 'Руки'`,
  `play: 'Сыграть'`, `arpeggio: 'Арпеджио'`, `checkYourself: 'Проверить себя'`, `major: 'M'`.

- [ ] **Step 2: Write the failing integration tests**

`src/app/screens/theory-chords.test.tsx`:

```tsx
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { FakeAudio } from '@/shared/api/audio'
import { renderApp } from '../testing/render-app'

describe('Theory → Chords', () => {
  it('shows C major by default, its keys labelled by degree', async () => {
    renderApp('/theory/chords')
    expect(await screen.findByRole('heading', { level: 2, name: 'C' })).toBeInTheDocument()
    expect(screen.getByText('Major triad')).toBeInTheDocument()
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'E4' })).toHaveTextContent('3')
  })

  it('opens a deep link and moves through the URL, sounding each choice', async () => {
    const user = userEvent.setup()
    const { router, services } = renderApp('/theory/chords?root=G&quality=d7')
    expect(await screen.findByRole('heading', { level: 2, name: 'G7' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Minor 7th' }))
    expect(router.state.location.search).toMatchObject({ root: 'G', quality: 'm7' })
    expect((services.audio as FakeAudio).played.length).toBeGreaterThan(0)
  })

  it('opened from a path step, offers its check and its learned toggle', async () => {
    const user = userEvent.setup()
    const { progressStore } = renderApp('/theory/chords?quality=maj7&step=chords:sev')
    expect(await screen.findByRole('link', { name: 'Check yourself' })).toHaveAttribute(
      'href',
      '/check?of=chords%3Asev',
    )
    await user.click(screen.getByRole('button', { name: 'Learned' }))
    expect(progressStore.getState().learned['chords:sev']).toBeDefined()
  })
})
```

(The router writes `of=chords%3Asev` or `of=chords:sev`; assert with `toMatch(/of=chords(%3A|:)sev/)` if needed.)

Run: `npx vitest run src/app/screens/theory-chords.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement the widgets and the page**

`src/widgets/step-panel/ui/StepPanel.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { pathSteps, useStepTitle, type StepId } from '@/entities/path'
import { LearnedToggle } from '@/features/mark-learned'
import { Button } from '@/shared/ui/primitives/button'

/** The path step an explorer was opened from: its check and its learned toggle. */
export function StepPanel({ step }: { step: StepId }) {
  const { t } = useTranslation('theory')
  const stepTitle = useStepTitle()
  const placed = pathSteps().find((s) => s.id === step)
  if (!placed) return null
  const title = stepTitle(placed.step).primary
  return (
    <section className="flex flex-wrap items-center gap-3 rounded-3xl bg-secondary p-4 text-secondary-foreground">
      <h2 className="min-w-0 flex-1 text-lg font-bold">{title}</h2>
      <Button render={<Link to="/check" search={{ of: step }} />} nativeButton={false}>
        {t('checkYourself')}
      </Button>
      <LearnedToggle step={step} title={title} variant="text" />
    </section>
  )
}
```

`src/widgets/chord-explorer/ui/ChordExplorer.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import {
  CHORD_FAMILIES,
  chordFamily,
  chordRootSpelling,
  chordSymbol,
  chordVoicing,
  midi,
  noteName,
  noteParam,
  parseNoteName,
  pitchClass,
  pitchClassOf,
  qualitiesIn,
  qualitySuffix,
  spellChord,
  type ChordQuality,
  type Midi,
} from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlay } from '@/shared/lib/services'
import { cn } from '@/shared/lib'
import {
  ChipRow,
  PianoKeyboard,
  rangeFor,
  ROLE_BG,
  RoleLegend,
  Segmented,
  type KeyMark,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

export interface ChordView {
  readonly root: string
  readonly quality: ChordQuality
  readonly inversion: number
  readonly hands: 'rh' | 'both'
}

const PITCH_CLASSES = Array.from({ length: 12 }, (_, pc) => pitchClass(pc))
const AT_LEAST = { from: midi(60), to: midi(83) }

function voicingOf(view: ChordView) {
  const pc = pitchClassOf(parseNoteName(view.root) ?? { letter: 'C', accidental: 0 })
  const root = chordRootSpelling(pc, view.quality)
  const voicing = chordVoicing(root, view.quality, {
    inversion: view.inversion,
    bothHands: view.hands === 'both',
  })
  return { pc, root, voicing, keys: [...voicing.lh, ...voicing.rh].map((p) => p.midi) }
}

/** Any chord on any root: its keys by role and degree, inversions, one hand or two, played. */
export function ChordExplorer({
  view,
  onChange,
}: {
  view: ChordView
  onChange: (patch: Partial<ChordView>) => void
}) {
  const { t } = useTranslation(['theory', 'common'])
  const play = usePlay()
  const { root, voicing, keys } = voicingOf(view)
  const tones = spellChord(root, view.quality)
  const family = chordFamily(view.quality)
  const lowest = Math.min(...keys)
  const highest = Math.max(...keys)
  const range = rangeFor([midi(Math.min(lowest, AT_LEAST.from)), midi(Math.max(highest, AT_LEAST.to))], AT_LEAST)
  const marks = new Map<Midi, KeyMark>(
    [...voicing.lh, ...voicing.rh].map((p) => [p.midi, { tone: p.tone.role, label: p.tone.degree }]),
  )
  const sound = (next: ChordView, arpeggio = false) =>
    play(chordSounds(voicingOf(next).keys, { arpeggio }))
  const change = (patch: Partial<ChordView>) => {
    onChange(patch)
    sound({ ...view, ...patch })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-6xl font-extrabold tracking-tight">
          {chordSymbol({ root, quality: view.quality })}
        </h2>
        <p className="text-right text-muted-foreground">{t(`theory:quality.${view.quality}`)}</p>
      </div>
      <ChipRow
        label={t('theory:root')}
        value={noteParam(root)}
        options={PITCH_CLASSES.map((pc) => {
          const spelled = chordRootSpelling(pc, view.quality)
          return { value: noteParam(spelled), label: noteName(spelled) }
        })}
        onChange={(value) => change({ root: value })}
      />
      <ChipRow
        label={t('theory:familyLabel')}
        value={family}
        options={CHORD_FAMILIES.map((f) => ({ value: f, label: t(`theory:family.${f}`) }))}
        onChange={(f) => change({ quality: qualitiesIn(f)[0] ?? view.quality, inversion: 0 })}
      />
      <ChipRow
        label={t('theory:qualityLabel')}
        value={view.quality}
        options={qualitiesIn(family).map((q) => ({
          value: q,
          label: qualitySuffix(q) || t('theory:major'),
          title: t(`theory:quality.${q}`),
        }))}
        onChange={(quality) => change({ quality, inversion: 0 })}
      />
      <PianoKeyboard
        label={t('common:keyboard')}
        from={range.from}
        to={range.to}
        marks={marks}
        className="h-44"
      />
      <RoleLegend roles={[...new Set(tones.map((tone) => tone.role))]} />
      <ol className="flex flex-wrap gap-2">
        {tones.map((tone) => (
          <li
            key={tone.degree}
            className="flex items-center gap-2 rounded-full bg-card py-1 pr-3 pl-1 ring-1 ring-border"
          >
            <span className={cn('grid size-7 place-items-center rounded-full text-sm font-bold text-on-role', ROLE_BG[tone.role])}>
              {tone.degree}
            </span>
            <span className="font-semibold">{noteName(tone.note)}</span>
          </li>
        ))}
      </ol>
      <Segmented
        label={t('theory:inversionLabel')}
        value={String(Math.min(view.inversion, tones.length - 1, 3))}
        options={[0, 1, 2, 3].slice(0, Math.min(tones.length, 4)).map((n) => ({
          value: String(n),
          label: t(`theory:inversion.${n as 0 | 1 | 2 | 3}`),
        }))}
        onChange={(value) => change({ inversion: Number(value) })}
      />
      <Segmented
        label={t('theory:handsLabel')}
        value={view.hands}
        options={[
          { value: 'rh', label: t('common:hands.rh') },
          { value: 'both', label: t('common:hands.both') },
        ]}
        onChange={(hands) => change({ hands })}
      />
      <div className="flex gap-3">
        <Button size="pill" className="flex-1" onClick={() => sound(view)}>
          {t('theory:play')}
        </Button>
        <Button size="pill" variant="soft" className="flex-1" onClick={() => sound(view, true)}>
          {t('theory:arpeggio')}
        </Button>
      </div>
    </div>
  )
}
```

(Write `lowest`/`highest` through `rangeFor(keys, AT_LEAST)` merged with `AT_LEAST` if that reads more simply: the
range must hold every key and at least C4–B5, so the keyboard does not jump as roots change. Replace
`{ letter: 'C', accidental: 0 }` with `note('C')`.)

`TheoryChordsPage.tsx`:

```tsx
import { useNavigate, useSearch } from '@tanstack/react-router'
import { ChordExplorer, type ChordView } from '@/widgets/chord-explorer'
import { StepPanel } from '@/widgets/step-panel'

export function TheoryChordsPage() {
  const search = useSearch({ from: '/shell/theory/chords' })
  const navigate = useNavigate({ from: '/theory/chords' })
  const onChange = (patch: Partial<ChordView>) =>
    void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })
  return (
    <div className="flex flex-col gap-6">
      {search.step ? <StepPanel step={search.step} /> : null}
      <ChordExplorer view={search} onChange={onChange} />
    </div>
  )
}
```

Run the tests. Expected: PASS. (The old placeholder heading "Chords" at level 2 in the router test for the tab — the
test `opens a deep link to a Theory section with its tab selected` looks for a level-2 heading "Scales"; update that
test to assert the tab only, since the explorers' level-2 headings are chord and scale names now.)

- [ ] **Step 4: Verify and commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
npx prettier --write src/widgets/chord-explorer src/widgets/step-panel src/pages/theory-chords src/app src/shared/i18n/locales
git add src/widgets src/pages/theory-chords src/app src/shared
git commit -m "Explore any chord on any root, and check or mark the step it came from

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 20: The Scales explorer

**Files:**
- Create: `src/widgets/scale-explorer/{index.ts,ui/ScaleExplorer.tsx,ui/FingeringTable.tsx,ui/ScaleChords.tsx,model/use-lit-key.ts}`,
  `src/app/screens/theory-scales.test.tsx`
- Modify: `src/pages/theory-scales/ui/TheoryScalesPage.tsx`, `src/shared/i18n/locales/{en,ru}/theory.ts`

**Interfaces:**
- Consumes: `spellScale`, `scaleRootSpelling`, `scaleFingering`, `scaleSteps`, `relativeScale`, `diatonicChords`,
  `chordSymbol`, `chordVoicing`, `noteName`, `noteParam`, `parseNoteName`, `pitchClassOf`, `SCALE_KINDS`;
  `scaleRun`, `PRACTICE_RHYTHM_IDS`, `chordSounds`; `usePlay`, `useServices`; kit.
- Produces: `ScaleView = { root: string; kind: ScaleKind; view: 'degrees' | 'rh' | 'lh'; rhythm: PracticeRhythm;
  tempo: number; hands: Hands; chords: 3 | 4 }`; `ScaleExplorer({ view, onChange })`;
  `useLitKey(): { lit: Midi | null; light(steps, startsIn: number): void }`.

- [ ] **Step 1: Strings** — `theory`:

```ts
  // en
  scaleLabel: 'Scale',
  view: { label: 'Show', degrees: 'Degrees', rh: 'RH fingers', lh: 'LH fingers' },
  fingering: { note: 'Note', rh: 'RH', lh: 'LH', none: 'No standard fingering is taught for this scale.' },
  practice: 'Practice',
  rhythmLabel: 'Rhythm',
  rhythm: {
    even: 'Even',
    'long-short': 'Long, short',
    'short-long': 'Short, long',
    'long-short-short-short': 'Long, 3 short',
    'short-short-short-long': '3 short, long',
  },
  tempo: 'Tempo',
  bpm: '{{tempo}} BPM',
  together: 'Together',
  playUpDown: 'Play up and down',
  chordsIn: 'Chords in this scale',
  chordSize: { 3: 'Triads', 4: '7ths' },
  about: { formula: 'Formula', steps: 'Steps', relative: 'Relative' },
  // ru
  scaleLabel: 'Гамма',
  view: { label: 'Показать', degrees: 'Ступени', rh: 'Аппликатура ПР', lh: 'Аппликатура ЛР' },
  fingering: { note: 'Нота', rh: 'ПР', lh: 'ЛР', none: 'Для этой гаммы нет принятой аппликатуры.' },
  practice: 'Упражнение',
  rhythmLabel: 'Ритм',
  rhythm: {
    even: 'Ровно',
    'long-short': 'Долго, коротко',
    'short-long': 'Коротко, долго',
    'long-short-short-short': 'Долго, 3 коротко',
    'short-short-short-long': '3 коротко, долго',
  },
  tempo: 'Темп',
  bpm: '{{tempo}} уд/мин',
  together: 'Вместе',
  playUpDown: 'Вверх и вниз',
  chordsIn: 'Аккорды гаммы',
  chordSize: { 3: 'Трезвучия', 4: 'Септаккорды' },
  about: { formula: 'Формула', steps: 'Шаги', relative: 'Параллельная' },
```

- [ ] **Step 2: Write the failing integration tests**

`src/app/screens/theory-scales.test.tsx`:

```tsx
import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { FakeAudio } from '@/shared/api/audio'
import { renderApp } from '../testing/render-app'

describe('Theory → Scales', () => {
  it('spells E♭ harmonic minor with its C♭ and names its steps', async () => {
    renderApp('/theory/scales?root=Eb&kind=harmonic')
    expect(await screen.findByRole('heading', { level: 2, name: 'E♭ harmonic minor' })).toBeInTheDocument()
    expect(screen.getByRole('table')).toHaveTextContent('C♭')
    expect(screen.getByText('W H W W H W+H H')).toBeInTheDocument()
  })

  it('labels the keys with right-hand fingers when asked', async () => {
    const user = userEvent.setup()
    renderApp('/theory/scales')
    await user.click(await screen.findByRole('button', { name: 'RH fingers' }))
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'F4' })).toHaveTextContent('1')
  })

  it('links to the relative minor', async () => {
    renderApp('/theory/scales?root=G&kind=major')
    expect(await screen.findByRole('link', { name: 'E natural minor' })).toBeInTheDocument()
  })

  describe('practice', () => {
    beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }))
    afterEach(() => vi.useRealTimers())

    it('plays up and down and lights each key as it sounds', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      const { services } = renderApp('/theory/scales')
      await user.click(await screen.findByRole('button', { name: 'Play up and down' }))
      expect((services.audio as FakeAudio).played).toHaveLength(1)
      act(() => vi.advanceTimersByTime(150))
      const keyboard = screen.getByRole('group', { name: 'Keyboard' })
      expect(within(keyboard).getByRole('button', { name: 'C4' })).toHaveClass('ring-primary')
    })
  })
})
```

Run: `npx vitest run src/app/screens/theory-scales.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement**

`model/use-lit-key.ts`:

```ts
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Midi } from '@/shared/lib/music'

/** The key sounding now in a scale run, lit in time with the audio; cleared when the run ends. */
export function useLitKey(): {
  lit: Midi | null
  light: (steps: readonly { key: Midi; at: number }[], startsIn: number, end: number) => void
} {
  const [lit, setLit] = useState<Midi | null>(null)
  const timers = useRef<number[]>([])
  const clear = () => {
    for (const timer of timers.current) window.clearTimeout(timer)
    timers.current = []
  }
  useEffect(() => clear, [])
  const light = useCallback(
    (steps: readonly { key: Midi; at: number }[], startsIn: number, end: number) => {
      clear()
      for (const step of steps)
        timers.current.push(window.setTimeout(() => setLit(step.key), (startsIn + step.at) * 1000))
      timers.current.push(window.setTimeout(() => setLit(null), (startsIn + end) * 1000))
    },
    [],
  )
  return { lit, light }
}
```

`ui/FingeringTable.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import type { Finger, Tone } from '@/shared/lib/music'

/** Note, RH and LH fingers for one octave; one line where no fingering is taught. */
export function FingeringTable({
  notes,
  rh,
  lh,
}: {
  notes: readonly string[]
  rh: readonly Finger[] | null
  lh: readonly Finger[] | null
}) {
  const { t } = useTranslation('theory')
  if (!rh || !lh) return <p className="text-muted-foreground">{t('fingering.none')}</p>
  const row = (label: string, cells: readonly (string | number)[]) => (
    <tr>
      <th scope="row" className="pr-3 text-left text-sm font-semibold text-muted-foreground">
        {label}
      </th>
      {cells.map((cell, i) => (
        <td key={i} className="py-1 text-center font-semibold tabular-nums">
          {cell}
        </td>
      ))}
    </tr>
  )
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <tbody>
          {row(t('fingering.note'), notes)}
          {row(t('fingering.rh'), rh)}
          {row(t('fingering.lh'), lh)}
        </tbody>
      </table>
    </div>
  )
}
```

(Drop the unused `Tone` import.)

`ui/ScaleChords.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { chordSymbol, chordVoicing, diatonicChords, type Tone } from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlay } from '@/shared/lib/services'
import { Segmented } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** The triads or 7th chords on each degree, with Roman numerals; a tap sounds one. */
export function ScaleChords({
  scale,
  size,
  onSize,
}: {
  scale: readonly Tone[]
  size: 3 | 4
  onSize: (size: 3 | 4) => void
}) {
  const { t } = useTranslation('theory')
  const play = usePlay()
  const chords = diatonicChords(scale, size)
  if (chords.length === 0) return null
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xl font-bold">{t('chordsIn')}</h3>
      <Segmented
        label={t('chordsIn')}
        value={String(size)}
        options={[
          { value: '3', label: t('chordSize.3') },
          { value: '4', label: t('chordSize.4') },
        ]}
        onChange={(value) => onSize(value === '4' ? 4 : 3)}
      />
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {chords.map(({ roman, chord }) => (
          <Button
            key={roman}
            variant="outline"
            className="h-16 flex-col gap-0"
            onClick={() =>
              play(
                chordSounds(
                  chordVoicing(chord.root, chord.quality, { inversion: 0, bothHands: false }).rh.map(
                    (p) => p.midi,
                  ),
                  { arpeggio: false },
                ),
              )
            }
          >
            <span className="text-lg font-bold">{chordSymbol(chord)}</span>
            <span className="text-sm text-muted-foreground">{roman}</span>
          </Button>
        ))}
      </div>
    </section>
  )
}
```

`ui/ScaleExplorer.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  midi,
  note,
  noteName,
  noteParam,
  parseNoteName,
  pitchClass,
  pitchClassOf,
  relativeScale,
  SCALE_KINDS,
  scaleFingering,
  scaleRootSpelling,
  scaleSteps,
  spellScale,
  type Midi,
  type ScaleKind,
} from '@/shared/lib/music'
import { PRACTICE_RHYTHM_IDS, scaleRun, type Hands, type PracticeRhythm } from '@/shared/lib/schedule'
import { usePlay, useServices } from '@/shared/lib/services'
import { ChipRow, PianoKeyboard, rangeFor, Segmented, type KeyMark } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Slider } from '@/shared/ui/primitives/slider'
import { useLitKey } from '../model/use-lit-key'
import { FingeringTable } from './FingeringTable'
import { ScaleChords } from './ScaleChords'

export interface ScaleView {
  readonly root: string
  readonly kind: ScaleKind
  readonly view: 'degrees' | 'rh' | 'lh'
  readonly rhythm: PracticeRhythm
  readonly tempo: number
  readonly hands: Hands
  readonly chords: 3 | 4
}

const PITCH_CLASSES = Array.from({ length: 12 }, (_, pc) => pitchClass(pc))
const AT_LEAST = { from: midi(60), to: midi(83) }

/** Any scale on any root: degrees or fingers on the keys, the fingering, practice, its chords, its relative. */
export function ScaleExplorer({
  view,
  onChange,
}: {
  view: ScaleView
  onChange: (patch: Partial<ScaleView>) => void
}) {
  const { t } = useTranslation(['theory', 'common'])
  const play = usePlay()
  const { audio } = useServices()
  const { lit, light } = useLitKey()
  const pc = pitchClassOf(parseNoteName(view.root) ?? note('C'))
  const root = scaleRootSpelling(pc, view.kind)
  const tones = spellScale(root, view.kind)
  const base = 60 + pc
  const keys: Midi[] = [...tones.map((tone) => midi(base + tone.semitones)), midi(base + 12)]
  const rh = scaleFingering(pc, view.kind, 'rh')
  const lh = scaleFingering(pc, view.kind, 'lh')
  const fingers = view.view === 'rh' ? rh : view.view === 'lh' ? lh : null
  const marks = new Map<Midi, KeyMark>(
    keys.map((key, i) => {
      const tone = tones[i % tones.length]
      const label = view.view === 'degrees' ? tone?.degree : fingers ? String(fingers[i] ?? '·') : '–'
      return [key, { tone: tone?.role ?? 'root', label }]
    }),
  )
  const range = rangeFor(keys, AT_LEAST)
  const name = `${noteName(root)} ${t(`theory:scaleName.${view.kind}`)}`
  const relative = relativeScale(root, view.kind)

  const playRun = () => {
    const run = scaleRun(keys, { rhythm: view.rhythm, tempo: view.tempo, hands: view.hands })
    const at = play(run.sounds)
    light(run.steps, Math.max(0, at - audio.now()), run.end)
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-4xl font-extrabold tracking-tight">{name}</h2>
      <ChipRow
        label={t('theory:root')}
        value={noteParam(root)}
        options={PITCH_CLASSES.map((p) => {
          const spelled = scaleRootSpelling(p, view.kind)
          return { value: noteParam(spelled), label: noteName(spelled) }
        })}
        onChange={(value) => onChange({ root: value })}
      />
      <ChipRow
        label={t('theory:scaleLabel')}
        value={view.kind}
        options={SCALE_KINDS.map((kind) => ({ value: kind, label: t(`theory:scaleKind.${kind}`) }))}
        onChange={(kind) => onChange({ kind })}
      />
      <PianoKeyboard
        label={t('common:keyboard')}
        from={range.from < AT_LEAST.from ? range.from : AT_LEAST.from}
        to={range.to > AT_LEAST.to ? range.to : AT_LEAST.to}
        marks={marks}
        outlined={lit === null ? undefined : new Set([lit])}
        className="h-44"
      />
      <Segmented
        label={t('theory:view.label')}
        value={view.view}
        options={(['degrees', 'rh', 'lh'] as const).map((v) => ({ value: v, label: t(`theory:view.${v}`) }))}
        onChange={(v) => onChange({ view: v })}
      />
      <FingeringTable notes={keys.map((_, i) => noteName((tones[i % tones.length] ?? tones[0])!.note))} rh={rh} lh={lh} />

      <section className="flex flex-col gap-4 rounded-3xl bg-card p-5 ring-1 ring-border">
        <h3 className="text-xl font-bold">{t('theory:practice')}</h3>
        <ChipRow
          label={t('theory:rhythmLabel')}
          value={view.rhythm}
          options={PRACTICE_RHYTHM_IDS.map((r) => ({ value: r, label: t(`theory:rhythm.${r}`) }))}
          onChange={(rhythm) => onChange({ rhythm })}
        />
        <label className="flex flex-col gap-3">
          <span className="flex justify-between">
            {t('theory:tempo')}
            <span className="font-semibold tabular-nums">{t('theory:bpm', { tempo: view.tempo })}</span>
          </span>
          <Slider
            min={40}
            max={160}
            step={4}
            value={[view.tempo]}
            onValueChange={(value) => onChange({ tempo: Array.isArray(value) ? (value[0] ?? view.tempo) : value })}
            aria-label={t('theory:tempo')}
          />
        </label>
        <Segmented
          label={t('theory:handsLabel')}
          value={view.hands}
          options={[
            { value: 'rh', label: t('common:hands.rh') },
            { value: 'lh', label: t('common:hands.lh') },
            { value: 'both', label: t('theory:together') },
          ]}
          onChange={(hands) => onChange({ hands })}
        />
        <Button size="pill" onClick={playRun}>
          {t('theory:playUpDown')}
        </Button>
      </section>

      <ScaleChords scale={tones} size={view.chords} onSize={(chords) => onChange({ chords })} />

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
        <dt className="text-muted-foreground">{t('theory:about.formula')}</dt>
        <dd className="font-semibold">{tones.map((tone) => tone.degree).join(' ')}</dd>
        <dt className="text-muted-foreground">{t('theory:about.steps')}</dt>
        <dd className="font-semibold">{scaleSteps(view.kind).join(' ')}</dd>
        {relative ? (
          <>
            <dt className="text-muted-foreground">{t('theory:about.relative')}</dt>
            <dd>
              <Link
                to="/theory/scales"
                search={(prev) => ({ ...prev, root: noteParam(relative.root), kind: relative.kind })}
                replace
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                {`${noteName(relative.root)} ${t(`theory:scaleName.${relative.kind}`)}`}
              </Link>
            </dd>
          </>
        ) : null}
      </dl>
    </div>
  )
}
```

(Tidy two things while writing it: compute the fingering-table note names as `keys.map((_, i) => noteName((tones[i]
?? tones[0]).note))` with a guard instead of the non-null assertion, and pass `range.from/to` directly after merging
with `AT_LEAST` in one `rangeFor([...keys, AT_LEAST.from, AT_LEAST.to], AT_LEAST)` call.)

`TheoryScalesPage.tsx` mirrors the Chords page: `useSearch({ from: '/shell/theory/scales' })`, a `StepPanel` for
`step`, and `ScaleExplorer` with `onChange` navigating with `replace: true`.

Run the tests. Expected: PASS.

- [ ] **Step 4: Verify and commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
npx prettier --write src/widgets/scale-explorer src/pages/theory-scales src/app src/shared/i18n/locales
git add src/widgets src/pages/theory-scales src/app src/shared
git commit -m "Explore every scale with its fingering, practice rhythms, chords and relative

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 21: Symbols — the chord dictionary and how to read symbols

**Files:**
- Modify: `src/pages/theory-symbols/ui/TheorySymbolsPage.tsx`, `src/shared/i18n/locales/{en,ru}/theory.ts`
- Create: `src/pages/theory-symbols/ui/{QualityRow,ReadingSheet}.tsx`, `src/app/screens/theory-symbols.test.tsx`

**Interfaces:**
- Consumes: `CHORD_FAMILIES`, `qualitiesIn`, `qualitySpellings`, `spellChord`, `chordVoicing`, `noteName`,
  `note`; `chordSounds`; `usePlay`; `Sheet*`.

- [ ] **Step 1: Strings** — `theory.symbols`:

```ts
// en
symbols: {
  howToRead: 'How to read chord symbols',
  hear: 'Hear',
  open: 'Open',
  reading: {
    title: 'Reading chord symbols',
    items: {
      a: { lead: 'Left part = triad, right part = extras.', rest: 'C is major, Cm or C− is minor, C° or Cdim is diminished, C+ or Caug is augmented.' },
      b: { lead: 'Numbers are steps of the major scale built on the chord’s own root,', rest: 'whatever key the song is in.' },
      c: { lead: '7 means a minor 7th. Maj7, M7 or Δ means a major 7th.', rest: 'Cm(maj7) is a minor chord with a major 7th.' },
      d: { lead: '6 is always a major 6th,', rest: 'also in Cm6.' },
      e: { lead: 'sus means no 3rd.', rest: 'sus2 uses the 2nd instead, sus4 the 4th.' },
      f: { lead: 'Slash chords:', rest: 'C/D means a C chord over a D bass note.' },
      g: { lead: 'Alterations combine freely,', rest: 'for example C7(♭9#5).' },
    },
  },
  numbers: {
    title: 'Chord numbers: 2 or 9? 6 or 13?',
    items: {
      a: { lead: 'The same note has two numbers:', rest: '2 = 9, 4 = 11, 6 = 13. 8, 10, 12 and 14 never appear: they are 1, 3, 5 and 7 again.' },
      b: { lead: 'add, 2, 4 or 6 adds only that note:', rest: 'C2 = Cadd2 = Cadd9 = C D E G. C6 = C E G A.' },
      c: { lead: 'A number above 7 includes everything below it:', rest: 'C9 = C E G B♭ D.' },
      d: { lead: '13 chords usually leave out the 11,', rest: 'which clashes with the major 3rd. C13 = C E G B♭ D A.' },
    },
  },
  naming: {
    title: 'Naming any chord in 7 steps',
    steps: {
      1: 'Put the notes in letter order, then stack them in thirds (every other letter).',
      2: 'Find the three notes that form the core triad.',
      3: 'Decide its quality: major, minor, diminished, augmented or sus4.',
      4: 'Is there a 4th note that works as the 6th or 7th?',
      5: 'Is there a 5th note that works as the 9th (or ♭9, #9)?',
      6: 'Is there a 6th note that works as the 11th (or #11)?',
      7: 'Is there a 7th note that works as the 13th (or ♭13)?',
    },
    careful: 'The same notes can have two names: D F A C is Dm7, and also F6 over D.',
  },
},
// ru
symbols: {
  howToRead: 'Как читать буквенные обозначения',
  hear: 'Послушать',
  open: 'Открыть',
  reading: {
    title: 'Чтение обозначений аккордов',
    items: {
      a: { lead: 'Левая часть — трезвучие, правая — добавки.', rest: 'C — мажор, Cm или C− — минор, C° или Cdim — уменьшённое, C+ или Caug — увеличенное.' },
      b: { lead: 'Числа — ступени мажорной гаммы от основного тона аккорда,', rest: 'в какой бы тональности ни была песня.' },
      c: { lead: '7 — малая септима. Maj7, M7 или Δ — большая септима.', rest: 'Cm(maj7) — минорный аккорд с большой септимой.' },
      d: { lead: '6 — всегда большая секста,', rest: 'и в Cm6 тоже.' },
      e: { lead: 'sus — без терции.', rest: 'В sus2 вместо неё секунда, в sus4 — кварта.' },
      f: { lead: 'Аккорды через дробь:', rest: 'C/D — аккорд C с басом D.' },
      g: { lead: 'Альтерации сочетаются свободно,', rest: 'например C7(♭9#5).' },
    },
  },
  numbers: {
    title: 'Числа в аккордах: 2 или 9? 6 или 13?',
    items: {
      a: { lead: 'У одной ноты два числа:', rest: '2 = 9, 4 = 11, 6 = 13. 8, 10, 12 и 14 не встречаются: это снова 1, 3, 5 и 7.' },
      b: { lead: 'add, 2, 4 или 6 добавляют только эту ноту:', rest: 'C2 = Cadd2 = Cadd9 = C D E G. C6 = C E G A.' },
      c: { lead: 'Число больше 7 включает всё, что ниже:', rest: 'C9 = C E G B♭ D.' },
      d: { lead: 'В аккордах с 13 обычно нет 11,', rest: 'она спорит с большой терцией. C13 = C E G B♭ D A.' },
    },
  },
  naming: {
    title: 'Как назвать любой аккорд за 7 шагов',
    steps: {
      1: 'Расставьте ноты по порядку букв и сложите их терциями (через букву).',
      2: 'Найдите три ноты основного трезвучия.',
      3: 'Определите его вид: мажор, минор, уменьшённое, увеличенное или sus4.',
      4: 'Есть ли 4-я нота — секста или септима?',
      5: 'Есть ли 5-я нота — нона (или ♭9, #9)?',
      6: 'Есть ли 6-я нота — ундецима (или #11)?',
      7: 'Есть ли 7-я нота — терцдецима (или ♭13)?',
    },
    careful: 'Одни и те же ноты могут называться по-разному: D F A C — это Dm7, а также F6 с басом D.',
  },
},
```

- [ ] **Step 2: Write the failing integration test**

```tsx
// src/app/screens/theory-symbols.test.tsx
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '../testing/render-app'

describe('Theory → Symbols', () => {
  it('lists every quality by family with its spellings, formula and notes on C', async () => {
    renderApp('/theory/symbols')
    const sevenths = await screen.findByRole('region', { name: '7th chords' })
    const minor7 = within(sevenths).getByRole('listitem', { name: 'Minor 7th' })
    expect(minor7).toHaveTextContent('Cm7')
    expect(minor7).toHaveTextContent('1 ♭3 5 ♭7')
    expect(minor7).toHaveTextContent('C E♭ G B♭')
    expect(within(minor7).getByRole('link', { name: 'Open' })).toHaveAttribute('href', '/theory/chords?quality=m7')
  })

  it('opens the reading notes behind one control', async () => {
    const user = userEvent.setup()
    renderApp('/theory/symbols')
    await user.click(await screen.findByRole('button', { name: 'How to read chord symbols' }))
    expect(await screen.findByRole('heading', { name: 'Naming any chord in 7 steps' })).toBeInTheDocument()
  })
})
```

Run it. Expected: FAIL.

- [ ] **Step 3: Implement**

`QualityRow.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  chordVoicing,
  note,
  noteName,
  qualitySpellings,
  spellChord,
  type ChordQuality,
} from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlay } from '@/shared/lib/services'
import { Button } from '@/shared/ui/primitives/button'

const C = note('C')

/** One quality in the dictionary: how it is written, what it is, and on C. */
export function QualityRow({ quality }: { quality: ChordQuality }) {
  const { t } = useTranslation('theory')
  const play = usePlay()
  const name = t(`quality.${quality}`)
  const tones = spellChord(C, quality)
  const hear = () =>
    play(
      chordSounds(
        chordVoicing(C, quality, { inversion: 0, bothHands: true }).rh.map((p) => p.midi),
        { arpeggio: false },
      ),
    )
  return (
    <li aria-label={name} className="flex flex-col gap-1 px-4 py-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xl font-bold">{qualitySpellings(quality).map((s) => `C${s}`).join(', ')}</span>
        <span className="text-right text-muted-foreground">{name}</span>
      </div>
      <p className="text-muted-foreground">
        <span className="font-semibold text-foreground">{tones.map((tone) => tone.degree).join(' ')}</span>
        {' · '}
        {tones.map((tone) => noteName(tone.note)).join(' ')}
      </p>
      <div className="flex gap-2">
        <Button variant="link" className="px-0" onClick={hear}>
          {t('symbols.hear')}
        </Button>
        <Button
          variant="link"
          className="px-3"
          render={<Link to="/theory/chords" search={{ quality }} />}
          nativeButton={false}
        >
          {t('symbols.open')}
        </Button>
      </div>
    </li>
  )
}
```

(`qualitySpellings` returns the suffix first, then its aliases; check it includes `''` for major so the first spelling
reads `C`.)

`ReadingSheet.tsx`:

```tsx
import { BookOpenText, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui'

const READING = ['a', 'b', 'c', 'd', 'e', 'f', 'g'] as const
const NUMBERS = ['a', 'b', 'c', 'd'] as const
const STEPS = [1, 2, 3, 4, 5, 6, 7] as const

/** The legacy Guide's reading notes, behind one row (spec §8: help behind an info control). */
export function ReadingSheet() {
  const { t } = useTranslation('theory')
  return (
    <Sheet>
      <SheetTrigger className="flex min-h-14 w-full items-center gap-3 rounded-3xl bg-card px-4 text-left font-semibold ring-1 ring-border">
        <BookOpenText aria-hidden className="size-5 text-primary" />
        <span className="flex-1">{t('symbols.howToRead')}</span>
        <ChevronRight aria-hidden className="size-5 text-muted-foreground" />
      </SheetTrigger>
      <SheetContent title={t('symbols.howToRead')}>
        <article className="flex flex-col gap-6 pb-4 text-base leading-relaxed">
          <section className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">{t('symbols.reading.title')}</h3>
            {READING.map((key) => (
              <p key={key}>
                <strong>{t(`symbols.reading.items.${key}.lead`)}</strong> {t(`symbols.reading.items.${key}.rest`)}
              </p>
            ))}
          </section>
          <section className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">{t('symbols.numbers.title')}</h3>
            {NUMBERS.map((key) => (
              <p key={key}>
                <strong>{t(`symbols.numbers.items.${key}.lead`)}</strong> {t(`symbols.numbers.items.${key}.rest`)}
              </p>
            ))}
          </section>
          <section className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">{t('symbols.naming.title')}</h3>
            <ol className="flex list-decimal flex-col gap-1 pl-5">
              {STEPS.map((step) => (
                <li key={step}>{t(`symbols.naming.steps.${step}`)}</li>
              ))}
            </ol>
            <p className="text-muted-foreground">{t('symbols.naming.careful')}</p>
          </section>
        </article>
      </SheetContent>
    </Sheet>
  )
}
```

`TheorySymbolsPage.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { CHORD_FAMILIES, qualitiesIn } from '@/shared/lib/music'
import { QualityRow } from './QualityRow'
import { ReadingSheet } from './ReadingSheet'

export function TheorySymbolsPage() {
  const { t } = useTranslation('theory')
  return (
    <div className="flex flex-col gap-8">
      <ReadingSheet />
      {CHORD_FAMILIES.map((family) => (
        <section key={family} aria-label={t(`family.${family}`)} className="flex flex-col gap-3">
          <h2 className="text-xl font-bold">{t(`family.${family}`)}</h2>
          <ul className="flex flex-col divide-y divide-border rounded-3xl bg-card ring-1 ring-border">
            {qualitiesIn(family).map((quality) => (
              <QualityRow key={quality} quality={quality} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
```

Run the test. Expected: PASS.

- [ ] **Step 4: Verify and commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
npx prettier --write src/pages/theory-symbols src/app/screens src/shared/i18n/locales
git add src/pages/theory-symbols src/app/screens src/shared
git commit -m "Show the chord dictionary and the reading notes in Theory → Symbols

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---
### Task 22: Path — Continue and the levels

**Files:**
- Create: `src/widgets/continue-card/{index.ts,ui/ContinueCard.tsx}`, `src/widgets/path-levels/{index.ts,ui/PathLevels.tsx,ui/StepRow.tsx}`,
  `src/app/screens/path.test.tsx`
- Modify: `src/pages/path/ui/PathPage.tsx`, `src/shared/i18n/locales/{en,ru}/path.ts`

**Interfaces:**
- Consumes: `selectSuggestedStep`, `selectAllAnswers`, `selectLearned`, `skillsToCheck`, `knownCount` (progress);
  `pathSteps`, `LEVELS`, `skillsOfStep`, `useStepTitle`, `StepKind`; `pieceById`, `pieceKey`, `skillsOfPiece`;
  `keyName`, `qualitiesIn`; `LearnedToggle`; kit.
- Produces: `ContinueCard()`, `PathLevels()`.

- [ ] **Step 1: Strings** — `path`: en `continue: 'Continue'`, `allLearned: 'Everything on the path is learned.'`,
  `toSongs: 'Open Songs'`, `toCheck: 'Chords to check: {{count}}'`, `known: '{{known}} of {{total}} known'`,
  `progress: '{{learned}} of {{total}}'`; ru `continue: 'Продолжить'`, `allLearned: 'Весь путь пройден.'`,
  `toSongs: 'Открыть песни'`, `toCheck: 'Проверить аккорды: {{count}}'`, `known: 'Знаю {{known}} из {{total}}'`,
  `progress: '{{learned}} из {{total}}'`.

- [ ] **Step 2: Write the failing integration tests**

`src/app/screens/path.test.tsx`:

```tsx
import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '../testing/render-app'

describe('Path', () => {
  it('suggests the first step on a first run', async () => {
    renderApp('/')
    const card = await screen.findByRole('region', { name: 'Triads' })
    expect(within(card).getByRole('link', { name: 'Continue' }).getAttribute('href')).toMatch(
      /^\/theory\/chords\?.*step=chords(%3A|:)tri/,
    )
  })

  it('suggests the song practised last, with the chords it has to check', async () => {
    const { progressStore } = renderApp('/')
    act(() => progressStore.setState({ practised: { bz5: '2026-09-25T10:00:00Z' } }))
    const card = await screen.findByRole('region', { name: 'Still, my soul, be still' })
    expect(within(card).getByRole('link', { name: 'Continue' })).toHaveAttribute('href', '/play/bz5')
    expect(within(card).getByRole('link', { name: /^Chords to check: \d+$/ }).getAttribute('href')).toMatch(
      /^\/check\?of=piece(%3A|:)bz5$/,
    )
  })

  it('lists level 1 with its count and marks a step learned from its row', async () => {
    const user = userEvent.setup()
    renderApp('/')
    const level = await screen.findByRole('region', { name: 'Level 1 · Beginner' })
    const total = within(level).getAllByRole('listitem').length
    expect(within(level).getByText(`0 of ${total}`)).toBeInTheDocument()
    await user.click(within(level).getByRole('button', { name: 'Triads: learned' }))
    expect(within(level).getByText(`1 of ${total}`)).toBeInTheDocument()
  })

  it('opens a song from its row', async () => {
    renderApp('/')
    const level = await screen.findByRole('region', { name: 'Level 1 · Beginner' })
    expect(within(level).getByRole('link', { name: /Still, my soul, be still/ })).toHaveAttribute(
      'href',
      '/songs/bz5',
    )
  })
})
```

Run it. Expected: FAIL.

- [ ] **Step 3: Implement**

`ContinueCard.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { Play } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { useStepTitle, type PathStep } from '@/entities/path'
import { pieceById, pieceKey, skillsOfPiece } from '@/entities/piece'
import { selectAllAnswers, selectSuggestedStep, skillsToCheck, useProgress } from '@/entities/progress'
import { keyName, qualitiesIn } from '@/shared/lib/music'
import { Button } from '@/shared/ui/primitives/button'

function ContinueButton({ step, label }: { step: PathStep; label: string }) {
  const to =
    step.kind === 'piece' ? (
      <Link to="/play/$pieceId" params={{ pieceId: step.pieceId }} />
    ) : step.kind === 'chords' ? (
      <Link
        to="/theory/chords"
        search={{ quality: qualitiesIn(step.family)[0] ?? 'maj', step: `chords:${step.family}` }}
      />
    ) : (
      <Link to="/theory/scales" search={{ kind: step.scale, step: `scale:${step.scale}` }} />
    )
  return (
    <Button size="pill" render={to} nativeButton={false}>
      <Play data-icon="inline-start" />
      {label}
    </Button>
  )
}

/** What to play next (spec §5), in one tap; the chords it still has to check, when it is a song. */
export function ContinueCard() {
  const { t } = useTranslation('path')
  const headingId = useId()
  const suggested = useProgress(selectSuggestedStep)
  const answers = useProgress(selectAllAnswers)
  const stepTitle = useStepTitle()

  if (!suggested) {
    return (
      <section className="flex flex-col items-start gap-3 rounded-3xl bg-secondary p-5 text-secondary-foreground">
        <p className="text-lg font-semibold">{t('allLearned')}</p>
        <Button variant="surface" render={<Link to="/songs" />} nativeButton={false}>
          {t('toSongs')}
        </Button>
      </section>
    )
  }

  const title = stepTitle(suggested.step)
  const piece = suggested.step.kind === 'piece' ? pieceById(suggested.step.pieceId) : undefined
  const toCheck = piece ? skillsToCheck(skillsOfPiece(piece), answers).length : 0
  const detail = piece
    ? [title.secondary, keyName(pieceKey(piece))].filter(Boolean).join(' · ')
    : t(`kind.${title.kind}`)

  return (
    <section
      aria-labelledby={headingId}
      className="flex flex-col gap-4 rounded-3xl bg-secondary p-5 text-secondary-foreground shadow-sm"
    >
      <div>
        <h2 id={headingId} className="text-xl font-bold text-balance text-foreground">
          {title.primary}
        </h2>
        <p className="mt-1">{detail}</p>
      </div>
      {toCheck > 0 ? (
        <Link
          to="/check"
          search={{ of: suggested.id }}
          className="flex min-h-11 items-center gap-2 self-start font-semibold"
        >
          <span aria-hidden className="size-2 rounded-full bg-attention" />
          {t('toCheck', { count: toCheck })}
        </Link>
      ) : null}
      <ContinueButton step={suggested.step} label={t('continue')} />
    </section>
  )
}
```

`StepRow.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import {
  ChartNoAxesColumnIncreasing,
  KeyboardMusic,
  ListMusic,
  Music,
  Repeat2,
  type LucideIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { skillsOfStep, useStepTitle, type PlacedStep, type StepKind } from '@/entities/path'
import { knownCount, type ProgressState } from '@/entities/progress'
import { LearnedToggle } from '@/features/mark-learned'
import { qualitiesIn } from '@/shared/lib/music'
import { cn } from '@/shared/lib'

const ICON: Readonly<Record<StepKind, LucideIcon>> = {
  chords: KeyboardMusic,
  scale: ChartNoAxesColumnIncreasing,
  exercise: Repeat2,
  song: Music,
  progression: ListMusic,
}
const TILE: Readonly<Record<StepKind, string>> = {
  chords: 'bg-primary text-primary-foreground',
  scale: 'bg-primary text-primary-foreground',
  exercise: 'bg-muted text-primary',
  song: 'bg-muted text-primary',
  progression: 'bg-muted text-primary',
}

export function StepRow({ placed, answers }: { placed: PlacedStep; answers: ProgressState['answers'] }) {
  const { t } = useTranslation('path')
  const title = useStepTitle()(placed.step)
  const { step } = placed
  const Icon = ICON[title.kind]
  const skills = skillsOfStep(step)
  const subtitle = [
    t(`kind.${title.kind}`),
    step.kind === 'chords' ? t('known', { known: knownCount(skills, answers), total: skills.length }) : null,
    title.secondary ?? null,
  ]
    .filter(Boolean)
    .join(' · ')
  const body = (
    <>
      <span className={cn('grid size-12 shrink-0 place-items-center rounded-2xl', TILE[title.kind])}>
        <Icon aria-hidden className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-lg font-semibold">{title.primary}</span>
        <span className="block truncate text-sm text-muted-foreground">{subtitle}</span>
      </span>
    </>
  )
  const linkClass =
    'flex min-h-16 min-w-0 flex-1 items-center gap-4 rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring'
  return (
    <li className="flex items-center gap-2">
      {step.kind === 'piece' ? (
        <Link to="/songs/$pieceId" params={{ pieceId: step.pieceId }} className={linkClass}>
          {body}
        </Link>
      ) : step.kind === 'chords' ? (
        <Link
          to="/theory/chords"
          search={{ quality: qualitiesIn(step.family)[0] ?? 'maj', step: placed.id as `chords:${typeof step.family}` }}
          className={linkClass}
        >
          {body}
        </Link>
      ) : (
        <Link to="/theory/scales" search={{ kind: step.scale, step: `scale:${step.scale}` }} className={linkClass}>
          {body}
        </Link>
      )}
      <LearnedToggle step={placed.id} title={title.primary} />
    </li>
  )
}
```

(Write the chords `step` as `` `chords:${step.family}` `` rather than a cast.)

`PathLevels.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { LEVELS, pathSteps } from '@/entities/path'
import { selectAllAnswers, selectLearned, useProgress } from '@/entities/progress'
import { StepRow } from './StepRow'

/** Levels 1–4 in order, each with its count learned and its steps; empty levels are not shown. */
export function PathLevels() {
  const { t } = useTranslation(['path', 'common'])
  const learned = useProgress(selectLearned)
  const answers = useProgress(selectAllAnswers)
  const steps = pathSteps()
  return (
    <div className="flex flex-col gap-8">
      {LEVELS.map((level) => {
        const inLevel = steps.filter((s) => s.level === level)
        if (inLevel.length === 0) return null
        const done = inLevel.filter((s) => learned[s.id] !== undefined).length
        const name = `${t('common:level', { level })} · ${t(`common:levelName.${level}`)}`
        return (
          <section key={level} aria-label={name} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-xl font-bold text-primary">{name}</h2>
              <span className="text-muted-foreground tabular-nums">
                {t('path:progress', { learned: done, total: inLevel.length })}
              </span>
            </div>
            <ul className="flex flex-col gap-1">
              {inLevel.map((placed) => (
                <StepRow key={placed.id} placed={placed} answers={answers} />
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
```

`PathPage.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { RoundButton, ScreenHeader } from '@/shared/ui'
import { ContinueCard } from '@/widgets/continue-card'
import { PathLevels } from '@/widgets/path-levels'

export function PathPage() {
  const { t } = useTranslation(['path', 'common'])
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <ScreenHeader
          title={t('path:title')}
          actions={<RoundButton label={t('common:nav.settings')} icon={Settings} render={<Link to="/settings" />} />}
        />
        <ContinueCard />
      </div>
      <PathLevels />
    </div>
  )
}
```

Run the tests. Expected: PASS.

- [ ] **Step 4: Verify and commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
npx prettier --write src/widgets/continue-card src/widgets/path-levels src/pages/path src/app/screens src/shared/i18n/locales
git add src/widgets src/pages/path src/app/screens src/shared
git commit -m "Show the Path: Continue in one tap, then each level's steps with their learned checks

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 23: Songs

**Files:**
- Create: `src/pages/songs/model/songs-view.ts`, `songs-view.test.ts`, `src/pages/songs/ui/SearchField.tsx`,
  `src/widgets/piece-list/{index.ts,ui/PieceList.tsx,ui/EntryRow.tsx}`, `src/app/screens/songs.test.tsx`
- Modify: `src/pages/songs/ui/SongsPage.tsx`, `src/shared/i18n/locales/{en,ru}/songs.ts`

**Interfaces:**
- Consumes: `COLLECTIONS`, `entryTitles`, `pieceKey`, `Entry`, `Collection`; `levelOf`, `pathSteps`, `LEVELS`;
  `selectIsLearned`; `matchesQuery`; `useLanguage`, `localText`; kit; `Empty*`, `Input`.
- Produces: `songsView(collections, filter, levelOfEntry): { collection: Collection; entries: Entry[] }[]`;
  `PieceList({ groups }: { groups: readonly { title: string; entries: readonly Entry[] }[] })`.

- [ ] **Step 1: Strings** — `songs`: en `{ title: 'Songs', search: 'Search songs', clearSearch: 'Clear search',
  collections: 'Collections', all: 'All', levels: 'Levels', anyLevel: 'Any level', noChart: 'No chart yet', learned:
  'Learned', empty: 'No songs match.', clearFilters: 'Clear filters' }`; ru `{ title: 'Песни', search: 'Поиск песен',
  clearSearch: 'Очистить поиск', collections: 'Сборники', all: 'Все', levels: 'Уровни', anyLevel: 'Любой уровень',
  noChart: 'Аккордов пока нет', learned: 'Выучено', empty: 'Ничего не найдено.', clearFilters: 'Сбросить фильтры' }`.

- [ ] **Step 2: Write the failing view test**

`songs-view.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { levelOf } from '@/entities/path'
import { COLLECTIONS, type Entry } from '@/entities/piece'
import { songsView } from './songs-view'

const levelOfEntry = (entry: Entry) => (entry.kind === 'listing' ? undefined : levelOf(`piece:${entry.id}`))
const ids = (groups: ReturnType<typeof songsView>) => groups.flatMap((g) => g.entries.map((e) => e.id))
const ALL = { q: '', collection: 'all', level: 'any' } as const

describe('songsView', () => {
  it('shows every entry, by collection, when nothing filters', () => {
    const groups = songsView(COLLECTIONS, ALL, levelOfEntry)
    expect(groups.map((g) => g.collection.id)).toEqual(COLLECTIONS.map((c) => c.id))
  })

  it('finds a song by either title or a credited name, ignoring case', () => {
    expect(ids(songsView(COLLECTIONS, { ...ALL, q: 'ДУША' }, levelOfEntry))).toContain('bz5')
    expect(ids(songsView(COLLECTIONS, { ...ALL, q: 'still, my soul' }, levelOfEntry))).toContain('bz5')
    expect(ids(songsView(COLLECTIONS, { ...ALL, q: 'getty' }, levelOfEntry))).toContain('bz5')
  })

  it('keeps one collection', () => {
    const groups = songsView(COLLECTIONS, { ...ALL, collection: 'hymns' }, levelOfEntry)
    expect(groups.map((g) => g.collection.id)).toEqual(['hymns'])
  })

  it('filters by level, which listings do not have', () => {
    const entries = songsView(COLLECTIONS, { ...ALL, level: 1 }, levelOfEntry).flatMap((g) => g.entries)
    expect(entries.every((e) => e.kind !== 'listing')).toBe(true)
  })

  it('drops collections left empty', () => {
    expect(songsView(COLLECTIONS, { ...ALL, q: 'zzzz' }, levelOfEntry)).toEqual([])
  })
})
```

Run it. Expected: FAIL. Then implement `songs-view.ts`:

```ts
import type { Level } from '@/entities/path'
import type { Collection, CollectionId, Entry } from '@/entities/piece'
import { matchesQuery } from '@/shared/lib'

export interface SongsFilter {
  readonly q: string
  readonly collection: CollectionId | 'all'
  readonly level: Level | 'any'
}

const searchable = (entry: Entry): string[] => [
  entry.title,
  entry.titleEn ?? '',
  ...(entry.credits ?? []).flatMap((credit) => (credit.role === 'unknown' ? [] : [credit.names])),
]

/** The Songs list: collections in order, their entries filtered by search, collection and level. */
export function songsView(
  collections: readonly Collection[],
  filter: SongsFilter,
  levelOfEntry: (entry: Entry) => Level | undefined,
): { collection: Collection; entries: Entry[] }[] {
  return collections
    .filter((collection) => filter.collection === 'all' || collection.id === filter.collection)
    .map((collection) => ({
      collection,
      entries: collection.entries.filter(
        (entry) =>
          (filter.level === 'any' || levelOfEntry(entry) === filter.level) &&
          matchesQuery(searchable(entry), filter.q),
      ),
    }))
    .filter((group) => group.entries.length > 0)
}
```

Run it. Expected: PASS.

- [ ] **Step 3: Write the failing screen test**

`src/app/screens/songs.test.tsx`:

```tsx
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '../testing/render-app'

describe('Songs', () => {
  it('lists the collections, marking listings with no chart', async () => {
    renderApp('/songs')
    expect(await screen.findByRole('heading', { level: 2, name: '«Боже, спасибо»' })).toBeInTheDocument()
    expect(screen.getAllByText('No chart yet').length).toBeGreaterThan(0)
  })

  it('searches through the URL and opens a song', async () => {
    const user = userEvent.setup()
    const { router } = renderApp('/songs')
    await user.type(await screen.findByRole('searchbox', { name: 'Search songs' }), 'душа')
    expect(router.state.location.search).toMatchObject({ q: 'душа' })
    expect(await screen.findByRole('link', { name: /Still, my soul, be still/ })).toHaveAttribute('href', '/songs/bz5')
  })

  it('says so when nothing matches, and clears the filters', async () => {
    const user = userEvent.setup()
    renderApp('/songs?q=zzzz')
    expect(await screen.findByText('No songs match.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(await screen.findByRole('heading', { level: 2, name: '«Боже, спасибо»' })).toBeInTheDocument()
  })

  it('keeps one collection', async () => {
    const user = userEvent.setup()
    renderApp('/songs')
    const collections = await screen.findByRole('group', { name: 'Collections' })
    await user.click(within(collections).getByRole('button', { name: 'Hymns' }))
    expect(screen.queryByRole('heading', { level: 2, name: '«Боже, спасибо»' })).not.toBeInTheDocument()
  })
})
```

(Use the collection names as the content writes them; check `hymns/index.ts` for the English name.)

Run it. Expected: FAIL.

- [ ] **Step 4: Implement the widget, the search field and the page**

`EntryRow.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { levelOf } from '@/entities/path'
import { entryTitles, pieceKey, type Entry } from '@/entities/piece'
import { selectIsLearned, useProgress } from '@/entities/progress'
import { useLanguage } from '@/shared/i18n'
import { keyName } from '@/shared/lib/music'
import { LevelMark } from '@/shared/ui'

export function EntryRow({ entry }: { entry: Entry }) {
  const { t } = useTranslation('songs')
  const language = useLanguage()
  const { primary, secondary } = entryTitles(entry, language)
  const learned = useProgress(selectIsLearned(`piece:${entry.id}`))
  const level = entry.kind === 'listing' ? undefined : levelOf(`piece:${entry.id}`)
  return (
    <li>
      <Link
        to="/songs/$pieceId"
        params={{ pieceId: entry.id }}
        className="flex min-h-16 items-center gap-3 rounded-2xl px-1 outline-none focus-visible:ring-3 focus-visible:ring-ring"
      >
        <span className="w-7 shrink-0 text-right text-sm text-muted-foreground tabular-nums">
          {entry.source?.number ?? ''}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-lg font-semibold">{primary}</span>
          {secondary ? <span className="block truncate text-sm text-muted-foreground">{secondary}</span> : null}
          <span className="block text-sm text-muted-foreground">
            {entry.kind === 'listing' ? t('noChart') : `${keyName(pieceKey(entry))} · ${entry.meter}`}
          </span>
        </span>
        {level ? <LevelMark level={level} /> : null}
        <span className="grid size-6 shrink-0 place-items-center">
          {learned ? (
            <>
              <Check aria-hidden className="size-5 text-primary" strokeWidth={3} />
              <span className="sr-only">{t('learned')}</span>
            </>
          ) : null}
        </span>
      </Link>
    </li>
  )
}
```

`PieceList.tsx`:

```tsx
import type { Entry } from '@/entities/piece'
import { EntryRow } from './EntryRow'

/** Songs by collection, each collection under its heading. */
export function PieceList({ groups }: { groups: readonly { title: string; entries: readonly Entry[] }[] }) {
  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <section key={group.title} className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-primary">{group.title}</h2>
          <ul className="flex flex-col">
            {group.entries.map((entry) => (
              <EntryRow key={entry.id} entry={entry} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
```

`SearchField.tsx`:

```tsx
import { Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/ui/primitives/input'

export function SearchField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { t } = useTranslation('songs')
  return (
    <div className="relative">
      <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        aria-label={t('search')}
        placeholder={t('search')}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl bg-card pr-12 pl-12 text-base"
      />
      {value ? (
        <button
          type="button"
          aria-label={t('clearSearch')}
          onClick={() => onChange('')}
          className="absolute top-1/2 right-1 grid size-11 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:text-foreground"
        >
          <X aria-hidden className="size-5" />
        </button>
      ) : null}
    </div>
  )
}
```

`SongsPage.tsx`:

```tsx
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useDeferredValue } from 'react'
import { useTranslation } from 'react-i18next'
import { LEVELS, levelOf, pathSteps, type Level } from '@/entities/path'
import { COLLECTIONS, type CollectionId, type Entry } from '@/entities/piece'
import { localText, useLanguage } from '@/shared/i18n'
import { ChipRow, ScreenHeader } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from '@/shared/ui/primitives/empty'
import { PieceList } from '@/widgets/piece-list'
import { songsView } from '../model/songs-view'
import { SearchField } from './SearchField'

const levelOfEntry = (entry: Entry) => (entry.kind === 'listing' ? undefined : levelOf(`piece:${entry.id}`))
const LEVELS_ON_PATH = LEVELS.filter((level) => pathSteps().some((s) => s.level === level))

export function SongsPage() {
  const { t } = useTranslation(['songs', 'common'])
  const language = useLanguage()
  const search = useSearch({ from: '/shell/songs' })
  const navigate = useNavigate({ from: '/songs' })
  const query = useDeferredValue(search.q)
  const set = (patch: Partial<typeof search>) =>
    void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })
  const groups = songsView(COLLECTIONS, { ...search, q: query }, levelOfEntry).map((g) => ({
    title: localText(g.collection.name, language),
    entries: g.entries,
  }))

  return (
    <div className="flex flex-col gap-5">
      <ScreenHeader title={t('songs:title')} />
      <SearchField value={search.q} onChange={(q) => set({ q })} />
      <ChipRow<CollectionId | 'all'>
        label={t('songs:collections')}
        value={search.collection}
        options={[
          { value: 'all', label: t('songs:all') },
          ...COLLECTIONS.map((c) => ({ value: c.id, label: localText(c.name, language) })),
        ]}
        onChange={(collection) => set({ collection })}
      />
      {LEVELS_ON_PATH.length > 1 ? (
        <ChipRow
          label={t('songs:levels')}
          value={String(search.level)}
          options={[
            { value: 'any', label: t('songs:anyLevel') },
            ...LEVELS_ON_PATH.map((level) => ({ value: String(level), label: t('common:level', { level }) })),
          ]}
          onChange={(value) => set({ level: value === 'any' ? 'any' : (Number(value) as Level) })}
        />
      ) : null}
      {groups.length > 0 ? (
        <PieceList groups={groups} />
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{t('songs:empty')}</EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="soft" onClick={() => set({ q: '', collection: 'all', level: 'any' })}>
              {t('songs:clearFilters')}
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </div>
  )
}
```

The level row shows only when the path has more than one level (until Phase 4 it has one; a one-choice filter is
noise). Replace the `as Level` with a guard (`LEVELS.find((l) => String(l) === value) ?? 'any'`). Run the tests.
Expected: PASS.

- [ ] **Step 5: Verify and commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
npx prettier --write src/pages/songs src/widgets/piece-list src/app/screens src/shared/i18n/locales
git add src/pages/songs src/widgets/piece-list src/app/screens src/shared
git commit -m "List songs by collection with search, filters and learned marks

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 24: The Piece screen and the chord chart

**Files:**
- Modify: `src/entities/piece/model/beats.ts`, `beats.test.ts`, `src/entities/piece/index.ts`,
  `src/pages/piece/ui/PiecePage.tsx`, `src/shared/i18n/locales/{en,ru}/piece.ts`, `src/app/router.test.tsx`
- Create: `src/widgets/chord-chart/{index.ts,ui/ChordChart.tsx,ui/BarButton.tsx}`,
  `src/widgets/piece-skills/{index.ts,ui/PieceSkills.tsx}`, `src/pages/piece/ui/{PieceView,ListingView,PieceFacts}.tsx`,
  `src/app/screens/piece.test.tsx`

**Interfaces:**
- Produces:
  - `barLength(beats: number, meter: Meter): string` — `2/4` for two beats in 4/4, `3/8` for a dotted-quarter beat
    in 6/8, `3/8` for 1½ beats in 4/4.
  - `ChordChart({ performance, headings, meter, layout, current, onBar }: { performance: Performance; headings:
    readonly string[]; meter: Meter; layout: 'sheet' | 'strip'; current?: number | null; onBar: (bar: number) =>
    void })` — bar buttons named "Bar 4: C C/E Dsus4 D/F#", the current one `aria-current="step"`.
  - `PieceSkills({ piece, performance }: { piece: Piece; performance: Performance })`

- [ ] **Step 1: Strings** — `piece` gains: en `chords: 'Chords in this song'`, `checkChords: 'Check these chords'`,
  `chart: 'Chart'`, `barLabel: 'Bar {{n}}'`, `progression: 'Progression'`, `practise: 'Practise'`, `noChart: 'No
  chart yet'`, `scaleOf: 'Scale: {{scale}}'`, `key: 'Key'`, `meter: 'Meter'`; ru `chords: 'Аккорды в песне'`,
  `checkChords: 'Проверить эти аккорды'`, `chart: 'Аккорды по тактам'`, `barLabel: 'Такт {{n}}'`, `progression:
  'Последовательность'`, `practise: 'Играть'`, `noChart: 'Аккордов пока нет'`, `scaleOf: 'Гамма: {{scale}}'`, `key:
  'Тональность'`, `meter: 'Размер'`.

- [ ] **Step 2: `barLength`, test first**

Append to `beats.test.ts`:

```ts
describe('barLength', () => {
  it('writes a short bar in the meter’s own unit', () => {
    expect(barLength(2, '4/4')).toBe('2/4')
    expect(barLength(1.5, '4/4')).toBe('3/8')
    expect(barLength(1, '6/8')).toBe('3/8')
    expect(barLength(3, '12/8')).toBe('9/8')
  })
})
```

Implement in `beats.ts`:

```ts
/** A bar's length as a time signature would write it: quarters in x/4, eighths in compound x/8. */
export function barLength(beats: number, meter: Meter): string {
  if (meter.endsWith('/8')) return `${beats * 3}/8`
  return Number.isInteger(beats) ? `${beats}/4` : `${beats * 2}/8`
}
```

(import `type Meter` from `./types`; export `barLength` from the piece index.) Run it. Expected: PASS.

- [ ] **Step 3: Write the failing screen tests**

`src/app/screens/piece.test.tsx`:

```tsx
import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { COLLECTIONS } from '@/entities/piece'
import type { FakeAudio } from '@/shared/api/audio'
import { i18n } from '@/shared/i18n'
import { renderApp } from '../testing/render-app'

describe('Piece', () => {
  it('titles a song in English over its printed title, with credits and source', async () => {
    renderApp('/songs/bz5')
    expect(await screen.findByRole('heading', { level: 1, name: 'Still, my soul, be still' })).toBeInTheDocument()
    expect(screen.getByText('Мир, душа, храни')).toBeInTheDocument()
    expect(screen.getByText('«Боже, спасибо» · No. 5 · p. 16')).toBeInTheDocument()
  })

  it('lists the song’s chords with their ratings and checks them', async () => {
    renderApp('/songs/bz5')
    const chords = await screen.findByRole('region', { name: 'Chords in this song' })
    expect(within(chords).getAllByRole('link').length).toBeGreaterThan(1)
    expect(within(chords).getByRole('link', { name: 'Check these chords' }).getAttribute('href')).toMatch(
      /^\/check\?of=piece(%3A|:)bz5$/,
    )
  })

  it('plays a bar when it is tapped', async () => {
    const user = userEvent.setup()
    const { services } = renderApp('/songs/bz5')
    await user.click(await screen.findByRole('button', { name: /^Bar 1: G$/ }))
    expect((services.audio as FakeAudio).played).toHaveLength(1)
  })

  it('opens the Player and marks the song learned', async () => {
    const user = userEvent.setup()
    const { progressStore } = renderApp('/songs/bz5')
    expect(await screen.findByRole('link', { name: 'Practise' })).toHaveAttribute('href', '/play/bz5')
    await user.click(screen.getByRole('button', { name: 'Learned' }))
    expect(progressStore.getState().learned['piece:bz5']).toBeDefined()
  })

  it('reads in Russian, section headings too', async () => {
    renderApp('/songs/bz5', { locale: 'ru' })
    expect(await screen.findByRole('heading', { level: 1, name: 'Мир, душа, храни' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Куплет' })).toBeInTheDocument()
    act(() => void i18n.changeLanguage('en'))
  })

  it('shows a listing without a chart', async () => {
    const listing = COLLECTIONS.flatMap((c) => c.entries).find((e) => e.kind === 'listing')
    renderApp(`/songs/${listing?.id}`)
    expect(await screen.findByText('No chart yet')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Practise' })).not.toBeInTheDocument()
  })
})
```

In `router.test.tsx`, replace `calls a piece a song on screen` (the page title is the song's now) with the Piece
test above, and drop its `Song` heading expectation. Run the piece tests. Expected: FAIL.

- [ ] **Step 4: Implement the chart**

`BarButton.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'

export function BarButton({
  number,
  symbols,
  notes,
  current,
  onClick,
  ref,
}: {
  number: number
  symbols: readonly string[]
  /** Method labels and a short bar's length, under the chords. */
  notes: readonly string[]
  current: boolean
  onClick: () => void
  ref?: React.Ref<HTMLButtonElement>
}) {
  const { t } = useTranslation('piece')
  return (
    <button
      ref={ref}
      type="button"
      aria-label={`${t('barLabel', { n: number })}: ${symbols.join(' ')}`}
      aria-current={current ? 'step' : undefined}
      onClick={onClick}
      className={cn(
        'relative flex min-h-18 min-w-24 shrink-0 flex-col items-start justify-end gap-0.5 border-l-2 border-foreground/80 px-2.5 pt-5 pb-2 text-left transition-colors duration-200 ease-out outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset',
        current ? 'bg-muted text-primary' : 'hover:bg-muted/60',
      )}
    >
      <span aria-hidden className="absolute top-1 left-2 text-xs text-muted-foreground tabular-nums">
        {number}
      </span>
      <span aria-hidden className="text-xl font-bold whitespace-nowrap">
        {symbols.join(' ')}
      </span>
      {notes.length > 0 ? (
        <span aria-hidden className="text-xs whitespace-nowrap text-muted-foreground">
          {notes.join(' · ')}
        </span>
      ) : null}
    </button>
  )
}
```

(Import `type Ref` from `react` instead of the `React.` namespace.)

`ChordChart.tsx`:

```tsx
import { useEffect, useRef } from 'react'
import { isMethodCode, METHODS } from '@/entities/pattern'
import { barLength, type Meter } from '@/entities/piece'
import { localText, useLanguage } from '@/shared/i18n'
import type { Performance } from '@/shared/lib/arrangement'
import { cn } from '@/shared/lib'
import { BarButton } from './BarButton'

/** A lead sheet: bars with numbers and chord symbols, by section; a sheet to read or a strip to follow. */
export function ChordChart({
  performance,
  headings,
  meter,
  layout,
  current = null,
  onBar,
}: {
  performance: Performance
  headings: readonly string[]
  meter: Meter
  layout: 'sheet' | 'strip'
  current?: number | null
  onBar: (bar: number) => void
}) {
  const language = useLanguage()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    if (layout !== 'strip' || current === null) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    buttons.current[current]?.scrollIntoView?.({
      inline: 'center',
      block: 'nearest',
      behavior: reduce ? 'auto' : 'smooth',
    })
  }, [layout, current])

  const barOf = (index: number) => {
    const bar = performance.bars[index]
    if (!bar) return null
    const chords = bar.chords.map((i) => performance.chords[i]).filter((c) => c !== undefined)
    const methods = [...new Set(chords.map((c) => c.method).filter((m) => m !== undefined))]
      .filter(isMethodCode)
      .map((code) => localText(METHODS[code].label, language))
    const notes = bar.beats === performance.beatsPerBar ? methods : [...methods, barLength(bar.beats, meter)]
    return (
      <BarButton
        key={index}
        ref={(element) => {
          buttons.current[index] = element
        }}
        number={index + 1}
        symbols={chords.map((c) => c.symbol)}
        notes={notes}
        current={current === index}
        onClick={() => onBar(index)}
      />
    )
  }

  const sections = headings.map((heading, section) => ({
    heading,
    lines: [...new Set(performance.bars.flatMap((b, i) => (b.section === section ? [b.line] : [])))].map((line) =>
      performance.bars.flatMap((b, i) => (b.section === section && b.line === line ? [i] : [])),
    ),
  }))

  if (layout === 'strip') {
    return (
      <div className="-mx-4 flex snap-x overflow-x-auto border-y border-border bg-card px-4 [scrollbar-width:none]">
        {sections.flatMap(({ heading, lines }) =>
          lines.flat().map((index, i) => (
            <div key={index} className="flex shrink-0 snap-center flex-col">
              <span className={cn('h-5 px-2.5 pt-1 text-xs font-semibold text-muted-foreground', i > 0 && 'invisible')}>
                {heading}
              </span>
              {barOf(index)}
            </div>
          )),
        )}
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-6">
      {sections.map(({ heading, lines }, section) => (
        <section key={section} className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">{heading}</h3>
          {lines.map((bars, line) => (
            <div key={line} className="flex flex-wrap border-r-2 border-foreground/80">
              {bars.map(barOf)}
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}
```

(`min-h-18` is 72px. The strip hides each repeated section name with `invisible` so every bar keeps the same
height.)

`PieceSkills.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { skillsOfPiece, type Piece } from '@/entities/piece'
import { rate, selectAllAnswers, useProgress } from '@/entities/progress'
import type { Performance } from '@/shared/lib/arrangement'
import { noteParam, qualitySuffix, skillOf } from '@/shared/lib/music'
import { RatingMark } from '@/shared/ui'

const NONE = [] as const

/** The chord qualities a song uses, each with its rating; a check of them all. */
export function PieceSkills({ piece, performance }: { piece: Piece; performance: Performance }) {
  const { t } = useTranslation(['piece', 'theory'])
  const headingId = useId()
  const answers = useProgress(selectAllAnswers)
  const skills = skillsOfPiece(piece)
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <h2 id={headingId} className="text-xl font-bold">
        {t('piece:chords')}
      </h2>
      <ul className="flex flex-wrap gap-2">
        {skills.map((id) => {
          const skill = skillOf(id)
          if (skill.kind !== 'chord') return null
          const first = performance.chords.find((c) => c.quality === skill.quality)
          return (
            <li key={id}>
              <Link
                to="/theory/chords"
                search={{ quality: skill.quality, ...(first ? { root: noteParam(first.root) } : {}) }}
                aria-label={`${t(`theory:quality.${skill.quality}`)}`}
                className="flex h-11 items-center gap-2 rounded-full bg-card px-4 font-semibold ring-1 ring-border hover:bg-muted"
              >
                {qualitySuffix(skill.quality) || t('theory:major')}
                <RatingMark rating={rate(answers[id] ?? NONE)} />
              </Link>
            </li>
          )
        })}
      </ul>
      <Link
        to="/check"
        search={{ of: `piece:${piece.id}` }}
        className="self-start font-semibold text-primary underline-offset-4 hover:underline"
      >
        {t('piece:checkChords')}
      </Link>
    </section>
  )
}
```

(An `aria-label` hides the rating from the name; drop it and let the link's text plus `RatingMark`'s hidden word name
it — "m7 Gap" — or keep the label and add the rating word to it. Choose the second: `aria-label={`${name}, ${t(`common:rating.${rating}`)}`}`.)

- [ ] **Step 5: Implement the page**

`PieceFacts.tsx` — the title block and facts shared by songs and listings:

```tsx
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Credits, entryTitles, SourceLine, pieceKey, type Entry } from '@/entities/piece'
import { localText, useLanguage } from '@/shared/i18n'
import { keyName, noteName, noteParam } from '@/shared/lib/music'
import { RoundButton, ScreenHeader } from '@/shared/ui'

export function PieceFacts({ entry }: { entry: Entry }) {
  const { t } = useTranslation(['piece', 'common', 'theory'])
  const language = useLanguage()
  const { primary, secondary } = entryTitles(entry, language)
  const key = pieceKey(entry)
  const scaleKind = key.mode === 'minor' ? 'natural' : 'major'
  return (
    <div className="flex flex-col gap-3">
      <ScreenHeader
        title={primary}
        back={<RoundButton label={t('common:back')} icon={ArrowLeft} render={<Link to="/songs" />} />}
      />
      {secondary ? <p className="-mt-3 text-lg text-muted-foreground">{secondary}</p> : null}
      {entry.credits ? <Credits credits={entry.credits} /> : null}
      {entry.source ? <SourceLine source={entry.source} /> : null}
      <dl className="flex flex-wrap gap-2">
        <div className="rounded-full bg-muted px-3 py-1.5">
          <dt className="sr-only">{t('piece:key')}</dt>
          <dd className="font-semibold">{keyName(key)}</dd>
        </div>
        <div className="rounded-full bg-muted px-3 py-1.5">
          <dt className="sr-only">{t('piece:meter')}</dt>
          <dd className="font-semibold">{entry.meter}</dd>
        </div>
      </dl>
      {entry.note ? <p className="max-w-prose text-lg">{localText(entry.note, language)}</p> : null}
      <Link
        to="/theory/scales"
        search={{ root: noteParam(key.tonic), kind: scaleKind }}
        className="self-start font-semibold text-primary underline-offset-4 hover:underline"
      >
        {t('piece:scaleOf', { scale: `${noteName(key.tonic)} ${t(`theory:scaleName.${scaleKind}`)}` })}
      </Link>
    </div>
  )
}
```

`PieceView.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { Play } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { pieceKey, useSectionHeading, type Piece } from '@/entities/piece'
import { LearnedToggle } from '@/features/mark-learned'
import { arrangePiece, defaultPattern } from '@/features/practice'
import { audibleHands, barSounds } from '@/shared/lib/schedule'
import { usePlay } from '@/shared/lib/services'
import { Button } from '@/shared/ui/primitives/button'
import { ChordChart } from '@/widgets/chord-chart'
import { PieceSkills } from '@/widgets/piece-skills'
import { PieceFacts } from './PieceFacts'
import { entryTitles } from '@/entities/piece'
import { useLanguage } from '@/shared/i18n'

export function PieceView({ piece }: { piece: Piece }) {
  const { t } = useTranslation('piece')
  const heading = useSectionHeading()
  const play = usePlay()
  const language = useLanguage()
  const performance = useMemo(
    () =>
      arrangePiece(piece, {
        tonic: pieceKey(piece).tonic,
        pattern: defaultPattern(piece),
        rh: null,
        lh: null,
        voicing: null,
        melody: false,
      }),
    [piece],
  )
  const headings = piece.kind === 'progression' ? [t('progression')] : piece.sections.map(heading)
  const hearBar = (bar: number) =>
    play(barSounds(performance, bar, { tempo: piece.tempo, hands: audibleHands('both') }))

  return (
    <div className="flex flex-col gap-8 pb-4">
      <PieceFacts entry={piece} />
      <PieceSkills piece={piece} performance={performance} />
      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">{t('chart')}</h2>
        <ChordChart performance={performance} headings={headings} meter={piece.meter} layout="sheet" onBar={hearBar} />
      </section>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="pill" className="flex-1" render={<Link to="/play/$pieceId" params={{ pieceId: piece.id }} />} nativeButton={false}>
          <Play data-icon="inline-start" />
          {t('practise')}
        </Button>
        <LearnedToggle step={`piece:${piece.id}`} title={entryTitles(piece, language).primary} variant="text" />
      </div>
    </div>
  )
}
```

(Merge the two `@/entities/piece` imports.) `ListingView.tsx`: `<PieceFacts entry={listing} />` then
`<p className="text-lg font-semibold">{t('noChart')}</p>`. `PiecePage.tsx`:

```tsx
import { useParams } from '@tanstack/react-router'
import { entryById } from '@/entities/piece'
import { ListingView } from './ListingView'
import { PieceView } from './PieceView'

export function PiecePage() {
  const { pieceId } = useParams({ from: '/shell/songs/$pieceId' })
  const entry = entryById(pieceId)
  if (!entry) return null
  return entry.kind === 'listing' ? <ListingView listing={entry} /> : <PieceView key={entry.id} piece={entry} />
}
```

Run the piece tests. Expected: PASS.

- [ ] **Step 6: Verify and commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
npx prettier --write src/entities/piece src/widgets/chord-chart src/widgets/piece-skills src/pages/piece src/app src/shared/i18n/locales
git add src/entities/piece src/widgets src/pages/piece src/app src/shared
git commit -m "Show a song: its chords and their ratings, the chart to tap and hear, Practise

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 25: The Setup sheet

**Files:**
- Create: `src/widgets/player-setup/{index.ts,ui/PlayerSetup.tsx,ui/SetupMain.tsx,ui/ChoiceList.tsx,ui/PlayerSetup.test.tsx}`
- Modify: `src/shared/i18n/locales/{en,ru}/player.ts`

**Interfaces:**
- Consumes: `PATTERN_GROUPS`, `PATTERN_GROUP_NAMES`, `PATTERNS`, `patternsIn`, `needsMelody`, `RIGHT_FIGURE_IDS`,
  `RIGHT_FIGURES`, `LEFT_FIGURE_IDS`, `LEFT_FIGURES`; `hasMethodCodes`, `melodyOf`, `pieceKey`, `VOICINGS`;
  `selectPractice`, `useSettings`, `useSettingsStoreApi`, `PRACTICE_TOGGLES`; `setPracticeToggle`; `PracticeChoice`;
  `tonicSpelling`, `noteName`, `noteParam`; kit, `Slider`, `Switch`.
- Produces: `SetupChange = { key?: string; tempo?: number; hands?: Hands; pattern?: PatternId | 'chart'; rh?:
  RightFigureId; lh?: LeftFigureId; voicing?: Voicing }` (a key set to `undefined` returns it to the piece's own);
  `PlayerSetup({ open, onOpenChange, piece, choice, tempo, hands, onChange }: { open: boolean; onOpenChange: (open:
  boolean) => void; piece: Piece; choice: PracticeChoice; tempo: number; hands: Hands; onChange: (change:
  SetupChange) => void })`.

- [ ] **Step 1: Strings** — `player`:

```ts
// en
export const player = {
  title: 'Player',
  setup: 'Setup',
  summary: '{{key}} · {{tempo}} BPM · {{hands}}',
  key: 'Key',
  tempo: 'Tempo',
  bpm: '{{tempo}} BPM',
  hands: 'Hands',
  pattern: 'Pattern',
  fromChart: 'From the chart',
  fromChartDescription: 'Each chord as the song’s method code says.',
  rh: 'Right hand',
  lh: 'Left hand',
  ownFigure: 'The pattern’s own',
  needsMelody: 'Needs a melody',
  voicing: 'Voicing',
  voicings: { triads: 'Triads', sevenths: '7ths', ninths: '9ths' },
  toggles: { fingerNumbers: 'Finger numbers', melody: 'Melody', metronome: 'Metronome', countIn: 'Count-in' },
  back: 'Back',
  modes: { label: 'Practice mode', listen: 'Listen', step: 'Step', turn: 'Your turn' },
  next: 'Next',
  nextChord: 'Next',
  nextBar: 'Next bar',
  restart: 'From the start',
  play: 'Play',
  stop: 'Stop',
  hear: 'Hear these notes',
  playThese: 'Play {{notes}}',
  right: 'Right',
  notThat: 'Not {{note}}',
  finished: 'Finished',
  again: 'Again',
  grid: { label: 'Notes in bar {{n}}', rh: 'RH', lh: 'LH', melody: 'Tune' },
} as const
// ru
export const player = {
  title: 'Плеер',
  setup: 'Настройки',
  summary: '{{key}} · {{tempo}} уд/мин · {{hands}}',
  key: 'Тональность',
  tempo: 'Темп',
  bpm: '{{tempo}} уд/мин',
  hands: 'Руки',
  pattern: 'Фактура',
  fromChart: 'Как в песне',
  fromChartDescription: 'Каждый аккорд так, как указано в песне.',
  rh: 'Правая рука',
  lh: 'Левая рука',
  ownFigure: 'Как в фактуре',
  needsMelody: 'Нужна мелодия',
  voicing: 'Аккорды',
  voicings: { triads: 'Трезвучия', sevenths: 'Септаккорды', ninths: 'Нонаккорды' },
  toggles: { fingerNumbers: 'Аппликатура', melody: 'Мелодия', metronome: 'Метроном', countIn: 'Отсчёт' },
  back: 'Назад',
  modes: { label: 'Режим', listen: 'Слушать', step: 'По шагам', turn: 'Ваш ход' },
  next: 'Дальше',
  nextChord: 'Далее',
  nextBar: 'Следующий такт',
  restart: 'С начала',
  play: 'Играть',
  stop: 'Стоп',
  hear: 'Послушать эти ноты',
  playThese: 'Сыграйте {{notes}}',
  right: 'Верно',
  notThat: 'Не {{note}}',
  finished: 'Конец',
  again: 'Ещё раз',
  grid: { label: 'Ноты в такте {{n}}', rh: 'ПР', lh: 'ЛР', melody: 'Мелодия' },
} as const
```

- [ ] **Step 2: Write the failing tests**

`PlayerSetup.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PATTERNS } from '@/entities/pattern'
import { pieceById, pieceKey } from '@/entities/piece'
import { createSettingsStore, SettingsStoreProvider } from '@/entities/settings'
import type { PracticeChoice } from '@/features/practice'
import { createMemoryStorage } from '@/shared/lib'
import { PlayerSetup } from './PlayerSetup'

const bz5 = pieceById('bz5')
if (!bz5) throw new Error('bz5')
const CHOICE: PracticeChoice = { tonic: pieceKey(bz5).tonic, pattern: 'r4', rh: null, lh: null, voicing: null, melody: false }

function renderSetup() {
  const settings = createSettingsStore({ storage: createMemoryStorage(), languages: ['en'] })
  const onChange = vi.fn()
  render(
    <SettingsStoreProvider store={settings}>
      <PlayerSetup open onOpenChange={() => {}} piece={bz5!} choice={CHOICE} tempo={72} hands="both" onChange={onChange} />
    </SettingsStoreProvider>,
  )
  return { onChange, settings }
}

describe('PlayerSetup', () => {
  it('changes the key, hands and tempo', async () => {
    const user = userEvent.setup()
    const { onChange } = renderSetup()
    await user.click(screen.getByRole('button', { name: 'A' }))
    expect(onChange).toHaveBeenCalledWith({ key: 'A' })
    await user.click(screen.getByRole('button', { name: 'Left hand' }))
    expect(onChange).toHaveBeenCalledWith({ hands: 'lh' })
    screen.getByRole('slider', { name: 'Tempo' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenCalledWith({ tempo: 73 })
  })

  it('chooses a pattern from its group, and keeps melody patterns from a song without a melody', async () => {
    const user = userEvent.setup()
    const { onChange } = renderSetup()
    await user.click(screen.getByRole('button', { name: /^Pattern/ }))
    expect(screen.getByRole('button', { name: new RegExp(PATTERNS.r5.name.en) })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: new RegExp(PATTERNS.ballad.name.en) }))
    expect(onChange).toHaveBeenCalledWith({ pattern: 'ballad' })
  })

  it('saves the switches in settings', async () => {
    const user = userEvent.setup()
    const { settings } = renderSetup()
    await user.click(screen.getByRole('switch', { name: 'Metronome' }))
    expect(settings.getState().practice.metronome).toBe(true)
    expect(screen.queryByRole('switch', { name: 'Melody' })).not.toBeInTheDocument()
  })
})
```

(bz5 has no melody, so its Melody switch is not shown; check with `melodyOf(bz5)` before relying on it.)

Run it. Expected: FAIL.

- [ ] **Step 3: Implement**

`ChoiceList.tsx`:

```tsx
import { Check } from 'lucide-react'

export interface ChoiceItem<V extends string> {
  readonly value: V
  readonly label: string
  readonly description?: string
  readonly disabledNote?: string
}

/** A list of choices in a sheet page: one chosen, some disabled with the reason. */
export function ChoiceList<V extends string>({
  items,
  value,
  onChoose,
}: {
  items: readonly ChoiceItem<V>[]
  value: V
  onChoose: (value: V) => void
}) {
  return (
    <ul className="flex flex-col">
      {items.map((item) => (
        <li key={item.value}>
          <button
            type="button"
            disabled={item.disabledNote !== undefined}
            aria-pressed={item.value === value}
            onClick={() => onChoose(item.value)}
            className="flex min-h-14 w-full items-center gap-3 border-b border-border py-2 text-left disabled:opacity-50"
          >
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{item.label}</span>
              {item.description || item.disabledNote ? (
                <span className="block text-sm text-muted-foreground">
                  {item.disabledNote ?? item.description}
                </span>
              ) : null}
            </span>
            {item.value === value ? <Check aria-hidden className="size-5 text-primary" /> : null}
          </button>
        </li>
      ))}
    </ul>
  )
}
```

`SetupMain.tsx` — the main page (key chips, tempo, hands, the three rows that open lists, voicing, switches):

```tsx
import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { hasMethodCodes, melodyOf, pieceKey, VOICINGS, type Piece } from '@/entities/piece'
import { LEFT_FIGURES, PATTERNS, RIGHT_FIGURES } from '@/entities/pattern'
import {
  PRACTICE_TOGGLES,
  selectPractice,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import type { PracticeChoice } from '@/features/practice'
import { setPracticeToggle } from '@/features/set-preference'
import { localText, useLanguage } from '@/shared/i18n'
import { noteName, noteParam, pitchClass, tonicSpelling } from '@/shared/lib/music'
import type { Hands } from '@/shared/lib/schedule'
import { ChipRow, Segmented } from '@/shared/ui'
import { Slider } from '@/shared/ui/primitives/slider'
import { Switch } from '@/shared/ui/primitives/switch'
import type { SetupChange } from './PlayerSetup'

const PITCH_CLASSES = Array.from({ length: 12 }, (_, pc) => pitchClass(pc))

export function SetupMain({
  piece,
  choice,
  tempo,
  hands,
  onChange,
  open,
}: {
  piece: Piece
  choice: PracticeChoice
  tempo: number
  hands: Hands
  onChange: (change: SetupChange) => void
  open: (page: 'pattern' | 'rh' | 'lh') => void
}) {
  const { t } = useTranslation(['player', 'common'])
  const language = useLanguage()
  const settings = useSettingsStoreApi()
  const toggles = useSettings(selectPractice)
  const { mode } = pieceKey(piece)
  const hasMelody = melodyOf(piece) !== undefined
  const patternName =
    choice.pattern === 'chart' ? t('player:fromChart') : localText(PATTERNS[choice.pattern].name, language)
  const row = (label: string, value: string, page: 'pattern' | 'rh' | 'lh') => (
    <button
      type="button"
      onClick={() => open(page)}
      className="flex min-h-14 w-full items-center gap-3 border-b border-border text-left"
    >
      <span className="flex-1 text-lg">{label}</span>
      <span className="truncate text-muted-foreground">{value}</span>
      <ChevronRight aria-hidden className="size-5 text-muted-foreground" />
    </button>
  )
  return (
    <div className="flex flex-col gap-5">
      <ChipRow
        label={t('player:key')}
        value={noteParam(choice.tonic)}
        options={PITCH_CLASSES.map((pc) => {
          const tonic = tonicSpelling(pc, mode)
          return { value: noteParam(tonic), label: noteName(tonic) }
        })}
        onChange={(key) => onChange({ key })}
      />
      <label className="flex flex-col gap-3">
        <span className="flex justify-between text-lg">
          {t('player:tempo')}
          <span className="font-semibold tabular-nums">{t('player:bpm', { tempo })}</span>
        </span>
        <Slider
          aria-label={t('player:tempo')}
          min={40}
          max={160}
          step={1}
          value={[tempo]}
          onValueChange={(value) => onChange({ tempo: Array.isArray(value) ? (value[0] ?? tempo) : value })}
        />
      </label>
      <Segmented
        label={t('player:hands')}
        value={hands}
        options={(['both', 'rh', 'lh'] as const).map((h) => ({ value: h, label: t(`common:hands.${h}`) }))}
        onChange={(next) => onChange({ hands: next })}
      />
      <div>
        {row(t('player:pattern'), patternName, 'pattern')}
        {row(t('player:rh'), choice.rh ? localText(RIGHT_FIGURES[choice.rh].name, language) : t('player:ownFigure'), 'rh')}
        {row(t('player:lh'), choice.lh ? localText(LEFT_FIGURES[choice.lh].name, language) : t('player:ownFigure'), 'lh')}
      </div>
      {piece.kind === 'progression' && piece.voicing.choosable ? (
        <Segmented
          label={t('player:voicing')}
          value={choice.voicing ?? piece.voicing.default}
          options={VOICINGS.map((v) => ({ value: v, label: t(`player:voicings.${v}`) }))}
          onChange={(voicing) => onChange({ voicing })}
        />
      ) : null}
      <div>
        {PRACTICE_TOGGLES.filter((toggle) => toggle !== 'melody' || hasMelody).map((toggle) => (
          <label key={toggle} className="flex min-h-14 items-center justify-between border-b border-border text-lg">
            {t(`player:toggles.${toggle}`)}
            <Switch
              aria-label={t(`player:toggles.${toggle}`)}
              checked={toggles[toggle]}
              onCheckedChange={(on) => setPracticeToggle(settings, toggle, on)}
            />
          </label>
        ))}
      </div>
      {hasMethodCodes(piece) ? null : null}
    </div>
  )
}
```

(Delete the last empty line — `hasMethodCodes` is used by `PlayerSetup` for the pattern list, not here.)

`PlayerSetup.tsx`:

```tsx
import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LEFT_FIGURE_IDS,
  LEFT_FIGURES,
  PATTERN_GROUP_NAMES,
  PATTERN_GROUPS,
  PATTERNS,
  patternsIn,
  RIGHT_FIGURE_IDS,
  RIGHT_FIGURES,
  needsMelody,
  type LeftFigureId,
  type PatternId,
  type RightFigureId,
} from '@/entities/pattern'
import { hasMethodCodes, melodyOf, type Piece, type Voicing } from '@/entities/piece'
import type { PracticeChoice } from '@/features/practice'
import { localText, useLanguage } from '@/shared/i18n'
import type { Hands } from '@/shared/lib/schedule'
import { Sheet, SheetContent } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { ChoiceList } from './ChoiceList'
import { SetupMain } from './SetupMain'

export interface SetupChange {
  readonly key?: string
  readonly tempo?: number
  readonly hands?: Hands
  readonly pattern?: PatternId | 'chart'
  readonly rh?: RightFigureId
  readonly lh?: LeftFigureId
  readonly voicing?: Voicing
}

type Page = 'main' | 'pattern' | 'rh' | 'lh'
const OWN = 'own'

/** Everything about how the Player plays, in one sheet; lists open as its pages. */
export function PlayerSetup({
  open,
  onOpenChange,
  piece,
  choice,
  tempo,
  hands,
  onChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  piece: Piece
  choice: PracticeChoice
  tempo: number
  hands: Hands
  onChange: (change: SetupChange) => void
}) {
  const { t } = useTranslation('player')
  const language = useLanguage()
  const [page, setPage] = useState<Page>('main')
  const noMelody = melodyOf(piece) === undefined ? t('needsMelody') : undefined
  const title = page === 'main' ? t('setup') : page === 'pattern' ? t('pattern') : t(page)
  const choose = (change: SetupChange) => {
    onChange(change)
    setPage('main')
  }
  const back = (
    <Button variant="ghost" className="-ml-3 self-start" onClick={() => setPage('main')}>
      <ChevronLeft data-icon="inline-start" />
      {t('back')}
    </Button>
  )

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) setPage('main')
      }}
    >
      <SheetContent title={title}>
        {page === 'main' ? (
          <SetupMain piece={piece} choice={choice} tempo={tempo} hands={hands} onChange={onChange} open={setPage} />
        ) : null}
        {page === 'pattern' ? (
          <div className="flex flex-col gap-4">
            {back}
            {hasMethodCodes(piece) ? (
              <ChoiceList
                items={[{ value: 'chart', label: t('fromChart'), description: t('fromChartDescription') }]}
                value={choice.pattern}
                onChoose={() => choose({ pattern: 'chart' })}
              />
            ) : null}
            {PATTERN_GROUPS.map((group) => (
              <section key={group} className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  {localText(PATTERN_GROUP_NAMES[group], language)}
                </h3>
                <ChoiceList<PatternId | 'chart'>
                  items={patternsIn(group).map((id) => ({
                    value: id,
                    label: localText(PATTERNS[id].name, language),
                    ...(PATTERNS[id].description ? { description: localText(PATTERNS[id].description!, language) } : {}),
                    ...(needsMelody(id) && noMelody ? { disabledNote: noMelody } : {}),
                  }))}
                  value={choice.pattern}
                  onChoose={(pattern) => choose({ pattern })}
                />
              </section>
            ))}
          </div>
        ) : null}
        {page === 'rh' ? (
          <div className="flex flex-col gap-4">
            {back}
            <ChoiceList<RightFigureId | typeof OWN>
              items={[
                { value: OWN, label: t('ownFigure') },
                ...RIGHT_FIGURE_IDS.map((id) => ({
                  value: id,
                  label: localText(RIGHT_FIGURES[id].name, language),
                  ...(RIGHT_FIGURES[id].figure.kind === 'melody' && noMelody ? { disabledNote: noMelody } : {}),
                })),
              ]}
              value={choice.rh ?? OWN}
              onChoose={(value) => choose({ rh: value === OWN ? undefined : value })}
            />
          </div>
        ) : null}
        {page === 'lh' ? (
          <div className="flex flex-col gap-4">
            {back}
            <ChoiceList<LeftFigureId | typeof OWN>
              items={[
                { value: OWN, label: t('ownFigure') },
                ...LEFT_FIGURE_IDS.map((id) => ({ value: id, label: localText(LEFT_FIGURES[id].name, language) })),
              ]}
              value={choice.lh ?? OWN}
              onChoose={(value) => choose({ lh: value === OWN ? undefined : value })}
            />
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
```

(Replace the `description!` assertion with a local `const description = PATTERNS[id].description`. `ChoiceList`'s
button text includes the description, so tests find patterns by a regex on the name.) Run the tests. Expected: PASS.

- [ ] **Step 4: Verify and commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
npx prettier --write src/widgets/player-setup src/shared/i18n/locales
git add src/widgets/player-setup src/shared
git commit -m "Put the Player's key, tempo, hands, patterns, voicing and switches in one sheet

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 26: The Player

**Files:**
- Create: `src/pages/player/model/resolve-choice.ts`, `resolve-choice.test.ts`,
  `src/pages/player/ui/{PlayerTopBar,NowPanel,NoteGrid,Transport}.tsx`, `src/features/connect-midi/use-held-keys.ts`,
  `use-held-keys.test.tsx`, `src/app/screens/player.test.tsx`
- Modify: `src/pages/player/ui/PlayerPage.tsx`, `src/features/practice/note-names.ts` (+`spellPitchClass`),
  `src/features/connect-midi/index.ts`, `src/features/practice/index.ts`, `src/styles/theme.css`
- Delete: `src/pages/player/ui/BackButton.tsx`

**Interfaces:**
- Consumes: everything of Tasks 14, 24, 25; `usePractice`, `recordPractised`, `MidiButton`.
- Produces: `resolveChoice(piece, search: { key?: string; pattern?: PatternId | 'chart'; rh?: RightFigureId; lh?:
  LeftFigureId; voicing?: Voicing }, melody: boolean): PracticeChoice`; `useHeldKeys(): ReadonlySet<Midi>`;
  `spellPitchClass(performance, chord: number, pc: PitchClass): string`; the `landscape-phone` variant.

- [ ] **Step 1: `resolveChoice`, test first**

```ts
// resolve-choice.test.ts
import { describe, expect, it } from 'vitest'
import { hasMethodCodes, PIECES, pieceById, pieceKey } from '@/entities/piece'
import { note } from '@/shared/lib/music'
import { resolveChoice } from './resolve-choice'

const bz5 = pieceById('bz5')!
const twofive = pieceById('twofive')!

describe('resolveChoice', () => {
  it('plays the piece as written by default', () => {
    expect(resolveChoice(bz5, {}, false)).toEqual({
      tonic: pieceKey(bz5).tonic,
      pattern: hasMethodCodes(bz5) ? 'chart' : bz5.pattern,
      rh: null,
      lh: null,
      voicing: null,
      melody: false,
    })
  })

  it('takes the key, figures and melody the learner chose', () => {
    expect(resolveChoice(bz5, { key: 'A', rh: 't1', lh: 'o' }, true)).toMatchObject({
      tonic: note('A'),
      rh: 't1',
      lh: 'o',
      melody: true,
    })
  })

  it('plays the piece’s own pattern when the chart names no methods', () => {
    const plain = PIECES.find((p) => !hasMethodCodes(p))!
    expect(resolveChoice(plain, { pattern: 'chart' }, false).pattern).toBe(plain.pattern)
  })

  it('lets only a progression that allows it change its voicing', () => {
    expect(resolveChoice(twofive, { voicing: 'ninths' }, false).voicing).toBe(
      twofive.kind === 'progression' && twofive.voicing.choosable ? 'ninths' : null,
    )
    expect(resolveChoice(bz5, { voicing: 'ninths' }, false).voicing).toBeNull()
  })
})
```

(Use guards instead of `!` if lint forbids non-null assertions.) Implement:

```ts
import type { LeftFigureId, PatternId, RightFigureId } from '@/entities/pattern'
import { hasMethodCodes, pieceKey, type Piece, type Voicing } from '@/entities/piece'
import { defaultPattern, type PracticeChoice } from '@/features/practice'
import { parseNoteName } from '@/shared/lib/music'

/** The Player's URL read against its piece: absent choices are the piece's own. */
export function resolveChoice(
  piece: Piece,
  search: {
    readonly key?: string
    readonly pattern?: PatternId | 'chart'
    readonly rh?: RightFigureId
    readonly lh?: LeftFigureId
    readonly voicing?: Voicing
  },
  melody: boolean,
): PracticeChoice {
  const pattern =
    search.pattern === 'chart' && !hasMethodCodes(piece) ? piece.pattern : (search.pattern ?? defaultPattern(piece))
  return {
    tonic: (search.key ? parseNoteName(search.key) : null) ?? pieceKey(piece).tonic,
    pattern,
    rh: search.rh ?? null,
    lh: search.lh ?? null,
    voicing: piece.kind === 'progression' && piece.voicing.choosable ? (search.voicing ?? null) : null,
    melody,
  }
}
```

Run the test. Expected: PASS.

- [ ] **Step 2: `useHeldKeys` and `spellPitchClass`, tests first**

```tsx
// use-held-keys.test.tsx
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { midi } from '@/shared/lib/music'
import { ServicesProvider } from '@/shared/lib/services'
import { useHeldKeys } from './use-held-keys'

describe('useHeldKeys', () => {
  it('follows the keys held on the MIDI keyboard', () => {
    const keyboard = createFakeMidi()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ServicesProvider services={{ audio: createFakeAudio(), midi: keyboard }}>{children}</ServicesProvider>
    )
    const { result } = renderHook(() => useHeldKeys(), { wrapper })
    act(() => keyboard.press(midi(60)))
    expect([...result.current]).toEqual([60])
    act(() => keyboard.release(midi(60)))
    expect(result.current.size).toBe(0)
  })
})
```

```ts
// use-held-keys.ts
import { useEffect, useState } from 'react'
import type { Midi } from '@/shared/lib/music'
import { useServices } from '@/shared/lib/services'

const NONE: ReadonlySet<Midi> = new Set()

/** The keys held down on the MIDI keyboard now. */
export function useHeldKeys(): ReadonlySet<Midi> {
  const { midi } = useServices()
  const [held, setHeld] = useState(NONE)
  useEffect(
    () =>
      midi?.onNote((event) =>
        setHeld((keys) => {
          const next = new Set(keys)
          if (event.on) next.add(event.midi)
          else next.delete(event.midi)
          return next
        }),
      ),
    [midi],
  )
  return held
}
```

Add to `note-names.ts` (with a test in `bar-columns.test.ts` or a new `note-names.test.ts`: the F♯ of a D chord
spells `F#`, a pitch outside the chord spells from the key):

```ts
/** A pitch class named from the chord it belongs to, else from the key: Your turn's "Play D F# A". */
export function spellPitchClass(performance: Performance, chord: number, pc: PitchClass): string {
  const tone = performance.chords[chord]?.tones.find((t) => t.pitchClass === pc)
  return noteName(tone?.note ?? rootSpelling(pc, keyPrefersSharps(performance.key)))
}
```

Export `useHeldKeys` and `spellPitchClass` from their slices. Run the tests. Expected: PASS.

- [ ] **Step 3: The landscape variant**

`src/styles/theme.css`, after the `@custom-variant dark` line:

```css
/* A phone on its side on the music stand: short and wide. */
@custom-variant landscape-phone (@media (orientation: landscape) and (max-height: 500px));
```

- [ ] **Step 4: Write the failing Player tests**

`src/app/screens/player.test.tsx`:

```tsx
import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { FakeAudio } from '@/shared/api/audio'
import type { FakeMidi } from '@/shared/api/midi'
import { renderApp } from '../testing/render-app'

describe('Player', () => {
  it('opens a song with its setup summary and records it as practised', async () => {
    const { progressStore } = renderApp('/play/bz5')
    expect(await screen.findByRole('button', { name: /G · 72 BPM · Both hands/ })).toBeInTheDocument()
    expect(progressStore.getState().practised.bz5).toBeDefined()
    expect(screen.getByRole('button', { name: 'Listen' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('reads a stale URL as the piece’s own setup', async () => {
    renderApp('/play/bz5?key=H&tempo=999&mode=dance')
    expect(await screen.findByRole('button', { name: /G · 72 BPM · Both hands/ })).toBeInTheDocument()
  })

  it('steps through beat by beat, sounding each', async () => {
    const user = userEvent.setup()
    const { router, services } = renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Step' }))
    expect(router.state.location.search).toMatchObject({ mode: 'step' })
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect((services.audio as FakeAudio).played.length).toBeGreaterThan(0)
  })

  it('plays a pass in Listen and stops it', async () => {
    const user = userEvent.setup()
    const { services } = renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect((services.audio as FakeAudio).played).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect((services.audio as FakeAudio).stops).toBeGreaterThan(0)
  })

  it('waits in Your turn, says a wrong key and takes the right ones from MIDI', async () => {
    const user = userEvent.setup()
    const { services } = renderApp('/play/bz5?mode=turn&hands=rh')
    const prompt = await screen.findByText(/^Play /)
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    // A key outside G major's first chord (G B D):
    await user.click(within(keyboard).getAllByRole('button', { name: /^C sharp/ })[0]!)
    expect(await screen.findByText(/^Not C#/)).toBeInTheDocument()
    const notes = prompt.textContent?.replace(/^Play /, '').split(' ') ?? []
    const midi = services.midi as FakeMidi
    act(() => {
      for (const name of notes) {
        const key = within(keyboard).getAllByRole('button', { name: new RegExp(`^${name.replace('#', ' sharp')} ?\\d`) })[0]
        const n = Number(key?.getAttribute('data-midi'))
        midi.press(n as never)
      }
    })
    expect(await screen.findByText('Right')).toBeInTheDocument()
  })

  it('changes the key through the Setup sheet', async () => {
    const user = userEvent.setup()
    const { router } = renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: /G · 72 BPM/ }))
    await user.click(await screen.findByRole('button', { name: 'A' }))
    expect(router.state.location.search).toMatchObject({ key: 'A' })
    expect(await screen.findByRole('button', { name: /A · 72 BPM/ })).toBeInTheDocument()
  })
})
```

(The Your-turn test needs each key's MIDI number: give `PianoKeyboard`'s key buttons `data-midi={midi}` in Task 4's
component — add it now if Task 4 did not — and simplify the lookup to the expected pitch classes: press
`60 + pc` for each name through `parseNoteName` + `pitchClassOf`. Any octave counts.)

Run it. Expected: FAIL.

- [ ] **Step 5: Implement the Player's parts**

`PlayerTopBar.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { ChevronDown, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { entryTitles, type Piece } from '@/entities/piece'
import { MidiButton } from '@/features/connect-midi'
import { useLanguage } from '@/shared/i18n'
import { RoundButton } from '@/shared/ui'

export function PlayerTopBar({
  piece,
  summary,
  onSetup,
}: {
  piece: Piece
  summary: string
  onSetup: () => void
}) {
  const { t } = useTranslation(['player', 'common'])
  const language = useLanguage()
  return (
    <header className="flex items-center gap-3">
      <RoundButton
        label={t('common:close')}
        icon={X}
        render={<Link to="/songs/$pieceId" params={{ pieceId: piece.id }} />}
      />
      <div className="min-w-0 flex-1 text-center">
        <h1 className="truncate text-lg font-bold">{entryTitles(piece, language).primary}</h1>
        <button
          type="button"
          onClick={onSetup}
          className="inline-flex min-h-8 items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          {summary}
          <ChevronDown aria-hidden className="size-4" />
        </button>
      </div>
      <MidiButton />
    </header>
  )
}
```

(Where Web MIDI is missing `MidiButton` renders nothing; keep the title centred with an invisible 44px spacer then.)

`NowPanel.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { spellPitchClass, type PracticeState } from '@/features/practice'
import { TICKS_PER_BEAT, type Performance } from '@/shared/lib/arrangement'
import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui/primitives/button'

export function NowPanel({
  performance,
  state,
  onAgain,
}: {
  performance: Performance
  state: PracticeState
  onAgain: () => void
}) {
  const { t } = useTranslation('player')
  const group = performance.beatGroups[state.beatGroup]
  const chord = group ? performance.chords[group.chord] : undefined
  const next = group ? performance.chords[group.chord + 1] : undefined
  const bar = group ? performance.bars[group.bar] : undefined
  const beat = group && bar ? Math.floor((group.tick - bar.startTick) / TICKS_PER_BEAT) : 0
  const beats = bar ? Math.ceil(bar.beats) : 0
  const feedback =
    state.mode !== 'turn'
      ? null
      : state.outcome === 'finished'
        ? t('finished')
        : state.outcome === 'correct'
          ? t('right')
          : state.outcome === 'wrong' && state.wrong !== null && group
            ? t('notThat', { note: spellPitchClass(performance, group.chord, (state.wrong % 12) as never) })
            : group && state.expected.length > 0
              ? t('playThese', { notes: state.expected.map((pc) => spellPitchClass(performance, group.chord, pc)).join(' ') })
              : null
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-4">
        <p className="text-6xl font-extrabold tracking-tight">{chord?.symbol ?? '–'}</p>
        {next ? (
          <p className="text-right text-sm text-muted-foreground">
            {t('nextChord')}
            <span className="block text-2xl font-bold text-foreground">{next.symbol}</span>
          </p>
        ) : null}
      </div>
      <div aria-hidden className="flex gap-1.5">
        {Array.from({ length: beats }, (_, i) => (
          <span key={i} className={cn('h-1.5 w-6 rounded-full', i <= beat ? 'bg-primary' : 'bg-border')} />
        ))}
      </div>
      {feedback ? (
        <div className="flex items-center gap-3">
          <p aria-live="polite" className={cn('text-lg font-semibold', state.outcome === 'wrong' && 'text-destructive')}>
            {feedback}
          </p>
          {state.outcome === 'finished' ? (
            <Button variant="soft" onClick={onAgain}>
              {t('again')}
            </Button>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
```

(Use `pitchClass(state.wrong)` from the kernel instead of `% 12 as never`.)

`NoteGrid.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { barColumns } from '@/features/practice'
import type { NoteHand, Performance } from '@/shared/lib/arrangement'
import { cn } from '@/shared/lib'

const HAND_TEXT: Readonly<Record<NoteHand, string>> = {
  rh: 'text-hand-rh',
  lh: 'text-hand-lh',
  melody: 'text-hand-melody',
}

/** The current bar's notes by beat and hand; a column jumps there. */
export function NoteGrid({
  performance,
  bar,
  current,
  onJump,
}: {
  performance: Performance
  bar: number
  current: number
  onJump: (beatGroup: number) => void
}) {
  const { t } = useTranslation('player')
  const columns = barColumns(performance, bar)
  const hands = (['melody', 'rh', 'lh'] as const).filter((hand) => columns.some((c) => c.notes[hand].length > 0))
  return (
    <div role="group" aria-label={t('grid.label', { n: bar + 1 })} className="-mx-4 flex overflow-x-auto px-4 [scrollbar-width:none]">
      {columns.map((column) => (
        <button
          key={column.beatGroup}
          type="button"
          aria-current={column.beatGroup === current ? 'step' : undefined}
          onClick={() => onJump(column.beatGroup)}
          className={cn(
            'flex min-w-14 shrink-0 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-sm',
            column.beatGroup === current ? 'bg-muted' : 'hover:bg-muted/60',
          )}
        >
          <span className="text-xs font-semibold text-muted-foreground">{column.beat}</span>
          {hands.map((hand) => (
            <span key={hand} className={cn('flex flex-col items-center font-semibold', HAND_TEXT[hand])}>
              {column.notes[hand].map((n, i) => (
                <span key={i}>
                  {n.label}
                  {n.finger ? <sup className="ml-0.5">{n.finger}</sup> : null}
                </span>
              ))}
            </span>
          ))}
        </button>
      ))}
    </div>
  )
}
```

`Transport.tsx`:

```tsx
import { ChevronLeft, Play, RotateCcw, SkipForward, Square, Volume2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Practice } from '@/features/practice'
import { RoundButton } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

export function Transport({ practice, onHear }: { practice: Practice; onHear: () => void }) {
  const { t } = useTranslation('player')
  const { mode, playing } = practice.state
  return (
    <div className="flex items-center justify-center gap-4 pb-2">
      {mode === 'listen' ? (
        <>
          <RoundButton label={t('restart')} icon={RotateCcw} onClick={practice.restart} />
          <Button size="play" aria-label={playing ? t('stop') : t('play')} onClick={playing ? practice.stop : practice.play}>
            {playing ? <Square aria-hidden /> : <Play aria-hidden />}
          </Button>
          <span aria-hidden className="size-11" />
        </>
      ) : mode === 'step' ? (
        <>
          <RoundButton label={t('back')} icon={ChevronLeft} onClick={practice.prev} />
          <Button size="pill" className="flex-1" onClick={practice.next}>
            {t('next')}
          </Button>
          <RoundButton label={t('nextBar')} icon={SkipForward} onClick={practice.nextBar} />
        </>
      ) : (
        <>
          <RoundButton label={t('restart')} icon={RotateCcw} onClick={practice.restart} />
          <Button size="pill" variant="soft" className="flex-1" onClick={onHear}>
            <Volume2 data-icon="inline-start" />
            {t('hear')}
          </Button>
        </>
      )}
    </div>
  )
}
```

`PlayerPage.tsx`:

```tsx
import { useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { keyName, pieceById, pieceKey, useSectionHeading, type Piece } from '@/entities/piece'
import { useProgressStoreApi } from '@/entities/progress'
import { selectPractice, useSettings } from '@/entities/settings'
import { useHeldKeys } from '@/features/connect-midi'
import { arrangePiece, playerRange, practiceMarks, usePractice } from '@/features/practice'
import { recordPractised } from '@/features/record-practised'
import { audibleHands, beatGroupSounds, chordSounds } from '@/shared/lib/schedule'
import { usePlay } from '@/shared/lib/services'
import { PianoKeyboard, Segmented } from '@/shared/ui'
import { ChordChart } from '@/widgets/chord-chart'
import { PlayerSetup, type SetupChange } from '@/widgets/player-setup'
import { resolveChoice } from '../model/resolve-choice'
import { NoteGrid } from './NoteGrid'
import { NowPanel } from './NowPanel'
import { PlayerTopBar } from './PlayerTopBar'
import { Transport } from './Transport'

function Player({ piece }: { piece: Piece }) {
  const { t } = useTranslation(['player', 'common'])
  const search = useSearch({ from: '/full-screen/play/$pieceId' })
  const navigate = useNavigate({ from: '/play/$pieceId' })
  const toggles = useSettings(selectPractice)
  const progress = useProgressStoreApi()
  const heading = useSectionHeading()
  const held = useHeldKeys()
  const play = usePlay()
  const [setupOpen, setSetupOpen] = useState(false)
  const set = (change: SetupChange | { mode: typeof search.mode }) =>
    void navigate({ search: (prev) => ({ ...prev, ...change }), replace: true })

  const { key, pattern, rh, lh, voicing } = search
  const choice = useMemo(
    () => resolveChoice(piece, { key, pattern, rh, lh, voicing }, toggles.melody),
    [piece, key, pattern, rh, lh, voicing, toggles.melody],
  )
  const performance = useMemo(() => arrangePiece(piece, choice), [piece, choice])
  const range = useMemo(() => playerRange(performance), [performance])
  const tempo = search.tempo ?? piece.tempo
  const practice = usePractice(performance, {
    mode: search.mode,
    hands: search.hands,
    tempo,
    metronome: toggles.metronome,
    countIn: toggles.countIn,
  })
  useEffect(() => recordPractised(progress, piece.id, new Date()), [progress, piece.id])

  const { state } = practice
  const group = performance.beatGroups[state.beatGroup]
  const marks = practiceMarks(performance, state.beatGroup, {
    fingers: toggles.fingerNumbers,
    ...(state.mode === 'turn' ? { received: state.received } : {}),
  })
  const headings = piece.kind === 'progression' ? [t('piece:progression')] : piece.sections.map(heading)
  const summary = t('player:summary', {
    key: keyName({ tonic: choice.tonic, mode: pieceKey(piece).mode }),
    tempo,
    hands: t(`common:hands.${search.hands}`),
  })

  return (
    <div className="flex flex-1 flex-col gap-4 pt-2 landscape-phone:gap-2">
      <PlayerTopBar piece={piece} summary={summary} onSetup={() => setSetupOpen(true)} />
      <Segmented
        label={t('player:modes.label')}
        value={search.mode}
        options={(['listen', 'step', 'turn'] as const).map((m) => ({ value: m, label: t(`player:modes.${m}`) }))}
        onChange={(mode) => set({ mode })}
      />
      <ChordChart
        performance={performance}
        headings={headings}
        meter={piece.meter}
        layout="strip"
        current={group?.bar ?? 0}
        onBar={practice.jumpToBar}
      />
      <NowPanel performance={performance} state={state} onAgain={practice.restart} />
      <NoteGrid performance={performance} bar={group?.bar ?? 0} current={state.beatGroup} onJump={practice.jumpToBeatGroup} />
      <PianoKeyboard
        label={t('common:keyboard')}
        from={range.from}
        to={range.to}
        marks={marks}
        pressed={held}
        wrong={state.wrong === null ? undefined : new Set([state.wrong])}
        minWhiteWidth={28}
        centre={[...marks.keys()][0] ?? null}
        onKeyPress={state.mode === 'turn' ? practice.press : (k) => play(chordSounds([k], { arpeggio: false }))}
        className="mt-auto h-48 landscape-phone:h-36"
      />
      <Transport
        practice={practice}
        onHear={() => play(beatGroupSounds(performance, state.beatGroup, { tempo, hands: audibleHands('both') }))}
      />
      <PlayerSetup
        open={setupOpen}
        onOpenChange={setSetupOpen}
        piece={piece}
        choice={choice}
        tempo={tempo}
        hands={search.hands}
        onChange={set}
      />
    </div>
  )
}

export function PlayerPage() {
  const { pieceId } = useParams({ from: '/full-screen/play/$pieceId' })
  const piece = pieceById(pieceId)
  return piece ? <Player key={piece.id} piece={piece} /> : null
}
```

Check `keyName` is exported by the music kernel (it is: `keyName(key)`); import it from `@/shared/lib/music`, not
the piece entity. A landscape phone lays the parts out in two rows: give the container
`landscape-phone:grid landscape-phone:grid-cols-[1fr_1fr]` with the chart strip and keyboard spanning both columns,
the now panel and transport in the left column and the note grid in the right (adjust in the visual finish, Task 29).

Delete `BackButton.tsx`. Run the Player tests. Expected: PASS.

- [ ] **Step 6: Verify and commit**

Run: `npm run typecheck && npm run lint && npm run test && npm run build`

```bash
npx prettier --write src/pages/player src/features/connect-midi src/features/practice src/styles/theme.css src/app/screens
git add -A src/pages/player src/features src/styles src/app/screens
git commit -m "Build the Player: modes, the chart strip, the now panel, the note grid, the keyboard and transport

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 27: Settings

**Files:**
- Modify: `src/pages/settings/ui/SettingsPage.tsx`, `SettingsPage.test.tsx`, `src/app/router.test.tsx`,
  `src/shared/i18n/locales/{en,ru}/settings.ts`
- Delete: `src/pages/settings/ui/ChoiceGroup.tsx`

**Interfaces:**
- Consumes: `setLocale`, `setTheme`, `resetProgress`, `MidiControl`, `Segmented`, `AlertDialog*`.

- [ ] **Step 1: Strings** — `settings` gains en `midi: 'MIDI keyboard'`, `progress: { label: 'Progress', reset:
  'Reset progress', title: 'Reset progress?', body: 'Learned steps, practised songs and quiz answers on this device
  will be cleared.', cancel: 'Cancel', confirm: 'Reset' }`; ru `midi: 'MIDI-клавиатура'`, `progress: { label:
  'Прогресс', reset: 'Сбросить прогресс', title: 'Сбросить прогресс?', body: 'Выученные шаги, открытые песни и ответы
  теста на этом устройстве будут удалены.', cancel: 'Отмена', confirm: 'Сбросить' }`.

- [ ] **Step 2: Update the tests first**

In `SettingsPage.test.tsx` and `router.test.tsx`, language and theme are segmented buttons now:
`getByRole('button', { name: 'Русский' })` with `aria-pressed`. Add:

```tsx
  it('resets progress only after confirming', async () => {
    const user = userEvent.setup()
    const { progressStore } = renderApp('/settings')
    act(() => progressStore.setState({ learned: { 'chords:tri': '2026-09-25T10:00:00Z' } }))
    await user.click(await screen.findByRole('button', { name: 'Reset progress' }))
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(progressStore.getState().learned['chords:tri']).toBeDefined()
    await user.click(screen.getByRole('button', { name: 'Reset progress' }))
    await user.click(await screen.findByRole('button', { name: 'Reset' }))
    expect(progressStore.getState().learned).toEqual({})
  })
```

(put it in `src/app/screens/settings.test.tsx` with `renderApp`). Run: expected FAIL.

- [ ] **Step 3: Implement**

```tsx
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useProgressStoreApi } from '@/entities/progress'
import {
  LOCALES,
  selectLocale,
  selectTheme,
  THEMES,
  useSettings,
  useSettingsStoreApi,
  type Locale,
  type Theme,
} from '@/entities/settings'
import { MidiControl } from '@/features/connect-midi'
import { resetProgress } from '@/features/reset-progress'
import { setLocale, setTheme } from '@/features/set-preference'
import { RoundButton, ScreenHeader, Segmented } from '@/shared/ui'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/primitives/alert-dialog'
import { Button } from '@/shared/ui/primitives/button'

const LOCALE_LABEL = { en: 'language.en', ru: 'language.ru' } as const satisfies Record<Locale, string>
const THEME_LABEL = { system: 'theme.system', light: 'theme.light', dark: 'theme.dark' } as const satisfies Record<
  Theme,
  string
>

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-muted-foreground">{title}</h2>
      {children}
    </section>
  )
}

export function SettingsPage() {
  const { t } = useTranslation(['settings', 'common'])
  const settings = useSettingsStoreApi()
  const progress = useProgressStoreApi()
  const locale = useSettings(selectLocale)
  const theme = useSettings(selectTheme)
  return (
    <div className="flex flex-col gap-8">
      <ScreenHeader
        title={t('settings:title')}
        back={<RoundButton label={t('common:back')} icon={ArrowLeft} render={<Link to="/" />} />}
      />
      <Group title={t('settings:language.label')}>
        <Segmented
          label={t('settings:language.label')}
          value={locale}
          options={LOCALES.map((value) => ({ value, label: t(`settings:${LOCALE_LABEL[value]}`) }))}
          onChange={(value) => setLocale(settings, value)}
        />
      </Group>
      <Group title={t('settings:theme.label')}>
        <Segmented
          label={t('settings:theme.label')}
          value={theme}
          options={THEMES.map((value) => ({ value, label: t(`settings:${THEME_LABEL[value]}`) }))}
          onChange={(value) => setTheme(settings, value)}
        />
      </Group>
      <Group title={t('settings:midi')}>
        <MidiControl />
      </Group>
      <Group title={t('settings:progress.label')}>
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="destructive" className="self-start" />}>
            {t('settings:progress.reset')}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('settings:progress.title')}</AlertDialogTitle>
              <AlertDialogDescription>{t('settings:progress.body')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('settings:progress.cancel')}</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={() => resetProgress(progress)}>
                {t('settings:progress.confirm')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Group>
    </div>
  )
}
```

(Check `resetProgress`'s signature in `src/features/reset-progress/reset-progress.ts` and the registry's
`AlertDialogAction` props — if it has no `variant`, pass `render={<Button variant="destructive" />}`.) Delete
`ChoiceGroup.tsx`. Run the tests. Expected: PASS.

- [ ] **Step 4: Verify and commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
npx prettier --write src/pages/settings src/app src/shared/i18n/locales
git add -A src/pages/settings src/app src/shared
git commit -m "Restyle Settings with segmented choices, MIDI and a confirmed reset

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 28: Documentation

**Files:**
- Modify: `CLAUDE.md`, `docs/CODE_STYLE.md`, `docs/UBIQUITOUS_LANGUAGE.md`, `README.md`,
  `docs/superpowers/specs/2026-09-24-piano-trainer-rewrite-design.md` (status line)
- Create: `docs/adr/0007-visual-world-from-reference-apps.md`

- [ ] **Step 1: CLAUDE.md** — in Architecture: `shared/ui` lists the kit (`PianoKeyboard`, `ScreenHeader`,
  `RoundButton`, `Segmented`, `ChipRow`, `Sheet`, `RoleLegend`, `RatingMark`, `LevelMark`); `app/routes/search.ts`
  holds every route's `validateSearch` (pages may not be imported by the router); screen tests live in
  `src/app/screens/` and run the app through `renderApp`; widgets list gains `continue-card path-levels piece-list
  chord-chart piece-skills player-setup chord-explorer scale-explorer step-panel quiz-board quiz-choice`; features
  gain `connect-midi`; the `/check` route. Keep it concise, in its own voice.

- [ ] **Step 2: CODE_STYLE.md** — §5: the new roles (`attention` for gaps only, `hand-*` for the Player only, `key-*`,
  `glass`), the palette law, the type scale on Tailwind's own names, `ease-out` as the one curve, `landscape-phone`;
  §1: the kit; §9: screen tests in `src/app/screens`.

- [ ] **Step 3: Glossary** — add **Check** (a bounded quiz over one scope: a song's chords, a chord family, a scale;
  avoid "test", "exam"), **Continue** (the suggested next step), **Setup sheet**; make sure every UI word used in the
  new strings maps to a glossary term.

- [ ] **Step 4: ADR 0007** — context (the owner's references), decision (the sage world, Onest, the kit, the
  references' patterns adopted and refused), consequences (tokens changed wholesale; DESIGN.md records the system).

- [ ] **Step 5: The master spec's status** — add "Amended 2026-09-25 by the Phase 3 screens design
  (`2026-09-25-phase-3-screens-design.md`), which lists its refinements in §11."

- [ ] **Step 6: Commit**

```bash
npx prettier --write CLAUDE.md README.md docs/CODE_STYLE.md docs/UBIQUITOUS_LANGUAGE.md docs/adr/0007-visual-world-from-reference-apps.md
git add CLAUDE.md README.md docs
git commit -m "Document the screens, the kit, the visual world and where screen tests live

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 29: The visual finish

**Files:** whatever the review rounds change; `DESIGN.md` (+ its sidecar) by the documenter;
`.impeccable/review/*.png` (not committed).

- [ ] **Step 1: Screenshot round 1** — `npm run build && npm run preview -- --port 4173`, then with headless Chrome
  capture every screen at 390×844 (phone) and 1440×900 (desktop), light and dark (set `pt-settings` through a tiny
  capture page or `localStorage` injection before load): `/`, `/songs`, `/songs/bz5`, `/play/bz5`, `/play/bz5?mode=turn`,
  the Setup sheet open, `/theory/chords?root=G&quality=d7`, `/theory/scales?root=Eb&kind=harmonic`,
  `/theory/symbols`, `/theory/quiz`, `/check?of=piece:bz5`, `/settings`, a not-found page. Also the Player at
  844×390 (landscape phone). Open each image and confirm it shows what its name says.

- [ ] **Step 2: Fix everything round 1 shows, in one batch** — against the direction contract
  (`.impeccable/surfaces/src-app.md`), the comp (`.impeccable/mocks/decision/sage.png`) and the craft floor: overflow of
  long Russian titles, spacing rhythm, contrast in both themes, focus rings, the keyboard's proportions, the landscape
  Player. Run `node .claude/skills/impeccable/scripts/detect.mjs --json` over `src/` and fix what is mechanical.

- [ ] **Step 3: Screenshot round 2** — the same set; confirm the fixes; stop polishing.

- [ ] **Step 4: Finish review** — spawn the shipped `impeccable-finish-reviewer` with the original request, the
  owner's references (PRODUCT.md), the direction contract, the screenshot paths, the comp as the critique reference
  (code-led build), the detector findings and `.claude/skills/impeccable/reference/craft-floor.md`. Act on its
  disposition (fix → one batch, recapture, verdict pass; ship → continue).

- [ ] **Step 5: Documenter** — spawn the shipped `impeccable-documenter` with the project root, the artifact
  (`src/`), the direction contract, PRODUCT.md, `.claude/skills/impeccable/reference/document.md`; it writes
  `DESIGN.md` from the built world.

- [ ] **Step 6: Final verification and commit**

Run: `npm run typecheck && npm run lint && npm run test:cov && npm run build`
Expected: all green; coverage ≥ 90% lines on `src/shared/lib/**` and `src/entities/*/model/**`.

```bash
git add -A src DESIGN.md .impeccable/surfaces
git commit -m "Finish the screens against the direction and record the design system

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Update the progress log's last line, and the Phase 3 spec's status to "built".
