# Round 29: one consistent, professional app

This is the brief for round 29 of Piano Trainer. It is long because it collects every piece of my
feedback from this session in one place. Read "Read this first" fully; the rest is reference you
open when a round reaches it.

## Read this first

### Goal
Make Piano Trainer feel like one professional, finished app that a pianist or a piano teacher would
trust:
- every action looks, sits and works the same everywhere;
- every word is the term a musician, a method book or Flat uses: no developer words, no home-made
  phrases;
- every control on a screen does something there; nothing is shown that doesn't work;
- each idea has one home; everywhere else links to it;
- as close to the reference apps as our look allows (Flat, Dorico, Chordify, Noji, Quizlet,
  memory-palaces, Ultimate Piano, the piano player app in my screenshots). The references show what
  to add as well as what to improve: build what we don't have.

### Success: what I check when the round is over
1. Every item of Step 0 and Part A is fixed or written up in `.scratch/r29/audit.md` with why not.
2. Every Part B feature is built to its "Done" line.
3. The standing rules hold on every screen at 390×844, 320×568, 844×390 and 1280×800 (and
   1440/1920 wide for layout), light and dark, en and ru.
4. A screenshot per screen, before and after, in `.scratch/r29/shots/`; the gate green; `main`
   pushed.

### How this brief is organised, and how to cite it
- **R1–R30, standing rules:** apply to every screen in every round. Cite as "R17".
- **D1–D19, decided:** settled; don't re-open them. Cite as "D8".
- **Step 0:** carry-overs from earlier rounds, checked first.
- **A1–A43, the audit:** each a known problem, where it is, and the fix. Cite as "A23".
- **B1–B11, features:** new things to build. Cite as "B8".
- **Rounds:** the order of work. **References**, **Constraints**, **Reporting** at the end.
In the text, "Part A n" means An, "Part B n" means Bn, and "rule n" or "Standing rule n" means Rn.

### When two parts disagree
1. Secrets, keys, account values, roles given to people and hosting outside Vercel and our
   Supabase project are mine: put them in the report as my to-dos and carry on with the rest.
   Everything else is decided in this brief (D1–D19) or yours to decide and log.
2. CLAUDE.md and the owner-way skill.
3. The latest of my words wins: a later item in this brief (a higher A or B number, or a
   "Chosen"/"replaces" note) overrides an earlier one on the same thing. Where you find two that
   still disagree, follow the later one and note it in the audit.
4. A standing rule (R) over a single item's detail.
5. A reference app over our current behaviour, unless a rule says otherwise.

### What my feedback adds up to (apply these to anything this brief doesn't list)
These are the patterns behind every item below. When you meet a screen or a control the brief
doesn't name, judge it by them:
1. **The term a musician uses.** Every label, option and ⓘ is checked against `piano-data/books`,
   `method-books`, Flat and Dorico, in en and ru (A6). "Move smoothly", "Between two chords",
   "Who wrote it" are the kind of words that fail.
2. **Show what it is for, not how it is built.** If a control's effect can't be seen or heard, it
   is in the wrong place or shouldn't exist (A23's Function switch, A35's patterns on a score).
3. **Only what works here** (R30). No control that does nothing, no choice that moves you
   elsewhere, no greyed-out option that looks broken.
4. **One home per idea and per setting** (R18, A32): the page shows what you look at; its Settings
   page holds how it always behaves; the app's Settings hold what every page shares.
5. **One component per kind of thing** (A1): one key picker, one row, one chip, one transport,
   one metronome engine, one fingering rule.
6. **Compare item by item with the reference, then build what's missing** (Flat's panels, A40;
   Chordify's views, A37; the metronome apps, A39). A loose nod to the reference fails.
