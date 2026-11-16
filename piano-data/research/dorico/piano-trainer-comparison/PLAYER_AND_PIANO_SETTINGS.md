# Player (playback) and piano settings: Dorico 6 vs Piano Trainer

**Evidence:**
- **[D] Dorico 6.2.31:**
  - project playback options from a Dorico 6 project (`../midi-and-staff/d6-playback.json`, 155 options)
  - app preferences (`../midi-and-staff/dorico-preferences-all.json`)
  - commands (`../ui-flow/COMMANDS.md`)
- **[PT] Piano Trainer:**
  - `src/entities/settings/model/types.ts` and `registry.ts`
  - `shared/lib/keyboard-choices.ts`
  - ADR 0034
- Flat's player and piano settings will be added in `piano-data/research/flat/FLAT_PLAYER_AND_PIANO.md` (in progress).

---

## 1. Dorico's player settings

### 1.1 Playback Options (per project, Play › Playback Options), Dorico 6 defaults
| Group | Setting = default | What it does |
|---|---|---|
| **Timing** | `noteDurationPercent = 95` | Notes sound for 95% of their written length |
| | `staccatoDurationPercent = 50` · `staccatissimoDurationPercent = 25` · `tenutoDurationPercent = 98` · `legatoDurationPercent = 105` · `marcatoDurationPercent = 95` | Articulation lengths |
| | `timingHumanisePercent = 30` · `timingHumaniseEndOffsetsPercent = 30` | Random timing variation |
| | `defaultRhythmicFeel = rhythmicfeel.straight` | Swing (11 feels in the library) |
| | **Keyboard instruments:** `additionallyTruncateAbuttingNotesOfSamePitchOnKeyboardInstrument = true`, gap between repeated same-pitch notes **95–150 ms**, `truncationBehaviourOfChordsIfAnyNoteOfSamePitchRepeatedOnKeyboardInstrument = kShortenAllNotesOfChordPlayedBySameHand` | **Piano-specific:** a repeated key is released before it's struck again, as a pianist must |
| **Dynamics** | `dynamicHumanisePercent = 5` · `primaryBeatStressDelta = 0.25` · `beatStressDelta = 0.1` | Beat stress and humanising |
| | `accentDynamicDelta = 0.5` · `marcatoDynamicDelta = 0.8` · `tenutoDynamicDelta = 0` | Articulation loudness |
| | `dynamicCurveParams = 0.5, 2.5, 2.5` · profile levels −6…+6 | Dynamic curve (ppp…fff → velocity) |
| **Note expression** (54) | `enableNoteExpression = true`, `overallImpactPercentage = 100` | Phrase shaping |
| | **Polyphonic voice balancing:** `automaticallyBalanceVoicesOfPolyphonicInstruments = true`; melody outer notes **+0.2**, other melody notes −0.3, bass outer notes −0.5, other bass −0.7, inner single notes −0.6, inner chords −0.85 | **Piano-specific:** the melody sings over the accompaniment |
| **Pedal lines** | depression 1/4, retake 1/2, release 1/2 (lengths at 120 BPM); `sustainDepressedAfterNote = true` | How written pedal marks play |
| **Grace notes** | length 1/6 at 120 BPM; short appoggiatura below a semiquaver; `playAppoggiaturas = true` | |
| **Arpeggios** | offset 1/10 at 120 BPM (1/12 under a slur); `playbackPosition = kStartsOnBeat`; offset min 1/2, max 3/4 | Rolled chords |
| **Trills** | speeds 8 / 12 / 16 per second (slow / normal / fast); `startPlaybackOnUpperNote = false` | |
| **Tremolos** | unmeasured threshold 3 strokes; length 1/5 at 120 BPM | |
| **Holds and pauses** | fermata lengthening: very short 15%, short 25%, normal 50%, long 100%, very long 200%; caesura silence 50%; breath mark −50% | |
| **Repeats** | `playRepeats = true`; `playRepeatsAfterDS = false` | |
| **Chord symbols** | `playChords = false`; instrument `instrument.keyboard.piano` | Hearing the chord track |
| **Click and count-in** | click off; count-in **1 bar**; cycle off; click pitches 83 / 79 / 71 at velocities 64 / 56 / 48; sound `kClickSound`; beat subdivisions in compound meters | |
| **Other** | `pitchOfA4InHertz = 440` · `gapBetweenFlowsSeconds = 5` · `preRollBeforeFlowSeconds = 0` · `playBackSlashedVoices = false` | |

