export const settings = {
  title: 'Settings',
  language: { label: 'Language', en: 'English', ru: 'Русский' },
  theme: { label: 'Theme', system: 'System', light: 'Light', dark: 'Dark' },
  layout: { label: 'Layout', titles: { label: 'Page titles', large: 'Large', small: 'Small' } },
  keyboard: 'Keyboard',
  midi: 'MIDI keyboard',
  // A screen's floating actions (ADR 0058): where they stand, and whether they say their names.
  floating: {
    label: 'Floating buttons',
    place: 'Where they stand',
    places: { left: 'Left', center: 'Middle', right: 'Right' },
    labels: 'Show their names',
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
    says: 'Your songs, takes, patterns, progress and settings live on this device only. Save them as a file to keep them safe or to move them to another device.',
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
} as const
