# Scale Runner: MIDI, Bluetooth, latency, sound, metronome

## MIDI input (`midi/midi_service.dart`, exact)

- **Plugin:** `flutter_midi_command` (`SwiftFlutterMidiCommandPlugin`; channels `plugins.invisiblewrench.com/flutter_midi_command`, `…/rx_channel`, `…/setup_channel`, `…/bluetooth_central_state`). The `universal_ble` framework is also bundled.
- **Calls used (exact):** `getDevices`, `connectToDevice`, `startBluetoothCentral`, `waitUntilBluetoothIsInitialized`, `startScanningForBluetoothDevices`, `stopScanningForBluetoothDevices`, `onMidiDataReceived`, `onMidiSetupChanged`, `onBluetoothStateChanged`, `BluetoothState`.
- **Service members (exact):** `_handlePacket`, `parseMidiBytes`, `MidiNoteEvent`, `onNoteOn`, `_handleSetupChanged`, `_rememberDevice`, `_restoreLastDevice`, `_tryAutoReconnect`, `isBleConnected`.
- **Persistence (exact):** last device in `midi_last_device_id`, `midi_last_device_name` and `midi_last_device_type`, with auto-reconnect on launch. Errors: "MIDI reconnect attempt failed: ", "MIDI restore unavailable: ".
- **Native Bluetooth MIDI pairing (exact):** the Dart method channel `scale_runner/ble_midi` calls method `showBluetoothPairing`. The Swift `MainFlutterWindow` handles it and opens Apple's `CABTLEMIDIWindowController` (CoreAudioKit), seen in the main executable's Swift metadata. UI: "Pair Bluetooth MIDI", "Bluetooth pairing failed: ", "Bluetooth error: ".
- **Device list UI (exact):** "MIDI Devices", "MIDI and Bluetooth", "Rescan devices", "No MIDI devices found. Connect a USB keyboard or pair over Bluetooth, then rescan."
- **Note handling (exact):** `NoteLatch`, `LatchingInput`, `latchedNotes`, `_dropLatched`, `_onLatchExpired`. Physical MIDI holds notes while they are held; on-screen taps latch for **2 s** (exact copy). Velocity is not used for scoring (inferred: no velocity strings in app code).

## Latency (`midi/ble_latency.dart`, `latency_calibration_screen.dart`)

- **exact:** Per-device latency key `latency_<device>` (`_latencyKeyFor`), `setInputLatencyMs` and `resolveInputLatencyMs`. Each timed screen calls `_refreshLatency` on start.
- **inferred:** `ble_latency.dart` supplies a default offset for Bluetooth connections when no calibration exists. The value is not recovered.
- **Calibration flow (exact copy):**
  1. "Calibrate Timing". The metronome clicks; "Play any key on your keyboard in time with the metronome."
  2. "Keep tapping...", "Calibrating: <n>". After 8 taps: "Your 8 taps ranged <a>–<b> ms".
  3. If the spread is large: " That spread is wide enough that one fixed correction can only get you close — retry somewhere quieter, or with wired audio."
  4. "Calibration complete! Timing offsets for your device will be applied to scoring automatically." The result is shown as "Timing Offset".
- **inferred:** the offset is the mean (or median) of 8 tap-to-click deltas, and the spread is max minus min.

## Sound

- **Note samples:** `assets/audio/note_40.wav` … `note_95.wav`, **56 files**, MIDI 40–95 (E2–B6), mono, 22 050 Hz, 16-bit, about 1.1 s each, no RIFF INFO or licence chunk (exact, `afinfo` plus a chunk scan).
- **Metronome clicks:** `click.wav` (0.05 s) and `click_accent.wav` (0.06 s), mono 44.1 kHz 16-bit (exact).
- **Playback:** `audioplayers` (`AudioPlayer`, `PlayerMode.lowLatency`, `ReleaseMode`, `AudioCache`) in `audio/note_player.dart` (`NotePlayer`), exact.
- **Settings:** "Note sound": "Play a piano tone when you press a key (turn off if your keyboard has its own sound)" (`note_sound`). "Arpeggiated Notes" (`arpeggiated_notes`). Exact strings; inferred meaning: whether prompt or demo chords play rolled.

## Metronome (`widgets/metronome_bar.dart`, `runner/meter.dart`, exact)

- **Members:** `MetronomeController`, `_MetronomeBarState` (`_onTimer`, `_scheduleNext`, `_tickNow`, `_applyPendingMeter`, getters `_periodMs`, `_elapsedMs`, `beatPeriodMs`, `markDownbeat`).
- **Meters:** `fourFour`, `threeFour`, `sixEight`. "Each click is an eighth note" and "One note per click, eight notes per bar." are the 6/8 and running-subdivision copy (inferred). "No accent". "Meter (locked while running)".
- **Options:** BPM (`metronome_bpm`), tick haptic (`tick_haptic`). The beat-indicator flash colours BPM by timing.
- **Free Play / Monitor copy:** "The metronome is a plain click here: no scoring, no session."
- **Not recovered:** the BPM range and the default.

## Wake lock

- **exact:** `wakelock_plus` is bundled. **inferred:** it keeps the screen awake during runs.