7. **Read the code before you claim**, and test what you can (A29's sample file). Where this brief
   says "to check", "described from memory" or "not yet heard", verify first; where the check
   disagrees with the brief, the check wins and the audit says so.
8. **Fill the screen, calm the page:** no half-empty laptop screens (R28), no endless scrolls
   (R29), no explanation lines where an ⓘ or a picture will do (R10, R21).

## How to work
- **Rules:** CLAUDE.md and the owner-way skill bind every change. Read its
  `references/feedback-log.md` and `ux-principles.md` first, so nothing I rejected comes back.
- **Autonomy:** don't ask, and don't stop between rounds. My questions go in the report. Where a
  choice is mine, take the sensible default and log why.
- **Order:** research, then plan, then build. Don't patch what the plan will replace.
- **Commits and pushes:** audit → spec → rounds. One commit per task. Push each round after
  typecheck, lint and the related tests pass. Run the full suite and the build before `main`.
- **Agents:** few, but use them where a part is large and separate.
- **What you may decide (the app is in beta, D15–D19):** database changes (migrations, tables,
  storage buckets, access rules) as the work needs them, with their access tests written and run
  (CLAUDE.md's Backend rules: no `drop`, the `tests/*.sql` run after); every text in the app,
  legal pages included, rewritten for clarity (a change to what a legal text *means* is listed in
  the report); packages and samples chosen in D15–D16. Still mine: secrets and keys, account
  values, roles given to people, and hosting outside Vercel and our Supabase project. Never break
  a standing rule without saying why in the audit.
- **References:** study one before building its feature: its layout on phone and laptop, its words,
  its behaviour. "As close as possible" means layout, interaction and features. Where I say I
  described an app from memory, check it against its help pages or screenshots first.
- **Everywhere:** a change is made everywhere it applies, never on one screen only.
- **Before an item:** read the files it names (the brief cites them), run the app at 390 and 1280,
  and take the "before" screenshots. Rows marked "to check" are hypotheses until you have.
- **Progress file:** keep `.scratch/r29/progress.md`: each A and B item with its state (open, in
  progress, done, won't do and why), its commits, and the owner's questions. Update it with every
  commit, so a new session can pick up from it alone.
- **Per change:** `npm run typecheck && npm run lint`, then `npm run test:related -- <files>`; the
  full `npm run test` and `npm run build` once per round before `main` (CLAUDE.md).
- **Specs:** an item that changes a model, a store or a route gets a short spec in
  `.scratch/r29/<item>/spec.md` and its ADR amended (owner-way's docs step), before code.

## Words used in this prompt
- **App bar:** the bar at the top of every screen (back, title, tabs, actions). Today it reads as a
  loose title and changes height between pages.
- **Edit mode:** a pencil in the app bar turns the page itself editable; Done leaves. There are no
  separate "Manage" pages.
- **Learner view:** an admin or editor sees the app as a learner does, for this session only.
- **Built-in folders:** the app's own folders of songs (the spec gives them their final name in the
  glossary).
- **Place:** Learn, Songs, Practice, Profile (and, on a laptop, Search and Settings at the
  sidebar's foot): the screens with no Back (R26).
- **Explorer:** a Practice page that shows one thing you choose: Chords, Scales and keys,
  Intervals, Progressions.
- **Floating capsule:** the one floating bar of a screen's actions (R5): play, start, check, add.
- **Kind settings page:** the Settings page for every item of one kind (the Player's, the
  editor's, each explorer's, R18), reached from that item's gear and from Settings.
- **The registry:** the one list of every setting (key, home, label, control) the settings pages
  are drawn from (A10).
- **Key picker:** the one shared control for choosing a key or a root (A5).

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
10. **Words:** no developer words, no explanations Flat wouldn't show. Help about a control goes
    behind ⓘ. Two exceptions: a sheet where you choose by what each option does (the Player's Modes
    sheet keeps a one-line description under each mode, as the reference does), and an item's own
    content (a song's description, A28) which is text on the page, not help.
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
      - the Player (Audio playback, Playback speed, Display: clef, countdown, cursor, scroll,
        fingering; B7 and A35), with link rows to the Metronome's settings (A39) and to the
        On-screen piano (A14), which keep their one home;
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
    - **A choice that can't be made right now** (Hands: Right on a two-hand voicing) is hidden
      (R30), not a faded option that looks broken; an ⓘ says why only where its absence would
      puzzle.
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

30. **Show only what works here, and a choice never moves you.** Every control on a page or a
    tab does something on that page or tab, for the thing shown; a control that would do nothing
    there is not drawn (rule 16), and a choice made in a tab keeps you in that tab. If a choice
    would leave a tab without its content, the choice isn't offered there (or offers only what
    fits), never a silent jump to another tab.

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
13. **Settings on a laptop:** two panes (R20).
14. **Progressions' explanation:** the roles and moves drawn on the chords (layout B, A23), no
    switch and no separate section.
15. **The piano sound (A27):** the **Salamander Grand Piano** samples (Alexander Holm, CC-BY 3.0:
    credited on the About page), self-hosted with the app (`public/samples/piano/`, not a third
    party's CDN), cached by the service worker so it plays offline:
    - a note sampled every minor third from A0 to C8, the others pitch-shifted, in **AAC (.m4a)**
      (every browser we support, Safari included), trimmed with a short fade;
    - **four velocity layers** (from Salamander's sixteen), the softest-but-one loaded first so the
      first note sounds within a second, the rest in the background; about 15–25 MB in all, its
      size shown on Storage and backup (A15) with a "Download for offline" row;
    - the player: try **smplr** (MIT, Web Audio, plays its own sample maps and takes the sustain
      pedal as CC 64) in a spike first; keep it if it fits our scheduler and damper model
      (`schedule/damper.ts`), else write our own small sampler in `shared/api/audio` (buffers,
      playbackRate, velocity layers, release, the damper), not Tone.js (too large for what we
      need);
    - the synthesised voice stays only while samples load and as the offline fallback before the
      download.
16. **The metronome's sounds (A39):** recorded one-shots, each with an accented and a normal
    stroke, **CC0 only** (Freesound's CC0 filter or a CC0 pack; the source and licence of each file
    written in `public/samples/metronome/SOURCES.md`): woodblock, clave, rimshot, cowbell, a
    classic click, and a drum kit (kick, snare, closed and open hi-hat, ride); all of them under
    300 KB together, self-hosted and cached. The spoken count ("one, two…" in en and ru) waits for
    my recording: list it as my to-do; until then it isn't offered. No CC-BY-SA samples.
17. **Database changes are yours to make** as the work needs them (B1's profiles, avatars and
    handles; anything Explore, publishing or Profile need), each as a migration (no `drop`), its
    access tests in `supabase/tests/` run against the project, `database.types.ts` regenerated,
    and an ADR line (0116's history).
18. **Every text may be rewritten** (beta): labels, help, empty states, errors, legal pages, in en
    and ru, to the terms of A6 and B2; the old and new wording of each legal paragraph in
    `.scratch/r29/copy.md`, and any change of *meaning* in the report.
19. **Scope:** all of it, in the rounds below, autonomously; no stop for review between rounds.

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
  - 72: B♭ minor's Key tab (overlaps, degrees, borrowed chords, A43);
  - 61: the Fantaisie-Impromptu's page (no Learned, wrong key); 63–64: the editor's palette and
    Daisy fields' clef; 65: the Player's Setup sheet; 66: the editor's padding; 67: Amazing
    Grace's page head; 68: Progressions folded; 69: New song's instruments step; 70: Flat's tempo
    popover; 71: Intervals.
- My other screenshots in this session: Noji's live publish screen, Klangio's checkbox, our Songs
  folder menu, our editor's View and Transpose panels.
- `piano-data/Screenshot 2026-10-27 at 20.57.*` (musicca's progression lists, A23) and
  `piano-data/Screenshot 2026-11-02 at 19.0*` (Flat's editor panels on the Fantaisie, A40).
- `piano-data/reference-apps/`: Chord Trainer and the journey app (pickers, A5), Ultimate Piano
  (passing chords, circle of fifths, practice, A5/A23/A41), Chordify (A37), Flat's editor (A34),
  Duolingo Music and Clefs (results, A41), musicca (A23); notes on tools and fingering in
  `scratchpad/r29/tools-fingering-refs.md` (from about 25 of new-app's 125 images: look at the
  rest when a round needs them).

## Step 0: carry-over check (my earlier messages)
Check each item on the running app at 390 and 1280. Mark it done or open in `.scratch/r29/audit.md`;
anything open joins the rounds.
- **Lesson content:**
  - clicking into it jumps to the top, and it doesn't look editable;
  - its sections and blocks look rough: compare Notion, Craft, Obsidian's live preview and TipTap's
    examples; the editor must look exactly like the page it makes.
- **Music editors:** they still have bugs and weak options.
  - Finish the editor critique against Flat (left open from round 25; now A34 and A40).
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
   - **Professional terms everywhere:** every musical label, option and ⓘ uses the term a
     theory book, a method book or Flat/Dorico uses, checked in `piano-data/books` and
     `method-books` (en and ru), never a home-made phrase. Known: "Between two chords" → Passing
     chords; "Move smoothly" → Voice leading; "Starting position" → Inversion; "Lead into each
     chord" → Approach chords; "Root motion" → Root movement; "Function" → Harmonic function;
     "Melody staff" → the staff's name; "Pulsing chords" → Repeated chords; "Who wrote it" →
     Credits; "Words · Music" → Lyricist · Composer. Each lands in the glossary with its _Avoid_
     words, and a test fails on an _Avoid_ word in a locale file.
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
      - **Sound and recording:** the piano sound (A27), volumes, count-in, recording; a link row to
        the Metronome's settings (A39). "Play melody" goes (A35).
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
21. **Scales and keys, all three tabs** (screenshots in `scratchpad/r29/scales/`). Today's tabs are
    Scale · Chords · Key; A32 renames them **Notes · Harmony · Key**, and the text below uses
    today's names for what is there now. Known:
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
    - **The three tabs don't read as one thing.** Scale, Chords and Key each start differently and
      share nothing but the title: Scale has a facts table, strips, the piano, a score, hand cards
      and exercise rows; Chords has bordered chord cards, a row of "Open in Chords" chips, a lone
      walk row and progression rows; Key has the circle, another facts list, a bare degrees table,
      borrowed-chord cards, harmonise cards and song rows. The scale's chords appear twice (the
      Chords tab's cards and the Key tab's degrees table) in two designs. Make them one family:
      - **One header for all three**, kept above the tabs: the name, the key signature and the
        notes on one staff, the notes as chips (each plays), Play, and the key picker (Part A 5).
        A tab changes what's under it, never the header.
      - **One spine: the seven degrees.** Every tab lines up on the same seven columns, I to VII,
        in the same order and the same colours: the Scale tab's notes and fingers, the Chords tab's
        chords (C Dm Em F G Am B°, each with its numeral, its diagram and play), the Key tab's
        functions (tonic, subdominant, dominant…) and its borrowed chords under the degree they
        stand on. The degrees table and the chord cards become this one row.
      - **One colour per function** (tonic, subdominant, dominant), the same on the circle, the
        degrees, the Progressions strip and the Chords page (Part A 23), with a legend.
      - **Sections in one order and style on every tab:** what it is (the header), see and hear it
        (piano, staff), play it (fingering), use it (chords, progressions, songs), with one heading
        style (rule 29) and one card family.
      - **Tab names say what's in them:** "Notes · Harmony · Key" (Part A 32), checked with the
        clarify skill.
      - Done: the three tabs side by side at 390 and 1280, the same header and the seven columns
        lining up across them.
22. **Intervals** (`scratchpad/r29/scales/intervals-*`). Known:
    - **The root** (`owner/71`): the 17-name strip with ‹ › arrows (B is cut off). It becomes the
      shared key picker of Part A 5, unsplit here (only the pitch matters): one compact "Root C ⌄"
      in the page's head, opening the 12-key octave.
    - **"Play: At once · Up · Down"** is a half-width segmented control on its own row, its words
      not a musician's, and it is a playing choice, not the thing looked at. Name it as theory
      books do: **Harmonic** (both notes together) · **Melodic, rising** · **Melodic, falling**,
      each with a small picture (two stacked notes, two notes rising, two falling; rule 21). It
      leaves the page body: the page's floating capsule (rule 5) holds it as three icon buttons
      with their names on hover, beside **Play all** (each interval in turn) and Stop; its default
      lives on Intervals' Settings page (Part A 24) with the names style and the compound
      intervals. A row still plays on tap, in the chosen way.
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
      (dozens of cards), "Through the keys" walks, and "Between two chords". They become tabs
      (the page's structure, below), not one endless scroll.
    - **The Library's content and shape, as musicca lists it**
      (`piano-data/Screenshot 2026-10-27 at 20.57.40–55.png`): progressions grouped by style (Pop,
      Rock, Jazz, Blues "all 12 chords played in succession"), each a row of its chords in bar
      cells, and "Songs with four chords": title, artist, chords, year. Check our library against
      it (missing progressions, the 12-bar blues as one row of twelve bars), show each row as its
      chords in bar cells (`| C | G | Am | F |`), and our songs that use a progression with their
      bars, as the page already does.
    - **The Library is a list, not a wall of cards:** each card repeats name, description, a play
      button and a row of chord chips; a list row (numerals, name, ▷) with the chords shown when
      opened. Its genre headings (Pop, Rock, Jazz …) become chips, as Explore's categories.
    - **Controls:** a text field, three segmented controls, a combobox, a picture choice (Starting
      position) and a switch, in two uneven columns with Move smoothly alone; ⓘ on four of them.
      Only what changes the music shown stays on the page; the rest moves to Progressions'
      Settings page (its options, below; R18).
    - **Function · Root motion** is a segmented control that only changes the chord strip under
      it, and neither word says what it is. They are two analyses of the same chords:
      - **Harmonic function:** each chord's role in the key: tonic (T, home, at rest),
        subdominant (S, moving away), dominant (D, tension that pulls home). Today shown as
        coloured chips (green T, purple D, peach S) with no legend, a colour code used nowhere
        else;
      - **Root movement:** how the root moves from one chord to the next (down a 5th, the
        strongest pull; down a 3rd, two shared notes; up a 2nd, none shared), today shown only
        when chosen, with a legend under it.

      Renaming them is not enough: a learner can't tell what the switch changes (nothing they
      hear: only the letters under the chords) or why it sits next to the music. They are not a
      setting and not a view of the music; they are the **explanation of why the progression
      works**. So:
      - **Remove the switch** from beside the chord strip. The chord chips show only the chord
        and its numeral, as everywhere else.
      - **Chosen layout (B): the explanation on the chords themselves, always shown,** no switch
        and no separate section:
        ```
          C ──↓5──▶ G ──↑2──▶ Am ──↓3──▶ F
         home     tension    sad       away
        ```
        - under each chord its role in one word and a colour (home · away · tension, with the
          minor chords' colour word: sad, soft; the terms tonic, subdominant, dominant, relative
          minor behind the word's ⓘ), the same colours as Scales' Harmony and the circle, with a
          one-line legend;
        - between each pair of chords an arrow with the bass's move (↓5, ↓3, ↑2…), the strong
          moves bolder, its meaning ("strongest pull", "two notes shared", "fresh") behind its
          ⓘ; a tap on an arrow plays the two chords;
        - the words and roles generated in the kernel from the numerals and the key, in en and
          ru, tested on every progression in the library;
        - the same row wherever a progression is shown (the Library's rows, Scales' Harmony, a
          song's progressions), one component.
      - The chips play as they do now; nothing here changes the sound.
      - The Quiz's "Chord roles" drill links from the legend ("Test yourself").
      - Done: a learner reading only the row can say what each chord does (the en and ru
        texts checked with the clarify skill against the theory books in `piano-data/books`).
    - **The page's structure,** tabs like Scales and keys': **Progression · Library · Passing
      chords**:
      - **Progression:** the chords (typed as numerals or chord symbols, or tapped in from the
        key's chords), the key picker (Part A 5), Play and the transport, the staff and the
        piano, the roles row above, then "Practise in all 12 keys" (today's "Through the keys"
        walks) and "Songs with this progression" (hidden when empty);
      - **Library:** the progressions as a list with genre chips (above), a row opening it in
        Progression;
      - **Passing chords:** today's "Between two chords" (below).
    - **Folded sections that look like links** (`owner/68`): with the Library folded, the page is a
      column of loose headings, each with a › that reads as "opens a page": "Library ›" (large
      serif), "Practise in the Player ›" and "Through the keys ›" (small sans), "Between two
      chords ›" (large serif again), and an open "Songs with this progression" between them. A
      folded section says nothing about what is inside it. The tabs above remove most folds; where
      a section still folds anywhere in the app: one heading style per level (rule 29), the fold
      mark ⌄ turning to ⌃ (rule 23, never ›), and a one-line summary on the closed heading ("38
      progressions · 9 genres", "9 ways through the keys") so it isn't a dead word.
    - **The walks' names** (`player.ts`, `practice.ts`): "Practise in the Player", "Through the
      keys", "Up by semitones", "Up and down by semitones", "Down the circle of fifths: C F B♭",
      "Walk the chords", "Chromatic walk". Name them as teachers name practising in all keys:
      the section **"Practise in all 12 keys"**, each way a **sequence**: "Chromatically, rising",
      "Chromatically, falling", "Chromatically, up and back", "In whole steps, rising", "Around the
      circle of fifths, falling a fifth (C F B♭ …, what jazz calls the cycle of fourths)",
      "Around the circle of fifths, rising a fifth (C G D …)", "In minor thirds", "In major
      thirds"; "Walk the chords" → "Through the key's chords, in scale order"; "Chromatic walk" →
      "A chord in all 12 keys, chromatically". The same names in the Player's title and its More
      menu, and in Russian (секвенция, хроматически вверх, по квинтовому кругу).
    - **Its options, named as musicians name them** (on the page only what changes the music
      shown; the rest on its Settings page, Part A 24):
      - on the page: **Chord size** (triads · 7ths · 9ths), **Approach chords** (none · secondary
        dominants · ii–V; today "Lead into each chord: No · By its V · By its ii–V");
      - on Settings: **Written as** (chord symbols · Roman numerals · Nashville numbers),
        **Voicing** (block · voice-led; today's "Move smoothly" is voice leading, Part A 35),
        **First chord's inversion** (today "Starting position"), **Mode** (major or minor, today
        "Major or minor" in a menu with an ⓘ).
    - **The Play button** floats on the right of the chord strip, a third place for it.
    - **Two titles:** "Progressions" in the app bar and "Axis of Awesome" with a subtitle.
    - **Headings:** "Library" (serif with ⌄), "Pop" (serif, no fold), "Through the keys" (small
      sans with ⌄), "Songs with this progression" (serif), "Dominant" (serif, smaller). One style
      per level (rule 29).
    - **"Between two chords" is passing chords, and should say so.** It is a port of Ultimate
      Piano's "Passing Chords" (`piano-data/reference-apps/ultimate-piano/04-*`, `05-*`): from one
      chord to another, the chords that can go between. Its title means nothing, its groups
      ("Dominant", "Functional", "Chromatic", "Diminished") mix kinds of chord with kinds of
      motion, and nearly every card is tagged "Chromatic", so the tag tells nothing (the
      reference does the same, and also misspells: A♯7 for B♭7, G♯ as IV of E♭, C♯7 for D♭7:
      check our spellings against the key, never copy them). Rebuild it from the theory books in
      `piano-data/books` (check what Bobrova's and Gorshkov's courses call them and how they use them in church accompaniment) and
      standard jazz and classical harmony, with their names:
      - **What it is:** a *passing chord* fills the gap between two chords on a weak beat; an
        *approach chord* leads into the target from a step, a half step or a fifth away. The
        section's name: **Passing chords**, its line: "Chords that lead from one chord to the
        next".
      - **Groups by how they lead,** each with its symbol in the key and one plain ⓘ:
        - *Dominant approach:* secondary dominant (V7/x), tritone substitute (♭II7/x, subV7),
          related ii–V (ii–V/x), backdoor dominant (♭VII7/x);
        - *Diminished passing chords:* passing diminished (♯i°7 between I and ii, rising),
          descending diminished, common-tone diminished (the target's root held);
        - *Chromatic approach:* from a half step below, from a half step above, double approach
          (both), planing (the target's quality moved a half step);
        - *Subdominant approach:* IV or borrowed iv before the target (plagal), with the
          borrowed-chord link to Scales' Harmony (Part A 32);
        - *Bass-line passing chords:* walk-ups and walk-downs (I – I/3 – IV, the passing ⁶₄),
          slash chords that move the bass by step.
      - **Each suggestion card:** the three chords in order (C → B♭7 → E♭) as chips that play,
        its Roman numerals in the key, the voice leading drawn on a small staff (drawn at once,
        not left empty until scrolled to), a tag only where it says something (Diatonic ·
        Borrowed · Chromatic; style: Jazz · Gospel · Classical · Pop), and **Insert** (puts it
        between the two chords in the progression or the song).
      - **Where it lives:** owned by Progressions (its third tab: pick two chords, or tap the
        gap between two chords of the Progression tab's chain); used where chords meet: a "+"
        between two chord cells in the Grid view and the editor's chord row (Part A 37) opens the
        same sheet, filtered to that pair and that key; Accompaniment's lessons that teach them
        link to it; the Quiz can drill them.
      - Spelled in the key (B♭7, not A♯7), named the same in en and ru (проходящие аккорды,
        вторичная доминанта, тритоновая замена, проходящий уменьшённый), tests for each group's
        chords on C → E♭, C → Am and G → C.
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
      - **Intervals:** how they play by default (harmonic · melodic rising · melodic falling, A22),
        names (m3 · ♭3 · minor 3rd), the compound intervals shown.
      - **Progressions:** written as, voicing (block · voice-led), first chord's inversion, mode
        (A23's option list; chord size and approach chords stay on the page).
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
27. **The Player's piano sound and its pedal** (read in the code, not yet heard; the owner
    hears it on the Fantaisie-Impromptu):
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
      piano, least of all under the pedal. Replace it with the sampled grand of D15 (Salamander, self-hosted,
      four velocity layers, offline), the synthesised voice only while samples load.
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
28. **The song page of an imported or own song** (`owner/61`, the Fantaisie-Impromptu):
    - **No Learned:** `PieceView.tsx` hides the Learned button for every own song (`own ? null :
      <LearnedButton …>`), so a song you imported or wrote can never be marked learned, and the row
      under Practise holds a lone ♡ at its left edge. Songs are songs (rule 12): every song has
      Learned and Favourite, the same buttons in the same row (or both in the app bar, Part A 11),
      and its progress counts on the Profile like any other.
    - **The wrong key:** "Key E" and "Scale: E major →" on a piece in C♯ minor. MusicXML's key
      reads minor only when the file writes `<mode>minor</mode>` (`read.ts`, `signatureKey`), and
      many exporters (Flat among them) leave it out. When the mode is missing, tell major from its
      relative minor by the music (the first and last bass note and chord, the raised 7th, here
      B♯), and let the song's Settings correct it; the title's own key ("in C♯ Minor") counts too.
    - **"No chords to learn" four times:** a piece with no chord symbols lists Part A–D each with
      that line. Its sections show what they do have (bars, length, the hands, difficulty), and
      the chord lines appear only on songs with chords.
    - **The tempo** reads ♩ = 80 in 2/2: in cut time the beat is a half note (𝅗𝅥 = 80, or the
      piece's own marking); the fact chips write the beat the time signature counts.
    - **The fact chips** (Key, Time, Tempo) are a fourth chip style (rule 15); "Scale: E major →"
      is an arrow link (rule 23) floating alone under the card.
    - **Half-empty on a laptop** (rule 28): a full-width Practise bar, a lone ♡ and a short list;
      the overview and the sections can sit side by side, or the page takes a reading width.
    - **Every song page's head** (`owner/67`, Amazing Grace): "Words: John Newton" and "Music: New
      Britain (American folk tune)" sit as two loose lines under the title, then the difficulty
      bars alone on a row of their own with no label. Lay it out as a score's head does: the title,
      then one credits line ("Words by John Newton · Music: NEW BRITAIN, American folk tune") in the
      byline style, and the level in the facts row with its name ("Level: Easy ●○○") beside Key,
      Time and Tempo (one chip style, Part A 8). Chords and Progressions follow in the same card
      family.
    - **The arrow that points at "About"** (`PieceAbout.tsx`): "Scale: G major" ends in an arrow
      that slides right on hover, and "About this song ⓘ" sits right after it on the same line, so
      the arrow reads as pointing at About and the description hides behind an ⓘ. The arrow goes
      (rule 23: no arrows for navigation); the scale becomes the Key chip's own link (tap "Key G"
      to open G major in Scales and keys); the description shows as text under the credits, two
      lines with "More", not behind an ⓘ (amend ADR 0111, which says no paragraph on the page).
    - **The page's editor (the pencil, Part A 38) is unclear and plain:** its fields are "Who wrote
      it", "Music", "Words", "Add", "About the song", "Edit the music". Make it a proper metadata
      editor, as a publisher's or MuseScore's score properties and hymnals' credits name things:
      - **Credits** as their real roles, each an optional row added from "Add credit": Composer,
        Lyricist (words), Arranger, Translator, Tune name (hymns: NEW BRITAIN), Source or
        collection, Year, Copyright; each printed where a score prints it (composer right,
        lyricist left, arranger under the composer) on the score's title block and on the page;
      - **Title and subtitle**, **About** (a short description, with a counter), **Level**
        (Beginner to Advanced, the same scale as Learn's levels), **Genre or style**, **Language**
        of the words, **Tags**;
      - each field with a placeholder that shows an example ("e.g. John Newton"), a short ⓘ only
        where the role is unclear (Tune name: "A hymn tune's own name, printed in capitals"),
        and the en and ru terms checked against the glossary (композитор, автор слов,
        аранжировка, название напева);
      - the same fields in the score editor's Settings (its names, Part A 34) and in New song's
        first step, one store field each (rule 18), and written to MusicXML's `<creator>`,
        `<rights>`, `<work-title>` and read back (Part A 29);
      - its actions named for what they do: "Edit score" (not "Edit the music"), "Add credit",
        "Done".
29. **Imports and exports** (`shared/lib/musicxml`, `shared/lib/read-midi-file.ts`,
    `shared/lib/schedule/performance-midi.ts`, `features/song-files`). Checked in the code and with
    a small MusicXML file read by `readMusicXml`:
    - **MusicXML import, confirmed:**
      - A pedal change written as a stop and a start at one place keeps only the start (Part A
        27); a stop after the last note is dropped, so the pedal never lifts at the end.
      - A minor key without `<mode>` reads as its relative major (Part A 28).
      - Directions (pedal, dynamics, words) attach to the next note on their staff and ignore
        `<offset>`, so a mark between notes, over a rest or after the last note moves or is lost.
      - Beams are not read (the engraver beams again), so a file's own beaming is lost: keep it
        where it is written.
      - A pickup bar reads correctly (checked).
    - **MIDI import:**
      - Each note's velocity is read and then dropped when the notes become the song (`spelled`
        in `song-of-midi.ts`), so a played file loses all its dynamics: keep them as the notes'
        loudness, or as dynamics marks where they change.
      - A one-track piano file is split into hands at middle C (`SPLIT = 60`): a left hand that
        rises above it or a right hand below it lands on the wrong staff. Split by hand shape
        (the lowest and highest voices, reach and continuity, as MuseScore's and Flat's MIDI
        import do).
      - Only the first meter, tempo and key are kept, the rest counted as left out: changes of
        meter, tempo and key are written into the song where they happen.
      - A pickup is never found: bar 1 always starts at the file's start.
      - The song gets one section ("verse") cut into lines of a fixed length: sections from the
        file's markers where it has them, else one section with no made-up name.
    - **What a file couldn't keep:** the Import sheet lists counts per kind ("3 marks"); it says
      what they were and where ("a trill in bar 12"), and offers to open the song at the first one.
    - **Import:** one file at a time (the picker and a drop take the first file): several files
      at once, each read in turn, with one summary. A file already in the library asks: Replace,
      Keep both, or Cancel. Where the import lands (Home, the open folder) follows rule 16.
    - **Export:**
      - MusicXML (uncompressed) and MIDI, the pedal written as the pedal (control change 64) and
        the tempo marks as tempo changes: good; MIDI inherits the import's pedal bug above.
      - Missing: compressed MusicXML (.mxl, what Flat, MuseScore and Dorico open first), PDF of
        the score as engraved (the Tools sheet's Print, Part B 8), audio (the Player's sound as a
        file), and a take as MIDI or audio from My recordings.
    - **Round trip tests:** every song in the library written as MusicXML and read back gives the
      same music (notes, marks, pedal, chords, lyrics, sections, key, meter, tempo); every song
      written as MIDI and read back gives the same notes, hands, pedal and dynamics within the
      grid; fixtures from MuseScore, Flat, Dorico, Finale and Sibelius exports in
      `src/shared/lib/musicxml/fixtures/`, each read without loss the importer can avoid.
    - **Compare with Flat and MuseScore:** import the same files into them and into ours, and list
      what they keep that we lose; each one becomes a row in the audit.
30. **Fingering, one way everywhere.** Today it is drawn four ways that don't agree:
    - under the on-screen piano, a row of numbered circles (`FingerRow`), a crossing filled blue;
    - on the keys themselves (Scales), a stack of the computer-key letter, the degree and the note,
      so two rows of numbers (degrees 1–7 on the keys, fingers 1–5 under them) sit one above the
      other and read alike;
    - on hand pictures (`HandDiagram`, Chords and Scales), a crossing underlined;
    - on the score, the numbers Verovio prints, a crossing in blue, and collisions at bar lines
      ("2 4", Part A 21).

    One rule, written in DESIGN.md and checked against Ultimate Piano (the finger on the key above
    its note name, `piano-data/reference-apps/ultimate-piano/19-*.png`), the printed method books
    in `piano-data/method-books` and Gould's *Behind Bars*:
    - **On the on-screen piano:** the finger on the key, in one circle style, the right hand's
      above and the left hand's below the note name (or in two hand colours named in a legend);
      degrees only where the page is about degrees, never two rows of numbers.
    - **A thumb crossing or a finger change** marked one way in all four places (a small arc, or the
      number in the accent colour), never fill in one place and underline in another.
    - **On the score:** fingering above the notes for the right hand, below for the left, at the
      engraving size, never colliding with stems, beams or bar lines.
    - **Hand pictures:** kept where they teach (Chords, Scales), the same numbers and crossing mark.
    - **One switch** ("Fingering" on the Player's and the explorers' Settings pages) shows or hides
      it in all of them at once.
    - **Fingering wherever notes are shown, from one source.** Today it exists on the Chords page
      (one chord), the Scales page's Scale tab (the run) and in Exercises, and nowhere else:
      - the seven chords of a scale (Scales' Chords tab), a key's chords and borrowed chords (Key
        tab), a progression's chords (Progressions), an interval, an accompaniment pattern, a chord
        the Chord finder names: no fingering at all;
      - one chord is fingered by two rules: the Chords page uses `placedFingering`/`blockFingering`
        (`chord-fingering.ts`), the inversion drills use `handFingers` (`exercise/inversions.ts`), so
        the same C major in 1st inversion can get different fingers on two pages;
      - "From the thumb · As the scale" exists on Scales only; arpeggios have their own rule
        (`arpeggioFingering`) shown nowhere outside Exercises and a lesson;
      - a song shows only the fingering its file prints; nothing suggests fingering for a song or
        a lesson example that has none.

      Make it one service in the kernel (`music/fingering`): a chord, an inversion, a voicing, a
      scale, an arpeggio and a passage each fingered by one rule (checked against the method books
      and the printed scale books), and every page that shows notes shows their fingering the same
      way (the piano, the score, the hand card, the switch of the bullet above): the Chords tab's
      seven chords, the Key tab, Progressions (each chord of the voice-led line, the fingers that
      move least), Intervals, Accompaniment, the Chord finder, the Player and lesson examples
      ("Suggest fingering" where the music prints none, marked as suggested, editable in the
      editor). Tests: the same chord, scale and arpeggio give the same fingers on every page.
    - **The hand pictures are shapes, not hands.** `HandDiagram` draws five rounded rectangles on a
      palm outline. Draw real hands: a right and a left hand seen from above, palm down, in one
      line style that fits the app (the impeccable skill's asset steps, or a CC0/CC-BY illustration
      adapted, its licence noted), with knuckles, curved fingers and nails, the thumb where a
      thumb sits, numbers on the fingertips. Better still where it teaches: the hand drawn over the
      keys it plays, each fingertip on its key (a chord's shape, a scale's first five notes), as
      method books show it. Check the drawing against `piano-data/method-books` (Called to Play,
      Bobrova) before it ships.
    - Done: the same scale (C major, two octaves, both hands) shown on the piano, the score and the
      hand cards, screenshots side by side, every number agreeing.
31. **Nothing flickers, nothing jumps.**
    - The shared button animates every property (`transition-all` in
      `shared/ui/primitives/button.tsx`) and drops a pixel when pressed (`active:translate-y-px`),
      so a chip's colour, border and size animate as it is chosen and a row of buttons twitches.
      Buttons and chips animate colour only; pressing doesn't move them.
    - Rows that appear and disappear as a choice changes (Added tones, Alterations, Hands) shift
      every control under them: they stay, with options hidden inside (Part A 20).
    - A score re-engraved after a change goes blank before it draws again: the old drawing stays
      until the new one is ready.
    - The app bar slides away on scroll (`ScreenHeader`'s `data-hidden`) and takes the controls
      under it with it on short pages: it hides only on pages taller than two screens, and never
      while a field or menu is open.
    - Find every other case: record each place at 390 and 1280 (Playwright video) while changing
      each choice; any frame where something blanks, jumps or moves that wasn't touched is a row in
      the audit. Done: the recordings, before and after.
32. **The theory pages: one owner per idea, no copies.** Scales and keys has a tab called
    "Chords", the same name as the Chords page, so "Chords" means two places. Today the same idea
    and the same control live on several pages:

    | Idea or control | Where it is today |
    |---|---|
    | Root / key picker | Chords, Scales, Intervals, Progressions (four pickers, three designs) |
    | Chord size (triads, 7ths, 9ths) | Chords, Scales' Chords tab, Progressions |
    | Inversion | Chords ("Right hand from"), Scales' Chords tab, Progressions ("Starting position"), Exercises |
    | Voicing | Chords (Rootless, Locked hands…), Progressions (Voice-led · Block) |
    | Hands | Chords, Scales, Accompaniment |
    | Tempo | Scales (a slider), Metronome, the Player |
    | A key's seven chords | Scales' Chords tab (cards), Key tab (degrees table), Progressions (function strip), the circle |
    | Relative key | Scale tab and Key tab |
    | "Which chords hold this note" | Key tab (Harmonise a melody note), Chord finder (keys it is in) |
    | Progressions of a key | Scales' Chords tab, Progressions' Library |
    | Walks | Chromatic walk (Chords), Walk the chords (Scales), Through the keys (Progressions) |

    The rule: each idea has one page that owns it in full; anywhere else it is a link that opens
    that page already set to it, never a second copy of its controls.
    - **Chords** owns one chord: build it, its voicing, inversion, hands, fingering, sound.
    - **Scales and keys** owns a scale and a key: tabs **Notes · Harmony · Key** ("Harmony" replaces
      the clashing "Chords"). Notes: the run, its fingering, how it plays. Harmony: the key's
      chords on the seven-degree spine (Part A 21), their functions, borrowed chords, harmonise a
      melody note; a chord tapped opens Chords set to it (the "Open in Chords" chips go). Key: the
      circle, signature, relative, parallel, neighbours, modes, and the songs and studies in it.
      The Key tab's degrees table moves into Harmony; the relative key appears once.
    - **Progressions** owns a sequence of chords in a key: its library, voicing and walks; Scales'
      Harmony shows "Progressions in this key" as at most four rows and "Show all n", opening
      Progressions in that key.
    - **Intervals** owns two notes; **Chord finder** owns naming what you play (a Tool, Part B 11),
      and "keys it is in" opens Scales' Key tab.
    - **Walks** are one exercise kind in the Player, named as A23's "Practise in all 12 keys"
      sequences ("Chromatically, rising", "Around the circle of fifths, falling a fifth", "Through
      the key's chords, in scale order"…), offered from each page with the sequence chosen there.
    - **The shared controls are one component each** (the key picker, chord size, inversion,
      voicing, hands, tempo), so where two pages do need the same control, it is the same one.

    **Settings for the theory pages** (Part A 24, from the registry):
    - **In Settings, app-wide ("Notation and names"),** because every page shows them: note names
      (C D E · До Ре Ми · German H), chord symbols (Cmaj7 · CΔ7 · CM7, m · −), numerals (I ii iii ·
      I II III with qualities), sharps or flats for the black keys by default, the function colours
      on or off, and degrees on the keys on or off.
    - **On each page's Settings page,** only its own defaults: Chords (voicing, hands, inversion,
      how a chord plays, staff clefs); Scales and keys (octaves, rhythm, tempo, hands, fingering
      rule, which scale families are listed, the chord size the Harmony tab shows); Intervals (how
      they play, compound intervals); Progressions (written as, voicing, first chord's inversion,
      mode); Chord finder (remember, over the bass, keys it is in, scale on the keys). A24 has the
      full lists; where the two differ, A24's names are the ones to use.
    - Nothing that is a page's current choice (this chord, this key) is a setting; nothing that is
      a setting is a control on the page as well (rule 18).
    - Done: the table above re-checked, each row with one owner; a test that no two pages render
      the same setting (the registry's test, Part A 10).
33. **Tensions, added tones, alterations, voicings and the rest of harmony: one model, one owner
    each.** Three overlapping ideas sit on the Chords page with three controls that don't talk to
    each other:
    - **Added tones** (add2 … add13) are chips that change the chord, shown only for some chords
      (Part A 20);
    - **Alterations** (♭5 ♭9 ♯9 ♯11 ♭13) are chips that change the chord, shown for dominants, a
      maj7's ♯11 and a 7sus4's ♭9 (`alterationsOf`);
    - **Available tensions** (`ChordTensions`, `tensions.ts`) is a panel of four groups (weak,
      strong, tensions, avoid) whose chips only play the chord with that note on top: choosing one
      doesn't add it to the chord, and the groups depend on the chord's quality only, not on its
      place in the key (Dm7 as ii of C takes 9 and 11; Em7 as iii avoids ♭9; the same Dm7 as vi of
      F differs again).

    Make them one thing: **the chord's colour notes.** One panel lists every note the chord can take
    on top, grouped as now (chord tones, tensions, avoid), each chip both heard and added to the
    chord, the added ones written into its symbol (C9, C7♯11, Cadd9), alterations among them; with a
    key chosen (from Scales' Harmony or Progressions), the groups follow the chord's degree in that
    key. Added tones and alterations stop being separate controls.

    The other harmony ideas, each with one owner and links elsewhere (Part A 32's rule):
    | Idea | Owner | Elsewhere, as a link |
    |---|---|---|
    | Colour notes (tensions, added tones, alterations) | Chords | Harmony's chords, Progressions' chords |
    | Voicings (close, open, shell, rootless A/B, drop 2, locked hands, So What) | Chords | Progressions' Voicing uses the same list and pictures |
    | Inversions | Chords | one inversion control everywhere (Part A 32) |
    | Functions (tonic, subdominant, dominant) and their colours | Scales' Harmony | Progressions' roles row (A23, D14), the circle |
    | Passing and approach chords (secondary dominants, tritone substitutes, ii–V, diminished, chromatic) | Progressions (Passing chords) | Harmony shows each chord's secondary dominant as a link |
    | Borrowed chords (modal interchange) | Scales' Harmony | Progressions' Passing chords links there |
    | Reharmonising a melody note | Scales' Harmony | the Chord finder, the editor's chord picker |
    | Modes | Scales (a scale kind) | Key tab lists them as links |
    | Cadences | Progressions (their library) | the Quiz's Cadences drill opens them |

    - Every name in en and ru checked with the theory books in `piano-data/books` and against
      `docs/UBIQUITOUS_LANGUAGE.md` (tension, avoid note, alteration, added tone, voicing,
      function), one name each, with an ⓘ that says it plainly once.
    - Tests: a chord with a colour note chosen has that note in its keys, its symbol and its
      sound; the tension groups for Dm7 differ as ii of C and vi of F; every voicing name in
      Progressions is one of the Chords page's.
34. **The score editor against Flat and the editors in `piano-data`** (`owner/63–64`; Flat's
    screens in `piano-data/reference-apps/flat-score-editor/`, Dorico's and Sibelius's beside it).
    - **The palette's pictures are drawn badly:** the clefs in the Clef group are different sizes
      and heights, their 8 and 15 sit in different places, the C clefs float at three heights,
      and rows end in empty cells. Every palette glyph comes from the music font at one size on one
      baseline (SMuFL, the font Verovio engraves with), centred in equal cells, rows full or
      ending cleanly. The same for key signatures, time signatures, barlines and the note toolbar.
    - **Key signature:** a grid of 1–7 sharps and 1–7 flats with no cell for none, and a
      "Switch to natural" link standing in for it; Major · Minor above. One grid of fifteen keys
      named by their major and minor (C / Am first), as Flat and Dorico show it, the selected one
      in the selected style.
    - **Time signature, as Flat sets it** (`owner/70` is Flat): the palette, New song's Fine-tune
      step (`NewSongSheet.tsx`'s six fixed `TIMES`) and the score's Settings each offer a fixed
      handful (2/4, 3/4, 4/4, C, ¢, 6/8; the palette shows 4/4 twice), though the model takes any
      `n/unit` (`music/time.ts`). One shared control everywhere: the common signatures as
      engraved tiles (2/4 3/4 4/4 C ¢ 3/8 6/8 9/8 12/8 5/4 7/8 3/2 2/2), then **two fields, beats
      over a beat unit** (a number 1–32 over 1·2·4·8·16·32), drawn as the signature they make, a
      pickup bar's length beside it, and where it applies (from this bar, the whole song).
    - **Tempo, as Flat edits it** (`owner/70`): Flat opens a small popover on the tempo mark: the
      beat's note value (a menu: ♩ ♪ 𝅗𝅥 ♩.), the number in a field you type into, − and + (hold to
      repeat), Save, Delete, and a play button to hear it. Ours looks wrong on a laptop and reacts
      badly (a drag that jumps or ignores small moves). Use Flat's popover on the score's tempo
      mark, in New song and in Settings: typing, arrow keys ±1 and shift ±10, the note value
      menu (compound meters default to the dotted quarter), an optional tempo word (Andante…)
      printed with it, and a tempo change mid-song from the same popover.
    - **New song's steps** (`owner/69`): the step marks are three bare dashes with no names;
      "+" rows and a "− 1 +" stepper mix two ways of adding; the Fine-tune step's descriptions
      read as home-made. Name the steps ("Title · Instruments · Time and key"), one way to add an
      instrument (a + that becomes a count once added, as Flat's), and every label and hint in the
      terms Flat and Dorico use (Part A 6).
    - **Not yet built, or built differently from Flat:** go through Flat's palettes (note toolbar,
      Notation, Pitch and representation, articulations, ornaments, dynamics, text, clefs,
      barlines, repeats, layout) and Dorico's and list every option we lack or implement
      differently; build each (Part B 8's rule: add what we don't have). Known: enharmonic
      respell (♭⇄♯) state, cross-staff notes, grace-note types, tremolos, arpeggio, every
      octave line (8va, 8vb, 15ma, 15mb), tuplets beyond 3.
    - **The upper staff in a bass clef with the octave sign** (`owner/63`, Daisy fields): every
      chord sits on four ledger lines. Check whether the song's file asks for it or the editor
      put it there; a piano part's upper staff opens in treble unless the music says otherwise,
      and a clef change asks which bars it covers.
    - **The strip at the bottom:** the floating transport covers the last system's notes ("F",
      "B♭" in `owner/63`) and a bare band runs under the palette and the score at the window's
      foot. The transport floats over margins, never over music (the score gets bottom padding
      the transport's height), and the page has no band under it (rule 5, rule 8).
    - **Padding and alignment** (`owner/66`): the app bar's ✕ starts about 70px in while the Tools
      panel starts at the edge; the note toolbar starts at the score's left, not the panel's;
      the pinned piano keeps a margin the rest of the page doesn't; the tuplet cells (⌐2⌐ … ⌐9⌐)
      and the Pitch group's "↑ 8ve ↓ 8ve" are drawn at different sizes and spill their cells.
      One gutter for the app bar, the panel, the toolbar and the piano (the app bar's controls on
      the same left and right edges as what is under them), every palette cell the same size
      with its glyph centred.
    - **Tooltips** ("Sharp (=)") cover the app bar's words: they open below a toolbar at the top,
      above one at the bottom, never over text.
    - **Long scores:** while a score is engraving, re-flowing after a zoom or a width change, or
      loading its pages, show where it stands: a skeleton of staves sized like the result with
      the bars counting in, never a blank sheet or a frozen one; the old drawing stays until the
      new one is ready (Part A 31). The same on the Player, lesson examples and Scales' score.
35. **The Player: play staves, not "melody" and patterns** (`owner/65`).
    - **Patterns don't belong to a written score.** The Player's Setup sheet offers an
      accompaniment Pattern ("Pop 8ths", left hand, right hand), Starting position (Root · 1st ·
      2nd · 3rd), Move smoothly, Swing and "Melody: None · Melody staff · Recording" on a song
      whose staves are written out (Daisy fields): the accompaniment machinery of a chord chart
      is mixed with the score. Split them:
      - a song with written staves plays its staves. Its Setup is **"Staves: which to play,
        which to show"**: each staff (by its name, Upper, Lower, Voice…) with Play and Show, the
        recording as a track of its own, as Flat's Audio playback lists instruments with mute and
        volume (`flat-score-editor/05-playback-options-sheet.png`);
      - only a chord chart (chords, no written staves) gets an accompaniment, under its own
        heading "Accompaniment from the chords": pattern, inversion, voice leading, swing;
      - "Melody" leaves the Player and the editor (staves are staves, ADR 0097).
    - **Controls that do nothing:** go through every control on the Player's Setup, View, Tools
      and settings and the editor's, with a song of each kind (written staves, chord chart,
      lesson example, progression, exercise); a control that changes nothing for that kind is
      hidden for it. Known: Starting position and Move smoothly on a written score.
    - **Words:** "Move smoothly" is voice leading, "Starting position" the first chord's
      inversion, "Pulsing chords (8ths)" repeated chords in 8ths; Part A 6's sweep checks every label and ⓘ against the terms of the theory books,
      Flat and Dorico, in English and Russian, with the clarify skill.
    - **One hand only:** choosing Left or Right greys the other hand's notes and nothing else. Add
      "The other hand: Show · Dim · Hide" (Hide leaves only the chosen hand's staff), and "Play the
      other hand: On · Off", as the reference's Practice mode has "Hear both hands".
    - **The metronome in the Player:** no way to set it there, and it misbehaves. Check and fix:
      the sound (Clicks, Woodblock, Drums… the Metronome page's choice) is the one heard; it
      clicks on the meter's beats (dotted quarters in 6/8, halves in 2/2), accents bar 1, follows
      tempo changes and the tempo slider, counts in only when asked, stops with the music, and
      doesn't drift from the notes. Its settings (sound, accent, subdivision, volume, count-in)
      are the Metronome's own (Part B 11, one engine), reached from the Player's Tools and its
      settings page; a quick toggle stays in the transport.
    - **The Player's settings page** (B7 builds it, in this round) is Flat's Playback options plus
      the reference's Display: Audio playback (staves, volumes, the recording), Metronome (a link
      to its one home, A39), Playback speed, Display (clef, countdown, cursor, scroll, keyboard,
      fingering), Pedal (A27), each a row to its page.
36. **Focus and keyboard walking.** Tab through every screen: the focus ring is drawn several
    ways (the note toolbar's rounded bracket in `owner/64`, outlines, rings, fills) and some
    controls get none. One focus style (DESIGN.md), on every control, never clipped by its
    container, in an order that follows the screen; Esc closes the top layer only.
37. **The chord views (Diagrams, Grid, Chords over lyrics) as Chordify does them.** Check each
    on Chordify's help and `piano-data/reference-apps/chordify/` before changing it.
    - **Scrolling picks a chord (a bug to the learner):** dragging the Diagrams view's beat strip
      scrubs the music and moves the cursor where it settles (`useStripMotion` in `BeatStrip.tsx`,
      by design today), so looking ahead loses the place. In Chordify a scroll only looks; a tap
      chooses. Make dragging the strip (and swiping the diagrams) browse without moving the
      cursor or the sound; a tap on a beat or a chord moves the cursor there; while playing, a
      manual scroll pauses the following and a "Back to the playhead" pill returns to it (also
      after a few seconds idle, a setting).
    - **Autoscroll in every view:** the Grid and Chords over lyrics scroll to the line playing
      (they call `scrollIntoView`); check they keep the line playing at a steady place (a third
      down), never jump past what is being read, stop when the learner scrolls, and resume as
      above; the Diagrams view follows the chord sounding the same way; the sheet music the same
      (Part A 31: smooth, not jumping). One autoscroll rule and one "Follow the music" setting
      for all views.
    - **What Chordify has that we lack or do differently:** go through Chordify's views and
      controls (chord diagrams' size, the timeline, loop by dragging a range, transpose, simplify, the chord summary, the count-in, the tempo, MIDI follow) and list
      each, then build or fix it; the strip's edge fade goes (rule 13).
    - **The Diagrams view's summary:** it lists each chord once, in the order it first sounds
      (`SummaryGrid`), so it is neither the song's order nor a learning list, and a card tapped
      sends the cursor to that chord's next place after the cursor, else back to its first
      (`chordNear` in `chord-views/model/chords-from.ts`): the Player leaps to the end or back to
      the start. Make it two things, each clear:
      - **Chords in this song** (Chordify's summary): each chord once, with how often it sounds
        and where (its bars as small marks under the card), a tap plays and shows the chord
        without moving the music; a long press or its ⋯ lists its places, each one a jump;
      - **The song's chords in order**, as played (the repeats taken), one card per change in a
        wrapping grid with bar numbers and section names, the one sounding marked and followed
        (the autoscroll rule above), a tap moving the cursor there: the order the learner plays.
      - Tests: tapping a card in "Chords in this song" never moves the cursor; the order view
        matches the beat strip's changes one for one.
38. **One meaning for the pencil, for everyone.** On a song's page the pencil does two different
    things by role: an editor's (and an own song's) edits the page in place (title, who wrote it,
    about), a learner's on a built-in song opens the score editor (`PieceView.tsx`: `ownId ||
    original` → `EditToggle`, else a link to `/edit/$pieceId`). The rule, everywhere, for every
    role (Decided 6): **the pencil edits what the screen shows, in place.**
    - **Song page:** the pencil edits the page (title, composer, about, sections' names) for
      whoever may (an editor on a built-in song, anyone on their own); where they may not, there
      is no pencil (rule 16), never a different action behind the same icon.
    - **The score:** "Edit score" is its own labelled action: in the song page's overview card
      beside Practise (one row: Practise · Edit score · Learned · ♡), and the Player's pencil
      (the Player shows the score, so its pencil edits the score). A learner's edit of a built-in
      song's score is their version (Decided 8); an editor's is the song everyone sees.
    - **The same check for every pencil:** lessons, courses, levels, folders, progressions,
      patterns, the Player, the editor: one action per icon whatever the role, the role deciding
      only whether it shows. Learner view (Part B 5) proves it: an editor in Learner view sees
      exactly the learner's actions.
    - **No setting for this:** what an icon does is not a preference. Settings may choose what a
      song opens to ("Open a song on: its page · the Player"), never what the pencil means.
    - Tests: for each screen with a pencil, as a learner and as an editor, the pencil leads to the
      same kind of editing, and "Edit score" opens the score editor for both.
    - **Edit in every view:** the editor edits only the sheet music. The chord views are the same
      song: an editor (or the learner, in their version) can edit them where they are shown, as
      Chordify's chord editing does:
      - **Grid:** tap a beat cell to set or change its chord (the editor's chord picker, Part A
        5), drag to stretch a chord over beats, add or remove bars, set a section's name and
        repeats;
      - **Chords over lyrics:** type and fix the words, move a chord to another syllable by
        dragging it, add a verse;
      - **Diagrams:** choose the voicing and inversion each chord is shown in (the Chords page's
        controls, one component, Part A 32);
      - one undo history and one Done for every view, the same pencil ⇄ Done (Decided 6); the
        view picker (Sheet music · Grid · Chords over lyrics · Diagrams) in the editor's bar as in
        the Player's, so the learner edits the view they read.
    - Done: a recording of Diagrams, Grid and Chords over lyrics playing, scrolled by hand and
      returning to the playhead; an edit in each view kept after reload; tests for scroll-only
      browsing and tap-to-choose.

39. **The Metronome, against the metronome apps players use** (Soundbrenner, Pro Metronome,
    Tempo; Flat's and the Player's own). Read in `shared/lib/schedule/metronome.ts` and
    `shared/api/audio/web-audio.ts`:
    - **Time:** only six meters (4/4, 3/4, 2/4, 2/2, 6/8, 1/4); 6/8 counts six eighths at the
      tempo set, so 6/8 at 120 clicks eighths at 120, where players set the dotted quarter.
      Any signature from the shared time control (Part A 34), the tempo in the meter's beat
      (dotted quarter in 6/8, 9/8, 12/8; half in 2/2), and odd meters grouped (5/8 as 3+2 or 2+3,
      7/8 as 2+2+3) with the accent on each group.
    - **Beats you set:** tap a beat square to cycle it accented · normal · silent, as Soundbrenner
      does; today only the first beat is accented and the squares only show.
    - **Subdivision:** none today. Quarter · 8ths · triplets · 16ths · swing 8ths, each with its own
      softer sound.
    - **Sounds:** Click, Beep and Drums, all synthesised (a falling sine for the kick, white noise
      for the snare and hat), so the drums sound like a toy. Recorded CC0 samples (D16: woodblock, clave,
      rimshot, cowbell, click, a drum kit; the spoken count when I've recorded it), the synthesised
      voices as fallback,
      each sampled at the accent and normal levels; the Drums pattern per meter checked against
      real grooves (4/4: kick 1 and 3, snare 2 and 4, hat on 8ths; 3/4: kick 1, snare 2 and 3;
      6/8: kick 1, snare 4, hat on every 8th), the hat on the subdivision, not every beat.
    - **Volume and visual:** its own volume, a full-screen flash on the beat (optional), and the
      beat squares following the sound exactly (scheduled on the audio clock, the light drawn
      from the same clock).
    - **Practice modes:** the bar trainer (play n bars, mute m) exists; add the speed trainer
      (from one tempo to another by n BPM every m bars) and a tempo list (saved tempos, a
      song's tempo from the library).
    - **Look:** one stepper, one menu style (Part A 25), the tempo large with its word, Tap tempo.
    - **One engine** for the Metronome page, the Player's click and count-in and the quick
      metronome (Part B 11); its settings are one set (Part A 24).
    - Tests: each meter's beats, groups and accents; subdivisions; the drum pattern per meter;
      the flash and the sound on the same clock; a recording of each sound, before and after.

40. **The score editor's panels, against Flat's** (`piano-data/Screenshot 2026-11-02 at
    19.07.09–19.09.23.png`, Flat on the Fantaisie-Impromptu; `piano-data/Fantaisie-Impromptu in C♯ Minor - Flat.webarchive`
    is the same page saved). Flat's left panel has three tabs, **Notation · Instruments · Layout**, each
    a column of folding groups. Compare ours group by group and build what is missing, in our look:
    - **Recording from a MIDI keyboard** (19.07.09–19.07.38): a MIDI popover in the bar (MIDI
      input, MIDI output, "Write while playing", Record live MIDI); a recording bar under the
      score (Metronome with its tempo and a switch, Start countdown, the device, "Play to start
      recording. The take starts on your first note."); then **Review your recording**: the take
      as a piano roll under the engraved result, quantize 1/4 · 1/8 · 1/16 · 1/4t · 1/8t, Hide raw
      notes, a draggable staff divider (where the hands split), select, split, Discard and Save to
      score. Our Record take and Write a take (`features/record-take`, `WriteTakePage.tsx`) are to
      reach this: one flow, these words.
    - **Instruments** (19.08.19): an All switch; each instrument a row with drag handle, solo (S),
      visibility (eye) and ⋯; New instrument; sorting. Ours is `widgets/instrument-list`: same
      row, same actions (solo and show/hide are Part A 35's Play and Show per staff).
    - **Layout** (19.08.23–19.09.23), each group with a live preview of the page beside it:
      - **Templates** (Normal, Jazz, your own; Save template);
      - **Pages:** orientation, page size (A4, A3, Letter), margins in cm, start page numbering;
      - **Staves:** staff size (mm), minimum space between staves and between systems (a slider
        with its number);
      - **Hide non-playing instruments:** Never · After the first system · Always, each with a
        picture;
      - **Measures:** note spacing (compact to wide), maximum measures per line;
      - **Measure numbers:** every measure · each system · never; count after the anacrusis;
        start numbering at;
      - **Note heads:** colour (default, Boomwhackers), shape (default, note names inside the
        heads, solfège with Ti or Si, shape notes), fixed or movable Do: good for beginners, and
        we have note names only on the keys;
      - **Music font** (Bravura and others, with a sample);
      - **Chord styles:** minor m or −, major maj7 · M7 · Δ7, diminished ° or dim, each a picture
        (our symbol style setting, Part A 32's "Notation and names", is this: one setting, two
        homes not allowed, rule 18: app-wide default in Settings, a score's own override here);
      - **Text styles:** the score's font and each text style;
      - Reset and Save at the panel's foot.

      Ours (`/edit/$pieceId/settings`, the View menu, `ScoreSheet`'s layouts) has a few of these
      scattered; gather them into this one Layout panel, the preview live, the same groups and
      words, everything saved with the score and written to MusicXML's layout where it has a
      place.
    - **Notation's groups** (19.07.09): Modes (Editing, Duration Replace/Insert, Rest), Pitch and
      representation (Transposition, Beaming notes, 8va…), Articulations, Ornaments, Dynamics,
      Measures and brackets, Clef, Key signature, Time signature, Barlines and repeats, Text:
      our palette's groups in the same order and names (Part A 34).
    - **The bar** (19.07.09): title with a pencil, transport, metronome, loop, sound, MIDI, Edit
      menu, save state, Share; under it the note toolbar and, at its right, delete, undo, redo,
      copy, cut, paste, zoom, layout, print. Ours (Part A 34's alignment) the same grouping.

41. **Exercises and the Quiz, inside** (screenshots in `scratchpad/r29/scales/q-*`, `d-*`, `ex-*`;
    references: Ultimate Piano's Practice and Ear Training (`ultimate-piano/08–14`), Duolingo
    Music's lesson and song results (`duolingo-music/06–07`), Clefs' result (`clefs/04`)).
    - **A drill's setup** (`/practice/quiz/<id>`):
      - **Start** is an unlabelled round ▶ floating alone at the foot: a labelled primary button
        "Start" (rule 3), in the floating capsule (rule 5);
      - the drills' names **Cards · Quiz · Play · By ear**: "Play" reads as the play button; name
        them by what you do: **Flashcards · Name it · Play it · By ear**;
      - **Level** is one menu of presets ("The main chords of C"); add **Custom**: which chord
        qualities or intervals (a checklist), which keys (Part A 5's Keys sheet), inversions;
      - **Rounds** 10 · 20 · ∞, **Time limit**, **Go on automatically** ("Auto-advance");
      - the column is half the laptop's width (rule 28).
    - **A round:**
      - the question staff prints a 4/4 time signature for one chord or one note: no time
        signature on a question staff, the clef and the notes only;
      - **Next** and the answer buttons fall below the fold on a laptop (`d-quiz`): the question,
        the staff, the piano and the answers fit one screen; Check / Next in the floating capsule;
      - "Build C" shows only the piano: the chord's name large, its symbol and an optional hint
        (its notes, on request);
      - the piano's key letters and C labels show in every drill: in Note reading and Play it
        they give the answer away; hide note names there (the on-screen piano's own setting,
        Part A 26);
      - the progress is a thin line and "Round 1 of 10": add right/wrong so far, the run of right
        answers, and the time when a limit is on, as Duolingo and Clefs do;
      - after an answer: right or wrong in words and colour, the right answer shown on the keys
        and staff, its sound, and "Why" (one line: "F A C is a major triad on F"), then Next.
    - **The end of a round set:** a results page (accuracy, time, the run, what to review: the
      items missed, each a row that opens it in Chords or Intervals), "Again" and "Review the
      missed ones", the result counted on the Profile (Part B 1) and in My gaps.
    - **An exercise** (Hanon, scales in 3rds, the daily routine…) opens straight into the Player:
      - no page that says what it is, how to play it, and its choices: an exercise page (or
        sheet) first: what it trains, how (in plain words, with the fingering), and its options:
        key (Part A 5), hands, octaves, rhythm variants (Hanon's dotted and triplet variants),
        tempo and a target tempo, then **Start**;
      - in the Player the score prints a chord symbol "C" over bar 1 and the staff name
        "Piano" (an exercise has neither); the transport covers the second system (Part A 34);
      - a "Next key" step (C → G → D …, or chromatically) after each pass, the tempo reached kept
        per exercise and key, and the day's routine ticked off;
      - the exercise's settings on its Settings page (Part A 24), the metronome from the one
        engine (Part A 39).
    - Done: every drill and three exercises played start to finish at 390 and 1280, screenshots
      of setup, a round, a wrong answer, the results.

42. **Every theory, practice and training page against rule 30.** Scales and keys is read in
    the code; the other rows are what to check first:
    - **Scales and keys:** the scale-kind strip (`ScaleChoice`) is the same on all three tabs, so
      on the Key tab it offers Dorian, pentatonic, blues…; a mode isn't a key (`showsOf` gives it
      no Key tab), so choosing Dorian on the Key tab drops the tab and sends you to Scale. On the
      Key tab the picker offers keys only (major and minor, Part A 5's circle), the modes listed
      under the key as links ("D Dorian: the C major scale from D", opening Notes); a scale with
      no chords (pentatonic, blues, chromatic) keeps the Harmony tab with the chords that fit
      each degree where there are any, or the tab isn't shown and the kind is marked "no chords"
      in the picker. The Chords tab's run controls (Tempo, "Played as") apply only to its walk:
      they move into the walk's own row (or the floating capsule, Part A 22's rule for play
      choices), never above the chords.
    - **Chords:** rows that vanish (Added tones, Alterations, Part A 20 and 33), Hands "Right"
      greyed on a two-hand voicing, Voicing options that don't apply to the chord's size.
    - **Progressions:** Mode (major or minor) beside a progression whose numerals already say;
      Approach chords on a chord size they can't voice; the walks' section on a progression of
      one chord.
    - **Intervals:** Play's way on the past-the-octave rows (they play the same way).
    - **The Player and editor:** Part A 35 (Setup's pattern and inversion on a written score).
    - **Quiz setup:** Shown only on Flashcards (right); Level presets that don't match the drill
      (an ear drill offered "on the staff" levels); Rounds ∞ with a time limit.
    - **Exercises:** the key picker on an exercise written in one key; hands on a two-hand-only
      exercise.
    - Method: for each page and tab, list every control and the states (kind of scale, chord,
      song, drill) in which it does nothing or moves you away; hide or narrow each; a test per
      page that every control shown changes what's shown, and that no choice changes the tab.

43. **The Key tab's content, and theory written on the music** (`owner/72`, B♭ minor).
    - **Overlaps and clipping:** the harmonise cards' second line ("as ♭3 · in the key") runs out of
      its card into the next one; the cards in one grid have three widths; the Melody note strip
      hides the chosen note (D♭) half under its ‹ arrow and cuts its last; the floating piano button
      sits over the cards. Cards of one grid share one width, their lines wrap or shorten ("♭3 · in
      key"), nothing floats over content (R5), and the strip becomes the key picker (A5).
    - **"Scale degrees" is a table no one can read:** four unlabelled columns (numeral, a name,
      a note, a chord), the chord column repeating the note with or without "m". Give it its
      headings or draw it as A21's seven-degree spine: degree number and numeral, the note, the
      chord (with its numeral's case and °), the function name behind an ⓘ.
    - **It ignores the scale chosen,** and minor keys read wrongly: in B♭ minor it shows v (Fm) as
      the dominant and VII (A♭) as the subtonic, from the natural minor only, whatever the picker
      says. Theory books write a minor key's chords with the harmonic minor's **V (F) and vii°
      (A°)** as the usual dominant chords, and the natural minor's v and VII as the alternatives.
      Show the minor key that way (both, the usual first), and make the table follow the scale
      kind where the Notes tab shows a scale (harmonic, melodic) rather than a key.
    - **Borrowed chords in a minor key:** I (the Picardy third), ♭II, IV, V. Two problems: ♭II of
      B♭ minor is written "B" (`borrowedChords` names it "plainly", `scale-chord.ts`): the
      Neapolitan is **C♭** (written as the books write it, with its sound named once: "C♭, sounds
      as B"); and V and IV in minor aren't borrowed, they are the harmonic and melodic minor's own:
      list them with the key's chords (above), and keep "borrowed" for chords from the parallel
      mode (Picardy I, ♭II from the Phrygian, iv in major, ♭VI, ♭VII…), each named (Neapolitan,
      Picardy third, minor plagal).
    - **Harmonise a melody note:** "A, as 3" for D♭ is spelled as the sound, not the letter (A's
      third is C♯): write the note as the chord spells it ("A, as 3: C♯ = D♭") or leave out chords
      that need a respelling unless "Include enharmonic" is on (its Settings).
    - **The facts column** (signature, notes, relative, parallel, neighbours on the circle, modes)
      lists things the staff and the circle can show better. Keep the facts that orient (the key
      signature named, its relative and parallel key as links, its neighbours), drop or fold the
      rest, and put the rest **on the music** (below).
    - **Theory written on the music, across the explorers.** The staff a page already shows is
      the best place to explain: annotations drawn on the notes, each a layer the learner turns on
      from the page's Settings (A24), with sensible defaults per page:
      - **Scales (Notes):** degree numbers under the notes; W and H (whole and half steps) between
        them, the half steps marked (a ∧ as method books draw it); the tonic and the leading note
        named; fingering (A30); in minor, the raised 6th and 7th of the melodic and harmonic forms
        marked; tetrachords bracketed for beginners.
      - **Key:** the key signature with its sharps or flats numbered in their order (F C G D A E B)
        and "the last sharp is the leading note" written by it; tonic, subdominant and dominant
        notes and chords labelled on the staff; relative and parallel keys as a second staff on
        request.
      - **Harmony:** Roman numerals under the chords as harmony books print them, the function
        colours (A23, D14), each chord's tones labelled R 3 5 7 on request.
      - **Chords:** chord tones labelled R 3 5 7 9…, the intervals from the root, the colour notes
        (A33) in their colour, the inversion's bass named (C/E, "1st inversion").
      - **Intervals:** both notes on the staff with the interval's name between them, the
        semitones counted, its inversion beside it (m3 ↔ M6) and consonant or dissonant marked.
      - **Progressions:** numerals and functions under the chords, the voice leading drawn as
        lines between held and moving notes, the roles row (D14) aligned with the staff.
      - **Chord finder:** the chord played named on the staff with its tones labelled, and the
        keys it belongs to as numerals ("ii in C, iii in B♭…").
      - **Accompaniment:** the pattern's beats numbered, the hands named, the chord symbols over
        the bars.
      Annotations are drawn by the engraver (Verovio's text and harm elements, or an SVG layer
      aligned to its notes), printed the same in the Player and the editor where they apply,
      named in en and ru, and never cover the music.
    - **What to add to each Practice page** (checked against the books in `piano-data/books`:
      Jazz Lab's *The Secret of Modes*, *Reharm Anything*, *The Chord Tensions Chart*, Eisenmann and
      Lienhard's *Harmonic Ear Training, Level 1*; Nikolaev's and Shirinskaya's scale and arpeggio
      tables; none of these is built today):
      - **Scales, the modes' character** (*The Secret of Modes*): each mode shown with its
        **characteristic note** marked on the staff and the piano and named in one line ("Dorian:
        a natural minor with a raised 6th"), its typical vamp playable (Dorian's i–IV pendulum,
        Mixolydian's I–♭VII), and a **drone** on the tonic to play it over (the Drone tool, B11).
      - **Scales, compare two:** "Compare with" a second scale on one staff and one piano (the
        major and its parallel minor; a mode and the major it comes from), the notes that differ
        marked: the clearest way to see a mode or the three minors.
      - **Harmony, the key's "chord family"** (the ear-training book's term for the diatonic
        chords): the seven chords as one family on the spine (A21), each **heard in its key**: a
        cadence (I–IV–V–I) first, then the chord, because the book's point is that a chord is heard
        by its place in a key, and that "we only hear what we can play".
      - **Chords, hear it in context:** the same "in its key" button on the Chords page (the chord
        after a cadence in a key it belongs to, the key chosen from its list).
      - **Intervals, songs that begin with it:** under each interval, the songs **in our own
        library** whose tune starts with it (found by the kernel from the first two melody notes,
        not a copied list), each playing its opening; a lesser-known library falls back to "No
        song in your library starts with a minor 6th yet".
      - **Progressions, in a song's key:** each row of "Songs with this progression" gets "Play
        in this song's key" (the progression transposed, A5's key picker set).
      - **Passing chords, reharmonisation** (*Reharm Anything*'s methods, starting with tonal
        substitutes: a chord replaced by another of the same function): a second section on the
        Passing chords tab, "Reharmonise", applied to the Progression tab's chain or a song's
        chords with Insert and Undo.
      - **Chords, the tensions chart** (*The Chord Tensions Chart*): the source to check A33's
        colour-note groups against, chord by chord.
      - **Scales and arpeggios, fingering** (Nikolaev's and Shirinskaya's tables): the source to
        check A30's fingering rule against, key by key.
      - **Every page: "Test yourself"**, opening its Quiz drill set to what the page shows (this
        chord's quality, this interval, this key, this progression), and back.
    - Done: B♭ minor's Key tab with the harmonic V and vii°, C♭ spelled, nothing overlapping, at
      390 and 1280; a screenshot of each page's staff with its annotations on.

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
       the account's server profile: a migration, an avatars storage bucket and access tests (a
       learner reads and writes only their own profile and avatar; a public handle and avatar are
       readable once the learner makes them public, D12), per D17.

   Done: side-by-side screenshots with the references at 390 and 1280.
2. **Professional copy.**
   - Research how established apps word their terms, privacy, publishing rules, empty states and
     help: App Store guidelines, Spotify, MuseScore, Flat, Klangio, Quizlet, Noji.
   - Rewrite every legal, policy, publishing, empty-state and ⓘ text in en and ru, with the
     writing-guidelines and humanizer skills.
   - Done: `.scratch/r29/copy.md`, before and after for each string; any change of a legal text's
     meaning listed in the report (D18).
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
   - The "kind" pages of R18, built from the registry: the Player's as A35's last bullet lists it;
     the editor's: entry (hear notes as you edit, Replace or Insert, the palette's side), and the
     score's own Layout (A40) reached from it.
   - The on-screen piano and the metronome keep their one home (A14, A39); these pages link to them.
   - The lesson's and course's Settings pages keep only what belongs to that lesson or course.
   - Built in round 4, with A35 and A40.
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
   - **Tools sheet:** Annotations, Print, Tuner (for a voice or another instrument playing along),
     My recordings, Voice commands, Rhythm game, Audio/MIDI, Transpose, Change version, Display.
     Practice's "Left · Both · Right" is A35's one-hand rule (the other hand shown, dimmed or
     hidden; heard or not), not a second control.
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
11. **Tools, as a group of their own.** Today the Metronome sits under Practice's "Training", the
    Chord finder under "Playing", the circle of fifths inside Scales' Key tab, and nothing is
    reachable from inside a song or a lesson. The references (notes in
    `scratchpad/r29/tools-fingering-refs.md`) do it this way: Ultimate Piano keeps the metronome,
    the key and record in a bar that works over every screen and opens the circle of fifths as a
    picker; the journey app keeps Key Explorer, Circle of Fifths, Chord Builder and Progression Lab
    as tool pages of one layout; piano.org groups its tools on one page.
    - **A Tools group on Practice**, first: Metronome, Chord finder, Circle of fifths, Tap tempo,
      Recorder (My recordings), and a Drone (a held note or chord to play scales over). Each tool
      page has one layout: the readout or picture in the middle, the controls under it, the gear
      to its Settings page (Part A 24).
    - **Over any screen:** a Tools button in the app bar of the Player, the editor, a lesson and the
      explorers opens a sheet with the metronome (start, stop, tempo), the recorder and the tuner
      of the reference's Tools sheet (Part B 8), without leaving the page. The metronome follows
      the song's tempo where there is one.
    - **The circle of fifths** becomes a tool page and the key picker (Part A 5) at once.
    - **One tool, one implementation:** the Metronome page, the Player's count-in and click, and the
      quick metronome are one engine and one set of settings.
    - Done: every tool opened from Practice and from inside a song, at 390 and 1280.

## Constraints
- **Out of scope this round:** new instruments' sounds beyond the piano and voices (ADR 0097),
  payments, and anything that needs an account value or a key I haven't given (list it as my
  to-do).
- **Completeness:** one implementation per thing. Every string in en and ru. Loading, empty, error
  and offline states.
- **Screenshots:** at 390×844, 320×568, 844×390 and 1280×800 (plus 1440×900 and 1920×1080 for
  layout); nothing clipped, nothing jumps.
- **Schema changes:** a migration without `drop`, applied, its access tests run, the types
  regenerated (D17).
- **Free styles:**
  - whitelisted properties and values only;
  - no `url()` and no script;
  - no layout that can break the page.

## The work, from start to end

### Phase 0: set up (before any change)
1. Fetch; the branch level with `main`; the tree clean.
2. Run the gate on `main` as it is (`npm run typecheck`, `lint`, the full `test`, `build`) and note
   anything already red, so later failures are clearly ours.
3. Create `.scratch/r29/progress.md` (every A and B item, state "open"), `audit.md`,
   `settings-map.md`, `copy.md` and `shots/before/`.
4. Take the "before" screenshots: every place and every page it opens, at 390×844, 320×568,
   844×390 and 1280×800, light and dark; the Player and the editor with Daisy fields and the
   Fantaisie-Impromptu.
5. Read the owner-way skill and its feedback log, DESIGN.md, and the ADRs the first round touches.

### Phase 1: specs for what changes a model, a store or a route
One short spec each in `.scratch/r29/<name>/spec.md`, its ADR amended, before its round starts:
Back as up (R26, A18) · the settings registry (R18, A10) · the key picker (A5) · the pedal as
events (A27, A29) · the piano sampler and samples (D15) · the metronome engine (A39, D16) · the
fingering service (A30) · colour notes (A33) · the profile tables and avatars (B1, D17) · the
staves' play and show (A35).

### Phase 2: the rounds
Each round: its items in the order listed, one commit per item, `progress.md` updated with each
commit, the round's screenshots "after", impeccable's audit on its screens, the round's report in
`progress.md`, push the branch; the full gate and `main` at the end of the round.

1. **Carry-over check and app-wide rules:** Step 0; Part A 1–19, 31, 36, 38, 42 (one component each,
   the app bar, action placement, page/sheet/menu, controls and the key picker, words, navigation
   and the Search palette, shapes and selected states, confirmations, the settings map and
   registry, item acts, settings layout, pictures and icons, page names, account and storage,
   arrows, destructive rows, laptop layouts, nothing jumping, focus, the pencil's one meaning, only what works here).
2. **Practice:** Part A 20–25, 30, 32, 33, 39, 41, 43 (the explorers' buttons and headings, Scales and keys,
   Intervals, Progressions, every Practice page's settings, Accompaniment, Chord finder,
   Metronome, Exercises and Quiz, fingering, the theory pages' owners, colour notes, the Metronome against metronome apps, the drills and exercises inside, the Key tab and theory on the music).
3. **Piano and sound:** Part A 26–27 (the on-screen piano, the piano sound and the pedal).
4. **Songs, the editor and the Player:** Part A 28, 29, 34, 35, 37, 40 and B7 (an own song's page, imports
   and exports, the score editor against Flat, the Player's staves and metronome, the chord
   views, Flat's recording, Instruments and Layout panels).
5. **Profile** (Part B 1).
6. **Copy and the rights checkbox** (Part B 2).
7. **Explore in Songs and the built-in folders' rules** (Part B 3, Decided 8 and 10).
8. **Edit in place** (Part B 4).
9. **Learner view** (Part B 5).
10. **One publishing model** (Part B 6).
11. **The Player's practice flow** (Part B 8).
12. **Customisable bars** (Part B 10).
13. **Tools** (Part B 11; the metronome engine already built in round 2, A39).
14. **Customisable pages and cards** (Part B 9).

### Phase 3: finish
1. The whole gate on the merged branch: typecheck, lint, the full suite, the build, the e2e run.
2. Every screen's "after" screenshots beside its "before" in `shots/`.
3. The docs: each ADR touched amended, DESIGN.md (shapes, selected style, controls, focus,
   annotations), `docs/UBIQUITOUS_LANGUAGE.md` (every new and renamed term with its _Avoid_
   words), CLAUDE.md's map (renamed and moved routes, pages, settings).
4. My to-dos listed in one place (the spoken count's recording, anything needing a key).
5. Push the branch and `main`; the final report.

## Each round, before calling it done
Run impeccable (`audit`, then `polish` or `adapt` where it finds problems) on the screens the round
touched, and check every standing rule.

## Report after each round
Written into `.scratch/r29/progress.md` and pushed with the round; don't wait for me before the
next round (autonomy, above). In my words for screens, not file names:
- what changed;
- what's left, and why;
- my questions;
- push state: branch, `main`, tests, build;
- the before and after screenshots of the screens the round changed.

## At the end
Add any new feedback of mine from this round to the owner-way skill (`references/feedback-log.md` and
its rules), so the next session starts from it.