### 1.2 Playback preferences (per machine or person)
- **Device and audio:** audio device, sample rate 44.1 kHz, buffer size, multi-core rendering.
- **Defaults:** playback template `playbacktemplate.auto` (HALion sounds), default output gain 0.5.
- **Playhead:**
  - follow playhead: on
  - show playhead when stopped: off
  - play-from-selection plays only the selected staves: on
  - mini-transport display: bar.beat.tick
  - reset controllers on stop: on

### 1.3 Transport and player commands (Play mode and all modes)
- **Start or stop:**

  | Key | Action |
  |---|---|
  | Space | Start or stop |
  | P | Play from the selection |
  | ⇧Space | Play from the last start position |
  | ⌥⇧Space | Play from the start of the flow |
  | Numpad 0 | Stop |

- **Other transport:** Rewind, Fast-forward, Record, Retrospective Record, **Fixed Tempo** mode (ignore tempo marks and use a set tempo), Click on/off, **Cycle** (loop between locators), Solo/Mute per instrument.
- **Mixer** in the lower zone or its own window: per-channel volume, pan, solo/mute, FX.
- **Key Editor:** piano roll; velocity, CC and playing-technique lanes; edits **played** vs **notated** durations (preference `displayNotatedDurationsInPianoRoll`).

### 1.4 Dorico's piano (the instrument and the keyboard panel)
- **Piano instrument** (`instrument.keyboard.piano`): 2 staves, brace, treble + bass, range **A0–C8**.
- **Keyboard panel:** in the **lower zone** of Write mode (`projectwindow/lowerzone/keyboard`). It's an **input** device: click a key to enter a note, and keys light while you play MIDI. It lives in a separate module, so its own options weren't located in the main binary; the manual page is listed in `../ui-flow/PANELS_AND_BUTTONS.md`.
- **Auditioning while editing** (preferences): play notes during input and selection (on); play the whole chord when one note is selected (off); fixed velocity 100 (off).

---

## 2. Piano Trainer's player and piano settings [PT]

