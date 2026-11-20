# claude.ai: design tokens (CSS custom properties)

All values are **exact**. They were read on 2026-11-20 from the live page's stylesheets (`document.styleSheets`, every `--*` custom property on `:root`/`html`/theme selectors) and from `getComputedStyle(document.documentElement)`. The design system prefix is `cds` (**inferred**: "Claude Design System"). Tailwind v4 tokens (`--spacing`, `--text-*`, `--radius-*`) sit on top.

`<html>` carries the state as attributes:

| Attribute | Value seen |
|---|---|
| `data-theme` | `claude` |
| `data-mode` | `light` (also `dark`, `system`) |
| `data-color-version` | `v2` |
| `data-reply-face` | `serif` |
| `data-sidebar-chrome-preference` | `rail` |
| `data-new-page-layout` | `home` |
| `data-cds-fizzy-lake` | `color panels type` |
| `data-browser-floor` | `chrome:131, edge:131, firefox:132, opera:115, safari:17, ios:17, samsung:28` |
| `class` | `cds-root h-screen antialiased motion-safe:scroll-smooth` |
| inline style | `--font-user-message: var(--font-sans-serif); --font-claude-response: var(--font-serif); --toast-top-offset: 56px; --desktop-titlebar-inset: 0px` |

## 1. Fonts

| Token | Value |
|---|---|
| `--font-anthropic-sans` | "anthropic-sans", fallback chain system-ui, Segoe UI, Roboto, Helvetica, Arial, CJK and Indic fallbacks |
| `--font-anthropic-serif` | "anthropic-serif", Georgia-metric fallbacks, Times New Roman, … serif |
| `--font-anthropic-mono` | "anthropic-mono", ui-monospace, monospace |
| `--font-anthropic-sans-display` | "anthropic-sans-display" |
| `--font-ui-dyslexic` | "OpenDyslexic" (accessibility option) |
| `--font-atkinson-hyperlegible` | "Atkinson Hyperlegible Next" (accessibility option) |
| `--font-claude-response` | serif (replies) |
| `--font-user-message` | sans (user messages) |
| Root scale | `--cds-rem-scale: calc(16 / 17)`, so UI rem values are scaled to 16/17 |
| Weights | regular 400, medium 500, semibold 580, bold 600. Variable `wght` axis in dark mode: regular 360, medium 460, semibold 540, bold 560 (lighter, because light text on dark looks heavier). Display text uses `opsz 48`, `wght 290`. |

Anthropic's fonts are proprietary and are **not** exported. OpenDyslexic (OFL) and Atkinson Hyperlegible Next (OFL) are open, but get them from their official sources, not this site.

**Type scale (Tailwind):**

| Token | Size / line-height |
|---|---|
| xs | .75 / 1 rem |
| sm | .875 / 1.25 |
| base | 1 / 1.5 |
| lg | 1.125 / 1.75 |
| xl | 1.25 / 1.75 |
| 2xl | 1.5 / 2 |
| 3xl | 1.875 / 2.25 |
| 4xl | 2.25 / 2.5 |
| 5xl | 3 / 1 |
| 6xl | 3.75 / 1 |

Composer text is 0.9375 rem. The home greeting is `clamp(1.5rem, 1.15rem + 1vw, 2rem)`.

## 2. Colour: theme `claude` (HSL triplets, used as `hsl(var(--x))`)

