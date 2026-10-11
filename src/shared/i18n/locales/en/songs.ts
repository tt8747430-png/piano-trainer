export const songs = {
  title: 'Songs',
  search: 'Search songs',
  clearSearch: 'Clear search',
  collection: 'Collection',
  all: 'All',
  noChart: 'No chart yet',
  learned: 'Learned',
  empty: 'No songs match.',
  clearFilters: 'Clear filters',
  yours: 'Your songs',
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
    none: 'This link holds no song: it may be cut short.',
    toSongs: 'To Songs',
  },
} as const
