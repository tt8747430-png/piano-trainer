# Open work (as of round 25, 2026-10-30)

What the owner asked for that is not done yet, what is done only in part, and what came up along the way.
Ordered by what the owner pressed hardest. Strike an item when it reaches `main`.

## Asked for, not done
1. ~~**Lessons and courses edited in place, looking as they read.** The lesson page and the course page switch to
   Edit (one pop-up, Read · Edit, as the song page's Practise · Edit); the TipTap document renders with the
   lesson view's own styles (headings, note/rule/takeaway cards, steps, questions, examples), so editing looks
   exactly like reading; no separate editor page. The floating toolbar stays; its Style menu makes every block
   style the reader sees.
2. ~~**One New sheet for every New …** (the pattern New song now has): New course (replace `/courses/new`'s page),
   New lesson and New chapter in Manage lessons and the course editor (replace AddRow's text field; adding back a
   lesson taken out stays possible in the sheet), New progression, New folder.
3. ~~**The score editor's menus brought in line** ("the options are old"): short item names, one way per action,
   drag instead of moves, the same menu look as the rest; then a full critique of the music editor (task #100).
4. **Bug sweep across the app** ("fix all the bugs"): every place at 390/320/844×390/1280, light and dark, as
   an editor, a learner and a guest; fix what is broken, clipped, doubled or unreachable.
5. ~~**Manage courses**~~ done (r25): courses dragged within their shelves, the order published as `catalog`
   `courses`; a course changes shelf by its own Shelf property, not by dragging.

## Done in part
- **Drag and drop everywhere needed:** rows, chapters, lesson blocks and Songs (in Select mode) drag. Not yet:
  Songs outside Select mode, courses, setlists' order if any, a progression's chords in its editor.
- **Lesson customisation:** a level's lesson has Read first; nothing else (cover colour, length, level) is a
  property yet.
- **Publish:** no level or style tags (the public items have no columns for them; a migration would add them).
- **Export:** one Export… sheet everywhere (the Player's More too); no export of several chosen songs from Select.
- **Public library:** redesigned after Noji; dark mode and a long list not checked by eye.
- **Actions in the bar:** done for the Profile and Learn; the other screens not yet audited for actions that
  belong in their bar.

## Noticed along the way (the owner has not seen these)
- `MidiButton` is outlined in every bar it sits in; it should be the bar's round look like the others.
- `InfoTip` needs a bar look of its own, so an ⓘ in a bar needs no class string.
- Exercises' group titles are large serif headings where Practice and Quiz use small captions.
- The score editor's keys on a phone held upright: should they start folded? (asked, unanswered)

