export const path = {
  title: 'Path',
  continue: 'Continue',
  allLearned: 'Everything on the path is learned.',
  toSongs: 'Open Songs',
  // The count after a colon reads right for any number, in both languages.
  toCheck: 'Chords to check: {{count}}',
  known: '{{known}} of {{total}} known',
  progress: '{{learned}} of {{total}}',
  hideLearned: 'Hide learned',
  recent: 'Recently practised',
  // The days practised: opening a piece in the Player, or answering a quiz round.
  days: {
    title: 'Practice',
    inARow: 'Days in a row: {{count}}',
    start: 'Practise today to start a run of days.',
    keep: 'Practise today to keep it going.',
    done: 'Practised today.',
    week: 'The last seven days',
    practised: '{{day}}: practised',
    missed: '{{day}}: not practised',
  },
  kind: {
    chords: 'Chords',
    scale: 'Scale',
    study: 'Study',
    song: 'Song',
    progression: 'Progression',
  },
} as const
