# R39-9 · Accompaniment, redesigned

Premium here means one Pattern library, the same in Practice and in the Player's Pattern page, where each pattern is
seen (its roll) and heard (Listen) before it is chosen, as Smart Pianist's style list does.

## The rulings as they stand

- "The Player's Pattern page is a library: Search; place chips at the top (All, Favourites, Recently used, each book,
  Mine); a Sort and filter page (Sort by, Level, Texture, Feel, Reset · Show n) with its count on the button and
  removable chips; folders that fold by their header (Recently used and Favourites open, each book closed, its groups
  inside, Mine's own folders), Close all / Open all; rows with roll, hands line, level, Listen, heart. Never chips by
  kind, stars or cards two a row." Practice's Accompaniment is that library, one implementation.
- "content kinds never mixed": patterns only; the course and songs links of today's page go (they are Learn's and
  Songs').
- Names are the trade's: Accompaniment and Pattern (Smart Pianist).
- A pattern is a page (canvas 134): a row opens it, built-in or your own; ··· holds Edit, Duplicate, Publish and Delete (gone at once, with Undo). New pattern opens the same editor empty.

## Today

`src/pages/accompaniment` → `widgets/practice-library`; content `entities/pattern/content/patterns.ts`. Rows with an
icon, a long description, a level and ···; "Course in Learn" and "Songs in Songs" chips at the top; Show all 17; a
pencil in the bar (`drawings/today-accompaniment-*.png`).

## Will build (canvas row 7)

Phone: Back, Accompaniment, ··· (Select, Arrange, Hidden patterns); search and Sort and filter; place chips All ·
Favourites · Recently used · Called to Play · Called to Play 2 · Rhythm styles · Mine; removable chips; Open all; the
folders; each row: the roll (left hand violet, right hand honey), name, hands line, level bars, Listen, heart. A tap
opens the pattern in a sheet: book and group, name, level · texture · feel, a large roll, the hands, how to play it,
Listen, Practise in the Player, Over a progression ›, In a song ›. + Add: New pattern, New folder. Laptop: the
library on the left, the pattern on the right (an empty state until one is chosen), Add in the bar.

## History

- 2026-11-08: drawn (canvas v7); waiting for the owner.

Sources: Yamaha Smart Pianist's Style list (Accompaniment, Pattern, listen before choosing); the app's pattern books
(`patterns.ts`).
