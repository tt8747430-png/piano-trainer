# Dorico 6: playing and hiding specific parts of the score, and onboarding

**Evidence:**
- the command catalogue (`COMMANDS.md`: IDs, names, default shortcuts)
- Dorico 6 project options (`../midi-and-staff/d6-*.json`)
- preferences on this Mac (`preferences.xml`, `finishedTours.xml`, `finishedUpdateTours.xml`)
- the 8 bundled tutorial projects (`Resources/guidedtutorials/*.dorico` → `supplementary_data/guidedtutorial/guidedtutorial_<lang>.xml`)
- the QML screen list

---

## Part A. Playing specific parts

| What | Command(s) | Default shortcut | Notes |
|---|---|---|---|
| Play from the selection | `Play.StartOrStop?PlayFromLocation=kSelection` | **P** | With the preference `playSelectionPlaysStaveOnly = true` (default), **only the selected staves sound** |
| Play from the playhead / last start / start of flow | `…=kPlayhead` / `kLastStartPosition` / `kStartOfFlow` | Space or Enter or F8 / ⇧Space / ⌥⇧Space | |
| Move the playhead to the selection | `Play.SetPlayheadTo?PlayFromLocation=kSelection` | ⌥P | |
| **Solo the selected instruments** | `Play.SoloFromSelection` | **⌥S** | Solo what's selected in the score |
| Clear all solos / all mutes | `Play.UnSoloAll` / `Play.UnMuteAll` | ⇧⌥S / ⌥U | |
| Solo / mute per track or channel | Play mode track headers and Mixer strips (`Play.SetMixerStripVisibility`, `SetMixerSectionVisibility`) | — | Each instrument has M/S buttons in Play mode and the Mixer |
| **Loop a range** | `Play.EnableCycle`, `Play.SetCycleLocatorsFromSelection`, `SetCycleLeftLocator` / `RightLocator`, `ClearCycleLocators` | — | Project option `clickAndCountInOptions.enableCycle = false` |
| Mute one note in playback | `Play.PianoRollMuteEvent` (Key Editor), and the "Muted" property on items | — | `View.ToggleShowMutedEventsInGrey` greys muted notes in the score |
| Don't play slash voices | option `playBackSlashedVoices = false` | — | |
| Repeats | `playRepeats = true`, `playRepeatsAfterDS = false` | — | |
| Chord symbols | `chordPlaybackOptions.playChords = false` (piano sound) | — | Chord track in Play mode |
| Scrub (hear the notes under the cursor) | `Play.StartScrubSoloPlayback`, ScrubPlayback context | — | |

## Part B. Hiding specific parts

### B1. Per layout (which players appear at all)
- A **layout** includes only some players. A **part** is a layout with one player (Setup › Layouts panel, cards included/not included). Hidden players simply aren't in that layout. They still **play** if the layout is shown, because playback follows the project, not the layout.
- `hideEmptyStavesPolicy` (Layout Options; default `kNever`) hides staves with no music after the first system.
- **Manual staff visibility** (`Edit.ManualStaffVisibility`, dialog `ManualStaffVisibilityDialog.qml`) hides specific staves on specific systems.
- **Condensing** (`Edit.ToggleLayoutCondensing`, `Edit.CreateCondensingChange`) merges several players onto shared staves in the full score. `View.ToggleShowCondensedMusicInGrey` shows the condensed result in grey while editing.

### B2. In the editor view only (not in print)
- **Instrument visibility filters** (`Edit.UseInstrumentVisibilityFilter`, `Edit.EditInstrumentVisibilityFilters`, presets 1–10 `Edit.InstrumentVisibilityFilterPreset1…10`; overlay `View.ToggleShowInstrumentFilterOverlay`; dialog `ManageInstrumentFiltersDialog.qml`; Write panel `writemode/instrumentfiltersoverlay`). These show only some instruments while you work, e.g. "strings only". Filters change **what you see**, not what prints or plays.
- **Galley view** shows every staff with labels, for input; page view shows the real layout.

