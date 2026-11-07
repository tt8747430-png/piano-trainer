# Craft details

Distilled 2026-11-07 from the design-engineering skills shown in Tim Gabe's "Why People Trust Products That Look Made
With Care": ibelick/ui-skills `baseline-ui` (MIT), jakubkrehel/make-interfaces-feel-better (MIT), emilkowalski/skills
`emil-design-eng` and `ui-cheatsheet` (MIT), benjitaylor/skills `stageshow` (MIT). Only what fits Piano Trainer is kept.
`DESIGN.md` and the owner's rulings win where they differ; the differences are listed at the end. Read before any screen,
beside `ui-and-mockups.md` and `impeccable`.

## The video's three things, for us

- **Decide what premium means:** a shipped sheet-music app (Flat, forScore, Chordify), calm paper and ink, one honey
  control per screen.
- **Name one decision** per round, and make it bold: a whole screen redesigned on a canvas, not a padding tweak.
- **Look at the app first,** at 393 and 1710, both themes, before deciding anything (`testing.md`).

## Details that compound

| Area | Rule |
| ---- | ---- |
| Numbers | Any value that changes in place is `tabular-nums` (tempo, bar, count, timer). |
| Text | Headings `text-balance`, body `text-pretty`, running text at most about 65ch; truncate or clamp in dense rows. |
| Plurals | Counts go through ICU plural rules in en and ru, never "1 songs" or a hand-made suffix. |
| Dates | Relative for a week ("3 days ago"), then the absolute date. |
| Corners | Nested surfaces are concentric: outer radius = inner radius + the padding between. |
| Alignment | Optical over geometric: a play triangle and a lone icon in a circle are nudged until they look centred. |
| Icons | One set (Lucide), stroke matched to the text beside it, `currentColor`; outline by default, filled only for the active state (the heart). |
| Hit area | 44px on touch, 40px at least in a dense laptop row, widened by a pseudo-element when the mark is smaller; two never overlap. |
| Images | A song cover gets a 1px outline at 10% black, or 10% white by Night. |
| Fixed things | `dvh`, never `vh`/`h-screen`; fixed bars add the safe-area insets. |
| Empty | Every empty state has one clear next action. |
| Errors | Shown beside the action that failed. |
| Loss | Destructive actions ask first through `ConfirmDialog`. |

## Motion

| Rule | Why |
| ---- | --- |
| Ask first whether it moves at all: things done tens of times a day (chips, list rows, keys, shortcuts) do not animate, they change. | The cost repeats on every press. |
| Only `transform` and `opacity` move; never `transition: all`, never width or height. Name the properties. | Smooth on a phone; nothing else animates by accident. |
| One curve, the app's `--ease-out`, for enters and exits; never `ease-in`. | `ease-in` feels sluggish at the start, where the eye is. |
| Feedback in 100–200ms; popovers 125–250ms; sheets about 450ms. | |
| Nothing appears from `scale(0)`; from 0.95 and transparent at most. A popover grows from its trigger; a dialog from the centre. | Nothing in the world appears from nothing. |
| Transitions, not keyframes, for state that can change mid-way. | They can be interrupted. |
| Exits are shorter and smaller than enters. | |
| No enter animation on first render. | The page does not move on its own. |
| Under reduced motion every transition is instant, and motion is never the only sign of a change. | |
| `will-change` only on what is animating now; never animate a large blur. | |

## Reviewing a screen

Slow it down: the browser's Animations panel at 10%, and walk every state (rest, hover, focus, pressed, loading, empty,
error, offline). What looks off at 10% is what feels off at full speed. Report each finding as a table row: severity,
place, before, after, why.

## Where the app's own rules differ

- **Press:** the skills scale a pressed button to 0.96. `DESIGN.md`: buttons and chips change colour alone and never move;
  only the floating actions keep their press (`active:scale-96`).
- **Depth:** the skills prefer shadows to borders. `DESIGN.md`: cards are parted by surface and a 1px line, never a shadow.
- **Letter-spacing:** `baseline-ui` forbids changing it; `DESIGN.md` sets it per type role, and that stands.

## Not adopted

- **Agentation** (benjitaylor/agentation, PolyForm Shield 1.0.0, not open source): a click-to-annotate overlay for giving
  an agent feedback on a page. Installing it is the owner's decision; screenshots already do this job here.
- **Stageshow's** faux product UI is for marketing illustrations; its "real words only where the story is" and "no empty
  corners" rules apply to the canvases.
