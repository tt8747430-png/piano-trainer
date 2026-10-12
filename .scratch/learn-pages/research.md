# Learn pages: research for clearer lessons and interactive notation

Scope: `src/entities/lesson/content/*.ts` (prose blocks, chords, notes, quizzes) shown by
`src/widgets/lesson-view` (`LessonView`: a pinned keyboard, then sections at `max-w-prose`, `text-lg`, `gap-3`
inside a section and `gap-8` between sections). A `notes` block is `NotesExample`: a VexFlow staff, `aria-hidden`,
plus one Play button. Researched 2026-10-12.

## 1. Understandable short lessons

**Evidence**

- Mayer's cognitive theory of multimedia learning has three core ideas: two channels, limited capacity and active
  processing. It yields 15 evidence-based design principles. https://link.springer.com/10.1007/s10648-023-09842-1
  - **Segmenting.** Learner-paced chunks beat one continuous unit. **Pre-training.** Learn the names of the key
    concepts before the lesson. **Signalling.** Add cues that show how the essential material is organised.
    **Spatial and temporal contiguity.** Put a word and its picture near each other and present them at the same
    time; temporal contiguity has one of the largest reported effects (d ≈ 1.3). **Redundancy.** Extra on-screen
    text that repeats what is already shown hurts. Summaries: https://services.dartmouth.edu/TDClient/1806/Portal/KB/PrintArticle?ID=171655 ,
    https://ugc.futurelearn.com/uploads/files/7d/d6/7dd6188d-c343-4311-b064-ac98d2c95abc/Multimedia_Principles._R._E._Mayer__2020.pdf
- **Worked-example effect.** Studying an expert's solved example before solving problems helps novices. The best
  examples integrate their parts and make the structure visible with labels or segments (Atkinson, Derry, Renkl &
  Wortham 2000, RER 70(2), doi:10.3102/00346543070002181). https://assess.ucr.edu/media/741/download
- **Expertise reversal.** A technique that helps novices can hurt experienced learners. For example, integrated
  explanations help beginners, but experts do better with the diagram alone (Kalyuga et al. 2003, *Educational
  Psychologist* 38(1)). So later-level lessons should explain less and ask more.
  https://ro.uow.edu.au/edupapers/136
- **People scan.** 79% of users scanned and 16% read word by word. Concise text raised usability by 58%,
  scannable layout by 47%, and all three changes together by 124%. Guidance: one idea per paragraph, plain
  subheadings, the conclusion first, half the words. https://www.nngroup.com/articles/how-users-read-on-the-web/
- **Chunking.** Use short paragraphs with white space, headings that contrast with the body, key terms in bold,
  lists where they fit and related items grouped. https://www.nngroup.com/articles/chunking/
- **Plain language.** Use active voice ("makes it clear who should do what"), shorter words, short sections and
  verbs instead of nominalisations. https://digital.gov/guides/plain-language/writing ;
  archive: https://github.com/GSA/plainlanguage.gov/tree/main/_pages/guidelines

**What the current lessons do.** The order is already right: text, then a playable example, then "Try it" with quizzes
on the keys, so the worked example comes before practice and word and sound sit together. The problems are in the
sentences.
- Sentences are long and chained with semicolons, e.g. two-five-one: "Its subdominant is the ii7, whose root falls
  a 5th to the V; and as jazz harmony is built of 7th chords, triads are rare: ii7–V7–Imaj7."
- Terms appear before they are defined (subdominant, circle of fifths, dominant).
- Several ideas share one paragraph (triads §2 defines major and minor, gives the formulas and describes the
  colour).
- Metaphors stand in for the fact ("in jazz's dress").

### Rewrite checklist (EN and RU)

1. **One idea per paragraph, one paragraph per example.** If a paragraph has two "and"s or a ";", split it.
2. **Lead with the point.** The first sentence says what to hear or play; the reason comes after (inverted
   pyramid).
