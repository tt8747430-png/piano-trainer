# Settings architecture: where each setting belongs (Dorico's model, applied to Piano Trainer)

**Evidence:**
- **Dorico:** `preferences.xml` (371 preferences in 16 sections); option scopes from decoded projects; Preferences pages from the binary.
- **Piano Trainer:**
  - `src/entities/settings/model/registry.ts`: `SETTINGS_PAGES` (17), `SETTING_HOMES` (~100 keys), `NOT_PREFERENCES` (12).
  - `src/widgets/settings-screen/model/sections.ts`: 4 groups, 9 pages.
  - `src/app/composition-root.ts`: `SYNCED_SAVES` (12 stores).
  - The routes in `src/app/router.tsx`.

---

## 1. The scopes a setting can have

The scope decides **who owns the setting, where it's stored, whether it syncs, and which screen edits it.** Dorico separates seven scopes:

| # | Scope | Belongs to | Syncs between devices? | Dorico's home [D] | Typical contents |
|---|---|---|---|---|---|
| S1 | **Device** | this browser or machine | **no** | Preferences: `playbackPreferences`, plus audio/MIDI device and path keys in `generalPreferences` | MIDI devices, MIDI latency, audio output, buffer size, plug-in paths, project folder, window geometry |
| S2 | **Account and identity** | the person | yes (server is authoritative) | Preferences › General › Steinberg ID ("Manage Steinberg ID..."); sign-in on the Hub | name, email, sign-in methods, password, delete account, subscription |
| S3 | **Person's preferences** | the person | yes | Preferences: `generalPreferences` (language, units, middle C), `viewPreferences`, `coloursPreferences`, `writePreferences`, `accessibilityPreferences`, `commentsPanelPreferences` | language, theme, note naming, auditioning, default view and zoom, colours, input habits, comment author name |
| S4 | **Defaults for new documents** | the person | yes | Preferences (default paper size, bars in new projects, default playback template); "Save as default" in option dialogs | the starting values a new song gets |
| S5 | **Document (song) settings** | the document | with the document | Engraving / Notation (per flow) / Layout (per layout) Options, Project Info | layout, staff size, house rules, title and credits, instruments |
| S6 | **Per-item overrides** | one object in the document | with the document | Properties panel (local or global) | stem direction, placement, hide, spacing nudge |
| S7 | **View state** (not a setting) | the screen as left | optional | `viewPreferences` and window ini files, outside the options | panel folded, last tab, zoom, scroll, last mode |

**Dorico's rules:**
- A value has exactly **one scope**.
- **S1 never syncs.** Dorico keeps it in the machine's preferences file.
- **S5 and S6 travel with the document.**
- **S7 is never shown as a setting.**

---

## 2. Dorico's preference sections and the scope of each

| Section (`preferences.xml`) | Count | Scope | Examples |
|---|---|---|---|
| `playbackPreferences` | 38 | S1 device (+ S3 auditioning) | audioDevice, sampleRate, disabledInputDevices, midiInputLatencyCompensationMs, enableMIDIThru, stepTimeChordDeadTimeMs, auditionNotesWhileEditing |
| `generalPreferences` | 54 | S3 (+ S1 paths) | applicationTheme, applicationLanguage, preferredMeasurementUnit, middleCConventionInUI, defaultPaperSizeType, enableAutoSave / autoSaveInterval, numBackupsPerProject, defaultNumberOfBarsInNewProjects (S4) |
| `viewPreferences` | 15 | S3 / S7 | defaultZoomLevel 200, defaultWindowMode, overscrollAmount, closeSidePanelsWhenLowerPanelOpened |
| `coloursPreferences` | 34 | S3 | part page background `#fef2da`, voice colours ×8, selection, caret, playhead, out-of-range colours |
| `writePreferences` | 33 | S3 | pitchBeforeDuration, mouseInputEnabled, setLocalPropertiesGlobally, percussion input |
| `printPreferences` | 3 | S3 | defaultResolution 1200 |
| `xmlImportPreferences` / `midiImportPreferences` / `tempoTrackImportPreferences` | 26 / 30 / 6 | S3 | import behaviour |
| `exportPreferences` | 19 | S3 | file-name tokens `$n - $l - $t - $p`, graphic format and resolution |
| `accessibilityPreferences` | 7 | S3 | pitch, duration, position and harmonic verbosity for screen readers |
| `commentsPanelPreferences`, `statusBarPreferences` | 6 / 8 | S3 / S7 | what the status bar shows |
| `prooferPreferences` / `prooferResultTypePreferences` | 70 / 20 | S3 | proofreading rules |
| `remotePreferences` | 2 | S1 | remote-control port |

