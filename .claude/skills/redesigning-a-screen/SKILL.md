---
name: redesigning-a-screen
description: Use in piano-trainer when the owner asks to refactor, redesign, simplify or "make ideal" a screen, its toolbar or its settings (the Player, Songs, a song's page, the editor, Practice, Learn, Profile, Settings), says a screen is cluttered, or asks what still has to be ported from a design to the app.
---

# Redesigning a screen

## Overview

A screen is redesigned on a published canvas first and built only after the owner says "ok". The canvas changes
with every reaction; a spec records each ruling in the owner's words, so nothing removed comes back. Then the app is
audited against the canvas and ported one item per commit. Read `owner-way` first; this skill is its loop for a
whole screen. `CLAUDE.md` still binds every change.

## The loop

1. **Read before touching anything:** the area's section of `owner-way/references/feedback-log.md`, its ADR, and, if
   the area has a spec, its **"The rulings as they stand"** section. A thing a ruling removed is never redrawn.
2. **Audit today, in the code:** list every control on the screen and in its settings, with its file, exact label,
   values and default (`grep` the area's `ui/` and its `en` strings). Shoot the screen. Never say where something
   lives, or that it exists, without the file in front of you.
3. **Research:** the area's reference apps (`owner-way`'s table), read in their manuals and help pages (web-fetch),
   sheet-music and learning apps only (Flat, forScore, MuseScore, Soundslice, flowkey, Smart Pianist, Band-in-a-Box,
   Yamaha, Chordify), never recording software. First check whether the app already has the same thing elsewhere
   (a library, a filter sheet, a picker): reuse its shape, one implementation. Cite every source in the spec.
4. **Spec:** `.scratch/<round>/plan/<area>.md`. Top: **The rulings as they stand**, one bullet each, the owner's words
   quoted, the decision, its references. Below: the history, newest last. When a later ruling replaces a line, fix or
   mark that line in the same edit.
5. **Canvas:** one Design artifact per area, phone and laptop, real song, real labels, every panel and page reachable
   and working (taps, sounds, filters). Publish to the same URL each time.
6. **Each reaction from the owner** is one turn of this loop, in this order: re-read the rulings; change the canvas;
   run its browser test and look at the screenshots at both sizes; publish; write the ruling into the spec and a
   bullet into the feedback log; save the drawing to `.scratch/<round>/drawings/`; commit those files by path and
   push (docs go at once); report.
7. **When asked what is left to port:** a table in the spec, `# | canvas ruling | app today (files) | port`. Then list
   the stale lines found, and ask about what the canvas has no place for (acts, menus, old features), each with
   your recommendation. Record each answer as a ruling: kept with its home, or removed with no home elsewhere.
8. **Build** only after the owner's "ok": the port table's order, one item per commit, `owner-way`'s gate.

## The owner's taste, held across screens

| Rule | Example ruling |
| ---- | -------------- |
| Professional musician's names, no invented phrases | Arrangement · Accompaniment, not "As written · From the chords"; Practice, not Pace |
| No explanation line under a control | an ⓘ at most |
| Fewer settings; one that shows or sounds no difference goes | no cursor, scroll, pedal, skin tone, recording or voicing settings |
| One home per setting, a link row elsewhere | Keyboard: Connect a piano ›, All piano settings › |
| No setting disables or hides another | each works in every mode |
| A choice with its own list opens a page with Back (Flat) | Metronome sound ›, Pattern ›, Sort and filter |
| Two exclusive choices are radio cards, each holding its own control | Arrangement (Level) or Accompaniment (Pattern) |
| A collection is a library in the app's library shape | search; place chips on top; a Sort and filter page with its count on the button, removable chips and Show n; folders that fold with counts; Recently used and Favourites first; a heart, not a star |
| A drawing is the whole screen, never a control alone | `owner-way/references/ui-and-mockups.md` |
| No finger numbers on or under keys | |

## Reporting

Answer first, in the owner's words for things. Then what changed (bullets), the checks run, the canvas link and
version, the push state, and the open questions numbered, each with your recommendation, already drawn. A question
the owner answers with a question gets the facts from the code, the choices, and one recommendation.

## The canvas tools

The R37 Player canvas's generator is in `.scratch/r37/canvas/` (its `README.md` says how to run it). Copy its parts
for a new area rather than starting over.

## Common mistakes

| Mistake | Instead |
| ------- | ------- |
| Redrawing something a ruling removed | read the rulings first, every turn |
| Saying where a feature lives from memory (the Tuner is "in the Tools menu") | check the code, then say it |
| A reference cited but never read | read its manual page; quote its labels |
| Several options drawn when the owner asked for one improvement | build the recommendation; ask after, drawn |
| Rejected patterns returning in new clothes (chips by kind, stars, two-a-row cards) | the feedback log's "Never" lines |
| App code started while the design is open | the canvas until "ok"; then port |
| Docs left out of a turn | spec, log, drawing, commit, push: every turn |
