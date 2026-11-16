# Accompaniment, sound and MIDI

## 1. Backing Rhythm (drums)
There are two systems in the bundle.

### 1a. Current GM step-pattern library (exact; `DrumPatterns.json` + `ARBDrumPatternLibrary`)
- The file format is described in its own `comment` field and in `Sounds/GM Drum Kits/README.md`. Patterns use the GM percussion map.
- Step characters: `.` rest, `g` ghost, `o` soft, `x` normal, `X` accent.
- `steps.length = bars × beatsPerBar × stepsPerBeat`. `stepsPerBeat` is 3 for a triplet grid, 4 for 16ths and 8 for 32nds.
- `swing` is 0…0.33 and delays every off-beat subdivision by that fraction of a pair; 0.167 ≈ triplet.
- `tempo` is the style's suggested BPM. Patterns render to MIDI at 120 BPM (`ARBDrumPatternMIDIRenderer midiDataForStyle:`), and playback follows the app tempo.
- Genres and styles: **38 styles in 9 genres**, plus "Custom".
  - None
  - **Simple**: 8ths Hats, 16ths Hats, 8ths Hats & Click, Kick & Snare, Songwriter 1, Groove 1
  - **Latin**: Bossa Nova, Samba, Salsa, Congas, Cha Cha Cha
  - **Jazz**: Swing Ride, Swing Brushes, Jazz Waltz, Ride Cymbals
  - **Hip Hop**: Trap Soul, Trap 808, Boom Bap (swing 0.1), Hip Hop Soul (0.08), Lo-Fi Chill (0.12)
  - **Dance**: House, House (No Clap), Disco, Techno
  - **Pop**: Straight 8s, Pop Rock, 16th Groove, Funk 16ths, Motown
  - **Ballad**: Slow Ballad, 6/8 Ballad, Power Ballad, Brush Ballad
  - **Groove**: Reggae One Drop, Reggaeton, Country Train, Waltz, Afro 12/8
- Full table (kit, tempo, grid, notes) in `data/drum_patterns.json`.
- **7 GM kits** (`Sounds/GM Drum Kits/<Kit>/`): Standard, Room, Power, Electronic, TR-808, Jazz, Brush.
  - Each kit is a `<Kit>.aupreset` (AUSampler) with per-note WAVs and a `kit.json` (`{kit, source_instrument, bank 128, program 0, zones:[{key, file, shift, gm, atten, sample, rate 44100}]}`).
  - The loader accepts `.aupreset`, then `.exs`, then `.sf2` (bank MSB 120). It also scans `Documents/GM Drum Kits/` at runtime.
  - The samples are extracted from FluidR3 GM (MIT) and **exported** (see RESOURCES_LICENCES.md).
- **Drum Pattern Editor** (`DrumPatternEditorViewController`, `ARBDrumGridView`): choose Custom ▸ "+ New". "Tap a cell to cycle through normal, accent, soft and off, or swipe right to paint a run of hits and left to erase." There is a kit menu at the top and an audition button. Custom patterns are stored in defaults (`TBDrumCustomPatternsKey`). MIDI groove import (`ARBDrumPatternMIDIImporter`) shows the error "No drum notes found. Export a General MIDI drum groove (kick = 36, snare = 38, hats = 42…)". **exact**.

### 1b. Legacy kit-specific loops (still bundled)
Top-level `.mid` loops at PPQ 96, 1–4 bars, each paired with its own EXS kit:

| Loop | Kit |
|---|---|
| Boom Bap 01 | Boom Bap Kit 01 |
| Bossa 02_A/_B | Bossa 02 |
| HipHopSoul01 | HipHopSoulKit01 |
| HouseDisclosureBeat01 (+ -NoClap) | House Disclosure Kit |
| Jazz Drum Rides 01–04 | Jazz Drum Rides 01 |
| Jimindorothy | Jimindorothy Kit |
| Latin 01 | Latin Perc Kit 01 |
| MoonChild1 | MoonChild Kit |
| Songwriter01 | Songwriter01 |
| Trap Soul Kit 01 (+ _8th_Hats / _16th_Hats) | Trap Soul Kit 01 |

`ARBDrumPatternLibrary legacyStyleAliases` maps the old names; pack playlists still refer to "Hip Hop Soul", "Beat 01 (No Clap)" and "8ths Hats & Click". **exact** names. Mapping detail **inferred**.

`DrumPatternGenerator` plays the style in sync with the chord sequence (`switchToGenre:subGenre:enteringAtBeat:`, `playbackWithCompensationTime:`).

