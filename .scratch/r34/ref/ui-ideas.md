# UI improvements, from every reference

Sources: the reference notes in this folder (Songscription, Piano Trainer Studio, StemDeck, Hooktheory, Hookpad, ZaneH,
PianoBooster, AI Duet, felipefialho/piano, Piano Forte, PianoPlayer), read against our own screens in `../ui-now/`
(iPhone 17 Pro and MacBook, light, English, 2026-11-06). These are about how the app looks and reads. Features are
only included where the UI needs them. Each idea is checked against DESIGN.md.

## A. Defects found in our screens (fix first)

1. **Editor, phone:** the clef and key-signature hit areas are 7–24 px wide (Clef, upper staff, bar 1 is 24×51; Key
   signature, bar 1 is 7×41; the same in bar 3 and on the lower staff). They need 44 px targets, padded beyond the glyph.
2. **Scales, laptop:** the fingering legend ("12345671") covers the "Fingering by hand" button and the Left hand and Right
   hand headings. The key "G sharp 1" also covers "Left hand".
3. **Song page, laptop:** "Change cover" overlaps "Add to favourites".
4. **Song page, phone:** the floating Play button covers the Details card (the Composer row). There is also a blank band
   at the top.
5. **Songs, phone:** the floating + covers the last folder row ("Gorshkov's songs", its name and preview). The list
   needs bottom padding of the button's height plus a gap.
6. **Editor, phone:** the view pill (Page, Rows, Horizontal) and the floating input sheet both lie over the score, and
   the pill sits on the lower staff. The sheet should dock above the keyboard and push the score up, and the pill should
   go into the gear.
7. **Practice, phone:** Chords appears twice, under Start here and again under Theory. Show it once.

## B. The whole app

