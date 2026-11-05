# R31-P: the Player

## Source

The owner, 2026-11-05 (`songs-player-editor-brief.md` › Player), with shots 5, 7, 8, 10 and 12 (`owner-shots-compared.md`):
- "the tools overview in the player don't make much sense", "the display settings how to change the sheet view also don't
  make much sense. why are they in the toolbox and why are they also in the settings";
- "refactor the how each stave is shown or played settings from the staves section and also the accompaniment from the
  chords … also the swing settings, all of these should have their sections in settings or subpages like the playback
  settings. all of the settings should be refactored";
- "the piano and its pedal. its icons still are not that good and this showing some keys also is not that good, refactor
  the piano component and its settings, why when i click on the on screen piano settings in the player i go to the normal
  settings and not to the settings like the playback settings";
- "the piano and the toolbar at the bottom are in a weird box that takes much space and also the notifications there also
  take space, and why are they always shown like it is not remembered";
- "the toolbar and the floating toolbar and then we also have the other floating toolbar on top … too much … duplicated
  actions and some things are not intuitive like how the metronome works or how the modes work, and other tempo";
- "this sustain bar under the keyboard, make a real sustain pedal";
- "this choose versions also are not that intuitive … refactor all the popups from the player";
- "why the transpose in the player doesn't have this preview";
- "the piano in the fantaisie impromptu import … behaving weirdly and this pedal is also hanging and doesn't work
  correctly and the pedal settings are also not intuitive".

Standing rulings (feedback-log › Player and editor together, Player views and settings): one gear per screen; Edit
beside the title; Transpose the same in Player and editor with a preview; floating controls hide on a tap elsewhere;
Chordify's features but guitar; plain which view a setting belongs to.

## Reproduced (2026-11-05, the harness as the installed app)

- Fantaisie-Impromptu (imported .mxl): after Stop, "Ped." stays lit and covers Sustain on the piano's toolbar; the keys
  the pedal held keep their outline; the "Tap Play to listen" tip returns after a play.
- At rest the view pill covers the score's top line, the transport covers the bass staff, the tip takes a row above the
  piano, and the piano's toolbar is a grey box whose Zoom label spans two icons. An empty band sits under the foot bar.

## Today (map, 2026-11-05)

- **Top bar** (`ScoreBar`): ✕, title, ✎, Piano keys, MIDI, Tools (grid), ⚙.
- **The pill under it** (`PlayerTools`): View (`PickView`), Transpose, Version.
  - Transpose is also in Tools › More and in the foot bar's catalog; Version too.
- **Floating transport** (`PlayerDock`): Restart, ‹, Play, ›, Metronome click.
- **Foot bar** (`PlayerFoot`): Recordings, Loop, Tempo, Feedback, Modes, More.
  - More holds Metronome (it leaves for /practice/metronome), Tuner, Transpose, Version and Annotate.
- **Tools sheet:**
  - Quick tools: Metronome (a second one), Recorder, Tuner.
  - On the score: Print, My recordings, Annotate.
  - Listening: Voice commands, Rhythm game.
  - More: Audio and MIDI, Transpose, Version, Display (opens the Settings sheet).
