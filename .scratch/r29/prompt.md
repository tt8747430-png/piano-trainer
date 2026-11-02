# Round 29: one consistent app

Audit, app bar, navigation, controls, settings, Profile, Explore in Songs, professional copy, edit in
place, learner view, publishing, real settings, the Player's practice flow, customisable bars, pages
and cards.

## Goal
Make Piano Trainer feel like one professional, finished app:
- every action looks, sits and works the same everywhere;
- plain musical language, no developer terms;
- as close to the reference apps as our look allows (Noji, Quizlet, Flat, memory-palaces, the piano
  player app in my screenshots).

The references show what to add as well as what to improve: build what we don't have.

## How to work
- **Rules:** CLAUDE.md and the owner-way skill bind every change. Read its
  `references/feedback-log.md` and `ux-principles.md` first, so nothing I rejected comes back.
- **Autonomy:** don't ask, and don't stop between rounds. My questions go in the report. Where a
  choice is mine, take the sensible default and log why.
- **Order:** research, then plan, then build. Don't patch what the plan will replace.
- **Commits and pushes:** audit → spec → rounds. One commit per task. Push each round after
  typecheck, lint and the related tests pass. Run the full suite and the build before `main`.
- **Agents:** few, but use them where a part is large and separate.
- **Never decide for me:** security, roles, legal meaning or hosting. A migration or access rule
  waits for my review before `main`. Never break a standing rule below without asking.
- **References:** study one before building its feature: its layout on phone and laptop, its words,
  its behaviour. "As close as possible" means layout, interaction and features. Where I say I
  described an app from memory, check it against its help pages or screenshots first.
- **Everywhere:** a change is made everywhere it applies, never on one screen only.

## Words used in this prompt
- **App bar:** the bar at the top of every screen (back, title, tabs, actions). Today it reads as a
  loose title and changes height between pages.
- **Edit mode:** a pencil in the app bar turns the page itself editable; Done leaves. There are no
  separate "Manage" pages.
- **Learner view:** an admin or editor sees the app as a learner does, for this session only.
- **Built-in folders:** the app's own folders of songs (the spec gives them their final name in the
  glossary).

## Standing rules (from my feedback; every screen, every round)
1. **App bar**
   - Compact and one row, never half the screen; titles never cut.
   - The screen's actions (Settings, Edit, Share) live in it.
   - Nothing goes under it: no "Published" strip, no status bar.
2. **One selected look:** a control or item is highlighted one way only, never two highlights at
   once.
3. **Real menus:** a menu button is a real dropdown. It opens on press, works from the keyboard and
   closes on a choice. A ⋯ menu holds commands only.
4. **Drag and drop:** anything a person orders is dragged (rows, lessons, chapters, courses,
   sections, blocks, folders); never Move up / Move down.
5. **Floating actions**
   - One style and size.
   - Clear of the tab bar, the home indicator and the keyboard.
   - A centred capsule, never docked to a side.
   - Never the same action twice on one screen.
6. **Tab bar:** it hides and returns as memory-palaces' does; what a place opens has the whole
   height.
7. **Keyboard:** only the editing toolbar rides above it. No other bar or field is lifted, and a
   focused field stays in view without the page jumping.
8. **Nothing clipped:** no cut borders, cut titles or uneven padding at 320px.
9. **Settings in one place:** an item's Settings page, never split across the toolbar, the app bar
   and menus.
10. **Words:** no developer words, no explanations Flat wouldn't show. Help goes behind ⓘ. The one
    exception is a sheet where you choose by what each option does: the Player's Modes sheet keeps a
    one-line description under each mode, as the reference does.
11. **New …:** one sheet (`NewSheet`) everywhere, like the references'.
12. **Songs are songs:** never "built-in" vs "my song" or "original" vs "yours" in the UI. An editor
    edits the song itself; drafts show only when there are unpublished changes.
13. **No edge blur:** scrolling strips don't fade or blur at their edges.
14. **One shape scale:** every control, chip, card, sheet, capsule and button takes its corner radius
    from one small set of tokens (control, card, sheet, pill), named in DESIGN.md and `theme.css`.
    No one-off `rounded-*` values.
15. **One selected style:** every chosen state looks the same: segmented controls, chips, view cards,
    toolbar capsule items, tabs, sidebar items, list rows. One fill, one border rule, one text
    weight. The fill always reaches the control's own edges. Hover is lighter than selected and
    never looks like it.
16. **Floating actions show only what can be done here.**
    - An action that isn't allowed is hidden, never greyed out. The remaining actions re-centre in
      the capsule with no gap.
    - In a built-in folder a learner sees no "+" at all. Its ⋯ menu holds Sort only.
    - In Select mode inside a built-in folder, the bar holds Favourite and Archive (hide from me).
      Move to and Delete are hidden.
    - While dragging, a built-in folder is not a drop target: no highlight, and the drop is refused
      with the row snapping back.
    - "+" at Home or in the learner's own folder still offers New song, Import and New folder. A new
      or imported song lands there, never in a built-in folder.
    - Explore's "Add to my library" adds to Home (or a folder the learner picks from their own),
      never to a built-in folder.
