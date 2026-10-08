export const common = {
  appName: 'Piano Trainer',
  back: 'Back',
  nav: {
    label: 'Main navigation',
    path: 'Path',
    songs: 'Songs',
    learn: 'Learn',
    practice: 'Practice',
    settings: 'Settings',
    collapse: 'Collapse the sidebar',
    open: 'Open the sidebar',
  },
  errors: {
    title: 'Something went wrong',
    offline: 'You’re offline. This screen opens once you’re back online.',
    reload: 'Reload',
  },
  notFound: { title: 'Page not found', toSongs: 'Go to Songs', toAccompaniment: 'Go to Accompaniment' },
  update: { available: 'A new version is ready', update: 'Update', later: 'Later' },
  close: 'Close',
  loading: 'Loading',
  level: 'Level {{level}}',
  levelName: {
    beginner: 'Beginner',
    elementary: 'Elementary',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  },
  rating: { known: 'Known', gap: 'Gap', unknown: 'Not checked yet' },
  hands: { both: 'Both hands', rh: 'Right hand', lh: 'Left hand' },
  // A piano key's name: its note and octave.
  note: { natural: '{{letter}}{{octave}}', sharp: '{{letter}} sharp {{octave}}' },
  keyboard: 'Keyboard',
  // What a key is, said after its note: a quiz's wrong or missing key, Name chord's chord.
  keyState: { wrong: 'Wrong', missing: 'Missing', lit: 'Played' },
  // What a Play button says while its sound plays.
  stop: 'Stop',
  // The keyboard's rail: its buttons and its map.
  rail: {
    octaveDown: 'Octave down',
    octaveUp: 'Octave up',
    map: 'Keys in view',
    mapRange: '{{from}} to {{to}}',
    settings: 'Keyboard settings',
    glissando: 'Glissando',
  },
  // The keyboard settings: in the keyboard's rail and in Settings.
  keyboardSettings: {
    keySize: { label: 'Keys', fit: 'Fit', large: 'Large', piano: 'Whole piano' },
    namedKeys: { label: 'Note names', c: 'C', all: 'All', none: 'None' },
    map: 'Keyboard map',
    typing: 'Play from the computer keyboard',
    typingHint: 'Z X · octave',
  },
  learned: { toggle: '{{title}}: learned', done: 'Learned' },
  midi: {
    label: 'MIDI keyboard',
    labelConnected: 'MIDI keyboard, connected',
    connect: 'Connect a MIDI keyboard',
    connecting: 'Connecting…',
    retry: 'Try again',
    connected: 'Connected: {{devices}}',
    noDevice: 'No MIDI keyboard found.',
    denied: 'MIDI access was blocked.',
    unsupported: 'This browser can’t connect a MIDI keyboard.',
  },
} as const
