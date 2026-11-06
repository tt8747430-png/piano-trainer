# Songscription's Player and editor: every feature

Source: the owner's saved page `Voi cânta bunătatea Ta – Songscription.webarchive` (2026-11-06), a song in View mode with
the editor loaded. Read from the page's DOM (labels, text) and its 143 scripts (about 2,700 interface sentences, kept
outside the repo, since they are Songscription's own text). Earlier live captures: `.scratch/r33/ref/songscription-*.png`.

## 1. The screen

- **Left sidebar** (collapsible): New project, Projects, Search, Recents, View all, Upgrade, Feedback, the account.
- **Song bar:** title, Hide Song, Share, Re-transcribe, Add lyrics, Transpose, "How did we do?" (five-star rating),
  Report a problem, Professional transcription, Take a tour.
- **Difficulty:** Adaptive ("We choose the level that suits the song") or You choose (a slider of levels; "As it is",
  "Easier versions").
- **View · Edit** switch (`⌘E`-like toggle "Switch between Edit and View").
- **Source switch:** Transcribed (the score, played back) or Original (the recording; a YouTube player that can be
  expanded, minimised and moved).
- **Top bar, right:** Instruments `⌥I`, Mixer, Keyboard, Metronome `⌥M`, tempo (BPM field, 87), Playback speed 1×
  ("Drag up or down to change it", `[` `]`, common speeds), Key and pitch (transpose ± semitone, Transpose score…,
  Concert or Written pitch), Saved · History, Undo `⌘Z` (press and hold for history), Redo `⇧⌘Z`, Help, Palette, More
  (Download `⌥⇧D`, Settings `⌘,`), Properties.
- **Transport:** Go to the start (Home), Play (Space), time 0:15 / 2:00, "1:43 · Bar 38".
- **Floating view pill** on the score: Page `⌥Y`, Infinite width `⌥O`, Infinite height `⌥H`; Smaller `⌘-`, zoom
  (50–400 %, `⌘0` = 100 %), Larger `⌘=`. "To zoom the page, use Page view."
- **Score / piano roll split:** Score only, Show the piano roll, Show the score, Piano roll only; a divider "Resize score
  and piano roll"; Infinite height becomes "One line while the roll is tall".
- **Ask Annie:** an AI chat docked beside the score (below).

## 2. Keyboard and piano roll (the Player's part)

- Keyboard button: "Show just the keys under the score". Keys A0–C8, each a button ("Click to play").
- **Keys shown:** Lowest key shown, Highest key shown; Keyboard map (computer keys); Notes played.
- **Hands:** Left hand, Right hand toggles. "Hidden lines are silent too."
- **Source of the roll:** Score-derived or Raw performance (the unquantised transcription).
- **Chord:** the chord sounding, "Plays in sync".
- **Piano roll settings** ("What the falling notes show, and how they fall"):
  - Note names: none · while playing · every key.
  - Finger numbers: none · on notes that have them · every note.
  - Chord names: none · down the left edge · beside the notes.
  - Hand colours: one colour · by hand (and the voice its own).
  - Shorten notes (Smart trim): long notes end early so each new note stands out; sound unchanged.
  - Fall speed; Guiding lines (each note points to its key); Glow and sparks; Track colours; Colour theme; Beat lines;
    Pin controls; Piano roll zoom.

## 3. Playback and sound

- **Mixer:** per player volume, pan, reverb ("Zero turns reverb off"), Silence this player, Hear only this player,
  Master volume, Mute everything, Metronome volume. "Parts that are still loading play on piano until they arrive."
  "You're hearing the recording, so there's nothing to balance here."
- **Playback instruments:** the full General MIDI set, plus templates (Lead sheet, Voice and piano, Worship band,
  Acoustic worship, String quartet, Big band… about 35 ensembles) and guitar tunings (Drop D, Open G…).
