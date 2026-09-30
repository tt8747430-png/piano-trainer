# 108. First-visit waits left as they are

Status: wontfix
Severity: P3
Tier: 6
Rule: CODE_STYLE §7
Where: `src/widgets/sheet-music/ui/SheetMusic.tsx:7`, `src/app/router.tsx:210`, `index.html`

## What is wrong

The Player shows nothing until VexFlow's chunk arrives; `/play/$pieceId` awaits the Player's chunk to find the piece, even for one that is not there; `/` fetches its screen after the entry runs.

## The test that shows it

Measured by the Tier 6 review: the Player's closure is 691,779 B / 218,729 B gzip beyond the entry.

## The fix

None.

## Comments

Each waits on the first online visit only: the service worker precaches every chunk, and an installed app reads them from the cache. The sheet music is the Player's screen, not a part of it that may come later.
