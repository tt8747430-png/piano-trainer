# claude.ai: research index

claude.ai was studied on 2026-11-20 as a reference for menus, dialogs, settings, shortcuts, toasts and motion. The source was the owner's signed-in account in Chrome, in German.

## Method
1. **Live recording.** I clicked through every menu and popup with Claude in Chrome. I opened the settings dialog and read the text and controls of all 15 pages. I read the CSS custom properties and keyframes from the live stylesheets. Nothing was changed, sent or shared. The share dialog was only opened.
2. **Code.** The public production JavaScript was downloaded: 5,243 minified chunks, 151 MB, served by `assets-proxy.anthropic.com`. No source maps exist (`.map` returns 404). Two agents read it statically and checked every claim twice. I spot-checked their key constants against the bundles.

The site's build is `0d4c697ee9`, git hash `0d4c697ee92cd073dd85742c468e4621a7382bc3`.

## Files
| File | Content |
|---|---|
| `UI_FLOWS_AND_MENUS.md` | App shell, composer, + menu, model and effort picker, account menu, ⌘K palette, settings dialog routes, shortcuts dialog, language dialog, top-level pages, chat view, share popover |
| `SETTINGS.md` | Every settings page and control with kind and value (personal data removed) |
| `DESIGN_TOKENS.md` | Fonts, type scale, light/dark colour tokens, chart palettes, radii, shadows, spacing, motion tokens, keyframes |
| `CODE_SETTINGS_AND_PERSISTENCE.md` | From the code: settings routes and gates, settings search ranking, storage key and default for each setting, server endpoints with optimistic save and rollback, theme, fonts, language loading, usage forecast, time limits; Piano Trainer settings blueprint |
| `CODE_INTERACTIONS_AND_MOTION.md` | From the code: shortcut registry, Base UI menus and dialogs with exact delays, ⌘K palette, toasts, sidebar, usage banner, composer, motion system; Piano Trainer interaction blueprint |

## Limits
- **Not stored here:**
  - The code is Anthropic's proprietary work, so it stays outside the repo, in `~/Downloads/claude-ai-formatted/` and `~/Downloads/claude-ai-site/`. The docs quote at most one short line per claim.
  - The walk-through GIF is at `~/Downloads/claude-ai-flows.gif`. It shows the account email, so it isn't committed.
- **Server-side behaviour:** server logic (limits, memory, search ranking on the server) is visible only as API calls.
- **Feature-gated flows:** flows behind feature flags or other plans may be missing.
- **No exports:** nothing was exported. Anthropic's fonts and brand are proprietary. Use the patterns, not the look.

## Data (`data/`)
Facts extracted from the code. Values only, no code.
| File | Content |
|---|---|
| `shortcuts.json` | 95 shortcut ids with group and default Mac / non-Mac bindings |
| `motion-and-timings.json` | durations, easings, menu, hover, toast, sidebar and search timings |
| `settings-model.json` | storage keys, values, defaults, effects, save endpoints and rollback, settings search ranking, usage thresholds |

Deliberately not in the repo (public): claude.ai's JS, CSS, HTML, SVG icons, translation strings and fonts. They are Anthropic's copyrighted work; local copies are in `~/Downloads/claude-ai-site/` and `~/Downloads/claude-ai-formatted/`.
