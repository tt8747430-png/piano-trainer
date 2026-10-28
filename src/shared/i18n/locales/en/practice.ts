export const practice = {
  title: 'Practice',
  // Practice's groups of pages (ADR 0052), each under its heading.
  groups: { theory: 'Theory', playing: 'Playing', training: 'Training' },
  // Its pages, each by its name.
  pages: {
    chords: 'Chords',
    scales: 'Scales and keys',
    intervals: 'Intervals',
    progressions: 'Progressions',
    accompaniment: 'Accompaniment',
    chordFinder: 'Chord finder',
    metronome: 'Metronome',
    exercises: 'Exercises',
    quiz: 'Quiz',
  },
  // What a page says of itself in one short line, on Practice and in Search.
  about: {
    chords: 'Triads to 13ths, inversions',
    scales: 'Scales, their chords, keys',
    intervals: 'Every interval on the keys',
    progressions: 'Known loops in any key',
    accompaniment: 'Patterns for both hands',
    chordFinder: 'Play a chord, see its name',
    exercises: 'Technique and drills',
    quiz: 'Chords, keys, ear, reading',
    metronome: 'Clicks or drums, any tempo',
  },
  // Words the explorers share.
  root: 'Root',
  hands: 'Hands',
  arpeggio: 'Arpeggio',
  inPlayer: 'Practise in the Player',
  checkYourself: 'Check yourself',
  // Chords: the chord built, its tensions, and its ways on.
  chords: {
    // The other ways a chord symbol is written on this root.
    written: 'Also written',
    // Chords builds a chord part by part.
    builder: {
      quality: 'Quality',
      suspension: 'Suspension',
      none: 'None',
      // A chord of five notes or more, its root left to the bass: where its right hand starts.
      handFrom: 'Right hand from',
      triads: {
        maj: 'Major',
        min: 'Minor',
        dim: 'Diminished',
        aug: 'Augmented',
        sus2: 'Suspended 2nd',
        sus4: 'Suspended 4th',
        power: 'Power (5)',
      },
      sizeNot: {
        stops: 'Chord dictionaries stop the {{quality}} chord before this size.',
        power: 'A power chord has no 3rd, so nothing stacks on it.',
      },
      powerInversion: 'A power chord stays in root position: its 5th under the root is a 4th.',
      sizes: { triad: 'Triad', seventh: '7th', ninth: '9th', eleventh: '11th', thirteenth: '13th' },
      sizeNames: {
        triad: 'Triad',
        seventh: 'Seventh chord',
        ninth: 'Ninth chord',
        eleventh: 'Eleventh chord',
        thirteenth: 'Thirteenth chord',
      },
      seventh: '7th',
      sevenths: { minor: 'Minor 7th', major: 'Major 7th', diminished: 'Diminished 7th' },
      added: 'Added tones',
      alterations: 'Alterations',
    },
    // How the chord is laid on the keys: the jazz pianist's voicings, each explained in its ⓘ.
    voicing: {
      label: 'Voicing',
      names: {
        close: 'Close',
        drop2: 'Drop 2',
        drop3: 'Drop 3',
        shell: 'Shell',
        rootlessA: 'Rootless A',
        rootlessB: 'Rootless B',
        locked: 'Locked hands',
        soWhat: 'So What',
      },
      about: {
        close:
          'Every note of the chord packed as close together as it goes, from the lowest note of the inversion chosen. Cmaj7: C E G B.',
        drop2:
          'A close chord of four notes with its second note from the top moved down an octave, into the left hand. The chord opens out and keeps every note. Cmaj7: G | C E B.',
        drop3:
          'As drop 2, but the third note from the top goes down the octave, so the chord spreads wider. Cmaj7: E | C G B.',
        shell:
          'Only the root, 3rd and 7th, in the left hand: the three notes that say what the chord is, leaving the right hand free for the melody. C7: C E B♭.',
        rootlessA:
          'The left hand leaves the root to the bass and plays the 3rd, 5th, 7th and 9th; a dominant plays its 7th, 9th, 3rd and 13th. Through a ii–V–I in C the hand hardly moves: Dm7 F A C E, G7 F A B E, Cmaj7 E G B D.',
        rootlessB:
          'The same four notes as type A, starting from the other end: the 7th, 9th, 3rd and 5th; a dominant plays its 3rd, 13th, 7th and 9th. In C: Dm7 C E F A, G7 B E F A, Cmaj7 B D E G.',
        locked:
          'George Shearing’s block chords: a close chord of four notes in the right hand with the melody on top, and the left hand doubling the melody an octave lower. Cmaj7 with E on top: E | G B C E.',
        soWhat:
          'Three 4ths with a major 3rd on top, built up from the chord’s 9th, as the piano plays it in Miles Davis’s “So What”. It has no 3rd, so it suits a minor or suspended chord. Dm7: E A | D G B.',
      },
      // The voicing's keys on the chord shown, the left hand's before the bar.
      here: 'On this chord: {{notes}}',
      bar: {
        fourNotes:
          'Made from a close chord of four notes, such as a 7th or 6th chord. This one has {{count}}.',
        noThird: 'Needs the chord’s 3rd, and this chord has none.',
        noSeventh: 'Needs a 7th, and this chord has none.',
        notDorian:
          'Suits only a minor or suspended chord with a perfect 5th and no major 3rd, major 7th or altered note.',
      },
    },
    fingering: {
      title: 'Fingering',
      // A row of the table: the inversion, or the keys as the voicing lays them.
      voiced: 'As voiced',
    },
    tensions: {
      title: 'Available tensions',
      group: {
        weak: { title: 'Weak', says: 'These add nothing new to the sound.' },
        strong: { title: 'Strong', says: 'These give the chord its name.' },
        tension: { title: 'Tensions', says: 'These add colour.' },
        avoid: { title: 'Avoid', says: 'These clash with the chord.' },
      },
    },
    chromatic: 'Chromatic walk',
    chromaticDetail: 'The chord moved a semitone at a time from its root, one bar each',
    // Chords' row to the Chord finder, which opens on the chord's own keys.
  },
  // Scales and keys: the run, the chords, the key.
  scales: {
    show: { scale: 'Scale', chords: 'Chords', key: 'Key' },
    label: 'Scale',
    startOn: 'Start on',
    openInChords: 'Open in Chords',
    // What the run's keys carry: its notes, or a hand's fingers.
    onKeys: { label: 'On the keys', notes: 'Notes', lh: 'Left hand', rh: 'Right hand' },
    // The run's fingering hand by hand, each hand drawn with its fingers numbered.
    byHand: {
      title: 'Fingering by hand',
      lh: 'Left hand',
      rh: 'Right hand',
      drawing: '{{hand}}: fingers numbered from the thumb, 1, to the little finger, 5',
      notes: 'Notes',
      fingers: 'Fingers',
    },
    fingering: {
      label: 'Fingering',
      thumb: 'From the thumb',
      scale: 'As the scale',
    },
    rhythmLabel: 'Rhythm',
    rhythm: {
      even: 'Even',
      'long-short': 'Long, short',
      'short-long': 'Short, long',
      'long-short-short-short': 'Long, 3 short',
      'short-short-short-long': '3 short, long',
    },
    tempo: 'Tempo',
    playUpDown: 'Play up and down',
    facts: { formula: 'Formula', gaps: 'Structure', relative: 'Relative', modeOf: 'Mode of' },
    chordsIn: 'Chords in this scale',
    keysPlay: { label: 'Keys play', chords: 'Chords', notes: 'Notes' },
    holds: '{{note}} is in {{chords}}',
    holdsNone: 'No chord of the scale holds {{note}}',
    walk: { title: 'Walk the chords', played: 'Played as', block: 'Block' },
    key: {
      circle: 'Circle of fifths',
      random: 'A random key',
      signature: 'Signature',
      noSignature: 'No sharps or flats',
      notes: 'Notes',
      modes: 'Modes',
      borrowed: 'Borrowed chords',
      songs: 'Songs in this key',
      studies: 'Studies in this key',
      noSongs: 'No songs are in this key.',
      harmonise: 'Harmonise a melody note',
      harmoniseAbout:
        'Every chord that holds the melody note, played under it: chords of the key and chords borrowed from outside it.',
    },
    // A scale's page: its key's common progressions, each opening Progressions in this key.
    keyProgressions: 'Progressions in this key',
  },
  intervals: {
    simple: 'Within the octave',
    compound: 'Past the octave',
    // How a row plays its interval.
    way: { label: 'Play', together: 'At once', up: 'Up', down: 'Down' },
    // The tritone by each of its spellings, a row each.
    tritone: {
      A4: { name: 'Augmented fourth', short: 'A4' },
      d5: { name: 'Diminished fifth', short: 'd5' },
    },
    keys: '{{name}} on the keys',
  },
  progressions: {
    field: 'Numerals or chords',
    unread: 'This progression can’t be read.',
    majorLine: 'These numerals are a major key’s.',
    minorLine: 'These numerals are a minor key’s.',
    playIn: 'Play them in {{key}}',
    throughKeys: 'Through the keys',
    // The library as cards, a card a progression (ADR 0112).
    library: 'Library',
    chordCount_one: '{{count}} chord',
    chordCount_other: '{{count}} chords',
    chordsIn: 'Its chords in the key',
    /** What leads into each chord of the progression (ADR 0112). */
    lead: { label: 'Lead into each chord', none: 'No', v: 'By its V', 'ii-v': 'By its ii–V' },
    // The songs a progression is heard in, each opening the Player at its bars (ADR 0112).
    songs: {
      title: 'Songs with this progression',
      none: 'No song uses it yet',
      all_one: 'Show all {{count}} song',
      all_other: 'Show all {{count}} songs',
    },
    between: {
      title: 'Between two chords',
      about: 'Passing chords are extra chords that lead from one chord of the row into the next.',
      pair: 'From chord to chord',
    },
    style: {
      pop: 'Pop',
      rock: 'Rock',
      jazz: 'Jazz',
      blues: 'Blues',
      classical: 'Classical',
      soul: 'R&B / Soul',
      gospel: 'Gospel',
      theory: 'Theory',
    },
  },
  // The line of a part of Accompaniment with no pattern to show.
  accompaniment: {
    noneYours: 'Patterns you star, make or hide are kept here.',
    allHidden: 'Every pattern here is hidden. You can find them under Yours.',
  },
  // Patterns: each explained and heard, the learner's favourites, hidden and own.
  patterns: {
    new: 'New pattern',
    favourite: 'Favourite',
    rightHand: 'Right hand',
    leftHand: 'Left hand',
    overC: 'Over a bar of C major',
    over: 'Over the first line of {{piece}}',
    usedIn: 'Used in',
    makeOwn: 'Make your own from it',
    hide: 'Hide from the Player',
    show: 'Show in the Player',
    hiddenNote:
      'Hidden from the Player’s list and from its shelf. You can still find it under Yours.',
    edit: 'Edit',
    delete: 'Delete',
    deleting: {
      title: 'Delete {{name}}?',
      says: 'It leaves your patterns and the Player’s list. Songs that used it go back to their own pattern.',
      confirm: 'Delete',
      cancel: 'Keep it',
    },
    editor: {
      newTitle: 'New pattern',
      editTitle: 'Edit pattern',
      name: 'Name',
      mine: '{{name}} (mine)',
      save: 'Save',
      cancel: 'Cancel',
    },
  },
  // The Chord finder (ADR 0052): a chord played or tapped, named, spelled and written.
  chordFinder: {
    promptTitle: 'Play a chord',
    prompt: 'On your MIDI keyboard, or tap its keys.',
    promptFolded: 'On your MIDI keyboard, or show the keys to tap one.',
    none: 'No chord matches these notes.',
    note: 'One note',
    powerChord: 'Power chord',
    readings: 'Also read as',
    reading: 'Read as {{symbol}}',
    no3rd: 'No 3rd',
    no5th: 'No 5th',
    no9th: 'No 9th',
    no11th: 'No 11th',
    open: 'Open in Chords',
    // The keys that hold the chord found, its numeral in each.
    inKeys: 'In these keys',
    clear: 'Clear the keys',
    forget: 'Forget the chords played',
    // Where the chord shown comes from: keys held on the keyboard, the last chord, keys tapped.
    state: { held: 'Held', last: 'Last played', tapped: 'Tapped' },
    played: 'Played',
    // The staff where the chords are not remembered: the chord down now, else nothing.
    staff: 'On the staff',
    settings: 'Chord finder settings',
    remember: 'Remember',
    rememberDetail: 'The last {{count}}',
    inKeysShown: 'Keys it is in',
    scaleShown: 'Scale on the keys',
    scaleShownDetail: 'The key’s scale on every octave of the keys, each key with its note',
    slash: 'Over the bass',
    // The bass where the name leaves it out and it is no inversion: a bass beyond the 7th.
    bass: '{{note}} in the bass',
    // How the keys are laid out, as jazz pianists name it.
    voicing: {
      quartal: 'Stacked 4ths',
      soWhat: 'So What voicing',
      shell: 'Shell voicing',
      drop2: 'Drop 2',
      drop3: 'Drop 3',
      close: 'Close voicing',
      open: 'Open voicing',
    },
    altered: 'Altered dominant: {{symbol}}',
  },
  passingChords: {
    inKey: 'In the key',
    onlyInKey: 'In the key only',
    noneInKey: 'No way between these chords stays in the key.',
    chromatic: 'Chromatic',
    category: {
      dominant: 'Dominant',
      functional: 'Functional',
      chromatic: 'Chromatic',
      diminished: 'Diminished',
      diatonic: 'Diatonic',
      cadence: 'Cadences',
    },
    kind: {
      secondaryDominant: {
        name: 'Secondary dominant',
        why: '{{chord}} is the V7 of {{to}}, the dominant 7th that pulls into it.',
      },
      tritoneSub: {
        name: 'Tritone substitution',
        why: '{{chord}} stands in for the V7 of {{to}} and falls a semitone into it.',
      },
      secondaryTwoFive: {
        name: 'Secondary ii–V',
        why: '{{chord}} and {{next}} are the ii and V of {{to}}.',
      },
      approachBelow: {
        name: 'Chromatic approach from below',
        why: '{{chord}} rises a semitone into {{to}}.',
      },
      walkUp: {
        name: 'Bass walking up',
        why: 'The bass climbs a semitone at a time into {{to}}.',
      },
      walkDown: {
        name: 'Bass walking down',
        why: 'The bass falls a semitone at a time into {{to}}.',
      },
      doubleApproach: {
        name: 'Double chromatic approach',
        why: '{{chord}} and {{next}} close in on {{to}} from a semitone below and above.',
      },
      diminishedApproach: {
        name: 'Diminished approach',
        why: '{{chord}} leads up a semitone into {{to}}.',
      },
      diminishedAbove: {
        name: 'Diminished approach from above',
        why: '{{chord}} slides down a semitone into {{to}}.',
      },
      commonToneDiminished: {
        name: 'Common-tone diminished',
        why: '{{chord}} is built on the root of {{to}} and opens out into it.',
      },
      diatonicWalk: {
        name: 'Walking through the key',
        why: 'The bass steps through the key’s own chords into {{to}}.',
      },
      backdoor: {
        name: 'Backdoor cadence',
        why: '{{chord}} is the ♭VII7 of {{to}}. It comes in by the back door: from a whole tone below, not from the V.',
      },
      backdoorTwoFive: {
        name: 'Backdoor ii–V',
        why: '{{chord}} and {{next}} are the iv and ♭VII7 of {{to}}, borrowed from its minor.',
      },
      plagal: {
        name: 'Plagal cadence',
        why: '{{chord}} is the subdominant (IV) of {{to}}: the “Amen” cadence.',
      },
      minorPlagal: {
        name: 'Minor plagal cadence',
        why: '{{chord}} is the iv of {{to}}, borrowed from its minor.',
      },
      gospelWalkUp: {
        name: 'Gospel walk-up',
        why: '{{chord}} and {{next}} climb by whole tones into {{to}}, borrowed from its minor.',
      },
    },
  },

  reharmonise: {
    note: 'Melody note',
    as: 'as {{degree}}',
    inKey: 'in the key',
    onlyInKey: 'In the key only',
    noneInKey: 'No chord of the key holds {{note}}.',
    showBorrowed: 'Show borrowed chords too',
    group: {
      triads: 'Triads',
      major: 'Major 7ths',
      minor: 'Minor 7ths',
      dominant: 'Dominant 7ths',
    },
  },
  exercises: {
    // The Exercises page's groups.
    groups: {
      technique: 'Finger technique',
      barryHarris: 'Barry Harris',
      jonny: 'Piano With Jonny',
    },
  },
  quiz: {
    // The Quiz page's groups of trainers.
    groups: {
      chords: 'Chords and intervals',
      scales: 'Scales and keys',
      ear: 'By ear',
      reading: 'Reading',
    },
    // The count after a colon reads right for any number, in both languages.
    gaps: 'To check: {{count}}',
  },
  // The Metronome (ADR 0052): its tempo, sound, time signature and beats.
  metronome: {
    info: 'Set the tempo with − and +, the slider, or Tap tempo: tap it in time and the Metronome takes the tempo of your last taps. The first beat of each bar is accented. Space starts and stops it; ↑ and ↓ change the tempo by 1, with Shift by 10.',
    bpm: 'BPM',
    slider: 'Tempo',
    tempo: 'Tempo: {{bpm}} BPM',
    slower: 'Slower by {{step}}',
    faster: 'Faster by {{step}}',
    tap: 'Tap tempo',
    sound: 'Sound',
    sounds: { click: 'Clicks', beep: 'Beeps', drum: 'Drum beat' },
    meter: 'Time signature',
    beats: 'Beats',
    beat: 'Beat {{beat}}',
    start: 'Start',
    stop: 'Stop',
  },
} as const
