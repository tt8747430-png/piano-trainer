# Dorico 6 palettes: every Write-mode panel and popover, and everything each one offers

Dorico's "palette" is the **Notations toolbox** on the right of Write mode. You switch between **Panels** (click-to-insert grids) and **Popovers** (type a short code at the selection).
The left side has the **Notes toolbox and panel** (durations, accidentals, articulations, slurs, input tools).

**Sources:**
- **Part A, panels and their sections:** the binary (help ID, widget class, `…Section` widget names, labels, commands).
- **Part B, the items each panel lists:** the app's own default library (`Resources/scoreLibrary.xml`, `playingTechniqueDefinitions.xml`), so names and IDs are exact.
- **Part C, popover keys:** `keycommands_en.json`.

## A. Panels in Write mode (help IDs `projectwindow/writemode/*`)

### barsbarlinespanel (BarsBarlinesPanel)


**Sections:** `commonClefsSection`, `uncommonClefsSection`, `archaicClefsSection`, `octaveLinesSection`

**Items and labels:** Insert Bars · Insert Bar Rest · Create Barline · Tick · Short (center) · Short (top) · End/Start Repeat

**Commands:** `NoteInput.InsertBarRest` (Insert Bar Rest)

### clefspanel (ClefsPanel)


**Sections:** `commentsSection`

**Items and labels:** 15ma · 22ma · 15mb · 22mb · Common Clefs · Uncommon Clefs · Archaic Clefs · Octave Lines

### commentspanel (CommentsPanel)


**Sections:** `conductorSymbolsSection`, `functionSymbolsSection`, `insertCueSection`, `suggestCuesSection`

**Items and labels:** Create Comment · Edit Comment · Reply to Comment · Export Comments · Delete Comment · Conductor Symbols · Function Symbols

**Commands:** `NoteInput.ReplyToComment` (Reply To Comment), `File.Export.Comments` (Export › Comments)

### cuespanel (CuesPanel)


### cuespanel/suggestcues (CuesPanel)


**Sections:** `immediateDynamicsSection`, `gradualDynamicsSection`, `forceDynamicsSection`, `combinedDynamicsSection`

**Items and labels:** Create Cue · Suggest Cues · Resting for: · Rehearsal marks: · Consider · Ignore · Cues: · Update · Flow: · Layout: · Highlight suggestions · Playing instruments:

### dynamicspanel (DynamicsPanel)


**Sections:** `horizontalLineSection`, `verticalLineSection`

**Items and labels:** Immediate Dynamics · Show More · Force/Intensity of Attack

### holdspausespanel (HoldsPausesPanel)


**Sections:** `tuningSystemSection`, `usedInThisFlowSection`, `keySignaturesSection`, `customKeySignaturesSection`, `accidentalsSection`

**Items and labels:** Fermata · Very Short Fermata · Short Fermata · Long Fermata · Very Long Fermata · Short Fermata (Henze) · Long Fermata (Henze) · Curlew (Britten) · Breath Marks · Breath Mark (Comma) · Breath Mark (Tick-like) · Breath Mark (Upbow-like) · Breath Mark (Salzedo) · Caesuras · Caesura  · Curved Caesura · Thick Caesura · Short Caesura · Single-stroke Caesura 

### keysignaturespanel (KeySignaturesPanel)


### keysignaturespanel/accidentals


**Items and labels:** Tonality System · New Tonality System · Duplicate Tonality System · Edit Tonality System · Import Tonality System · Export Tonality System · Delete Tonality System · Used in This Flow · Major · Minor · More Sharps/Fewer Flats · Fewer Sharps/More Flats · Custom Key Signatures · Maxima · Longa · Double Whole Note (Breve) · Whole Note (Semibreve) · Half Note (Minim) · Quarter Note (Crotchet) · 8th Note (Quaver) · 16th Note (Semiquaver) · 32nd Note (Demisemiquaver) · 64th Note (Hemidemisemiquaver) · 128th Note · 256th Note · 512th Note · 1024th Note · Note Input Panel

**Commands:** `NoteInput.NoteValue?LogDuration=kMaxima&SetBasedOnButtonCheckedState` (Note Value (LogDuration=kMaxima, SetBasedOnButtonCheckedState)), `NoteInput.NoteValue?LogDuration=kLong&SetBasedOnButtonCheckedState` (Note Value (LogDuration=kLong, SetBasedOnButtonCheckedState)), `NoteInput.NoteValue?LogDuration=kBreve&SetBasedOnButtonCheckedState` (Note Value (LogDuration=kBreve, SetBasedOnButtonCheckedState)), `NoteInput.NoteValue?LogDuration=kSemibreve&SetBasedOnButtonCheckedState` (Note Value (LogDuration=kSemibreve, SetBasedOnButtonCheckedState)), `NoteInput.NoteValue?LogDuration=kMinim&SetBasedOnButtonCheckedState` (Note Value (LogDuration=kMinim, SetBasedOnButtonCheckedState)), `NoteInput.NoteValue?LogDuration=kCrotchet&SetBasedOnButtonCheckedState` (Note Value (LogDuration=kCrotchet, SetBasedOnButtonCheckedState)), `NoteInput.NoteValue?LogDuration=kQuaver&SetBasedOnButtonCheckedState` (Note Value (LogDuration=kQuaver, SetBasedOnButtonCheckedState)), `NoteInput.NoteValue?LogDuration=kSemiQuaver&SetBasedOnButtonCheckedState` (Note Value (LogDuration=kSemiQuaver, SetBasedOnButtonCheckedState)), `NoteInput.NoteValue?LogDuration=kDemiSemiQuaver&SetBasedOnButtonCheckedState` (Note Value (LogDuration=kDemiSemiQuaver, SetBasedOnButtonCheckedState)), `NoteInput.NoteValue?LogDuration=kHemiDemiSemiQuaver&SetBasedOnButtonCheckedState` (Note Value (LogDuration=kHemiDemiSemiQuaver, SetBasedOnButtonCheckedState)), `NoteInput.NoteValue?LogDuration=k128Note&SetBasedOnButtonCheckedState` (Note Value (LogDuration=k128Note, SetBasedOnButtonCheckedState)), `NoteInput.NoteValue?LogDuration=k256Note&SetBasedOnButtonCheckedState` (Note Value (LogDuration=k256Note, SetBasedOnButtonCheckedState)), `NoteInput.NoteValue?LogDuration=k512Note&SetBasedOnButtonCheckedState` (Note Value (LogDuration=k512Note, SetBasedOnButtonCheckedState)), `NoteInput.NoteValue?LogDuration=k1024Note&SetBasedOnButtonCheckedState` (Note Value (LogDuration=k1024Note, SetBasedOnButtonCheckedState))

