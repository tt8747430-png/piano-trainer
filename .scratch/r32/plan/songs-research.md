# R32-C research: the song page, its details, card styles, groups

The owner, 2026-11-05: "i dont like the song overview editor … the card styles also should be refactored as it doesnt
work, is not intuitive and dont know how this applies to the list that we have on computer … look at the memory-palaces
card styles customizations … the group pages dont work and have bad ui. song overview settings also not good. the song
overview is also not so good on computer and on mobile also. i also dont like how the song overview inline editor works,
and the words and music and harmony and the edit on the score and its card styles customizations … and the level and
genre and language and add tag."

Shots are in `.scratch/r32/research/` (`research-shots.mjs`, Chromium at 402×874 and 1710×904) and `.scratch/r32/before/`
(our screens today, `shots.mjs`).

## Our screens today (`before/`)

| Screen | What is wrong |
| --- | --- |
| Song page, laptop | Two thirds of the screen empty: a 186px cover, a credit line and three chips on the left, two chord diagrams in the middle, nothing on the right. Nothing says what the song is beyond its key, time and tempo. |
| Song page, phone | The cover, one credit line, chips that wrap to a second row, then the chords; no about, no details, half the screen empty. |
| Song page's Edit (`?edit=true`, from Settings › Edit song page) | A second mode of the same page: the title and about become inline text fields, the cover a row of swatches, level, genre and language three `Dropdown`s in a row, tags a bare text box, and "Who wrote it is the score's … Edit on the score" sends the learner to the score editor to change Words, Music or Harmony. Two ways to edit one page, three kinds of control, and a detour for the credits. |
| Settings | "Edit song page" leads to that mode; Favourite is only on the cover. |
| Card style, laptop | The preview shows the phone's cards; the laptop's library is a table (`SongTable`), and the style changes nothing there but which columns show. Presets wrap (Paper and Night on a second row), a "Medium" step in Border and Shadow that is hard to tell from its neighbours, Density and Spacing are two controls for one thing, the Apply bar covers "Text colour". |
| Card style, phone | A page heading ("Home") then the preview, then a 3×2 grid of presets, then the controls under a docked Reset · Apply; "Paper" and "Night" are fixed colours, a lamp in dark mode. |
| Groups | Every New group fails on the server (below). The list is a settings group of identical lilac "users" rows, the group page a stack of settings rows; members load silently (a failure shows "Members: 0"), a member without a profile name is "—", and there is no way to join by a link one was sent other than opening it. |

## Groups: why they do not work

1. **Making a group is refused.** `create` inserts and returns the row (`insert … select … single`). Postgres checks
   the SELECT policy on a returned row as it is inserted, before the `after insert` trigger adds the maker as a member;
   the policy was membership alone, so every insert failed with "new row violates row-level security policy for table
   learner_groups". Reproduced by running `supabase/tests/groups-access.sql` against the migration on Postgres 16
   (PGlite); with `20261105150000_learner_groups_owner_reads.sql` (owner or member reads) every expected value holds.
   The fake port had no such rule, so the tests passed.
2. **The list counted members with `learner_group_members(count)`,** an aggregate that PostgREST refuses unless the
   project turns aggregates on; it now selects the members' ids and counts them.
3. **A signed-in learner saw "Sign in"** on every group page until the session was restored (`useAccount().ready` was
   not read); an invite link opened from a message showed Sign in first.
4. Members' failures, an empty name, and the members' count before they load (above).

## memory-palaces' card style (the owner's own app)

`src/pages/deck-card-style/ui/DeckCardStylePage.tsx`, `src/widgets/card-style-form/*`, `src/shared/ui/CardScene.tsx`,
`src/pages/deck-library/ui/LibraryStyleSheet.tsx`.

