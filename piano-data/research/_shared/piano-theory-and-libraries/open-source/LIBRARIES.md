# Libraries for a TypeScript web piano trainer

This maps every library found in ChordLab to the package you'd use in a **TypeScript web app**, with tested snippets.
Versions were checked on npm (2026-11-16). ✅ = I ran it. The other snippets were checked against the packages' type definitions.
`examples/verovio-test.mjs` renders `examples/verovio-chord.svg` (run with Node 24: `npm i verovio && node verovio-test.mjs`).

## Recommended stack

| Need | Package | Version | Licence | ChordLab uses |
|---|---|---|---|---|
| Staff notation and engraving | **`verovio`** ✅ | 6.4.1 | LGPL-3.0 | Verovio 4.x (same library) |
| Notation font | Bravura (bundled in Verovio) | — | OFL 1.1 | Bravura, Leipzig, Leland, Petaluma, Gootville |
| Piano sounds | **`smplr`** ✅ | 1.2.0 | MIT | sfizz + Greg Sullivan E-Pianos |
| Music theory (chords, scales, keys) | **`tonal`** ✅ | 6.6.0 | MIT | own C++ (see `../theory-engine`) |
| MIDI keyboard input | **`webmidi`** (or the native Web MIDI API) | 3.3.1 | Apache-2.0 | JUCE MIDI |
| Metronome and transport | **`tone`** | 15.1.22 | MIT | JUCE timers |
| Spaced-repetition scheduling | **`ts-fsrs`** | 6.0.0 | MIT | ChordLab's own FSRS-6 implementation (see `../practice-engine`) |
| Alternatives for notation | `opensheetmusicdisplay` (BSD-3), `abcjs` (MIT) | 2.3.1 / 6.7.2 | | |

ChordLab parts with **no web equivalent needed**: JUCE (AGPL/commercial), Sparkle (macOS updater), sfizz (native),
and the low-level DSP/audio-file libraries (abseil, atomic_queue, cephes, dr_libs, WavPack, stb_vorbis,
KISS FFT, hiir, SIMDe…). The browser's Web Audio API covers that layer. The full list is at the end.

```bash
npm i verovio smplr tonal webmidi tone ts-fsrs
```

---

## 1. Verovio: staff notation ✅
Renders MEI, MusicXML, ABC or Humdrum to SVG. It handles clefs, key and time signatures, beaming, stems, ledger lines,
spacing, chords and accidentals, and can export MIDI and a timemap for playback highlighting.

```ts
import createVerovioModule from "verovio/wasm";
import { VerovioToolkit } from "verovio/esm";

const tk = new VerovioToolkit(await createVerovioModule());
tk.setOptions({ font: "Bravura", pageWidth: 1200, adjustPageHeight: true, scale: 50 });

const mei = `<mei xmlns="http://www.music-encoding.org/ns/mei" meiversion="5.0"><music><body><mdiv><score>
<scoreDef><staffGrp><staffDef n="1" lines="5" clef.shape="G" clef.line="2"
  meter.count="4" meter.unit="4" key.sig="0"/></staffGrp></scoreDef>
<section><measure n="1"><staff n="1"><layer n="1">
  <chord xml:id="c1" dur="2"><note pname="c" oct="4"/><note pname="e" oct="4"/><note pname="g" oct="4"/></chord>
  <chord xml:id="c2" dur="2"><note pname="e" oct="4"/><note pname="g" oct="4"/><note pname="c" oct="5"/></chord>
</layer></staff></measure></section></score></mdiv></body></music></mei>`;

if (!tk.loadData(mei)) throw new Error(tk.getLog());   // MusicXML strings are auto-detected too
document.querySelector("#score")!.innerHTML = tk.renderToSVG(1);

// Playback highlighting: renderToMIDI() must be called before time lookups
const midiBase64 = tk.renderToMIDI();
const { notes } = tk.getElementsAtTime(0);             // -> ids of notes sounding at 0 ms
notes.forEach(id => document.getElementById(id)?.classList.add("playing"));
```
Tested output: SVG 6.9 KB, MIDI 109 B, `getElementsAtTime(0)` → `{chords:["c1"], notes:[3 ids], page:1}`.

- Grand staff for piano: two `<staffDef>`s inside `<staffGrp symbol="brace">`, the second with `clef.shape="F" clef.line="4"`.
- Fonts: `font: "Bravura" | "Leipzig" | "Leland" | "Petaluma" | "Gootville"`.
- **LGPL:** importing the unmodified npm package from your app is fine. If you modify Verovio itself, publish those changes.

## 2. smplr: piano sounds ✅
Sample-based instruments on Web Audio. `ElectricPiano` includes **CP80, PianetT and WurlitzerEP200**, the same
Greg Sullivan pianos ChordLab bundles, plus TX81Z. `SplendidGrandPiano` is an acoustic grand.

```ts
import { SplendidGrandPiano, ElectricPiano } from "smplr";

const ctx = new AudioContext();                       // create/resume after a user gesture
const piano = new SplendidGrandPiano(ctx);
await piano.ready;                                    // (`.load` is deprecated)
const stop = piano.start({ note: 60, velocity: 80 }); // MIDI number or "C4"
setTimeout(() => stop(), 1000);

const ep = new ElectricPiano(ctx, { instrument: "WurlitzerEP200" });
```
Credit when using the e-pianos: *"E-Pianos by Greg Sullivan, sfz mapping by kinwie, CC-BY 3.0."*