### keysignaturespanel/customkeysignatures


### keysignaturespanel/tonalitysystem (KeySignaturesPanel)


### linespanel (GenericLinesPanel)


**Sections:** `fermatasSection`, `breathMarksSection`, `caesurasSection`

**Items and labels:** Attach to notehead · Attach to barline (where available) · Attach to rhythmic position · Edit Lines

**Commands:** `Engrave.EditLines?LineOrientation=kHorizontal` (Edit Lines (LineOrientation=kHorizontal)), `Engrave.EditLines?LineOrientation=kVertical` (Edit Lines (LineOrientation=kVertical))

### noteinputtoolbox (NoteInputToolbox)

> These tools change the way note input and editing work. Most stay switched on until you switch them off, and apply both during note input (when the caret is visible) and when you are editing your music afterwards.
>

**Sections:** `baroqueClassicalSection`, `jazzSection`, `arpeggiationSection`, `glissandiSection`, `guitarSection`

**Items and labels:** Notes Toolbox · Select · Start Note Input · Pitch Before Duration · Chords · Insert (Voice) · Insert (Player) · Insert (Global) · Insert (Global Adjustment of Current Bar) · Create Voice · Create Slash Voice · Next Voice · Dotted Notes · Tuplets · Scissors

**Commands:** `NoteInput.MouseInputDisable?SetBasedOnButtonCheckedState` (Mouse Input Disable (SetBasedOnButtonCheckedState)), `NoteInput.Enter` (Start Note Input [Set=true]), `NoteInput.PitchBeforeDurationToggle` (Pitch Before Duration Toggle), `NoteInput.StartEndChord` (Chord Input), `NoteInput.Mode` (Note input mode), `NoteInput.Locked` (Lock Note Durations), `NoteInput.ForceDuration?SetBasedOnButtonCheckedState` (Force Note Durations), `NoteInput.SetDotted?SetBasedOnButtonCheckedState&Value=1` (Set Dotted (SetBasedOnButtonCheckedState, Value=1)), `NoteInput.SetDotted?SetBasedOnButtonCheckedState&Value=2` (Set Dotted (SetBasedOnButtonCheckedState, Value=2)), `NoteInput.SetDotted?SetBasedOnButtonCheckedState&Value=3` (Set Dotted (SetBasedOnButtonCheckedState, Value=3)), `NoteInput.SetDotted?SetBasedOnButtonCheckedState&Value=4` (Set Dotted (SetBasedOnButtonCheckedState, Value=4)), `NoteInput.RestMode?SetBasedOnButtonCheckedState` (Rests), `NoteInput.CreateGraceNote?SetBasedOnButtonCheckedState` (Create Grace Note (SetBasedOnButtonCheckedState)), `NoteInput.Tie` (Tie), `NoteInput.Scissor` (Scissor)

### notespanel

> The Notes panel contains all of the basic note durations, accidentals, articulations and slurs you need while inputting music. You can input music using the mouse, a MIDI keyboard, or your computer keyboard 
>

**Sections:** `slurSection`, `articulationSection`

**Items and labels:** Notes Panel · Show/Hide All Notes · Accent · Marcato · Stressed · Unstressed · Staccato · Tenuto · Staccatissimo · Staccato Tenuto

