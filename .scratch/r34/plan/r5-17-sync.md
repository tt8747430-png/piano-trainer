# R5 item 17: a recording's beat grid, nudged

## Source

ui-ideas.md §17: `web-audio-beat-detector` `guess()` in a worker once per recording, BPM and offset saved with the
song; the learner can nudge it (StemDeck's fixable grid, simplest form); the click and cursor follow it.

## Today

Every recording in the app is authored (`Recording {src, start, tempo, tuning}` in the piece's content, measured by
hand: Romashki). Learners cannot add audio to a song. The click and the cursor follow the chart; the recording is
stretched to the chart's tempo (`recordingPlay`, rate = pass tempo / recording tempo) from `start`.

## Decision

A detector has nothing to detect: every recording carries a measured start and tempo, so `guess()` would only
overwrite better numbers. It is left out until learners can bring their own audio (then it fills `start` and `tempo`
on import). What remains is the nudge: a device or a browser can hear the recording a little off the notes, and the
learner fixes it by ear.

## Will build

- Player › gear › Staves, the Recording row, under its volume while it plays: **Sync**, a Stepper.
  - Value in milliseconds, −500 to +500, step 10, default 0. Reads "In time" at 0, "20 ms earlier", "20 ms later".
  - Buttons "Earlier" and "Later".
- Saved per song in the pieces store (`recordingSync`, ms by piece id; version 12), shared by every device's sync.
- The recording's bar 1 moves by it: `start − ms / 1000` (later = the file's bar 1 heard later). The click and the
  cursor stay on the chart, which the recording now meets.
- en and ru strings; ADR 0034 and 0105 amended.
