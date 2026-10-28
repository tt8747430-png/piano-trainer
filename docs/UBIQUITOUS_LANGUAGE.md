# Ubiquitous Language

The words for code, interface copy, commits and talk. One line a term: what it means, then the code name or the
interface's words where they differ, then the words to avoid. How a thing works is in the code and the ADRs
(`docs/adr/`, index in its README); how content is written is in [CONTENT](CONTENT.md).

Format: **Term** (code · UI «Russian»): meaning. _Avoid:_ words.

## Content

- **Piece** (UI Song / Study): anything that opens in the Player, a song or a study (`kind`). How it is written (a
  chart, or degrees) is not its kind. _Avoid:_ item, track, tune.
- **Song**: a piece to play and sing, on Songs. _Avoid:_ track.
- **Study** («Этюд»): a piece written to practise a technique, practised under Accompaniment. _Avoid:_ exercise.
- **Exercise** («Упражнение»; `entities/exercise`): a line of notes made by a rule in any key (a scale, a sequence,
  an arpeggio, Hanon), practised in the Player. _Avoid:_ drill, study.
- **Listing**: a songbook entry with no chart yet; in Songs, never in the Player. _Avoid:_ stub, placeholder.
- **Version** (UI Your version): the learner's own music for a catalog piece, kept until **Reset to the original**.
  _Avoid:_ copy, fork, edit.
- **Own song** (`my-<n>`; UI New song): a song the learner wrote from scratch. _Avoid:_ custom song, user song.
- **Repertoire** (`repertoire`): the catalog as the learner has it, each piece in its Version, plus their own songs.
  _Avoid:_ library.
- **Collection**: an ordered group of pieces and listings from one source; each of Songs' starts as a Folder.
  _Avoid:_ book, category.
- **Book** (`entities/book`): a printed songbook or method a Source cites. _Avoid:_ collection.
- **Method book**: a book that teaches accompaniment (Called to Play, Боброва's seven types, Gorshkov's course): its
  Course, its pattern groups and the pieces they are practised on. _Avoid:_ course, method.
- **Source**: where a piece is printed: its book, number and page. _Avoid:_ origin, reference.
- **Credit**: a role (words, music, harmony…) and the names printed for it. _Avoid:_ author string, by.
- **Chart** (UI Chords): a piece's chords by section, line and bar. _Avoid:_ sheet, score, lead sheet.
- **Section** (UI Verse, Chorus…): a labelled part of a chart: intro, verse, chorus, bridge, ending, or a songbook's
  practice, hymn, part. _Avoid:_ block, segment.
- **Bar** («Такт»): one measure. _Avoid:_ measure (in code), segment.
- **Pickup**: a first bar shorter than the meter. _Avoid:_ anacrusis, upbeat bar.
- **Method code** (`:t1`, `:3ch`): a method book's way of playing one chord, shown as **Way 1** («Способ 1») or by
  its code (5.1). _Avoid:_ style code, a bare number.
- **Written hand** (`hands`; UI Written out): a bar of one hand written note by note, played in place of the
  pattern's hand. _Avoid:_ custom bar.
- **Staff** («Нотоносец»; `staves`, `staff0`…): a single staff over the piano's grand staff, a line of notes, named
  by the learner (unnamed: "Staff 2"). _Avoid:_ melody staff, part, instrument.
- **Lead sheet** (`leadSheet`): a score with the piano's staves hidden, its single staves and chord symbols in sight.
  _Avoid:_ chart.
- **Tune**: the top staff, as the Player knows it. In the interface it is called by the staff's name. _Avoid:_ Tune
  (in the UI).
- **Melody** («Мелодия»; `melody`): the Setup's choice of what plays the tune along with the hands: None, the top
  staff by name, or the Recording. _Avoid:_ Play melody, tune switch.
- **Lyrics** («Текст»; `lyrics`, `lyricsOn`): a piece's words, verses of syllables on the notes of one staff.
  _Avoid:_ words, text (in code).
- **Verse** («Куплет 1»): one line of lyrics, one syllable a note. A Section is a verse of the music, not of the
  words. _Avoid:_ stanza, line.
- **Syllable** («Слог»): what one note sings. _Avoid:_ word, lyric.
- **Melisma** (`_`, `held`): a syllable held over the notes after it, drawn with an extender. _Avoid:_ slur, tie.
- **Recording** («Запись»): a performance shipped with a piece that plays along in Listen, in its own key. Not a
  Take. _Avoid:_ track, audio, backing.
- **Tuning** («Строй»): the A a piece is tuned to, A 440 Hz unless its recording says. _Avoid:_ frequency, pitch.
- **LocalText** (`{ en, ru }`): content text in both languages. _Avoid:_ translation, i18n string.

## Music