**Commands:** `NoteInput.ToggleFullAndReducedNoteInputButtons` (Toggle Full And Reduced Note Input Buttons), `NoteInput.SetAccidental?Type=kNatural` (Set Accidental (Type=kNatural)), `NoteInput.SetAccidental?Type=kFlat` (Set Accidental (Type=kFlat)), `NoteInput.SetAccidental?Type=kSharp` (Set Accidental (Type=kSharp)), `NoteInput.SlurStart` (Start Slur), `NoteInput.SetArticulation?Value=kAccent` (Set Articulation), `NoteInput.SetArticulation?Value=kMarcato` (Set Articulation (Value=kMarcato)), `NoteInput.SetArticulation?Value=kStress` (Set Articulation (Value=kStress)), `NoteInput.SetArticulation?Value=kUnstress` (Set Articulation (Value=kUnstress)), `NoteInput.SetArticulation?Value=kStaccato` (Set Articulation), `NoteInput.SetArticulation?Value=kTenuto` (Set Articulation), `NoteInput.SetArticulation?Value=kStaccatissimo` (Set Articulation (Value=kStaccatissimo)), `NoteInput.SetArticulation?Value=kStaccatoTenuto` (Set Articulation (Value=kStaccatoTenuto)), `NoteInput.CreateVoice` (Create Voice), `NoteInput.CreateSlashedVoice` (Create Slashed Voice), `NoteInput.NextVoice` (Next Voice), `NoteInput.InsertScope?InsertModeScope=kVoice` (Insert Scope (InsertModeScope=kVoice)), `NoteInput.InsertScope?InsertModeScope=kPlayer` (Insert Scope (InsertModeScope=kPlayer)), `NoteInput.InsertScope?InsertModeScope=kGlobal` (Insert Scope (InsertModeScope=kGlobal)), `NoteInput.InsertScope?InsertModeScope=kGlobalCurrentBar` (Insert Scope (InsertModeScope=kGlobalCurrentBar)), `NoteInput.SetDotted?Set=true&Value=1` (Set Dotted (Set=true, Value=1)), `NoteInput.SetDotted?Set=true&Value=2` (Set Dotted (Set=true, Value=2)), `NoteInput.SetDotted?Set=true&Value=3` (Set Dotted (Set=true, Value=3)), `NoteInput.SetDotted?Set=true&Value=4` (Set Dotted (Set=true, Value=4)), `NoteInput.GraceNoteSlashToggle?Set=false` (Grace Note Slash Toggle (Set=false)), `NoteInput.GraceNoteSlashToggle?Set=true` (Grace Note Slash Toggle (Set=true)), `NoteInput.StartTupletRun` (Start Tuplet Input)

### ornamentspanel (OrnamentsPanel)


**Sections:** `verticalLayout_guitarSection`, `commonSection`, `windSection`, `brassSection`, `untunedPercussionSection`, `tunedPercussionSection`, `keyboardSection`, `choralSection`, `stringsSection`, `harpPedalsSection`

**Items and labels:** Jazz · Plop Bend · Doit Bend (Short) · Doit Bend (Medium) · Doit Bend (Long) · Scoop · Fall Bend (Short) · Fall Bend (Medium) · Fall Bend (Long) · Lift (Wavy) · Lift (Straight) · Doit Smooth (Wavy) · Doit Smooth (Straight) · Plop Smooth (Wavy) · Plop Smooth (Straight) · Fall Smooth (Wavy) · Fall Smooth (Straight) · Remove · Baroque and Classical · Arpeggiation · Arpeggio Up · Arpeggio Down · Arpeggio Up (Curve) · Non Arpeggio · Glissandi · Glissando (Straight) · Glissando (Wavy) · Guitar · Guitar Bend · Guitar Bend with Vibrato Bar · Vibrato Bar Scoop · Vibrato Bar Dip · Vibrato Bar Line

**Commands:** `NoteInput.RemoveJazzArticulation` (Remove Jazz Articulation)

### playingtechniquespanel (PlayingTechniquesPanel)


**Sections:** `repeatEndingsSection`, `repeatMarkerSectionsSection`, `repeatMarkerJumpsSection`, `repeatWithinBeatsSection`, `barRepeatsSection`

**Items and labels:** Common · Add Playing Technique · Edit Playing Technique · Wind · Unpitched Percussion · Pitched Percussion · Keyboard · Retake Pedal · Change Pedal Level: 1/4 · Change Pedal Level: 1/2 · Change Pedal Level: 3/4 · Change Pedal Level: 1 · Choral · Strings · Create

### repeatstructures (RepeatStructuresPanel)


**Sections:** `addRepeatEndingSection`, `tapTempoSection`, `absoluteTempoChangeSection`, `gradualTempoChangeSection`, `relativeTempoChangeSection`, `resetTempoChangeSection`, `tempoEquationSection`

**Items and labels:** D.S. al Coda · D.S. al Fine · D.S. · D.C. al Coda · D.C. al Fine · D.C. · To Coda · Coda · Segno · Fine · Repeat Endings · Create Repeat Ending · Add Section To Repeat Ending · Remove Single-note Tremolo · Z on Stem · One Stroke Multi-note Tremolo · Two Strokes Multi-note Tremolo · Four Strokes Single-Note Tremolo · Three Strokes Multi-note Tremolo · Four Strokes Multi-note Tremolo · Remove Multi-note Tremolo · One Stroke Single-note Tremolo · Two Strokes Single-note Tremolo · Three Strokes Single-Note Tremolo · Tremolo With Release · Tremolo With Attack · Create Slash Region · Create Bar Repeat Region · Numbered Bars · Create Numbered Bar Region

**Commands:** `Edit.MakeNewRepeatEndingLine` (Make New Repeat Ending Line), `Edit.AddSegmentToRepeatEndingLine` (Add Segment To Repeat Ending Line), `Edit.ClearSingleNoteTremolo` (Clear Single Note Tremolo), `Edit.MakeMultiNoteTremolo?Value=1` (Make Multi Note Tremolo (Value=1)), `Edit.MakeMultiNoteTremolo?Value=2` (Make Multi Note Tremolo (Value=2)), `Edit.MakeMultiNoteTremolo?Value=3` (Make Multi Note Tremolo (Value=3)), `Edit.MakeMultiNoteTremolo?Value=4` (Make Multi Note Tremolo (Value=4)), `Edit.ClearMultiNoteTremolo` (Clear Multi Note Tremolo), `NoteInput.CreateSlashedRegion` (Create Slashed Region), `NoteInput.CreateBarRepeatRegion` (Create Bar Repeat Region), `NoteInput.CreateRegionNumberingRepeatedBars` (Create Region Numbering Repeated Bars)

### tempopanel (TempoPanel)


**Sections:** `commonTimeSignaturesSection`, `createTimeSignaturesSection`

