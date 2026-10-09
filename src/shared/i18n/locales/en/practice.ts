export const practice = {
  inPlayer: 'Practise in the Player',
  walk: 'Walk the chords',
  chromatic: 'Chromatic walk',
  title: 'Practice',
  // Practice's seven places, each named for what is practised.
  subjects: {
    chords: 'Chords',
    scales: 'Scales and keys',
    progressions: 'Progressions',
    intervals: 'Intervals',
    accompaniment: 'Accompaniment',
    exercises: 'Exercises',
    quiz: 'Quiz',
    freePlay: 'Free play',
  },
  // What is inside each, in a line.
  inside: {
    chords: 'Build · Find · Tensions',
    scales: 'Scale · Chords · Key',
    progressions: 'In any key · Passing chords · Reharmonise',
    intervals: 'On the keys, up and down',
    accompaniment: 'Called to Play · Боброва · Styles',
    exercises: 'Technique · Barry Harris · Piano With Jonny',
    quiz: 'Chords · Scales and keys · By ear · Reading',
    freePlay: 'Live score · Mark',
  },
  // Chords' two pages.
  chords: { build: 'Build', find: 'Find' },
  // Accompaniment's pages after its method books', and the line of a page with no pattern to show.
  accompaniment: {
    styles: 'Styles',
    yours: 'Yours',
    noneYours: 'Patterns you star, make or hide are kept here.',
    allHidden: 'Every pattern here is hidden. They are kept on Yours.',
  },
  // Progressions' first tab; its other two are named by their own pages.
  progression: 'Progression',
  // A scale's page: its key's common progressions, each opening Progressions in this key.
  keyProgressions: 'Progressions in this key',
  // The Exercises page's groups (roadmap §10.5).
  groups: {
    technique: 'Finger technique',
    barryHarris: 'Barry Harris',
    jonny: 'Piano With Jonny',
  },
  // The Quiz page's groups of trainers.
  quizGroups: {
    chords: 'Chords',
    scales: 'Scales and keys',
    ear: 'By ear',
    reading: 'Reading',
  },
  // The count after a colon reads right for any number, in both languages.
  gaps: 'To check: {{count}}',
  // Free play: the piano played freely, written and named.
  freePlay: {
    title: 'Free play',
    mode: 'Mode',
    play: 'Play',
    mark: 'Mark',
    clear: 'Clear',
    colour: { label: 'Colour', a: 'Right hand', b: 'Left hand', aLetter: 'R', bLetter: 'L' },
    finger: { label: 'Finger', none: 'None' },
    score: 'Live score',
    empty: 'Play, and it is written here.',
  },
} as const
