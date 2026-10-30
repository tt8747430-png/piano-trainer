export const player = {
  setup: 'Setup',
  // The bar's More (ADR 0108, 0107): a piece's information and its sections as sheets, Share as the
  // song page's, Print, the music as a MIDI file (with a recording, at a fixed tempo or time aligned
  // to it).
  more: 'More',
  info: { song: 'Song information', study: 'Study information' },
  // Song information's tuning (ADR 0107): the A its recording is tuned to, said where it is not 440.
  tuning: {
    label: 'Tuning',
    value: 'A {{hz}} Hz',
    about:
      'The recording is tuned to A {{hz}} Hz, not the standard 440 Hz. Tune an instrument to it to play along in tune.',
  },
  sections: {
    title: 'Sections',
    one: { song: 'This song has one section.', study: 'This study has one section.' },
  },
  print: 'Print',
  /** A piece's score in its two modes, the Player and the score editor (ADR 0115). */
  mode: {
    label: 'Practise or edit',
    practise: 'Practise',
    edit: 'Edit',
    original: 'Edit the original',
  },
  // The Player's views of the music (ADR 0108), the View's tiles; each names its own part of the
  // screen.
  views: {
    label: 'Show the music as',
    sheet: 'Sheet music',
    lyrics: 'Chords over lyrics',
    diagrams: 'Diagrams',
    grid: 'Grid',
    // Each view in a line, the ⓘ beside Show the music as (ADR 0108).
    about: {
      sheet: 'the score, as printed',
      lyrics: 'each line’s chords over its words',
      diagrams: 'the chord sounding on the keys, the next beside it',
      grid: 'every bar’s chords, beat by beat',
    },
    // The tools row's View, named by the view shown (ADR 0108).
    shown: 'View: {{view}}',
    // Chordify's "Show this when opening a song": a song's Player opens with the View open.
    ask: 'Ask each time a song opens',
    // What the View holds for every view of the music, after the view shown's own.
    every: 'Every view',
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
  },
  // The tools row's Simplify (ADR 0105, Chordify's): every chord its plain triad.
  simplify: {
    label: 'Simplify',
    about: 'Every chord as its plain major or minor triad',
    none: 'No chord to simplify',
    chordSize: 'Simplify plays every chord as its triad.',
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
  chromatic: { title: 'Chromatic walk: {{chords}}' },
  qualities: 'Chord types',
  direction: 'Direction',
  directions: { up: 'Up', down: 'Down', both: 'Up and down' },
  tempo: 'Tempo',
  hands: 'Hands',
  handsOf: 'Hands: {{hands}}',
  pattern: 'Pattern',
  // The Setup's section of what the hands play: the pattern and the position (ADR 0115).
  accompaniment: 'Accompaniment',
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
  // What plays the song's tune along with your hands (ADR 0115).
  melody: {
    label: 'Melody',
    about:
      'What plays the song’s tune along with your two hands. {{staff}}: the song’s top staff, as written over the piano. Recording: the song as recorded, in its own key only. None: your hands alone. A right hand that plays the tune plays it whatever you choose here.',
    none: 'None',
    staff: 'Melody staff',
    recording: 'Recording',
    why: {
      noStaff: 'This song has no staff over the piano',
      noRecording: 'This song has no recording',
      ownKey: 'The recording plays only in {{key}}, its own key',
      leadSheet: 'A lead sheet always plays its melody',
    },
  },
  playing: 'How it plays',
  /** The picker's way to the Patterns page, where they are explained, starred, hidden and made. */
  allPatterns: 'All patterns',
  ownPattern: 'Make your own pattern',
  ownPatternDetail: 'A left hand and a right hand of your choice',
  /** Under a pattern that plays its own shapes, the hand's position is faded. */
  inversion: { own: 'This pattern plays its own shapes.' },
  /** A progression through the keys, back home at the end. */
  keyWalk: {
    label: 'Through the keys',
    one: 'One key',
    'semitones-up': 'Up by semitones',
    'semitones-down': 'Down by semitones',
    'semitones-up-down': 'Up and down by semitones',
    'tones-up': 'Up by whole tones',
    'tones-down': 'Down by whole tones',
    fifths: 'Down the circle of fifths: C F B♭',
    'fifths-up': 'Up the circle of fifths: C G D',
    'minor-thirds': 'Up by minor thirds',
    'major-thirds': 'Up by major thirds',
  },
  /** Why the recording's tile is closed, beside How it plays' heading. */
  recordingOnlyIn: 'The recording plays only in {{key}}, its own key.',
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
    countIn: 'Count in',
    countInInfo: 'A bar of clicks before the music starts, its beats counted down on the screen.',
    click: 'Click',
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
  pace: {
    of: 'Tempo: {{value}}',
    ownPace: 'Waits for your notes',
    wait: 'Wait mode',
    playback: 'Playback speed',
    playAlong: 'Listen and play along',
    speed: '{{percent}} speed',
    // The popover's slider: a share of the piece's tempo, 50% to 200% in 5% steps (ADR 0105).
    speedLabel: 'Speed',
    own: 'Original tempo',
    waitShort: 'Wait',
    speedTraining: 'Speed training',
    speedTrainingDetail: '5% faster each pass, up to 100%',
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
  /** The floating bar of ‹ Play › with the tempo and the hands, as a screen reader names it. */
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
      above: 'Its run would go past the top of the keyboard',
      below: 'Its run would go below the bottom of the keyboard',
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
    title: '{{name}}: {{of}}',
    // Hanon's The Virtuoso Pianist, Part I: which exercise.
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
