# Flat 26.11.0 (desktop): player, playback and piano/keyboard reference

Source: the extracted ASAR (`out/renderer/assets/*.js`, `out/main/*.js`), read as static data only. Flat was never run.
Chunk names are the Vite file names without the `.js` suffix.

Labels used on every claim:
- **[E] exact**: read directly from code or from a locale string.
- **[I] inferred**: deduced from naming, structure or missing evidence.

English UI strings come from the flattened English locale bundles: `flat-CZTB7TE2` (namespace `flat:`), `editor-DQKBG5ZR` (namespace `editor:`) and `desktop-DIs4v9Ek`.

The persistent-storage wrapper is in `vue-data-D9mDxW5Z`. It uses the namespace `flat_user` and the delimiter `.`, and stores values as JSON in `window.localStorage`. A key written in code as `score-audio.metronomeDisabled` is therefore stored in localStorage as `flat_user.score-audio.metronomeDisabled` [E].

---

## 0. Architecture summary

| Layer | Chunk(s) | Facts |
|---|---|---|
| Audio facade used by the editor | `Audio-Te497xXK` | Class with `play/stop/pause/resume`, `setGlobalPlaybackSpeed`, `setMetronomeMode`, `setPartVolume/Reverb`, `setPartSoloMode`, `muteInstrument`, `setLoopEnabled`, `setMasterVolume`, MIDI output, and native "takes" for Live MIDI [E] |
| Public/editor actions (the API layer) | `voiceRO-CPk2kNMp` (implementations), `scoreCursor-BxI7sTPZ` (metadata catalogue: params, min/max, default shortcuts), `catalog-DcwFX9kr` (embed API docs) | Every playback control routes through `executePublicAction("<name>")` [E] |
| Legacy JS engine ("dacapo") | `esm-B1Yv8QQt` (336 KB), `DacapoAudioEngine-CgY9447l` | Web Audio scheduler, metronome, count-in, a convolver reverb, playback-speed ratio, and an "AlternativePlayer" for synced media tracks [E] |
| New engine (web) | `createWebEngine-CuuojsN2`, `engineWorklet-DEDsiBFm`, `engineWorker-Creq_k10`, `flat_score_player_web_bg-CLXVBbnG.wasm` (2.06 MB) | `new AudioContext({latencyHint:"interactive"})`, then an `AudioWorkletNode` named **`flat-score-player`** with `outputChannelCount:[2]` that runs a compiled WASM module, plus a module Worker. The audio context resumes on `touchend`/`click`/`keydown` [E] |
| New engine (desktop, native) | `desktopAudioEngine-CoZHUQY1` + `ProtocolAudioBackend-DaCaAOF_` (renderer); `out/main/index.js` (main) | The renderer talks over IPC (`audioEngineSend` / `onAudioEngineMessage`) to a **native sidecar binary `flat-audio-engine`** spawned by the main process from `process.resourcesPath/audio/flat-audio-engine`. Log context `{context:"audio-sidecar", audioEngine:"native"}`. Messages: `samplesInvalidated`, `samplesProgress`; audio export goes through `audioExportRender` [E] |
| Page engine wrapper | `createPageAudioEngine-dFuJCzi3` | MIDI-output params, takes and count-in clicks (`takeClicks`) [E] |
| Metronome on the native engine | `NativeMetronome-CMFIaJ8R`, `metronomeInstrument-DgoA_wPy`, `clickLoop-shIAH42o` | The click is soundId `"metronome"` (a drum set). The accented click is MIDI program 60 and the normal click is 61, key 1, velocity 100. It is scheduled with `setTimeout` and drift correction [E] |
| Track (recording) players | `trackPlayers-*`, `AdagioToAudio-Ci1PY0De` | YouTube, SoundCloud, Vimeo, audio file and external tracks synced to the score [E] |

**Engine selection [I]:** `Audio.usesNativeEngine()` decides which engine runs. On desktop the native sidecar is used, and the dacapo/web engines remain for web and embeds.

---

## 1. Score player and playback

### 1.1 Transport controls (top bar `ScoreEditorTopBar-ClpGW5BC`, compact pill `ConnectedPlaybackPill-gOVBbsuY`)

