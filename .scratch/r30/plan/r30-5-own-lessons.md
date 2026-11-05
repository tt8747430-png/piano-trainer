# R30-5: learners make their own lessons and courses

## Source

The owner, 2026-11-05: "add the possibility for the users to add their own lessons or courses".

## Today

- Lessons and courses are the app's (content) or an editor's (`editsContent(account)`, `pages/lesson-editor`, drafts on
  the server, ADR 0116). A learner cannot make one.
- The lesson editor (`LessonEditor`) is a document editor (Obsidian live preview, the floating toolbar); a course
  editor (`CourseEditor`) orders lessons.

## Will build

- **Where:**
  - Learn › Lessons gains **Your lessons** (after the levels), its rows the learner's lessons and a row "New lesson".
  - Learn › Courses gains **Your courses**, the same with "New course".
  - Both are on the phone and the laptop, offline.
- **What a learner makes:**
  - A lesson is the same document as the app's (its sections, text, scores, chords, exercises; the same blocks and
    toolbar).
  - A course is a title, a cover (picture and paint), a line, and lessons in order: their own, and the app's added by
    reference.
- **Store:** `pt-own-lessons` (`createSavedStore`, version 1) holds `lessons` and `courses`, keyed `own-lesson-n` and
  `own-course-n`. It follows the account's sync as the library does.
- **Editing:**
  - The same `LessonEditor` and `CourseEditor`, on a local source (no server draft and no Publish).
  - Done saves.
  - Settings: Rename, Duplicate, Delete (asked first), and Reset progress.
- **Reading:** an own lesson opens at `/lessons/own-lesson-n` and reads as any lesson. Its progress is counted the
  same way (learned, sections read). It never counts towards a level's journey.
- **Search** finds them.

## Left for the owner

Sharing an own lesson or course with others (Explore, or a group's shared folder as songs are): drawn later, not built
in this round.
