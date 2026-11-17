---
name: edge-lines
description: Use in piano-trainer on every screen or canvas board before a publish or port, and whenever the owner draws lines or boxes over a screenshot, says a card "feels wrong", spacing "feels too big" or "empty", things are "wrong aligned", or a page has "two focus points". Draws the screen's edges and gaps as the owner marks them, and judges grouping, cards, focus and floating actions by the laws of perception.
---

# Edge lines

The owner checks a screen by drawing on it: lines down the left edges, across the tops, between blocks, boxes round
what feels wrong. This skill does the same, measured, then names the law each mark breaks and fixes it the same turn
(`owner-way`: fix what you notice). It runs with `seven-questions` and `scan-first`, never instead of them.

The laws, their sources and what they ask here: [references/laws.md](references/laws.md). Read it once a session.

## 1. Draw the lines

```bash
# a canvas board (RT is the canvas runtime, as checks/run.mjs)
RT=$SP/dcrt/artifact-type/dc-runtime.js node .claude/skills/edge-lines/scripts/lines.mjs PublicSong 450 952 $SP/lines/pub.png
RT=… node .claude/skills/edge-lines/scripts/lines.mjs PublicSongLaptop 2000 1100 $SP/lines/pub-l.png
# an app screen on the dev server
node .claude/skills/edge-lines/scripts/lines.mjs http://localhost:5191/songs 402 874 $SP/lines/songs.png '[{"scroll":600}]'
```

Steps are a JSON list: `{"click": selector}`, `{"wait": ms}`, `{"scroll": px}`. It prints `PROBLEM` and `NOTE` lines
and writes the shot with:

- dashed blue lines on every block's left edge and top; **red** where two blocks miss each other by 1–12px;
- each gap between neighbours, green on the 4/8 scale, **red** off it;
- **orange** outlines round every card (a lighter ringed surface), so the boxes are seen as the eye sees them.

Then **look at the shot** (Read the png). The script finds near-misses and off-scale gaps; only the eye finds the rest.

## 2. Ask of the shot, in this order

1. **Where does the eye go first?** It must be what the page is for (the music on a song's page, the songs in a
   library). If a box, a band or a button wins, quiet it: take the box away, not add weight to the subject.
2. **How many focal points?** One honey act per screen. Two acts of different weight in one box, or two floating
   buttons, is two focal points: one floats (M3: one FAB), the other goes to what it acts on.
3. **Is every card earning its box?** A card is a thing you can open, among its siblings (NN/g, M3). The page's own
   subject on its own page is never a card; a lone white card on the paper is a box dropped there; homogeneous items
   are a list. Remove the box and see whether whitespace and a heading already group it: if so, the box goes.
4. **Do edges meet?** Every block sits on a shared left edge and its top on a neighbour's top (HIG: aligned items read
   as related). A red line is a near-miss: make it the same edge, or clearly different (16+).
5. **Do gaps say what belongs together?** Inside a group smaller than between groups, always; every gap on the scale.
   One gap repeated everywhere groups nothing; a gap wider than both neighbours' groups (a card floating 64 from the
   pane) cuts a thing off from what it belongs to.
6. **Is space balanced?** No column of content beside an empty band; no full-width coloured strip (a false floor, and
   "a separate colored stripe" reads as outside the content, NN/g).
7. **Is every bar full?** A bar holds the page's name (or the place's), Back, and the page's own acts. An empty bar
   is a hole at the top of the page.
8. **Is anything there that was removed?** Check the area's rulings (a pedal, a keyboard strip, a toolbar box).
9. **Is every control honest and readable?** It does what its word and its place promise (no dark pattern, no
   misleading link); colour is never the only sign; two type families, sizes by level; text 4.5:1.

## 3. Fix, then draw again

Fix every PROBLEM and every "no" above in the generator (or the app, for a port), rebuild, and run the lines again
until the shot is clean and the eye goes where it should. Name the law in the feedback-log bullet: "a lone card
(common region overused, NN/g)", not "looked off".

## In a loop

One line per screen inside the turn: what the lines found and what changed. Never a closing report (`owner-way`).
