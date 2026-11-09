# R42 · Chords in the Player's shape

Canvas: The ideal Piano Trainer, v16 (https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH), boards Chords and
ChordsLaptop. Generator: `.scratch/r39/canvas/r42_chords.py` (run by `r41.py`, last).

## The rulings as they stand

- **v78 (canvas Version 78): the app's own 3D hands play the chord; the hands control is the Player's.** Owner, of
  v77's drawn hands: "DONT you see how awful this looks, can you make proper implementations like the 3d piano does
  and the left and right hand settings refactored." Replaces every drawn hand (v72–v77) and the hand cards.
  - **The piano at the top is the Player's 3D piano, live:** the app's stage itself (`createStage`,
    src/widgets/piano-hands: its keyboard, hand models, pose table and choreography), bundled and run in the board,
    so the hands are the real ones, each finger on its key by the chord's fingering; it follows root, chord,
    inversion, voicing and hands. Keys under a hand take that hand's colour (right brick, left lilac), as in the
    Player. One implementation: the app's Chords page mounts `PianoHands` with the chord's fingered notes.
  - **Keyboard settings:** **Off · 3D · 2D** (the Player's own three); 3D is the default; 2D is the flat keys with
    Keys and Labels; where 3D cannot be drawn the page falls to 2D.
  - **Hands, refactored:** under the piano, the Player's control, **Left hand · Both hands · Right hand**, in the
    keys' order (`HandsSegmented`, R36). With both hands, one more row: "Left hand plays the" **Chord | Root** (v73's
    rule). The hand cards under the staff are gone; the staff card is the staff alone.
  - **Fingering** is read off the hands and the staff's numbers; no numbers on keys (standing rule).
- **v77 (canvas Version 77): the hands are at the keys.** Owner, of v76's separate hand drawings: "I dont like it,
  be creative and think outside of the box". Replaces the hand pictures under the staff (v72–v76); v76's numeral
  rules (upright, bold, in a fingertip circle) stand.
  - **One picture instead of two:** under the page's keyboard lie the hands, drawn flat from above; every playing
    finger reaches to the key it plays and ends in a circle with its number, filled in that key's colour; resting
    fingers stay curled at the palm; **L.H.** / **R.H.** on the palm. Change the chord, the inversion or the hand and
    the fingers move to their new keys. The learner sees which finger goes on which key, not a hand beside a keyboard
    to be matched by eye.
  - **Sources:** flowkey and the courses app film the hands on the keys with the note over the lit key
    (piano-data/reference-apps/flowkey/08-player-hands-menu.png, courses-app/03-playing-with-both-hands/01.png);
    Pianote's overhead photo puts the numerals at the fingertips on the keys; Hoffman repeats the fingertip circles
    on the keys; Vita Piano draws the fingers over the keys they play (web-references/new_apps). Every chord source
    read puts fingering at the keys (Pianote, Yamaha, pianochord.org).
  - **The standing rule holds:** no finger numbers printed on or under keys; the number is on the fingertip, which
    sits on the key.
  - **Under the staff** only the two hand toggles remain, each naming its chord (Left hand **C**, Right hand **Em**),
    and Chord | Root. On a laptop the keyboard is 180 tall with the hands below it.
- **v76 (canvas Version 76): finger numbers as the teaching sources draw them.** Owner: "I dont like this, make proper
  implementation of the finger numbers colors and research more for how to do it", then "but you didn't research
  enough". Replaces v75's badges and floating italic numbers.
  - **Research** (images viewed, URLs in the history line's sources): Faber Piano Adventures Primer p. 6
    (primerguide.pianoadventures.com/units/finger-numbers), Hoffman Academy's Finger Numbers sheet, Pianote's
    beginner pages, pianoscales.org/fingerings.html, pianochord.org, Yamaha Hub's keyboard-fingering page, Synthesia,
    Soundslice and LilyPond's manuals, WCAG 1.4.1; and the owner's saved Vita Piano pages
    (piano-data/web-references/new_apps) and reference apps (flowkey 08, courses-app 03). Not readable: Skoove,
    Yousician, MuseScore's forum, Dorico's manual (403), Gould's _Behind Bars_.
  - **What three or more agree on, and what we draw:** hands from above, thumbs inward (Faber, Hoffman, pianoscales,
    Pianote); 1 is the thumb in both hands; the numeral **upright and bold, never italic**, about a finger wide, on or
    just past the fingertip; Hoffman sets each in a **fingertip circle**, drawn only where a finger is used.
  - **So:** each fingertip carries a circle with its upright number. A finger that plays: the circle filled in its
    note's colour, bold ink numeral, the note's name just past the tip. A finger that rests: an empty, faint circle.
    Fill, numeral and name carry the meaning besides the colour (WCAG 1.4.1).
  - **Colour is per note, not per hand or per finger,** against the sources' habit (Hoffman, Synthesia, Soundslice
    colour by hand; Faber by finger): this page already colours each chord tone the same on the keys and the staff,
    so the fingertip takes that colour and the three pictures read as one.
  - **Added with Firecrawl (2026-11-09):** pianoguidelessons.com/fingering-chords-on-piano confirms the triad
    fingerings and gives the triad with its octave: LH 5-4-2-1, RH 1-2-3-5 (as Nikolaev's table). Seventh-chord
    inversion fingering is still unsourced: the one page that might give it (music.stackexchange.com) refused (403).
  - **Not taken:** every chord source prints the fingering on or under the keys (Pianote, Yamaha, pianochord.org);
    the owner's standing rule is no finger numbers on keys, so the hands carry them.
- **v75 (canvas Version 75): proper 2D hands.** Owner: "use proper hands", then "use proper 2d hands". Replaces v72's
  capsule fingers; v73's labels and Chord | Root stand.
  - **The hands are true hand outlines, flat:** a left and a right hand seen from above, as the player sees them on
    the keys (thumbs inward), one pale fill and one ink line, no shading. They are traced from the app's own hand
    models (src/widgets/piano-hands/assets, MIT) so the proportions are a real hand's; a 3D-shaded render was tried
    first and was not what was asked.
  - **On each finger its number** (1–5, italic); a finger that plays carries a round badge on its tip in the note's
    role colour with the note's name. A hand that does not play is faded.
- **v74 (canvas Version 74): the staff shows how the chords connect; Practise is what the teachers drill.** Owner:
  "improve the current chords page with the best practices and research more first and use the piano data and its
  transcriptions and examples". Research: 15 reference-app screens, the chord books, 4 transcripts read and the rest
  of the 1,616 grepped (paths under piano-data/).
  - **Voice leading, drawn.** Between neighbouring chords a note both share is **tied**, as a held note is written;
    every other note is traced by a dotted line to the note it moves to (moves of a third or less). An added chord
    takes the inversion and octave nearest the chord before: C, F, G, C reads C · F/C · G/B · C. Sources: "the number
    one principle in voice leading is that you're trying to move as little as possible… whenever there's a common
    note… keep" it (transcriptions/youtube/watch-later/065 @14:18–16:58); "lift the top two notes" up a fourth, "drop
    the bottom two notes" up a fifth, "annotate it… by using arrows" (exercises/081 @03:20, @08:44, @08:14).
  - **Practise in the Player, by the chord.** One chord: **Blocked, through the inversions** · **Broken, with the
    metronome** · **In all 12 keys** (piano/067 @12:41, @36:21, @44:19: blocked through the inversions, then broken
    in eighths at 100–120; piano/519 @09:27: "move up in half steps", or the circle of fifths). Several chords:
    **From C to F** for each change (up to four), **All 4 chords, looped**, **In all 12 keys** (reference-apps/chordify
    IMG_4562 "Individual transitions: From E to C♯m", IMG_4566 count-in and loop; watch-later/003 @10:42: learn the
    chord-to-chord moves). Replaces the three fixed rows.
  - **Fingering, checked:** triads match Nikolaev's table (books/nikolaev/scales-chords-and-arpeggios-table.pdf p. 1:
    RH 1-3-5, 1-2-5, 1-3-5; LH 5-3-1, 5-3-1, 5-2-1) and Pianote (watch-later/036 @01:04). **Open:** no source in
    piano-data gives finger numbers for seventh-chord inversions (Pianote's guide draws them without fingers); ours
    are the standard 1-2-3-5 / 5-3-2-1 with the second closed up.
  - **Not taken, with reasons:** a chord quiz (chord-trainer 01) and a levels ladder (ultimate-piano 09) belong to
    Quiz and Exercises, not this page.
- **v73 (canvas Version 73): each hand names the chord it plays; the left hand plays Chord or Root; Transpose.**
  Owner: "I like it better, but it Is still not very good. what bass only means and such things, improve it, research
  more. and I want to be able to transpose chords easier". Replaces v72's "Bass only".
  - **Under each drawn hand:** its name, then the chord it plays, as a lead sheet writes it: Left hand **G**, Right
    hand **B♭maj7**; off reads "Not playing". The learner reads what each hand does instead of decoding a setting.
  - **Left hand: Chord | Root** (when both hands play): Chord plays the whole chord in each hand; Root leaves the left
    hand the root alone and gives the right hand the rest, named: Gm9 = G + B♭maj7, Cmaj7 = C + Em, B♭7 = B♭ + D°;
    a triad stays whole in the right hand (C + C). "Root" is the pianist's word ("left hand plays the root"); Gorshkov's
    "бас в левой, септаккорд в правой" (02-ninth-chords/theory.pdf p. 4) and his two-triad building (pp. 2–3) are the
    source.
  - **Transpose:** the staff card's header row: **C major · Transpose** on the left, **+ Chord** on the right (moved
    out of the names row, where it covered the first name). Transpose opens a sheet: **− Half step · + Half step**,
    then **To the key of**, twelve keys (C D♭ D E♭ E F F♯ G A♭ A B♭ B; minor keys C♯ G♯ for D♭ A♭). Every chord on
    the staff moves at once, qualities and inversions kept, spelled as the new key spells (Cmaj7 G7 → Dmaj7 A7).
