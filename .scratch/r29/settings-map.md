# Settings map (A10, R18)

Every field of `pt-settings` (`entities/settings/model/types.ts`), where it is shown today, and its one home.
"Rail" = the on-screen piano's own quick tools (`keyboard.railControls`, the learner's choice of which):
toolbar tools over the same setting (B10's customisable bars), not a second settings page.

| Key | Shown today | Home | Elsewhere |
|---|---|---|---|
| `theme` | Settings › General | `appearance` | — |
| `locale` | Settings › General; Welcome; the lesson/course/journey/progression editors' language | `general` | the editors' draft language is the *draft's* language, not this setting: they stop writing `locale` (A10 finding) |
| `lessonReading` | Settings; a lesson's Settings; a course's Settings (**duplicate**) | `lesson-reading` | link row on the lesson's and course's Settings |
| `practice.fingerNumbers` | Player View menu (ViewChip) | `player` (Display) | the one Fingering switch (A30) |
| `practice.namedNotes` | Player View menu | `player` (Display) | — |
| `practice.positions` | Player View menu | `player` (Display) | — |
| `practice.metronome` | Player transport (quick toggle) | `metronome` | transport quick toggle (A35 keeps it) |
| `practice.countIn` | Player Sound button | `metronome` | — |
| `sound.rh/lh/staves/recording/click` | Player Sound button; Metronome page (click) | `player` (Audio playback); click → `metronome` | — (staves per staff, staves-play-show spec) |
| `trainer.autoNext` | Trainer setup | `trainers` | — |
| `keyboard.keySize, keyLength, swipe, namedKeys, markNotes, chordNames, typing, autoplay, dock, folded, foldedLandscape, railControls` | Settings › Keyboard (Playing page); rail: chordNames, typing, namedKeys, swipe, keySize | `on-screen-piano` | rail tools |
| `recorder.click, recorder.tune` | Settings › Playing › Recording; editor's Recording settings (**duplicate**) | `recording` | link row from the editor's Settings |
| `editing.hearNotes` | editor's Settings | `score-editor` | — |
| `paletteFolded, paletteSections` | the editor's palette itself | UI state (layout of the palette, kept as the learner left it) | not in the registry |
| `midi.*` | Settings › MIDI keyboard; rail: sound | `midi` | rail tool |
| `chordFinder.*` | Chord finder page | `chord-finder` | — |
| `scoreView.layout, music, diagrams, chordNames, lyrics, textSize, keys, pinned, askOnOpen` | Player View menu; editor's tools row (layout) | `player` (Display) | the View menu keeps *which view* (music) and its layout as the view switch (Chordify's View menu: what you look at, R18 "the page shows what you look at") |
| `scoreView.hidden` | Player | merges into staves' Show (staves-play-show spec) | — |
| `melody` | Player Setup | removed (staves-play-show spec) | — |
| `metronome.*` | Metronome page | `metronome` | the Player's Tools link row |
| `sidebar` | the sidebar's collapse button | UI state | not in the registry |
| `foldedSections` | every fold | UI state | not in the registry |
| `welcomed` | Welcome | UI state | not in the registry |

## Missing (A24): a Settings page for every Practice page
`chords`, `scales`, `intervals`, `progressions`, `accompaniment`, `chord-finder`, `trainers` get kind pages; their
contents are decided in round 2 with each page (what today sits on the page as a preference moves there).
