# R34-5 · 16 · A recording that follows Transpose and slows cleanly

## Source
ui-ideas.md item 16: swap `<audio>` playbackRate for a signalsmith-stretch node; rate and semitones from
the transport; the loop's passes from the loop; loaded lazily, only on a song with a recording; the
`cheaper` preset on phones; the fake keeps the same interface.

## Today
- `shared/api/audio/recording-player.ts`: an `<audio>` element per file, sought on a 20 ms tick to stay
  on the clock (drift 40 ms), `playbackRate` for speed (pitch kept by the browser, smeared at low rates).
- `pages/player/model/use-player.ts`: the recording plays only in the piece's own key (`isOwnKey`);
  `TransposeTool` says so with an ⓘ ("recordingOnlyIn").

## Will build
- `RecordingPlay` gains `semitones` (the transposition from the piece's own key, nearest way).
- `recording-player.ts`: the file fetched and decoded once into an AudioBuffer; one Stretch node (MIT,
  `signalsmith-stretch` 1.3.2) made lazily on the first `load`, its buffers added; each play scheduled
  on the audio clock (`schedule({output: at, input: offset, rate, semitones, active: true})`) and its end
  (`active: false` at `until` unless the next play follows); a gain node after it set from the play's
  volume each tick; `stop()` deactivates now. No drift loop: the node runs on the audio clock.
- Phones (coarse pointer, narrow screen) configure the `cheaper` preset.
- The Player plays the recording in any key, transposed with the music; `recordingOnlyIn` goes.
- Fake: unchanged interface; the plays it records carry `semitones`.
