---
name: seven-questions
description: Use in piano-trainer on every screen, canvas board or port, before each publish and before calling a screen done: the seven questions every good interface answers yes to (focal point, spacing scale, hierarchy by weight and colour, one accent, real content, matching details, motion from where the user acted). Also when the owner says a screen "looks AI-made", "cheap", "off" or "cluttered".
---

# The seven questions

The same buttons, cards and inputs can look like a product people pay for or like something an AI tool made in 30
seconds. The difference is not talent but seven things, and every good interface has all of them. Ask each one of
every screen, phone and laptop, Day and Night, before each publish and again before a port is called done. A "no"
is fixed before the publish, never only reported.

Source: a UI-design channel's video, "the seven things every good UI has" (transcript, 2026-11-10;
`redesigning-a-screen/references/lessons-from-videos.md`). First applied to the Chords page, canvas 96.

## 1. What is the one thing this screen is for, and is it the most obvious thing on it?

- One thing the eye goes to first: the biggest, highest-contrast element. Everything else is quieter.
- Usually fixed by removing, not adding: a second equal button becomes a link, a stat bar goes.
- On a settings sheet, the one control the learner came for is at the top.
- Here: one honey control per screen (`DESIGN.md`). On Chords it is the chord's name over the hands, and Play.

## 2. Is every gap on the scale, and does spacing show what belongs together?

- Gaps of 4, 8, 12, 16, 24, 32 and little else (`spacing-audit`).
- A label sits close to its field; items in a section are closer than the sections are to each other. Grouping
  then needs no line or box.
- Not every element given the same padding: that spreads things evenly and nothing reads as a group.

## 3. Does hierarchy come from weight and colour, not just size?

- A title is only a little larger than the body, but darker and heavier; secondary text is Soft Ink.
- One or two fonts (here a book serif for names, a sans for reading and acting). Headings slightly tighter.
- Lines short enough to read. Five sizes on one card is the problem.
- Large headings tighten: letter-spacing about -2 to -3%, line height 110 to 120%. An app screen rarely needs text
  larger than 24px outside its one name; a dashboard never.

## 4. Is the accent used only where it matters?

- Most of the screen is the warm neutrals; the one accent is on the main button, focus and a link.
- No gradient on the background, headline, buttons and badges. Colour everywhere means nothing stands out.
- Here: the paints mean one thing each, by where they appear (chord tones, the hands, the chrome as washes).
- Semantic colour only where it means something: grass for learned and connected, crimson for wrong and
  destructive, ochre for a gap. Colour for purpose, never decoration.

## 5. Is every piece of content real?

- Real songs, chords, names, numbers and the app's `en` strings; never placeholders or round invented numbers.
- Music is spelled as a musician writes it. **Never transform a chord symbol** (no `text-transform: uppercase`
  over one: E♭m7 becomes E♭M7, another chord). Keep capitals for labels without music in them.

## 6. Do radius, borders, shadows and icons match everywhere?

- One radius per kind of surface; a nested element a little smaller, concentric with its container.
- Borders 1px and subtle; shadows soft and layered, deeper by Night, never one heavy blur.
- Icons one set, one size and stroke, sitting on the text's line (`make-interfaces-feel-better`). An icon is as tall as its
  text's line height (24px beside 16px text), rarely larger.
- By Night there are no shadows to lift a card: a card is lighter than the page, its line lower in contrast, and a
  chip's paint dimmed. If a shadow is the first thing you notice, it is too strong.

## 7. Does every animation come from where the user acted?

- A menu grows from its button; a popover from the side it opens on; a sheet rises from the edge and follows the
  finger; a toast slides in from the edge and stacks.
- Short (160 to 280ms), eased out; it opens a little slower than it closes, and closing gets out of the way at once.
- Nothing fades in from nowhere, nothing snaps with no motion, and nothing moves under reduced motion.

## Before the seven: what premium means here, and the one decision only we would make

From Tim Gabe ("why people pay more for what looks human-made", transcript, 2026-11-10): fine is the floor, so it
says nothing about care. Before drawing, say what premium and trustworthy mean to this learner (here: calm, warm,
a real musician's instrument), feed real references, not adjectives, and name in the report one decision on the
screen that only Piano Trainer would have made (the hands at the keys, the chord tones in their paints, a staff
written as an engraver would). The website, when there is one, is built from the product's own parts.

## On our canvas

| Question | Where to look | Tool |
| -------- | ------------- | ---- |
| 1 focal point | whole-screen screenshots, both sizes | look, then remove |
| 2 spacing | `.scratch/r39/canvas/checks/spacing_measure.js` | `spacing-audit` |
| 3 hierarchy | `review_measure.js` (fonts, weights) | `design-consistency` |
| 4 accent | `system_measure.js` (colours) | `design-consistency` |
| 5 content | the board's text against `src/shared/i18n/locales/en` | `ux-writing` |
| 6 details | `system_measure.js` (radii, shadows) | `make-interfaces-feel-better` |
| 7 motion | the board's `<style data-motion>`; screenshots taken 60ms after a tap | `emil-design-eng` |

## Reporting

In the report, one line per question: kept, or fixed with what changed. A question that cannot be answered on the
canvas (motion in a still drawing) says so.
