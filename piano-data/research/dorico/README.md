# Dorico notation reference for a music editor

Recovered from **Dorico 6.2.31** (`/Applications/Dorico 6.app`) to serve as a blueprint for a TypeScript web score editor.
Everything comes from Dorico's own data. Nothing is invented:
- **Decoded project files.** `.dorico` is a ZIP of `.dtn` binary trees; I reverse-engineered the format and wrote decoders.
- **The app's resource XML.**
- **The scripting API definitions** bundled with the app.

## Contents

| Path | What | Size |
|---|---|---|
| `data-model/DATA_MODEL.md` | **Start here.** Project → players → flows → layouts; event streams, blocks, events, properties; time units; master pages/frames; file format | — |
| `data-model/DORICO_API_CLASSES.md` | Dorico's object model from its bundled API: 65 classes, 216 fields, 70 functions (Score, Flow, EventStream, NoteEvent, …) | — |
| `options/ENGRAVING_OPTIONS.md` + `.json` | Every engraving rule with its default: 1,414 settings, 55 groups (beams, stems, slurs, ties, accidentals, dynamics, spacing, barlines, tuplets, lyrics, chord symbols…) | exact values |
| `options/NOTATION_OPTIONS.md` + `.json` | Per-flow rules: note & rest grouping, beaming, accidental duration, syncopation, condensing (122) | exact values |
| `options/LAYOUT_OPTIONS.md` + `.json` | Per-layout rules side by side for full score / custom score / part (214 settings): page, staff size, vertical spacing, justification, note spacing, casting off, bar numbers, multi-rests | exact values |
| `options/NOTE-INPUT_OPTIONS.md`, `VIEW_OPTIONS.md`, `PLAYBACK_OPTIONS.md` | Editor and playback behaviour (165) | exact values |
| `options/NEWER_OPTIONS_DORICO5_6.md` | 688 option names added in Dorico 5/6, with exact names. Their defaults are compiled into the app and weren't recovered. | names only |
| `library-data/instruments.json` | 624 instruments (428 pitched): names, staves, clefs, ranges (+MIDI), transposition, playing techniques | resolved inheritance |
| `library-data/score-orders.json`, `ensembles.json`, `templates.json`, `playing-techniques.json` | 3 score orders, 32 ensembles, 41 templates, 298 techniques | — |
| `library-data/MASTER_PAGES_AND_TEXT_STYLES.md` + `master-pages.json`, `paragraph-styles.json` | Page templates: every frame's position, size and content token; 21 text styles | exact values |
| `piano-trainer-comparison/PIANO_TRAINER_VS_DORICO.md` | **Your app against Dorico:** 12 rule collisions (incl. 3 internal contradictions and 1 ADR out of date), MIDI gap table, staff gap table, palette mapping, **20 missing flows** ranked, ready-to-use Dorico→Verovio `engravingDefaults` | evidence-tagged |
| `midi-and-staff/MIDI_SETTINGS.md` | Every Dorico MIDI preference (devices, thru, latency, chord window, auditioning, recording/quantize, MIDI import, percussion, MIDI Learn) with key, UI label, default | exact (Dorico 6 prefs file) |
| `midi-and-staff/STAFF_SETTINGS.md` | Every staff-related setting across Dorico's 5 scopes (instrument, layout, engraving, notation, per-staff commands), Dorico 6 defaults | exact |
| `midi-and-staff/d6-*.json`, `dorico-preferences-all.json` | Dorico **6.2.31** defaults: engraving 1,617 (203 new vs 4.0.5, 12 changed), notation 136, note input 150, playback 155; 371 preferences | exact |
| `palettes/PALETTES.md` + `palette-inventory.json` | 20 Write-mode panels (sections, labels, commands), popover keys, full item lists: 26 clefs, 7 octave lines, 45 ornaments, 78 tempo words, 11 swing feels, 298 playing techniques, 37 notehead sets, 46 line styles, 66 accidentals, 19 page sizes… | exact names |
| `ui-flow/UX_PATTERNS.md` | 20 UX patterns Dorico follows, each with evidence | sourced |
| `ui-flow/APP_FLOW.md` | **The application flow.** Hub → project window → modes; zones, toolbar, status bar, tabs and split view; every Setup/Write/Engrave/Play/Print panel with its buttons, what each does, its shortcut and which dialog it opens; dialogs and their entry points; four end-to-end walkthroughs; mapping to a TS app | sourced |
| `ui-flow/PANELS_AND_BUTTONS.md` | All 163 UI areas from Dorico's help map. For 129 of them: widget class, every control (object name), labels and tooltips, Steinberg's explanation text, commands triggered, manual link | raw evidence |
| `ui-flow/COMMANDS.md` + `commands.json` | 1,366 commands (every action), grouped by area, with display name, default shortcut + context, and the panel that triggers it | exact IDs |
| `ui-flow/SHORTCUTS_BY_MODE.md` | 264 default shortcuts in 6 contexts (Global, Setup, Write, Step input, Engrave, Play), with Dorico's names | exact |
| `ui-flow/DIALOGS_AND_SCREENS.md` | 56 QML screens/dialogs (Hub, sign-in, file-modified, delete, fonts, transforms…): text, buttons, toggles, inputs, event handlers, backend calls; plus all 85 QML screen names | from embedded QML |
| `tools/dtn_decoder.py`, `tools/dtn-decoder.ts` | Decoders for `.dtn` (Python CLI → XML; TypeScript → JS tree/JSON). Tested on all 8 bundled projects and on a Dorico 6.2.31 file (format 1.1452, which sets flag bits on node types). | — |

## Units (verified)
- **Musical time:** crotchets (quarter notes) as exact fractions, e.g. `3/2` = dotted crotchet.
- **Engraving distances:** staff spaces, as exact fractions (`1/2`, `7/10`).
- **Page, frame and margin geometry:** points (594 × 841 = A4).
- **Staff size:** `defaultSpaceSize` in points (4.96 pt = 1.75 mm per space).
- **Pitch:** MIDI number at concert pitch, plus a separate spelling property.

## Accuracy and limits
- **Option defaults:** from Dorico **4.0.5** (the newest factory-default projects bundled with Dorico 6). Options that still exist in Dorico 6 are marked ✓. Dorico 5/6 additions are listed by name only.
- **Option names:** camelCase internal names. Dorico's UI wording isn't included.
- **Not decoded:** the layout algorithms themselves (spacing, collision avoidance, casting off). Those are compiled C++ inside a 274 MB binary. The options are the inputs those algorithms read.

## Licensing
Dorico is Steinberg's commercial software. The decoders and the docs written here are my own.
The JSON exports are Steinberg's data (instrument ranges, option defaults and so on). Most of it is musical fact, but treat the collection as reference material.
**Before shipping it in a product, write your own data set** or check Steinberg's licence. Don't redistribute Dorico's files or tutorial projects.
Bravura, Dorico's music font, is open (SIL OFL), and `verovio` bundles it.