- **v72 (canvas Version 72): the hands drawn, each finger lit with its note; the dock centred as one group.** Owner:
  "why this is looking so not centered. and I dont like the hand settings. make proper creative controls, invent
  something new and improve it." Replaces v71's hands toolbar; v71's hand rules (whole chord per hand, Both in each
  hand, Split) stand.
  - **The hands, drawn** under the staff (beside it on a laptop, so the dock never covers them): a left and a right
    hand as they lie on the keys, palm and five fingers. A finger that plays is filled in its note's role colour
    (root, 3rd, 5th, 7th as on the keys and the staff), the note's name on the fingertip and the finger's number
    below; fingers that rest are pale. The fingering is seen on the hand, not read as a number list.
  - **Tap a hand** to add or drop it: on is solid, off is faded; the last hand on only plays.
  - **Bass only** under the left hand (chords whose upper notes make a named chord): the left hand keeps just the
    root on the 5th finger and the right hand plays the upper chord (Gm9: G | B♭maj7; Gorshkov, as v71). Replaces the
    toolbar's Split.
  - **The dock:** the chord and Play are centred together as one group; before, Play was centred and the chord hung
    off its left, so the pair looked off-centre.
- **v71 (canvas Version 71): a hands toolbar under the staff; Split; the chord list a checklist; Play covers every
  chord.** Owner: "I dont like it this at the top, make like a toolbar … under the staff and also I want to be able to
  add more chords also from the chords list like it would be a checklist … the play options dont fully support
  correctly the more chords on the staff … when I select the left hand I want all the notes in the chords like the c
  e g and if I select both then I would have c e g and c e g in both hands … up to the seventh chords or also ninth
  chords but to be able to have an option like to play the in the gm9 the g in the left hand and the BbMaj7 in the
  right hand. check the cources and piano data and gorshkovs courses and the fingering". Replaces v70's hand cards
  and v67/v69's hand rules.
  - **Hands toolbar** under the staff, inside its card: **Left hand · Right hand · Both hands · Split**, each a
    symbol over its name (the tab bar's shape, v24); Split's symbol is the two chords it makes, **G | B♭maj7**.
  - **Hands:** one hand plays the whole chord as voiced, with its fingering (RH 1-3-5, 1-2-3-5; LH 5-3-1, 5-3-2-1),
    five notes at most (the 5th, then the 11th, first out). Left is an octave below Right; **Both plays it in each
    hand**, an octave apart: C3 E3 G3 | C4 E4 G4. No more rootless or shell by hand: those stay voicings.
  - **Split** (chords of four notes or more whose upper notes make a named chord): the root alone in the left hand,
    the rest as one chord in the right: Gm9 = G | B♭maj7, Cmaj7 = C | Em, C9 = C | Eø7. Source: Gorshkov,
    02-ninth-chords/theory.pdf p. 4: "играть нонаккорды нужно с басом в левой и в правой — септаккорд, оставшиеся 4
    ноты" (ninths with the bass in the left hand and the seventh chord, the other four notes, in the right); p. 2–3,
    a ninth is two triads (Gm + Dm = Gm9); extra-jazz-voicings.pdf, Cm11 = Cm + B♭. Gorshkov's PDFs give no finger
    numbers; the fingering is the standard chord fingering.
  - **Chord list as a checklist:** each row has a check on the right: checked chords are on the staff; check to add
    (in the inversion that moves least), uncheck to remove ("C7 removed · Undo"). Tapping the row still changes the
    current chord.
  - **Play with several chords:** the main button reads **Play all** and plays every chord in order in the chosen
    mode (Block chord, Arpeggio, Arpeggio up and down); the chord sounding is lit on the staff. The menu's second part
    chooses **All 3 chords, in order** or **Only Cmaj7**. Replaces v67's single "All chords, in order" item.
- **v70 (canvas Version 70): two hand cards say what each hand plays, with which fingers.** Owner: "it is ok, but be
  more creative and clear and think outside of the box to make it more clear and understandable. research the correct
  guidelines and ux ui best principles". Replaces v69's R.H./L.H. chips and the 123 toggle.
  - **Over the staff, Left hand | Right hand,** left on the left, as the hands sit at the keys (Norman's natural
    mapping, _The Design of Everyday Things_). Each card: the hand's icon and name, then the notes it plays low to high,
    each underlined in its role's colour with its finger under it (C 5 · E 3 · G 1). Off: outlined, "Not playing".
    Tap a card to add or drop that hand; the last hand on only plays.
  - **Why:** an abbreviation and an icon alone made the learner remember what they meant; the card shows it
    (recognition rather than recall, Nielsen's heuristic 6; icons need a text label, NN/g). The state is visible
    where the effect is, the notes and fingers (visibility of system status, heuristic 1).
  - **Fingering is no setting:** the finger numbers are part of the answer, so they always show in the cards and
    beside the current chord on the staff (fewer settings; one home, now none to find).
- **v69 (canvas Version 69): the hands sit beside their staves; one home for fingering; + suggests the next chord.**
  Owner: "when I choose c major chords and make the settings left hand, then I want to play the c major chord in left
  hand with its fingerings and not c g c like now. improve the hands settings and make more clear and intuitive …
  something wrong is with the staff and practice section now, like they overlap … adding a new one but you could
  improve it. be creative … I dont quite like that we can set the fingerings in two places like in chord settings and
  also in the piano settings."
  - **Left hand alone plays the chord itself,** an octave down, with left-hand fingering: C = C3 E3 G3, 5-3-1; four
    notes at most (the 5th, then the 11th, first out). Replaces v67's 1-5-8 shell for Left.
  - **Both hands:** the root in octaves under a triad (C2 C3 | C4 E4 G4); the 1-7 shell under a seventh and bigger,
    as v67; an inversion's bass alone in the left hand.
  - **The hands are on the staff, as a score names them:** **R.H.** beside the treble, **L.H.** beside the bass, each
    a toggle; on is honey, off is outlined; the last hand on only plays. The Hand row leaves the Chord sheet (it was
    v61's home; this replaces it).
  - **Fingering has one home:** the italic **123** above the hands, the same type as the digits it shows. Gone: the
    Fingering row in the Chord sheet and the keys' **Fingers** label (no finger numbers on keys; Labels is Names ·
    None).
  - **+ opens Next chord:** "In C major", the key's six other chords as tiles, symbol over roman numeral (F IV, G V,
    Am vi, Dm ii, Em iii, B° vii°), the likeliest after the current chord first and in honey; sevenths when the first
    chord is a seventh (Dm7 ii7, G7 V7, Fø7 iiø7 in minor). Each is added in the inversion that moves least from the
    chord before, so C, F, G read as C-E-G, C-F-A, B-D-G. **Any chord ›** adds one from the full list.
  - **Fixed:** the staff's card left two wrappers open, so the Practise section drew inside it.
- **v68 (canvas Version 68): more voicings, each checked against the transcripts; Arpeggio up and down; Scales in
  all 15 keys; no altered chord.** Owner: "1. dont understand the question. 2. yes I want more voicings and also
  check that our current are correct are match the researches you did from the transcriptions 3. yes up and down.
  yes for the scales. and leave out the alt"
  - **Q1 answered, nothing changes:** C11 is already voiced 1-5-♭7-9-11 with no 3rd, as pianists play it, since
    "avoid the 11th over a major 3rd" (watch-later/008 @05:24); m11 keeps its minor 3rd, which is fine.
  - **The voicings we had, checked:** Close, Drop 2 (exercises/017), Drop 3 and Shell (exercises/148 @02:07,
    exercises/116 @29:11) match. **Fixed:** Rootless A and B on a dominant now use the 13th in place of the 5th
    (C9 A = E A B♭ D): "the 5th becomes the 13th on a dominant" (exercises/116 @31:17; jps-podcast/292 @02:10,
    G7 = 7-9-3-13).
  - **Four voicings added**, each for both hands (choosing one sets Hand to Both, root position):
    - **Spread:** root and 7th low, 3rd, 5th (13th on a dominant) and 9th above (jps-podcast/245 @12:32; piano/369
      @43:49).
    - **So What:** three 4ths and a major 3rd on top; minor sevenths only. Dm7 = D3 G3 C4 | F4 A4
      (watch-later/008 @07:00).
    - **Kenny Barron:** 1-5-9 under ♭3-♭7-11; minor sevenths only (watch-later/008 @07:00).
    - **Upper structure:** the major triad a tone up over 3rd and 7th; dominant sevenths only. C7 = E3 B♭3 | D4 F♯4
      A4 (exercises/069, two stacked triads). Greyed in the list where the chord does not take it.
  - **Play menu:** Block chord · Arpeggio · **Arpeggio up and down**; All chords, in order with two or more.
  - **Altered chord (C7alt): left out**, at the owner's word.
  - **Scales:** the tonic is a letter plus a tap-again accidental, offering only the 15 keys each scale has a key
    signature for (G♭ major, F♯ minor; no D♯ major); the staff draws the key signature, accidentals only where the
    key does not give them; note names spelled for the key (C♭ in G♭ major, E♯ in F♯ harmonic minor); the Chords
    tab's triads built from the scale with roman numerals (i ii° III in minor; ♭III ♭VII in modes). One root picker,
    shared by Chords and Scales.
- **v67 (canvas Version 67): several chords on the staff; the hands voice a chord as pianists do.** Owner: "I want to
  be able to select more than one chord to be shown on the staff and read and research more about the voicing in
  the chords and what relevance have the hands settings in some chords like nineth chords and bigger like playing
  only with left or right hand and such things. research the transcriptions that I gave you."
  - **The staff holds a row of chords.** Over the staff, each chord's name; the current one in a honey pill with ×,
    its column lightly shaded; **+** at the end adds a chord (a copy of the current one, which opens the Chord sheet
    to be changed; up to 8). Tapping a name makes it the page's chord (heading, keys, row of notes follow) and plays
    it. × removes at once with **"Fmaj7 removed · Undo"** (R38: undo, not a question). The Play menu gains **All
    chords, in order** when there are two or more. Finger numbers show for the current chord only; past four chords
    the staff scrolls sideways in its card.
  - **Hands, from the transcripts** (piano-data/transcriptions/youtube):
    - **Right** alone, ninth chords and bigger: rootless, the root left to the bass or left hand and the 5th the
      first note left out: C9 = E G B♭ D. "rootless… when you have a bass player" (piano/080 @19:10); "my left hand
      is pretending it's the bass player" (piano/400 @01:36); "the note that's the least needed in the chord is the
      fifth" (piano/369 @21:13); jps-podcast/292 @02:10 (3-5-7-9). Triads and sevenths stay whole.
    - **Left** alone: a shell, low, never close thirds in the muddy register. Sevenths and bigger: root and 7th
      (C9 = C3 B♭3), adding the 3rd from F up (1-3-7); no 7th: root, 5th, octave. "Bud Powell" shells, root-7 can go
      "really low" (exercises/148 @02:07); the muddy section from about the F below middle C (piano/312 @12:04); "the
      lower you go… the less notes you need" (piano/115 @09:35); "1-3-7… more balance for the lower register"
      (piano/312 @10:28). An inversion in the left hand plays its bass note and octave.
    - **Both**: the left hand's shell low, the rest of the chord above, notes not doubled: C9 = LH C3 B♭3, RH E4 G4
      D5; C13 RH 3-13-9. "root and seventh… with the right hand… the colour tones" (piano/369 @43:49); spreads,
      exercises/116 @29:11, jps-podcast/245 @12:32. An inversion puts its bass note alone in the left hand (C9/E: LH
      E, RH G B♭ D).
    - The row of notes follows the hands: in Left and Both it lists the whole chord (root first); in Right, for a
      ninth or bigger, the rootless notes.
  - Read but not applied yet (open question): the 11th over a major 3rd is avoided (watch-later/008 @05:24), so the
    11 chord would become 7sus or maj7♯11; Kenny Barron, So What and upper-structure voicings (008 @07:00,
    exercises/069). Unusable transcripts noted: exercises/018 and 128 and most of 098 are Arabic captions.
- **v65 (canvas Version 65): the chord button back, beside a centred Play.** Owner: "but I liked the chord button, but I
  dont know where to put it know".
  - The bar keeps Play exactly centred (188 wide, honey) and the chord button sits in the space to its left, close
    against it: **Cmaj7** · **▶ Play chord | ⌄**. The right side stays empty so the centre holds. The chord button
    drops its ⌃ to fit a phone (a glass capsule with the chord on it reads as a button; it opens the Chord sheet, as
    the name does). The arpeggio label is **Arpeggiate**, the musician's verb, so it fits as "Play chord" does.
  - The chord is chosen in both places again, as v28 ruled: the name where the eye is, the bar where the thumb is.
  - v66, owner: "but now the names get cut off". No name is cut: the chord button's type steps down with the
    name's length (15, 13.5, 12 px; the longest, C♯m(maj7), is 65 px at 12 against a 93 px space), Play is 176 wide
    with its ⌄ 40, so "Play chord" and "Arpeggiate" both fit whole. Measured in the runtime.
- **v63 (canvas Version 63; the chord button returned in v65): one quiet Play, centred; the chord is chosen from its name.** Owner: "the play button is
  too appealing and I would like it to be centered , but dotn know what to make with the chords button".
  - The bar is one capsule centred at the bottom, **▶ Play chord | ⌄**, 216 wide, in its honey tint (v64: owner "no
    revert the play button color"; v63's plain glass is undone); its ⌄ menu (Block chord · Arpeggio) opens centred above it.
  - The chords button leaves the bar (recommended, owner unsure): the big name already opens the Chord sheet (v51),
    where the eye is, so the bar's copy only pushed Play off centre. On the laptop the Chord popover opens under the
    name. This undoes v28's doubling ("the chords choosing in both places"); if the bar should keep a way to the
    chord, the alternative is a small round Chord button left of Play with a Keyboard-sized twin on the right.
- **v62 (canvas Version 62): no staffs or label over the notes; Hand and Fingering in the Chord sheet; the keyboard
  button in the header, no gear.** Owner: "I dont like the bass note header and the staffs above the notes. remove
  them . and also put the hand settings and fingering settings in the chords pill after the voicing and the keyboard
  button move in the right header and the gear icon button removed".
  - The heading: name (the slash in the bass note's colour, v61), the line, then v60's still row of the chord's
    notes, the bass filled, each with its role. No "Bass note" label, no small staffs.
  - The Chord sheet (the bar's **Cmaj7 ⌃**): Root, then Chord ›, Voicing ›, **Hand** (Right · Left · Both),
    **Fingering** (on/off: the finger numbers by the staff).
  - The header: Back · Chords · the keyboard button on the right (opens Keyboard: Off · 2D, Keys, Labels, Connect a
    piano ›, All piano settings ›; on the laptop a popover under it). The gear and its Settings sheet are gone; it
    held only Hand and Finger numbers, which now live in the Chord sheet.
  - (Replaced by v63.) The bar: **Cmaj7 ⌃** · **[▶ Play chord | ⌄]**; the round keyboard button left it.
- **v61 (canvas Version 61; the staffs and label removed in v62): each bass note shows the chord it makes, drawn as a textbook draws inversions.** Owner
  on v60: "better but still could be more creative and research more and improve it".
  - v60's still row stays (Bass note: C E G B in chord order, the bass filled, nothing moves). Above each note, a
    small treble staff draws the chord that note in the bass gives, its heads in the keys' colours: four little
    chords side by side, root position, 1st, 2nd, 3rd inversion, as theory books and worksheets set inversions out
    on the staff. The learner sees each choice's shape before tapping, and the chosen one's role is bold.
  - The slash in the name takes the bass note's colour (Cmaj7/**E** in the 3rd's blue, /**G** in the 5th's green),
    so the name, the chosen note, the keys and the staff all say the same thing.
  - Research: musictheorylessons.net (inversions named by position, notes set out as a table; its worksheets mix
    "root position with 1st and 2nd inversions, and 3rd inversion for 7th chords"); Chord Trainer's chord builder
    (piano-data/reference-apps/chord-trainer 04–09: Root position · 1st inversion · 2nd inversion chips with the
    inversion's pitches under them, G4 C5 F5, and the chord on a staff); the slash-chords lesson in
    piano-data/transcriptions (005: "a slash chord … simply means there's a different note in the bass than the
    root"). pianochord.org and scales-chords.com refused automated reading, so they were not used.
- **v60 (built on by v61) (canvas Version 60): choose the bass note; nothing moves.** Owner on v59's stack: "I dont like this. it
  still moves too much and is not good. make something new that is more stable and more understandable".
  - Under the name, one still row: **Bass** then the chord's notes as round buttons in chord order, always in the
    same place (C E G B), each outlined in its key's colour with its role under it (root, 3rd, 5th, 7th). The bass
    note is filled. Tapping another fills it instead, plays the chord with that note lowest, and the name and line
    follow (Cmaj7/E, "1st inversion"). Nothing slides, turns or reorders; the keys and the staff show the new shape.
    It asks the musician's own question, which note is in the bass, the one the slash chord answers.
  - Gone: v59's stack and its arc. Never redrawn for the inversion: tabs or a segmented track (v26, v57), a
    pull-down (v56), ‹ › (v22), a stepper pill (v52), a ring (v58), a moving stack (v59).
- **v59 (replaced by v60) (canvas Version 59): the inversion is the notes stacked as they sound; the bass goes up an octave.** Owner
  on v58's ring: "interesting but it is not understandable how it moves. can we think outside of the box and make
  something new and understandable".
  - The chord's notes stand in a column under the name, lowest at the bottom, as on the staff and the keys: each a
    capsule in its key's colour, the note in bold and its role (root, 3rd, 5th, 7th). The bottom one is filled and
    marked **Bass**. Beside the column, an arc runs from the bottom note to the top, labelled **Bass up an octave**:
    tapping it lifts the bottom note to the top while the others step down (460 ms, straight up and down), which is
    what an inversion is, how theory books teach it ("move the lowest note up an octave"). Tapping any note puts it
    in the bass directly. The name and line follow: Cmaj7/E, "1st inversion".
  - Gone: v58's ring (its motion was not readable). Never redrawn for the inversion: tabs or a segmented track
    (v26, v57), a pull-down (v56), ‹ › (v22), a stepper pill (v52), a ring (v58).
- **v58 (replaced by v59) (canvas Version 58): the inversion is a ring you turn.** Owner on v57: "I dont like this", then "I dont like
  this tab switch, be more creative and think outside of the box and try to invent something new".
  - An inversion is a rotation of the chord's notes, so the notes sit on a small ring under the name, in chord order
    (C, E, G, B around it), each a disc in its key's colour. The slot at the bottom is the bass: its disc is filled
    and larger, and the centre names the position (**Root** position, **1st** inversion). Tapping any note turns the
    ring until that note sits at the bottom (420 ms, the labels stay upright), and the chord plays: tap E and the
    name becomes Cmaj7/E, "E in the bass". Notes that cannot be a bass here (the 9th of a ninth chord) are dimmed.
  - Gone: v57's track of positions (a tab switch, rejected), v57's note columns (the ring is the notes). Never
    redrawn: a segmented or tab control, a pull-down, ‹ ›, a stepper pill for the inversion.
- **v57 (replaced by v58) (canvas Version 57): every inversion one tap away; the notes as a theory table sets them.** Owner, with a
  screenshot of v56's notes line: "make the inventions easier to switch and I dont like how this looks from the
  image. and did you research more and looked at the examples and websites. not only ours piano data but also from
  the internet. https://musictheorylessons.net https://worksheets.musictheorylessons.net/worksheets".
  - The inversion: v56's pull-down took two taps and hid the choices. Now all of them sit under the name, side by
    side on one track, each its position over its slash chord: **Root** Cmaj7 · **1st** Cmaj7/E · **2nd** Cmaj7/G ·
    **3rd** Cmaj7/B (triads three). One tap plays and shows it; the current one raised. This amends v26's rejected
    Root · 1st · 2nd · 3rd control: those were bare ordinals; here each choice names the chord it gives, so it reads
    as this chord's shapes, never as the next chord (the slash chord is the musician's own name, v22).
  - The notes: no dots, no inline role words. A row of columns, each note in bold over a short bar of its key colour
    over its role (root, 3rd, 5th, 7th), in the order they sound from the bottom up, so an inversion visibly moves
    the root: Cmaj7/E reads E G B C over 3rd 5th 7th root.
  - Sources: musictheorylessons.net, Triads (a table of Triad, Formula "1 · 3 · 5", Notes "C–E–G") and Seventh
    chords (Name, Symbol on C, Notes "C–E–G–B"; "the root, 3rd, 5th and 7th"); its worksheets FAQ names the
    inversions as positions, "root position with 1st and 2nd inversions, and 3rd inversion for 7th chords". Apple
    HIG, Segmented controls: equal widths, a few closely related choices, one tap.
- **v56 (canvas Version 56): the heading reads as a lead sheet: name, what it is, its inversion, its notes.** Owner,
  with a screenshot of D♭maj7: "I dont like inversions and the chips how they look. I dont like how this section
  looks. improve and make it better. research and use all nedded guidelines and skills".
  - The name: the accidental drawn as music (Noto Music, raised, 0.78 of the letter), as a lead sheet sets D♭maj7;
    before, the serif had no ♭ and a fallback glyph stood apart from the D.
  - (Replaced by v57: inversions one tap each.) The inversion: a pull-down (Apple's pop-up button: one choice among a few, its current value as the label),
    **Root position ⌄**, a quiet outlined capsule. Its menu lists each inversion with its notes, Root position
    D♭ F A♭ C · 1st inversion F A♭ C D♭ …, ✓ on the current; a pick plays it. No ‹ › anywhere (read as the next
    chord), no Root · 1st · 2nd · 3rd control (v26, rejected), no pill.
  - (Replaced by v57: note columns.) The notes: no filled chips. One line of text, each note in bold with its role beside it in grey and a small dot
    of its key colour: **● D♭** root **● F** 3rd **● A♭** 5th **● C** 7th. The role words teach what the colours
    mean (the keys use the same colours).
  - Skills applied: impeccable's craft floor (one type scale, no decoration without information), Apple's
    pop-up button and menus, Laws of UX (Proximity: the inversion sits with the name it changes; Jakob: the lead
    sheet's symbol).
- **v54: the bar becomes Apple's glass groups; Play the one tinted action, standing alone.** Owner: "I dont like how
  this yellow button looks inside this toolbar. research the apple guidelines and improve".
  - Research (Apple, iOS 26 Liquid Glass; WWDC25 "Get to know the new design system" and "Build a UIKit app with the
    new design"; HIG Toolbars): items sit on glass in groups, a spacer starts a new group; only one primary action is
    prominent, tinted glass, in its own group on the trailing side; "when every element is tinted, nothing stands
    out". A filled button inside another capsule is the thing the guidelines avoid.
  - Now three shapes, no capsule around them, 56 tall, 8 apart: **keyboard** (round glass) · **Cmaj7 ⌃** (glass) ·
    **[▶ Play chord | ⌄]** (honey-tinted glass, a light top edge, the rest of the width). The ⌄ menu (Block chord ·
    Arpeggio) and Keyboard's panel open over their own buttons.
- **v53: the keyboard button stands apart from the bar.** Owner: "but now the keyboard settings should be like
  separate from this play chord".
  - The bar holds only the sound: **Cmaj7 ⌃ · [▶ Play chord | ⌄]**. Beside it, 10 apart, a round glass button
    of the bar's height (68) with the keys icon opens **Keyboard** (Off · 2D, Keys, Labels, Connect a piano ›, All
    piano settings ›). Two shapes, two subjects (Common Region): what you hear, and what the page shows.
  - Laptop: the bar 440 wide and the round button, centred together; Keyboard's popover ends over its button.
- **v52: the inversion is its own stepper; one Play, its ⌄ choosing Block chord or Arpeggio.** Owner: "the inversions
  can be interpreted as go to next chord like from c to c sharp, it is good but we should refactor them and make
  more clear. and also the toolbar it not that clear. I'd put the play together with the arpeggiate like merge them
  and we will have only the play button with this arrow to chose to play it in block or to arpeggiate it".
  - Top to bottom: the big chord alone (**Cmaj7/E**, tap to change it); "C major seventh · Close voicing"; a pill
    **‹ 1st inversion · E in the bass ›**, the arrows either side of the words they step, so they read as the
    inversion's, not the next chord's (Proximity); the notes. Not v26's Root · 1st · 2nd · 3rd segmented control
    (rejected), and the slash in the name stays (v22).
  - The bar: **Cmaj7 ⌃** · **[▶ Play chord | ⌄]** · keyboard. One honey split button: the main part plays; ⌄ opens a
    menu, **Block chord** ✓ · **Arpeggio**; picking one plays it and the button becomes **Play arpeggio**. Stop (■)
    while it sounds. The separate Arpeggio button is gone. A split button is the convention for one action with
    a choice of how (Apple's pull-down button; Material's split button).
- **v51: no arrow beside the big chord.** Owner: "and also remove the arrow on the big chord. it just works but
  without this arrow down".
  - The ⌄ disc after the chord symbol is gone; tapping the big chord still opens the Chord sheet, ‹ › still step
    the inversions.
- **v50: the pointer is a one-time tip, gone once the gesture is used.** Owner: "but is this a permanent or just a
  tooltip".
  - It shows under the chosen letter until the learner taps a chosen letter again once; then it never shows again
    (in the app, remembered as a seen tip, as the Player's tips are). Picking another letter before that keeps it.
- **v49: a pointer under the chosen letter says "Tap again for C♯".** Owner on v48's "or C♯": "now it can be
  interpreted as the c can be called c sharp".
  - The chip inside the button is gone (the letter alone again, 48 tall). Under the row, a dark pointer whose tip
    sits under the chosen letter reads the action: **Tap again for C♯**, **Tap again for G♭**, **Tap again for B**.
    It follows the letter, kept inside the sheet at the row's ends.
  - An exception to "no explanation line": it names the action of the control it points at, changes with it, and
    is the only way a learner learns the gesture. The words, not a glyph, because a glyph and "or" were both
    misread.
- **v48: "or C♯", no arrow.** Owner: "this icon look like reset and is misleading".
  - The turn arrow is gone; the chip under the chosen letter reads **or C♯** (C♯ reads **or C**; G♯ reads **or G♭**).
    "Or" names the other spelling as a choice and invites the tap, without an icon that means reset or reload.
- **v47: tap again, and the chosen letter says what the next tap gives.** Owner on v46's opened capsule: "no I don't
  like this".
  - Back to v43's one row and tap-again (C → C♯ → C; G → G♯ → G♭ → G). Under the chosen letter a small chip with a
    turn arrow names the next spelling: **C ↻ C♯**, then **C♯ ↻ C**; **G♯ ↻ G♭**. No chip on a letter with one
    spelling. The spoken name says it: "C. Tap again for C sharp".
  - Replaces v44's ♮ ♯ ♭ marks and v46's capsule.
- **v46 (rejected: "no I don't like this"; replaced by v47): the chosen letter opens into its spellings.** Owner: "the chord root switch looks interesting but you could
  improve it and make more clear".
  - Still one row, C to B. The chosen letter widens into a raised capsule holding its spellings, flat to sharp, each
    a button: **D♭ D D♯**, **G♭ G G♯**, **C C♯**, **E♭ E**, **F F♯**, **A♭ A A♯**, **B♭ B**; the one in use on honey.
    Another letter is one tap (natural); its spellings open with it. Nothing hidden: no tap-again, no marks to decode.
  - Widths: the capsule takes 1.1 a letter per spelling, so the other letters keep 37px on a 393 phone (48 tall).
  - Replaces v43's tap-again and v44's ♮ ♯ ♭ marks.
- **v45: every root starts in the octave from middle C.** Owner: "why some chords like the f sharp are shown one
  octave lower".
  - Before, roots F♯ to B started an octave down (F♯3 to B3) to keep the chord near the middle; the jump between F
    and F♯ read as a mistake. Now C4 to B4 holds every root, as chord charts draw root position; the chord climbs
    with the root, and Both hands still adds the left hand an octave below.
- **v44: the chosen letter shows its spellings, so tapping again is seen.** Owner: "but make it more clear for the
  user that such thing exist".
  - Under the chosen letter, small marks ♮ ♯ ♭ (only the ones that letter has: C shows ♮ ♯, E shows ♮ ♭), the one in
    use on a honey dot. Like a page indicator, they say there is more behind the button and where the next tap goes.
  - The button's spoken name says it too: "D flat. Tap again for D". No explanation line (the rule holds).
- **v43: the root is one row of letters; tapping the chosen one again changes its spelling.** Owner: "no. make
  just one row and when clicking multiple time on one note it will change. like c and then C sharp for example."
  - Root: **C D E F G A B** on one track. A tap on another letter picks it natural; a tap on the chosen letter steps
    natural → sharp → flat → natural, skipping what no chart writes: C → C♯ → C; D → D♯ → D♭; E → E♭; F → F♯;
    G → G♯ → G♭; A → A♯ → A♭; B → B♭. The button reads the spelling (C♯), the chord is spelled from it and sounds.
  - Replaces v41's accidental row and v42's three tracks.
- **v42 (replaced by v43's one row): the root is one of 17 written notes: naturals, sharps, flats.** Owner: "but some options are weird like c
  flat or e sharp etc."
  - Three tracks in the Chord sheet's Root: **C D E F G A B**, then **C♯ D♯ F♯ G♯ A♯**, then **D♭ E♭ G♭ A♭ B♭**. One
    tap a root, one choice across the three. C♭, F♭, E♯ and B♯ are gone: no chord chart writes them as a root.
  - Each black key keeps both its names (C♯ and D♭ …), the chord spelled from the one picked.
- **v41 (replaced by v42's three tracks): a chord's root is a letter and an accidental, so D♭ and C♯ are both there.** Owner: "how can we though
  get chords like d flat or sharp or g flat or a sharp etc".
  - The Chord sheet's Root is two tracks: the letters **C D E F G A B**, then **♭ Flat · ♮ Natural · ♯ Sharp**.
    Every written root is reachable (D♭, C♯, G♭, F♯, A♯, also E♯, C♭), and the chord is spelled from it:
    A♯maj7 is A♯ C𝄪 E♯ G𝄪; G♭maj7 is G♭ B♭ D♭ F; D♭m7 is D♭ F♭ A♭ C♭. Letter and accidental keep each other.
  - Why: two names for one black key are two different chords on paper, and a learner reading a song in F♯ meets
    A♯m, in G♭ meets E♭m. The way a chord chart app takes a root is the letter, then ♭ or ♯ (iReal Pro's chord
    keyboard).
  - A key is not a root: Scales' Tonic, a progression's and an exercise's Key, Intervals' From keep v40's two rows
    of six, the twelve keys.
- **v40: the root picker is two rows of six, as GarageBand's Key Signature.** Owner (with a GarageBand screenshot):
  "look at these notes grid , but i dont think we need the major minor switch here and the follow songs key".
  - The 4 × 3 grid of boxed buttons becomes two segmented tracks, C to F and F♯ to B, the chosen note a raised
    thumb on the track. One implementation (`ROOTGRID` in `r41_kit.py`): Scales' Tonic, Intervals' From, a
    progression's and an exercise's Key. _(Chords' Root: letter and accidental since v41.)_
  - Not taken from GarageBand: the major | minor switch (the chord or scale list already says which) and Follow Song
    Key (a recording setting; no recordings here), nor the explanation lines under them.
  - The spelling stays C♯, E♭, F♯, A♭, B♭ (GarageBand writes D♭): C♯ minor is a key, D♭ minor is not.
- **v39: no "Add a note"; every extra note is a named chord in the Chord list.** Owner: "I dont like this add a note
  how this looks, and is not understandable and I would like you to refactor them. search more and refactor them
  properly and make more clear".
  - The chips (add 9 D, add ♯11 F♯, add 13 A, a struck-through 11 F) are gone, and so are the avoid notes. Two
    reasons: a chip read "add 9 D" names neither a chord nor an action a musician says, and most of them made a
    chord the list already had (Cmaj7 add 9 = Cmaj9), so they were a second way to the same thing.
  - The Chord list gains what only the chips reached: **Extended** gains Cmaj7♯11; a new group, **Altered**, holds
    C7♭9, C7♯9, C7♯11, C7♭13, each with its full name (C dominant seventh, flat ninth). The Chord sheet is Root,
    Chord ›, Voicing ›, nothing else.
  - Research: iReal Pro picks a chord as root plus one quality from a list in which 7♭9, 7♯9, 7♯11 and 7♭13 are
    qualities of their own (irealpro.com/learn/chord-symbols). Piano Companion's chord dictionary is root, then a
    chord type, which then shows its notes and fingering; an extra type is added to the list, never built from
    add-ons (blog.songtive.com/?p=1272, ?p=858).
  - Which note clashes (the avoid note) is theory for a lesson, not a control.
  - Fixed on the way: the staff's finger digits 2 to 5 were centred, 1 was not; all now start beside the note.
- **v38: fingering where each picture is set; the hand on its own.** Owner: "I dont like these fingering settings.
  refactor them. where can we put them?. research more and how this should be done and where to put them."
  - Research. Synthesia: "To open the label controls menu, click the La icon on the toolbar"; its Key Labels list
    (Octaves, Finger Hint Numbers, English Note Names, Scale Number, Fixed-Do, Movable-Do …) is what a key reads
    (synthesia.app/support/guide/labels). Playground Sessions: finger numbers are switched on "on the toolbar above
    the interactive sheet music". Roland HPi pianos: **Finger Numbers** sits in the notation view's settings. So the
    keys' fingering belongs with the keys' labels, the staff's with the staff, and the hand is not a fingering setting:
    it changes what is played.
  - Keyboard panel: **Labels** Names · Fingers · None, one label on a key at a time (replaces Note names and Finger
    numbers, two switches over one spot).
  - Gear: **Hand** Right · Left · Both, then **Staff › Finger numbers** (on).
  - (v36's Fingering group and the Keyboard panel's two switches are replaced by this.)

- **v36: the piano's settings as the Player's; the gear keeps the rest; finger numbers on the keys as Vita Piano's.**
  Owner: "but on the keys look how other do this. and also I dont like the keboard settings, this looks not good
  structured and mixed things. and I want like a piano settings like the player does. and in the header remain all
  other settings."
  - **Keyboard** is the bar's last button, as the Player's transport (R37: "the transport's last button, Keyboard").
    Its panel copies the Player's: the keyboard as picture tiles **Off · 2D** (the Player's Off · 3D · 2D; this page
    has no 3D hands), then only what the keys use: **Keys** Chord · 61 · 76 · 88, **Note names**, **Finger numbers**;
    then **Connect a piano ›**, **All piano settings ›**.
  - The header's **gear** keeps the page's other settings: **Fingering**, Hand Right · Left · Both and On the staff.
  - On the keys (Vita Piano's charts): the finger number on the coloured key, the note name under it. v37, owner:
    "why the fingers numbers look so big": one step above the name, 14px bold on a white key (12px on a black), the
    name 12px (10px).
  - (v35's Keyboard sheet mixing the keys and the fingering is replaced by this.)

- **v35: fingering settings; the numbers beside the notes, per inversion.** Owner: "i want fingering settings, and
  research more and look at the examples where the fingering should be".
  - Reference: Vita Piano's chord pages (`piano-data/web-references/new_apps/The D Major Chord …webarchive`;
    drawing `ref-vita-piano-d-major.png`). Each inversion has its own chart: the grand staff with the right hand's
    chord on the treble and the same chord an octave lower in the left hand on the bass, a finger number beside each
    note to the right of the chord; the keys carry the numbers too. Its table: root RH 1 3 5 / LH 5 3 1; 1st inversion
    RH 1 2 5 / LH 5 3 1; 2nd inversion RH 1 3 5 / LH 5 2 1. Chordify, Journey's chord builder and Ultimate Piano show no
    chord fingering (Ultimate Piano's numbers under the keys are scale degrees).
  - **Fingering** is a group in the Keyboard sheet: **Show fingering** (on), **Hand** Right · Left · Both (Right),
    **On the keys** (off). Both plays the chord in both hands, an octave apart, each hand on its own staff.
  - On the staff each number stands beside its note, right of the chord. Triads take Vita Piano's table; four-note
    chords put adjacent fingers on the 2nd (Cmaj7/E right hand 1 2 4 5); five notes 1 2 3 4 5.
  - **On the keys** puts the number on the key in place of its name. The owner's earlier rule "No finger numbers on or
    under keys" stands as the default (off); this switch is the owner's to keep or remove.
  - (v33-v34's "stacked above the chord" and "no settings" are replaced by this.)

- **v34: checked in the canvas's own runtime.** Owner: "the settings arent working and the fingering still doesn't
  work and where are its settings". Two faults the local renderer hid:
  - A value inside SVG `<text>` is drawn by the canvas as an HTML span, which SVG does not show: the finger numbers,
    the staff's sharps and flats, and the Circle of fifths' key names were missing. Each is now literal text (one
    `sc-if` per value), or HTML over the drawing.
  - Show the keyboard's condition was written with single braces, so it was always true. Fixed.
  - Every board is now checked with `.scratch/r39/canvas/realrt.mjs`, the canvas's own runtime (read from the
    artifact, `RT=` its path), before a publish.
  - The fingering has no settings: it is shown, as in printed music.

- **v33: one grand staff, one hand, the fingering engraved.** Owner: "the fingering doesn't work, and the both clefs
  and treble clef setting are weird, why do we need them. and the bass in the left hand, how does this work, this
  setting is also weird".
  - The clef choice goes: piano is the grand staff, always.
  - Bass in the left hand goes: it put the root under every chord, so Cmaj7/E had C in the bass, against the slash.
    The chord is one hand's shape; the inversion is that shape. Voicing is the list alone.
  - The fingering is stacked as engraved, the top number for the top note: above the treble staff when the chord
    reaches it, under the bass staff when it sits low. The staff's height fits it.
  - (v32's "Bass in the left hand" and v31's "Both clefs | Treble" are replaced by this.)

- **v32: no gear; the keyboard's own button; Hands inside Voicing; the fingering on the staff.** Owner: "but you
  didn't remove the old settings. and do we need share, and the keyboard settings in the header to hide and show the
  and all its settings including connect a piano. and also the hands settings are weird. and do we need the fingering
  or can be directly show this on the staff."
  - The gear and its Settings sheet go, with Share and ··· (More). The header holds Back and a **Keyboard** button:
    Show the keyboard, Keys (Chord · 61 · 88), Note names, Connect a piano ›, All piano settings ›.
  - **Hands** goes. Voicing starts with one toggle, **Bass in the left hand** (on by default), then the right hand's
    voicings. The Chord sheet's Voicing row reads "Close + bass".
  - **Fingering** as a view goes: the finger numbers stand beside the notes on the staff, as printed music does. The
    view switch goes with it; the page has one staff.
  - (v31's line on Staff · Fingering views, and the gear's Practise and Staff, are replaced by this.)

- **v31: Tensions go into the Chord sheet; the staff's choice sits on the staff; Practise is on the page; the bar
  per Apple.** Owner: "Shall I? yes and i don't like how the bottom bar looks. research more the apple guidelines. and
  also the staff settings are not very good. and the practice in the player are too hidden".
  - Views: Staff · Fingering. The Chord sheet ends with **Add a note**: add 9 D, add ♯11 F♯, add 13 A; avoid notes
    struck through. _(Replaced by v39: the Altered group of the Chord list.)_
  - The staff card holds its own small segmented control, **Both clefs | Treble**, top right. The gear no longer has
    Staff.
  - **Practise Cmaj7 in the Player**, a card of three rows under the view: Arpeggio, up and down · Inversions, one
    after another · Chromatic walk. The gear no longer has Practise.
  - The bar: the chord (borderless, ⌃), Arpeggio (borderless), **▶ Play** prominent on the trailing side and filling
    the rest. Apple HIG, Toolbars: "Prefer system-provided symbols without borders"; "use the .prominent style for key
    actions … Only specify one primary action, and put it on the trailing side". Buttons: "Keep the number of prominent
    buttons to one or two per view"; "Prefer buttons that span the width of the screen for primary actions".

- "now refactor the chords page from practice in the style of the songs player" (2026-11-08): the Chords page takes
  the Player's shape, as drawn in R37 and merged in v15:
  - **At the top**, three glass controls: Back (to Practice) · the views · the gear (Chord settings). The views are
    **Staff · Inversions · Fingering · Tones**, words on both sizes (v18). Staff's one setting is in the gear (v17).
  - **The keys run edge to edge** under them, where the Player's keys are, the chord coloured by its role (root,
    3rd, 5th, 7th, tensions) and named on its keys; no finger numbers on the keys.
  - **The chord is the title**, as the song is: the symbol in serif, its full name, its inversion and voicing, its
    notes as coloured chips. The chosen view's content sits under it.
  - **One floating bar at the foot**, the Player's transport: **Chord ▴** (where the Player has Wait) opens the Chord
    sheet; **Play the chord** (where Loop is): Block chord, Arpeggio up or Arpeggio up and down (v17); **‹ Play ›** walk the inversions; **Hands**
    (each hand's switch, as the Player's Hands menu); **Keyboard** (Keys Chord · 61 · 88, Note names, Connect a
    piano ›, All piano settings ›).
  - **The Chord sheet**, like the Player's Practice sheet: Root (the root grid), Chord › and Voicing › (each opens its
    list with Back, as Flat's choices do; a voicing the chord can't take stays, faded, with why), no Inversion (v17).
  - **The gear** is the Player's drawer: its head holds the chord with Share link and ··· (Add to a progression, Open
    in the Chord player, Open in the Chord finder), then **Practise in the Player** across the row (Arpeggio,
    Inversions, Chromatic walk), then Staff (v17).
  - Every chord sounds when it changes and on Play; Arpeggio plays it broken.
  - On a laptop the whole screen is the page, as the Player's, with no sidebar; the sheets are popovers above the bar
    or under the gear.
- Kept from R39-5: every chord type by group (Triads, Added notes with add2 and add9, Sevenths, Extended), voicings
  with their formulas, Fingering by hand, tensions added by a tap, avoid notes struck through, the root grid.

- **One home for each setting** (owner, 2026-11-08: "we have now duplicate settings. research more and refactor").
  The audit of v16 found four: Inversion in three places (the Chord sheet, ‹ › on the bar, the Inversions view);
  Arpeggio split in two (on and off on the bar, its direction in the gear); All piano settings in the gear and in
  Keyboard; Play the chord when it changes in the gear, though the piano's page is its home. Now (v17):
  - **Inversion:** ‹ › on the bar, as the Player's ‹ › step through the bars; the Inversions view shows them all,
    and a tap on one goes to it, as a tap on a chord in the Player's score does. The Chord sheet no longer has it.
  - **Play the chord** is one choice behind the bar's second button: Block chord · Arpeggio up · Arpeggio up and
    down, as cards (the Player's Wait · Play tiles), the button naming the choice. The gear no longer has Arpeggio.
  - **The piano's settings** are only behind Keyboard (Keys, Note names, Connect a piano ›, All piano settings ›).
    Play the chord when it changes stays on the piano's page, its one home.
  - **The gear** holds the chord at its head (Share link, ··· with Add to a progression, Open in the Chord player,
    Open in the Chord finder), Practise in the Player, and the one setting left for the page: Staff, Grand staff ·
    Treble only (it was behind a second tap on the Staff view, which nothing told the learner).
  - Each home, in one table:

    | Choice                      | Its one home                                    |
    | --------------------------- | ----------------------------------------------- |
    | Root, Chord, Voicing        | the bar's Chord ▴                               |
    | Block or arpeggio           | the bar's second button                         |
    | Inversion                   | ‹ › on the bar (the Inversions view shows them) |
    | Hands                       | the bar's Hands                                 |
    | Keys, Note names, the piano | the bar's Keyboard                              |
    | Staff                       | the gear                                        |
    | Tensions                    | the Tones view                                  |

  - Research: the Player's own rulings (one gear, the transport's buttons each opening their own sheet, the
    piano's settings behind Keyboard, view by view); Piano Companion keeps only display choices (staff and keyboard
    size) in its Settings and the chord's own choices on the chord page (App Store listing); CLAUDE.md, "each
    preference has one home; elsewhere a link row to it, never a second control".

- **Every control says what it is** (owner, 2026-11-08: "not all icons are very clear"). On a phone the views are
  words (Staff · Inversions · Fingering · Tensions, R42 v19) as on a laptop; the bar's buttons carry a caption under the icon:
  the chord's symbol over **Chord**, **Block** or **Arpeggio**, **Hands**, **Keyboard**. The icons are redrawn as
  what they show: a block chord is three notes stacked on one stem, an arpeggio three notes rising, the keyboard
  white keys with three black keys. ‹ › and Play stay icons alone, as on every player. A long chord symbol shrinks
  rather than being cut off (C♯m(maj7)).

- **Corners nest, and the chosen view stands out** (owner, 2026-11-08: "the inner corners doesn't match the
  roundness of the outer corners, and the toolbars names at the top aren't also very clear"). Every inner shape takes
  the outer radius less the inset: the bar is 68 tall with radius 34, so its buttons (56 tall, 6 in) are full pills
  at 28; on a laptop the 48 buttons are pills at 24; an inversion card's piano (12 in from a 16 corner) is 4. The
  views are named for what they show, Staff · Inversions · Fingering · Tensions (Tones read as a sound); the chosen
  one is ink with white text, the others ink on the sheet, so which view is on is seen at a glance.

- **Apple's toolbar and segmented control** (owner, 2026-11-08: "apple guidelines provide more guides to toolbars
  and to corners and their radius and buttons inside the toolbar … names are still not very clear or should they be
  icons instead"). Read: HIG Toolbars, Segmented controls, Buttons, Tab bars, SF Symbols
  (developer.apple.com/design/human-interface-guidelines). Taken, in its words:
  - "Prefer simple, recognizable symbols for items instead of text", "without borders"; "aim for a maximum of three"
    groups; "Only specify one primary action"; "Keep actions with text labels separate"; standard items "have corner
    radii that are concentric with bar corners"; a 44 by 44 hit region; capsules in a row.
  - Segmented: "all segments are usually equal in width", "either text or images — not a mix", "nouns", "no more than
    about five segments on iPhone"; it switches "closely related subviews".
  - So the phone's bar is three capsules (each 56, radius 28; items 44, radius 22, 6 in): the chord's name (text, as
    no symbol says Cmaj7) · ‹ Play › with Play the one tinted action · Play as, Hands, Keyboard as symbols only. Hands
    draws which hands (two, a right, a left) instead of a badge, which Apple keeps for critical news. A laptop shows
    the same three groups with each symbol's name beside it (macOS's Icon and Text). Captions under icons go.
  - The views stay words (no symbol says Inversions or Tensions), as an equal-width segmented control on a track,
    right above what it switches, under the keys; the top bar is Back, the title **Chords**, the gear.

- **Every control says, in words, what it is set to** (owner, 2026-11-08: "research more and refactor. make more
  clear"). Replaces the symbols-only phone bar of v20.
  - Research: NN/g's icon-usability study (Aurora Harley): "text labels are necessary to communicate the meaning and
    reduce ambiguity"; only home, print and search are read the same by everyone. Apple's tab bar: "Supply a symbol
    and a text label for each tab". Material 3's floating toolbar: actions icon-only or icon and label, stadium
    corners, 8 inside. Piano Companion plays a chord as a loop or an arpeggio, a choice beside the chord.
  - The phone's bar: the chord's name over **Chord ⌃**; Play alone, the one filled action; one capsule of three, each
    a symbol over its current value: **Block** or **Arpeggio**, **Both hands**, **Right hand** or **Left hand**,
    **Keyboard**. A laptop puts the value beside the symbol (Block chord, Both hands, Keyboard).
  - ‹ › leave the transport, where they read as previous and next song, and become the chord's own stepper under its
    name, in words: **‹ Root position ›**, then the voicing (Close voicing). The chord is now read top to bottom:
    name, full name, inversion, voicing, notes.
  - Corners: groups 68 tall (radius 34), items 56 inside 6 (radius 28), the stepper 44 (radius 22) with 40-tall
    arrows 2 in (radius 20).

- **The inversion is in the chord's name; the bar is grouped by what it changes** (owner, 2026-11-08: "can you embed
  the inversions in the big chord name … how each element of the toolbar relates to each other is unclear: like the
  block chords or arpeggios change the player but they are in separate groups … research more on laws of proximity
  and other laws of ux ui"). Replaces v21's stepper under the name and its bar.
  - Research (lawsofux.com, after NN/g's Gestalt articles): Proximity, "objects that are near … tend to be grouped
    together … perceived to share similar functionality"; Common Region, "elements … sharing an area with a clearly
    defined boundary" read as a group; Similarity, alike things read as related; Uniform Connectedness, "group
    functions of a similar nature so they are visually connected"; Fitts, big, well-spaced targets; Jakob, the
    musician's slash chord, read everywhere else.
  - The name carries the inversion as a slash chord, the bass after the slash in deep honey: **‹ Cmaj7/E ›**, the
    arrows either side of the name, 44 circles. Under it, in words: "1st inversion, E in the bass · Close voicing".
    Root position has no slash. A long name shrinks rather than wraps (Cmaj9/E, C♯m(maj7)/G♯).
  - The bar is three capsules, each one subject, its items alike inside it: **the chord** (the chord's name ⌃, the
    hands that play it) · **its sound** (Play, and how it plays: Block or Arpeggio, right beside it) · **the
    keyboard**. Play leaves its lone spot and sits with the choice that changes what it plays.

- **The page in three places: the chord is chosen on the chord, the bar plays it, the gear shows it** (owner,
  2026-11-08: "i dont like the bottom bar of the chords page, research more and improve the bottom bar. refactor
  the options properly and remove all the redundant things"). Replaces v18–v22's bars.
  - Research: Apple's toolbar items "act on content in the view"; "only specify one primary action"; a tab bar is
    for navigation, "not to provide actions"; segmented controls switch "closely related subviews". Laws of UX:
    proximity (a choice beside what it changes), Hick (fewer choices, faster), Fitts (two big targets in the thumb's
    reach). Piano Companion: "play a chord in the loop or arpeggio" (two ways of hearing, not a setting).
  - Audit of v22, what was said twice or lived in the wrong place: the inversion (‹ › on the name and the Inversions
    view's cards); the chord (the bar's chord button and the name); Play plus a Play-as setting with its own sheet
    (Block, Arpeggio up, Arpeggio up and down); Hands, a setting of the voicing, on the bar; the keyboard's settings on
    the bar and the page's own settings behind the gear.
  - Now, top to bottom: Back · **Chords** · gear; the keys; the chord's name with ⌄, the button that opens Chord
    (Root, Chord ›, Voicing ›, **Hands** Both · Right · Left); its full name; the inversion, **Root · 1st · 2nd · 3rd**
    (triads three), an equal-width segmented control; "E in the bass · Close voicing"; the notes; the views
    **Staff · Fingering · Tensions** right above what they switch; the view.
  - The bar: two buttons, both actions: **▶ Play chord** (the one filled, honey) and **Arpeggio** (up), each turning
    to ■ while it sounds. No setting is on the bar.
  - The gear, **Settings**: the chord with Share link and ···, Practise in the Player, then Keyboard (Keys Chord · 61 ·
    88, Note names), Staff (Grand staff · Treble only), Connect a piano ›, All piano settings ›.
  - Gone: the Inversions view (the segmented control holds the choice; the keys show the shape), ‹ ›, the Play-as
    sheet and "Arpeggio up and down", the Hands and Keyboard buttons and sheets, the bar's chord button.

- **The inversions as v22 had them; the chord chosen in both places** (owner, 2026-11-08: "i don't like the
  inversions how you refactored them and the chords choosing in both places was pretty good"). Amends v26.
  - The inversion is stepped by ‹ › either side of the name (**‹ Cmaj7/E ›**), and the **Inversions** view (four
    cards with their small keyboards) is back: Staff · Inversions · Fingering · Tensions. v26's Root · 1st · 2nd · 3rd
    segmented control goes. Under the name: "1st inversion, E in the bass · Close voicing".
  - The chord is chosen from the name (⌄) and from the bar's first button (Cmaj7 ⌃); both open the same Chord sheet
    (Root, Chord ›, Voicing ›, Hands). This one doubling is the owner's choice: the name where the eye is, the bar where
    the thumb is.
  - The bar: **Cmaj7 ⌃** · **▶ Play** · **Arpeggio**. The gear keeps Keyboard and Staff (v26).

- **No Inversions view** (owner, 2026-11-08: "do we need this inversions when we already have them on piano?"). The
  big keys show the inversion you are on and ‹ › steps it; the view only added four small keyboards side by side.
  Views: **Staff · Fingering · Tensions**.

## Fixed on the way

The kit's sheet function had taken the name of the sheet colour, so every card on the R41 pages was drawn with no
background since v14. The function is now `BSHEET`; the cards are the sheet colour again on every page.

## History

- 2026-11-08: drawn (v16). Replaces the calm Chords page (big symbol, keys card, Change chord bar).
- 2026-11-08: duplicates removed (v17).
- 2026-11-08: words on the views, captions on the bar, clearer icons (v18).
- 2026-11-08: concentric corners, Tensions, the chosen view in ink (v19).
- 2026-11-08: Apple's toolbar groups and segmented control (v20).
- 2026-11-08: every control in words, the inversion stepper under the name (v21).
- 2026-11-08: the inversion in the name as a slash chord; the bar grouped by subject (v22).
- 2026-11-08: the page restructured: chosen on the chord, played by the bar, shown by the gear (v26).
- 2026-11-08: the builder (v27) undone, owner: "no, the previous layout directions were better"; v26's layout stands (v28).
- 2026-11-08: inversions back to ‹ › and the Inversions view; the chord chosen from the name and the bar (v29).
- 2026-11-08: the Inversions view goes; the keys and ‹ › show it (v30).
- 2026-11-08: Tensions as Add a note; Both clefs | Treble on the staff; Practise on the page; one prominent Play (v31).
- 2026-11-08: no gear, Share or More; a Keyboard button; Bass in the left hand inside Voicing; fingering on the staff (v32).
- 2026-11-08: the clef choice and Bass in the left hand go; fingering stacked as engraved (v33).
- 2026-11-08: fingering, accidentals, Show the keyboard and the circle's names fixed in the real runtime (v34).
- 2026-11-08: Fingering settings (Show, Hand, On the keys); numbers beside the notes; fingering by inversion (v35).
- 2026-11-08: Keyboard panel as the Player's, on the bar; the gear keeps Fingering; numbers on the keys as Vita Piano (v36).
- 2026-11-08: finger numbers on the keys one step above the name (v37).
- 2026-11-08: Labels Names · Fingers · None on the keys; the gear: Hand, Staff › Finger numbers (v38).
- 2026-11-08: Add a note removed; Extended gains maj7♯11; a new Altered group, 7♭9 · 7♯9 · 7♯11 · 7♭13 (v39).
- 2026-11-08: the root picker as two rows of six, used on every Practice page (v40).
- 2026-11-08: a chord's root as letter and ♭ · ♮ · ♯, every spelling (v41).
- 2026-11-08: a chord's root as 17 notes, naturals · sharps · flats; no C♭, F♭, E♯, B♯ (v42).
- 2026-11-08: a chord's root as one row of letters, tap again for ♯ then ♭ (v43).
- 2026-11-08: the chosen root letter shows its ♮ ♯ ♭, the current one marked (v44).
- 2026-11-08: every root from middle C; no octave drop from F♯ (v45).
- 2026-11-08: the chosen root letter opens into its spellings, D♭ D D♯ (v46).
- 2026-11-08: v46 rejected; tap again, the chosen letter shows "↻ C♯", the next spelling (v47).
- 2026-11-08: the chip reads "or C♯"; the turn arrow read as reset (v48).
- 2026-11-08: "Tap again for C♯" on a pointer under the chosen letter; "or C♯" read as a second name (v49).
- 2026-11-08: the tap-again pointer is a tip, gone after the first tap-again (v50).
- 2026-11-08: no ⌄ beside the big chord; the chord itself opens the sheet (v51).
- 2026-11-08: inversion stepper under the name; Play and Arpeggio merged into one split button (v52).
- 2026-11-08: the keyboard button out of the bar, a round glass button beside it (v53).
- 2026-11-08: the bar as three glass groups, Play the one tinted, on the trailing side (v54).
- 2026-11-09: heading as a lead sheet: ♭ set as music, inversion pull-down, notes with roles (v56).
- 2026-11-09: every inversion one tap (position over slash chord); notes as columns over their roles (v57).
- 2026-11-09: v57 rejected ("tab switch"); the inversion a ring of the notes, turned by tapping a note into the bass (v58).
- 2026-11-09: v58 ring not readable; the notes as a column, lowest at the bottom, "Bass up an octave" (v59).
- 2026-11-09: v59 moved too much; a still row of the chord's notes, the bass one filled, tap to choose (v60).
- 2026-11-09: each bass note shows its chord on a small staff; the slash takes the bass note's colour (v61).
- 2026-11-09: staffs and label removed; Hand and Fingering into the Chord sheet; keyboard to the header, gear gone (v62).
- 2026-11-09: Play alone, centred, plain glass; the chord chosen from its name only (v63).
- 2026-11-09: Play's honey tint restored, still centred (v64).
- 2026-11-09: the chord button back, left of the centred Play; "Arpeggiate" (v65).
- 2026-11-09: bar names never cut: chord type steps with length, Play 176 (v66).
- 2026-11-09: several chords on the staff (+, ×/Undo, All chords in order); hands voice as the transcripts teach (v67).
- 2026-11-09: four voicings added, Rootless on a dominant takes the 13th, Arpeggio up and down; Scales in 15 keys with key signatures (v68).
- 2026-11-09: hands on the staff (R.H./L.H.), Left plays the chord, one fingering toggle, Next chord suggestions voice-led (v69).
- 2026-11-09: hand cards over the staff, notes and fingers in each; fingering always shown (v70).
- 2026-11-09: hands toolbar under the staff with Split (Gorshkov), full chord in each hand, checklist, Play all (v71).
- 2026-11-09: drawn hands with lit fingers and Bass only; the chord and Play centred as one group (v72).
- 2026-11-09: hands name their chords, left hand Chord | Root, Transpose all by key or half step (v73).
- 2026-11-09: voice leading drawn (ties, traces, nearest inversion and octave); Practise rows from the transcripts and Chordify (v74).
- 2026-11-09: proper 2D hand outlines traced from the app's hand models; note badges on the fingertips (v75).
- 2026-11-09: finger numbers upright in fingertip circles, filled in the note's colour where the finger plays; from Faber, Hoffman, Pianote and others (v76).
- 2026-11-09: the hands drawn at the keyboard, each playing finger reaching its key (v77).
- 2026-11-09: the app's 3D hands live at the top of Chords; Left · Both · Right under the piano; Off · 3D · 2D (v78).
