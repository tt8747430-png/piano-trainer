export const settings = {
  title: 'Settings',
  language: { label: 'Language', en: 'English', ru: 'Русский' },
  theme: { label: 'Theme', system: 'System', light: 'Light', dark: 'Dark' },
  // How the screens look: their titles, and the floating buttons.
  appearance: {
    label: 'Appearance',
    titles: { label: 'Page titles', large: 'Large', small: 'Small' },
  },
  keyboard: 'Keyboard',
  midi: 'MIDI keyboard',
  // How a take is recorded in the score editor (ADR 0028), as its recording strip's settings say too.
  recording: 'Recording',
  // A screen's floating actions (ADR 0061): where they stand, and whether they say their names.
  floating: {
    place: 'Floating buttons',
    placeInfo: 'Where the buttons that float over a screen stand along its foot',
    places: { left: 'Left', center: 'Middle', right: 'Right' },
    labels: 'Name the floating buttons',
    labelsNote: 'Otherwise each shows its icon only, and its name appears when you point at it',
  },
  progress: {
    label: 'Progress',
    reset: 'Reset progress',
    title: 'Reset progress?',
    body: 'Learned steps, practised songs and quiz answers on this device will be cleared.',
    cancel: 'Keep it',
    confirm: 'Reset',
  },
  backup: {
    label: 'Backup',
    says: 'Your songs, folders, takes, patterns, progress and settings live on this device only. Save them as a file to keep them safe or to move them to another device.',
    save: 'Save a backup',
    restore: 'Restore from a file',
    notBackup: 'This file is not a Piano Trainer backup.',
    title: 'Restore this backup?',
    body: 'Everything on this device is replaced by the backup made on {{made}}. The app opens again.',
    bodyUndated: 'Everything on this device is replaced by the backup. The app opens again.',
    otherVersions: 'Some of it was saved by another version of the app: that part starts afresh.',
    noRoom:
      'The backup could not be restored: this device has no room for it. Nothing was changed.',
    notKept:
      'This browser keeps nothing once the app is closed (a private window, or site data blocked): a backup restored here would be gone. Nothing was changed.',
    tooLarge: 'This file is too large to be a Piano Trainer backup.',
    cancel: 'Keep what is here',
    confirm: 'Restore',
  },
  // The index (round 3): the account, then a page for each group of settings.
  groups: {
    preferences: { label: 'Preferences', line: 'Language, theme and how screens look' },
    playing: { label: 'Playing', line: 'The keyboard, a MIDI keyboard and recording' },
    data: { label: 'Sync and data', line: 'Sync, backup and progress' },
    help: { label: 'Help', line: 'How to use, and about the app' },
  },
  account: {
    signIn: 'Sign in',
    signInLine: 'Keep your songs and progress on every device',
    label: 'Account',
  },
  sync: {
    label: 'Sync',
    info: 'While you’re signed in, your songs, progress and settings sync by themselves whenever you’re online. Sync now does it at once.',
    now: 'Sync now',
    signedOut: 'Sign in to keep your songs, progress and settings on every device.',
    state: {
      idle: 'Up to date',
      syncing: 'Syncing…',
      offline: 'Offline: changes wait for a connection',
      failed: 'The last sync didn’t finish',
    },
    waiting_one: '{{count}} change waiting',
    waiting_other: '{{count}} changes waiting',
    last: 'Last synced {{when}}',
  },
  about: {
    label: 'About',
    version: 'Version',
    made: 'Made with',
    madeWith: 'Verovio for the scores, Noto fonts, and Supabase for accounts and sync',
  },
  // The account's own page (round 3): its name, password, signing out, deleting it.
  accountPage: {
    title: 'Account',
    profile: 'Your name',
    email: 'Email',
    save: 'Save',
    saved: 'Saved',
    password: 'Change password',
    signOut: 'Sign out',
    signOutInfo: 'Your songs and progress stay on this device. Signing in again syncs them.',
    signedOut: 'You’re not signed in.',
    delete: {
      label: 'Delete account',
      info: 'Your account and everything synced to it are deleted 30 days after you ask. Sign in before then to cancel. What is on this device stays.',
      button: 'Delete account…',
      title: 'Delete your account?',
      body: 'Type your email to confirm. Your account is deleted in 30 days, and you’re signed out on every device now.',
      field: 'Your email',
      cancel: 'Keep my account',
      confirm: 'Delete',
      scheduled: 'Your account will be deleted on {{date}}. Sign in before then to keep it.',
    },
  },
  // Signing in to an account that is to be deleted.
  deletionGate: {
    title: 'Your account is to be deleted',
    body: 'It will be deleted on {{date}}. Keep it, or sign out and let it go.',
    keep: 'Keep my account',
    signOut: 'Sign out',
  },
  // Help (ADR 0052): How to use, a short guide in plain steps, each part folding.
  help: {
    label: 'Help',
    howToUse: 'How to use',
    howToUseLine: 'Songs, the Player, lessons, the editor, MIDI and the Metronome',
    privacy: 'Privacy',
    privacyLine: 'What is kept, where, and how to delete it',
    terms: 'Terms',
    termsLine: 'Using the app, and publishing songs',
  },
  howToUse: {
    title: 'How to use',
    songs: {
      title: 'Find and organise songs',
      library:
        'Songs holds your library: folders first, then songs. Search finds a song by name; Filters narrow it by key, level or favourites.',
      folder: 'New folder groups songs. A folder can hold folders of its own.',
      select: 'Select, or a long press on a row, chooses several songs at once.',
      move: 'Move to… puts the songs chosen in a folder. Undo in the message takes it back.',
      archive:
        'Archive puts songs away without deleting them. The Archive button at the top of Songs brings them back.',
      favourite: 'The heart marks a favourite.',
    },
    player: {
      title: 'Play a song',
      view: 'View chooses how the music shows: sheet music, chords over lyrics, chord diagrams or a grid.',
      transpose: 'Transpose moves the song up or down a semitone at a time. Reset takes it back.',
      simplify: 'Simplify plays each chord as a plain major or minor triad.',
      sound: 'Sound holds the count-in, the click and each part’s volume.',
      loop: 'Loop repeats a passage. Choose it with Shift and a click, or hold a note and drag.',
      wait: 'In the tempo menu, Wait mode waits for each note you play before it goes on.',
    },
    learn: {
      title: 'Learn a song',
      sections: 'A song’s page shows its key, time and tempo, its chords, and its sections.',
      lessons: 'A section’s page holds its lessons: its chords, its changes and its patterns.',
      pass: 'A lesson opens the Player looping its bars. Play it through in Wait mode and it is checked.',
      learned: 'Learned marks the song once you know it.',
    },
    editor: {
      title: 'Edit a song',
      open: 'Edit opens the editor at the bar you are on; Practise goes back to the Player.',
      modes:
        'Replace writes over the note at the caret, Insert pushes the notes after it on, Chord adds to the chord there.',
      palette:
        'The palette holds note values, marks, clefs, keys, time signatures and barlines. The ⓘ beside a section says what it does.',
      transpose:
        'Transpose moves the whole song, its key or its chords, in one step that Undo takes back.',
    },
    midi: {
      title: 'Play on a MIDI keyboard',
      connect: 'Connect a keyboard by cable or Bluetooth, then choose it with the MIDI button.',
      settings:
        'Settings → MIDI keyboard: MIDI input and output, whether the app sounds your keys, which keyboard it hears, an octave shift, and a MIDI log of what the keyboard sends.',
      play: 'In Wait mode the Player listens for the notes you play; the Chord finder names the chord you hold.',
    },
    metronome: {
      title: 'Keep time',
      open: 'Practice → Metronome. Set the tempo with − and +, the slider, or Tap tempo.',
      choose:
        'Choose clicks, beeps or a drum beat, and the time signature. The first beat of each bar is accented.',
      keys: 'Space starts and stops it; ↑ and ↓ change the tempo.',
    },
  },
} as const
