export const learn = {
  title: 'Learn',
  // The header's toggle (ADR 0053): the Lessons' journeys, or the Courses.
  views: {
    label: 'What Learn shows',
    lessons: 'Lessons',
    courses: 'Courses',
  },
  // The Lessons: four journeys, beginner to professional, each in chapters.
  journey: {
    label: 'Journeys',
    chapter: 'Chapter {{n}}: {{title}}',
    count: '{{learned}}/{{total}}',
  },
  // The Courses, shelf by shelf.
  shelves: {
    beginner: 'Beginner courses',
    intermediate: 'Intermediate courses',
    technique: 'Technique and exercises',
    chords: 'Chords and improvisation',
    'method-books': 'Method books',
  },
  progress: '{{learned}} of {{total}} learned',
  lessonNumber: 'Lesson {{n}}',
  current: 'You are here',
  // Continue: the next lesson of the journey or the course in progress, in one tap.
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
  // A course's page: its facts, its one way in, its lessons and its guided songs.
  course: {
    start: 'Start course',
    continue: 'Continue',
    review: 'Review',
    lessons: 'Lessons',
    songs: 'Guided songs',
    weekCount_one: '{{count}} week',
    weekCount_other: '{{count}} weeks',
    lessonCount_one: '{{count}} lesson',
    lessonCount_other: '{{count}} lessons',
    songCount_one: '{{count}} song',
    songCount_other: '{{count}} songs',
    done: 'Course complete',
    facts: 'About this course',
  },
  // Where a lesson is: a journey's chapter, or a course.
  place: 'Lesson {{n}} of {{total}}',
  placeLabel: 'Where this lesson is',
  contents: 'In this lesson',
  contentsAt: 'In this lesson: section {{at}} of {{of}}',
  // A lesson's floating actions: its sections one by one, and its options.
  previousSection: 'Previous section',
  nextSection: 'Next section',
  lessonBar: 'Lesson',
  fingers: 'Fingers on the scales',
  // A lesson's example: the piece a pattern plays over, where it opens, and how to hear it.
  example: {
    over: 'Played over “{{piece}}”',
    openInPlayer: 'Open in the Player',
    inProgressions: 'Open in Progressions',
  },
  // The way on, at a lesson's end: the next lesson, or back to the journey or the course.
  track: {
    label: 'Ways out of this lesson',
    previous: 'Previous lesson',
    next: 'Next lesson',
    toCourseLessons: 'The course',
    toJourney: 'Back to the journey',
    toCourse: 'On to the guided songs',
    courseDone: 'Back to the course',
  },
  // A lesson's question, answered on its keys.
  question: {
    answer: 'Answer',
    onKeys: 'Choose on the keys',
    chosen: '{{chosen}} of {{total}} notes',
    right: 'Correct',
    wrong: 'Not quite',
    show: 'Show the answer',
    shown: 'The answer is on the keys',
    again: 'Again',
  },
} as const
