# What the owner has asked for, by area

The owner's feedback from every session, condensed and grouped by area. Read the section for an area before changing it. A point here was either built or is still open; check the code, CLAUDE.md and the ADRs before assuming which. Quotes are the owner's own words, typos fixed.

## Contents
- Score editor: layout and palette
- Score editor: editing on the score
- Signature pickers and tempo
- Header, tools row and transport (Player and editor)
- Sheet layout and engraving
- Selection and playhead
- Player views (Chordify)
- Player Setup and settings
- Song page (overview)
- Song library
- Lessons
- Practice pages
- Metronome
- PWA and touch
- Navigation, bars and the tab bar
- Menus, actions and floating buttons
- Creating things: New sheets
- Learn and the lesson and course editors
- Profile, Settings and the Account
- Songs: adding, exporting, publishing, the Public library
- Process

## Score editor: layout and palette
- It must feel like a notation app: Sibelius for iPhone, then Flat and Dorico ("we want a real editor").
  - **Removed:** the hand separations, pattern adding and verse adding inside the editor.
  - **Wanted:** "proper scores, proper functions like a real music notation software".
- **The palette:**
  - It floats over everything as a real card. It reserves no blank space, doesn't change height between tabs, and doesn't flicker.
  - It has its own place apart from the keys. The keys must not jump from over it to under it.
- **The folded palette** is "all controls in a row that is scrollable". Opened, it shows the sections as structured. Switching sections animates well.
- **What stays in the palette:** remove the tools that only duplicate what a tap on the interactive sheet does. Move the redundant actions (navigation back and next, delete) out of the note tools.
- **Menus:**
  - Names fit, are aligned, and say what they do.
  - "Bar length" and clef change are not "Add" actions, because they change rather than insert. Put things where they belong.
  - The text terms (dolce …) must be understandable before opening.
  - The Lines menu needs a better name. Use real terms: crescendo, not "get louder". Start and end options that look like duplicates mislead.
  - Repeat icons must fit.
- **Icons:** each action has its own meaningful, aligned icon, never one eye for all of them. The octave-shift and menu icons must read clearly.
- **Fingering** is an option where it belongs, not a palette mode. The fingers menu must be intuitive.
- **Mobile:** mobile needs a layout as usable as Sibelius, with no page overflow and no odd scrolling. All staves are the same width. The keyboard folds as it does everywhere else in the app.
- **Editing values:** a note chosen, then a value tapped, changes that note. The edge between editing and adding new notes must be obvious.
- **Like Flat's, exactly** (round 13): "the same features and same music notation and same icons and styles". On a laptop a docked side panel and a note-entry toolbar, never a folded bar at the foot ("annoying and not movable"); on a phone a bottom sheet that shrinks the score. Flat's sections, keys, shortcuts in every tooltip, the chord wizard, grace notes of both kinds.
- **Notation Flat has, we have** (round 13): 64ths, tuplets, octave lines, glissando, every articulation and dynamic, repeats ×N, endings 3–4, page breaks, bar repeats, multi-bar rests, tempo changes, Roman numerals, free text, the two-note tremolo.

## Score editor: editing on the score
- **Edit in place:** everything printed is editable on the score: title, tempo, notes, clefs, key, time, staff names, chords, lyrics and fingering.
- **No redundant UI:** no upper/lower staff selector, because a click on the staff chooses it.
- **Deleting:** Delete goes back note by note (1 2 3 4: delete at 4, then 3 …).
- **Moving notes:** drag a note up and down on the staff, with all the intuitive direct manipulation.
- **Chords:** typed as text, or chosen with the app's full chord interface, not a limited list.
- **Staves:**
  - Staves are just staves: add, remove, rename and hide them, with no special "melody" option.
  - Hiding a staff must never delete its notes, and toggling a staff must never clear the score.
  - A song can be a single staff with no piano.
- **New songs** (superseded round 25): no separate Customize dialog. New song is one sheet as Flat's new score; see "Creating things". (Was: a separate dialog rather than one overloaded dialog.
- **Editable songs:** every song is editable. Where something can't be edited, the learner is told why.
- **Recording:** the learner chooses what plays along and what is shown.
- **More notation:** add more of what music notation offers, such as notes shifted an octave (8va) and the rest.
- **Transpose:** with semitones, the key it lands in, Apply to key or chords, and a preview.