8. **One "now" colour** (Piano Forte's lamp). Honey already means "the one action"; extend it to "the one thing to play
   now" on the score, the keyboard and the falling notes, and use it for nothing else. This keeps the One Honey Rule.
9. **Every judgement has a glyph as well as a colour** (● right, ○ missed, ▲ early, ▸ late, × wrong): on the score's
   marks, in the summary and in the legend. This fulfils the Second Cue Rule, which our marks rely on colour to meet today.
10. **Hands differ by fill too:** right hand solid brick, left hand outlined lilac. This keeps the Palette Law and adds a
    second cue for colour-blind learners.
11. **Help that fades:** note names, keycaps and the next-key glow dim as a passage is mastered, and return when accuracy
    drops (Piano Forte, ZaneH's "From memory"). Use a quiet chip ("Hints: auto"), not a how-to paragraph.
12. **Copy is a label and a value:** "Tempo 92", "Key C major", "Last run 86 %". Cut the intro sentences (Practice's
    "Daily technique, theory and accompaniment, in one place.", per DESIGN.md's Don'ts) and keep rows to name plus fact.
13. **One row grammar:** icon or cover, name in Literata, one fact line, one trailing affordance. Today a folder row has
    both a chevron and "…". Keep "…" and let the whole row open the folder (Songs, Progressions, Practice).
14. **Guide mode** (StemDeck): a "?" in each bar turns the screen into its own key, and tapping a control shows its
    label and a sentence about it instead of acting. It reuses our aria labels, so no new copy is needed.
15. **One control height and four radii** across the kit (Piano Forte). Check Scales' selects, the Songs search and sort,
    and the editor sheet against it.

## C. The keyboard

16. **Keys with depth** (felipefialho): ivory with a slight gradient and a lower lip. A pressed key sinks 2 px with an
    inner shadow. A thin felt strip in brick above the keys replaces today's flat red line.
17. **C marks:** label every C (C3, C4, C5), with middle C stronger. Today only C4 has a label.
18. **Keycaps only with a computer keyboard:** show the letter on each key only after a key press or on a laptop, and
    never on touch. Owner decision still open: hidden by default.
19. **An upright phone shows fewer keys at full height:** one or two octaves, scrolled to the music's range, rather than
    52 thin keys. Turning the phone sideways shows more; there is no "rotate" nag.
20. **Range set by pressing** (Piano Trainer Studio, PianoBooster): on a MIDI keyboard, "Press your lowest and highest
    key". The drawn keyboard then matches the real one.

## D. The Player and the song page

21. **Cover from the music:** the piece's first bars engraved small (Piano Forte), instead of a letter on a colour. Keep
    the wash colour (song yellow, study grass) behind them.
22. **Fill the laptop's right column:** last run, best run, accuracy per section as a short strip, and "Next: bars 5–8
    at 80 %" as the honey action. Today it has one lone "Your practice" row.
23. **Phone song page:** title and the honey Play at the top. Details fold below. The floating button goes, so nothing
    is covered.
24. **Ghost of the last run** on the score: faint marks from the previous pass, and "Compare with last time" in the
    summary (Piano Forte).
25. **Timing markers** (PianoBooster): a small tick before or after a notehead shows early or late, not only right or
    wrong.
26. **A live accuracy figure** in the transport during a scored run, as a label and value ("Accuracy 94 %").
27. **Full screen** (Piano Trainer Studio): one control in the view menu hides the bar and the tab bar on a laptop.

## E. The score editor

28. **Docked input sheet on a phone** (see 6): durations in one row and tools in the next, attached to the keyboard
    like a system keyboard accessory, never floating.
29. **Staff names:** "Staff 1" should read as the instrument or role ("Melody", "Right hand"), and a score with one
    instrument should show no names, as engraved scores do.
30. **Search every action** (Songscription's palette): our Search palette already exists. In the editor it should also
    take "3/4", "Am7", "mf" and "+4 bars".
31. **Suggest fingering** (PianoPlayer, MIT): a button that writes finger numbers over a selection. It is a feature, but
    it changes how the editor's Fingering tool reads, so it belongs in the same round as that tool.

## F. Practice

32. **Progressions as numeral tiles:** replace the identical list icon and the plain text "I–V–vi–IV" with a row of
    small tiles, one per chord, each tinted by its role (home grass, away sand, tension lilac). Hookpad colours by scale
    degree, which would break the Palette Law, so we keep role colours. The tiles are the row's picture, and the icon
    column goes.
33. **Progression page:** the same tiles large, playable, with the current one marked in the "now" colour (8) and
    relative or absolute labels (I V vi IV or C G Am F) as a toggle in place.
34. **Scales: music first.** The staff and keyboard come first; the eight selects fold into the bar as two pickers (key
    and scale) plus the gear for the rest.
35. **Scales: one layer of labels at a time.** The staff shows fingering, or degrees, or steps (W/H), chosen in place,
    never all three. The keyboard shows degrees only when degrees are chosen.
36. **Key page** (Hooktheory): the key's chords as role-coloured tiles, its common progressions, and the learner's songs
    in that key. It links pieces we already have.
37. **Practice home:** "Up next" as one honey card at the top, from the learner's own state. The section list follows
    with name and fact rows (12, 13).

## G. Songs and Learn

38. **A Trash, not delete** (StemDeck): delete moves a song to Trash, and it is only gone when Trash is emptied. The
    archive icon in the bar becomes a menu with Archive and Trash. This matches ConfirmDialog's "a loss asks first", with
    fewer prompts.
39. **Folder previews:** use a strip of the first three covers (21) rather than an icon on a colour, so folders differ
    at a glance.
40. **Learn on a laptop:** a "Today" column (Piano Forte's plan) beside the level list, with the next lesson, one
    technique item and one song, each with a short mastery bar.

## H. The first UI round (recommendation)

Defects 1–7, then 9 and 10 (the Second Cue Rule), 16–19 (the keyboard), 21–23 (the song page), 32 (progression tiles)
and 34–35 (Scales). They are all visible on the first screens, and none needs new data.

Owner decisions: 18 (keycaps hidden by default) and 38 (adding a Trash next to the Archive).
