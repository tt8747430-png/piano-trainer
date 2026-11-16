# The editor's palette: Flat's look, value for value

## Source
- **Owner, 2026-11-16:** "i want to copy the look of the flats palete".
- **ADR 0114:** "Keys are Flat's: equal cells of a bordered table, 44px at the least". The same ADR also says "Every tool is a 48px sand tile, the chosen in ink, wrapping 8px apart in a section". These two lines **contradict each other**. The first is Flat's, and this spec follows it.

## References looked at
- **Phone:** `piano-data/reference-apps/flat-score-editor/`
  - **Grid:** 002, 006–016 (each section), 017 (durations bar + Recent), 018 / 086 (collapsed)
  - **List view:** 024–043 (list view, labelled tools)
- **Laptop panel:** 099 (Modes, Pitch and Representation), 121–125 (sections expanded: Articulations, Ornaments, Dynamics, Clef, Key and Time signature, Barlines)
- **Tooltips:** 109–120, including disabled tools 114 and 115
- **Flat's own code** (Flat 26.11.0 desktop bundle, read statically):

  | Chunk | What it holds |
  |---|---|
  | `SidebarGridRow.css` | the grid table |
  | `ToolbarGroup.css`, `ToolbarSimpleIcon.css` | cells, states, badge |
  | `bottomSheets.css` | phone sheet and its motion |
  | Flat's token definitions | `--radius-standard: 8px`, the neutral and accent scales |
  | `editorPanelSystem` | panel rail; see `piano-data/research/flat/FLAT_UI_SHELL_AND_MOTION.md` |

## What Flat's palette is (measured from the code and the shots)

**1. The table**
- A container whose background is the **line colour**, with `gap: 1px`, `border: 1px solid` (the same line colour), `border-radius: 8px` and `overflow: hidden`.
- Rows are flex rows with `gap: 1px`. Every cell is `calc((100% − (n−1)·1px) / n)` wide, so the 1px gaps draw the inner lines.
- A short last row is closed by a filler (`:after`, `flex: 1`) in the page colour, so no line colour shows past the last tool.
- `--grid-columns` is **7 by default** (laptop panel). Phone shots show **8** per row.

**2. A cell**
- `height: 42px` (laptop); the glyph is centred and drawn in the secondary-text colour.
- The phone's simple cell is also 42px high, full cell width. The phone's "detailed" tile (list view) is **68px** high: `border-radius: 4px`, `padding: 8px`, the label under the icon, `inset 0 -2px 4px` shadow.

**3. States**

| State | Laptop | Phone |
|---|---|---|
| Chosen | the glyph turns the **accent colour**; the cell keeps its fill | also a light accent **wash** on the cell (shot 002; list items use the accent at 20%: `#268ff433`) |
| Can't act here | the glyph turns grey (`#b7b7b7`), `cursor: not-allowed`, **kept in place**, with a "Title: reason" tooltip | same |
| Can never apply here | the tool **isn't drawn** (wrong instrument, no edit rights) | same |
| Hover | (not measured) | (n/a) |
| Focus | `outline: 1px` accent, `outline-offset: 2px`, radius 4px | — |