| Control | English label | Action / shortcut | Source |
|---|---|---|---|
| Play/stop | "Play or stop ({{playShortcut}})<br/>Resume from where you stopped ({{resumeShortcut}})" (`editor:toolbar.playback-stop.title`). Variants: "Play or Pause", "Play or stop" | `togglePlayStopResume`. With a plays limit it falls back to pause/toggle [E] | top bar, `voiceRO` |
| Resume | "Resume playback from where it stopped" | `resumePlayback`, default shortcut **Shift+Space** [E]. Touch: "**Press and hold “Play”** to resume from where you stopped" [E] | `scoreCursor` catalogue |
| Go to start | "Go to start". Description: "Move the playhead back to the start of the score, and keep playing if playback is running" | `goToBeginning`, default **Ctrl+Space** [E] | `scoreCursor` |
| Play from beginning | "Start playback from the beginning of the score" | `playFromBegining` (sic) [E] | `scoreCursor` |
| Stop (plays-limited assignment) | "Stop — playing again will use one of your remaining plays" | `stop` [E] | top bar |
| Loop | "Loop the selection during playback ({{loopShortcut}})" / "Stop looping ({{loopShortcut}})" | `toggleLoopMode`, default **L** [E] | top bar, pill (`data-cy=playback-pill-loop`) |
| Mute all | "Mute playback" / "Unmute playback" | `mute` sets master volume to 0; unmute sets it back to 1 (100 %) [E] | `voiceRO` |
| Play note at cursor | none | `playNoteAtCursor` [E] | `voiceRO` |
| Audio options dropdown | "Audio options" (`editor:toolbar.audio-options.title`) | Contains Playback speed and Low-CPU playback [E] | top bar |

Pill test ids [E]: `playback-pill-play`, `playback-pill-stop`, `playback-pill-from-start`, `playback-pill-loop`, `playback-pill-volume`.

The state that `getAudioState` returns is `{playing, pausing, canResume, sliderPosition:{currentMeasure,nextMeasure,quarterFromMeasureStart}}` [E] (`voiceRO`).

### 1.2 Metronome and count-in

- **Modes** (enum in `esm-B1Yv8QQt`) [E]: `COUNT_IN=0`, `CONTINUOUS=1`, `DISABLED=2`, `CONTINUOUS_NO_COUNT_IN=3`. The public action `setMetronomeMode` accepts `mode ∈ {0,1,2,3}`.
- **UI labels** [E]: "Metronome Count-in" (COUNT_IN), "Metronome On" (CONTINUOUS), "Metronome Off" (DISABLED). The section title is "Metronome" and the button tooltip is "Change metronome mode". The `MetronomeSettings` component in `ConnectedPlaybackPill` shows these 3 buttons. Mode 3 has no UI button [E].
- **Cycle** (`cycleMetronomeMode`, "Cycle between metronome modes") goes COUNT_IN → CONTINUOUS → DISABLED → … [E] (`voiceRO`).
- **Default and storage** [E] (`Audio-Te497xXK`):
  - `getInitialMetronomeMode()` returns **COUNT_IN** only if `flat_user.score-audio.metronomeDisabled === false`. Otherwise it returns **DISABLED**, so the default for a new user is **Off**.
  - `setMetronomeMode` writes `metronomeDisabled = (mode === DISABLED)` per user when `saveInLocalStorage` is true (the default).
- **Count-in length** [E]: `scheduleMetronomeCountdown` repeats the countdown "sequence" `sequenceOpts.sequences || 1` times. Normal playback therefore counts in **1 bar**, using the time signature of the start bar (`getMetronomeCountdownAtScoreMeasure`). `Audio.getMetronomeCountIn()` forces `sequences = 2`, which is used for Live MIDI takes (2 bars) [I: the call site is in `MIDI-rgHwdYiM`].
- **Count-in and speed** [E]: count-in clicks are scaled by the playback speed ratio. Count-in is skipped in "slider mode" (low-CPU) unless the metronome is forced.
- **Count-in tick helper** (`countIn-CE6rl2F1`) [E]: maps a tick number to a beat or bar display number for the countdown UI.
- **Metronome solo/preview** [E]: `startMetronomePreview` / `startMetronomeSolo` play the click alone with playback stopped.
- **Native click** [E] (`NativeMetronome`): samples load from `<base>/audio/instruments` and the `<base>/soundfonts` backend.
- **Export** [E]: "Include metronome" is an option of audio export. WAV export takes a `metronome:true` flag (`WebAudioBackend-DhF7bJmI`).

### 1.3 Tempo

