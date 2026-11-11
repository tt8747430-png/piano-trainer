# Feature inventory of the app (2026-11-11)

Every route, its controls with their en labels, states and role differences, read from the code. The canvas is held
to it: `coverage.md` maps each route to its board.

# FULL INVENTORY

## GLOBAL (every shell screen)

- **App nav** (widgets/app-nav/ui/AppNav.tsx). Items in order: "Learn" (/), "Songs" (/songs), "Practice" (/practice), "Profile" (/profile); "Settings" sits in the sidebar account area.
  - Sidebar: "Search" (opens the search palette), "Recents", "Guest" when signed out, "Collapse the sidebar" / "Open the sidebar".
  - PlaceActions: a round "Search" button.
  - Main region label: "Main navigation". Skip link: "Skip to content".
- **Search palette** (widgets/search-palette)
  - Field "Search everything", placeholder "Songs, chords, scales, lessons…".
  - Before typing: "Recent searches" and "Suggestions".
  - Result groups: "Practice", "Songs", "Folders", "Lessons". A row tag reads "Archived". Empty: "Nothing found."
  - Screen-reader hint: "Up and down move through the results, Enter opens one, Escape closes."
- **Toasts and banners**
  - Update banner: "A new version is ready" with "Update" / "Later"; then "Restarting…".
  - Storage full: "This device is out of room: your last change was not saved." Help: "Download a backup in Settings, then delete takes you no longer need." Button: "Settings".
  - Deletion gate dialog: "Account scheduled for deletion" / "It will be deleted on {{date}}. Keep it, or sign out and let the deletion proceed." Buttons "Sign out" and "Keep account".
  - Learner preview pill (editor/admin only): "Previewing as learner" + "Exit".
- **Welcome dialog** (widgets/welcome): "Welcome to Piano Trainer" / "Learn songs, chords and scales at the piano, at your own pace." Choice "Language" (English / Русский). Buttons "Sign in" and "Start playing".
- **Route states**
  - Pending: "Loading".
  - Error: "Something went wrong"; offline text "You’re offline. This screen opens once you’re back online."; buttons "Reload" and "Back".
  - Not found: "Page not found" plus a way back: "Go to Songs" / "Go to Learn" / "Go to Quiz" / "Go to Scales and keys" / "Go to Accompaniment" / "Go to Exercises" / "Go to Progressions" / "Go to the takes".
- **Shared controls**
  - Edit-mode toggle: "Edit" / "Done".
  - Confirm dialog: default "Cancel"; typed confirmation "Type “{{expect}}” to confirm".
  - "More" / "More actions"; "Close"; "Close the notice"; "Clear search"; "Show password" / "Hide password"; info tip "About {{name}}".
- **Tools button** (lessons, explorers) opens the "Tools" sheet:
  - "Metronome" with "Start metronome" / "Stop metronome", "Slower", "{{bpm}} BPM", "Faster", "Open Metronome".
  - "Tuner" showing "Off" or "Listening · {{reference}}".
  - Tiles for the Practice pages.
- **On-screen keyboard tools**: "Keyboard", "Hands at the keys", "Show the keyboard", "Chord held", "Resize keyboard".
  - Sustain button: "Sustain pedal — hold, or tap to latch"; "Soft and sostenuto pedals" menu with "Sost." and "Soft"; state "Latched".
- **MIDI button**: "MIDI keyboard" / "MIDI keyboard, connected".
  - Popover states: "Connect a MIDI keyboard", "Connecting…", "Try again", "Connected: {{devices}}", "{{device}} is not connected.", "No MIDI keyboard found.", "MIDI access was blocked.", "This browser can’t connect a MIDI keyboard.", "MIDI input is off."
- **Shortcuts sheet**: "Shortcuts" / "Show the shortcuts".
  - Groups: "This screen", "Anywhere" ("Collapse or open the sidebar"), "Piano keys" ("Play the keys", "An octave down, up", "Hold the pedal").
  - Each screen adds its own group: Player, Score editor, Quiz, Chord player.

---

## LEARN

### / — Learn (pages/learn/ui/LearnPage.tsx)

- **Header** (large title "Learn")
  - TitleTabs "What Learn shows": "Lessons" | "Courses".
  - Search button.
  - **EDITOR/ADMIN ONLY:** "Edit" (pencil) / "Done". Shown on the Lessons view (except Your lessons) and on the Courses view.
- **Continue** card ("Continue"): the next lesson in one tap.
- **Lessons view** (widgets/curriculum/ui/JourneyLibrary.tsx)
  - Level chips ("Level"): "Beginner", "Intermediate", "Advanced", "Professional", "Your lessons".
  - Level tab meter: "{{learned}} of {{total}} learned".
  - Chapter group headed "Chapter {{n}}: {{title}}" with "{{learned}}/{{total}}".
  - Lesson rows show:
    - "Lesson {{n}}"; prerequisites "After {{lessons}}"; kind "Lesson" / "Chords" / "Scale" / "Study" / "Song".
    - "{{known}} of {{total}} known"; "learned"; "{{percent}}% read"; tag "Next"; marker "You are here".
- **Your lessons** (OwnLessons.tsx)
  - Heading "Your lessons" with "{{learned}} of {{total}} learned".
  - Empty: "No lessons of your own yet."
  - Rows show "{{count}} section(s)".
  - Row "New lesson" opens a sheet: field "Name", button "Create lesson", error "A name needs 1 to 80 characters."
  - "Your courses" (OwnCourses.tsx): empty "No courses of your own yet."; rows show "{{count}} lesson(s)" and "{{count}} learned"; "New course" sheet with "Create course".
- **Courses view** (CourseShelves.tsx)
  - Shelves: "Beginner courses", "Intermediate courses", "Technique and exercises", "Chords and improvisation", "Method books".
  - Document card "About the courses".
  - Course card: "{{count}} lesson(s)" · "{{count}} song(s)" · "{{count}} week(s)"; "Course complete"; tag "Next".
- **EDITOR: Level editor** (widgets/curriculum/ui/LevelEditor.tsx), Lessons view in Edit
  - Header tools: draft status ("Saving…" / "Saved · not published" / "Not published" / "Offline: not saved yet" / "Not saved. It will retry with your next change.").
  - "Publishing" ⋯ menu: language group "Written in" (English/Русский), "Versions", "Discard changes".
  - "Publish" button (asks first), then "Done".
  - Level chips (same as above).
  - Fields: title ("Title" / placeholder "Level name"); "Goal" ("What a learner can do at its end").
  - Each chapter:
    - "Chapter {{n}}" with an inline name field "Chapter name".
    - ⋯ "Chapter: {{title}}" menu with "Remove chapter" (disabled if it is the only chapter). Confirm: "Remove “{{title}}”?" / "Its lessons leave this level. The lessons themselves are kept." / "Remove".
    - Step list "Steps: {{title}}": rows are draggable ("Move: {{title}}"), labelled "Lesson" or "Check", tag "Not published yet".
    - Row ⋯ "More: {{title}}" → "Remove". Toast: "Removed: {{title}}" + "Undo".
    - Empty: "No lessons yet. Add the first one below."
    - "Add lesson" → "New lesson" sheet ("Name", "Create lesson", "Adding…"). Error: "It could not be made: one of that name may be there already."
  - "Add chapter" → "New chapter" sheet ("Create chapter"). Toast: "Chapter added: {{title}}".
  - Unreadable: "The title, the goal and every chapter’s name need words in both languages. Put them right, then publish."
  - Opening: "Opening…"; failed: "Try again".
- **EDITOR: Shelf editor** (ShelfEditor.tsx), Courses view in Edit
  - "About the courses" document (editable blocks).
  - Each shelf: course rows, draggable, "{{count}} lessons", row menu "Remove".
  - Empty shelf: "No courses on this shelf. A course’s Shelf puts it here."
  - "New course" → NewCourseSheet:
    - "Name", "Shelf" chips, "Level" chips (Beginner…Professional), "Length" with "Fewer weeks" / "More weeks" ("{{count}} weeks").
    - "Create course" / "Creating…". Error: "The course could not be made: a course of that name may be there already."
  - Signed-out or learner fallback: "Only an editor manages the courses."
  - "Or add one back" lists removed rows.

### /lessons/$lessonId — Lesson (pages/lesson/ui/LessonPage.tsx, LessonLayout.tsx, widgets/lesson-view)

- **Header**
  - Back; lesson title.
  - Tools: "Learned" toggle, keyboard tools, "Tools" sheet.
  - Settings gear "Settings".
  - **EDITOR/ADMIN ONLY:** "Edit" pencil → /lessons/$id/edit. On your own lessons Edit is shown to everyone; inside your own course, Edit shows on your own lessons and, for editors, on app lessons.
- **Place line** ("Where this lesson is"): level link · chapter · "Lesson {{n}} of {{total}}"; "After:" with prerequisite links.
- **Body**
  - Contents "In this lesson" ("In this lesson: section {{at}} of {{of}}").
  - Sections with "In short" takeaways; examples with "Versions" chips; "Fingers on the scales".
  - Pattern example: "Played over “{{piece}}”", "Play", "Open in the Player", "Open in Progressions".
  - Chord rows: "Chord symbols", "Note names".
  - Question block:
    - Prompt "Choose on the keys"; "{{chosen}} of {{total}} notes".
    - Buttons "Answer", "Show the answer", "Again".
    - Results "Correct" / "Not quite" / "The answer is on the keys".
- **Floating bar** "Lesson": "Previous section", contents, "Next section". Paged reading adds "Next" and "Done".
- **End cards**: "Previous lesson", "Next lesson", "Back to the Lessons", "The course", "On to the guided songs", "Back to the course"; for your own lessons "Back to Your lessons".

### /lessons/$lessonId/settings and /courses/$courseId/$lessonId/settings (pages/lesson/ui/LessonSettingsPage.tsx; your own lessons use OwnLessonSettings.tsx)

