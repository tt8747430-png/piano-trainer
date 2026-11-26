# Flat 26.11.0 desktop: settings, tools and flows reference

Source: the extracted ASAR of Flat Desktop 26.11.0 (Electron + Vue, Tutteo). I only read files statically. Minified chunks were prettified with prettier, and locale objects were parsed with acorn into a scratch folder. Nothing from the app was executed.

**Evidence markers**
- **[E]**: exact. The string, value or structure appears literally in the chunk named.
- **[I]**: inferred. It follows from names, call sites or the product's general behaviour, but the code doesn't spell it out.

Chunk paths are relative to `app/out/`. Renderer chunks live in `renderer/assets/`.

**Locale sources**
- en-US strings are bundled inside `vue-data-D9mDxW5Z.js`. They come in three forms:
  - an `editor` namespace object literal;
  - a `flat` namespace object literal;
  - five `JSON.parse` blobs: `flat.score`, `flat.account`, `flat.onboarding`, `flat.bugReport` and `flat.upgrade`.
- en-GB copies are `flat-CZTB7TE2.js` and `editor-DQKBG5ZR.js`. They use spellings like "Stave" and "Quantised".
- Desktop-shell strings (en) are in `desktop-DIs4v9Ek.js`.

The labels below are en-US unless marked otherwise.

---

## 1. Settings structure

Flat stores settings at four levels:

| Scope | Where it lives | Evidence |
|---|---|---|
| **App/device** | `userData/settings.json`. Main process class `Wh` (in `main/index.js`) holds the defaults object `ut` and supports `_customized` keys. It is read and written over IPC `settings:get`, `settings:set` and `settings:reset`. | [E] `main/index.js` |
| **User account (synced)** | `account.editorPreferences.*` (page size, margins, length unit and similar) and `aiPreferences.blockedFeatures`. Also the REST endpoints `/me/editor/shortcuts`, `/me/editor/scoreLayouts` and `/fonts`. The desktop keeps local SQLite tables `custom_instruments` and `score_layouts` and pushes them through `sync:user-data:outbound:{instrument,layout}`. | [E] `PageLayout-Bx9W9QXr.js`, `main/editorShortcuts-MHhJjtlC.js`, `main/scoreLayouts-CaxxAW4N.js`, `main/fonts-10p4MmH1.js`, `main/index.js` (class `Wv`, SQL `CREATE TABLE`) |
| **Score (document)** | Layout and style values are written into the score data by editor actions (`action.SetPageSize`, `SetTopMargin`, `SetDistanceBetweenStaves`, …) and saved with the score revision. | [E] `layout-By-no17H.js` builds this action list from a layout. [I] They persist in the score file (Adagio JSON / revisions). |
| **Editor/local UI** | Editor-local storage namespace `flat_editor`, a Pinia `gestureSettings` store, the per-user mixer ("Only me" or "everyone"), and the keyboard layout choice. | [E] `EditorStorage-CaUt6u-0.js`, `gestureSettings-D3PnSMqU.js`. [I] exact persistence keys |

Other local SQLite tables [E] in `main/index.js`: `scores`, `collections`, `score_revisions`, `score_collections`, `sync_queue`, `sync_metadata`, `kv_store`, `local_groups`, `ack_groups`.

### 1.1 App Preferences window (`renderer/settings/index.html` → `settings-BJQIOwPl.js`; strings in `desktop-DIs4v9Ek.js` under `settings.*`)

The navigation order is General, Sync & Storage, Account, About [E]. The table's Key column gives the key in `settings.json` for real preferences; the other rows are actions or status.

| Setting | Label (EN) | Default / values | Scope | Key / source |
|---|---|---|---|---|
| Language | "Language" (placeholder "System") | `null` means follow the system. Values are the app locales. Changing it reloads every window and syncs the locale to the account when signed in [E]. | app + account sync | `general.locale` [E] |
| Theme | "Theme" | `system` (default) / `light` / `dark`. Sets `nativeTheme.themeSource`. | app | `general.theme` [E] |
| Sync | "Sync status", "Last sync: …", "Never synced", Online/Offline, "Sync now" | action (`sync:triggerNow`) | account | [E] |
| Sync overview | "Available offline" ("{{cached}} of {{total}} scores"), "Pending upload (n)", "All scores are synced" | status | device | [E] |
| Offline storage | "Keep available offline": **All** ("Download all scores and instruments for offline use") / **On demand** ("Only download when you open a score") | default `all` | app/device | `storage.offlineMode` [E] |
| Default save location | (no visible label) | `null` | app | `storage.defaultSaveLocation` [E] |
| Instrument sounds cache | "Instrument sounds" ("{{cached}} of {{total}} instruments"), "Cache", "Clear cache", "{{size}} used" | action. Soundfont cache cap is 2 GiB (`Xu=2*1024**3`). | device | [E] `main/index.js` |
| Data location | "Data location" (opens the userData folder) | - | device | [E] |
| Account: Profile / Subscription | "Profile", "Subscription", "Manage plan", "Sign in", "Sign out", "Buy AI credits", "Delete account" | - | account | [E] |
| Account web links | Profile settings → `/settings/account/profile`; Password → `/password`; Notifications → `/notifications`; Billing → `/billing` (hidden for Mac App Store and Edu builds); Instruments → `/instruments`; Integrations → `/settings/account`; AI features → `/features` | all open in the browser | account | [E] |
| About | Version, Build, Electron, Platform, "Copy support info", "Help Center", "Open Source Licenses" | - | - | [E] |

Validation [E]: invalid values reset to the default, with `theme ∈ {system, light, dark}` and `offlineMode ∈ {all, onDemand}`. A legacy `audio` key is stripped on load.

### 1.2 In-editor "Editor Settings" (strings `editor.editorSettings.*`; mostly mobile/tablet) [E, `vue-data`]

| Setting | Label | Values |
|---|---|---|
| Key name display (virtual piano) | "Key Name Display" | None / Show all / Show only C |
| Key naming convention | "Key Naming Convention" | Automatic, English C-D-E…, Germanic C-D-E-F-G-A-H, Japanese, Syllabic Do-Re-Mi-Fa-Sol-La-Si, Locale Syllabic (…Ti) |
| Editor interface | "Use the new editor" | toggle (new or legacy editor) |
| Low-CPU playback | "Use low-CPU playback" | toggle |
| Force audio | "Always force keyboard sound" | Never / Only when playing the score |
| Track/Page layout | "Always open scores in track view" / "… in page view" | choice |
| Gestures (touch) | Pinia `gestureSettings` defaults: doubleTapUndo ✓, tripleTapRedo ✓, twoFingerSwipeDownFit ✓, verticalDragPitch ✓, horizontalDragRhythm ✓, partNameDoubleTap ✓, addNoteOnDrag ✗ | [E] `gestureSettings-D3PnSMqU.js` |
| Keyboard layout (for shortcuts) | "Keyboard layout" | QWERTY US/UK/ES/PT/BR, AZERTY FR/BE, QWERTZ DE/CH, Dvorak, Colemak. Auto-detected from the key map. [E] `layouts-DgaJjkM9.js` |

### 1.3 Score / document layout ("Layout and styles"): **per score**, with reusable **templates per user**

The UI is the editor sidebar tab **Layout**, whose sections are Templates, Pages, Staves, Hide non-playing instruments, Measures, Measure numbers, Note heads, Music font, Chord styles, Text styles, and "Open legacy settings" [E] (`editor.sidebar.layout.*`). The legacy dialog is "Document settings" / "Editor preferences" (`flat.docsettings.*`, `flat.account.editor-preferences.*`). Layout customization is a **Flat Power** feature [E] (`flat.freemium.upgrade-custom-layout-feature`).

| Setting | Label (EN) | Default / values | Scope | Source |
|---|---|---|---|---|
| Page size | "Page size", "Custom page size (W x H, unit)" | Presets: US Letter 215.9×279.4, Tabloid 279.4×431.8, US Legal 215.9×355.6, A2 420×594, A3 297×420, A4 210×297, A5 148×210, B5 176×250 mm, plus custom. Default **A4**, or **US Letter** when `account.country==="us"`. | score (default from user prefs) | [E] `PageLayout-Bx9W9QXr.js` |
| Orientation | "Orientation": Portrait / Landscape | portrait | score | [E] |
| Margins | "Margins" top/bottom/left/right, applied to odd and even pages (`TYPE_BOTH`) | **17.2 mm** default | score | [E] `PageLayout` (`o=17.2`), `layout-By-no17H.js` |
| Length unit | "Length unit" | cm, or inch when country is US. `editorPreferences.lengthUnit` | user | [E] |
| Page numbering | "Page numbers", "Start page numbering at" | `pageNumberingStart` (null = default) | score | [E] `catalog` setLayout |
| Staff size | "Staff size" / "Rastral size {{number}}" | number in mm or inch; the catalog example is 6 | score | [E] |
| Space between staves | "Minimum space between staves" (between two staves of a part) | number | score | [E] |
| Space between systems | "Minimum space between systems" | number | score | [E] |
| Spacing between instruments | "Spacing between instruments" | number | score | [E] label; [I] maps to a distance |
| Measures per system | "Max. number of measures per line" | `maxMeasuresPerSystem` | score | [E] |
| Note spacing | "Note spacing" | `notesSpacingCoeff`, a coefficient on the minimum measure width | score | [E] |
| Measure numbers | "Print measure numbers at": Every measure / Each system / Never; "Start numbering at" | `measureNumbering ∈ every, first-of-system, none`; `measureNumberingStart` | score | [E] |
| Anacrusis | "Number measures after the anacrusis" | `hasPickupShift` bool | score | [E] |
| Hide non-playing instruments | Never / After the first system / Always | `hideEmptyParts ∈ never, after-first-system, all-systems` | score | [E] |
| Note heads | Color: Default, Boomwhackers, Custom per pitch, "Disable any color modes". Shape: Shape-note (Aiken), Note names, Solfege (Ti), Solfege (Si), Japanese Solfege. Do type: Movable / Fixed Do | `setNoteDisplay` {colors.mode normal/boomwhacker/custom, solfegeTi, solfegeSi, solfegeJapanese, noteShapes, pitchNames, movableDo, jazzChordSymbols} | score | [E] |
| Music font | "Music font" | Bravura, Petaluma (Jazz/Handwritten), Leipzig, Sebastian, Leland, Gootville, Finale Maestro, Broadway, Ash, Engraver, Jazz, Legacy, Eugene, Eugene Strong | score | [E] |
| Chord style | "Use symbols for jazz chords"; minor Text (m) or Symbol (-); major Text (maj), Text (M) or Symbol (triangle); diminished Text (dim) or Symbol (circle) | `jazzChordDisplay` | score | [E] |
| Text styles | Default font plus per-type overrides: Lyrics, Title, Subtitle, License text, Composer, Lyricist, Arranger, Chords, Rehearsals, Annotations, Part names, Measure numbers, Page numbers, Pizzicato, Tempo marks, Fret numbers. Each has Bold, Italic and size in pt or staff space. System fonts come from `fonts:getSystemFontData`. | - | score | [E] |
| Credits | "Edit Score Credits (Title, Composer...)": title, subtitle, composer, lyricist, arranger, rights | `setAllCredits` | score | [E] |
| Layout templates | "Save template", "Set as default", Flat Normal / Flat Jazz / "Former Default Layout", MY LAYOUTS / FLAT LAYOUTS | stored per user via `/me/editor/scoreLayouts`. A default template applies to new scores ("layout-template-picker": None / Default) | user | [E] |
| View mode | Page / Horizontal (track) / Vertical-Flexible (responsive) | per view, not saved in the score | editor | [E] `flat.sv.layout*`, export layout input |
| Instrument sorting | Orchestra (Default), Concert band, Jazz big band, Choir, Chamber, British brass band, Custom | `setPartsSorting`. Auto-sorting is Power only. | score | [E] `editor.sidebar.instruments.sorting.*` |
| Instrument settings | name, abbreviation, quarter tones, tuning (strings, capo), recorder fingering (Baroque/German, Soprano/Alto), Kodály, transposition, staves and clefs, sound | `setPart` | score; custom instruments are per user | [E] catalog, `custom-instru.*` |

