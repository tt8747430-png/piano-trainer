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
  // A song's row counts its chords, each once over any bass (Chordify's 7 Tips: three to five for a
  // beginner).
  chordCount_one: '{{count}} chord',
  chordCount_other: '{{count}} chords',
  // Chords I know (ADR 0103): the chords ticked, and only the songs that use no other stay.
  known: {
    label: 'Chords I know',
    count: 'Chords I know: {{count}}',
    info: 'Tick the chords you can play: only the songs that use no other chord stay.',
    clear: 'Clear',
  },
  emptyKnown: 'No songs here use only the chords you know.',
  // The learner's library (ADR 0103): their favourites and their setlists, Songs' tabs after All.
  favourites: 'Favourites',
  setlists: 'Setlists',
  favouritesEmpty: {
    title: 'No favourites yet',
    description: 'Tap ♡ on a song’s page to keep it here.',
  },
  setlistsEmpty: {
    title: 'No setlists yet',
    description: 'Gather songs to play in your own order: for a service, a lesson or an evening.',
  },
  searchSetlists: 'Search setlists',
  emptySetlists: 'No setlists match “{{query}}”.',
  library: {
    favourite: 'Add to favourites',
    unfavourite: 'Remove from favourites',
    addToSetlist: 'Add to setlist',
    newSetlist: 'New setlist',
    setlistName: 'Setlist name',
    songCount_one: '{{count}} song',
    songCount_other: '{{count}} songs',
    // Why New setlist and Duplicate are greyed: the library holds as many as it keeps.
    full: 'There is no room for another setlist: delete one first.',
    copyName: '{{name}} (copy)',
  },
  // A setlist's page: its songs in the learner's order.
  setlist: {
    more: 'More',
    rename: 'Rename',
    duplicate: 'Duplicate',
    delete: 'Delete',
    addSongs: 'Add songs',
    search: 'Search this setlist',
    move: 'Move {{title}}',
    remove: 'Remove {{title}} from the setlist',
    empty: {
      title: 'No songs here yet',
      description: 'Add songs, then drag them into the order you play them in.',
    },
    emptyQuery: 'No songs here match “{{query}}”.',
    deleting: {
      title: 'Delete “{{name}}”?',
      says: 'It can’t be undone. Its songs stay in Songs.',
      confirm: 'Delete',
      cancel: 'Keep it',
    },
    // A drag as a screen reader hears it.
    drag: {
      instructions:
        'To move a song, press Space or Enter on its handle, move it with the up and down arrows, then press Space or Enter to put it down, or Escape to put it back.',
      picked: 'Picked up {{title}}.',
      over: '{{title}} is at place {{place}} of {{count}}.',
      dropped: '{{title}} put down at place {{place}} of {{count}}.',
      cancelled: '{{title}} put back.',
    },
  },
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
