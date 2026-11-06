# Open-source code we can install or port

Read 2026-11-06. Licences and versions checked against npm tarballs, LICENSE files or GitHub's licence field. Okabe–Ito
and Tol colours are from memory, so check them before use.

## Install

| Need | Package | Licence | Version | Size | Use |
| --- | --- | --- | --- | --- | --- |
| Slow down and transpose a recording, pitch kept | `signalsmith-stretch` | MIT | 1.3.2 | 48 KB gzip (wasm inlined) | **yes**: one AudioWorklet node, rate, semitones, loop |
| Tempo of a recording | `web-audio-beat-detector` | MIT | 8.2.39 | 42 KB, in a worker | yes: BPM and first-beat offset (steady songs) |
| Colour-blind checks in tests | `culori` | MIT | 4.0.2 | tree-shaken, dev only | yes: Machado simulation and CIEDE2000 |

```ts
// signalsmith-stretch, behind shared/api/audio/recording-player.ts
import SignalsmithStretch from 'signalsmith-stretch'
const stretch = await SignalsmithStretch(context)
stretch.connect(context.destination)
await stretch.addBuffers([...Array(buffer.numberOfChannels)].map((_, c) => buffer.getChannelData(c)))
stretch.schedule({ input: 0, rate: 0.75, semitones: -2, loopStart: 4, loopEnd: 12 })
stretch.start()
stretch.setUpdateInterval(0.05, (seconds) => onTime(seconds)) // the playhead, in the recording's seconds
// stretch.configure({ preset: 'cheaper' }) on phones; stretch.dropBuffers() on leaving
```

```ts
// web-audio-beat-detector
import { guess } from 'web-audio-beat-detector'
const { bpm, offset } = await guess(buffer, { minTempo: 50, maxTempo: 200 })
// beat n at offset + n * 60 / bpm
```

```ts
// culori, in a test of the role and hand colours
import { filterDeficiencyProt, filterDeficiencyDeuter, filterDeficiencyTrit, differenceCiede2000, wcagContrast } from 'culori'
const dE = differenceCiede2000()
for (const sim of [filterDeficiencyProt(1), filterDeficiencyDeuter(1), filterDeficiencyTrit(1)])
  for (const [a, b] of pairs(roleColours)) expect(dE(sim(a), sim(b))).toBeGreaterThan(10)
```

## Port, not install

- **Glissando across keys by touch:** klavier (MIT) resolves each touch with `document.elementsFromPoint`. **Ours
  already glides** (`use-key-pointers.ts` maps the pointer to `keyAt` on move), so there is nothing to take.
- **Fingering:** pianoplayer (MIT, `hand.py`), with a browser JS adaptation in
  tiefenb/piano-vision-automatic-fingering-assignment (MIT).
  - Its model:
    - Keys are placed in cm (octave 16.5); use the name-table `keypos`, not the buggy `keypos_midi`.
    - Hand factor: M 0.82 by default, S 0.64, L 1.0.
    - Rest offsets of the fingers: −7.0, −2.8, 0, 2.8, 5.6 cm.
    - Finger weights: 1.1, 1.0, 1.1, 0.9, 0.8. Black-key factors: 0.3, 1.0, 1.1, 0.8, 0.7.
    - Cost: `|x − pos[f]| / (dt + 0.1) / weight / bfactor`.
    - Depth-first search to depth 9 with pruning; it commits one note and slides the window.
  - **Ours already has** a Parncutt-table fingering (`shared/lib/music/passage-fingering.ts`), so pianoplayer is a
    second opinion to compare on our test pieces, not a replacement. Nakamura's HMM (arXiv:1904.10237) is the upgrade,
    but it needs the gated PIG data.
- **LRC lyrics:** the grammar is about 20 lines (`/\[(\d+):(\d+(?:\.\d+)?)\]/g`). Write it in `shared/lib` with a test;
  lrc-kit (MIT) is the reference. LRCLIB (`GET https://lrclib.net/api/get?track_name=&artist_name=&duration=`) allows
  CORS and needs no key, but wants a `Lrclib-Client` header. The lyrics are third-party copyright, so fetching them is
  the owner's decision.
- **A beat tracker for rubato recordings:** Ellis 2007 (an onset envelope plus dynamic programming), about 150 lines,
  ours to write.
- **Latency:**
  - The output delay is `baseLatency + outputLatency`; `outputLatency` needs Safari 18.4.
  - `getOutputTimestamp()` bridges `MIDIMessageEvent.timeStamp` to audio time.
  - Then a tap-along calibration takes the median offset and saves it per device.
  - **Ours already reads** `outputLatency` and `getOutputTimestamp` (`shared/api/audio/web-audio.ts`). The calibration
    is what's missing (Piano Forte §2 in `pianoforte-code.md`).

## Avoid, or the owner's call

| Package | Why |
| --- | --- |
| Rubber Band wasm | GPL-2.0 or a paid licence |
| `@soundtouchjs/audio-worklet` | MPL-2.0 and lower quality; second choice only |
| essentia.js | AGPL-3.0 |
| aubiojs | bundles GPL aubio |
| `color-blind` (npm) | CC-BY-SA algorithm, dated |
| react-piano | mouse-only glissando, 2019 |
| webmscore | GPL. The wasm is 3 MB gzip plus 8 MB of data, too heavy to precache. Loaded on demand in a worker it is the owner's licence call. The licence-clean route is to read the `.mscx` inside the `.mscz` zip ourselves, or ask learners to export MusicXML |

```js
// webmscore, if the owner accepts GPL, in a worker
await WebMscore.ready
const score = await WebMscore.load('mscz', new Uint8Array(buffer), [], false)
const musicXml = await score.saveXml()
score.destroy()
```
