import type {
  LibraryProgression,
  ModeLines,
  ProgressionDetails,
  ProgressionStyle,
} from '../model/types'
import { CHARACTERS } from './characters'

/** An entry as written, its character added from `CHARACTERS`. */
type Written = ModeLines & Omit<ProgressionDetails, 'character'>

type Extras = Pick<LibraryProgression, 'pattern' | 'size' | 'mode'>

/** A progression of the library: one idea, with its line in each mode it has. */
const entry = <const Id extends string>(
  style: ProgressionStyle,
  id: Id,
  lines: ModeLines,
  en: string,
  ru: string,
  extras: Extras = {},
): Written & { readonly id: Id } => ({
  id,
  style,
  ...lines,
  name: { en, ru },
  ...extras,
})

/**
 * The Ultimate Piano's progressions by style with the app's own practice
 * progressions among them, one entry for each idea (ADR 0112): its line in a major key, in a minor
 * key, or both. A pop loop's minor line is the same loop heard from its relative minor; a cadence's
 * is its minor-key version, the dominant major. No line is another as a loop, in the same key or the
 * relative one: not from another chord, nor with a chord held. The blues write their 7ths (a blues I is
 * a dominant 7th); the gospel walk-up climbs to I from the flat side; the ♭9 resolution writes the
 * dominant's ♭9. The minor ii–V–i writes plain triads, so it grows with the chord size: the
 * half-diminished ii and the dominant at 7ths, the dominant's ♭9 at 9ths.
 */