## Signature pickers and tempo
- **Time signature** ("as close as possible", the owner's example):
  - Current and Pickup columns, the numbers stacked large on staff lines as wheels slid up and down.
  - A cut or common time switch that draws ¢ or C across both rows.
  - ✗ ✓ at the bottom right.
- **Key signature:**
  - A bottom sheet, its grid 1–7 sharps over 1–7 flats, signs only, the chosen one tinted.
  - "Switch to natural" and an "all the parts" switch.
- **Clef:** a bottom sheet, its grid of every clef: treble, the C clefs and bass, each with its 8va/8vb/15ma/15mb.
- **Tempo:**
  - A large accent circle with the BPM and its tempo word, the beat units below it.
  - Hold and swipe to a full-screen ruler of tempo words, Largo to Presto.
- **Meters:** add every missing one, such as 2/2, 3/2, 5/4, 6/4, 7/4, 3/8 and 9/8.

## Header, tools row and transport (Player and editor)
- **One look:** the Player and the editor are one score in two modes, and controls must not jump between them.
- **The header:** "I don't like how the header looks with this bar under the header". Make the bar and the tools one designed header.
- **Navigation:** the same transport at the bottom in both modes.
- **Edit:** reached straight from the Player, without going back.
- **Transpose:** the same in the Player and the editor.
- **Clicks:** nothing traps a click (the canvas zoom toolbar once did). Check every overlay.
- **Floating controls:** the Player's and the editor's floating controls hide when the learner taps elsewhere, and auto-hide works reliably.

## Sheet layout and engraving
- **Names:** "Panorama" (was Scroll across), with better names for scroll down and Page layout. The view toggles need a better design.
- **Quality:** the page layout is always sharp on every screen and at every zoom, never pixelated. Note names read well.
- **The page canvas:** floats in an infinite space, dragged and pinch-zoomed. Its zoom controls hide when not used.
- **Vertical scroll:** takes the full width, every line the same width, with no room reserved for hidden chords.
- **Page view:** looks like a real printed score, with correct margins, line breaks, chord sizes and numbers. Study real scores from the data, and LilyPond and abcjs.
- **Engine:** Verovio, chosen by the owner, sharp in every layout.
- **Chords:** names aren't cluttered or too big when there are many.

## Selection and playhead
- **Tight selection:**
  - It covers only the notes chosen, padded from their neighbours, and never empty space.
  - It is the same in the Player and the editor and in every layout.
- **Chords and ranges:** one note inside a chord can be chosen. A range covers exactly the bars chosen, not the whole section.
- **The keyboard:** selection works with the keyboard too.
- **Notes clicked in the Player:** jump to that note, not the next ones.
- **Two marks:** what is chosen and what is playing are separate. Playing is one line across all the staves in sight, as other editors draw it, and it never jumps between staves.

## Player views (Chordify)
- **Features:** every Chordify feature except guitar: transpose, simplify, the views, chords over lyrics, diagrams, the grid, lessons.
- **The views:** make it plain which view a setting belongs to. Layout is the sheet music's alone.
- **Diagrams:**
  - Animated. The strip and the diagrams scroll and swipe by themselves, and the page never moves.
  - No odd scroll bar.
  - A swipe goes to the next chord, as well as a tap.
- **Taps on chords** (diagram, chord over lyrics, beat) move the player there and never open a dialog.
- **Chord sizes:** a long chord (Fm, slash chords) never breaks the layout.

## Player Setup and settings
- **Plain words:** the settings must be understandable: How it plays, swing, the first chord's position and Nearest.
- **Melody:** say where it comes from and let the learner choose its source. "Tune" meant nothing.
- **Hand patterns:**
  - Make plain how a hand's figure relates to the pattern above, and what choosing one does.
  - A section can have its own pattern, not one for the whole song.
- **Explanations** go in ⓘ popups.
- **Old settings:** remove the old settings and actions nobody needs.

## Song page (overview)
- **Calm:** too much information at once is wrong. Play is near the top, and the key's scale isn't at the bottom.
- **Placement:**
  - Play in the floating actions.
  - Edit beside the title in the header.
  - Learned on the right of the header.
- **Removed:** the "Learn the song step by step" card.
- **Chords:** a song with no sections must not look odd. A chord chart shows only when the sheet music is off.
- **Wording:** the owner dislikes the descriptions, so keep them short or put them behind ⓘ.

## Song library
- **One library:** "a real library" like Mindscape and memory-palaces. The built-in songs sit in their own folders, and the learner makes folders, nested to any depth.
- **Archive:**
  - A real archive in the header, not in Settings.
  - Folders can be archived too.
  - Deleting a folder deletes its songs.
- **Filters and sort:** a filter by key. No "Chords I know" or "With chords" chips.
- **Dialogs** with a text field stay above the phone keyboard, as memory-palaces does it.
- **Moving:** Move works properly, into folders nested to any depth.
- **Layout:**
  - Nothing clipped, an even grid on wide screens.
  - Icons don't jump when Select mode starts.
  - The ⋯ button shows its own hover.
- **Swipe actions** on rows.
- **Toasts** disappear as they should.
- **Import and export** like Flat's (round 13): MusicXML and MIDI in, MusicXML and MIDI out; what can't be held is listed, never dropped.

## Lessons
- **Multi-staff:** a lesson with several staves shows them as one score, never as separate pieces.
- **From the theory-book reference** (round 13): function chips, root motion, variants, a takeaway per section, a page per section on a phone, progress rings and prerequisites, SATB on voicings.
- **From the new reference pages** (round 14): rootless voicings, locked hands, modulation, slash chords, sus/6/9, the cadences in full, a practice-method course.

## Practice pages
- **Structure and best practices** from the reference apps and memory-palaces (round 13): grouped, each row its picture, name and one line; strips with ‹ ›; progression cards that play in place; intervals as rows; fingering drawn on a hand; autoplay on choosing.
- **Chords and fingerings from the new data** (round 14): every chord type, its fingering by hand and inversion, voicings to choose (drop 2, rootless, quartal …), scale fingerings as the printed books give them, more scale kinds, Hanon 1–20, a tempo ladder. "If you need more information … you can fetch the remaining pages of these websites."
- **Quiz:** one setup and four drills for every trainer; a cadence trainer.

## Metronome
- **Layout:** like the owner's example: the BPM large with −10 −1 +1 +10, a slider, Tap tempo, sound and meter, one Play, the beats as squares.

## PWA and touch
- **No browser chrome:** in the installed iPhone app, no browser bubbles, loupe or callouts. It should feel like a real app.
- **The keyboard:**
  - Can be swiped while a key is held (non-glissando), so the piano mini-map isn't needed.
  - Folds the same everywhere.
- **Fields above the phone's keyboard** as memory-palaces manages them (round 14): every field, its label and its buttons stay in sight; nothing jumps.

## Navigation, bars and the tab bar
- **Compact bars** (round 21): "why the headers take like a half of the screen". One row: Back, the title, the
  screen's actions. No tall hero.
- **Nothing hangs under the bar** (round 25): "i dont like how this published is under the header it looks
  awful, do not do this in future anymore". A status (Published, Draft · saved, a language) never sits as a
  line of its own under a screen's bar: it goes in the bar (a draft's cloud beside Publish, its word on a
  laptop, the icon alone on a phone) or in the bar's menu (the language, ticked).
