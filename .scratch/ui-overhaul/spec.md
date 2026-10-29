# UI overhaul and content you can edit (2026-10-29)

The owner's ask: run the UI check with impeccable's practices; clean up the UI and the decisions that no longer hold
("Check these chords", two Edit buttons where one Edit with a choice of what to edit belongs); a better music editor;
a header that looks right, above all on a phone; a real editor for lessons and songs (inline, markdown-like, with
real things to insert, as the music editor has); nothing hardcoded: lessons, courses, sections, songs and the practice
material created, ordered and removed in the app; sync that works; a better Admin area; the Profile and Settings
on a phone; memory-palaces' UI and features where they fit.

## What the UI check found (phone 390, laptop 1280)

- **Header.** Every screen draws its own `ScreenHeader`: a large serif title and up to five outlined round buttons
  (Learn: the view switch, Search, Profile, Settings). On a phone the buttons crowd the title or push it to its own
  row (a song's page: Edit, Learned, Favourite, More above the title). memory-palaces has one bar on every screen:
  64px, the status bar's colour, back, a truncated title, at most two glass icon buttons, a hairline and shadow
  once the page scrolls under it, and a search that takes over the bar.
- **Settings.** A list of four groups; each group a page of cards with grey header bands, segmented controls for
  everything, and settings nobody needs ("Page titles: Large · Small", where the floating buttons sit, naming them).
- **Profile.** Six equal stat tiles of zeros; no avatar, name or account in sight; Settings behind a round button.
- **A song's page.** Two ways in to edit (your version, and an editor's "Edit the original"), "Check these chords"
  in More (a quiz bolted onto a song), the round-button header above the title.
- **Content.** The catalog (journeys, chapters, courses and their lesson order, songs and their sections, the
  practice material) is code; the database may only replace the body of an item the code already lists, so an
  editor can change words but cannot add, remove or reorder anything.

## Rounds

1. **Sync.** Find why it does not work (the project's logs, the runner, the tables' policies, a signed-in check on
   the production build with a throwaway account that is deleted after), fix the cause test first, and show the
   state honestly in Settings (synced, syncing, offline, failed with the reason).