- **Piano rail** (`KeyRail`, a grey `bg-key-rail` box): Zoom −/+, Names, Chords, MIDI sound, Gliss., Sustain (a latch),
  and "Ped." (`PedalLamp`, the score's pedal at the cursor, so it stays lit when stopped). `PedalBar` under the keys
  (Sus./Sost./Soft) shows the engine's pedals. `pedalKeys` outlines the keys held by the pedal at the cursor, at rest
  too.
- **Settings sheet:**
  - Staves (Play and Show per staff);
  - Chord size;
  - Accompaniment from the chords (Pattern, Left, Right, Swing), or How it plays (Swing);
  - While you play: Audio playback (volumes), Playback (Pedal, Speed training step, Other hand), Tool bar, Display
    (the view's layout, Clef, Count-in, Cursor, Follow…);
  - On-screen piano, which **leaves for the app's /settings/on-screen-piano**;
  - This song (Sections, Song information) and Share (Share link, Export…).
- **Tips** (`CoachLine`): `useState` only, so back on every visit.
- **Version sheet:** Your version, Piano solo, Piano and voice, each Original, Simplified, Easy. Simplified is greyed
  where no chord would change.
- **Transpose:** the Player's applies at once with no preview; the editor's (`EditorTranspose`) has Preview,
  Transpose and "Use this".
- **Modes:** Listen, Sight-read, Practice (Hands, Hear the other hand), Interpret. **Tempo:** presets, a slider and
  Speed training. There are four metronome surfaces.

## Will build

### 1. One bar, one dock, nothing floating over the score

- **Bar:** ✕, title (two lines) with ✎ (Edit score) beside it, then Piano keys, MIDI (only with a piano connected or
  connecting) and ⚙. The Tools grid goes.
- **Nothing floats over the score:** the view pill and the floating transport go. The score has the screen between the
  bar and the dock.
- **The dock** (docked at the foot, its ground to the screen's edge, `Docked`), two rows:
  - **Transport:** Loop · Restart · ‹ · ▶ · › · Tempo ("92", its popover: Original tempo, the presets, the slider, Speed
    training) · Click (the metronome with the music, on or off; its sound and volume are Settings › Playback's).
  - **Song tools** (the learner's Tool bar, Settings › Tool bar), by default: View ("Sheet ⌄", a menu of Sheet, Grid,
    Diagrams, Lyrics), Key ("C"), Version ("Original"), Mode ("Listen"), More.
- **More** (acts only, never settings), in parts: Sections, Song information | Recordings, Feedback, Annotate | Print,
  Tuner | Share link, Export….
- **What goes:** the Tools sheet (its Metronome, Recorder, Voice commands, Rhythm game and Display rows), the foot
  "Metronome" act that left the Player, and the second Transpose and Version.
  - Voice commands and Rhythm game become Settings › Playback switches.

### 2. The piano

- **Under the score, above the dock, the screen's width:** no grey box and no rail of buttons. A slim strip over the
  keys holds the chord sounding (left), Smaller and Larger (−/+, 44px), and ⚙, which opens **Settings › On-screen
  piano** in this sheet.
- **A real sustain pedal:** under the keys at the right, a drawn pedal (a brass lever) that goes down while the
  sustain is down.
  - While the music plays it moves with the score's pedal.
  - On the on-screen keys, press and hold it to sustain, or tap it to hold it down (a lock mark on it) and tap again
    to lift.
  - With Show soft and sostenuto on (piano settings), the three pedals are drawn.
  - `PedalLamp`, `PedalBar` and the rail's Sustain latch go.
- **At rest nothing hangs:** the pedal is up and no key is outlined or lit once playing stops. The pedal-held outlines
  show only while playing.
- **Keys shown** (was Fit / Large / All 88): The song's notes · Large keys · All 88, in On-screen piano settings.

### 3. Settings (⚙), one sheet of subpages, each with Back

1. **Staves ›**: one row per staff (its clef and name), then on its page: Show, Play, Volume, and the hand it is (for
   Practice). The recording is a row the same way.
2. **Accompaniment ›** (a chord chart, or a song with chords): Pattern ›, Left hand ›, Right hand ›, Chord size,
   Swing.
3. **Playback ›**: Pedal (As the score marks it · Hold each chord · None), Swing (a song without accompaniment),
   Count-in, Metronome (sound, volume), Speed training step, The other hand (Practice), Voice commands, Rhythm game.
4. **Display ›**: the sheet's Layout (Page, Vertical, Panorama) and Show chips (the View menu chooses the view alone),
   Clef, Cursor, Follow the music, Annotations, Show this when opening a song.
5. **On-screen piano ›**: in this sheet, the same fields as the app's own page (one implementation):
   - Keys shown;
   - Note names;
   - Chord names;
   - Glissando;
   - Pedals shown (Sustain · All three);
   - MIDI sound.
6. **Tool bar ›**: which song tools the dock's second row holds.

This song and Share leave the sheet (they are More's).

### 4. Tips that are remembered

A tip shows once. Its × or doing what it says (pressing Play) retires it for good (`seenTips` in the settings store).
Tips sit in the dock's top edge as a single line, never as a box taking a row of the screen.

### 5. Version

The sheet is titled "Version".
- At its head, **Arrangement:** Piano solo · Piano and voice (only where the song has a voice).
- Then three rows, each with its dots and a plain line:
  - **Original**: "The score as written";
  - **Simplified**: "Every chord a plain triad, the tune kept";
  - **Easy**: "The tune, one note of each chord".
- Your version comes first where you have one.
- Where Simplified changes nothing, its row says so on its own line ("Its chords are already simple") instead of a
  grey row.

### 6. Transpose with a preview

The Player's Transpose is the editor's one control: −/+, the key it lands in, Key signature and Chord symbols, the
**Preview** of the first line in the new key, and **Transpose**. It applies only when pressed, and Reset sets it back.
`PreviewLine` moves to `widgets/transpose` for both.

### 7. Modes

The Mode sheet ("What would you like to do?") keeps its four cards, each with one line of what it does. Practice's
Hands and Hear the other hand stay on its card.

## Left for the owner (drawn)

1. Where the song tools sit: A, the dock's second row (recommended); B, chips under the bar.
