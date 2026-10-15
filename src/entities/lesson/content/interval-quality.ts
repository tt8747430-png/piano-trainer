import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const intervalQuality: Lesson = {
  id: 'interval-quality',
  title: { en: 'Interval quality and inversion', ru: 'Качество интервалов и обращение' },
  summary: {
    en: 'Major, minor, perfect, augmented and diminished: an interval’s exact size, what it turns into upside down, and the intervals wider than an octave.',
    ru: 'Большие, малые, чистые, увеличенные и уменьшённые: точная величина интервала, во что он превращается при обращении, и интервалы шире октавы.',
  },
  sections: [
    {
      heading: { en: 'Major and minor', ru: 'Большие и малые' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Major and minor', ru: 'Большие и малые' },
          text: {
            en: '2nds, 3rds, 6ths and 7ths come in two sizes. The minor one is a half step smaller than the major.',
            ru: 'секунды, терции, сексты и септимы бывают двух размеров. Малая на полутон меньше большой.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'M6' },
        { kind: 'interval', root: note('C'), interval: 'm6' },
      ],
    },
    {
      heading: { en: 'Count the half steps', ru: 'Считайте полутоны' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            { en: '2nd: minor 1, major 2.', ru: 'Секунда: малая 1, большая 2.' },
            { en: '3rd: minor 3, major 4.', ru: 'Терция: малая 3, большая 4.' },
            { en: '4th: perfect 5. 5th: perfect 7.', ru: 'Кварта: чистая 5. Квинта: чистая 7.' },
            { en: '6th: minor 8, major 9.', ru: 'Секста: малая 8, большая 9.' },
            { en: '7th: minor 10, major 11.', ru: 'Септима: малая 10, большая 11.' },
          ],
        },
        { kind: 'interval', root: note('D'), interval: 'm7' },
        { kind: 'interval', root: note('D'), interval: 'M7' },
      ],
    },
    {
      heading: { en: 'Augmented and diminished', ru: 'Увеличенные и уменьшённые' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Augmented', ru: 'Увеличенный' },
          text: {
            en: 'is a half step wider than perfect or major. Diminished is a half step narrower than perfect or minor. The letters keep the number.',
            ru: 'интервал на полутон шире чистого или большого. Уменьшённый — на полутон уже чистого или малого. Буквы сохраняют число.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C–F', degrees: 'P4', hands: '| C4 F4' },
            { symbol: 'C–F♯', degrees: 'A4', hands: '| C4 F♯4' },
            { symbol: 'C–G♭', degrees: 'd5', hands: '| C4 G♭4' },
            { symbol: 'C–G', degrees: 'P5', hands: '| C4 G4' },
          ],
        },
        {
          kind: 'note',
          text: {
            en: 'C–F♯ and C–G♭ are the same keys: the tritone.',
            ru: 'До–фа-диез и до–соль-бемоль — одни и те же клавиши: тритон.',
          },
        },
      ],
    },
    {
      heading: { en: 'Inverting an interval', ru: 'Обращение интервала' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Inverting', ru: 'Обратить' },
          text: {
            en: 'an interval moves its lower note up an octave. The numbers add to 9: a 3rd becomes a 6th. The half steps add to 12.',
            ru: 'интервал — перенести нижний звук на октаву вверх. Числа дают в сумме 9: терция становится секстой. Полутоны дают в сумме 12.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'M3' },
        { kind: 'interval', root: note('E'), interval: 'm6' },
      ],
    },
    {
      heading: { en: 'The quality flips', ru: 'Качество меняется' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Major becomes minor, minor major.',
              ru: 'Большой становится малым, малый — большим.',
            },
            {
              en: 'Augmented becomes diminished, diminished augmented.',
              ru: 'Увеличенный становится уменьшённым, уменьшённый — увеличенным.',
            },
            { en: 'Perfect stays perfect.', ru: 'Чистый остаётся чистым.' },
          ],
        },
        { kind: 'interval', root: note('C'), interval: 'm2' },
        { kind: 'interval', root: note('D', -1), interval: 'M7' },
      ],
    },
    {
      heading: { en: 'Compound intervals', ru: 'Составные интервалы' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A compound interval', ru: 'Составной интервал' },
          text: {
            en: 'is wider than an octave. Take 7 from its number: a 9th is a 2nd plus an octave, a 10th a 3rd.',
            ru: 'шире октавы. Отнимите от его числа 7: нона — это секунда плюс октава, децима — терция.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'M2' },
        { kind: 'interval', root: note('C'), interval: 'M9' },
        {
          kind: 'note',
          text: {
            en: 'In C9, the 9 is D.',
            ru: 'В C9 нона — это ре.',
          },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play E and the minor 3rd above it.',
            ru: 'Сыграйте ми и малую терцию вверх от неё.',
          },
          answer: { notes: ['E', 'G'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play D and the major 6th above it.',
            ru: 'Сыграйте ре и большую сексту вверх от неё.',
          },
          answer: { notes: ['D', 'B'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play C and the augmented 4th above it.',
            ru: 'Сыграйте до и увеличенную кварту вверх от неё.',
          },
          answer: { notes: ['C', 'F♯'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Invert A up to C, a minor 3rd: play C and the A above it.',
            ru: 'Обратите малую терцию ля–до: сыграйте до и ля над ней.',
          },
          answer: { notes: ['C', 'A'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'Every interval', ru: 'Все интервалы' },
          target: { opens: 'intervals' },
        },
        {
          kind: 'link',
          title: { en: 'Intervals by ear in the Quiz', ru: 'Интервалы на слух в тестах' },
          target: { opens: 'quiz', trainer: 'intervals-by-ear' },
        },
      ],
    },
  ],
}

export default intervalQuality