- **The preview is pinned:** `AppScreen`'s `pinned` slot, a pane of fixed height (`clamp(190px, 34% of the screen,
  340px)`) between the bar and the scrolling body. It never moves, never covers a control, and the controls scroll in
  the body under it. The card stands on a "scene" (the preset's backdrop), centred in the pane.
- **Presets first:** `PresetStrip`, one row of 96px tiles that scrolls sideways with snap, each tile the preset drawn
  as a small card (`role="radio"`, a ring on the chosen one). Then only what a preset does not decide: Font (a row
  opening a list), Text size (a stepper), Alignment (three icons).
- **Every preset has a night version** (`PresetSkin.dark`): "a slab of white paper is a lamp in a dark room". Plain is
  made of tokens, so the theme remaps it.
- **The bar** holds Full screen (the preview at full size) and Reset (disabled when nothing differs from the default).
- **The foot** holds Apply to… (an action sheet: This deck · This deck and its n subdecks · Every deck, the last asked
  again) and Apply, which appears only when something changed. A toast says it was applied.
- **One form, two users:** the deck's page and the selection's style sheet both compose the same `CardStyleFields`.
- **Draft until Apply:** `draft ?? saved`; leaving forgets it.

## Song pages elsewhere

- **Apple Music, laptop** (`applemusic-laptop.png`): the cover (270px) left, beside it the title, the artist, "Rock ·
  1969" in small caps, three lines of description with MORE, and Preview; the track list below at full width. The
  facts are one line, the description short, the one action under them.
- **Apple Music, phone** (`applemusic-phone.png`): the cover full width, the title, artist and "Rock · 1969" centred
  under it, one Play, the description clamped with MORE; information (release date, label, songs and minutes) is a
  plain list at the page's foot.
- **MuseScore.com score page** (saved copy; `musescore-laptop.png`): the score on the left, a right column with the
  title, the author, counts, Download · Print · Save · Share; further down **Tags** (Advanced, Classical, Solo Piano as
  chips), **Score info** (the description), and **Credits** as a two-column list of property and value: Uploaded,
  Updated, Pages 5, Duration 04:33, Measures 138, Key "E major, C♯ minor", Parts 1, Privacy, License. Facts the score
  knows (key, measures, duration) sit beside facts the uploader gave (tags, description).
- **Chordify, the app** (`chordify-app-sheet.png`, the owner's screenshots): "Learn the song" opens with a header card
  (cover, title, a line, progress), then a row of fact tiles (Capo, Tuning, BPM), then the sections as rows (a
  coloured tile, the section's name, lessons and progress, an arrow). The song's facts are tiles, never sentences.
- **Ultimate Guitar** (the page now 404s for our links; known layout): title, artist, then a strip of facts
  (Tuning, Key, Capo, Difficulty) and the tags; the chords under them.
- **Flat and MuseScore Studio's score properties:** a sheet of labelled fields (Title, Subtitle, Composer, Lyricist,
  Arranger, Copyright), the same fields that print on the score; the score shows what the form wrote.

## Properties à la Notion and Craft

- **Notion's database properties** (`notion-laptop.png`): each property a row of name and value. A click on the value
  edits that value in place: Text opens a small field; **Select** opens a list of options ("Search for an option…"),
  picking one closes it; **Multi-select** keeps the list open, the chosen as removable chips at its top, typing filters
  and Enter creates a new option. An empty property reads "Empty" in soft ink and is edited the same way.
- **Craft's page properties** and **Apple's Get Info**: the same name–value rows, one tap per value, a sheet on the
  phone.
- What we take: no Edit mode for the details. The page shows them as a list of properties, and a tap on one edits that
  one: a popover beside it on a laptop, a sheet on a phone, saved as it is chosen. Words, Music and Arranger are
  properties too, writing the same lines the score prints (one source, two places to edit it, like Flat's properties
  and its score).

## What this decides

1. **The song page** (phone and laptop): the cover, the title's byline and one facts line at the top (Apple Music);
   About clamped with More; the music (sections, your practice, chords); **Details** as a property list (MuseScore's
   Credits list, Notion's rows): Music, Words, Arranger, Level, Genre, Language, Tags, Book. On a laptop two columns:
   the song (cover, facts, about, details) on the left, its music on the right, so the screen is full.
2. **Editing the details** is tapping a property: text in a field, Level/Genre/Language in a list, Tags as
   Notion's multi-select with the library's existing tags offered. Title and About the same way. The cover is a tap on
   the cover. No `?edit=true`, no Edit song page, no "edit on the score" detour for credits.
3. **Card style** as memory-palaces': presets first in one strip, the preview pinned in a fixed pane, a Phone · Laptop
   switch showing the rows on each, Reset in the bar, Apply to… and Apply at the foot. Three-step choices, no Density
   (Spacing is the one control). The laptop's list follows the style: List is the table inside a card drawn in the
   style; Cards and Grid draw the cards.
4. **Groups:** the server fix; groups as cards with their picture and paint; a group page with its invite card, Share a
   folder, the folders and members; Join with a link from Groups; loading, error and offline states everywhere.
