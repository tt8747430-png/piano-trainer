# Tests A: progress

Branch `worktree-agent-ae5984b2bd5f72cfa`, from 2de368d2. Done: every file in `.scratch/r39/plan/tests/A.txt` passes.

## Green (.ts, 21 files, committed 25cc5362, c638f512, cdd5433c, 8b8c79fa)

entities/library arrangement, store; entities/piece catalog, parse-progression, piece-chords, store, titles;
entities/take feedback; features/edit-piece; features/practice note-names, practice-machine; features/score-editor
chords, notes; features/song-files music-xml; pages/score-editor editor-target, palette-categories, shortcuts;
pages/songs library-view; shared/lib/schedule auto-pedal; widgets/practice-player wait-feedback;
widgets/score-sheet line-music.

## Green (.tsx, 47 files)

- The Player's widgets, New song, Songs' small screens (8fc2050e); the run pages (264839d1); PlayerActs,
  PlayerSections, PlayerPrint (ced0a1da); PlayerBarAndFoot, PlayerShortcuts, PlayerSettingsPages, PickView,
  PlayerViews, PlayerPage (199311cd).
- The score editor (9660c339); Archive and Trash (45b6c2af); PublicLibrary, PublicSongPage (843c36d2);
  SharedSongPage (e4ed712e); Explore (882e5a43); BuiltInFolder (27139a90); PiecePage, SectionPage, SongDetails
  (e16fa573); SongsPage (b57602de).
- `SongSettingsPage.test.tsx` deleted (8fc2050e): Settings is a window now, tested in PiecePage.

## Code fixes

- `features/edit-piece/make-song.ts`: comments said four bars at 90 (now eight at 80).
- `pages/score-editor/ui/EditorGear.tsx`, `editor-gear.ts`, `gear-pages.ts`, `RecordReview.tsx`: comments (9660c339).
- A folk tune's credit printed raw ("Traditional" in Russian): `widgets/piece-list/ui/use-entry-face.tsx`,
  `widgets/piece-cover/ui/PieceShelfCover.tsx`, `pages/piece/model/use-song-byline.ts` now say it through
  `useCreditNames` (b57602de).

## Made robust

- RecordReview's `held` under load: `expect.closeTo(500, -1)`.
- SongsPage's drop-then-Undo: dnd-kit stops every click for 50ms after a drop; the test waits it out.