**Dorico's Preferences dialog pages** (helpconnections):
- General, with the Comments section
- Files, with Autosave
- Key Commands, including MIDI Learn and MusicXML import/export
- Note Input, with Properties scope
- Play: MIDI Recording, Playback Template, Quantization, Transport Display

---

## 3. Piano Trainer's settings by scope: fits, misplaced, missing

### 3.1 What you have, with its scope
| Your key(s) (`SETTING_HOMES`) | Home page | Correct scope | Synced today? (`SYNCED_SAVES` has `settings`) | Verdict |
|---|---|---|---|---|
| `theme`, `locale` | general | S3 | yes | ✅ |
| `midi.input`, `midi.sound`, `midi.throughPiano`, `midi.octaveShift`, `midi.touch`, `midi.pedal` | connect-piano | S1 (input and sound are this device's hardware); touch, pedal and octave belong to that keyboard | **yes** | ⚠️ **should not sync.** A phone inherits the laptop's keyboard setup. |
| `midi.device` | connect-piano | S1 | **yes** | ❌ a device name from another machine |
| `midi.latency` | connect-piano (Calibrate timing) | S1, measured for one keyboard, connection and machine | **yes** | ❌ **wrong scope.** A Bluetooth latency measured on a laptop gets applied to a phone over USB. Dorico keeps `midiInputLatencyCompensationMs` per machine. |
| `keyboard.keySize`, `keyboard.dock`, `editing.paletteSide` | on-screen-piano / score-editor | S1 or S7 (screen size and handedness at that device) | **yes** | ⚠️ a phone's key size isn't a laptop's |
| `keyboard.*` (named keys, marks, chord names, typing, autoplay, pedals, volume) | on-screen-piano | S3 | yes | ✅ (`keyboard.volume` is arguably S1) |
| `editing.hearNotes` | score-editor | S3 (Dorico: auditionNotesWhileEditing) | yes | ✅ |
| `recorder.click`, `recorder.tune`, `recorder.countIn` | score-editor | S3 (Dorico: click and count-in are S5 per project; recording input is S1) | yes | ✅ (a reasonable simplification) |
| `practice.*`, `scoreView.*`, `sound.*`, `otherHand.look`, `playback.*` | player | S3, defaults for every song in the Player | yes | ✅ |
| `metronome.*`, `tuner.a4`, `scales.*`, `intervals.*`, `progressions.*`, `chordPlayer.*`, `chords.*`, `chordFinder.*`, `trainer.autoNext`, `lessonReading` | each tool's page | S3 | yes | ✅ (matches "each screen's settings are its gear's") |
| `bars.select.*`, `bars.swipe.*` | select-toolbar / swipe-actions | S3 | yes | ✅ |
| Song layout (page size, margins, staff size, spacing, bars per system, bar numbers, hide empty, font) | the song's editor gear › Layout (`piece-layout.ts`) | S5 | with the piece | ✅ |
| Title and credits, instruments | on the score / editor gear | S5 | with the piece | ✅ |
| `NOT_PREFERENCES`: sidebar, paletteFolded, paletteCategory, editorMode, foldedSections, keysWindow, keyboard.folded… | (none) | S7 | yes, inside `settings` | ✅ kept out of the UI as Dorico does. Syncing panel-fold state across devices is debatable (Dorico doesn't). |

### 3.2 Missing settings (with where they'd belong)
| Missing | Scope | Home | Source of the requirement |
|---|---|---|---|
| **Practice reminders: on/off, time, days** | S2/S3 | Profile › Notifications | **PRODUCT.md principle 6:** "the learner can turn its reminders off". No reminder setting exists (grep `remind` finds only content). |
| **Daily practice goal** (minutes or tasks a day, which the streak counts) | S3 | Profile › Streak | Streak is the Profile's first figure (PRODUCT.md). There's no goal key; badge tiers have fixed goals (`progress/model/badges.ts`). |
| **Note naming** (letters C D E / solfège Do Re Mi; middle C = C3/C4/C5) | S3 | General | Dorico `middleCConventionInUI`; an English + Russian audience (Russian schools use solfège names) |
| MIDI chord window, MIDI thru default, controller filter | S1 | MIDI devices | see `PIANO_TRAINER_VS_DORICO.md` §2 |
| Defaults for new songs (staff size, page size, bars, instruments) | S4 | Score editor gear › "Use as default" | Dorico: defaultNumberOfBarsInNewProjects, defaultPaperSizeType, "Save as Default" in options |
| Export naming and format (PDF / PNG / MIDI / MusicXML file names) | S3 | Songs settings or General | Dorico `exportPreferences` |
| Accessibility verbosity for the caret line (pitch, duration, bar) | S3 | General › Accessibility | Dorico `accessibilityPreferences`; you have `CaretLine` (ADR 0114) |
| Autosave and backups | S1 | Storage | Dorico enableAutoSave, numBackupsPerProject; you have the Storage page (check backup count) |

---

## 4. Profile and account: what belongs where
Your app today:
- **Profile routes:** `/profile` (streak, badges, achievements, history, notifications).
- **Account:** under Settings: `/settings/account` (profile, password), `/settings/privacy`, plus sign in, create and forgot password.

**Rule:** the **Profile shows the person and their progress** (read-mostly). **Account and privacy are settings** (S2), reached from both the Profile and Settings as **one** home with a link elsewhere (your "one home" rule).

| Belongs in **Profile** (the person, progress) | Belongs in **Settings › Account** (S2) | Belongs in **Settings › Privacy and data** |
|---|---|---|
| picture, display name (edited here, stored S2) | email, sign-in methods (email / Google / Apple), password | export my data (backup), import |
| streak, today's status, daily goal ⬅ missing | sessions and devices signed in | delete account (30-day grace period: PRODUCT.md) |
| practice reminders ⬅ missing (Notifications) | sign out | analytics / diagnostics consent (Dorico: shareUsageAndDiagnostics, crash reports) |
| badges, achievements, history, weekly chart | | public profile visibility (Explore publishes under a name) |
| groups the learner belongs to (shortcut to Songs › Groups) | | |

Dorico's equivalent is minimal, since it's a professional tool: Steinberg ID management links out from Preferences › General, and sign-in lives on the Hub. A learning app needs the Profile above.

---

## 5. Proposed tree (only additions and moves marked)
```
Settings
├─ General ............ Theme · Language · Note names (letters/solfège) ⬅ new · Middle C (C3/C4/C5) ⬅ new · Accessibility ⬅ new
├─ Storage and backup . (as today) · Backups kept ⬅ check
├─ Piano
│  ├─ On-screen piano . (as today; key size and dock become device-only ⬅ move to S1)
│  └─ MIDI devices .... (as today, but the whole page device-only ⬅ S1: not synced)
│     · Chord window (ms) ⬅ new · Filter controllers ⬅ new · Timing/Log (as today)
├─ Library ............ Selection toolbar · Swipe actions
├─ Account ⬅ one home (now under /settings/account): email, sign-in, password, sessions, sign out
├─ Privacy and data ... export, delete account, diagnostics
└─ Support ............ How to use · Report a problem · About

Profile
├─ Streak ............. Daily goal ⬅ new · Reminders: on/off, time, days ⬅ new (PRODUCT.md promise)
├─ Badges · Achievements · History
└─ Notifications ...... list + link to Reminders

Per-screen gears (S3), as today: Player, Score editor (+ "Use as default for new songs" ⬅ new, S4), Metronome, Tuner, Scales, …
Song (S5): layout, instruments, title/credits: with the song, as today
```

**Implementation note:** split the `settings` saved store into a **synced** store (S3/S4) and a **device** store (S1/S7) that isn't in `SYNCED_SAVES`. Your CLAUDE.md allows changing a store's shape by bumping its version with no migration ("Saved stores read one version… a shape change bumps the version with no migration").
