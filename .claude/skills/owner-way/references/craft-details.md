# Craft details

Distilled 2026-11-07 from the video transcripts in `redesigning-a-screen/references/lessons-from-videos.md` and the
design-engineering skills shown in Tim Gabe's "Why People Trust Products That Look Made
With Care": ibelick/ui-skills `baseline-ui` (MIT), jakubkrehel/make-interfaces-feel-better (MIT), emilkowalski/skills
`emil-design-eng` and `ui-cheatsheet` (MIT), benjitaylor/skills `stageshow` (MIT). Only what fits Piano Trainer is kept.
`DESIGN.md` and the owner's rulings win where they differ; the differences are listed at the end. Read before any screen,
beside `ui-and-mockups.md` and `impeccable`.

## The video's three things, for us

- **Decide what premium means:** a shipped sheet-music app (Flat, forScore, Chordify), calm paper and ink, one honey
  control per screen.
- **Name one decision** per round, and make it bold: a whole screen redesigned on a canvas, not a padding tweak.
- **Look at the app first,** at 402 and 1710 (and the 393 check), both themes, before deciding anything (`testing.md`).

## Details that compound

| Area | Rule |
| ---- | ---- |
| Numbers | Any value that changes in place is `tabular-nums` (tempo, bar, count, timer). |
| Text | Headings `text-balance`, body `text-pretty`, running text at most about 65ch; truncate or clamp in dense rows. |
| Plurals | Counts go through ICU plural rules in en and ru, never "1 songs" or a hand-made suffix. |
| Dates | Relative for a week ("3 days ago"), then the absolute date. |
| Corners | Nested surfaces look concentric (v19: "a pill in a pill is a pill"), on `DESIGN.md`'s four-step scale: the inner corner is the step nearest the outer radius less the inset; never a new value. |
| Alignment | Optical over geometric: a play triangle and a lone icon in a circle are nudged until they look centred. |
| Icons | One set (Lucide), stroke matched to the text beside it, `currentColor`; outline by default, filled only for the active state (the heart). |
| Hit area | 44px on touch, 40px at least in a dense laptop row, widened by a pseudo-element when the mark is smaller; two never overlap. |
| Images | A song cover gets a 1px outline at 10% black, or 10% white by Night. |
| Fixed things | `dvh`, never `vh`/`h-screen`; fixed bars add the safe-area insets. |
| Empty | Every empty state has one clear next action. |
| Errors | Shown beside the action that failed. |
| Loss | What can be undone happens at once with Undo in its toast; only what can't, or reaches other people, asks first through `ConfirmDialog`. |
| Framing | A loss is named as one: "Your 12 songs live only on this phone"; the way out names its cost ("Keep on this phone only"); always true. |
| Hierarchy | The value outranks its label (120, then "BPM" quieter), never a column of "label: value" rows. |
| Over a picture | An icon on a cover or photo gets a backing, so it reads on a light picture as well as a dark one. |
| Lines | Dividers are soft hairlines; closer spacing, not a line, says two things belong together. |
| Labels | No redundant label ("Tempo: 120 BPM" is "120 BPM"); a badge is one or two words. |
| Inputs | Chosen by frequency: a wheel or slider for a one-time value in a known range, a stepper or field for frequent or precise entry. |
| Defaults | Every choice starts on the usual answer; the button says what it will do ("Show 12 patterns"). |
| Same part, same look | Two search fields differ only in placeholder; small controls share one radius; Back and Skip match. |
| Feedback | A press shows at once: the button dims, a spinner for a longer wait; what was saved marks where it went (a dot on its tab). |
| Charts | A value axis, flat bar ends, one bar per thing counted; read before admired. |
| Choices | Every choice offers Skip, an "other" with search, and a way back. |
| Colour | Grey first; the accent only for data and what is switched on. |
| Context | A number carries its comparison (since last week, with an arrow); good or bad by emphasis, not red and green. |
| Tables | Numbers aligned right; rows show hover; what can be pressed shows hover. |
| Controls | No duplicates, no Apply: changes take effect live; a switch for on/off, checkboxes for several, a slider labelled at both ends. |
| Phone | Type and targets are no smaller than on a laptop; one direction of scroll per section; no card in a card. |

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

## Instructions from the owner's articles (2026-11-17)

From Chawla, Nurkhon, Malewicz and Babich (`redesigning-a-screen/references/lessons-from-videos.md`). Each is a rule to
follow, not a trend to note; `DESIGN.md` and the rulings still win.