### 1.4 User / account / subscription / education

- **Account pages are web-only.** Desktop opens flat.io `/settings/account/*` for profile, password, notifications, billing, instruments, integrations, AI features and delete [E] (`settings-BJQIOwPl.js`).
- **AI preferences.** `user.aiPreferences.blockedFeatures` includes `scoreAssistant` and `importOmr`. Blocking `importOmr` turns off the PDF/photo import dialog [E].
- **Subscription (Flat Power).** Monthly and Yearly plans ("Best for everyday composers"), a free trial, and restore purchases on the Mac App Store. Power unlocks:
  - Cloud Library sync, PDF/photo import credits;
  - export to MusicXML, MIDI and branding-free PDF/PNG/SVG;
  - layout control, 180+ HQ instruments, custom shortcuts, full history, trash recovery up to 1 year (free: 24 h);
  - auto instrument sorting, Live MIDI save [E] (`desktop:upgrade.*`, `flat:trash-limit`, `midiQuantize.upgradeToSave`).
- **Score quota.** Free accounts have a limited score count: "You have used {{current}}/{{total}} scores"; desktop shows "Score limit reached" [E].
- **Education.** The Flat for Education product gate is `window.flatSettings.product==="flatEdu"`. The welcome gate reads "Log in with Flat for Education". A consumer account is rejected; an account without a license gets "Your school's license is needed". The editor sidebar gains Assignment, Submission and Insights panels; collaborators come from school Students/Teachers lists [E].

---

## 2. MIDI, playback and audio

### 2.1 MIDI input/output settings (toolbar "MIDI Settings" → `flat.midi.*`) [E]
- **Inputs:** "MIDI Input", "Active inputs", device list with "None"; toast "MIDI device X is now enabled" or "MIDI input is now disabled". When nothing is plugged in: "No MIDI device plugged in".
- **Outputs (Power):** "MIDI Output", plus Output settings:
  - **Latency** (ms);
  - **Keep on Flat's sounds** (per-instrument count);
  - **Mod wheel dynamics**;
  - **MIDI clock**.
- **Step input:** a MIDI note enters the pitch at the cursor (mobile copy: "step-by-step mode"). [E] copy; [I] mechanics.
- **"Write while playing"** (`flat.midi.write-enable`) and the action `toggleMidiInputNotation` ("Notate MIDI input while playing", **Shift+M**) give real-time notation during playback [E]. Related strings: "Start playing in" (countdown) and "Recording...".
- **Web setup wizard** (`flat.midi-setup.*`): browser compatibility → allow access → plug in the device → device detected → "You are all set" [E].

### 2.2 Live MIDI recording (new, 2026) → MidiReviewPanel [E]

Live MIDI is opened with "Record Live MIDI" (**Shift+R**) or the toolbar button "Live MIDI". There is also a `live-midi-intro` video. Strings are in `editor.liveMidi.*` and `editor.midiQuantize.*`; code is in `MidiReviewPanel-BGMH7fXz.js`.

1. **Arm panel**
   - "MIDI device:" select. States: "Choose your MIDI device" / "Waiting for your instrument…".
   - Metronome toggle ("Play the metronome during the take") and the score tempo display (`{{bpm}} beats per minute`).
   - "Start countdown".
2. **Count-in and wait**
   - "Get ready…" / "Counting", then "Play to start recording": **the take starts on the first note**.
   - Unpitched parts aren't supported yet.
3. **Recording**
   - "Press Space to stop" (the review shows "Press Enter when you're done"), "Esc to discard".
   - Hard **10-minute limit** (`Nn=600*1e3`), with a warning at 30 s left.
   - Device-disconnect handling: Keep or Discard.
4. **Review your recording** (piano-roll quantize editor)
   - Subdivision **1/4, 1/8, 1/16, 1/4 triplet, 1/8 triplet**. Internally there is also 1/16t. PPQ is 480 (stepTicks 480/240/120/320/160/80). The UI defaults to 1/4, with an auto-pick of 1/16 for some notes.
   - Instrument presets: Piano (Treble/Bass), Guitar, Flute, Choir SATB.
   - Draggable stave divider (hand split). Selection actions: change subdivision of the selected bars, Stave, Split, Move to voice, Delete.
   - Trim start and end; show/hide raw notes ("As played" vs "Quantized"); engraved preview (toggle).
   - Transport: Play/Stop, Metronome, Zoom, Back to start. Tempo editor with Slower/Faster, clamped to **20–400** bpm (one control 20–250); the default is 120, or 80 when no tempo is present.
   - Out-of-range warnings (red notes); Undo/Redo.
   - "Save to score", or "Upgrade to save" for free accounts.
5. **Place your recording**
   - "Your recording will be placed here — move it if you like". Click a bar to choose the starting point; existing bars are overwritten or bars are added (counts shown).
   - Part-switch check if the stave count differs.
   - "Placing your recording…", then the toast "Your MIDI recording was added to the score".
6. **Feedback:** a 1–5 satisfaction card.

### 2.3 Playback, mixer, metronome
- **Metronome modes** [E] (`esm-B1Yv8QQt.js`, `ScoreEditorTopBar-ClpGW5BC.js`): `COUNT_IN=0` ("Metronome Count-in"), `CONTINUOUS=1` ("Metronome On"), `DISABLED=2` ("Metronome Off"), `CONTINUOUS_NO_COUNT_IN=3`. The toolbar button cycles them (`cycleMetronomeMode`).
- **Transport** [E]:
  - Play/Stop **Space**; resume where you stopped **Shift+Space**; play from the beginning **Ctrl+Space**.
  - Loop the selection **L** (Loop mode, introduced as NEW).
  - Playback speed: "Playback speed" (`setPlaybackSpeed`).
- **Mixer** ("Playback preferences", `flat.volume.*`) [E]:
  - Master volume plus per-part volume, Reverb, Mute and Solo ("Solo mode"), and "All the instruments together".
  - The mix applies either to **Only me** (local) or **everyone** ("Apply these settings to everyone", Power).
  - Catalog actions: `setPartVolume`, `setPartReverb`, `setPartSoloMode`, `mutePart`, `setMasterVolume` (example 80).
- **Sound engine** [E]: soundfonts are cached (Settings → Instrument sounds). There is a native and WebAudio engine; "Low-CPU playback" falls back to the classic engine.
- **Swing:** Swing Eighths / Swing Sixteenths at a measure or globally (`setSwing` {ratio, swingType}) [E].
- **Audio recordings** (web/Power): link a YouTube or MP3 track and add sync anchors (measure ↔ timing) [E] (`flat.recordings.*`, `setTrack`/`useTrack`). There is also a microphone audio recording ("Ready? … Save recording").
- **Tuner** (chromatic plus presets for guitar, bass, ukulele, violin and other instruments, reference A4) [E] (`flat.tuner.*`).

---

## 3. Editor tool catalogue

### 3.1 Layout of the new desktop editor [E] (`config-Cx9S8SAA.js`, `editor.sidebar.*`)

**Sidebar tabs:** Notation | Instruments | Layout. Side panels: Comments, Audio, Search, Shortcuts, Help, and for Edu Assignment, Submission and Insights.

**Top pill bars** (`ye`):

| Bar | Groups and tools |
|---|---|
| `essentials` (left, pill) | **accidentals**: voices, natural, sharp, flat, quarterAccidental, switchEnharmonic. **noteheads** (unpitched): Normal, X, Slash, CircleX, Slashed, BackSlashed, Diamond, Triangle, InvertedTriangle, Square, Cross, ArrowDown, ArrowUp. **durations**: whole … 64th, dot, double dot, tie, tuplets, insertRest |
| `actions` (right) | delete (remove), history (undo, redo), selectionClipboard (lasso, copy, cut, paste), view (zoomIn, zoomOut, switchScoreDisplayMode, switchTouchUI), export (export, print) |

**Notation sidebar sections, in order (preset `tempo`, the current one).** The legacy preset differs: Measure absorbs the tempo tools, there is a separate "Jazz Articulations" section, and Text has no rehearsal tools. The sections are grids of 7 columns (8 on the tablet grid). Shortcut notation: `[tb=x]` means the key is active only when that toolbar/workflow mode is selected. Meta = Cmd on Mac and Ctrl elsewhere; both bindings are listed. Dropdown grouping (`sidebarDropdownConfigs-DBjg185z.js`) [E]: `mordent` expands to 10 mordent variants (long and approach/departure), `toggleTrill` to Trill, ♯, ♭, ♮, 𝄪 and 𝄫 trill, and `quarterAccidental` to quarter-flat, three-quarter-flat, quarter-sharp and three-quarter-sharp.

