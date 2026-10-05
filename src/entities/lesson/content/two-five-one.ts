import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }
const C_MINOR = { tonic: note('C'), minor: true }

const twoFiveOne: Lesson = {
  id: 'two-five-one',
  title: { en: 'The ii–V–I', ru: 'Оборот ii–V–I' },
  summary: {
    en: 'Jazz’s cadence: subdominant, dominant, tonic in 7th chords, how its voices move, in major and minor, and how to practise it through every key.',
    ru: 'Главный оборот джаза: субдоминанта, доминанта и тоника в септаккордах, как движутся голоса, в мажоре и в миноре, и как отработать его во всех тональностях.',
  },
  level: 3,
  category: 'jazz',
  module: 'accompaniment',
  sections: [
    {
      heading: { en: 'S–D–T in 7th chords', ru: 'S–D–T в септаккордах' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The ii–V–I is the subdominant, the dominant and the tonic in jazz’s dress. Its subdominant is the brightest one, the ii7; and as jazz harmony is built of 7th chords, triads are rare: IIm7–V7–Imaj7.',
            ru: 'ii–V–I — это субдоминанта, доминанта и тоника в джазовом наряде. Его субдоминанта — самая яркая, ii7; а поскольку джазовая гармония строится на септаккордах, трезвучия редки: IIm7–V7–Imaj7.',
          },
        },
        { kind: 'progression', numerals: 'ii V I', key: C_MAJOR, size: 'sevenths' },
        {
          kind: 'text',
          text: {
            en: 'The roots fall a 5th each time, down the circle of fifths: D, G, C. That is the letters, not the bass: the bass may take any of the chords’ notes.',
            ru: 'Корни каждый раз опускаются на квинту, вниз по квинтовому кругу: ре, соль, до. Речь о буквах, а не о басе: бас может взять любую ноту аккорда.',
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
              en: 'What was the 3rd of one chord becomes the 7th of the next, and the 7th becomes the 3rd.',
              ru: 'Терция одного аккорда становится септимой следующего, а септима — терцией.',
            },
            {
              en: 'The pulls go down a step: Dm7’s C falls to G7’s B, G7’s F falls to Cmaj7’s E.',
              ru: 'Тяготения разрешаются на ступень вниз: до в Dm7 опускается в си в G7, фа в G7 — в ми в Cmaj7.',
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
            en: 'A 6th chord can stand for any major 7th: C6 for Cmaj7.',
            ru: 'Секстаккорд с добавленной секстой может заменить любой большой мажорный септаккорд: C6 вместо Cmaj7.',
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
            en: 'In minor the ii is half-diminished (iiø7), the V needs the raised 7th to pull (V7, often V7♭9), and the tonic is often a minor 6th chord (Cm6).',
            ru: 'В миноре ii — полууменьшённый (iiø7), доминанте для тяготения нужна повышенная VII ступень (V7, часто V7♭9), а тоникой часто бывает минорный секстаккорд с секстой (Cm6).',
          },
        },
        { kind: 'progression', numerals: 'iiø7 V7 i', key: C_MINOR },
        { kind: 'chords', symbols: ['Dm7♭5', 'G7♭9', 'Cm6'] },
        {
          kind: 'text',
          text: {
            en: 'A ii–V can also visit another key for a moment: Em7♭5–A7 is the minor ii–V of D minor, and leads to its Dm7.',
            ru: 'ii–V может и ненадолго увести в другую тональность: Em7♭5–A7 — минорный ii–V ре минора, и он ведёт в его Dm7.',
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
            en: 'Play the ii–V–I in close position. Step 1: move it up by semitones (Dm7 G7 Cmaj7, then E♭m7 A♭7 D♭maj7…). Step 2: move it down by whole tones, so each key’s I becomes the next key’s ii (Cmaj7 turns into Cm7).',
            ru: 'Играйте ii–V–I в тесном расположении. Шаг 1: ведите его вверх по полутонам (Dm7 G7 Cmaj7, затем E♭m7 A♭7 D♭maj7…). Шаг 2: ведите вниз по тонам, так что I каждой тональности становится ii следующей (Cmaj7 превращается в Cm7).',
          },
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
            en: 'Now with 9th chords, the root left to the bass. Play each chord from its 3rd (3-5-7-9: Dm9 is F A C E), then from its 7th (7-9-3-5: C E F A).',
            ru: 'Теперь с нонаккордами, основной тон — в басу. Играйте каждый аккорд от терции (3-5-7-9: Dm9 — фа ля до ми), затем от септимы (7-9-3-5: до ми фа ля).',
          },
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
