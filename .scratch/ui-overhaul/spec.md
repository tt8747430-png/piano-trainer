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