- **Tempo editor** [E] (`MetronomeDropdownContent-GtSdn41n`, opened from `SidebarTempoButton-CQMGQYNT`):
  - BPM input `FNumberInputWithSteppers` with **min 1, max 500, step 1**.
  - Beat unit selector: whole, half, quarter, eighth, 16th (with dots).
  - Optional tempo word list (`TempoWordList`): Grave, Largo, Lento, Adagio, Andante, Moderato, Allegretto, Allegro, Vivace, Presto, Prestissimo, plus "No text". Each word carries a BPM from `vn.getBpm`. The tempo word shows a Power badge when that account feature is absent [E].
- **Actions** [E]:
  - `setTempo` takes `bpm` 1–500, `durationType ∈ {whole, half, quarter, eighth, 16th, 32nd, 64th}`, `nbDots ∈ {0,1}` and an optional `word`.
  - `setTempoText` / `removeTempoText`.
  - The scope strings are "From the current bar", "For the selected range" and "For the whole score".
- **Storage** [E]: tempo is score content (written through an Adagio transaction), so it is shared by everyone with the score.
- **Playback of tempo marks** [E]: the strings for `a tempo`, `accelerando` and `ritardando` describe changes to playback tempo: "A tempo restores the tempo to the most recent numeric metronome marking"; accelerando and ritardando "gradually increase/decrease the tempo". *a tempo* is a Flat Power feature.

### 1.4 Playback speed ("Playback speed", `flat:play-speed.title`)

- **Component** [E]: `PlaybackSpeed` in `ConnectedPlaybackPill-gOVBbsuY`, also used in the top-bar "Audio options" and in mobile `MobilePlaybackSettings` (`App-BpSv0vpB`).
- **Range** [E]: **0.2 – 2.0**, clamped. The − / + buttons step by **0.1**, rounded to 2 decimals. Aria labels: "Decrease playback speed" / "Increase playback speed". Test ids `pSpeed-`, `pSpeed+` and `pSpeedVal`.
- **Public action** [E]: `setPlaybackSpeed {speed: 0.2..2}`; `getPlaybackSpeed`.
- **Defaults** [E]: the default is 1. `AlternativePlayer` uses `initialPlaybackSpeed ?? 1`.
- **When it can be changed** [E]: `Audio.setGlobalPlaybackSpeed` is ignored while playing or paused, so the speed is changed while playback is stopped.
- **Gating** [E]: the control requires the account feature `reverbPlayback` (or an embed). Otherwise it opens the upgrade dialog `feature:"advancedPlayback"`, with the text "The reverb, swing, and playback speed features are included in Flat Power and Flat for Education."
- **Storage** [E]: the value lives in the in-memory audio store (`playbackSpeed` in the `vue-data` audio store). No localStorage key was found [I: not persisted between sessions].
- **Synced media tracks** [E]: speed maps to `HTMLMediaElement.playbackRate`.
- **No speed trainer** [I]: no automatic tempo ramp was found.

### 1.5 Loop / practice loop

- **Action** [E]: `toggleLoopMode` (shortcut **L**). `setLoopMode {enabled}` with the description "When enabled, the current selection is captured as the playback loop region. When disabled (or enabled without a selection), the region is cleared."
- **Region** [E] (`Audio-Te497xXK.setLoopEnabled`): a range selection becomes the loop. Without a selection the loop covers the **bar at the cursor** (`loopAvailability-DSyiZYpp`). The loop is refused when the score has a plays limit (`hasPlaysLimit`).
- **Editing the region** [E]: the loop bounds can be dragged with `updateLoopRegionBound {side:"start"|"end", position}` (`resizeLoopRegion-DoBtGz-5`). An invalid range raises `InvalidLoopRangeError-3H7PxArb`.
- **Visual** [E] (`loopAvailability`): stroke `var(--f-score-loop-region, var(--f-yellow,#ff9f00))` and fill `rgba(255,159,0,0.12)`.
- **Lifetime** [E]: the loop region is dropped when the score data changes (`setData` → `LOOP_DROPPED`). It is in-memory only and not saved.
- **UI copy** [E]:
  - "Loop any passage"
  - "Select the bars you want to master, then press <kbd>L</kbd> or click the loop button in the header…"
  - "Looping is on"
  - Intro video `loop-intro-PYoEqeZR.mp4`
- **Not found** [I]: wait mode, speed trainer and step-by-step practice. Loop is the only practice feature.

### 1.6 Mixer: master, per-part volume, reverb, mute and solo

- **Where it lives** [E]:
  - The "Volume Settings" popover from the top bar (`data-cy=playback-volume-trigger`).
  - Components `VolumeMaster`, `VolumePart` and `VolumePartSettings` in `ConnectedPlaybackPill-gOVBbsuY`.
  - On the new layout it sits in the Audio panel ("Your mixer is in the Audio panel. Adjust volume and reverb for each hand or layer.").
