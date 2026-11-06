# R37-1a: the loop, as Flowkey and Chordify make it

## Source

- "also now look at the app examples and how the looping is made and all other needed settings", then "continue".
- Flowkey (`piano-data/reference-apps/flowkey/06`, `07`): Loop sets a band over the bars, grips ‹ › at its
  edges drag it bar by bar, ✕ removes it.
- Chordify: Loop in the transport; the looped beats lit in the strip and grid; a count-in before each repeat.
- Canvas: https://claude.ai/artifact/HezkVS2MXdwz7uJ14KDGgp, boards "Loop bars 5–8, its settings in Pace".

## Today

- `LoopButton` (transport) loops the cursor's bar or removes the loop; the range only grows from the
  keys (Shift + arrows, `loop-reach.ts`).
- The sheet draws the loop's band with a grip at each end (`widgets/sheet-music/ui/LoopBand.tsx`,
  `LoopGrip.tsx`). The Grid and the beat strip light the looped bars but have no grips.
- The schedule rests `rest` beats before each repeat, a click on each (`shared/lib/schedule/loop.ts`);
  the Player has no control for it. Nothing stops a loop after a number of passes.

## Will build

1. **One loop grip** (`shared/ui/LoopGrip`): the sheet's, moved and given a `barAt(x, y)` so any view
   says which bar is under the pointer. A white tab with a chevron in the selection colour, ‹ at the
   start, › at the end; a slider, dragged or moved by the arrow keys, Home and End.
2. **Grips on the Grid and the beat strip**, at the loop's first and last bar, dragging it bar by bar
   (`onLoopChange`, the same as the sheet's). The strip's are pointer-only, as the strip is a picture.
3. **The Loop button says its bars:** "Bars 5–8" beside the icon from 640px, its name "Loop bars 5–8"
   for a screen reader; pressed again it removes the loop.
4. **Pace's Loop group**, shown while a loop is set:
   - **Between repeats**: None · Count-in · Rest (a bar of clicks counted down, or a silent bar). Default
     None. URL `between`.
   - **Repeats**: ∞ · 3 · 5 · 10. Default ∞. After the last, the music stops at the loop's start.
     URL `repeats`.
5. Every string in en and ru.

Goes: nothing; the keys' Shift + arrows stay.
