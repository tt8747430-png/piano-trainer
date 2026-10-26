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
  // The staves a new song's score starts with, its own sheet (ADR 0072, 0097).
  setup: {
    title: 'Score',
    customize: 'Customize',
    done: 'Done',
    staves: 'Staves',
    choice: {
      piano: 'Piano',
      staffAndPiano: 'A staff and piano',
      staff: 'A staff',
    },
    choiceDetail: {
      piano: 'The piano’s two staves',
      staffAndPiano: 'A staff over the piano, for a voice or another part',
      staff: 'A lead sheet: one staff with chord symbols, the piano out of sight',
    },
    more: 'Add more staves, name them and take them away on the score.',
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