2. **One app bar** (memory-palaces' `Header`, ported): every screen, one height, back, title, at most two actions
   and an overflow menu; the large title only on the three places, collapsing into the bar as the page scrolls;
   Learn's Lessons · Courses become tabs under the bar; Search and the Profile in the places' bars, Settings from
   the Profile. A song's page: Edit, Favourite and More (Learned moves into the page by the Practise button).
3. **Settings and Profile.** Settings becomes one grouped list (memory-palaces' `SettingsSection` and `SettingsRow`):
   the account at the top; rows that show their value and open a sheet or a page; options nobody asked for removed
   (page title size, the floating buttons' side and names). The Profile: avatar, name, account, a short record
   (streak, steps, songs) as a list, the way to Settings.
4. **Leftovers.** "Check these chords" removed with its page and route; one Edit on a song's page, its editor
   switching between your version and (an editor's) the original; any other screen or action the check finds
   that nobody needs.
5. **Content is data.** The catalog's index moves into the database with the bodies: courses with their ordered
   lessons, journeys with their chapters, songs and their sections, exercises, progressions and patterns. An
   editor creates, renames, reorders and removes each in the app (course page: Add lesson, drag to reorder; Learn:
   New course; Songs: New built-in song; Practice: New exercise and progression). The bundled content stays only
   as the first start's copy and the offline fallback, read through the same index.
6. **A real editor for lessons and songs.** One block editor (ProseMirror through TipTap: the standard, with
   markdown shortcuts as you type) for a lesson's sections and a song's About: headings, text, lists, callouts
   (rule, note, takeaway), steps, questions with answers, and music blocks inserted from a `/` menu or a + button
   (a row of chords, a line of notes, a progression, a keyboard picture, a score example edited in the score
   editor, a link to a song or a practice page). English and Russian side by side or switched; drafts, Publish and
   Versions as today. TipTap is a new package: the alternative is hand-writing contenteditable handling, which
   is what the library exists to avoid.
7. **Admin.** Users (search, roles, sign-ins, deletion requests), content (drafts waiting, recent publishes, who
   changed what), the Public library's reports and blocks, error reports grouped by message, feature switches,
   and a first page of numbers (people active this week, new accounts, songs published, errors).
8. **The music editor.** A critique against Flat and Dorico for iPad (impeccable `critique`, then the fixes it
   finds): entry speed, the palette on a phone, selection, the header shared with the Player.
9. **Every screen, once more.** impeccable `audit` then `polish` on each place at 390, 320, 844×390 and 1280;
   whatever memory-palaces does better (swipe actions, dialogs above the keyboard, empty states) brought over.

Each round: tests first, typecheck, lint, the tests it reaches; the full suite and the build before `main`; the
ADRs, CLAUDE.md and the glossary kept current.

## Second pass: the whole UI refactored (2026-10-29, the owner's "refactor the UI completely")

Sources read: `piano-data/reference-apps/new-app` (a piano chords and theory app, sampled one screen in ten),
`new_app_2` (all 24: Noji flashcards, Quizlet, Duolingo Music, simpleclub), and the UX principles now in
`.claude/skills/owner-way/references/ux-principles.md`.

### What the references do that we will do

- **Home leads with one hero card** (Noji, simpleclub): what to do now, its progress, one full-width primary
  button ("Start 2 cards", "Weiter lernen"). Ours: Learn's Continue becomes that card at the top of Learn, not a
  floating pill over the map.
- **Lists are cards of rows with a soft icon tile**, title, a one-line detail, a status pill or value and a chevron
  (new app's chapter page: Learn · Try · Check with "Read", "1 answered"). One row component everywhere.
- **Detail pages: hero → primary action → facts → sections** (Noji's deck page: title, by, rating, the card,
  About, Ratings, Cards in deck "See all"). Section headers carry a count and "See all".
- **Settings and More menus are grouped cards of plain-icon rows**; values at the end; destructive last, red,
  alone (Noji deck settings). Done for Settings; the same for a song's, a course's and a lesson's More.
- **Creating is one + that opens a sheet of ways** ("Create manually / automatically"): new song, import a file,
  from the Public library.
- **Bars are slim and centred** (back, centred title, one action), large titles only on the places.
- **Activity and achievements** (Noji, Quizlet): streak tiles, a month calendar, badges earned/locked. Ours: the
  Profile's record becomes Activity (streak, longest, active days, calendar) with achievements.
- **Public library** (Noji): search, category chips, carousels per category with "See all", item page with a
  sticky primary button (Save to my songs).
- **Lesson reader** (new app): serif heading and body, the music example interactive (chips of chords coloured by
  function, Play and Check pills), a TL;DR card, a pager with dots and Next at the foot.
- **Drill screens** (new app flashcards, Duolingo): close at top-left, a progress line, the prompt large, the keys
  full width, one big Next.

### Rounds (replacing 4–9 above, in this order)

4. **Component library.** Consolidate `shared/ui` into one set by kind — layout (screen, bar, section with count and
   See all, card), rows (one `Row` with tile, title, detail, trailing: value, pill, chevron, switch, choice; groups
   as cards), actions (primary, secondary, round, + with a sheet of ways), choice (segmented, chips, dropdown),
   feedback (toast, empty, skeleton, notice), music (keys, diagrams, chips) — merging the overlaps (settings groups,
   folds, segmented kinds), deleting the dead (`ToolButton`, `ToolDivider`), unexporting the internal. A Components
   page in the Admin area shows every piece in its states. DESIGN.md gains placement rules.
5. **Learn.** Hero Continue card; journeys and courses as cards of rows with progress; chapter page Learn · Try ·
   Check rows with status pills and a cheat sheet; course page hero → Start/Continue → lessons → songs.
6. **Lesson reader and drills.** The reader as the new app's pages; drills (Quiz, Check, trainers) as one drill
   screen.
7. **Songs.** Library rows and + sheet; song page hero → Practise/Learned → facts → chords → sections; Public
   library as Noji's.
8. **Practice.** Practice home as grouped rows with tiles; explorers' controls in one consistent bar; setup sheets.
9. **Profile and Activity.** Streak tiles, calendar, achievements.
10. **Content as data**, 11. **the block editor**, 12. **Admin**, 13. **the music editor**: as rounds 5–8 above.
