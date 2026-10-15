export const learn = {
  title: 'Learn',
  // The curriculum (ADR 0051): what each stage is for, in a line under its name.
  stageGoal: {
    beginner: 'Find your way on the keys, read music, and play your first chords.',
    intermediate: 'Accompany a song from its chord chart, in any style it asks for.',
    advanced: 'Colour and movement: progressions, 9th chords, gospel and the modes.',
    professional: 'Jazz harmony, and melodies of your own over the changes.',
  },
  curriculum: 'The curriculum',
  coursesDone: '{{done}} of {{total}} courses',
  courseNumber: 'Course {{n}}',
  progress: '{{learned}} of {{total}} learned',
  current: 'You are here',
  // Continue: the next step of the curriculum, in one tap.
  continue: 'Continue',
  allLearned: 'Everything is learned.',
  toSongs: 'Open Songs',
  // The count after a colon reads right for any number, in both languages.
  toCheck: 'Chords to check: {{count}}',
  known: '{{known}} of {{total}} known',
  recent: 'Recently practised',
  // The days practised: opening a piece in the Player, or answering a quiz round.
  days: {
    title: 'Practice',
    inARow: 'Days in a row: {{count}}',
    keep: 'Practise today to keep it going.',
    done: 'Practised today.',
    week: 'The last seven days',
    practised: '{{day}}: practised',
    missed: '{{day}}: not practised',
  },
  kind: {
    lesson: 'Lesson',
    chords: 'Chords',
    scale: 'Scale',
    study: 'Study',
    song: 'Song',
  },
  // A course's page: its one way in, its lessons, and what to practise once they are read.
  course: {
    start: 'Start',
    continue: 'Continue',
    review: 'Review',
    lessons: 'Lessons',
    practise: 'Practise',
    practiseAbout: 'Songs, studies, chords and scales that use what the lessons taught.',
    next: 'Next course',
    done: 'Course complete',
    count: '{{count}} lessons',
  },
  // Where a lesson is.
  place: 'Lesson {{n}} of {{total}}',
  placeLabel: 'Where this lesson is',
  contents: 'In this lesson',
  // A lesson's example: the piece a pattern plays over, where it opens, and how to hear it.
  example: {
    over: 'Played over “{{piece}}”',
    openInPlayer: 'Open in the Player',
    inProgressions: 'Open in Progressions',
  },
  // The way on, at a lesson's end: the next lesson of its course, or its course's practice.
  track: {
    next: 'Next lesson',
    practise: 'Practise what this course taught',
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
