export const learn = {
  title: 'Learn',
  module: {
    fundamentals: 'Fundamentals',
    accompaniment: 'Accompaniment',
    gospel: 'Gospel',
  },
  // Learn's tabs (ADR 0042): lessons by subject, and each course's own in its order.
  tabs: { label: 'Lessons', subjects: 'Subjects', courses: 'Courses' },
  // A module's line under its heading: what it teaches, or whose course it is.
  moduleAbout: {
    fundamentals: 'Notes, scales, chords and keys, from the first key on.',
    accompaniment: 'Bass and chords, progressions, passing chords and reharmonising.',
    gospel: 'Gospel’s progressions, passing chords and reharmonisation.',
    'called-to-play': 'Aleksandr Savchenko’s Called to Play for Him, level 1.',
    'called-to-play-2':
      'Its level 2: the same ways in 6/8 and 12/8, octaves, joining chords, balance.',
    'seven-types': 'N. V. Bobrova’s seven types of accompaniment, on hymns.',
    gorshkov: 'Vasily Gorshkov’s accompaniment course: 7th and 9th chords, the ii–V–I, texture.',
  },
  progress: '{{learned}} of {{total}} learned',
  // A course's last row: its patterns and pieces, on its part of Accompaniment.
  coursePractice: 'Patterns and pieces',
  continue: 'Continue',
  // Where a lesson is, and the lessons either side of it along its track.
  place: 'Lesson {{n}} of {{total}}',
  placeLabel: 'Where this lesson is',
  contents: 'In this lesson',
  // A lesson's example: the piece a pattern plays over, where it opens, and how to hear it.
  example: {
    over: 'Played over “{{piece}}”',
    openInPlayer: 'Open in the Player',
    inProgressions: 'Open in Progressions',
    tapHint: 'Tap a chord, a note or a bar to hear it and see it on the keys.',
  },
  // The ways along a lesson's track, at its end.
  track: {
    next: 'Next lesson',
    previous: 'Previous lesson',
    all: 'All lessons of {{module}}',
  },
  // A lesson's question, answered on its keys.
  question: {
    answer: 'Answer on the keys',
    check: 'Check',
    right: 'Correct',
    wrong: 'Not quite',
    show: 'Show the answer',
    shown: 'The answer is on the keys',
    again: 'Try again',
  },
} as const
