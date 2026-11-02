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
  - 56–59: half-empty laptop screens (Practice, Songs, Settings, Search).
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
1. **Carry-over check and the audit fixes:** Step 0 and Part A 1–19: one component each, the app bar,
   action placement, page/sheet/menu, controls, words, navigation (Back as up, the Search palette, the
   sidebar's selected look), shapes and selected states, confirmations, the settings map and
   registry, item acts, settings layout and two panes, pictures and icons, page names, account and
   storage, arrows, destructive rows, laptop layouts.
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