A paid tool has a small badge at the top right (doesn't apply to us).

**4. Sections**
- A title row (laptop: semibold, with a chevron at the right, plus a shortcut chip after the title, e.g. "⌘ + 3"). The table comes under it, and sections are divided by a line.
- Sections fold (accordion, 200 ms `grid-template-rows 0fr→1fr`).
- **Laptop panel:** tabs Notation · Instruments · Layout, then a "Modes" section (Editing / Duration / Rest as three drop-downs), then "Pitch and Representation" (two drop-down buttons over a table), Articulations, Ornaments, Dynamics, Measure, Clef, Key signature, Time signature, Barlines and repeats, Text.
- **Phone sheet:**
  - grip, then sections in one scroll: Notation (durations, dots, tie, tuplet, accidentals), Pitch and Representation, …
  - pinned at the foot, a **row of category icons** (note, accidentals, articulation, ornament, dynamics, bar, clef…), the one in sight on a pale fill, then a **grid/list toggle** and a **fold** button
  - **List view:** two columns of labelled buttons (icon + name)

**5. Motion**
- The phone sheet slides up and down in 300 ms `cubic-bezier(.32,.72,0,1)`.
- Sections fold in 200 ms.
- A tab indicator slides in 150 ms.

## Today (the board `r44_editor.py` and the app)
- **Board:** an 8-column grid, `border: 1px` LINE, **radius 12px**, cells drawn with `box-shadow: 1px 0 0 LINE, 0 1px 0 LINE` (lines only right and below; the last row's empty cells aren't closed). The chosen cell is `#EEE9E2` with ink. The laptop panel is **docked right, 380px**. Categories are named (Notes, Accidentals…); there's no grid/list toggle and no section shortcut chips. Tools that can't act are **hidden**.
- **App:** `EditorPalette`, as ADR 0114 (both of its descriptions above exist in the text).

## Will build (the board first, then the app ported value for value)
1. **Table:** the line-colour container with `gap: 1px` instead of box-shadows, plus a page-colour filler closing a short last row. Radius **8px**. Phone **8** columns, laptop **7** (`--grid-columns`).
2. **Cell:** 44px high (our 44px minimum; Flat's 42 rounded up). Glyph in soft ink. **Chosen:** sky glyph on a sky wash (our Neutral Choice / sky rule, ADR 0114 "a sky glyph on a sky wash"); Flat's geometry and state logic, with our paints.
3. **Can't act here → greyed in place** with the reason in its tooltip. **Can never apply → not drawn.** This replaces "not drawn, never greyed" and settles the contradiction with the Still Screen Rule ("nothing jumps") and ADR 0034 ("greyed, never hidden"). It's Flat's exact rule.
4. **Section titles** with a fold chevron and, on a laptop, the section's shortcut chip.
5. **Phone foot:** a pinned row of category icons, the section in sight lit, plus **Grid · List** and **Fold**. List view: two columns of icon + name buttons.
6. **Laptop:** decide the side. Flat docks the panel **left** (tabs Notation · Instruments · Layout). Our "Palette position" setting already allows left or right; Flat's default is left.
7. **Motion:** the sheet at 300 ms `cubic-bezier(.32,.72,0,1)`; a fold at 200 ms; transform and opacity only (DESIGN.md).
8. **Not copied:**
   - Flat's icons (`flat-icons` font) and colours: we use our tokens and glyphs (SMuFL / Lucide).
   - Paid badges.

## Adaptable and customizable (owner, 2026-11-16: "the ui should be adaptable and customizable")

This resolves the two open questions: both answers become the learner's choice, and the screen adapts on its own.

### Adapts on its own, with no setting
| Width | Palette | Columns |
|---|---|---|
| Phone upright (< 48rem) | bottom sheet with a grip; folded = the current category's row, unfolded = every section in one scroll, up to half the screen | 8 |
| Phone on its side, tablet, laptop (≥ 48rem) | docked panel, every section in one scroll | 7 at 380px, 9 at 520px: `n = floor((panel − 24 + 1) / 51)` (24 = the panel's padding; each cell ≥ 50px wide, ≥ 44px high) |

- The panel's **width is draggable** (a handle on its inner edge, 320–520px). Columns follow the width.
- **Short screens:** sections fold automatically when the sheet would pass half the screen. A folded section shows its title row only.
- While Live MIDI records, the panel folds away and comes back afterwards (Flat's `editorPanelSystem` does the same).

### The learner's choices
Settings › Score editor › **Note input**, the existing page. Each preference has one home (`SETTING_HOMES`); scopes as in `SETTINGS_ARCHITECTURE.md`.

| Setting | Values | Default | Scope |
|---|---|---|---|
| **Palette position** (exists: `editing.paletteSide`) | Left · Right | **Left** (Flat) | device: a laptop and a tablet may differ |
| **Categories shown as** | Names · Icons | **Names** on a laptop, **Icons** on a phone (Flat's foot row) | device |
| **Tools shown as** | Grid · List | **Grid** | device; also toggled in place by the palette's own Grid · List button, Flat's |
| **Recent** row | On · Off | On | synced (preference) |
| **Show shortcuts** in section titles and tooltips | On · Off | On (laptop only) | synced |

### Remembered silently (view state, never a setting; `NOT_PREFERENCES`)
- which sections are folded (`foldedSections`, exists)
- the category in sight (`paletteCategory`, exists)
- folded or open sheet (`paletteFolded`, exists)
- panel width (new)

### Customizing the contents (later, its own item)
- **Pin** a tool to Recent / Favourites by its ··· or a long press, and reorder sections by dragging the title's handle (your rule: reorder by dragging a handle, never Move up / Move down).
- **Reset palette** puts back the default order. It's an undoable loss, with Undo in its toast.
- References: Flat's Recent row (shot 017); Dorico's customizable key commands, which offer keyboard customization rather than palette customization; MuseScore's palette customization (look it up in screenshots before the board is drawn).

### Board work this implies
- **Laptop boards:** the panel at the left (default) **and** at the right, both drawn; at 380px with 7 columns and at 520px with 9.
- **Phone boards:** Names and Icons category rows; Grid and List views; folded and open.
- **States box:** a tool greyed with its tooltip, a tool not drawn, a section folded, the sheet folded, Live MIDI with the panel folded away.
