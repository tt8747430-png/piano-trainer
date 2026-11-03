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
| A1 | Transpose | three controls named in the brief | already one widget (`widgets/transpose` `TransposeTool`), the Player's and the editor's files only wrap it with their own state | checked, no change |
| A1 | headers | `LibraryHeader`, `PieceHeader` | both compose `ScreenHeader`; `ScoreBar` is the score's own bar in both modes (ADR 0115) | checked, no change |
| A2 | every screen | the bar's height | one `ScreenHeader`, one row of one height; `large` sets the title larger in the same row | checked; screenshots after |
| A9 | Archive (row ⋯, swipe, drag onto Archive, Select's bar, a folder's ⋯, a song's Settings) | archived at once, Undo only | asks first through one `confirm()` (`shared/ui/confirm.ts`, `Confirmer` beside the toasts), then says it with Undo | fixed |
| A9 | Delete songs / folder / take / pattern, Reset progress | each its own AlertDialog | `ConfirmDialog` | fixed |
| A9 | Publish / Discard / Unpublish / Delete (an editor's original, `features/edit-original`), Keep bars of a take, own music's Reset | own AlertDialogs, already R17's shape (question, one line, act named, red) but kept open while the server answers | move onto `ConfirmDialog` with a busy state when B6 (round 10) rebuilds publishing | open, round 10 |
| A9 | Delete account, Sign out, Reset progress on Settings | Settings pages | the Settings rebuild agent (A17) | in progress |
| A38 | a song's page | the pencil edited the page for an editor or an own song, but opened the score editor for a learner on a built-in song | the pencil edits the page in place, shown only to whoever may; "Edit score" a labelled button on the overview card for everyone (Practise · Edit score · Learned · ♡); the Settings page's "Edit the score" row goes (offered once, R29) | fixed |
| A38 | lessons, courses, levels, progressions, patterns | pencils | checked: each opens its own editing in place for an editor and is absent for a learner; the Player's pencil edits the score it shows | checked |
| A6 | Practice, the Player's Setup, a song's Edit, lessons | home-made phrases | Passing chords, Voice leading, Inversion, Approach chords, Root movement, Harmonic function, Credits / Composer / Lyricist, in en and ru; each in the glossary's "Words the app says" with its _Avoid_ words; `avoid-words.test.ts` fails them in a locale file. "Melody staff" goes with A35 (round 4), "Pulsing chords" was already gone | fixed |
| A39 | the Metronome | six meters; 6/8 clicked eighths; only beat 1 accented; no subdivision; drums a beat apart from the hat | any time signature, counted as players count it (dotted beat in 6/8, 9/8, 12/8; odd meters grouped 3+2, 2+2+3 with an accent per group); squares tapped through accent · beat · silent; Subdivision (8ths, triplets, 16ths, swing 8ths) softer than the beat; the drum groove per meter with the hat on 8ths or the subdivision; the speed trainer (from, to, step, every) | fixed |
| A39 | the Metronome | synthesised sounds; no flash; the Player's click its own | recorded CC0 samples (D16), the full-screen flash, and the Player's click and count-in from this engine | open, round 2 (this round) |
| A30 | Chords page and inversion drills | "one chord fingered by two rules" | checked: placedFingering and blockFingering both use handFingers, the drills' rule; one rule already | checked |
| B1 | badges | Scale Master by "keys practised" needs a record the app does not keep | counts scales learned (a scale step marked learned), tiers 1 · 3 · 6 · 12; keys practised would need the scale routine to record keys (a later round) | decided |
| A14 | Settings › Keyboard and recording; Settings › MIDI keyboard | pages named "keyboard" without saying which (R22) | On-screen piano · Connect a piano · Computer keys · Sound and recording, each at `/settings/<id>`; en/ru swept for "keyboard"/«клавиатура» alone | fixed |

### A14 quick test: from the page names alone

- **Metronome** → Sound and recording (its row leads to the Metronome, where its sounds live; a take's metronome switch is on the page itself).
- **Note names on keys** → On-screen piano (Look: Note names).
- **My digital piano** → Connect a piano (MIDI input, devices, how to pair by cable or Bluetooth, the MIDI log).

Left: the on-screen piano's accessible name is still "Keyboard" (`common.keyboard`, 27 test files name it); it reads alone only to a screen reader, beside its own buttons.
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
