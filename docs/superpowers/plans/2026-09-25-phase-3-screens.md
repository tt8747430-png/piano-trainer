# Phase 3 — Screens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every screen of Piano Trainer built in the owner's reference world (Clefs, Flowkey's player): the design
system, Path, Songs, Piece, the Player with its Setup sheet, Theory (Chords, Scales, Symbols, Quiz), the Check, and
Settings, rendering what Phase 2 built.

**Architecture:** Tokens and fonts first, then the shadcn primitives and an app-wide kit in `shared/ui` (the
`PianoKeyboard` above all). Pure logic the screens need (search params, keyboard geometry, placed chords and scales,
scale runs, the Continue rule, the arrangement choice, check scopes) lands in `shared/lib`, `entities/*/model` and the
features with tests first. Screens are thin pages composing widgets. Every route's `validateSearch` lives in
`app/routes/search.ts`: the router may not import a page or widget, or its code would leave its lazy chunk (a build
proved it). Each schema is typed against the view type its lowest consumer owns (a widget's `ChordView`, a page
model's `SongsFilter`), which `search.ts` imports with `import type`, so the types never join the main chunk.

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
  `bg-hand-rh`); no raw colours, no primitives, no arbitrary values (`p-[13px]`, `h-[62%]`), no `dark:` in app code.
  Sizes come from the spacing scale, radii from the theme's scale (`rounded-xs` … `rounded-4xl`), and anything else
  from a named utility in `theme.css` (`pt-safe`, `scrollbar-none`). A value computed at run time (a key's place on
  the keyboard) is an inline `style`, never a class.
- **Palette law:** role colours only on chord tones (keys, legend, chord-chip edges); hand colours only in the Player.
- **Interactive elements** (CODE_STYLE §5): hover, a `focus-visible` ring, a transition, and a disabled look;
  targets at least 44px (`min-h-11`, `size-11`), text links included. A text link is the kit's
  `<Button variant="link" render={<Link … />} nativeButton={false}>`, which already has all of that. A raw `<button>`
  (a key, a bar, a row in a sheet) spells all four out.
- shadcn primitives are added with `npx shadcn@latest add`, then edited only to meet this plan (44px targets, variants,
  no `"use client"` lines).
- Every UI string in `en` **and** `ru` (`src/shared/i18n/locales/{en,ru}/<namespace>.ts`); a Russian module is typed
  `LocaleResources['<namespace>']`, as the existing ones are. Note and chord names are the same in both (B, `#`, `♭`).
- Search params: `app/routes/search.ts` holds each route's `validateSearch(input: Partial<S> & SearchSchemaInput): S`
  and its defaults. It returns the default for anything invalid, and `S` is imported with `import type` from the slice
  that owns the view. `search: { middlewares: [stripSearchParams(DEFAULTS)] }`. Control changes navigate with
  `replace: true`. The Player writes a choice equal to the piece's own as absent, so its URL carries only what differs.
- Selectors return stable values; lists subscribe to one slice (`selectAllAnswers`) and derive in render.
- Tests colocated, `globals: false`, by role and name, fakes not module mocks (CODE_STYLE §9). Test first. A screen's
  test sits beside its page (`pages/<x>/ui/<X>Page.test.tsx`) and runs the whole app through `renderApp` from
  `@/app/testing/render-app`. The layer rules skip test files (`boundaries/ignore` covers `*.test.*`), as
  `SettingsPage.test.tsx` already shows. A component under the settings store is tested with `renderWithSettings`.
- No `eslint-disable` comments, no `!` non-null assertions, no `as` casts in app code. The code blocks below are the
  code to write. Where a detail depends on what a CLI produces, the step says what to check and what to do either way.
- Prettier on touched files only: `npx prettier --write <files>`. Never `npm run format`.
- Verify before each commit: `npm run typecheck && npm run lint && npm run test`; after touching startup, routing, the
  PWA or config also `npm run build`.
- Commit messages: imperative sentence, optional body, then `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Keep a progress log at `.superpowers/sdd/2026-09-25-phase-3-screens/progress.md`: one line per finished task, and a
  "Ruling:" line for any deviation from this plan (what, why, cost if wrong), as Phase 2 did.

## Review Focus

1. **Stale or hand-edited URLs** (`/play/bz5?key=H&tempo=999&mode=x&pattern=r5`, `/theory/chords?inversion=7`,
   `/theory/chords?quality=maj&inversion=3`) → every invalid param falls back to its default (no clamping), a melody
   pattern on a piece without a melody still plays (`r4`), nothing throws. Pinned by: Task 7 (the validator helpers),
   Task 16 (every route's validator), Task 14 (`arrangePiece`), Task 26 (the Player's search).
2. **Saved progress naming a piece a later version removed** (`practised: { gone: … }`, `learned: { 'piece:gone': … }`)
   → Continue and My gaps skip it; counts ignore it. Pinned by: Task 10 (`selectSuggestedStep`), Task 15 (`myGaps`).
3. **Quick repeated taps** on chords, bars and explorer chips → the previous sound stops before the next plays; no
   pile-up. Pinned by: Task 9 (`usePlay`, `usePlayChord`).
4. **Switching language on an open screen** → titles, section headings, chord names and credits switch at once.
   Pinned by: Task 11 (`entryTitles`, `useSectionHeading`), Task 24 (the Piece in Russian).
5. **A chord wider than the default keyboard** (Name chord on B13, a B♭ root in the explorer) → the keyboard range grows
   to hold every tone. Pinned by: Task 4 (`keyboardRange`), Task 15 (`quizKeyboardRange`).
6. **MIDI that changes under the learner** (unplugged during Your turn, permission denied) → the status line follows,
   taps on the screen keep working. Pinned by: Task 13, Task 26.
7. **Choosing the piece's own key, tempo or pattern in the Setup sheet** → the param leaves the URL instead of being
   written (`/play/bz5`, not `/play/bz5?key=G`). Pinned by: Task 26 (`searchPatch`).

---

## File map

```
package.json                                   modify — fonts (Task 1), shadcn deps (Task 2)
public/favicon.svg public/*.png                modify — the sage icon (Task 1)
src/styles/index.css tokens.css theme.css      font imports / rewrite / modify, the landscape-phone variant (Task 1)
src/shared/config/theme-colors.ts (+test)      modify (Task 1)

src/shared/ui/primitives/                      toggle toggle-group switch slider popover drawer input alert-dialog
                                               separator progress item empty spinner; button variants (Task 2)
src/shared/ui/                                 ScreenHeader RoundButton Segmented ChipRow option RoleLegend RatingMark
                                               LevelMark Sheet role-classes (Task 3); piano-keyboard/ (Task 4)
src/shared/lib/music/keyboard.ts               isBlackKey MIDDLE_C keyboardRange (Task 4)
src/shared/lib/keyboard-layout.ts              keyboardLayout: the keys' geometry (Task 4)
src/app/                                       AppShell FullScreenLayout TheoryLayout RouteError RoutePending
                                               UpdateBanner (Task 5); routes/search.ts + router (Task 16, 18)
src/widgets/app-nav theory-nav                 restyle (Task 5)
src/pages/not-found                            restyle (Task 5)

src/shared/lib/music/place.ts scale.ts note.ts placeChord placeScale lastInversion; scaleGaps relativeScale;
                                               noteParam noteFromParam (Task 6)
src/shared/lib/search-params.ts fold-text.ts   valueOr wholeIn readNote; foldText matchesQuery (Task 7)
src/shared/lib/schedule/sounds.ts              barSounds chordSounds scaleRun PRACTICE_RHYTHMS (Task 8)
src/shared/lib/services/use-play.ts            usePlay usePlayChord (Task 9)
src/entities/progress/model/                   selectSuggestedStep selectAllAnswers ratingOf skillsToCheck knownCount
                                               (Task 10)
src/shared/i18n/locale.ts use-locale.ts        LOCALES Locale (moved from entities/settings) useLocale (Task 11)
src/entities/piece/model/titles.ts ui/         entryTitles; Credits SourceLine useSectionHeading (Task 11);
                                               barLength (Task 24)
src/features/mark-learned/ui/LearnedToggle     (Task 12)
src/shared/api/midi current()                  (Task 13)
src/features/connect-midi/                     useMidiConnection MidiControl MidiButton (Task 13); useHeldKeys (Task 26)
src/features/practice/                         choice arrange-piece ownChoice note-names bar-columns marks (Task 14)
src/features/quiz/                             check-plan my-gaps quiz-keys theory-quizzes use-quiz (Task 15)
src/entities/path/ui/                          use-step-title explorer-link (Task 16)
view types owned by their slices               widgets/chord-explorer/model/chord-view.ts,
                                               widgets/scale-explorer/model/scale-view.ts,
                                               widgets/player-setup/model/setup-params.ts,
                                               pages/songs/model/songs-filter.ts,
                                               pages/player/model/player-search.ts (Task 16)

src/widgets/quiz-board quiz-choice             (Task 17)   src/pages/theory-quiz
src/pages/check                                (Task 18)
src/widgets/chord-explorer step-panel          (Task 19)   src/pages/theory-chords
src/widgets/scale-explorer                     (Task 20)   src/pages/theory-scales
src/pages/theory-symbols                       (Task 21)
src/widgets/continue-card path-levels          (Task 22)   src/pages/path
src/widgets/piece-list                         (Task 23)   src/pages/songs (+ model/songs-view.ts)
src/widgets/chord-chart piece-skills           (Task 24)   src/pages/piece
src/widgets/player-setup                       (Task 25)
src/pages/player (+ model/player-search.ts turn-feedback.ts use-player.ts)   (Task 26)
src/pages/settings                             (Task 27)
src/pages/<x>/ui/<X>Page.test.tsx              each screen's test, beside its page (Tasks 17–27)
CLAUDE.md docs/CODE_STYLE.md docs/UBIQUITOUS_LANGUAGE.md README.md docs/adr/0007-…   (Task 28)
DESIGN.md                                      (Task 29, by the impeccable documenter)
```

---

### Task 1: Tokens, fonts and the sage icon

**Files:**
- Modify: `package.json` (install), `src/styles/index.css`, `src/styles/tokens.css` (rewrite), `src/styles/theme.css`,
  `src/shared/config/theme-colors.ts`, `public/favicon.svg`, regenerated `public/*.png`
- Test: `src/shared/config/theme-colors.test.ts` (existing, must stay green), `src/shared/lib/cn.test.ts`

**Interfaces:**
- Produces: utilities `bg-attention text-attention bg-thumb bg-hand-rh bg-hand-lh bg-hand-melody text-hand-*
  bg-key-white border-key-white-edge bg-key-black bg-key-pressed`, the retuned `role-*`, `font-sans` = Onest,
  `ease-out` = the one curve, the radius scale `rounded-xs` (6px) `sm` (9) `md` (12) `lg` (14) `xl` (16) `2xl` (18)
  `3xl` (26) `4xl` (28), utilities `pt-safe pb-safe bottom-safe scrollbar-none`, the variant `landscape-phone:`.

- [ ] **Step 1: Install the fonts**

```bash
npm install @fontsource-variable/onest @fontsource/noto-music
```

- [ ] **Step 2: Check that nothing uses `--success` or `--accent` beyond shadcn**

Run: `grep -rn "success\|accent" src --include=*.tsx --include=*.ts --include=*.css | grep -v "accent-foreground\|primitives"`
Expected: only `tokens.css`/`theme.css` definitions and `src/pages/settings/ui/ChoiceGroup.tsx` (`accent-primary`,
`hover:bg-accent`; the file is deleted in Task 27). `--success` goes; `--accent` stays (shadcn primitives hover with it).

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
  /* A slider's thumb: white by day, near-white by night, on the muted track in both. */
  --thumb: var(--p-white);

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
  --thumb: var(--p-mist-100);

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
  --color-thumb: var(--thumb);

  --color-hand-rh: var(--hand-rh);
  --color-hand-lh: var(--hand-lh);
  --color-hand-melody: var(--hand-melody);

  --color-key-white: var(--key-white);
  --color-key-white-edge: var(--key-white-edge);
  --color-key-black: var(--key-black);
  --color-key-pressed: var(--key-pressed);

  --font-sans: 'Onest Variable', 'Noto Music', system-ui, sans-serif;
```

Replace the four `--radius-*` lines with the spec's radii (§2.3) on Tailwind's own names, so `cn()` needs no
registration:

```css
  /* Black keys 6 · white keys 9 · primitives 12–16 · buttons 18 · cards 26 · sheets 28. */
  --radius-xs: calc(var(--radius) - 10px);
  --radius-sm: calc(var(--radius) - 7px);
  --radius-md: calc(var(--radius) - 4px);
  --radius-lg: calc(var(--radius) - 2px);
  --radius-xl: var(--radius);
  --radius-2xl: calc(var(--radius) + 2px);
  --radius-3xl: calc(var(--radius) + 10px);
  --radius-4xl: calc(var(--radius) + 12px);
```

After the `@custom-variant dark` line add the one variant the screens need beyond Tailwind's:

```css
/* A phone on its side on the music stand: short and wide (the Player's two-column layout). */
@custom-variant landscape-phone (@media (orientation: landscape) and (max-height: 500px));
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

/* A row that scrolls sideways past the screen's edge, without a scrollbar in the way. */
@utility scrollbar-none {
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
```

- [ ] **Step 5: Import the fonts in `src/styles/index.css`**

The styles' entry holds every stylesheet, fonts included. Right after `@import 'tailwindcss' source(none);` add:

```css
@import '@fontsource-variable/onest/wght.css';
@import '@fontsource/noto-music/music-400.css';
```

Tailwind's Vite plugin inlines the package CSS and rebases its `url()`s, so Vite emits the woff2 files (Step 8
checks the build lists them).

- [ ] **Step 6: Point `THEME_COLORS` at the new background and run its test red → green**

Run: `npx vitest run src/shared/config/theme-colors.test.ts`
Expected: FAIL (`#eef1f5` ≠ `#f3f6f3`). Then set:

```ts
export const THEME_COLORS = { light: '#f3f6f3', dark: '#0d1210' } as const
```

Run again. Expected: PASS. Nothing else carries the old colour: `vite.config.ts` writes the `theme-color` meta
tags and the manifest's colours from `THEME_COLORS`, and `index.html` has none of its own.

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
npx prettier --write src/styles src/shared/config/theme-colors.ts
git add -A package.json package-lock.json public src/styles src/shared/config
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
  `Slider` generic over its value (one number, one thumb) with a 24px thumb; the rest as the registry ships them
  (`Drawer*` with `showSwipeHandle`, `Popover*`, `AlertDialog*`, `Item*`, `Empty*`, `Progress`, `Input`, `Separator`,
  `Spinner`).

- [ ] **Step 1: Add the primitives**

```bash
npx shadcn@latest add toggle toggle-group switch slider popover drawer input alert-dialog separator progress item empty spinner
```

Expected: the files land in `src/shared/ui/primitives/`; imports use `cn` and `@/shared/ui/primitives/...`.

- [ ] **Step 2: Review what landed**

Read every added file. Remove each `"use client"` line (a Vite SPA has no server components). Check each `Button`
use inside them names only sizes this project has (`default lg icon icon-lg pill`); replace `size="sm"` with
`size="default"`. Replace any icon library other than lucide. Then read `git diff src/styles package.json`: keep
what the primitives need to animate (an import such as `tw-animate-css`), and remove any colour variables or `@theme`
entries the CLI wrote, because `tokens.css` and `theme.css` own every colour.

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
        soft: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary/80',
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
        default: 'rounded-xl bg-transparent hover:bg-muted data-pressed:bg-muted',
        outline: 'rounded-xl border border-input bg-transparent hover:bg-muted',
        // A choice in a scrolling row: roots, families, keys.
        chip: 'rounded-full bg-card px-4 text-foreground ring-1 ring-border hover:bg-muted data-pressed:bg-primary data-pressed:text-primary-foreground data-pressed:ring-primary',
        // A segment of a pill segmented control.
        segment:
          'flex-1 rounded-xl px-3 text-muted-foreground hover:text-foreground data-pressed:bg-card data-pressed:text-foreground data-pressed:shadow-sm',
      },
      size: {
        default: 'h-11 min-w-11 px-3',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)