## 2. Bassline tool (exact; `BasslineManager`, `BasslineGenerator`)
- Toggle "Play a bassline under the progression".
- **Styles** (index order): Roots, Pulse, Groove, Walking, Bossa, Pop, Funk. Planners: `planRootsInto`, `planPulseInto`, `planGrooveInto`, `planWalkingInto`, `planBossaInto`, `planPopInto`, `planFunkInto`. Walking/groove lines look ahead to the next chord's root (`nextTargetPC`) and use `approachNoteToward:from:complexity:` and `stepwiseNoteFrom:`.
- Then `humaniseEvents:` runs, the pitch range is clamped (`registerLow/High`, `foldPitchClass:nearNote:`), and `swingOffsetForManager:` is applied.
- Sliders: **Complexity, Swing, Humanise** (0…1), Octave offset, Instrument ("Auto", "Electric Bass" TBass02, 808 Bass, Double Bass, Bass Bouquet Combo). The UI also offers Low/Mid/High and Vol.
- **Practice mode** routing: **Full / Bass Only / Chords Only**.
- **Presets** (table @0x1005b9818, read as style/complexity/swing/humanise):

| Preset | Style | Complexity | Swing | Humanise |
|---|---|---|---|---|
| Beginner Practice | Roots | 0.10 | 0 | 0.20 |
| Jazz Walking | Walking | 0 | 0.55 | 0.45 |
| Ballad | Pulse | 0.30 | 0 | 0.40 |
| Blues | Walking | 0.55 | 0.60 | 0.40 |
| Latin | Bossa | 0.50 | 0 | 0.30 |
| Bebop | Walking | 0.95 | 0.65 | 0.50 |
| Contemporary Pop | Pop | 0.45 | 0 | 0.25 |
| Funk Foundation | Funk | 0.60 | 0.15 | 0.35 |

  The complexity-0 value for Jazz Walking is as read; the column assignment follows the decompiled setter order. **exact** read, **inferred** column mapping.
- Defaults (`resetToDefaults`): off, style Walking (3), complexity 0.5, swing 0.5, octave 0, instrument 0, bass volume 1.0. Custom presets can be saved, renamed and updated ("+ Save Preset", "Update with Current Settings"). A live view shows note names as each bar is planned ("Press Play to hear the line. Notes appear here as each chord is planned."). **exact**.
- The older `BassPatternGenerator` offers root, root+5th and bossa patterns.

## 3. Chord Pattern (rhythm of the chord instrument; `ChordPatternGenerator`)
- Patterns (**exact**, UI order): **Block Chord (Default), Strumming Up, Strumming Down, Strumming Up & Down, Alternate Notes V1, Alternate Notes V2, Block Pattern 1**. The code also has `randomPattern`, `alternateNoteDownPattern`, `miscUpPattern` and `stabBlockChordPattern01`.
- Playback rate index → multiplier **[0.5, 1, 2, 4, 8, 16]** (table @0x1005be7b8). **exact**.
- Options: "Play on Keyboard: Play the pattern as you press chords". Chord level is in Settings ▸ Sound.

## 4. Swing feel for scores (exact; `SwingFeelCatalog` table @0x10061c418)
13 presets: **Off (50%) "Plays exactly as written"**, then for both 1/8 and 1/16 units:

| Preset | Swing % | Description |
|---|---|---|
| A | 54 | "A whisper of lilt" |
| B | 58 | "A gentle lean" |
| C | 62 | "Classic light swing" |
| D | 66.7 | "The true triplet shuffle" |
| E | 71 | "A deep, lazy pocket" |
| F | 75 | "Hard dotted shuffle" |

Labels: "Eighth-Note Swing" / "Sixteenth-Note Swing". The clef target (which staff swings) is `swingClefTarget`. Timing is done by `EatsSwingUtils` (`calculateSwingNsForPosition:type:amount:bpm:qnPerMeasure:minQuantization:`).

## 5. Instruments and sound engine
- **Engine**: `AVAudioEngine` (`TBDeviceAudioEngine`), with `AVAudioUnitSampler` per part, `AVAudioSequencer`, `AVAudioUnitReverb`, `AVAudioUnitDelay`, `AVAudioUnitTimePitch` and `MIKMIDISynthesizer`/`MIKMIDISequencer`. Classes: `TBMIDIEnginePlayer`, `TBSamplerPlayer`, `ARBMIDIEnginePlayer`, `AudioSequenceEngine`. **exact**.
- **Sampler instruments** (EXS24 `.exs` + mp3/m4a/aif samples in `Sampler Files/`; the file name codes the note, velocity layer and an ID, e.g. `GrandPianoC-A3-V127-EEXI.mp3`):