| Token | Light | Dark |
|---|---|---|
| bg-000 | 0 0% 100% | 60 2.1% 18.4% |
| bg-100 | 48 33.3% 97.1% | 60 2.7% 14.5% |
| bg-200 | 53 28.6% 94.5% | 30 3.3% 11.8% |
| bg-300 | 48 25% 92.2% | 60 2.6% 7.6% |
| bg-400/500 | 50 20.7% 88.6% | 0 0% 0% |
| text-000/100 | 60 2.6% 7.6% | 48 33.3% 97.1% |
| text-200/300 | 60 2.5% 23.3% | 50 9% 73.7% |
| text-400/500 | 51 3.1% 43.7% | 48 4.8% 59.2% |
| border-100…400 | 30 3.3% 11.8% (used at low alpha) | 51 16.5% 84.5% |
| accent-000 | 210 73.7% 40.2% | 210 65.5% 67.1% |
| accent-100/200 | 210 70.9% 51.6% | 210 70.9% 51.6% |
| accent-900 | 211 72% 90% | 210 55.9% 24.6% |
| accent-brand / brand-200 | 15 63.1% 59.6% (clay) | same |
| brand-000/100 | 15 54.2% 51.2% | 15 54.2% 51.2% / 15 63.1% 59.6% |
| accent-pro-000…900 | 251 34.2% 33.3% … 253 33.3% 91.8% (violet, for the paid tier) | 251 84.6% 74.5% … 250 25.3% 19.4% |
| danger-000/100/900 | 0 58.6% 34.1% / 0 56.2% 45.4% / 0 50% 95% | 0 98.4% 75.1% / 0 67% 59.6% / 0 46.5% 27.8% |
| success-000/100/900 | 125 100% 18% / 103 72.3% 26.9% / 86 45.1% 90% | 97 59.1% 46.1% / 97 75% 32.9% / 127 100% 13.9% |
| warning-000/100/900 | 45 91.8% 19% / 39 88.8% 28% / 38 65.9% 92% | 40 71% 50% / 39 93.4% 35.9% / 45 94.8% 15.1% |

**Named brand colours:**

| Token | Value |
|---|---|
| `--cds-clay` | #d97757 |
| `--cds-clay-emphasized` | #ba5b3c |
| `--cds-heather` | #cbcadb |
| `--cds-plum` | #827dbd |
| `--cds-cactus` | #bcd1ca |
| `--cds-mineral` | #629987 |
| `--clint-surface-warm` | #faf9f5 |

**Computed light-mode role colours:**

| Token | Value |
|---|---|
| surface-1/2/3/popover | #fff |
| fill-accent | #257de0 |
| fill-primary | #191919 (the black primary buttons) |
| text-primary | #000000e6 |
| text-secondary | #0009 |
| text-muted | #0007 |
| border-line | #0000001f |
| alpha-1 | 5% black |
| alpha-2 | 10% black |
| backdrop | #0006 (dark mode #00000080) |

**Dark-mode surfaces:** surface-1 #191919, surface-2/3 #1f1f1f, popover #303030, border #ffffff0a, border-line #ffffff1f, fill-primary #efefef, fill-secondary #ffffff26.

**Gray ramp:** `--cds-hsl-gray-0 … gray-900` has 30 steps, warm (hue 40–60, saturation 2–14%) for light steps and neutral (0%) for the darkest steps 850–900. Accent ramps red, yellow, green, blue and violet have steps 100/200/350/400/450/600/750.

**Charts:**
- Categorical 1–8: blue-400, orange-400, aqua-400, yellow-350, magenta-400, green-400, violet-350, red-350.
- Sequential: blue-700 down to blue-100.
- Diverging: blue-300 to gray-700 to red-300.
- Status: good green-400, warning yellow-200, serious orange-300, critical red-450.

## 3. Shape, elevation, spacing

| Token | Value |
|---|---|
| `--cds-radius` | .25rem |
| `--radius-card` | radius + .25rem×scale |
| Tailwind radii | xs .125, sm .25, md .375, lg .5, xl .75, 2xl 1, 3xl 1.5 rem |
| Settings dialog | 1024 × 800 px, radius 16 px, ring `0 0 0 1px rgba(0,0,0,.08)` plus `0 1px 2px` and `0 2px 8px` soft shadows |
| `--cds-shadow-popover` | light `0 8px 24px #0000001f, 0 2px 6px #00000014`; dark `0 8px 24px #00000052, 0 2px 6px #0003` |
| `--cds-shadow-sm/md/lg` | Tailwind defaults (`0 1px 2px #0000000d` / `0 4px 6px -1px …` / `0 10px 15px -3px …`) |
| Focus | `--cds-focus-shadow`: inset 1px page-bg ring + 1px accent ring + `0 0 6px 1px` accent glow at 60% |
| Controls | `--cds-h-control` 1.75rem; gap xs .5rem, sm .75rem; pad sm .5rem, md .75rem, xl 1.5rem |
| Containers | xs 20rem, sm 24, md 28, lg 32, xl 36, 2xl 42, 3xl 48, 4xl 56, 5xl 64, 6xl 72, 7xl 80 rem |
| Sidebar | `--kf-side-width` 288px, `--kf-side-floor` 200px |
| Dropdown | `--dropdown-max-height` 480px |

