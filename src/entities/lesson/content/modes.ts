import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const modes: Lesson = {
  id: 'modes',
  title: { en: 'The seven modes', ru: 'Семь ладов' },
  summary: {
    en: 'Play the major scale from each of its notes, and hear the one note that colours each mode.',
    ru: 'Играть мажорную гамму от каждой её ноты и слышать ту ноту, что окрашивает каждый лад.',
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
            ru: '— это мажорная гамма, сыгранная от другой своей ноты. Белые клавиши от ре до ре дают ре дорийский.',
          },
        },
        { kind: 'scale', root: note('D'), scale: 'dorian' },
        {
          kind: 'note',
          text: {
            en: 'Ionian is the major scale itself. Aeolian is the natural minor.',
            ru: 'Ионийский лад — это сам мажор. Эолийский — натуральный минор.',
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
            en: 'Dorian is natural minor with the 6th raised. It sounds minor, but brighter. In A Dorian the colour note is F♯.',
            ru: 'Дорийский лад — натуральный минор с повышенной шестой ступенью. Он минорный, но светлее. В ля дорийском характерная нота — фа-диез.',
          },
        },
        { kind: 'scale', root: note('A'), scale: 'dorian' },
      ],
    },
    {
      heading: { en: 'Phrygian: minor with a ♭2', ru: 'Фригийский: минор с ♭2' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Phrygian is natural minor with the 2nd lowered. The half step above the tonic sounds dark and Spanish.',
            ru: 'Фригийский лад — натуральный минор с пониженной второй ступенью. Полутон над тоникой звучит мрачно, по-испански.',
          },
        },
        { kind: 'scale', root: note('E'), scale: 'phrygian' },
      ],
    },
    {
      heading: { en: 'Lydian: major with a ♯4', ru: 'Лидийский: мажор с ♯4' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Lydian is the major scale with the 4th raised. It floats, with no note that wants to fall.',
            ru: 'Лидийский лад — мажор с повышенной четвёртой ступенью. Он звучит парящим, без ноты, которая тянет вниз.',
          },
        },
        { kind: 'scale', root: note('F'), scale: 'lydian' },
      ],
    },
    {
      heading: { en: 'Mixolydian: major with a ♭7', ru: 'Миксолидийский: мажор с ♭7' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Mixolydian is the major scale with the 7th lowered. Its tonic chord is a dominant 7th that does not need to resolve.',
            ru: 'Миксолидийский лад — мажор с пониженной седьмой ступенью. Его тонический аккорд — доминантсептаккорд, которому не нужно разрешаться.',
          },
        },
        { kind: 'scale', root: note('G'), scale: 'mixolydian' },
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
            en: 'Play C major, C Mixolydian and C Dorian in turn. Each one lowers one more note: first B, then E.',
            ru: 'Сыграйте подряд до мажор, до миксолидийский и до дорийский. Каждый понижает ещё одну ноту: сначала си, затем ми.',
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