- **Pitch class**: one of the 12 notes in any octave (0–11). _Avoid:_ note number.
- **Spelled note**: a note with its letter and accidental (E♭, not D♯). _Avoid:_ note-name string.
- **Chord quality** (`maj`, `m7`, `hd`…): a kind of chord the table names. _Avoid:_ chord type (in code).
- **Chord family**: a group of qualities: triads; 6th & add; 7ths; 9ths & more; altered 7ths. _Avoid:_ chord group.
- **Chord symbol**: the written name, `F#m7b5/C`; printed with real signs (`C♯m7`). _Avoid:_ chord name.
- **Chord tone**: one note of a chord, with its **Role** (root, 3rd … 13th) and **Degree** label (`♭3`). _Avoid:_
  chord note.
- **Tone**: a spelled note measured from a root: a chord tone or a scale note. _Avoid:_ scale note.
- **Interval** (reference): two notes named and heard: short name (m3), size, consonance; the Intervals explorer's
  card. _Avoid:_ distance, step.
- **Consonance**: perfect (unison, 4th, 5th, octave), imperfect (3rds, 6ths) or a dissonance. _Avoid:_ harmony.
- **Available tension** (`tensions.ts`): a note over a 7th chord that colours it. With **Weak** and **Strong** chord
  tones and **Avoid notes**, the four groups of the tension table. _Avoid:_ extension, option.
- **Avoid note**: a note that clashes with a chord tone. _Avoid:_ wrong note.
- **Key** («Тональность»): a tonic, major or minor. _Avoid:_ tonality (in code), mode.
- **Key change**: a section written in another key. _Avoid:_ modulation (in the UI).
- **Transpose** («Тональность» / «Транспонировать»): move to another tonic by interval, letters kept. _Avoid:_
  shift, capo.
- **Scale kind**: thirteen, in three families: major and minor (major; natural, harmonic, melodic minor), the Modes,
  pentatonic and blues. _Avoid:_ scale type.
- **Mode**: a church mode (Dorian, Phrygian, Lydian, Mixolydian, Locrian). _Avoid:_ key.
- **Parent scale**: the major scale a mode comes from; a mode is written in its parent's key. _Avoid:_ relative.
- **Scale gap**: the step between neighbouring scale notes: W, H, W+H (Т, П, Т+П). _Avoid:_ step.
- **Scale chord** (`stackSuffix`): a scale's notes stacked in thirds from a degree, 3 to 7 notes. _Avoid:_ diatonic
  chord, chord quality.
- **Borrowed chord**: a chord from the parallel scale on a key's degree (♭VI, ♭VII, a minor key's V…). _Avoid:_
  chromatic chord, secondary.
- **Circle of fifths**: the 24 keys on two rings, the Key view's chooser. _Avoid:_ wheel.
- **Chord size**: how much of each chord plays: triads, sevenths or ninths; in the builder the highest number (7th
  to 13th). _Avoid:_ voicing, colour.
- **Voicing**: how a chord's notes lie under the hands: close, open, drop 2, shell, rootless, quartal. _Avoid:_
  chord size, shape.
- **Drop 2**: a close four-note chord with its second voice from the top an octave lower. _Avoid:_ spread.
- **Shell**: the left hand's root and 7th. _Avoid:_ rootless, skeleton.
- **Inversion** («Обращение»): which chord tone is lowest: Root · 1st · 2nd · 3rd. A chord of five notes or more is
  not inverted; its **Right hand from** says where the hand above the bass starts. _Avoid:_ position.
- **Figures**: an inversion's figured-bass mark after a numeral: ⁶, ⁶₄, ⁷, ⁶₅, ⁴₃, ⁴₂. _Avoid:_ inversion symbol.
- **Placed tone** (`placeChord`, `placeScale`): a tone at a key on the keyboard. _Avoid:_ voicing.
- **Chord parts** (`ChordParts`): a chord as the builder makes it: Triad, Chord size, 7th, Added tones,
  Alterations. _Avoid:_ chord options, quality.
- **Triad** (a chord part): major, minor, diminished, augmented, sus2 or sus4. _Avoid:_ quality, sus option.
- **Added tone**: a tone added beside the stack (add2, 6, add9, add11). _Avoid:_ extension.
- **Alteration**: a raised or lowered tone of a chord with a major 3rd (♭5, ♭9, ♯9, ♯11, ♭13). _Avoid:_ altered
  extension.
- **Numerals** («Ступени»): a progression in Roman numerals, each a degree with any chord of the table (`ii V I`,
  `V7♭9`, `V/ii`). _Avoid:_ roman chords.
- **Degree** and **Function** (a song in degrees): a numeral's root from the tonic, and how its chord grows with the
  chord size (`maj`, `min`, `dom`, `domb9`, `hd`, `=quality`). _Avoid:_ step, chord role.
- **Progression** («Последовательность»): a line of numerals practised in any key. Never a piece. _Avoid:_ chord
  flow, sequence.