## 4. Motion tokens

| Token | Value |
|---|---|
| `--cds-dur-fast` | 60ms |
| `--cds-dur-snap` | 120ms |
| `--cds-dur-base` | 200ms |
| `--cds-dur-sheet` | 300ms |
| `--cds-dur-slow` | 450ms |
| `--cds-ease-out` | cubic-bezier(.165,.84,.44,1) |
| `--cds-ease-snap` | cubic-bezier(.32,.72,0,1) |
| `--cds-ease-overshoot` | cubic-bezier(.34,1.3,.64,1) |
| `--df-ease-out-cubic` | cubic-bezier(.215,.61,.355,1) |
| Tailwind default | 150ms, cubic-bezier(.4,0,.2,1) |
| Message actions | reveal in 120ms, out 60ms |
| Reveal delays | `--placeholder-reveal-delay` .5s, `--transcript-placeholder-reveal-delay` 2s, `--artifact-name-reveal-delay` 3s, `--hub-chin-placeholder-reveal-delay` 5s (skeletons appear only if loading is slow) |

**Keyframes:** 210 `@keyframes` exist. These are the reusable ones:

| Name | Effect |
|---|---|
| `cds-reveal-in` / `-out` | opacity 0 → 1 with translateY(4px) → 0 |
| `cds-slide-in-start` / `-end` | ±12px horizontal + fade |
| `cds-chip-in` | scale .8 + blur 2px → 1 |
| `cds-pill-pop-up` / `-down` | scale 1.32 |
| `cds-pill-dip-down` / `-up` | scale .82 |
| `cds-pill-roll-in-up` / `-down` | ±70% vertical + fade |
| `cds-skeleton-breathe` | opacity 1 → .6 → 1 |
| `cds-skeleton-sweep`, `cds-shimmer` | translateX −100% → 100% |
| `cds-shimmer-text-shine` | background-position 83.3% → 16.7%, ease cubic-bezier(.714,.121,.211,.888), hold at both ends 0–15% and 85–100% |
| `cds-dot-pulse` | opacity .2857 → 1 → .2857, peaks at 15–25%, ease (.165,.84,.44,1) |
| `typing-dot` | opacity .3 → 1 with −2px rise at 30%, 1.4 s |
| `status-mark-dot-0…3` | 4 dots offset by about 12.5% each, peak opacity .5 |
| `message-fade-up` | translateY(10px) + fade |
| `scale-in` | .95 → 1 |
| `pop-in-90` / `pop-in-99` | scale .9 / .99 + fade |
| `drop-in-10` | −10px |
| `shake` | ±3px, ±1°, scale 1.02 |
| `new-task-shake` | ±5px |
| `click-ring` | scale .22 → 1, opacity .95 → 0 |
| `expand-rows` | grid-template-rows 0fr → 1fr (height animation without measuring) |
| `cds-scroll-fade-*` | scroll-driven edge fade masks via animated custom properties |
| `cds-sticky-edge-*` | scroll-driven sticky header shadow |

The interactions agent's `CODE_INTERACTIONS_AND_MOTION.md` says where each token is used.

## Piano Trainer takeaways

- **Settings:** a token-only theme (HSL triplets swapped by `data-mode` on `<html>`) gives light, dark and system modes with no component changes.
- **Settings:** the accessibility font options (OpenDyslexic, Atkinson) and a `data-cds-contrast="more"` switch are cheap to add, and both fonts are OFL.
- **Everywhere:** adopt the five durations (60 / 120 / 200 / 300 / 450 ms) and three easings as Piano Trainer's motion scale.
- **Learn, Practice tools, Player:** use `expand-rows` (grid 0fr → 1fr) for accordions in lesson lists, and delay skeletons by about 0.5 s so fast loads never flash.
- **Practice tools:** the 8-colour categorical chart palette fits practice statistics charts in Profile.
