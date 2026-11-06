# Piano Trainer Studio (ztbishop): what we can take

Source: https://github.com/ztbishop/piano-trainer-studio, read 2026-11-06 (README, `docs/PRACTICE_ENGINE.md`,
`PROJECT_CONTEXT.md`, `MIDI_AUDIO_LED.md`, `UI_CONTROLS.md`, the code layout). A static, script-tag app on OSMD and
Tone.js for practising with a MIDI keyboard.

**Licence: AGPL-3.0.** Copying its code would put our app under the AGPL (source to every user, including over the
network). So we take ideas and behaviour only and write our own code. Its Salamander piano samples are the same set we
already use (CC-BY), not theirs. webmscore (MuseScore in WebAssembly) is MIT-licensed separately, so that one could be
used directly.

## What it has, against ours

| Theirs | Ours |
| --- | --- |
| Realtime: plays on at tempo and scores you | Listen plays but does not score: **missing** |
| Wait for Me | Sight-read (`wait`) and Practice (one hand) |
| Follow Me: one hand, the app plays the other and follows your timing | Interpret (`follow`) |
| Early notes accepted: a note played up to about a beat early, held into its place, counts | **missing**: an early note is wrong |
| A satisfied or held note never counts as a wrong one on the next beat | to check against `practice-machine.ts` |
| Notes outside the keyboard's range neither block nor count | **missing**: no keyboard size setting |
| Keyboard size: 25 to 88 keys | **missing** |
| Staves and voices assigned to Left hand, Right hand, Accompaniment or Ignore, per song; voice mode keeps a hand across staff crossings | staves play or show (`staves.ts`); no role per staff or voice |
| Correct, wrong and missed marks on the score, each notehead once | marks exist (`marks.ts`) |
| Accuracy = correct / (correct + wrong) shown live | accuracy only in the trainer's summary |
| Loop with count-in before each pass; the last note of a loop must be played before it restarts | loop exists; to check the count-in and the last-note gate |
| Lower audio latency in Follow mode | to check |
| MIDI out with channel choice, metronome on MIDI channel 10 | MIDI out exists; channel 10 click missing |
| Import MuseScore (.mscz, .mscx) and Guitar Pro via webmscore | MusicXML and MIDI only |
| Library: merge import with a preview, skips identical songs, export a folder | to check against Songs' backup |
| LED strips (WLED) over the keys | **missing**, hardware add-on |
| Fullscreen sheet | **missing** |

## Worth porting, in order

1. **Early-note grace and no double-counting** in the practice machine: the learner's most common false "wrong".
2. **Keyboard size** (49, 61, 76, 88 keys) in the piano's settings: out-of-range notes are skipped, not waited on.
3. **Hand role per staff, per song** (Right hand, Left hand, Accompaniment, Ignore), in the Player's Staves page.
4. **A scored play-along mode at tempo** (their Realtime): Listen's sound, with marks and a live accuracy.
5. **Loop gate and count-in per pass**, if ours lacks them.
6. **MuseScore import** through webmscore (MIT; a large WebAssembly file, loaded only when such a file is opened).
7. Metronome on MIDI channel 10, and fullscreen.

Left out: WLED and LED strips (hardware we cannot test), Guitar Pro (not a piano format), their library merge
(only if ours falls short).
