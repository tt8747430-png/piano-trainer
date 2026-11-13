export const player = {
  // The bar's button that shows or hides the piano keys under the music (R29, Flat's).
  setup: 'Setup',
  // The bar's More (ADR 0108, 0107): a piece's information and its sections as sheets, Share as the
  // song page's, Print, the music as a MIDI file (with a recording, at a fixed tempo or time aligned
  // to it).
  more: 'More',
  sections: {
    title: 'Sections',
  },
  print: 'Print',
  // The Player's views of the music (ADR 0108), Pick your view's (R29); each names its own part of the
  // screen.
  views: {
    backToPlayhead: 'Back to the music',
    pick: 'Pick your view',
    done: 'Done',
    short: { sheet: 'Sheet', grid: 'Grid', diagrams: 'Diagrams', lyrics: 'Lyrics' },
    label: 'Show the music as',
    sheet: 'Sheet music',
    lyrics: 'Chords over lyrics',
    diagrams: 'Diagrams',
    grid: 'Grid',
    // The tools row's View, named by the view shown (ADR 0108).
    shown: 'View: {{view}}',
    // Diagrams' own (ADR 0108, Chordify's "Diagram view mode").
    // Chords over lyrics' own (ADR 0108, Chordify's view settings).
    pinned: {
      label: 'Diagrams pinned',
      about: 'The song’s chords as diagrams in a row under the beats, the one sounding marked',
    },
    textSize: { label: 'Text size', smaller: 'Smaller text', larger: 'Larger text' },
    // Why the words' switch is greyed (ADR 0108).
    noWords: 'The music has no words',
    mode: {
      label: 'Mode',
      animated: 'Animated',
      summary: 'Summary',
      about:
        'Animated: the chord sounding and the next, moving with the music. Summary: the song’s chords all at once, the one sounding marked.',
    },
  },
  // The row of tools under the Player's bar (ADR 0108), as a screen reader names it.
  restart: 'Restart',
  foot: { label: 'Practice tools' },
  version: {
    change: 'Change version',
    title: 'Version',
    label: 'Version',
    of: 'Version: {{level}}',
    arrangement: 'Arrangement',
    group: { own: 'Your version', solo: 'Piano solo', voice: 'Piano and voice' },
    level: { original: 'Original', simple: 'Simplified', easy: 'Easy' },
    difficulty: 'Difficulty {{n}} of 3',
    about: {
      original: 'The score as written',
      simple: 'Every chord a plain triad, the tune kept',
      easy: 'The tune, one note of each chord',
    },
    alreadySimple: 'Its chords are already simple',
  },
  tuner: {
    title: 'Tuner',
    note: 'Note heard',
    cents: 'Cents off',
    listening: 'Play or sing a note',
    reading: '{{hz}} Hz · {{cents}} cents',
    denied: 'The microphone is not available. Allow it in the browser to use the tuner.',
    retry: 'Try again',
    a4: 'A4',
    hz: '{{hz}} Hz',
    reference: 'A4 = {{hz}} Hz',
    lower: 'Lower A4',
    higher: 'Higher A4',
  },
  annotate: {
    label: 'Annotate',
    bar: 'Annotations',
    staff: 'Staff',
    upper: 'Upper',
    lower: 'Lower',
    add: 'Add',
    clear: 'Clear the marks here',
    done: 'Done',
    kind: {
      text: 'Text',
      fingering: 'Fingering',
      dynamic: 'Dynamic',
      breath: 'Breath mark',
      pause: 'Pause',
      circle: 'Circle',
    },
  },
  progress: 'Progress',
  coach: {
    listen: 'Press Play to listen.',
    wait: 'Press Play, then play each highlighted note.',
    follow: 'Play the highlighted notes; the accompaniment follows your tempo.',
    close: 'Dismiss tip',
  },
  // The modes at the learner's own pace, in the transport's Pace (R36, flowkey's).
  modes: {
    wait: { name: 'Wait mode', line: 'The music waits for the right notes.' },
    follow: { name: 'Interpret', line: 'The music follows your tempo.' },
  },
  tools: 'Tools',
  // The tools row's Transpose (ADR 0105): the key the music is in, moved a semitone at a time.
  transpose: {
    name: 'Transpose',
    title: 'Transpose',
    of: 'Transpose: {{key}}',
    moved: 'Transpose: {{key}}, {{by}}',
    down: 'Down a semitone',
    up: 'Up a semitone',
    own: { song: 'The song’s key', study: 'The study’s key' },
    // How far the music moves, signed: «+2 semitones».
    semitones_one: '{{by}} semitone',
    semitones_other: '{{by}} semitones',
    reset: 'Reset',
    // Dorico's and MuseScore's names for them, the same in the Player and the editor (R29 T).
    signature: 'Transpose key signature',
    signatureInfo:
      'The key signature moves with the notes. Off, it stays as written and the moved notes take accidentals.',
    chordSymbols: 'Transpose chord symbols',
    chordSymbolsInfo:
      'The chord symbols move with the notes. Off, they stay as written, as with a capo; the chords still sound moved.',
  },
  // The tools row's Simplify (ADR 0105, Chordify's): every chord its plain triad.
  simplify: {
    chordSize: 'The Simplified version plays every chord as its triad.',
  },
  /** The Diagrams view's chord to come, where none sounds yet: a pickup, a bar of no chord. */
  nextChord: 'Next: {{symbol}}',
  /** A line of Chords over lyrics, by its bars: a tap takes the Player there. */
  line: {
    one: 'Bar {{n}}',
    many: 'Bars {{first}}–{{last}}',
    // A line of chords alone played again straight after itself, shown once (ADR 0108).
    times: '×{{n}}',
    played_one: 'Played {{count}} time',
    played_other: 'Played {{count}} times',
  },
  key: 'Key',
  root: 'Root',
  walk: { title: 'Walk the chords in {{scale}}' },
  progression: { title: '{{numerals}} in {{key}}', walking: '{{numerals}} from {{key}}, {{walk}}' },
  /** A piece walked through the keys, from the learner's key. */
  /** A walk through the keys, as a title says it. */
  walking: {
    'semitones-up': 'up by semitones',
    'semitones-down': 'down by semitones',
    'semitones-up-down': 'up and down by semitones',
    'tones-up': 'up by whole tones',
    'tones-down': 'down by whole tones',
    fifths: 'down the circle of fifths',
    'fifths-up': 'up the circle of fifths',
    'minor-thirds': 'up by minor thirds',
    'major-thirds': 'up by major thirds',
  },
  chromatic: { title: 'Chromatically: {{chords}}', fifths: 'Circle of fifths: {{chords}}' },
  qualities: 'Chord types',
  direction: 'Direction',
  directions: { up: 'Up', down: 'Down', both: 'Up and down', fifths: 'Circle of fifths' },
  tempo: 'Tempo',
  hands: 'Hands',
  handsOf: 'Hands: {{hands}}',
  // The foot's Hands (R36, flowkey's hands menu): the hands the learner plays, in every mode.
  handsChoice: 'Which hands do you play?',
  pattern: 'Pattern',
  // The Setup's section of what a chord chart's hands play (A35): the pattern, the position, swing.
  accompaniment: 'Accompaniment from the chords',
  fromChart: 'From the chart',
  fromChartDescription: 'Each section and chord as the song marks it.',
  rh: 'Right hand',
  lh: 'Left hand',
  ownFigure: 'The pattern’s own',
  /** A changed hand's way back. */
  ownFigureOf: '{{hand}}: back to the pattern’s own',
  changed: { lh: 'Left hand changed', rh: 'Right hand changed', both: 'Both hands changed' },
  // What a pattern is, and what choosing a hand's part does (ADR 0115).
  patternAbout:
    'A pattern is what your two hands play together, each its own part. Choose a hand to change its part alone: the music changes at once, and the pattern becomes your own mix. Back to the pattern brings its own parts back.',
  yourMix: '{{pattern}}, your mix',
  yourPart: 'Your choice',
  backToPattern: 'Back to the pattern',
  // The Setup's first section (A35, Flat's Audio playback): each track, played and shown or not.
  staves: {
    title: 'Staves',
    about:
      'Which staves play, which the score shows and how loud each plays, each by its name, the song’s recording as a track of its own.',
    all: 'All playing',
    none: 'None playing',
    play: 'Play',
    show: 'Show',
    playOf: 'Play {{track}}',
    volumeOf: '{{track}} volume',
    // A recording moved against the music where a device hears it off the notes (R34).
    sync: 'Sync',
    inTime: 'In time',
    earlierBy: '{{ms}} ms earlier',
    laterBy: '{{ms}} ms later',
    earlier: 'Earlier',
    later: 'Later',
    showOf: 'Show {{track}}',
  },
  playing: 'How it plays',
  // The Player's settings page (B7): how it always plays, every song's.
  clef: {
    label: 'Clef',
    info: 'Read a song written on one staff in the clef you know best. The notes stay the same; only where they sit on the staff changes.',
    written: 'Original',
    treble: 'Treble',
    bass: 'Bass',
    examples: {
      written: 'The clef the song is written in',
      treble: '𝄞 Middle C on a line below the staff',
      bass: '𝄢 Middle C on a line above the staff',
    },
  },
  summary: {
    list: 'Chords to show',
    inSong: 'In this song',
    inOrder: 'In order',
    times_one: '×{{count}}',
    times_other: '×{{count}}',
    places: 'Where {{chord}} is',
    bar: 'Bar {{bar}}',
  },
  settingsPage: {
    open: 'Player settings',
    whilePlaying: 'While you play',
    songGroup: 'This song',
    shareGroup: 'Share',
    metronome: 'Metronome sound and beats',
    onScreenPiano: 'On-screen piano',
    speed: 'Playback speed',
    speedStepInfo:
      'The tempo increase after each clean pass while speed training works up to the song’s tempo.',
    speedStepDetail: 'Tempo increase after each clean pass.',
    accompaniment: 'Accompaniment',
    playback: 'Playback',
    display: 'Score view',
    hands: 'Hands',
    countdown: {
      label: 'Count-in',
      detail: 'A bar counted before the music begins.',
      info: 'Audible: one bar of clicks, its beats counted on screen. Silent: counted on screen only. Off: the music begins at once.',
      none: 'Off',
      audible: 'Audible',
      visual: 'Silent',
    },
    keys: 'Show the keyboard',
    otherHand: {
      label: 'The other hand',
      detail: 'How the hand you don’t play shows in the music.',
      info: 'Show: its staff as written. Dim: its notes greyed. Hide: only your hand’s staff remains.',
      show: 'Show',
      dim: 'Dim',
      hide: 'Hide',
    },
    playOther: 'Hear the other hand',
    playOtherInfo: 'The app plays the hand you don’t play, in every mode.',
  },
  /** The hands at the keys (R36): a piano seen from the seat, two hands playing the music on it. */
  handsAtKeys: {
    label: 'Hands at the keys',
    description:
      'A piano seen from the seat. Two hands play the music, each note pressed by its finger.',
    loading: 'Getting the hands ready…',
    unsupported: 'This device can’t draw the hands.',
    failed: 'The hands didn’t load.',
    showKeys: 'Show the keys',
    retry: 'Try again',
  },
  /** The picker's way to the Patterns page, where they are explained, starred, hidden and made. */
  allPatterns: 'All patterns',
  ownPattern: 'Make your own pattern',
  /** Under a pattern that plays its own shapes, the hand's position is faded. */
  inversion: { own: 'This pattern plays its own shapes.' },
  /** A progression through the keys, back home at the end. */
  keyWalk: {
    label: 'In all 12 keys',
    one: 'One key',
    'semitones-up': 'Chromatically, rising',
    'semitones-down': 'Chromatically, falling',
    'semitones-up-down': 'Chromatically, up and back',
    'tones-up': 'In whole steps, rising',
    'tones-down': 'In whole steps, falling',
    fifths: 'Circle of fifths, falling (C F B♭ …)',
    'fifths-up': 'Circle of fifths, rising (C G D …)',
    'minor-thirds': 'In minor thirds',
    'major-thirds': 'In major thirds',
  },
  /** Why a pattern or figure, or a view of the music (ADR 0108), is closed to the music. */
  needs: {
    tune: 'Needs a melody staff',
    key: 'Needs a key',
    simpleTime: 'Needs simple time',
    words: 'Needs words',
    chords: 'Needs chord symbols',
  },
  /** The right hand's figures in the Setup, by what they do. */
  rhGroup: {
    chords: 'Chords',
    broken: 'Broken chords',
    moving: 'Moving voices',
    tune: 'With the melody',
    styles: 'Styles',
  },
  /** The left hand's figures in the Setup, by what they do. */
  lhGroup: {
    held: 'Held',
    octaves: 'Octaves',
    arpeggios: 'Arpeggios',
    lines: 'Bass lines',
    styles: 'Styles',
  },
  /** The transport's Sound (ADR 0105): the count-in, the click, and each part's volume. */
  sound: {
    title: 'Sound',
    countIn: 'Count-in',
    countInInfo: 'A bar of clicks before the music starts, its beats counted down on the screen.',
    click: 'Metronome',
    clickInfo: 'A click on every beat while the music plays.',
    volume: 'Volume',
    volumeInfo:
      'How loud each part plays. Only the chords turns the recording right down and both hands up, so you hear the chords alone.',
    staves: 'Staves',
    recording: 'Recording',
    onlyChords: 'Only the chords',
  },
  /** The count-in's beat as a screen reader hears it, its number large on the screen. */
  counting: 'Count-in: {{count}}',
  // How much the 8ths swing (ADR 0115): four feels, each drawn as its beat.
  swing: {
    label: 'Swing',
    about:
      'Swing plays each pair of 8th notes long-short instead of even, the beats where they were. Straight: even. Light: a little late, 3 to 2. Medium: as triplets, 2 to 1, as jazz and blues swing. Hard: a dotted 8th and a 16th, 3 to 1.',
    straight: 'Straight',
    light: 'Light',
    medium: 'Medium',
    hard: 'Hard',
  },
  // The transport's Pace (R36, flowkey's Tempo menu): the modes at the learner's own pace, then the
  // speeds to listen and play along at.
  pace: {
    title: 'Pace',
    of: 'Pace: {{value}}',
    // Listening, the button shows the tempo as a metronome mark: its name says it too (WCAG 2.5.3).
    ofTempo: 'Pace: {{value}}, ♩ = {{tempo}}',
    ownPace: 'At your own pace',
    playAlong: 'Listen and play along',
    needsPiano: 'Connect a piano or show the Keyboard.',
    // The hands at the keys stand in for them, and hands on screen cannot be played.
    needsKeysNotHands: 'Connect a piano, or show the Keyboard instead of the hands.',
    speed: '{{percent}} speed',
    // The popover's slider: a share of the piece's tempo, 50% to 200% in 5% steps (ADR 0105).
    speedLabel: 'Speed',
    own: 'Original tempo',
    speedTraining: 'Speed training',
    speedTrainingDetail: '{{percent}} faster each pass, up to 100%',
  },
  // The Player's shortcuts, as the sheet lists them.
  shortcuts: {
    group: 'Player',
    playStop: 'Play or stop',
    back: 'A step back',
    next: 'A step forward',
    faster: 'Listen 5% faster',
    slower: 'Listen 5% slower',
    loop: 'Loop the bar, or remove the loop',
    start: 'Back to the first bar',
    reachBack: 'Loop a bar further back, or one less',
    reachNext: 'Loop a bar further on, or one less',
    reachStart: 'Loop to the first bar',
    reachEnd: 'Loop to the last bar',
    close: 'Remove the loop, or close',
  },
  loop: 'Loop',
  back: 'Back',
  next: 'Next',
  play: 'Play',
  stop: 'Stop',
  /** The transport (Loop, Restart, ‹ Play ›, Pace, the metronome), as a screen reader names it. */
  transport: 'Playback',
  playThese: 'Play {{notes}}',
  right: 'Correct',
  notThat: 'Not {{note}}',
  finishedClean: 'Finished without a slip',
  finishedSlips: 'Finished · slips: {{count}}',
  loopBar: 'Loop bar {{first}}',
  loopBars: 'Loop bars {{first}}–{{last}}',
  again: 'Again',
  /** An exercise's Setup: the choices its rule takes. */
  // A scale run's practice, as the reference app's Practice Scale sheet.
  scalePractice: {
    hands: 'Hands',
    startsOn: { rh: 'Right hand starts on', lh: 'Left hand starts on' },
    out: {
      above: 'Its run would go past the top of the piano',
      below: 'Its run would go below the bottom of the piano',
    },
    tempo: 'Tempo',
    metronome: 'Metronome',
    rest: {
      label: 'Ticks between loops',
      info: 'Beats of clicks before each repeat, to reset the hand before the scale comes round again',
      none: 'None',
    },
  },
  // An exercise's tempos, rung by rung.
  tempoLadder: {
    label: 'Tempo ladder',
    info: 'Climb one rung once four passes in a row are clean and even. After a slip, step back a rung. The exercise opens at the tempo you last played it at.',
  },
  exercise: {
    nextKey: 'Next key',
    title: '{{name}}: {{of}}',
    // Hanon's The Virtuoso Pianist, Part I: which exercise.
    rhythm: { label: 'Rhythm', even: 'Even', dotted: 'Dotted', reverse: 'Reverse dotted' },
    hanon: { label: 'Exercise', number: 'No. {{number}}', name: 'Hanon No. {{number}}' },
    scale: 'Scale',
    chord: 'Chord',
    startOn: 'Start on',
    fingering: 'Fingering',
    fingerings: { thumb: 'From the thumb', scale: 'As the scale' },
    octaves: 'Octaves',
    figure: 'Figure',
    voicing: 'Voicing',
    voicings: { close: 'Close', drop2: 'Drop 2' },
    from: 'From',
    chordTones: { root: 'Root', third: '3rd', fifth: '5th', seventh: '7th' },
    tonality: 'Major or minor',
    tonalities: { major: 'Major', minor: 'Minor' },
  },
} as const
