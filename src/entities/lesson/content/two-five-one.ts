import { note, numeralsParam, parseNumerals, withLeadIns } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }
const C_MINOR = { tonic: note('C'), minor: true }
const D_MAJOR = { tonic: note('D'), minor: false }

/** A line of C major's chords, each led into by its own ii–V, as the Progressions page leads it. */
const ledByTwoFive = (line: string): string =>
  numeralsParam(withLeadIns(parseNumerals(line) ?? [], 'ii-v', C_MAJOR))

/** A ii–V–I to each chord of the key, up its scale. */
const TO_EVERY_CHORD = ledByTwoFive('I ii iii IV V vi vii°')
/** The same, the key's chords a 5th apart. */
const ROUND_THE_KEY = ledByTwoFive('I IV vii° iii vi ii V')

const twoFiveOne: Lesson = {
  id: 'two-five-one',
  title: { en: 'The ii–V–I', ru: 'Оборот ii–V–I' },
  summary: {
    en: 'Jazz’s cadence in 7th chords: its voices, in major and minor, in every key.',
    ru: 'Главный оборот джаза в септаккордах: голоса, мажор и минор, все тональности.',
  },
  level: 3,
  category: 'jazz',
  module: 'accompaniment',
  sections: [
    {
      heading: { en: 'Subdominant, dominant, tonic', ru: 'Субдоминанта, доминанта, тоника' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'ii stands for the subdominant. Jazz plays all three as 7th chords, the roots falling a 5th each time.',
            ru: 'ii заменяет субдоминанту. Джаз играет все три аккорда септаккордами, и основные тоны каждый раз опускаются на квинту.',
          },
        },
        { kind: 'progression', numerals: 'ii V I', key: C_MAJOR, size: 'sevenths' },
        {
          kind: 'note',
          text: {
            en: 'That is the chords’ roots. The bass may take any note of the chord.',
            ru: 'Речь об основных тонах. Бас может взять любую ноту аккорда.',
          },
        },
      ],
    },
    {
      heading: { en: 'How the voices move', ru: 'Как движутся голоса' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The 3rd of each chord becomes the 7th of the next, and the 7th becomes the 3rd.',
            ru: 'Терция каждого аккорда становится септимой следующего, а септима — терцией.',
          },
        },
        { kind: 'chords', symbols: ['Dm7', 'G7', 'C6'] },
        {
          kind: 'note',
          text: {
            en: 'Tense notes fall a step and common notes stay. C6 can stand for Cmaj7.',
            ru: 'Неустойчивые звуки опускаются на ступень, общие остаются. C6 может заменить Cmaj7.',
          },
        },
      ],
    },
    {
      heading: { en: 'In minor', ru: 'В миноре' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'In minor, ii is half-diminished, V takes the raised 7th degree, often with a ♭9, and the tonic is often a minor 6th chord.',
            ru: 'В миноре ii полууменьшённый, V берёт повышенную VII ступень, часто с ♭9, а тоникой часто бывает минорный аккорд с секстой.',
          },
        },
        { kind: 'progression', numerals: 'iiø7 V7 i', key: C_MINOR },
        { kind: 'chords', symbols: ['Dm7♭5', 'G7♭9', 'Cm6'] },
        {
          kind: 'text',
          text: {
            en: 'Em7♭5–A7, D minor’s ii–V, visits another key for a moment.',
            ru: 'Em7♭5–A7, ii–V ре минора, ненадолго уводит в другую тональность.',
          },
        },
        { kind: 'chords', symbols: ['Em7♭5', 'A7', 'Dm7'] },
      ],
    },
    {
      heading: { en: 'Exercise 1: every key', ru: 'Упражнение 1: все тональности' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play it in close position, up by semitones or tones. Then go down the circle of fifths: each I turns into the next key’s ii, so the keys fall a tone (C, B♭, A♭…).',
            ru: 'Играйте его в тесном расположении вверх по полутонам или тонам. Затем идите вниз по квинтовому кругу: каждый I превращается в ii следующей тональности, и тональности опускаются на тон (C, B♭, A♭…).',
          },
        },
        { kind: 'chords', symbols: ['Dm7', 'G7', 'Cmaj7', 'Cm7', 'F7', 'B♭maj7'] },
        {
          kind: 'link',
          title: { en: 'Step 1: up by semitones', ru: 'Шаг 1: вверх по полутонам' },
          target: {
            place: 'player',
            numerals: 'ii V I',
            key: C_MAJOR,
            size: 'sevenths',
            walk: 'semitones-up',
          },
        },
        {
          kind: 'link',
          title: {
            en: 'Step 2: down the circle of fifths, each I the next ii',
            ru: 'Шаг 2: вниз по квинтовому кругу, каждый I — следующий ii',
          },
          target: {
            place: 'player',
            numerals: 'ii V I',
            key: C_MAJOR,
            size: 'sevenths',
            walk: 'tones-down',
          },
        },
      ],
    },
    {
      heading: { en: 'Every chord of the key', ru: 'Каждый аккорд тональности' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Make each chord of the key home in turn: a ii–V–I to C, then Dm, Em, F, G, Am and B°.',
            ru: 'По очереди делайте каждый аккорд тональности тоникой: ii–V–I к C, затем к Dm, Em, F, G, Am и B°.',
          },
        },
        {
          kind: 'progression',
          numerals: TO_EVERY_CHORD,
          key: C_MAJOR,
          size: 'sevenths',
        },
        {
          kind: 'note',
          text: {
            en: 'A minor chord takes the minor ii–V.',
            ru: 'К минорному аккорду ведёт минорный ii–V.',
          },
        },
        {
          kind: 'link',
          title: { en: 'Up the scale in the Player', ru: 'Вверх по гамме в плеере' },
          target: { place: 'player', numerals: TO_EVERY_CHORD, key: C_MAJOR, size: 'sevenths' },
        },
        {
          kind: 'link',
          title: { en: 'Round the circle in the key', ru: 'По квинтовому кругу в тональности' },
          target: {
            place: 'player',
            numerals: ROUND_THE_KEY,
            key: C_MAJOR,
            size: 'sevenths',
          },
        },
      ],
    },
    {
      heading: { en: 'Exercise 2: with 9ths', ru: 'Упражнение 2: с нонами' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Leave the root to the bass. Play each 9th chord from its 3rd (3-5-7-9), then from its 7th (7-9-3-5).',
            ru: 'Основной тон оставьте басу. Играйте каждый нонаккорд от терции (3-5-7-9), затем от септимы (7-9-3-5).',
          },
        },
        {
          kind: 'quiz',
          ask: { en: 'Play Dm9 from its 3rd.', ru: 'Сыграйте Dm9 от терции.' },
          answer: { notes: ['F', 'A', 'C', 'E'] },
        },
        {
          kind: 'link',
          title: {
            en: 'Step 1: from the 3rd, up by semitones',
            ru: 'Шаг 1: от терции, вверх по полутонам',
          },
          target: {
            place: 'player',
            numerals: 'ii V I',
            key: C_MAJOR,
            size: 'ninths',
            inversion: 1,
            walk: 'semitones-up',
          },
        },
        {
          kind: 'link',
          title: {
            en: 'Step 2: from the 7th, down the circle of fifths',
            ru: 'Шаг 2: от септимы, вниз по квинтовому кругу',
          },
          target: {
            place: 'player',
            numerals: 'ii V I',
            key: C_MAJOR,
            size: 'ninths',
            inversion: 3,
            walk: 'tones-down',
          },
        },
      ],
    },
    {
      heading: { en: 'In a song', ru: 'В песне' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'In “As the Deer” ii–V–Is close the phrases on a long note. The second leads to Bm, so its ii and V are B minor’s.',
            ru: 'В песне «Как олень спешит к воде» обороты ii–V–I завершают фразы на долгой ноте. Второй ведёт в си минор, поэтому его ii и V — из си минора.',
          },
        },
        {
          kind: 'voicings',
          key: D_MAJOR,
          voicings: [
            { symbol: 'Em9', caption: 'ii', degrees: '1 | ♭3 5 ♭7 9', hands: 'E3 | G3 B3 D4 F♯4' },
            { symbol: 'A7♭9', caption: 'V', degrees: '1 | ♭7 ♭9 3 5', hands: 'A2 | G3 B♭3 C♯4 E4' },
            { symbol: 'DMaj9', caption: 'I', degrees: '1 | 3 5 7 9', hands: 'D3 | F♯3 A3 C♯4 E4' },
            {
              symbol: 'C♯m7♭5',
              caption: 'ii/vi',
              degrees: '1 | ♭5 ♭7 ♭3',
              hands: 'C♯3 | G3 B3 E4',
            },
            { symbol: 'F♯7♯9', caption: 'V/vi', degrees: '1 | 3 ♭7 ♯9', hands: 'F♯2 | A♯3 E4 A4' },
            { symbol: 'Bm9', caption: 'vi', degrees: '1 | ♭7 9 ♭3 5', hands: 'B2 | A3 C♯4 D4 F♯4' },
          ],
        },
        {
          kind: 'note',
          text: {
            en: 'F♯7♯9 sounds sharp: a major 7th spans the right hand.',
            ru: 'F♯7♯9 звучит резко: по краям правой руки большая септима.',
          },
        },
      ],
    },
    {
      heading: { en: 'A13♭9 as two chords', ru: 'A13♭9 как два аккорда' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A13♭9 is easy to find as two chords: A7 in the left hand, an F♯ major triad in the right.',
            ru: 'A13♭9 легко найти как два аккорда: A7 в левой руке, фа-диез мажорное трезвучие в правой.',
          },
        },
        {
          kind: 'voicings',
          key: D_MAJOR,
          voicings: [
            {
              symbol: 'A13♭9',
              caption: 'V',
              degrees: '1 ♭7 | 13 ♭9 3',
              hands: 'A2 G3 | F♯4 A♯4 C♯5',
            },
            { symbol: 'DMaj9', caption: 'I', degrees: '1 | 3 5 7 9', hands: 'D3 | F♯4 A4 C♯5 E5' },
          ],
        },
        {
          kind: 'note',
          text: {
            en: 'Start with plain triads and 7ths. Add alterations slowly, choosing those that suit the melody.',
            ru: 'Начинайте с простых трезвучий и септаккордов. Альтерации добавляйте постепенно, выбирая те, что дополняют мелодию.',
          },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: { en: 'Play the ii7 of B♭ major.', ru: 'Сыграйте ii7 си-бемоль мажора.' },
          answer: { chord: 'Cm7' },
        },
        {
          kind: 'quiz',
          ask: { en: 'Play the V7 of F major.', ru: 'Сыграйте V7 фа мажора.' },
          answer: { chord: 'C7' },
        },
        {
          kind: 'link',
          title: { en: 'The ii–V–I in the Player', ru: 'ii–V–I в плеере' },
          target: { place: 'player', numerals: 'ii V I', key: C_MAJOR, size: 'sevenths' },
        },
      ],
    },
  ],
}

export default twoFiveOne
