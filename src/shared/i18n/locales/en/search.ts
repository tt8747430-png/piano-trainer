export const search = {
  title: 'Search',
  // The palette's field: what it searches, and its hint.
  field: 'Search everything',
  placeholder: 'Songs, chords, scales, lessons…',
  none: 'Nothing found.',
  // A song the learner archived, said on its row (ADR 0106).
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