3. **Sentence length.** Aim for ≤ 20 words in EN and ≤ 15–18 words in RU, because Russian words are longer. Use no
   semicolons and at most one subordinate clause.
4. **Concrete before abstract.** Name the actual keys first ("C, E, G"), then the rule ("root, 3rd, 5th"), then the
   label ("a major triad").
5. **Define each term on first use, in that sentence,** in bold (`lead`). A term needed throughout the lesson goes in
   the first section (pre-training). Never use a term a lower-level lesson has not taught.
6. **Active, imperative voice for actions.** "Move the root up an octave" is good. In RU use the imperative
   "Сыграйте / Перенесите". Avoid канцелярит: no chains of verbal nouns ("осуществление перемещения" →
   "перенесите").
7. **Point at the example.** Refer to it in the text ("Play the row below: only the middle key moves"), and put the
   example directly under the sentence that describes it.
8. **No redundancy.** Do not list in prose the notes the example already shows and plays, unless the list is the
   lesson's point.
9. **Plain headings.** A heading says the content ("Two minor 3rds make diminished"), not a theme. Keep it to 2–6
   words.
10. **Signal the structure.** Number the steps in a procedure (`steps`). Put a caveat or exception in a `note`, never
    in mid-sentence.
11. **End each section with an action.** A quiz, or "play it": practice follows the worked example.
12. **Cut metaphors and hedges.** Keep a colour word ("bright", "dark") only when it names what the ear hears.
13. **RU parity, not word-for-word translation.** Keep the same blocks and the same order. Use the terms of the
    Russian tradition (секстаккорд, квартсекстаккорд) as the EN text uses English ones, and keep the same sentence
    budget.
14. **Lessons at levels 3 and above:** shorter explanations and more "predict, then play" quizzes (expertise
    reversal).

## 2. Interactive sheet music

**Established apps**
- MuseScore: click a note or rest, then press Play or Space, and playback starts from it. With nothing selected,
  playback starts at the beginning or where it stopped. https://handbook.musescore.org/sound-and-playback/playback-controls
- flowkey: the next notes are highlighted on the keyboard and the score. Wait mode holds until the right notes are
  played, through MIDI or the microphone, and shows missed notes on the keyboard and the scrolling score.
  https://hub.yamaha.com/flowkey-and-the-yamaha-clavinova
- Hooktheory: every example is an "audiovisual" widget that animates while it plays, and the reader can repeat a
  part at their own pace. https://www.hooktheory.com/books/one
- The shared pattern: a tap plays the item, highlighting follows the sound (temporal contiguity), and the same
  keys light up on the keyboard as on the staff.

**VexFlow 5 (installed 5.0.0; verified in source)**
- `StaveNote.draw()` wraps each note in `ctx.openGroup('stavenote', id)`, which renders as
  `<g class="vf-stavenote" id="vf-<id>">`. It also draws `ctx.pointerRect(bbox)`, an invisible rect with
  `opacity: 0` and `pointer-events: auto` the size of the note's bounding box. This is a hit target VexFlow
  already provides. https://github.com/vexflow/vexflow/blob/main/src/stavenote.ts ,
  https://github.com/vexflow/vexflow/blob/main/src/svgcontext.ts
- `Element.getSVGElement(suffix?)` returns `document.getElementById('vf-' + id)`. `addClass` and `removeClass`
  only change VexFlow's own attributes before drawing. After drawing, set classes on the DOM node.
  https://github.com/vexflow/vexflow/blob/main/src/element.ts
- The app already tags each drawn group with `data-staff` and `data-tick` (`src/shared/ui/score/engrave.ts`,
  `tagNotes`) and marks `.vf-selected` without engraving again. Hit-testing therefore needs one delegated
  `pointerup` on the score host plus `closest('[data-tick]')`, with no per-note listeners. A bar can be hit-tested
  the same way through a tagged measure group.