1. **Bars stay, quietly.** Every bar and the phone's tab bar are the `glass` surface and stay on screen while the page
   scrolls under them: never hidden by scrolling, never given a band or line. A bar may shrink while scrolling down
   only if its board draws the smaller state, and then grows back on the first scroll up.
2. **Glass only over moving content.** Glass goes on what floats over a page (bars, the tab bar, floating actions, the
   floating keyboard's frame); never on a card, a row, a sheet's body or a button inside content.
3. **No trend textures.** No metal, mirror-ball, jelly, neumorphic extrusion, shader, particle field, 3D carousel,
   endless gallery, parallax or mascot on any screen. Paper and ink only; a texture is allowed only where it is the
   music itself (the staff, the keys).
4. **Motion confirms an act, or it is not drawn.** Allowed: a menu or popover growing from its trigger, a sheet rising,
   a toast arriving, a check after Save, the keys lighting as they sound. Each uses the values in Motion above.
   Not allowed: motion on load, motion that loops on its own off the music, motion on scroll.
5. **Every width holds.** A screen is drawn at 402 and 1710, and must also hold at 744 (iPad mini, upright), 852×393 (a
   phone on its side) and 1024: nothing cut, overlapping or stranded in an empty band. A passport foldable opened
   is a short, wide tablet and falls in this range. Check these widths in Pass 2 (`testing.md`).
6. **A component is handed over with all its states.** A kit part made or changed in `shared/ui` (and its board helper)
   carries, in the same commit: default, hover (pointer only), pressed, `focus-visible` (the app's one outline, 3px of `ring` 2px out, from `theme.css`; never restated),
   disabled (50% opacity, no pointer), and loading where the act waits (a spinner in place of its icon, the label
   kept). `DESIGN.md`'s Components entry names each state's token.
7. **A token is a decision.** A new or changed token in `DESIGN.md`'s frontmatter is named by its role (`surface`,
   `text-muted`, `radius-card`), never by its look (`blue`, `gray-1`); the paints (`paint-*`, `wash-*`) are the one
   exception, being the music's data colours. In the same commit its prose says what it is for, why, and when not to
   use it. A token nothing uses is deleted; two that serve one role become one.
8. **Tune by numbers, then fix them.** A value tuned by eye on the canvas (a duration, a blur, an inset) is written into
   the board's code as a number and into `DESIGN.md` when it is a token; never "about" or "feels right".

## Where the app's own rules differ

- **Press:** the skills scale a pressed button to 0.96. `DESIGN.md`: buttons and chips change colour alone and never move;
  only the floating actions keep their press (`active:scale-96`).
- **Depth:** cards separate by their lighter paper and a 1px ring, never a shadow, as the boards draw them;
  shadows belong to what floats (`DESIGN.md`).
- **Letter-spacing:** `baseline-ui` forbids changing it; the boards tighten large titles (-0.01em, a tempo's figures
  -0.03em), and `seven-questions` (large headings tighten 2 to 3%) stands over the ban.
- **Motion values:** `animate`, `emil-design-eng` and `review-animations` share one table (curves, durations, press
  0.97, reduced motion "gentler, not zero"). The app overrides four rows: its one curve is `--ease-out`
  `cubic-bezier(0.22, 1, 0.36, 1)` (`src/styles/theme.css`); sheets take about 450ms; buttons do not scale on press;
  under reduced motion every transition is instant. `impeccable`'s craft floor lets blur, clip-path, mask and shadow
  animate: here only `transform` and `opacity` move (`DESIGN.md`). `apple-design`'s springs for everything touchable
  do not apply; the one curve does.
- **Destructive actions:** `baseline-ui`'s AlertDialog for every destructive act and `emil-design-eng`'s
  hold-to-delete do not apply: what can be undone happens at once with Undo; only what cannot asks (`CLAUDE.md`).
- **Defaults:** `baseline-ui`'s "no animation unless asked", Tailwind's default shadows and Base UI give way to
  `DESIGN.md`'s motion, the `elevation-*` tokens and shadcn (`practices.md`).
- **Zoom:** `mobile-native`'s "never disable zoom" yields to the installed app's zoom lock (`#standalone-boot`).

## Not adopted

- **Agentation** (benjitaylor/agentation, PolyForm Shield 1.0.0, not open source): a click-to-annotate overlay for giving
  an agent feedback on a page. Removed 2026-11-13 with the unneeded skills; screenshots do this job here.
- **Stageshow's** faux product UI is for marketing illustrations; its "real words only where the story is" and "no empty
  corners" rules apply to the canvases.
