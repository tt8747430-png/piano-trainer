export const settings = {
  // Learner preview (R29 B5, R32): an editor or administrator sees the app as a learner, this session only.
  learnerView: {
    label: 'Preview as learner',
    info: 'Hides every editing and administration control for this session. Nothing is changed; the preview ends when you exit it, reload or sign out.',
    on: 'Previewing as learner',
    exit: 'Exit',
  },
  title: 'Settings',
  language: { label: 'Language', en: 'English', ru: 'Русский' },
  theme: { label: 'Appearance', system: 'Match system', light: 'Light', dark: 'Dark' },
  // Settings' groups (R32), in the list's order.
  groups: {
    general: { label: 'App' },
    piano: { label: 'Piano' },
    library: { label: 'Library' },
    support: { label: 'Support' },
  },
  // Settings' pages, named for what they set (R32).
  pages: {
    general: 'General',
    storage: 'Storage and backup',
    onScreenPiano: 'On-screen piano',
    connectPiano: 'MIDI devices',
    computerKeys: 'Computer keyboard',
    selectionToolbar: 'Selection toolbar',
    swipeActions: 'Swipe actions',
    guide: 'User guide',
    feedback: 'Report a problem',
    about: 'About',
    player: 'Player',
  },
  // The on-screen piano's page: its groups.
  piano: { look: 'Appearance', place: 'Position', play: 'Playing', pedals: 'Pedals' },
  progress: {
    reset: 'Reset progress',
    title: 'Reset progress?',
    body: 'Learned steps, practised songs and quiz results on this device will be cleared.',
    cancel: 'Cancel',
    confirm: 'Reset',
  },
  // What this device keeps of the app, and protecting it from the browser's clearing (ADR 0116).
  storage: {
    label: 'Device storage',
    info: 'Your songs, progress and the app’s offline copy are stored by this browser. When a device runs low on space, a browser may clear an app’s data unless the app has asked it to keep the data.',
    reading: 'Calculating storage…',
    used: '{{size}} used on this device',
    keepSafe: 'Protect from clearing',
    safe: 'Protected: the browser will not clear this data to free up space',
    refused:
      'This browser manages storage itself. Install the app or save a backup to keep your data safe.',
  },
  // The grand piano's recorded notes on this device (A27, R29 SND).
  pianoSound: {
    label: 'Offline piano',
    info: 'The piano is a sampled grand: Salamander Grand Piano, a Yamaha C5. Its samples download as you first play each note. Download them all to hear the grand offline; until then, a lighter sampled piano plays offline.',
    reading: 'Calculating storage…',
    kept: '{{kept}} of {{total}} downloaded',
    ready: 'Available offline',
    download: 'Download for offline use',
    downloading: 'Downloading… {{percent}}%',
    failed: 'Some samples could not be downloaded. Try again when you are online.',
    remove: 'Remove downloaded piano samples',
    title: 'Remove downloaded piano samples?',
    body: 'Offline, a lighter sampled piano plays until you download them again.',
    cancel: 'Cancel',
    confirm: 'Remove',
    footnote:
      'Resetting clears learned steps, practised songs and quiz results on this device. Removing the samples frees their space; they download again as you play.',
  },
  backup: {
    label: 'Backup',
    says: 'Your songs, folders, takes, patterns, progress and settings live on this device only. Save them to a file to keep them safe or to move them to another device.',
    save: 'Save a backup',
    restore: 'Restore from a file',
    notBackup: 'This file is not a Piano Trainer backup.',
    title: 'Restore this backup?',
    body: 'Everything on this device will be replaced with the backup from {{made}}. The app will then restart.',
    bodyUndated:
      'Everything on this device will be replaced with the backup. The app will then restart.',
    otherVersions:
      'Part of it was saved by another version of the app and will start from its defaults.',
    noRoom: 'The backup could not be restored: this device is out of space. Nothing was changed.',
    notKept:
      'This browser keeps no data once the app is closed (a private window, or site data blocked), so a restored backup would be lost. Nothing was changed.',
    tooLarge: 'This file is too large to be a Piano Trainer backup.',
    cancel: 'Cancel',
    confirm: 'Restore',
  },
  // The bars a learner arranges (R29 B10): Selection toolbar and Swipe actions.
  bars: {
    selectToolbar: 'Selection toolbar',
    swipeActions: 'Swipe actions',
    songs: 'Songs and folders',
    selectFootnote: 'Up to four actions appear in the toolbar when you select songs or folders.',
    swipeFootnote:
      'Up to two actions on each side. Archive and Delete always ask for confirmation.',
    songRows: 'Songs',
    folderRows: 'Folders',
    swipeRight: 'Leading swipe (right)',
    swipeLeft: 'Trailing swipe (left)',
    available: 'Available',
    full: 'All slots are in use. Remove an action to add another.',
    none: 'No action: this swipe does nothing.',
    keepOne: 'Minimum number of actions',
    reset: 'Restore defaults',
    add: 'Add {{act}}',
    remove: 'Remove {{act}}',
    move: '{{act}}: drag to reorder',
    more: 'More',
    act: {
      edit: 'Edit',
      favourite: 'Favourite',
      move: 'Move',
      export: 'Export',
      archive: 'Archive',
      delete: 'Delete',
    },
  },
  account: {
    signIn: 'Sign in',
    label: 'Account',
    why: 'Sync your library across your devices',
  },
  sync: {
    label: 'Sync',
    now: 'Sync now',
    state: {
      idle: 'Up to date',
      syncing: 'Syncing…',
      offline: 'Offline: changes will sync when you reconnect',
      failed: 'The last sync did not complete',
    },
    waiting_one: '{{count}} change pending',
    waiting_other: '{{count}} changes pending',
    last: 'Last synced {{when}}',
    what: 'Your songs, folders, takes, progress and settings sync while you are signed in.',
    // The account card's one line (A15).
    line: {
      synced: 'Synced {{when}}',
      waiting_one: '{{count}} change pending',
      waiting_other: '{{count}} changes pending',
      offline: 'Offline',
      failed: 'Last sync failed',
      syncing: 'Syncing…',
      idle: 'Up to date',
    },
  },
  about: {
    version: 'Version',
    // Software update, as iOS's: where the next version stands; a tap checks for one.
    update: {
      label: 'Software update',
      current: 'Up to date',
      checking: 'Checking…',
      downloading: 'Downloading…',
      ready: 'Update available',
      installing: 'Restarting…',
      offline: 'Unavailable offline',
      failed: 'Check failed. Try again',
      install: 'Install and restart',
    },
  },
  // The account's own page (round 3): its name, password, signing out, deleting it.
  accountPage: {
    title: 'Account',
    email: 'Email',
    password: 'Change password',
    signOut: 'Sign out',
    signOutTitle: 'Sign out?',
    signOutInfo: 'Your songs and progress stay on this device and sync again when you sign in.',
    signOutCancel: 'Cancel',
    signedOut: 'You are not signed in.',
    signIn: 'Sign in',
    create: 'Create account',
    // The role an editor or administrator holds, and their preview (R32).
    editorial: 'Editorial access',
    role: 'Role',
    roles: { learner: 'Learner', editor: 'Editor', admin: 'Administrator' },
    delete: {
      word: 'DELETE',
      button: 'Delete account…',
      title: 'Delete your account?',
      body: 'Your account and all synced data will be deleted in 30 days, and you will be signed out on every device now. Sign in before then to cancel. Data on this device is kept.',
      cancel: 'Keep account',
      confirm: 'Delete',
      scheduled: 'Your account will be deleted on {{date}}. Sign in before then to keep it.',
      footnote: 'Your account and synced data are deleted after 30 days.',
    },
  },
  // Signing in to an account that is to be deleted.
  deletionGate: {
    title: 'Account scheduled for deletion',
    body: 'It will be deleted on {{date}}. Keep it, or sign out and let the deletion proceed.',
    keep: 'Keep account',
    signOut: 'Sign out',
  },
  // Report a problem (R29 B2, R32): its own page, sent with the app's error reports.
  report: {
    label: 'Description',
    footnote:
      'Include what you were doing and the screen you were on. Reports are anonymous and read by the Piano Trainer team.',
    offline: 'Sending requires an internet connection.',
    send: 'Send report',
    sent: 'Report sent. Thank you.',
  },
  aboutPage: {
    title: 'About',
    version: 'Version {{version}} ({{build}})',
    licence: 'Licence',
    allRights: 'All rights reserved',
    legal: 'Legal',
    credits: 'Acknowledgements',
    publicDomain: 'Public domain',
    for: {
      scores: 'Music engraving',
      piano: 'Piano samples',
      lightPiano: 'Offline piano samples',
      drums: 'Drum samples',
      bassElectric: 'Electric bass samples',
      bassUpright: 'Double bass samples',
      fonts: 'Text and music fonts',
      lessons: 'The method the lessons follow',
      studies: 'The Studies',
    },
  },
  help: {
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
  },
  howToUse: {
    title: 'User guide',
    songs: {
      title: 'Organise your library',
      library:
        'Songs holds your library: folders first, then songs. Search finds a song by title; Filters narrow the list by key, level or favourites.',
      folder: 'New folder groups songs. Folders can contain folders of their own.',
      select: 'Select, or a long press on a row, chooses several songs at once.',
      move: 'Move to… places the selected songs in a folder. Undo in the message reverses it.',
      archive:
        'Archive puts songs away without deleting them. The Archive button at the top of Songs restores them.',
      favourite: 'The heart marks a song as a favourite.',
    },
    player: {
      title: 'Play a song',
      view: 'View sets how the music is shown: sheet music, chords over lyrics, chord diagrams or a chord grid.',
      transpose:
        'Transpose shifts the song up or down by semitones. Reset restores the original key.',
      simplify: 'Simplify plays each chord as a plain major or minor triad.',
      sound: 'Sound holds the count-in, the metronome and each part’s volume.',
      loop: 'Loop repeats a passage. Select it with Shift and a click, or hold a note and drag.',
      wait: 'In the tempo menu, Wait mode pauses until you play each note.',
    },
    learn: {
      title: 'Learn a song',
      sections: 'A song’s page shows its key, time signature, tempo, chords and sections.',
      lessons:
        'A section’s page holds its lessons: its chords, its chord changes and its patterns.',
      pass: 'A lesson opens the Player looping its bars. Play them through in Wait mode to complete it.',
      learned: 'Learned marks a song once you know it.',
    },
    editor: {
      title: 'Edit a score',
      open: 'Edit opens the score editor at the current bar; Practise returns to the Player.',
      modes:
        'Replace overwrites the note at the caret, Insert shifts the following notes, Chord adds a note to the chord there.',
      palette:
        'The palette holds note values, articulations, clefs, key and time signatures and barlines. The ⓘ beside a section explains it.',
      transpose:
        'Transpose shifts the whole song, its key or its chords in a single step that Undo reverses.',
    },
    midi: {
      title: 'Play a MIDI keyboard',
      connect: 'Connect a keyboard by USB or Bluetooth, then choose it with the MIDI button.',
      settings:
        'Settings › MIDI devices: MIDI input and output, local sound, the device the app listens to, octave shift and a MIDI log of incoming messages.',
      play: 'In Wait mode the Player listens for the notes you play; the Chord finder names the chord you hold.',
    },
    metronome: {
      title: 'Keep time',
      open: 'Practice › Metronome. Set the tempo with − and +, the slider or Tap tempo.',
      choose:
        'Choose clicks, beeps or a drum pattern, and the time signature. The downbeat of each bar is accented.',
      keys: 'Space starts and stops it; ↑ and ↓ change the tempo.',
    },
  },
} as const
