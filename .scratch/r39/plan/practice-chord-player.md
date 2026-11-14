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
  - **Drag across sections** (owner, 2026-11-13: "and also dragggin into other sections should be possible"): a
    chord dragged out of its section drops into any other, between any two chords or at a section's end, by finger,
    mouse and keyboard; it keeps its own length, and neither section retimes (a bar that no longer adds up takes its !).
    An empty section still takes a drop.
  - **Follow a MIDI arranger (Yamaha Genos): the Genos leads** (owner, 2026-11-13: "I dont want my chords to be
    played. just to sync the timing", then "when I start on the genos it should sync with genos and understand that
    it started and our app automatically starts"): the app sends nothing and plays no chords. It listens on the
    Genos's USB TO HOST: MIDI Start (FA) starts the Chord player from its first bar (Continue, FB, from where it
    stopped), Stop (FC) stops it, and its MIDI clock (F8, 24 a beat) sets the tempo and moves the beat, so the sheet
    follows the Genos's style while the learner plays the chords on its keys. Where the Genos sends Yamaha's Section
    control (F0 43 7E 00 ss 7F F7) as its Main A to D change, the sheet moves to the section of that letter. The
    Genos must send clock and start/stop (its MIDI transmit settings, to confirm in the Genos manual). Web MIDI runs
    in Chrome and Edge on a Mac or PC, never in Safari on a Mac or any iPhone browser (MDN, caniuse): there the row
    says so and names Chrome or Edge. Built as "Follow a MIDI arranger" in the Chord player's settings, beside
    Connect a piano, with a mark in the bar while it waits for Start. Not testable here without the instrument; a
    fake MIDI port drives it in the browser checks.
  - **The sheet sets the Genos's sections** (owner, 2026-11-13: "I want to be able though to set the transitions for
    the sections automatically like from the verse to chorus and also while playing two times the verse I want to be
    able to set that the Yamaha plays what types like a b c or d and when I dont set then it plays normally. and also
    the endings and the intro"): this replaces "the app sends nothing" for sections only; it still never sends chords
    or notes. Each section of the sheet carries, in its own sheet, an **Intro** (I–III or none, before the first
    section), its **Main** per pass (Main A–D, set apart for each repeat: the verse's 1st time A, 2nd time B), a
    **Fill-in into the next section** (on its last bar: Fill in, Break or none), and the last section an **Ending**
    (I–III or none). Each is sent on the Genos's MIDI clock at the bar line it falls on, as Yamaha's Section Control
    message (F0 43 7E 00 ss 7F F7; ss as the Genos Data List gives it: Intro I–III, Main A–D 08–0B, Fill in, Break,
    Ending I–III; to be checked against the Data List before it ships). Anything left unset sends nothing, so the
    Genos plays as its own panel says. Sending SysEx needs Web MIDI's SysEx permission, asked for when the learner
    turns Follow a MIDI arranger on. Shown on the sheet as a small tag on the section's head ("Main B · Fill in"),
    on the canvas first.
  - **The Genos's style controls, from the Chord player** (owner, 2026-11-13, the Owner's Manual's "Operating
    Style Playback", pp. 63–65: "the chords player should support these controls also … and if you need something
    else search in the user manual and other resources"): with Follow a MIDI arranger on, the Chord player's bar
    gets an arranger strip, laid out as the Genos's panel and named as it is: **Start/Stop**; **ACMP** (on: rhythm
    and auto accompaniment; off: rhythm alone); **Sync Start** (standby until a key, or a left-hand chord with ACMP
    on; pressed while playing it stops and waits again); **Sync Stop** (the style plays while the chord section is
    held; needs ACMP, and not with Full Keyboard fingering); **Intro I–III**; **Main A–D**, the chosen one marked,
    pressed again for its fill-in; **Auto Fill-in**; **Break** (one bar, back to the Main); **Ending I–III**,
    pressed again for rit.; **Fade in/out**; **OTS Link**. Each lamp as the panel's: on (chosen), flashing (next),
    available, off (no data). The sheet's own sections (above) still set Intro, Main per pass, Fill-in or Break and
    Ending, now Intro I–III and Ending I–III as the Genos has them; a press on the strip overrides the sheet until
    the next section. Every message (Start, Stop, Section Control, ACMP, Sync Start, Sync Stop, Fade, OTS Link) is
    taken from the Genos Data List and the Reference Manual before it is built, each cited with its page; a control
    the Genos does not take over MIDI is drawn as its panel lamp only, following what the Genos reports, or left
    out, and the report says which. Still never chords or notes. On the canvas first.
    Found so far (PSR Tutorial forum, 2022, quoting the Data List's Section Control): F0 43 7E 00 ss dd F7, ss 00–02
    Intro I–III (03 the fourth, which the Genos lacks), 08–0B Main A–D, 10–13 Fill-in A–D, 18 Break, 20–22 Ending I–III;
    dd 7F on, 00 off. Start and Stop: MIDI Start (FA) and Stop (FC), which the Genos takes only with its clock set to
    External, so the app sends Section Control and listens for Start and Stop; Yamaha's style start/stop SysEx and
    ACMP, Sync Start, Sync Stop, Fade and OTS Link are still to be found in the Genos Data List (MIDI Data Format)
    before the strip's buttons for them are built.
  - **Every change kept as a draft** (owner, 2026-11-13: "all the changes I do to the sheet should be automatically
    saved, either as draft and then I can save and change the current chords from the draft"): each edit is saved
    at once, on the device, as the sheet's draft; the sheet's saved chords stay as they were until Save, which makes
    the draft the current chords (Discard draft goes back to them, with Undo). A sheet with a draft says so beside
    its name and opens on the draft; nothing is lost on leaving, reloading or going offline. A shared sheet sends
    only what is saved to the open links.
  - **Shared live** (owner, 2026-11-13: "when I share the chords sheet it is online and automatically syncs with the
    other links that are opened"): Share makes the sheet an online sheet with a link; every open copy (the owner's
    and each link's) shows each change as it is made, through Supabase Realtime on the sheet's row (Postgres
    changes, or a broadcast channel per sheet), the last edit winning bar by bar. Sharing asks for an account (it
    reaches other people, ADR 0116: the server must answer); the sheet stays saved on the device too and catches up
    when back online. Who may edit through the link (view only, or edit) is a choice in Share, view only by default.
  - **Saved, synced and migrated** (owner, 2026-11-13: "I want to be able to save the like this as chord sheets
    and sync to my account and also the older ones should be able to migrate to this new structure effortlessly"):
    a sheet of bars is saved as text in the `chord_sheets` store, synced to the account like every saved store; a
    sheet written before bars (no `|`) is laid into bars as it is read, a bar per meter's beats, a chord that crossed
    a bar line kept whole in its bar (which takes the !). This overrides "no migration" for chord sheets only: the
    store's version stays, nothing is lost.
  - **The beats shown** (owner, 2026-11-13: "I want also to see the beats in the chords player"): each bar shows its
    beats as Musicca's ticks, and while playing the beat sounding is lit, the count-in's too.

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

### Canvas 171 (2026-11-13): the board redrawn to the rulings

`.scratch/r39/canvas/r58_chordplayer.py`, over r41_practice's ChordPlayer board. The chart: each bar's chords sized
by their beats over a row of beat ticks (the sounding beat in ink while playing); the chorus's 4th bar holds F 4 and
G7 2, so it is marked ! (44 target, "Bar 4 holds 6 beats, not 4", opening its chord); each section's head a grip, its
letter, name and × n, and, with Follow a MIDI arranger on, its Genos tag ("Intro I · Main A, Main B · Fill in"),
which opens the section's sheet: Intro (the first section), Main for each time through, Into the next section
(None · Fill in · Break), Ending (the last); "None sends nothing: the Genos plays as its panel says." A chord opens
Musicca's sheet titled "Bar 4 · F": Root, Chord, Bass note, Duration − n beats +, Suggested chords, Play from here,
Duplicate, Delete chord. Every edit marks the sheet's name Draft; ··· holds Save and Discard draft over Share (View
only · Can edit, Copy link). Settings add Follow a MIDI arranger and Arranger · Genos · USB. Over the keys, the
Genos's strip as its panel names it: Style (Start/Stop, ACMP, Sync Start, Sync Stop), Intro I II III, Main A B C D,
Auto Fill, Break, Ending/rit. I II III, Fade, OTS Link; a lamp red when on, pale red when next, white when off.

## Port to the app, from canvas 171 (in this order)

| # | Board | App today | Port |
| - | ----- | --------- | ---- |
| 1 | A bar holds its own chords; an edit never retimes another; a bar that does not add up is kept and marked ! | `shared/lib/arrangement/chord-sheet.ts`: a section is one run of chords laid across the bar lines; `resizeChord` takes beats from the next chord, `moveChord` leaves the lengths in place, `removeChord` and `moveChordAcross` hand beats to a neighbour | a section is bars of chords (`bars: { chords }[]`); resize, move, remove, duplicate and drag across sections touch only the chord moved; `playOrder` plays each bar as long as its chords; the text form writes bars with `|`; older text is read into bars, the store's version kept (done) |
| 2 | Beat ticks under each bar, the sounding beat lit; the ! on a bar that does not add up | `SheetSection.tsx`, `ChordTile.tsx` | ticks and the ! from the bar's beats |
| 3 | Musicca's chord sheet: Root, Chord, Bass note, Duration, Suggested chords, Play from here, Duplicate, Delete chord | `ChordDialog.tsx` | rebuilt to the board |
| 4 | The draft: Draft beside the name, Save and Discard draft in ··· | `use-chord-sheet.ts` saves each edit | a draft per sheet in the saved store |
| 5 | Each section's Genos tag and its sheet | none | the section's Intro, Main per pass, into the next, Ending in the sheet's text and store |
| 6 | Follow a MIDI arranger and the Genos strip | none | Web MIDI: Start, Stop, clock in; Section Control out |
| 7 | Share, view only or can edit, live | `share` exists for folders | the sheet's online row and Realtime |


### Ported (loop, 2026-11-14)

- 1 bars of chords (done); 2 the chart, ticks and ! (done): the chart on its paper as canvas 171 draws it; a
  section's head opens its own sheet (Section, Repeat, Loop this section, Variation, Duplicate section, Delete
  section at once with Undo), which the board leaves undrawn: decided so its settings keep one home, the old ⋯ and
  inline pickers gone.
- The bar and the dock (done): Back · Chord player · Undo · gear · ⋯ (Redo, New, Save as my chord sheet…, Share
  link, Chord sheets, Randomize chords, Open in Progressions, Practise in the Player); the dock Style · Key · Tempo
  · Repeats · Play. Decided, one home each: the dock's Key opens the transpose stepper (Settings' Transpose row
  gone); its Repeats is how many times the sheet plays, Until Stop or 1 to 8 (Settings' "Repeat the sheet" gone).
  The head card, the button row and the floating Loop are gone (Loop is in the section's sheet).
