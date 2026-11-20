# R67 B: Songs, the song page, the Player and the score editor — report

Brief: `b-songs-player.md`. Rulings: `.scratch/r67/plan/port.md`, sections Library, adding, publishing; Song page;
Player views and settings; Player and editor together; Score editor; Sheet, selection and playhead (the last two hold
no rulings in port.md). Songs rulings filed under other sections but living in these files are taken too (X rows).

| # | Ruling (bold lead) | App file | State |
| - | ------------------ | -------- | ----- |
| L1 | Groups' + on the floating actions' line | `pages/groups/ui/GroupsPage.tsx` (kit `FloatingActions`) | done: the kit's floating row sets the gap (agent A's) |
| L2 | A song's Settings in every thing's shape, one label on a form | `pages/piece/ui/SongSettingsPage.tsx`, `features/publish/ui/PublishScreen.tsx`, `pages/songs/ui/NewSongSheet.tsx` | built |
| L3 | New floats on a laptop too | `pages/songs/ui/LibraryScreen.tsx`, `SongsOverview.tsx` | built |
| L4 | The song's laptop sub-pages without holes | Settings: `SongSettingsPage.tsx`; section: `SectionPage.tsx`, `SectionLessonGroups.tsx`; take: `pages/score-editor/ui/TakePage.tsx`, `widgets/take-roll` | built; Takes' cards-across-the-top laptop layout left (below) |
| L5 | Takes has Select | `pages/score-editor/ui/TakesSheet.tsx`, `TakeList.tsx`, `TakeRow.tsx` | built |
| L6 | The selection bar carries each act's glyph over its word, everywhere | `widgets/song-library/ui/SelectDock.tsx`, `SelectionBar.tsx`, `ShelfList.tsx`, `TakesSheet.tsx` | built |
| L7 | Groups on a laptop is two lists, not a grid of cards | `pages/groups/ui/GroupsPage.tsx` | built |
| L8 | Every Songs page through the lines | shared playlist named in its bar (`SharedFolderPage.tsx`); a take's Download in its bar (`TakePage.tsx`); New song's Create disabled without a name (`NewSongSheet.tsx`, already) | built; New playlist creates its suggested name by design; tab-bar and C3 contrast and the palette tabs are kit (agent A) |
| L9 | Archive and Trash: Select, and a ··· that opens a menu at its button | `pages/song-archive/ui/ShelfList.tsx`, `ArchivePage.tsx`, `TrashPage.tsx`, `FolderArchivedPage.tsx` | built |
| L10 | Songs' places in the sidebar, one frame for all of them | `widgets/song-library/ui/SongsPlaces.tsx`, `PlaceBar.tsx`; mounted in `widgets/app-nav/ui/AppNav.tsx` | built |
| L11 | Explore on a laptop is All songs' table | `pages/songs/ui/ExploreScreen.tsx`, `ExploreResults.tsx`, `widgets/song-preview/ui/ExploreFeedCard.tsx` | built |
| S1 | A lesson has no tools | Learn (agent A) | not mine |
| S2 | A section's ladder is one column, its rows one height | `pages/piece/ui/SectionPage.tsx`, `SectionCard.tsx`, `SectionLessonGroups.tsx` | built: rows 56; the board's code draws two columns on a laptop (its later rewrite), so the app follows the board |
| P1 | The grid's beats join | `widgets/chord-chart` | done: the app's cells already join on hairlines |
| P2 | The views' headings on the scale | `widgets/chord-views/ui/ViewTitle.tsx` | built (title 8 over credits) |
| P3 | Diagrams' beat cells reach 44 | `widgets/chord-views/ui/BeatStrip.tsx` | built |
| P4 | The score's systems on the spacing scale | `widgets/sheet-music` | left: the gap is inside Verovio's engraving; needs measuring ink to ink |
| P5 | Played through on the cards' edge | `widgets/practice-player/ui/PlayedThrough.tsx` | built (12 gaps, 48 buttons); title on the cards' edge is the kit sheet's header |
| P6 | The song menu is the kit's menu named Song | `pages/player/ui/SongHead.tsx` | built; the Pattern rows' hand line: see E1 |
| E1 | The Player's Pattern sheet holds the library's shape | `widgets/player-setup/ui/PatternPage.tsx` | left: the app's pattern page is a plain picker (no chips, Close all or hand line); the library-shaped sheet is a new build |
| E2 | The next lyric line readable | `widgets/chord-views/ui/SungLines.tsx` | done (soft ink already) |
| E3 | One heading on the score in Play and in Edit | `pages/score-editor/ui/TitleField.tsx` | built (credits centred; title and credits at the Player's height, 72 and 105) |
| X36 | A song list on a phone is one list | `entities/library/model/card-look.ts`, `LibraryRows.tsx` | built |
| X37 | A shared playlist is All songs' table on a laptop | `pages/groups/ui/SharedFolderPage.tsx` | built |
| X76 | A laptop place's bar ends on its column | `PlaceBar.tsx` (`PLACE_COLUMN`) | built |
| X119 | A section's own name stands on the paper | `SectionCard.tsx` | built |
| X34 | Every run's music on the paper (r56 `PV_RUN`, round 68) | `pages/player/ui/WalkPlayerPage.tsx`, `ChromaticPlayerPage.tsx`, `ProgressionPlayerPage.tsx`, `ExercisePlayerPage.tsx` (all `PlayerLayout`) | done for the card: the app's runs never drew one, they are the Player's own engraved sheet on the paper (both hands, four bars a line, shot at 402 and 1710). Left: the board's run view as a screen of its own (treble staff only, eight bars on one line at 1.35 centred over the transport, Setup · tempo · Play as the transport, the keys docked edge to edge). It replaces the Player for four routes, and the walk's 15 bars (up and back) and the Player's floating keys window would both change, so it is a separate build |

## Decisions

- Takes stay the editor's sheet: Review writes into the editor's draft at its caret, so a separate page would need its
  own write path. The laptop board's row of take cards with the review under them is therefore not built.
- The take page draws no keys, as the board; pedal lanes, beat lines and black-key lanes left the roll for the same reason.
- New tokens `--roll-upper` (#f2b33d) and `--roll-lower` (#8fb3d9) for the roll's two hands.

## Kit needs (for agent A)

- `SelectAct` and `SelectDock` belong in the kit (Practice's and Your lessons' bars).
- `AppNav.tsx` mounts `SongsPlaces` under Songs; the merge kept it.
- `NameField`'s label is sentence case; the boards' FIELD is small capitals on the 16 inset (the take's Name).
- Dates follow the `en` locale (US order); the boards write "18 November".

## Passes

- Pass 1 (402, 393, 1710, Day, en; 30 shots over /songs, All songs, Archive, Trash, Explore, a song, its section, the Player, the editor with Takes, a take): fixed the editor title reach overlapping its credits and a take's 24-wide bar buttons.
- Pass 2, fresh: 30 shots, nothing new from this port. Left as found: the editor sheets' UNCOVERED band (the kit sheet over the full-screen editor) and the laptop palette's OVERLAP lines (its tools' reaches), both earlier than this round; COVERED rows under the floating tab bar are the bar floating by design.
- Typecheck after the merge: clean for this area; the remaining errors are Learn's and Settings' (lessonReading, learn.ts), agent A's.