**Items and labels:** Tap Tempo · Absolute Tempo Change · Slower · Tempo Range Slider · Set the minimum and maximum tempos to display · Faster · Gradual Tempo Change · Relative Tempo Change · Reset Tempo · Tempo Equation

### timesignaturespanel (TimeSignaturesPanel)


**Sections:** `videoSection`, `markerSection`

**Items and labels:** Create Time Signature · Regular · Pick-up bar of: · 1 beat

### videopanel (VideoPanel)


**Items and labels:** Properties... · Find Tempo...

**Commands:** `Video.Properties` (Properties)

## B. What the panels list: the complete default library

### Clefs panel: clefs (26)

4-string Tab Clef · 6-string Tab Clef · Alto Clef · Alto Clef 8 Below · Baritone Bass Clef · Baritone Clef · Bass Clef · Bass Clef 15 Above · Bass Clef 15 Below · Bass Clef 8 Above · Bass Clef 8 Below · French Violin Clef · Indian Drum Clef · Invisible Clef · Mezzo-soprano Clef · Percussion Clef · Percussion Clef (Rectangular) · Soprano Clef · Sub-bass Clef · Tenor Clef · Tenor Clef 8 Below · Treble Clef · Treble Clef 15 Above · Treble Clef 15 Below · Treble Clef 8 Above · Treble Clef 8 Below

### Clefs panel: octave lines (7)

Loco · Octave down · Octave up · Three octaves down · Three octaves up · Two octaves down · Two octaves up

### Ornaments panel (45)

Bend · Cadence · Cadence with turn · Cadence with upper prefix · Cadence with upper prefix and turn · Descending slide · Double cadence · Double cadence with mordent · Double cadence with mordent and upper prefix · Double cadence with upper prefix · Double cadence with upper prefix and turn · Flip · Haydn ornament · Inverted turn · Inverted turn up · Jazz turn · Mordent · Mordent with release · Mordent with upper prefix · Pincé · Port de voix · Schleifer · Shake · Short trill · Slide · Slide-trill (D'Anglebert) · Slide-trill (Muffat) · Slide-trill with one-note suffix (Marpurg) · Slide-trill with two-note suffix (J.S. Bach) · Slide-trill with two-note suffix (Muffat) · Smear · Supported appoggiatura trill · Supported appoggiatura trill with two-note suffix · Tremblement · Tremblement appuyé · Trill · Trill with lower suffix · Trill with mordent · Trill with two-note suffix (Dandrieu) · Turn · Turn up · Turn with slash · Turn-trill (D'Anglebert) · Turn-trill with two-note suffix (J.S. Bach) · Vibrato Bar Dip

### Tempo panel: tempo words (presets) (78)

Adagietto · Adagio · Affettuoso · Agitato · Alla breve · Alla marcia · Allegretto · Allegrissimo · Allegro · Allegro moderato · Allegro vivace · Andante · Andante moderato · Andantino · Animato · Appassionato · Brillante · Con bravura · Con brio · Con dolcezza · Con fuoco · Con moto · Deciso · Energico · Eroico · Furioso · Giocoso · Gioioso · Grandioso · Grave · Grazioso · L'istesso tempo · Lacrimoso · Lamentoso · Larghetto · Larghissimo · Largo · Lento · Lento · Maestoso · Malinconico · Marcia moderato · Marziale · Mesto · Misterioso · Moderato · Mosso · Movimento · Nobilmente · Patetico · Prestissimo · Presto · Ritenuto · Scherzando · Stretto · Tempo I · Tempo II · Tempo comodo · Tempo giusto · Tempo primo · Tempo secondo · Tempo semplice · Tranquillamente · Trionfante · Vivace · Vivacissimo · a tempo · accelerando · allargando · calando · lentando · morendo · precipitando · rallentando · ritardando · smorzando · sostenuto · stringendo

### Tempo / Play: rhythmic feel (swing) (11)

2:1 swing 16ths (fixed) · 2:1 swing 8ths (fixed) · 3:1 swing 16ths (fixed) · 3:1 swing 8ths (fixed) · Heavy swing 16ths · Heavy swing 8ths · Light swing 16ths · Light swing 8ths · Medium swing 16ths · Medium swing 8ths · Straight (no swing)

### Notehead sets (Edit › Notehead) (37)

Aikin 7-shape Noteheads · Circle X Noteheads · Circled Noteheads · Default Noteheads · Diamond Noteheads · Figurenotes Noteheads · Funk 7-shape Noteheads · Large Arrow Down Noteheads · Large Arrow Up Noteheads · Large Circled Noteheads · Large X and Diamond Noteheads · Larger Noteheads · Moon Noteheads · Muted Slash Noteheads · Old-Style Diamond Noteheads · Ornate X Noteheads · Oversized Slash Noteheads · Pitch Name Noteheads · Plus Noteheads · Rectangular Noteheads · Round White with Dot Noteheads · Slash Noteheads · Slashed Noteheads (Bottom Left to Top Right) · Slashed Noteheads (Top Left to Bottom Right) · Small Slash Noteheads · Triangle Down Noteheads · Triangle Left Noteheads · Triangle Right Noteheads · Triangle Up Noteheads · Walker 4-shape Noteheads · Walker 7-shape Noteheads · White Diamond Noteheads · Wide Diamond Noteheads · With X Noteheads · X Noteheads · X and Circle X Noteheads · X and Diamond Noteheads

### Rest sets (3)

Default rests · Old-style quarter rests · Z-style quarter rests

### Page sizes (Layout Options › Page Setup) (19)

