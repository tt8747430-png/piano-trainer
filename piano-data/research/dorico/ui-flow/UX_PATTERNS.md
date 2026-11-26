# Dorico's UX patterns: the design decisions behind the app

Each pattern below is something Dorico 6.2 visibly does, with the evidence from the decoded app (paths are relative to this folder).
It describes how Dorico is built, as a reference for a notation editor. It isn't a style guide.

## Structure

**P1. Content, presentation and output are separate objects.**
- Players (who), flows (what music), layouts (which printed view).
- A layout is players × flows, plus its own Layout Options and pages.
- Evidence: `../data-model/DATA_MODEL.md` §1–5. Setup panels highlight membership with included/not-included cards.

**P2. Modes are task phases over one document.**
- Setup → Write → Engrave → Play → Print; switch with ⌘1–5.
- Switching changes only the panels and tools, never the music or the selection.
- Evidence: `Window.SwitchMode`; the zones swap per mode.

**P3. Four layers of settings, each with one home:**

| Layer | Example | Dorico's home |
|---|---|---|
| Machine | MIDI devices, latency, auditioning | Preferences, `preferences.xml` |
| Project house style | how every slur looks | Engraving Options |
| Per flow | beaming, rests, accidental rules | Notation Options |
| Per layout | page, staff size, spacing | Layout Options |

On top of these, the **per item** properties.

A setting appears once. Dialogs can be opened from several places (menu, panel button, shortcut), but it's always the same dialog.

**P4. Rules rather than manual fixes.**
- Notation is derived from logical data: durations are stored as lengths and notated by the Notation Options; spacing and collisions are automatic.
- Manual overrides exist, as properties and Engrave-mode graphic editing, but they're the exception, and **Reset** commands undo them.
- Evidence: 1,617 engraving options; Reset Staff Spacing, Reset Note Spacing, Remove Overrides.

**P5. Overrides are scoped.**
- Any property can apply **globally** or **locally** (this layout only).
- Pages with manual changes show coloured corner triangles.
- Evidence: `propertyTable.context.layoutIDWithFrameChainID`; Pages panel text.

## Input and editing

**P6. Two equal ways in: panels for discovery, popovers for speed.**
- Every notation has a clickable panel and a type-to-create popover (⇧C, ⇧K, ⇧M, ⇧T, ⇧D, ⇧O, ⇧P, ⇧H, ⇧B, ⇧X, ⇧L), switchable in the Notations toolbox.
- Evidence: `notationstoolbox/panelspopoverstoggle`; `../palettes/PALETTES.md`.

**P7. A visible caret, separate from the selection.**
- Note input happens at an orange caret (`caretColour #ff8000`), with a rhythmic grid (`caretGridResolution 1/2`).
- The selection is separate (`selectedColour #ff8000`; linked items `#006cbf`).
- Esc leaves input; Enter, ⇧N or I starts it.

**P8. Input modifiers are sticky, visible toggles:** Lock duration, Force duration, Insert scope (voice / player / global), Chords, Pitch-before-duration, Grace, Tuplets. They stay on until turned off and apply to both input and editing.
- Evidence: "Most stay switched on until you switch them off" (Notes toolbox text).

**P9. Shortcuts depend on context, so letters can mean different things.**
- The same key means different things in Global, Write, Step input, Engrave and Play.
- During step input, A–G are pitches. Outside it, single letters are commands (S slur, T tie, L lock, O force, Q chords, W score ↔ part, J jump bar, P play from selection).
- Evidence: `SHORTCUTS_BY_MODE.md`, 6 contexts.

**P10. Every action is a named command,** reachable by menu, button, shortcut, MIDI Learn (any MIDI key or CC) and the Jump bar (J, type the command name).
- Evidence: 1,366 commands in `COMMANDS.md`; MIDI Learn in Preferences › Key Commands.

**P11. Hearing what you edit.**
- Notes sound during input and selection (`auditionNotesWhileEditing true`).
- Optionally the whole chord when any note of it is selected, or at a fixed velocity.

**P12. Problems are shown in the score, not in dialogs:**
- notes out of the instrument's range (dark red, or red past the advanced range)
- cautionary or forced accidentals in signal colours
- signposts for hidden items
- a proofreading panel that lists problems

Evidence: `coloursPreferences.*`, `proofingpanel`, `prooferPreferences`.

**P13. Undo covers everything, and the view follows it** (`followSelectionOnUndoRedo true`).

## Layout of the window

**P14. A stable shell.**
- Toolbar (mode tabs) on top; left, right and lower zones per mode; status bar at the bottom.
- Zones are toggled (⌘7, ⌘8, ⌘9; ⌘0 for all) rather than moved.
- The lower zone switches between Properties, Key Editor, Mixer, Keyboard, Fretboard and Drum Pads.