- **Titles are never cut** (round 25): a long title wraps to two lines; no ellipsis where two lines say it.
- **A screen's own actions go in its bar** (round 25): Settings is the Profile's gear, Manage lessons is Learn's bar
  button for an editor. The floating + is only for creating.
- **The Profile is a tab** (round 24, memory-palaces): Learn · Songs · Practice · Profile. Settings opens from the
  Profile's gear on a phone and sits at the laptop sidebar's foot under Search ("you can put it back in the sidebar").
- **One place current at a time** (round 24): "not such things as two highlights, this is bad ui". On a laptop
  Settings is current alone; on a phone the Profile is current for Settings.
- **The tab bar as memory-palaces manages it** (round 24): shown on the four places alone; every screen a place
  opens hides it (Back the way out, the whole height); hidden while the keyboard is up; a selection's bar takes
  its slot (never two bars stacked). Floating buttons keep their gap above the home indicator then.
- **Don't decide UI trade-offs silently** (round 24): "dont make such bad decisions for yourself". A known flaw is
  fixed to the obvious right behaviour before reporting, never shipped with "say if you'd rather".

## Menus, actions and floating buttons
- **One way to each action** (round 24): "why are there duplicate buttons and actions". No button repeating a row,
  a menu item or an inline field beside it. Adding a direct way removes the old one.
- **Drag, never Move up / Move down** (round 25): "i dont like these move up move down, why dont drag and drop".
  Everything orderable (rows, chapters, blocks, songs, folders) moves by a handle, by mouse and by a finger held.
  No menu moves things; a menu holds what dragging can't (Remove, Duplicate).
- **Menu items short** (round 25): "Remove", never "Remove: The keyboard and the s…". The menu's own label names
  the thing.
- **Change it everywhere** (round 25): "when you change something change across the whole app and not just in one
  place". The score editor's menus too ("the options are old").
- **Floating buttons** (round 23): one family: the main action the honey 56px circle, a second a raised 48px one; a
  dial opens as a card of rows (tile, name, one line). Always a gap from the bottom edge.
- **Cards whole** (round 25): "don't you see how bad this looks with these cut borders". Rows inside a rounded
  card take its corners; nothing square pokes out.
- **Look before reporting:** render every changed screen at 390, 320, 844×390 and 1280 and judge it as the owner
  will; the owner spots cut borders, clipped titles and doubled controls at once.