```

(Base UI 1.8 marks a pressed toggle with `data-pressed` and sets `aria-pressed`; Tailwind v4 reads `data-pressed:` as
the attribute's presence.)

- [ ] **Step 6: Size the switch and slider for fingers**

`switch.tsx`: replace the registry's arbitrary sizes (`data-[size=default]:h-[18.4px] data-[size=default]:w-[32px]`,
the `sm` pair and the `translate-x-[calc(…)]` pair) with `h-8 w-13`, a thumb of `size-7` and a checked
`translate-x-5`; drop the `sm` size; keep the thumb's token colours and the `after:-inset-*` hit area.

`slider.tsx`: the registry draws one thumb per value, but falls back to a range's two thumbs (`[min, max]`) when
`value` is a single number. The screens set one tempo, so make the slider generic over its value and give a single
number one thumb:

```tsx
function Slider<Value extends number | readonly number[]>({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderPrimitive.Root.Props<Value>) {
  const values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [value ?? defaultValue ?? min]
```

and render `values.length` thumbs. Track `data-horizontal:h-1.5`; thumb
`size-6 border-0 bg-thumb shadow-md ring-1 ring-border` with `after:-inset-2.5` (a 44px hit area). A caller then
writes `value={tempo}` and `onValueChange={(tempo) => …}` with `tempo: number`.

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
  `src/shared/ui/option.ts`, `src/shared/ui/role-classes.ts`, `src/shared/ui/kit.test.tsx`
- Modify: `src/shared/ui/index.ts`; `src/shared/i18n/locales/{en,ru}/common.ts`; every `ScreenTitle` /
  `SectionTitle` user (Path, Settings, Player, Theory layout, RouteError, NotFound) — switch to `ScreenHeader`;
  delete `ScreenTitle.tsx` and `SectionTitle.tsx`

**Interfaces:**
- Consumes: `Button`, `buttonVariants` (Task 2), `ToggleGroup`, `ToggleGroupItem`, `Drawer`, `DrawerContent`,
  `DrawerHeader`, `DrawerTitle`, `DrawerFooter`.
- Produces:
  - `ScreenHeader({ title, back?, actions? }: { title: ReactNode; back?: ReactNode; actions?: ReactNode })` — renders
    the `h1`.
  - `RoundButton({ label, icon, render?, ...ButtonProps })` — `aria-label={label}`; `render` makes it a link.
  - `OptionValue = string | number`; `Option<V extends OptionValue> = { value: V; label: string; title?: string }`
    (`title`: an accessible name other than the visible label).
  - `Segmented<V extends OptionValue>({ label, value, options, onChange }: { label: string; value: V; options: readonly
    Option<V>[]; onChange: (value: V) => void })` — numbers go in and come out as numbers; the kit alone turns them
    into the toggles' strings.
  - `ChipRow<V extends OptionValue>({ label, value, options, onChange })` — the same props.
  - `ROLE_BG: Record<ChordRole, string>` (complete class strings, for the keys, the legend and the tone chips).
  - `RoleLegend({ roles }: { roles: readonly ChordRole[] })`
  - `RatingMark({ rating }: { rating: 'known' | 'gap' | 'unknown' })`
  - `LevelMark({ level }: { level: 1 | 2 | 3 | 4 })`
  - `Sheet(props: DrawerProps)` — the app's bottom sheet: a `Drawer` that always shows its swipe handle.
    `SheetContent({ title, children, footer? })` — the sheet's panel: centred, 28px top corners, a title, a body that
    scrolls, an optional footer. Triggers and close buttons are the primitives' `DrawerTrigger` / `DrawerClose`.

- [ ] **Step 1: Add the common strings**

`src/shared/i18n/locales/en/common.ts` gains (keep the existing keys):

```ts
  close: 'Close',
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
  // A piano key's name: its note and octave.
  note: { natural: '{{letter}}{{octave}}', sharp: '{{letter}} sharp {{octave}}' },
  keyboard: 'Keyboard',
```

`ru/common.ts`:

```ts
  close: 'Закрыть',
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
  note: { natural: '{{letter}}{{octave}}', sharp: '{{letter}}-диез {{octave}}' },
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

  it('hands a number back as a number', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const inversions = [
      { value: 0, label: 'Root' },
      { value: 1, label: '1st' },
    ]
    render(<Segmented label="Inversion" value={0} options={inversions} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: '1st' }))
    expect(onChange).toHaveBeenCalledWith(1)
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

`src/shared/ui/option.ts` — what a segmented control and a chip row share:

```ts
/** A choice's value: an id, a note, or a number such as an inversion or a level. */
export type OptionValue = string | number

export interface Option<V extends OptionValue> {
  readonly value: V
  readonly label: string
  /** The accessible name, when the label alone is not enough (`7` → "Dominant 7th"). */
  readonly title?: string
}

/** A toggle's value is a string; this is the one place an option's value becomes one. */
export const toggleValue = (value: OptionValue): string => String(value)

/**
 * The option a toggle group's change picked: the one newly pressed. Pressing the chosen toggle
 * again picks nothing, so one option stays chosen.
 */
export const pickedOption = <V extends OptionValue>(
  options: readonly Option<V>[],
  current: V,
  pressed: readonly string[],
): Option<V> | undefined =>
  options.find((option) => option.value !== current && pressed.includes(toggleValue(option.value)))
```

`src/shared/ui/Segmented.tsx`:

```tsx
import { pickedOption, toggleValue, type Option, type OptionValue } from './option'
import { ToggleGroup, ToggleGroupItem } from './primitives/toggle-group'

/** One choice of a few, always one chosen: a pill segmented control. */
export function Segmented<V extends OptionValue>({
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
      value={[toggleValue(value)]}
      onValueChange={(pressed) => {
        const picked = pickedOption(options, value, pressed)
        if (picked) onChange(picked.value)
      }}
      variant="segment"
      spacing={0}
      className="flex w-full gap-1 rounded-2xl bg-muted p-1"
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={toggleValue(option.value)}
          value={toggleValue(option.value)}
          aria-label={option.title}
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
```

`src/shared/ui/ChipRow.tsx`:

```tsx
import { pickedOption, toggleValue, type Option, type OptionValue } from './option'
import { ToggleGroup, ToggleGroupItem } from './primitives/toggle-group'

/** One choice of many in a row that scrolls sideways past the screen's edge. */
export function ChipRow<V extends OptionValue>({
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
      value={[toggleValue(value)]}
      onValueChange={(pressed) => {
        const picked = pickedOption(options, value, pressed)
        if (picked) onChange(picked.value)
      }}
      variant="chip"
      spacing={2}
      className="-mx-4 flex w-auto snap-x overflow-x-auto px-4 pb-1 scrollbar-none"
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={toggleValue(option.value)}
          value={toggleValue(option.value)}
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

(Base UI's `ToggleGroup` is generic over its string values and hands `onValueChange` a `string[]` here, so the
callback needs no annotation.)

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
import { cn } from '@/shared/lib'

const LOOK = {
  known: 'size-4 bg-primary text-primary-foreground',
  gap: 'size-2.5 bg-attention',
  unknown: 'size-2.5 ring-2 ring-inset ring-border',
} as const

/** Known (a check), a gap (an amber dot) or not checked yet (a ring), named in words. */
export function RatingMark({ rating }: { rating: 'known' | 'gap' | 'unknown' }) {
  const { t } = useTranslation('common')
  return (
    <span className="inline-flex items-center">
      <span aria-hidden className={cn('inline-grid place-items-center rounded-full', LOOK[rating])}>
        {rating === 'known' ? <Check className="size-3" strokeWidth={3} /> : null}
      </span>
      <span className="sr-only">{t(`rating.${rating}`)}</span>
    </span>
  )
}
```

`src/shared/ui/LevelMark.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'

/** Four pips rising in height, 6 to 12px. */
const PIPS = [
  { pip: 1, height: 'h-1.5' },
  { pip: 2, height: 'h-2' },
  { pip: 3, height: 'h-2.5' },
  { pip: 4, height: 'h-3' },
] as const

/** A level as four pips, the first `level` filled. */
export function LevelMark({ level }: { level: 1 | 2 | 3 | 4 }) {
  const { t } = useTranslation('common')
  return (
    <span role="img" aria-label={t('level', { level })} className="inline-flex items-end gap-0.5">
      {PIPS.map(({ pip, height }) => (
        <span
          key={pip}
          className={cn('w-1 rounded-full', height, pip <= level ? 'bg-primary' : 'bg-border')}
        />
      ))}
    </span>
  )
}
```

`src/shared/ui/Sheet.tsx`:

```tsx
import type { ComponentProps, ReactNode } from 'react'
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from './primitives/drawer'

/** The app's bottom sheet: a drawer from the bottom that always shows its swipe handle. */
export function Sheet(props: ComponentProps<typeof Drawer>) {
  return <Drawer showSwipeHandle {...props} />
}

/** The sheet's panel: a title, a body that scrolls, and an optional footer. */
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
    <DrawerContent className="mx-auto w-full max-w-2xl rounded-t-4xl bg-card">
      <DrawerHeader className="px-5 pt-3 text-left">
        <DrawerTitle className="text-xl font-bold">{title}</DrawerTitle>
      </DrawerHeader>
      <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-5 pb-6">{children}</div>
      {footer ? <DrawerFooter className="px-5 pb-safe">{footer}</DrawerFooter> : null}
    </DrawerContent>
  )
}
```

(The registry's `DrawerContent` draws the handle when its `Drawer` has `showSwipeHandle`, and rounds only its top
corners for a drawer that swipes down, so `rounded-t-4xl` sets the sheet's 28px.)

`src/shared/ui/index.ts`:

```ts
export { ChipRow } from './ChipRow'
export { LevelMark } from './LevelMark'
export type { Option, OptionValue } from './option'
export { RatingMark } from './RatingMark'
export { ROLE_BG } from './role-classes'
export { RoleLegend } from './RoleLegend'
export { RoundButton } from './RoundButton'
export { ScreenHeader } from './ScreenHeader'
export { Segmented } from './Segmented'
export { Sheet, SheetContent } from './Sheet'
```

Run: `npx vitest run src/shared/ui/kit.test.tsx`
Expected: PASS.

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

The keyboard's pure parts are logic, so they live where CLAUDE.md puts logic, under the coverage gate: which keys are
black and what range holds a set of keys in the music kernel, and the keys' geometry in `shared/lib`. `shared/ui`
keeps only the component.

**Files:**
- Create: `src/shared/lib/music/keyboard.ts`, `keyboard.test.ts`, `src/shared/lib/keyboard-layout.ts`,
  `keyboard-layout.test.ts`, `src/shared/ui/piano-keyboard/{PianoKeyboard.tsx,PianoKeyboard.test.tsx,index.ts}`
- Modify: `src/shared/lib/music/index.ts`, `src/shared/lib/index.ts`, `src/shared/ui/index.ts`

**Interfaces:**
- Produces:
  - music: `MIDDLE_C: Midi` (60); `isBlackKey(key: Midi): boolean`; `KeyRange = { from: Midi; to: Midi }`;
    `keyboardRange(keys: readonly Midi[], least: KeyRange): KeyRange` — `least`, grown as far as the keys need: down
    to the C at or below the lowest key, up to the B at or above the highest. Every key fits, and the keyboard never
    shrinks below `least`, so it does not jump while a chord changes inside it.
  - shared/lib: `keyboardLayout(range: KeyRange): { keys: KeyGeometry[]; whites: number }` with
    `KeyGeometry = { midi: Midi; black: boolean; left: number; width: number; height: number }` (percent of the
    keyboard's width and height). A range that starts or ends on a black key widens to the white key beside it.
  - `KeyTone = ChordRole | 'rh' | 'lh' | 'melody'`; `KeyMark = { tone: KeyTone; label?: string }`
  - `PianoKeyboard(props: { label: string; range: KeyRange; marks?: ReadonlyMap<Midi, KeyMark>;
    pressed?: ReadonlySet<Midi>; lit?: ReadonlySet<Midi>; outlined?: ReadonlySet<Midi>; wrong?: ReadonlySet<Midi>;
    selectable?: boolean; selected?: ReadonlySet<Midi>; onKeyPress?: (midi: Midi) => void; minWhiteWidth?: number;
    centre?: Midi | null; className?: string })`. A key's face, strongest first: wrong (red), lit (teal: the key
    sounding now, fading in over 80ms), marked (its role or hand colour, with its label), selected (teal: a quiz
    key chosen), pressed (held on MIDI), plain. `outlined` rings a key whatever its face.

- [ ] **Step 1: Write the failing kernel and layout tests**

`src/shared/lib/music/keyboard.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { isBlackKey, keyboardRange, MIDDLE_C } from './keyboard'
import { midi } from './pitch'

const ONE_OCTAVE = { from: midi(60), to: midi(71) }

describe('isBlackKey', () => {
  it('knows the black keys in any octave', () => {
    expect([60, 61, 62, 63, 64, 65, 66].map((key) => isBlackKey(midi(key)))).toEqual([
      false, true, false, true, false, false, true,
    ])
    expect(isBlackKey(midi(46))).toBe(true)
  })
})

describe('keyboardRange', () => {
  it('runs from the C below the lowest key to the B above the highest', () => {
    expect(keyboardRange([midi(62), midi(79)], ONE_OCTAVE)).toEqual({ from: 60, to: 83 })
  })

  it('never shrinks below the least range, so the keyboard does not jump', () => {
    expect(keyboardRange([midi(64), midi(67)], ONE_OCTAVE)).toEqual(ONE_OCTAVE)
    expect(keyboardRange([], ONE_OCTAVE)).toEqual(ONE_OCTAVE)
  })

  it('keeps a least range that does not end on a B while the keys fit inside it', () => {
    const least = { from: midi(60), to: midi(76) }
    expect(keyboardRange([midi(60), midi(64), midi(67)], least)).toEqual(least)
  })

  it('grows downwards for a low left hand', () => {
    expect(keyboardRange([midi(43), midi(67)], ONE_OCTAVE)).toEqual({ from: 36, to: 71 })
  })

  it('names middle C', () => {
    expect(MIDDLE_C).toBe(60)
  })
})
```

`src/shared/lib/keyboard-layout.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { keyboardLayout } from './keyboard-layout'
import { midi } from './music'

describe('keyboardLayout', () => {
  it('lays one octave out as 7 white keys with 5 shorter black keys between them', () => {
    const { keys, whites } = keyboardLayout({ from: midi(60), to: midi(71) })
    expect(whites).toBe(7)
    expect(keys.filter((key) => key.black).map((key) => key.midi)).toEqual([61, 63, 66, 68, 70])
    const c = keys.find((key) => key.midi === 60)
    const cSharp = keys.find((key) => key.midi === 61)
    expect(c).toMatchObject({ left: 0, width: 100 / 7, height: 100, black: false })
    expect(cSharp?.left).toBeCloseTo(100 / 7 - (100 / 7) * 0.31)
    expect(cSharp?.width).toBeCloseTo((100 / 7) * 0.62)
    expect(cSharp?.height).toBe(62)
  })

  it('widens a range that starts or ends on a black key to the white keys beside it', () => {
    const { keys } = keyboardLayout({ from: midi(61), to: midi(70) })
    expect(keys[0]?.midi).toBe(60)
    expect(keys.at(-1)?.midi).toBe(71)
  })
})
```

Run: `npx vitest run src/shared/lib/music/keyboard.test.ts src/shared/lib/keyboard-layout.test.ts`
Expected: FAIL.

- [ ] **Step 2: Implement them**

`src/shared/lib/music/keyboard.ts`:

```ts
import { midi, pitchClass, type Midi } from './pitch'

export const MIDDLE_C: Midi = midi(60)

const BLACK = new Set([1, 3, 6, 8, 10])

export const isBlackKey = (key: Midi): boolean => BLACK.has(pitchClass(key))

/** A stretch of the keyboard, both ends included. */
export interface KeyRange {
  readonly from: Midi
  readonly to: Midi
}

/**
 * `least`, grown as far as the keys need: down to the C at or below the lowest key, up to the B at
 * or above the highest. Keys inside `least` leave it as it is.
 */
export function keyboardRange(keys: readonly Midi[], least: KeyRange): KeyRange {
  if (keys.length === 0) return least
  const low = Math.min(...keys)
  const high = Math.max(...keys)
  return {
    from: midi(Math.min(least.from, low - pitchClass(low))),
    to: midi(Math.max(least.to, high + 11 - pitchClass(high))),
  }
}
```

Export `MIDDLE_C, isBlackKey, keyboardRange, type KeyRange` from `src/shared/lib/music/index.ts`.

`src/shared/lib/keyboard-layout.ts`:

```ts
import { isBlackKey, midi, type KeyRange, type Midi } from '@/shared/lib/music'

/** A black key sits over the gap between two white keys, 62% as wide and 62% as long. */
const BLACK_WIDTH = 0.62
const BLACK_HEIGHT = 62

export interface KeyGeometry {
  readonly midi: Midi
  readonly black: boolean
  /** Percent of the keyboard's width. */
  readonly left: number
  readonly width: number
  /** Percent of the keyboard's height. */
  readonly height: number
}

/** Every key of the range (widened to white keys), placed in percent of the keyboard. */
export function keyboardLayout(range: KeyRange): { keys: KeyGeometry[]; whites: number } {
  let low: number = range.from
  let high: number = range.to
  while (isBlackKey(midi(low))) low--
  while (isBlackKey(midi(high))) high++
  const whiteKeys: number[] = []
  for (let key = low; key <= high; key++) if (!isBlackKey(midi(key))) whiteKeys.push(key)
  const width = 100 / whiteKeys.length
  const keys: KeyGeometry[] = []
  for (let key = low; key <= high; key++) {
    if (isBlackKey(midi(key))) {
      const left = (whiteKeys.indexOf(key - 1) + 1) * width - (width * BLACK_WIDTH) / 2
      keys.push({ midi: midi(key), black: true, left, width: width * BLACK_WIDTH, height: BLACK_HEIGHT })
    } else {
      keys.push({ midi: midi(key), black: false, left: whiteKeys.indexOf(key) * width, width, height: 100 })
    }
  }
  return { keys, whites: whiteKeys.length }
}
```

Add `export { keyboardLayout, type KeyGeometry } from './keyboard-layout'` to `src/shared/lib/index.ts`.

Run the two test files. Expected: PASS.

- [ ] **Step 3: Write the failing component tests**

`PianoKeyboard.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { midi, type Midi } from '@/shared/lib/music'
import { type KeyMark, PianoKeyboard } from './PianoKeyboard'

const C4 = midi(60)
const ONE_OCTAVE = { from: C4, to: midi(71) }

describe('PianoKeyboard', () => {
  it('is a labelled group of keys named by note', () => {
    render(<PianoKeyboard label="Keyboard" range={ONE_OCTAVE} />)
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
    render(<PianoKeyboard label="Keyboard" range={ONE_OCTAVE} onKeyPress={onKeyPress} />)
    await user.click(screen.getByRole('button', { name: 'F sharp 4' }))
    expect(onKeyPress).toHaveBeenCalledWith(66)
  })

  it('shows a mark with its label and colour', () => {
    const marks = new Map<Midi, KeyMark>([[midi(62), { tone: 'root', label: '1' }]])
    render(<PianoKeyboard label="Keyboard" range={ONE_OCTAVE} marks={marks} />)
    const d = screen.getByRole('button', { name: 'D4' })
    expect(d).toHaveTextContent('1')
    expect(d).toHaveClass('bg-role-root')
  })

  it('makes keys toggles when they are selectable, and fills the selected ones teal', () => {
    render(<PianoKeyboard label="Keyboard" range={ONE_OCTAVE} selectable selected={new Set([C4])} />)
    const c = screen.getByRole('button', { name: 'C4' })
    expect(c).toHaveAttribute('aria-pressed', 'true')
    expect(c).toHaveClass('bg-primary')
    expect(screen.getByRole('button', { name: 'D4' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('lights the key sounding now over its mark', () => {
    const marks = new Map<Midi, KeyMark>([[C4, { tone: 'root', label: '1' }]])
    render(<PianoKeyboard label="Keyboard" range={ONE_OCTAVE} marks={marks} lit={new Set([C4])} />)
    const c = screen.getByRole('button', { name: 'C4' })
    expect(c).toHaveClass('bg-primary')
    expect(c).toHaveTextContent('1')
  })

  it('shows a wrong key and an outlined one', () => {
    render(
      <PianoKeyboard
        label="Keyboard"
        range={ONE_OCTAVE}
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
import { memo, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { cn, keyboardLayout, useMediaQuery } from '@/shared/lib'
import {
  isBlackKey,
  pitchClass,
  plainSpelling,
  type ChordRole,
  type KeyRange,
  type Midi,
} from '@/shared/lib/music'
import { ROLE_BG } from '../role-classes'

export type KeyTone = ChordRole | 'rh' | 'lh' | 'melody'
export interface KeyMark {
  readonly tone: KeyTone
  readonly label?: string
}

const TONE_BG: Readonly<Record<KeyTone, string>> = {
  ...ROLE_BG,
  rh: 'bg-hand-rh',
  lh: 'bg-hand-lh',
  melody: 'bg-hand-melody',
}

interface KeyProps {
  readonly midi: Midi
  readonly black: boolean
  /** Percent of the keyboard, from keyboardLayout. */
  readonly left: number
  readonly width: number
  readonly height: number
  readonly name: string
  readonly mark: KeyMark | undefined
  readonly pressed: boolean
  readonly lit: boolean
  readonly outlined: boolean
  readonly wrong: boolean
  readonly selectable: boolean
  readonly selected: boolean
  readonly onKeyPress: ((midi: Midi) => void) | undefined
}

function faceOf(props: KeyProps): string {
  if (props.wrong) return 'bg-destructive text-on-role'
  if (props.lit) return 'bg-primary text-primary-foreground'
  if (props.mark) return cn(TONE_BG[props.mark.tone], 'text-on-role')
  if (props.selected) return 'bg-primary text-primary-foreground'
  if (props.pressed) return 'bg-key-pressed'
  return props.black ? 'bg-key-black' : 'bg-key-white'
}

const Key = memo(function Key(props: KeyProps) {
  const { onKeyPress } = props
  return (
    <button
      type="button"
      aria-label={props.name}
      aria-pressed={props.selectable ? props.selected : undefined}
      onClick={onKeyPress ? () => onKeyPress(props.midi) : undefined}
      className={cn(
        'absolute top-0 flex items-end justify-center transition-colors duration-80 ease-out outline-none focus-visible:z-20 focus-visible:ring-3 focus-visible:ring-ring',
        props.black
          ? 'z-10 rounded-b-xs pb-1.5'
          : 'rounded-b-sm border border-t-0 border-key-white-edge pb-2.5',
        onKeyPress ? 'hover:brightness-95 active:brightness-90' : null,
        faceOf(props),
        props.outlined ? 'ring-3 ring-primary ring-inset' : null,
      )}
      style={{ left: `${props.left}%`, width: `${props.width}%`, height: `${props.height}%` }}
    >
      {props.mark?.label ? (
        <span aria-hidden className="text-sm font-bold tabular-nums">
          {props.mark.label}
        </span>
      ) : null}
    </button>
  )
})

/** The one keyboard (spec §8): keys are buttons named by note; marks colour and label them. */
export function PianoKeyboard({
  label,
  range,
  marks,
  pressed,
  lit,
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
  range: KeyRange
  marks?: ReadonlyMap<Midi, KeyMark>
  /** Keys held down on the MIDI keyboard. */
  pressed?: ReadonlySet<Midi>
  /** The key sounding now: a scale run's current note, Name chord's chord. */
  lit?: ReadonlySet<Midi>
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
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const { from, to } = range
  const { keys, whites } = useMemo(() => keyboardLayout({ from, to }), [from, to])
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = scroller.current
    const key = keys.find((k) => k.midi === centre)
    if (!element || !key || element.scrollWidth <= element.clientWidth) return
    const middle = ((key.left + key.width / 2) / 100) * element.scrollWidth
    element.scrollTo({
      left: middle - element.clientWidth / 2,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }, [centre, keys, reduceMotion])

  const nameOf = (key: Midi) => {
    const spelled = plainSpelling(pitchClass(key), true)
    const octave = Math.floor(key / 12) - 1
    return t(isBlackKey(key) ? 'note.sharp' : 'note.natural', { letter: spelled.letter, octave })
  }

  return (
    <div ref={scroller} className={cn('overflow-x-auto scrollbar-none', className)}>
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
            height={key.height}
            name={nameOf(key.midi)}
            mark={marks?.get(key.midi)}
            pressed={pressed?.has(key.midi) ?? false}
            lit={lit?.has(key.midi) ?? false}
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
```

`Key` is memoised deliberately (CODE_STYLE §7): a Player keyboard has up to 50 keys under a parent that re-renders
every beat group, and only the keys whose face changed need to. Its props are numbers, booleans, a mark and the
caller's `onKeyPress`; the Player hands in `usePractice`'s stable `press`, so a beat re-renders only its keys.

`index.ts`:

```ts
export { PianoKeyboard, type KeyMark, type KeyTone } from './PianoKeyboard'
```

and export them from `src/shared/ui/index.ts`.

Run the keyboard tests. Expected: PASS. (`useTranslation` works without a provider: the test setup initialises the
i18n instance. `useMediaQuery` reads the `stubMatchMedia` fake.)

- [ ] **Step 5: Verify and commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
npx prettier --write src/shared/ui src/shared/lib
git add -A src/shared/ui src/shared/lib
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
    <div role="status" aria-label={t('loading')} className="grid min-h-96 place-items-center">
      <Spinner />
    </div>
  )
}
```

Add `loading: 'Loading'` / `loading: 'Загрузка'` to `common`. In `createAppRouter` add
`defaultPendingComponent: RoutePending, defaultPendingMs: 300`.

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
      <ul className="flex gap-1 rounded-full bg-card/72 p-1.5 shadow-lg ring-1 ring-border backdrop-blur-xl lg:h-full lg:flex-col lg:gap-2 lg:rounded-none lg:bg-card lg:px-2 lg:pt-6 lg:shadow-none lg:ring-0 lg:backdrop-blur-none">
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
`FullScreenLayout.tsx`: `<main className="mx-auto flex min-h-dvh max-w-5xl flex-col px-4 pt-safe pb-safe
landscape-phone:h-dvh landscape-phone:overflow-y-auto">`. On a landscape phone the main has a definite height, so the
Player can give its keyboard the lower half (Task 26).
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
    <Empty className="min-h-96">
      <EmptyHeader>
        <EmptyTitle>
          <h1 className="text-xl font-bold">{t('notFound.title')}</h1>
        </EmptyTitle>
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

(The registry's `EmptyTitle` is a plain `div`, so the heading is an `h1` inside it; the router test finds it by
name.) `RouteError.tsx` gets the same `Empty` shape inside `role="alert"`, keeping its title and Reload button.

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
### Task 6: Kernel additions — placed chords and scales, scale gaps, relatives, URL spelling

The glossary's **Voicing** is how much of each chord a progression plays, so the explorers' "where the keys go" gets
its own name: a **placed tone** is a Tone at a key (Task 28 adds it to the glossary). The W/H names are **scale gaps**,
because **Step** is a path entry.

**Files:**
- Create: `src/shared/lib/music/place.ts`, `place.test.ts`
- Modify: `src/shared/lib/music/scale.ts`, `scale.test.ts`, `note.ts`, `note.test.ts`, `index.ts`

**Interfaces:**
- Produces:
  - `PlacedTone = { tone: Tone; midi: Midi }`; `PlacedChord = { rh: readonly PlacedTone[]; lh: readonly PlacedTone[] }`
  - `lastInversion(quality: ChordQuality): number` — the explorer offers root position and at most three inversions:
    `min(tones − 1, 3)`. The one rule for which inversions a chord has (the explorer's segments, the URL's validator,
    `placeChord`).
  - `placeChord(root: SpelledNote, quality: ChordQuality, options: { inversion: number; bothHands: boolean }):
    PlacedChord` — the right hand from the root at or above middle C, the first `inversion` tones an octave up; for
    both hands, the root an octave below in the left hand. An inversion the chord does not have is a `RangeError`
    (params are validated before they get here).
  - `placeScale(root: SpelledNote, kind: ScaleKind): PlacedTone[]` — the scale from the root at or above middle C up to
    the root an octave higher, as the keyboard and the fingering table show it.
  - `ScaleGap = 'H' | 'W' | 'W+H'`; `scaleGaps(kind: ScaleKind): ScaleGap[]`
  - `relativeScale(root: SpelledNote, kind: ScaleKind): { root: SpelledNote; kind: ScaleKind } | null`
  - `noteParam(note: SpelledNote): string` — `Bb`, `F#`; `noteFromParam(param: string): SpelledNote` — reads one back,
    a `RangeError` for anything else.

- [ ] **Step 1: Write the failing tests**

`place.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { note } from './note'
import { lastInversion, placeChord, placeScale } from './place'

const keys = (placed: readonly { midi: number }[]) => placed.map((p) => p.midi)

describe('placeChord', () => {
  it('plays C major from middle C in root position', () => {
    const placed = placeChord(note('C'), 'maj', { inversion: 0, bothHands: false })
    expect(keys(placed.rh)).toEqual([60, 64, 67])
    expect(placed.lh).toEqual([])
  })

  it('moves the lowest tones up an octave for each inversion', () => {
    expect(keys(placeChord(note('C'), 'maj', { inversion: 1, bothHands: false }).rh)).toEqual([
      64, 67, 72,
    ])
    expect(keys(placeChord(note('C'), 'maj', { inversion: 2, bothHands: false }).rh)).toEqual([
      67, 72, 76,
    ])
    expect(keys(placeChord(note('G'), 'd7', { inversion: 3, bothHands: false }).rh)).toEqual([
      77, 79, 83, 86,
    ])
  })

  it('refuses an inversion the chord does not have', () => {
    expect(() => placeChord(note('C'), 'maj', { inversion: 3, bothHands: false })).toThrow(RangeError)
  })

  it('adds the root an octave below in the left hand for both hands', () => {
    const placed = placeChord(note('B', -1), 'maj7', { inversion: 0, bothHands: true })
    expect(keys(placed.lh)).toEqual([58])
    expect(placed.lh[0]?.tone.role).toBe('root')
    expect(placed.rh.map((p) => p.tone.degree)).toEqual(['1', '3', '5', '7'])
  })
})

describe('lastInversion', () => {
  it('offers as many inversions as the chord has tones after its root, at most three', () => {
    expect(lastInversion('maj')).toBe(2)
    expect(lastInversion('d7')).toBe(3)
    expect(lastInversion('m69')).toBe(3)
  })
})

describe('placeScale', () => {
  it('runs from the root at or above middle C to the root an octave up', () => {
    expect(keys(placeScale(note('C'), 'major'))).toEqual([60, 62, 64, 65, 67, 69, 71, 72])
    const eFlat = placeScale(note('E', -1), 'harmonic')
    expect(eFlat[0]?.midi).toBe(63)
    expect(eFlat.at(-1)?.tone.degree).toBe('1')
    expect(eFlat.at(-1)?.midi).toBe(75)
  })
})
```

Append to `scale.test.ts`:

```ts
describe('scaleGaps', () => {
  it('names the gaps between neighbouring notes up to the octave', () => {
    expect(scaleGaps('major')).toEqual(['W', 'W', 'H', 'W', 'W', 'W', 'H'])
    expect(scaleGaps('harmonic')).toEqual(['W', 'H', 'W', 'W', 'H', 'W+H', 'H'])
    expect(scaleGaps('blues')).toEqual(['W+H', 'W', 'H', 'H', 'W+H', 'W'])
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

(and add `relativeScale, scaleGaps` to its `./scale` import; `note` is already imported.)

Append to `note.test.ts`:

```ts
describe('noteParam and noteFromParam', () => {
  it('write a note for a URL with ASCII accidentals and read it back', () => {
    for (const spelled of [note('B', -1), note('F', 1), note('C'), note('E', -2)]) {
      expect(noteFromParam(noteParam(spelled))).toEqual(spelled)
    }
    expect(noteParam(note('B', -1))).toBe('Bb')
    expect(noteParam(note('F', 1))).toBe('F#')
  })

  it('refuse a param that is not a note', () => {
    expect(() => noteFromParam('H')).toThrow(RangeError)
  })
})
```

(and add `noteFromParam, noteParam` to its `./note` import.)

Run: `npx vitest run src/shared/lib/music`
Expected: FAIL (missing exports).

- [ ] **Step 2: Implement**

`place.ts`:

```ts
import { qualityIntervals, spellChord, type ChordQuality } from './chord'
import { MIDDLE_C } from './keyboard'
import { pitchClassOf, type SpelledNote } from './note'
import { midi, type Midi } from './pitch'
import { spellScale, type ScaleKind } from './scale'
import type { Tone } from './tone'

/** A tone at a key on the keyboard. */
export interface PlacedTone {
  readonly tone: Tone
  readonly midi: Midi
}

/** A chord's keys, by hand. */
export interface PlacedChord {
  readonly rh: readonly PlacedTone[]
  readonly lh: readonly PlacedTone[]
}

/** The explorer offers root position and at most the first three inversions. */
const MOST_INVERSIONS = 3

/** The last inversion the explorer offers for a chord: one per tone after the root, at most three. */
export const lastInversion = (quality: ChordQuality): number =>
  Math.min(qualityIntervals(quality).length - 1, MOST_INVERSIONS)

/**
 * A chord as the explorers place it: the right hand from the root at or above middle C, the first
 * `inversion` tones an octave up (a chord's tones rise in formula order, so these are its lowest),
 * and for both hands the root an octave below in the left hand.
 */
export function placeChord(
  root: SpelledNote,
  quality: ChordQuality,
  options: { readonly inversion: number; readonly bothHands: boolean },
): PlacedChord {
  const last = lastInversion(quality)
  if (!Number.isInteger(options.inversion) || options.inversion < 0 || options.inversion > last) {
    throw new RangeError(`${quality} has inversions 0–${last}, not ${options.inversion}`)
  }
  const base = MIDDLE_C + pitchClassOf(root)
  const tones = spellChord(root, quality)
  return {
    rh: tones
      .map((tone, i) => ({ tone, midi: midi(base + tone.semitones + (i < options.inversion ? 12 : 0)) }))
      .sort((a, b) => a.midi - b.midi),
    lh: options.bothHands ? tones.slice(0, 1).map((tone) => ({ tone, midi: midi(base - 12) })) : [],
  }
}

/** A scale as the keyboard shows it: from the root at or above middle C to the root an octave up. */
export function placeScale(root: SpelledNote, kind: ScaleKind): PlacedTone[] {
  const base = MIDDLE_C + pitchClassOf(root)
  const tones = spellScale(root, kind)
  return [
    ...tones.map((tone) => ({ tone, midi: midi(base + tone.semitones) })),
    ...tones.slice(0, 1).map((tone) => ({ tone, midi: midi(base + 12) })),
  ]
}
```

`scale.ts` — add:

```ts
/** The gap between neighbouring notes of a scale: a half step, a whole step, or both (three semitones). */
export type ScaleGap = 'H' | 'W' | 'W+H'
const GAP_BY_SEMITONES: Readonly<Record<number, ScaleGap>> = { 1: 'H', 2: 'W', 3: 'W+H' }

