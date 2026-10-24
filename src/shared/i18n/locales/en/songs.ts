export const songs = {
  title: 'Songs',
  search: 'Search songs',
  collection: 'Collection',
  all: 'All',
  noChart: 'No chart yet',
  empty: 'No songs match.',
  // Nothing to list for a search: it names what was searched.
  emptyQuery: 'No songs match “{{query}}”.',
  withChords: 'With chords',
  // A song's stage, as its course places it (ADR 0005).
  stage: 'Level',
  anyStage: 'Any',
  emptyStage: 'No songs here at the “{{stage}}” level.',
  emptyQueryStage: 'No songs match “{{query}}” at the “{{stage}}” level.',
  clearFilters: 'Clear filters',
  yours: 'Your songs',
  // Your songs' shelf before there are any.
  mineEmpty: {
    title: 'No songs of your own yet',
    description: 'Write one by its chords, or record it at the keys.',
  },
  newSong: 'New song',
  making: {
    title: 'New song',
    name: 'Title',
    meter: 'Time signature',
    make: 'Make',
    makeAndRecord: 'Record',
  },
  // What a new song's score holds, its own sheet (ADR 0072).
  setup: {
    title: 'Score',
    customize: 'Customize',
    done: 'Done',
    templates: 'Start from',
    template: {
      chordsAndPiano: 'Chords and piano',
      leadSheet: 'Melody and chords',
      pianoAndMelody: 'Piano with melody',
      piano: 'Piano',
    },
    templateDetail: {
      chordsAndPiano: 'Chord symbols over the piano',
      leadSheet: 'A lead sheet: the tune with chord symbols, no piano staves',
      pianoAndMelody: 'The tune on its own staff over the piano, with chord symbols',
      piano: 'The piano alone',
    },
    staves: 'Staves',
    chordNames: 'Chord symbols',
    melody: 'Melody',
    melodyDetail: 'A staff for the tune',
    piano: 'Piano',
    pianoDetail: 'Both hands on the grand staff',
    pianoKept: 'Add the melody to leave the piano out',
  },
  // A song someone shared as a link.
  shared: {
    title: 'A shared song',
    reading: 'Reading the song…',
    facts: '{{key}} · {{meter}} · {{bpm}}',
    add: 'Add to Your songs',
    says: 'Add it to Your songs to practise it.',
    none: 'This link holds no song: it may be cut short.',
    toSongs: 'To Songs',
  },
} as const