- Title "Settings"; the lesson name large.
- ChoiceCard "Lessons read as": "One page" | "A section at a time".
- **Learner view:** group "Share" with "Share link" (toast "Link copied" / "The link could not be shared").
- **EDITOR/ADMIN view**
  - Group "The lesson":
    - Level lesson: "Level" (link to the level's Edit), "Chapter" (value).
    - Course lesson: "Course" (link).
    - "Read first" multi-dropdown (none = "Nothing").
    - "Written in" (languages, or "Not yet in full" / "Opening…").
  - Group "Share": "Publish…" with status "Not published" / "Published" / "Has changes" (level lessons only), then "Share link".
- "Reset progress" → "Reset this lesson’s progress?" / "It is marked not learned and its sections unread. Nothing else changes." → "Cancel" / "Reset". Toast "Progress reset".
- **EDITOR, app-made level lessons only:** RemoveGroup with footnote "This action can’t be undone.", "Delete" → "Delete {{title}}?" / "It will be permanently deleted, along with any unpublished changes and all saved versions." Toast "Deleted".
- **Your own lesson:** group "The lesson" with "Rename lesson" sheet (toast "Renamed") and "Duplicate" ("{{name}} copy", toast "Duplicated"); "Reset progress"; "Delete lesson" → "Delete “{{title}}”?" / "It leaves Your lessons and every course of yours that has it. Its progress goes too." Footnote "Deleting it can’t be undone."; toast "Deleted".

### /lessons/$lessonId/publish (LessonPublishPage.tsx) — EDITOR; others see "Only editors can modify this."

- DraftPublishScreen (widgets/content-editor/ui/DraftPublishScreen.tsx):
  - Title "Publish"; "Why publish here?" with "Publishing gives every learner this version the next time the app starts. Each version published is kept, so you can restore an earlier one."
  - Status chip "Not published" / "Published" / "Has changes".
  - "What changed": "Changes made since the last publication are saved and ready to publish." or "No changes since the last publication."
  - "Learner preview"; "Link" (copy: "Link copied" / "The link couldn’t be copied"); "View"; "Versions" (VersionsDialog).
  - Primary "Publish" or "Publish new version"; "Unpublish".
  - Dialogs:
    - Restore: "Restore this version?" / "This version will be republished for all learners, replacing the current one." → "Restore"; toast "Restored. Learners will receive it the next time they open the app."
    - Unpublish: "Unpublish {{title}}?" / "Learners will no longer receive it. It remains available to you as a draft." → "Unpublish"; toast "Unpublished".
  - Toasts: "Published. Learners will receive it the next time they open the app.", "You’re offline. Try again when you reconnect.", "Something went wrong. Try again."
  - Unreadable: "Every text needs words in both languages, and every example must read. Put them right, then publish."
- VersionsDialog: "Versions of {{title}}" / "Every published version is kept. Restoring a version republishes it for all learners."; "Loading versions…"; "No versions yet."; rows "Published {{date}}", "Newest", "Restore"; "Cancel".

### /lessons/$lessonId/edit and /courses/$courseId/$lessonId/edit — Lesson editor (pages/lesson-editor/ui/LessonEditorPage.tsx, LessonEditor.tsx, widgets/lesson-document)

- Learner or signed out: "Only an editor edits a lesson." + "Back to the lesson". Your own lesson: edited by its owner.
- **Header**: Back; draft status; "Publishing" ⋯ menu (language "Written in" English/Русский, "Discard changes"); "Publish" (goes to the Publish page); "Settings" gear; "Done".
- **Document**: title ("Lesson title"), summary ("What it teaches, in a sentence").
- **Toolbar "Formatting"**: "Insert" menu, "Undo", "Redo"; bubble button "Lead in bold".
- **Block handle**
  - "More: {{name}}" menu: "Add below", "Turn into" ("Text", "Section heading", "Numbered steps", "Note", "In short"), "Edit", "Style" (sheet "Style: {{name}}"), "Duplicate", "Delete" (toast "Deleted: {{name}}").
  - Drag handle.
- **Slash menu "Insert"** (empty: "Nothing of that name"). Groups "Text" / "Music" / "Ask and link".
  - Blocks: "Text", "Steps", "Note", "Rule", "Chords", "One chord on every root", "Scale", "Interval", "Notes", "Voicings", "Pattern", "Progression", "Versions", "Question", "Link", "Picture".
- **Placeholders**: "Section heading", "Type / to insert music, a note and more", "A step", "The rule", "A note", "The section in one sentence".
- **Example fields**
  - "Clef" (Treble/Bass), "Chord", "Scale", "Root", "Interval".
  - "Question" with "Answer" ("The chord the question asks to be played, as a symbol: C, Am7, F/A.").
  - "Link text"; "Opens" ("A lesson", "A chord", "A scale", "A key", "Intervals", "A progression", "As written"); "Lesson"; "Chord symbol"; "Numerals".
  - "Picture’s address" (+ info; error "An address starts https://"), "What the picture shows", empty "No picture yet: give its address under Edit."
  - "Voicing {{n}}", "Chord", "Keys: left hand | right hand", "Add a voicing", "Remove voicing {{n}}", "Name the voices S A T B".
  - "Pattern", "Heard over".
  - Example text fields "Chords" / "Notes" / "Left hand" / "Numerals", each with format info, plus "“{{word}}” doesn’t read" and "Write the example here".
  - "Edit music" (opens /lessons/$id/example); "Kept as written: move it, copy it or delete it here."; "Shown here once it reads"; "{{name}}: its settings".
- **Block style sheet** (widgets/style-editor):
  - "Presets": "Plain", "Soft", "Bold", "Paper", "Night", "Custom".
  - "Preview"; "Layout": "List" / "Cards" / "Grid"; "Spacing": "Compact" / "Standard" / "Spacious".
  - "Card": "Corner radius" ("Square", "Slight", "Medium", "Large", "Full"); "Border" ("None", "Thin", "Thick"); "Shadow" ("None", "Subtle", "Strong").
  - "Colours": "Background", "Text colour" (paints "Default", "Sand", "Sky", "Grass", "Yellow", "Lilac", "Custom colour").
  - "Reset to default".

### /lessons/$lessonId/example — Example editor (full screen; pages/score-editor/ui/ExampleEditorPage.tsx) — EDITOR

- Others: "Only editors can modify this." States: "Opening…", "Try again", "This example is no longer in the lesson."
- The score editor limited to examples. Refusals:
  - "An example has no marks: this change is not kept."
  - "…plays one note at a time…"
  - "…has one staff, or a tune over a bass…"
  - "…writes notes from whole notes to sixteenths…"
  - "…is in 2/4, 3/4, 4/4, 6/8 or 12/8, one time and key…"

### /courses/$courseId — Course (pages/course/ui/CoursePage.tsx; your own course: OwnCoursePage.tsx)

- **Header**: Back, title, gear "Settings". **EDITOR/ADMIN ONLY:** "Edit" pencil → /courses/$id/edit.
- **Card**: summary; facts "About this course" (stage, "{{count}} lessons", "{{count}} songs", "{{count}} weeks"); meter or "Course complete".
- Action button: "Start course" / "Continue" / "Review".
- "About" document. "Lessons" list (rows "Lesson {{n}}", "After {{lessons}}"). "Guided songs".
- **Your own course**: "Lessons"; empty "No lessons yet. Add the first one in Edit."; rows tagged "Your lesson"; Edit for its owner.

### /courses/$courseId/$lessonId — Course lesson (pages/lesson/ui/CourseLessonPage.tsx)

- As Lesson; place line "Lesson {{n}} of {{total}}"; ends "The course", "Previous lesson", "Next lesson", "On to the guided songs" / "Back to the course".
- **EDITOR:** Edit → /courses/$c/$l/edit.

### /courses/$courseId/settings (pages/course/ui/CourseSettingsPage.tsx; your own course: OwnCourseSettings.tsx)

- "Settings"; title.
- **EDITOR:** group "The course" → "Shelf" (value is the shelf name; link to the Courses Edit).
- Group "Share": **EDITOR:** "Publish…" (status). Everyone: "Share link".
- "Reset progress" → "Reset this course’s progress?" / "Its lessons and guided songs are marked not learned and their sections unread. Nothing else changes."
- **EDITOR, app-made courses:** RemoveGroup "Delete".
- **Your own course**: "Rename course", "Duplicate", "Reset progress" (body: "Its lessons are marked not learned and their sections unread, wherever they are read. Nothing else changes."), "Delete course" → "Delete “{{title}}”?" / "The course goes. Its lessons stay, yours in Your lessons."

### /courses/$courseId/publish (pages/course/ui/CoursePublishPage.tsx) — EDITOR

- DraftPublishScreen; preview shows "{{count}} lessons".
- Unreadable: "The title and the summary need words in both languages. Put them right, then publish."

### /courses/$courseId/edit — Course editor (pages/lesson-editor/ui/CourseEditorPage.tsx, CourseEditor.tsx, CourseParts.tsx; your own course: OwnCourseEditor.tsx)

- Others: "Only an editor edits a course." + "Back to the course".
- Header as the lesson editor.
- **Document**: "Title" ("Course title"), "Summary" ("What the course teaches").
- **"Properties"**: "Shelf" (shelf choices), "Level" (stages), "Length" ("{{count}} weeks").
- "About" document.
- **"Lessons" list**: draggable rows, row menu "Remove", "Not published yet"; "Or add one back"; empty "No lessons yet. Add the first one below."; "Add lesson" → "New lesson" / "Create lesson".
- **Your own course editor**: "Cover" ("{{picture}} · {{paint}}", folder pictures/paints); "Your lessons" and "The app’s lessons" pickers; rows tagged "Your lesson".

---

## SONGS

### /songs — Songs home (pages/songs/ui/SongsPage.tsx, LibraryScreen.tsx, LibraryHeader.tsx)

- **Header**
  - Large "Songs"; TitleTabs "My songs or Explore": "My songs" | "Explore".
  - Tools: round "Select"; "Archive and Trash" menu ("Archive: {{count}}", "Trash: {{count}}").
  - More menu: "Card style".
- **Select mode header**: title "Selected: {{count}}"; "Select all" / "Deselect all"; "Done".
- **Filters row** (LibraryFilters.tsx)
  - Search "Search songs" (hint "Search"); "Search everywhere" link.
  - Sort menu "Manual", "Name", "Recently played", "Key" (short: Manual/Name/Recent/Key).
  - Filters button "Filters" / "Filters: {{count}} on".
  - Filter sheet:
    - "Folder" ("Any", "Not in a folder"); "Progress" ("Any", "Learned", "Not yet learned"); "Key" ("Any key", "{{key}} · {{count}}"); "Level" ("Any" + stages).
    - Switch "Favourites only".
    - Footer "Show {{count}} songs" / "No songs to show".
  - Chips "Filters on": "Key: {{key}}", "Level: {{stage}}", "Not in a folder"; each "Remove {{name}}"; "Clear filters"; "Shown: {{shown}} of {{total}}".
- **Phone body**
  - "Continue" shelf ("Today", "Yesterday").
  - "Folders" list (folder rows: "{{count}} folders", "{{count}} songs", "Empty").
  - "Shared with me" ("Shared by {{name}} · {{group}}", "Groups").
  - Songs list ("Show all {{count}}").
  - Song row face: "{{count}} chords" or "Chart not available", key, "Learned".
- **Laptop**
  - Tree "Library": "All songs", "Folders" (with "Show/Hide the folders in {{name}}"), "Archive", "Trash".
  - Table: "Title", "Key", "Chords", "Level", "Learned", "Last played", "Actions".
- **Song row ⋯** ("More for {{name}}"), in groups:
  - "Play", "Edit score", "Settings"
  - "Add to favourites" / "Remove from favourites", "Move to folder…" (if allowed)
  - "Share link", "Export…"
  - "Archive" (if allowed), "Delete" (own songs only)
- **Folder row ⋯**: "Edit folder" (if it may be renamed), "Card style", "Move to folder…", "Archive folder", "Delete folder". A built-in folder shows only "Card style" (plus Move if allowed).
- **Swipes** (configurable in Settings): songs right "Favourite"; left "Move", then "Archive". Folders right "Edit".
- **Drag and drop**: zones "Drop here", "Move to {{place}}", "Archive"; screen-reader texts "Picked up…", "Over {{target}}.", "{{name}} dropped on {{target}}.", and so on.
- **Selection bar** ("Selection actions"): "Favourite" / "Unfavourite", "Move", "Export", "Archive", "Delete", "More". The order follows Settings › Selection toolbar.
- **New FAB "New"** (speed dial): "New group", "Import", "New folder", "Record", "New song". Hidden in built-in folders for learners.
- **Dialogs and sheets**
  - Archive asks:
    - At Home: "Archive “{{title}}”?" / "Archive the folder “{{name}}”?" / "Archive {{count}} items?" + "You can restore them from the Archive."
    - In a folder: "Hide “{{title}}” from this folder?" / "Hide {{count}} songs from this folder?" + "You can restore it from Archived at any time."
  - Delete: "Delete “{{title}}”?" / "Delete {{count}} selected items?" with "Your songs ({{count}}) will be moved to the Trash." and "Folders ({{count}}) will be deleted. Your songs in them are moved to the Trash; built-in songs to the archive." → "Delete" / "Cancel".
  - Move sheet "Move to": "Library" (Home), "New folder", "Here", "Move here: {{count}}". Reasons: "A folder can’t be moved into itself or one of its subfolders", "Only editors can add songs to built-in folders".
  - Folder sheet: "New folder" / "Name" / "Picture" (Note, Piano, Microphone, Guitar, Headphones, Drum, Church, Book, Heart, Star, Sun, Leaf) / "Colour" (Sand, Sky, Grass, Yellow, Lilac) / "Create folder".
  - **New song sheet** (NewSongSheet.tsx), steps "Steps":
    1. "Title"
    2. "Instruments": "Search instruments", families "Vocals" / "Keyboards", "Piano", "{{count}} selected", "One more / One {{staff}} fewer", "No instrument by that name yet."
    3. "Time and key": "Time signature", "Key signature", "Tempo", "Number of bars" ("One bar fewer" / "One bar more").
    - Buttons "Back", "Next", "Create song" / "Create and record" / "Making…". Failure: "The song could not be made. Try again once you’re online."
  - Import sheet "Import":
    - "Reading {{name}}…", "Imported", "Open the song", "Left out" (list of what was left out), "Can’t import {{name}}" with its problem text, "Choose another file".
    - Drop overlay: "Drop a MusicXML or MIDI file to import it".
  - Export sheet "Export": "MusicXML", "Compressed MusicXML (.mxl)", "MIDI", "MIDI, time aligned".
  - New group sheet: "New group", "Name" (placeholder "Sunday choir, Piano class 3B…"), "Create group".
- **Toasts** (with "Undo"): "“{{title}}” moved to {{place}}", "Moved to {{place}}: {{count}}", "“{{title}}” archived", "Archived: {{count}}", "“{{title}}” moved to the Trash", "Moved to the Trash: {{count}}", "“{{name}}” archived with its songs", "“{{title}}” restored to the library", "“{{title}}” added to/removed from favourites", "Added to favourites: {{count}}".
- **Empty states**:
  - Searches and filters: "No matching songs.", "No songs match “{{query}}”.", "No songs here at the “{{stage}}” level.", "No songs match “{{query}}” at the “{{stage}}” level.", "No favourites here yet.", "No songs here in {{key}}.", "No songs here match these filters.", "No songs match “{{query}}” with these filters."
  - Empty library: "Your library is empty" / "Create a song, or restore items from the archive." (+ "New song").
  - Empty folder: "This folder is empty" / "Create a song or folder here, or move existing songs into it." + "Move songs here" (MoveInSheet).
- **ROLE (LIBRARY_ACTS)**
  - In own folders: everyone may do everything.
  - In built-in folders, everyone: open, sort, favourite, editScore, archiveSong.
  - **EDITOR/ADMIN** additionally: addSong, importSong, moveIn, moveOut. So they get New song, Record and Import FABs, Move to… and drag in/out on built-in folders.
  - No one may rename, recolour, archive, delete or add a folder inside a built-in folder.
  - deleteSong: own songs only.

### Explore (Songs › "Explore" tab; pages/songs/ui/ExploreScreen.tsx and others)

- Search "Search songs and patterns".
- Chips "Category": "All", "Classical", "Folk", "Pop", "Studies", "Patterns", "Other".
- Shelves "New", "Most saved", "Top rated", each with "See all"; "All shelves"; "Sort".
- Cards show "Rated {{average}} out of 5" and "{{count}} saves".
- States: "Loading Explore…"; offline "Explore is available when online." + "Explore needs the internet. Your own songs are all here." + "My songs"; failed "Explore didn’t load. Try again in a moment." + "Try again".
- Empty: "Nothing published yet." / "Publish one of your songs from its Settings: Publish in library."
- No match: "No songs match “{{query}}”." / "No patterns match “{{query}}”." + "Clear".

### /songs/public/$itemId — Public song or pattern (pages/public-library/ui/PublicSongPage.tsx)

- **Header**: Back ("Explore"); round "Report".
- **Body**: "Shared by", fact chips, "Right hand" / "Left hand" (patterns), "About this song" / "About this pattern".
- Status "In your library" / "From Explore · not in your library". Button "Open in my library" / "Add to my library".
- **Rating**: "Your rating", "{{count}} stars", "{{count}} ratings" / "No ratings yet". Signed out: "Sign in to rate". Error: "Your rating didn’t go through. Try again."
- **Report dialog**: "Report this song?" / "Say what is wrong. An editor will look at it."
  - Chips "Reason": "Not theirs to share", "Offensive", "Spam", "Doesn’t play"; "A note (optional)".
  - "Cancel" / "Send report". Toast "Thanks: the song is reported."
  - Signed out: "Sign in to report a song." + "Sign in".
- States: "Reading the song…"; "This song is no longer in the Public library."; offline / failed (Explore strings).

### /songs/shared — Shared song link (pages/shared-song/ui/SharedSongPage.tsx)

- "A shared song"; "Reading the song…"; "Add to the library".
- Error: "This link holds no song: it may be cut short." + "To Songs".

### /songs/groups — Groups (pages/groups/ui/GroupsPage.tsx)

- **Header**: Back, "Groups"; More menu "Join with a link".
- List rows: "{{count}} members", "{{count}} folders", "Owner".
- Footer: "Shared folders are visible only to members of the group they are shared with."
- FAB "New group" (sheet). "Join with a link" sheet: "Invite link" field (placeholder "Paste the link you received"), "Open", error "This isn’t a Piano Trainer invite link."
- States:
  - Loading: "Loading groups…"
  - Signed out: "Share folders with a group" / "Create a group for your class, choir or band and share folders with its members. Sign in to get started." + "Sign in"
  - Empty: "No groups yet" / "Create a group for your class or choir, or join one with an invite link."
  - Offline: "You’re offline. Groups will be available once you reconnect."
  - Failed: "The request couldn’t be completed. Please try again." + "Try again"

### /songs/groups/join — Join group (pages/groups/ui/JoinGroupPage.tsx)

- "Join {{name}}", "{{count}} members", button "Join group".
- Gone: "This invite link has been turned off or is no longer valid." Signed out: guest card.

### /songs/groups/$groupId — Group (pages/groups/ui/GroupPage.tsx)

- **Header**: Back; More menu "Delete group" (owner) or "Leave group" (member).
- Name field "Group name"; "{{count}} members"; "Owner".
- **Invite card**: "Invite link"; "Share invite link" (toast "Invite link copied."); switch "Invite link"; lines "Anyone with the link can join." / "The invite link is turned off."
- **"Shared folders"** (GroupShared.tsx): rows "{{count}} songs", "Shared by you · {{group}}" / "Shared by {{name}} · {{group}}".
  - Empty: "No folders have been shared with this group yet."
  - "Share a folder…" → "Choose a folder" sheet (empty: "Create a folder in your library to share it with this group."), then the Share sheet.
- **"Members"**: rows "You", "Owner"; ⋯ "Options for {{name}}" → "Remove from group". Error: "Members couldn’t be loaded."
- **Dialogs**:
  - "Remove {{name}}?" / "They will lose access to the folders shared with this group."
  - "Leave {{name}}?" / "The group’s folders will no longer appear in Shared with me. Songs you saved remain in your library."
  - "Delete {{name}}?" / "Members will lose access to every folder shared with this group. Your own folders are not affected."
- Gone: "This group no longer exists, or you are no longer a member."

### /songs/shared-folders/$sharedId — Shared folder (pages/groups/ui/SharedFolderPage.tsx)

- Header Back ("Shared with me"); "Shared by…"; "{{count}} songs"; song rows.
- Owner: "Stop sharing" (red) → "Stop sharing {{name}}?" / "Members of {{group}} will no longer see this folder. The folder stays in your library."
- Not found: "This folder is no longer shared with you."
- Share sheet (features/share-folder): "Share with a group", "Done"; "Permissions": "Can view" / "Can edit"; "View only" / "Can edit" tags; "You don’t belong to any groups yet. Create one to share this folder."

### /songs/folders/$folderId — Folder (pages/songs/ui/FolderPage.tsx → LibraryScreen)

- **Header**: Back "Back to {{name}}"; title; "Select"; gear "Settings for {{name}}". The pencil "Edit folder" (renamable folders) opens an inline panel ("Edit folder": "Name", Picture, Colour, "Done").
- Body as Home. Last row "Archived ({{count}})".

### /songs/folders/$folderId/settings — Folder settings (pages/songs/ui/FolderSettingsPage.tsx)

- Title "Folder settings".
- Group "Groups": "Share with a group" ("{{count}} groups").
- Group "Appearance": "Card style".
- Group "In the library": "Move to folder…" (value: parent folder), "Archive folder".
- Danger: "Delete folder", footnote "Deleting a folder permanently removes it and your own songs inside. Built-in songs are moved to the archive."
  - Dialog "Delete “{{name}}”?" with "The folder will be permanently deleted." / "Your songs in it ({{count}}) will be moved to the Trash." / "Built-in songs in it ({{count}}) will be moved to the archive." / for built-in: "The folder and its built-in songs ({{count}}) will be moved to the archive."
- Rows are hidden when permissions forbid them; built-in folders get no rename, archive or delete.

### /songs/folders/$folderId/card-style and /songs/card-style — Card style (pages/songs/ui/CardStylePage.tsx)

- "Card style"; round "Reset to default".
- "Preview on": "Phone" | "Laptop"; empty "Add songs here to preview the style."
- Style editor (Presets / Layout / Spacing / Card / Colours, as above).
- "Card contents" switches: "Key", "Chords", "Level and progress".
- "Apply to…" menu ("Apply style to"): "This folder only" / "Library home only" / "This folder and its {{count}} subfolders" / "All folders ({{count}})".
  - Confirm: "Apply to all folders?" / "This style will replace the current style of all {{count}} places, including Library home." → "Apply".
  - Toast "Style applied to {{count}} places."

### /songs/folders/$folderId/archived (pages/song-archive/ui/FolderArchivedPage.tsx)

- "Archived"; Back "Back to {{name}}"; "Archived from {{name}}"; rows "Unarchive" ("Unarchive {{name}}").

### /songs/archive — Archive (pages/song-archive/ui/ArchivePage.tsx)

- "Archive"; "Restore all" (toast "All items restored to the library").
- Rows "Restore {{name}}" ("Restore"); ⋯ "More" → "Delete".
- Empty: "Nothing archived" / "Songs and folders you archive wait here, to be restored whenever you like."

### /songs/trash — Trash (pages/song-archive/ui/TrashPage.tsx)

- "Trash"; "Empty Trash" → "Empty the Trash?" / "Songs ({{count}}) and their recordings will be permanently deleted." → "Empty Trash". Toast "Trash emptied".
- Rows "Restore"; ⋯ "Delete permanently" → "Delete “{{title}}” permanently?" / "The song and its recordings will be permanently deleted."
- Empty: "The Trash is empty" / "Songs you delete wait here until you empty the Trash. Restore one to put it back where it was."

### /songs/$pieceId — Song page (pages/piece/ui/PiecePage.tsx, PieceView.tsx); also /practice/accompaniment/studies/$pieceId

- **Header**: Back; large title. Its pencil is labelled "Edit score" and opens /edit/$id for everyone. Tools: ♡ favourite (not on studies) and "Learned". Gear "Settings".
- **Song column** ("The song")
  - Cover picker ("Cover", "Change cover", "Remove cover").
  - Byline: authors ("Authors", "Words and music", "Words", "Music", "Russian text", "Harmony", "Accompaniment", "Published by", "Author unknown"), "Music", "Your version".
  - Fact line: "Key", "Time signature", "Tempo", "Scale: {{scale}}".
  - Detail chips "Details". "About the song" / "About the study" with "More".
- **Music column**
  - "Sections" (rows "{{count}} lessons · {{done}} done"; meter "Lessons done: {{done}} of {{total}}").
  - **"Your practice"**: "Played last"; "Takes" ("{{count}} recordings"); "Last take" / "Best take" ("{{percent}} right"); "Bar by bar" ("Bar {{bar}}: {{percent}} right" / "…: not played"); next step "Loop bars {{bars}} at {{speed}} speed" / "Play at {{speed}} speed".
  - "Chords"; "Progressions".
- **Details** (SongDetails.tsx), property rows edited in place:
  - "Title", "Description" (placeholder "A short description of the song"), "Composer", "Lyricist", "Arranger".
  - "Level" (read-only "Defined by the course this song belongs to." where a course sets it; choices "None" + stages).
  - "Genre" (Hymn, Worship, Christmas, Folk, Classical, Pop, Jazz, Children’s, Study).
  - "Language" (English, Russian, Ukrainian, German, Latin, Another language, "Instrumental").
  - "Tags" ("Add a tag", "Suggested tags", "Create “{{tag}}”", "Remove tag “{{tag}}”", "No tags yet.", "Done").
  - "Not set". Own song: the learner edits. Built-in song: **EDITOR/ADMIN only** edits (the draft original); learners read only.
- FAB "Practise" → Player.
- Listing with no chart: "Chart not available" / "Enter its chords bar by bar to play it in any key with any accompaniment pattern." + "Write the chart".

### /songs/$pieceId/settings — Song settings (pages/piece/ui/SongSettingsPage.tsx)

- "Settings"; head card (cover, title, subtitle).
- **Group "Library"**: "Folder" (value; only when it may move); switch "Favourite"; "Duplicate" → "Duplicate {{title}}?" / "An editable copy of this song is added to your library. The original remains unchanged."; "Archive" / "Restore".
- **Group "Share"**
  - Own song: "Publish…" with status.
  - **EDITOR/ADMIN, built-in song:** "Publish…" (draft status) → original Publish page.
  - "Share link"; "Export…" ("MusicXML, MIDI").
- **Danger**
  - Own song: "Delete song" (footnote "The song moves to the Trash in Songs, to be restored until the Trash is emptied.").
  - Your version of a catalog song: "Reset to the original" → "Reset {{title}}?" / "Your chords, staves and written-out parts will be removed, and the song will revert to the published version." → "Reset".
- Share toasts: "Link copied. Anyone who opens it can add the song to their own." / "Link copied. Anyone who opens it sees the chords as you play them." / "The link could not be made here." / "This song is too long to fit in a link."

### /songs/$pieceId/publish — Publish (pages/piece/ui/PublishPage.tsx, features/publish/ui/PublishScreen.tsx)

- **Learner's own song → Public library**
  - Title "Publish". "Why publish?" with "Found by other learners" / "Your name on it" / "Always yours" and their lines.
  - Category picker "Category". "Description" ("What the song is, its style, and who it suits"; "{{count}} of {{max}}"; "{{count}} more characters to go").
  - "As others will see it". Rights checkbox: "I confirm that the title and composer are correct and that I have the rights to share digital and modified versions of this music." + "The Terms of Use apply."
  - "Publish". Once published: "Copy link" ("Link copied." / "The link couldn’t be copied."), "View in library", "Saves" ("{{count}} saves" / "Not saved yet"), "Publish new version", "Unpublish" → "Unpublish it?" / "It leaves the Public library at once. Learners who saved a copy keep theirs. You can publish it again later."
  - Toasts: "Published to the Public library.", "Updated in the Public library.", "Removed from the Public library.", "You’re offline. Publishing needs a connection.", "You’ve published a lot this hour. Try again later.", "That didn’t go through. Try again in a moment."
  - Signed out: "Sign in to publish your songs." + "Sign in".
- **EDITOR, built-in song:** DraftPublishScreen (as for lessons). Unreadable: "The edited music can’t be read as a song. Correct it, then publish."; Delete for app-made songs.

### /songs/$pieceId/sections/$section and /practice/accompaniment/studies/$id/sections/$s — Section (pages/piece/ui/SectionPage.tsx)

- Title "Learn the {{section}}"; card "{{n}} ×", "No chord symbols".
- **"Chords"** ⓘ: rows "Learn {{chord}}", "{{held}} of {{needed}}", "Done".
- **"In time"** ⓘ: "The Player loops the chords at the song’s tempo with the click on. Play along in Wait mode to tick them off."
- **"One change at a time"** ⓘ: rows "{{from}} → {{to}}".
- **"Pattern(s)"** ⓘ: rows "On {{chord}}".
- FAB "Practise".

---

## PRACTICE

### /practice (pages/practice/ui/PracticePage.tsx)

- Title "Practice"; subtitle "Daily technique, theory and accompaniment, in one place."
- **"Up next"** / "Start here" card:
  - "Quiz review" ("{{count}} skills due for review")
  - "Last practised {{when}}" (today / yesterday)
  - "Last opened in Practice"
  - "Recommended first step"
  - "Build any chord from its root"
- **Groups**
  - "Theory": Chords, Scales and keys, Intervals, Progressions.
  - "Playing": Accompaniment, Chord player.
  - "Training": Exercises, Quiz.
  - "Tools": Metronome ("{{bpm}} BPM · {{meter}}"), Tuner ("A4 = {{hz}} Hz"), Chord finder, Circle of fifths.
  - Each row has its one-line "about".

### /practice/chords — Chords (pages/chords/ui/ChordsPage.tsx, widgets/chord-explorer)

- Header: Back, "Chords", Tools, gear.
- **Builder** "Chord": "Root", chord name; size "Triad" / "7th" / "9th" / "11th" / "13th"; "Top note"; "Inversion" (Root / 1st / 2nd / 3rd); "Hands" segmented (Both / Right / Left).
- **"Voicing"**: "Close", "Drop 2", "Drop 3", "Shell", "Rootless A", "Rootless B", "Locked hands", "So What"; each with an about text, "On this chord: {{notes}}", and disabled reasons.
- "Also written"; "Fingering" ("As voiced").
- **"Colour notes"** ⓘ: groups "Chord tones", "Tensions", "Avoid"; "As {{numeral}} in {{key}}".
- Transport "Transport": "Play" / "Stop", "Arpeggio".
- "Practise in the Player"; "Chromatic walk"; "Check yourself".

### /practice/scales — Scales and keys (pages/scales/ui/ScalesPage.tsx, widgets/scale-explorer)

- **Header**: Back, title, round "A random key", Tools, gear.
- Tabs: "Scale" / "Chords" / "Key", with subtitles "{{count}} notes", "{{count}} sharps/flats" / "No sharps or flats".
- **Scale choice**: "Tonic", "Scale".
- **Scale tab**
  - "On the staff": "Fingers" / "Degrees" / "Steps".
  - "Hands"; "Octaves" ("Fewer octaves" / "More octaves"); "Direction" ("Up and down" / "Up" / "Down").
  - "Compare with" ("None"); "Start on"; "Fingering" ("From the thumb" / "As the scale"); "Rhythm" (Even…); "Tempo"; "Play up and down".
  - Facts: "Formula", "Structure", "Relative", "Mode of", "Differs from major", "Its colour".
  - "Fingering by hand"; "Vamp"; "Practise in the Player".
- **Chords tab**: "Chords in this scale"; chord size; inversion; "Keys play" (Chords / Notes); "Walk the chords" ("Played as": "Block" / "Arpeggio"); "Open {{chord}} in Chords".
- **Key tab**
  - "Circle of fifths"; "Signature"; "Modes"; "Parallel"; "Also written"; "Beside it on the circle".
  - "Borrowed chords" ("Picardy third", "Neapolitan", "Minor plagal").
  - "Harmonise a melody note" ("Melody note", "In the key only", "Show borrowed chords too").
  - "Progressions in this key"; "Songs in this key" / "Studies in this key" / "No songs are in this key."
- Settings: see /settings/scales.

### /practice/intervals (pages/intervals/ui/IntervalsPage.tsx)

- "Root"; "Play as": "Harmonic" / "Ascending" / "Descending"; "The interval written"; "Play all".
- Lists "Simple intervals" and "Compound intervals": rows "Play {{name}}", meaning, "{{count}} semitones", songs ⓘ ("Up" / "Down" / "Songs").
- Link "Train your ear" → "Intervals by ear".

### /practice/progressions — Progressions library (pages/progressions/ui/ProgressionsPage.tsx, widgets/practice-library)

- **Header**: Back, "Progressions"; "Arrange library" / "Done" (everyone); gear.
- **Library**
  - Tree "Progressions by style": "All progressions", "Favourites", "Styles", "Mine", "Hidden".
  - Search "Search progressions"; sort "Manual" / "Name" / "Style"; filter sheet "Style" ("Any"); "Show {{count}}" / "Nothing to show".
  - Table: "Name", "Style", "Numerals", "Actions".
  - Row ⋯ "More for {{name}}": "Add to favourites" / "Remove from favourites".
  - Empty states: "No progressions match “{{query}}”.", "No favourites yet" + "Tap ⋯ on a progression, then Add to favourites.", "Progressions you keep are here.", "Nothing here yet.", "Nothing here matches these filters." + "Clear".
- **Arrange mode**:
  - "Places" (draggable; "Reorder {{name}}").
  - Place menu "{{name}}: more": "Rename…", "Show" / "Hide", "Delete folder".
  - Row menu "Rename…", "Move to…", "Hide" / "Show", "Restore original name". Sheets "Rename", "Move “{{name}}”" ("Original place").
  - "New folder" ("Create folder"); "Hidden"; "Nothing here yet."
  - Delete: "Delete the folder “{{name}}”?" / "Its items return to their original places."
  - Toasts: "“{{name}}” hidden" / "shown" / "moved to {{place}}" / "Folder “{{name}}” created" + "Undo".
- **FAB**
  - Learner: "New progression" → Keep sheet ("Name", "Chords", "Keep progression").
  - **EDITOR/ADMIN:** speed dial "New in the library" (NewProgressionSheet: "Name", "Create progression" / "Creating…", error "The progression could not be made: one of that name may be there already.") + "New progression".

### /practice/progressions/$id and /practice/progressions/line (pages/progression/ui/ProgressionScreen.tsx)

- **Header**: Back; title; keyboard tools.
  - Library or own progression: ♡. A typed line instead gets "Keep in Mine".
  - **EDITOR/ADMIN, library progression:** pencil "Edit the progression" → /edit.
  - Own progression: Edit "Edit the progression" (keep sheet) + More "More" → "Delete" ("Delete “{{name}}”?" / "It leaves Mine for good.").
  - Gear.
- **Explorer**
  - "Numerals or chords" field (errors "This progression can’t be read."; notes "These numerals are a major/minor key’s."); "Play them in {{key}}".
  - Chord size; "Approach chords" ("None", "Secondary dominants", "ii–V"); mode "Mode" ⓘ.
  - "Passing chords" ("Chords that lead from one chord to the next", "From chord to chord", "In the key only", categories, kinds with why-lines).
  - "Songs with this progression" ("Show all {{count}} songs").
  - "Practise in the Player"; "Practise in all 12 keys" (key-walk choices); "Play it in the Chord player" ("With a band, in any style").

### /practice/progressions/$id/edit — Progression editor (pages/progression-editor/ui/ProgressionEditor.tsx) — EDITOR

- Others: "Only an editor edits a progression." + "Back to Progressions".
- Header title "Edit progression"; draft status; "Publishing" menu; "Publish"; gear "Settings".
- Fields: "Name", "How it sounds"; heading "The progression" ⓘ; "Style" (Pop, Rock, Jazz, Blues, Classical, R&B / Soul, Gospel, Modal, Theory); "Lines" ⓘ "In a major key", "In a minor key".
- Unreadable: "The name and how it sounds need words in both languages, and a line of numerals must read. Put them right, then publish."

### /practice/progressions/$id/settings and /publish (pages/progression-editor/ui/ProgressionItemPages.tsx) — EDITOR

- Settings: title; group "Share": "Publish…" (status), "Share link"; RemoveGroup for progressions not shipped with the app.
- Non-editors: "Only an editor edits a progression."
- Publish: DraftPublishScreen.

### /practice/accompaniment — Accompaniment library (pages/accompaniment/ui/AccompanimentPage.tsx)

- Header "Accompaniment"; "Arrange library"; gear.
- Tree "Accompaniment by book" (Favourites, Books, Mine, Hidden); search "Search accompaniment"; table "Hands" column ("LH: {{left}} · RH: {{right}}"); links "Course in Learn", "Songs in Songs".
- Empty: "Patterns you make are kept here."; "No patterns match…".
- FAB "New pattern".

### /practice/accompaniment/patterns/$ref — Pattern (pages/pattern/ui/PatternPage.tsx)

- **Header**: Back; ♡ "Favourite"; More menu:
  - Built-in pattern: "Make your own from it", "Hide from the Player" / "Show in the Player".
  - Own pattern: "Edit", "Publish…", "Delete" → "Delete {{name}}?" / "It leaves your patterns and the Player’s list. Songs that used it go back to their own pattern." → "Delete" / "Keep it".
- Body: "Right hand" / "Left hand"; "Over a bar of C major" / "Over the first line of {{piece}}"; "Used in"; "Practise in the Player".
- Hidden note: "Hidden from the Player’s list and from its book. You can still find it under Hidden."

### /practice/accompaniment/patterns/new and …/$ref/edit — Pattern editor (pages/pattern-editor/ui/PatternEditor.tsx)

- Titles "New pattern" / "Edit pattern"; "Name" (default "{{name}} (mine)").
- "Right hand" groups (Chords, Broken chords, Moving voices, With the melody, Styles); "Left hand" groups (Held, Octaves, Arpeggios, Bass lines, Styles).
- "Save" / "Cancel".

### /practice/accompaniment/patterns/$ref/publish (pages/pattern/ui/PatternPublishPage.tsx)

- PublishScreen for own patterns ("What the pattern is, its style, and what it suits"; "Save to my patterns" on the public page).

### /practice/exercises (pages/exercises/ui/ExercisesPage.tsx)

- Library "Exercises by book" with groups "Finger technique", "Barry Harris", "Piano With Jonny"; search "Search exercises"; tag "Completed today"; "Arrange library".
- Favourites hint: "Tap ⋯ on an exercise, then Add to favourites."

### /practice/exercises/$exerciseId (pages/exercise/ui/ExercisePage.tsx)

- Header: Back, ♡.
- Sections: "Focus", "Technique".
- **"Options"**: "Exercise" ("No. {{number}}"), "Rhythm" (Even / Dotted / Reverse dotted), "Key", "Next key" (Circle of fifths / Chromatic), "Hands" (Right hand / Left hand / Both), "Octaves".
- "Tempo" ("{{bpm}} BPM", "Slower" / "Faster"); "Target tempo" ("None", "Lower the target" / "Raise the target").
- Button "Start" → /play/exercise/$id.

### /practice/quiz (pages/quiz/ui/QuizPage.tsx)

- Header: Back, "Quiz", tool "My gaps" ("To check: {{count}}").
- Groups:
  - "Chords and intervals": Chords, Intervals, Chord roles.
  - "Scales and keys": Scale building, Key signatures, Key degrees.
  - "By ear": Scales by ear, Progressions by ear, Cadences.
  - "Reading": Note reading.
- Rows show their about-line and "Runs: {{count}}".

### /practice/quiz/$trainerId — Trainer (pages/trainer/ui/TrainerPage.tsx, widgets/trainer-setup, trainer-board)

- Header: Back / "Close"; MIDI button.
- **Setup**
  - "Drill" ("Flashcards", "Name it", "Play it", "By ear"); "Options"; "Shown" (Name / Keys / Staff); "Level" (ladder levels) or "Custom".
  - Custom: "Chord qualities", "Intervals", "Keys", "Inversions" ⓘ, "Presentation" (Up / Down / Together), "Scales", "Scale types", "Arpeggiated", "Descending", "Lowest note" / "Highest note", "Accidentals".
  - Selection sheet: "{{count}} of {{total}} included", "Recommended set" / "Custom selection", "Select all", "Clear", "Restore recommended", "Include/Exclude all of {{group}}", "At least one stays included".
  - "Timing": "Time limit" ("Off"), "Advance automatically"; "Rounds" ("Until stopped").
  - Record line: "Runs:", "Best:", "Last:". Button "Start".
- **Run**
  - "Round {{n}} of {{total}}"; tally "{{count}} right", "{{count}} wrong", "Run {{count}}"; "End the run"; "Time left".
  - Prompts (e.g. "Build {{symbol}}", "Which chord is this?"); "Hint" / "Its notes"; "Play again"; "Answers".
  - Buttons "Check" (hint "Choose the keys on the on-screen piano, then Check."), "Clear", "Show answer", "Reveal", "Next", "Results".
  - Feedback: "Right", "Not quite: it’s {{answer}}", "The answer: {{answer}}".
- **Results** "Results": "Correct", "Average time", "Best run", "Cards", "Missed" / "None missed", "What to review" (rows "Open in Chords/Intervals/Scales/Progressions"), "Review the missed ones", "Again", "Done".
- My gaps empty: "No gaps found yet." + "Build chords".

### /check?of= — Check (full screen; pages/check/ui/CheckPage.tsx)

- Title "Check: {{title}}"; "Round {{n}} of {{total}}"; "Close"; MIDI.
- Result: "{{correct}} of {{total}}"; "{{title}} is now marked learned."; skill rows "Open in Chords" / "Open in Scales"; "Done".

### /practice/chord-finder (pages/chord-finder/ui/ChordFinderPage.tsx)

- Header: title, MIDI, gear.
- Empty: "Play or tap a chord" / "Hold three or more keys; the chord is named as you play." / "Play it on a connected piano, or show the keyboard to tap one."
- "Try a chord": "C major", "A minor 7th", "D dominant 7th".
- Result: state "Held" / "Last played" / "Tapped"; "Play"; "Open in Chords"; "Also read as"; "No 3rd"…; "No chord matches these notes."; "In these keys".
- "Spelled in" ⓘ; "Clear the keys"; "Forget the chords played".

### /practice/chord-player (pages/chord-player/ui/ChordPlayerPage.tsx, widgets/chord-player)

- **Header**: Back, Tools, More "Chord sheet": "New" (→ "Start a new chord sheet?" / "Your changes to this one are lost." → "Start new"), "Save as my chord sheet…" (sheet "Save as my chord sheet", "Name", "Save"; "My chord sheets are full: delete one first."; toast "Saved {{name}}"), "Share link" ("Link copied" / "Couldn’t share the link"). Gear "Chord player settings".
- **Head buttons**
  - "Chord sheet: {{name}}. Open another" → Library sheet:
    - "Chord sheets", "My chord sheets" (empty "None saved yet. Save the sheet in hand from the ⋯ menu.").
    - Row menu "Rename" / "Duplicate" / "Delete" ("Delete {{name}}?" / "The chord sheet is gone for good.").
    - "Progressions" chips.
  - "Style: {{style}}" → Style sheet (families Pop…Piano patterns; "Hear a bar of {{style}}").
  - "Tempo" ("{{count}} BPM", "Slower" / "Faster"); "Key {{key}}: transpose in Settings".
- **Sections** (Intro, Verse, Pre-chorus, Chorus, Bridge, Solo, Outro)
  - Drag "Move {{name}}"; "Section"; "Repeat" "× {{count}}" ("Fewer times" / "More times"); "Variation"; "{{count}} bars".
  - Menu "{{name}}: more": "Duplicate", "Delete" ("Delete {{name}}?" / "Its chords go with it.").
  - "Add a chord to {{name}}"; "Add section".
- **Chord tile dialog "Chord"**: "Chord symbol" ("“{{text}}” isn’t a chord"), "Length" ("Shorter" / "Longer"), "Bass note" ("Its root"), "Leading to {{chord}}", "In the key", "Put {{chord}} before {{next}}", "Delete chord", "Done".
- Toasts: "Deleted {{chord}}" / "New chords in {{key}}" + "Undo"; "Opened {{name}}".
- "Randomize chords"; "Undo" / "Redo".
- Transport "Chord player": "Play" / "Stop", "Loop {{section}}" / "Stop looping {{section}}"; "Practise in the Player", "Open in Progressions".

### /practice/chord-player/settings (pages/chord-player-settings/ui/ChordPlayerSettingsPage.tsx)

- "Settings".
- "Instruments": switches "Piano", "Bass", "Drums" (+ "{{part}} level"); "One instrument stays on: turn another on first."
- "Playing": "Count-in" ⓘ, "Repeat the sheet" ⓘ, "Volume".
- "Music": "Time signature" ⓘ (toast "Laid out in {{meter}}" + Undo); "Transpose" ("Down a semitone" / "Up a semitone", "{{from}} → {{to}}"); "Written as" ("Chord symbols" / "Roman numerals" / "Nashville numbers"); "Voicing" ("Smooth voice leading" / "Block chords") ⓘ.
- Links "On-screen piano", "Connect a piano".

### /practice/metronome (pages/metronome/ui/MetronomePage.tsx)

- "Start" / "Stop"; "Slower by {{step}}" / "Faster by {{step}}"; "BPM"; slider "Tempo"; "Tap tempo"; info ⓘ; tempo word tip.
- Beat squares "Beats" ("Beat {{beat}}": Downbeat / Accent / Beat / Silent beat; "Tap a square to accent it or leave it silent"; "Keep counting").
- **"Rhythm"**: "Time signature", "Sound" (Click / Beep / Drum kit), "Subdivision" (None / Eighth notes / Triplets / Sixteenth notes / Swung eighths).
- **"Practice aids"**
  - Switch "Speed trainer" ⓘ: "Start tempo", "Target tempo", "Increase by", "Every" ("{{count}} bars"), "Now {{bpm}} BPM, bar {{bar}}".
  - Switch "Silent bars" ⓘ: "Audible" / "Muted".

### /practice/circle-of-fifths (pages/circle-of-fifths/ui/CircleOfFifthsPage.tsx)

- Circle "Circle of fifths" ("Major keys outside, their relative minors inside"); prompt "Select a key to view its signature and diatonic chords."; info ⓘ.
- "Key signature" ("No sharps or flats" / "{{count}} sharps"); "Relative key"; "Diatonic chords" ("Play {{chord}}"); "Open in Scales and keys".

### /practice/tuner (pages/tuner/ui/TunerPage.tsx)

- "Tuner": "Note heard", "Cents off", "Play or sing a note", "{{hz}} Hz · {{cents}} cents".
- Denied: "The microphone is not available. Allow it in the browser to use the tuner."
- Settings "Tuning" › "Reference pitch" ⓘ: "A4 = {{hz}} Hz", "Lower A4" / "Higher A4".

### Practice Settings pages

- **/settings/scales** (ScalesSettingsPage.tsx): "Scales and keys" › "On the staff": switches "Tonic and leading note", "Tetrachords" (detail). Plus group "Piano" › "On-screen piano", "MIDI devices".
- **/settings/progressions**: "Written as" ⓘ (Numerals / Nashville / Chords); "Voicing" ⓘ (Voice-led / Block); "First chord’s inversion" ⓘ.
- **/settings/chord-finder**: "Chord names" › "Slash chords for inversions"; "Analysis" › "Keys that contain the chord", "Key’s scale on the keyboard"; "History" › "Keep chord history".

---

## PLAYER / EDITOR (full screen)

### /play/$pieceId — Player (pages/player/ui/PlayerPage.tsx, PlayerLayout.tsx, widgets/practice-player)

- **Bar**: "Close"; title; mode toggle (Player / "Edit" → score editor at the current bar); keyboard tools; MIDI (only when connected); gear "Player settings".
- **Gear "Player settings"**, pages:
  - "Playback" ("Count-in, pedalling, metronome and practice tempo"):
    - "Count-in" ⓘ (Off / Audible / Silent); "Pedalling" ⓘ (As marked / Off / Automatic).
    - "Metronome sound and beats"; "Metronome"; "Speed training" ("Tempo increase after each clean pass."); "Swing" (Straight / Light / Medium / Hard).
  - "Hands" ("The hands at the keys, and the hand you don’t play"): "Skin" (Light / Medium light / Medium dark / Dark); "The other hand" ⓘ (Show / Dim / Hide).
  - "Score view" ("Layout, cursor and what appears on the score"):
    - View chooser ("Sheet music", "Diagrams", "Chords over lyrics", "Grid"; "The music has no words").
    - "Clef" ⓘ (Original / Treble / Bass), for single-staff songs.
    - "Cursor" ⓘ (Off / By note / Continuous); switch "Follow the music" ⓘ + "Return to the playhead" (Never / "After {{count}} s").
    - "Show this when opening a song"; switch "Annotations".
  - "On-screen piano" ("Key size, note names and pedals"): keyboard fields.
  - Setup sections:
    - "Staves" ⓘ: "All playing" / "None playing"; per track "Play {{track}}", "Show {{track}}", "{{track}} volume"; "Sync" ("In time", "Earlier" / "Later"); "Only the chords".
    - "Accompaniment" ("Pattern, chord voicing and swing"), with the "Pattern" page: "From the chart", "Make your own pattern", "All patterns", "Right hand" / "Left hand", "Back to the pattern", "{{pattern}}, your mix", "Your choice".
    - "Chord size" ("The Simplified version plays every chord as its triad.").
- **Sheet**: progress bar "Progress"; coach tip ("Press Play to hear the song." etc., "Dismiss tip"); layout pill (Page view / Vertical scroll / Panorama; zoom "Zoom in" / "Zoom out" / "Fit the page to the width").
  - Feedback card: "{{percent}} right", "{{count}} wrong/missed/early/late", "Hide feedback".
  - Wait line: "Play {{notes}}", "Not {{note}}", "Correct", "Finished without a slip" / "Finished · slips: {{count}}", "Again", "Loop bar(s)…".
  - Count-in "Count-in: {{count}}".
- **Keys area**: keyboard, the hands view (states "Getting the hands ready…", "This device can’t draw the hands.", "The hands didn’t load.", "Show the keys", "Try again"), or a strip "Show the keyboard".
- **Transport "Playback"**: "Loop", "Restart", "Back", "Play" / "Stop", "Next".
  - Pace "Pace: {{value}}" popover: "At your own pace" ("Wait mode" / "Interpret" + lines; "Connect a piano or show the Keyboard."); "Listen and play along" ("Original tempo", "{{percent}} speed", slider "Speed", switch "Speed training" "{{percent}} faster each pass, up to 100%").
  - Click button "Metronome".
- **Foot "Practice tools"**
  - "View: {{view}}" → sheet "Pick your view" / "How the song is shown while you play." ("Show the music as": Sheet / Grid / Diagrams / Lyrics; needs "Needs words" / "Needs chord symbols"…; "Done").
    - Per view "Show" chips: "Chord symbols", "Chord positions", "Lyrics", "Finger numbers", "Note names"; Diagrams "Mode" (Animated / Summary); Lyrics "Text size", "Diagrams pinned".
  - "Transpose: {{key}}" popover: "Down a semitone" / "Up a semitone", "{{by}} semitones", "Reset", switches "Transpose key signature" ⓘ and "Transpose chord symbols" ⓘ.
  - "Version: {{level}}" → Version sheet: "Version", "Arrangement" ("Your version" / "Piano solo" / "Piano and voice"), levels "Original" / "Simplified" / "Easy" with "Difficulty {{n}} of 3" and abouts, "Its chords are already simple".
  - "Hands: {{hands}}" → "Which hands do you play?" (Both / Right / Left; switch "Hear the other hand").
  - **"More" ⋯ menu**, groups:
    - Song: "Sections" (disabled: "This song has one section."), "Song information" / "Study information".
    - Practice: "My recordings", "How did I play?" (disabled: "Record a take first"), "Annotations".
    - Tools: "Print", "Tuner".
    - Listening: "Voice commands" (disabled: "Not available in this browser"), "Rhythm game" (checked).
    - Share: "Share link", "Export…".
- **Sheets**
  - Sections: "Bar {{n}}" rows.
  - Song information: "Chords"; "Tuning" "A {{hz}} Hz" + about.
  - Recordings "My recordings": "Record" / "Stop recording", "Connect a piano to record a take.", "No recordings of this song yet.", rows "From bar {{bar}}".
  - Tuner; Export (with hand stems "Right hand" / "Left hand").
- **Annotate bar "Annotations"**: kinds "Text", "Fingering", "Dynamic", "Breath mark", "Pause", "Circle"; "Staff" (Upper / Lower); "Add"; "Clear the marks here"; "Done".
- Not found: "Go to Songs".
- Shortcuts group "Player": Play or stop, A step back / forward, Listen 5% faster / slower, Loop the bar, Back to the first bar, Loop reach controls, Remove the loop, or close.

### /play/walk, /play/chromatic, /play/progression, /play/exercise/$id (pages/player/ui/WalkPlayerPage.tsx, ChromaticPlayerPage.tsx, ProgressionPlayerPage.tsx, ExercisePlayerPage.tsx)

- Same PlayerLayout.
- **Walk**: title "Walk the chords in {{scale}}"; setup "Root", "Chord size".
- **Chromatic**: title "Chromatic walk: {{chords}}"; setup "Chord types" (families/qualities), "Root", "Direction" (Up / Down / Up and down).
- **Progression**: title "{{numerals}} in {{key}}" / "{{numerals}} from {{key}}, {{walk}}" (walks "up by semitones" …); setup "Chord size", "In all 12 keys" (One key, Chromatically rising…).
- **Exercise**: title "{{name}}: {{of}}" ("Hanon No. {{number}}"); "Next key".
  - Setup: "Exercise", "Rhythm", "Fingering", "Octaves", "Figure", "Voicing" (Close / Drop 2), "From" (Root / 3rd / 5th / 7th), "Key" / "Root", "Scale", "Chord", "Start on", "Major or minor".
  - Scale practice: "Hands", "Right/Left hand starts on", out-of-range warnings, "Tempo", "Metronome", "Ticks between loops" ⓘ ("None").
  - "Tempo ladder" ⓘ.

### /edit/$pieceId — Score editor (pages/score-editor/ui/ScoreEditorPage.tsx, ScoreEditor.tsx, EditorHeader.tsx, EditorPalette.tsx, EditorGear.tsx)

- **Who edits what**
  - Learner: their own song, or "their version" of a catalog song.
  - **EDITOR/ADMIN:** the built-in original as a server draft ("Opening…", "You’re offline. It will open when you reconnect.", "It couldn’t be opened.", "Try again"), or an unpublished editor-made song ("Back to Songs").
- **Header**: "Close"; MIDI; "Play" / "Stop"; "Undo"; "Redo"; gear "Score settings". Mode toggle back to the Player ("Practise").
- **Caret line**:
  - "Bar {{bar}}, beat {{beat}} · …", "rest", "held", "grace note", "no chord", "End of score", "{{mode}} mode".
  - Fields: "Chord symbol" (+ "Chord wizard": "Root", "Root accidental", "Chord type", "Quality", "Bass", "Root", "Add"; "Suggested chords"; "Chord not recognised"; "Delete chord"); "Lyrics" ("Syllable", "Verse {{n}}", "Previous verse" / "Next verse"); "Fingering" ("More fingerings than notes at this position.").
- **Palette** (toolbar "Note input"; "Expand palette" / "Collapse palette", "Hide palette" / "Show palette", "Show as list" / "Show as grid", "Palette categories"; greyed: "Select a note to use these tools.")
  - "Note": "Note value" (Whole…64th note), "Dotted", "Double dotted", "Grace note", "Acciaccatura", "Add note", "Rest", "Tie", "Sharp" / "Flat" / "Natural", "Enharmonic spelling"; "Input mode" ⓘ ("Replace", "Insert", "Chord" + details); "Notation"; "Tuplets" (Duplet…Nonuplet); "Semitone up/down", "Octave up/down", "Diatonic step up/down", "Previous note" / "Next note".
  - "Pitch and representation".
  - "Articulations": Staccato, Staccatissimo, Accent, Tenuto, Portato, Marcato, Fermata, Breath mark, Caesura.
  - "Ornaments": Trill, Mordent, Lower mordent, Turn, Inverted turn, Tremolo ×3, Two-note tremolo ⓘ, Arpeggio / up / down.
  - "Dynamics": ppp…pf, plus lines Slur / Crescendo / Diminuendo / 8va / 8vb / 15ma / 15mb / Glissando, and "Pedal" (Pedal down / change / up).
  - "Measures and brackets" ("Bars": "Add bar after", "Add bar before", "Delete bars", "Line break", "Join lines", "New section", "Page break", "Rests and repeats" ⓘ: One-bar repeat, Two-bar repeat, Multi-bar rest).
  - "Clef" ("G clefs" / "C clefs" / "F clefs", 17 clefs).
  - "Key signature" (picker "Cancel" / "Apply"; "No key signature").
  - "Time signature" (picker).
  - "Barlines and repeats": "Barlines and endings" (Start repeat, End repeat, 1st–4th ending, Repeat ×N, Double / Final / Single barline); "Signs and jumps" (Segno, Coda, To Coda, Fine, D.C., D.C. al Fine / Coda, D.S. …).
  - "Text": "Text", "Roman numeral", "Swing" (Swing eighths / sixteenths / Straight eighths), "Character" / "Tempo changes" ("Tempo change" popover) / "Technique" expressions (dolce…mano sinistra).
  - Greyed reasons: "Select one or more notes first.", "Available on a staff only…", "…piano staves only…", "Chord symbols are hidden. Show them in View.", "Lyrics are hidden…", "Fingerings are hidden…", "Enter notes on this staff before adding lyrics.", "Lyrics are attached to…".
- **On the score**
  - Title ("Title and credits"); tempo mark "Tempo: {{bpm}}" popover ("Beats per minute", "Decrease tempo" / "Increase tempo", "Save", "Delete").
  - Key / time / clef buttons ("Key signature, bar {{bar}}", …); touch menu "Clef, key and time…" (Clef / Key signature / Time signature).
  - Section menu "Section" (kinds Intro, Verse…; "Merge with previous section").
  - Staff menu: "Piano staves" ("Add staff above the piano", "Hide piano"); single staff ("Rename" → "Staff name", "Add staff above", "Add staff below", "Show piano", "Remove"; "At least one staff must remain visible.").
- **Selection capsule "Selection"**: "Delete", "Copy", "Cut", "Paste". Reasons: "Nothing to copy at the caret", "The clipboard is empty", "Copied notes can only be pasted onto a staff", …
- **Gear "Score settings"** (first page "Score"):
  - Acts: "View" (layout name), "Transpose" (page: "Preview", "In the Player: {{by}} ({{key}})", "Use this", "Transpose"), "Record a take" (disabled reasons "Take storage is full. Delete a take to record another." / "Recording requires a MIDI keyboard."), "Takes" ("No takes yet. Your recordings will appear here.").
  - "Settings":
    - "Instruments" ("Add, remove and reorder staves"): panel "All", "Play all", "Sort" / "Score order", "Solo / Show / Hide {{staff}}", "More for {{staff}}" ("Rename", "Change instrument", "Delete…"), "New instrument", "A score can contain up to eight staves…", "Delete {{staff}}?".
    - "Layout": "Pages" (Orientation, Page size A4 / A3 / Letter, "Margins (cm)"), "Staves" ("Staff size", "Space between staves / systems"), "Hide empty staves" ⓘ (Never / After the first system / Always), "Measures" ("Note spacing" Compact↔Wide, "Measures per system" Auto ±), "Measure numbers" (Every measure / Every system / None), "Music font", "Reset" → "Reset layout?".
    - "Note input": switch "Play notes while editing" ⓘ, "Palette position" (Left / Right).
    - "Recording": "Click while recording" ⓘ, "Hear the other staves" ⓘ, "Start countdown" (Off / 1 bar / 2 bars).
    - "On-screen piano".
  - **EDITOR draft group "Publishing"**: draft status beside the title; rows "Publish…", "Versions", "Discard changes" ("No changes since the last publication."); dialogs "Publish {{title}}?" / "Discard changes?" / Versions.
  - "Title and credits": Title, Subtitle, Composer, Lyricist, Arranger, Translator, Tune name, Source or collection, Year, Copyright; "Add credit" / "Add"; info.
- **Recording**
  - Bar "Recording": "♩ = {{bpm}}", "MIDI keyboard: {{name}}" / "Any MIDI keyboard", "Start playing to begin recording…", "Bar {{n}}", "Stop".
  - Takes sheet "Takes": rows with "Play", ⋯ "Take actions" ("Review", "Download", "Delete" → "Delete this take?"); "No notes were played.".
  - Review "Review your recording": "Your recording as written", "Quantize", "Hide raw notes", "Into" (Piano / Staves / Both staves / Upper staff / Lower staff), "Split point: {{key}}", "Write from bar {{n}}", "Save to score", "Discard" → "Discard this recording?" / "The take will be permanently deleted.".
- Unsaved notice: "This change couldn’t be saved. The score has been restored to its last saved version."
- Shortcuts group "Score editor" (about 35 entries).

### /edit/$pieceId/takes/$takeId — Take page (shell; pages/score-editor/ui/TakePage.tsx)

- Back; name field "Name"; "{{length}} · {{bpm}}"; "Download"; "Delete" (dialog); "Play".
- Piano roll "Notes: {{notes}} · bars: {{bars}}", "Play from bar {{n}}".
- "Keep bars" ("First bar", "Last bar", "Keep" → "Keep bars {{first}}–{{last}}?" / "All other bars will be permanently deleted.").
- Not found: "Go to the takes".

---

## PROFILE

### /profile (pages/profile/ui/ProfilePage.tsx)

- **Header** "Profile": bell "Notifications" / "Notifications, {{count}} unread"; "Settings" (badge when an update is ready).
- **Identity**
  - Guest: "Exploring as a guest" + "Sign in".
  - Signed in: avatar ("Edit profile photo"), "@{{handle}} · Joined {{year}}" / "Joined {{year}}". Loading: "Loading your profile…".
- **"Your practice"** tiles: "Day streak" (→ /profile/streak), "Songs learned", "Practice time" ("{{h}} h {{m}} min").
- Month calendar "This month" ("{{day}}: practised" / "not practised", "Previous month" / "Next month").
- **Badges preview** "Badges": "Almost there", "{{count}} more to your next {{badge}} badge", "{{have}} of {{goal}}", "See all".
- **Achievements preview** "Achievements": empty "None earned yet. Learn a song or finish a lesson to earn your first."; "Earned {{date}}" / "Not earned yet"; "See all".

### /profile/streak (pages/profile/ui/StreakPage.tsx)

- "Streak"; "{{count}} day streak"; "Keep the flame alive: practise today to extend your streak." / "Practise today to start a streak."; "This month"; "Longest streak"; "Days this month".

### /profile/badges and /profile/badges/$id (pages/profile/ui/BadgesPage.tsx)

- List of 6: "Streak Keeper", "Repertoire", "Lesson Finisher", "Scale Master", "Daily Devotion", "Library Builder"; tier "{{tier}}, {{earned}} of 4"; "Every tier earned".
- Detail: "Tier {{tier}} of 4" / "Not started"; "How to earn it" (way text); "Tiers" (Bronze / Silver / Gold / Platinum: goal, "Reached {{date}}" / "{{count}} to go" / "Locked"); "You: {{have}}".

### /profile/achievements and /profile/achievements/$id (pages/profile/ui/AchievementsPage.tsx)

- "Personal records": "Level" ("Level {{level}}"), "Longest streak", "Practice time", "Best accuracy", "Songs learned", "Days practised".
- "Milestones" ("Earn these once."): "First song learned", "First lesson done", "First recording", "First published song", "First MIDI session", "A perfect run".
- Detail: "Earned {{date}}" / "Not earned yet"; "How to earn it".

### /profile/notifications (pages/profile/ui/NotificationsPage.tsx)

- "Notifications"; More "More": "Mark all read", "Clear all" → "Clear all notifications?" / "They go from every device. Your badges and records stay." → "Clear" / "Cancel".
- Groups "Today" / "Yesterday" / "Earlier". Items: "Level {{level}} reached", "{{tier}} {{badge}}", "New longest streak: {{count}} days", "Best accuracy: {{percent}} %", milestone names.
- Swipe or button "Remove".
- Empty: "No notifications yet" / "Reach a new level, earn a badge or beat your best, and you’ll hear about it here."

---

## SETTINGS

### /settings (pages/settings/ui/SettingsPage.tsx, widgets/settings-screen/ui/SettingsList.tsx / SettingsNav.tsx)

- **Account card**: signed in shows name and "Synced {{when}}" / "{{count}} changes pending" / "Offline" / "Last sync failed" / "Syncing…" / "Up to date". Guest: "Sign in" / "Sync your library across your devices".
- **"App"**: "General", "Storage and backup".
- **"Piano"**: "On-screen piano", "MIDI devices" (value e.g. "Not available" / "Off" / "Blocked" / "Connecting…" / "No device" / "{{device}} away" / "{{count}} devices").
- **"Library"**: "Selection toolbar", "Swipe actions".
- **"Support"**: "User guide", "Report a problem", "About" (value: version or "Update available").
- **ADMIN ONLY:** row "Administration" (laptop sidebar also lists the 10 sections).

### /settings/general (GeneralPage.tsx)

- "Appearance": "Match system" / "Light" / "Dark".
- "Language": "English" / "Русский".

### /settings/storage (StoragePage.tsx)

- **"Device storage"** ⓘ: "Calculating storage…", "{{size}} used on this device", "Protect from clearing" → "Protected: the browser will not clear this data to free up space" / "This browser manages storage itself. Install the app or save a backup to keep your data safe."
- **"Offline piano"** ⓘ: "{{kept}} of {{total}} downloaded", "Available offline", "Download for offline use", "Downloading… {{percent}}%", "Some samples could not be downloaded. Try again when you are online."
- **"Backup"** (says): "Save a backup", "Restore from a file"
  - Confirm: "Restore this backup?" / "Everything on this device will be replaced with the backup from {{made}}. The app will then restart." (+ "Part of it was saved by another version…").
  - Errors: "This file is not a Piano Trainer backup.", "The backup could not be restored: this device is out of space. Nothing was changed.", "This browser keeps no data once the app is closed…", "This file is too large to be a Piano Trainer backup."
- **Danger**
  - "Reset progress" → "Reset progress?" / "Learned steps, practised songs and quiz results on this device will be cleared." → "Reset".
  - "Remove downloaded piano samples" → "Remove downloaded piano samples?" / "Offline, a lighter sampled piano plays until you download them again." → "Remove".
  - Footnote: "Resetting clears… Removing the samples frees their space…".

### /settings/on-screen-piano (OnScreenPianoPage.tsx; /settings/computer-keys redirects here)

- "Keys and sound": "Key size" (Fit to music / Large / All keys), "Note names" (On every C / On every key / Hidden), "Volume", "Pedals" (Sustain only / All three).
- "Display": "Chord symbol", "Note names on highlighted keys".
- "While you play": "Swipe gesture" (Scroll / Glissando), "Play on selection".
- "Placement": "Position" (Bottom / Top).
- "Computer keyboard": switch "Play with computer keyboard" ("The letter keys play the on-screen piano." / "Z and X shift the octave · Space holds the sustain pedal"); "Shortcuts" button.

### /settings/connect-piano — MIDI devices (pages/midi-settings/ui/MidiSettingsPage.tsx)

- "MIDI keyboard": switches "MIDI input", "MIDI output", "MIDI input plays sound" ("Needs MIDI input"); unsupported / denied notes.
- "Connected devices" ⓘ: "Any MIDI keyboard", device rows ("Keys", "Speaker", "Not connected"); "No MIDI devices connected"; "Turn on MIDI input to see your devices".
- "Playing": "Octave shift", "Touch" (Light / Normal / Heavy), "Pedal" (Normal / Reversed).
- "Calibrate timing" → page (value "{{latency}} ms").
- "Bluetooth": "Connect a Bluetooth MIDI keyboard" (steps: power, pair, Mac, Windows, Android, iOS, back).
- "Troubleshooting": "MIDI log" ("{{count}} messages").

### /settings/connect-piano/log (pages/midi-log/ui/MidiLogPage.tsx)

- "MIDI log" ⓘ; "Pause" / "Resume"; "Clear"; "Paused: new messages are kept but not shown"; empty "Play a key or a pedal: each message shows here".
- Rows: "Note on/off {{note}}", "Velocity", "Channel", "{{pedal}} down/up", "Controller", "Program", "Pitch bend", "Message".

### /settings/connect-piano/timing (TimingCalibrationPage.tsx)

- "Calibrate timing" ⓘ; how text; "Start" / "Stop" / "Measure again".
- Progress: "Count-in: {{beat}}", "Click {{click}} of {{count}}".
- Results: "Your piano is heard {{latency}} ms late…", "Too few taps came with a click. Try again, a key with each one.", "Kept: {{latency}} ms". No device: "Connect a MIDI keyboard to measure its timing."

### /settings/select-toolbar and /settings/swipe-actions (SelectToolbarPage.tsx, SwipeActionsPage.tsx, widgets/bar-editor)

- **Selection toolbar**: "Songs and folders"; draggable chosen actions ("{{act}}: drag to reorder", "Remove {{act}}"); "Available" ("Add {{act}}"); "All slots are in use. Remove an action to add another."; "Minimum number of actions"; "Restore defaults".
  - Actions: "Edit", "Favourite", "Move", "Export", "Archive", "Delete".
  - Footnote: "Up to four actions appear in the toolbar when you select songs or folders."
- **Swipe actions**: "Songs" / "Folders" × "Leading swipe (right)" / "Trailing swipe (left)"; "No action: this swipe does nothing."
  - Footnote: "Up to two actions on each side. Archive and Delete always ask for confirmation."

### /settings/how-to-use — User guide (pages/how-to-use)

- Sections: "Organise your library", "Play a song", "Learn a song", "Edit a score", "Play a MIDI keyboard", "Keep time", each with its paragraphs.

### /settings/feedback — Report a problem (FeedbackPage.tsx)

- "Description"; footnote "Include what you were doing… Reports are anonymous…"; "Send report"; toast "Report sent. Thank you."; offline "Sending requires an internet connection."

### /settings/about (pages/about/ui/AboutPage.tsx)

- "About"; "Version {{version}} ({{build}})".
- "Software update" ("Up to date", "Checking…", "Downloading…", "Update available", "Restarting…", "Unavailable offline", "Check failed. Try again", "Install and restart").
- "Licence" ("All rights reserved"); "Legal": "Privacy Policy", "Terms of Service".
- "Acknowledgements": Music engraving, The 3D piano, The hands at the keys, Piano samples, Offline piano samples, Drum samples, Electric bass samples, Double bass samples, Text and music fonts, The method the lessons follow, The Studies ("Public domain").

---

## ACCOUNT

### /settings/account (pages/settings/ui/AccountSettingsPage.tsx)

- **Signed in**
  - Profile row (avatar, name, "Edit profile").
  - Group: "Email" (value), "Change password", "Privacy".
  - **EDITOR/ADMIN ONLY — "Editorial access"**: "Role" = "Editor" / "Administrator"; switch "Preview as learner" ⓘ ("Hides every editing and administration control for this session. Nothing is changed; the preview ends when you exit it, reload or sign out.").
  - **"Sync"** ⓘ ("Your songs, folders, takes, progress and settings sync while you are signed in."):
    - State "Up to date" / "Syncing…" / "Offline: changes will sync when you reconnect" / "The last sync did not complete".
    - "{{count}} changes pending"; "Last synced {{when}}"; "Sync now".
  - "Sign out" (red) → "Sign out?" / "Your songs and progress stay on this device and sync again when you sign in." → "Sign out" / "Cancel".
  - "Delete account…" (footnote "Your account and synced data are deleted after 30 days.") → "Delete your account?" / body; type "DELETE"; "Keep account" / "Delete".
- **Signed out**: "You are not signed in." (or "Your account will be deleted on {{date}}. Sign in before then to keep it."); rows "Sign in", "Create account".

### /settings/account/profile — Edit profile (pages/settings/ui/EditProfilePage.tsx)

- "Edit profile"; "Save changes" / "Saving…".
- "Change photo" sheet: "Upload photo", "Pictures" (Note, Quavers, Beamed notes, Semiquavers, Piano, Guitar, Drum, Microphone, Headphones, Sound wave, Record, Radio), "Remove photo"; error "That picture couldn’t be used. Try another."
- "Name"; "Username" ("Available" / "Taken" / "Use 3–24 letters, digits or _" / "Checking…"); "Bio" ("{{count}} of {{max}}").
- "Email" › "New email" + "Send link" ("Check your inbox to confirm the new address.").
- Toasts: "Profile saved." / "That didn’t save. Try again in a moment."
- States: "Loading your profile…"; offline "Available when online".

### /settings/account/password (AccountPages.tsx)

- "Change password": "Current password", "New password", "Confirm new password"; "Update password".
- Errors: "At least 8 characters.", "The new passwords don’t match.", "The current password isn’t right.", "That didn’t go through…". Done: "Password updated.".

### /settings/privacy (AccountPages.tsx)

- "Privacy": switch "Show my profile" with "Your name and picture on songs you publish, and your profile in Explore. Off: published songs show “Piano Trainer learner”."

### /account/sign-in (pages/account/ui/SignInPage.tsx)

- "Sign in"; "Continue with Google"; "Continue with Apple" ("Coming soon"); "or"; "Email"; "Password"; "Forgot password?"; "Sign in"; "No account yet?" "Create an account".
- Errors: "Enter an email address, like name@example.com.", "Use at least 8 characters.", "That email and password don’t match an account.", "Too many tries…", "Confirm your email first…", "That didn’t go through…", "You’re offline. Connect to the internet and try again.", "Something went wrong on our side…".
- Offline banner: "You’re offline. Signing in needs a connection."

### /account/create (SignUpPage.tsx)

- "Create an account": "Your name", "Email", "Password" ("At least 8 characters. A longer phrase is stronger than a short, clever one."); "Create account".
- "Creating an account, you agree to the Terms and the Privacy notice"; "Already have an account? Sign in".
- Sent: "Check your email" / "We sent a link to {{email}}…". Errors: "That email already has an account. Sign in instead.", "Choose a stronger password…".

### /account/forgot (ForgotPasswordPage.tsx)

- "Forgotten password"; "Enter your account’s email…"; "Email"; "Send the link"; sent "If {{email}} has an account, a link to choose a new password is on its way."; "Back to sign in".

### /account/new-password (NewPasswordPage.tsx)

- "New password"; "Password"; "Save password"; "Your new password is saved."

### /auth/callback (AuthCallbackPage.tsx)

- "Signing you in…"; failed "This link didn’t work. It may have expired or been used already." + "Sign in again".

---

## ADMIN (ADMIN ONLY; pages/admin/ui/*)

- **/admin** (AdminPage.tsx): "Administration". Phone lists the sections; laptop opens the first. Non-admin: "Administration requires an administrator account."
- **/admin/$section** (AdminSectionPage.tsx). Shared states (LoadedState): "Loading…", "Could not load. Try again in a moment.", "You are offline. Administration requires an internet connection.", "The server declined the request.", "Try again".
- **Overview** (OverviewTab.tsx): "This week" tiles "Accounts", "New this week", "Active this week", "Errors this week", "Open reports", "Unpublished drafts".
- **Accounts** (AccountsTab.tsx)
  - Search "Search by name or email"; empty "No matching accounts.".
  - Cards: name/email, "Joined {{date}}" · "last sign-in {{date}}" / "never signed in".
  - **Role chips** "Role for {{name}}": "Learner" / "Editor" / "Administrator".
  - Demoting an admin asks first: "Remove administrator access?" / "{{name}}’s role changes to {{role}}, removing access to Administration." → "Change role".
- **Groups** (GroupsTab.tsx)
  - Field "New group" + "Create group"; empty "No groups yet.".
  - Rows "{{count}} members", round "Delete group" → "Delete “{{name}}”?" / "Its members keep their accounts; feature flags enabled for this group turn off for them." → "Delete".
  - "Manage members" (accounts with switches "Member of {{group}}").
- **Feature flags** (SwitchesTab.tsx)
  - Heading "New flag" ⓘ ("A feature flag enables a feature for everyone, for no one, or for selected groups…").
  - Fields "Key" (error "Use lowercase letters, digits and hyphens, starting with a letter.") and "Description"; "Add flag". Empty: "No feature flags yet.".
  - Card: label, key, round "Delete flag" → "Delete “{{label}}”?" / "The feature it controls turns off for everyone."
  - Segmented "Enabled for: …": "Everyone" / "No one" / "Groups". If Groups: "Groups with access", a switch per group ("No groups yet. Create one in Groups.").
- **Content reports** (ReportsTab.tsx)
  - Empty "No open reports.". Rows: song, "by {{name}}", reason, "Hidden" tag.
  - Actions: "Hide" / "Restore", "Suspend publishing" (→ "Suspend publishing for {{name}}?" / "They will no longer be able to publish to the Public library. Content they have already published remains."), "Dismiss".
- **Feedback** (FeedbackTab.tsx): rows "{{date}} · {{path}} · build {{build}}"; empty "No feedback yet."; footnote "Sent by learners from Settings › Report a problem. Reports are anonymous."
- **Error log** (ErrorsTab.tsx): "Once, on {{places}} screen" / "{{count}} times, on {{places}} screens"; "{{date}} · {{path}} · build {{build}}"; "Stack trace"; empty "No errors reported.".
- **Audit log** (ActivityTab.tsx): "Role changed", "Group created", "Group deleted", "Member added", "Member removed", "Feature flag saved", "Feature flag deleted", "Song hidden", "Song restored", "Publishing suspended", "Report dismissed"; empty "No administrative actions yet.".
- **Drafts** (DraftsTab.tsx): list "Drafts"; kind "Song" / "Lesson" / "Course" / "Course order" / "Level" / "Progression"; "Edited {{date}}"; "Not yet published"; empty "No drafts. Editors’ changes appear here until they are published.".
- **Component gallery** (ComponentsTab.tsx)
  - "Actions": Practise / Secondary / Soft / Quiet / Delete / Unavailable / round "Settings" / "Add" / "Link".
  - "Rows": "Row that opens a page" + "Single-line detail", "Inline choice", "Switch".
  - "Choices": "Segmented control" / "Chips" / "Pop-up button" (One / Two / Three).
  - "Progress" ("{{done}} of {{total}}"); "Empty state" ("No items yet").

---

## OTHER

- **/search** (pages/search/ui/SearchPage.tsx): the search palette as a page (see GLOBAL).
- **/legal/privacy, /legal/terms** (pages/legal/ui/LegalPage.tsx): "Privacy Policy" / "Terms of Service", "Last changed {{date}}".
  - Privacy sections: On your device, With an account, What syncs, What you publish, When something goes wrong, Where it is kept, Taking it with you and deleting it, Children, Questions.
  - Terms sections: Using the app, Your account, What you publish, The app’s own content, Other people’s work in the app, Questions, Changes.

## ROLE MATRIX (learner vs editor/admin)

- **Learn**: Edit/Done on Lessons and Courses (LevelEditor, ShelfEditor); Edit on built-in lesson and course pages; editor rows and Publish… in lesson/course Settings; Delete for app-made items; /lessons/_/edit, /courses/_/edit, /publish, /lessons/*/example. Learners get "Only an editor edits a lesson." / "…a course." / "…manages the courses."
- **Songs**: built-in folders allow addSong, importSong, moveIn, moveOut. Built-in song Details are editable. Score editor writes the original as a draft (gear "Publishing" group). Song Settings "Publish…" goes to the original's DraftPublishScreen.
- **Practice**: Progressions "New in the library" speed dial; "Edit the progression" on library progressions; progression editor, Settings and Publish (others: "Only an editor edits a progression.").
- **Settings**: Editorial access (Role + Preview as learner) for editor and admin. Administration row and sections for admin only.
- **Preview as learner** makes `account.role` read as learner app-wide, which hides all of the above; the pill "Previewing as learner / Exit" shows.
- **Signed out** is treated as a learner.
