import type { Lesson, LessonBlock } from '@/entities/lesson'
import type { LocalText } from '@/shared/i18n'
import {
  arpeggioFingering,
  chordSymbol,
  CIRCLE_OF_FIFTHS,
  midi,
  midiOf,
  noteName,
  numeralChord,
  parseNumerals,
  pitchClassOf,
  placeScale,
  relativeKey,
  runFingering,
  signatureNotes,
  spellChord,
  tonicSpelling,
  writtenOctave,
  type Finger,
  type Hand,
  type Key,
  type Midi,
  type ScaleKind,
  type SpelledNote,
} from '@/shared/lib/music'

// The technique courses' key lessons, one a key, each built from the kernel: its notes, signature,
// fingerings and chords are the kernel's own, so every key's lesson is right by construction.

/** A key's tonic as the app names keys (F♯ major, D♭ major, E♭ minor, G♯ minor), round the circle from C or A. */
const circleTonics = (minor: boolean): SpelledNote[] =>
  CIRCLE_OF_FIFTHS.map((place) =>
    tonicSpelling(pitchClassOf(minor ? place.minor.tonic : place.major.tonic), minor),
  )

/** The twelve major tonics, clockwise round the circle of fifths: C G D A E B F♯ D♭ A♭ E♭ B♭ F. */
export const MAJOR_TONICS: readonly SpelledNote[] = circleTonics(false)
/** The twelve minor tonics, clockwise round the circle: A E B F♯ C♯ G♯ E♭ B♭ F C G D. */
export const MINOR_TONICS: readonly SpelledNote[] = circleTonics(true)

// ── Names ────────────────────────────────────────────────────────────────────────────────────────

const EN_SIGNS = { [-2]: '𝄫', [-1]: '♭', 0: '', 1: '♯', 2: '𝄪' } as const
const RU_LETTERS = { C: 'до', D: 'ре', E: 'ми', F: 'фа', G: 'соль', A: 'ля', B: 'си' } as const
const RU_SIGNS = {
  [-2]: '-дубль-бемоль',
  [-1]: '-бемоль',
  0: '',
  1: '-диез',
  2: '-дубль-диез',
} as const
const ID_SIGNS = { [-2]: '-double-flat', [-1]: '-flat', 0: '', 1: '-sharp', 2: '-double-sharp' }

/** A note as English prose writes it: F♯, B♭. */
export const enNote = (spelled: SpelledNote): string =>
  spelled.letter + EN_SIGNS[spelled.accidental]
/** A note as Russian prose writes it: фа-диез, си-бемоль. */
export const ruNote = (spelled: SpelledNote): string =>
  RU_LETTERS[spelled.letter] + RU_SIGNS[spelled.accidental]

const capital = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1)

/** A key's name: English, and Russian in the three cases a lesson needs (соль мажор, соль мажора, в соль мажоре). */
export function keyNames(key: Key) {
  const ru = ruNote(key.tonic)
  const mode = key.minor ? 'минор' : 'мажор'
  return {
    en: `${enNote(key.tonic)} ${key.minor ? 'minor' : 'major'}`,
    ru: `${ru} ${mode}`,
    ruOf: `${ru} ${mode}а`,
    ruIn: `${ru} ${mode}е`,
  }
}

/** A lesson's id: `c-major`, `f-sharp-major`, `b-flat-minor`. */
export const keyLessonId = (key: Key): string =>
  `${key.tonic.letter.toLowerCase()}${ID_SIGNS[key.tonic.accidental]}-${key.minor ? 'minor' : 'major'}`

const enList = (items: readonly string[]): string =>
  items.length < 2 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`
const ruList = (items: readonly string[]): string =>
  items.length < 2 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} и ${items.at(-1)}`