- **Accompaniment from chord symbols:** Generate accompaniment (replace the selected bars) or Generate accompaniment part
  (a new instrument). Styles: Held, Pulsed, Broken chords, Bass and chords, Alberti bass, Arpeggio and chords, Bossa
  nova, walking bass (steady, chromatic, swing pickups, syncopated, double-time), comping (light, active, sparse,
  two-feel, Charleston), Jazz ballad, Jazz swing, Jazz waltz, Blues shuffle, Half-time shuffle, Reggae one-drop,
  Country train beat, Drum and bass, plus drum grooves and guitar strums; held or pulsed bass.
- Per-note: Velocity (MIDI units, reset to automatic), Silence notes without removing them, Times through the repeat.

## 4. The editor

### Writing notes (Note input)

- A **keypad** (horizontal or vertical): durations double whole to 128th, dots, rests, accidentals (to triple sharp and
  flat), tie, voices 1–8 (two pages), grace notes (longer or shorter value, slashed), articulations (accent, staccato,
  tenuto, marcato), slur, cross-staff up and down, text.
- Keys: A–G writes at the caret (nearest octave), 1–7 durations (5 = quarter), `.` dot, `0` rest, `+ - =` accidentals,
  Shift+letter adds to the chord, Backspace takes back. With a note selected the same keys change it.
- Double-click a note or rest to start writing there; select a rest and press A–G to fill it.
- The on-screen piano enters notes; dragging a note changes its pitch, sounding each step.
- Free bars ("Writing extends the free bar"), pickup bar, actual bar duration, trim trailing rests.

### The palette (one search box for every action)

- Type what you want: words ("get louder", "bouncy", "walking pace", "jig", "oops"), shorthand ("3/4", "4/4,1",
  "+4" bars, "+3" a third above, "+3,5" a triad, "m3", "t3", "3:2", "1,2" endings, "mp dolce", "Am7", "G7/B", "V7",
  "+E", "||", "|:", "%", "//", "GP", "3#", "f sharp minor", "8va", "D.C. al Fine", "rit.").
- Rotating tips teach the shorthand; recent actions are remembered per kind of selection; hover previews the change in
  the score ("Preview palette changes").
- **Drawers:** Key signatures, Time signatures (Common, Cut, Other…), Clefs (all, including transposing), Barlines
  (13 kinds, repeats), Holds and pauses (fermatas, breath marks, caesuras, G.P.), Lines and brackets, Dynamics (with
  text, stacked, hairpins, niente), Tempo (Italian terms "in plain words", equations, Tempo I, tap in time), Ornaments
  (trills, turns, glissandos, arpeggios, jazz falls, bends), Playing techniques, Pedal lines (sustain, soft, sostenuto,
  pedal diagrams), Octave lines, Rehearsal marks, Repeats and jumps (D.C., D.S., To Coda, endings), Bar repeats,
  Tremolos, Multi-bar rests, Rhythm slashes, Chord symbols, Roman numerals, Figured bass, Lyrics, Fingering (0–5, same
  finger, finger shift, right- and left-hand plays), Hand brackets, Lines between notes (voice leading, arrows), Text
  (staff and system instructions, expression), Ossia, Cues.

### Changing music

- Pitch: up or down a step, half step, octave; transpose by interval or by key (from key to key); respell with sharps,
  flats or to fit the key; set pitch C–B; add a note above or below; add C–B to the chord.
- Rhythm: halve or double (close up, leave rests, overwrite, make room), make durations equal, write as one note, move
  left or right a beat or half beat, tuplets (any ratio, "Preserve rhythm" or "Make notes equal"), make grace or
  regular notes.
- Voices: exchange voices, spread across staves, combine into Voice 1, move to the staff above or below, swap hands,
  split between hands.
- Bars: insert (here, at start, at end), delete, go to a bar, bars per system, system and page breaks, make into
  system or page, move a bar to the previous or next system.
- Selection: select all, similar (in staff, in selection), forced notes, keep only part, Shift-drag a box, extend by
  note, bar or staff.