const LIBRARY = [
  entry(
    'pop',
    'axis',
    { major: 'I V vi IV', minor: 'i VI III VII' },
    'Axis of Awesome',
    'Axis of Awesome',
    {
      pattern: 'pop8',
    },
  ),
  entry('pop', 'let-it-be', { major: 'I V vi IV I V IV I' }, 'Let It Be', 'Let It Be'),
  entry('pop', 'yesterday', { major: 'I V/vi vi IV V I vi V/V IV I' }, 'Yesterday', 'Yesterday'),
  entry('pop', 'clocks', { major: 'I v v ii' }, 'Clocks', 'Clocks'),
  entry(
    'pop',
    'doo-wop',
    { major: 'I vi IV V', minor: 'i VI VII III' },
    '50s doo-wop',
    'Ду-воп 50-х',
    {
      pattern: 'flow',
    },
  ),
  entry('pop', 'alternative-pop', { major: 'I IV vi V' }, 'Alternative pop', 'Альтернативный поп'),
  entry('pop', 'royal-road', { major: 'IV V iii vi' }, 'Royal Road', 'Royal Road'),
  entry(
    'pop',
    'pachelbel',
    { major: 'I V vi iii IV I IV V' },
    'Pachelbel’s Canon',
    'Канон Пахельбеля',
  ),
  entry('pop', 'line-cliche', { minor: 'i iMaj7 i7 i6' }, 'Minor line cliché', 'Минорное клише'),
  entry('rock', 'rock-shuffle', { major: 'I V IV' }, 'Rock shuffle', 'Рок-шаффл'),
  entry('rock', 'wild-thing', { major: 'I IV V IV' }, 'Wild Thing', 'Wild Thing'),
  entry('rock', 'blues-rock-riff', { minor: 'i III IV' }, 'Blues-rock riff', 'Блюз-роковый рифф'),
  entry('pop', 'creep', { major: 'I III IV iv' }, 'Creep', 'Creep'),
  entry(
    'rock',
    'borrowed-flat-seven',
    { major: 'I ♭VII IV I' },
    'Borrowed ♭VII',
    'Заимствованная ♭VII',
  ),
  entry(
    'jazz',
    'jazz-cadence',
    { major: 'ii V I', minor: 'ii° V i' },
    'Jazz cadence',
    'Джазовая каденция',
    {
      pattern: 'jazz',
      size: 'sevenths',
    },
  ),
  entry(
    'jazz',
    'two-five-chain',
    { major: 'iiø7/iii V7♭9/iii iii7 V7/ii ii7 V7 I6' },
    'ii–V chain',
    'Цепочка ii–V',
  ),
  entry(
    'jazz',
    'fly-me-to-the-moon',
    { major: 'vi ii V I V/IV IV ii°/vi V/vi vi' },
    'Fly Me to the Moon',
    'Fly Me to the Moon',
    {
      size: 'sevenths',
    },
  ),
  entry(
    'jazz',
    'rhythm-changes',
    { major: 'I vi ii V', minor: 'i VI ii° V' },
    'Rhythm changes',
    'Rhythm changes',
  ),
  entry('jazz', 'full-turnaround', { major: 'iii vi ii V' }, 'Full turnaround', 'Полный оборот'),
  entry('jazz', 'sweet-jazz', { major: 'I IV ii V' }, 'Sweet jazz', 'Мягкий джаз'),
  entry(
    'jazz',
    'tritone-substitution',
    { major: 'ii7 ♭II7 Imaj7' },
    'Tritone substitution',
    'Тритоновая замена',
    {
      size: 'sevenths',
    },
  ),
  entry(
    'jazz',
    'flat-nine-resolution',
    { major: 'V7♭9 I', minor: 'V7♭9 i' },
    '♭9 resolution',
    'Разрешение с ♭9',
    {
      size: 'ninths',
    },
  ),
  entry('jazz', 'backdoor', { major: 'iv7 ♭VII7 Imaj7' }, 'Backdoor ii–V', 'Ход «с чёрного хода»'),
  entry(
    'jazz',
    'coltrane',
    { major: 'Imaj7 ♭III7 ♭VImaj7 VII7 IIImaj7 V7 Imaj7' },
    'Coltrane changes',
    'Гармония Колтрейна',
  ),
  entry('jazz', 'ragtime', { major: 'III7 VI7 II7 V7 I' }, 'Ragtime progression', 'Рэгтайм'),
  entry(
    'blues',
    'blues-turnaround',
    { major: 'I7 IV7 I7 V7' },
    'Blues turnaround',
    'Блюзовый оборот',
  ),
  entry(
    'blues',
    'twelve-bar',
    { major: 'I7 I7 I7 I7 IV7 IV7 I7 I7 V7 IV7 I7 V7' },
    '12-bar blues',
    'Блюз, 12 тактов',
    {
      pattern: 'blues',
    },
  ),
  entry(
    'blues',
    'quick-change',
    { major: 'I7 IV7 I7 I7 IV7 IV7 I7 I7 V7 IV7 I7 V7' },
    '12-bar blues, quick change',
    '12-тактовый блюз с быстрой сменой',
  ),
  entry(
    'blues',
    'minor-blues',
    { minor: 'i7 i7 i7 i7 iv7 iv7 i7 i7 VI7 V7 i7 V7' },
    'Minor blues',
    'Минорный блюз',
  ),
  entry(
    'blues',
    'eight-bar',
    { major: 'I7 V7 IV7 IV7 I7 V7 I7 V7' },
    '8-bar blues',
    '8-тактовый блюз',
  ),
  entry(
    'blues',
    'jazz-blues',
    { major: 'I7 IV7 I7 I7 IV7 IV7 I7 VI7 ii7 V7 I7 V7' },
    'Jazz blues',
    'Джазовый блюз',
  ),
  entry(
    'classical',
    'complete-cadence',
    { major: 'I IV V I', minor: 'i iv V i' },
    'Complete cadence',
    'Полная каденция',
  ),
  entry(
    'classical',
    'authentic',
    { major: 'I V I', minor: 'i V i' },
    'Authentic cadence',
    'Автентическая каденция',
  ),
  entry(
    'classical',
    'deceptive',
    { major: 'I IV V vi', minor: 'i iv V VI' },
    'Deceptive cadence',
    'Прерванная каденция',
  ),
  entry(
    'classical',
    'plagal',
    { major: 'I IV I', minor: 'i iv i' },
    'Plagal cadence',
    'Плагальная каденция',
  ),
  entry(
    'classical',
    'andalusian',
    { minor: 'i VII VI V' },
    'Andalusian cadence',
    'Андалузская каденция',
  ),
  entry('classical', 'picardy', { minor: 'i iv V I' }, 'Picardy third', 'Пикардийская терция'),
  entry(
    'classical',
    'amen',
    { major: 'IV iv I' },
    'Minor plagal cadence',
    'Минорная плагальная каденция',
  ),
  entry(
    'classical',
    'phrygian-half',
    { minor: 'iv/3 V' },
    'Phrygian half cadence',
    'Фригийская половинная каденция',
  ),
  entry(
    'classical',
    'neapolitan',
    { minor: 'i ♭II/3 V i' },
    'Neapolitan sixth',
    'Неаполитанский секстаккорд',
  ),
  entry('classical', 'lament', { minor: 'i v/3 iv/3 V' }, 'Lament bass', 'Ламенто'),
  entry('soul', 'neo-soul', { major: 'vi V IV V', minor: 'i VII VI VII' }, 'Neo-soul', 'Нео-соул'),
  entry('gospel', 'gospel-standard', { major: 'I iii IV V' }, 'Gospel standard', 'Госпел-стандарт'),
  entry('gospel', 'gospel-hymn', { major: 'I IV I V' }, 'Gospel hymn', 'Госпел-гимн'),
  entry(
    'gospel',
    'seven-three-six',
    { major: 'vii° III vi ii V I' },
    'Gospel 7–3–6',
    'Госпел 7–3–6',
    {
      size: 'sevenths',
    },
  ),
  entry(
    'gospel',
    'gospel-walk-up',
    { major: '♭VI ♭VII I', minor: 'VI VII i' },
    'Gospel walk-up',
    'Госпел-подход',
  ),
  entry(
    'gospel',
    'diminished-turnaround',
    { major: 'Imaj7 #i°7 ii7 V7' },
    'Diminished turnaround',
    'Оборот с уменьшённым',
  ),
  entry('modal', 'dorian-vamp', { minor: 'i IV' }, 'Dorian vamp', 'Дорийский вамп', {
    mode: 'dorian',
  }),
  entry(
    'modal',
    'dorian-progression',
    { minor: 'i IV v i' },
    'Dorian progression',
    'Дорийская последовательность',
    {
      mode: 'dorian',
    },
  ),
  entry('modal', 'mixolydian-vamp', { major: 'I ♭VII' }, 'Mixolydian vamp', 'Миксолидийский вамп', {
    mode: 'mixolydian',
  }),
  entry('modal', 'lydian-vamp', { major: 'I II' }, 'Lydian vamp', 'Лидийский вамп', {
    mode: 'lydian',
  }),
  entry(
    'modal',
    'lydian-progression',
    { major: 'I II vii I' },
    'Lydian progression',
    'Лидийская последовательность',
    {
      mode: 'lydian',
    },
  ),
  entry('modal', 'phrygian-vamp', { minor: 'i ♭II' }, 'Phrygian vamp', 'Фригийский вамп', {
    mode: 'phrygian',
  }),
  entry(
    'modal',
    'phrygian-progression',
    { minor: 'i ♭II III i' },
    'Phrygian progression',
    'Фригийская последовательность',
    {
      mode: 'phrygian',
    },
  ),
  entry(
    'theory',
    'key-chords',
    { major: 'I ii iii IV V vi vii°', minor: 'i ii° III iv v VI VII' },
    'The chords of the key',
    'Аккорды тональности',
  ),
  entry(
    'theory',
    'round-the-circle',
    { major: 'I IV vii° iii vi ii V I', minor: 'i iv VII III VI ii° V i' },
    'Round the circle',
    'По квинтовому кругу',
    {
      size: 'sevenths',
    },
  ),
  entry(
    'theory',
    'stack-your-chords',
    { major: 'I iv7 i7 v7 ii7 vi7 ♭VI ♭III ♭VII IV' },
    'Stack Your Chords',
    'Stack Your Chords',
  ),
] as const

/** A progression's id, as the library writes it. */
export type ProgressionId = (typeof LIBRARY)[number]['id']

/** The library, style by style in the order written. */
export const PROGRESSION_LIBRARY: readonly LibraryProgression[] = LIBRARY.map((each) => ({
  ...each,
  character: CHARACTERS[each.id],
}))
