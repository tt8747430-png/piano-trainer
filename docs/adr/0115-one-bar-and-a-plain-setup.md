# ADR 0115 — One bar, one Transpose, a View of tiles and chips, a plain Setup

- **Status:** accepted · **Date:** 2026-10-27 · **Amends:** ADR 0039 (the position's names), ADR 0085 (the bars'
  look; How it plays), ADR 0090 (the bar both modes share), ADR 0094 (the round bar buttons), ADR 0097 and 0110 (Play
  melody), ADR 0102 (the tools row; the layouts' names), ADR 0104 and 0110 (the two Transposes), ADR 0105 (How it
  plays)

## Context

The owner, on an iPhone 16 Pro Max:

- **The bar.** The tools row under the bar looked bolted on: round outlined buttons, a gap, then a strip of quiet
  text buttons over its own hairline.
- **Transpose** looked different in the Player (a popover: − the key +, Reset) and in the editor (a sheet: semitones,
  the key as `E♭ / Cm`, two switches, a preview opening full screen).
- **The View.** "Scroll across" should be Panorama, as Dorico and Sibelius call it, and the other two layouts better
  named. Every option was a toggle row, which the owner did not like.
- **The Setup** was not understandable:
  - How it plays' tiles said nothing of what they changed. Swing in particular was a word alone.
  - Play melody did not say where the music came from, and the learner could not choose it.
  - "First chord" and "Nearest" were not explained.
  - The hands' parts did not say how they relate to the pattern above them, or what choosing one does.

Real apps keep one toolbar. Flat's, forScore's and MuseScore's mobile headers are one surface of flat icon buttons,
the tools in the same band as Close. Dorico for iPad keeps its mode switch and tools in one toolbar too.

## Decision

- **One bar** (`ScoreBar`, `score-bar`), the Player's and the editor's:
  - One band of card paper reaching the screen's edges (the gutters and the top), with one hairline under the whole.
  - Every button is a toolbar's: the button's `tool` variant, no frame at rest, the muted fill on hover, while open
    and while pressed, 44px, 12px corners. Practise · Edit is a square-cornered segmented pill to match.
  - Close and Practise · Edit lead; each mode's three buttons end it (the Player's MIDI · Setup · More, the editor's
    MIDI · Undo · Redo); the tools stand between.
  - **Two rows** on a phone held upright and a tablet, the tools under the buttons. **One row** from 1024px and on a
    phone on its side, where the bar's columns are the screen's (a subgrid), so Wait mode's line keeps its place in
    it.
  - The same height in both modes, so the sheet does not move as the mode switches. It steps aside whole while
    Diagrams plays.
- **One Transpose** (`widgets/transpose`, `TransposeTool`):
  - The same trigger in the same slot: its arrows and the key as printed, in the accent once moved.
  - The same control inside: − the key it lands in +, how far in semitones ("+2 semitones", or the song's key), and
    Reset.
  - The Player's moves the key it plays in at once. The editor's adds what writing needs under the shared part:
    Apply to key, Apply to chords, the first line moved, and Transpose, one Undo step.
  - The editor's sheet and its full-screen preview are gone.
- **The layouts** are **Page view · Vertical scroll · Panorama** («Страницы · Прокрутка вниз · Панорама»), stored as
  `page`, `vertical` and `panorama`. They are three tiles, each with its miniature (`PictureTiles`, `LayoutPicture`),
  as the views' tiles are.
- **What the music shows** is chips: the staves, Chord symbols, Chord positions, Lyrics, Finger numbers, Note names,
  Diagrams pinned and the Keys (`PartChip`, `PartChips`). Each is its picture and name, pressed while shown. A group's
  ⓘ says what each chip shows; a greyed chip says why in its tooltip (the last staff in sight, a song of no words).
  "Ask each time a song opens" stays a switch: it is behaviour, not a part shown.
- **The Setup** (`PieceSetup`):
  - **Accompaniment** heads the pattern and the position.
  - **Pattern.** Its ⓘ says a pattern is what the two hands play together. Choosing a hand's part changes that hand
    alone, at once, and makes the pattern the learner's mix: the pattern's row reads "Gospel, your mix" over which
    hand changed, the changed hand says Your choice with a way back beside it, and **Back to the pattern** brings
    both parts back. Every hand's part, in its row and in its list, is drawn as its bar on a little piano roll over
    C (`figureRoll`, `FigureRoll`): a head where each note is struck, a faint tail as long as it is held.
  - **Starting position** and **Move smoothly** replace First chord and Nearest («Начальное положение · Плавный
    переход»). The first's ⓘ draws C major in root position, 1st and 2nd inversion on the keys; the second's says
    each chord takes the position nearest the one before.
  - **How it plays** holds Swing and the Melody.
  - **Swing** is four feels (`SwingFeel`): Straight, Light (3:2), Medium (2:1, triplets) and Hard (3:1). Each is a
    tile drawing a beat's two 8ths where the feel places them; the ⓘ says what swing does to the 8ths. `swingTick`
    takes the feel, the URL's `swing` is a feel (Straight when absent), and an exercise's own swing is a feel.
  - **Melody** (`MelodyField`, `melodyOf`) replaces the Play melody and Recording tiles: None, the song's top staff
    by its name, or its Recording. A source the song has not is greyed with why (no staff over the piano, no
    recording, the recording only in its own key). A lead sheet always plays its staff, its None greyed. The ⓘ says
    where each comes from, and that a right hand playing the tune plays it whatever is chosen. The right hand's top
    notes are no third source: the hand is already heard, and its tune figures already play the melody.
- **`pt-settings` v15** (ADR 0038, no migration): `melody` (`MelodySource`, Recording by default, as the recording
  played before) in place of the `tune` and `recording` switches; the layouts' new values (v14 within this round).

## Consequences

- **`shared/ui`:** the button's `tool` variant; `PictureTiles`, `LayoutPicture`; `SheetLayoutField` as tiles;
  `PositionField`'s names and its picture ⓘ; `SheetViewIcon` is gone.
- **`shared/lib`:** `SHEET_VIEWS` are `page`, `vertical`, `panorama`; `schedule`'s `SWING_FEELS`, `SWING_SHARE`,
  `swingTick(tick, feel)`.
- **`widgets/practice-player`:** `ScoreBar`; `PlayerArea` keeps the sheet's, the status', the dock's and the keys'
  areas; `PlayingSection` holds Swing's tiles (`SwingPicture`) and the music's own.
- **`widgets/score-view-menu`:** `ViewChip`, `KeysChip`, `PartChip`; `ViewSwitch` and `KeysSwitch` are gone.
- **`widgets/player-setup`:** `MelodyField`, `melodyOf`, `FigureRoll`, `figureRoll`; `TuneToggle` and
  `RecordingToggle` are gone.
- **`widgets/transpose`:** new. The editor's `TransposeSheet` is gone, replaced by `EditorTranspose`.
- **`entities/settings`:** `melody`, `MELODY_SOURCES`, `selectMelody`; `features/set-preference`: `setMelody`.
- **`entities/exercise`:** an exercise's `swing` is a feel.
- The editor's recorder keeps its own Play melody switch (Settings › Recording, the recording strip): it plays the
  tune under a take, not the Player's melody.
- Every new string is in English and Russian.
