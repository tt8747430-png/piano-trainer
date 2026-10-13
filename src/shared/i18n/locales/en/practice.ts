export const practice = {
  inPlayer: 'Practise in the Player',
  walk: 'Walk the chords',
  chromatic: 'Chromatic walk',
  chromaticDetail: 'The chord a bar each, a semitone at a time from its root',
  title: 'Practice',
  // Practice's groups of pages (ADR 0044). The things come first, under no heading.
  groups: { tools: 'Tools', training: 'Training' },
  // Its pages, each by its name: the things, the tools, the training.
  pages: {
    chords: 'Chords',
    scales: 'Scales and keys',
    intervals: 'Intervals',
    progressions: 'Progressions',
    accompaniment: 'Accompaniment',
    chordFinder: 'Chord finder',
    passingChords: 'Passing chords',
    reharmonise: 'Reharmonise',
    freePlay: 'Free play',
    exercises: 'Exercises',
    quiz: 'Quiz',
  },
  // What a page says of itself in a line: a thing what is inside it, a tool what it works out. A page
  // of tabs or of groups says those, in their own words, so it has no line here.
  about: {
    chords: 'Triads to 13ths · Inversions · Tensions',
    intervals: 'On the keys, up and down',
    progressions: 'From the library or typed, in any key',
    chordFinder: 'Names the keys you play',
    passingChords: 'The ways from one chord to the next',
    reharmonise: 'The chords that hold a melody note',
    freePlay: 'A live score, marks and a metronome',
  },
  // The line of a part of Accompaniment with no pattern to show.
  accompaniment: {
    noneYours: 'Patterns you star, make or hide are kept here.',
    allHidden: 'Every pattern here is hidden. Find them under Yours.',
  },
  // Chords' row to the Chord finder, which opens on the chord's own keys.
  theseKeys: 'Every name these keys have',
  // A scale's page: its key's common progressions, each opening Progressions in this key.
  keyProgressions: 'Progressions in this key',
  // The Exercises page's groups (roadmap §10.5).
  exerciseGroups: {
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
    mode: 'Mode',
    play: 'Play',
    mark: 'Mark',
    clear: 'Clear',
    colour: { label: 'Colour', a: 'Right hand', b: 'Left hand', aLetter: 'R', bLetter: 'L' },
    finger: { label: 'Finger', none: 'None' },
    score: 'Live score',
    empty: 'Play, and the notes appear here.',
  },
} as const