| EXS | Display | Samples |
|---|---|---|
| GrandPianoC | Grand Piano | 22, every minor 3rd (A/C/D#/F#), V127 |
| GrandPianoA | Piano | 19, every major 3rd, V100 |
| RhodesB | Electric Piano | 13, V66 |
| RhodesMixA | Rhodes | 18, V67 |
| StringsA | Strings | m4a, 2 velocity layers V32/V79 |
| DreamKey | Dream Key | 16 |
| DevantePad | RnB Pads | 11 |
| GuitarC | Guitar | 18, V98 |
| VibeA | Vibes | 16, V92 |
| DoubleBassC | Double Bass | 12, V59 |
| TBass02 | Electric Bass | 7 |
| 808Bass01 | 808 Bass | 8 |
| BassBouquetCombo | Bass Bouquet Combo | 13 |
| JazzDrumsA / JazzDrumsBrushesA / SalsaPercussionB | score drum kits | |

- `gs_instruments.dls` (Roland GS, "1997 Roland Corporation") is used for the GM "MIDI Instrument".
- **Live keyboard instrument** list: Grand Piano, Electric Piano, Rhodes, Vibraphone, Organ, Harpsichord, Acoustic Guitar, Strings, MIDI Instrument (set separately in Settings ▸ Sound). **exact**.
- **Reverb Space** (13 presets, Apple `AVAudioUnitReverbPreset` order), grouped as Rooms / Chambers / Halls / Studio / Other:

| Preset | Description |
|---|---|
| Small Room | "Tight, close, almost no tail" |
| Medium Room | "Some air around each note" |
| Large Room | "Roomy, with a soft tail" |
| Large Room 2 | "Roomier and a bit brighter" |
| Medium Chamber | "Warm, controlled reflections" |
| Large Chamber | "Deep chamber warmth" |
| Medium Hall | "Concert-hall spread" |
| Medium Hall 2 | "Brighter hall voicing" |
| Medium Hall 3 | "Darker, with a longer tail" |
| Large Hall | "Wide, with a slow decay" |
| Large Hall 2 | "Widest hall, longest decay" |
| Cathedral | "Vast, long and airy" |
| Plate | "Bright, dense studio sheen" |

  Plus a wet/dry amount.
- **Metronome**: `MetronomeSequencerAudio` plays `tick.aif` (accent) and `tock.aif` with separate volumes. Long-press the icon for settings. Count-in is described in PRACTICE_LESSON_PLAYER.md. **Tap tempo** (`TapTempo`, exact): average of the intervals between taps; BPM = 60 / avg. If the newest interval differs from the running average by a ratio > 1.5, all but the last two taps are discarded (restart).
- **Audio device settings**: Output Device and Input ("Listen Through"), Sample Rate ("Shared with other apps"), **Buffer Size** ("smaller responds faster to your playing, larger is steadier"; shown in ms; key `TBAudioBufferFrameSizeKey`). If a device is unplugged, the app falls back to System Default.

## 6. MIDI (exact strings; MIKMIDI + CoreMIDI, `TBMIDIManager`, `TBMIDIOutputRouter`, `TBMIDISyncManager`)
- **Input**: auto-connect, an input channel (1–16 or All Channels), and per-device port selection ("Every enabled port plays Chordio at the same time"). Virtual sources come from other apps. "Chordio Virtual Input". Bluetooth MIDI uses `CABTMIDICentralViewController` (background mode `bluetooth-central`). Network MIDI uses `_apple-midi._udp`.
- **Output**: "Play Chords Through": **Chordio Built-in Sounds** or **Chordio Passthrough** (send MIDI to apps, DAWs and synths). Destinations include "Chordio Virtual Output". **Separate channels** for **Chords & Keyboard**, **Bassline** and **Backing Rhythm** (drums can be sent as MIDI or played on the internal kit). Keys: `TBMIDIOutput{Chords,Bass,Drums}ChannelKey`, `TBMIDIOutputSendDrumsKey`.
- **MIDI Sync**:
  - Send MIDI Clock ("Clock and Start/Stop while the progression plays").
  - Sync to MIDI Clock ("Follow the tempo and beat of another app"), with Clock Source Automatic or a chosen port.
  - Start/Stop follow.
  - "Respond to MMC Play, Stop and Pause".
  - Status card states: FOLLOWING / SENDING / WAITING FOR MIDI CLOCK.
  - "if the other app starts mid-song, Chordio comes in at the next bar". There is a guide for Ableton Live.
- **Ableton Link** (LinkKit + `link_audio`): settings `ABLSettingsViewController`, keys `ABLLinkEnabledKey`, `TBLinkAppTempoKey`, `TBLinkTransportIsPlayingKey`, and start/stop sync (Info.plist).
- **MIDI file I/O**: "Export MIDI...", drag the progression title out to a DAW, "Export Chord List CSV" (`Title,Author,Tempo,Chord Progression` header), Import File… (MIDI, Chordio project `.cpl`/`.chordpack`, and **Ripchord** files).
