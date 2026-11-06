# StemDeck: what we can take

Source: https://github.com/stemdeckapp/stemdeck, read 2026-11-06 (README, ROADMAP, `static/js`, `static/vendor`,
`app/pipeline`). A desktop app (Python server plus a web studio) that splits a song into six stems with Meta's Demucs
and opens them in a practice mixer.

**Licence: Apache-2.0.** Its code may be ported with its copyright notice kept. Its two audio libraries are MIT:
Signalsmith Stretch 1.3.2 (WebAssembly) and a SoundTouch worklet.

## What it has, against ours

| StemDeck | Ours |
| --- | --- |
| Stems from any song by Demucs, on the user's own machine (Python, a GPU helps) | none; a PWA cannot run Demucs well, it needs a server |
| Slow down 0.5–0.99× **with pitch kept**, by a time-stretch worklet | the recording plays through `<audio>` `playbackRate` (`recording-player.ts`), the browser's own stretch |
| **Change the key** of the whole song or one stem, by the same worklet; drums never transposed | the recording **falls silent when the song is transposed** (`TransposeTool`) |
| Loop by dragging across the waveform | loop by bars on the score |
| A click that follows the song: beat grid detected, then fixable (move, add, remove beats, mark bar lines), count-in, groupings like 3+2+2 | the metronome follows the score; no beat grid for a recording |
| Key, tempo and loudness found; sections (verse, chorus) detected or marked | to check against the song page |
| Synced lyrics from LRCLIB, retimed by tapping along | lyrics exist; no timing to a recording |
| Song and artist details from MusicBrainz and Wikipedia | none |
| **Guide**: a button turns the screen into its own manual; pointing at anything explains it, clicks explain instead of acting | none |
| Library: coloured folders, `#tag` search, favourites, a Trash that only deletes when emptied (hold to restore) | folders, favourites, an archive |
| Export the mix, each stem, only the loop, with click or count-in | export score files only |
| Opens on a phone over the user's own Wi-Fi by QR code | ours is a PWA already |

## Worth porting, in order

1. **The recording follows a transpose and slows down cleanly:** Signalsmith Stretch (MIT) in an AudioWorklet behind
   `recording-player.ts`, so Transpose no longer silences the recording, and 0.5× sounds natural. StemDeck's
   `tempoStage.js` and `pitchBus.js` show the wiring (Apache-2.0, port with notice).
2. **A beat grid for a song's recording:** detected once, fixable by the learner, so the click, the loop and the score's
   cursor stay with the recording. StemDeck's `beatgrid.js` and `metronome.js` (groupings, count-in) are the model.
3. **Guide mode:** point at any control to read what it does; one help layer over the Player and the editor, using the
   labels we already write.
4. **Loop by dragging** across the recording's waveform, beside the bar loop.
5. **Synced lyrics** for songs with a recording, timed by tapping along (LRCLIB as a source, by the owner's choice).
6. **A Trash** in Songs that deletes only when emptied.

Left out: stem separation itself (Demucs needs a server and a GPU; it would be a hosted service, the owner's decision on
hosting and cost), YouTube and SoundCloud downloading (rights), MusicBrainz details.