A3 · A4 · A5 · B4 · B5 · Band (5" x 7") · C4 · Concert (9" x 12") · Executive (7.25" x 10.5") · Folio (8.5" x 13") · Hymn (5.25" x 8.75") · Legal (8.5" x 14") · Letter · Octavo (6.75" x 10.5") · Part (10" x 13") · Part (9.5" x 12.5") · Quarto (Metric Demy) · Statement (5.5" x 8.5") · Tabloid

### Lines panel: line styles (46)

Brace (left) · Brace (right) · Curve with arrow (down) · Curve with arrow (up) · Dashed line (long) · Dashed line (long) with outline arrowhead · Dashed line (long) with solid arrowhead · Dashed line (short) · Dashed line (short) with inward-pointing hook · Dashed line (short) with inward-pointing hooks · Dashed line (short) with outline arrowhead · Dashed line (short) with solid arrowhead · Dashed line (short) with terminal line · Dashed line (short) with terminal lines · Dashed vertical line (short) · Dashed vertical line (short) with left-pointing hook · Dashed vertical line (short) with left-pointing hooks · Dashed vertical line (short) with right-pointing hook · Dashed vertical line (short) with right-pointing hooks · Dashed vertical line (short) with solid arrowhead · Flat-bottom wedge (thick-thin) · Flat-bottom wedge (thin-thick) · Flat-top wedge (thick-thin) · Flat-top wedge (thin-thick) · Solid line · Solid line (thick) with terminal lines · Solid line (thicker) with terminal lines · Solid line with inward-pointing hook · Solid line with inward-pointing hooks · Solid line with outline arrowhead · Solid line with solid arrowhead · Solid line with terminal line · Solid line with terminal lines · Solid vertical line · Solid vertical line with left-pointing hook · Solid vertical line with left-pointing hooks · Solid vertical line with right-pointing hook · Solid vertical line with right-pointing hooks · Solid vertical line with solid arrowhead · Symmetrical wedge (thick-thin) · Symmetrical wedge (thin-thick) · Wavy line · Wavy line (narrow-wide) · Wide wiggly line · Wiggly line · Wiggly line (slow-fast)

### Line bodies (34)

Brace (left) · Brace (right) · Curve (down) · Curve (up) · Dashed line body (long) · Dashed line body (short) · Dashed line body (short-long) · Dotted line body (large) · Dotted line body (medium) · Dotted line body (small) · Double line body (thick) · Double line body (thin) · Flat-bottom wedge body (thick-thin) · Flat-bottom wedge body (thin-thick) · Flat-inside wedge body (thick-thin) · Flat-inside wedge body (thin-thick) · Flat-outside wedge body (thick-thin) · Flat-outside wedge body (thin-thick) · Flat-top wedge body (thick-thin) · Flat-top wedge body (thin-thick) · Solid line body (thick) · Solid line body (thicker) · Solid line body (thin) · Symmetrical wedge body (thick-thin) · Symmetrical wedge body (thin-thick) · Wavy body · Wavy body (narrow-wide) · Wavy body (variable) · Wavy body (wide-narrow) · Wiggly body · Wiggly body (fast-slow) · Wiggly body (slow-fast) · Wiggly body (variable) · Wiggly body (wide)

### Line ends (annotations) (19)

Axis-aligned terminal line · Chevron arrowhead (large) · Chevron arrowhead (small) · Down-pointing axis-aligned hook · Down-pointing rotatable hook · Inward-pointing axis-aligned hook · Inward-pointing rotatable hook · Left-pointing axis-aligned hook · Left-pointing rotatable hook · Outline arrowhead (large) · Outline arrowhead (small) · Right-pointing axis-aligned hook · Right-pointing rotatable hook · Rotatable terminal line · Solid arrowhead (large) · Solid arrowhead (small) · Up-pointing axis-aligned hook · Up-pointing rotatable hook · Restrike Bend

### Accidentals (Key Signatures panel) (66)

1 comma flat · 1 comma sharp · 2 commas flat · 2 commas sharp · 3 commas flat · 3 commas sharp · 4 commas flat · 5 commas sharp · Arrow down (quarter-tone flat) · Arrow up (quarter-tone sharp) · Bakiye flat · Bakiye sharp · Buyuk mucenneb flat · Buyuk mucenneb sharp · Double flat · Double flat · Double flat · Double flat · Double sharp · Double sharp · Double sharp · Double sharp · Fazla flat · Fazla sharp · Five-quarter-tones flat · Five-quarter-tones sharp · Flat · Flat · Flat · Flat · Koron · Kucuk mucenneb flat · Kucuk mucenneb sharp · Natural · Natural · Natural · Natural · Natural · Natural · Quarter-tone flat · Quarter-tone flat (flat) · Quarter-tone flat (natural) · Quarter-tone sharp · Quarter-tone sharp (natural) · Quarter-tone sharp (sharp) · Sharp · Sharp · Sharp · Sharp · Sori · Tanini flat · Tanini flat · Tanini sharp · Tanini sharp · Three-quarter-tones flat · Three-quarter-tones flat · Three-quarter-tones flat (flat) · Three-quarter-tones sharp · Three-quarter-tones sharp · Three-quarter-tones sharp (sharp) · Triple flat · Triple flat · Triple flat · Triple sharp · Triple sharp · Triple sharp

### Accidental systems (6)

Accidentals for Persian music (17ET) · Arel-Ezgi-Uzdilek (AEU) accidentals (53ET) · Turkish folk music accidentals (53ET) · Western accidentals for 12ET · Western accidentals for 24ET (Gould arrow quartertones) · Western accidentals for 24ET (Stein-Zimmermann quartertones)