## 3. tonal: music theory ✅
```ts
import { Chord, Scale, Key, Note, Interval, RomanNumeral, Progression } from "tonal";

Chord.detect(["C", "E", "G", "B"]);         // ["Cmaj7"]
Chord.detect(["G", "F", "A", "B", "E"]);    // ["G13no5", "FM9b5/G"]
Key.majorKey("C").chords;                   // ["Cmaj7","Dm7","Em7","Fmaj7","G7","Am7","Bm7b5"]
Scale.get("C dorian").notes;                // ["C","D","Eb","F","G","A","Bb"]
Note.fromMidi(61);                          // "Db4"  (Note.fromMidiSharps for sharps)
Progression.fromRomanNumerals("C", ["IIm7", "V7", "Imaj7"]);
```
`Chord.detect` is a simple template match. For trainer-quality naming with inversions, slash chords and
plausibility rules, port `../../chordlab-export/chord_detector.py` (ChordLab's rules) or
`../../garageband-chord-detection/gb_chord_detector.py` to TS, and use tonal for spelling and scales.

## 4. Web MIDI: keyboard input
```ts
import { WebMidi } from "webmidi";

await WebMidi.enable();                       // Chrome/Edge/Firefox; Safari has no Web MIDI
const held = new Set<number>();
for (const input of WebMidi.inputs) {
  input.addListener("noteon",  e => { held.add(e.note.number);    onChord([...held]); });
  input.addListener("noteoff", e => { held.delete(e.note.number); onChord([...held]); });
}
```
Without the library, use `navigator.requestMIDIAccess()`: status `0x90` = note on, `0x80` = note off, and
a note-on with velocity 0 also means note off. **Safari does not support Web MIDI**, so offer an on-screen
or computer-keyboard fallback.

## 5. Tone.js: metronome and transport
```ts
import * as Tone from "tone";

await Tone.start();                                       // after a user gesture
const click = new Tone.MembraneSynth().toDestination();
const transport = Tone.getTransport();
transport.bpm.value = 80;
transport.timeSignature = 4;

let beat = 0;
transport.scheduleRepeat(time => {
  click.triggerAttackRelease(beat % 4 === 0 ? "C5" : "C4", "32n", time); // accent beat 1
  Tone.getDraw().schedule(() => highlightBeat(beat % 4), time);          // sync UI to audio
  beat++;
}, "4n");
transport.start();
// Tempo ramp drill: transport.bpm.rampTo(100, 30)  -> 80 -> 100 BPM over 30 s
```
Always schedule with the `time` argument (audio clock), never `setTimeout`. That keeps the metronome sample-accurate.
To grade timing, compare `Tone.now()` at MIDI note-on with the scheduled beat time.

---

## Full list of libraries inside ChordLab 1.0.6
From `ChordLab.app/Contents/Resources/THIRD-PARTY-NOTICES.txt`:

| # | Library | Licence | Role in ChordLab | Web app |
|---|---|---|---|---|
| 1 | JUCE | AGPLv3 / commercial | App, audio and MIDI framework | Web Audio + Web MIDI |
| 2 | sfizz | BSD-2 | SFZ sampler | `smplr` |
| 3 | abseil-cpp | Apache-2.0 | sfizz dependency | — |
| 4 | atomic_queue | MIT | lock-free audio queue | — |
| 5 | cephes | BSD-style | math functions | — |
| 6 | ghc filesystem | MIT | file paths | — |
| 7 | invoke.hpp | MIT | C++ utility | — |
| 8 | jsl | BSL-1.0 | C++ utility | — |
| 9 | SIMDe | MIT | SIMD portability | — |
| 10 | st_audiofile | BSL-1.0 / MIT | audio file reading | — |
| 11 | dr_libs | MIT-0 / PD | WAV/FLAC/MP3 decode | browser `decodeAudioData` |
| 12 | libaiff | MIT | AIFF decode | — |
| 13 | WavPack | BSD-3 | WavPack decode | — |
| 14 | stb_vorbis | MIT / PD | Ogg decode | browser |
| 15 | pugixml | MIT | XML parsing | `DOMParser` |
| 16 | spline | BSD-3 | curve interpolation | — |
| 17 | Surge tuning library | MIT | microtuning (.scl/.kbm) | — |
| 18 | KISS FFT | BSD-3 | FFT | `AnalyserNode` |
| 19 | cpuid | BSD-3 | CPU detection | — |
| 20 | hiir | WTFPL | oversampling filters | — |
| 21 | ThreadPool | Zlib | threading | Web Workers |
| 22 | IBM Plex Sans/Mono | OFL 1.1 | UI font | Google Fonts / `@fontsource` |
| 23 | Greg Sullivan E-Pianos | CC-BY 3.0 | instrument samples | `smplr` ElectricPiano |
| 24 | Sparkle 2.9.4 | MIT | macOS auto-update | — |
| 25 | Verovio 4.x | LGPL-3.0 | notation rendering | `verovio` 6.4.1 |
| 26 | (GPL-3.0 text, part of LGPL) | — | — | — |
| 27 | Verovio's bundled deps | BSD-2 / MIT / PD | — | — |
| 28 | Verovio fonts | OFL 1.1 | notation glyphs | bundled in `verovio` |
| 29 | lunasvg | MIT | SVG rasterising | browser renders SVG natively |
| 30 | plutovg | MIT | 2D vector graphics | Canvas/SVG |
