export const piece = {
  checkChords: 'Check these chords',
  // An editor's: the built-in song's original, edited for every learner (ADR 0116).
  editOriginal: 'Edit the original',
  // A chord chart's section says its bars.
  barOne: 'bar {{n}}',
  barsFromTo: 'bars {{first}}–{{last}}',
  // The song's page, Learn the song (ADR 0111): its sections each with its lessons done. What names
  // the piece is a song's or a study's, by its kind: Russian names it.
  learnSong: {
    progress: '{{done}} of {{total}}',
    progressSaid: 'Lessons done: {{done}} of {{total}}',
    sections: 'Sections',
    lessons_one: '{{count}} lesson',
    lessons_other: '{{count}} lessons',
    lessonsDone: '{{lessons}} · {{done}} done',
    noLessons: 'No chords to learn',
  },
  // A section's page: its chords in order, its changes, its pattern; each lesson looped in the Player.
  learnSection: {
    title: 'Learn the {{section}}',
    rounds: '{{n}} ×',
    noChords: 'No chord symbols',
    // Each group of lessons named by what it does, a word or two; how it does it behind its ⓘ
    // (ADR 0111).
    chords: 'Chords',
    chordsInfo_one: 'Hold each chord on the keys to learn it.',
    chordsInfo_other:
      'Hold each chord on the keys {{count}} times to learn it, letting go of every key between.',
    learnChord: 'Learn {{chord}}',
    held: '{{held}} of {{needed}}',
    inTime: 'In time',
    inTimeInfo:
      'The Player loops the chords at the song’s tempo with the click on. Play along in Wait mode to tick them off.',
    oneChange: 'One change at a time',
    oneChangeInfo:
      'The Player waits on each of the two chords until you play it, at your own pace.',
    change: '{{from}} → {{to}}',
    // Each pattern the section is played with, by its name, on the chord it is looped on.
    pattern_one: 'Pattern',
    pattern_other: 'Patterns',
    patternInfo:
      'The Player loops a bar of the pattern on one chord, its notes lit on the keys as they sound.',
    patternOn: 'On {{chord}}',
    done: 'Done',
  },
  tempo: 'Tempo',
  time: 'Time',
  progression: 'Progression',
  // The library's progressions a song uses, under its chords (ADR 0112).
  progressions: 'Progressions',
  more: 'More',
  practise: 'Practise',
  edit: 'Edit the score',
  writeChart: 'Write the chart',
  // A songbook entry whose chords are not written yet.
  noChart: {
    title: 'No chart yet',
    description: 'Write its chords bar by bar, and it plays in any key with any pattern.',
  },
  yourVersion: 'Your version',
  music: 'Music',
  reset: 'Reset to the original',
  resetting: {
    title: 'Reset {{title}}?',
    says: 'Your chords, staves and written-out hands are removed, and it goes back to the book’s version.',
    confirm: 'Reset',
    cancel: 'Keep mine',
  },
  delete: 'Delete',
  // An own song sent on as a link: its chart, staves and written hands inside it.
  share: 'Share',
  shareCopied: 'Link copied. Anyone who opens it can add the song to their own.',
  shareLinked: 'Link copied. Anyone who opens it sees the chords as you play them.',
  shareFailed: 'The link could not be made here.',
  shareTooLong: 'This song is too long to fit in a link.',
  deleting: {
    title: 'Delete {{title}}?',
    says: 'It is deleted for good, with its music and takes.',
    confirm: 'Delete for good',
    cancel: 'Keep it',
  },
  scaleOf: 'Scale: {{scale}}',
  // What is said of a song or study, behind its ⓘ.
  about: { song: 'About the song', study: 'About the study' },
  meter: 'Time signature',
  credit: {
    authors: 'Authors',
    'words-and-music': 'Words and music',
    words: 'Words',
    music: 'Music',
    'russian-text': 'Russian text',
    harmony: 'Harmony',
    accompaniment: 'Accompaniment',
    'published-by': 'Published by',
    unknown: 'Author unknown',
    said: {
      traditional: 'Traditional',
      newBritain: 'New Britain (American folk tune)',
    },
  },
  source: { number: 'No. {{n}}', page: 'p. {{n}}' },
  section: {
    intro: 'Intro',
    verse: 'Verse',
    verseNumbered: 'Verse {{n}}',
    chorus: 'Chorus',
    bridge: 'Bridge',
    lastChorus: 'Last chorus',
    ending: 'Ending',
    lastEnding: 'Last ending',
    practice: 'Practice',
    hymn: 'Hymn',
    part: 'Part',
    partLabelled: 'Part {{label}}',
  },
} as const
