export const songs = {
  title: 'Songs',
  search: 'Search songs',
  collection: 'Collection',
  all: 'All',
  noChart: 'No chart yet',
  learned: 'Learned',
  empty: 'No songs match.',
  // Nothing to list for a search: it names what was searched.
  emptyQuery: 'No songs match “{{query}}”.',
  withChords: 'With chords',
  // A song's stage, as its course places it (ADR 0005).
  stage: 'Stage',
  anyStage: 'Any',
  emptyStage: 'No songs here at the “{{stage}}” stage.',
  emptyQueryStage: 'No songs match “{{query}}” at the “{{stage}}” stage.',
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
  // A song someone shared as a link.
  shared: {
    title: 'A shared song',
    reading: 'Reading the song…',
    facts: '{{key}} · {{meter}} · {{tempo}} BPM',
    add: 'Add to Your songs',
    says: 'Add it to Your songs to practise it.',
    none: 'This link holds no song: it may be cut short.',
    toSongs: 'To Songs',
  },
} as const