const EN_NUMBERS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven']
const RU_NUMBERS = ['ноль', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь']

/** "two sharps", «два диеза»: a signature's count of its sign. */
function countOfSigns(count: number, sharp: boolean): LocalText {
  const en = `${EN_NUMBERS[count]} ${sharp ? 'sharp' : 'flat'}${count === 1 ? '' : 's'}`
  const forms = sharp ? ['диез', 'диеза', 'диезов'] : ['бемоль', 'бемоля', 'бемолей']
  const form = count === 1 ? forms[0] : count <= 4 ? forms[1] : forms[2]
  return { en, ru: `${RU_NUMBERS[count]} ${form}` }
}

const RU_FINGERS = ['', 'первый', 'второй', 'третий', 'четвёртый', 'пятый']

/** Fingers as a lesson writes them: 1-2-3-1-2-3-4-5. */
export const fingerText = (fingers: readonly Finger[]): string => fingers.join('-')

// ── The kernel's facts ───────────────────────────────────────────────────────────────────────────

/** A line of notes' token for a key under its spelling: `F#4`, `C♭5`. */
const token = (key: Midi, spelled: SpelledNote): string =>
  `${noteName(spelled)}${writtenOctave(key, spelled)}`

/** A scale's run from its tonic, one octave and the tonic above, with its keys from `octave`. */
function run(tonic: SpelledNote, kind: ScaleKind, octave: number) {
  const shift = 12 * (octave - 4)
  return placeScale(tonic, kind).map((placed) => ({
    note: placed.tone.note,
    midi: midi(placed.midi + shift),
  }))
}

/** A scale's fingers from its tonic up, `octaves` octaves, as the kernel fingers it. */
export function scaleFingers(
  tonic: SpelledNote,
  kind: ScaleKind,
  hand: Hand,
  octaves = 1,
): Finger[] {
  const octave = run(tonic, kind, 4).map((placed) => placed.midi)
  const keys = Array.from({ length: 7 * octaves + 1 }, (_, i) =>
    midi((octave[i % 7] ?? 0) + 12 * Math.floor(i / 7)),
  )
  return runFingering(tonic, kind, 0, keys, hand, 'scale')
}

/** The tonic triad of a key: its three notes, spelled. */
const triad = (key: Key) => spellChord(key.tonic, key.minor ? 'min' : 'maj')

/** The triad's keys from its root in `octave`, up `octaves` octaves to the root on top. */
function arpeggioKeys(key: Key, octave: number, octaves: number) {
  const tones = triad(key)
  const root = midiOf(key.tonic, octave)
  return Array.from({ length: 3 * octaves + 1 }, (_, i) => {
    const tone = tones[i % 3] ?? tones[0]
    if (!tone) throw new RangeError('A triad has its root')
    return { note: tone.note, midi: midi(root + tone.semitones + 12 * Math.floor(i / 3)) }
  })
}

/** An arpeggio's fingers from its root up, `octaves` octaves, as the kernel fingers it. */
export function arpeggioFingers(key: Key, hand: Hand, octaves = 2): Finger[] {
  return arpeggioFingering(
    arpeggioKeys(key, 3, octaves).map((placed) => placed.midi),
    hand,
  )
}

/** The notes a scale's or arpeggio's run gives a finger, by `which`, as note names. */
const notesAt = (
  notes: readonly SpelledNote[],
  fingers: readonly Finger[],
  which: (finger: Finger, i: number) => boolean,
): SpelledNote[] => notes.filter((_, i) => which(fingers[i] ?? 1, i))

/** A key's chord on numerals, as the kernel reads them: `V` in A minor is E. */
export function chordsOn(numerals: string, key: Key): string[] {
  return (parseNumerals(numerals) ?? []).map((numeral) =>
    chordSymbol(numeralChord(numeral, key, 'triads')),
  )
}

// ── Blocks ───────────────────────────────────────────────────────────────────────────────────────

/** A run up and back down in quarters, the last note a half: four bars of 4/4. */
function runLine(notes: readonly { note: SpelledNote; midi: Midi }[]): string {
  const up = notes.map((placed) => token(placed.midi, placed.note))
  const down = [...up].reverse().slice(1)
  const last = down.pop() ?? ''
  return [...up, ...down, `${last}/2`].join(' ')
}

/** A run coming down from its top note in quarters: two bars of 4/4. */
const downLine = (notes: readonly { note: SpelledNote; midi: Midi }[]): string =>
  [...notes]
    .reverse()
    .map((placed) => token(placed.midi, placed.note))
    .join(' ')

/** A chord symbol as prose writes it: F♯m, not F#m. */
const shown = (symbol: string | undefined): string => (symbol ?? '').replace(/#/g, '♯')

/** An arpeggio up two octaves and back in 8ths, the last note a half: two bars of 4/4. */
function arpeggioLine(notes: readonly { note: SpelledNote; midi: Midi }[]): string {
  const up = notes.map((placed) => `${token(placed.midi, placed.note)}/8`)
  const down = [...up].reverse().slice(1)
  const last = (down.pop() ?? '').replace('/8', '/2')
  return [...up, ...down, last].join(' ')
}

/** Where a hand plays a key's run: the right hand from octave 4, the left an octave or two lower. */
const rhOctave = 4
const lhOctave = (tonic: SpelledNote) => (pitchClassOf(tonic) <= 4 ? 3 : 2)

const TRY_IT: LocalText = { en: 'Try it', ru: 'Попробуйте' }
const PRIMARY: LocalText = { en: 'The primary chords', ru: 'Главные трезвучия' }

/** The signature's section text: its count, its notes, and for a minor key its relative major. */
function signatureText(key: Key): LocalText {
  const names = keyNames(key)
  const signs = signatureNotes(key)
  const relative = key.minor ? keyNames(relativeKey(key)) : null
  if (signs.length === 0) {
    return relative
      ? {
          en: `${names.en} has no sharps or flats, just like ${relative.en}, its relative major. Natural ${names.en} uses only white keys.`,
          ru: `В ${names.ruIn} нет ключевых знаков, как и в ${relative.ruIn}, его параллельном мажоре. Натуральный ${names.ru} играется только на белых клавишах.`,
        }
      : {
          en: `${names.en} has no sharps or flats, so its key signature is empty. The scale uses only white keys.`,
          ru: `В ${names.ruIn} нет ни диезов, ни бемолей, поэтому ключевых знаков нет. Гамма играется только на белых клавишах.`,
        }
  }
  const sharp = (signs[0]?.accidental ?? 0) > 0
  const count = countOfSigns(signs.length, sharp)
  const one = signs.length === 1
  const listed = { en: enList(signs.map(enNote)), ru: ruList(signs.map(ruNote)) }
  if (relative) {
    return {
      en: `${names.en} has ${count.en}: ${listed.en}. ${relative.en}, its relative major, has the same signature.`,
      ru: `В ${names.ruIn} ${count.ru}: ${listed.ru}. Те же знаки у его параллельного мажора, ${relative.ruOf}.`,
    }
  }
  return {
    en: `${names.en} has ${count.en}: ${listed.en}. The key signature writes ${one ? 'it' : 'them'} once at the start of every line, and ${one ? 'it holds' : 'they hold'} in every octave.`,
    ru: `В ${names.ruIn} ${count.ru}: ${listed.ru}. Ключевые знаки пишут ${one ? 'его' : 'их'} один раз в начале каждой строки, и ${one ? 'он действует' : 'они действуют'} во всех октавах.`,
  }
}

/** The right hand's run in words: its fingers up, and where the thumb passes under. */
function rightHandText(notes: readonly SpelledNote[], fingers: readonly Finger[]): LocalText {
  const under = notesAt(notes, fingers, (finger, i) => finger === 1 && i > 0)
  return {
    en: `Up: ${fingerText(fingers)}. The thumb passes under the hand to play ${enList(under.map(enNote))}. Coming down, use the same fingers in reverse.`,
    ru: `Вверх: ${fingerText(fingers)}. Большой палец подкладывается под руку на ${ruList(under.map(ruNote))}. Вниз — те же пальцы в обратном порядке.`,
  }
}

/** The left hand's run in words: its fingers up, and each finger that crosses over the thumb. */
function leftHandText(notes: readonly SpelledNote[], fingers: readonly Finger[]): LocalText {
  const over = notes.flatMap((spelled, i) => {
    const finger = fingers[i]
    return i > 0 && fingers[i - 1] === 1 && finger !== undefined && finger !== 1
      ? [{ finger, spelled }]
      : []
  })
  const [first, ...rest] = over
  const crossing: LocalText = !first
    ? { en: '', ru: '' }
    : rest.length === 0
      ? {
          en: ` Finger ${first.finger} crosses over the thumb to ${enNote(first.spelled)}.`,
          ru: ` ${capital(RU_FINGERS[first.finger] ?? '')} палец перекладывается через большой на ${ruNote(first.spelled)}.`,
        }
      : {
          en: ` Over the thumb, ${enList(over.map((each) => `${each.finger} crosses to ${enNote(each.spelled)}`))}.`,
          ru: ` Через большой палец перекладываются: ${ruList(over.map((each) => `${RU_FINGERS[each.finger]} на ${ruNote(each.spelled)}`))}.`,
        }
  return {
    en: `Up: ${fingerText(fingers)}.${crossing.en} Coming down, use the same fingers in reverse.`,
    ru: `Вверх: ${fingerText(fingers)}.${crossing.ru} Вниз — те же пальцы в обратном порядке.`,
  }
}

/** The notes both thumbs play at once in a two-octave run, an octave apart. */
function thumbsTogether(tonic: SpelledNote, kind: ScaleKind): SpelledNote[] {
  const rh = scaleFingers(tonic, kind, 'rh', 2)
  const lh = scaleFingers(tonic, kind, 'lh', 2)
  const notes = run(tonic, kind, 4).map((placed) => placed.note)
  const met = rh.flatMap((finger, i) => (finger === 1 && lh[i] === 1 ? [i % 7] : []))
  return [...new Set(met)].flatMap((degree) => notes.slice(degree, degree + 1))
}

function togetherSteps(tonic: SpelledNote, kind: ScaleKind): LocalText[] {
  const met = thumbsTogether(tonic, kind)
  return [
    {
      en: 'Practise each hand alone, slowly, until the fingers come without thinking.',
      ru: 'Играйте каждой рукой отдельно и медленно, пока пальцы не пойдут сами.',
    },
    met.length > 0
      ? {
          en: `Then play hands together over two octaves. Both thumbs land on ${enList(met.map(enNote))} at the same moment.`,
          ru: `Затем играйте двумя руками на две октавы. Оба больших пальца одновременно берут ${ruList(met.map(ruNote))}.`,
        }
      : {
          en: 'Then play hands together over two octaves. The thumbs never play at the same moment, so watch each crossing.',
          ru: 'Затем играйте двумя руками на две октавы. Большие пальцы ни разу не совпадают, поэтому следите за каждым подкладыванием.',
        },
  ]
}

const say = (text: LocalText): LessonBlock => ({ kind: 'text', text })

// ── Major and minor scales ───────────────────────────────────────────────────────────────────────

/** A major key's lesson: its scale, signature, each hand's fingers, hands together, its chords, Try it. */
export function majorScaleLesson(tonic: SpelledNote): Lesson {
  const key: Key = { tonic, minor: false }
  const names = keyNames(key)
  const rh = run(tonic, 'major', rhOctave)
  const lh = run(tonic, 'major', lhOctave(tonic))
  const notes = rh.map((placed) => placed.note)
  const rhFingers = scaleFingers(tonic, 'major', 'rh')
  const lhFingers = scaleFingers(tonic, 'major', 'lh')
  const primary = chordsOn('I IV V', key)
  const [one, four, five] = primary
  const signs = signatureNotes(key).length
  const sharp = (signatureNotes(key)[0]?.accidental ?? 0) > 0
  const signWords: LocalText =
    signs === 1
      ? { en: sharp ? 'sharp' : 'flat', ru: sharp ? 'ноту с диезом' : 'ноту с бемолем' }
      : { en: sharp ? 'sharps' : 'flats', ru: sharp ? 'все ноты с диезами' : 'все ноты с бемолями' }
  return {
    id: keyLessonId(key),
    title: { en: names.en, ru: capital(names.ru) },
    summary: {
      en: `Learn the ${names.en} scale: its notes and key signature, the fingering for each hand and its three primary chords.`,
      ru: `Гамма ${names.ru}: её ноты и ключевые знаки, аппликатура каждой руки и три главных трезвучия.`,
    },
    sections: [
      {
        heading: { en: `The notes of ${names.en}`, ru: `Ноты ${names.ruOf}` },
        blocks: [
          { kind: 'scale', root: tonic, scale: 'major' },
          say({
            en: `${names.en} starts on ${enNote(tonic)} and climbs by the major pattern: whole, whole, half, whole, whole, whole, half. Its notes are ${notes.map(enNote).join(' ')}.`,
            ru: `${capital(names.ru)} начинается с ${ruNote(tonic)} и поднимается по схеме мажора: тон, тон, полутон, тон, тон, тон, полутон. Его ноты: ${notes.map(ruNote).join(', ')}.`,
          }),
        ],
      },
      {
        heading: { en: 'The key signature', ru: 'Ключевые знаки' },
        blocks: [
          { kind: 'notes', clef: 'treble', notes: downLine(rh), key },
          say(signatureText(key)),
        ],
      },
      {
        heading: { en: 'Right hand', ru: 'Правая рука' },
        blocks: [
          { kind: 'notes', clef: 'treble', notes: runLine(rh), key },
          say(rightHandText(notes, rhFingers)),
        ],
      },
      {
        heading: { en: 'Left hand', ru: 'Левая рука' },
        blocks: [
          { kind: 'notes', clef: 'bass', notes: runLine(lh), key },
          say(leftHandText(notes, lhFingers)),
        ],
      },
      {
        heading: { en: 'Hands together', ru: 'Двумя руками' },
        blocks: [
          { kind: 'steps', steps: togetherSteps(tonic, 'major') },
          { kind: 'scale', root: tonic, scale: 'major' },
        ],
      },
      {
        heading: { en: 'The key’s main chords', ru: 'Три главных аккорда' },
        blocks: [
          { kind: 'progression', numerals: 'I IV V I', key },
          {
            kind: 'text',
            lead: PRIMARY,
            text: {
              en: `are the chords on the 1st, 4th and 5th notes: ${shown(one)}, ${shown(four)} and ${shown(five)}, or I, IV and V. Together they hold every note of ${names.en}.`,
              ru: `— трезвучия на I, IV и V ступенях: ${shown(one)}, ${shown(four)} и ${shown(five)}. Вместе они содержат все ноты ${names.ruOf}.`,
            },
          },
        ],
      },
      {
        heading: TRY_IT,
        blocks: [
          {
            kind: 'question',
            ask: {
              en: `Play ${names.en} up one octave from its tonic.`,
              ru: `Сыграйте гамму ${names.ru} вверх на октаву от тоники.`,
            },
            answer: { notes: notes.map(noteName), rising: true },
          },
          {
            kind: 'question',
            ask: {
              en: `Play the V chord of ${names.en}.`,
              ru: `Сыграйте трезвучие V ступени ${names.ruOf}.`,
            },
            answer: { chord: five ?? '' },
          },
          {
            kind: 'question',
            ask: {
              en:
                signs === 0
                  ? 'Play the IV chord of C major.'
                  : `Play the ${signWords.en} in ${names.en}’s key signature.`,
              ru:
                signs === 0
                  ? 'Сыграйте трезвучие IV ступени до мажора.'
                  : `Сыграйте ${signWords.ru} из ключевых знаков ${names.ruOf}.`,
            },
            answer:
              signs === 0 ? { chord: four ?? '' } : { notes: signatureNotes(key).map(noteName) },
          },
          {
            kind: 'link',
            title: { en: `${names.en} in the Player`, ru: `${capital(names.ru)} в плеере` },
            target: { opens: 'exercise', exercise: 'scale', root: tonic },
          },
          {
            kind: 'link',
            title: { en: `${names.en} in Scales`, ru: `${capital(names.ru)} в гаммах` },
            target: { opens: 'scales', root: tonic, scale: 'major' },
          },
          {
            kind: 'link',
            title: { en: 'Build scales in the Quiz', ru: 'Построение гамм в тестах' },
            target: { opens: 'quiz', trainer: 'build-scale' },
          },
        ],
      },
    ],
  }
}

const MINOR_FORMS = ['natural', 'harmonic', 'melodic'] as const
type MinorForm = (typeof MINOR_FORMS)[number]
const FORM_NAMES: Readonly<Record<MinorForm, LocalText>> = {
  natural: { en: 'natural', ru: 'натуральный' },
  harmonic: { en: 'harmonic', ru: 'гармонический' },
  melodic: { en: 'melodic', ru: 'мелодический' },
}

/** The forms whose fingers differ from natural minor's in a hand, with their fingers. */
function otherFingerings(tonic: SpelledNote, hand: Hand): LocalText {
  const natural = fingerText(scaleFingers(tonic, 'natural', hand))
  const own = MINOR_FORMS.slice(1).filter(
    (form) => fingerText(scaleFingers(tonic, form, hand)) !== natural,
  )
  if (own.length === 0) {
    return {
      en: ' Harmonic and melodic minor use the same fingers.',
      ru: ' В гармоническом и мелодическом миноре пальцы те же.',
    }
  }
  return {
    en: own
      .map(
        (form) =>
          ` ${capital(FORM_NAMES[form].en)} minor, up: ${fingerText(scaleFingers(tonic, form, hand))}.`,
      )
      .join(''),
    ru: own
      .map(
        (form) =>
          ` ${capital(FORM_NAMES[form].ru)} минор вверх: ${fingerText(scaleFingers(tonic, form, hand))}.`,
      )
      .join(''),
  }
}

/** The raised notes of harmonic or melodic minor, as the kernel spells them. */
function raised(tonic: SpelledNote, form: MinorForm): SpelledNote[] {
  const natural = run(tonic, 'natural', 4)
  return run(tonic, form, 4)
    .filter((placed, i) => placed.midi !== natural[i]?.midi)
    .map((placed) => placed.note)
}

/** A minor key's lesson: its three forms, signature, each hand's fingers, its chords, Try it. */
export function minorScaleLesson(tonic: SpelledNote): Lesson {
  const key: Key = { tonic, minor: true }
  const names = keyNames(key)
  const rh = run(tonic, 'natural', rhOctave)
  const lh = run(tonic, 'natural', lhOctave(tonic))
  const notes = rh.map((placed) => placed.note)
  const [seventh] = raised(tonic, 'harmonic')
  const sixthSeventh = raised(tonic, 'melodic')
  const from = (degree: number) => notes[degree] ?? tonic
  const raisedEn = (degree: number, to: SpelledNote) => `${enNote(from(degree))} to ${enNote(to)}`
  const raisedRu = (degree: number, to: SpelledNote) => `${ruNote(from(degree))} — ${ruNote(to)}`
  const primary = chordsOn('i iv V', key)
  const [, four, five] = primary
  const formNotes = (form: MinorForm) => run(tonic, form, 4).map((placed) => noteName(placed.note))
  return {
    id: keyLessonId(key),
    title: { en: names.en, ru: capital(names.ru) },
    summary: {
      en: `Learn ${names.en} in its natural, harmonic and melodic forms: its key signature, the fingering for each hand and its primary chords.`,
      ru: `${capital(names.ru)} в натуральном, гармоническом и мелодическом виде: ключевые знаки, аппликатура каждой руки и главные трезвучия.`,
    },
    sections: [
      {
        heading: { en: 'Natural minor', ru: 'Натуральный минор' },
        blocks: [
          { kind: 'scale', root: tonic, scale: 'natural' },
          say({
            en: `Natural ${names.en} starts on ${enNote(tonic)} and climbs whole, half, whole, whole, half, whole, whole. Its notes are ${notes.map(enNote).join(' ')}.`,
            ru: `Натуральный ${names.ru} начинается с ${ruNote(tonic)} и поднимается так: тон, полутон, тон, тон, полутон, тон, тон. Его ноты: ${notes.map(ruNote).join(', ')}.`,
          }),
        ],
      },
      {
        heading: { en: 'The key signature', ru: 'Ключевые знаки' },
        blocks: [
          { kind: 'notes', clef: 'treble', notes: downLine(rh), key },
          say(signatureText(key)),
        ],
      },
      {
        heading: { en: 'Harmonic minor', ru: 'Гармонический минор' },
        blocks: [
          { kind: 'scale', root: tonic, scale: 'harmonic' },
          say({
            en: `Harmonic minor raises the 7th note a half step, from ${raisedEn(6, seventh ?? tonic)}. The raised note leans up into the tonic and makes the V chord major.`,
            ru: `Гармонический минор повышает седьмую ступень на полутон: ${raisedRu(6, seventh ?? tonic).replace(' — ', ' становится ')}. Повышенный звук тянется к тонике и делает трезвучие V ступени мажорным.`,
          }),
        ],
      },
      {
        heading: { en: 'Melodic minor', ru: 'Мелодический минор' },
        blocks: [
          { kind: 'scale', root: tonic, scale: 'melodic' },
          say({
            en: `On the way up, melodic minor raises the 6th and 7th notes: ${enList(sixthSeventh.map((to, i) => raisedEn(5 + i, to)))}. On the way down, it plays natural minor.`,
            ru: `На пути вверх мелодический минор повышает шестую и седьмую ступени: ${ruList(sixthSeventh.map((to, i) => raisedRu(5 + i, to)))}. Вниз играется натуральный минор.`,
          }),
        ],
      },
      {
        heading: { en: 'Right hand', ru: 'Правая рука' },
        blocks: [
          { kind: 'notes', clef: 'treble', notes: runLine(rh), key },
          say(
            joined(
              rightHandText(notes, scaleFingers(tonic, 'natural', 'rh')),
              otherFingerings(tonic, 'rh'),
            ),
          ),
        ],
      },
      {
        heading: { en: 'Left hand', ru: 'Левая рука' },
        blocks: [
          { kind: 'notes', clef: 'bass', notes: runLine(lh), key },
          say(
            joined(
              leftHandText(notes, scaleFingers(tonic, 'natural', 'lh')),
              otherFingerings(tonic, 'lh'),
            ),
          ),
        ],
      },
      {
        heading: { en: 'Hands together', ru: 'Двумя руками' },
        blocks: [
          { kind: 'steps', steps: togetherSteps(tonic, 'natural') },
          { kind: 'scale', root: tonic, scale: 'harmonic' },
        ],
      },
      {
        heading: { en: 'The key’s main chords', ru: 'Три главных аккорда' },
        blocks: [
          { kind: 'progression', numerals: 'i iv V i', key },
          {
            kind: 'text',
            lead: PRIMARY,
            text: {
              en: `are the chords on the 1st, 4th and 5th notes: ${enList(primary.map(shown))}, or i, iv and V. The V chord is major because it takes harmonic minor’s raised 7th.`,
              ru: `— трезвучия на I, IV и V ступенях (i, iv, V): ${ruList(primary.map(shown))}. Трезвучие V ступени мажорное, потому что берёт повышенную седьмую ступень гармонического минора.`,
            },
          },
        ],
      },
      {
        heading: TRY_IT,
        blocks: [
          {
            kind: 'question',
            ask: {
              en: `Play natural ${names.en} up one octave.`,
              ru: `Сыграйте натуральный ${names.ru} вверх на октаву.`,
            },
            answer: { notes: formNotes('natural'), rising: true },
          },
          {
            kind: 'question',
            ask: {
              en: `Play harmonic ${names.en} up one octave.`,
              ru: `Сыграйте гармонический ${names.ru} вверх на октаву.`,
            },
            answer: { notes: formNotes('harmonic'), rising: true },
          },
          {
            kind: 'question',
            ask: {
              en: `Play melodic ${names.en} up one octave.`,
              ru: `Сыграйте мелодический ${names.ru} вверх на октаву.`,
            },
            answer: { notes: formNotes('melodic'), rising: true },
          },
          {
            kind: 'question',
            ask: {
              en: `Play the V chord of ${names.en}.`,
              ru: `Сыграйте трезвучие V ступени ${names.ruOf}.`,
            },
            answer: { chord: five ?? '' },
          },
          {
            kind: 'question',
            ask: {
              en: `Play the iv chord of ${names.en}.`,
              ru: `Сыграйте трезвучие iv ступени ${names.ruOf}.`,
            },
            answer: { chord: four ?? '' },
          },
          ...MINOR_FORMS.map((form): LessonBlock => ({
            kind: 'link',
            title: {
              en: `${capital(FORM_NAMES[form].en)} ${names.en} in the Player`,
              ru: `${capital(FORM_NAMES[form].ru)} ${names.ru} в плеере`,
            },
            target: { opens: 'exercise', exercise: 'scale', root: tonic, kind: form },
          })),
          ...MINOR_FORMS.map((form): LessonBlock => ({
            kind: 'link',
            title: {
              en: `${capital(FORM_NAMES[form].en)} ${names.en} in Scales`,
              ru: `${capital(FORM_NAMES[form].ru)} ${names.ru} в гаммах`,
            },
            target: { opens: 'scales', root: tonic, scale: form },
          })),
          {
            kind: 'link',
            title: { en: 'Build scales in the Quiz', ru: 'Построение гамм в тестах' },
            target: { opens: 'quiz', trainer: 'build-scale' },
          },
        ],
      },
    ],
  }
}

const joined = (a: LocalText, b: LocalText): LocalText => ({ en: a.en + b.en, ru: a.ru + b.ru })

// ── Arpeggios ────────────────────────────────────────────────────────────────────────────────────

/** An arpeggio's hand in words: its fingers up two octaves, the note the thumb plays, the crossing. */
function arpeggioHandText(key: Key, hand: Hand): LocalText {
  const fingers = arpeggioFingers(key, hand)
  const notes = arpeggioKeys(key, 3, 2).map((placed) => placed.note)
  const thumb = notes[fingers.indexOf(1)] ?? key.tonic
  const after = fingers[fingers.indexOf(1) + 1] ?? 2
  // The outer note on the thumb's tone takes 5: the top one in the right hand, the bottom in the left.
  const outer = hand === 'rh' ? fingers.at(-1) : fingers[0]
  const fifth = outer === 5
  if (hand === 'rh') {
    return fifth
      ? {
          en: `Up: ${fingerText(fingers)}. The thumb passes under to each ${enNote(thumb)}, and finger 5 takes the top one.`,
          ru: `Вверх: ${fingerText(fingers)}. Большой палец подкладывается на каждую ноту ${ruNote(thumb)}, а верхнюю берёт пятый.`,
        }
      : {
          en: `Up: ${fingerText(fingers)}. The thumb passes under to each ${enNote(thumb)}, and finger ${outer} takes the top note.`,
          ru: `Вверх: ${fingerText(fingers)}. Большой палец подкладывается на каждую ноту ${ruNote(thumb)}, а верхнюю ноту берёт ${RU_FINGERS[outer ?? 1]}.`,
        }
  }
  return {
    en: `Up: ${fingerText(fingers)}. The thumb plays each ${enNote(thumb)}${fifth ? ' above the bottom one' : ''}, and finger ${after} crosses over it. Coming down, use the same fingers in reverse.`,
    ru: `Вверх: ${fingerText(fingers)}. Большой палец берёт каждую ноту ${ruNote(thumb)}${fifth ? ', кроме нижней,' : ''} и ${RU_FINGERS[after]} перекладывается через него. Вниз — в обратном порядке.`,
  }
}

/** A key's arpeggio lesson: its triad, the two-octave run in each hand, its inversions, Try it. */
export function arpeggioLesson(key: Key): Lesson {
  const names = keyNames(key)
  const tones = triad(key)
  const symbol = chordSymbol({ root: key.tonic, quality: key.minor ? 'min' : 'maj' })
  const [, third, fifth] = tones
  const rhOct = pitchClassOf(key.tonic) <= 4 ? 4 : 3
  const voicing = (inversion: number) => {
    const bass = tones[inversion] ?? tones[0]
    if (!bass) throw new RangeError('A triad has its root')
    const root = midiOf(key.tonic, 3)
    const keys = Array.from({ length: 3 }, (_, i) => {
      const at = inversion + i
      const tone = tones[at % 3] ?? bass
      return token(midi(root + tone.semitones + 12 * Math.floor(at / 3)), tone.note)
    })
    const bassKey = midi(root - 12 + bass.semitones)
    const written =
      inversion === 0
        ? symbol
        : chordSymbol({ root: key.tonic, quality: key.minor ? 'min' : 'maj', bass: bass.note })
    return { symbol: written, hands: `${token(bassKey, bass.note)} | ${keys.join(' ')}` }
  }
  const noteNames = tones.map((tone) => tone.note)
  return {
    id: keyLessonId(key),
    title: { en: names.en, ru: capital(names.ru) },
    summary: {
      en: `Learn the ${names.en} arpeggio over two octaves: its three notes, the fingering for each hand and its inversions.`,
      ru: `Арпеджио ${names.ruOf} на две октавы: три его звука, аппликатура каждой руки и обращения.`,
    },
    sections: [
      {
        heading: { en: 'The chord', ru: 'Аккорд' },
        blocks: [
          { kind: 'chords', symbols: [symbol] },
          {
            kind: 'text',
            lead: { en: 'An arpeggio', ru: 'Арпеджио' },
            text: {
              en: `plays a chord’s notes one at a time, up and down the keyboard. The ${names.en} triad is ${enList(noteNames.map(enNote))}.`,
              ru: `— звуки аккорда, сыгранные по одному, вверх и вниз по клавиатуре. Трезвучие ${names.ruOf}: ${ruList(noteNames.map(ruNote))}.`,
            },
          },
        ],
      },
      {
        heading: { en: 'Right hand', ru: 'Правая рука' },
        blocks: [
          { kind: 'notes', clef: 'treble', notes: arpeggioLine(arpeggioKeys(key, rhOct, 2)), key },
          say(arpeggioHandText(key, 'rh')),
        ],
      },
      {
        heading: { en: 'Left hand', ru: 'Левая рука' },
        blocks: [
          { kind: 'notes', clef: 'bass', notes: arpeggioLine(arpeggioKeys(key, 2, 2)), key },
          say(arpeggioHandText(key, 'lh')),
        ],
      },
      {
        heading: { en: 'Hands together', ru: 'Двумя руками' },
        blocks: [
          {
            kind: 'steps',
            steps: [
              {
                en: 'Practise each hand alone, slowly. Keep the wrist loose and let it carry the hand along.',
                ru: 'Играйте каждой рукой отдельно и медленно. Запястье свободное, оно ведёт руку за собой.',
              },
              {
                en: 'Then play both hands together, keeping every note even.',
                ru: 'Затем играйте двумя руками вместе, ровно на каждом звуке.',
              },
            ],
          },
          { kind: 'chords', symbols: [symbol] },
        ],
      },
      {
        heading: { en: 'Its inversions', ru: 'Обращения' },
        blocks: [
          { kind: 'voicings', voicings: [0, 1, 2].map(voicing), key },
          say({
            en: `Start the arpeggio on ${enNote(third?.note ?? key.tonic)} or ${enNote(fifth?.note ?? key.tonic)} instead of the root, and it runs from an inversion. The thumb lands on different notes, so learn the fingering of each.`,
            ru: `Начните арпеджио не с основного тона, а с ${ruNote(third?.note ?? key.tonic)} или ${ruNote(fifth?.note ?? key.tonic)}, и оно пойдёт от обращения. Большой палец попадает на другие ноты, поэтому учите аппликатуру каждого.`,
          }),
        ],
      },
      {
        heading: TRY_IT,
        blocks: [
          {
            kind: 'question',
            ask: { en: `Play the ${names.en} triad.`, ru: `Сыграйте трезвучие ${names.ruOf}.` },
            answer: { chord: symbol },
          },
          {
            kind: 'question',
            ask: {
              en: `Play the ${names.en} arpeggio up one octave from its root.`,
              ru: `Сыграйте арпеджио ${names.ruOf} вверх на октаву от основного тона.`,
            },
            answer: { notes: [...noteNames, key.tonic].map(noteName), rising: true },
          },
          {
            kind: 'link',
            title: {
              en: `${names.en} arpeggio in the Player`,
              ru: `Арпеджио ${names.ruOf} в плеере`,
            },
            target: {
              opens: 'exercise',
              exercise: 'arpeggio',
              root: key.tonic,
              quality: key.minor ? 'min' : 'maj',
            },
          },
          {
            kind: 'link',
            title: { en: `${shown(symbol)} in Chords`, ru: `${shown(symbol)} в аккордах` },
            target: { opens: 'chords', chord: symbol },
          },
          {
            kind: 'link',
            title: { en: 'Build chords in the Quiz', ru: 'Построение аккордов в тестах' },
            target: { opens: 'quiz', trainer: 'build-chord' },
          },
        ],
      },
    ],
  }
}
