# R32-C: the song page, its details, card style, groups

## Source

The owner, 2026-11-05: "i dont like the song overview editor … the card styles also should be refactored as it doesnt
work, is not intuitive and dont know how this applies to the list that we have on computer. and also look at the
memory-palaces card styles customizations to take an example how these pinned cards should be and other best practices
from it and from other resources. the group pages dont work and have bad ui. song overview settings also not good. the
song overview is also not so good on computer and on mobile also. i also dont like how the song overview inline editor
works, and the words and music and harmony and the edit on the score and its card styles customizations i also dont like
how it works and the level and genre and language and add tag."

Research: `songs-research.md`. Mockup: `../mockups/songs.html`.

## Today

- `pages/piece/ui/PieceView.tsx`: the bar (Back, title, ✎ → score editor, Learned, ⚙); a 24rem left column (cover,
  byline, facts chips, level/genre/language chips, about, tags) and the music on the right. `?edit=true` (from
  Settings › Edit song page) turns the page into a form: `SongDetails.tsx` (title and about as `DocText`),
  `CoverLook`, `SongDetailsFields.tsx` (three `Dropdown`s, a tag box), and a line sending Words/Music to the score.
- `pages/piece/ui/SongSettingsPage.tsx`: the song's head, Edit song page; Library (Folder, Duplicate, Archive);
  Share (Publish, Share link, Export…); Delete or Reset apart.
- `widgets/style-editor/StyleEditor.tsx` (Card style and a lesson block's style) and `pages/songs/ui/CardStylePage.tsx`:
  a sticky preview of the phone's rows, presets as a 3-column grid, Corners, Border (4 steps), Shadow (4 steps), Fill,
  Text colour, Spacing, Layout, then On each card, Density, Apply to (radio), docked Reset · Apply. The laptop's
  library (`SongTable`) honours only On each card.
- `pages/groups/*`: settings-row lists; creating a group fails on the server (research §Groups).

## Will build

### 1. The song page (`/songs/$pieceId`, phone and laptop)

The bar is unchanged: Back; the song's title (large, two lines before an ellipsis) with ✎ (Edit score) beside it;
Learned; ⚙ Settings. Play floats (honey, 56px).

**Phone, top to bottom:**

1. **The head:** the cover (112px, its ♡ on its corner) beside the byline: the other title, "Your version", who wrote
   it (credits as printed), the book. A tap on the cover opens **Cover** (below).
2. **Facts line:** Key (a link to its scale), Time, Tempo, Level (its mark), Genre, Language, as one wrapping row of
   chips; Genre and Language only where set.
3. **About:** the paragraph, two lines and More. Where it is empty and the learner may write it: nothing here (it is a
   property under Details).
4. **The music:** Sections (where more than one), Your practice, Chords and Progressions, unchanged.
5. **Details** (heading "Details"), a card of property rows, each a 52px row of name (left, soft ink) and value (right,
   ink), editable rows with a chevron:
   - **Title** — the learner's own song or an editor's built-in song: text.
   - **About** — the same: a paragraph.
   - **Music**, **Words**, **Arranger** ("Harmony" credit) — text; written into the score's header (the same lines the
     score prints), so the score and the page agree. On one of the app's songs, as printed, not editable.
   - **Level** — select: None, Beginner … Professional with their marks. One of the app's songs in a course: the
     course's level, not editable, with ⓘ "Set by its course".
   - **Genre** — select: None, Hymn, Worship, Christmas, Folk, Classical, Pop, Jazz, Children’s, Study.
   - **Language** — select: No words, English, Russian, Ukrainian, German, Latin, Another language.
   - **Tags** — multi-select: the chips, then "Add a tag".
   - **Book** — the source, where it has one, not editable.
   An empty editable value reads "Add" in soft ink.

**Laptop (from 64rem):** two columns. Left (24rem, sticky under the bar): the cover (full column width up to 240px,
its ♡), the byline, the facts line, About, Details. Right: the music. Nothing else moves.

**Editing a property** (Notion's): a tap on a row opens its editor, **a popover beside the row on a laptop, a sheet on
a phone**, titled with the property's name:
- Text (Title, Music, Words, Arranger): one field, focused, with **Done**; Enter saves; an empty Music, Words or
  Arranger removes the line; an empty Title keeps the old title.
- About: a text box (6 lines), **Done**.
- Select (Level, Genre, Language): the options as rows with a check on the chosen; a tap saves and closes.
- Tags: the song's tags as chips with ×, a field "Add a tag", under it the library's other tags that match what is
  typed (a tap adds), and "Create “…”" for a new one; Enter adds. **Done** closes.
Every change is kept at once (an own song's in the pieces store; an editor's in the song's draft, published from
Settings; level, genre, language, tags and cover in the library).

**Cover** (a tap on the cover): the sheet/popover "Cover": Picture (12 pictures), Paint (5 paints), **Remove the
cover** where one is set.

**Goes:** `?edit=true` and the page's Edit; Settings › Edit song page; the line "Who wrote it is printed on the score.
Edit on the score"; `SongDetails.tsx`'s forms and `SongDetailsFields`; the tags pills under About (the Details row
holds them).

