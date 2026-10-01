# ADR 0022 — A screen opened plainly comes back as it was left

- **Status:** accepted · **Date:** 2026-10-01 · **Amends:** ADR 0003 (view state in the URL, saved state in stores)

## Context

ADR 0003 put what is on screen in the URL and only what must be remembered in saved stores. A piece practised in
G major with the 1st inversion opened again in F major, root position: nothing the Setup or a reference chose
survived leaving the screen. The owner asked for the learner's choices to be kept.

## Decision

The URL still holds what is on screen, so links stay exact and Back works. A new saved store, `pt-views`
(`entities/views`, version 1, at most 200 screens, the oldest dropped), remembers each remembered screen's last
view (its URL's params). A screen is opened from it by two rules:

1. **Opened plainly** (a link marked `OPEN_PLAINLY`: a row in Learn, a piece's Practise, Continue, the chromatic
   walk on Practice), it comes back as the learner left it.
2. **Opened by a link that names what to show** (a lesson's link, the Progressions tool's Practise, Scales' walk),
   it shows that, played the learner's way: each of the screen's **kept** params the link leaves out takes the
   remembered value.

Plainness is the link's mark, not a bare URL: the router leaves a route's defaults out of its URL, so a link that
names C major or the I–V–vi–IV in C leaves it bare, and must still show what it names.

| Screen                                              | Remembered under | Kept (rule 2)                                                                              |
| --------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------ |
| A piece in the Player                               | each piece       | key, chordSize, walk, pattern, rh, lh, inversion, tempo, hands, mode, swing, speedTraining |
| A progression in the Player                         | the screen       | walk and how it plays (not `p`, `key`, `chordSize`: the tool names them)                   |
| Walk the chords                                     | the screen       | how it plays (not `chordSize`, left out for the walk's own)                                |
| The chromatic walk                                  | the screen       | direction and how it plays                                                                 |
| Chords · Scales                                     | each screen      | hands · fingers, rhythm, tempo, hands                                                      |
| Keys, Intervals, Available tensions, the four tools | each screen      | none                                                                                       |

"How it plays" is pattern, rh, lh, inversion, tempo, hands, mode, swing, speedTraining. The loop and a path step's
panel are never remembered. Lists (Songs, Learn), the Path, Settings, Practice, quizzes, the Check and lessons are
not remembered: a stale filter would hide what the learner looks for, and the rest have no choices.

**How (app layer):** the router's context carries the store. A remembered route's `beforeLoad`
(`routes/remember.ts`), on `enter` only, builds the view by the two rules, reads it with the route's own reader and
redirects, replacing the entry, only when that changes what the screen shows. `router.subscribe('onResolved')`
saves a remembered route's params under its path (`features/remember-view`). Routes say they are remembered in
`staticData.remembered`.

## Consequences

- Links stay exact: a link always shows what it names.
- A remembered value is untrusted and read like a URL's: one the reader rejects opens the default and redirects no
  more, so a route never redirects twice.
- Back after the redirect leaves the screen the way the learner came: the redirect replaced the entry.
- A new link that opens a remembered screen plainly carries `OPEN_PLAINLY`; one that names what to show does not.
