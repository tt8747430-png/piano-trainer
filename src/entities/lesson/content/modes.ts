import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const modes: Lesson = {
  id: 'modes',
  title: { en: 'The seven modes', ru: 'Семь ладов' },
  summary: {
    en: 'Play the seven modes and hear the note that colours each.',
    ru: 'Играть семь ладов и слышать ноту, которая окрашивает каждый.',
  },
  sections: [
    {
      heading: { en: 'One scale, seven starts', ru: 'Одна гамма, семь начал' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A mode', ru: 'Лад' },
          text: {
            en: 'is the major scale played from another of its notes. The white keys from D to D make D Dorian.',
            ru: '— мажорная гамма, сыгранная от другой своей ноты. Белые клавиши от ре до ре дают ре дорийский.',
          },
        },
        { kind: 'scale', root: note('D'), scale: 'dorian' },
        {
          kind: 'note',
          text: {
            en: 'Ionian is the major scale itself, Aeolian the natural minor.',
            ru: 'Ионийский лад — это сам мажор, эолийский — натуральный минор.',
          },
        },
      ],
    },
    {
      heading: { en: 'Dorian: minor with a major 6th', ru: 'Дорийский: минор с большой секстой' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Dorian is the natural minor with its 6th raised. It sounds minor but brighter.',
            ru: 'Дорийский лад — натуральный минор с повышенной шестой ступенью. Он минорный, но светлее.',
          },
        },
        { kind: 'scale', root: note('A'), scale: 'dorian' },
      ],
    },
    {
      heading: { en: 'Mixolydian: major with a ♭7', ru: 'Миксолидийский: мажор с ♭7' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Mixolydian lowers the major scale’s 7th. Its tonic chord is a dominant 7th that needs no resolving.',
            ru: 'Миксолидийский лад понижает седьмую ступень мажора. Его тонический аккорд — доминантсептаккорд, которому не нужно разрешаться.',
          },
        },
        { kind: 'scale', root: note('G'), scale: 'mixolydian' },
      ],
    },
    {
      heading: { en: 'Lydian: major with a ♯4', ru: 'Лидийский: мажор с ♯4' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Lydian raises the major scale’s 4th. It floats, with no note that wants to fall.',
            ru: 'Лидийский лад повышает четвёртую ступень мажора. Он звучит парящим, без ноты, которая тянет вниз.',
          },
        },
        { kind: 'scale', root: note('F'), scale: 'lydian' },
      ],
    },
    {
      heading: { en: 'Phrygian: minor with a ♭2', ru: 'Фригийский: минор с ♭2' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Phrygian lowers the natural minor’s 2nd. The half step above the tonic sounds dark and Spanish.',
            ru: 'Фригийский лад понижает вторую ступень натурального минора. Полутон над тоникой звучит мрачно, по-испански.',
          },
        },
        { kind: 'scale', root: note('E'), scale: 'phrygian' },
      ],
    },
    {
      heading: { en: 'Locrian: ♭2 and ♭5', ru: 'Локрийский: ♭2 и ♭5' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Locrian lowers both the 2nd and the 5th. Its tonic chord is diminished, so it rarely feels like home.',
            ru: 'Локрийский лад понижает и вторую, и пятую ступени. Его тоника — уменьшённое трезвучие, поэтому устойчивости в нём мало.',
          },
        },
        { kind: 'scale', root: note('B'), scale: 'locrian' },
      ],
    },
    {
      heading: { en: 'Compare them from one tonic', ru: 'Сравните их от одной тоники' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play C major, C Mixolydian and C Dorian in turn. Each lowers one more note: B, then E.',
            ru: 'Сыграйте подряд до мажор, до миксолидийский и до дорийский. Каждый понижает ещё одну ноту: си, затем ми.',
          },
        },
        { kind: 'scale', root: note('C'), scale: 'major' },
        { kind: 'scale', root: note('C'), scale: 'mixolydian' },
        { kind: 'scale', root: note('C'), scale: 'dorian' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play D Dorian up from D.', ru: 'Сыграйте ре дорийский вверх от ре.' },
          answer: { notes: ['D', 'E', 'F', 'G', 'A', 'B', 'C'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play G Mixolydian up from G.',
            ru: 'Сыграйте соль миксолидийский вверх от соль.',
          },
          answer: { notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F'], rising: true },
        },
        {
          kind: 'question',
          ask: { en: 'Play F Lydian up from F.', ru: 'Сыграйте фа лидийский вверх от фа.' },
          answer: { notes: ['F', 'G', 'A', 'B', 'C', 'D', 'E'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'The modes in the Player', ru: 'Лады в плеере' },
          target: { opens: 'exercise', exercise: 'modes', root: note('C') },
        },
        {
          kind: 'link',
          title: { en: 'Scales by ear in the Quiz', ru: 'Гаммы на слух в тестах' },
          target: { opens: 'quiz', trainer: 'scales-by-ear' },
        },
      ],
    },
  ],
}

export default modes