### 2. A song's Settings (`/songs/$pieceId/settings`)

One column, `max-w-2xl`, groups in order:
1. **The song:** cover, title (two lines), composer under it. No row under it.
2. **Library:** Folder (its folder as the value ›), **Favourite** (switch), Duplicate (asked first), Archive or
   Restore.
3. **Share:** Publish (Published, Changed or Not published ›), Share link, Export… ("MusicXML, MIDI").
4. Apart, red: Delete song, or Reset to original, asked first.

### 3. Card style (`/songs/card-style`, `/songs/folders/$folderId/card-style`; the editor shared with a lesson block)

- **Bar:** Back, "Card style", and **Reset** (↺, an icon with its label, disabled while the draft is the default).
- **The preview, pinned:** a pane of fixed height (`clamp(13rem, 34dvh, 21rem)`) under the bar on a phone, on the muted
  "scene"; it never covers a control, the controls scroll beneath it. Its caption at its top: the place's name ("Home",
  "Hymns") and a two-part switch **Phone · Laptop**: Phone draws the place's first rows as the phone's list draws them;
  Laptop draws them as the laptop's right pane does (List: the table; Cards and Grid: the cards). On a laptop the pane
  is the left column (sticky, 30rem tall) and starts on Laptop.
- **The controls, in order:**
  1. **Style:** the presets in one strip that scrolls sideways (Plain, Soft, Bold, Paper, Night, and Custom when the
     style matches none), each a 96px tile drawing the preset as a small card with "Aa", `role="radio"`.
  2. **Layout:** List · Cards · Grid, each a tile with its picture.
  3. **Spacing:** Compact · Normal · Roomy (also the rows' height; Density goes).
  4. **Card:** Corners (five corner pictures), Border (None · Thin · Thick), Shadow (None · Low · High).
  5. **Colours:** Fill and Text, swatches and a custom colour.
  6. Card style only: **On each card:** Key, Chords, Level and progress (switches).
- **The foot (docked):** **Apply to…** (outline) and **Apply** (honey, enabled when the draft differs from what is
  saved). Apply to… opens a menu: This folder (Home: "Home only"), "With its 3 subfolders", "Every folder (12)" (asked
  first). A toast-line says "Applied to 1 place".
- Paper becomes the sand paint (it follows the theme); Night stays a dark card by design.
- **The laptop's library follows the style:** List is the table, inside a card drawn in the style (its corners,
  border, shadow, fill and text), its rows as tall as Spacing says; Cards and Grid draw the song and folder cards in the
  right pane as the phone does.
- A lesson block's style (its sheet) uses the same editor: the preview pinned at the sheet's top, presets, Spacing,
  Card, Colours; no Layout, no Phone · Laptop.

### 4. Groups

- **Groups** (`/songs/groups`): bar Back, "Groups", More: **Join with a link**. Each group a row: its picture on its
  paint, its name, "4 members", **Owner** where it is the learner's. Under the list **New group** (soft). Empty: "No
  groups yet" with New group and Join with a link. Signed out: "Share folders with a group" and Sign in. Loading:
  three row skeletons. Error/offline: the line and Try again.
- **Join with a link** (a sheet): a field "Invite link", Paste-tolerant (a whole link or its code), **Open**, which goes
  to the invite's page.
- **A group** (`/songs/groups/$groupId`): bar Back, its name, ✎ (owner: rename in place), More (Leave group, or Delete
  group for its owner, asked first).
  1. **Head:** its picture on its paint (64px), "4 members", Owner where it is the learner's.
  2. **Invite link** card: "Anyone with the link can join" (or "The link is off"), **Copy link** (honey-less soft
     button), and for the owner the switch **Invite link on**.
  3. **Shared here:** each folder a row (its picture and paint, its name, "Can edit · 12 songs", "Shared by Mihai" or
     "Yours"), then **Share a folder…** (a sheet listing the learner's folders; a tap opens Share with a group for it).
  4. **Members (4):** each its initial on a paint, its name (or "Member" when it has none), "You", Owner; the owner's ⋯
     Remove (asked first). Loading: skeleton rows; a failure: the line and Try again.
- **A shared folder** (`/songs/shared-folders/$sharedId`): its head (picture on paint, name, "Shared by Mihai ·
  Choir", Can edit or View only); its songs as song rows (key, title, the line); for the learner's own share **Stop
  sharing** (asked first).
- **An invite** (`/songs/groups/join?code=…`): a card with the group's picture, "Join Choir?", "4 members", **Join**;
  signed out Sign in (back here after); off or wrong: "This invite link is off or wrong."; loading; offline.

## What goes

The song page's Edit mode, Edit song page, the "edit on the score" line, the style editor's 4-step Border and Shadow,
Density, the Apply to radio, the grid of presets; the groups' grey lilac rows.

## Left for the owner (drawn)

1. Details at the end of the phone's page (recommended, Apple Music's info at the foot) or right under About.