- **Controls** [E]:

| Control | Label | Range / default | Storage |
|---|---|---|---|
| Master volume | "Master" / "Master volume"; aria "Adjust master volume" | slider 0–100, step 1. The API sends `volume/100` to the engine | in-memory engine state [I: not persisted] |
| Part volume | "Volume"; aria "Adjust volume for the part" | 0–100, step 1. The default comes from the part header `getGlobalVolume` (`partHeaderUtils-DBex8efl`). The engine default when unloaded is 1.0 | see "Who hears the mix" below |
| Part reverb | "Reverb"; aria "Adjust reverb for the part" | 0–100, step 1. API description: "The size of the reverberation room". Engine default 0 | same as part volume. **Premium**: `premiumFeature:"reverbPlayback"` |
| Mute part | aria "Switch mute for the part" | toggle | in-memory audio store `partsById[uuid].mute` |
| Solo part | aria "Switch solo for the part" | toggle | in-memory `partsById[uuid].solo` |

- **Mute/solo semantics** [E] (`Audio-Te497xXK`):
  - `setPartSoloMode` unmutes that part, then solos it. Several parts can be soloed at once (the engine flag is per instrument).
  - `muteInstrument` first clears that part's solo.
  - Keyboard actions on the cursor part: `toggleSoloCurrentPart` ("Toggle solo for the current part") and `toggleMuteCurrentPart` ("Toggle mute for the current part"). They have no default shortcut in the catalogue.
- **Who hears the mix** [E] (`voiceRO` `setPartVolume` / `setPartReverb`):
  - A user with write rights who does not pass `isLocalOnly` writes the change into the score with `SetPartGlobalVolume` / `SetPartGlobalReverberation`, so it is shared ("Saving changes applies to everyone").
  - Otherwise the change is local only and the store sets `localVolumeDiff`.
  - `persistLocalPartsAudioSettings` writes the local mix into the score. `resetLocalPartsAudioSettings` restores the score values.
  - Locale copy: "Apply these settings to everyone" / "Apply these settings to me too", "Only me" / "everyone".
  - The legacy per-user localStorage key `score-audio.volume:<scoreId>` is now **deleted** on load (`loadVolumePreferences`).
- **Reverb implementation**:
  - Legacy JS engine [E]: a `ConvolverNode` whose impulse is generated from noise, `(rand*2-1)*(1-t/len)^decay` per channel.
  - Native and WASM engines [I]: reverb is computed inside the engine.

### 1.7 Swing / playback feel

- **Actions** [E]:
  - `setSwing {swing, ratio 0–100, swingType: "eighth"|"sixteenth"}` per bar or range.
  - `addGlobalSwing {swingRatio 0–100, default 100}` ("Set swing globally").
  - `removeGlobalSwing`, `removeSwingAtSelected`.
- **Labels** [E]: "Swing", "Swing Eighths", "Swing Sixteenths", "Make it swing!"
- **Gating** [E]: premium `swingPlayback`. 16th swing has its own paywall ("Swing the semiquavers too").
- **Storage** [E]: score content, so it is shared.

### 1.8 Repeats, dynamics, articulations, chords and transposition in playback

- **Repeats** [E]:
  - Repeat barlines, "Repeat X times" (Power: "Multiple Repeats"), Da capo ("makes the playback return to the beginning of the score") and Dal segno ("makes the playback jump to the segno") are honoured.
  - No user toggle "play repeats on/off" was found [I].
- **Dynamics and articulations** [I]: they are notated and the engine renders them. MIDI output has a "Mod wheel dynamics" option (§2.6). Brass mutes have "dedicated audio samples for mutes" with HQ instruments [E].
- **Chord symbols** [I]: no chord-symbol playback setting or code path was found, so chord symbols do not sound.
- **Transposition** [I]: "Transpose" changes the notation (score content), so playback follows it. Concert-pitch (`toggleConcertPitch`) only affects display; there is no playback-only transpose.

### 1.9 Instrument sounds (soundfonts / samples)

- **Catalogue** [E] (`instruments_en.min-Ch9kMCB_`): **205 instruments**, of which 92 are `premium:true` (HQ). Groups:

