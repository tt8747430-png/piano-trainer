# 120. The Chord finder's name changes unheard, focus hides under the pinned keyboard, a list's highlight is invisible

Status: done
Severity: P1
Tier: 8
Rule: WCAG 2.2 4.1.3, 2.4.11 (focus not obscured), 2.4.7 (focus visible); DESIGN (3px deep-sky focus ring)
Where: `ChordFinder.tsx:42`, `Pinned.tsx`, `AppNav.tsx`, `primitives/select.tsx:103`, the switch, slider, input and textarea primitives

## What is wrong

The Chord finder's result changed while the focus stayed on the keys, with no live region; tabbing backwards hid
the focused row under the sticky keyboard or the tab bar; a pop-up list's keyboard highlight was a 1.15:1 fill; five
primitives drew their focus ring at half strength (about 2.2:1).

## The test that shows it

`ChordFinderPage.test.tsx`: the status says "C · Major triad". The rest is CSS (checked in the built stylesheet).

## The fix

A status line says the finding (`useFindingSaid`); the page's scroll padding clears the pinned keyboard at its
tallest and the tab bar; a list item takes the focus ring; the primitives' rings are full strength.

## Comments
