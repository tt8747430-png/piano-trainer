# Lesson, course and journey editors as documents (round 21)

## What the owner asked (2026-10-30, verbatim in part)

"I want a real lesson and courses editors, not these strange text boxes with buttons to reorder, I want an endless
editor like a simple text editor but with all of our features, like the Obsidian app does with its inline rendering,
and a toolbar to add all of our options, and not edit and preview. Also I don't like these publish floating bars."

## The shape

- **One continuous document, edited where it reads** (Obsidian's Live Preview, Notion): no Edit / Preview switch, no
  form of fields. The lesson's sections are `h2` headings, its texts paragraphs, its steps an ordered list, its note
  a callout, its examples (chords, grid, scale, interval, notes, voicings, pattern, progression, variants, question,
  link) atom blocks rendered live exactly as the lesson shows them (the `LessonView` block renderers), each opening a
  small inline editor (popover on a laptop, bottom sheet on a phone) for its fields when tapped. A text example (a row
  of chords, notes, numerals) is typed in the block itself with its problem shown under it.
- **Toolbar:** a sticky formatting/insert toolbar (top under the bar on a laptop, docked above the phone's keyboard
  on a phone): paragraph/heading choice, list, callout, and **Insert** (a menu of every block kind with its icon and
  name, `INSERTABLE_BLOCKS`). Also a `/` slash menu at an empty line with the same list, filtered as typed.
- **Reorder by dragging** a block's handle (shown on hover / on the focused block), and Alt+↑/↓ from the keyboard;
  no up/down buttons. Removing a block: Backspace on a selected atom, or its handle's menu (Delete, Duplicate, Move
  up/down for accessibility), with the Undo toast.
- **Language:** the document edits one language at a time; the bar's language select (English / Русский) switches
  it. Missing text in the other language shows as an empty placeholder in that language.
- **Courses:** the course editor is the same kind of document: the title as the page's editable `h1` (no box), the
  summary a paragraph under it, the facts (shelf, level, weeks) a properties block like Obsidian's (rows: name,
  value, each value a pop-up choice in place), then the lessons as a list of rows dragged to reorder, each with a
  handle and a menu (Open, Remove), and an "Add lesson" row at the end (search by name, or New lesson). Journey
  editor: chapters as `h2` headings (renamed in place), their steps as draggable rows under them, dragged across
  chapters too.
- **Publish, no floating bar:** the draft's state sits in the screen's bar: under the title a small status ("Draft ·
  saved", "Saving…", "Published", "Offline: kept on this device"), at the right a compact **Publish** button (the
  one accent) and More (Versions, Discard draft, …). The `DraftStrip` goes; the score editor's "Edit the original"
  uses the same bar status and Publish.

## Rules

- TipTap 3 (`@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/extensions`, `@tiptap/core` are
  installed at 3.32.1). No other package without asking the lead.
- The lesson ⇄ document mapping is pure and tested round-trip (`lessonToDoc(lesson, locale)`,
  `docToLesson(doc, lesson, locale)`): every block kind survives, the other language's text is untouched.
- The draft saves as it does now (`useLessonDraft` etc.); undo is TipTap's history plus the draft's.
- en + ru for every string; 44px targets; works at 390, 320, 844×390, 1280.