### 2.1 Player gear (`SETTING_HOMES` → `player`)
| Key | Values | Default |
|---|---|---|
| `scoreView.layout` | Page view / Vertical scroll / Panorama | vertical |
| `scoreView.music` | Sheet / Lyrics / Diagrams / Grid | sheet |
| `scoreView.diagrams` | animated / summary | animated |
| `scoreView.chordNames`, `scoreView.lyrics` | on/off | on, on |
| `scoreView.pinned` | on/off | on |
| `scoreView.textSize` | 80, 90, 100, 115, 130, 150 % | 100 |
| `scoreView.keys` (keys under the score) | on/off | on |
| `scoreView.hands` (3D hands in the keys' place) | on/off | on |
| `scoreView.angle` | seat / above | seat |
| `scoreView.handsOnKeys` | on/off | on |
| `scoreView.range` | song, 61, 76, 88 keys | song |
| `practice.fingerNumbers`, `practice.namedNotes`, `practice.positions`, `practice.metronome` | on/off | all off |
| `sound.staves` (volume per staff), `sound.recording`, `sound.click` | 0–100 % | 100 |
| `otherHand.look` | show / dim | dim |
| `playback.countdown` | none / audible / visual | none |
| `playback.speedStep` | 2, 5, 10 % | 5 |

**In the Player itself, not saved as settings:**
- **Pace:** Listen / Wait / Interpret.
- **Hands:** Left · Both · Right.
- **Version:** Original / Simplified / Easy.
- **Loop, transpose (−5…+6), speed.**

### 2.2 On-screen piano (`/settings/on-screen-piano`)
| Key | Values | Default |
|---|---|---|
| `keyboard.keySize` | piano / fit / large | (see `keyboard-choices.ts`) |
| `keyboard.swipe` | scroll / glissando | |
| `keyboard.namedKeys` | C only / all / none | |
| `keyboard.markNotes` | on/off | |
| `keyboard.chordNames` | on/off | |
| `keyboard.typing` (computer keys play) | on/off | |
| `keyboard.autoplay` | on/off | |
| `keyboard.dock` | bottom / top | |
| `keyboard.pedals` (which pedals the bar shows) | sustain / all three | |
| `keyboard.volume` | 0–100 % | |

### 2.3 Sound engine (ADR 0034)
- **Sampled sets:**
  - Salamander Grand Piano V3: 30 roots × 4 velocity layers, CC BY
  - a light piano: 1 layer
  - two basses and a drum kit (CC0)
- **Behaviour:**
  - String decay: 1.5 s at the top key to 6 s at the bottom.
  - Damper: 0.6 s at C3 to 0.25 s at C5.
  - One voice per key.
  - Sustain, sostenuto and soft pedals; the soft pedal plays at ⅔ volume.
- **Tuner** has A4 = 440 (`tuner.a4`), but there's no playback tuning setting.

---

## 3. Comparison: what Piano Trainer's player and piano could add from Dorico
| Dorico feature [D] | Piano Trainer [PT] | Gap and value for a piano learner |
|---|---|---|
| Played vs written length (95%), articulation lengths (staccato 50%, tenuto 98%, legato 105%) | not found as settings; the scheduler plays notes for their written length (ADR 0034) | **Medium:** staccato and legato are audible when learning articulation |
| **Repeated-note handling on keyboards** (release 95–150 ms before re-strike) | "one voice a key; struck again, the voice still ringing on it is damped" | ✅ equivalent damping; no timing gap |
| **Voice balancing** (melody above accompaniment) | per-staff volume only | **High:** hearing the melody stand out is a core teaching aid; a "Melody louder" or "Balance voices" switch |
| Beat stress, dynamic curve, humanise | velocity per note from the music; Touch curve for MIDI input | **Low/medium** |
| Written pedal marks → pedal timing (depression / retake / release) | the schedule emits pedal at each event of the piece's pedal line; CC64 to a connected piano | ✅ |
| Grace notes, arpeggios, trills, tremolos, fermatas in playback | not checked in detail (grep finds arpeggio / tremolo / fermata in 91 / 14 / 11 files) | verify that each plays |
| **Fixed tempo mode** | the speed control changes tempo, never the song's (ADR 0114) | ✅ similar |
| Count-in 1 bar, click with accent pitches | count-in setting: none / audible / visual; click volume | ✅ (visual count-in is beyond Dorico) |
| **Cycle / loop between locators** | Loop in the Player | ✅ |
| Play repeats, and after D.S. | not found as a setting | **Low:** a "Play repeats" switch for practice |
| Chord-symbol playback (piano) | Chord player plays chords; Player plays the song | ✅ |
| Solo/mute per instrument; mixer | per-staff volume; Hands (L/B/R) | ✅ for a piano app |
| Play from selection, from last start, from flow start | Play from here (editor), the Player's bar | ✅ |
| Follow playhead on/off | the Player follows | ✅ |
| Key Editor (played vs notated lengths, velocity lane) | take roll (`widgets/take-roll`: drag notes, velocity kept) | ✅ for takes |
| **A4 tuning for playback** (`pitchOfA4InHertz 440`) | tuner only | **Low** |
| Audition the whole chord when one note is selected | not found | **Low** |
| Keyboard panel in the lower zone, for input | on-screen piano everywhere, docked, sized, named keys, swipe, typing, pedals | ✅ **far richer than Dorico's** |
| 3D hands, Wait / Interpret, versions, other hand dim | — (no Dorico equivalent) | ✅ unique to Piano Trainer |
