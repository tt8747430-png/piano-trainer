# R39-10 · Chord player, redesigned

Premium here means a chord sheet that reads like a lead sheet and plays like Musicca's chord player: sections of bars,
each chord tapped to change it, the keys showing what sounds, nothing on screen that is not the song.

## The rulings as they stand

- Next after the Chords page (owner, 2026-11-13: "after that continue with the chords player and make all of its
  features … add to instructions to continue with the chords player after you finish with the chords page"), with
  Musicca's chord player beside it (screenshots: sections of bars with beat ticks, + after the last bar, Add section,
  Randomize chords; Play, 100, Pop 1, Settings, File; a chord's sheet: Chord root and quality, Bass note, Duration
  − 4 beats +, Suggested chords, Delete and Done). Every feature it has, and:
  - **Start from any chord:** tap a bar and play from it.
  - **Count-in** before the song.
  - **Duplicate a chord.**
  - **A chord's timing is the learner's:** "if I set timing to these chords I want them to be so and not
    automatically changed when I change a chord": reordering or changing a chord never retimes the others. A bar
    whose beats no longer add up is kept as it is, marked with a ! that says its timing is wrong and opens that
    chord's Duration; nothing else moves.
  - **Easier timing:** Duration as Musicca's − n beats + in the chord's sheet, and the bar's beat ticks.
  - **Easier adding:** + after the last bar of each section opens the chord's sheet on the next suggested chord.
  - **Auto-scroll:** the sheet follows the chord playing.
  - **Bugs:** the chord sheet is not saved (it must be, as a saved store); drag and drop breaks (port
    memory-palaces' fix, read in that repo); reordering changes other chords' timings (fixed by the rule above).
  - **A MIDI arranger (Yamaha Genos):** researched 2026-11-13. Possible over Web MIDI: Start and Stop (FA, FC),
    the tempo as MIDI clock, each chord as Yamaha's Chord control (F0 43 7E 02 cr ct bn bt F7) and each section
    as Section control (F0 43 7E 00 ss 7F F7; 08 Main A, 09 B, 0A C, 0B D; sources: psrtutorial.com's SysEx
    thread, Steinberg's forum quoting the Data List, sandsoftwaresound.net's Chord Tracker notes), so the Genos
    plays its own style to the app's chords and sections. Web MIDI runs in Chrome and Edge, not in Safari or an
    iPhone's installed app: there the row says so. Built as a "Play on a MIDI arranger" choice in the Chord
    player's settings, beside Connect a piano.
- "Chord player: Musicca's controls and options, with the best free sounds."
- "the Chord player simple, Apple-like, its drag and drop working (memory-palaces' fix)": sections move by their grip;
  on a laptop the key's chords drag into a bar.
- Every Practice page has its own settings (a gear): Instruments (Piano, Bass, Drums, each on or off with a level) and
  Chord names (Letters · Numerals), the homes `chordPlayer.names` and `chordPlayer.voicing` in `registry.ts`.
- A key or root is one of the pickers (the root grid). Play controls sit in a bar above the keys, covering nothing.
- A loss that can be undone happens at once with Undo (R38): Delete chord.
- No finger numbers on the keys; no explanation line under a control.

## Today

`src/pages/chord-player`, strings `practice.ts` `chordPlayer`. A bar with four icons and ···; New chord sheet ▾,
Pop 1 ▾, Tempo 100 − +, Key C major ›; one Verse with Repeat ×1, bars 1–4, "0 bars" and a + tile; Add section and
Randomize chords; a floating Play and loop button over the keys.

## Will build (canvas row 10)

Phone: Back, the sheet's title ▾ (Chord sheets), Undo, gear, ··· (Redo, New, Chord sheets…, Save as my chord sheet…,
Randomize chords, Open in Progressions, Practise in the Player, Share link). Style ▾ (a sheet by family, each style
with a one-bar Listen) · Key ▾ (root grid, Major · Minor) · Tempo − 96 BPM +. Sections: grip, name ▾, n bars, Repeat
− × n +, ···; bars four to a row, numbered, a bar holding one or two chords by their length; + adds a chord; + Add
section. A chord opens a sheet: its name and length, In the key (C Dm Em F G Am Bdim with numerals), Root, Chord
(maj m 7 maj7 m7 sus4 sus2 dim add9 6), Length − n beats +, Bass note, Delete chord (Undo in its toast), Done. Above
the keys: Play/Stop, Loop, the place now (Chorus · bar 3 · C/E). The keys show the chord, left hand violet, right hand
orange. Settings page: Instruments, Chord names, Count-in ›, All piano settings ›.
Laptop: the sheet left, Style, Key, Tempo, Instruments and Chord names right; the key's chords under the sheet to drag
into a bar; a chord opens in a popover.

