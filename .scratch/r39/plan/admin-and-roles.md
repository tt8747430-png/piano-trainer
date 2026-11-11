# Administration, roles and Edit mode (canvas 129)

Source: the owner, 2026-11-11: "there are admin controls, no roles, no edit mode for the pages". ADR 0116 (r5 Admin,
r6 content edited in the app, r21 the lesson editor as one document), the en strings in `admin.ts`, `learn.ts`,
`editor.ts` and `settings.ts`.

## The rulings as they stand

- **Three roles, set by the server only:** Learner, Editor, Administrator (`app_metadata.role`). An editor edits the
  app's own content; an administrator also has Administration. Nothing on a learner's screen hints at either.
- **Administration** is in Settings for administrators (its own group, "Administration · 2 reports"): a list on a
  phone, a pane beside the section on a laptop. Ten sections, in order: Overview, Accounts, Groups, Feature flags,
  Content reports, Feedback, Error log, Audit log, Drafts, Component gallery. Counts in grey on the rows that need
  attention (2 reports, 6 errors, 4 drafts).
  - Accounts: search by name or email; each account its initial, email, "Joined … · last sign-in …" and its role as
    three choices (Learner, Editor, Administrator). Taking an administrator's access asks first ("Remove administrator
    access?", Change role in red).
  - Groups: New group with Create group; each group folds open to its members (Remove, Add member) and Delete group,
    which asks first.
  - Feature flags: each flag its description and key, Enabled for Everyone · No one · Groups, the groups as chips.
  - Content reports: the song, who published it and the reason; Hide or Restore, Dismiss, Suspend publishing (asks).
  - Error log: grouped ("12 times, on 3 screens"), where and which build, Stack trace folded.
  - Audit log, Feedback ("Sent by learners from Settings › Report a problem"), Drafts (kind chip, edited when, Not yet
    published), the Component gallery.
- **Edit mode is the page itself** (owner: "the page enters the edit mode and not a new page … look the same like it
  looks in preview"): an editor's bar has Edit beside ⋯. In Edit mode the bar is Done · English | Русский · Publish…
  with "Saved · not published" under it; every text is typed where it reads; each block has a handle (move) and ⋯
  (Add below, Turn into, Duplicate, Delete, with Undo); an example has its own Edit (a sheet on a phone, a popover on a
  laptop: Root, Scale, Clef, the notes as text, what it Opens). The formatting bar (Bold, Lead in bold, Undo, Redo,
  Insert) floats at the foot on a phone and sits in the bar on a laptop. Insert (or /) lists Text, Music and Ask and
  link. Properties (Written in, Read first, Level, Chapter) are chips under the summary.
- **Publish** is one page for every item: where it stands (Has changes / Published), What changed, Learner preview,
  Publish; once published its Link, View, Versions and Unpublish (red, last).
- **Learn's Edit mode:** the level's name and goal typed in place, chapters renamed in place with their ⋯, each lesson
  a Remove (Undo in the toast) and a handle, Add lesson under each chapter, Add chapter at the end; Continue hides.
- **Preview as learner** (Settings › Administration, a switch): hides every editing and administration control for
  the session; a dark strip "Previewing as learner · Exit" shows while it is on.

## History

- Canvas 129 (2026-11-11): Administration, the lesson read and edited in place, Learn's Edit mode, Preview as learner.