/** The gaps between neighbouring notes up to the octave: W, H, or W+H. */
export function scaleGaps(kind: ScaleKind): ScaleGap[] {
  const semitones = [...scaleIntervals(kind).map((interval) => interval.semitones), 12]
  return semitones.slice(1).map((above, i) => {
    const size = above - (semitones[i] ?? 0)
    const gap = GAP_BY_SEMITONES[size]
    if (!gap) throw new RangeError(`${kind} has a gap of ${size} semitones`)
    return gap
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
/** A note as a URL writes it, ASCII `b` and `#` (`Bb`, `F#`); noteFromParam reads it back. */
export const noteParam = (spelled: SpelledNote): string =>
  spelled.letter +
  (spelled.accidental < 0 ? 'b'.repeat(-spelled.accidental) : '#'.repeat(spelled.accidental))

/** A note written by noteParam. A URL's params are validated first, so anything else is a bug. */
export function noteFromParam(param: string): SpelledNote {
  const spelled = parseNoteName(param)
  if (!spelled) throw new RangeError(`${param} is not a note`)
  return spelled
}
```

`index.ts` — export `noteFromParam, noteParam` from `./note`, `relativeScale, scaleGaps, type ScaleGap` from
`./scale`, and `export { lastInversion, placeChord, placeScale, type PlacedChord, type PlacedTone } from './place'`.

Run: `npx vitest run src/shared/lib/music`
Expected: PASS.

- [ ] **Step 3: Commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
npx prettier --write src/shared/lib/music
git add src/shared/lib/music
git commit -m "Place chords and scales on the keys, name scale gaps and relatives, spell notes for URLs

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
  - `wholeIn<F>(raw: unknown, min: number, max: number, fallback: F): number | F` — `fallback` may be `undefined`,
    for a param whose default depends on the piece
  - `readNote(raw: unknown): SpelledNote | null` — a note with at most one sharp or flat, written as a URL writes it
    (`Bb`, `F#`) or with `♭`; null for anything else
  - `foldText(text: string): string`; `matchesQuery(fields: readonly string[], query: string): boolean`

- [ ] **Step 1: Write the failing tests**

`search-params.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { isOneOf } from './is-one-of'
import { note } from './music'
import { readNote, valueOr, wholeIn } from './search-params'

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

  it('falls back to nothing when the default is not known here', () => {
    expect(wholeIn('fast', 40, 160, undefined)).toBeUndefined()
  })
})

describe('readNote', () => {
  it('reads a note with at most one sharp or flat', () => {
    expect(readNote('Bb')).toEqual(note('B', -1))
    expect(readNote('B♭')).toEqual(note('B', -1))
    expect(readNote('F#')).toEqual(note('F', 1))
  })

  it('reads nothing from a double accidental, H, lower case or not a note', () => {
    for (const raw of ['Ebb', 'H', 'c', '', 7]) expect(readNote(raw)).toBeNull()
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
import { parseNoteName, type SpelledNote } from '@/shared/lib/music'

/** `raw` when the guard accepts it, else the fallback: the one rule for a search param. */
export const valueOr = <T>(is: (value: unknown) => value is T, raw: unknown, fallback: T): T =>
  is(raw) ? raw : fallback

/** A whole number from min to max, as a number or as text; else the fallback. */
export function wholeIn<F>(raw: unknown, min: number, max: number, fallback: F): number | F {
  const value = typeof raw === 'string' && raw.trim() !== '' ? Number(raw) : raw
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max
    ? value
    : fallback
}

/** A note with at most one sharp or flat (a URL offers no double accidental); null for anything else. */
export function readNote(raw: unknown): SpelledNote | null {
  const note = typeof raw === 'string' ? parseNoteName(raw) : null
  return note && Math.abs(note.accidental) <= 1 ? note : null
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
export { readNote, valueOr, wholeIn } from './search-params'
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
  - `scaleRun(notes: readonly Midi[], options: { rhythm: PracticeRhythm; tempo: number; hands: Hands }): ScaleRun`
    with `ScaleRun = { sounds: readonly NoteSound[]; cues: readonly Cue[]; end: number }` and
    `Cue = { midi: Midi; at: number }`. `notes` are the scale's keys ascending including the octave, as the keyboard
    shows them; the run goes up and back down in eighth notes; each cue names the shown key sounding from `at`.

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
    expect(run.cues.map((cue) => cue.midi)).toEqual([
      60, 62, 64, 65, 67, 69, 71, 72, 71, 69, 67, 65, 64, 62, 60,
    ])
    expect(run.cues[1]?.at).toBeCloseTo(0.5)
    expect(run.end).toBeCloseTo(15 * 0.5)
  })

  it('repeats the rhythm’s lengths', () => {
    const run = scaleRun(C_MAJOR, { rhythm: 'long-short', tempo: 60, hands: 'rh' })
    expect(run.cues.slice(0, 3).map((cue) => cue.at)).toEqual([0, 0.75, 1])
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

/** The shown key that sounds from `at` seconds into a run, for lighting it. */
export interface Cue {
  readonly midi: Midi
  readonly at: number
}

export interface ScaleRun {
  readonly sounds: readonly NoteSound[]
  readonly cues: readonly Cue[]
  readonly end: number
}

const OCTAVES_BY_HANDS: Readonly<Record<Hands, readonly number[]>> = {
  rh: [0],
  lh: [-12],
  both: [-12, 0],
}

/** A scale up and back down in eighth notes, in a practice rhythm, for one hand or both. */
export function scaleRun(
  notes: readonly Midi[],
  options: { readonly rhythm: PracticeRhythm; readonly tempo: number; readonly hands: Hands },
): ScaleRun {
  const lengths = PRACTICE_RHYTHMS[options.rhythm]
  const eighth = 60 / options.tempo / 2
  const upAndDown = [...notes, ...notes.slice(0, -1).reverse()]
  const offsets = OCTAVES_BY_HANDS[options.hands]
  const velocity = offsets.length > 1 ? 0.16 : 0.2
  const sounds: NoteSound[] = []
  const cues: Cue[] = []
  let at = 0
  upAndDown.forEach((note, i) => {
    const length = (lengths[i % lengths.length] ?? 1) * eighth
    cues.push({ midi: note, at })
    for (const offset of offsets) {
      sounds.push({
        kind: 'note',
        midi: midi(note + offset),
        at,
        duration: Math.max(0.25, length * 1.1),
        velocity,
      })
    }
    at += length
  })
  return { sounds, cues, end: at }
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
  type Cue,
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

### Task 9: `usePlay` and `usePlayChord`

**Files:**
- Create: `src/shared/lib/services/use-play.ts`, `use-play.test.tsx`
- Modify: `src/shared/lib/services/index.ts`

**Interfaces:**
- Consumes: `placeChord`, `type Chord` (music); `chordSounds` (Task 8).
- Produces:
  - `usePlay(): (sounds: readonly Sound[]) => number` — unlocks audio, stops what sounds, plays from just after now,
    and returns that start time on the audio clock.
  - `usePlayChord(): (chord: Chord, options?: { inversion?: number; bothHands?: boolean; arpeggio?: boolean }) =>
    void` — a chord placed as the explorers place it, struck or rolled: the one way the Chords explorer, a scale's
    chords and the chord dictionary sound a chord.

- [ ] **Step 1: Write the failing tests**

```tsx
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { createFakeAudio } from '@/shared/api/audio'
import { midi, note } from '@/shared/lib/music'
import type { Sound } from '@/shared/lib/schedule'
import { ServicesProvider } from './ServicesProvider'
import { usePlay, usePlayChord } from './use-play'

const NOTE: Sound = { kind: 'note', midi: midi(60), at: 0, duration: 1, velocity: 0.2 }

function setup<T>(hook: () => T) {
  const audio = createFakeAudio()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ServicesProvider services={{ audio, midi: null }}>{children}</ServicesProvider>
  )
  const { result } = renderHook(hook, { wrapper })
  return { audio, current: result.current }
}

const keysPlayed = (sounds: readonly Sound[]) =>
  sounds.flatMap((sound) => (sound.kind === 'note' ? [sound.midi] : []))

describe('usePlay', () => {
  it('unlocks audio and plays from just after now', () => {
    const { audio, current: play } = setup(usePlay)
    audio.setNow(2)
    const at = play([NOTE])
    expect(audio.unlocks).toBe(1)
    expect(audio.played).toEqual([{ sounds: [NOTE], at }])
    expect(at).toBeCloseTo(2.1)
  })

  it('cuts off what was sounding before the next tap sounds', () => {
    const { audio, current: play } = setup(usePlay)
    play([NOTE])
    play([NOTE])
    expect(audio.stops).toBe(2)
    expect(audio.played).toHaveLength(2)
  })
})

describe('usePlayChord', () => {
  it('strikes a chord from middle C, with the root below for both hands', () => {
    const { audio, current: playChord } = setup(usePlayChord)
    playChord({ root: note('C'), quality: 'maj' }, { bothHands: true })
    expect(keysPlayed(audio.played[0]?.sounds ?? [])).toEqual([48, 60, 64, 67])
  })

  it('plays an inversion', () => {
    const { audio, current: playChord } = setup(usePlayChord)
    playChord({ root: note('C'), quality: 'maj' }, { inversion: 1 })
    expect(keysPlayed(audio.played[0]?.sounds ?? [])).toEqual([64, 67, 72])
  })
})
```

Run: `npx vitest run src/shared/lib/services/use-play.test.tsx`
Expected: FAIL.

- [ ] **Step 2: Implement**

```ts
import { useCallback } from 'react'
import { PLAY_DELAY } from '@/shared/api/audio'
import { placeChord, type Chord } from '@/shared/lib/music'
import { chordSounds, type Sound } from '@/shared/lib/schedule'
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

export interface ChordPlaying {
  readonly inversion?: number
  readonly bothHands?: boolean
  readonly arpeggio?: boolean
}

/** Sounds a chord as the explorers place it (`placeChord`), struck at once or rolled upwards. */
export function usePlayChord(): (chord: Chord, options?: ChordPlaying) => void {
  const play = usePlay()
  return useCallback(
    (chord, { inversion = 0, bothHands = false, arpeggio = false } = {}) => {
      const placed = placeChord(chord.root, chord.quality, { inversion, bothHands })
      play(chordSounds([...placed.lh, ...placed.rh].map((tone) => tone.midi), { arpeggio }))
    },
    [play],
  )
}
```

Export `usePlay, usePlayChord, type ChordPlaying` from `services/index.ts`. Run the test. Expected: PASS.

- [ ] **Step 3: Commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
npx prettier --write src/shared/lib/services
git add src/shared/lib/services
git commit -m "Play a sound or a chord now, cutting off the one before

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
  - `ratingOf(answers: ProgressState['answers'], skill: SkillId): Rating` — the one way to rate a skill from the saved
    answers. `selectRating`, the step-completion rule, `skillsToCheck`, `knownCount`, My gaps, the Check's result and
    the Piece's chords all use it. `NO_ANSWERS` moves from `selectors.ts` to `mastery.ts` beside it.
  - `selectAllAnswers(state): ProgressState['answers']`
  - `selectSuggestedStep(state): PlacedStep | null` — the most recently practised piece still on the path, if not
    learned; else the first unlearned step in path order; else null. Returns the path's own objects (stable). It and
    `selectLastPractised` read the practised pieces through one `practisedByRecency`.
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
describe('ratingOf', () => {
  it('rates a skill from the saved answers, and a skill never answered as unknown', () => {
    const answers = { 'chord:min': [{ correct: false, at: '2026-09-01' }] }
    expect(ratingOf(answers, 'chord:min')).toBe('gap')
    expect(ratingOf(answers, 'chord:dim')).toBe('unknown')
  })
})

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

(add `knownCount, ratingOf, skillsToCheck` to its `./mastery` import.)

Run: `npx vitest run src/entities/progress`
Expected: FAIL.

- [ ] **Step 2: Implement**

`mastery.ts` — add below `rate`, and route `allKnown` through `ratingOf`:

```ts
/** One array for every skill with no evidence, so a subscriber never sees a new reference. */
export const NO_ANSWERS: readonly Answer[] = []

/** A skill's rating from all saved answers: the one place a missing skill reads as no evidence. */
export const ratingOf = (answers: ProgressState['answers'], skill: SkillId): Rating =>
  rate(answers[skill] ?? NO_ANSWERS)

/** The skills a check should ask about: gaps and unknowns, in the order given. */
export const skillsToCheck = (
  skills: readonly SkillId[],
  answers: ProgressState['answers'],
): SkillId[] => skills.filter((skill) => ratingOf(answers, skill) !== 'known')

export const knownCount = (skills: readonly SkillId[], answers: ProgressState['answers']): number =>
  skills.filter((skill) => ratingOf(answers, skill) === 'known').length

const allKnown = (state: ProgressState, skills: readonly SkillId[]) =>
  skills.every((skill) => ratingOf(state.answers, skill) === 'known')
```

`selectors.ts` — import `NO_ANSWERS, ratingOf` from `./mastery` (deleting its own `NO_ANSWERS`), import
`pathSteps, type PlacedStep` from `@/entities/path`, and write:

```ts
export const selectAllAnswers = (state: ProgressState) => state.answers

export const selectAnswers =
  (skill: SkillId) =>
  (state: ProgressState): readonly Answer[] =>
    state.answers[skill] ?? NO_ANSWERS

export const selectRating =
  (skill: SkillId) =>
  (state: ProgressState): Rating =>
    ratingOf(state.answers, skill)

/** The pieces opened in the Player, the most recent first. */
function practisedByRecency(practised: ProgressState['practised']): PieceId[] {
  return Object.entries(practised)
    .map(([id, date]) => ({ id, at: Date.parse(date ?? '') }))
    .sort((a, b) => b.at - a.at)
    .map(({ id }) => id)
}

/** The piece opened in the Player most recently, or null. */
export const selectLastPractised = (state: ProgressState): PieceId | null =>
  practisedByRecency(state.practised)[0] ?? null

/**
 * Continue (spec §5): the most recently practised piece still on the path, while it is not learned;
 * else the first unlearned step in path order; null when everything is learned.
 */
export function selectSuggestedStep(state: ProgressState): PlacedStep | null {
  const steps = pathSteps()
  const onPath = practisedByRecency(state.practised)
    .map((id) => steps.find((placed) => placed.id === `piece:${id}`))
    .find((placed) => placed !== undefined)
  if (onPath && state.learned[onPath.id] === undefined) return onPath
  return steps.find((placed) => state.learned[placed.id] === undefined) ?? null
}
```

(`selectLastPractised`'s existing tests keep passing: the same answer through one reading of `practised`.)

Export `ratingOf, skillsToCheck, knownCount` (mastery) and `selectAllAnswers, selectSuggestedStep` (selectors) from
`src/entities/progress/index.ts`. Run the tests. Expected: PASS.

- [ ] **Step 3: Commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
npx prettier --write src/entities/progress
git add src/entities/progress
git commit -m "Suggest the step to continue, and rate and count skills in one place

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Piece titles, credits, source and section headings

The glossary's word for the interface language is **Locale**, and the type already exists in `entities/settings`.
The screens need it below entities (a `LocalText` is read in a locale), so it moves down to `shared/i18n`, the lowest
layer that knows languages, and `entities/settings` uses it from there. There is still one type, and it has the
glossary's name.

**Files:**
- Create: `src/shared/i18n/locale.ts`, `src/shared/i18n/use-locale.ts`, `src/entities/piece/model/titles.ts`,
  `titles.test.ts`, `src/entities/piece/ui/{Credits,SourceLine}.tsx`, `src/entities/piece/ui/use-section-heading.ts`,
  `src/entities/piece/ui/piece-ui.test.tsx`
- Modify: `src/shared/i18n/{index.ts,local-text.ts}`, `src/shared/i18n/locales/{en,ru}/piece.ts`,
  `src/entities/piece/index.ts`; `src/entities/settings/model/{types.ts,selectors.ts}`, `src/entities/settings/index.ts`
  and the importers of `Locale` (`src/app/testing/{render-app,render-with-settings}.tsx`,
  `src/app/providers/LocaleSync.test.tsx`, `src/features/set-preference/set-locale.ts`,
  `src/pages/settings/ui/SettingsPage.tsx`)

**Interfaces:**
- Produces:
  - `LOCALES = ['en', 'ru'] as const`, `Locale` (moved from `entities/settings`); `LocalText = Readonly<Record<Locale,
    string>>`; `useLocale(): Locale`, the language the interface speaks now (i18next's, which `LocaleSync` keeps on
    the saved setting before paint).
  - `entryTitles(entry: { title: string; titleEn?: string }, locale: Locale): { primary: string; secondary?: string }`
  - `Credits({ credits }: { credits: readonly Credit[] })`, `SourceLine({ source }: { source: Source })`
  - `useSectionHeading(): (section: Section) => string`

- [ ] **Step 1: Move `Locale` down to `shared/i18n`**

`src/shared/i18n/locale.ts`:

```ts
/** The interface languages; English is the fallback. */
export const LOCALES = ['en', 'ru'] as const
export type Locale = (typeof LOCALES)[number]
```

`local-text.ts` types `LocalText` as `Readonly<Record<Locale, string>>` (the same `{ en, ru }`) and
`localText(text: LocalText, locale: Locale)`. `index.ts` exports `LOCALES, type Locale` from `./locale`.
`entities/settings/model/types.ts` deletes its own `LOCALES`/`Locale` and imports them from `@/shared/i18n/locale`,
the side-effect-free module (the index also starts i18next). `selectors.ts` imports `type Locale` from there too.
`entities/settings/index.ts` stops exporting them, and each importer listed above imports `type Locale` (and
`SettingsPage.tsx` `LOCALES`) from `@/shared/i18n`. Run: `npm run typecheck && npx vitest run src/entities/settings
src/app src/features/set-preference src/pages/settings`. Expected: green, with no behaviour changed.

- [ ] **Step 2: Add the piece strings**

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
export const piece: LocaleResources['piece'] = {
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
}
```

(the module keeps its `import type { LocaleResources } from '../../types'` and its
`export const piece: LocaleResources['piece'] = {` line, as every Russian module does.)

- [ ] **Step 3: Write the failing tests**

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
import { describe, expect, it } from 'vitest'
import { i18n } from '@/shared/i18n'
import { Credits } from './Credits'
import { SourceLine } from './SourceLine'
import { useSectionHeading } from './use-section-heading'

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

- [ ] **Step 4: Implement**

`src/shared/i18n/use-locale.ts`:

```ts
import { useTranslation } from 'react-i18next'
import { isOneOf } from '@/shared/lib'
import { LOCALES, type Locale } from './locale'

const isLocale = isOneOf(LOCALES)

/**
 * The locale the interface speaks now. It follows i18next rather than the settings store, so text
 * from `t()` and from `localText()` always agree; LocaleSync moves i18next before paint.
 */
export function useLocale(): Locale {
  const { i18n } = useTranslation()
  const language = i18n.resolvedLanguage
  return isLocale(language) ? language : 'en'
}
```

Export `useLocale` from `src/shared/i18n/index.ts`.

`src/entities/piece/model/titles.ts`:

```ts
import type { Locale } from '@/shared/i18n'

export interface EntryTitles {
  readonly primary: string
  /** The printed title, under an English one. */
  readonly secondary?: string
}

/** English shows the English title over the printed one; Russian shows the printed title (spec §8). */
export function entryTitles(
  entry: { readonly title: string; readonly titleEn?: string },
  locale: Locale,
): EntryTitles {
  return locale === 'en' && entry.titleEn
    ? { primary: entry.titleEn, secondary: entry.title }
    : { primary: entry.title }
}
```

`src/entities/piece/ui/use-section-heading.ts`:

```ts
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { localText, useLocale } from '@/shared/i18n'
import type { Section } from '../model/types'

/** A section's heading in the learner's language: "Verse 4 and ending", "Последний припев в ля миноре". */
export function useSectionHeading(): (section: Section) => string {
  const { t } = useTranslation('piece')
  const locale = useLocale()
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
      return section.detail ? `${base} ${localText(section.detail, locale)}` : base
    },
    [t, locale],
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
    <div className="flex flex-col gap-0.5 text-sm">
      {credits.map((credit, i) =>
        credit.role === 'unknown' ? (
          <p key={i} className="text-muted-foreground">
            {t('credit.unknown')}
          </p>
        ) : (
          <p key={i} className="flex flex-wrap gap-x-1.5">
            <span className="text-muted-foreground">{t(`credit.${credit.role}`)}:</span>
            <span>{credit.names}</span>
          </p>
        ),
      )}
    </div>
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

- [ ] **Step 5: Commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
npx prettier --write src/shared/i18n src/entities src/app/testing src/app/providers src/features/set-preference src/pages/settings
git add src/shared/i18n src/entities src/app src/features/set-preference src/pages/settings
git commit -m "Title, credit and head a piece in the learner's locale

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: The learned toggle

**Files:**
- Create: `src/features/mark-learned/ui/LearnedToggle.tsx`, `LearnedToggle.test.tsx`
- Modify: `src/features/mark-learned/index.ts`, `src/shared/i18n/locales/{en,ru}/common.ts`

**Interfaces:**
- Consumes: `markLearned`, `unmarkLearned`, `useProgress`, `useProgressStoreApi`, `selectIsLearned`, `recordAnswer`.
- Produces: `LearnedToggle({ step, title, variant }: { step: StepId; title: string; variant?: 'icon' | 'text' })`.
  A toggle is named for the state it switches, and `aria-pressed` says whether it is on, so the text variant reads
  "Learned", pressed or not. An action label ("Mark as learned") would be wrong once the step is learned.

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
      className="grid size-11 shrink-0 place-items-center rounded-full transition-colors duration-200 ease-out outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring"
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
import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'
import { Spinner } from '@/shared/ui/primitives/spinner'
import { useMidiConnection, type MidiConnection } from '../use-midi-connection'

function statusLine(connection: MidiConnection, t: TFunction<'common'>): string | null {
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
- Consumes: `chartOf`, `melodyOf`, `hasMethodCodes`, `pieceKey`, `Piece`, `Voicing` (piece); `PATTERNS`,
  `METHOD_PATTERNS`, `RIGHT_FIGURES`, `LEFT_FIGURES`, `PatternId`, `RightFigureId`, `LeftFigureId` (pattern);
  `arrange`; `keyboardRange` (music); `type KeyMark` (shared/ui).
- Produces:
  - `PracticeChoice = { tonic: SpelledNote; pattern: PatternId | 'chart'; rh: RightFigureId | null; lh:
    LeftFigureId | null; voicing: Voicing | null; melody: boolean }`
  - `defaultPattern(piece: Piece): PatternId | 'chart'`
  - `ownChoice(piece: Piece): PracticeChoice` — the piece as written: its tonic, its default pattern, the pattern's
    own figures, its own voicing, no doubled melody. The one place this default is written (the Piece screen, the
    Player's search and every test start from it).
  - `arrangePiece(piece: Piece, choice: PracticeChoice): Performance`
  - `spellPerformedNote(performance: Performance, note: PerformanceNote): { name: string; octave: number }`,
    `noteLabel(name: { name: string; octave: number }): string` (`F#3`)
  - `beatLabel(ticksIntoBar: number): string`; `barColumns(performance: Performance, bar: number): NoteColumn[]`
    with `NoteColumn = { beatGroup: number; beat: string; notes: Record<NoteHand, readonly PlayedNote[]> }`,
    `PlayedNote = { label: string; finger?: Finger }`
  - `practiceMarks(performance: Performance, beatGroup: number, options: { fingers: boolean; received?:
    readonly PitchClass[] }): Map<Midi, KeyMark>` — the beat group's notes by hand; label = finger when asked and
    known, else the note name; a received pitch class is labelled `✓`.
  - `playerRange(performance: Performance): KeyRange` — every note of the performance, and at least C3–B4 so a
    short piece still shows two octaves

- [ ] **Step 1: Write the failing tests**

`arrange-piece.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { hasMethodCodes, PIECES, pieceById, pieceKey } from '@/entities/piece'
import { note } from '@/shared/lib/music'
import { arrangePiece, defaultPattern, ownChoice } from './arrange-piece'

const piece = (id: string) => {
  const found = pieceById(id)
  if (!found) throw new Error(id)
  return found
}
const bz5 = piece('bz5')

describe('ownChoice', () => {
  it('plays a piece as written', () => {
    expect(ownChoice(bz5)).toEqual({
      tonic: pieceKey(bz5).tonic,
      pattern: 'r4',
      rh: null,
      lh: null,
      voicing: null,
      melody: false,
    })
  })
})

describe('arrangePiece', () => {
  it('plays a piece in its own key and in another', () => {
    expect(arrangePiece(bz5, ownChoice(bz5)).chords[0]?.symbol).toBe('G')
    expect(arrangePiece(bz5, { ...ownChoice(bz5), tonic: note('A') }).chords[0]?.symbol).toBe('A')
  })

  it('follows the chart’s own methods when asked', () => {
    const withCodes = PIECES.find((p) => hasMethodCodes(p))
    if (!withCodes) throw new Error('no piece names its methods')
    expect(defaultPattern(withCodes)).toBe('chart')
    expect(ownChoice(withCodes).pattern).toBe('chart')
    const patterns = new Set(arrangePiece(withCodes, ownChoice(withCodes)).chords.map((c) => c.pattern))
    expect(patterns.size).toBeGreaterThan(0)
    expect([...patterns].every((id) => typeof id === 'string')).toBe(true)
  })

  it('falls back to r4 for a melody pattern on a piece without a melody', () => {
    const performance = arrangePiece(bz5, { ...ownChoice(bz5), pattern: 'r5' })
    expect(performance.chords.every((c) => c.pattern === 'r4')).toBe(true)
  })

  it('grows a progression’s chords with the voicing that it lets the learner choose', () => {
    const twofive = piece('twofive')
    const symbols = (voicing: 'triads' | 'ninths') =>
      arrangePiece(twofive, { ...ownChoice(twofive), voicing }).chords.map((c) => c.symbol)
    expect(symbols('triads')[0]).toBe('Dm')
    expect(symbols('ninths')[0]).toBe('Dm9')
  })
})
```

`bar-columns.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { pieceById } from '@/entities/piece'
import { arrangePiece, ownChoice } from './arrange-piece'
import { barColumns, beatLabel } from './bar-columns'

const bz5 = pieceById('bz5')
if (!bz5) throw new Error('bz5')
const performance = arrangePiece(bz5, { ...ownChoice(bz5), pattern: 'M1' })

describe('beatLabel', () => {
  it('counts beats and names their subdivisions', () => {
    expect([0, 3, 6, 9, 12, 16, 20].map(beatLabel)).toEqual(['1', '1e', '1&', '1a', '2', '2⅓', '2⅔'])
  })
})

describe('barColumns', () => {
  it('lists each beat group of a bar with its notes, high to low, by hand', () => {
    const columns = barColumns(performance, 0)
    expect(columns[0]?.beat).toBe('1')
    expect(columns.every((column) => performance.beatGroups[column.beatGroup]?.bar === 0)).toBe(true)
    const rh = columns[0]?.notes.rh.map((n) => n.label) ?? []
    expect(rh.length).toBeGreaterThan(0)
    expect(rh.every((label) => /^[A-G](#|♭)?\d$/.test(label))).toBe(true)
  })

  it('is empty for a bar the piece does not have', () => {
    expect(barColumns(performance, 999)).toEqual([])
  })
})
```

`marks.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { pieceById } from '@/entities/piece'
import { pitchClass } from '@/shared/lib/music'
import { arrangePiece, ownChoice } from './arrange-piece'
import { playerRange, practiceMarks } from './marks'
import { spellPerformedNote } from './note-names'

const bz5 = pieceById('bz5')
if (!bz5) throw new Error('bz5')
const performance = arrangePiece(bz5, { ...ownChoice(bz5), pattern: 'M1' })

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
import { chartOf, hasMethodCodes, melodyOf, pieceKey, type Piece } from '@/entities/piece'
import { arrange, type Performance } from '@/shared/lib/arrangement'
import type { PracticeChoice } from './choice'

/** The chart's own methods when it names them, else the piece's pattern. */
export const defaultPattern = (piece: Piece): PatternId | 'chart' =>
  hasMethodCodes(piece) ? 'chart' : piece.pattern

/** The piece as written: its key, its default pattern and voicing, no figures swapped, no doubled melody. */
export const ownChoice = (piece: Piece): PracticeChoice => ({
  tonic: pieceKey(piece).tonic,
  pattern: defaultPattern(piece),
  rh: null,
  lh: null,
  voicing: null,
  melody: false,
})

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
import {
  keyboardRange,
  midi,
  pitchClass,
  type KeyRange,
  type Midi,
  type PitchClass,
} from '@/shared/lib/music'
import type { KeyMark } from '@/shared/ui'
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

/** Two octaves around middle C: the least the Player shows. */
const AT_LEAST: KeyRange = { from: midi(48), to: midi(71) }

/** Every note of the piece on the keyboard, from a C to a B. */
export const playerRange = (performance: Performance): KeyRange =>
  keyboardRange(
    performance.notes.map((n) => n.midi),
    AT_LEAST,
  )
```

Export all of them from `src/features/practice/index.ts`
(`type PracticeChoice`, `arrangePiece`, `defaultPattern`, `ownChoice`, `spellPerformedNote`, `noteLabel`, `type NoteName`,
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
  `quiz-keys.ts`, `quiz-keys.test.ts`, `theory-quizzes.ts`, `theory-quizzes.test.ts`, `use-quiz.ts`,
  `use-quiz.test.tsx`
- Modify: `src/features/quiz/index.ts`

**Interfaces:**
- Consumes: `quizReducer`, `createQuestion`, `answerOf`, `isFinished`, `INITIAL_QUIZ`, `QuizConfig`, `QuizMode`,
  `Question` (quiz machine); `recordAnswer`; `usePlay`; `chordSounds`; `placeChord`, `placeScale`, `keyboardRange`,
  `MIDDLE_C`; `pathSteps`, `skillsOfStep`; `pieceById`, `skillsOfPiece`, `chordRootsOfPiece`; `ratingOf`,
  `ProgressState`; `QuizChoice`; `type KeyMark`.
- Produces:
  - `CheckPlan = { of: StepId; skills: readonly SkillId[]; config: QuizConfig; length: number; marks: StepId |
    null }`; `checkPlan(of: StepId): CheckPlan | null`
  - `myGaps(answers: ProgressState['answers'], practised: ProgressState['practised']): SkillId[]`
  - `THEORY_QUIZZES = ['build-chord', 'name-chord', 'build-scale', 'gaps'] as const`, `TheoryQuiz`;
    `theoryQuizConfig(quiz: TheoryQuiz, choice: QuizChoice, gaps: readonly SkillId[]): QuizConfig` — the quizzes
    Theory → Quiz offers and what each asks. The page's segments and the URL's validator share this one list.
  - `QUIZ_RANGE: KeyRange` (middle C to the E above the next C); `targetKeys(question: Question): Midi[]`;
    `quizKeyboardRange(question: Question | null): KeyRange` (the quiz range, grown to hold the answer);
    `questionSounds(question: Question): NoteSound[]` (the answer, struck; a scale rolled);
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

`theory-quizzes.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { DEFAULT_QUIZ_CHOICE } from '@/entities/settings'
import { chordSkill, qualitiesIn, scaleSkill } from '@/shared/lib/music'
import { theoryQuizConfig } from './theory-quizzes'

describe('theoryQuizConfig', () => {
  it('builds or names the chosen families’ chords', () => {
    const chords = DEFAULT_QUIZ_CHOICE.families.flatMap((family) => qualitiesIn(family)).map(chordSkill)
    expect(theoryQuizConfig('build-chord', DEFAULT_QUIZ_CHOICE, [])).toEqual({
      chordMode: 'build-chord',
      scope: { skills: chords },
    })
    expect(theoryQuizConfig('name-chord', DEFAULT_QUIZ_CHOICE, []).chordMode).toBe('name-chord')
  })

  it('builds the chosen scales', () => {
    expect(theoryQuizConfig('build-scale', DEFAULT_QUIZ_CHOICE, []).scope.skills).toEqual(
      DEFAULT_QUIZ_CHOICE.scales.map(scaleSkill),
    )
  })

  it('asks My gaps in their order', () => {
    expect(theoryQuizConfig('gaps', DEFAULT_QUIZ_CHOICE, ['scale:blues', 'chord:m7']).scope).toEqual({
      skills: ['scale:blues', 'chord:m7'],
      ordered: true,
    })
  })
})
```

`quiz-keys.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { chordSkill, chordSymbol, midi, note, scaleSkill, spellChord, spellScale } from '@/shared/lib/music'
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

  it('shows a high scale whole, so the answer is on the keys after Check', () => {
    const root = note('B')
    const question: Question = {
      mode: 'build-scale',
      skill: scaleSkill('major'),
      root,
      kind: 'major',
      notes: spellScale(root, 'major'),
    }
    expect(quizKeyboardRange(question).to).toBeGreaterThanOrEqual(Math.max(...targetKeys(question)))
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
import { ratingOf, type ProgressState } from '@/entities/progress'
import { SKILLS, type SkillId } from '@/shared/lib/music'

/** My gaps (spec §4.6 ③): gap skills first, then unknown skills of pieces the learner has opened. */
export function myGaps(
  answers: ProgressState['answers'],
  practised: ProgressState['practised'],
): SkillId[] {
  const used = new Set(
    Object.keys(practised).flatMap((id) => {
      const piece = pieceById(id)
      return piece ? skillsOfPiece(piece) : []
    }),
  )
  return [
    ...SKILLS.filter((skill) => ratingOf(answers, skill) === 'gap'),
    ...SKILLS.filter((skill) => used.has(skill) && ratingOf(answers, skill) === 'unknown'),
  ]
}
```

`theory-quizzes.ts`:

```ts
import type { QuizChoice } from '@/entities/settings'
import { chordSkill, qualitiesIn, scaleSkill, type SkillId } from '@/shared/lib/music'
import type { QuizConfig } from './quiz-machine'

/** The open-ended quizzes Theory → Quiz offers: the three modes over the chosen skills, and My gaps. */
export const THEORY_QUIZZES = ['build-chord', 'name-chord', 'build-scale', 'gaps'] as const
export type TheoryQuiz = (typeof THEORY_QUIZZES)[number]

/** What a Theory quiz asks (spec §4.5): the chosen families' chords or scales, or My gaps in order. */
export function theoryQuizConfig(
  quiz: TheoryQuiz,
  choice: QuizChoice,
  gaps: readonly SkillId[],
): QuizConfig {
  switch (quiz) {
    case 'build-scale':
      return { chordMode: 'build-chord', scope: { skills: choice.scales.map(scaleSkill) } }
    case 'gaps':
      return { chordMode: 'build-chord', scope: { skills: gaps, ordered: true } }
    case 'build-chord':
    case 'name-chord':
      return {
        chordMode: quiz,
        scope: { skills: choice.families.flatMap((family) => qualitiesIn(family)).map(chordSkill) },
      }
  }
}
```

`quiz-keys.ts`:

```ts
import {
  keyboardRange,
  MIDDLE_C,
  midi,
  pitchClass,
  placeChord,
  placeScale,
  type KeyRange,
  type Midi,
  type Tone,
} from '@/shared/lib/music'
import { chordSounds, type NoteSound } from '@/shared/lib/schedule'
import type { KeyMark } from '@/shared/ui'
import type { Question } from './quiz-machine'

/** Middle C to the E above the next C: room to build most chords and scales, any octave counting. */
export const QUIZ_RANGE: KeyRange = { from: MIDDLE_C, to: midi(76) }

const tonesOf = (question: Question): readonly Tone[] =>
  question.mode === 'build-scale' ? question.notes : question.tones

/** The question's answer on the keyboard: a chord placed from middle C, a scale up from its root. */
export function targetKeys(question: Question): Midi[] {
  const placed =
    question.mode === 'build-scale'
      ? placeScale(question.root, question.kind)
      : placeChord(question.root, question.quality, { inversion: 0, bothHands: false }).rh
  return placed.map((tone) => tone.midi)
}

/**
 * The quiz range, grown to hold the question's answer, so a wide chord shows whole and the keys
 * outlined after Check are on the keyboard.
 */
export const quizKeyboardRange = (question: Question | null): KeyRange =>
  question ? keyboardRange(targetKeys(question), QUIZ_RANGE) : QUIZ_RANGE

/** The answer, sounded: a chord struck, a scale rolled upwards. */
export const questionSounds = (question: Question): NoteSound[] =>
  chordSounds(targetKeys(question), { arpeggio: question.mode === 'build-scale' })

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

  it('sounds a Name chord question as it is shown, and again on request', () => {
    const { result, audio } = setup({ ...ONLY_C_MAJOR, chordMode: 'name-chord' })
    expect(audio.played).toHaveLength(1)
    act(() => result.current.hear())
    expect(audio.played).toHaveLength(2)
  })
})
```

(The first test toggles three keys inside one `act`, before React re-renders: the hook must read the machine's
latest state, not the last render's.)

Run: `npx vitest run src/features/quiz/use-quiz.test.tsx`
Expected: FAIL.

- [ ] **Step 4: Implement `use-quiz.ts`**

The machine's state lives in a ref that only the hook's actions write, so several events before a re-render each
see the one before, and an answer is recorded exactly once, on the event that produced it. React state mirrors the
ref for rendering. The actions are plain functions that read `config` and `random` from the current render, so
nothing needs memoising and no dependency list needs silencing. A Name chord question sounds from an effect keyed on
the question: sounding is the outside world, and a new question is exactly when it should happen.

```ts
import { useEffect, useRef, useState } from 'react'
import { useProgressStoreApi } from '@/entities/progress'
import { recordAnswer } from '@/features/record-answer'
import type { Midi } from '@/shared/lib/music'
import { usePlay } from '@/shared/lib/services'
import { questionSounds } from './quiz-keys'
import {
  answerOf,
  createQuestion,
  INITIAL_QUIZ,
  isFinished,
  quizReducer,
  type QuizConfig,
  type QuizEvent,
  type QuizState,
} from './quiz-machine'

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
 * chord questions as they are shown and every answer once given. A new config needs a new `key`
 * on the caller.
 */
export function useQuiz(config: QuizConfig, options: { random?: () => number } = {}): Quiz {
  const random = options.random ?? Math.random
  const store = useProgressStoreApi()
  const play = usePlay()
  const [state, setState] = useState(() =>
    quizReducer(INITIAL_QUIZ, { type: 'ask', question: createQuestion(config, { index: 0, random }) }),
  )
  const machine = useRef(state)
  const { question } = state

  // Name chord is asked by ear: a question sounds when it is shown.
  useEffect(() => {
    if (question?.mode === 'name-chord') play(questionSounds(question))
  }, [question, play])

  const send = (event: QuizEvent) => {
    const before = machine.current
    const after = quizReducer(before, event)
    if (after === before) return
    machine.current = after
    setState(after)
    const answer = before.result ? null : answerOf(after)
    if (!answer || !after.question) return
    recordAnswer(store, answer, new Date())
    if (after.question.mode !== 'name-chord') play(questionSounds(after.question))
  }

  return {
    state,
    finished: isFinished(state, config.scope),
    toggleKey: (key) => send({ type: 'toggleKey', midi: key }),
    clear: () => send({ type: 'clear' }),
    check: () => send({ type: 'check' }),
    choose: (symbol) => send({ type: 'choose', symbol }),
    next() {
      const current = machine.current
      if (!current.result || isFinished(current, config.scope)) return
      send({
        type: 'ask',
        question: createQuestion(config, { index: current.asked, random, previous: current.question }),
      })
    },
    hear() {
      const current = machine.current.question
      if (current) play(questionSounds(current))
    },
  }
}
```

`createQuestion`'s `index` is the zero-based number of the question being asked, and the machine's `ask` counts
`asked`. After the first question `asked` is 1, the index of the second.

Export from `src/features/quiz/index.ts`: `checkPlan, type CheckPlan`, `myGaps`, `THEORY_QUIZZES, theoryQuizConfig,
type TheoryQuiz`, `answerKeys, QUIZ_RANGE, questionSounds, quizKeyboardRange, targetKeys`, `useQuiz, type Quiz`.

Run: `npx vitest run src/features/quiz`
Expected: PASS.

- [ ] **Step 5: Commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
npx prettier --write src/features/quiz
git add src/features/quiz
git commit -m "Plan checks and theory quizzes, find my gaps, and drive the quiz with evidence and sound

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---
### Task 16: Names for steps, chords and scales; every route's search params

The explorers, the Check, Songs and the Player link to each other, so every route learns its search params here,
before any screen needs them. The validators live in the app layer (`src/app/routes/search.ts`): the router may not
import a page or a widget, or that screen's code would move into the main chunk. A build proved it: a const the
router imported from a page's `index.ts` pulled the page's component in with it. The router does import the
entities and features that guards and validators need (the catalogue, the path, check plans, the practice modes).

Each schema is the view type of the slice that uses it, so nothing is declared twice. The owners are the Chords
explorer's `ChordView`, the Scales explorer's `ScaleView`, the Setup sheet's `SetupParams`, the Songs page's
`SongsFilter`, and the Player page's `PlayerSearch`. `search.ts` imports each with `import type`, which the compiler
erases, so no screen code reaches the main chunk. The owning slices get their type modules here, before their UI.

**Files:**
- Create: `src/entities/path/ui/{use-step-title.ts,use-step-title.test.tsx}`;
  `src/widgets/chord-explorer/{index.ts,model/chord-view.ts}`, `src/widgets/scale-explorer/{index.ts,model/scale-view.ts}`,
  `src/widgets/player-setup/{index.ts,model/setup-params.ts}`, `src/pages/songs/model/songs-filter.ts`,
  `src/pages/player/model/player-search.ts`; `src/app/routes/search.ts`, `src/app/routes/search.test.ts`
- Modify: `src/entities/path/index.ts`, `src/features/practice/{practice-machine.ts,index.ts}` (`PRACTICE_MODES`),
  `src/pages/songs/index.ts`, `src/pages/player/index.ts`, `src/shared/i18n/locales/{en,ru}/{theory,path}.ts`,
  `src/app/router.tsx`, `src/app/router.test.tsx`

**Interfaces:**
- Produces:
  - `StepKind = 'chords' | 'scale' | 'exercise' | 'song' | 'progression'`;
    `useStepTitle(): (step: PathStep) => { primary: string; secondary?: string; kind: StepKind }`
  - theory strings: `family.<ChordFamily>`, `quality.<ChordQuality>` (full names), `scaleKind.<ScaleKind>` (chip
    labels), `scaleName.<ScaleKind>` (after a note: "E♭ harmonic minor")
  - view types: `ChordView = { root: string; quality: ChordQuality; inversion: number; hands: 'rh' | 'both' }`;
    `ScaleView = { root: string; kind: ScaleKind; view: 'degrees' | 'rh' | 'lh'; rhythm: PracticeRhythm; tempo:
    number; hands: Hands; chords: 3 | 4 }`; `SetupParams = { key?: string; tempo?: number; hands: Hands; pattern?:
    PatternId | 'chart'; rh?: RightFigureId; lh?: LeftFigureId; voicing?: Voicing }` (absent = the piece's own) and
    `SetupChange = Partial<SetupParams>`; `SongsFilter = { q: string; collection: CollectionId | 'all'; level: Level |
    'any' }`; `PlayerSearch = SetupParams & { mode: PracticeMode }`. A `root` or `key` is a note as a URL writes it
    (`Bb`, `F#`).
  - `PRACTICE_MODES = ['listen', 'step', 'turn'] as const`; `PracticeMode` becomes `(typeof PRACTICE_MODES)[number]`.
  - validators and defaults (`app/routes/search.ts`): `validateSongsSearch`, `SONGS_DEFAULTS`;
    `validateChordsSearch`, `CHORDS_DEFAULTS`, `ChordsSearch = ChordView & { step?: ChordsStepId }`;
    `validateScalesSearch`, `SCALES_DEFAULTS`, `ScalesSearch = ScaleView & { step?: ScaleStepId }`;
    `validateQuizSearch`, `QUIZ_DEFAULTS`, `QuizSearch = { mode: TheoryQuiz }`; `validateCheckSearch`,
    `CheckSearch = { of?: StepId }`; `validatePlayerSearch`, `PLAYER_DEFAULTS`. An invalid value takes its default,
    with no clamping. A root is spelled the way its explorer names it (`A#` major is `Bb`).
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
import { describe, expect, it } from 'vitest'
import { i18n } from '@/shared/i18n'
import { useStepTitle } from './use-step-title'

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

(The test setup puts i18next back on English after every test.)

Run: `npx vitest run src/entities/path/ui`
Expected: FAIL.

- [ ] **Step 3: Implement `use-step-title.ts`**

```ts
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { entryTitles, pieceById } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import type { PathStep } from '../model/types'

export type StepKind = 'chords' | 'scale' | 'exercise' | 'song' | 'progression'

export interface StepTitle {
  readonly primary: string
  readonly secondary?: string
  readonly kind: StepKind
}

/** A step's name in the learner's locale, and what kind of step it is. */
export function useStepTitle(): (step: PathStep) => StepTitle {
  const { t } = useTranslation('theory')
  const locale = useLocale()
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
          return { ...entryTitles(piece, locale), kind: piece.kind }
        }
      }
    },
    [t, locale],
  )
}
```

Export `useStepTitle, type StepKind, type StepTitle` from `src/entities/path/index.ts`. Run the test. Expected: PASS.

- [ ] **Step 4: The view types, in the slices that own them**

`src/widgets/chord-explorer/model/chord-view.ts`:

```ts
import type { ChordQuality } from '@/shared/lib/music'

/** What the Chords explorer shows. `root` is a note as a URL writes it (`Bb`). */
export interface ChordView {
  readonly root: string
  readonly quality: ChordQuality
  readonly inversion: number
  readonly hands: 'rh' | 'both'
}
```

`src/widgets/scale-explorer/model/scale-view.ts`:

```ts
import type { ScaleKind } from '@/shared/lib/music'
import type { Hands, PracticeRhythm } from '@/shared/lib/schedule'

/** What the Scales explorer shows: the scale, how its keys are labelled, and how it is practised. */
export interface ScaleView {
  readonly root: string
  readonly kind: ScaleKind
  /** The keys' labels: degrees, or one hand's fingers. */
  readonly view: 'degrees' | 'rh' | 'lh'
  readonly rhythm: PracticeRhythm
  readonly tempo: number
  readonly hands: Hands
  /** Triads or 7th chords in "chords in this scale". */
  readonly chords: 3 | 4
}
```

`src/widgets/player-setup/model/setup-params.ts`:

```ts
import type { LeftFigureId, PatternId, RightFigureId } from '@/entities/pattern'
import type { Voicing } from '@/entities/piece'
import type { Hands } from '@/shared/lib/schedule'

/** The Setup sheet's choices as the Player's URL holds them: an absent one is the piece's own. */
export interface SetupParams {
  readonly key?: string
  readonly tempo?: number
  readonly hands: Hands
  readonly pattern?: PatternId | 'chart'
  readonly rh?: RightFigureId
  readonly lh?: LeftFigureId
  readonly voicing?: Voicing
}

/** What one control in the sheet changes; a field set to `undefined` goes back to the piece's own. */
export type SetupChange = Partial<SetupParams>
```

`src/pages/songs/model/songs-filter.ts`:

```ts
import type { Level } from '@/entities/path'
import type { CollectionId } from '@/entities/piece'

/** What narrows the Songs list: the search, one collection, one level. */
export interface SongsFilter {
  readonly q: string
  readonly collection: CollectionId | 'all'
  readonly level: Level | 'any'
}
```

`src/pages/player/model/player-search.ts`:

```ts
import type { PracticeMode } from '@/features/practice'
import type { SetupParams } from '@/widgets/player-setup'

/** The Player's URL: the setup, and the mode it practises in. */
export type PlayerSearch = SetupParams & { readonly mode: PracticeMode }
```

Each slice's `index.ts` exports its type (`export type { ChordView } from './model/chord-view'` and so on; the two
page slices add theirs beside their page). In `features/practice/practice-machine.ts`, write the modes once:

```ts
export const PRACTICE_MODES = ['listen', 'step', 'turn'] as const
export type PracticeMode = (typeof PRACTICE_MODES)[number]
```

and export `PRACTICE_MODES` from `features/practice/index.ts`.

- [ ] **Step 5: Write the failing validator tests**

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
    expect(validateScalesSearch(raw({ root: 'Eb', kind: 'harmonic', chords: 4 }))).toMatchObject({
      root: 'Eb',
      kind: 'harmonic',
      chords: 4,
    })
  })

  it('drop anything stale or hand-edited back to its default, without clamping', () => {
    expect(
      validatePlayerSearch(raw({ key: 'H', tempo: 999, mode: 'dance', pattern: 'waltz', rh: 'zz', voicing: 'elevenths' })),
    ).toEqual(PLAYER_DEFAULTS)
    expect(validateChordsSearch(raw({ quality: 'maj13', inversion: 7, step: 'scale:major' }))).toEqual(
      CHORDS_DEFAULTS,
    )
    expect(validateChordsSearch(raw({ quality: 'maj', inversion: 3 })).inversion).toBe(0)
    expect(validateScalesSearch(raw({ kind: 'dorian', tempo: 10, chords: 5, step: 'chords:tri' }))).toEqual(
      SCALES_DEFAULTS,
    )
    expect(validateCheckSearch(raw({ of: 'nothing:here' }))).toEqual({})
  })

  it('spell a root the way its explorer names it', () => {
    expect(validateChordsSearch(raw({ root: 'A#', quality: 'maj' })).root).toBe('Bb')
    expect(validatePlayerSearch(raw({ key: 'B♭' })).key).toBe('Bb')
  })
})
```

Run: `npx vitest run src/app/routes/search.test.ts`
Expected: FAIL.

- [ ] **Step 6: Implement `src/app/routes/search.ts`**

```ts
import type { SearchSchemaInput } from '@tanstack/react-router'
import { isStepId, LEVELS, type Level, type StepId } from '@/entities/path'
import { isLeftFigureId, isPatternId, isRightFigureId, type PatternId } from '@/entities/pattern'
import { COLLECTIONS, VOICINGS, type CollectionId } from '@/entities/piece'
import { PRACTICE_MODES } from '@/features/practice'
import { THEORY_QUIZZES, type TheoryQuiz } from '@/features/quiz'
import type { PlayerSearch } from '@/pages/player'
import type { SongsFilter } from '@/pages/songs'
import { isOneOf, readNote, valueOr, wholeIn } from '@/shared/lib'
import {
  CHORD_QUALITIES,
  chordRootSpelling,
  lastInversion,
  noteParam,
  pitchClassOf,
  SCALE_KINDS,
  scaleRootSpelling,
  type ChordFamily,
  type ScaleKind,
} from '@/shared/lib/music'
import { PRACTICE_RHYTHM_IDS, type Hands } from '@/shared/lib/schedule'
import type { ChordView } from '@/widgets/chord-explorer'
import type { ScaleView } from '@/widgets/scale-explorer'

