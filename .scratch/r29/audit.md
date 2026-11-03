# Round 29: audit

One row per finding: where, what's wrong, the single fix, its state.

| Item | Where | What's wrong | Fix | State |
|---|---|---|---|---|
| A10 | a lesson's Settings; Settings › General | "Lessons read as" set in two places | home Settings › General; the lesson's row links there | fixed |
| A10 | the editor's Sound popover; Settings › Keyboard and recording | a take's Metronome and Play melody switches in two places | the popover keeps the volumes and links to Recording's home | fixed |
| A10 | the Metronome page | writes the Player's click volume (`sound.click`) | moves to the Metronome's one set with the engine (A39, round 2) | open, round 2 |
| A10 | `settings-homes.test.ts` | nothing stopped a second home | static test: each preference command called only from its home | fixed |
| A10 | Settings pages | not drawn from the registry; no two panes on a laptop | R20 two-pane rebuild from the registry | open, round 1 (A12) |
| A11 | a song's Settings › In your library | Favourite as a switch (an act posing as a setting, R19) | removed; ♡ on the overview card, the row menus, swipe and Select keep it | fixed |
| Constraints | Settings › Version | only the build; Later on the banner left no way back to an update | Version row as iOS's Software Update (status, tap to check, offline says so), Install and restart, the Profile's gear marked while a version waits; one update state (`shared/lib/app-update`) | fixed |
| R20 | Settings › Help | credits only in a hover title | the group's footnote line | fixed |
| A8/R14 | every `rounded-*` in `src/` | 12 sizes in use (xs–4xl, full, `[0.625rem]`); no shape scale | tokens `--radius-control/card/sheet/pill` (+ the keys' two) in `theme.css`; every class outside the primitives on them; Tailwind's sizes mapped onto the scale; `src/styles/shapes.test.ts` fails a one-off | fixed |
| A8/R15 | Segmented, chips, toggle chips, picture tiles, tabs, sidebar, toolbar tools, pickers, the editor's palette | five chosen looks: card thumb in a line, ink line + sand, sand + border, ink underline, link tint (Flat's), umber; Learned and tiles grass | one `choice` utility: the chosen fill (`--chosen`) to the control's edges, ink, line and weight unchanged; hover the lighter muted; `src/styles/choice.test.ts` fails a second highlight | fixed |
| A8 | the Player's tools capsule | the chosen tool's fill stopped short of the capsule's edges | capsule unpadded, its tools pills | fixed |
| A8 | a song's Key / Time / Tempo | facts with no line, unlike every chip | the chip's soft line on card paper | fixed |
| A8 | the tempo popover's note values | three highlights at once (link ink, a ring, a caret) | the chosen fill alone | fixed |
| A8 | the Practice list, a `RowGroup` | hover an inset block inside the card's padding | the rows are `RowLink`s (the settings rebuild owns them) | open, settings agent |
| A36 | the shared button | `transition-all` grew the focus ring in over 150ms (it read as no ring) | colour transitions only | fixed |
| A36 | fields, switch, slider, toast, take rows, palette headings, New song's tiles | focus drawn as a box-shadow ring, an underline or a 2px outline | the base rule's 3px outline, 2px out (inset in scrollers); `src/styles/focus.test.ts` | fixed |
| A36 | Learn's level chips | the ring cut by the strip that scrolls them | inset ring | fixed |
| A36 | Learn, Songs, a song, Practice, Chords, Settings at 402 and 1280 | Tab order checked with Playwright: skip link, places, then the page top to bottom; no trap, nothing skipped | `pages/practice/ui/tab-order.test.tsx` holds Practice's walk | checked |
| A36 | the keys' rail | its buttons draw the ring on their inner chip, the keys their two-tone ring | by design (DESIGN.md The keyboard) | kept |
| A36 | a song's words, a title edited in place | focus shown by the field's fill, no ring | a document's line; left as it is | kept |
| A31 | the shared button | animated every property and dropped 1px when pressed: a row of buttons twitched | colour only; no press offset or scale on buttons, chips, tool keys, swatches, Continue | fixed |
| A31 | Chords, Scales at 402 (CLS 0.036) | the floating actions started at the foot and jumped over the docked keys a frame later | `Docked` measures before first paint | fixed |
| A31 | Chords at 1280 (CLS 0.099) | the staff's place drew 300px wide, the engraving 160px: the heading row jumped sideways | the place's lines drawn over it, not sizing it | fixed |
| A31 | Chords, Scales at 1280 (CLS 0.019, 0.008) | the floating actions' side room still lands a frame after the docked keys on a fresh load | measured in a layout effect now; the rest is the keys' first frame | open, small |
| A31 | Chords: Chord size | Seventh, Suspension, Added tones, Alterations rows came and went; Inversion swapped for Right hand from: Hands jumped up to 150px | every row stays, greyed where nothing applies; chips hold two rows; Right hand from as tall as the inversions | fixed |
| A31 | Chords at 402: Chord size 9th / 11th | the heading block (names, staff) changes height with the chord, moving all under it | Part A 20/32's rework of the page | open |
| A31 | the screen's bar | slid away on short pages, taking pinned controls with it; hid while a field or menu was open | hides only on a page over two screens tall, never while a field is written in or a menu is open | fixed |
| A31 | a score re-engraved | blank while it engraves again | already keeps the old drawing (`ScoreView`) | checked |
| A31 | Learn, Songs, a song, Practice, Settings at 320, 402, 1280 | CLS on load 0 | after-shots `shots/after/look-*.png` | checked |