### Tuning systems (Key Signatures panel) (5)

Makam Nihavend (53ET) · Makam Rast (53ET) · Persian Dastgah (17ET) · Standard Western tuning (12EDO) · Standard Western tuning (24EDO)

### Text styles (paragraph styles) (37)

Bar numbers (parts) · Bar numbers (score) · Composer · Copyright · Cue Labels · Default Text · Figured Bass Tasto Solo · Flow Title · Galley View Margin Labels · Harp Pedal Settings · Header · Instrument Change Labels · Instrument Change Warnings · Layout name · Lyricist · Lyrics · Lyrics (Chorus Translation) · Lyrics (Chorus) · Lyrics (Translation) · Lyrics (Verse Numbers) · MIDI Trigger Region Labels · Page Number · Percussion Legend · Player Group Labels · Player Labels · Rehearsal Marks · Repeat Count · Repeat Marker Jumps · Repeat Marker Sections · Staff Labels · Staff Labels (Inner) · Staff Labels (Percussion Grid) · Tacet · Tempo (Gradual) · Tempo (Immediate) · Tempo (Metronome Mark) · Title

### Repeatable symbols (arpeggios, trills, accel./rit. beams…) (100)

Accel./rit. beam 1 (widest) · Accel./rit. beam 10 · Accel./rit. beam 11 · Accel./rit. beam 12 · Accel./rit. beam 13 · Accel./rit. beam 14 · Accel./rit. beam 15 · Accel./rit. beam 2 · Accel./rit. beam 3 · Accel./rit. beam 4 · Accel./rit. beam 5 · Accel./rit. beam 6 · Accel./rit. beam 7 · Accel./rit. beam 8 · Accel./rit. beam 9 · Accel./rit. beam terminating line · Arpeggiato down · Arpeggiato down arrow · Arpeggiato down swash · Arpeggiato up · Arpeggiato up arrow · Arpeggiato up swash · Circular motion segment · Circular motion segment end · Circular motion segment, large · Circular motion segment, larger · Circular motion segment, larger still · Circular motion segment, largest · Circular motion segment, small · Circular motion start · Constant circular motion segment · Constant circular motion segment (flipped) · Constant circular motion segment (flipped, large) · Constant circular motion segment (large) · Glissando wiggle segment · Group glissando 1 · Group glissando 2 · Group glissando 3 · Guitar vibrato wiggle segment · Guitar wide vibrato stroke · Narrow sawtooth line segment · Narrow square wave line segment · Quasi-random squiggle 1 · Quasi-random squiggle 2 · Quasi-random squiggle 3 · Quasi-random squiggle 4 · Sawtooth line segment · Square wave line segment · Vibrato / shake wiggle segment · Vibrato large, fast · Vibrato large, faster · Vibrato large, faster still · Vibrato large, fastest · Vibrato large, slow · Vibrato large, slower · Vibrato large, slowest · Vibrato largest, fast · Vibrato largest, faster · Vibrato largest, faster still · Vibrato largest, fastest · Vibrato largest, slow · Vibrato largest, slower · Vibrato largest, slowest · Vibrato medium, fast · Vibrato medium, faster · Vibrato medium, faster still · Vibrato medium, fastest · Vibrato medium, slow · Vibrato medium, slower · Vibrato medium, slowest · Vibrato small, fast · Vibrato small, faster · Vibrato small, faster still · Vibrato small, fastest · Vibrato small, slow · Vibrato small, slower · Vibrato small, slowest · Vibrato smallest, fast · Vibrato smallest, faster · Vibrato smallest, faster still · Vibrato smallest, fastest · Vibrato smallest, slow · Vibrato smallest, slower · Vibrato smallest, slowest · Vibrato start · Wide sawtooth line segment · Wide square wave line segment · Wide vibrato / shake wiggle segment · Wiggle trill · Wiggle trill fast · Wiggle trill faster · Wiggle trill faster still · Wiggle trill fastest · Wiggle trill slow · Wiggle trill slower · Wiggle trill slower still · Wiggle trill slowest · Wiggle wavy · Wiggle wavy narrow · Wiggle wavy wide

### Playing-technique appearances (246)