The **Modes** section (custom panel) holds `cycleEditionMode` (**I**), `changeKeepExistingRestDuration` and `changeDurationMode`. **Pitch and Representation** holds toggleConcertPitch, force beam, force unbeam, slashed grace, grace (**9** in Note mode), ghost note (**Shift+X**), dead note (**X**), note color, 8va (**Cmd/Ctrl+Shift+8**), 8vb (**Cmd/Ctrl+Shift+9**), 15ma and 15mb.

#### Sidebar sections (generated from config-Cx9S8SAA.js + Keyboard-ew5AK_5D.js + en-US labels) [E]

#### modes — "Modes" (custom panel `modes`)

#### pitch — "Pitch and Representation" (custom panel `pitch`)
| tool id | label (en-US) | default shortcut |
|---|---|---|
| `toggleConcertPitch` | Toggle Concert Pitch |  |
| `toggleForceBeam` | Force beaming |  |
| `toggleForceUnbeam` | Force unbeaming |  |
| `insertSlashedGrace` | Acciaccatura |  |
| `insertGrace` | Grace note | Digit9 [tb=note], Numpad9 [tb=note] |
| `ghostNote` | Ghost note | KeyX+Shift, KeyX+Shift [tab] |
| `toggleDeadNote` | Dead note | KeyX, KeyX [tab] |
| `setNoteColor` | Set note color |  |
| `toggle8va` | Ottava | Digit8+Shift+Meta, Digit8+Shift+Ctrl |
| `toggle8ba` | Ottava Bassa | Digit9+Shift+Meta, Digit9+Shift+Ctrl |
| `toggle15va` | Quindicesima |  |
| `toggle15ba` | Quindicesima Bassa |  |

#### articulations — "Articulations"
| tool id | label (en-US) | default shortcut |
|---|---|---|
| `toggleStaccato` | Staccato | Digit1 [tb=articulation] |
| `toggleStaccatissimo` | Staccatissimo | Digit2 [tb=articulation] |
| `toggleTenuto` | Tenuto | Digit3 [tb=articulation] |
| `toggleDetachedLegato` | Detached Legato | Digit4 [tb=articulation] |
| `toggleAccent` | Accent | Digit6 [tb=articulation] |
| `toggleStrongAccent` | Marcato | Digit5 [tb=articulation] |
| `toggleFermata` | Fermata | Digit7 [tb=articulation] |
| `toggleSlurAtNote` | Slurs | KeyS |
| `toggleGraceSlurAtNote` | Slur Grace Note |  |
| `toggleFingering` | Fingerings |  |
| `toggleBreathMark` | Breath mark |  |
| `toggleCaesura` | Caesura |  |
| `toggleMuteOn` | Use mute |  |
| `toggleMuteOff` | Remove mute |  |
| `toggleDoit` | Doit |  |
| `toggleFallOff` | Fall-Off |  |
| `togglePlop` | Plop |  |
| `toggleScoop` | Scoop |  |

#### ornaments — "Ornaments" — excludeInstrumentGroups="unpitched-percussion"
| tool id | label (en-US) | default shortcut |
|---|---|---|
| `toggleTrill` | Trill | KeyT+Shift, Digit1 [tb=ornament] |
| `addTremolo_1` | 1-beam tremolo |  |
| `addTremolo_2` | 2-beam tremolo |  |
| `addTremolo_3` | 3-beam tremolo |  |
| `addTremolo_4` | 4-beam tremolo |  |
| `addTremolo2_1` | 2-note tremolo, 1 beam |  |
| `addTremolo2_2` | 2-note tremolo, 2 beams |  |
| `addTremolo2_3` | 2-note tremolo, 3 beams |  |
| `addTremolo2_4` | 2-note tremolo, 4 beams |  |
| `toggleArpeggio` | Arpeggio | Digit8 [tb=ornament] |
| `toggleGlissando` | Glissando | Digit7 [tb=ornament] |
| `mordent` | Mordent |  |
| `toggleTurn` | Turn | Digit4 [tb=ornament] |
| `toggleInvertedTurn` | Inverted turn | Digit5 [tb=ornament] |

#### dynamics — "Dynamics"
| tool id | label (en-US) | default shortcut |
|---|---|---|
| `toggleDynamicsPpp` | Pianississimo | Digit1 [tb=dynamic] |
| `toggleDynamicsPp` | Pianissimo | Digit2 [tb=dynamic] |
| `toggleDynamicsP` | Piano | Digit3 [tb=dynamic] |
| `toggleDynamicsMp` | Mezzo-piano | Digit4 [tb=dynamic] |
| `toggleDynamicsMf` | Mezzo-forte | Digit5 [tb=dynamic] |
| `toggleDynamicsF` | Forte | Digit6 [tb=dynamic] |
| `toggleDynamicsFf` | Fortissimo | Digit7 [tb=dynamic] |
| `toggleDynamicsFff` | Fortississimo | Digit8 [tb=dynamic] |
| `toggleDynamicsSfz` | Sforzando | Digit9 [tb=dynamic] |
| `toggleDynamicsRfz` | Rinforzando |  |
| `toggleDynamicsFp` | Fortepiano |  |
| `toggleDynamicsPf` | Pianoforte |  |
| `toggleDynamicsSf` | Sforzando (sf) |  |
| `toggleDynamicsRf` | Rinforzando (rf) |  |
| `toggleDynamicsSfp` | Sforzando-piano |  |
| `toggleDynamicsSfpp` | Sforzando-pianissimo |  |
| `toggleDynamicsSffz` | Sforzando-fortissimo |  |
| `toggleDynamicsFz` | Forzando |  |
| `toggleCrescendoBelow` | Crescendo | Comma+Shift |
| `toggleDiminuendoBelow` | Diminuendo | Period+Shift |
| `togglePedal` | Pedal | KeyP |

#### stringsTechniques — "Bowed Strings" — instrumentGroups="strings"
| tool id | label (en-US) | default shortcut |
|---|---|---|
| `toggleUpBow` | Up bow | Digit8 [tb=articulation] |
| `toggleDownBow` | Down bow | Digit9 [tb=articulation] |
| `togglePizzPizzicato` | Pizzicato |  |
| `togglePizzArco` | Arco |  |
| `toggleSnapPizzicato` | Snap Pizzicato |  |
| `toggleLeftHandPizzicato` | Left-hand pizzicato |  |
| `toggleThumbPosition` | Thumb position |  |
| `toggleBowLift` | Bow lift |  |
| `toggleHarmonicNaturalSounding` | Natural Harmonic, Sounding Pitch |  |
| `toggleHarmonicNaturalTouching` | Natural Harmonic, Touching Pitch |  |
| `toggleHarmonicArtificialTouching` | Artificial Harmonic, Touching Pitch |  |

#### tabTechniques — "Tablature" — instrumentGroups="plucked-strings"
| tool id | label (en-US) | default shortcut |
|---|---|---|
| `toggleBend1` | 1/2 Bend |  |
| `toggleBend2` | Full Bend |  |
| `togglePreBend1` | 1/2 Pre-Bend |  |
| `togglePreBend2` | Full Pre-Bend |  |
| `toggleBendRelease0` | Release |  |
| `toggleBendRelease1` | 1/2 Release |  |
| `toggleHammerOnPullOff` | Hammer On / Pull Off |  |
| `toggleSlide` | Slide |  |
| `toggleHarmonicNaturalSounding` | Natural Harmonic, Sounding Pitch |  |
| `toggleHarmonicNaturalTouching` | Natural Harmonic, Touching Pitch |  |
| `toggleHarmonicArtificialTouching` | Artificial Harmonic, Touching Pitch |  |
| `toggleBelowPalmMute` | Palm mute (below) |  |
| `toggleBelowLetRing` | Let ring (below) |  |
| `toggleUpStroke` | Up Stroke |  |
| `toggleDownStroke` | Down Stroke |  |

#### percussion — "Unpitched" — instrumentGroups="unpitched-percussion"
| tool id | label (en-US) | default shortcut |
|---|---|---|
| `toggleDrumroll` | Drum roll |  |
| `toggleBuzz` | Buzz |  |

#### tempo — "Tempo"
| tool id | label (en-US) | default shortcut |
|---|---|---|
| `tempo` | Tempo |  |
| `toggleAccelerando` | Accelerando |  |
| `toggleRitardando` | Ritardando |  |
| `toggleATempo` | A tempo |  |
| `setSwingEighth` | Swing Eighths |  |
| `setSwingSixteenth` | Swing Sixteenths |  |

#### measures — "Measure"
| tool id | label (en-US) | default shortcut |
|---|---|---|
| `insertMeasureBefore` | Insert Measure Before |  |
| `insertMeasureAfter` | Insert Measure After | Enter+Alt |
| `removeMeasure` | Remove Measure | Backspace+Meta, Backspace+Ctrl |
| `toggleSystemBreak` | System break | Enter+Meta, Enter+Ctrl |
| `togglePageBreak` | Page break |  |
| `addMultiMeasureRest` | Add multimeasure rest |  |
| `toggleMeasureRepeat1Measure` | 1-Measure Repeat |  |
| `toggleMeasureRepeat2Measure` | 2-Measure Repeat |  |
| `toggleSlashNotation` | Slash Notation |  |
| `toggleRhytmicNotation` | Rhythmic Notation |  |

#### clef — "Clef" (custom panel `clef`)

#### keySignature — "Key signature" (custom panel `keySignature`)

#### timeSignature — "Time signature" (custom panel `timeSignature`)

#### barlinesAndRepeats — "Barlines and repeats"
| tool id | label (en-US) | default shortcut |
|---|---|---|
| `toggleDoubleBarline` | Double Barline |  |
| `toggleFinalBarline` | Final Barline |  |
| `toggleLeftRepeatBarline` | Left Repeat | BracketLeft |
| `toggleRightRepeatBarline` | Right Repeat | BracketRight |
| `addRepeatXTimes` | Repeat X times |  |
| `toggleSegno` | Segno |  |
| `toggleCoda` | Coda |  |
| `toggleFine` | Fine |  |
| `toggleDalSegno` | Dal segno |  |
| `toggleDacapo` | Da capo |  |
| `toggleToCoda` | To Coda |  |
| `toggleEnding1` | Toggle 1st Ending |  |
| `toggleEnding2` | Toggle 2nd Ending |  |
| `toggleEnding3` | Toggle 3rd Ending |  |
| `toggleEnding4` | Toggle 4th Ending |  |