/**
 * What the router hands a validator. Links may pass any subset of the params; each validator reads
 * the input as `Record<string, unknown>`, because a URL can hold anything in any of them.
 */
type Input<S> = Partial<S> & SearchSchemaInput
type Raw = Readonly<Record<string, unknown>>

const isHands = isOneOf<Hands>(['both', 'rh', 'lh'])
const isQuality = isOneOf(CHORD_QUALITIES)
const isScaleKind = isOneOf(SCALE_KINDS)
const isVoicing = isOneOf(VOICINGS)
const isCollection = isOneOf<CollectionId | 'all'>([...COLLECTIONS.map((c) => c.id), 'all'])
const isLevel = isOneOf<Level | 'any'>([...LEVELS, 'any'])
const isPlayerPattern = (value: unknown): value is PatternId | 'chart' =>
  value === 'chart' || isPatternId(value)

// Songs
export const SONGS_DEFAULTS: SongsFilter = { q: '', collection: 'all', level: 'any' }
export function validateSongsSearch(input: Input<SongsFilter>): SongsFilter {
  const raw: Raw = input
  return {
    q: typeof raw.q === 'string' ? raw.q : SONGS_DEFAULTS.q,
    collection: valueOr(isCollection, raw.collection, SONGS_DEFAULTS.collection),
    level: valueOr(isLevel, raw.level, SONGS_DEFAULTS.level),
  }
}

// Theory → Chords
export type ChordsStepId = `chords:${ChordFamily}`
export type ChordsSearch = ChordView & { readonly step?: ChordsStepId }
export const CHORDS_DEFAULTS: ChordsSearch = { root: 'C', quality: 'maj', inversion: 0, hands: 'rh' }
const isChordHands = isOneOf<ChordView['hands']>(['rh', 'both'])
const isChordsStep = (value: unknown): value is ChordsStepId =>
  isStepId(value) && value.startsWith('chords:')
export function validateChordsSearch(input: Input<ChordsSearch>): ChordsSearch {
  const raw: Raw = input
  const quality = valueOr(isQuality, raw.quality, CHORDS_DEFAULTS.quality)
  const root = readNote(raw.root)
  return {
    root: root ? noteParam(chordRootSpelling(pitchClassOf(root), quality)) : CHORDS_DEFAULTS.root,
    quality,
    inversion: wholeIn(raw.inversion, 0, lastInversion(quality), CHORDS_DEFAULTS.inversion),
    hands: valueOr(isChordHands, raw.hands, CHORDS_DEFAULTS.hands),
    ...(isChordsStep(raw.step) ? { step: raw.step } : {}),
  }
}

// Theory → Scales
export type ScaleStepId = `scale:${ScaleKind}`
export type ScalesSearch = ScaleView & { readonly step?: ScaleStepId }
export const SCALES_DEFAULTS: ScalesSearch = {
  root: 'C',
  kind: 'major',
  view: 'degrees',
  rhythm: 'even',
  tempo: 80,
  hands: 'rh',
  chords: 3,
}
const isScaleLabels = isOneOf<ScaleView['view']>(['degrees', 'rh', 'lh'])
const isChordSize = isOneOf<ScaleView['chords']>([3, 4])
const isScaleStep = (value: unknown): value is ScaleStepId =>
  isStepId(value) && value.startsWith('scale:')
export function validateScalesSearch(input: Input<ScalesSearch>): ScalesSearch {
  const raw: Raw = input
  const kind = valueOr(isScaleKind, raw.kind, SCALES_DEFAULTS.kind)
  const root = readNote(raw.root)
  return {
    root: root ? noteParam(scaleRootSpelling(pitchClassOf(root), kind)) : SCALES_DEFAULTS.root,
    kind,
    view: valueOr(isScaleLabels, raw.view, SCALES_DEFAULTS.view),
    rhythm: valueOr(isOneOf(PRACTICE_RHYTHM_IDS), raw.rhythm, SCALES_DEFAULTS.rhythm),
    tempo: wholeIn(raw.tempo, 40, 160, SCALES_DEFAULTS.tempo),
    hands: valueOr(isHands, raw.hands, SCALES_DEFAULTS.hands),
    chords: valueOr(isChordSize, raw.chords, SCALES_DEFAULTS.chords),
    ...(isScaleStep(raw.step) ? { step: raw.step } : {}),
  }
}

// Theory → Quiz
export interface QuizSearch {
  readonly mode: TheoryQuiz
}
export const QUIZ_DEFAULTS: QuizSearch = { mode: 'build-chord' }
export function validateQuizSearch(input: Input<QuizSearch>): QuizSearch {
  const raw: Raw = input
  return { mode: valueOr(isOneOf(THEORY_QUIZZES), raw.mode, QUIZ_DEFAULTS.mode) }
}

