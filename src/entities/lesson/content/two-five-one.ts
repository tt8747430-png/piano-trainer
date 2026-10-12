import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }
const C_MINOR = { tonic: note('C'), minor: true }

const twoFiveOne: Lesson = {
  id: 'two-five-one',
  title: { en: 'The ii–V–I', ru: 'Оборот ii–V–I' },
  summary: {
    en: 'Jazz’s cadence: subdominant, dominant and tonic in 7th chords. How its voices move, in major and minor, and how to practise it in every key.',
    ru: 'Главный оборот джаза: субдоминанта, доминанта и тоника в септаккордах. Как движутся голоса, в мажоре и в миноре, и как отработать его во всех тональностях.',
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
            en: 'The ii–V–I is the subdominant, the dominant and the tonic, as jazz plays them. ii stands for the subdominant, and its root falls a 5th to V.',
            ru: 'ii–V–I — это субдоминанта, доминанта и тоника в джазе. Субдоминанту здесь заменяет ii, и его основной тон опускается на квинту к V.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Jazz harmony is built of 7th chords, so triads are rare. Play ii7–V7–Imaj7 below.',
            ru: 'Джазовая гармония строится на септаккордах, поэтому трезвучия редки. Сыграйте ii7–V7–Imaj7 ниже.',
          },
        },
        { kind: 'progression', numerals: 'ii V I', key: C_MAJOR, size: 'sevenths' },
        {
          kind: 'text',
          text: {
            en: 'The roots fall a 5th each time: D, G, C. They walk down the circle of fifths.',
            ru: 'Основные тоны каждый раз опускаются на квинту: ре, соль, до. Они идут вниз по квинтовому кругу.',
          },
        },
        {
          kind: 'note',
          text: {
            en: 'This is about the chords’ letters, not the bass. The bass may take any of the chords’ notes.',
            ru: 'Речь о буквах аккордов, а не о басе. Бас может взять любую ноту аккорда.',
          },
        },
      ],
    },
    {
      heading: { en: 'How the voices move', ru: 'Как движутся голоса' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'The 3rd of one chord becomes the 7th of the next, and the 7th becomes the 3rd.',
              ru: 'Терция одного аккорда становится септимой следующего, а септима — терцией.',
            },
            {
              en: 'The tense notes fall a step: Dm7’s C falls to G7’s B, and G7’s F falls to Cmaj7’s E.',
              ru: 'Неустойчивые звуки разрешаются на ступень вниз. До в Dm7 переходит в си в G7, фа в G7 — в ми в Cmaj7.',
            },
            {
              en: 'Common notes stay where they are.',
              ru: 'Общие звуки остаются на месте.',
            },
          ],
        },
        {
          kind: 'note',
          text: {
            en: 'A 6th chord can stand for a major 7th: C6 for Cmaj7.',
            ru: 'Мажорное трезвучие с секстой может заменить большой мажорный септаккорд: C6 вместо Cmaj7.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Play the row below and follow each voice.',
            ru: 'Сыграйте ряд ниже и проследите за каждым голосом.',
          },
        },
        { kind: 'chords', symbols: ['Dm7', 'G7', 'C6'] },
      ],
    },
    {
      heading: { en: 'In minor', ru: 'В миноре' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'In minor, each of the three chords changes.',
            ru: 'В миноре меняется каждый из трёх аккордов.',
          },
        },
        {
          kind: 'steps',
          steps: [
            {
              en: 'ii is half-diminished: iiø7.',
              ru: 'ii — полууменьшённый: iiø7.',
            },
            {
              en: 'V needs the raised 7th degree to pull home: V7, often V7♭9.',
              ru: 'Доминанте для тяготения нужна повышенная VII ступень: V7, часто V7♭9.',
            },
            {
              en: 'The tonic is often a minor 6th chord: Cm6.',
              ru: 'Тоникой часто бывает минорное трезвучие с секстой: Cm6.',
            },
          ],
        },
        { kind: 'progression', numerals: 'iiø7 V7 i', key: C_MINOR },
        { kind: 'chords', symbols: ['Dm7♭5', 'G7♭9', 'Cm6'] },
        {
          kind: 'text',
          text: {
            en: 'A ii–V can also visit another key for a moment. Em7♭5–A7 is the minor ii–V of D minor, and it leads to Dm7.',
            ru: 'ii–V может и ненадолго увести в другую тональность. Em7♭5–A7 — минорный ii–V ре минора, и он ведёт в Dm7.',
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
            en: 'Play the ii–V–I in close position, each chord within one octave.',
            ru: 'Играйте ii–V–I в тесном расположении, каждый аккорд в пределах октавы.',
          },
        },
        {
          kind: 'steps',
          steps: [
            {
              en: 'Move it up by semitones: Dm7 G7 Cmaj7, then E♭m7 A♭7 D♭maj7…',
              ru: 'Ведите его вверх по полутонам: Dm7 G7 Cmaj7, затем E♭m7 A♭7 D♭maj7…',
            },
            {
              en: 'Move it down by whole tones. Each key’s I becomes the next key’s ii: Cmaj7 turns into Cm7.',
              ru: 'Ведите его вниз по тонам. I каждой тональности становится ii следующей: Cmaj7 превращается в Cm7.',
            },
          ],
        },
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
            en: 'Now play 9th chords, with the root left to the bass.',
            ru: 'Теперь играйте нонаккорды, основной тон оставьте в басу.',
          },
        },
        {
          kind: 'steps',
          steps: [
            {
              en: 'Play each chord from its 3rd: 3-5-7-9. Dm9 is F A C E.',
              ru: 'Играйте каждый аккорд от терции: 3-5-7-9. Dm9 — это фа, ля, до, ми.',
            },
            {
              en: 'Then play it from its 7th: 7-9-3-5, so C E F A.',
              ru: 'Затем играйте его от септимы: 7-9-3-5, то есть до, ми, фа, ля.',
            },
          ],
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