### B3. Per item
- **Hide one item:** `Edit.ToggleHideEvent`; a notehead `Edit.ToggleHideNotehead`; a stem `Edit.ToggleHideStem`; an accidental `Edit.HideAccidental` / `ToggleAccidentalVisibility`.
- **Hidden items stay findable:** they show as **signposts** or **invisibles** (`View.ShowInvisibles` / `HideInvisibles`, the ` key). Signposts are on by default (`signpostViewOptions.*`).
- **Chord symbols per player:** `Project.Player.SetChordSymbolVisibility` (e.g. `kShowIfPlayerHasRhythmSectionInstrument`), regions shown with `View.ToggleHighlightChordSymbolVisibilityRegions`.

**The model in one line:** *layouts* decide what prints, *filters* decide what you see while editing, *solo / mute / selection* decide what you hear, and *hidden items* stay visible as signposts while editing.

---

## Part C. Onboarding in Dorico 6

| Surface | When | What | Remembered in |
|---|---|---|---|
| **Onboarding window** (`Dorico/Onboarding/OnboardingMain.qml`) | first launch | welcome and setup | preference `showOnboardingWindow` (true until done) |
| **Hub** (`Dorico/Hub/HubMain.qml`) | every launch with no project | Create New (templates by category, grid view) · Open Recent · **Learn** page (tutorials, videos, news) | `getHubLearnContent true`, `hubLearnPageLastVisit`, `useGridViewOnHubCreateNew` / `OpenRecent` |
| **Empty-project screen** (`EmptyStateWidget`) | a new project with no players | "Start your project by adding some players": Solo player / Section player / Ensemble, each with examples | — |
| **Guided tour per mode** | first time each mode is opened | step-by-step overlay ("Guided Tour · Mode", **Next**, **Finish Tour**); "To replay this tour, choose Guided Tour from the Help menu" | `finishedTours.xml`: `kWriteMode`, `kSetupMode`, `kEngraveMode`, `kPlayMode`, `kPrintMode` = true |
| **What's New tour** | first launch after an update | "Thank you for updating to %1"; per mode; "Replay"; link to the Version History PDF | `finishedUpdateTours.xml`, `lastVersionShowedUpdateInstalledWindow` (`UpdateInstalledMain.qml`) |
| **Guided tutorials** (interactive projects) | from the Hub's Learn page | a real score that opens with a side card of steps; "Any changes you make to this project will not be saved, so you can experiment freely" | — |
| **Nudges** | occasionally | remote tips content | `getNudgeContent true`, `nudge_content/` |
| **Review request** | after use | store review | `reviewRequestState.ini` |
| **Playback activation** | opening a second project | "Activate playback for this project?" + "Remember my choice" | `activateWhenNextProjectLoadedOrSwitched` |

### C1. The guided-tutorial format (reusable as is)
Each tutorial is a project file with `supplementary_data/guidedtutorial/guidedtutorial_<lang>.xml` (en, de, es, fr, it, ja, pt, **ru**, zh) and GIFs:
```xml
<guidedtutorial>
  <platform>kDesktop | kMobile</platform>
  <name>Introduction to note input</name>
  <description>…</description>
  <graphicFilename>introduction-to-note-input.png</graphicFilename>
  <steps>
    <step>
      <heading>Start note input</heading>
      <content>Markdown text with **keys** and ▶ menu paths</content>
      <highlightedWidgetObjectName/>   <!-- a UI element to spotlight -->
      <graphicFilename>start-note-input.gif</graphicFilename>
      <placement/>
    </step>
```

### C2. The tutorials and their steps (English)
1. **Introduction to note input** (desktop; a mobile version uses the on-screen keyboard):
   1. About this tutorial
   2. Start note input
   3. Choose a note duration ("**6** is a quarter note, **5** an eighth, **7** a half note")
   4. Specify an accidental ("**0** natural, **-** flat, **=** sharp")
   5. Specify a pitch (mouse shadow note, keys A–G, MIDI keyboard, or on-screen Keyboard)
   6. Input more notes
   7. Rests ("You don't need to input rests… Dorico will fill in the rests automatically")
   8. Next tutorial
2. **The caret and the grid:**
   1. About
   2. Moving the caret (×2)
   3. The rhythmic grid
   4. Changing the rhythmic grid resolution
   5. The caret is not only for notes
   6. Next tutorial
3. **Editing notes:**
   1. About
   2. Changing the pitch of notes
   3. … the duration …
   4. … the position …
   5. Adding ties
   6. Removing ties
   7. Next tutorial
4. **Adding markings:**
   1. About
   2. Adding articulations
   3. Adding slurs
   4. Adding immediate dynamics
   5. Adding gradual dynamics
   6. Adding other markings
   7. Next tutorial

**Design pattern:** teach inside a **real, throwaway score**, one action per step, each with a looping GIF and the shortcut. Every step ends with doing it on the actual score, and the last step points to the next tutorial.
