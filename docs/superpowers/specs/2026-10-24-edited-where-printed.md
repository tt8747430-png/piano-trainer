# Edited where printed, one bar at every size (ADR 0094)

Three rounds, each in its own worktree, merged in order A + B together, then C.

## A — the bars, the dialogs, every size alike

Owns: `pages/score-editor/ui/{EditorHeader,EditRow,LayerChip,CaretLine,EditorDock,RecordButton,RecorderSheet,
EditorViewMenu,PieceSettings,ScoreEditor}.tsx`, `pages/player/ui/{PlayerLayout,PlayerViewMenu}.tsx` (the bar's
buttons, not the title), `widgets/mode-switch`, `widgets/player-setup/ui/SetupTrigger.tsx`,
`widgets/practice-player/ui/{TempoButton,PlayerDock}.tsx`, `entities/settings` (`paletteSide` out, version bump),
`features/set-preference`, `pages/score-editor/model/use-palette-beside.ts`, CODE_STYLE's rule, i18n.

1. Remove `LayerChip`, Add bar from `EditRow`, the caret line in sight (`CaretLine` becomes an sr-only live
   region), and the title from the editor's bar (round B prints it on the sheet; leave `useSongTitle`,
   `SongTitleField` and `song-sheet.ts` in place for B).
2. Delete `PieceSettings` (the Song sheet) and its strings; keep `song-sheet.ts` (`TEMPO_WORDS`) for B.
3. Record into `EditorDock` after ›, opening the takes (`RecorderSheet`); the bar loses it.
4. One `ScoreViewMenu` (a widget both pages import) from `PlayerViewMenu` and `EditorViewMenu`: layout; staves;
   Chord symbols, Lyrics, Keys; the Player's extras through a slot. The editor's sheet honours its staves and
   Chord symbols. No Palette switch, no side.
5. `paletteSide` out of the settings (and the palette's `left`/`right` code): beside the sheet it stands right.
6. Every button of both bars and the dock: its icon, its name as `title` and `aria-label`, at every size (no
   `max-lg:sr-only` names, no `landscape-phone:hidden` icons, no option shown at one size only). ModeSwitch too.
7. CODE_STYLE §5 gains the rule; CLAUDE.md's sentences follow.

## B — what is printed is edited there

Owns: `widgets/score-sheet`, `widgets/sheet-music`, `shared/ui/score` (layout readers, MEI staff labels),
`shared/ui/SheetPage.tsx`, `widgets/practice-player/ui/PlayerTitle.tsx`, the Player's title (from its bar to the
sheet), `entities/piece` (`PieceMusic.title`, `versionOf`, store version), `features/score-editor` (a `title` action;
the staff actions: melody add/remove, piano hide/show; score `hidden` keeps `piano` and `chords` until C), new
`pages/score-editor/ui` popovers (`TitleField` on the sheet, `TempoPopover`, `KeyPopover`, `TimePopover`,
`ClefPopover`, `StaffMenu`), `pages/songs` New song staves.

1. The title printed at the sheet's head in Scroll, Pages and Across in both screens (the page's h1); the Player's
   bar loses it; with Notation off the Player prints it alone. In the editor a click makes it a field.
2. `PieceMusic.title` for a version; Songs, Search and the song page show it; Reset brings the catalog's back.
3. The tempo mark, key signatures, time signatures and clefs clickable: their boxes read from Verovio's SVG
   (`g.keySig`, `g.meterSig`, `g.clef`) by the layout, buttons over them in `LineOverlay` opening the popovers; the
   palette's Key, Time and Clef sections and the popovers are one component each.
4. Staff names on the first line (MEI `label`): Melody, Piano; in the editor each opens `StaffMenu`.
5. `melodyStaff`/`hide` reduced to: add or remove the melody staff; hide or show the piano. The score's `melody`
   hidden row goes (the View's).

## C — a bar may have no chord symbol (after A and B)

Owns: `entities/piece` chart parser and writer (`_`), `shared/lib/arrangement`, `shared/lib/notation`,
`features/score-editor/model/chords.ts`, `features/edit-piece` (`chartStart` with empty bars), the editor's chord row,
`widgets/chord-chart`, `widgets/piece-chords`, docs/CONTENT.md. The score's `chords` hidden row goes; New song's
Chord symbols choice goes.
