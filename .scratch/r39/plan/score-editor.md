# R39-3: the score editor (`/edit/$pieceId`)

## Premium, for this area

Beside Flat for iPhone and the web, Dorico for iPad and forScore: the page is the work, one quiet bar, and a palette
that is a real instrument (Flat's categories and tiles), not two toolbars and a header.

## Rulings (feedback-log "Score editor")

- **The band under 1280** (the loop, every width, 2026-11-27). Why: at 1024 (a small laptop, an iPad on its side) the Player's band overflowed by about 70 and the Chord player's by about 30; every act stays, so what gives way is what can say less: Version history folds to its clock (its time in its tip), the song's or sheet's name shrinks first to 120 and truncates. Under 768 the phone's header takes over. A bar's last control names itself flush with the screen's edge, never centred past it (HIG, help tags). Built as a container query on the band (`BANDNARROW`, `r41_kit.py`; `r71_tips.py`).
- **No "Song" option; ☰ lists every act; Versions its own row, page and rail entry** (owner, 2026-11-26: "I dont like that teh option is called songs … all these options are now hidden just under this option"). Why: a piece may have no words, so "Song" misnames it, and a menu row that only opens another menu hides the acts a learner looks for; Flat's ☰ (083) lists Credits, Instruments, Version history, Layout, Export and Print each as a row; the versions are named for what they are. Replaces "Song the song's page" below.
- **Each layer board opens its layer** (the loop, 2026-11-26). Why: a board named for a sheet or panel is drawn to show it (the canvas is read board by board); the Audio panel folds as the Song and View panels do (Flat's panels, one shape); the Layout preview's scale is chosen so the page's margins sit on the 4/8 scale (spacing-audit).
- **R74, the mode kept across the views** (owner, 2026-11-26: "when i switch back to the sheet view it is still in edit mode and such things"). Why: the mode and the view are two independent choices, as Flat keeps Edit as its view mode changes; one of them changing never resets the other. The views in Edit are the Player's boards with mode="edit", so a view is drawn once (one implementation); the acts on what is chosen are the editor's own row and toolbar group, moved into the kit (ACTS_P, CLIP).
- **R74, View beside ←, Parts in it, Back pages** (owner, 2026-11-26: "can we merge this parts button beside the back button with the view option … all these options and settings have these drawers with x button and not back button"). Why: Parts is what the page shows, as the views are, so one button and one page hold both (Flat's instruments glyph after ← opens what is on the page); a drill-down of settings is a navigation stack with Back to its parent (Apple HIG, Navigation; Flat's 005 pages), never a modal to dismiss.
- **R74, Audio in Playback options; Song the song's page; Version history** (owner, 2026-11-26: "i dont like that we have the audio in the menu and not in the playback options, and fix all such issues"; "there are no version history … the song option really has only the versions and no the other things, refactor all"). Why each: Audio is how Play sounds, so it heads Playback options as Flat's Audio playback (005); the song's key, credits, recordings and its sharing, export and print belong to the song, so they are its page's rows under its versions (the laptop's name menu and Song panel together); Version history is Flat's menu row (083), the laptop editor's History in a phone page; ☰ keeps only the places.
- **Piano keys one page on a phone** (the loop, 2026-11-27): Piano (3D, 2D, Off) and Labels (None, C only, All notes) as two lists on one page, each headed as the Audio page's Room and Volume. Why: Flat has no such page to follow; the laptop's popover shows both lists at once (one model on both sizes), and three choices need no page of their own (Hick). Replaces "Piano keys the same (Piano, Labels)" in the ☰ ruling below; Playback options keeps Flat's row-to-page model (005).
- **R74, ☰ and the settings pages as Flat's** (owner, 2026-11-26: "and also the settings pages, and also remove the duplicate and archive the song, and also refactor the hands setting and the metronome and other settings"). Why each place: ☰ a panel under its button because Flat's menu drops from ☰ (083), its rows glyph, name and arrow as Flat's; the settings pages with ✕ at the left and the title centred because Flat's Playback options is drawn so (005); Mode, Hands, Metronome and Speed each a page of checked rows because Flat's Playback options rows each open a page and iOS Settings picks a value on its own page; Duplicate and Archive out of the song's menu at the owner's word, the library's row keeping them.
- **R74, the phone as Flat's phone editor** (owner, 2026-11-26: "refactor the mobile version the same way and to be like the flat editor the same"; "the header and the toolbar doesnt look like flat, and the play edit switch not it the header but in the setting or in the menu"). Why each place: a light header with ←, the transport pill, the keys glyph and ☰ because Flat's mobile header is exactly that (help.flat.io mobile screenshots: paste-mobile-copy, addvoice-mobile-voices); the acts row of bare glyphs under it because Flat's help puts copy, cut and paste "after Undo and Redo" in "the toolbar under the transport"; the pill's fourth glyph the speaker opening Playback options (with Metronome as a row) and bare glyphs that turn honey-deep while their sheet is open because Flat's header is exactly that (flat-score-editor 004, 005, 018, 084: the speaker opens Playback options with Audio playback, Metronome, Playback speed; the open sheet's glyph turns blue); Parts' sheet as Flat's instruments sheet (004, 084: no title, ✕, All with its switch, a filled card per part with its glyph, S and the eye, Edit instruments at the foot's right) because the owner said the sheet did not look like Flat's; Flat's purple flame tile left out because it is Flat Power's paid badge (the same mark on its Playback speed row); Practice | Edit at the top of ☰ because the owner put it in the menu and Flat's menu opens on its editor switch; MIDI as a ☰ row because Flat's menu has MIDI input; the song's name heads ☰ because Flat's header carries no title; the selection strip went because its Play and Record repeated the header and MIDI (one way to each act).
- **R74, Page · Panorama moves to the View panel as a segmented switch** (owner, 2026-11-26: "move the page panorama switch to the sidebar and remove this combobox swtich from the sidebar"). Why: how the page is laid out is a view setting, so it sits with the views (Flat sets its view mode in the layout panel); two or three short exclusive values are a segmented control (Apple HIG), both in sight, not a pop-up; the toolbar keeps the acts on notes. Bars per row and Text size follow, one shape in the panel.
- **R74, MIDI complete in its popover; Practice | Edit tabs; the accompaniment in Notation alone; View in the editor** (owner, 2026-11-26: "the midi settings still go to the wrong settings page … i dont like this showing one settings and then things like all settings"; "make the switch … a tab switch not combobox"; "why all the pattern goes to be all pattern page and not opens the all patterns in the sidebar like the player does"; "we have two diffrent contorls to add a accompaniment: they should be the same"; "when switching to the editor the view settings go: they should stay"; "remove the accompaniment settigns from the player and move to only to the notation … like the players ones"). Why each: MIDI as Flat's MIDI Settings popover in its band (`piano-data/research/flat/FLAT_PLAYER_AND_PIANO.md` §2.5: the input device and None, "No MIDI device plugged in"; output, latency and clock are Flat's paid extras a learner does not need) plus tiny-instrument's `muteExternalMIDIAudio` (`tiny-instrument/05_SOUND_MIDI.md`), so the popover holds Keyboard, Sound from the app and Record, and with no keyboard says how to connect one; nothing links away, and Settings › MIDI keyboard holds the same two for the rest of the app (output, octave shift, Touch, Pedal, Calibrate timing, MIDI log deleted). Two exclusive modes are a segmented control (Apple HIG, Segmented controls), both in sight, the current filled. The accompaniment is written in the editor, so its one control is Notation's, in the Player's shape (scope Bar 4 · Phrase 1 · Whole song as Band-in-a-Box's per-range style; Pattern ›, inversion and voicing as pop-ups; the way back to the wider scope), and Pattern › opens the Player's own library page docked in the panel with Back (Flat's panel pages), on the phone in the open palette; the Player (both sizes) keeps none of it. View stays in the editor's rail after Song, the Player's panel, the Sheet chosen and the other views opening in Practice, its Layout the toolbar's Page · Panorama (one state). Boards: PlayerDesk, PlayerApp, EditorLaptop, EditorDraftLaptop, Editor, EditorDraft, Settings, SettingsLaptop and the Practice boards whose link row says MIDI keyboard.
- **R74, Song and View panels refactored** (owner, 2026-11-26: "can you improve and refactor the song and view tabs completely: use best practices and examples and improve this"). Why: Flat's panels (the owner's 26.11 screenshots) are sections that fold under a glyph, a name and a chevron, so a long panel scans by its heads and the learner hides what they do not use; the views are pictures because the difference between them is visual (Chordify's Pick your view; scan-first 3); the chosen card is ringed, not filled, so Play keeps the one accent (seven-questions 4); a few exclusive values are a pop-up row (Apple HIG, Pop-up buttons; the owner's "no buttons in cards" ruling); Panorama is the editor's word for the same layout.
- **R74, Transpose in the band, the Section page gone** (owner, 2026-11-26: "add all the thigns that are relevant to the header like the transpose. remove the section page compeltely"; "no leave the accompaniment as it is"). Why: Transpose changes what the whole song sounds and prints in, as Play and the metronome act on the whole song, so it sits in the transport, naming the key; a stepper for semitones (a frequent, precise value, craft-details Inputs), no Apply. The accompaniment stays in the Song panel as it was.
- **R74, the band as the owner's Flat 26.11 screenshots in the chat** (owner, 2026-11-26: "did you find the new style images for the flat editro header and sidebar: serch them in the chat not in the repo"). Why: the five screenshots show ⏮, ▶ ▾, the metronome and Loop as white-filled circles, then a bare MIDI cable glyph, then the Read-only pill, and no Volume or Record in the band; the Audio panel holds Room, then Volume (Master volume card, then each part with headphones, mute and its level). So the band lost Volume and Record, MIDI became the bare glyph opening its popover (Keyboard, Record, MIDI settings ›), and the Master volume card came back to Audio.
- **R74, MIDI's popover and the redirections** (owner, 2026-11-26: "it doesnt make sense with these midi button goes to the settings popup: fix all the redirections from the player and editor pages"). Why: a transport button acts or opens its own popover under it (Volume, Playback options), so MIDI opens MIDI keyboard (the Keyboard in use as a row's value, MIDI settings › to the one home of the rest); every link goes where its words say, All patterns to the Accompaniment library (the Player's Manage patterns goes there too) at the board's size.
- **R74, Volume as Flat's, the laptop keeps its controls, the keys docked** (owner, 2026-11-26). Why: the new Flat band has a Volume button and no mixer, so the header's button is Volume and its popover holds the master, with a row to Audio for the parts (one home each); a laptop has room, and Flat's player keeps its bar while playing; the Player's keys at the editor's place and shape so Practice and Edit move nothing. Replaces "the mixer opens Audio" and the floating keyboard on a laptop.
- **R74, the page picks, History, the band** (owner, 2026-11-26: "the sheet is interactive … he can change this only to these sections, and make a proper version history also like the flat does"). Why each place: the pick on the page because the music is the object acted on (Flat and Dorico select on the score, then the panel acts); the scope segments at the Accompaniment card's head because they say what the card's rows change (proximity); the honey dot on the chord it concerns; History behind the save state in the band because Flat puts "Last save … ago" there and it opens Document History; Restore in the history band's trailing end as Flat's; Audio a rail panel because Flat's new Audio is a panel and the mixer is its shortcut; the editor's accompaniment read-only with a link because the whole song's accompaniment has one home, Practice (one home per setting). Replaces the Volume popover and the glass bar.
- **R74, rows in cards** (owner, 2026-11-26: "i dont like these buttons in these cards"). Why: a row's own acts behind its ··· (ui-and-mockups, Actions); a value chosen from a few is a pop-up button showing the value (Apple HIG, Pop-up buttons), so a card reads as one list with one shape of row; S and M per part as a mixer's strip (Flat's Volume settings, a DAW's channel). Replaces the segmented strips in the Accompaniment card and the popovers, and the text buttons under Versions.
- **R74, Flat's header, refactored** (owner, 2026-11-26; feedback-log "Player and editor together"). Why each place: Flat's new band, its order exactly (title, Go to start, Play ▾, metronome, loop, volume, MIDI, Edit ▾; the owner's Flat 26.11 screenshots, not the old 099 and 143), because the owner asked for Flat's header and the transport acts on the whole song as the title does; Listen · Wait and Hands under Play's ▾ because they say how Play plays (Flat's Audio options under the same ▾); the metronome one button cycling modes (Flat's "Change metronome mode"); Volume a popover of parts (Flat's Volume settings), so the Audio panel keeps only the room (one home); Piano keys at the Player bar's end and Export, Print at the editor toolbar's end, as Flat's keyboard toggle and file acts end its toolbar. Replaces the one glass transport bar (R74 above) and the three floating capsules; laptop only, the phone waits.
- **R74, two modes, one menu, versions in the sidebar, one transport** (owner, 2026-11-26; feedback-log "Player and editor together"). Why each place: Practice · Edit beside the title because Flat sets its mode in the title's group (the owner's Flat screenshots) and the owner ruled the switch stays in one place; a segmented control for two exclusive modes (Apple HIG, Segmented controls); Practice first because practice is the app's goal. The title's menu holds what acts on the whole song (Google Docs' File menu, Flat's title menu); the versions are content you switch between while working, so they sit in the sidebar's Song panel beside the music (Flat's and Dorico's panels, the owner's words). Record and Play at the editor bar's end, as Flat's top bar carries its playback. The transport one bar because three capsules of different fills read as three focus points (one honey control, DESIGN.md); flowkey's and Chordify's players use one bar. Replaces the version menu beside the name, Edit as its own button, the separate song acts menu and the three floating capsules.
- **R74, versions and the accompaniment in the editor** (owner, 2026-11-26: "a song can have multiple versions of itself … we should merge the accompaniment paterns in the editor so that the user can add a pattern for this specific measure that he has selected"). Why each place: the version menu stays beside the name (Flat's version list under the title; the owner's earlier ruling "the version beside the name"); its acts after a hairline, the loss last in crimson (ROWMENU's rule); Rename a centred form, the one thing a laptop centres (ui-and-mockups); the patterns at the head of the Notation panel because they act on the selection the strip above names (proximity; Band-in-a-Box's style per bar range, Flat's Insert on a selection), one row each as the Pattern library's rows, 44 high; Edit on every version since any version can now be written. Replaces "versions Accompaniment and Score, Edit only beside Score". Boards: PlayerDesk, PlayerApp, Editor, EditorLaptop, EditorDraft, EditorDraftLaptop.
- **R74, the editor as Flat's: a toolbar, panes that resize, Page and Panorama only** (owner, 2026-11-26: "reserach
  the flat editor workflow and its ui … we need real toolbar like on the laptop, real resizable interactions … remove
  the vertical scroll and leave only the page and panorama view and make proper layout for the sheet. reserach how a
  professional editor does all the spacing"). Sources: `piano-data/research/flat/FLAT_UI_SHELL_AND_MOTION.md` §1.1–1.4
  (the 56 toolbar row; `essentials` at its start: durations, dot, tie, tuplets, rest, ♮ ♯ ♭; `actions` at its end:
  delete, copy, cut, paste, zoom in and out, the display mode; the 352 notation panel at the left that collapses; the
  fit zoom told of every panel width), `FLAT_SETTINGS_TOOLS_FLOWS.md` (A4, margins 17.2 mm, staff size, measures per
  system; view modes Page / Horizontal / Vertical), `flat-score-editor` 017, 021, 099, 131, 134; Dorico 045 (a
  quarter 3½ spaces, the √2 ratio per doubled value, short notes at least 1½ spaces, the last system justified only
  past 50 % full), Dorico's Page and Galley views; Donemus' rastral table (rastral 3 = 7 mm, single-stave and piano
  music); Metronaut's SCORE_RENDERING (Page and Continuous, pinch and ⌘± zoom).
  - **Laptop:** the bar (✕ and the save state · Play | Edit · Undo, Redo, ···), then a 56 toolbar: the Palette switch,
    the note-input pill (rest, whole to 16th, dot, tie, triplet | ♮ ♯ ♭), and at the end Delete | Copy, Cut, Paste |
    − 100 % + | Page · Panorama | Piano keys. The palette is a panel at the left, 352 by default, dragged by its edge
    from 280 to 520 (Arrow keys on its focused grip), hidden by the Palette switch; the keys under the score are
    dragged by their top edge from 96 to 260. The tools the toolbar holds leave the palette (one way to each act);
    Delete and the keys' switch leave the selection strip, which keeps the note, Record and Play from here.
  - **Phone:** the bar, then Flat's second row: the same note-input pill and Delete, Copy, Cut, Paste scroll
    sideways; Piano keys and the view switch stay at its end. The palette sheet and the keys as before.
  - **Two views:** Page (the laptop's first) lays the song on A4 on a grey desk: 17.2 mm margins, a 7 mm staff, the
    title centred, Words at the left margin and Music at the right over the first system, the tempo mark over the
    first bar, Public domain at the foot, no number on page 1; systems justified to the measure, five bars on the
    first (the pickup with four), four after. Panorama (the phone's first) runs the song as one system with its
    natural spacing, scrolled sideways, as Dorico's galley. The continuous vertical view is gone; the menu's
    "Score view" row went with it (the toolbar holds the view).
  - **Note spacing everywhere the kit engraves** (`calm_parts.score_grand`): each onset's space is 3½ spaces × √(time
    to the next onset in quarters), at least 1½ spaces, widened where its syllable needs room; a justified system
    shares the spare room among the notes' spaces, the bar's lead and tail fixed.
  - Replaces "Laptop: no sidebar; the palette docked at the right (380)" (canvas 123) and the palette's place at the
    right in round 34.

- **R74, one song page, the Player; its version and mode in one control** (owner, 2026-11-26: "remove the song overview
  page"; "we currently have only the accompaniment for almost all the songs … make it more visible to the user that its
  an accompaniment and not a real score and make easier to switch between the score and the accompaniment something
  like how the flat editor switches between the readonly and the edit mode … somehow maybe we can merge this two").
  The Song boards are gone; a song opens in the Player, its Settings a window over it, its Sections on the Section
  page, Edit the original in the song's menu. The bar's middle is one capsule, "Version and mode": the version's name
  with a chevron (a menu: Accompaniment, Arrangement "None written for this song yet", Your arrangement, Simplified,
  Easy) and, at its end, Edit (the pen, and its word on a laptop), which becomes Done in the editor, as Flat's View
  and Edit share one place. The song opens on the accompaniment; the score prints "Accompaniment from the chords"
  in italic on its own line under the credits, as an engraver credits an arrangement, the music one line lower.

- **R74, the version and Edit two controls** (owner, 2026-11-26: "i dont like this edit button with this accompaniment
  … inside this control"): replaces the one "Version and mode" capsule above. The version is a glass menu button
  beside the name (kit `VERSW`, as wide as "Your arrangement"); Edit a glass button right beside it (kit `EDITB`), as
  the owner's Flat screenshots put "✎ Edit ▾" in the title's group after the transport; pressed while editing, the
  same place in Play and Edit on both sizes; no Done.

- **R74, the song's acts in the name's menu** (owner, 2026-11-26: "fix the settings: it doenst make sense with this
  window popup"): Share link, Export › (formats in a submenu), Print | Duplicate, Archive; a toast answers each,
  Archive with Undo. No Settings row, no window over the Player.

- **R74, Edit only with the Score; the views in the View panel** (owner, 2026-11-26: "the edit button belongs only to
  the score view … we dont need this your version"; "the switch between the view sheet or diagramms … in the right
  … doesnt make so much sense"): versions Accompaniment and Score; Edit beside the version only on Score; Your
  arrangement and Edit the original gone; the accompaniment's settings and credit only with it. The view switch heads
  the View panel as cards (chordify 002, "Pick your view"). Replaces "Arrangement … Your arrangement" above.

- **R74, the laptop Player as the editor: rail and panel** (owner, 2026-11-26: "make the player like the editor with
  its sidebard"; "concentrate on the laptop version"): rail Song (Accompaniment: Pattern, inversion, voicing;
  Transpose; Sections) and View (the view's settings), 352 panels, Song open at first; no gear; the version only in
  the bar; the song's acts in "Amazing Grace ▾". Pattern, Transpose, Sort and filter are pages in the panel.
  The phone is next, after the owner's word on the laptop.

- **R74, the editor's bar as Flat's, Credits a page** (owner, 2026-11-26: "port the flat editor more precisely also on
  the laptop. like the title in the header and clickin on its edit button with pen icon we go to the credits page";
  "it should open properly on a proper page this credits like in the flat, and be carefull when you use teh popups").
  Flat's top bar (`flat-score-editor` 099, 126): the score's name after the way out. On a laptop the bar reads ✕,
  Amazing Grace, a pen (Credits); the version-and-mode capsule in the middle; "Saved on this device" and ··· at the
  end. The pen, the printed title and the menu's Title and credits open one Credits page (owner, 2026-11-26: "why the credits are still a popup and not a proper page like i said?"):
  the whole screen, its own bar (Back, Credits), the fields and Save in one centred 560 column (the kit's THINGPAGE),
  on a laptop and a phone alike, as Flat's Credits (087). Never a popover, a sheet or a window. The Page view fits the score's width beside the palette and follows its width as it is
  dragged (Flat's auto-fit zoom); 100 % is that fit.
- **R74, one engraving for every score** (owner, 2026-11-26: "this accompaniment sheet doesnt look like a
  professioanal score we talked about"; "on the phone the accompaniment doesnt look like a real sheet score"). The
  Player prints the editor's page (`A4PAGE`, in the kit): on a laptop the A4 page on its grey desk at 140 %; on a
  phone a page of the phone's width on the desk, three bars a line, with the credits as the page prints them. The
  accompaniment is credited under the music's credit, in italic, at the right, as an engraver prints "Arr.".

- **R74, the laptop editor as Flat's new editor: a rail, one panel, the title a menu** (owner, 2026-11-26: "this now are
  the new settings, the images I sent you earlier were the legacy settings … we dont need legacy settings. refactor to
  the new settings"; "the header look like this and the title like this with these options"; "I dont like how this
  arrangement is centered"; "make proper wordings not takes"). Sources: the owner's Flat 26.11 screenshots (measured:
  rail 64, panel 352, panel head 64, section rows 48 and a hairline, 16 inset, toolbar 56);
  `FLAT_UI_SHELL_AND_MOTION.md` §1.1–1.2 (the rail's registry: Notation, Instruments, Layout, Audio; Search and
  Shortcuts at its foot as acts; the active entry again folds the panel; Layout hides the toolbar for its preview);
  `FLAT_SETTINGS_TOOLS_FLOWS.md` §1.3, §2.3.
  - **Bar:** ✕, then "Amazing Grace ▾" (the score's menu) and the Version and mode capsule beside it, as Flat's title,
    transport and Edit sit together; nothing centred, no pen, no ···, no status in the bar.
  - **The title's menu:** the name and "Saved on this device"; Credits, Transpose, Recordings (Versions on a draft);
    Export › (Printable PDF, MusicXML .mxl, MusicXML .musicxml, MIDI .mid), Print; Keyboard shortcuts. Credits opens the
    Credits page (THINGPAGE). Instruments, Layout and the sound are the rail's, so not here.
  - **Rail (76: its 12 labels need the room Flat's 11 do not):** Notation (the palette), Instruments (Voice, Piano:
    handle, Solo, Show, ···; New instrument, its list in the panel with Back), Layout (Pages, Staves, Hide empty
    staves, Measures, Measure numbers, Chord symbols, Text styles, each folding in place; the toolbar and keys give way
    to "Preview of your score" with zoom), Audio (Room: Off, Studio, Hall, Cathedral; Volume: Master, then each
    instrument's Solo, Mute and volume); Search (Flat's: a field over the score, Suggested acts) and Shortcuts.
  - **Gone:** Flat's legacy Document settings page drawn earlier this day (tabs Credits, Instruments, Layout, Takes and
    a preview), the toolbar's Palette switch (the rail folds the panel), the laptop ···. "Takes" is "Recordings"
    everywhere (a take, Recording 3; No recordings yet).
  - **The Player's laptop bar the same:** ✕, the song's name, the capsule beside it, at the editor's places, so Play and
    Edit move nothing (its song acts stay in its gear, so the name there is a title, not a menu).
  - **No Done** (owner, 2026-11-26: "what is with this done button. why is it here"): the capsule ends in Edit on
    both sizes and in both modes, pressed (sand) while editing; a tap goes back to playing. ✕ leaves the song.
  - **The phone the same model:** its ··· sheet holds the title menu's rows with the rail's places (Instruments,
    Layout, Audio) between them, each a sheet with the laptop panel's body; Export a sheet of the four files.
  - Not taken: Templates, Note heads, Music font (no difference a learner hears or needs), Tuning, Low-CPU playback.

- **The editor's ··· is Flat's ≡ menu** (owner, 2026-11-16: "new completely new design"; `flat-score-editor` 083–090):
  headed by the song's name and its save status; one card of Credits, Instruments, Version history, Layout, Playback
  sound, MIDI keyboard and Takes, each with its value; one of Export and Print; then Publish in Explore as its own card
  (one line on what it means, Publish to the song's Publish page). Credits is a form (Title, Subtitle, Words, Music,
  Arranged by, Copyright) with Save; Instruments lists each instrument with Solo and Show, and Add an instrument. The
  same menu on the editor and a built-in song's draft. It replaces "Score settings".

One home for each thing; only what applies shown, hidden not greyed; the palette and its menus as Flat's, every section
in one scroll; the piano from the editor's bar on a phone; professional terms; laptop a docked side panel, phone a
bottom sheet that shrinks the score; everything printed is edited on the score (the title opens Title and credits, the
printed time and key signatures open their categories); the gear holds only what the score does not print.

- The editor's draft of a built-in song (canvas 135, ADR 0116, from "no roles, no edit mode for the pages"): an editor opens it from the song's ··· Edit the original. Under the bar, a Publishing pill and the save state (Saved · not published, Saving…, Offline: not saved yet, Not saved). Publishing holds Publish… (asks, as it reaches every learner), Versions (each published one, Restore asks) and Discard changes (asks; cannot be undone). Opening, opening offline, can't open and not an editor are full-screen states.

## Today

Phone: ✕ and Done both, then a filled piano circle, a filled honey Play, Undo, Redo and the gear, all in one row with
two filled circles; the score; a palette with durations over a row of icon-only category tabs; the piano.
Files: `src/pages/score-editor`, `src/widgets/score-sheet`, `src/features/score-editor`.

## Will build (drawn, canvas [The ideal Songs](https://claude.ai/artifact/Ana84hFnmzQCBFuvNZRmXB), row 3)

1. **Bar**: Done (the one way out), then at the right Undo, Redo, a hairline, **Piano keys** (a toggle that fills),
   **Play** (the only coloured button; becomes Stop), **···** = Score settings: Instruments and staves, Page layout,
   Playback sound, MIDI keyboard. No ✕.
2. **The score**: the title and credits as printed (tap = Title and credits), "Verse · ♩ = 80", the systems with chord
   symbols and bar numbers; the selected note boxed in blue.
3. **Palette, phone**: a white sheet with a grip. Folded: one scrollable row of the current category's tools over a
   segmented row of **named** categories: Notes · Accidentals · Articulation · Dynamics · Bar · Text. The grip opens
   every section in one scroll (Flat's way), the score shrinking above it.
   - Notes: rest, whole to 32nd, dot, tie, triplet. Accidentals: double flat to double sharp. Articulation: staccato,
     accent, tenuto, marcato, fermata, slur, arpeggio. Dynamics: ppp to fff, crescendo, diminuendo. Bar: time
     signature tile (3/4), key signature, clef, start and end repeat, double barline, add a bar, tempo. Text: chord
     symbol, lyrics, text, Roman numeral, rehearsal mark.
4. **Piano** under the palette when on, C4 marked, the entered note's key lit.
5. **Laptop**: the page in the middle on white; the palette docked at the right, every section in one scroll; the piano
   from the bar under both.

## Canvas 123 (2026-11-11): the editor is the Player in Edit

Owner: "all pages except the chord finder and song player should be refactored … the must time you need to spend on
the editor and songs and practice pages"; CLAUDE.md: "the Player's score in Edit mode, sharing its bar and transport".

- **Bar:** the Player's glass bar: ✕, a **Play · Edit** switch in the middle, Undo, Redo and ··· (Score settings) at the
  right. Done goes: the switch to Play is the way back to listening, ✕ the way out. This replaces R39-3's "Done, no ✕".
- **Selection strip** heads the palette: "C5 · half note" over "Bar 4 · beat 1 · “sweet”", then Delete, Piano keys and
  the one honey button, Play from here.
- **Palette:** seven named categories (Notes, Accidentals, Articulations, Dynamics, Lines, Bar, Text); notes, rests, tie,
  slur and grace drawn as engraved icons, not font glyphs; 48 tiles, each with its name and shortcut as a tip. Folded on
  a phone to one row under the categories; the grabber (44 high) opens every section in one scroll.
- **Keys** under the palette on a phone (112 high), under the score on a laptop, the selected note lit.
- **Laptop:** no sidebar; the page in the middle, the palette docked at the right (380), every section in one scroll.
- **··· Score settings:** Instruments and staves, Page layout, Playback sound, MIDI keyboard; Export, Print. Title, key,
  time and tempo are edited on the score.