// Check
export interface CheckSearch {
  readonly of?: StepId
}
export function validateCheckSearch(input: Input<CheckSearch>): CheckSearch {
  const raw: Raw = input
  return isStepId(raw.of) ? { of: raw.of } : {}
}

// Player: key, tempo, pattern and voicing default to the piece's own, so their absence is the default.
export const PLAYER_DEFAULTS: PlayerSearch = { hands: 'both', mode: 'listen' }
export function validatePlayerSearch(input: Input<PlayerSearch>): PlayerSearch {
  const raw: Raw = input
  const key = readNote(raw.key)
  const tempo = wholeIn(raw.tempo, 40, 160, undefined)
  return {
    ...(key ? { key: noteParam(key) } : {}),
    ...(tempo === undefined ? {} : { tempo }),
    hands: valueOr(isHands, raw.hands, PLAYER_DEFAULTS.hands),
    mode: valueOr(isOneOf(PRACTICE_MODES), raw.mode, PLAYER_DEFAULTS.mode),
    ...(isPlayerPattern(raw.pattern) ? { pattern: raw.pattern } : {}),
    ...(isRightFigureId(raw.rh) ? { rh: raw.rh } : {}),
    ...(isLeftFigureId(raw.lh) ? { lh: raw.lh } : {}),
    ...(isVoicing(raw.voicing) ? { voicing: raw.voicing } : {}),
  }
}
```

(`isStepId` accepts `piece:gone`; the Check route rejects it in `beforeLoad` through `checkPlan`, Task 18. The Player's
key is spelled for the piece's mode by `resolveChoice`, Task 26, which knows the piece.)

Run the tests. Expected: PASS.

- [ ] **Step 7: Wire the router**

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

- [ ] **Step 8: Verify and commit**

Run: `npm run typecheck && npm run lint && npm run test && npm run build`
Expected: all green, and the screens still build into their own `*-screens` chunks. The router reaches pages and
widgets only through types: `grep -n "from '@/\(pages\|widgets\)" src/app/routes/search.ts src/app/router.tsx` lists
only `import type` lines, which the compiler erases, and the not-found page, which is eager by design.

```bash
npx prettier --write src/entities/path src/widgets src/pages/songs src/pages/player src/features/practice src/app src/shared/i18n/locales
git add src/entities/path src/widgets src/pages/songs src/pages/player src/features/practice src/app src/shared/i18n
git commit -m "Name steps, chords and scales, and let every route read its search params

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 17: The quiz board and Theory → Quiz

**Files:**
- Create: `src/widgets/quiz-board/{index.ts,ui/QuizBoard.tsx,ui/QuizBoard.test.tsx}`,
  `src/widgets/quiz-choice/{index.ts,ui/QuizChoiceSheet.tsx,ui/QuizChoiceSheet.test.tsx}`,
  `src/pages/theory-quiz/ui/TheoryQuizPage.test.tsx`
- Modify: `src/pages/theory-quiz/ui/TheoryQuizPage.tsx`, `src/shared/i18n/locales/{en,ru}/quiz.ts`

**Interfaces:**
- Consumes: `useQuiz`, `Quiz`, `answerKeys`, `quizKeyboardRange`, `targetKeys`, `myGaps`, `THEORY_QUIZZES`,
  `theoryQuizConfig`, `TheoryQuiz`, `QuizMode` (Task 15); `PianoKeyboard`, `Segmented`, `Sheet`, `SheetContent`;
  `DrawerTrigger`, `DrawerClose`; `selectQuizChoice`, `useSettings`, `useSettingsStoreApi`, `DEFAULT_QUIZ_CHOICE`;
  `setQuizFamilies`, `setQuizScales`; `selectQuizStats`, `useProgressStoreApi`.
- Produces: `QuizBoard({ quiz, onDone }: { quiz: Quiz; onDone?: () => void })` — when the quiz is finished and
  answered, its action button says Done and calls `onDone`; `QuizChoiceSheet({ mode }: { mode: QuizMode })` — the
  trigger button and the sheet; Apply is disabled while the list the current mode asks from (chord families for the
  chord modes, scales for Build scale) is empty.

- [ ] **Step 1: Strings**

The placeholder's `title` goes: the Theory header and its Quiz tab name the screen.

`en/quiz.ts`:

```ts
export const quiz = {
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
export const quiz: LocaleResources['quiz'] = {
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
}
```