**Targets and accessibility**
- WCAG 2.2 SC 2.5.8 (AA): pointer targets of at least 24×24 CSS px, or spacing so that 24 px circles do not
  overlap. https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- SC 2.5.5 (AAA): 44×44 CSS px. https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html . Apple's HIG
  also uses 44×44 pt. https://developer.apple.com/design/human-interface-guidelines/accessibility
- A notehead at the current size is far smaller than this. Widen each hit area to the column, meaning the whole
  tick across the staff height and the space halfway to its neighbours, rather than the glyph.
- A score is a composite widget with one tab stop. Use roving `tabindex` (0 on the current note, −1 on the rest),
  ←/→ to move between notes, Enter or Space to play the note, and Home/End for the first and last note.
  https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/ , https://www.w3.org/WAI/ARIA/apg/patterns/grid/
- Give each focusable note an accessible name such as "E4, quarter, bar 2, beat 1". The whole figure needs a short
  description, and the line of notes as text works as the long description (`figure` + `figcaption` or
  `aria-describedby`). Keep the decorative SVG itself hidden. https://www.w3.org/WAI/tutorials/images/complex/
- While playing, highlight the sounding note with colour plus a second cue such as weight or an underline, never
  colour alone. Under `prefers-reduced-motion`, step the highlight rather than animating it.

## 3. Lesson page layout

- Line length: 50–75 characters. NN/g: https://www.nngroup.com/articles/chunking/ ; Baymard:
  https://baymard.com/blog/line-length-readability . WCAG 1.4.8 sets a ceiling of 80:
  https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-visual-presentation.html . `max-w-prose`
  (65ch) fits.
- Hierarchy: headings that stand out from the body, and short summaries for long sections (NN/g chunking). The
  lesson's `summary` should open the page as its one-line point.
- Spacing: keep less space between a sentence and its example than between examples, and less between examples
  than between sections. This way proximity, not lines, shows what belongs together. Today `gap-3` in a section
  against `gap-8` between sections does this, but text→example and example→next text get the same gap.
- Example placement: directly under the sentence that names it, never collected at the end of a section (spatial
  contiguity). On a wide screen the example can sit beside the paragraph, but on a phone always below it.
- W3C recommends referring to the figure in the text and saying what to notice
  (W3C complex images, above).

## Prioritised checklist for this app

1. **Rewrite prose by the checklist in §1**, starting with level 1–2 Fundamentals (triads, inversions,
   whole-and-half-steps, reading-notes), then two-five-one. Split long `text` blocks so each is followed by its own
   example. Add a `catalog.test.ts` guard that fails on any sentence over N words or any ";" in lesson text.
2. **Define terms on first use** with `lead` in bold, and check every term against what earlier lessons taught.
3. **Make a `notes` staff tappable.** Delegate `pointerup` on the `ScoreView` host and play the tapped tick's notes
   through the existing `onShow` and `play`, so the pinned keyboard shows them. Hit-test by column (≥ 24 px wide,
   full staff height), not by notehead.
4. **Highlight while playing.** Drive `.vf-selected` from the audio clock (the same `data-tick` path the Player
   uses), on the staff and the keyboard together.
5. **Tap a bar to play from there** in multi-bar lines, as MuseScore does with a selection plus Play.
6. **Make scores keyboard-operable.** One tab stop, roving `tabindex`, ←/→ and Enter, through `useShortcuts`
   scoped to the focused score (ADR 0036), not a raw listener.
7. **Name the notes for screen readers.** Give each focusable note an `aria-label` built from the kernel's
   spelling (EN and RU via i18n), and give the figure a caption stating the line, e.g. "C major scale up, quarter
   notes".
8. **Tune the spacing.** Tighter text→example (`gap-2`), wider between example and next idea (`gap-5`), keep
   `gap-8` or more between sections, and open each lesson with its `summary`.
9. **Higher-level lessons:** fewer explanations and more predict-then-play quizzes.
