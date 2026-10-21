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
  // What a new song's score holds, its own sheet (ADR 0072).
  setup: {
    title: 'Score',
    customize: 'Customize',
    done: 'Done',
    templates: 'Start from',
    template: {
      chordsAndPiano: 'Chords and piano',
      leadSheet: 'Melody, chords and piano',
      piano: 'Piano',
    },
    templateDetail: {
      chordsAndPiano: 'Chord names over the piano',
      leadSheet: 'The melody on its own staff, chord names over the piano',
      piano: 'The piano alone',
    },
    rows: 'Rows',
    chordNames: 'Chord names',
    melody: 'Melody',
    melodyDetail: 'A staff for the tune over the piano',
    piano: 'Piano',
    parts: 'More parts',
    part: 'Part {{n}}',
    addPart: 'Add a part',
    removePart: 'Remove {{part}}',
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
