export const player = {
  setup: 'Setup',
  // The bar's More (ADR 0099): a piece's information as a sheet, the music as a MIDI file; an own
  // song's Share is the song page's.
  more: 'More',
  info: { song: 'Song information', study: 'Study information' },
  exportMidi: 'Export to MIDI',
  /** A piece's score in its two modes, the Player and the score editor (ADR 0090). */
  mode: { label: 'Practise or edit', practise: 'Practise', edit: 'Edit' },
  // How the score is shown (ADR 0064), from the bar: remembered for every piece.
  // The View's switches only practice has (ADR 0094); the rest of the View is music's.
  view: {
    positionsDetail: 'Beside each chord’s name, the position the right hand plays it in',
  },
  // The Player's views of the music (ADR 0099), the View's tiles; each names its own part of the
  // screen.
  views: {
    label: 'Show the music as',
    sheet: 'Sheet music',
    lyrics: 'Chords over lyrics',
    diagrams: 'Diagrams',
    grid: 'Grid',
    // Each view in a line, the ⓘ beside Show the music as (ADR 0102).
    about: {
      sheet: 'the score, as printed',
      lyrics: 'each line’s chords over its words',
      diagrams: 'the chord sounding on the keys, the next beside it',
      grid: 'every bar’s chords, beat by beat',
    },
    // The tools row's View, named by the view shown (ADR 0102).
    shown: 'View: {{view}}',
    // Chordify's "Show this when opening a song": a song's Player opens with the View open.
    ask: 'Ask each time a song opens',
    // What the View holds for every view of the music, after the view shown's own.
    every: 'Every view',
    // Diagrams' own (ADR 0102, Chordify's "Diagram view mode").
    mode: {
      label: 'Mode',
      animated: 'Animated',
      summary: 'Summary',
      about:
        'Animated: the chord sounding and the next, moving with the music. Summary: the song’s chords all at once, the one sounding marked.',
    },
  },
  // The row of tools under the Player's bar (ADR 0102), as a screen reader names it.
  tools: 'Tools',
  // The tools row's Transpose (ADR 0104): the key the music is in, moved a semitone at a time.
  transpose: {
    name: 'Transpose',
    title: 'Transpose',
    of: 'Transpose: {{key}}',
    moved: 'Transpose: {{key}}, {{by}}',
    down: 'Down a semitone',
    up: 'Up a semitone',
    own: { song: 'The song’s key', study: 'The study’s key' },
    reset: 'Reset',
  },
  // The tools row's Simplify (ADR 0104, Chordify's): every chord its plain triad.
  simplify: {
    label: 'Simplify',
    about: 'Every chord as its plain major or minor triad',
    none: 'No chord to simplify',
    chordSize: 'Simplify plays every chord as its triad.',
  },
  /** The Diagrams view's chord to come, where none sounds yet: a pickup, a bar of no chord. */
  nextChord: 'Next: {{symbol}}',
  /** A line of Chords over lyrics, by its bars: a tap takes the Player there. */
  line: { one: 'Bar {{n}}', many: 'Bars {{first}}–{{last}}' },
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
  fromChart: 'From the chart',
  fromChartDescription: 'Each section and chord as the song marks it.',
  rh: 'Right hand',
  lh: 'Left hand',
  ownFigure: 'The pattern’s own',
  /** A changed hand's way back. */
  ownFigureOf: '{{hand}}: back to the pattern’s own',
  changed: { lh: 'Left hand changed', rh: 'Right hand changed', both: 'Both hands changed' },
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
  ownKeyOnly: 'Only in {{key}}',
  /** Why the recording's tile is closed, beside How it plays' heading. */
  recordingOnlyIn: 'The recording plays only in {{key}}, its own key.',
  /** Why a pattern or figure, or a view of the music (ADR 0102), is closed to the music. */
  needs: {
    tune: 'Needs a tune',
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
    tune: 'With the tune',
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
  toggles: {
    namedNotes: 'Note names',
    positions: 'Chord positions',
    tune: 'Tune',
    metronome: 'Metronome',
    countIn: 'Count-in',
    swing: 'Swing',
    recording: 'Recording',
  },
  pace: {
    of: 'Tempo: {{value}}',
    ownPace: 'Waits for your notes',
    wait: 'Wait mode',
    playback: 'Playback speed',
    playAlong: 'Listen and play along',
    speed: '{{percent}} speed',
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
  exercise: {
    title: '{{name}}: {{of}}',
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