(keeping the module's `import type { LocaleResources } from '../../types'`, as every Russian module does.)

- [ ] **Step 2: Write the failing board tests**

`QuizBoard.test.tsx` (renders the board around a real `useQuiz` with a fixed random):

```tsx
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { createProgressStore, ProgressStoreProvider } from '@/entities/progress'
import { useQuiz, type QuizConfig } from '@/features/quiz'
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
  it('asks to build a chord, fills the chosen keys and answers a right build', async () => {
    const user = userEvent.setup()
    renderBoard({ chordMode: 'build-chord', scope: { skills: ['chord:maj'], roots: C } })
    expect(screen.getByRole('heading', { name: 'Build C' })).toBeInTheDocument()
    const check = screen.getByRole('button', { name: 'Check' })
    expect(check).toBeDisabled()
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    await user.click(within(keyboard).getByRole('button', { name: 'C4' }))
    expect(within(keyboard).getByRole('button', { name: 'C4' })).toHaveClass('bg-primary')
    for (const name of ['E4', 'G4']) await user.click(within(keyboard).getByRole('button', { name }))
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
    await user.click(within(answers).getByRole('button', { name: 'C7' }))
    expect(screen.getByText('Right')).toBeInTheDocument()
  })

  it('asks to build a scale', () => {
    renderBoard({ chordMode: 'build-chord', scope: { skills: ['scale:harmonic'], roots: [pitchClass(9)] } })
    expect(screen.getByRole('heading', { name: 'Build A harmonic minor' })).toBeInTheDocument()
  })
})
```

Run: `npx vitest run src/widgets/quiz-board`
Expected: FAIL.

- [ ] **Step 3: Implement `QuizBoard.tsx`**

```tsx
import { Volume2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { answerKeys, quizKeyboardRange, targetKeys, type Quiz } from '@/features/quiz'
import { noteName } from '@/shared/lib/music'
import { PianoKeyboard, RoundButton } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** One question at a time: the prompt, the keyboard, the answer, and one action. */
export function QuizBoard({ quiz, onDone }: { quiz: Quiz; onDone?: () => void }) {
  const { t } = useTranslation(['quiz', 'theory', 'common'])
  const { question, selected, result } = quiz.state
  if (!question) return null

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
  // Building shows the chosen keys, then the answer on them; naming shows the chord it plays.
  const answer = result && building ? answerKeys(question, selected) : null

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
        range={quizKeyboardRange(question)}
        className="h-44"
        selectable={building && !result}
        selected={building && !result ? new Set(selected) : undefined}
        lit={building ? undefined : new Set(targetKeys(question))}
        marks={answer?.marks}
        outlined={answer?.outlined}
        wrong={answer?.wrong}
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
          <Button size="pill" className="flex-1" disabled={selected.length === 0} onClick={quiz.check}>
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

Run the tests. Expected: PASS.

- [ ] **Step 4: Write the failing choice-sheet tests, then implement**

`QuizChoiceSheet.test.tsx`:

```tsx
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { QuizChoiceSheet } from './QuizChoiceSheet'

describe('QuizChoiceSheet', () => {
  it('saves the chosen families and scales on Apply', async () => {
    const user = userEvent.setup()
    const { settingsStore } = renderWithSettings(<QuizChoiceSheet mode="build-chord" />)
    await user.click(screen.getByRole('button', { name: 'Chords and scales' }))
    await user.click(screen.getByRole('switch', { name: 'Triads' }))
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    expect(settingsStore.getState().quiz.families).toEqual(['tri', 'sev', 'nin'])
  })

  it('cannot apply without anything for the current mode to ask', async () => {
    const user = userEvent.setup()
    renderWithSettings(<QuizChoiceSheet mode="build-chord" />)
    await user.click(screen.getByRole('button', { name: 'Chords and scales' }))
    await user.click(screen.getByRole('button', { name: 'Clear all' }))
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()
  })

  it('lets a chord quiz apply with no scales chosen, keeping the saved scales', async () => {
    const user = userEvent.setup()
    const { settingsStore } = renderWithSettings(<QuizChoiceSheet mode="name-chord" />)
    const scales = settingsStore.getState().quiz.scales
    await user.click(screen.getByRole('button', { name: 'Chords and scales' }))
    for (const name of ['Major', 'Natural minor', 'Harmonic minor']) {
      await user.click(screen.getByRole('switch', { name }))
    }
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    expect(settingsStore.getState().quiz.scales).toEqual(scales)
  })
})
```

(The saved choice never becomes empty: `setQuizScales` refuses an empty list, spec §7.)

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
import type { QuizMode } from '@/features/quiz'
import { setQuizFamilies, setQuizScales } from '@/features/set-preference'
import { CHORD_FAMILIES, SCALE_KINDS } from '@/shared/lib/music'
import { Sheet, SheetContent } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { DrawerClose, DrawerTrigger } from '@/shared/ui/primitives/drawer'
import { Switch } from '@/shared/ui/primitives/switch'

const toggled = <T,>(list: readonly T[], item: T, on: boolean): T[] =>
  on ? [...list, item] : list.filter((x) => x !== item)

/** What a mode asks from: chord families for building or naming chords, scales for Build scale. */
const asksFrom = (mode: QuizMode, choice: QuizChoice): readonly unknown[] =>
  mode === 'build-scale' ? choice.scales : choice.families

/** Which chord families and scales the open-ended quiz asks: switches, then Apply. */
export function QuizChoiceSheet({ mode }: { mode: QuizMode }) {
  const { t } = useTranslation(['quiz', 'theory', 'common'])
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
      <DrawerTrigger render={<Button variant="soft" />}>
        <SlidersHorizontal data-icon="inline-start" />
        {t('quiz:choice.open')}
      </DrawerTrigger>
      <SheetContent
        title={t('quiz:choice.open')}
        footer={
          <Button size="pill" onClick={apply} disabled={asksFrom(mode, draft).length === 0}>
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
        <DrawerClose className="sr-only">{t('common:close')}</DrawerClose>
      </SheetContent>
    </Sheet>
  )
}
```

(`min-h-13` is 52px on Tailwind v4's spacing scale. The close button is for screen readers; everyone else swipes the
sheet down or taps outside it.) Run the sheet tests. Expected: PASS. If Base UI's drawer calls a pointer API that
jsdom lacks, the test fails with that API's name: add the smallest stub for it to `src/shared/test/setup.ts`, with a
comment naming the API and why jsdom needs it.

- [ ] **Step 5: The Theory → Quiz page**

`TheoryQuizPage.tsx`:

```tsx
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { selectQuizStats, useProgress, useProgressStoreApi } from '@/entities/progress'
import { selectQuizChoice, useSettings } from '@/entities/settings'
import {
  myGaps,
  THEORY_QUIZZES,
  theoryQuizConfig,
  useQuiz,
  type QuizConfig,
  type QuizMode,
  type TheoryQuiz,
} from '@/features/quiz'
import { Segmented } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { QuizBoard } from '@/widgets/quiz-board'
import { QuizChoiceSheet } from '@/widgets/quiz-choice'

function Quiz({ config }: { config: QuizConfig }) {
  return <QuizBoard quiz={useQuiz(config)} />
}

/** A mode over the chosen families or scales; a new choice starts it again. */
function ChoiceQuiz({ mode }: { mode: QuizMode }) {
  const choice = useSettings(selectQuizChoice)
  const config = theoryQuizConfig(mode, choice, [])
  return <Quiz key={config.scope.skills.join(',')} config={config} />
}

/**
 * My gaps, read once when the tab opens: an answer that turns a gap known must not restart the
 * quiz under the learner.
 */
function GapsQuiz({ onWholeQuiz }: { onWholeQuiz: () => void }) {
  const { t } = useTranslation('quiz')
  const progress = useProgressStoreApi()
  const choice = useSettings(selectQuizChoice)
  const [gaps] = useState(() => {
    const { answers, practised } = progress.getState()
    return myGaps(answers, practised)
  })
  if (gaps.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-lg">{t('gaps.none')}</p>
        <Button variant="soft" onClick={onWholeQuiz}>
          {t('gaps.whole')}
        </Button>
      </div>
    )
  }
  return <Quiz config={theoryQuizConfig('gaps', choice, gaps)} />
}

export function TheoryQuizPage() {
  const { t } = useTranslation('quiz')
  const { mode } = useSearch({ from: '/shell/theory/quiz' })
  const navigate = useNavigate({ from: '/theory/quiz' })
  const stats = useProgress(selectQuizStats)
  const setMode = (next: TheoryQuiz) => void navigate({ search: { mode: next }, replace: true })

  return (
    <div className="flex flex-col gap-6">
      <Segmented
        label={t('modes.label')}
        value={mode}
        options={THEORY_QUIZZES.map((quiz) => ({ value: quiz, label: t(`modes.${quiz}`) }))}
        onChange={setMode}
      />
      {mode === 'gaps' ? (
        <GapsQuiz onWholeQuiz={() => setMode('build-chord')} />
      ) : (
        <ChoiceQuiz key={mode} mode={mode} />
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
        {mode === 'gaps' ? null : <QuizChoiceSheet mode={mode} />}
      </div>
    </div>
  )
}
```

The screen's test sits beside the page and runs the whole app through `renderApp`:

```tsx
// src/pages/theory-quiz/ui/TheoryQuizPage.test.tsx
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

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
npx prettier --write src/widgets/quiz-board src/widgets/quiz-choice src/pages/theory-quiz src/shared/i18n/locales
git add src/widgets src/pages/theory-quiz src/shared
git commit -m "Build the quiz board and the Theory quiz with its choice sheet and My gaps

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 18: The Check

**Files:**
- Create: `src/pages/check/{index.ts,ui/CheckPage.tsx,ui/CheckResult.tsx,ui/CheckPage.test.tsx}`
- Modify: `src/app/router.tsx`, `src/app/routes/theory-screens.ts`, `src/app/router.test.tsx` (route list)

**Interfaces:**
- Consumes: `checkPlan`, `useQuiz`, `QuizBoard`, `validateCheckSearch`, `useStepTitle`, `RatingMark`,
  `selectAllAnswers`, `selectIsLearned`, `ratingOf`, `Progress` primitive, `skillOf`.
- Produces: route `/check` (id `/full-screen/check`), `CheckPage`.

- [ ] **Step 1: Write the failing screen tests**

`src/pages/check/ui/CheckPage.test.tsx`:

```tsx
import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { recordAnswer } from '@/features/record-answer'
import { chordSkill, qualitiesIn } from '@/shared/lib/music'

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

Run: `npx vitest run src/pages/check`
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
import { ratingOf, selectAllAnswers, selectIsLearned, useProgress } from '@/entities/progress'
import type { CheckPlan } from '@/features/quiz'
import { skillOf } from '@/shared/lib/music'
import { RatingMark } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** The score, each skill's rating with a way to the explorer for a gap, and whether the step is now learned. */
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
          const rating = ratingOf(answers, skillId)
          const name =
            skill.kind === 'chord' ? t(`theory:quality.${skill.quality}`) : t(`theory:scaleKind.${skill.scale}`)
          return (
            <li key={skillId} className="flex min-h-14 items-center gap-3 px-4">
              <RatingMark rating={rating} />
              <span className="flex-1">{name}</span>
              {rating === 'known' ? null : (
                <Button
                  variant="link"
                  className="px-0"
                  nativeButton={false}
                  render={
                    skill.kind === 'chord' ? (
                      <Link to="/theory/chords" search={{ quality: skill.quality }} />
                    ) : (
                      <Link to="/theory/scales" search={{ kind: skill.scale }} />
                    )
                  }
                >
                  {skill.kind === 'chord' ? t('openChords') : t('openScales')}
                </Button>
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
- Create: `src/widgets/chord-explorer/ui/ChordExplorer.tsx`, `src/widgets/step-panel/{index.ts,ui/StepPanel.tsx}`,
  `src/pages/theory-chords/ui/TheoryChordsPage.test.tsx`
- Modify: `src/widgets/chord-explorer/index.ts`, `src/pages/theory-chords/ui/TheoryChordsPage.tsx`,
  `src/shared/i18n/locales/{en,ru}/theory.ts`

**Interfaces:**
- Consumes: `ChordView` (Task 16); `placeChord`, `lastInversion`, `chordRootSpelling`, `chordSymbol`, `qualitiesIn`,
  `chordFamily`, `CHORD_FAMILIES`, `qualitySuffix`, `spellChord`, `noteParam`, `noteFromParam`, `keyboardRange`;
  `usePlayChord`; `PianoKeyboard`, `ChipRow`, `Segmented`, `RoleLegend`, `ROLE_BG`; `LearnedToggle`; `useStepTitle`.
- Produces:
  - `ChordExplorer({ chord, onChange }: { chord: ChordView; onChange: (change: Partial<ChordView>) => void })` —
    every change also sounds the new chord.
  - `StepPanel({ step }: { step: StepId })`

- [ ] **Step 1: Strings** — `theory`: `root: 'Root'`, `familyLabel: 'Chord family'`, `qualityLabel: 'Chord'`,
  `inversionLabel: 'Inversion'`, `inversion: { 0: 'Root', 1: '1st', 2: '2nd', 3: '3rd' }`, `handsLabel: 'Hands'`,
  `play: 'Play'`, `arpeggio: 'Arpeggio'`, `checkYourself: 'Check yourself'`, `major: 'M'` (the chip label of the
  major triad, whose suffix is empty); ru: `root: 'Основной тон'`, `familyLabel: 'Группа'`, `qualityLabel: 'Аккорд'`,
  `inversionLabel: 'Обращение'`, `inversion: { 0: 'Основной', 1: '1-е', 2: '2-е', 3: '3-е' }`, `handsLabel: 'Руки'`,
  `play: 'Сыграть'`, `arpeggio: 'Арпеджио'`, `checkYourself: 'Проверить себя'`, `major: 'M'`.

- [ ] **Step 2: Write the failing screen tests**

`src/pages/theory-chords/ui/TheoryChordsPage.test.tsx`:

```tsx
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import type { FakeAudio } from '@/shared/api/audio'

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

  it('offers only the inversions the chord has', async () => {
    renderApp('/theory/chords?quality=maj')
    const inversions = await screen.findByRole('group', { name: 'Inversion' })
    expect(within(inversions).getAllByRole('button').map((b) => b.textContent)).toEqual(['Root', '1st', '2nd'])
  })

  it('opened from a path step, offers its check and its learned toggle', async () => {
    const user = userEvent.setup()
    const { progressStore } = renderApp('/theory/chords?quality=maj7&step=chords:sev')
    const check = await screen.findByRole('link', { name: 'Check yourself' })
    expect(check.getAttribute('href')).toMatch(/^\/check\?of=chords(%3A|:)sev$/)
    await user.click(screen.getByRole('button', { name: 'Learned' }))
    expect(progressStore.getState().learned['chords:sev']).toBeDefined()
  })
})
```

Run: `npx vitest run src/pages/theory-chords`
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
import { cn } from '@/shared/lib'
import {
  CHORD_FAMILIES,
  chordFamily,
  chordRootSpelling,
  chordSymbol,
  keyboardRange,
  lastInversion,
  MIDDLE_C,
  midi,
  noteFromParam,
  noteName,
  noteParam,
  pitchClass,
  placeChord,
  qualitiesIn,
  qualitySuffix,
  spellChord,
  type KeyRange,
  type Midi,
} from '@/shared/lib/music'
import { usePlayChord } from '@/shared/lib/services'
import { ChipRow, PianoKeyboard, ROLE_BG, RoleLegend, Segmented, type KeyMark } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import type { ChordView } from '../model/chord-view'

const PITCH_CLASSES = Array.from({ length: 12 }, (_, pc) => pitchClass(pc))
/** Two octaves from middle C: the keyboard grows past them only for a chord that needs it. */
const AT_LEAST: KeyRange = { from: MIDDLE_C, to: midi(83) }
const INVERSIONS = [0, 1, 2, 3] as const

/** Any chord on any root: its keys by role and degree, inversions, one hand or two, played. */
export function ChordExplorer({
  chord,
  onChange,
}: {
  chord: ChordView
  onChange: (change: Partial<ChordView>) => void
}) {
  const { t } = useTranslation(['theory', 'common'])
  const playChord = usePlayChord()
  const root = noteFromParam(chord.root)
  const placed = placeChord(root, chord.quality, {
    inversion: chord.inversion,
    bothHands: chord.hands === 'both',
  })
  const keys = [...placed.lh, ...placed.rh]
  const tones = spellChord(root, chord.quality)
  const family = chordFamily(chord.quality)
  const marks = new Map<Midi, KeyMark>(
    keys.map((key) => [key.midi, { tone: key.tone.role, label: key.tone.degree }]),
  )
  const sound = (view: ChordView, arpeggio = false) =>
    playChord(
      { root: noteFromParam(view.root), quality: view.quality },
      { inversion: view.inversion, bothHands: view.hands === 'both', arpeggio },
    )
  const change = (next: Partial<ChordView>) => {
    onChange(next)
    sound({ ...chord, ...next })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-6xl font-extrabold tracking-tight">
          {chordSymbol({ root, quality: chord.quality })}
        </h2>
        <p className="text-right text-muted-foreground">{t(`theory:quality.${chord.quality}`)}</p>
      </div>
      <ChipRow
        label={t('theory:root')}
        value={chord.root}
        options={PITCH_CLASSES.map((pc) => {
          const spelled = chordRootSpelling(pc, chord.quality)
          return { value: noteParam(spelled), label: noteName(spelled) }
        })}
        onChange={(value) => change({ root: value })}
      />
      <ChipRow
        label={t('theory:familyLabel')}
        value={family}
        options={CHORD_FAMILIES.map((f) => ({ value: f, label: t(`theory:family.${f}`) }))}
        onChange={(next) => {
          const [first] = qualitiesIn(next)
          if (first) change({ quality: first, inversion: 0 })
        }}
      />
      <ChipRow
        label={t('theory:qualityLabel')}
        value={chord.quality}
        options={qualitiesIn(family).map((q) => ({
          value: q,
          label: qualitySuffix(q) || t('theory:major'),
          title: t(`theory:quality.${q}`),
        }))}
        onChange={(quality) => change({ quality, inversion: 0 })}
      />
      <PianoKeyboard
        label={t('common:keyboard')}
        range={keyboardRange(
          keys.map((key) => key.midi),
          AT_LEAST,
        )}
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
            <span
              className={cn(
                'grid size-7 place-items-center rounded-full text-sm font-bold text-on-role',
                ROLE_BG[tone.role],
              )}
            >
              {tone.degree}
            </span>
            <span className="font-semibold">{noteName(tone.note)}</span>
          </li>
        ))}
      </ol>
      <Segmented
        label={t('theory:inversionLabel')}
        value={chord.inversion}
        options={INVERSIONS.filter((n) => n <= lastInversion(chord.quality)).map((n) => ({
          value: n,
          label: t(`theory:inversion.${n}`),
        }))}
        onChange={(inversion) => change({ inversion })}
      />
      <Segmented
        label={t('theory:handsLabel')}
        value={chord.hands}
        options={[
          { value: 'rh', label: t('common:hands.rh') },
          { value: 'both', label: t('common:hands.both') },
        ]}
        onChange={(hands) => change({ hands })}
      />
      <div className="flex gap-3">
        <Button size="pill" className="flex-1" onClick={() => sound(chord)}>
          {t('theory:play')}
        </Button>
        <Button size="pill" variant="soft" className="flex-1" onClick={() => sound(chord, true)}>
          {t('theory:arpeggio')}
        </Button>
      </div>
    </div>
  )
}
```

Add `export { ChordExplorer } from './ui/ChordExplorer'` to `src/widgets/chord-explorer/index.ts`.

`TheoryChordsPage.tsx`:

```tsx
import { useNavigate, useSearch } from '@tanstack/react-router'
import { ChordExplorer, type ChordView } from '@/widgets/chord-explorer'
import { StepPanel } from '@/widgets/step-panel'

export function TheoryChordsPage() {
  const { step, ...chord } = useSearch({ from: '/shell/theory/chords' })
  const navigate = useNavigate({ from: '/theory/chords' })
  const onChange = (change: Partial<ChordView>) =>
    void navigate({ search: (prev) => ({ ...prev, ...change }), replace: true })
  return (
    <div className="flex flex-col gap-6">
      {step ? <StepPanel step={step} /> : null}
      <ChordExplorer chord={chord} onChange={onChange} />
    </div>
  )
}
```

Run the tests. Expected: PASS. The router test `opens a deep link to a Theory section with its tab selected` looks for
a level-2 heading "Scales" from the old placeholder; the explorers' level-2 headings are chord and scale names now,
so that test asserts the selected tab only.

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
- Create: `src/widgets/scale-explorer/{ui/ScaleExplorer.tsx,ui/FingeringTable.tsx,ui/ScaleChords.tsx,ui/ScaleFacts.tsx,
  model/use-lit-key.ts}`, `src/pages/theory-scales/ui/TheoryScalesPage.test.tsx`
- Modify: `src/widgets/scale-explorer/index.ts`, `src/pages/theory-scales/ui/TheoryScalesPage.tsx`,
  `src/shared/i18n/locales/{en,ru}/theory.ts`

**Interfaces:**
- Consumes: `ScaleView` (Task 16); `placeScale`, `spellScale`, `scaleRootSpelling`, `scaleFingering`, `scaleGaps`,
  `relativeScale`, `diatonicChords`, `chordSymbol`, `noteName`, `noteParam`, `noteFromParam`, `pitchClassOf`,
  `keyboardRange`, `SCALE_KINDS`; `scaleRun`, `PRACTICE_RHYTHM_IDS`, `type Cue`; `usePlay`, `usePlayChord`,
  `useServices`; kit.
- Produces: `ScaleExplorer({ scale, onChange }: { scale: ScaleView; onChange: (change: Partial<ScaleView>) => void })`;
  `useLitKey(): { lit: Midi | null; light(cues: readonly Cue[], startsIn: number, end: number): void }`.

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
  about: { formula: 'Formula', gaps: 'Structure', relative: 'Relative' },
  gap: { W: 'W', H: 'H', 'W+H': 'W+H' },
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
  about: { formula: 'Формула', gaps: 'Строение', relative: 'Параллельная' },
  gap: { W: 'Т', H: 'П', 'W+H': 'Т+П' },
```

(A scale's structure is written in whole and half steps: W and H in English, тон and полутон, Т and П, in Russian.)

- [ ] **Step 2: Write the failing screen tests**

`src/pages/theory-scales/ui/TheoryScalesPage.test.tsx`:

```tsx
import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import type { FakeAudio } from '@/shared/api/audio'

describe('Theory → Scales', () => {
  it('spells E♭ harmonic minor with its C♭ and names its structure', async () => {
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
      expect(within(keyboard).getByRole('button', { name: 'C4' })).toHaveClass('bg-primary')
    })
  })
})
```

Run: `npx vitest run src/pages/theory-scales`
Expected: FAIL.

- [ ] **Step 3: Implement**

`model/use-lit-key.ts`:

```ts
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Midi } from '@/shared/lib/music'
import type { Cue } from '@/shared/lib/schedule'

/** The key sounding now in a scale run, lit in time with the audio; cleared when the run ends. */
export function useLitKey(): {
  lit: Midi | null
  light: (cues: readonly Cue[], startsIn: number, end: number) => void
} {
  const [lit, setLit] = useState<Midi | null>(null)
  const timers = useRef<number[]>([])
  const clear = useCallback(() => {
    for (const timer of timers.current) window.clearTimeout(timer)
    timers.current = []
  }, [])
  useEffect(() => clear, [clear])
  const light = useCallback(
    (cues: readonly Cue[], startsIn: number, end: number) => {
      clear()
      for (const cue of cues)
        timers.current.push(window.setTimeout(() => setLit(cue.midi), (startsIn + cue.at) * 1000))
      timers.current.push(window.setTimeout(() => setLit(null), (startsIn + end) * 1000))
    },
    [clear],
  )
  return { lit, light }
}
```

`ui/FingeringTable.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import type { Finger } from '@/shared/lib/music'

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

`ui/ScaleChords.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { chordSymbol, diatonicChords, type Tone } from '@/shared/lib/music'
import { usePlayChord } from '@/shared/lib/services'
import { Segmented } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

const SIZES = [3, 4] as const

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
  const playChord = usePlayChord()
  const chords = diatonicChords(scale, size)
  if (chords.length === 0) return null
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xl font-bold">{t('chordsIn')}</h3>
      <Segmented
        label={t('chordsIn')}
        value={size}
        options={SIZES.map((n) => ({ value: n, label: t(`chordSize.${n}`) }))}
        onChange={onSize}
      />
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {chords.map(({ roman, chord }) => (
          <Button
            key={roman}
            variant="outline"
            className="h-16 flex-col gap-0"
            onClick={() => playChord(chord)}
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

`ui/ScaleFacts.tsx` — the formula, the structure and the relative:

```tsx
import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  noteName,
  noteParam,
  relativeScale,
  scaleGaps,
  type ScaleKind,
  type SpelledNote,
  type Tone,
} from '@/shared/lib/music'
import { Button } from '@/shared/ui/primitives/button'

function Fact({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline gap-4">
      <dt className="w-28 shrink-0 text-muted-foreground">{term}</dt>
      <dd className="font-semibold">{children}</dd>
    </div>
  )
}

/** What a scale is made of, and its relative major or minor. */
export function ScaleFacts({
  root,
  kind,
  tones,
}: {
  root: SpelledNote
  kind: ScaleKind
  tones: readonly Tone[]
}) {
  const { t } = useTranslation('theory')
  const relative = relativeScale(root, kind)
  return (
    <dl className="flex flex-col gap-2">
      <Fact term={t('about.formula')}>{tones.map((tone) => tone.degree).join(' ')}</Fact>
      <Fact term={t('about.gaps')}>{scaleGaps(kind).map((gap) => t(`gap.${gap}`)).join(' ')}</Fact>
      {relative ? (
        <Fact term={t('about.relative')}>
          <Button
            variant="link"
            className="px-0"
            nativeButton={false}
            render={
              <Link
                to="/theory/scales"
                search={(prev) => ({ ...prev, root: noteParam(relative.root), kind: relative.kind })}
                replace
              />
            }
          >
            {`${noteName(relative.root)} ${t(`scaleName.${relative.kind}`)}`}
          </Button>
        </Fact>
      ) : null}
    </dl>
  )
}
```

`ui/ScaleExplorer.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import {
  keyboardRange,
  MIDDLE_C,
  midi,
  noteFromParam,
  noteName,
  noteParam,
  pitchClass,
  pitchClassOf,
  placeScale,
  SCALE_KINDS,
  scaleFingering,
  scaleRootSpelling,
  spellScale,
  type KeyRange,
  type Midi,
} from '@/shared/lib/music'
import { PRACTICE_RHYTHM_IDS, scaleRun } from '@/shared/lib/schedule'
import { usePlay, useServices } from '@/shared/lib/services'
import { ChipRow, PianoKeyboard, Segmented, type KeyMark } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Slider } from '@/shared/ui/primitives/slider'
import type { ScaleView } from '../model/scale-view'
import { useLitKey } from '../model/use-lit-key'
import { FingeringTable } from './FingeringTable'
import { ScaleChords } from './ScaleChords'
import { ScaleFacts } from './ScaleFacts'

const PITCH_CLASSES = Array.from({ length: 12 }, (_, pc) => pitchClass(pc))
/** Two octaves from middle C: a scale from B still fits without the keyboard jumping. */
const AT_LEAST: KeyRange = { from: MIDDLE_C, to: midi(83) }
const LABELS = ['degrees', 'rh', 'lh'] as const

/** Any scale on any root: degrees or fingers on the keys, the fingering, practice, its chords, its relative. */
export function ScaleExplorer({
  scale,
  onChange,
}: {
  scale: ScaleView
  onChange: (change: Partial<ScaleView>) => void
}) {
  const { t } = useTranslation(['theory', 'common'])
  const play = usePlay()
  const { audio } = useServices()
  const { lit, light } = useLitKey()
  const root = noteFromParam(scale.root)
  const tones = spellScale(root, scale.kind)
  const placed = placeScale(root, scale.kind)
  const rh = scaleFingering(pitchClassOf(root), scale.kind, 'rh')
  const lh = scaleFingering(pitchClassOf(root), scale.kind, 'lh')
  const fingers = scale.view === 'rh' ? rh : scale.view === 'lh' ? lh : null
  const marks = new Map<Midi, KeyMark>(
    placed.map((key, i) => [
      key.midi,
      {
        tone: key.tone.role,
        label: scale.view === 'degrees' ? key.tone.degree : fingers ? String(fingers[i] ?? '·') : '–',
      },
    ]),
  )

  const playRun = () => {
    const run = scaleRun(
      placed.map((key) => key.midi),
      { rhythm: scale.rhythm, tempo: scale.tempo, hands: scale.hands },
    )
    const at = play(run.sounds)
    light(run.cues, Math.max(0, at - audio.now()), run.end)
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-4xl font-extrabold tracking-tight">
        {`${noteName(root)} ${t(`theory:scaleName.${scale.kind}`)}`}
      </h2>
      <ChipRow
        label={t('theory:root')}
        value={scale.root}
        options={PITCH_CLASSES.map((pc) => {
          const spelled = scaleRootSpelling(pc, scale.kind)
          return { value: noteParam(spelled), label: noteName(spelled) }
        })}
        onChange={(value) => onChange({ root: value })}
      />
      <ChipRow
        label={t('theory:scaleLabel')}
        value={scale.kind}
        options={SCALE_KINDS.map((kind) => ({ value: kind, label: t(`theory:scaleKind.${kind}`) }))}
        onChange={(kind) => onChange({ kind })}
      />
      <PianoKeyboard
        label={t('common:keyboard')}
        range={keyboardRange(
          placed.map((key) => key.midi),
          AT_LEAST,
        )}
        marks={marks}
        lit={lit === null ? undefined : new Set([lit])}
        className="h-44"
      />
      <Segmented
        label={t('theory:view.label')}
        value={scale.view}
        options={LABELS.map((labels) => ({ value: labels, label: t(`theory:view.${labels}`) }))}
        onChange={(view) => onChange({ view })}
      />
      <FingeringTable notes={placed.map((key) => noteName(key.tone.note))} rh={rh} lh={lh} />

      <section className="flex flex-col gap-4 rounded-3xl bg-card p-5 ring-1 ring-border">
        <h3 className="text-xl font-bold">{t('theory:practice')}</h3>
        <ChipRow
          label={t('theory:rhythmLabel')}
          value={scale.rhythm}
          options={PRACTICE_RHYTHM_IDS.map((r) => ({ value: r, label: t(`theory:rhythm.${r}`) }))}
          onChange={(rhythm) => onChange({ rhythm })}
        />
        <label className="flex flex-col gap-3">
          <span className="flex justify-between">
            {t('theory:tempo')}
            <span className="font-semibold tabular-nums">{t('theory:bpm', { tempo: scale.tempo })}</span>
          </span>
          <Slider
            min={40}
            max={160}
            step={4}
            value={scale.tempo}
            onValueChange={(tempo) => onChange({ tempo })}
            aria-label={t('theory:tempo')}
          />
        </label>
        <Segmented
          label={t('theory:handsLabel')}
          value={scale.hands}
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

      <ScaleChords scale={tones} size={scale.chords} onSize={(chords) => onChange({ chords })} />
      <ScaleFacts root={root} kind={scale.kind} tones={tones} />
    </div>
  )
}
```

Add `export { ScaleExplorer } from './ui/ScaleExplorer'` to `src/widgets/scale-explorer/index.ts`.
`TheoryScalesPage.tsx` mirrors the Chords page: `const { step, ...scale } = useSearch({ from: '/shell/theory/scales' })`,
a `StepPanel` for `step`, and `<ScaleExplorer scale={scale} onChange={…} />` navigating with `replace: true`.

Run the tests. Expected: PASS.

- [ ] **Step 4: Verify and commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
npx prettier --write src/widgets/scale-explorer src/pages/theory-scales src/shared/i18n/locales
git add src/widgets src/pages/theory-scales src/shared
git commit -m "Explore every scale with its fingering, practice rhythms, chords and relative

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 21: Symbols — the chord dictionary and how to read symbols

**Files:**
- Modify: `src/pages/theory-symbols/ui/TheorySymbolsPage.tsx`, `src/shared/i18n/locales/{en,ru}/theory.ts`
- Create: `src/pages/theory-symbols/ui/{QualityRow,ReadingSheet}.tsx`, `src/pages/theory-symbols/ui/TheorySymbolsPage.test.tsx`

**Interfaces:**
- Consumes: `CHORD_FAMILIES`, `qualitiesIn`, `qualitySpellings`, `spellChord`, `noteName`, `note`; `usePlayChord`;
  `Sheet`, `SheetContent`, `DrawerTrigger`.

The reading notes are the one piece of reference text in the app: master spec §5 carries the legacy Guide's
chord-symbol notes into Symbols, behind one row. They explain music notation, not how to use the app, and Task 28
records them in CODE_STYLE §10 as the exception to "no how-to paragraphs".

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

- [ ] **Step 2: Write the failing screen test**

```tsx
// src/pages/theory-symbols/ui/TheorySymbolsPage.test.tsx
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

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
import { note, noteName, qualitySpellings, spellChord, type ChordQuality } from '@/shared/lib/music'
import { usePlayChord } from '@/shared/lib/services'
import { Button } from '@/shared/ui/primitives/button'

const C = note('C')

/** One quality in the dictionary: how it is written, what it is, and on C. */
export function QualityRow({ quality }: { quality: ChordQuality }) {
  const { t } = useTranslation('theory')
  const playChord = usePlayChord()
  const name = t(`quality.${quality}`)
  const tones = spellChord(C, quality)
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
        <Button variant="link" className="px-0" onClick={() => playChord({ root: C, quality })}>
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

(`qualitySpellings` returns the suffix first, then its aliases; the major triad's suffix is `''`, so its first
spelling reads `C`.)

`ReadingSheet.tsx`:

```tsx
import { BookOpenText, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Sheet, SheetContent } from '@/shared/ui'
import { DrawerTrigger } from '@/shared/ui/primitives/drawer'

const READING = ['a', 'b', 'c', 'd', 'e', 'f', 'g'] as const
const NUMBERS = ['a', 'b', 'c', 'd'] as const
const STEPS = [1, 2, 3, 4, 5, 6, 7] as const

/**
 * The legacy Guide's chord-symbol reading notes, behind one row (master spec §5): the app's one
 * reference text, recorded as the exception in CODE_STYLE §10.
 */
export function ReadingSheet() {
  const { t } = useTranslation('theory')
  return (
    <Sheet>
      <DrawerTrigger className="flex min-h-14 w-full items-center gap-3 rounded-3xl bg-card px-4 text-left font-semibold ring-1 ring-border transition-colors duration-200 ease-out outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring">
        <BookOpenText aria-hidden className="size-5 text-primary" />
        <span className="flex-1">{t('symbols.howToRead')}</span>
        <ChevronRight aria-hidden className="size-5 text-muted-foreground" />
      </DrawerTrigger>
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
npx prettier --write src/pages/theory-symbols src/shared/i18n/locales
git add src/pages/theory-symbols src/shared
git commit -m "Show the chord dictionary and the reading notes in Theory → Symbols

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---
### Task 22: Path — Continue and the levels

**Files:**
- Create: `src/entities/path/ui/ExplorerLink.tsx`, `src/widgets/continue-card/{index.ts,ui/ContinueCard.tsx}`,
  `src/widgets/path-levels/{index.ts,ui/PathLevels.tsx,ui/StepRow.tsx}`, `src/pages/path/ui/PathPage.test.tsx`
- Modify: `src/entities/path/index.ts`, `src/pages/path/ui/PathPage.tsx`, `src/shared/i18n/locales/{en,ru}/path.ts`

**Interfaces:**
- Consumes: `selectSuggestedStep`, `selectAllAnswers`, `selectLearned`, `skillsToCheck`, `knownCount` (progress);
  `pathSteps`, `LEVELS`, `skillsOfStep`, `useStepTitle`, `StepKind`; `pieceById`, `pieceKey`, `skillsOfPiece`;
  `keyName`, `qualitiesIn`; `LearnedToggle`; kit.
- Produces: `ExplorerLink({ step, ...anchorProps }: { step: ExplorerStep })` with `ExplorerStep` a chord or scale step:
  the one place a step's explorer link is written (spec §4.1), `/theory/chords?quality=<first of family>&step=chords:<family>`
  or `/theory/scales?kind=<kind>&step=scale:<kind>`. It passes anchor props through, so it also serves as a `Button`'s
  `render`. The Continue card and the step rows differ only in where a piece opens (the Player, the Piece screen).
  Also `ContinueCard()`, `PathLevels()`.

- [ ] **Step 1: Strings** — `path`: en `continue: 'Continue'`, `allLearned: 'Everything on the path is learned.'`,
  `toSongs: 'Open Songs'`, `toCheck: 'Chords to check: {{count}}'`, `known: '{{known}} of {{total}} known'`,
  `progress: '{{learned}} of {{total}}'`; ru `continue: 'Продолжить'`, `allLearned: 'Весь путь пройден.'`,
  `toSongs: 'Открыть песни'`, `toCheck: 'Аккордов на проверку: {{count}}'`, `known: 'Знаю {{known}} из {{total}}'`,
  `progress: '{{learned}} из {{total}}'`. The gap line puts the count after a colon: English writes "2 chords" but
  "1 chord", and Russian has three plural forms. Plural keys cannot be typed against English, and the count after a
  colon reads right in both languages for any number (spec §4.1).

- [ ] **Step 2: Write the failing screen tests**

`src/pages/path/ui/PathPage.test.tsx`:

```tsx
import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

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

  it('opens a song from its row, and a chord step in its explorer', async () => {
    renderApp('/')
    const level = await screen.findByRole('region', { name: 'Level 1 · Beginner' })
    expect(within(level).getByRole('link', { name: /Still, my soul, be still/ })).toHaveAttribute(
      'href',
      '/songs/bz5',
    )
    expect(within(level).getByRole('link', { name: /^Triads/ }).getAttribute('href')).toMatch(
      /^\/theory\/chords\?.*step=chords(%3A|:)tri/,
    )
  })
})
```

Run it. Expected: FAIL.

- [ ] **Step 3: Implement**

`src/entities/path/ui/ExplorerLink.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import type { ComponentProps } from 'react'
import { qualitiesIn } from '@/shared/lib/music'
import type { PathStep } from '../model/types'

export type ExplorerStep = Exclude<PathStep, { readonly kind: 'piece' }>

/** A chord or scale step's way into its explorer (spec §4.1), with the step panel open. */
export function ExplorerLink({
  step,
  ...props
}: { step: ExplorerStep } & Omit<ComponentProps<'a'>, 'href'>) {
  if (step.kind === 'scale') {
    return (
      <Link to="/theory/scales" search={{ kind: step.scale, step: `scale:${step.scale}` }} {...props} />
    )
  }
  const [quality] = qualitiesIn(step.family)
  return (
    <Link
      to="/theory/chords"
      search={{ ...(quality ? { quality } : {}), step: `chords:${step.family}` }}
      {...props}
    />
  )
}
```

Export `ExplorerLink, type ExplorerStep` from `src/entities/path/index.ts`.

`ContinueCard.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { Play } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerLink, useStepTitle, type PathStep } from '@/entities/path'
import { pieceById, pieceKey, skillsOfPiece } from '@/entities/piece'
import { selectAllAnswers, selectSuggestedStep, skillsToCheck, useProgress } from '@/entities/progress'
import { keyName } from '@/shared/lib/music'
import { Button } from '@/shared/ui/primitives/button'

/** The card's one action: a piece opens in the Player, a chord or scale step in its explorer. */
function ContinueButton({ step, label }: { step: PathStep; label: string }) {
  return (
    <Button
      size="pill"
      nativeButton={false}
      render={
        step.kind === 'piece' ? (
          <Link to="/play/$pieceId" params={{ pieceId: step.pieceId }} />
        ) : (
          <ExplorerLink step={step} />
        )
      }
    >
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
        <Button
          variant="link"
          className="self-start px-0 text-secondary-foreground"
          nativeButton={false}
          render={<Link to="/check" search={{ of: suggested.id }} />}
        >
          <span aria-hidden className="size-2 rounded-full bg-attention" />
          {t('toCheck', { count: toCheck })}
        </Button>
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
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerLink, skillsOfStep, useStepTitle, type PlacedStep, type StepKind } from '@/entities/path'
import { knownCount, type ProgressState } from '@/entities/progress'
import { LearnedToggle } from '@/features/mark-learned'
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
const ROW_LINK =
  'flex min-h-16 min-w-0 flex-1 items-center gap-4 rounded-2xl transition-colors duration-200 ease-out outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring'

/** A step on the Path: what it is, how far along it is, and its learned toggle. A piece opens its Piece screen. */
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
  const body: ReactNode = (
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
  return (
    <li className="flex items-center gap-2">
      {step.kind === 'piece' ? (
        <Link to="/songs/$pieceId" params={{ pieceId: step.pieceId }} className={ROW_LINK}>
          {body}
        </Link>
      ) : (
        <ExplorerLink step={step} className={ROW_LINK}>
          {body}
        </ExplorerLink>
      )}
      <LearnedToggle step={placed.id} title={title.primary} />
    </li>
  )
}
```

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
npx prettier --write src/entities/path src/widgets/continue-card src/widgets/path-levels src/pages/path src/shared/i18n/locales
git add src/entities/path src/widgets src/pages/path src/shared
git commit -m "Show the Path: Continue in one tap, then each level's steps with their learned checks

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 23: Songs

**Files:**
- Create: `src/pages/songs/model/songs-view.ts`, `songs-view.test.ts`, `src/pages/songs/ui/SearchField.tsx`,
  `src/widgets/piece-list/{index.ts,ui/PieceList.tsx,ui/EntryRow.tsx}`, `src/pages/songs/ui/SongsPage.test.tsx`
- Modify: `src/pages/songs/ui/SongsPage.tsx`, `src/shared/i18n/locales/{en,ru}/songs.ts`

**Interfaces:**
- Consumes: `SongsFilter` (Task 16); `COLLECTIONS`, `entryTitles`, `pieceKey`, `Entry`, `Collection`; `levelOf`,
  `pathSteps`, `LEVELS`; `selectIsLearned`; `matchesQuery`; `useLocale`, `localText`; kit; `Empty*`, `Input`.
- Produces: `songsView(collections, filter: SongsFilter, levelOfEntry): { collection: Collection; entries: Entry[] }[]`;
  `PieceList({ groups }: { groups: readonly PieceGroup[] })` with `PieceGroup = { id: string; heading: string | null;
  entries: readonly Entry[] }`. A group has a heading only while the list shows every collection: once the learner
  keeps one, its chip names it (spec §4.2).

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
import type { Collection, Entry } from '@/entities/piece'
import { matchesQuery } from '@/shared/lib'
import type { SongsFilter } from './songs-filter'

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

`src/pages/songs/ui/SongsPage.test.tsx`:

```tsx
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

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

  it('keeps one collection, which its chip names instead of a heading', async () => {
    const user = userEvent.setup()
    renderApp('/songs')
    const collections = await screen.findByRole('group', { name: 'Collections' })
    await user.click(within(collections).getByRole('button', { name: 'Hymns' }))
    expect(await screen.findByRole('link', { name: /Silent Night/ })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument()
  })
})
```

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
import { useLocale } from '@/shared/i18n'
import { keyName } from '@/shared/lib/music'
import { LevelMark } from '@/shared/ui'

/** A song or listing in the list: its number, titles, key and meter or "no chart yet", level and learned mark. */
export function EntryRow({ entry }: { entry: Entry }) {
  const { t } = useTranslation('songs')
  const locale = useLocale()
  const { primary, secondary } = entryTitles(entry, locale)
  const learned = useProgress(selectIsLearned(`piece:${entry.id}`))
  const level = entry.kind === 'listing' ? undefined : levelOf(`piece:${entry.id}`)
  return (
    <li>
      <Link
        to="/songs/$pieceId"
        params={{ pieceId: entry.id }}
        className="flex min-h-16 items-center gap-3 rounded-2xl px-1 transition-colors duration-200 ease-out outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring"
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

export interface PieceGroup {
  readonly id: string
  /** The collection's name, or null when the list shows one collection its chip already names. */
  readonly heading: string | null
  readonly entries: readonly Entry[]
}

/** Songs by collection, each under its heading while more than one collection shows. */
export function PieceList({ groups }: { groups: readonly PieceGroup[] }) {
  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <section key={group.id} className="flex flex-col gap-1">
          {group.heading === null ? null : (
            <h2 className="text-xl font-bold text-primary">{group.heading}</h2>
          )}
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

/** The Songs search: a search box with a clear button while it holds text. */
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
          className="absolute top-1/2 right-1 grid size-11 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition-colors duration-200 ease-out outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring"
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
import { localText, useLocale } from '@/shared/i18n'
import { ChipRow, ScreenHeader } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from '@/shared/ui/primitives/empty'
import { PieceList } from '@/widgets/piece-list'
import type { SongsFilter } from '../model/songs-filter'
import { songsView } from '../model/songs-view'
import { SearchField } from './SearchField'

const levelOfEntry = (entry: Entry) => (entry.kind === 'listing' ? undefined : levelOf(`piece:${entry.id}`))
const LEVELS_ON_PATH = LEVELS.filter((level) => pathSteps().some((s) => s.level === level))
const NO_FILTER: SongsFilter = { q: '', collection: 'all', level: 'any' }

export function SongsPage() {
  const { t } = useTranslation(['songs', 'common'])
  const locale = useLocale()
  const search = useSearch({ from: '/shell/songs' })
  const navigate = useNavigate({ from: '/songs' })
  const query = useDeferredValue(search.q)
  const set = (change: Partial<SongsFilter>) =>
    void navigate({ search: (prev) => ({ ...prev, ...change }), replace: true })
  const groups = songsView(COLLECTIONS, { ...search, q: query }, levelOfEntry).map((g) => ({
    id: g.collection.id,
    heading: search.collection === 'all' ? localText(g.collection.name, locale) : null,
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
          ...COLLECTIONS.map((c) => ({ value: c.id, label: localText(c.name, locale) })),
        ]}
        onChange={(collection) => set({ collection })}
      />
      {LEVELS_ON_PATH.length > 1 ? (
        <ChipRow<Level | 'any'>
          label={t('songs:levels')}
          value={search.level}
          options={[
            { value: 'any', label: t('songs:anyLevel') },
            ...LEVELS_ON_PATH.map((level) => ({ value: level, label: t('common:level', { level }) })),
          ]}
          onChange={(level) => set({ level })}
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
            <Button variant="soft" onClick={() => set(NO_FILTER)}>
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
noise). Run the tests. Expected: PASS.

- [ ] **Step 5: Verify and commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
npx prettier --write src/pages/songs src/widgets/piece-list src/shared/i18n/locales
git add src/pages/songs src/widgets/piece-list src/shared
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
  `src/pages/piece/ui/PiecePage.test.tsx`
- Modify: `src/shared/test/setup.ts` (jsdom has no `scrollIntoView`)

**Interfaces:**
- Produces:
  - `barLength(beats: number, meter: Meter): string` — `2/4` for two beats in 4/4, `3/8` for a dotted-quarter beat
    in 6/8, `3/8` for 1½ beats in 4/4.
  - `ChordChart({ performance, headings, meter, layout, current, onBar }: { performance: Performance; headings:
    readonly string[]; meter: Meter; layout: 'lines' | 'strip'; current?: number | null; onBar: (bar: number) =>
    void })` — a Chart's bars: `lines` lays them out by section and line as the chart has them (the Piece), `strip`
    in one row that scrolls (the Player). Bar buttons are named "Bar 4: C C/E Dsus4 D/F#", the current one
    `aria-current="step"`.
  - `PieceSkills({ piece, performance }: { piece: Piece; performance: Performance })`

- [ ] **Step 1: Strings** — `piece` gains: en `chords: { song: 'Chords in this song', exercise: 'Chords in this
  exercise', progression: 'Chords in this progression' }` (the row names the piece by its kind, as the glossary's UI
  column does), `checkChords: 'Check these chords'`, `chart: 'Chart'`, `barLabel: 'Bar {{n}}'`, `progression:
  'Progression'`, `practise: 'Practise'`, `noChart: 'No chart yet'`, `scaleOf: 'Scale: {{scale}}'`, `key: 'Key'`,
  `meter: 'Meter'`; ru `chords: { song: 'Аккорды песни', exercise: 'Аккорды упражнения', progression: 'Аккорды
  последовательности' }`,
  `checkChords: 'Проверить эти аккорды'`, `chart: 'Аккорды по тактам'`, `barLabel: 'Такт {{n}}'`, `progression:
  'Последовательность'`, `practise: 'Играть'`, `noChart: 'Аккордов пока нет'`, `scaleOf: 'Гамма: {{scale}}'`, `key:
  'Тональность'`, `meter: 'Размер'`. The placeholder's `title` ('Song' / 'Песня') goes: the screen's heading is the
  piece's own title now.

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

`src/pages/piece/ui/PiecePage.test.tsx`:

```tsx
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { COLLECTIONS } from '@/entities/piece'
import type { FakeAudio } from '@/shared/api/audio'

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
  })

  it('names the chords row by the piece’s kind', async () => {
    renderApp('/songs/twofive')
    expect(await screen.findByRole('region', { name: 'Chords in this progression' })).toBeInTheDocument()
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
test above, and drop its `Song` heading expectation. The chart strip scrolls its current bar into view, and jsdom
has no layout, so no `scrollIntoView`: add to `src/shared/test/setup.ts`, beside the other fakes,

```ts
// jsdom lays nothing out, so it has no scrollIntoView; the chart strip calls it on every bar.
if (typeof Element !== 'undefined') Element.prototype.scrollIntoView = () => {}
```

Run the piece tests. Expected: FAIL.

- [ ] **Step 4: Implement the chart**

`BarButton.tsx`:

```tsx
import type { Ref } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'

/** One bar of a chart: its number, its chords, and under them its method labels or short length. */
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
  ref?: Ref<HTMLButtonElement>
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

`ChordChart.tsx`:

```tsx
import { useEffect, useRef } from 'react'
import { isMethodCode, METHODS } from '@/entities/pattern'
import { barLength, type Meter } from '@/entities/piece'
import { localText, useLocale } from '@/shared/i18n'
import type { Performance } from '@/shared/lib/arrangement'
import { cn, useMediaQuery } from '@/shared/lib'
import { BarButton } from './BarButton'

/** A Chart's bars with their numbers and chords, by section: line by line to read, or one strip to follow. */
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
  layout: 'lines' | 'strip'
  current?: number | null
  onBar: (bar: number) => void
}) {
  const locale = useLocale()
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    if (layout !== 'strip' || current === null) return
    buttons.current[current]?.scrollIntoView({
      inline: 'center',
      block: 'nearest',
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }, [layout, current, reduceMotion])

  const barOf = (index: number) => {
    const bar = performance.bars[index]
    if (!bar) return null
    const chords = bar.chords.map((i) => performance.chords[i]).filter((c) => c !== undefined)
    const methods = [...new Set(chords.map((c) => c.method).filter((m) => m !== undefined))]
      .filter(isMethodCode)
      .map((code) => localText(METHODS[code].label, locale))
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
      <div className="-mx-4 flex snap-x overflow-x-auto border-y border-border bg-card px-4 scrollbar-none">
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
import { ratingOf, selectAllAnswers, useProgress } from '@/entities/progress'
import type { Performance } from '@/shared/lib/arrangement'
import { noteParam, qualitySuffix, skillOf } from '@/shared/lib/music'
import { RatingMark } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** The chord qualities a piece uses, each with its rating and a way into the explorer; a check of them all. */
export function PieceSkills({ piece, performance }: { piece: Piece; performance: Performance }) {
  const { t } = useTranslation(['piece', 'theory', 'common'])
  const headingId = useId()
  const answers = useProgress(selectAllAnswers)
  const skills = skillsOfPiece(piece)
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <h2 id={headingId} className="text-xl font-bold">
        {t(`piece:chords.${piece.kind}`)}
      </h2>
      <ul className="flex flex-wrap gap-2">
        {skills.map((id) => {
          const skill = skillOf(id)
          if (skill.kind !== 'chord') return null
          const rating = ratingOf(answers, id)
          const first = performance.chords.find((c) => c.quality === skill.quality)
          return (
            <li key={id}>
              <Link
                to="/theory/chords"
                search={{ quality: skill.quality, ...(first ? { root: noteParam(first.root) } : {}) }}
                aria-label={`${t(`theory:quality.${skill.quality}`)}, ${t(`common:rating.${rating}`)}`}
                className="flex h-11 items-center gap-2 rounded-full bg-card px-4 font-semibold ring-1 ring-border transition-colors duration-200 ease-out outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring"
              >
                {qualitySuffix(skill.quality) || t('theory:major')}
                <RatingMark rating={rating} />
              </Link>
            </li>
          )
        })}
      </ul>
      <Button
        variant="link"
        className="self-start px-0"
        nativeButton={false}
        render={<Link to="/check" search={{ of: `piece:${piece.id}` }} />}
      >
        {t('piece:checkChords')}
      </Button>
    </section>
  )
}
```

(A chip's name is the quality's full name and its rating in words, "Minor 7th, Gap": the visible suffix alone would
name it "m7".)

- [ ] **Step 5: Implement the page**

`PieceFacts.tsx` — the title block and facts shared by songs and listings:

```tsx
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Credits, entryTitles, SourceLine, pieceKey, type Entry } from '@/entities/piece'
import { localText, useLocale } from '@/shared/i18n'
import { keyName, noteName, noteParam } from '@/shared/lib/music'
import { RoundButton, ScreenHeader } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** A song's or listing's title, credits, source, key and meter, note, and a way to its key's scale. */
export function PieceFacts({ entry }: { entry: Entry }) {
  const { t } = useTranslation(['piece', 'common', 'theory'])
  const locale = useLocale()
  const { primary, secondary } = entryTitles(entry, locale)
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
      {entry.note ? <p className="max-w-prose text-lg">{localText(entry.note, locale)}</p> : null}
      <Button
        variant="link"
        className="self-start px-0"
        nativeButton={false}
        render={<Link to="/theory/scales" search={{ root: noteParam(key.tonic), kind: scaleKind }} />}
      >
        {t('piece:scaleOf', { scale: `${noteName(key.tonic)} ${t(`theory:scaleName.${scaleKind}`)}` })}
      </Button>
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
import { entryTitles, useSectionHeading, type Piece } from '@/entities/piece'
import { LearnedToggle } from '@/features/mark-learned'
import { arrangePiece, ownChoice } from '@/features/practice'
import { useLocale } from '@/shared/i18n'
import { audibleHands, barSounds } from '@/shared/lib/schedule'
import { usePlay } from '@/shared/lib/services'
import { Button } from '@/shared/ui/primitives/button'
import { ChordChart } from '@/widgets/chord-chart'
import { PieceSkills } from '@/widgets/piece-skills'
import { PieceFacts } from './PieceFacts'

/** A piece with a chart: its facts, its chords, the chart to tap and hear, Practise and the learned toggle. */
export function PieceView({ piece }: { piece: Piece }) {
  const { t } = useTranslation('piece')
  const heading = useSectionHeading()
  const play = usePlay()
  const locale = useLocale()
  const performance = useMemo(() => arrangePiece(piece, ownChoice(piece)), [piece])
  const headings = piece.kind === 'progression' ? [t('progression')] : piece.sections.map(heading)
  const hearBar = (bar: number) =>
    play(barSounds(performance, bar, { tempo: piece.tempo, hands: audibleHands('both') }))

  return (
    <div className="flex flex-col gap-8 pb-4">
      <PieceFacts entry={piece} />
      <PieceSkills piece={piece} performance={performance} />
      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">{t('chart')}</h2>
        <ChordChart
          performance={performance}
          headings={headings}
          meter={piece.meter}
          layout="lines"
          onBar={hearBar}
        />
      </section>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          size="pill"
          className="flex-1"
          render={<Link to="/play/$pieceId" params={{ pieceId: piece.id }} />}
          nativeButton={false}
        >
          <Play data-icon="inline-start" />
          {t('practise')}
        </Button>
        <LearnedToggle step={`piece:${piece.id}`} title={entryTitles(piece, locale).primary} variant="text" />
      </div>
    </div>
  )
}
```

`ListingView.tsx`: `<PieceFacts entry={listing} />` then `<p className="text-lg font-semibold">{t('noChart')}</p>`.
`PiecePage.tsx`:

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
npx prettier --write src/entities/piece src/widgets/chord-chart src/widgets/piece-skills src/pages/piece src/app src/shared/i18n/locales src/shared/test
git add src/entities/piece src/widgets src/pages/piece src/app src/shared
git commit -m "Show a song: its chords and their ratings, the chart to tap and hear, Practise

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 25: The Setup sheet

**Files:**
- Create: `src/widgets/player-setup/ui/{PlayerSetup.tsx,SetupMain.tsx,ChoiceList.tsx,PlayerSetup.test.tsx}`
- Modify: `src/widgets/player-setup/index.ts`, `src/shared/i18n/locales/{en,ru}/player.ts`

**Interfaces:**
- Consumes: `SetupParams`, `SetupChange` (Task 16); `PATTERN_GROUPS`, `PATTERN_GROUP_NAMES`, `PATTERNS`, `patternsIn`,
  `needsMelody`, `RIGHT_FIGURE_IDS`, `RIGHT_FIGURES`, `LEFT_FIGURE_IDS`, `LEFT_FIGURES`; `hasMethodCodes`, `melodyOf`,
  `pieceKey`, `VOICINGS`; `selectPractice`, `useSettings`, `useSettingsStoreApi`, `PRACTICE_TOGGLES`;
  `setPracticeToggle`; `PracticeChoice`; `tonicSpelling`, `noteName`, `noteParam`; kit, `Slider`, `Switch`,
  `DrawerTrigger`.
- Produces: `PlayerSetup({ open, onOpenChange, piece, choice, tempo, hands, onChange }: { open: boolean;
  onOpenChange: (open: boolean) => void; piece: Piece; choice: PracticeChoice; tempo: number; hands: Hands; onChange:
  (change: SetupChange) => void })`. A figure list's first row, "The pattern's own", has the value `null`, and choosing
  it sends `{ rh: undefined }` (or `lh`), which the Player writes as the param's absence.

- [ ] **Step 1: Strings** — `player` (the Setup is «Параметры» in Russian: «Настройки» is the Settings screen):

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
// ru (typed `LocaleResources['player']`, as every Russian module is)
export const player: LocaleResources['player'] = {
  title: 'Плеер',
  setup: 'Параметры',
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
}
```

- [ ] **Step 2: Write the failing tests**

`PlayerSetup.test.tsx`:

```tsx
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { PATTERNS } from '@/entities/pattern'
import { melodyOf, pieceById } from '@/entities/piece'
import { ownChoice } from '@/features/practice'
import { PlayerSetup } from './PlayerSetup'

function piece(id: string) {
  const found = pieceById(id)
  if (!found) throw new Error(id)
  return found
}
const bz5 = piece('bz5')

function renderSetup() {
  const onChange = vi.fn()
  const { settingsStore } = renderWithSettings(
    <PlayerSetup
      open
      onOpenChange={() => {}}
      piece={bz5}
      choice={ownChoice(bz5)}
      tempo={72}
      hands="both"
      onChange={onChange}
    />,
  )
  return { onChange, settingsStore }
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
    expect(melodyOf(bz5)).toBeUndefined()
    await user.click(screen.getByRole('button', { name: /^Pattern/ }))
    expect(screen.getByRole('button', { name: new RegExp(PATTERNS.r5.name.en) })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: new RegExp(PATTERNS.ballad.name.en) }))
    expect(onChange).toHaveBeenCalledWith({ pattern: 'ballad' })
  })

  it('goes back to the pattern’s own figure', async () => {
    const user = userEvent.setup()
    const { onChange } = renderSetup()
    await user.click(screen.getByRole('button', { name: /^Right hand/ }))
    await user.click(screen.getByRole('button', { name: /The pattern’s own/ }))
    expect(onChange).toHaveBeenCalledWith({ rh: undefined })
  })

  it('saves the switches in settings, and shows Melody only for a piece with one', async () => {
    const user = userEvent.setup()
    const { settingsStore } = renderSetup()
    await user.click(screen.getByRole('switch', { name: 'Metronome' }))
    expect(settingsStore.getState().practice.metronome).toBe(true)
    expect(screen.queryByRole('switch', { name: 'Melody' })).not.toBeInTheDocument()
  })
})
```

Run it. Expected: FAIL.

- [ ] **Step 3: Implement**

`ChoiceList.tsx`:

```tsx
import { Check } from 'lucide-react'

export interface ChoiceItem<V> {
  readonly value: V
  readonly label: string
  readonly description?: string
  /** Why the choice is not open to this piece; shown instead of the description, and the row is disabled. */
  readonly disabledNote?: string
}

/** A list of choices on a sheet's page: one chosen, some disabled with the reason. */
export function ChoiceList<V>({
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
        <li key={item.label}>
          <button
            type="button"
            disabled={item.disabledNote !== undefined}
            aria-pressed={item.value === value}
            onClick={() => onChoose(item.value)}
            className="flex min-h-14 w-full items-center gap-3 border-b border-border py-2 text-left transition-colors duration-200 ease-out outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-50"
          >
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{item.label}</span>
              {item.disabledNote || item.description ? (
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
import { LEFT_FIGURES, PATTERNS, RIGHT_FIGURES } from '@/entities/pattern'
import { melodyOf, pieceKey, VOICINGS, type Piece } from '@/entities/piece'
import {
  PRACTICE_TOGGLES,
  selectPractice,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import type { PracticeChoice } from '@/features/practice'
import { setPracticeToggle } from '@/features/set-preference'
import { localText, useLocale } from '@/shared/i18n'
import { noteName, noteParam, pitchClass, tonicSpelling } from '@/shared/lib/music'
import type { Hands } from '@/shared/lib/schedule'
import { ChipRow, Segmented } from '@/shared/ui'
import { Slider } from '@/shared/ui/primitives/slider'
import { Switch } from '@/shared/ui/primitives/switch'
import type { SetupChange } from '../model/setup-params'

const PITCH_CLASSES = Array.from({ length: 12 }, (_, pc) => pitchClass(pc))
const HANDS = ['both', 'rh', 'lh'] as const

export type SetupPage = 'pattern' | 'rh' | 'lh'

/** The Setup sheet's first page: everything but the pattern and figure lists, which open as their own pages. */
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
  open: (page: SetupPage) => void
}) {
  const { t } = useTranslation(['player', 'common'])
  const locale = useLocale()
  const settings = useSettingsStoreApi()
  const toggles = useSettings(selectPractice)
  const { mode } = pieceKey(piece)
  const hasMelody = melodyOf(piece) !== undefined
  const patternName =
    choice.pattern === 'chart' ? t('player:fromChart') : localText(PATTERNS[choice.pattern].name, locale)
  const row = (label: string, value: string, page: SetupPage) => (
    <button
      type="button"
      onClick={() => open(page)}
      className="flex min-h-14 w-full items-center gap-3 border-b border-border text-left transition-colors duration-200 ease-out outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset"
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
          value={tempo}
          onValueChange={(next) => onChange({ tempo: next })}
        />
      </label>
      <Segmented
        label={t('player:hands')}
        value={hands}
        options={HANDS.map((h) => ({ value: h, label: t(`common:hands.${h}`) }))}
        onChange={(next) => onChange({ hands: next })}
      />
      <div>
        {row(t('player:pattern'), patternName, 'pattern')}
        {row(
          t('player:rh'),
          choice.rh ? localText(RIGHT_FIGURES[choice.rh].name, locale) : t('player:ownFigure'),
          'rh',
        )}
        {row(
          t('player:lh'),
          choice.lh ? localText(LEFT_FIGURES[choice.lh].name, locale) : t('player:ownFigure'),
          'lh',
        )}
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
    </div>
  )
}
```

`PlayerSetup.tsx`:

```tsx
import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LEFT_FIGURE_IDS,
  LEFT_FIGURES,
  needsMelody,
  PATTERN_GROUP_NAMES,
  PATTERN_GROUPS,
  PATTERNS,
  patternsIn,
  RIGHT_FIGURE_IDS,
  RIGHT_FIGURES,
  type LeftFigureId,
  type PatternId,
  type RightFigureId,
} from '@/entities/pattern'
import { hasMethodCodes, melodyOf, type Piece } from '@/entities/piece'
import type { PracticeChoice } from '@/features/practice'
import { localText, useLocale } from '@/shared/i18n'
import type { Hands } from '@/shared/lib/schedule'
import { Sheet, SheetContent } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import type { SetupChange } from '../model/setup-params'
import { ChoiceList } from './ChoiceList'
import { SetupMain, type SetupPage } from './SetupMain'

/** Everything about how the Player plays, in one sheet; the lists open as its pages. */
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
  const locale = useLocale()
  const [page, setPage] = useState<SetupPage | 'main'>('main')
  const noMelody = melodyOf(piece) === undefined ? t('needsMelody') : undefined
  const title = page === 'main' ? t('setup') : t(page)
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
          <SetupMain
            piece={piece}
            choice={choice}
            tempo={tempo}
            hands={hands}
            onChange={onChange}
            open={setPage}
          />
        ) : null}
        {page === 'pattern' ? (
          <div className="flex flex-col gap-4">
            {back}
            {hasMethodCodes(piece) ? (
              <ChoiceList<PatternId | 'chart'>
                items={[{ value: 'chart', label: t('fromChart'), description: t('fromChartDescription') }]}
                value={choice.pattern}
                onChoose={() => choose({ pattern: 'chart' })}
              />
            ) : null}
            {PATTERN_GROUPS.map((group) => (
              <section key={group} className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  {localText(PATTERN_GROUP_NAMES[group], locale)}
                </h3>
                <ChoiceList<PatternId | 'chart'>
                  items={patternsIn(group).map((id) => {
                    const { name, description } = PATTERNS[id]
                    return {
                      value: id,
                      label: localText(name, locale),
                      ...(description ? { description: localText(description, locale) } : {}),
                      ...(needsMelody(id) && noMelody ? { disabledNote: noMelody } : {}),
                    }
                  })}
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
            <ChoiceList<RightFigureId | null>
              items={[
                { value: null, label: t('ownFigure') },
                ...RIGHT_FIGURE_IDS.map((id) => ({
                  value: id,
                  label: localText(RIGHT_FIGURES[id].name, locale),
                  ...(RIGHT_FIGURES[id].figure.kind === 'melody' && noMelody ? { disabledNote: noMelody } : {}),
                })),
              ]}
              value={choice.rh}
              onChoose={(rh) => choose({ rh: rh ?? undefined })}
            />
          </div>
        ) : null}
        {page === 'lh' ? (
          <div className="flex flex-col gap-4">
            {back}
            <ChoiceList<LeftFigureId | null>
              items={[
                { value: null, label: t('ownFigure') },
                ...LEFT_FIGURE_IDS.map((id) => ({ value: id, label: localText(LEFT_FIGURES[id].name, locale) })),
              ]}
              value={choice.lh}
              onChoose={(lh) => choose({ lh: lh ?? undefined })}
            />
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
```

Export `PlayerSetup` from `src/widgets/player-setup/index.ts` beside its types. (`ChoiceList`'s button text includes
the description, so tests find patterns by a regex on the name.) Run the tests. Expected: PASS.

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

The Player has many acts (the setup, the modes, taps, MIDI, hearing notes), so, per CODE_STYLE §3, it exposes one
hook, `pages/player/model/use-player.ts`, and that hook is the test surface. The URL comes in as arguments (the
search and a way to change it) rather than from router hooks, so `renderHook` can drive it. The URL ↔ choice mapping
and Your turn's feedback are pure modules beside it.

**Files:**
- Create: `src/pages/player/model/{player-search.test.ts,turn-feedback.ts,turn-feedback.test.ts,use-player.ts,
  use-player.test.tsx}`, `src/pages/player/ui/{PlayerTopBar,NowPanel,NoteGrid,Transport}.tsx`,
  `src/pages/player/ui/PlayerPage.test.tsx`, `src/features/connect-midi/{use-held-keys.ts,use-held-keys.test.tsx}`,
  `src/features/practice/note-names.test.ts`
- Modify: `src/pages/player/model/player-search.ts` (Task 16 made the type), `src/pages/player/ui/PlayerPage.tsx`,
  `src/features/practice/note-names.ts` (+`spellPitchClass`), `src/features/connect-midi/index.ts`,
  `src/features/practice/index.ts`, `src/shared/i18n/locales/{en,ru}/player.ts` (the placeholder's `title` goes: the
  top bar shows the piece's title)
- Delete: `src/pages/player/ui/BackButton.tsx`

**Interfaces:**
- Consumes: everything of Tasks 14, 24, 25; `usePractice`, `recordPractised`, `MidiButton`.
- Produces:
  - `resolveChoice(piece: Piece, search: ArrangementParams, melody: boolean): PracticeChoice` with
    `ArrangementParams = Pick<SetupParams, 'key' | 'pattern' | 'rh' | 'lh' | 'voicing'>` (the params that decide the
    arrangement; hands and tempo do not re-arrange the piece) — the URL read against its
    piece: an absent choice is the piece's own, a key is spelled for the piece's mode, `chart` on a chart without
    method codes is the piece's pattern, a voicing counts only on a progression that lets it be chosen.
  - `searchPatch(piece: Piece, change: SetupChange): SetupChange` — its inverse for one change: a key, tempo,
    pattern or voicing equal to the piece's own becomes `undefined`, so the URL carries only what differs (spec §4).
  - `TurnFeedback = { kind: 'play'; notes: readonly string[] } | { kind: 'right' } | { kind: 'not'; note: string } |
    { kind: 'finished' }`; `turnFeedback(performance: Performance, state: PracticeState): TurnFeedback | null`.
  - `usePlayer(piece: Piece, search: PlayerSearch, setSearch: (patch: Partial<PlayerSearch>) => void): Player` with
    `Player = { choice; performance; range; tempo; practice; marks; held; feedback; change(change: SetupChange): void;
    setMode(mode: PracticeMode): void; hear(): void; tapKey(key: Midi): void }`. Opening records the piece as
    practised. `tapKey` is Your turn's answer, and in Listen and Step it sounds the key (spec §4.4).
  - `useHeldKeys(): ReadonlySet<Midi>`; `spellPitchClass(performance, chord: number, pc: PitchClass): string`.

- [ ] **Step 1: `resolveChoice`, `searchPatch` and `turnFeedback`, tests first**

`player-search.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { hasMethodCodes, PIECES, pieceById } from '@/entities/piece'
import { ownChoice } from '@/features/practice'
import { note } from '@/shared/lib/music'
import { resolveChoice, searchPatch } from './player-search'

function piece(id: string) {
  const found = pieceById(id)
  if (!found) throw new Error(id)
  return found
}
const bz5 = piece('bz5')
const twofive = piece('twofive')

describe('resolveChoice', () => {
  it('plays the piece as written when the URL chooses nothing', () => {
    expect(resolveChoice(bz5, {}, false)).toEqual(ownChoice(bz5))
  })

  it('takes the key, figures and melody the learner chose', () => {
    expect(resolveChoice(bz5, { key: 'A', rh: 't1', lh: 'o' }, true)).toMatchObject({
      tonic: note('A'),
      rh: 't1',
      lh: 'o',
      melody: true,
    })
  })

  it('spells a key for the piece’s mode', () => {
    expect(resolveChoice(bz5, { key: 'A#' }, false).tonic).toEqual(note('B', -1))
  })

  it('plays the piece’s own pattern when the chart names no methods', () => {
    const plain = PIECES.find((p) => !hasMethodCodes(p))
    if (!plain) throw new Error('every piece names its methods')
    expect(resolveChoice(plain, { pattern: 'chart' }, false).pattern).toBe(plain.pattern)
  })

  it('lets only a progression that allows it change its voicing', () => {
    expect(resolveChoice(twofive, { voicing: 'ninths' }, false).voicing).toBe('ninths')
    expect(resolveChoice(bz5, { voicing: 'ninths' }, false).voicing).toBeNull()
  })
})

describe('searchPatch', () => {
  it('writes a choice equal to the piece’s own as absent', () => {
    expect(searchPatch(bz5, { key: 'G' })).toEqual({ key: undefined })
    expect(searchPatch(bz5, { tempo: bz5.tempo })).toEqual({ tempo: undefined })
    expect(searchPatch(bz5, { pattern: ownChoice(bz5).pattern })).toEqual({ pattern: undefined })
    expect(searchPatch(twofive, { voicing: 'sevenths' })).toEqual({ voicing: undefined })
  })

  it('keeps a choice that differs', () => {
    expect(searchPatch(bz5, { key: 'A', hands: 'lh' })).toEqual({ key: 'A', hands: 'lh' })
    expect(searchPatch(bz5, { tempo: 96 })).toEqual({ tempo: 96 })
  })
})
```

`turn-feedback.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { pieceById } from '@/entities/piece'
import { arrangePiece, initialPractice, ownChoice } from '@/features/practice'
import { midi } from '@/shared/lib/music'
import { turnFeedback } from './turn-feedback'

const bz5 = pieceById('bz5')
if (!bz5) throw new Error('bz5')
const performance = arrangePiece(bz5, ownChoice(bz5))
const turn = initialPractice(performance, 'turn', 'rh')

describe('turnFeedback', () => {
  it('says nothing outside Your turn', () => {
    expect(turnFeedback(performance, initialPractice(performance, 'listen', 'both'))).toBeNull()
  })

  it('names the notes to play, spelled from their chord', () => {
    const feedback = turnFeedback(performance, turn)
    expect(feedback?.kind).toBe('play')
    // The first bar is G: the right hand plays some of G B D.
    if (feedback?.kind === 'play') expect(feedback.notes.every((n) => ['G', 'B', 'D'].includes(n))).toBe(true)
  })

  it('names a wrong key, and says when a group is right or the piece is finished', () => {
    expect(turnFeedback(performance, { ...turn, outcome: 'wrong', wrong: midi(61) })).toEqual({
      kind: 'not',
      note: 'C#',
    })
    expect(turnFeedback(performance, { ...turn, outcome: 'correct' })).toEqual({ kind: 'right' })
    expect(turnFeedback(performance, { ...turn, outcome: 'finished' })).toEqual({ kind: 'finished' })
  })
})
```

Run: `npx vitest run src/pages/player/model`
Expected: FAIL. Implement `player-search.ts` (beside Task 16's `PlayerSearch` type):

```ts
import { hasMethodCodes, pieceKey, type Piece } from '@/entities/piece'
import { ownChoice, type PracticeChoice, type PracticeMode } from '@/features/practice'
import { noteFromParam, noteParam, pitchClassOf, tonicSpelling } from '@/shared/lib/music'
import type { SetupChange, SetupParams } from '@/widgets/player-setup'

/** The Player's URL: the setup, and the mode it practises in. */
export type PlayerSearch = SetupParams & { readonly mode: PracticeMode }

/** The params that decide the arrangement; hands and tempo play the same arrangement differently. */
export type ArrangementParams = Pick<SetupParams, 'key' | 'pattern' | 'rh' | 'lh' | 'voicing'>

/** The Player's URL read against its piece: what the URL leaves out is the piece's own. */
export function resolveChoice(
  piece: Piece,
  search: ArrangementParams,
  melody: boolean,
): PracticeChoice {
  const own = ownChoice(piece)
  const { mode } = pieceKey(piece)
  const chartWithoutMethods = search.pattern === 'chart' && !hasMethodCodes(piece)
  return {
    tonic: search.key ? tonicSpelling(pitchClassOf(noteFromParam(search.key)), mode) : own.tonic,
    pattern: search.pattern === undefined || chartWithoutMethods ? own.pattern : search.pattern,
    rh: search.rh ?? null,
    lh: search.lh ?? null,
    voicing: piece.kind === 'progression' && piece.voicing.choosable ? (search.voicing ?? null) : null,
    melody,
  }
}

/** A Setup change as the URL writes it: a key, tempo, pattern or voicing equal to the piece's own is left out. */
export function searchPatch(piece: Piece, change: SetupChange): SetupChange {
  const own = ownChoice(piece)
  const ownVoicing = piece.kind === 'progression' ? piece.voicing.default : undefined
  const unlessOwn = <V>(value: V, ownValue: V): V | undefined => (value === ownValue ? undefined : value)
  return {
    ...change,
    ...('key' in change ? { key: unlessOwn(change.key, noteParam(own.tonic)) } : {}),
    ...('tempo' in change ? { tempo: unlessOwn(change.tempo, piece.tempo) } : {}),
    ...('pattern' in change ? { pattern: unlessOwn(change.pattern, own.pattern) } : {}),
    ...('voicing' in change ? { voicing: unlessOwn(change.voicing, ownVoicing) } : {}),
  }
}
```

`turn-feedback.ts`:

```ts
import { spellPitchClass, type PracticeState } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { pitchClass } from '@/shared/lib/music'

/** What Your turn's feedback line says (spec §4.4). */
export type TurnFeedback =
  | { readonly kind: 'play'; readonly notes: readonly string[] }
  | { readonly kind: 'right' }
  | { readonly kind: 'not'; readonly note: string }
  | { readonly kind: 'finished' }

/** Your turn's line now: the notes to play, a wrong key, right, or finished. Nothing outside Your turn. */
export function turnFeedback(performance: Performance, state: PracticeState): TurnFeedback | null {
  if (state.mode !== 'turn') return null
  if (state.outcome === 'finished') return { kind: 'finished' }
  if (state.outcome === 'correct') return { kind: 'right' }
  const group = performance.beatGroups[state.beatGroup]
  if (!group) return null
  if (state.outcome === 'wrong' && state.wrong !== null) {
    return { kind: 'not', note: spellPitchClass(performance, group.chord, pitchClass(state.wrong)) }
  }
  return state.expected.length > 0
    ? { kind: 'play', notes: state.expected.map((pc) => spellPitchClass(performance, group.chord, pc)) }
    : null
}
```

`spellPitchClass` comes in Step 2; write both steps' code before running. Run the model tests. Expected: PASS.

- [ ] **Step 2: `useHeldKeys` and `spellPitchClass`, tests first**

```tsx
// src/features/connect-midi/use-held-keys.test.tsx
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
// src/features/practice/note-names.test.ts
import { describe, expect, it } from 'vitest'
import { pieceById } from '@/entities/piece'
import { pitchClass } from '@/shared/lib/music'
import { arrangePiece, ownChoice } from './arrange-piece'
import { spellPitchClass } from './note-names'

const bz5 = pieceById('bz5')
if (!bz5) throw new Error('bz5')
const performance = arrangePiece(bz5, ownChoice(bz5))

describe('spellPitchClass', () => {
  it('names a pitch class from the chord it belongs to, else from the key', () => {
    const g = performance.chords.findIndex((chord) => chord.symbol === 'G')
    expect(spellPitchClass(performance, g, pitchClass(11))).toBe('B')
    expect(spellPitchClass(performance, g, pitchClass(1))).toBe('C#')
  })
})
```

```ts
// src/features/connect-midi/use-held-keys.ts
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

Add to `note-names.ts`:

```ts
/** A pitch class named from the chord it belongs to, else from the key: Your turn's "Play D F# A". */
export function spellPitchClass(performance: Performance, chord: number, pc: PitchClass): string {
  const tone = performance.chords[chord]?.tones.find((t) => t.pitchClass === pc)
  return noteName(tone?.note ?? rootSpelling(pc, keyPrefersSharps(performance.key)))
}
```

Export `useHeldKeys` from `features/connect-midi` and `spellPitchClass` from `features/practice`. Run:
`npx vitest run src/features/connect-midi src/features/practice src/pages/player/model`. Expected: PASS.

- [ ] **Step 3: `usePlayer`, test first**

`use-player.test.tsx`:

```tsx
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { createProgressStore, ProgressStoreProvider } from '@/entities/progress'
import { pieceById } from '@/entities/piece'
import { createSettingsStore, SettingsStoreProvider } from '@/entities/settings'
import { createFakeAudio } from '@/shared/api/audio'
import { createMemoryStorage } from '@/shared/lib'
import { midi } from '@/shared/lib/music'
import { ServicesProvider } from '@/shared/lib/services'
import type { PlayerSearch } from './player-search'
import { usePlayer } from './use-player'

const bz5 = pieceById('bz5')
if (!bz5) throw new Error('bz5')

function setup(search: PlayerSearch) {
  const storage = createMemoryStorage()
  const settings = createSettingsStore({ storage, languages: ['en'] })
  const progress = createProgressStore({ storage })
  const audio = createFakeAudio()
  const setSearch = vi.fn()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <SettingsStoreProvider store={settings}>
      <ProgressStoreProvider store={progress}>
        <ServicesProvider services={{ audio, midi: null }}>{children}</ServicesProvider>
      </ProgressStoreProvider>
    </SettingsStoreProvider>
  )
  const hook = renderHook(() => usePlayer(bz5, search, setSearch), { wrapper })
  return { ...hook, progress, audio, setSearch }
}

describe('usePlayer', () => {
  it('records the piece as practised when it opens', () => {
    const { progress } = setup({ hands: 'both', mode: 'listen' })
    expect(progress.getState().practised.bz5).toBeDefined()
  })

  it('arranges the piece in the key the URL names', () => {
    const { result } = setup({ hands: 'both', mode: 'listen', key: 'A' })
    expect(result.current.performance.chords[0]?.symbol).toBe('A')
  })

  it('writes a Setup change to the URL, leaving out the piece’s own choice', () => {
    const { result, setSearch } = setup({ hands: 'both', mode: 'listen', key: 'A' })
    act(() => result.current.change({ key: 'G' }))
    expect(setSearch).toHaveBeenLastCalledWith({ key: undefined })
    act(() => result.current.setMode('step'))
    expect(setSearch).toHaveBeenLastCalledWith({ mode: 'step' })
  })

  it('sounds a tapped key outside Your turn', () => {
    const { result, audio } = setup({ hands: 'both', mode: 'step' })
    act(() => result.current.tapKey(midi(60)))
    expect(audio.played).toHaveLength(1)
  })
})
```

Run: `npx vitest run src/pages/player/model/use-player.test.tsx`
Expected: FAIL. Implement `use-player.ts`:

```ts
import { useCallback, useEffect, useMemo } from 'react'
import type { Piece } from '@/entities/piece'
import { useProgressStoreApi } from '@/entities/progress'
import { selectPractice, useSettings } from '@/entities/settings'
import { useHeldKeys } from '@/features/connect-midi'
import {
  arrangePiece,
  playerRange,
  practiceMarks,
  usePractice,
  type Practice,
  type PracticeChoice,
  type PracticeMode,
} from '@/features/practice'
import { recordPractised } from '@/features/record-practised'
import type { Performance } from '@/shared/lib/arrangement'
import type { KeyRange, Midi } from '@/shared/lib/music'
import { audibleHands, beatGroupSounds, chordSounds } from '@/shared/lib/schedule'
import { usePlay } from '@/shared/lib/services'
import type { KeyMark } from '@/shared/ui'
import type { SetupChange } from '@/widgets/player-setup'
import { resolveChoice, searchPatch, type PlayerSearch } from './player-search'
import { turnFeedback, type TurnFeedback } from './turn-feedback'

export interface Player {
  readonly choice: PracticeChoice
  readonly performance: Performance
  readonly range: KeyRange
  readonly tempo: number
  readonly practice: Practice
  /** The current beat group's keys, by hand, labelled with fingers or note names. */
  readonly marks: ReadonlyMap<Midi, KeyMark>
  /** Keys held down on the MIDI keyboard. */
  readonly held: ReadonlySet<Midi>
  readonly feedback: TurnFeedback | null
  change(change: SetupChange): void
  setMode(mode: PracticeMode): void
  /** Your turn's "Hear these notes": the current beat group, both hands. */
  hear(): void
  /** A key tapped on the screen: an answer in Your turn, its sound in Listen and Step. */
  tapKey(key: Midi): void
}

/** The Player's one hook (CODE_STYLE §3): the URL and the saved switches in, everything the screen shows out. */
export function usePlayer(
  piece: Piece,
  search: PlayerSearch,
  setSearch: (patch: Partial<PlayerSearch>) => void,
): Player {
  const toggles = useSettings(selectPractice)
  const progress = useProgressStoreApi()
  const held = useHeldKeys()
  const play = usePlay()
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

  const { state, press } = practice
  const turn = state.mode === 'turn'
  const tapKey = useCallback(
    (tapped: Midi) => {
      if (turn) press(tapped)
      else play(chordSounds([tapped], { arpeggio: false }))
    },
    [turn, press, play],
  )

  return {
    choice,
    performance,
    range,
    tempo,
    practice,
    marks: practiceMarks(performance, state.beatGroup, {
      fingers: toggles.fingerNumbers,
      ...(turn ? { received: state.received } : {}),
    }),
    held,
    feedback: turnFeedback(performance, state),
    change: (setup) => setSearch(searchPatch(piece, setup)),
    setMode: (mode) => setSearch({ mode }),
    hear() {
      play(beatGroupSounds(performance, state.beatGroup, { tempo, hands: audibleHands('both') }))
    },
    tapKey,
  }
}
```

(The memo lists each param `resolveChoice` reads, so a new search object with the same values, or a change of hands or
tempo, keeps the same performance object, as `usePractice` asks.) Run the test. Expected: PASS.

- [ ] **Step 4: Write the failing Player screen tests**

`src/pages/player/ui/PlayerPage.test.tsx`:

```tsx
import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import type { FakeAudio } from '@/shared/api/audio'
import type { FakeMidi } from '@/shared/api/midi'
import { midi, parseNoteName, pitchClassOf } from '@/shared/lib/music'

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
    // C sharp is outside G major's first chord (G B D).
    await user.click(within(keyboard).getByRole('button', { name: 'C sharp 4' }))
    expect(await screen.findByText(/^Not C#/)).toBeInTheDocument()
    const notes = prompt.textContent?.replace(/^Play /, '').split(' ') ?? []
    const midiKeyboard = services.midi as FakeMidi
    act(() => {
      for (const name of notes) {
        const spelled = parseNoteName(name)
        if (!spelled) throw new Error(name)
        midiKeyboard.press(midi(60 + pitchClassOf(spelled)))
      }
    })
    expect(await screen.findByText('Right')).toBeInTheDocument()
  })

  it('changes the key through the Setup sheet, and back to the piece’s own', async () => {
    const user = userEvent.setup()
    const { router } = renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: /G · 72 BPM/ }))
    await user.click(await screen.findByRole('button', { name: 'A' }))
    expect(router.state.location.search).toMatchObject({ key: 'A' })
    expect(await screen.findByRole('button', { name: /A · 72 BPM/ })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'G' }))
    expect(router.state.location.search).not.toHaveProperty('key')
  })
})
```

(Your turn counts pitch classes in any octave, so pressing each named note from middle C answers the group.)

Run it. Expected: FAIL.

- [ ] **Step 5: Implement the Player's parts**

`PlayerTopBar.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { ChevronDown, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { entryTitles, type Piece } from '@/entities/piece'
import { MidiButton } from '@/features/connect-midi'
import { useLocale } from '@/shared/i18n'
import { RoundButton } from '@/shared/ui'

/** Close, the title with the setup summary that opens the Setup sheet, and the MIDI button. */
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
  const locale = useLocale()
  return (
    <header className="flex items-center gap-3">
      <RoundButton
        label={t('common:close')}
        icon={X}
        render={<Link to="/songs/$pieceId" params={{ pieceId: piece.id }} />}
      />
      <div className="flex min-w-0 flex-1 flex-col items-center">
        <h1 className="max-w-full truncate text-lg font-bold">{entryTitles(piece, locale).primary}</h1>
        <button
          type="button"
          onClick={onSetup}
          className="inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-muted-foreground transition-colors duration-200 ease-out outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring"
        >
          {summary}
          <ChevronDown aria-hidden className="size-4" />
        </button>
      </div>
      {/* The MIDI button, or its empty place where the browser has no Web MIDI, so the title stays centred. */}
      <div className="flex size-11 shrink-0 items-center justify-center">
        <MidiButton />
      </div>
    </header>
  )
}
```

`NowPanel.tsx`:

```tsx
import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import type { PracticeState } from '@/features/practice'
import { TICKS_PER_BEAT, type Performance } from '@/shared/lib/arrangement'
import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui/primitives/button'
import type { TurnFeedback } from '../model/turn-feedback'

function feedbackLine(feedback: TurnFeedback, t: TFunction<'player'>): string {
  switch (feedback.kind) {
    case 'play':
      return t('playThese', { notes: feedback.notes.join(' ') })
    case 'not':
      return t('notThat', { note: feedback.note })
    case 'right':
      return t('right')
    case 'finished':
      return t('finished')
  }
}

/** The chord now at display size, the next one, the bar's beats, and Your turn's feedback line. */
export function NowPanel({
  performance,
  state,
  feedback,
  onAgain,
}: {
  performance: Performance
  state: PracticeState
  feedback: TurnFeedback | null
  onAgain: () => void
}) {
  const { t } = useTranslation('player')
  const group = performance.beatGroups[state.beatGroup]
  const chord = group ? performance.chords[group.chord] : undefined
  const next = group ? performance.chords[group.chord + 1] : undefined
  const bar = group ? performance.bars[group.bar] : undefined
  const beat = group && bar ? Math.floor((group.tick - bar.startTick) / TICKS_PER_BEAT) : 0
  const beats = bar ? Math.ceil(bar.beats) : 0
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
      {state.mode === 'turn' ? (
        <div className="flex min-h-11 items-center gap-3">
          <p
            aria-live="polite"
            className={cn('text-lg font-semibold', feedback?.kind === 'not' && 'text-destructive')}
          >
            {feedback ? feedbackLine(feedback, t) : null}
          </p>
          {feedback?.kind === 'finished' ? (
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

(The live region stays in the page for the whole of Your turn, so a screen reader announces each new line.)

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
const HANDS_HIGH_TO_LOW = ['melody', 'rh', 'lh'] as const

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
  const hands = HANDS_HIGH_TO_LOW.filter((hand) => columns.some((c) => c.notes[hand].length > 0))
  return (
    <div
      role="group"
      aria-label={t('grid.label', { n: bar + 1 })}
      className="-mx-4 flex overflow-x-auto px-4 scrollbar-none"
    >
      {columns.map((column) => (
        <button
          key={column.beatGroup}
          type="button"
          aria-current={column.beatGroup === current ? 'step' : undefined}
          onClick={() => onJump(column.beatGroup)}
          className={cn(
            'flex min-w-14 shrink-0 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-sm transition-colors duration-200 ease-out outline-none focus-visible:ring-3 focus-visible:ring-ring',
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

/** The primary action, by mode: Play or Stop; Back, Next and Next bar; or Hear these notes. */
export function Transport({ practice, onHear }: { practice: Practice; onHear: () => void }) {
  const { t } = useTranslation('player')
  const { mode, playing } = practice.state
  return (
    <div className="flex items-center justify-center gap-4 pb-2">
      {mode === 'listen' ? (
        <>
          <RoundButton label={t('restart')} icon={RotateCcw} onClick={practice.restart} />
          <Button
            size="play"
            aria-label={playing ? t('stop') : t('play')}
            onClick={playing ? practice.stop : practice.play}
          >
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

`PlayerPage.tsx`. On a phone held upright the parts stack, with the transport under the keyboard in thumb's reach.
On a landscape phone (spec §4.4) the parts above the keyboard share two columns: the top bar beside the mode switch,
the chart strip across both, the now panel and transport on the left, the note grid on the right. The keyboard takes
the lower half at full width. One DOM order serves both: the parts' wrapper is `display: contents` upright and a
grid on its side, and the transport moves after the keyboard with `order-last` only upright.

```tsx
import { useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { pieceById, pieceKey, useSectionHeading, type Piece } from '@/entities/piece'
import { PRACTICE_MODES } from '@/features/practice'
import { keyName } from '@/shared/lib/music'
import { PianoKeyboard, Segmented } from '@/shared/ui'
import { ChordChart } from '@/widgets/chord-chart'
import { PlayerSetup } from '@/widgets/player-setup'
import { usePlayer } from '../model/use-player'
import { NoteGrid } from './NoteGrid'
import { NowPanel } from './NowPanel'
import { PlayerTopBar } from './PlayerTopBar'
import { Transport } from './Transport'

function Player({ piece }: { piece: Piece }) {
  const { t } = useTranslation(['player', 'piece', 'common'])
  const search = useSearch({ from: '/full-screen/play/$pieceId' })
  const navigate = useNavigate({ from: '/play/$pieceId' })
  const heading = useSectionHeading()
  const [setupOpen, setSetupOpen] = useState(false)
  const player = usePlayer(piece, search, (patch) =>
    void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true }),
  )
  const { practice, performance } = player
  const { state } = practice
  const bar = performance.beatGroups[state.beatGroup]?.bar ?? 0
  const headings = piece.kind === 'progression' ? [t('piece:progression')] : piece.sections.map(heading)
  const summary = t('player:summary', {
    key: keyName({ tonic: player.choice.tonic, mode: pieceKey(piece).mode }),
    tempo: player.tempo,
    hands: t(`common:hands.${search.hands}`),
  })

  return (
    <div className="flex flex-1 flex-col gap-4 pt-2 landscape-phone:min-h-0 landscape-phone:gap-2 landscape-phone:pt-1">
      <div className="contents landscape-phone:grid landscape-phone:min-h-0 landscape-phone:flex-1 landscape-phone:grid-cols-2 landscape-phone:content-start landscape-phone:gap-x-4 landscape-phone:gap-y-2 landscape-phone:overflow-y-auto">
        <PlayerTopBar piece={piece} summary={summary} onSetup={() => setSetupOpen(true)} />
        <Segmented
          label={t('player:modes.label')}
          value={search.mode}
          options={PRACTICE_MODES.map((m) => ({ value: m, label: t(`player:modes.${m}`) }))}
          onChange={player.setMode}
        />
        <div className="landscape-phone:col-span-2">
          <ChordChart
            performance={performance}
            headings={headings}
            meter={piece.meter}
            layout="strip"
            current={bar}
            onBar={practice.jumpToBar}
          />
        </div>
        <NowPanel
          performance={performance}
          state={state}
          feedback={player.feedback}
          onAgain={practice.restart}
        />
        <div className="landscape-phone:row-span-2">
          <NoteGrid
            performance={performance}
            bar={bar}
            current={state.beatGroup}
            onJump={practice.jumpToBeatGroup}
          />
        </div>
        <div className="order-last landscape-phone:order-none">
          <Transport practice={practice} onHear={player.hear} />
        </div>
      </div>
      <PianoKeyboard
        label={t('common:keyboard')}
        range={player.range}
        marks={player.marks}
        pressed={player.held}
        wrong={state.wrong === null ? undefined : new Set([state.wrong])}
        minWhiteWidth={28}
        centre={[...player.marks.keys()][0] ?? null}
        onKeyPress={player.tapKey}
        className="mt-auto h-48 landscape-phone:mt-0 landscape-phone:h-1/2"
      />
      <PlayerSetup
        open={setupOpen}
        onOpenChange={setSetupOpen}
        piece={piece}
        choice={player.choice}
        tempo={player.tempo}
        hands={search.hands}
        onChange={player.change}
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

(The route's `beforeLoad` already sends an unknown id or a listing to not-found, so `piece` is always there; the
`null` branch only satisfies the type.) Delete `BackButton.tsx`. Run the Player tests. Expected: PASS.

- [ ] **Step 6: Verify and commit**

Run: `npm run typecheck && npm run lint && npm run test && npm run build`

```bash
npx prettier --write src/pages/player src/features/connect-midi src/features/practice src/shared/i18n/locales
git add -A src/pages/player src/features src/shared/i18n
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
- Consumes: `setLocale`, `setTheme`, `resetProgress(store: ProgressStore)`, `MidiControl`, `Segmented`,
  `AlertDialog*` (the registry's `AlertDialogAction` is a `Button`, so it takes `variant` and does not close the
  dialog by itself; the page holds the dialog's open state, a lone toggle).

- [ ] **Step 1: Strings** — `settings` gains en `midi: 'MIDI keyboard'`, `progress: { label: 'Progress', reset:
  'Reset progress', title: 'Reset progress?', body: 'Learned steps, practised songs and quiz answers on this device
  will be cleared.', cancel: 'Cancel', confirm: 'Reset' }`; ru `midi: 'MIDI-клавиатура'`, `progress: { label:
  'Прогресс', reset: 'Сбросить прогресс', title: 'Сбросить прогресс?', body: 'Выученные шаги, открытые песни и ответы
  теста на этом устройстве будут удалены.', cancel: 'Отмена', confirm: 'Сбросить' }`.

- [ ] **Step 2: Update the tests first**

In `SettingsPage.test.tsx` and `router.test.tsx`, language and theme are segmented buttons now:
`getByRole('button', { name: 'Русский' })` with `aria-pressed`. Add to `SettingsPage.test.tsx` (it needs the progress
store, so it runs the app through `renderApp`, imported from `@/app/testing/render-app` beside the file's
`renderWithSettings`):

```tsx
  it('resets progress only after confirming, then closes the dialog', async () => {
    const user = userEvent.setup()
    const { progressStore } = renderApp('/settings')
    act(() => progressStore.setState({ learned: { 'chords:tri': '2026-09-25T10:00:00Z' } }))
    await user.click(await screen.findByRole('button', { name: 'Reset progress' }))
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(progressStore.getState().learned['chords:tri']).toBeDefined()
    await user.click(screen.getByRole('button', { name: 'Reset progress' }))
    await user.click(await screen.findByRole('button', { name: 'Reset' }))
    expect(progressStore.getState().learned).toEqual({})
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
  })
```

(import `act` and `waitFor` from `@testing-library/react`.) Run: expected FAIL.

- [ ] **Step 3: Implement**

```tsx
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useProgressStoreApi } from '@/entities/progress'
import {
  selectLocale,
  selectTheme,
  THEMES,
  useSettings,
  useSettingsStoreApi,
  type Theme,
} from '@/entities/settings'
import { MidiControl } from '@/features/connect-midi'
import { resetProgress } from '@/features/reset-progress'
import { setLocale, setTheme } from '@/features/set-preference'
import { LOCALES, type Locale } from '@/shared/i18n'
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
  const [confirming, setConfirming] = useState(false)
  const reset = () => {
    resetProgress(progress)
    setConfirming(false)
  }
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
        <AlertDialog open={confirming} onOpenChange={setConfirming}>
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
              <AlertDialogAction variant="destructive" onClick={reset}>
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

Delete `ChoiceGroup.tsx`. Run the tests. Expected: PASS.

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

- [ ] **Step 1: CLAUDE.md** — in Architecture, keep its own voice and length:
  - **shared/**: `ui` lists the kit (`PianoKeyboard`, `ScreenHeader`, `RoundButton`, `Segmented`, `ChipRow`, `Sheet`,
    `RoleLegend`, `RatingMark`, `LevelMark`); `lib` gains `keyboard-layout`, `search-params`, `fold-text`, and `music`
    gains `keyboard` and `place` (placed chords and scales); `services` gains `usePlay`/`usePlayChord`; `i18n` owns
    `Locale` and `useLocale`.
  - **entities/**: an entity may have `ui/` for UI that is only its own data shown (a piece's titles, credits, source
    and section headings; a step's title and `ExplorerLink`). `progress` gains `ratingOf` and `selectSuggestedStep`.
  - **features/**: `connect-midi` (new); `practice` gains `ownChoice`, the note grid and marks; `quiz` gains check
    plans, the theory quizzes, My gaps and `useQuiz`.
  - **widgets/**: `continue-card path-levels piece-list chord-chart piece-skills player-setup chord-explorer
    scale-explorer step-panel quiz-board quiz-choice`, each owning its view type in `model/` where a route reads it.
  - **pages/**: a page with many acts has one hook in `model/` (`pages/player/model/use-player.ts`).
  - **app/**: `routes/search.ts` holds every route's `validateSearch` and defaults, typed with `import type` from the
    slice that owns each view (the router imports no page or widget code, which would leave its lazy chunk); the
    `/check` route.
  - Conventions: a screen's test sits beside its page and runs the app through `renderApp`.

- [ ] **Step 2: CODE_STYLE.md**
  - §1: a row "Entity UI (only the entity's own data, shown) → `entities/<x>/ui/`", and the kit.
  - §5: the new roles (`attention` for gaps only, `hand-*` for the Player only, `key-*`, `thumb`), the palette law,
    the radius scale on Tailwind's names (`xs` 6 · `sm` 9 · `md` 12 · `lg` 14 · `xl` 16 · `2xl` 18 · `3xl` 26 ·
    `4xl` 28), the type scale on Tailwind's names, `ease-out` as the one curve, the `landscape-phone:` variant, the
    `scrollbar-none` utility, and text links as `Button variant="link"` rendering a `Link`.
  - §9: a screen's test sits beside its page (`pages/<x>/ui/<X>Page.test.tsx`) and runs the whole app through
    `renderApp`; test files are outside the layer rules.
  - §10: after "No how-to paragraphs", the one exception: Theory → Symbols' reading notes (master spec §5), reference
    text about chord symbols behind one row, not instructions for the app.

- [ ] **Step 3: Glossary** — add, in its tables' shape:
  - Music: **Placed tone** — a Tone at a key on the keyboard, as the explorers and the quiz place chords and scales
    (`placeChord`, `placeScale`); avoid "voicing" (that is a Progression's triads, sevenths or ninths). **Scale gap** —
    the step between neighbouring notes of a scale: W, H or W+H (Т, П, Т+П in Russian); avoid "step" (a Step is on the
    Path).
  - Theory gaps: **Theory quiz** — one of the open-ended quizzes in Theory → Quiz (Build chord, Name chord, Build
    scale over the chosen skills, or My gaps), as against a **Check**, which is bounded; avoid "tab".
  - Practice: the **Setup** row notes its Russian UI word, «Параметры»; «Настройки» is Settings.
  Check, Continue and Setup are already there. Make sure every UI word in the new strings maps to a glossary term.

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