- Clipboard: repeat the note, paste at half or double length, swap with clipboard.
- Reset: flips, visibility, beaming, voices, sizes, rests, written values, velocity, layout, the whole score.
- Beaming: join, break left, beam grouping per time signature (join the bar, separate the beats, custom counts like
  3+3+2), beams over rests.

### Properties panel

- Whatever is selected: stem direction, beams, notehead (X, diamond, slash), visible, velocity, slur style, lyric
  syllable type and verse, tempo mark, gradual style, line style, hand, repeat counts, text style, staff size and
  lines, instrument labels.

### Instruments and parts

- Add instrument or from template, edit (full and short names, key, sounding octave, custom interval), replace,
  delete, drag to reorder, brackets ("group instruments"), extra staves for a passage, ossia above or below.
- Parts: a part per instrument or group, each with its own layout settings ("Customize a setting… Everything else
  follows Score").

### Lyrics

- Add lyrics from text or aligned to the recording (separating vocals, recognising sung words, word timings), verses
  and chorus, move a syllable to the previous or next note or verse, melisma, shift lyrics earlier or later.

## 5. Settings (`⌘,`), searchable, each with a live example

- **Display:** concert or written pitch, notes and tabs, chord symbols (placement), lyrics (verse numbers), fingering,
  bar numbers (none, each system, every bar, every N), instrument names (first and later systems).
- **Text:** fonts (about 30, including Finale and Noto families); size, bold, italic, underline and distance for every
  kind of text (tempo, expression, technique, chord symbols, Roman numerals, lyrics, bar numbers, rehearsal marks,
  fingering, title, subtitle, composer, arranger, lyricist, copyright, page numbers, instrument names); front page
  credits on or off; running title; clear ink behind text.
- **Layout:** page size (A3, A4, A5, Letter, Legal, Tabloid, B4, concert, part, choir, custom), margins, music frame,
  first system indent, justify the last system, gaps between systems and staves, staff size, multi-bar rests, hide
  empty staves.
- **Engraving:** music font (MuseScore's Leland, Finale, Bravura-like faces), voices sharing noteheads, cautionary
  accidentals, secondary beams, beams over rests, pedal marks (Ped. with or without the full stop, hook only, sign at
  end).
- **Playback:** accompaniment from chord symbols and its instrument.
- **Piano roll:** as in section 2.
- **Editor:** Preview palette changes, Recent actions (reset), Panel layout (reset), Reset all editor settings —
  "Saved in this browser and shared across scores".

## 6. Saving, history, download

- Autosave with states: Saved, Saving, Not saved, Saved on this device only, "This score changed in another window —
  Keep mine".
- **Score history:** earlier versions (automatic save, restored, imported, lyrics update…), view an earlier version,
  Show changes against now, Restore (the current one stays in history).
- **Download:** PDF (score or a part), MusicXML (.mxl or .musicxml; layout kept: all breaks, breaks you added, none;
  As written or Played out; concert pitch), MIDI (notes and timing), raw MIDI (smart trim, hand split), Guitar Pro;
  Score and parts as a ZIP.

## 7. Help

- Tour of Edit mode (skippable, "Don't show again", again from Help), Keyboard shortcuts (searchable, grouped: while
  writing, with a note selected, selection and navigation, systems and pages, playback, view, palette and panels,
  text entry), Next tip.
- Edit is laptop-first: "You can edit scores on a computer, or on a tablet with a keyboard or trackpad."

## 8. Ask Annie (AI)

- Select a passage and ask; suggestions by kind: transpose, respell, range checks, mistakes, key, counting rhythms,
  tempo, rebar, swing, dynamics, hairpins, slurs, articulation, chord symbols, Roman numerals, cadences, modulation,
  voice leading, compose (intro, coda, variation, countermelody, harmony part, simplify for a beginner, reharmonise),
  describe, form, practice tips, style or period.
- Two models (Mini and a larger one at about 20× the plan), plan usage meters (five hours, seven days), chat length,
  progress words per step ("Counting the rhythm", "Studying the harmony"), every change undoable.
