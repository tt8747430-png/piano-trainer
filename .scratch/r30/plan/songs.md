# R30 Songs: spec

## Source

The owner, 2026-11-05: "improve all screens beginning with the songs … refactor all our ui … with no backwards
compatibility … add also features that you need"; "why the edit button is not beside the title in other pages";
"distinction between the score details and song overview details"; "add private folders with songs to specific
groups and all other features and customizations". Standing rulings: feedback-log › Song page; Library, adding,
publishing; Navigation and bars; Actions and menus.

## Today

- **Songs** (`pages/songs`, `widgets/song-library`): a full-width My songs · Explore pill takes the bar; search,
  sort and filter row; folders as cards, each with › and ⋯; the laptop shows two rows of cards over an empty screen.
  Select (☑), Archive and Card style sit in the bar. The + is a floating dial (New song, Record, Import, New folder).
- **A folder** (`/songs/folders/$id`): Back, name, Select, gear; the same search row; songs as cards (title, chords,
  key, level, ⋯). No Edit.
- **A song** (`pages/piece`): Back, title, gear and ✎ at the bar's far end; credits (Words, Music) under the bar;
  a card with Key, Time, Tempo chips, a Practise button and a Learned button; Chords and Progressions; on a laptop
  the right two thirds mostly empty. ✎ opens the score editor.
- **Song Settings**: Details (own songs: music, words, about), Colour and picture, Duplicate, Archive, Share link,
  Export…, Reset progress.
- **Score details**: the editor's Settings › Title and credits (title, subtitle, composer, lyricist, arranger,
  translator, source, year, copyright), printed on the score. Music and Words exist twice: as the score's composer
  and lyricist, and as the song's facts.
- **Groups:** only the Admin's feature-switch groups. No way to share a folder privately.

## Will build

### 1. Edit beside the title, on every screen (shared `ScreenHeader`)

`ScreenHeader`'s `edit` moves from the bar's end to right after the title: [Back] Title ✎ ………… tools ⚙ ⋯. Every
screen with an Edit passes it through `edit`: the song, a folder (rename and look, in place), a lesson, a course,
Learn, a progression, a pattern, a chord sheet, a draft. Done takes the same place while editing.

### 2. Songs, the place (`/songs`)

- **Bar:** the title "Songs" (large); on its right Select ☑, Archive (with its count), ⋯ (Card style). No palette ⌕
  here: the search field is Songs' search (the palette stays on Learn and Practice and ⌘K). The
  My songs · Explore switch is a compact segmented control of its own width: beside the title on a laptop, under
  the bar on a phone (`ScreenHeader`'s `switcher`, Learn's too). Explore's bar holds the title alone.
- **Phone, My songs:** search field with Sort and Filter; then *Continue* (the last two songs played as whole cards on a phone, a row on a laptop); *Folders* (rows with picture, name, count, ⋯; swipe and drag as today); *Shared with me* (folders a group
  shares, each with the group's name); *All songs* (rows), "Show all n".
- **Laptop (from 64rem), My songs:** two panes. Left, 280px, the library tree as Mindscape's: All songs, Favourites,
  Recently played; Folders (nested, expandable, drag targets); Shared with me; Groups; Archive at its foot. Right,
  the selected list (All songs by default) as a table-like list: Title, Key, Chords, Level, Learned, last played; sort
  by any column's header. The laptop screen is full.
- **The +** stays the one floating honey button; its sheet covers the tab bar: New song, Record, Import, New folder,
  **New group**.
- Groups is reached from the tree on a laptop and from "Groups" beside the Shared with me heading on a phone.

### 3. A folder (`/songs/folders/$id`)

- Bar (phone): Back, the folder's name ✎ (✎ edits name, picture and colour in place: the bar keeps the name with Done
  in the pencil's place, and the name field, picture and colour open under it), Select, ⚙.
- Header block: its picture tile, its count ("12 songs · 3 learned"), and when shared, "Shared with Choir · 8
  members".
- Songs as rows: title, credits line, key chip, level, Learned tick; ⋯ and swipe. Titles wrap to two lines.
- Laptop sorting is the table's column headings; the folder's own order shows drag handles ("Your order").
- Laptop: chosen in the tree, the folder is the bar (its picture, name ✎, count and sharing, Select, ⚙); the songs
  are the table of the library's right pane.
- Delete folder asks in a dialog that names what goes: its songs, and the groups that lose it.
- Folder ⚙ (Settings): **Share with a group** (a sheet over the folder; the row says how many groups) (groups chosen, each Can view or
  Can edit), Card style, Archive, Delete folder (red, last, confirmed).

### 4. A song's page (`/songs/$id`): the overview

- Bar: Back, the title ✎ ……… Learned (a named toggle, ✓ and the word, lit when learned, per feedback-log), ⚙.
  Favourite ♡ sits on the cover's corner (Apple Music's).