#### text — "Text"
| tool id | label (en-US) | default shortcut |
|---|---|---|
| `toggleLyricMode` | Lyrics | KeyL+Meta, KeyL+Ctrl |
| `toggleChordMode` | Chord | KeyK+Meta, KeyK+Ctrl |
| `toggleClassicChordMode` | Roman Numerals | KeyK+Meta+Shift, KeyK+Ctrl+Shift |
| `toggleFiguredBassMode` | Figured bass | KeyB+Meta, KeyB+Ctrl |
| `toggleAnnotationMode` | Annotation | KeyE+Meta, KeyE+Ctrl |
| `toggleAutoRehearsal` | Letter rehearsal |  |
| `toggleMeasureNumberRehearsal` | Measure number rehearsal |  |
| `addCustomRehearsal` | Add custom rehearsal |  |


### 3.2 Input modes, voices, durations [E] (`editor.set*`, `Keyboard-ew5AK_5D.js`)

**Editing modes** (cycle with **I**):
- **Melody**: "Write one note at a time. Replace rests/notes; the cursor moves forward."
- **Chord**: "The cursor stays in place. Build chords…"
- **Insert**: "New notes push existing content to the right."

**Change-duration mode:**
- **Replace**: keeps the bar length; extending a note erases what follows.
- **Insert**: extending a note pushes following content.

**Rest duration mode:**
- **Keep**: rests keep their duration.
- **Change**: rests take the duration of the last inserted note.

**Measures are always full:** inserting a note consumes a rest of the same duration ("tutorial.durations") [E].

**Workflow modes** ("Composing", Articulations, Ornaments, Dynamics) remap the digit keys 1–9 to that palette. The legacy toolbars are Document, Note, Tab, Articulation, Ornament, Dynamics, Bar and Text, switched with **Cmd/Ctrl+1…7**.

**Voices:** "Voice n" via `circleVoice` (**V**) and `goVoice2` (**Shift+V**). Related actions: addVoice, removeVoice, removeVoice1/2, deleteRestOrHideVoice, swapVoices and splitStaff (by voice or chord, into new parts or new staves, per measure or per part) [E].

**Text modes:** Lyrics (**Cmd+L**), Chord symbols (**Cmd+K**), Roman numerals (**Cmd+Shift+K**), Figured bass (**Cmd+B**), Annotation (**Cmd+E**). Rehearsal marks are available as letter, measure number or custom.

**Pitch entry:**
- Letters **A–G** enter a note; **Shift+A–G** add that pitch to the previous note (a chord).
- **Alt+2…8** adds an interval above, **Alt+Shift+2…8** below.
- **↑/↓** moves diatonically, **Cmd+↑/↓** by an octave.
- **J** switches enharmonic.
- **−** flat, **=** sharp, **0** natural; Alt variants give quarter tones.

**Durations:** **1** whole … **7** 64th; **.** adds a dot; **Alt+.** adds a double dot; **,** ties; **8** rest; **9** grace; **Shift+2…9** tuplets.

**Tab:** fret digits **0–9**; Shift+digit sets the duration on a tab staff; ↑/↓ moves between strings.

**Unpitched:** kit-specific shortcuts are generated per drum part (`addUnpitchedNote` with midiKey).

### 3.3 Default keyboard shortcuts (full table) [E] `Keyboard-ew5AK_5D.js`

Shortcuts are user-customizable on Power and stored server-side at `/me/editor/shortcuts` [E] (`main/editorShortcuts`). The UI "Keyboard shortcuts" panel offers Customize, Reset shortcuts and a filter for Pitched / Unpitched / Tabs.

