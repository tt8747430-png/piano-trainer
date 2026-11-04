# B4 and B6: report

**B4, Edit in place.** `useCan`/`usePermissions` and `can` are exported from `entities/library` and read the account the app uses, so Learner view and signed-out users count as learners. The table also has `addFolder` (own folders only) and the curriculum acts, which are for editors only. Every Songs check now goes through it: the + (none in a learner's built-in folder), row menus, Select's bar, drag targets (a target `can` refuses is never offered), the Move sheet (built-in folders are greyed with a reason), and the folder's and song's Settings. A folder's last row, Archived (n), opens `/songs/folders/$folderId/archived`, where each song has Unarchive. Archiving from a folder asks "Hide “x” from this folder?". Learn has an Edit pencil that puts the level or the shelves into Edit mode on the same page (`?edit`, through `useSetSearch`). `LevelEditor` and `ShelfEditor` now live in `widgets/curriculum`. `/journeys/$journeyId/edit`, `/courses/manage`, the LibraryBig links and the Courses FAB are gone.

**B6, one publishing model.** `features/publish/model/acts.ts` holds the acts table, with a test. One Publish page per kind: `DraftPublishScreen` for lessons, courses, progressions and an editor's built-in song; Explore's `PublishScreen` shares its parts. Publish in the editors' bars is now a link to the Publish page, and Versions moved there. Every Settings page shows Publish…, Share link, then Delete. A progression got a Settings page and a gear in its editor. ADR 0116 r30.

**Commits:** 21eb0194, b77e7d47, b98d862c.

**Rulings** (cost if wrong):
- A learner's built-in folder Settings shows only Move to folder…; I read "⋯ Sort only" as that page, and Sort stays the search's chip. Small fix if wrong.
- Export stays in Select's bar in built-in folders, because the row's ⋯ offers it too. One condition to change.
- Built-in folders can still be moved into the learner's own folders. Old tests that moved them into built-in folders were rewritten for D8.
- The Courses shelf has no "Remove from shelf": a course's shelf is set on the course itself. Small.
- A level and the course order have no Publish page, so their bars keep the one-tap Publish dialog. Medium: they would need pages of their own.
- Course lessons are published with their course and have no Publish page of their own.
- Unpublish appears only for items made in the app, not for the ones it ships with.

**Left:** screenshots of the Edit modes and the Publish pages. They need an editor account, which the production build cannot fake, so I only took the built-in folder and Archived at 402, 874 and 1280 (no overflow). CLAUDE.md's map still names the two removed routes; that is for the merging session. No migration. Full suite not run, as the brief says. `composition-root.test.ts` fails without `.env.local`, as it already did before these changes.
