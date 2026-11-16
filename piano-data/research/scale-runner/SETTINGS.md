# Scale Runner: settings

The full key list with types and setter names is in `data/settings_keys.json`. All keys there are **exact** strings from the snapshot. Types are **inferred** from setter names.

**Defaults are not recoverable:** they are code constants. The app's sandbox preferences could not be read (macOS returned "Operation not permitted"), and this was not pursued further, by the owner's rule.

## Settings screen (`_SettingsScreenState`, lib @868335159)

The tile builders below are exact member names. Their order on screen is inferred from the order of the `_section` calls, which is not recoverable, so the list follows a logical order.

| Section (inferred) | Tile builder (exact) | Label / subtitle (exact strings) |
|---|---|---|
| Instrument | `_instrumentTile`, `_setInstrument` | Piano / Guitar (`Instrument` enum) |
| | `_toggleNoteSound` | "Note sound": "Play a piano tone when you press a key (turn off if your keyboard has its own sound)" |
| | `_toggleArpeggiated` | "Arpeggiated Notes" |
| Guitar | `_toggleLeftHanded` | "Mirror the fretboard for a left-handed grip" |
| | `_setFretLabels` | "Fret numbers" ("Number the first fret shown and the position markers beside it"), "String names" ("Label each string above the board — E A D G B E"), "Note names on dots only" ("Off names all 30 cells, which can crowd the shape you are meant to see") |
| | `_twinModeTile`, `_setTwinMode` | "Primary only", "Primary + ghost", "All positions" ("A note often lives in more than one place on the neck. How much of that to show alongside the one the drill means.") |
| Timing | (in mode sheets) `TimingDifficultySelector` | "Easy" / "Normal" / "Strict": "How tight the timing windows are, in every mode: on-beat within Xms, close within Yms" |
| MIDI | links to MIDI monitor | "MIDI and Bluetooth", "Calibrate Timing" |
| Reminders | `_toggleReminders`, `_reminderTimeTile`, `_pickReminderTime` | "Practice reminders", "Reminder time" (Material time picker) |
| Account | `_accountTiles`, `_syncStatus` | "Sign in to back up and sync", "Sync now", "Last synced …", "Sign out" |
| Pro | `_unlockProTile`, `_unlockPro`, `_restoreTile`, `_restore` | "Unlock Pro", "Restore purchases" |
| Promo | `_grooveOfferTile` | "Groove Runner: 2 months free" |
| About | `_privacyTile`, `_openPrivacyPolicy` (`_PrivacyPolicyScreen`), `_versionTile` | "Privacy Policy", version from `package_info_plus` |

## Per-mode settings sheets (exact strings)

- **Scales/Chords quiz** (`QuizSettingsSheet`):
  - Practice and Challenge tabs
  - scale groups with select-all (`_setAll`, `_setAllKeys`)
  - key chips
  - toggles: dots hint, formula hint, stats bar, beat indicator
  - "Reset stats?"
- **Scale Running** (`ScaleRunSettingsSheet`):
  - progression
  - chords on/off
  - 7ths
  - key increment
  - reps per key
  - count-in between keys
  - starting key (`_keyChip`)
  - dots
  - reset ("Set score and best streak back to zero" / per-key reset)
- **Inversion Running** (`InversionRunSettingsSheet`): chord list (`_chordTile`), tempo mode, dots, formula.
- **Jam Mode** (`JamModeSettingsSheet`):
  - `_keyChips`
  - `_modeChips` (Prompted/Freestyle)
  - `_familyTile` ("Chord families")
  - `_pickAnyTones`
  - `_sessionChips` ("Session length")
  - `_countInChips` ("Count-in display")
  - `_resetTile`
- **Voicing drill** (`VoicingRunSettingsSheet`): increment ("Its voicing moves"), starting key, dots, formula ("Show the shape's spelling (e.g. 7-3-5-1) under the key name.").

## Sync of settings

- **exact:** `sync/synced_settings.dart` (`_SyncedPrefs`, `_merge`, `_touch`, `_write`). Settings sync to the Supabase table `user_settings` when signed in.
- **exact copy:** "Your voicings, practice settings, stats and streak follow your account to every device".