Above (sopra) · Aeolian · Air · Alla Chitarra · Alto sul tasto · Aperto (text) · Arco · Artificial Harmonic (Tab) · Ascending Aeolian Chords (Salzedo) · Au talon · Below (sotto) · Bisbigliando (whisper) · Bow On Tailpiece · Bow on Bridge · Bow on Bridge on Four Strings · Bow on Bridge on One String · Bow on Bridge on Three Strings · Bow on Bridge on Two Strings · Bucket mute · Buzz Pizzicato · Center (Caltabiano) · Center (Ghent) · Center (Text) · Center (Weinberg) · Change Bow Direction · Choke (Weinberg) · Clavichord Bebung (2 Fingers) · Clavichord Bebung (3 Fingers) · Clavichord Bebung (4 Fingers) · Closed / Rim Shot · Closed Hole · Closed Wah Pedal · Col Legno · Col Legno Battuto · Col Legno Tratto · Con bocca chiusa · Con sordino · Crush · Cuivré · Cup mute · Damp · Damp (Large) · Damp (Left) · Damp (Right) · Damp Above (Salzedo) · Damp Below (Salzedo) · Damp Only Low Strings (Salzedo) · Damp With Both Hands (Salzedo) · Descending Aeolian Chords (Salzedo) · Double-tongue · Down Bow · Détaché · Edge (Text) · Fade In · Fade Out · Finger Click (Stockhausen) · Fingernail Flick · Flatter Embouchure · Flatterzunge (flz.) · Flautando · Fluidic Sounds, Left Hand (Salzedo) · Fluidic Sounds, Right Hand (Salzedo) · Flutter-tongue (f.t.) · Flutter-tongue (flt.) · Fouetté · Frullato · Full Barré · Guitar Shake · Half Barré · Half Harmonic · Half-closed Hole · Half-mute · Half-open · Half-open (Weinberg) · Half-open Wah Pedal · Hammer on · Harmon mute (text) · Harmon mute, stem in · Harmon mute, stem in (text) · Harmon mute, stem left · Harmon mute, stem out · Harmon mute, stem out (text) · Harmon mute, stem right · Harmonic (o) · Harp Tuning Key · Harp Tuning Key Glissando · Harp Tuning Key Handle · Harp Tuning Key Shank · Isolated Sounds (Salzedo) · Jeté · Jeté (text) · Key Slap · Key clicks · Laissez Vibrer (l.v.) · Left (L) · Left Hand (Agostini) · Left Hand (L.H.) · Left-hand Pizzicato · Left-hand Tapping · Legato · Mano destra (right hand) · Mano sinistra (left hand) · Marcato (text) · Martellato · Martelé · Metal Rod · Metallic Sounds (Salzedo) · Metallic Sounds, One String (Salzedo) · Modo Ordinario · Molto Vibrato · Mouth Closed · Mouth Open · Mouth Pursed · Mouth Slightly Open · Mouth Wide Open · Mouthpiece/Hand Pop · Much More Reed (Push Inwards) · Muffle Totally (Salzedo) · Muffled · Multiphonic · Mute (+) · Mute (text) · Mute Off · Mute Off (text) · Mute On · Nasal Voice · Natural Harmonic (Tab) · Naturale (nat.) · Non Laissez Vibrer (non l.v.) · Non Vibrato · Normal Position (Caltabiano) · Normal Reed Position · Oboic Flux (Salzedo) · On Rim · Open · Open · Open (remove mute) · Open (text) · Open Wah Pedal · Open hole · Ordinario (ord.) · Overpressure (Down Bow) · Overpressure (No Bow Direction) · Overpressure (Up Bow) · Overpressure Possibile (Down Bow) · Overpressure Possibile (Up Bow) · Palm Mute · Pedal Heel 1 · Pedal Heel 2 · Pedal Heel 3 · Pedal Heel Toe · Pedal Heel to Toe · Pedal Toe 1 · Pedal Toe 2 · Pedal Toe to Heel · Pinch Harmonic (Tab) · Pizzicato · Play at Upper End of Strings (Salzedo) · Pluck Inside · Pluck With Fingernails · Plunger mute · Poco Vibrato · Poco sul tasto · Près de la Table (p.d.l.t.) · Pull off · Punta d'arco · Relaxed Embouchure · Right (R) · Right Hand (Agostini) · Right Hand (R.H.) · Right-hand Tapping · Rim (Caltabiano) · Rim (Ghent) · Rim Only · Rim or Edge (Weinberg) · Saltando · Scrape Around Rim (Clockwise) · Scrape Around Rim (Counter-clockwise) · Scrape from Center to Edge · Scrape from Edge to Center · Senza Vibrato · Senza sordino · Sharper Embouchure · Slap-tongue · Slide With Suppleness (Salzedo) · Snap Pizzicato · Snare Drum Effect (Salzedo) · Snares Off · Snares On · Somewhat Relaxed Embouchure · Somewhat Tight Embouchure · Spiccato · Stick Shot · Stopped (+) · Stopped (text) · Straight mute · String 0 · String 1 · String 2 · String 3 · String 4 · String 5 · String 6 · String 7 · String 8 · String 9 · Strong Air Pressure · Strum Down · Strum Up · Sul Ponticello (Bow on Bridge) · Sul Tasto · Sul ponticello (sul pont.) · Tam-tam Sounds (Salzedo) · Tap the Pick Guard (Golpe) · Tapping (T) · Tapping (dot) · Tapping (plus) · Thumb Position · Thunder Effect (Salzedo) · Tight Embouchure · Timpanic Sounds (Salzedo) · Tongue Click (Stockhausen) · Tongue and Finger Click (Stockhausen) · Trill Key · Triple-tongue · Up Bow · Valve trill · Very Little Reed (Pull Outwards) · Very Tight Embouchure · Vibraphone Half Pedal (½ ped.) · Vibraphone Motor Off · Vibraphone Motor On · Vibraphone Pedal (l.v.) · Vibraphone Pedal (ped.) · Vibrato · Vibrato Bar Dip · Vibrato Bar Scoop · Vibrato bar line · Volume Swell · Weak Air Pressure · Whistle Tone · Whistling Sounds (Salzedo) · With Mute (text) · Xylo · m.d. (right hand) · m.s. (left hand)

### Playing techniques by group (`playingTechniqueDefinitions.xml`, 298)

**Dynamics** (25): Accent · Crescendo · Crescendo-diminuendo · Diminuendo · Diminuendo-crescendo · Fade in · Fade out · Fouetté · Marcato · Soft · Volume swell · f · ff · fff · ffp · fp · mf · mp · p · pf · pp · ppp · sf · sfp · sfz

