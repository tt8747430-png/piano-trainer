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

- **A pattern's page in the Chords page's shape (canvas 178, loop, 2026-11-14):** one piano, one bar, one shape
  across Practice. Back · Pattern · Piano · More (glass); the keys edge to edge at the top, lighting the pattern's
  notes; its name in the serif with its ♡ beside it, its book and level; one card of its bar on the grand staff and
  what it is; The hands (Right hand, Left hand); Used in; one floating bar Loop · Play ⌄ (Play over: A bar of C major,
  a song it is used in) · Practise (the Player). On a laptop the keys run across the top, the pattern on the left,
  its hands and uses on the right. More holds Make your own from it, Hide, Edit, Publish, Delete. Never a star, the
  keys docked at the foot, or Practise in the Player as a bar across the page.
## Today

`src/pages/accompaniment` → `widgets/practice-library`; content `entities/pattern/content/patterns.ts`. Rows with an
icon, a long description, a level and ···; "Course in Learn" and "Songs in Songs" chips at the top; Show all 17; a
pencil in the bar.

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

## Ported (loop, 2026-11-14), canvas 178

- **Library:** the books' Course in Learn and Songs in Songs links went, and the library's links with them.
- **A pattern's page** (`pages/pattern/ui/PatternPage.tsx`): Back (glass) · Pattern · the keys' tools · More; the keys
  at the top (`PinnedKeyboard place="top"`); the name in the serif, 36 bold, its ♡ beside it (the star went); its book
  · Built-in, or Your pattern; one card of its bar on the grand staff (what it is played over under it), its idea and
  its book's description; The hands; Used in; on a laptop the keys over a 3fr | 2fr grid.
- **Floating bar** (`widgets/pattern-music/ui/PatternPieces.tsx`): Loop (ink while it loops; the sample starts
  again as it ends) · Play ⌄ (Play over: A bar of C major, or each song it is used in, up to four; a pattern that
  plays the tune only over songs) · Practise, the Player over what it is played over. `patternSample` takes the song.
  The full-width Practise in the Player at the page's end went.
- Strings: `patterns.title`, `hands`, `builtIn`, `yours`, `playOver`, `barOfC`, `practise` in en and ru.