| Group | Instruments | Premium |
|---|---|---|
| Woodwind | 31 | 14 |
| Brass | 18 | 8 |
| Pitched Percussion | 9 | 0 |
| Percussion (unpitched) | 47 | 12 |
| Plucked Strings | 25 | 11 |
| Keyboards | 12 | 3 |
| Free Reed | 2 | 0 |
| Electronic | 30 | 29 |
| Vocals | 18 | 10 |
| Strings | 11 | 5 |
| Special | 2 | 0 |

  Each instrument has `midichannel.default.program`, `pitchrange{min,max}` (MIDI), clefs, staves and transposition.
  Example: Piano has program 1, range 21–108, 2 staves, `free:true` and `hqUpgrade:"hq-grand-piano"` ("Grand Piano HQ").
- **Per-part sound** [E]: custom instruments separate the **Base** configuration (clef, transposition, range, staves) from the **Sound** ("To change how it sounds, use the Sound settings instead"). `setSoundInstrument({group,instrument})` lives in `EditorSidebarInstrumentsTab-DKty-W2v`.
- **Desktop sample delivery** [E] (`out/main/index.js`):
  - The CDN base is `${cdn.assetsUrl}/audio/samples-aac`. Samples are **AAC**; manifest entries are filtered to `format === "aac"`.
  - Packs use the manifest `sf/v1/releases/1.46.1.json` (or `sf/v1/looped/releases/1.46.1.json` for "fspk-looped"). Each pack entry has a sha256, a size and sets.
  - Pack files match `sf/v1/<…>/<hex>.fspk`.
  - Pack mode is chosen by feature flags: `web.playback-fspk` and `web.playback-looped`, otherwise the legacy `ftar` (main) or `json` (renderer, `soundfontPacks-Dd27hOIa`).
  - Release constant: `1.46.1`.
- **Disk cache** [E]:
  - macOS: `~/Library/Caches/Flat/soundfonts`, with `cache-state.json`, `packs/`, `<channel>-v1.46.1/` and `<channel>-manifest-1.46.1.json`.
  - Other systems: `userData/Cache/soundfonts`.
  - Settings strings: "Soundfont cache", "Instrument sounds".
- **Loading UI** [E]:
  - "Preparing instruments…"
  - "Downloading instruments: {{completed}} / {{total}}"
  - "Playback loading issue" with "Retry loading playback"
- **Engine errors** [E]:
  - "No audio output is available. Connect speakers or headphones, then press play again."
  - "Playback paused because the audio output stopped. Press play to resume."
  - "The audio engine is not responding…"

### 1.10 Low-CPU playback

- **Label** [E]: "Low-CPU playback" — "Reduce strain on your device and prevent crackling during playback." It is a toggle in the top-bar Audio options dropdown. It is hidden in embeds, the mobile editor and `env==="performance"` (`ScoreEditorTopBar`).
- **State** [E]: `lowCpuSlider`, with actions `setIsLowCpuSlider` / `getIsLowCpuSlider`. When it is on, the engine runs in "slider mode", which skips the count-in.
- **Default and storage** [E] (`scoreViewer-vPXk43QR`): default **false**. It is persisted per user in `flat_user.editor.low-cpu-playback` (only when toggled from the UI with `persist:true`, and not in the mobile editor or embeds).

### 1.11 Playback cursor and following

- **Scrolling** [E]: `scrollToCursor` ("Scroll to the cursor position") and `noScroll` flags on actions. Playback position events come from `onEnginePosition` (`Audio`).
- **Not found** [I]: a "follow playback" or "auto-scroll" user setting.

### 1.12 Other playback-related items

- **Recordings / synced tracks** [E]:
  - Labels: "Audio recordings", "Manage recordings", "Add a video or audio source from an external service", "Upload an MP3 file of your recording", "Use as default audio source", sync points ("Bar", "Timing").
  - `setTrack` types: youtube, soundcloud, vimeo, audio, external.
- **Plays limit** [E]: an assignment can limit how many times the score plays ("This assignment limits the number of times you can play the score").
- **Performer mode** [E]: `setPerformerMode {partUuid}` hides playback speed in mobile settings.
- **Playlists** [E]: "Playlists" are library collections (`collec.*`, `PlaylistMenu-Bmp5rIpt`, `ScoresLibraryPlaylists-*`). No sequential playlist playback was found [I].
- **Audio export** [E] (`WebAudioBackend-DhF7bJmI`):
  - WAV is 16-bit stereo at 44 100 Hz.
  - MP3 is encoded in the renderer with lamejs at 128 kbps by default.
  - The desktop bundle also ships `libmp3lame.dylib`.

---

## 2. Piano, keyboard and other input surfaces

### 2.1 On-screen "touch UI" (piano / fretboard / drum pads)

