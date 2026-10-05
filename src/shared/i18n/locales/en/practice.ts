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
  },
  // What is inside each, in a line.
  inside: {
    chords: 'Build · Find · Tensions',
    scales: 'Scale · Chords · Key',
    progressions: 'In any key · Passing chords · Reharmonise',
    intervals: 'On the keys, up and down',
    accompaniment: 'Patterns · Studies',
    exercises: 'Technique · Barry Harris · Piano With Jonny',
    quiz: 'Chords · Scales and keys · By ear · Reading',
  },
  // Accompaniment's two pages.
  accompaniment: { patterns: 'Patterns', studies: 'Studies' },
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
} as const
