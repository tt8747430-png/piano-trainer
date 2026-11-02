# The 46 `navigate(` call sites (R26, A18)

Rule: a mode, a view, a tab, a filter, a sort, a step of a flow, or a sheet held in the URL replaces
the entry; opening a page pushes it; leaving a page that is gone (deleted, saved over) replaces it.
Back itself is `useUp()` over `app/routes/parents.ts`, never a `navigate` of a screen's own.

| #   | Where                                                     | What it does                                          | Verdict                                              |
| --- | --------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------- |
| 1   | `shared/lib/use-view-change.ts`                           | a view's params in place                              | replace (already) — renamed `useSetSearch`           |
| 2   | `shared/lib/use-go-back.ts`                               | Back through the history                              | deleted: `useUp()`                                   |
| 3   | `features/song-files/ui/use-song-import.tsx`              | an imported song's page                               | push (a page)                                        |
| 4   | `pages/chord-finder/model/use-chord-finder.ts`            | the keys held, in the URL                             | replace (already) → `useSetSearch`                   |
| 5   | `pages/songs/model/use-library-page.ts` (folder)          | a folder deleted or archived: up to its parent folder | replace (already)                                    |
| 6   | `pages/songs/model/use-library-page.ts` (home)            | the same, at Home                                     | replace (already)                                    |
| 7   | `pages/songs/ui/LibraryScreen.tsx`                        | Clear filters                                         | replace (already)                                    |
| 8   | `pages/songs/ui/NewSongSheet.tsx` (editor's)              | the new song in the editor                            | push (a page; the sheet's steps are component state) |
| 9   | `pages/songs/ui/NewSongSheet.tsx` (learner's)             | the same                                              | push                                                 |
| 10  | `pages/pattern/ui/PatternPage.tsx` remove                 | leaves a deleted pattern                              | replace (already)                                    |
| 11  | `pages/pattern/ui/PatternPage.tsx` Make your own          | the new pattern's page                                | push (a page)                                        |
| 12  | `pages/pattern/ui/PatternPage.tsx` Edit                   | the pattern in Edit                                   | **replace** (a mode); Cancel replaces back           |
| 13  | `pages/pattern/ui/PatternPage.tsx` Publish                | its Publish page                                      | push (a page under it)                               |
| 14  | `pages/public-library/ui/PublicLibraryPage.tsx`           | kind, sort, query                                     | replace (already) → `useSetSearch`                   |
| 15  | `pages/public-library/ui/PublicSongPage.tsx` save song    | the saved song in the item's place                    | replace (already)                                    |
| 16  | `pages/public-library/ui/PublicSongPage.tsx` save pattern | the same, a pattern                                   | replace (already)                                    |
| 17  | `pages/lesson/ui/LessonPage.tsx` Done                     | (no-op in read mode)                                  | replace (already)                                    |
| 18  | `pages/lesson/ui/LessonPage.tsx` Edit                     | the lesson's editor                                   | replace (already, a mode)                            |
| 19  | `pages/lesson/ui/CourseLessonPage.tsx` Done               | (no-op in read mode)                                  | replace (already)                                    |
| 20  | `pages/lesson/ui/CourseLessonPage.tsx` Edit               | the course lesson's editor                            | replace (already)                                    |
| 21  | `pages/lesson/ui/LessonSettingsPage.tsx` deleted          | to the Lessons                                        | **replace** (the page is gone)                       |
| 22  | `pages/course/ui/CourseSettingsPage.tsx` deleted          | to the Courses                                        | **replace** (the page is gone)                       |
| 23  | `pages/course/ui/CoursePage.tsx` Edit                     | the course editor                                     | replace (already)                                    |
| 24  | `pages/player/ui/PlayerPage.tsx` More › Score settings    | the score's Settings                                  | push (a page)                                        |
| 25  | `widgets/content-editor/ui/NewCourseSheet.tsx`            | the new course's editor                               | push (a page)                                        |
| 26  | `widgets/content-editor/ui/NewProgressionSheet.tsx`       | the new progression's editor                          | push (a page)                                        |
| 27  | `widgets/app-nav/ui/AppNav.tsx`                           | a place's shortcut                                    | push (a place)                                       |
| 28  | `widgets/mode-switch/ui/ScoreEditToggle.tsx` Edit         | Player → editor                                       | replace (already, a mode)                            |
| 29  | `widgets/mode-switch/ui/ScoreEditToggle.tsx` Done         | editor → Player                                       | replace (already, a mode)                            |
| 30  | `widgets/curriculum/ui/JourneyLibrary.tsx`                | a level's chip                                        | replace (already) → `useSetSearch`                   |
| 31  | `widgets/welcome/ui/Welcome.tsx`                          | Sign in                                               | push (a page)                                        |
| 32  | `pages/piece/ui/OwnMusicAsk.tsx`                          | leaves a deleted song                                 | replace (already)                                    |
| 33  | `pages/account/ui/AuthCallbackPage.tsx`                   | the server's link done                                | replace (already)                                    |
| 34  | `pages/shared-song/ui/SharedSongPage.tsx`                 | the added song in the link's place                    | replace (already)                                    |
| 35  | `pages/score-editor/ui/TakePage.tsx`                      | leaves a deleted take                                 | replace (already)                                    |
| 36  | `pages/score-editor/ui/TitleField.tsx`                    | the score's Settings                                  | push (a page)                                        |
| 37  | `pages/score-editor/ui/EditorHeader.tsx`                  | the score's Settings                                  | push (a page)                                        |
| 38  | `pages/score-editor/ui/ExampleEditorPage.tsx`             | back to the lesson's editor                           | **`useUp()`** (the parents table names it)           |
| 39  | `pages/pattern-editor/model/use-pattern-editor.ts`        | Save: the saved pattern                               | replace (already)                                    |
| 40  | `pages/lesson-editor/ui/CourseEditor.tsx`                 | a new lesson's editor                                 | push (a page)                                        |
| 41  | `pages/lesson-editor/ui/CourseEditorPage.tsx` Done        | the course                                            | replace (already, a mode)                            |
| 42  | `pages/lesson-editor/ui/JourneyEditor.tsx` new lesson     | its editor                                            | push (a page)                                        |
| 43  | `pages/lesson-editor/ui/JourneyEditor.tsx` level chip     | another level in Manage lessons                       | **replace** (a view)                                 |
| 44  | `pages/lesson-editor/ui/LessonEditor.tsx` Edit music      | an example on the score                               | push (a page under the editor)                       |
| 45  | `pages/lesson-editor/ui/LessonEditorPage.tsx` Done        | the lesson                                            | replace (already, a mode)                            |
| 46  | `pages/lesson-editor/ui/CourseLessonEditorPage.tsx` Done  | the course lesson                                     | replace (already, a mode)                            |

Links that change a view in place (`KeyLink`) already carry `IN_PLACE`.
