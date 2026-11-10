---
name: scan-first
description: Use in piano-trainer on every screen, canvas board or port, beside seven-questions: nobody reads a screen, they hunt for one thing, so check edges, differentiated content, pictures over words, signifiers and states, and emphasis as a difference from neighbours. Also when a card or settings sheet feels "off", "too dense", "a wall of text", or when a screen has cards inside cards.
---

# Scan first

Nobody reads a screen. A learner arrives with one question (which chord, which setting, which song) and hunts until
the answer turns up. Everything below makes a screen faster to scan without telling anyone where to start. Ask it of
every screen with `seven-questions`, before each publish and each port; fix every "no" before publishing.

Sources (transcripts, 2026-11-10; `redesigning-a-screen/references/lessons-from-videos.md`): a UI-design channel's
"weirdly perfect" video (a receipt, a checklist, edges) and its "every UI concept in ten minutes". Their Figma
files were sent too; this session could see only their thumbnails.

## 1. Is every element held by at least two edges?

- A receipt is hard left and hard right; only what nobody reads is centred. A card has four edges, and a row of
  avatar and name gives a fifth to stack on.
- Do not fill empty space with more content. Move content onto an edge, or make a new edge (a row of buttons lined
  up with the avatar) for the next things to sit on.
- Every row of a list is an edge for the row below. A larger icon loses the bottom edge: add a subline to restore it.
- Dividers stop at the content's column; running them across the whole screen breaks the edges.

## 2. Is the content differentiated, or one undifferentiated wall?

- More white space only makes a wall longer. Instead, vary it: a picture where a thing is referenced (an avatar, a
  chord diagram, a cover), and group by what the learner hunts by (a due date, a level, a key).
- This is why tables and lists help a long text: they differentiate it.

## 3. Is a picture doing the reading wherever one exists?

- A stop sign needs no word. Diagrams, icons and the music itself register at a glance; a paragraph of facts does not.
- When something is unclear, do not explain harder (a label, a tooltip, a comparison); find the picture that
  shows it. A row of icon-only actions still needs words or a placement that says what each does.
- Here: the notes on the staff, the keys lit in the chord's paints, the hands, the chips of a chord's tones.

## 4. Does every control say what it does and answer when touched?

- Signifiers: a container groups and marks the chosen; grey text is inactive; a chip is a value you can change in
  place, where a menu would hide it.
- Every button has rest, hover (on a pointer), pressed, focus for the keyboard, and disabled; a loading state where
  the work takes time. A field has focus, error with its message beside it, and warning.
- Every action answers at once: a spinner while fetching, a toast when done, a small motion that confirms (a copied
  chip sliding up).

## 5. Is emphasis the difference from its neighbours?

- A checkbox off is a thin border; on, it earns a fill and a check. Nobody colours the off state.
- Values at their default are grey; the one changed from its default is ink, so it finds the eye. Six coloured
  chips that all say "default" are six blue checkboxes that are off.
- To make one thing stand out, quiet its surroundings rather than shouting it louder. Here: one honey control.

## 6. Are there cards inside cards?

- Borders on borders and three radii stacked do not add structure. A single line, a column edge and sections can
  dissolve the cards into the screen; every row still stacks on the one above.
- Cards or not, the aim is the same: a screen scanned in a second.

## On our canvas

| Question | Where to look |
| -------- | ------------- |
| 1 edges | whole-screen screenshots, both sizes: what is centred, and should anyone read it? |
| 2 differentiated | lists and settings sheets: a picture or a group where the learner hunts |
| 3 pictures | every line of facts: could the staff, the keys or a chip show it? |
| 4 states | the board's `<style data-motion>` (hover, pressed, `:focus-visible`); the States tool for loading, error, offline |
| 5 emphasis | value rows: grey at the default, ink once changed (Piano settings › Sound, MIDI keyboard) |
| 6 cards | `system_measure.js` (radii, borders): nested surfaces |

## Reporting

One line per question in the report, beside the seven: kept, or fixed with what changed.