- **Toggle** [E]:
  - Action `switchTouchUI`; labels "Display or hide the touch keyboard" and "Piano keyboard" (toolbar `editor:toolbar.piano-keyboard.title`).
  - The default catalogue lists no shortcut.
  - **Default shown = true**, persisted per user as `flat_user.editor.piano-keyboard` (`scoreViewer-vPXk43QR`: `get("editor.piano-keyboard")`, defaulting to `true` when unset).
- **Which surface appears** [E] (`TouchKeyboard-Dp6htGHk`):
  - unpitched part → `UnpitchedKeyboard` (drum pads, grouped drum / cymbal / misc, plus the "Drum kit cheat sheet").
  - pitched part on a TAB staff → `FretboardEditor`.
  - otherwise → `PianoKeyboard`.
  - Note sources are tagged `TOUCH_UI_PIANO`, `TOUCH_UI_FRETBOARD` and `TOUCH_UI_DRUMS`.

### 2.2 PianoKeyboard details

- **Range** [E]: octaves **0–8**, 12 semitones each, so C0–B8 (108 keys). The view is a horizontal scroller with left/right nav buttons (`keyboard-nav`, aria "Keyboard navigation controls"). `hideNav` prop default false.
- **Initial scroll** [E]: centred on the selected notes. If none are selected it centres on the instrument's pitch range, otherwise on about 4.5 octaves. It re-centres when the part or staff changes.
- **Out-of-range keys** [E]: keys outside `part.metas.pitchrange` (MIDI min/max, adjusted for transposition unless concert pitch) are disabled.
- **Note entry** [E]:
  - Tapping a key not in the current chord runs `addNotePitch` with `autoEnharmonic`, `tryEnharmonic` and `cursorGoNextNote:false`.
  - Tapping a key already in the chord runs `removeSelectedNoteByPitch`.
  - Either way it then scrolls to the cursor.
  - Input is blocked when `isEditionBlocked`.
- **Key highlighting** [E]: keys for pitches of the note at the cursor show as pressed.
- **Not found** [I]: colouring of keys during playback.
- **Key labels** — `setPianoKeyboardLang {lang}` [E]. The default is `"default"`, held in memory only with no storage key found (`scoreViewer`):

| lang | C D E F G A B shown as |
|---|---|
| `default` | localized `editor:piano-keyboard.*` → English C D E F G A B |
| `solfege` | Do Re Mi Fa So La Si |
| `solfege-local` | localized `editor:piano-keyboard-solfege.*` → English Do Re Mi Fa So La Ti |
| `english` | C D E F G A B |
| `japanese` | ド レ ミ ファ ソ ラ シ |
| `german` | C D E F G A H |

  Each label is rendered as the name plus the octave number (`getKeyText`) [E].
- **Settings strings without a desktop UI** [E/I]: the English locale has "Virtual Piano", "Piano Key Naming Configuration" (Automatic / English / Germanic / International Syllabic / Japanese / Syllabic / Force syllabic), "Show all / Show only C / None" ("Show note names on every white key" / "…only on C keys" / "Do not show note names on keys"), "Force Audio" and "Always force keyboard sound". These keys are referenced **only by locale data**, not by desktop renderer code [E]. They are presumably settings of the native mobile app [I].

### 2.3 Fretboard (TAB staves)

- **Labels** [E]: "Capo: {{capo}}" and "Open String". Fret dots and octave markers are shown. Clicking a fret enters a pitch. There is an enharmonic switch.
- **Upload** [E]: the main process has an API upload `postScoreFretboard` → `/me/editor/scoreFretboard/` (`out/main/scoreFretboard-Cbnk_yzg`) [I: purpose unclear].

### 2.4 "Instrument Visualisation" (top bar)

- **Button** [E]: a top-bar button with aria "Instrument Visualisation" toggles `showInstrumentVisualisation` (default false, in-memory). It only shows when the `displayInstrumentVisualisation` prop is set (default **false**) and the staff is TAB or pitched.
- **Consumer** [I]: no consumer component was found in this build, so it looks like a staged or unreleased feature.

### 2.5 MIDI input

- **UI** [E] (`MidiSettingsPopover` / `MidiHeaderControls` in `ScoreEditorTopBar`):
  - Titles "MIDI Settings", "MIDI Input" and "MIDI Output", device selects (`midi-input-select`, `midi-output-select`).
  - Empty states "No MIDI device plugged in" and "None".
  - "Write while playing" = `toggleMidiInputNotation` ("Notate MIDI input whilst playing"), default **Shift+M**.
