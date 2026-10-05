# Takes from a MIDI keyboard, and a Chord finder that names more chords

- **Status:** decided 2026-10-05 under the owner's standing instruction (decide, record, continue). The owner asked:
  "can we add an option to record the audio with midi i want to record what i play on the piano, or is it covered by
  the song editor, maybe we can add an additional option for that. and add more option for the available cords in
  the cords finder". The score editor was not it: each key writes one note of the chosen value at the caret, with no
  timing and nothing to hear back. Claude wrote back the understanding (a Record in the score editor and on Songs, a
  count-in and a click at the song's tempo, the take heard back as played with its velocity and pedal, kept and
  downloadable as `.mid`, written into the song's hands on request; the finder naming the voicings it cannot name
  today: shells with skipped tones, 7sus4(♭9), chords without their 3rd, add♯11); the owner answered "this looks
  good" and asked for all of it, best practice, no leftovers, refactoring where needed.
- **Builds on:** ADR 0004 and 0008 (audio and MIDI behind ports; the port knows what it sounds), ADR 0003 (the view in
  the URL, saved state in stores), ADR 0019 (the tools work out what they are given), ADR 0027 (a version is the
  piece's music in its own format). **Records:** ADR 0028. **Roadmap §5:** "Record from a MIDI keyboard" is built.

## 1. Words

- A **Take** («Дубль») is what the learner played on a MIDI keyboard from Record to Stop, kept as played: each key's
  onset, how long it was held and how hard it was struck, and the sustain pedal's presses, timed from the first bar's
  downbeat at the take's tempo. It belongs to the piece it was recorded in.
- **Record** («Записать») starts a take; the **Recorder** is the score editor's sheet that records and lists takes.
- **Write into the score** («Вписать в ноты») turns a take into written notes: snapped to a note value, split
  between the hands or kept as the tune.
- A **Recording** (ADR 0016) stays a performance shipped with a piece. A take is never called a recording.

## 2. Recording a take

- **Where:** the score editor's toolbar has **Record** (an icon button) that opens the **Recorder** sheet. Songs'
  New song sheet has **Make and record** beside Make: it makes the song and opens its editor with the Recorder open
  (the editor's URL `?record=true`: the sheet open is what you look at, so the URL holds it; closing it replaces the
  URL without it).
- **What it needs:** a MIDI keyboard connected. The Recorder shows the MIDI control in its place otherwise, with one
  line: "Connect a MIDI keyboard to record." (no Web MIDI: "Recording needs a browser with MIDI: Chrome or Edge.").
- **The click:** Record starts a **count-in** of one bar of the meter's beats (the first accented) at the song's
  tempo, then the take. A **Click** switch in the Recorder (saved, on by default: `pt-settings` version 7,
  `recorder.click`) keeps the click going while recording; off, only the count-in sounds. The click follows the
  piece's bars from the caret's bar (an accent at each bar's start, a click each beat), and the meter's bars past
  the piece's end.
- **Where it starts:** at the caret's bar. The take's time 0 is that bar's downbeat as heard.
- **Timing:** what the learner hears is the audio clock less its output latency; what they play arrives on the
  page's clock. The audio port answers `audioTimeAt(pageTime)` (from `getOutputTimestamp`), the MIDI port stamps
  each event with the page's clock (`MIDIMessageEvent.timeStamp`), so every key is placed where it was heard
  against the click.
- **Kept:** a key struck within half a beat before the downbeat counts as on it; earlier keys are the count-in's and
  are not kept. A key struck again while held ends the earlier note. Keys still held at Stop, and a pedal still
  down, end at Stop. The **sustain pedal** (MIDI CC 64, down from 64) is kept as its presses.
- **While recording:** the editor's tools give way to the **recording strip** (a pulsing dot, the piece's bar number,
  the time, and **Stop**, the screen's one action, honey); the keys played do not write at the caret; Play and Record
  are disabled; Space and Escape stop. Leaving the editor stops and keeps the take.
- **Stop:** the take is saved and the Recorder opens on it. Stopped during the count-in, nothing is kept; a take with
  no notes is not saved ("Nothing was played.").
- **Bounds:** a take stops itself at **10 minutes**, or when the takes hold **60,000 notes** in all (about 1.3 MB of
  the browser's storage); then Record is disabled with "Your takes are full: delete one to record another."

## 3. A take kept, heard, downloaded

- **`pt-takes`, version 1** (`entities/take`, a `createSavedStore`): every take (id `take-<n>`, never given twice;
  the piece's id; when it was made; the tempo and meter it was played to; its length; its notes and pedal presses)
  and the next number. Saved compactly (a note is `[midi, at, held, velocity]` in whole milliseconds, a press
  `[down, up]`): `createSavedStore` gains an optional `write` that turns the state into what is saved; `read` (the
  sanitiser) reads it back, keeping only notes on the piano with times and velocities in range.
- **The Recorder lists the piece's takes, newest first:** each a row with when it was made, its length and tempo, and
  Play (Stop while it sounds; the keys show on the editor's keyboard), Write into the score, Download (a `.mid`
  file) and Delete (asked once more: "Delete this take?").
- **Heard as played:** each note at its onset and velocity (the gain rising with the square of the velocity), sounding
  while its key is held, or on to the pedal's release when the pedal was down as it was let go, and never past the
  same key struck again.
- **`.mid`:** a Standard MIDI File (format 0, 480 ticks a quarter): the take's tempo (a compound meter's beat is a
  dotted quarter) and time signature, every note on and off with its velocity, the pedal as CC 64. Named
  `<piece title> <date>.mid`.
- **Deleting a song deletes its takes.** A version's takes stay with the piece: they are what was played, whatever
  the music says now.

## 4. Writing a take into the score

- The Recorder's **Write into the score** opens its form over the take:
  - **Into:** Both hands · Right hand · Left hand · Melody (Segmented).
  - **Split at** (Both hands only): a key from C2 to C6, middle C by default; keys from it up go to the right hand.
  - **Shortest note:** in x/4 a quarter, an eighth, a sixteenth or an eighth triplet; in x/8 a beat (dotted quarter),
    an eighth or a sixteenth. An eighth by default.
  - **From bar** the caret's bar (a Fact), and **Write**.
- **Quantised** (`quantise`, pure, in `entities/take`): each onset and each release snapped to the nearest step of the
  chosen value at the take's tempo; a note at least one step long; a note of a hand cut where the same key starts
  again.
- **Written** (`writeTake`, an editor edit, one undo step): over **whole bars**, from the caret's bar to the bar the
  take ends in (bars added past the end as needed); in each layer written, every note starting in those bars is
  replaced; a hand's bars there are written out (silent where nothing was played: that is what was played); the
  melody keeps one line (the highest key at each onset, a note cut where the next starts). Notes are spelled in the
  piece's key. The sheet closes on the music written.

## 5. The Chord finder names more chords

The finder names keys only by the builder's chords (CODE_STYLE §8). Two changes:

- **The builder makes two more:** a **7sus4 takes a ♭9** (an available tension of the 7sus4 in `tensions.ts`):
  7sus4♭9 and 13sus4♭9, in the Chords reference too; and a major triad takes **add♯11** (`C(add#11)`, the Lydian
  triad).
- **A chord may leave tones out, as hands do** (`FoundChord.leftOut`, replacing `no5th`):
  - the **5th**, from a 7th chord up and from a 6/9;
  - the **9th and 11th** under a chord's highest number (a 13th's 9th and 11th, an 11th's 9th): `C E B♭ A` is C13,
    `C E♭ B♭ F` Cm11, `C E B A` CMaj13;
  - the **3rd** of a 7th chord over a major triad whose 5th is played: `C G B♭` is C7 with no 3rd.
  - Never the root, the 7th, the highest number or an alteration: they are what the name says.
- **Best first:** root position, then the fewest tones left out, then a chord the table names, then fewer notes.
  The finder shows what is left out after the quality ("No 5th · No 9th"), and says it to a screen reader.
- **Decided against:** naming rootless voicings by a root not played (`E G B D` stays Em7, not Cmaj9: every set of
  keys would name several chords that are not there); a minor 3rd left out (it cannot be told from a major one).

## 6. Code

| Layer                     | What                                                                                                           |
| ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `shared/api/midi`         | `NoteEvent.time`; `PedalEvent` and `onPedal`; `parseMidiMessage` reads CC 64; an unplugged keyboard lets the pedal go |
| `shared/api/audio`        | `audioTimeAt(pageTime)`                                                                                        |
| `shared/lib`              | `createSavedStore`'s `write`; `downloadFile` (bytes saved as a file)                                           |
| `shared/lib/music`        | `alterationsOf` (a 7sus4's ♭9), `ADDED_TONES` (`addS11`), `nameChords` with `leftOut`                          |
| `entities/settings`       | version 7: `recorder.click`; `selectRecorderClick`                                                             |
| `entities/take`           | `Take`, `pt-takes`, selectors (`selectTakesOf`, `selectRoomLeft`), `takeSounds`, `quantise`, `takeGrids`, `midiFile` |
| `features/record-take`    | the pure `takeOf` (events → a take), `recorderClicks`, and `useRecorder` (stage, start, stop, progress)       |
| `features/manage-takes`   | `saveTake`, `deleteTake`                                                                                       |
| `features/set-preference` | `setRecorderClick`                                                                                             |
| `features/edit-piece`     | `deleteSong` deletes the song's takes                                                                          |
| `features/score-editor`   | `writeTake` and its action; `takeParts` (a take's notes split into layers)                                    |
| `pages/score-editor`      | the Recorder sheet, its take rows and write form, the recording strip; `useScoreEditor` holds the recorder     |
| `pages/songs`             | Make and record                                                                                                |
| `app`                     | the takes store in `main.tsx`, `App`, `renderApp`; the editor route's `record` search                         |

## 7. Tests

- **Pure:** `parseMidiMessage` (CC 64, other controllers ignored); `takeOf` (the downbeat's grace, the count-in
  dropped, a re-strike, held keys and pedal at Stop); `recorderClicks` (count-in, accents at the piece's bars, the
  meter past the end); `takeSounds` (velocity, pedal sustain, a re-strike); `quantise` (snapping, a step at least,
  same-key cuts, triplets); `midiFile` (header, tempo and signature, events in order with delta times, pedal);
  the takes sanitiser (compact form, bad notes dropped, ids never reused); `writeTake` (whole bars, hands written
  out, melody one line, bars added, one undo step); `nameChords` (each voicing in §5, ranking, the 124 → new count).
- **Adapters:** web MIDI stamps events and reads the pedal; web audio's `audioTimeAt` from `getOutputTimestamp`.
- **App (`renderApp`):** record in the editor with the fake MIDI and clock (count-in, keys, Stop), the take listed,
  played, written into both hands, undone; downloaded; deleted; no MIDI shows the line; Make and record opens the
  Recorder; the Chord finder names C13 from a shell.

## 8. Not now

Recording the microphone (an audio take); a backing (the piece's accompaniment) while recording; recording the
on-screen keys or the computer keyboard (their timing is the input's lag; the owner asked for the piano); a free
tempo detected from the playing; importing `.mid`; takes outside the score editor.
