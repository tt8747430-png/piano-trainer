# The screen's bar that holds, a rail of pictures, and the computer's shortcuts

**Date:** 2026-10-09 · **Status:** decided (owner: decide and continue)

## What the owner asked

1. "fix the header flickering, when scrolling to top or bottom"
2. "refactor the piano and its settings, because I don't like how its settings look"
3. "add computer shortcuts"
4. Look again at the 2026-10-05 notes (Practice, Songs, the editor, the layouts) for what is still open.

## 1. The screen's bar

### What is wrong (reproduced in the browser, 2026-10-09)

- **The bar is lost on every tabbed page.** Chords, Chord finder, Scales and keys, Progressions, Passing chords,
  Reharmonise and Accompaniment put the bar and their tabs in one short wrapper. A sticky box cannot leave its
  parent, so the bar scrolls away with the wrapper and never comes back; `--screen-bar` still reserves its height,
  so the pinned keyboard jumps 72–88px down over an empty band each time the page turns upward, and back up each
  time it turns down. Measured on `/practice/chords`: bar shown, its box at −266px, the keys pushed to 72px.
- **Pinned content jumps while the bar slides.** The bar moves over 200ms; `top: var(--screen-bar)` changes at once.
- **The bar leaves before the page has scrolled past it.** Eight pixels down from the top it slides away and leaves
  a band of paper where it stood. A page's end on a browser that overshoots reads as a turn upward.

### The design

- **A subject's tabs are the bar's second row.** `ScreenHeader` takes `tabs`; the seven pages drop their wrapper.
  The bar's parent is the page's root, which is as tall as the page, so the bar holds. The tabs come back with the
  title on the way up: the sibling page is one tap away from anywhere on the page.
- **The bar is measured whole.** One `ResizeObserver` on the header reports its content box (what pinned content
  sits under, `--screen-bar`) and its border box (how far the page must scroll before the bar may hide).
- **`useShownOnScrollUp(past)`.** The bar shows while the page has scrolled no further than `past` (the bar's own
  height), and from the moment the page turns upward until it turns down. A position is read inside the page's
  scroll range, so an overshoot at either end is no direction.
- **Pinned content moves with the bar.** `Pinned` transitions `top` for the bar's 200ms on the bar's curve, and not
  at all for a learner who reduces motion.
- **Held by a test.** Every screen in the shell is opened and its bar must be a child of the page's root, itself a
  child of `main`. `top-screen-bar-8`, used nowhere, goes.

## 2. The keyboard's rail

### What is wrong

The rail reads as a sentence: `Keys Fit Large Whole piano · Note names C All None`, then four icons. Seven words
and two labels in a strip 28px tall, in the one place the eye should find keys. On a phone the same words wait
behind a settings button and scroll sideways. The owner's two earlier asks still hold: nothing hidden in a pop-up
(2026-10-05), and "its options are a little bit redundant".

### The design: every control a picture, all in sight, on every screen

Left to right: **map** · ‹ › · **− +** · **names** · **typing** · MIDI sound · **glissando** · **pedal**.

- **The map is the rail, not a setting.** Where the keys scroll, the strip of 88 keys with its frame is always
  there. `KeyboardSettings.map` goes (`pt-settings` version 10: a version-9 save is read, its `map` ignored).
- **Key size is a zoom.** `−` and `+` step Whole piano · Fit · Large, the order `KEY_SIZES` now has; the button at
  an end is disabled. The keys and the map's frame are the state: no words.
- **Note names is one button that cycles** C · all · none, wearing what it will show: `C`, `CDE`, or a bare key.
  It is pressed unless names are off; its accessible name says the state ("Note names: every C").
