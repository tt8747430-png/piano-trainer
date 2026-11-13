# R38: Undo instead of asking, and losses shown as losses

## The rulings as they stand

- **Undo instead of asking** (owner, 2026-11-07, on Kole Jain's "act first, offer Undo": "adopt also this"). A loss
  that can be undone happens at once and says so in a toast with **Undo** (`say`, ADR 0106), which puts everything
  back exactly as it stood. Only a loss that can't be undone, or that reaches other people, still asks first through
  `ConfirmDialog`: emptying the Trash, deleting for good, publishing changes, groups, the Admin area, and wiping the
  device.
- **A loss is shown as a loss** (owner, 2026-11-07, on UX Peak's loss-aversion framing: "i don't like your
  rejection"). Where the learner is about to lose something, or risks losing it by doing nothing, the screen names
  what goes, concretely and by name or count ("Your 12 songs live only on this phone", "Practise today to keep your
  9-day streak"). The way out names the cost ("Keep on this phone only"), never a plain "Maybe later". The rule that
  keeps it honest: the loss is always true, shown with the learner's own things, and never invented (no fake
  countdowns, no made-up scarcity).

## Today (main b98aea88)

The `<ConfirmDialog>` element is used in 29 places and `confirm()` is called 8 times. Songs already toast with Undo
for moving, archiving, favouriting and Delete to the Trash.

## Will build: each confirmation, classified

| #   | Where (file)                                                                                          | Asks today                                                   | Becomes                                                              |
| --- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------- |
| 1   | `pages/songs/ui/DeleteAsk.tsx`, `features/edit-original/ui/RemoveGroup.tsx`                           | Delete song(s) to the Trash                                  | at once, toast "Moved to the Trash" · Undo                           |
| 2   | `features/manage-library/ui/DeleteFolderAsk.tsx`                                                      | Delete folder (own: for good)                                | at once; the folder and its songs kept for Undo; toast · Undo        |
| 3   | `features/manage-library/ui/use-library-acts.ts` (3)                                                  | Hide, remove from folder, archive folder                     | at once, toast · Undo                                                |
| 4   | `pages/score-editor/ui/InstrumentsPanel.tsx`                                                          | Delete a staff ("You can undo this")                         | at once, toast · Undo (the editor's undo)                            |
| 5   | `pages/score-editor/ui/LayoutPanel.tsx`                                                               | Reset layout                                                 | at once, toast · Undo                                                |
| 6   | `pages/pattern/ui/PatternPage.tsx`                                                                    | Delete own pattern                                           | at once, toast · Undo (songs get it back too)                        |
| 7   | `pages/progression/ui/ProgressionScreen.tsx`                                                          | Delete own progression                                       | at once, toast · Undo                                                |
| 8   | `widgets/curriculum/ui/OwnItemRows.tsx`, `LevelEditor.tsx`                                            | Delete own lesson or course                                  | at once, toast · Undo                                                |
| 9   | `pages/profile/ui/NotificationsPage.tsx`                                                              | Clear notifications                                          | at once, toast · Undo                                                |
| 10  | `pages/songs/ui/CardStylePage.tsx`                                                                    | Apply a style to every folder                                | at once, toast · Undo (each folder's old style)                      |
| 11  | `pages/piece/ui/SongSettingsPage.tsx`                                                                 | Duplicate                                                    | at once, no question: nothing is lost; toast · Undo removes the copy |
| 12  | `pages/score-editor/ui/DeleteTakeDialog.tsx`, `RecordReview.tsx`                                      | Delete or discard a take                                     | at once; the take is kept until the toast goes; Undo                 |
| 13  | `features/reset-progress/ui/ResetStepsRow.tsx`                                                        | Reset a lesson's steps                                       | at once, toast · Undo                                                |
| 14  | the Song settings Revert, the editor's Discard changes                                                | Revert to the published version                              | at once, the draft kept for Undo                                     |
| 15  | `widgets/chord-player/*`, `pages/chord-player/model/*`, `widgets/practice-library/ui/ArrangeList.tsx` | New progression over unsaved chords, remove from the library | at once, toast · Undo                                                |
| —   | `pages/song-archive/ui/DeleteSongAsk.tsx`                                                             | Delete for good, Empty Trash                                 | **asks**, listing what goes by name and count                        |
| —   | `features/publish/ui/PublishScreen.tsx`, `widgets/content-editor/ui/DraftPublishScreen.tsx`           | Unpublish, republish a version                               | **asks** (reaches other learners)                                    |
| —   | `pages/groups/*`                                                                                      | Remove member, leave, delete group, stop sharing             | **asks** (reaches other people)                                      |
| —   | `pages/admin/*`                                                                                       | Block, demote, delete a switch or group                      | **asks**                                                             |
| —   | `pages/settings/ui/StoragePage.tsx`, `AccountSettingsPage.tsx`                                        | Erase this device, sign out                                  | **asks**, naming what stays only on this phone                       |

Undo holds exactly what it needs to restore and lets it go when the toast closes; nothing is deleted for good until then.
Where a write reaches the server, the server write waits for the toast to close (as Gmail's Undo Send does), so Undo
never needs a second round trip.

**Losses shown as losses**, in the same round:

- the backup prompt and Storage: "Your {{count}} songs live only on this phone";
- the streak: "Practise today to keep your {{count}}-day streak";
- Delete for good and Empty Trash: the songs listed by name;
- each one's way out names its cost.

Strings in en and ru, each with its plural forms.

## Docs

- `CLAUDE.md` "Rules that span areas": "a loss that can be undone happens at once, with Undo in its toast; one that
  can't asks first".
- ADR 0106: the decision and a History line.
- `DESIGN.md`: the toast and the dialog sections.
- `owner-way` craft details and the redesign skill's lessons.

## Order

1. The rulings into the docs and skills (done in this commit).
2. Build rows 1–15, one commit each, with tests.
3. Losses shown as losses.
4. Two passes in the browser, the full suite, the build, then merge.

## Drawn (2026-11-07)

The design https://claude.ai/artifact/Mjgkmv51aAdGadFAP6KB9j:

- **Undo, not a question:** a song goes at once; the toast names it, "“Für Elise” moved to Trash", with Undo.
- **A loss named as one:** Erase asks, in numbers ("Your 12 songs, 4 lessons and 41 days of practice go for good"),
  "Keep them" first, "Erase 12 songs" in red; the backup sheet says "Your 12 songs live only on this phone" with
  "Back up with an account" and "Keep on this phone only".
- **Progress:** one practice record, a streak with milestones and earned rest days, the week in a group.
- **Agentation:** how its toolbar would sit over a dev build. Not installed: PolyForm Shield, the owner's decision.

The Player canvas v148 has the card shadows and the filter chips' counts.