- **Phone:** the cover (its picture and colour) and the credits as one line ("John Newton · New Britain"); facts as
  chips (Key G, 3/4, 80 BPM, Level 2); About (two lines, More); Sections (if any); Chords (diagrams); Progressions.
  **Play** is the floating 56px honey circle (opens the Player); ♡ on the cover's corner, phone and laptop alike.
- **Laptop:** two columns. Left (380px): cover, facts, credits, About, Tags. Right: a score preview of the first
  lines (Verovio, the Player's); Sections and **Your practice** side by side (times played and the last day, best
  tempo of the marked tempo, takes: what progress and takes already record); Chords; Progressions. Play floats at
  the bottom right.
- Level shows its bars and its number ("2"), never bars alone.
- ✎ (Edit) turns the page into its edit mode in place (Notion's), the page staying whole as it reads; the bar keeps
  its title with Done in the pencil's place, and the title (first), About, Level, Genre, Language, Tags, picture and
  colour become fields where they are. The credits show "Printed on the score" and a link "Edit on the
  score", which opens the editor on the score's title block.

### 5. Score details vs song details

| What | Where it lives | Where it is edited |
| --- | --- | --- |
| Title | the score (one title) | on the score, or the song's ✎ (the same field) |
| Subtitle, Composer, Tune, Lyricist, Arranger, Translator, Source, Year, Copyright | the score: printed | on the score (tap the printed line) or Score › Title and credits |
| About, Level, Genre, Language, Tags | the song: never printed | the song's ✎ |
| Picture and colour | the song | the song's ✎ |

The song's facts lose Music and Words: the overview reads them from the score's Composer and Lyricist. Song
Settings › Details goes (its fields are the page's own in Edit).

### 6. Groups and private folders

- **Groups** (`/songs/groups`, `/songs/groups/$id`): a learner with an account makes a group (name, picture; its ✎
  edits both in place, as a folder's); its page lists members (avatar, name, Owner/Member), Invite by link (copied; it joins whoever opens it signed in; a Link on switch stops new joins), members each with
  ⋯ (Make owner, Remove from group) for the owner,
  the folders shared with it; its ⚙ (as a folder's) holds its picture, Leave group and, for its owner, Delete group
  (red, confirmed, the dialog naming what is lost).
- **Share a folder:** folder ⚙ › Share with a group: groups as checkboxes, each Can view or Can edit. The folder's
  songs go to the server as a copy kept current: each change of the owner's folder updates it.
- **Shared with me:** members see the folder in Songs › Shared with me, read-only for Can view (Duplicate to my
  songs), editable for Can edit. A guest sees "Sign in to share with a group".
- **Backend:** new tables `learner_groups`, `learner_group_members`, `learner_group_invites`, `shared_folders`
  with RLS: a group's rows readable by its members, written by its owner; a shared folder written by its owner
  (and by members with edit), read by the group's members. Access tests for each.

### 7. Explore (`/songs?view=explore`)

The same segmented control; search says "Search public songs"; shelves fill the laptop (5 per row at 1710); categories as chips; skeleton, nothing-found (Clear search),
offline (My songs) and could-not-load (Try again) states.

## What goes

The full-width My songs · Explore pill in the bar; › chevrons on folder cards (the card opens; ⋯ stays); the song
page's Practise card and Learned button (Play floats, Learned in the bar); Song Settings › Details; the song facts'
Music and Words; Edit at the bar's far end.