- **Lead-in**: the chords played before each chord of a progression, its own V or ii–V. A way of playing, never a
  library entry. _Avoid:_ approach, tonicisation.
- **Passing chord**: a chord that leads from one chord to the next. _Avoid:_ connecting chord.
- **Harmonic function** («Функция»; UI Tonic, Subdominant, Dominant, T S D): what a chord does in its key: rests,
  moves away, pulls home (`harmonicFunction`). Not a song-in-degrees' Function above. _Avoid:_ predominant, PD,
  role.
- **Root motion** («Ход основных тонов»): how a chord's root moves to the next, by letters: `↓5`, `↓3`, `↑2` (the
  strong moves) and their opposites (`rootMove`). _Avoid:_ bass motion, root movement.
- **Function chip** / **root-motion chip**: a progression's chord as a chip, its numeral over its function or its
  root's move, in that one's paint, ink while it sounds (`HarmonyChip`). _Avoid:_ tag, badge.
- **Holds** (a chord holds a note): the note is one of its notes, any octave. _Avoid:_ contains, fits.
- **Meter** («Размер»): a time signature, 1–12 over 2, 4 or 8, with its counted beats and their groups. _Avoid:_
  time sig.
- **Common time**, **cut time** (`timeSymbol`): 4/4 printed as C, 2/2 as ¢. _Avoid:_ C time, alla breve.
- **Tempo unit** (`tempoUnit`): the note a tempo mark counts. _Avoid:_ beat value.
- **Clef** («Ключ»): the sign at a staff's head: treble, bass, their octave forms, the C clefs. _Avoid:_ key.
- **Tick**: the unit of time, 5040 a beat, so every value to the 64th and every tuplet of 2 to 9 is whole.
  _Avoid:_ step (as time).
- **Tuplet** («Группа»; `Duration.tuplet`): notes of a length the meter does not divide by, bracketed with their
  count (a triplet, a quintuplet…); found from the timing, never written as such. _Avoid:_ irregular group.
- **Glissando** («Глиссандо»; `gliss`): a slide from a note to the next, played over the white keys between.
  _Avoid:_ slide, portamento.