**Playing Techniques panel** (224): Alternative fingering · Artificial harmonic · Backstick · Bartok/snap pizzicato · Bass tone · Bell · Bell mute · Bow on bridge · Bow on tailpiece · Bowed · Bowl hit · Bucket mute · Buzz pizzicato · Buzz roll · Cage hit · Centre · Choke · Chorus · Circular roll · Click · Closed · Closed end · Closed hole · Col legno battuto · Col legno tratto · Cross stick · Crunch · Crunch choke · Crush · Crush (dry) · Crush (fat) · Cuivré · Cup mute · Damp · Dead stroke · Delay · Ding · Distortion · Double-tongue · Down · Downbow · Dreads (beater) · Dress harness hit · Dut (vocal) · Edge (cymbals) · Edge (drums) · Edge rebound · Felt (beater) · Finger click · Flange · Flat crash · Flat roll · Flautando · Flutter-tongue · Foot · Frame · Friction slide 1 · Friction slide 2 · Ga (open) · Ge (open) · Ghost note · Gi (muted open) · Guitar pizzicato · Half-harmonic · Half-muted · Half-open · Harmon mute, stem extended · Harmon mute, stem in · Harmon mute, stem out · Harp harmonic · Hi-hat · Hit (loose) · Hit (medium) · Hit (tight) · Jet whistle · Jeté · Ke (closed) · Key click · Key click with pitch · LH pizzicato · Laissez vibrer · Left (LH) · Left-hand tap · Loose · Martelé · Motor off · Motor on · Mouth closed · Mouth open · Mouth pursed · Mouth slightly open · Mouth wide open · Mouthpiece pop · Muffled strings · Muffled/Damped · Multiphonic · Muted · Na (open) · Nail · Nail pizzicato · Nasal voice · Natural · Natural harmonic 1 · Natural harmonic 2 · Non vibrato · Open 1 · Open 2 · Open end · Open hole · Over the head double shot · Over the head hit · Over the head shot · Overdrive  · Overpressure · P.d.l.t. · Palm muting · Pedal · Phaser · Pick scrape · Pinch harmonic · Pincé · Ping · Pizzicato · Pizzicato alla chitarra · Pizzicato secco · Plucked · Plunger mute · Pop · Port crash · Press roll · Puffy (beater) · Pull · Push · Rake · Release · Right (RH) · Right hand tap · Right-hand tap (tapping) · Rim · Rim knock · Rim only · Rim shot · Rods (beater) · Scrape · Scrape (left) · Scrape (right) · Scratch in · Scratch out · Shell · Side stick · Simile · Sizzle · Sizzle suck · Skank · Skin · Slap · Slap (congas) · Slap tongue · Snares off · Snares on · Snenor · Sons xylophoniques · Sostenuto pedal · Spoken · Stand click · Sticks · Stick (butt) · Stick (shaft) · Stick (shaft 1) · Stick (shaft 2) · Stick (shaft 3) · Stick (shaft 4) · Stick (shaft 5) · Stick (shaft open) · Stick (shoulder) · Stick (tip) · Stick click · Stick shot · Stick snap · Stick (tip 1) · Stick (tip 2) · Stick (tip 3) · Stick (tip 4) · Stick (tip 5) · Sticks in · Stir · Stopped · Straight mute · Suck · Sul ponticello · Sul tasto · Sustain pedal · Swish · Swoosh roll · Ta (muted open) · Tap · Tap at edge · Tap choke · Tap halfway · Te (closed) · Throw · Throwoff off · Throwoff on · Ti (muted closed) · Tongue and finger click · Tongue click · Tongue stop · Triple-tongue · Tu (open) · Una corda · Up · Upbow · Vacuum suck · Vibrato bar line · Wah-wah · Wah-wah open · Wah-wah stopped · Whale call · Whisper · Whistle · Whistle tone · Zing · Zing (fast) · Zing (slow)

**Ornament-type techniques** (35): Arpeggio down · Arpeggio up · Bend · Con vibrato · Dip/bend · Doit · Fall (drop) · Flip · Glissando down · Glissando up · Growl · Jazz turn · Plop · Portamento down · Portamento up · Pre-bend · Rip · Roll · Scoop · Shake · Slide · Slight bend · Smear · Squeeze · Strum down · Strum up · Tremblement · Tremolo · Trill · Trill (half-step) · Trill (whole step) · Vibrato · Vibrato bar dip · Vibrato bar scoop · Wide vibrato

**Lengths (articulations)** (14): Collé · Détaché · Détaché lancé · Legato · Martellato · Non legato · Portato/Louré · Ricochet · Saltando · Sautillé · Spiccato · Staccatissimo · Staccato · Tenuto

## C. Popovers: the type-to-create entry points (Write mode)

| Key | Popover | Panel equivalent |
|---|---|---|
| `⇧C` | Clefs and octave lines | clefspanel |
| `⇧K` | Key signatures, tonality systems | keysignaturespanel |
| `⇧M` | Time signatures (meter) | timesignaturespanel |
| `⇧T` | Tempo | tempopanel |
| `⇧D` | Dynamics | dynamicspanel |
| `< / >` | Hairpins (⌥ for messa di voce) | dynamicspanel |
| `⇧O` | Ornaments | ornamentspanel |
| `⇧P` | Playing techniques | playingtechniquespanel |
| `⇧H` | Holds and pauses | holdspausespanel |
| `⇧B` | Bars and barlines | barsbarlinespanel |
| `⇧A` | Rehearsal marks | (none) |
| `⇧X` | Text | (none) |
| `⇧L` | Lyrics | (none) |
| `Q` | Chord symbols (play or type a chord) | (none) |

The codes typed into each popover (e.g. `treble`, `8va`, `3/4`, `pp<`) are parsed by Dorico's code. They aren't stored as a table in the bundle, so they aren't listed here. The manual pages linked in `../ui-flow/PANELS_AND_BUTTONS.md` document them.
