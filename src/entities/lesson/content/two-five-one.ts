import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }
const C_MINOR = { tonic: note('C'), minor: true }

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
            en: 'Play it in close position, up by semitones, then down by whole tones. Going down, each I turns into the next ii.',
            ru: 'Играйте его в тесном расположении, вверх по полутонам, затем вниз по тонам. При спуске каждый I становится следующим ii.',
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
          title: { en: 'Step 2: down by whole tones', ru: 'Шаг 2: вниз по тонам' },
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
          title: { en: '9ths from the 3rd', ru: 'Ноны от терции' },
          target: {
            place: 'player',
            numerals: 'ii V I',
            key: C_MAJOR,
            size: 'ninths',
            inversion: 1,
          },
        },
        {
          kind: 'link',
          title: { en: '9ths from the 7th', ru: 'Ноны от септимы' },
          target: {
            place: 'player',
            numerals: 'ii V I',
            key: C_MAJOR,
            size: 'ninths',
            inversion: 3,
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