17. **Confirm before an action that loses or hides work.**
    - One shared confirm dialog (`AlertDialog` in `shared/ui`), used everywhere.
    - Its title asks the specific question ("Archive 3 songs?").
    - One line of body says what happens and whether it can be undone ("You can restore them from the
      Archive.").
    - The action button names the act ("Archive", "Delete", never "OK" or "Yes"), red for
      destructive acts. Cancel is the default and closes on Esc.
    - **Confirm:** Archive (songs, folders), Delete (forever, from the Archive), Unpublish, Discard
      changes, Reset to the original, Remove (a lesson from a course, a song from a setlist), Delete a
      take, Sign out, Delete account, Restore an older version, apply a card style to every folder.
    - **Undo as well:** a reversible act (Archive, Remove, Move to) also shows an Undo notice after
      it's done.
    - **Easy triggers:** a swipe to Archive and a keyboard Delete open the same dialog, and a bulk act
      in Select names its count.
    - **No dialog:** favourite, sort, rename, play, open, toggle a setting.
    - **Typed confirmation** (type the name or email) only for Delete account and deleting published
      content.
18. **Each setting lives in one place.** Its home is decided by what it's about:
    - **This one item** (its name, music, folder, cover, style, publishing, versions) → the item's
      Settings page.
    - **How I read or play every item of a kind**: one settings page per kind, reached from the gear
      on any item of that kind and from a row in Settings. Both open the same page, not a copy:
      - Lesson reading (a section at a time, text size);
      - the Player (Display, Countdown, Cursor, Scroll, on-screen piano, fingerings, metronome,
        sound);
      - the score editor (hear notes as you edit, entry, palette).
    - **The whole app** (language, theme, account, sync, connected piano, recording) → Settings.

    Never the same control on two pages, and no per-item copy of a preference. Elsewhere it's a link
    row ("Reading: One section at a time ›") that opens its one home.
19. **Actions are buttons, settings are switches.** A switch only turns a setting or feature on or
    off. An act on an item (favourite, learned, save, follow) is a button on the item, with the same
    command in its ⋯ and long-press menus. Never a switch on a settings page.
20. **Settings pages: one column on a phone, two panes on a laptop.**
    - **Phone:** a single column of grouped lists.
    - **Laptop (from 64rem):** two panes, like macOS System Settings: the list (about 20rem) beside
      the chosen page (about 700px at 1280). Neither pane has Back; the first section opens by
      default. Never two columns of unequal groups.
    - **Rows:** label on the left, control on the right: a switch, a segmented control that fits, or
      a value with › that opens a picker. A control drops under its label only on a phone where it
      doesn't fit.
    - **Group headings:** one style, outside the card, sentence case. No headings inside a card.
    - **Help:** ⓘ only where the label can't say it alone; a group may have one footnote line under
      its card, as iOS does.
21. **Show, don't describe.**
    - **A picture:** a choice that changes how something looks (size, length, position, layout,
      theme, view) is shown as small drawings of each option with a one- or two-word label, like
      iOS's Light/Dark and macOS's Dock position.
    - **An icon:** an action's choice that has a common icon (scroll, glissando, metronome, pedal)
      takes one, always with its label.
    - **Text alone:** a choice with no honest picture (language, MIDI device, account).
    - **Category rows:** each page row in Settings has an icon in a coloured square, as in iOS
      Settings.
    - **Never:** an icon without a label, the same icon for different things, or an ⓘ that repeats
      the label.
    - **Labels:** at most about four words, a noun phrase, and no full sentences in a row.
22. **Never "keyboard" alone.** Say which one:
    - "on-screen piano" for the keys drawn on screen;
    - "piano" or "MIDI keyboard" for a connected instrument;
    - "computer keys" for the computer's keyboard.

    The same in Russian («пианино на экране», «подключённое пианино (MIDI)», «клавиши компьютера»).
    Added to `docs/UBIQUITOUS_LANGUAGE.md` with their _Avoid_ words.
23. **One set of navigation marks, aligned.**
    - **Back:** ‹ (ChevronLeft), in the app bar's back button only.
    - **Opens a page:** › (ChevronRight) at the row's right edge.
    - **Opens a menu or picker:** ⌃⌄ (ChevronsUpDown) beside its value.
    - **Opens or folds in place:** ⌄ (ChevronDown), turning to ⌃.
    - **Arrows (← → ↑ ↓):** only for movement and direction (transpose, octave, sort order,
      next/previous bar), never to navigate. An inline link reads as a link: underline or accent
      colour, no arrow.
    - Every trailing mark is the same size, stroke and muted colour, and sits on the same right edge
      in every row type, a status value ("Up to date", "Not available") or not, hovered or not.
    - The marks render only inside the shared row components (`RowLink`, `ChoiceRow`, `SettingsList`
      rows); no page draws its own chevron.
24. **Five kinds of row, five looks.**
    - **Opens a page:** label, value, ›.
    - **Picks a value:** label, value, ⌃⌄ or a segmented control.
    - **On/off:** label, switch.
    - **Does something:** accent-coloured label, no chevron, its status on the row (Sync now, Save a
      backup, Restore from a file).
    - **Ends or destroys:** red label in its own group.

    One shared row component per kind; no page styles its own.
25. **Destructive actions go last and alone.**
    - Red text in their own group at the very bottom of their page, with extra space above it and a
      one-line footnote saying what happens and whether it can be undone. Never in a group with
      ordinary rows; never on the Settings list.
    - **Account page:** Sign out, then Delete account in a separate group ("Your account and synced
      data are deleted after 30 days.").
    - **Storage and backup:** Reset progress.
    - **An item's Settings page:** Delete, Unpublish, Reset to the original, Discard changes.
    - Each one confirms by rule 17. Delete account asks for the email typed.
26. **Back means up, not history.**
    - Each route names its parent in one table (`app/routes/parents.ts`), and Back goes to that
      parent.
    - A place has no Back. On a laptop, Search and Settings at the sidebar's foot count as places.
    - What isn't a place doesn't create a history entry. These use `replace`:
      - switching modes: Edit ⇄ Done, Player ⇄ editor;
      - a view, tab, filter or sort in the URL;
      - a sheet, menu or dialog;
      - a step inside a flow (New song's three steps, the sign-in pages).
    - Done after Edit returns to the page you edited, and Back from that page goes up past it.
    - The browser's own back button and the swipe-back gesture still work. Only our arrow changes.
    - One test per place walks a path such as Songs → folder → song → Settings → Back ×3 and checks
      that it lands in Songs.
27. **Search is a tool, not a page.**
    - On a laptop, Search at the sidebar's foot (or ⌘K) opens a palette over the current screen, like
      Spotlight or Linear: recent searches and suggestions, then results grouped as Practice / Songs /
      Folders / Lessons. The arrow keys move through results, Enter opens one, and Esc closes it with
      nothing pushed.
    - On a phone, a search field in each place's bar searches that place first, with "Search
      everywhere" beneath. On Learn and Practice the field becomes a button that opens the palette.
    - Opening a result is one push from the screen you came from, so Back returns there.
    - `/search?q=` stays as a link only.
28. **A wide screen is filled, never half-empty.**
    - On a laptop, a page is either an even grid that reflows (`auto-fill`, `minmax`, every card the
      same height) or two panes. It is never fixed columns of different lengths.
    - **Practice:** one grid with a heading row per group, or the three groups as full-width bands.
    - **Songs:** Explore sits in the app bar (Decided 1), and the Public library row goes. Folders and
      loose songs share the same card and height. Loose songs get their own heading ("Not in a
      folder") instead of an orphan card.
    - **Settings:** two panes (rule 20).
    - **Search results:** a full row of results before "Show all n".
    - Check 1280×800, 1440×900 and 1920×1080.
29. **One button family per job, one heading style per level.**
    - **A row that opens something** (Chromatic walk, a song, a page) is a list row: full width of
      its card, no inset grey block, the hover reaching the card's edges. A single row never sits
      in a card far wider than itself; a short list goes in a grid of equal cards (rule 28).
    - **Choices** follow Part A 5: a segmented control only when every option shows at once. Never
      a strip that hides options behind ‹ › arrows (Root, Quality, Voicing): a menu or combobox
      instead, or a grid of keys that fits.
    - **Toggles that combine** (Alterations ♭5 ♭9 ♯9 ♯11 ♭13) look like the segmented control's
      options with the same selected style (rule 15), not a third kind of bordered chip.
    - **A choice that can't be made right now** (Hands: Right on a two-hand voicing) is hidden or
      explained by ⓘ, not a faded option that looks broken.
    - **Section headings:** one style. "Fingering" (serif, large, ⌄) and "Practise in the Player"
      (small, sans, ⌄) are the same level, so they look the same; a fold's chevron sits in the same
      place on each.
    - **The floating transport** is one capsule (rule 5), not three separate circles.
    - **Nothing clipped at the top:** a sticky header (the chord's staff) is never cut by the page
      scrolling under it.
    - **One title per screen:** the app bar's title, or a large page title, never both.
    - **Different things, different icons:** six exercises with one identical icon tell nothing
      apart (rule 21).
    - **Long lists are cut:** more than about eight rows show the first ones and "Show all n"; a
      long page's sections fold. Titles in a row wrap to two lines before they truncate.
    - **The same thing is offered once:** a chord card that opens the chord needs no second row of
      "Open in Chords" chips beside it.

## Decided (do not re-ask)
1. **Explore in Songs.** The Public library is the second half of Songs: a switch in the Songs app
   bar, "My songs · Explore", the same control as Learn's "Lessons · Courses" (Apple Music's Library ·
   Browse, MuseScore's Library · Community). Explore is Noji's library page. My songs keeps the
   learner's songs among the default ones. The row at the bottom of Songs goes. No separate tab.
   Patterns sit in Explore behind a "Patterns" chip.
2. **Profile:** on a laptop it is a sidebar place with Search and Settings at the foot; on a phone, a
   tab.
3. **Publishing rights:** a Klangio-style checkbox; Publish stays disabled until it is ticked: "I
   confirm that the title and composer are correct and that I have the rights to share digital and
   modified versions of this music. The [Terms of Use] apply."
4. **Customisation goes deep:**
   - presets for corner roundness, border thickness, shadow, colour and layout style;
   - free CSS-like styling of every part of a card and other content blocks;
   - a live preview.
5. **Learner view:** for admins and editors.
6. **Edit:** a pencil ⇄ Done in the app bar. Lessons read as one page of sections, not steps.
7. **Annotations:** typed marks placed on the score, not freehand drawing.
8. **Built-in folders.** For a learner:
   - **Allowed:** open a song, sort the folder, favourite a song, change a song's score (their
     version, with Reset to the original), and Archive a song for themselves (Decided 10).
   - **Not allowed:** add a song (New song, Import, Save from Explore), move a song in or out,
     rename, recolour, archive or delete the folder.
   - **Editors** (outside Learner view) keep the editor's powers there: New song in the folder
     creates it in the folder for everyone, and they can drag songs in and out.
   - The rules live in one permission function (`entities/library`), used by every screen, menu,
     drag target and test. No checks scattered through components.
9. **Player and editor toolbars are customisable**, within limits, using memory-palaces' bar editor:
   up to 4–5 tools kept in the bar, the rest in More, Reset to defaults, the same layout for every
   song.
10. **Hiding a song in a built-in folder:** Archive means "hide from me". It can be undone, changes
    nothing for anyone else, and the folder shows "Archived (n)" (Spotify's "Hide song").
11. **Modes sheet help lines:** kept, one line under each mode (Standing rule 10).
12. **Profile privacy:** private by default. A switch on the Privacy page shows your name on
    published songs and your profile in Explore; until then a published song shows "Piano Trainer
    learner".
13. **Settings on a laptop:** two panes (Standing rule 20).

## References (open every folder, "New folder" and "untitled" included)
- `piano-data/reference-apps/new_app_2/` (notes in `scratchpad/r29/refs.md`):
  - Noji 4864–4875: Home's Edit mode, Activity, deck Settings, Publish in library, the Library tab.
  - Quizlet 4876–4885: the item page, the Profile, Achievements.
  - Simple Club 4887.
- `memory-palaces/memory_palaces_data/` images, and memory-palaces' code (copy freely, with its
  tests):
  - `src/pages/profile`, `badges`, `badge-detail`, `achievements`, `achievement-detail`, `streak`,
    `notifications`, `settings-profile`, `settings-change-password`, `settings-privacy`,
    `settings-about`;
  - `deck-settings`, `deck-card-style`;
  - the customisable bars: `src/pages/settings-select`, `shared/config/select-toolbar.ts`,
    `SelectToolbar*.tsx`, `src/pages/settings-swipe`;
  - the tab bar's hiding.
- Flat's and Dorico's help pages: the editor, New song, the Player's settings, their pickers.
- Apple's Human Interface Guidelines: bars, menus, sheets, toolbars, pickers, segmented controls,
  destructive actions. macOS System Settings and iOS Settings for settings layout.
- The piano player app in my screenshots (`scratchpad/r29/owner/45–50.webp`):
  - **Modes sheet** "What would you like to do?":
    - Listen, Sight-read, Practice, Interpret;
    - each mode a card with a coloured icon, a radio and a short line under it;
    - the chosen card opens inline: Left · Both · Right hands, "Hear both hands".
  - **Version sheet** "Choose your version":
    - grouped by instrumentation (Piano solo, Piano 4 hands; each group folds);
    - then by level (Easy · Intermediate · Advanced, with a three-dot marker);
    - each row reads "Difficulty n · accompaniment"; the chosen row has a check.
  - **Tools sheet:** grouped rows with coloured icons:
    - Annotation, Print, Tuner, My recordings;
    - Voice commands → Off;
    - a Rhythm Game switch;
    - Audio/MIDI;
    - Transposition, Change version.
  - **Display** (from Tools, ‹ back to Tools): one card of rows, the label on the left and the
    control on the right:
    - Clef: "Original" with a picture of the clef;
    - Countdown: None · Audible · Visual;
    - Cursor: None · Beats · Continuous;
    - Scroll: Page · Continuous;
    - Display keyboard: a switch;
    - Show fingerings: a switch.
  - **On the score:**
    - close at top left, Tools at top right;
    - a big Play with Restart, floating;
    - a progress bar;
    - a "Change version ›" pill under the title;
    - a one-line coach banner ("Tap Play to listen to the piece.");
    - a labelled bottom tool bar (Studio, Loop, Tempo, Feedback, Modes).
- Our own screens that show what's wrong (`scratchpad/r29/owner/`):
  - 51–53: the Player toolbar and view cards, the song page, the Practice page (shapes and selected
    states);
  - 54: Keyboard and recording's two uneven columns;
  - 55: Settings' misaligned arrows;
  - 56–59: half-empty laptop screens (Practice, Songs, Settings, Search);
  - 60: the Chords page: the arrowed strips, three kinds of chip, two heading styles, the inset
    Chromatic walk row in an empty card, three transport circles, the staff cut at the top.
- My other screenshots in this session: Noji's live publish screen, Klangio's checkbox, our Songs
  folder menu, our editor's View and Transpose panels.

## Step 0: carry-over check (my earlier messages)
Check each item on the running app at 390 and 1280. Mark it done or open in `.scratch/r29/audit.md`;
anything open joins the rounds.
- **Lesson content:**
  - clicking into it jumps to the top, and it doesn't look editable;
  - its sections and blocks look rough: compare Notion, Craft, Obsidian's live preview and TipTap's
    examples; the editor must look exactly like the page it makes.
- **Music editors:** they still have bugs and weak options.
  - Finish the editor critique (task #100) against Flat.
  - Their menus use the current options everywhere.
- **New song** works like Flat's: name, instruments with piano and voices, fine-tune; no preset
  cards.
- **Song Settings page** like memory-palaces' deck details; Export… is one sheet; publishing is
  reached from Settings, not from an "add" menu.
- **Editors' header and floating toolbar** are clearly separate, so you can see what belongs to what.
- **No stale UI:** old publish bars, old menus, unused settings.
- **Standing rules:** every one holds on every screen.

## Part A: consistency audit (first; it feeds everything else)
Write `.scratch/r29/audit.md`, one row per finding: where, what's wrong, the single fix.
1. **One component per thing.** Merge duplicates into one, used everywhere.
   - Known: three Transpose controls:
     - `pages/score-editor/ui/EditorTranspose.tsx` (keep this one, the editor's);
     - `pages/player/ui/TransposeTool.tsx`;
     - `widgets/transpose/ui/TransposeTool.tsx`.
   - Also sweep pickers, steppers, sheets, rows, menus, empty states and bars: `ScreenHeader`,
     `LibraryHeader`, `PieceHeader`, `ScoreBar`, `FloatingBar`, `SelectionBar`.
2. **One app bar.**
   - Fixed height on every screen: back, title, the screen's tabs or segmented switch (Learn's
     Lessons · Courses, Songs' My songs · Explore), its actions.
   - A large title may collapse on scroll as iOS does; nothing jumps when switching pages.
   - Decide what moves into it.
3. **One rule for actions.**
   - Decide where the primary action, secondary actions, Edit, Settings and Done sit (left, centre,
     right) on phone and laptop, from the references and Apple's guidelines.
   - Write it in DESIGN.md and apply it everywhere.
   - A primary action is a labelled button: e.g. "Add to my library" on a song must be obvious.
4. **Page, sheet or menu.** Research where Apple's guidelines, Noji and Flat draw the line, then write
   the rule:
   - a page for settings and anything with many fields;
   - a sheet for creating one thing or one focused choice;
   - a menu for one-tap commands.

   Every place that breaks it becomes a row.
5. **The right control for each choice.** The key and root pickers on the Chords page and elsewhere
   are scattered rows of chips.
   - Write the rule in DESIGN.md, from Flat, piano-data's apps and Apple's guidelines:
     - a menu or combobox for one choice among many (12 keys, chord qualities, scales);
     - a segmented control on the row for 2–5 choices;
     - a switch for on/off;
     - a stepper for numbers;
     - chips only for a few filters.
   - List every picker in the app against it: keys, roots, qualities, scales, inversions, tempo,
     time, clef, instruments, levels.
   - Replace the ones that break it with one shared control each; add missing ones.
   - **Twelve keys, not seventeen names.** Root, Start on, Melody note and Key pickers list 17
     spellings today (C, C♯, D♭, D, D♯, E♭ … B♭, B): the same black key twice. One shared key
     picker shows the 12 keys of an octave, drawn as an octave of piano keys or a 12-cell grid,
     each with its usual name (C, D♭, D, E♭, E, F, F♯, G, A♭, A, B♭, B; for minor keys C♯m, E♭m,
     F♯m, G♯m, B♭m as key signatures name them). Check the usual names against Flat, MuseScore and
     the circle of fifths before building. Built as the references in `piano-data/reference-apps`
     do it:
     - **One compact row of pickers** at the top of an explorer, each a value with ⌃⌄ that opens a
       menu (Chord Trainer's and the journey app's "C ⌃⌄ · Natural ⌃⌄ · Major ⌃⌄"; Ultimate
       Piano's toolbar "Root C · Type Maj · Inversion Root · Hand RH · Octave − 4 +"). It replaces
       the stacked strips and segmented rows; the rarely changed ones go in a fold.
     - **The key menu is an octave of 12 cells.** A white key shows its letter. A black key's
       cell is split in two, "C♯ | D♭", as Ultimate Piano's circle writes "C♯ / D♭": a tap on a
       half chooses that spelling, so the spelling is visible and chosen in one tap, with no
       separate ♯/♭ control and no impossible names (E♯, F♭). Where only the pitch matters
       (Intervals' root, the Melody note, Start on) the cell isn't split.
     - **Keys (Scales and keys' Key tab, the editor's key, Transpose):** the circle of fifths is
       the picker, as Ultimate Piano's: majors outside, relative minors inside, each wedge with
       its key signature, the enharmonic wedges split (B / C♭, F♯ / G♭, C♯ / D♭), and a "Select:
       C" button. We already draw the circle on the Key tab: make it choose.
     - **Choosing several keys (Quiz and Exercises setup):** Chord Trainer's Keys sheet: the 15
       key signatures as "C major / A minor" rows with checkboxes, Select all · Clear all, and
       Apply; no row of 17 chips.
     - **Feedback at once, on the same screen**, as the references show it: the moment a key is
       chosen, its facts appear as chips ("C major · No sharps or flats", "D major · 2 sharps:
       F♯ C♯"), its notes as note chips (C5 E5 G5 in Chord Trainer), the staff with the key
       signature, the keys lit on the on-screen piano and its diatonic chords as coloured chips
       (Ultimate Piano), each chip playing its sound when tapped.
     - Used on every page (Chords, Scales and keys, Intervals, Progressions, Accompaniment, the
       Quiz and Exercises setup, the editor's key and Transpose) from one component in
       `shared/ui`.
   - Remove the edge blur: `tab-strip` and `fade-scroll-x` in `src/styles/theme.css`, `StepStrip`,
     `BeatStrip`, `ChordPair`.
6. **Words.** Check every string in en and ru against `docs/UBIQUITOUS_LANGUAGE.md`: wrong terms,
   developer words, one thing named two ways.
7. **Navigation bugs.**
   - Learn loses its selected look in the sidebar when its tabs switch: `exact` in
     `widgets/app-nav/ui/AppNav.tsx` compares the `?view=` search too. Fix with
     `activeOptions={{ exact, includeSearch: false }}`.
   - Sweep every tab and sidebar item for the same fault.
8. **Shapes and selected states** (rules 14–15). Screenshot every control family, then write one
   token for each radius and one selected style in DESIGN.md. Apply them through the shared
   components only (no class overrides at call sites). Known breaks (`owner/51–53`):
   - the Player's toolbar capsule: its selected item's fill doesn't reach the capsule's edges;
   - View cards: square-cornered, border plus fill;
   - Staff and Show chips: border plus grey fill;
   - Key / Time / Tempo pills: no border;
   - Practise and Learned: different corners and weights;
   - the sidebar item: border plus fill;
   - the Practice list: an inset hover fill;
   - Settings' segmented controls: white with a border.

   Done: one contact sheet of every control in its normal, hover, selected and disabled state, light
   and dark, all matching.
9. **Every action that loses or hides work** (rule 17). List each one with its trigger (button, menu,
   swipe, key, drag) and whether it confirms, undoes, or both. Make every row follow rule 17 through
   the one dialog. Done: a test per act that the dialog appears, Cancel changes nothing, and
   confirming does the act.
10. **Settings map** (rule 18). List every setting in the app (store field, label, every place it is
    shown) in `.scratch/r29/settings-map.md`.
    - Give each one a single home; remove every second copy (known: "Lessons read as" on the lesson's
      Settings page and in Settings).
    - Define the settings once, in a registry (key, home, label, control), and render pages from it,
      so a duplicate can't come back.
    - A test fails if a setting key is rendered on more than one page.
11. **Favourite and other item acts** (rule 19).
    - Research how Apple Music, Podcasts, Spotify, Noji and Quizlet place favourite, save and done
      marks: on the page, in rows, in menus, as swipes. Write the pattern in DESIGN.md.
    - **Favourite:**
      - a ♡ button on the song's overview card and in the Player's ⋯;
      - "Add to Favourites" / "Remove from Favourites" in a row's ⋯ and long-press menus;
      - a swipe action on a row;
      - Favourite in Select's bar;
      - the switch on the song's Settings page (`SongSettingsPage.tsx`) goes.
    - **Learned:** the same treatment (a button, its menu command), never a switch.
    - Sweep every Settings page for other acts posing as switches, and move each one.
12. **Settings layout** (rule 20).
    - Research how macOS System Settings, iOS Settings, Linear, GitHub, Slack and Flat lay out
      settings on phone and laptop: width, grouping, row anatomy, headings, help text, search. Write
      the pattern in DESIGN.md.
    - Rebuild the shared settings screen (`src/pages/settings/ui/SettingsScreen.tsx`) and every
      settings page on it from the registry. Remove the two-column grid from `SettingsScreen` and
      `MidiSettingsPage`; on a laptop, the two panes.
    - Regroup the rows by what a learner looks for (Metronome under Sound, not Recording) and reword
      awkward labels ("Hide them on a phone on its side").
    - Done: screenshots of every settings page at 390 and 1280, before and after.
13. **Pictures and icons in settings** (rule 21).
    - Research how iOS Settings, macOS System Settings, Flat, Dorico and the piano app in my
      screenshots show visual choices. Write the rule in DESIGN.md.
    - Go through every settings page and list each row: its label, its options, and whether it gets
      a picture, an icon or text, with a shorter label where needed.
    - Build one shared "picture choice" control (drawings as SVG components, the selected style of
      rule 15) and use it for every visual choice.
    - Known first:

      | Today | Better |
      |---|---|
      | Key size: Whole piano · Fit · Large | three tiny keyboards: "All 88", "Fit", "Large" |
      | Key length: Long · Short | a tall key and a short key |
      | Note names: Every C · Every key · None | three mini keyboards with names on Cs, all, none |
      | Keys on a page: At the bottom · At the top | two page outlines; row "Keyboard position" |
      | Hide a page's keys + Hide them on a phone on its side | one row "Fold the keyboard": Never · On its side · Always |
      | A swipe on the keys: Scrolls · Plays | a scrolling hand and a glissando sweep |
      | Name the marked notes / Name the chords played | "Names on marked keys", "Chord names" |
      | Theme: System · Light · Dark | three small screen previews |
      | Settings' list of pages | a coloured icon at the start of each row |

    - Done: before and after screenshots of each settings page at 390 and 1280.
14. **Name the settings pages after what the learner sees** (rule 22).
    - Replace "Keyboard and recording" and "MIDI keyboard" with:
      - **On-screen piano:** look, position, folding, swipe, names, chord names;
      - **Connect a piano (Audio/MIDI):** devices, sound, log, how to connect by cable or Bluetooth;
      - **Computer keys:** typing, octave and pedal keys, shortcuts;
      - **Sound and recording:** metronome, count-in, play melody, volumes, recording.
    - Each page gets an icon (rule 21) and is built from the registry (rule 18).
    - Quick test: from the page names alone, can someone say where "metronome", "note names on keys"
      and "my digital piano" live? Write the answers in the audit.
    - Sweep every string, en and ru, for "keyboard"/«клавиатура» used without saying which.
15. **Account, sync and this device's data.**
    - **The account card** at the top of Settings (as iOS's Apple Account):
      - avatar, name, email;
      - one status line: Synced {{when}} · {{n}} changes waiting · Offline · Last sync failed;
      - signed out: "Sign in to sync your songs on every device" and Sign in.
    - **The Account page** (tap the card): Profile (name, email, password) → Sync (status, last
      synced, Sync now, what syncs) → Sign out → Delete account. Sync lives here only.
    - **Storage and backup:** a page of its own under General, with its icon. Space on this device,
      Keep them safe, Save a backup, Restore from a file, Reset progress. Nothing about the account on
      it.
    - Remove the "Sync and data" page and its row.
    - Done: screenshots signed in and signed out at 390 and 1280; tests that the card shows each sync
      status and that Sync now sits on the Account page only.
16. **Arrows and chevrons** (rule 23). Today there are 25 ArrowLeft against 19 ChevronLeft and 33
    ArrowRight against 35 ChevronRight across 29 files.
    - List every one with what it does and apply rule 23.
    - Fix the shared rows so their trailing marks and values line up. Known: Settings' account row,
      "Sync and data", "MIDI keyboard", "Keyboard and recording", the ⌃⌄ rows (`owner/55`).
    - Hover fills the whole row to the card's edges, not an inset block (rule 15).
    - Done: a test that no page module imports ChevronRight/ChevronLeft/ArrowLeft/ArrowRight outside
      the shared components and the movement controls. Screenshots of Settings, a song page, Practice
      and the Profile at 390 and 1280 with the marks on one line.
17. **Destructive and command rows** (rules 24–25).
    - Research how iOS Settings (Apple Account, Sign Out), macOS System Settings, GitHub, Linear,
      Slack and Noji style and place sign-out, delete-account and reset actions: colour, grouping,
      spacing, footnotes, confirmation. Write the pattern in DESIGN.md.
    - Go through every settings page and item Settings page, give each row its kind, and move every
      destructive action to its page's last group.
    - Done: screenshots of the Account, Storage and backup, song, lesson and course Settings pages at
      390 and 1280. Tests that each destructive row is red, sits in the last group, and opens its
      confirmation.
18. **Navigation audit** (rules 26–27).
    - Today `useGoBack` (`src/shared/lib/use-go-back.ts`) calls `history.back()`, so Back retraces
      Search and every mode switch.
    - List every route's parent and every `navigate` that should be a `replace`.
    - Replace `useGoBack` with `useUp()` over the parents table.
    - Check the lesson and course flows (Edit, Settings, Example, Manage), the Player ⇄ editor
      switch, the account pages and New … sheets.
    - Build the Search palette; `/search` stops being a sidebar destination.
19. **Laptop layout audit** (rule 28). Every place and every page it opens, at 1280, 1440 and 1920:
    empty areas, columns of unequal length, orphan cards, mismatched card heights. A screenshot of
    each place in the round's report.
20. **Buttons, rows and headings on every explorer** (rule 29). Start with the Chords page
    (`owner/60`), then Scales and keys, Intervals, Progressions, Accompaniment, the Chord finder,
    Exercises and the Quiz setup.
    - List every button and chip family, every row inside a card, every section heading and every
      floating control, with its shape, selected style and size.
    - Bring each to one family: the list row, the segmented control, the combobox, the toggle
      group, the section heading, the transport capsule. Each lives in `shared/ui`; a page passes
      data, never classes.
    - Root and Quality become pickers that show the whole choice (a 12-key grid or a combobox);
      Voicing a combobox with a picture of each voicing (rule 21).
    - **Added tones (add2, add4, add6, add9, add11, add♯11, add13) on every chord** (a bug I
      reported). Today `addedOf` (`shared/lib/music/chord-parts.ts`) gives the diminished triad and
      the power chord none, the augmented triad only add9, a sus2 only add6, every 9th, 11th and
      13th chord none, and the Chords page then hides the whole "Added tones" row
      (`widgets/chord-explorer/ui/ChordBuilder.tsx`), so the controls jump as the chord changes and
      a learner can't tell why the option went.
      - Check every triad, size and 7th against chord dictionaries (piano-data's books, Chord
        Trainer's Chord Builder, the chord-chart sites) and add each added tone they name that we
        leave out: e.g. C5(add9), C°(add9), C+(add2)/(add4), Csus2(add4), Csus4(add2), a 7th
        chord's add♯11 where it isn't its own alteration. A tone that would only rename the chord
        (a 9th's add13 is the 13th chord) switches to that chord instead of disappearing.
      - The row is always shown, in one place; a tone the chord can't take is hidden with the
        others re-flowing, and the chord's name and notes update at once (Part A 5's feedback).
      - Tests: a table of every triad × size × 7th with the added tones it offers, checked against
        the sources, and a page test that the row stays when the chord changes.
    - Done: screenshots of every explorer at 390 and 1280 before and after, and a contact sheet of
      the families in each state.
21. **Scales and keys, all three tabs** (screenshots in `scratchpad/r29/scales/`). Known:
    - **Selected styles:** the Scale · Chords · Key tabs are underlined, the Root strip a white
      bordered chip, Octaves and Fingering white bordered segments, the on-screen piano's toolbar
      dark filled chips, "In the key only" a bordered toggle. Five looks for "chosen" (rule 15).
    - **Strips with arrows:** Root (B is off the edge on a laptop), Scale (the last name cut to
      "M"; "Harm…" on a phone), Start on, Melody note. Each becomes a picker that shows the whole
      choice (Part A 5).
    - **Controls group:** Octaves, Start on, Fingering, Rhythm and Tempo are four kinds of control
      in two uneven columns, Tempo alone in its row. One settings-style group: label left, control
      right (rule 20), or one row of compact controls.
    - **The Play button** floats at the right edge beside the Root strip here, while Chords puts
      three circles at the bottom. One transport capsule, one place, on every explorer.
    - **The score** takes half the width and its fingering collides at the bar line ("2 4"). It
      fills the column, and fingering never overlaps.
    - **Headings:** "Fingering by hand", "Scale degrees", "Borrowed chords", "Harmonise a melody
      note" are large serif; "Practise in the Player", "Progressions in this key" small sans;
      "Triads", "Major 7ths" a third size. One style per level.
    - **Two titles:** "Scales and keys" in the app bar and "C major" as a huge page title.
    - **Facts:** Formula, Structure, Relative and the Key tab's facts are a loose table; Relative,
      the circle neighbours and the modes are bare blue words, while chords are bordered buttons.
      One facts layout, and one way to link to another scale or key.
    - **Cards:** the seven scale chords (4 + 3, an orphan), the borrowed chords, the harmonise
      results ("as 3 · in the key") and the songs are four card sizes and styles; scale degrees sit
      in a bare table with no card. One card family, grids that end evenly (rule 28).
    - **Duplicates:** the chord cards and the "Open in Chords" chips open the same seven chords.
    - **Practise in the Player:** six exercises share one icon; their descriptions are cut
      mid-sentence; "Walk the chords" is a lone row in a full-width card.
    - **The Key tab on a phone** is about 6,000px long: all 24 songs, every harmonisation group.
      Sections fold, lists show "Show all n", lesson titles aren't cut ("Lesson 3: C – Dm – G – C
      – F…").
    - **Note names on the on-screen piano:** the computer-key letters (A S D …), the degree, the
      finger and the note stacked in four rows on every key: show only what this tab needs.
22. **Intervals** (`scratchpad/r29/scales/intervals-*`). Known:
    - The Root strip again hides choices behind ‹ › (Part A 5); "Play: At once · Up · Down" is a
      half-width segmented control with the right half empty.
    - **Two row styles in one list:** "Within the octave" rows have ⓘ, "Past the octave" rows
      don't; the mini keyboard is drawn at two scales. One row, one keyboard size.
    - **ⓘ on every row** repeats what the name and the drawing already say (rule 21).
    - **No Play on a row:** tapping a row plays it, but nothing shows that; the hovered row's grey
      fill looks selected (rule 15). A row that plays shows a play mark; the one playing is
      marked as playing.
    - **"Semitones: 3"** under every name: "3 semitones", or the size as a number column.
    - **Phone:** names wrap to two lines ("Minor / seventh") while a 120px keyboard takes the row;
      the drawing shrinks before the name wraps.
    - **Odd counts leave holes:** 7 rows past the octave end with a lone card (rule 28).
    - **Missing:** sound for the whole list (play each in turn), ear training linked to the Quiz,
      the interval on the staff (Chords and Scales show a staff; Intervals doesn't).
23. **Progressions** (`scratchpad/r29/scales/progressions-*`). The page is about 11,500px on a
    laptop and 18,800px on a phone. Known:
    - **One page doing four jobs:** the progression you're building, the Library of progressions
      (dozens of cards), "Through the keys" walks, and "Between two chords". The Library and
      Between two chords become their own places in the page (tabs like Scales' Scale · Chords ·
      Key, or a library list that opens a progression), not one endless scroll.
    - **The Library is a list, not a wall of cards:** each card repeats name, description, a play
      button and a row of chord chips; a list row (numerals, name, ▷) with the chords shown when
      opened. Its genre headings (Pop, Rock, Jazz …) become chips, as Explore's categories.
    - **Controls:** a text field, three segmented controls, a combobox, a picture choice (Starting
      position) and a switch, in two uneven columns with Move smoothly alone; ⓘ on four of them.
      One settings-style group (rule 20), the rarely changed ones (Written as, Voicing, Mode)
      behind a "Options" fold or the Player's settings page (rule 18).
    - **Function · Root motion** is a segmented control that only changes the chord strip under
      it; the strip's colours (green T, purple D, peach S) are a colour code used nowhere else
      and not explained: a legend, or the same colours the Chords page uses.
    - **The Play button** floats on the right of the chord strip, a third place for it.
    - **Two titles:** "Progressions" in the app bar and "Axis of Awesome" with a subtitle.
    - **Headings:** "Library" (serif with ⌄), "Pop" (serif, no fold), "Through the keys" (small
      sans with ⌄), "Songs with this progression" (serif), "Dominant" (serif, smaller). One style
      per level (rule 29).
    - **Between two chords:** each card holds a staff that renders empty until scrolled to (check
      it draws at once in view), a tag "Chromatic" on nearly every card (so it tells nothing), a
      play button under the text (elsewhere it sits at the right). One card family; the tag only
      where it differs.
    - **"In the key only"** is a bordered toggle again (rule 15), and "C → G" a combobox of pairs
      instead of two chord pickers.
    - **"Songs with this progression: No song uses it yet"** is an empty section shown anyway: an
      empty state names what to do, or the section hides.
    - **Through the keys:** nine walks with one icon and cut chord lists ("C G Am F · D♭ A♭ B♭m
      G♭ …"); different icons by direction, the list unclipped or dropped.
24. **A Settings page for every Practice page** (rule 18). Today no Practice page has one: the
    Chord finder keeps its choices in a sheet of toggle tiles behind a "⚙ C" button, the Metronome
    has only an ⓘ, and Chords, Scales and keys, Intervals and Progressions put their preferences
    inline among the choices. Split them:
    - **On the page:** what you are looking at: the chord, scale, key, interval, progression,
      pattern, tempo.
    - **On its Settings page** (a gear in the app bar, `/practice/<page>/settings`, built from the
      registry): how it sounds and looks every time, plus link rows to On-screen piano and Connect a
      piano. At least:
      - **Chords:** voicing and hands by default, symbol style (Cmaj7 · CΔ7 · CM7), how a chord
        plays (together · broken · up and down), fingering shown, the staff's clefs.
      - **Scales and keys:** octaves, rhythm, tempo, hands, fingering (from the thumb · as the
        scale), which scale families are listed.
      - **Intervals:** how they play (at once · up · down), names (m3 · ♭3 · minor 3rd), the
        compound intervals shown.
      - **Progressions:** written as, voicing, chord size, lead into each chord, move smoothly,
        mode.
      - **Accompaniment:** tempo, key, hands, loop, count-in, which sources show as tabs and in
        what order.
      - **Chord finder:** remember the last chords, over the bass, keys it is in, scale on the
        keys, symbol style; the sheet of toggle tiles goes.
      - **Metronome:** sound, accent on beat 1, subdivision, volume, count-in, a visual flash, the
        bar trainer; saved tempo presets.
      - **Exercises and Quiz:** questions in a round, timer, answer by tapping or from the piano,
        hints, sounds, the keys included (Part A 5's Keys sheet).
    - The choices that leave the page leave nothing behind; the page keeps a link row ("Plays:
      broken ›") only where the setting changes what you see.
25. **Accompaniment, Chord finder, Metronome, Exercises and Quiz** (`scratchpad/r29/scales/acc-*`,
    `finder-*`, `metro-*`, `exer-*`, `quiz-*`). Known:
    - **Accompaniment:**
      - The source tabs mix scripts in the English interface ("Called to Play", "Боброва",
        "Горшков"): names are transliterated in English (Bobrova, Gorshkov) and written in
        Cyrillic in Russian. Six tabs scroll on a phone: a source picker or chips instead.
      - Pattern names mix numbering ("5.1 ·", "1 ·"), note glyphs (♪ ♫ ♩.♪) and plain names; one
        naming rule, the rhythm drawn as a small picture (rule 21) instead of glyphs in the title.
      - Descriptions are cut mid-sentence on every row; the Studies' titles are cut ("Lesson 3: C
        – Dm – G – C – F …").
      - Patterns have no icons while Exercises' rows do: one row style for every list on Practice.
    - **Chord finder:**
      - The app bar has a MIDI icon with a status dot and a "⚙ C" button whose "C" says nothing
        (rule 21): the gear opens its Settings page; the piano's status shows as words in the
        empty state ("No piano connected · Connect").
      - The empty state is a card in the middle of an empty screen with a blank staff; the staff
        and the chord's name should fill the space the page has, and the chords remembered show
        as a history list below.
      - The empty staff is drawn shrunk (a small grey staff inside the card, its clefs faint and
        tiny) and changes size once a chord is played. The staff has one size, empty or not, as
        wide as its column at the page's staff size, so nothing jumps when the first chord lands.
    - **Metronome:**
      - −10 −1 +1 +10 are circles, Tap tempo a pill, Clicks and 4/4 pill menus, the bar trainer's
        menus greyed until a switch: four button shapes on one screen (rule 14). One stepper
        (− 120 +, hold to repeat, tap the number to type), one menu style.
      - "ALLEGRO" in capitals with an ⓘ: the tempo word in the page's text style, tapping it
        lists the tempo words with their ranges.
      - The big Play is a different size and colour from every other Play (rule 5).
    - **Exercises:** groups of two leave a third of the grid empty (rule 28); descriptions cut.
    - **Quiz:** "My gaps" is an outlined labelled button where every other app bar has round icon
      buttons (rule 1); "Reading" is a lone card in a row of three.
    - **Everywhere on Practice:** the on-screen piano's toolbar (‹ › zoom C Cm7 ⌨ ≈ Ped. ⌄) is
      dark chips with no labels, different from every other toolbar: one toolbar style, its
      choices in On-screen piano settings, labels on hover and in the More menu.
26. **The on-screen piano itself** (`shared/ui/piano-keyboard`, `features/live-keyboard`).
    - **Its toolbar** ("the rail": ‹ › zoom, C, Cm7, ⌨, ≈, Ped., ⌄): unlabelled dark chips; "C" and
      "Cm7" say nothing about what they switch (note names, chord names); "Ped." is a text glyph,
      not an icon; ⌄ hides the piano with no label. Each gets an icon with its name (rule 21), the
      selected style of rule 15, and the same order on every page; what to keep on it is chosen in
      On-screen piano settings (today's rail controls, from the registry).
    - **Labels on every key:** the computer-key letter, the degree, the finger and the note are
      stacked on each key at once (Scales); show what the page needs, the letters only while typing
      plays the keys.
    - **The pedal on screen:** the Ped. toggle latches (a tap holds it down until tapped again),
      Space holds it while typing, a MIDI keyboard's foot works too. Check, and fix what fails:
      - the pedal shows as down on the piano the same way whichever put it down (a lit pedal under
        the keys, as the take roll's pedal lane draws it), and Space, the toggle and the foot never
        fight (one lifts what another put down only on purpose);
      - leaving the page, opening a sheet or switching tabs lets the pedal up, so no key rings on;
      - a key struck again under the pedal restrikes, not stacks a second voice;
      - the sostenuto and soft pedals from a MIDI keyboard are shown, not only heard.
    - **Feel:** the keys at 320px are wide enough to hit (zoom, or two octaves), a swipe scrolls or
      plays as set, nothing on the rail covers keys, the piano's height is the same on every page.
27. **The Player's piano sound and its pedal** (checked in the code; heard on the Fantaisie-
    Impromptu):
    - **Pedal marks lost on import (a bug):** MusicXML's pedal marks are attached to the next note
      on the staff by `Object.assign` (`applyDirections` in `shared/lib/musicxml/read.ts`). A change
      written as a stop and a start at the same place (as Finale and many files write it) keeps only
      the start, so the pedal is never let up and every note rings into the next harmony; a release
      after the last note of a piece or before a rest is dropped or moved to the next note; a
      direction's `<offset>` is ignored. Pedal marks become their own events at their own ticks
      (down, up, change), never merged into a note's marks; a stop and a start at one tick are a
      change. Tests on a fixture with each way of writing it, and on the Fantaisie-Impromptu's
      pedalling against the score.
    - **The sound under the pedal (a bug):** a scheduled note (`playNote` in
      `shared/api/audio/web-audio.ts`) falls to 40% in 0.35 s and then holds that level until its
      end, so a note held by the pedal for four bars sounds at full sustain the whole time, like an
      organ: Chopin's left-hand arpeggios become a wash. A piano note keeps decaying while it rings
      (the live keys' `holdNote` already does, lower keys longer); scheduled notes decay the same
      way, and the pedal's release damps them as `damped` does.
    - **A key struck again under the pedal** stacks a second voice on the first instead of
      restriking the string: one voice per key, the old one damped as the new one sounds.
    - **The voice itself** is three oscillators (a triangle and two sines): it can't sound like a
      piano, least of all under the pedal. Propose a sampled grand piano (e.g. the Salamander Grand,
      CC-BY, through a small sampler library), with its licence, its download size and how it is
      cached offline, and the synthesised voice as the fallback only while samples load. Adding a
      package or hosting the samples is my decision: put the proposal in the report.
    - **To a connected piano:** the Player sends the pedal as longer notes, not as the pedal
      (control change 64), so a digital piano's own pedal resonance never sounds. Send the pedal as
      the pedal.
    - **Show it:** the Player marks where the pedal is down (the score's Ped. marks highlighted as
      the playhead passes, and a pedal lamp by the on-screen piano), and the keys held only by the
      pedal look different from the keys a hand holds.
    - **Pieces without pedal marks** (most imported MIDI and many songs): an option on the Player's
      settings page, "Pedal: As written · Off · Automatic (change with each chord)", Automatic
      using the chord symbols where the music has them.
    - Done: the Fantaisie-Impromptu's opening, a hymn with written pedalling and a song without
      any played back and recorded before and after; tests for each rule above.

## Part B: features (each with what I'll see when it's done)
1. **The Profile, as complete as memory-palaces'** (Quizlet 4880, memory-palaces' pages above).
   1. **Hero.**
      - A picture you choose: an upload, or one of the built-in avatars; falls back to your initial.
        "Edit photo" sits on the avatar.
      - Your name, then "@handle · Joined 2026".
      - Three tiles: Day streak, Songs learned, Practice time. Tapping the streak opens the Streak
        page.
      - A guest sees "Exploring as a guest" and Sign in.
   2. **Next milestone card:** "Almost there: 3 more songs to your next Repertoire badge", with a
      progress bar; the closest unearned tier.
   3. **Badges**, tiered and separate from achievements ("Silver, 2 of 4"): Streak Keeper (days in a
      row), Repertoire (songs learned), Lesson Finisher (lessons done), Scale Master (keys
      practised), Daily Devotion (days practised), Library Builder (own songs and folders). A row on
      the Profile with See all; a Badges page; a detail page per badge with every tier, what the next
      needs and when each was earned.
   4. **Achievements:** one-time milestones, earned or locked (first song, first lesson, first
      recording, first published song, first MIDI session, a 100 % take …). The page has Personal
      records (level, longest streak, total practice time, best take accuracy, songs learned, days
      practised) and Milestones; a detail page per milestone says how to earn it.
   5. **Streak page:** day streak, this month's calendar, longest streak, a line of encouragement.
      It merges with Activity: one page, no duplicate.
   6. **Notifications:** a feed of your milestones (level up, a new badge tier, a new longest streak,
      best accuracy), grouped Today / Yesterday / Earlier; an unread count on the Profile's bell,
      Mark all read, Clear all; saved in `pt-notifications`.
   7. **Edit profile page** (Account → Profile): the avatar picker, name, @handle (unique, checked on
      the server), a short bio, email (changed with confirmation). Change password on its own page.
      Delete account at the foot: a sheet confirmed by typing, run as a state machine (confirm →
      deleting → done / failed / offline).
   8. **Privacy page:** only what works here: whether published songs show your name, and whether
      your profile and activity are visible (Decided 12).
   9. **States:** a loading skeleton for the hero and sections; an empty state and a guest state for
      each section.
   10. **Data:** every figure derived from the stores we keep (`pt-progress`, the record, takes); the
       thresholds in one table in `entities/progress/model`, with tests. The avatar and handle go in
       the account's server profile: a migration and an access test (a learner reads and writes only
       their own profile; a public handle is readable), reviewed by me before `main`.

   Done: side-by-side screenshots with the references at 390 and 1280.
2. **Professional copy.**
   - Research how established apps word their terms, privacy, publishing rules, empty states and
     help: App Store guidelines, Spotify, MuseScore, Flat, Klangio, Quizlet, Noji.
   - Rewrite every legal, policy, publishing, empty-state and ⓘ text in en and ru, with the
     writing-guidelines and humanizer skills.
   - Done: `.scratch/r29/copy.md`, before and after for each string. Legal meaning changes only with
     my approval.
3. **Explore in Songs** (Decided 1; Noji 4875, Quizlet 4876).
   - The "My songs · Explore" switch in the Songs app bar.
   - On Explore: search, category chips (Patterns among them), shelves with See all.
   - Cards with preview, title, author, rating, saves.
   - An item page with Shared by, rating, preview, about, and a sticky "Save to my library".
   - An Explore result on the song page reads clearly as not yet in my library, with the labelled
     primary action "Add to my library".
4. **Edit in place.** Manage lessons and Manage courses stop being pages.
   - A level and the Courses shelf get the pencil's Edit mode: drag handles, rename, remove, + add,
     Done. Like Noji's Home and our folders' Select.
   - The permission function (Decided 8) decides Edit mode everywhere (built-in folders, levels, the
     Courses shelf). A learner never sees an Edit, a "+" or a drag handle where they can't act.
   - Tests:
     - learner in a built-in folder: no "+", ⋯ shows Sort only, Select shows Favourite and Archive
       only, a drag onto the folder is refused, sorting works and is saved, editing a song's score
       saves their version, an archived song shows under "Archived (n)" and comes back;
     - editor in the same folder: "+" → New song creates it in the folder;
     - editor in Learner view: sees exactly what a learner sees.
5. **Learner view.**
   - Switched on from Settings or the Admin area.
   - A persistent "Viewing as learner · Exit" banner.
   - Every editor and admin control hidden.
   - Session only: no role or database change.
   - Done: tests prove it is never saved and that no editor control shows.
6. **One publishing model.**
   - Lessons and courses get the songs' Publish page, with the rights checkbox.
   - Write the table of actions (Edit, Settings, Publish, Unpublish, Delete, Share link, Versions) ×
     items (song, pattern, lesson, course, progression).
   - Every cell uses the same component and behaves the same.
7. **Real settings for the Player and the editor.**
   - The "kind" pages of rule 18, built from the registry, modelled on the reference's Display, Flat
     and Dorico.
   - They cover playback, view, on-screen piano, metronome and editing; nothing scattered in sheets.
   - The lesson's and course's Settings pages keep only what belongs to that lesson or course.
8. **The Player's practice flow:** everything in the reference screenshots, in our look and words.
   Add what we don't have; improve what we have.
   - **Modes sheet:** each mode a card with a line under it (Decided 11):
     - Listen;
     - Sight-read: the cursor waits for the right note or chord from the MIDI keyboard;
     - Practice: Left · Both · Right, hear the other hand;
     - Interpret: the cursor follows the learner's tempo.

     The chosen mode opens inline to show its options.
   - **Version sheet:** our Simplify levels and the song's versions, grouped by instrumentation,
     then by level; "Change version ›" under the title on the score.
   - **Tools sheet:** Annotations, Print, Tuner, My recordings, Voice commands, Rhythm game,
     Audio/MIDI, Transpose, Change version, Display.
   - **Annotations:** typed marks placed on the score, not freehand drawing: text, fingerings,
     dynamics, breath and pause marks, circles around notes. Saved with the learner's copy; shown or
     hidden from Display.
   - **Display:** Clef (Original or chosen), Countdown (None · Audible · Visual), Cursor (None ·
     Beats · Continuous), Scroll (Page · Continuous), Display keyboard, Show fingerings.
   - **On the score:** close at top left, Tools at top right; a big floating Play with Restart, a
     progress bar; a one-line coach banner; a labelled bottom tool bar: Recordings, Loop, Tempo,
     Feedback, Modes.
   - **Feedback:** after a take, which notes were right, wrong, early or late, from the MIDI
     keyboard.
   - Done: side-by-side screenshots with the reference at 390 for every sheet.
9. **Customisable pages and cards.**
   - Course pages, the Courses overview and the song overview get the lesson editor's block toolbar
     (Insert, `/`, drag handle, custom sections), as customisable as a lesson.
   - Cards and other blocks get a style editor: presets plus free CSS-like properties, with a live
     preview. Styles are saved with the content, and learners see them.
   - **Card style** (memory-palaces' deck-card-style): how a song or lesson row and card look:
     cover, colour, density, and what each card shows (key, level, progress). A live preview, Reset,
     and "Apply to: this folder / this folder and its subfolders / every folder", confirming before
     every folder.
   - **Appearance of a folder or song:** a cover (add, change, remove), a colour and an icon, under
     Appearance on its Settings page.
   - **The song's and folder's Settings pages get memory-palaces' full set of acts**, each with an ⓘ
     hint and a confirmation where rule 17 asks: Duplicate, Move, Rename, Export (MusicXML / MIDI),
     Reset progress, Archive / Unarchive, Delete. Built-in folders follow Decided 8.
   - **About page:** version, build, licence, credits (Verovio, Bobrova, fonts) and the legal links.
10. **Customisable bars, as memory-palaces does.** Built from memory-palaces' code:
    - **Select toolbar** (a page in Settings):
      - a tab per kind of thing that can be selected (Songs and folders; Lessons; Courses; Takes);
      - the live bar at the top: drag a tile to reorder it, its badge takes it off;
      - every action that kind has below it, one tap to add;
      - at most 4 on the bar and at least 1; a hint when it's full; Reset to defaults.
    - **Swipe actions** (a page in Settings): for each kind of row (Songs, Folders, Lessons), which
      actions a left and a right swipe do, arranged the same way.
    - **The Player's bottom tool bar and the editor's toolbar** (Decided 9): which 4–5 tools show and
      in what order, the rest under More; Reset to defaults.
    - **Constraints:**
      - These are app-wide choices, so their home is Settings (rule 18).
      - Saved in `pt-settings` (version bumped), synced like the rest.
      - Even when customised, a bar shows only what can be done there (rule 16).
      - A swipe that archives or deletes still asks first (rule 17).
    - **Done:** tests for add, remove, reorder, the limits, Reset, and the bar on screen matching the
      page tile for tile.

## Constraints
- **Completeness:** one implementation per thing. Every string in en and ru. Loading, empty, error
  and offline states.
- **Screenshots:** at 390×844, 320×568, 844×390 and 1280×800 (plus 1440×900 and 1920×1080 for
  layout); nothing clipped, nothing jumps.
- **Schema changes:** a migration without `drop`, applied, its access tests run, the types
  regenerated; reviewed by me before `main`.
- **Free styles:**
  - whitelisted properties and values only;
  - no `url()` and no script;
  - no layout that can break the page.

## Rounds
1. **Carry-over check and the audit fixes:** Step 0 and Part A 1–27: one component each, the app bar,
   action placement, page/sheet/menu, controls, words, navigation (Back as up, the Search palette, the
   sidebar's selected look), shapes and selected states, confirmations, the settings map and
   registry, item acts, settings layout and two panes, pictures and icons, page names, account and
   storage, arrows, destructive rows, laptop layouts, the explorers' buttons, rows and headings, Scales and keys, Intervals, Progressions, a Settings page for every Practice page, Accompaniment, Chord finder, Metronome, Exercises and Quiz, the on-screen piano, the piano sound and its pedal.
2. **Profile** (Part B 1).
3. **Copy and the rights checkbox** (Part B 2).
4. **Explore in Songs and the built-in folders' rules** (Part B 3, Decided 8 and 10).
5. **Edit in place** (Part B 4).
6. **Learner view** (Part B 5).
7. **One publishing model** (Part B 6).
8. **Player and editor settings** (Part B 7).
9. **The Player's practice flow** (Part B 8).
10. **Customisable bars** (Part B 10).
11. **Customisable pages and cards** (Part B 9).

## Each round, before calling it done
Run impeccable (`audit`, then `polish` or `adapt` where it finds problems) on the screens the round
touched, and check every standing rule.

## Report after each round
In my words for screens, not file names:
- what changed;
- what's left, and why;
- my questions;
- push state: branch, `main`, tests, build.

## At the end
Add any new feedback of mine from this round to the owner-way skill (`references/feedback-log.md` and
its rules), so the next session starts from it.