## Creating things: New sheets
- **New song like a notation app's** (round 25, Flat's new score): its name; the staves as drawn tiles; the key
  signature from the score editor's own grid of signatures; the common time signatures as tiles; one Create button
  pinned at the foot. "Make" was a non-word; "Customize" opening a second sheet was wrong; a strip of 1/2 2/2 3/2 …
  clipped at the edge was wrong. Record is the + menu's own entry.
- **The + menu adds** (round 24): "the add menu for me means add something". New song, Record, Import, New folder.
  The Public library is a place (its own row), never an add option.
- **Every New … is a proper sheet** (round 25): New course, New lesson, New chapter, New progression, New folder:
  "the new lessons and new courses still have the old ui with just the text". One shared sheet: name, a few
  properties, one Create at the foot. Not an inline text field, not a page with a bare title.

## Learn and the lesson and course editors
- **A library, not a path** (round 21). The Lessons by level (Beginner to Professional) as chips: "why is it called a
  journey when it is not a journey anymore". No days practised or recently practised on Learn.
- **Real editors** (round 21): "an endless editor like a simple text editor but with all of our features like the
  obsidian app does with its inline rendering and a toolbar to add all of our options, and not edit and preview".
- **The toolbar floats like the palette** (round 22): distinct from the bar so it is plain what belongs to what.
- **Edit in place, as it reads** (round 25, open): "i want to have inline editor maybe the page enters the edit
  mode and not a new page … i want the editor to look the same like it looks in preview with all the features
  like the styles editor". The lesson's and course's own page switches to Edit; the document looks exactly as
  the lesson reads.
- **Manage lessons and courses as a library** (round 24): group, order by dragging, add; "not just text reorder and
  no ui". The language written in is the draft menu's, not a switch in the bar.

## Profile, Settings and the Account
- **memory-palaces' Profile** (round 24): the learner's initial, three figures, Activity, badges; Settings from its
  gear. The Account is Settings' first row; Sign out and Delete are rows asking in a dialog; the ⓘ texts went into
  the dialogs.

## Songs: adding, exporting, publishing, the Public library
- **Noji's way** (round 24, `piano-data/reference-apps/new_app_2`): one Export… sheet (MusicXML, MIDI, Share link);
  Publish as its own sheet (description, a preview of the row, Why publish ⓘ, one Publish); the Public library
  with search, chips, shelves of cards and the full list; a published song shows View · Update · Unpublish.
- **Drag and drop in the library** (round 24): rows into folders and onto the Archive, by finger and mouse.

## Process
- **Interrupting means "wait"** (round 25): when the owner interrupts a tool call, stop, take in the new message
  and continue from it; it is not a cue to argue or to launch the stopped work again.
- **The loop:** improve and review in a loop until the usage runs out, and resume on "continue".
- **Commits:** one proper commit per finished task.
- **Tests:** "you don't need to run tests for each commit, only when round finishes".
- **Agents and merging:** "merge their branches with your branch and then test", never each separately. Agents test only what changed. After the merged suite passes, merge to main.
- **CI:** disabled, local tests only.
- **Context:** compact at about 300k tokens.
- **References:** read the docs of the reference apps (Dorico help, Flat help, Chordify support pages). Look for libraries rather than hand-rolling what exists.
- **Content:** transcribe songs note for note and check them again before merging. Credit Bobrova's material ("n.b.") to Bobrova.
- **The maximum principle** (round 14): "this spawns too many agents and eats up all the usage … in most cases [doing the work yourself] is the right way". Work inline; agents only when the owner-way test passes.
- **Skills:** use impeccable for UI, superpowers where its procedure pays, the owner-way practices otherwise; know who calls which.
- **Docs and skills reach `main` at once** ("did you merge the new skills to main"); code after the full suite.
- **No committed `.env`** (2026-10-29): "WHY IS the .env commited to the git … such things should not be at all,
  now refactor all the bad decisions you took". A decision taken on the owner's behalf (committing public Supabase
  values so Vercel needed no setup) was wrong: config goes in Vercel's environment variables, never in git, and
  such decisions are the owner's.
- **Skills** (2026-10-29): Supabase's agent skills and MCP server, and Vercel's skills (agent-browser,
  building-components, deploy-to-vercel, vercel-cli, before-and-after, …) were installed: use the ones that fit
  (practices.md, Calling skills).
- **Keep working through messages** (2026-10-29): "when i send a message this doesnt mean you should stop your
  tasks, only when i say stop you stop". A new message adds to the work or redirects it; carry on with the tasks
  in hand unless the owner says stop.
- **Learners' data** (2026-10-29): the owner refused a query reading the sync tables' rows. Diagnose from logs,
  aggregates and code; never read a learner's saved data.