- **Storage** [E]: per user in `flat_user.midi.default-device` (input) and `flat_user.midi.default-output`. Both are cleared if the plan lacks `midiInput` or `midiOutput` (`MIDI-rgHwdYiM`).
- **Message handling** [E]: only Note-On (0x90, velocity > 0 = on) and Note-Off (0x80, or velocity 0) are read, on **all 16 channels**. Velocity is used only as on/off.
- **Not found** [I]: settings for channel filter, velocity curve, MIDI octave shift, or sustain pedal.
- **Live MIDI recording** [E]:
  - Action `recordLiveMIDI`, default **Shift+R**. Labels "Live MIDI", "Play to start recording — The take starts on your first note", "Start countdown / Stop countdown".
  - A metronome toggle "Play the metronome during the take" switches between CONTINUOUS and DISABLED without saving to localStorage.
  - "You've reached the 10-minute recording limit"; a warning appears at 30 s remaining.
  - Not available for unpitched parts.
  - Review and quantise strings (`midiQuantize.*`) include a tempo "Slower / Faster" control.
  - Gated by the flag `editor.new-midi` (URL override `?newMidi=true|false`, editor env, not mobile) in `useNewMidi-RShU5b0K`.

### 2.6 MIDI output and latency

- **Defaults** [E] (`AudioEngine-B-_tZhu9`): `{latencyMs:0, dynamicsOnModWheel:false, clock:false, flatSoundParts:[]}`.
- **"Output settings" panel** [E] (`ScoreEditorTopBar`):
  - "Latency" select **0 ("None"), 10, 20, 30, 50, 100, 200 ms**.
  - "MIDI clock" toggle.
  - "Mod wheel dynamics" toggle.
  - "Keep using Flat's sounds" multi-select of parts (the chosen parts stay on Flat sounds instead of MIDI out).
  - "How MIDI output works" help link.
- **Storage** [E/I]: the settings sit in the in-memory MIDI store (`SET_OUTPUT_SETTINGS`). No localStorage key was found [I].
- **Channel assignment** [E] (`partMidiChannels-Cmh1JzjY`):
  - Pitched parts get channels round-robin over 0–15, **skipping 9**.
  - Unpitched parts use **channel 9** (drums).
  - The program comes from the part's MIDI program; extended Flat programs above 128 map to GM equivalents through a lookup table.
- **Audio latency** [E/I]: there is no user setting for audio buffer or latency. The web engine uses `latencyHint:"interactive"` [E]. On desktop the native engine's buffer is internal [I].

### 2.7 Computer keyboard layout

- **Storage** [E]: `flat_user.keyboard-layout`, default `qwerty-us` (`Keyboard-ew5AK_5D`). This is used for shortcut mapping; editor shortcuts are covered by another document.

---

## 3. Playing and hiding specific parts

### 3.1 Two separate systems: display solo vs audio solo [E]

| Concept | What it does | Where / label | State and storage |
|---|---|---|---|
| **Displayed parts** (view filter) | Chooses which parts are **drawn** | Instruments sidebar row buttons. The **"Solo"** button (`editor:sidebar.instruments.solo`) shows only this part, and clicking it again shows all. The **eye** button reads "Hide the instrument" / "Show the instrument". A "toggle all" checkbox heads the list. Also the toolbar instruments list (`ToolbarGroup-_OjRzLcP`, checkboxes plus a solo per part), mobile `MobPartsList` ("{{n}} parts") and `TabletInstrumentsList` | `scoreViewer` store `displayedParts` (`{uuid:true}`), **default all parts**, in-memory only and not persisted. You cannot hide the last visible part: the toggle is disabled and `switchPartDisplay` refuses |
| **Audio solo / mute** (mixer) | Chooses which parts **sound** | Mixer `VolumePart`: "Switch solo for the part" / "Switch mute for the part". Actions `setPartSoloMode`/`unsetPartSoloMode`, `mutePart`/`unmutePart`, `toggleSoloCurrentPart`, `toggleMuteCurrentPart` | audio store `partsById[uuid].{solo,mute}`, in-memory |

- **Sidebar "Solo" is display-only** [E] (`EditorSidebarInstrumentsTab-DKty-W2v`, handler `be`): it calls `displaySinglePart` or `displayAllParts`. It does **not** call the audio solo.
- **Hidden parts still play** [I]: no code links `displayedParts` to mute or solo in `Audio-Te497xXK` or `esm`.
- **Granularity** [E/I]: audio controls work per **part** (per instrument). No per-staff or per-voice mute or solo exists [I]. A drum kit is one part.
- **Dimming of non-playing parts** [I]: none found. Hidden parts are removed from layout (`removeHiddenParts` in `createTextMetricsFromCanvas-JHsXGwQn`), not greyed out.