- **Tempo change** («Смена темпа»; `tempo:`): a tempo mark over a note mid-song, played and exported from it on.
  _Avoid:_ tempo marking (the head's is the **tempo mark**).
- **Swing mark** («Свинг»; `swing8`, `swing16`, `straight`): the feel the 8ths or 16ths take from a note on.
  _Avoid:_ shuffle.
- **Roman numeral** («Ступень»; `rn:`): the chord's degree in the key there, printed under the staff. _Avoid:_
  function symbol, degree mark.
- **Two-note tremolo** («Тремоло между нотами»; `ftrem2`): two notes alternating fast, marked on the first, each
  written as long as the pair. _Avoid:_ fingered tremolo, measured tremolo.
- **Free text** («Текст»; `txt:`): words of the learner's over a note. _Avoid:_ annotation, staff text.
- **Repeat ×N** («Повтор ×N»; `:|x3`): a repeat's end played its times, three to nine. _Avoid:_ volta count.
- **Page break** («Разрыв страницы»; `Page`): a bar whose line starts a new page. _Avoid:_ system break (a line's).
- **Bar repeat** («Повтор такта»; `%`, `%%`): a bar (or two) playing the bar (or two) before again, drawn as its sign
  while it still does. _Avoid:_ simile, measure repeat.
- **Multi-bar rest** («Многотактовая пауза»; `Rest3`): empty bars drawn as one rest with their count. _Avoid:_
  multirest, long rest.
- **Pedal** («Педаль»): the sustain pedal; the **soft** and **sostenuto** are a MIDI keyboard's others. _Avoid:_
  damper.
- **Velocity** («Сила нажатия»): how hard a key is struck, 1–127. _Avoid:_ volume.

## Patterns

- **Pattern** («Фактура»): a named accompaniment for both hands, built-in or the learner's own. _Avoid:_ rhythm,
  style (in code).
- **Figure**: one hand's part of a pattern. _Avoid:_ part, RHP/LHP.
- **Idea** (a pattern's): its one line: how it sounds and what each hand does. _Avoid:_ summary, tagline.
- **Own pattern** (`my-<n>`): a pattern the learner made. _Avoid:_ custom pattern.
- **Pattern book** (`patternBook`): the built-in patterns and the learner's own. _Avoid:_ registry, catalog.
- **Favourite** (a pattern's): starred, listed first. _Avoid:_ pinned.
- **Hidden** (a pattern): left out of the Player's list. _Avoid:_ removed, disabled.
- **Part** (Accompaniment's): one of its tabs: Called to Play · Called to Play 2 · Боброва · Горшков · Styles ·
  Yours. _Avoid:_ section.
- **Sequence** (an exercise): a figure restarted on each degree up the scale and back. _Avoid:_ pattern.
- **6th-diminished scale**: Barry Harris's eight-note scale. _Avoid:_ bebop major scale.

## The Player

- **Player**: the full screen where a piece, a walk, a progression or an exercise is practised. _Avoid:_ viewer.
- **Performance**: what the Player plays: bars, beat groups, chords and notes on a timeline, made by `arrange`.
  _Avoid:_ playback, song data.
- **Score**: music as written (`notate` makes it from a Performance); never played. _Avoid:_ notation, sheet.
- **Beat group**: notes that start together; what ‹ › step through and Wait mode waits on. _Avoid:_ chord (as
  time).
- **Cursor**: where the Player stands, a beat group, shown by the playhead. _Avoid:_ marker.
- **Playhead**: one thin line across the staves in sight at what sounds. _Avoid:_ cursor band.
- **Loop**: the bars the Player goes round (`loop=3-6`). _Avoid:_ repeat, section, A–B.
- **Pass**: one play-through of the loop or the piece. _Avoid:_ run, cycle.
- **Listen / Wait mode**: the app plays at a tempo / the app waits for your notes. _Avoid:_ auto, manual, Step
  mode.
- **Speed training**: Listen below the tempo, each pass 5% faster up to it. _Avoid:_ ramp.
- **Transport**: the pill along the music's foot: tempo, ‹ Play ›, then the screen's three (the Player's loop, Sound,
  hands; the editor's Record, Takes, settings). _Avoid:_ dock, player controls.
- **Sound**: the transport's speaker: Count in, Click, each part's **Volume**, Only the chords. _Avoid:_ mixer.
- **Count-in**: a bar of clicks before playing or recording. _Avoid:_ count-off, pre-roll.
- **Click**: the beat while the Player plays. Not the Metronome page. _Avoid:_ metronome (in the Player).
- **Volume**: how loud one part plays, 0–100%. _Avoid:_ gain, level.
- **Setup** («Параметры»; ⚙): the Player's sheet: the music's own choices, Accompaniment, How it plays. Not Settings
  («Настройки»). _Avoid:_ options, settings.
- **Starting position** («Начальное положение») and **Move smoothly** («Плавный переход»): where a row's right hand
  starts, and whether each chord then takes the nearest position. _Avoid:_ First chord, Nearest.
- **Swing**: 8ths played long-short, in one of four feels: Straight · Light · Medium · Hard. _Avoid:_ shuffle.
- **Through the keys** (walk the keys): a progression played once in each key and home. _Avoid:_ modulate.
- **Walk the chords** (`/play/walk`): a scale's chords up and back, a chord a bar. _Avoid:_ chord ladder.
- **Chromatic walk** («По полутонам»): chosen chords root by root, a semitone at a time. _Avoid:_ chord drill.
- **Start on**: the degree a scale's run starts from. _Avoid:_ rotation.
- **Fingering**: From the thumb or As the scale (each note its **continuing finger**). _Avoid:_ fingers.
- **Octaves** (an exercise): how far a run climbs, one to four. _Avoid:_ range, span.
- **Practice toggle**: one of the Player's saved switches. _Avoid:_ option, flag.
- **Score bar** (`ScoreBar`): the Player's and the editor's one header: Close, Practise · Edit, the tools row, the
  screen's three. _Avoid:_ toolbar, two bars.
- **Tools row**: the bar's text buttons: the View, Transpose, Simplify (the editor's: View, Transpose, Delete ·
  Copy · Cut · Paste). _Avoid:_ menu bar.
- **Simplify** («Упростить»): every chord played as its plain triad on its root. _Avoid:_ easy chords.
- **More** («Ещё»): the bar's last button: favourite, Move to, Archive, Song information, Sections, Share, Print,
  Export to MIDI, Export to MusicXML. _Avoid:_ overflow, options.
- **Song information** («О песне»): a sheet of a piece's chords, facts and credits. _Avoid:_ details.
- **Sections** (the Player's sheet): the sections by name and first bar. _Avoid:_ markers, chapters.
- **Share** («Поделиться»): a link to a song, or an own song with its music. _Avoid:_ export link.
- **Print** («Печать»): the view shown on paper or as a PDF. _Avoid:_ export to PDF.
- **Export to MIDI** («Экспорт в MIDI»): the music as played, each part a track; **time aligned** or **fixed tempo**
  for a piece with a recording. _Avoid:_ download MIDI.
- **Export to MusicXML** («Экспорт в MusicXML»): a piece's music as written, every staff, for a notation app.
  _Avoid:_ save as XML, download score.
- **Import** («Импорт»): a MusicXML or MIDI file made into the learner's own song, from New or dropped on the
  library; **Left out** («Не вошло в песню») lists what the file held that a song cannot. _Avoid:_ upload, open
  file.

## Views

- **View** («Вид»; `scoreView`): how the music is shown: Sheet music · Chords over lyrics · Diagrams · Grid, saved
  for every piece, plus what each shows. _Avoid:_ mode, tab.
- **Sheet music** («Ноты»): the score engraved. _Avoid:_ score view, tab.
- **Layout**: how sheet music is laid out: **Page view**, **Vertical scroll**, **Panorama**. _Avoid:_ Pages,
  Scroll down.
- **Named notes**: each note's name in its head. _Avoid:_ note names (that is the keys').
- **Finger numbers**: the fingers written, printed over the notes. _Avoid:_ fingering (that is a run's).
- **Chords over lyrics** («Аккорды над текстом»): each line's chords as **chips** over its words. _Avoid:_ lyrics
  view, chord sheet.
- **×N**: a line of chips played again straight after itself, shown once. _Avoid:_ repeat sign.
- **Diagrams** («Схемы аккордов»): the chord sounding and the next as diagrams; Mode **Animated** or **Summary**.
  _Avoid:_ chord boxes, karaoke.
- **Diagrams pinned**: Chords over lyrics' chord summary held under its strip. _Avoid:_ sticky chords.
- **Text size**: Chords over lyrics' size, 80–150%. _Avoid:_ font size, zoom.
- **Grid** («Сетка»): the chart in beats, bars lined up. _Avoid:_ chord chart (in the UI), table.
- **Beat cell**: one beat of a bar with the chords that start in it. _Avoid:_ slot, tick.
- **Beat strip**: every beat cell in one sliding row. _Avoid:_ timeline, progress bar.
- **Scrub**: the beat strip dragged to move the cursor. _Avoid:_ seek.
- **Swipe** (the pair): Diagrams' pair dragged to the next or previous chord. _Avoid:_ carousel.
- **Chord diagram** (`KeyDiagram`): a chord drawn as keys on F3–B4, a dot on each key held. _Avoid:_ chord box,
  chord shape.
- **Chord summary** («Аккорды»): a piece's chords once each, in the order they sound. _Avoid:_ chord list, legend.
- **Chord's sheet**: the sheet a chord of the summary opens: its diagram, Inversion, Play. _Avoid:_ popup, chord
  card.
- **Inversion** (a diagram's): the inversion a chord is drawn in for one piece, chosen on its sheet. _Avoid:_ shape.
- **Fact card** (`FactCard`): a fact as a card: Key · Time · Tempo. _Avoid:_ stat tile, badge.

## The keyboard

- **Live keyboard** (`LiveKeyboard`): the keyboard every screen shows; every key sounds. _Avoid:_ static keyboard.
- **Rail**: the strip the keys hang from, holding every keyboard setting as a picture. _Avoid:_ toolbar, header.
- **Keyboard settings**: key size, note names, chord names, typing; saved for every keyboard. _Avoid:_ keyboard
  prefs.
- **Key size**: Whole piano · Fit · Large; the rail's **Zoom** steps it. _Avoid:_ scale.
- **Note names**: C · All · None. _Avoid:_ labels.
- **Chord names**: the rail naming the chord a hand holds. _Avoid:_ chord detection.
- **Typing keys**: the computer keyboard as a piano. _Avoid:_ hotkeys.
- **Phone's keyboard** (`keyboard-viewport`): the on-screen keyboard a text field opens; it covers the screen's foot
  (`--kb-inset`), never the piano. _Avoid:_ soft keyboard, virtual keyboard.
- **Reveal** (`keyboard-reveal`): the page lifting a focused field, its label and its error clear of the phone's
  keyboard. **Reserve**: the keyboard last measured, held as a field is focused, before the keyboard comes.
- **Down** (a key): sounding now or held by a hand, for at least the **shortest press** (150ms). _Avoid:_ active,
  playing.
- **Lit**: a key shown as an answer or a pattern's note, not sounding. _Avoid:_ down.
- **Mark** and **wash**: a key's colour for a role, a hand or a scale note; pale at rest, full while down. _Avoid:_
  highlight, tint.
- **Spotlight**: only the keys struck last go down. _Avoid:_ highlight, focus, dim.
- **Struck**: the sounding keys struck last. _Avoid:_ active.
- **Scroll** / **Glissando**: a swipe on the keys scrolls them, or sounds each key it crosses. _Avoid:_ pan mode,
  slide mode.
- **Finger row**: finger numbers in circles under the keys. _Avoid:_ finger labels.
- **Pinned** / **Docked**: a page's keys held at its top, or at the screen's foot. _Avoid:_ sticky.
- **Live voice** (`useLiveVoice`): the keys a hand plays, sounding from press to release. _Avoid:_ tap sound.
- **Touch** («Чувствительность»): how the app hears a MIDI keyboard's velocities: Light, Normal, Heavy. _Avoid:_
  sensitivity (in code).
- **MIDI input** («MIDI-вход», `midi.input`): the app hears the MIDI keyboards; off, it hears none and asks nothing
  as it opens (the port's status `off`). _Avoid:_ connect toggle, enable MIDI.
- **MIDI input plays sound** («Звук MIDI-входа», `midi.sound`): the app sounds the keys played on it, for a keyboard
  without speakers. _Avoid:_ MIDI thru, Sound the MIDI keyboard.
- **MIDI output** («MIDI-выход», `midi.throughPiano`): the app's music on the keyboard's own speaker. _Avoid:_ Play
  through the piano.
- **Connected devices** («Подключённые устройства», `MidiDevice`): the MIDI devices plugged in, by name, with their
  maker and whether they send keys or have a speaker; the one heard is chosen there (Any keyboard: all). _Avoid:_
  ports, Listen to.
- **MIDI log** («Журнал MIDI», `MidiLogEntry`): the last 200 messages every MIDI device sent, kept by the port,
  shown live under Troubleshooting. _Avoid:_ MIDI monitor, console.

## Learn the song

- **Learn the song**: a piece's page: Practise, its facts, chords, sections, Play along. _Avoid:_ song details.
- **Section's page** («Учим раздел»): one section learned step by step. _Avoid:_ section detail.
- **Song lesson** («урок»): one thing a section's page teaches: a chord (three **Holds**), In time, One change at a
  time, Pattern. Not a Lesson, rates no Skill. _Avoid:_ step, exercise.
- **Hold**: a chord's keys held together once in its sheet. _Avoid:_ press, attempt.
- **Visit's click** (`click=true`): the click a link turns on for one visit of the Player, never saved. _Avoid:_
  metronome override.
- **Lesson done** («Пройдено»): a song lesson played. Never marks the piece Learned. _Avoid:_ completed.
- **Section paint**: a section's tile colour by its name. _Avoid:_ section colour.
- **A song's progressions**: the library's progressions a song uses, as chips. _Avoid:_ tags.
- **Heard in**: where a progression is found in a song's chords. _Avoid:_ matches.
- **Songs with this progression**: Progressions' list of the songs a progression is heard in. _Avoid:_ usages.

## The library

- **Library** (Songs; `pt-library`): the learner's songs at Home, in Folders, or in the Archive. Not the progressions'
  Library. _Avoid:_ collection, playlist.
- **Home** («Главная»): the library's top level, `/songs`. _Avoid:_ root, unfiled.
- **Folder** («Папка»): songs under a name, a picture and a paint, nested to any depth. _Avoid:_ playlist, shelf.
- **Archive** («Архив»): where archived songs and folders wait, newest first. _Avoid:_ trash, deleted, hidden.
- **Restore** («Восстановить»): put back where it stood, else at Home. **Undo** reverses the last act. _Avoid:_
  unarchive.
- **Move to** («Переместить…»): songs or folders moved to Home or a folder. _Avoid:_ file, copy to.
- **Favourites** («Избранное»): the songs the learner keeps (♡). _Avoid:_ starred, liked.
- **Select** («Выбрать»): rows chosen together for one act. _Avoid:_ edit mode.
- **Filters** («Фильтры»): search, sort, Key, Level, Favourites. _Avoid:_ Chords I know.
- **Sort**: Manual · Name · Recently played · Key. _Avoid:_ order by.
- **Shelf**: where a piece's page is: Songs, or a study under Accompaniment. _Avoid:_ category.

## Learning and progress

- **Stage** («Этап»): Beginner · Intermediate · Advanced · Professional. _Avoid:_ level, difficulty.
- **Journey**: one stage of the Lessons, in chapters. _Avoid:_ path, curriculum.
- **Chapter**: one subject of a journey, ended by its Check. _Avoid:_ module, unit.
- **Course**: a self-contained way through one subject, on a shelf, with its own lessons and guided songs. _Avoid:_
  module, path.
- **Lesson** («Урок»): a worksheet that teaches music, a journey's or a course's. _Avoid:_ tutorial, article.
- **Lesson question**: a lesson's question answered on its keys; rates nothing. _Avoid:_ quiz.
- **Variants** («Варианты»): one lesson example in versions, a chip each (a switch for an A/B pair), redrawn in
  place with its caption. _Avoid:_ tabs, options.
- **Takeaway** (UI In short, «Коротко»): a section in one sentence, on a lilac card at its end. _Avoid:_ TL;DR,
  summary (that is the lesson's).
- **Rule** (a note's `rule`): a rule's name over what it says, on a card. _Avoid:_ tip.
- **After** («Сначала»; a lesson's `after`): the lessons to read before it, of its own journey or course. _Avoid:_
  prerequisites (in the UI), requires.
- **Sections read** (`read`): which of a lesson's sections were shown or scrolled to; they fill its ring. _Avoid:_
  progress (that is learned steps).
- **Page** (a lesson on a phone): one section a screen, turned by Next and Done. _Avoid:_ slide, card.
- **S A T B**: a four-voice voicing's soprano, alto, tenor and bass, named beside its first chord and on the keys;
  the key a voice left keeps its letter faint (a **ghost**). _Avoid:_ parts.
- **Step** (`StepId`): one thing learned and marked: a lesson, a piece, a chord family or a scale kind. _Avoid:_
  item, task, node.
- **Learned**: a step the learner marked. _Avoid:_ done, completed.
- **Continue**: Learn's one suggestion of what is next. _Avoid:_ resume.
- **Day practised**: a day the learner opened the Player or answered a round; **Days in a row**. _Avoid:_ streak
  (that is a run's).
- **Recently practised**: the pieces opened last. _Avoid:_ history.
- **Skill**: a chord quality or a scale kind, rated from quiz answers. Nothing else. _Avoid:_ ability, topic.
- **Evidence**: a skill's last 5 answers. _Avoid:_ attempts.
- **Known / Gap / Unknown**: 4 of the last 5 right, the latest among them / tried, not known / never tried.
  _Avoid:_ mastered, weak, new.
- **Due**: a known skill not asked for 14 days. _Avoid:_ stale.
- **Check**: a short quiz on some skills. _Avoid:_ test, exam.

## Practice

- **Place**: one of the three: Learn · Songs · Practice. _Avoid:_ tab, section.
- **Learn** («Обучение»): the Lessons and the Courses. _Avoid:_ Path.
- **Practice** («Практика»): its pages in three groups, Theory («Теория»), Playing («Игра») and Training
  («Тренировка»). _Avoid:_ Drill, Tools, At the keys.
- **Explorer**: a page that shows one thing on the keys: Chords, Scales and keys, Intervals, Progressions. _Avoid:_
  viewer, reference.
- **Tool**: what works something out from what the learner gives, on the page of the thing it works on. _Avoid:_
  utility, finder.
- **Tabs** (a page's): the views of one thing. _Avoid:_ sub-pages.
- **Scale view** / **Chords view** / **Key view**: Scales and keys' three tabs. _Avoid:_ mode.
- **Keys play**: in Chords view, a key plays its chord or its note. _Avoid:_ tap mode.
- **Strip** (`StepStrip`): one choice of many in a row that scrolls, with ‹ › to step along it (a root's 17
  spellings, a chord's quality, a scale's kind). _Avoid:_ carousel, picker wheel.
- **On the keys** («На клавишах»): what a scale run's keys carry, Notes · Left hand · Right hand. _Avoid:_ key mode.
- **Fingering by hand** («Аппликатура по рукам»): each hand drawn with its fingers numbered, beside the run's notes
  and that hand's fingers. _Avoid:_ fingering table.
- **Character** (a progression's): how it sounds, in one line under its name. _Avoid:_ description, mood.
- **Library card**: a progression of the library on Progressions: its numerals, name, chord count, character and
  chips, with a Play that plays it in place. _Avoid:_ preset.
- **Play what you choose** («Играть выбранное», `autoplay`): a chord or a scale chosen sounds at once. _Avoid:_
  preview, audition.
- **Ticks between loops** («Щелчки между повторами», `rest`): beats of clicks the Player waits before each repeat
  of a loop. _Avoid:_ gap, pause, delay.
- **Starts on** (a hand's, «начинает с»): the octave a hand's scale run starts in, C1 to C7. _Avoid:_ register,
  position.
- **Scale on the keys** («Гамма на клавишах»): the Chord finder's key's scale painted on every octave. _Avoid:_
  overlay, highlight.
- **Library** (progressions): the one list of practised progressions, one entry an idea, a major and a minor line.
  _Avoid:_ presets, templates.
- **Typed line**: Progressions' field of numerals or chords. _Avoid:_ key detector.
- **Between** («Между двумя аккордами»): Progressions' passing chords between two chords. _Avoid:_ Passing chords
  (as a page).
- **Harmonise** («Гармонизовать ноту мелодии»): the Key view's chords that hold a melody note. _Avoid:_ Reharmonise.
- **Chord finder** («Определитель аккордов»): names the chord played, in every **reading**. _Avoid:_ Find, chord
  detector.
- **Trainer**: one of the Quiz's: levels or Custom, runs of rounds, opened at its **Setup**. _Avoid:_ quiz, game.
- **Chords**, **Intervals**, **Build scale**, **My gaps**: trainers. _Avoid:_ exercise.
- **Setup** (a trainer's): the one template every trainer opens at: its drill, Options, Timing, how it works, Start.
  _Avoid:_ settings, config.
- **Drill** («Режим»): the way Chords and Intervals ask the same things: **Cards** («Карточки»), **Quiz** («Тест»),
  **Play** («Игра»), **By ear** («На слух»). Never an exercise. _Avoid:_ mode, game.
- **Card** (a drill's): a chord or interval shown by one of its name, keys or staff (**Shown**), the rest
  **Revealed**; never right or wrong. _Avoid:_ flashcard (in the UI), flip.
- **Time limit** («Лимит времени»): a round's seconds; when they run out the answer is shown, the round missed.
  _Avoid:_ timer, countdown.
- **Roots** («Основные тоны»), **From notes** («От нот»): Custom's notes a chord or an interval is asked on,
  grouped Natural, Sharp, Flat. _Avoid:_ used keys, keys.
- **Level** (a trainer's): a fixed set of what it asks. _Avoid:_ stage.
- **Custom**: a trainer's own choices. _Avoid:_ free.
- **Round**: one question of a trainer. _Avoid:_ question, item.
- **Run**: a trainer's rounds, summed up. _Avoid:_ session, game.
- **Metronome** («Метроном»): its own page: a beat at 30–300 BPM, **Tap tempo**, a sound and a meter. _Avoid:_ click
  track.
- **Search** («Поиск»): finds every named thing by kind. Its **Index** is one list of the registries. _Avoid:_
  glossary.

## The score editor

- **Score editor** (UI Edit): the page where a version or an own song is written. _Avoid:_ composer.
- **Practise · Edit**: the switch between the Player and the editor on one piece. _Avoid:_ mode toggle.
- **Layer**: where the editor writes: Chord symbols, a staff, Upper staff, Lower staff. _Avoid:_ voice, part.
- **Caret**: where the next note goes, a thin line on its staff. _Avoid:_ cursor.
- **Selection**: the notes or bars chosen, coloured. _Avoid:_ highlight.
- **Editing mode**: Replace · Insert · Chord. _Avoid:_ input mode.
- **Palette** (UI Tools): the editor's tools by category in Flat's order, docked as a **panel** at the sheet's left
  (from 48rem across) or a **sheet** at its foot (a phone held upright). _Avoid:_ floating card, folded row.
- **Panel**: the palette docked at the sheet's left, its sections an accordion, hidden whole by its «. _Avoid:_
  sidebar (the app's navigation).
- **Note-entry toolbar** («Ввод нот»): the everyday tools in one row (♮ ♯ ♭, Respell, the values, dots, tie, triplet,
  rest), over the sheet beside the panel and as the sheet's quick row. _Avoid:_ palette (it is the palette's part).
- **Compact · Expanded**: the phone's sheet with its quick row and category tabs, or with every section. _Avoid:_
  folded, opened.
- **List mode**: the expanded sheet's keys each with its name. _Avoid:_ labels mode.
- **Chord wizard** («Конструктор аккорда»): the chord symbol built from a root, a chord and a bass beside its field.
  _Avoid:_ chord builder, chord dialog.
- **Grace note** («Форшлаг»): a note struck just before its note, taking none of its time. _Avoid:_ ornament note.
- **Sign picker** (`SignPicker`): the one frame of the **Time signature**, **Key signature** and **Clef** pickers
  and the tempo dial: a sheet on a phone, a popover on a laptop. _Avoid:_ dialog, modal.
- **Sign tile**: a sign drawn on a staff with its name. _Avoid:_ icon.
- **Tempo dial**: the tempo mark's picker. _Avoid:_ BPM slider.
- **Wheel**: a value slid up and down as a phone's picker. _Avoid:_ drum.
- **Struck together**: keys down within 80ms: one chord. _Avoid:_ chord input.
- **Take** («Дубль»): what the learner played from Record to Stop, kept as played. _Avoid:_ recording, clip.
- **Take's page**: a take on its own, drawn as a **piano roll**, with **Keep bars** («Оставить такты»), which cuts
  it to whole bars. _Avoid:_ trim, crop.
- **Write into the score** («Вписать в ноты»): a take turned into notes. _Avoid:_ quantise (in the UI), import.

## App

- **Settings** («Настройки»): the app's settings page. _Avoid:_ preferences.
- **How to use** («Как пользоваться»): Settings' short guide. _Avoid:_ manual, onboarding.
- **Theme**: `system`, `light` or `dark`. _Avoid:_ mode, appearance.
- **Locale**: `en` or `ru`. _Avoid:_ language code.
- **Services** (`useServices`): the audio and MIDI ports. _Avoid:_ engine, context.
- **Remembered view** (`pt-views`): a screen's last view. _Avoid:_ saved state.
- **Screen bar** (`ScreenHeader`): a screen's title, Back and actions. _Avoid:_ navbar.
- **Shortcut**: a computer key a screen binds; `?` lists them. _Avoid:_ hotkey, keybinding.
- **Pop-up button** (`Dropdown`): shows its value and opens a list. _Avoid:_ select.
- **Floating buttons**: a screen's actions floating in reach. _Avoid:_ FAB (in the UI).
