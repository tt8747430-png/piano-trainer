export const search = {
  title: 'Search',
  // The palette's field: what it searches, and its hint.
  field: 'Search everything',
  placeholder: 'Songs, chords, scales, lessons…',
  // Nothing found: what was missed, how to search instead, and the places to go on from below.
  none: 'No results for “{{query}}”',
  noneHint:
    'Check the spelling, or try a song’s title, a chord like Cmaj7 or a scale like D minor.',
  // A song the learner archived, said on its row (ADR 0106).
  clear: 'Clear search',
  archived: 'Archived',
  // What the palette shows before anything is typed.
  recent: 'Recent searches',
  suggested: 'Suggestions',
  // How to use it, said to a screen reader.
  hint: 'Up and down move through the results, Enter opens one, Escape closes.',
  // Songs' own field searches the library first; this opens the palette with what was typed.
  everywhere: 'Search everywhere',
  // The palette's groups, each a heading over its rows (rule 27).
  groups: {
    practice: 'Practice',
    songs: 'Songs',
    folders: 'Folders',
    lessons: 'Lessons',
  },
} as const
