# PianoBooster: what we can take

Source: https://github.com/pianobooster/PianoBooster, read 2026-11-06 (README, `doc/`, the interface strings in
`src/*.cpp` and `src/*.ui`, `music/BoosterMusicBooks.zip`). A Qt desktop app, 2008 on, that plays a MIDI file and
follows the learner's MIDI keyboard.

**Licences:** the app is GPL-3.0 (ideas only; we write our own code). **Its documentation and music are CC-BY**: the
Beginner course and the Booster Music books (MIDI files with accompaniment, made with ABC and MMA) may be used with
credit to their authors.

## What it has

- **Skill:** Listen, Follow You (the music waits for you), Play Along (the music keeps time), **Rhythm Tap** (tap the
  rhythm on any key or on drums, pitch ignored).
- **Follow You options:** Follow stop point On the beat or After the beat; **Follow Through Errors** (a wrong note does
  not stop the music).
- Hands: Right, Both, Left; the other hand plays. Speed, ±5 % steps. Transpose ±12 while playing. Start bar, end bar,
  Repeat bars, Continuous looping, Save this bar number.
- **Feedback:** Accuracy, **Timing markers** (each note shows whether it was ahead of, on or behind the beat),
  **a different sound for right and wrong notes** (chosen in settings), colour-coded notes on the score, note names,
  courtesy accidentals, **High Scores per song** (with "Your Name").
- **Parts:** choose which MIDI track is the piano; volume and mute of the selected part and of your own piano; Mute your
  part when playing.
- **Setup:** MIDI in and out, left and right hand channels, keyboard note range (lowest and highest note, set by
  pressing them), **Latency Fix** in milliseconds ("Try 150 ms"), FluidSynth with reverb and chorus, PC keys ('X' is
  middle C).
- Music Course: Book and Song pickers with next and previous, tutor help pages per lesson.
- `pianohints.md`: label the keys, the beginner's hand position, use every finger, transpose to C, always show
  accidentals.

## Against ours

We have Listen, Sight-read (waits), Practice (one hand), Interpret (follows), hands, speed, transpose, loops, marks,
note names, MIDI in and out, the computer keys, lessons and courses. Missing:

1. **Timing markers:** each played note marked early, on time or late in Interpret and the at-tempo mode, with a
   summary ("mostly ahead").
2. **Rhythm tap:** a mode where any key taps the rhythm of the selected part; pitch ignored; scored on timing. A first
   step for beginners and for hard rhythms.
3. **Keep going through mistakes:** in Sight-read, an option that a wrong note does not stop the cursor (it is marked).
4. **A wrong-note sound:** an optional distinct sound for wrong notes.
5. **Best result per song:** accuracy and timing kept per song and per mode, shown on the song page; a new best is
   celebrated.
6. **Latency correction** for MIDI and Bluetooth keyboards, set by tapping along to a click (no number to guess),
   applied to matching and timing marks.
7. **Keyboard range by pressing** the lowest and highest keys (joins Piano Trainer Studio item 2).
8. **Content:** the CC-BY Beginner course (find middle C, C and F chords, up and down, Clair de la lune) and the Booster
   Music books as songs with their accompaniment, credited to PianoBooster's authors, each checked note for note.
