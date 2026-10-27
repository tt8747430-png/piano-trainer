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
  // Help (ADR 0052): How to use, a short guide in plain steps, each part folding.
  help: {
    label: 'Help',
    howToUse: 'How to use',
    howToUseLine: 'Songs, the Player, lessons, the editor, MIDI and the Metronome',
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
        'Settings → MIDI keyboard says whether the app sounds your keys, plays through the piano’s speaker or shifts an octave.',
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