### 3.2 Layout effects [E]

- `ScoreDrawer-WoDoNTTa` passes the displayed part list to `config.initFromScoreData(adagioData, displayedUuids)` (or `null` when all are shown) and redraws when `displayedParts` changes.
- Range selection is limited to displayed parts (`RangeSelect-0mQvB57I`, `voiceRO` range up/down).

### 3.3 API [E]

- `setDisplayedParts {parts: [uuid | idx | name | abbreviation]}` (embed API, stable).
- `focusOnPart {partUuid, measureUuid}` fits that part to the viewport height (zoom).

### 3.4 Print and export [I]

- Not established from these chunks whether printing follows `displayedParts`.
- The PDF/print part selection belongs to the export flow, which is covered by another document.

### 3.5 Playing a selection [E/I]

- **Selection + loop** [E]: a range selection plus Loop plays only those bars. Loop covers all parts; to hear only some parts, combine it with audio solo or mute.
- **Play from cursor** [I]: play starts from the cursor or selection position. `play({measureStart})` exists and "Play from beginning" overrides it.

---

## 4. Audio engine facts and bundle contents

- **`/Applications/Flat.app/Contents/Resources/audio`** (listing only):
  - `flat-audio-engine` (Mach-O executable, 11 065 632 bytes; `du` 4.3 M)
  - `libmp3lame.dylib` (777 920 bytes)
  - `lame-3.100.txt` (26 773 bytes, licence)
  - **No samples or soundfonts are bundled.** All instrument samples download from the CDN into the soundfont cache (§1.9) [E].
- **Renderer bundle audio assets** [E]:
  - `flat_score_player_web_bg-CLXVBbnG.wasm` (2.06 MB score-player DSP for the AudioWorklet)
  - `engineWorklet-DEDsiBFm` (25.6 KB)
  - `engineWorker-Creq_k10` (50.2 KB)
  - Intro videos `live-midi-intro-*.mp4` and `loop-intro-*.mp4`
- **Web Audio and AudioWorklet** [E]:
  - AudioWorklet processor `flat-score-player` with a stereo output.
  - `navigator.audioSession.type` switches between "playback" and "play-and-record" while capturing.
  - The legacy engine uses `ConvolverNode` (reverb), `DynamicsCompressorNode`, `BiquadFilter`, `StereoPanner` and `MediaElementSource` (tracks).
- **Native sidecar protocol** [E/I]:
  - JSON lines of the form `{"id":…,"cmd":…}` over stdio [I from the `$p` regex].
  - Stderr levels are tagged `[flat-audio-engine:DEBUG|INFO|WARN|ERROR]`.
  - Logs redact `samplesPath` and `outputPath`.
  - The main process checks the engine version at spawn.
- **Latency and buffer options** [I]: none are exposed to users apart from MIDI output latency (§2.6) and Low-CPU playback (§1.10).

---

## 5. Per-user localStorage keys related to playback and piano (prefix `flat_user.`)

| Key | Meaning | Default | Writer chunk |
|---|---|---|---|
| `score-audio.metronomeDisabled` | metronome Off (true) vs Count-in (false) | unset, so Off | `Audio-Te497xXK` |
| `score-audio.volume:<scoreId>` | legacy per-score mix; **deleted** on load | — | `Audio-Te497xXK` |
| `editor.piano-keyboard` | touch keyboard shown | unset, so true | `scoreViewer-vPXk43QR` |
| `editor.low-cpu-playback` | Low-CPU playback | false | `scoreViewer-vPXk43QR` |
| `midi.default-device` | last MIDI input id | — | `MIDI-rgHwdYiM` |
| `midi.default-output` | last MIDI output id | — | `MIDI-rgHwdYiM` |
| `keyboard-layout` | computer keyboard layout | `qwerty-us` | `Keyboard-ew5AK_5D` |
| `score-view.zoom` | zoom (context only) | 1 | `scoreViewer-vPXk43QR` |

These settings are kept **in memory only** (none persisted) [I]: playback speed, master volume, loop region, part mute and solo, displayed parts, piano key-name language, MIDI output settings, and instrument visualisation.

These are **score content**, shared with everyone [E]: tempo, swing, repeats, per-part volume and reverb (when saved by an editor), and instrument and sound choice.
