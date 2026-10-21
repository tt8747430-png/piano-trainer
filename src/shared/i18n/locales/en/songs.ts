export const songs = {
  title: 'Songs',
  search: 'Search songs',
  collection: 'Collection',
  all: 'All',
  noChart: 'No chart yet',
  learned: 'Learned',
  // Nothing to list: a search that found nothing names it.
  empty: 'No songs match.',
  emptyQuery: 'No songs match “{{query}}”.',
  withChords: 'With chords',
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
