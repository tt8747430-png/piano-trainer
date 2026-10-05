export const practice = {
  inPlayer: 'Practise in the Player',
  walk: 'Walk the chords',
  chromatic: 'Chromatic walk',
  title: 'Practice',
  // Practice's topics: what a learner works on.
  topics: {
    label: 'Topics',
    chords: 'Chords',
    scales: 'Scales and keys',
    ear: 'Ear and reading',
    progressions: 'Progressions',
    accompaniment: 'Accompaniment',
    technique: 'Technique',
  },
  // A topic's ways in: pages that show a thing on the keys, and trainers that ask.
  explore: 'Explore',
  quiz: 'Quiz',
  // The exercises a topic plays in the Player, by group (roadmap §10.5).
  groups: {
    scales: 'Scale exercises',
    arpeggios: 'Arpeggios',
    chords: 'Chords in a scale',
    barryHarris: 'Barry Harris',
    jonny: 'Piano With Jonny',
    progressions: 'Through the keys',
    technique: 'Finger technique',
  },
  // The count after a colon reads right for any number, in both languages.
  gaps: 'To check: {{count}}',
} as const