- **Typing** is the keyboard icon, as now; **glissando** the waves, as now. **Pedal** gets a pedal: the footprints
  go, a drawn piano pedal comes (`PedalIcon`, one stroke like Lucide's).
- **A pointer that cannot use a control does not see it.** ‹ › and typing show for a fine pointer; a finger swipes
  the rail and has no letters to type. So a phone's rail is map · − + · names · glissando · pedal: 220px of
  buttons, the map takes the rest of 328px or more, and the settings button with its sideways strip goes.
- **Every rail button says what it is on hover** (`title`), with its shortcut where it has one.
- The groups stand apart by a gap: where (‹ ›), how it looks (− + names typing), how it plays (MIDI glissando
  pedal).
- **Settings → Keyboard** keeps the same choices as fields, in the zoom's order, without the map; it gains
  **Shortcuts**, which opens the sheet of §3.

`RailChoice`, `RailSettings` and `KeyboardRailSettings` go; `RailButton` takes any glyph.

The keys themselves stay: their proportions (a white key 34–48px wide at Fit, 4.4 times as long, at most 32% of the
screen's height) were set after the "too stretched, too squeezed" note and measure right on both screens today.

## 3. The computer's shortcuts

Only the score editor has shortcuts. The Player, the trainers and the shell have none, and nothing lists the keys
that already play the piano.

### The rule

One listener, in `ShortcutsProvider`; a screen says what its keys do with `useShortcuts(group, bindings)`. A key
belongs to the deepest screen that bound it. No shortcut fires:

- while a field is typed in, or inside a pop-up (a sheet, a popover, a list): those keys are theirs;
- on Space or Enter while a control has the focus: the control takes it;
- on auto-repeat, unless the binding asks for it (the tempo);
- when something already handled the key (the piano's own arrows).

Letters are read by physical key (`code`), as the typing keys are, and only the letters typing leaves free are
used alone: R. Named keys and `?` are read by `key`.

### The keys

| Where | Keys | What |
| --- | --- | --- |
| Anywhere | `?` | The shortcuts, in a sheet: this screen's first |
| The shell | `Alt` `1`–`4` | Path · Songs · Learn · Practice |
| The shell, a laptop | `⌘B` / `Ctrl B` | The sidebar, open or collapsed |
| Songs | `/` | Search |
| The Player | `Space` | Play or stop |
| | `←` `→` | A step back, a step on |
| | `↑` `↓` | Listen's tempo, 5 up or down (repeats) |
| | `R` | Loop the bar, or remove the loop |
| | `Home` | Back to the first bar |
| | `Esc` | Close |
| A trainer | `Enter` | The round's action: Check, Next |
| | `1`–`9` | The answer in that place |
| | `R` | Hear it again |
| Chords · Scales · Progressions | `Enter` | The page's Play, or Stop |
| The piano (listed, not new) | `A`–`'`, `Z` `X`, `Space` | Play, the octave, the pedal |
| The score editor (listed, not new) | as spec 2026-10-01 §6 | |

In the Player Space is Play, so the keyboard there holds no pedal on Space (`spacePedal={false}`); the rail's
Pedal and a MIDI pedal still do.

### Where they are found

- `?` and Settings → Keyboard → Shortcuts open `ShortcutsSheet`: groups of rows, a name and its keys as `Kbd`
  (shadcn's, added with the CLI); `⌘` on a Mac, `Ctrl` elsewhere.
- The Player's buttons and the rail's name their key in `title`.
- A screen with no fine pointer shows no Shortcuts button.

### Shape

- `shared/lib/shortcuts/`: `combo.ts` (a combo, `matches`, `comboKeys` for display; pure, tested), `guards.ts`
  (`isTyping`, `takesKey`, `inPopUp`: the selectors typing and the Space pedal already use, in one place),
  `ShortcutsProvider` + `useShortcuts` + `useShortcutGroups` (the registry the sheet reads).
- `features/shortcuts-help/`: `ShortcutsSheet`, `ShortcutsButton`, and the `?` binding.
- Each screen's bindings sit beside what they drive: `widgets/practice-player/model/use-player-shortcuts.ts`,
  `widgets/trainer-board`, `widgets/app-nav` (places, sidebar), `pages/songs` (search), the explorers' Play.

## 4. The 2026-10-05 notes, read against today's app

| Note | Today |
| --- | --- |
| Leftover Learn pages under Explore; chords by scale and by semitone as pages; quiz as its own grouped page | Done: Practice is eight places (ADR 0029, 0030, 0034), Quiz one page of groups |
| Buttons that look like links; two-column pages | Done: every choice in sight as fields (spec 2026-10-05) |
| Songs overview, "chords in this song", the learned badge | Done: collections as tabs, Chords with Check these chords, `LearnedButton` |
| The Setup: pattern and hands, inversion peeking, toggles | Done: `PatternCard`, `InversionGlyph`, toggle tiles |
| New song drawer, the editor's options row | Done: the editor of spec 2026-10-01 and its later passes |
| A collapsible sidebar, widths that adapt | Done: `sidebar` setting, gutters that grow |
| The piano's options redundant, a badge toggle for glissando | Glissando done; the rest is §2 |
| Selected states and focus rings | Held by the kit; the rail's buttons keep theirs in §2 |

Nothing else in the notes is open. What this spec adds to them is §2.

## Out of scope

The Path page (the notes set it aside), the two chord questions left in the owner's notes (the dominant 11th's 3rd;
two hands in Scales' Chords view), and any new exercise or lesson.
