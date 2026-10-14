export const learn = {
  title: 'Learn',
  module: {
    fundamentals: 'Fundamentals',
    accompaniment: 'Accompaniment',
    gospel: 'Gospel',
  },
  // Learn's two views (ADR 0049): the Path's levels as a journey, or every module as a course.
  views: { label: 'Show', journey: 'Journey', courses: 'Courses' },
  // The Courses view's shelves: what is taught by subject, then each teacher's course.
  shelves: { subjects: 'Subjects', courses: 'Courses' },
  // A course's page: its one way in, and its lessons.
  course: {
    start: 'Start',
    continue: 'Continue',
    lessons: 'Lessons',
    count: '{{count}} lessons',
  },
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
  // Where a lesson is, and the lessons either side of it along its track.
  place: 'Lesson {{n}} of {{total}}',
  placeLabel: 'Where this lesson is',
  contents: 'In this lesson',
  // A lesson's example: the piece a pattern plays over, where it opens, and how to hear it.
  example: {
    over: 'Played over “{{piece}}”',
    openInPlayer: 'Open in the Player',
    inProgressions: 'Open in Progressions',
  },
  // The ways along a lesson's track, at its end.
  track: {
    next: 'Next lesson',
    all: 'All lessons of {{module}}',
  },
  // A lesson's question, answered on its keys.
  question: {
    answer: 'Answer on the keys',
    chosen: '{{chosen}} of {{total}} notes',
    right: 'Correct',
    wrong: 'Not quite',
    show: 'Show the answer',
    shown: 'The answer is on the keys',
    again: 'Try again',
  },
} as const
