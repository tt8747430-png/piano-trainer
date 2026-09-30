# 103. Each beat group re-renders the sheet's labels and names every bar again

Status: done
Severity: P3
Tier: 6
Rule: `rerender-memo`
Where: `src/widgets/sheet-music/ui/SheetOverlay.tsx:37,40`, `BarTargets.tsx:31`, `src/entities/piece/ui/use-section-heading.ts:29`

## What is wrong

When only the cursor moved, `SheetLabels` redrew up to 48 bar numbers and 68 chord spans, `BarTargets` made up to 48 `t()` calls, and `usePieceHeadings` returned a new array, so nothing could skip.

## The test that shows it

Structural: the Player's and the sheet's tests, green before and after. Per beat group: 48 `t()` calls and the labels' render before; neither after.

## The fix

`SheetLabels` is `memo`; the bars' names are memoised on the layout, the performance and `t`; `usePieceHeadings` memoises its array.

## Comments