| action | default keys (code names; Meta=Cmd, Ctrl on Windows/Linux) |
|---|---|
| `useMainToolbar` | Digit1+Meta, Digit1+Ctrl, Numpad1+Meta, Numpad1+Ctrl |
| `useNoteToolbar` | Digit2+Meta, Digit2+Ctrl, Numpad2+Meta, Numpad2+Ctrl |
| `useArticulationToolbar` | Digit3+Meta, Digit3+Ctrl, Numpad3+Meta, Numpad3+Ctrl |
| `useOrnamentToolbar` | Digit4+Meta, Numpad4+Ctrl |
| `useDynamicToolbar` | Digit5+Meta, Digit5+Ctrl, Numpad5+Meta, Numpad5+Ctrl |
| `useMeasureToolbar` | Digit6+Meta, Digit6+Ctrl, Numpad6+Meta, Numpad6+Ctrl |
| `useTextToolbar` | Digit7+Meta, Digit7+Ctrl, Numpad7+Meta, Numpad7+Ctrl |
| `goRight` | ArrowRight |
| `goLeft` | ArrowLeft |
| `goPreviousMeasure` | ArrowLeft+Meta, ArrowLeft+Ctrl |
| `goNextMeasure` | ArrowRight+Meta, ArrowRight+Ctrl |
| `goPartBeginning` | Home |
| `goPartEnd` | End |
| `promptAndGoMeasure` | KeyG+Meta, KeyG+Ctrl |
| `goPreviousStaff` | ArrowUp+Shift+Meta, ArrowUp+Shift+Ctrl |
| `goNextStaff` | ArrowDown+Shift+Meta, ArrowDown+Shift+Ctrl |
| `goUpString` | ArrowUp [tab] |
| `goDownString` | ArrowDown [tab] |
| `shiftDiatonicUp` | ArrowUp, ArrowUp [unpitched] |
| `shiftDiatonicDown` | ArrowDown, ArrowDown [unpitched] |
| `rangeSelectUp` | ArrowUp+Shift |
| `rangeSelectDown` | ArrowDown+Shift |
| `rangeSelectNextNote` | ArrowRight+Shift |
| `rangeSelectPrevNote` | ArrowLeft+Shift |
| `togglePlayStopResume` | Space |
| `resumePlayback` | Space+Shift |
| `goToBeginning` | Space+Ctrl |
| `toggleLoopMode` | KeyL |
| `toggleMidiInputNotation` | KeyM+Shift |
| `copy` | KeyC+Meta, KeyC+Ctrl |
| `selectCompletePart` | KeyA+Meta, KeyA+Ctrl |
| `selectAllDisplayedParts` | KeyA+Shift+Meta, KeyA+Shift+Ctrl |
| `selectCurrentMeasure` | KeyA+Alt |
| `selectCurrentMeasureAllParts` | KeyA+Alt+Shift |
| `rangeSelectNextMeasure` | ArrowRight+Shift+Meta, ArrowRight+Shift+Ctrl |
| `rangeSelectPrevMeasure` | ArrowLeft+Shift+Meta, ArrowLeft+Shift+Ctrl |
| `shiftOctaveUp` | ArrowUp+Meta, ArrowUp+Ctrl |
| `shiftOctaveDown` | ArrowDown+Meta, ArrowDown+Ctrl |
| `moveNoteToLowerString` | ArrowUp+Meta [tab], ArrowUp+Ctrl [tab] |
| `moveNoteToUpperString` | ArrowDown+Meta [tab], ArrowDown+Ctrl [tab] |
| `toggle8va` | Digit8+Shift+Meta, Digit8+Shift+Ctrl |
| `toggle8ba` | Digit9+Shift+Meta, Digit9+Shift+Ctrl |
| `remove` | Delete |
| `removeThenGoLeft` | Backspace |
| `removeMeasure` | Backspace+Meta, Backspace+Ctrl |
| `addMeasureToEnd` | Enter+Shift+Meta, Enter+Shift+Ctrl |
| `insertMeasureAfter` | Enter+Alt |
| `paste` | KeyV+Meta, KeyV+Ctrl |
| `cut` | KeyX+Meta, KeyX+Ctrl |
| `toggleLyricMode` | KeyL+Meta, KeyL+Ctrl |
| `toggleAnnotationMode` | KeyE+Meta, KeyE+Ctrl |
| `toggleChordMode` | KeyK+Meta, KeyK+Ctrl |
| `toggleFiguredBassMode` | KeyB+Meta, KeyB+Ctrl |
| `toggleClassicChordMode` | KeyK+Meta+Shift, KeyK+Ctrl+Shift |
| `unselect` | Escape |
| `toggleSystemBreak` | Enter+Meta, Enter+Ctrl |
| `save` | KeyS+Meta, KeyS+Ctrl |
| `print` | KeyP+Meta, KeyP+Ctrl |
| `undo` | KeyZ+Meta, KeyZ+Ctrl |
| `redo` | KeyY+Meta, KeyY+Ctrl |
| `resetZoom` | Digit0+Meta, Digit0+Ctrl |
| `zoomIn` | Equal+Meta, Equal+Ctrl |
| `zoomOut` | Minus+Meta, Minus+Ctrl |
| `fullscreen` | KeyF+Shift+Ctrl, KeyF+Shift+Meta |
| `changeDurationWhole` | Digit1, Numpad1, Shift+Digit1 [tab], Shift+Numpad1 [tab], Digit1 [unpitched], Numpad1 [unpitched] |
| `changeDurationHalf` | Digit2, Numpad2, Shift+Digit2 [tab], Shift+Numpad2 [tab], Digit2 [unpitched], Numpad2 [unpitched] |
| `changeDurationQuarter` | Digit3, Numpad3, Shift+Digit3 [tab], Shift+Numpad3 [tab], Digit3 [unpitched], Numpad3 [unpitched] |
| `changeDurationEighth` | Digit4, Numpad4, Shift+Digit4 [tab], Shift+Numpad4 [tab], Digit4 [unpitched], Numpad4 [unpitched] |
| `changeDurationSixteenth` | Digit5, Numpad5, Shift+Digit5 [tab], Shift+Numpad5 [tab], Digit5 [unpitched], Numpad5 [unpitched] |
| `changeDurationThirtySecond` | Digit6, Numpad6, Shift+Digit6 [tab], Shift+Numpad6 [tab], Digit6 [unpitched], Numpad6 [unpitched] |
| `changeDurationSixtyFourth` | Digit7, Numpad7, Shift+Digit7 [tab], Shift+Numpad7 [tab], Digit7 [unpitched], Numpad7 [unpitched] |
| `shortenDuration` | ArrowLeft+Alt+Shift |
| `lengthenDuration` | ArrowRight+Alt+Shift |
| `tie` | Comma |
| `addOneDot` | Period, NumpadDecimal |
| `addTwoDots` | Period+Alt |
| `cycleEditionMode` | KeyI |
| `toggleNoteA` | KeyA |
| `toggleNoteB` | KeyB |
| `toggleNoteC` | KeyC |
| `toggleNoteD` | KeyD |
| `toggleNoteE` | KeyE |
| `toggleNoteF` | KeyF |
| `toggleNoteG` | KeyG |
| `addPreviousNoteA` | KeyA+Shift |
| `addPreviousNoteB` | KeyB+Shift |
| `addPreviousNoteC` | KeyC+Shift |
| `addPreviousNoteD` | KeyD+Shift |
| `addPreviousNoteE` | KeyE+Shift |
| `addPreviousNoteF` | KeyF+Shift |
| `addPreviousNoteG` | KeyG+Shift |
| `typeNoteTab0` | Digit0 [tab], Numpad0 [tab] |
| `typeNoteTab1` | Digit1 [tab], Numpad1 [tab] |
| `typeNoteTab2` | Digit2 [tab], Numpad2 [tab] |
| `typeNoteTab3` | Digit3 [tab], Numpad3 [tab] |
| `typeNoteTab4` | Digit4 [tab], Numpad4 [tab] |
| `typeNoteTab5` | Digit5 [tab], Numpad5 [tab] |
| `typeNoteTab6` | Digit6 [tab], Numpad6 [tab] |
| `typeNoteTab7` | Digit7 [tab], Numpad7 [tab] |
| `typeNoteTab8` | Digit8 [tab], Numpad8 [tab] |
| `typeNoteTab9` | Digit9 [tab], Numpad9 [tab] |
| `flat` | Minus |
| `flatLastNote` | Minus+Shift |
| `sharp` | Equal |
| `sharpLastNote` | Equal+Shift |
| `addQuarterFlatOrToggleCourtesy` | Minus+Alt |
| `addThreeQuarterFlatOrToggleCourtesy` | Minus+Alt+Shift |
| `addQuarterSharpOrToggleCourtesy` | Equal+Alt |
| `addThreeQuarterSharpOrToggleCourtesy` | Equal+Alt+Shift |
| `natural` | Digit0 |
| `naturalLastNote` | Digit0+Shift |
| `switchEnharmonic` | KeyJ |
| `toggleSlurAtNote` | KeyS |
| `toggleTrill` | KeyT+Shift, Digit1 [tb=ornament] |
| `customizeTimeSignature` | KeyT |
| `toggleDeadNote` | KeyX, KeyX [tab] |
| `ghostNote` | KeyX+Shift, KeyX+Shift [tab] |
| `insertRest` | Digit8 [tb=note], Numpad8 [tb=note], Digit8 [tb=note,unpitched], Numpad8 [tb=note,unpitched] |
| `insertGrace` | Digit9 [tb=note], Numpad9 [tb=note] |
| `toggleStaccato` | Digit1 [tb=articulation] |
| `toggleStaccatissimo` | Digit2 [tb=articulation] |
| `toggleTenuto` | Digit3 [tb=articulation] |
| `toggleDetachedLegato` | Digit4 [tb=articulation] |
| `toggleStrongAccent` | Digit5 [tb=articulation] |
| `toggleAccent` | Digit6 [tb=articulation] |
| `toggleFermata` | Digit7 [tb=articulation] |
| `toggleUpBow` | Digit8 [tb=articulation] |
| `toggleDownBow` | Digit9 [tb=articulation] |
| `toggleMordent` | Digit2 [tb=ornament] |
| `toggleInvertedMordent` | Digit3 [tb=ornament] |
| `toggleTurn` | Digit4 [tb=ornament] |
| `toggleInvertedTurn` | Digit5 [tb=ornament] |
| `toggleTremolo` | Digit6 [tb=ornament] |
| `toggleGlissando` | Digit7 [tb=ornament] |
| `toggleArpeggio` | Digit8 [tb=ornament] |
| `toggleDynamicsPpp` | Digit1 [tb=dynamic] |
| `toggleDynamicsPp` | Digit2 [tb=dynamic] |
| `toggleDynamicsP` | Digit3 [tb=dynamic] |
| `toggleDynamicsMp` | Digit4 [tb=dynamic] |
| `toggleDynamicsMf` | Digit5 [tb=dynamic] |
| `toggleDynamicsF` | Digit6 [tb=dynamic] |
| `toggleDynamicsFf` | Digit7 [tb=dynamic] |
| `toggleDynamicsFff` | Digit8 [tb=dynamic] |
| `toggleDynamicsSfz` | Digit9 [tb=dynamic] |
| `togglePedal` | KeyP |
| `duplicate` | KeyR |
| `recordLiveMIDI` | KeyR+Shift |
| `toggleCrescendoBelow` | Comma+Shift |
| `toggleDiminuendoBelow` | Period+Shift |
| `toggleLeftRepeatBarline` | BracketLeft |
| `toggleRightRepeatBarline` | BracketRight |
| `circleVoice` | KeyV |
| `goVoice2` | KeyV+Shift |
| `showHelp` | Slash, Slash+Shift |
| `showKeyboardShortcuts` | Slash+Alt |
| `addNoteInterval1` | Digit2+Alt |
| `addNoteInterval2` | Digit3+Alt |
| `addNoteInterval3` | Digit4+Alt |
| `addNoteInterval4` | Digit5+Alt |
| `addNoteInterval5` | Digit6+Alt |
| `addNoteInterval6` | Digit7+Alt |
| `addNoteInterval7` | Digit8+Alt |
| `addNoteIntervalMinus1` | Digit2+Alt+Shift |
| `addNoteIntervalMinus2` | Digit3+Alt+Shift |
| `addNoteIntervalMinus3` | Digit4+Alt+Shift |
| `addNoteIntervalMinus4` | Digit5+Alt+Shift |
| `addNoteIntervalMinus5` | Digit6+Alt+Shift |
| `addNoteIntervalMinus6` | Digit7+Alt+Shift |
| `addNoteIntervalMinus7` | Digit8+Alt+Shift |
| `addDuplet` | Digit2+Shift |
| `addTriplet` | Digit3+Shift |
| `addQuadruplet` | Digit4+Shift |
| `addQuintuplet` | Digit5+Shift |
| `addSextuplet` | Digit6+Shift |
| `addSeptuplet` | Digit7+Shift |
| `addNonuplet` | Digit9+Shift |
| `goUpperHead` | ArrowUp+Alt, PageUp |
| `goLowerHead` | ArrowDown+Alt, PageDown |
| `addUnpitchedNote` | i[a [unpitched] |


### 3.4 Tool options / sub-panels (component chunks) [E names; I details]

| Component | Options |
|---|---|
| ToolbarAccidental / Quarter accidental | ♯ ♭ ♮, 𝄪 𝄫 (`doubleSharp`/`doubleFlat`), quarter tones (needs part `quarterTones`), courtesy toggle (`add…OrToggleCourtesy`) |
| ToolbarTuplets | duplet, triplet, quadruplet, quintuplet, sextuplet, septuplet, nonuplet, tuplet-11, plus compound variants (`addQuintupletCompound`, `addSeptupletCompound`) [E locale keys] |
| ToolbarTie / ToolbarSlur | tie, flip tie, remove; slur placement Auto / Above / Below (`setSlurPlacement*`) [E] |
| ToolbarVoicesButton | "Voice Options": voices 1–4 [I count], add/remove voice, swap |
| SidebarBeamingButton | beaming pattern (`beamingPolicy`: "Custom auto beaming"), force beam / unbeam, "Display rests inside beams" |
| SidebarTimeSignatureButton | presets 2/4, 3/4, 4/4, C, ¢, 6/8 plus custom (beats, beatType ∈ 1…64, displayed time, beatsList grouping) [E] |
| KeySignatureContent | ♯1–7 and ♭1–7 keys, C/Am (setKey0); `setKey` fifths −7…7, all parts or one [E] |
| Clef panel | G2 (+8va/8vb/15ma/15mb), C1–C5, F4 (+8/15 variants), F3, F5 [E] |
| SidebarTempoButton | bpm + beat unit (whole…64th, dotted) + tempo word (grave … prestissimo) [E] |
| SidebarRepeatXTimesButton / SidebarRehearsalCustom | "Repeat X times" text; custom rehearsal text [E] |
| SidebarMultiMeasureRestButton | number of measures in the MM rest [E] |
| SidebarNoteColorButton | per-note color (#RRGGBB) [E] |
| SidebarTransposeButton | "Semitones / Interval / Key", up/down, quality, transpose keys/harmonies, range or part [E] |
| SidebarModeCycleButton | cycles the edition, duration and rest modes [E] |
| ToolbarDisplayMode | Page / Horizontal / Vertical [E] |
| ToolbarUnpitchedNotehead | 13 drum noteheads (see the essentials bar) [E] |
| ScoreTextTools | lyrics (verses, ↓ adds a verse), chord symbols (jazz plus chord diagrams), roman numerals, figured bass, annotations (above/below) [E keys] |
| InstrumentSortingSelect | sorting presets (§1.3) |
| Quick search (`/`) | search any tool, action or help; recents [E] |
| Score Assistant (AI) | chat that reads or edits the score through the action catalogue (`catalog-DcwFX9kr.js`, API v1.7.0, 138 actions); confirmations such as "Replace n notes in measures…" [E] |

### 3.5 What Flat offers that a Flat-inspired editor might miss [I, derived from the catalogue above]

- **Three independent input-mode axes:** editing (Melody, Chord, Insert), duration change (Replace, Insert) and rest duration (Keep, Change).
- **Workflow modes** that turn the digit keys into a palette per category.
- **Keyboard work:**
  - Shift+letter adds a chord tone, and Alt+digit adds an interval above or below.
  - Shift+M notates while you play.
  - Live MIDI arrives with a quantize review (piano roll, subdivision per bar, hand splitting, trim).
- **Score-level views and modes:**
  - Concert-pitch toggle; slash and rhythmic notation per measure.
  - Measure repeats (1 and 2 bar) and multi-measure rests.
  - Hide empty staves policy; layout templates.
  - Note color modes (Boomwhackers, custom), shape notes, solfège noteheads, fixed or movable do.
- **Instruments:** auto instrument sorting with bracket presets; split staff by voice or chord; custom instruments (pitched/unpitched, staves, clefs, transposition, tab tuning, sound).
- **Playback:**
  - Loop selection (L), resume where you stopped (Shift+Space).
  - Per-viewer vs shared mixer.
  - Audio-track sync with anchors.
  - Exports to MP3, WAV, MIDI, MusicXML, SVG and PNG with parts and options (§4.6).
- **Help and AI:** an AI assistant over a typed action API; contextual tips ("nudges") with an account-level preference.
- **Piano Trainer relevance:**
  - Virtual piano key labels (None, All, Only C) and naming conventions.
  - The metronome mode enum with count-in.
  - The Live MIDI flow is the closest analogue to practice recording.

---

## 4. App flows

### 4.1 Launch routing [E] (`main/index.js`, function `Qf` routeByAccountStatus)

Startup branches on the account status:

| Account status | What opens |
|---|---|
| `power` / `eligible` (Edu with a license) | Library window, and cloud sync starts. |
| `flatFree` on sign-in | Welcome closes. If the encrypted-store flag `upgrade-prompt-shown` isn't set, Flat sets it and opens the **Upgrade window** (ref `desktop-sign-in-free`), then Welcome. |
| Downgrade detected on session restore | Upgrade window (ref `desktop-session-restore-downgrade`), then Welcome. |
| `guestPower` (purchased without an account), `notSignedIn` | Welcome. |
| `eligibleNoLicense` (Edu) | Opens the Edu dashboard in the browser, then Welcome. |
| `incompatibleProduct` | Warning dialog "Incompatible Account", then Welcome. |

On macOS, `activate` opens the Library if one exists, otherwise Welcome. Sign-out wipes the local DB when asked and reopens Welcome.

### 4.2 Welcome window (`renderer/welcome` → `welcome-CqIvTdSN.js`; 960×540, not resizable) [E]

**Left column**
- "New Score" and "Open File…".
- "Recently Edited" list: `listLocalRecentScores(10)`, with Synced or Local badges. Empty state: "No recent scores" / "Create a new score or open a file to get started."

**Right card by user state** (`getUserState().state`)

| State | Card |
|---|---|
| `free` (not signed in) | **power** promo card |
| `linkedFree` | **syncCloud** when cloud scores exist ("{{n}} scores in the cloud", "Upgrade to Power to sync your whole library to this Mac…", "Sync to this device", "Or keep editing them for free at flat.io"); otherwise **powerLinked** |
| `guestPower` | **linkAccount** ("You have {{n}} scores on this device. Sign in to back them up…") |
| `linkedPower` | **tips** |

**Sign-in.** "Sign in to Flat" / "Connect your account to unlock the full experience." The buttons are "Sign in with Apple" (Mac) and "Other sign-in options" (browser OAuth). Consent text: "By signing up, you agree to the Terms and Privacy". After signing in the window shows "Welcome back".

**Edu gate** (Flat for Education build). "Log in to get started" → "Log in with Flat for Education". A rejected account sees "Account not eligible" or "License required".

### 4.3 Creation (new-score wizard) (`renderer/creation` → `App-BRsWwGTD.js` + `useScoreCreation-BW_alt79.js`; strings `flat.score.creation.*`, `flat.score.create-modal.*`) [E]

1. **Selector**: "How do you want to start your first score?"
   - **Start from scratch** ("Pick your instruments, set the tempo, and jump straight in").
   - **Import your score** (PDF, MusicXML, MIDI, MuseScore, Guitar Pro, Power Tab, Encore).
2. **Title**: "Give your score a name"; optional, placeholder "e.g. Piano sketch in C minor".
3. **Instruments**: "Choose your instruments".
   - Family filter and search; "For you" ("Picked for you based on your answers").
   - **Templates** ("Create from template"; all templates are Power-only); "Power instruments" with an HQ badge; preview play.
   - Selected list with a sorting style and drag reorder (turns auto-sort off).
   - Custom instrument builder steps: type (pitched / unpitched) → base → staves and clefs → transposition → tab (n strings) → sound → name. For unpitched: base → staff (1 or 5 lines) → instruments → name.
4. **Fine-tune**: "Defaults that fit most projects."
   - Tempo with note type (quarter, half or eighth); default note type `quarter` [E].
   - Bars (measures count).
   - Key signature ("Starts with no sharps or flats by default").
   - Time signature (2/4, 3/4, 4/4, C, ¢, 6/8, or Customise).
5. **"Create Score"** opens the editor. A default layout template is applied if the user has one [E: layout-template-picker].

### 4.4 Library (`renderer/library` → `library-CzysOtuK.js`, default route `/library/allScores`) [E]

- **Sections:**
  - All scores ("Your scores"), Shared with me / collaborations, Liked scores, Playlists (pin, rename, edit, delete with Restore undo, Create new playlist).
  - Edu builds use collections. Trash: free accounts keep deleted scores for 24 h, Power for 90 days ("up to 1 year" in the upsell copy).
- **Sort:** Alphabetical / Recent / Popular. **Filters:** "Filters:", "Apply filters", "Clear filters".
- **Search:** local search plus macOS Spotlight indexing (`main/SpotlightIndexer`).
- **Score menu:** Open, Open public view, Duplicate, Add to / Remove from playlist, Rename, Share and Collaborate, View comments, Publish / Unpublish to the community, Get embed code, Score instruments, Delete.
- **Sync:**
  - Sync widget states: "All synced", "Offline — n pending", "n scores pending sync".
  - A cloud score opens with `library:openCloudScore`; "Open in browser" is also offered.
  - OMR import progress appears via `onImportStatusUpdate`.
- **Quota:** free accounts are capped ("You have used x/y scores") [E].

### 4.5 Import [E]

- **Open File (desktop)**, with file filters:
  - Flat Score, MusicXML, MIDI, Guitar Pro, MuseScore, PowerTab, ABC, PDF, Adagio JSON, plus "Other Formats".
  - Local formats are converted in `main/scoreImportWorker.mjs`.
  - Some formats need **cloud conversion** (Power): "{{ext}} files are converted by Flat's cloud service". This needs an internet connection.
- **PDF/photo OMR** (`omrImport` window → `OmrImportFlow-emOkjmBJ.js`; 1 credit = 1 PDF page or 1 photo; formats PDF, PNG and JPEG):
  1. Upload (drop, browse or photo).
  2. Password, if the PDF is protected.
  3. **Get your pages in order**: rotate, delete, reorder, add files.
  4. **Credits** ("You are good to go!"); credits can be bought in the Credits window, as one-time packs.
  5. **Language** ("Select the score language").
  6. **Processing**: "Detecting staves → Reading the notes → Assembling your score"; about 1 min per page; "Keep working, notify me".
  7. **Check your score details**: title, then each part's instrument and transposition (To review / Confirmed).
  8. Success ("Your score is in!", Open score) or failure ("No credits were charged").
  - The import is blocked if AI features are turned off ("PDF and photo import is turned off").
- **Web importer** (inside the app): drop MusicXML or MIDI; import from URL (`flat.import-url`).

### 4.6 Export / print [E]

- **Desktop menu formats:** File → Export → PDF, PNG, MusicXML, Compressed MusicXML (MXL), MIDI, MP3, WAV. Also Print (native dialog) and "Save a Copy to Disk…".
- **Format labels:** Printable PDF, MusicXML (.mxl or .musicxml), WAV, MP3, MIDI, SVG, PNG.
- **Export options:**
  - Parts: Full score, Set of parts, Single parts.
  - Merge rests in measures; Concert pitch; Auto multimeasure rests.
  - Only print tablature; Display rests within the TAB staff; Only print Kodály.
  - Hide tempo marks; Hide time signatures; Outline colored notes; Include metronome (audio).
  - Respect system and page breaks in responsive layout.
  - PNG/SVG: layout (Page, Horizontal, Vertical), page choice, measure range, width, DPI.
- **Gating:** MusicXML and MIDI export need Flat Power ("Upgrade to export {{format}}"). Free PDFs carry "Score created with the free version of Flat". The completion notification is "Export Complete".

### 4.7 Sharing and collaboration [E] (`flat.easy-share.*`, `flat.collaborators.*`)

- **Share options:** copy a private shareable link ("Anyone with this link can view"); publish to the community (requires accepting the Code of Conduct); add collaborators; embed on the web (copy HTML).
- **Collaborator roles:** can view, can write, can administer, or remove; plus owner. Invite by username or email. Users can "Request to be a collaborator".
- **Real-time co-editing:** errors include "You are already editing this document with another device" (409).
- **Edu:** share with Students or Teachers at your school.

### 4.8 Comments [E] (`flat.score.comments.*`, `main/scoresComments`)

- Comments live in a side panel ("Comments now live here").
- Features: post, reply (threads), edit, delete, @mention, resolve ("Mark as resolved and hide discussion"), and show older comments.
- Collaborators are notified. Spam and inappropriate content are filtered.

### 4.9 Versions / history [E] (`flat.score.revisions.*`)

- Open with toolbar "Document History". The view lists Versions ("{{n}} saved versions") with author and modified date.
- Actions: "Restore this version", "Copy this version as a new score", "Go to the latest version".
- Free accounts see major versions and can restore one of the last 10; Power gets the "Complete History".
- Desktop keeps local `score_revisions` plus a revision cache.

### 4.10 Offline [E]

- The desktop is local-first: SQLite plus a sync queue; "Keep available offline: All | On demand".
- The editor shows offline banners. When a score isn't cached it says "This score is not available offline on this device".
- Sync conflicts trigger the notification "Sync Conflict".
- Guest/local scores can be linked to an account later (account merge screen).

### 4.11 Upgrade / paywall [E] (`renderer/upgrade` → `upgrade-Bpr-0Pgd.js`, 1180×680)

- **Window contents:** "Go further with Flat Power" plus a features list.
- **Plans:** Monthly ("Flexible: cancel anytime") vs Yearly ("Best deal", "Save n%").
- **Purchase:**
  - CTAs "Start a free trial" or "Subscribe now". The App Store builds use StoreKit and show "Restore purchases".
  - Result states: success "Welcome to Flat Power!"; receipt failure with "Retry activation"; "Subscription linked to another account"; "Purchase failed".
- **Entry points** (refs):
  - Menu "Upgrade to Flat Power…", Settings → Account "Learn more".
  - Gated actions: export MusicXML/MIDI, cloud import, layout, Live MIDI save, instrument sorting, templates, history, custom shortcuts.
  - The automatic post-sign-in prompt (§4.1).
- **Web paywalls** (in-app pages): `powerPaywall`, `onboardingPaywall` (persona variants: learner, composer, educator) and the AI credits plans.

### 4.12 App-level dialogs [E] (`desktop:dialog.*`)

Save / Don't Save / Cancel on close; "Score file not found"; "Can't save to the original location"; "Another open score is using this file"; "Score limit reached"; updater ("Update ready", "Restart Now"); Export Support Bundle.


---

## 5. Onboarding: every surface

Most onboarding state is stored **on the user account**, not on the device:

- **Experiences**: `account.experience[]` flags, added through `addExperience(s)` (renderer `vue-data` user store).
- **Nudge preferences**: `account.nudgePreferences = {disabled, showAll, dismissed[]}`.

Only a few flags are device-local: one `localStorage` key, the main-process encrypted store and the kv table. The 🔒 rows below are device-local [E].

### 5.1 First launch / account gate (main process) [E] (`main/index.js`)

- **No local "first-run" flag exists.** The startup screen is chosen by account status (§4.1). A signed-out user always lands on **Welcome**.
- 🔒 **`upgrade-prompt-shown`** (encrypted store, class `Qn`):
  - Set the first time a **free** user signs in on this device. That sign-in auto-opens the Upgrade window, after which Welcome opens.
  - The key is deleted on sign-out, so the prompt reappears after the next sign-in.
- **Edu build:** a hard gate ("Log in to get started", "You'll need an internet connection to log in"). There is no offline use before login.

### 5.2 Welcome window (`welcome-CqIvTdSN.js`; strings `desktop:welcome.*`) [E]

| Element | Text | Condition |
|---|---|---|
| Primary actions | "New Score", "Open File…" | always |
| Recents | "Recently Edited"; empty: "No recent scores" / "Create a new score or open a file to get started." | local DB has none (an empty state that teaches) |
| Power promo card (signed out, `free`) | Rotates through 3 promos: **"Your music, everywhere"** ("Mac, iPad, and web — all in sync with Flat Power."), **"Advanced notation tools"** ("Transposition, layout styles, custom shortcuts, and more."), **"Export & share freely"** ("MusicXML, MIDI, and professional print settings."). CTA "Learn more" opens the Upgrade window. | 🔒 `localStorage["flat-welcome-power-promo-index"]` advances by one, mod 3, on each mount |
| Sign-in panel | "Sign in to Flat" / "Connect your account to unlock the full experience." → "Sign in with Apple" (Mac) / "Other sign-in options" / "Back"; "Signing in…"; error "Sign in failed. Please try again."; consent "By signing up, you agree to the {terms} and {privacy}." | signed out |
| Link prompt (`guestPower`) | "Connect your Flat account to sync your music across Mac, iPad, and web." / "You have {{count}} scores on this device. Sign in to back them up and access them anywhere." / "Already have an account?" | Power bought without an account |
| Sync-cloud upsell (`linkedFree` with cloud scores) | "{{count}} scores in the cloud" / "Upgrade to Power to sync your whole library to this Mac and edit it here, even offline." → "Sync to this device"; "Or keep editing them for free at flat.io" | free account that has cloud scores |
| Signed-in header | "Welcome back", "Power" badge ("You're using Power on this Mac"), "Account Settings", "Sign out" | signed in |
| `tips` card | (`linkedPower`) | [I] tips content not found in the desktop locale |

### 5.3 Account onboarding questionnaire (web-originated; strings in `flat.onboarding`, `flat.account.onboardingSurvey`, `occupation`) [E texts; I trigger]

1. "Welcome to {{product}}" / "Let's set up your account" / "This will only take a moment. We'll use your answers to personalize your experience." → **"Start quick setup"**.
2. Questions:
   - [E] "How would you describe yourself with regard to music notation?": Complete Beginner / Music Teacher / Amateur / Expert.
   - [E] `account.about.pastTools` is read later: a value outside `firstTime`/`penAndPaper` means a switcher from another tool.
   - [I] Other questions are server-driven: role or persona (learner, composer, educator), which steers paywall copy and "Picked for you" instruments.
3. Privacy notice: "Your privacy matters…". Email-communication preferences come with it [E text].
4. **"All set!"** / "Your account is ready. Time to create some music." → **"Start composing"**.
5. **Onboarding paywall** (`flat.onboardingPaywall.*`):
   - Persona headline: learner "Learn and write music **without limits**", composer "Compose **without limits**", educator "Everything you need to teach **with Flat**".
   - Seven feature bullets, plan selection ("Best deal", "2x credits each month!").
   - **"Skip for now"** / **"Proceed with the Free plan"**; payment, success and error screens.

### 5.4 Creation wizard as the first-score path [E] (`flat.score.creation.*`)

- **"How do you want to start your first score?"**: "Pick your starting point" → **Start from scratch** | **Import your score**.
- Scratch path: **Give your score a name** ("Every piece starts somewhere — you can always change this later.") → **Choose your instruments** ("For you: Picked for you based on your answers") → **Fine-tune your setup** ("Defaults that fit most projects. Tweak them now or change them anytime in the editor.").
- Progress indicator: "Score creation progress". Desktop also offers "Create from template".

### 5.5 Editor first-run tours

Two generations exist side by side.

**A. Composer tour (new editor; `App-BpSv0vpB.js` `CI`/`wI`, `InputStepper-BmAx848I.js`; strings `flat.onboarding.composer-tour.*`)** [E]

Trigger, all of the following:
- URL query `?composer-tour=1` (or the store flag `startOnboardingTour`);
- the account lacks experience `composer.onboarding.tour.done`;
- the A/B flag `isComposerOnboardingEnabled()` is on;
- the user isn't in the rail-file-menu experiment.

[I] The web onboarding sets the query; no desktop code adds it.

Variant: **"switching"** if `account.about.pastTools` contains any tool other than `firstTime` or `penAndPaper`, else **"new"**.

| Variant | Steps | Copy (EN) |
|---|---|---|
| new | intro (modal) → step-notes → step-dynamics → step-playback → summary (modal) | Intro: "Let's create your first melody together" / "3 steps · About 1 minute". **Add notes**: "Try clicking the piano keyboard below, or just pressing a letter key — C, D, E, F, G, A, B…". **Make it expressive**: "Try adding a crescendo in the Dynamics section of the side panel…". **Hear what you've made**: "Hit play in the top-left corner, or press Space." Summary: "You're ready to go!" with "You have learned to: Place notes on the staff / Add tools from the side panel / Play back your composition" and a pointer to the **search icon**. |
| switching | overview (modal with 4 cards: Note input, Toolbar and side panel, Shortcuts, Customize) → step-note-input → step-layout → step-shortcuts | "Switching to Flat?" / "A few things work differently here". Shortcut differences: **S for Slur, not for staccato**; Tie "Not T — T is for triplet"; Crescendo "Not H"; Repeat note "Select note, then R"; Whole note "Reversed from the other tools". Summary mentions the **help icon**. |

Interactive steps advance automatically when the user performs the action (`markInteracted`); there is also "Next" or "Discover".

Ending the tour [E]:
- Complete adds `composer.onboarding.tour.done`.
- **Skip tour** adds `composer.onboarding.tour.done` and `composer.onboarding.tour.skipped`, and shows the toast "Tutorial skipped."
- Analytics record Next, Skip and Complete clicks and abandon.
- While the tour runs it suppresses the Loop and Live MIDI intro modals.

**B. Legacy editor tour (old toolbar; `flat.tour.editor-tour.*`, `App-BpSv0vpB.js` onboarding components)** [E texts and flags]

1. Kick-off: **"Awesome! You created your first music score 🙌"**, "Let's get you started with a 4-step interactive tutorial…" → **"Start tutorial"**.
2. Coachmark steps, each recorded as an `onboarding.*` experience:
   - `score-clickable`, `score-teardrop` ("teardrop" cursor), `score-stackNotes` ("Notes can also be added to the position before the cursor to easily create chords."), `score-move`, `score-changePitch` ("Try changing a selected note by dragging it to a different line!");
   - `tb-durations`, `tb-editionMode` ("Choose a note edition mode best suited for your writing style! Rhythm, Chord, or Insert"), `tb-shortcuts`, `tb-shortcuts-custom` ("Did you know Power Users can customize keyboard shortcuts?"), `tb-layout`, `tb-keyboard-ux` (virtual keyboard), `tb-help`, `tb-share`, `tb-library`.
   - Each has a `-tbchange` variant for when the tool lives on another toolbar tab ("go to the Notes tab or press …").
3. Buttons: Let's go / Next / Got it / Great! / Show example / Hide example / Skip tour / Finish tour / Complete tour.

Suppression [E] (`ScoreEditor-Bl7q1JuI.js`): the tour doesn't show if the experience list contains `editor.onboarding.done`, `editor.onboarding.skipped`, `editor.addnote` or `editor.duration`, or if the score is read-only, embedded, a toolset is open, and so on. Skipping adds `editor.onboarding.skipped`.

**C. Legacy "Welcome to your music notation editor" tutorial modal** (`editor.tutorial.*`) [E texts; I trigger]

Pages: welcome → click-edit ("You can click on all existing elements to edit them") → toolbar-elems → durations ("All the measures are always filled with notes and rests…") → notes (mouse / keyboard A–G and 0–7 / MIDI or touch) → frets (tabs) → select → end ("click on the '?' icon…").

**D. Learner tutorial** ("Ready to compose?", 6 steps of about 3 min each; `ScoreEditorDesktop-DJ1kC6ku.js`) [E]

- Steps: Play back → Add new notes → Change note pitch → Change note duration → Add some feeling → Create a loop.
- The checklist panel shows success toasts ("Nailed it", "Timing, sorted"…) and pro tips.
- Skip modal: "Skip and start fresh" / "Keep learning". Celebration: "Nice work! You've got the basics" → "Keep composing".
- Steps are detected from action XP ids: `editor.addnote`→addNotes, `editor.changepitch`→pitch, `editor.duration`→duration, `editor.articulation`/`editor.adddynamics`/`editor.addwedge`→feeling.
- **Eligibility (`U0`):**
  - the score is the account's tutorial score;
  - A/B group `test`;
  - the new toolbar is enabled outside Edu;
  - the layout fits (the panel is 304 px);
  - **`isDesktopApp` is false**, so it is **disabled in the desktop app**;
  - the experience flag for done is unset.

### 5.6 Feature intros and "what's new" modals [E]

| Modal | Copy | Trigger / remembered by |
|---|---|---|
| Editor announcement ("A new school year, a new editor", NEW) | Features: tools in a side panel, Quick search (`/`), Loop playback → "See what changed" stepper ("STEP n of m", Next / Got it / Done; "Tutorial skipped" toast). Variants for students and the library: "Comments now live here", "Keep your instructions in view", "Here are your tools", "Looking for something?", "Loop it until it is right". | Pinia `editorAnnouncementState` (SET_HAS_ANNOUNCEMENT / SET_OPEN). It suppresses the loop intro while open. [I] gated by a server feature window plus an experience flag |
| Loop intro (video `loop-intro-*.mp4`) | "Loop any passage" (NEW): "Select the bars… press L or click the loop button…" → "Try loop mode" / "Close" | Feature window `editor.loop-intro-modal` enabled AND canLoop AND not guest AND no tour AND experience lacks `editor.loop.intro.done` and any of `editor.loop.activate`, `editor.loop.deactivate`, `editor.loop.menu-activate` |
| Live MIDI intro (video `live-midi-intro-*.mp4`) | "Meet the new Live MIDI". Body differs with a connected device or with none ("Connect a MIDI keyboard…") → "Try Live MIDI" / "Discover Live MIDI" | Window `editor.live-midi-intro-modal` AND loop intro not open AND Live MIDI available, can record and can edit AND not guest, no tour, AND experience lacks `editor.live-midi.intro.done` and `editor.live-midi` (feature used). Waits up to 2 s for the MIDI device list. |
| Editor mode switch intro (tablet) | "The editor is evolving" (New) … "You can switch back anytime from the side menu." → "Go to score" | [I] first open of the new tablet editor |
| Toolbar beta banner | "Join the new toolbar beta…" → "Switch to Beta"; on beta: "Back to old version", "Share feedback"; Score Assistant offer → "Try it" | A/B flags `beta.editor.toolbar` / `ab.editor.toolbar-v…` [E names] |
| Tablet tutorial | "Your editor just got a new groove!" → "Show me"; gestures intro and end ("View gestures list") | [I] first tablet use |
| Playback resume hint | "Press {{resumeShortcut}} to resume from where you stopped" (touch: "Press and hold 'Play'") | `ConnectedPlaybackPill`: on the first `canResumePlayback`, once per session, unless the experience has `editor.playback-resume-hint`; shown 8 s |
| Product updates | "Product Updates", "Show more updates" (web) | [I] server feed; desktop release notes come from `GET /releases/desktop/{version}` (`main/desktopReleases`) |

### 5.7 Contextual tips ("nudges") [E] (store `vue-data` `Le("nudges")`; definitions in `EduAssignmentSidebarToggle-dL1C6BPS.js`, `InputStepper-BmAx848I.js`)

**Engine rules**
- One nudge at a time.
- **Global cooldown of 5 min** between nudges (`$ee = 300*1e3`).
- Suppressed while any `SUPPRESS` holder is active, such as tours or modals.
- Showing a nudge adds experience `nudge.shown.<id>`.
- Dismissing ("Dismiss" → "Just this one") appends to `nudgePreferences.dismissed`, or adds experience `nudge.dismissed.<id>`.
- "Turn off all tips" sets `nudgePreferences.disabled = true` and toasts "Tips turned off." with "Re-enable in Settings".
- Session counters (`INCREMENT_COUNTER`) and feature-used marks (`MARK_FEATURE_USED`) gate individual nudges.

**Settings page "Interaction and guidance"**
- "Show in-app guidance tips".
- "When to show tips": **Only when relevant** (default) / **Always** (`showAll`, reshows dismissed tips) / **Never** (`disabled`).
- "Reset dismissed tips" → "Reset tips".

| Nudge id | Text | Trigger (exact where known) |
|---|---|---|
| quick-search-discovery | "Feeling stuck?" / "Click the search icon or press / to find any tool, fast." | after **3** sidebar-navigation increments, if quick search was never opened and there are no recents |
| first-playback | "Shape your {{instrumentName}} sound": mixer in the top-right (or the Audio panel) | first playback; anchor `[data-cy=playback-volume-root]` |
| live-midi-record / live-midi-connect | "Record your first take" (Shift+R or the red dot) / "Record with your MIDI keyboard" | Live MIDI unused; picks record vs connect by `hasInputDevices`; anchor `midi-header-pill` |
| loop-create / loop-deactivate | "Create your first loop" (L) / "Looping is on" | loop not used / loop activated |
| lyrics-verse | "Hit ↓ to add multiple lyric lines" | in lyrics mode |
| undo-note-insert / undo-duration-insert | "Not what you expected?": switch Editing (or Duration) to **Insert** in Modes | an undo right after a note or duration replace [I precise heuristic] |
| repeat-note | "To repeat a note, select it and press R." | repeated identical entry [I] |
| piano-voice2 | "Writing for {{instrumentName}}?": "Press V to switch to voice 2." | piano part [I] |
| range-selection / range-copy | Shift+click a range; Cmd/Ctrl+C to repeat a section | [I] |
| tab-toggle / tab-tools / chord-diagram | pencil icon to switch notation and tab; Tablature section; chord diagrams in Text | fretted instrument parts |
| dynamics-shortcut / articulations-shortcut / ornaments-shortcut / notation-category-shortcut | "Press ⌘/Ctrl+5 to enter Dynamics mode…" etc. | repeated mouse use of a category [I] |
| touch-undo-gesture / touch-redo-gesture / touch-note-input-mode / touch-recent-actions / touch-tool-categories / touch-grid-view | tablet gesture and tool tips | e.g. touch-grid-view after **2** bottom-sheet expansions (`touch-sheet-expansions`, `Hl=2`) |

Legacy tooltips (`flat.tour.editor-tooltips.*`) cover playback (Space), transpose (Power), history ("All changes will be autosaved…"), score display (Track/Page), share, insert mode, read-only, guitar tuning (Power) and the drumset cheat sheet. Each is remembered through an experience flag [I].

### 5.8 Empty states that teach [E] (`flat.scoresTableEmpty.*`, `mobile.emptyStates.*`)

- **Your scores:** "Let's make some music!" → "Create your first score". All-scores variant: "You don't have any scores yet. … It's time to create your first score!"
- **Playlists:** "Let's get organized!" → "Create your first playlist"; for an empty playlist the desktop says "Add scores to this playlist…" → "Go to your scores".
- **Shared:** "Join forces with collaborators worldwide!" (Edu: "Files shared with you by teachers or students will show up in this folder.")
- **Liked:** "Keep your favorite music close at hand!"
- **Trash** (doubles as an upsell): free "Scores can only be recovered for 24 hours." + "Upgrade to extend Trash storage to 90 days."; Power "Deleted scores are securely stored for 90 days…".
- **Offline variants:** "You are currently offline. Connect to the internet to create your first score!"
- **Library first visit:** "Welcome to your Score Library" / "Create your first score" → "Create now!"; after the first score: "You composed your first score".

### 5.9 Surveys and store-review prompts [E]

- **In-app surveys** (`main/survey-CqlSXq6Y.js`; API `/me/surveys`, server-decided per `feature` or `scoreId`):
  - **CES** asks "How easy…" for import, composing, MIDI and help (Edu adds class setup, assignments and grading). The scale runs from "Extremely easy" to "Extremely difficult".
  - **NPS** asks "How likely are you to recommend Flat to others?" ("Thanks for sticking with us!…").
  - Skip endpoints exist for both (`/ces/skip`, `/nps/skip`), plus a free-text follow-up after a rating ("Thank you for helping us make Flat better!").
- **Live MIDI feedback banner:** "Happy with your take?" → 1–5 card.
- **Native store review** (`main/index.js` `Ml`; Mac App Store and Microsoft Store builds only). It runs only when the build is a store build, the user is signed in and online, and there was no Sentry error in the last **7 days** (`lastSentryErrorAt`).
  - **Free users:** local policy. Ask at most once per **60 days** (`fg = 1440 h`) and never twice on the same build. The state lives in 🔒 kv table namespace `review` (`lastRequestedAt`, `lastRequestedBuild`).
  - **Paid users:** the server decides (`/me/appStore/requestReview` or `/me/windowsStore/requestReview` → `shouldAskReview`).
  - Trigger points: **`printComplete`** (after a successful native print) and **`editorClose`** (closing an editor window, unless the app is quitting).

### 5.10 Upgrade nudges tied to onboarding [E]

- Post-sign-in Upgrade window, once per sign-in on the device (§5.1).
- The Welcome promo card rotation and the Sync-cloud card (§5.2).
- The onboarding paywall after the questionnaire (§5.3), with the free trial ("Try Flat Power for free for 1 month") and a promotional banner ("Get the deal!"). Campaign ids appear in code, e.g. `20260817-paywall-dialog` and `20260817-power-landing`.
- Feature-gated tours, such as the `-tb-change` steps saying "Power Users can customize spacing, fonts and styles", and the `editor-tooltips` transpose and tuning tips.
- Creation wizard: "All templates are available to Power users"; Power instruments "Upgrade for {{price}}/month".
- Storage and trash upsells; Live MIDI "Upgrade to save".

---

## Appendix: method and work files

- Scratch work (prettified chunks, flattened locales, `catalog_actions.txt` with all 138 assistant actions, `kb_defaults.txt`) lives in `scratchpad/flat/work2/`. These are not shipped with this document.
- Caveats:
  - en-US labels come from vue-data. en-GB variants (e.g. "Stave size", "Quantised") exist in the separate locale chunks.
  - Web-only pages (account settings, onboarding questionnaire) are opened in the browser by the desktop app. Their texts are bundled, but their triggers are server-side **[I]**.