## Reference: Musicca's chord player page (2026-11-11)

The owner's saved copy of musicca.com/chord-player (a MiroMiro export: the page as HTML with Tailwind, a JSX element, an
HTML element, and Elementor and Bricks files), read for its text and controls; one state, no menus opened, no phone
layout. The export stays out of the repo.

| Area      | Musicca                                                                                                                                                | Our canvas (row 10)                                         | Take                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Style     | 22 styles in families, numbered: Pop 1–5, Rock 1–2, Melodic 1–4, Hip hop 1–2, Disco 1–2, Reggae 1–2, Jazz 1–4, Blues 1–2, Classical 1–2                | Style ▾, a sheet by family with a one-bar Listen            | already ours; the families match                                                                                       |
| Variation | each section picks Variation 1–4, "to create contrast between different song sections such as verse, chorus, and bridge"                               | a section has a name and Repeat                             | **Variation per section**                                                                                              |
| Speed     | ×1 beside the tempo                                                                                                                                    | Tempo − 96 BPM +                                            | no: one tempo control                                                                                                  |
| Settings  | instruments, count-in, time signature, transpose, volume                                                                                               | Instruments, Chord names, Count-in ›, All piano settings ›  | **Time signature** in Settings; transpose is the Key picker; volume is each instrument's level                         |
| File      | New · Save · Share · Download MP3 (signed in)                                                                                                          | ··· New, Chord sheets…, Save as my chord sheet…, Share link | **Download as audio** in ···                                                                                           |
| A chord   | a box with a tick per beat; drag its right edge to change its length; double-click for the advanced editor                                             | a chord opens a sheet with Length − n beats +               | **beat ticks in the chord** and, on a laptop, **its right edge drags its length**                                      |
| Typing    | click a chord and type it: root A–G, # or b, m dim aug sus2 sus4 6 7 maj7, then 9 11 13, / for the bass; Ctrl/Cmd + N adds a chord; Backspace deletes  | the chord sheet only                                        | **type a chord on a laptop**, read by the app's chord-symbol parser; ⌘N adds, Backspace deletes (Undo in its toast)    |
| Order     | drag to reorder; drag away to delete; the keyboard's space bar picks up, arrows move, space drops, Escape cancels                                      | sections move by their grip                                 | **chords drag too**, with the keyboard way for accessibility                                                           |
| Ideas     | Randomize chords; common progressions by genre (Pop, Rock, Jazz, Blues, the 12-bar blues) as text to start from; a table of songs built on four chords | Randomize chords in ···                                     | **Start from a progression** points to the Progressions library; no song table (the library holds the learner's songs) |

Proposed for the canvas: Variation 1–4 per section; Time signature in Settings; Download as audio in ···; beat ticks in
each chord with its right edge dragging its length on a laptop; typing a chord on a laptop; chords that drag, by finger,
mouse and keyboard.

## History

- 2026-11-08: drawn (canvas v8); waiting for the owner.
- 2026-11-11: Musicca's chord player page read from the owner's export and compared above; six proposals, not drawn yet.

Sources: Musicca's chord player (sections, bars, chord picker, instruments); Chordify's chord grid; Band-in-a-Box's
lead sheet (bars four to a row, chords split by beats); `practice.ts` `chordPlayer`.
