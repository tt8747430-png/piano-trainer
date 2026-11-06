# R32-A: the Player, its piano and pedals, and its performance

## Source

The owner, 2026-11-05:

- "i dont like … the piano settings and its look with these pedals, make proper pedals not there at the bottom."
- "the player is very lagging and when multiple notes playing it hangs very much."
- "refactor the ui further of the player and implement as close as possible to the refactored mockups and not only half."
- "we still have this weird reserved a lot of space above the keyboard and the notifications [the tip line] still
  reserve this space."
- "the view settings of the sheet are not very usable and the settings are still not very understandable and not made
  by the relevancy to the user."
- "make the mockups inspired from the example apps and websites and also check the piano.org piano implementations and
  its pedals." Research: `player-research.md`.
- Later the same day: "refactor all the text and string and all names and write professionally, not plain words":
  every label, description, tip and empty state reads as a polished product (Apple, Flat, MuseScore), in precise
  musician's terms, in English and Russian.

Standing rulings: the approved R31 mockup (`.scratch/r30/mockups/player.html`, spec `r31-player.md`); one gear per
screen; floating things reserve no space; 44px targets; the piano is one implementation shared with the score editor
and the explorers.

## Today (2026-11-05, before R32; shots in `.scratch/r32/shots/before/`)

| Part | What it does | Files |
| --- | --- | --- |
| Performance | Fantaisie-Impromptu, 10 s of playing on a laptop (dev): 33 long tasks, 2.25 s blocked, 47 frames over 50 ms, p95 frame 83 ms. Every beat re-rendered all 64 engraved lines and 88 keys; the lit Ped. mark restyled every engraved element | `widgets/sheet-music/ui/SheetLines.tsx`, `SheetMusic.tsx`, `PedalMarks.tsx`, `shared/ui/piano-keyboard/PianoKeyboard.tsx` |
| The strip over the keys | a 56px band (`KeyRail`, `h-14`) above the keys: the chord, − +, ⚙, and one brass lever at its right end | `shared/ui/piano-keyboard/KeyRail.tsx`, `Pedal.tsx`, `features/live-keyboard/ui/KeyPedals.tsx`, `LiveKeyboard.tsx` |
| Reserved space | the screen's grid keeps a `status` row with a 12px gap above and below it even when empty; the tip ("Tap Play to listen to the song.") takes that row's full height above the keys | `widgets/practice-player/ui/PlayerScreen.tsx`, `pages/player/ui/PlayerLayout.tsx`, `CoachLine.tsx`, `styles/theme.css` (`player-screen`) |
| The bar | ✕ · title · ✎ · Piano keys · MIDI (always, greyed with a dot) · ⚙ | `ScoreBar`, `features/connect-midi/MidiButton` |
| The dock | two rows at every size: transport (Loop · Restart · ‹ · ▶ · › · "⏲ 100%" · Metronome) over the foot (Sheet · C · Original · Listen · More) | `PlayerDock.tsx`, `TempoButton.tsx`, `PlayerTool.tsx` |
| Settings | Staves, Accompaniment; "While you play": Playback, On-screen piano, Display. Rows carry no description; Display last although it is what a learner changes most | `widgets/player-setup/ui/SettingsSheet.tsx`, `PlayerSetup.tsx`, `pages/player/ui/PieceSetup.tsx`, `PlayerLayout.tsx` |
| Display page | Layout tiles (Page view, Vertical scroll, Panorama) with no line saying what each does; Show chips; Show this when opening a song; Show annotations; Cursor as a radio card; Follow the music | `widgets/score-view-menu/ui/SheetViewFields.tsx`, `widgets/player-settings/ui/PlayerSettings.tsx` |
| On-screen piano page | Look (Key size, Key length, Note names, names on marked keys, chord names) · Position · Playing · Pedals; the commonest choices mixed with rare ones; explanations hidden in ⓘ | `features/live-keyboard/ui/KeyboardSettingsFields.tsx` |

## Will build

### 1. Performance (done: `fa456904`)

- `SheetLine`, memoised; a line renders only when the music enters or leaves it; handlers held by `useLatestCallback`.
- Lines out of sight skipped by the browser (`drawn-in-sight`, `content-visibility: auto`, their engraved height kept).
- Keys: one stable pointer handler; the 88 keys' looks memoised.
- The lit Ped. mark: an id selector (`#ped-…`), restyling one mark.
- The audio lookahead reads only the due head of its queue.
- Measured with `.scratch/r32/perf.mjs`: long tasks 2.25 s → 0.54–0.73 s per 10 s; frames over 50 ms 47 → 16–22;
  p95 83 → 50 ms. `SheetLine.test.tsx` holds a line still while the music plays elsewhere.

### 2. The piano and its pedals (every on-screen piano: the Player, the score editor, the explorers, the pinned keys)