**P15. Panels are stable lists.**
- Panels keep their items in place. A command that can't run is **disabled in menus**, not removed.
- Only the Properties panel adapts to the selection, with an option to show all properties of mixed selections or only the common ones (`showPropertiesOnlyForSingleSelectedEventType`).

**P16. Two views of the same music.**
- **Page view** is the printed result.
- **Galley view** is one endless system with staff names, for input.
- Switch with ⌥⌘1 / ⌥⌘2; zoom presets from 60 to 1600%.

**P17. Tabs and split views** show two layouts at once, e.g. the score and a part.

## Output

**P18. Printing is a mode with a live preview.**
- Choose layouts, a destination (printer or graphics), job type, range and annotations.
- Export file names come from tokens (`$n - $l - $t - $p`).

## MIDI

**P19. MIDI is set up once, per machine.**
- Devices are enabled per device. Thru is on by default; controllers can be filtered.
- Latency compensation is in milliseconds; there's a chord-grouping window (100 ms) and a Bluetooth pairing entry.
- See `../midi-and-staff/MIDI_SETTINGS.md`.

**P20. Recording keeps the performance and notates it with quantize rules.**
- Quantize unit, tuplets with their own unit, grace-note detection, fill gaps, preserve played positions and velocities.
- CC64 becomes pedal lines, snapped to the beat. Slurs, trills, tremolos and staccato are detected.

## Sidebars, hiding and motion (Dorico)
Evidence: the 218 unique QML screens carved from the binary, which hold every animation Dorico declares; zone commands from `COMMANDS.md`; panel widgets from `PANELS_AND_BUTTONS.md`.

**P21. Panels: three zones per mode, toggled whole, and sections fold inside them.**
- The left, right and lower zones are shown or hidden as a whole with `Window.ShowLeftPanel`, `ShowRightPanel` and `ShowBottomPanel`:

  | Action | Shortcut |
  |---|---|
  | Toggle left / lower / right zone | ⌘7 / ⌘8 / ⌘9 (numpad) |
  | Hide or restore all zones | ⌘0 |

- The `…?SetBasedOnButtonCheckedState` variants tie a zone to its toolbar button.
- Inside a zone, each panel section has a header button that folds it (e.g. `commonClefsSectionHeaderButton`, `uncommonClefsSectionHeaderButton`, `archaicClefsSectionHeaderButton`, `octaveLinesSectionHeaderButton` in the Clefs panel).
- Preference `closeSidePanelsWhenLowerPanelOpened` (default **false**) optionally closes the side zones when the lower zone opens.
- The lower zone cycles its panel (`Window.CycleLowerPanelType`) and its size (`Window.CycleLowerPanelSize`) rather than being dragged.

**P22. How things are hidden:**
- **Panels never remove items.** Commands that can't run are disabled in menus (P15).
- **The Properties panel** adapts to the selection, showing only property groups that apply (`showPropertiesOnlyForSingleSelectedEventType`, default true).
- **Hidden notation stays findable.** Hidden items show **signposts** (View › Signposts; `signpostViewOptions.*`, all on by default), and View › Show Invisibles toggles them.
- **Empty staves** are hidden by a layout rule (`hideEmptyStavesPolicy`, default `kNever`), not by hand. Manual staff visibility is a separate dialog (`ManualStaffVisibilityDialog.qml`).

**P23. Motion is minimal and functional.**
Across the 218 unique QML screens there are only **8 animations**, all short. The main window's zones (Qt widgets) carry no declared animation, so they appear and disappear instantly.

| Element (QML) | What moves | Duration | Easing | Trigger |
|---|---|---|---|---|
| Scroll bar (`T.ScrollBar`) | opacity fade-out | 200 ms, after a 450 ms pause | linear | stopped scrolling (overlay scroll bars) |
| Scroll indicator (`T.ScrollIndicator`) | opacity fade-out | 200 ms, after a 450 ms pause | linear | same |
| Round button (`circularButton`) | colour | 100 ms | linear | hover |
| Long press (`longPressRect`, `scaleIn` / `scaleOut`) | width and height | 200 ms | InOutQuad | press-and-hold (touch / iPad) |
| Collapsible header (`ctrlImpl`, `animationDuration: 200`) | implicitHeight | 200 ms | InOutQuad | expand or collapse a section |

**Takeaway:** a professional editor animates only feedback (hover, press, fold) at 100–200 ms. Layout changes (zones, modes, panels) are instant, so the score never moves under the user's eye.