- **Nothing above the keys.** The keys sit directly under the music. The strip moves under the keys and becomes the
  instrument's **pedal rail**: a 52px band in the key bed's colour, the keys' shadow falling on it.
  - Start: the chord the hand holds (Literata, 18px), or the key size just chosen, for a moment.
  - Centre, as on an upright or a grand: the pedals, left to right **Soft** (una corda) · **Sostenuto** · **Sustain**
    (On-screen piano › Pedals: *Sustain only* or *All three*). Each a brass pedal 48×44, its name under it in 11px.
  - End: ‹ › (a mouse on a wide keyboard), **Smaller keys** −, **Larger keys** +, **Piano settings** ⚙.
- **A pedal is lit while it is down**, whoever holds it (the music, a MIDI foot, Space, a finger): it sinks 3px, its
  brass darkens, a honey glow under it, `aria-pressed`.
- **By touch:** hold to press; a tap latches the sustain (a honey dot on it), the next tap releases it.
- **While the music plays** the sustain follows the score's pedal; stopped, it rises and no key stays outlined.

### 3. On-screen piano settings (one implementation: the Player's sheet page and Settings › On-screen piano)

Ordered by what a learner changes most, each with a one-line description under its name:

1. **Keys** — *Key size* (pictures: Fit the song · Large · Full keyboard) "How many keys fit across the screen.";
   *Note names* (pictures: On C · On every key · Hidden) "Which keys are labelled with their note name.";
   *Key length* (Full · Compact) "Compact keys leave more of the screen to the score."
2. **While you play** — *Chord symbol* "Names the chord you hold, above the pedals."; *Note names on highlighted keys*
   "Shows the note name under each fingered or marked key."; *Pedals* (pictures: Sustain only · All three) "Soft and
   sostenuto pedals appear beside the sustain."; *Glissando* (Scroll · Glissando) "What a swipe across the keys does.";
   *Play when selected* "Sounds a chord or note as soon as you select it."
3. **Placement** — *Position* (Bottom · Top) "Where a page docks its keyboard."; *Hide automatically* (Never · In
   landscape · Always) "When the keyboard folds into a button."

### 4. No reserved space

- The Player's grid keeps no empty row: the status row exists only while it holds Wait mode's line or a status, and
  rows meet with no gap; the keys follow the music directly.
- **The tip** ("Press Play to hear the song.") floats in the dock's top edge as a slim honey-edged capsule over the
  bottom of what is above it (score or keys), takes no row, and is dismissed for good by its × or by doing it.

### 5. The Player's Settings ordered by relevance, each row with one line

Main page, one list, rows with icon · name · one line · current value:

1. **Score view** — "Layout, cursor and what appears on the score." · *Vertical scroll*
2. **Playback** — "Count-in, metronome, pedalling and practice tempo." · *Count-in: 1 bar*
3. **Staves** — "Choose which staves sound and appear, and their levels." · *All playing*
4. **Accompaniment** (a chord chart) — "Pattern, chord voicing and swing." · *Broken chords*
5. **On-screen piano** — "Key size, note names and pedals." · *Fit the song*

**Score view** page: *Layout* as three picture tiles each with a one-line caption — Page "Printed pages, side by
side." · Vertical scroll "Systems down the screen at full width." · Panorama "One continuous system that scrolls
sideways."; *Show on the score* chips (Chord symbols · Chord positions · Lyrics · Fingering · Note names); *Cursor*
segmented (Off · Beat · Continuous) with its line; *Follow the music*; *Annotations*; *Choose a view when opening a
song*.

**Playback** page: *Count-in* segmented (Off · Audible · Silent), *Metronome* (its level, and its sound and beats ›),
*Pedalling* (As marked · Automatic · Off), *Speed training step* segmented (2% · 5% · 10%), *Other hand in practice*
(Show · Dim · Hide). Each with one line.

### 6. The rest of the R31 mockup, closed

- **The bar:** MIDI shows only while a MIDI keyboard is connected or connecting.
- **The tempo** in the transport reads as a metronome mark, "♩ = 92" (its percentage in its accessible name and its
  popover).
- **Laptop:** the dock is one row — song tools at the start, the transport centred, More at the end.

### What goes

The 56px strip above the keys; the lone lever at its end; the empty status row and its gaps; the tip's own row; the
greyed MIDI button with no keyboard.

### 7. One home for each setting (the coordinator, after the Settings round)

- **The On-screen piano's page** (Settings › On-screen piano) is the one home of every on-screen keyboard's settings.
  The Player's gear lists it as a link row ("On-screen piano · Key size, note names and pedals · Fit to music ›"),
  ranked last; Back from the page returns to the Player. The piano rail's ⚙ opens the same page everywhere.
- **`/settings/player` goes** with its page, its route, its parent and its strings: the Player's gear is the home of the
  Player's settings (`settings-pages.test` reads them through the gear's Score view, Playback and Staves).
