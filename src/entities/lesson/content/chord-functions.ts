import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }

const chordFunctions: Lesson = {
  id: 'chord-functions',
  title: {
    en: 'Chord functions: tonic, subdominant, dominant',
    ru: 'Функции аккордов: тоника, субдоминанта, доминанта',
  },
  summary: {
    en: 'Home, leaving and coming back: the three functions, and the chords that stand in for them.',
    ru: 'Дом, уход и возвращение: три функции и аккорды, которые их заменяют.',
  },
  sections: [
    {
      heading: { en: 'Rest, unsettle, pull', ru: 'Покой, движение, тяготение' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A function', ru: 'Функция' },
          text: {
            en: 'is one of three jobs a chord does in its key.',
            ru: '— одна из трёх задач, которые аккорд выполняет в тональности.',
          },
        },
        { kind: 'chords', symbols: ['C', 'F', 'G'] },
        {
          kind: 'steps',
          steps: [
            {
              en: 'The tonic (I) is home, at rest.',
              ru: 'Тоника (I) — дом, покой.',
            },
            {
              en: 'The subdominant (IV) leaves home.',
              ru: 'Субдоминанта (IV) уводит от дома.',
            },
            {
              en: 'The dominant (V) pulls back to the tonic.',
              ru: 'Доминанта (V) тянет обратно к тонике.',
            },
          ],
        },
        { kind: 'progression', numerals: 'I IV V I', key: C_MAJOR },
      ],
    },
    {
      heading: { en: 'ii stands in for IV', ru: 'ii вместо IV' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A substitute', ru: 'Заместитель' },
          text: {
            en: 'shares notes with a main chord and takes on its job. Dm holds F and A, two of F’s three notes.',
            ru: 'имеет общие ноты с главным аккордом и берёт на себя его роль. В Dm есть фа и ля — две из трёх нот F.',
          },
        },
        { kind: 'chords', symbols: ['F', 'Dm'] },
        { kind: 'progression', numerals: 'I ii V I', key: C_MAJOR },
      ],
    },
    {
      heading: { en: 'vii° stands in for V', ru: 'vii° вместо V' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'B° is G7 without its root. Its B, the leading note, still pulls up to C.',
            ru: 'B° — это G7 без основного тона. Его си, вводный тон, всё так же тянется вверх, к до.',
          },
        },
        { kind: 'chords', symbols: ['G7', 'B°', 'C'] },
      ],
    },
    {
      heading: { en: 'vi stands in for I', ru: 'vi вместо I' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Am shares C and E with C: a softer home. After V, it surprises the ear that waited for I.',
            ru: 'У Am с C общие до и ми: это более мягкий дом. После V он удивляет слух, который ждал I.',
          },
        },
        { kind: 'progression', numerals: 'I IV V vi', key: C_MAJOR },
      ],
    },
    {
      heading: { en: 'The three families', ru: 'Три группы' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            { en: 'Tonic: I, vi and iii.', ru: 'Тоника: I, vi и iii.' },
            { en: 'Subdominant: IV and ii.', ru: 'Субдоминанта: IV и ii.' },
            { en: 'Dominant: V and vii°.', ru: 'Доминанта: V и vii°.' },
          ],
        },
        { kind: 'progression', numerals: 'I vi ii V I', key: C_MAJOR },
        {
          kind: 'link',
          title: { en: 'A chord’s role in the Quiz', ru: 'Функция аккорда в тестах' },
          target: { opens: 'quiz', trainer: 'chord-role' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play the subdominant of G major.', ru: 'Сыграйте субдоминанту соль мажора.' },
          answer: { chord: 'C' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the minor chord of C major that shares F and A with F.',
            ru: 'Сыграйте минорный аккорд до мажора, у которого с F общие ноты фа и ля.',
          },
          answer: { chord: 'Dm' },
        },
        {
          kind: 'link',
          title: { en: 'C major in Keys', ru: 'До мажор в тональностях' },
          target: { opens: 'key', key: C_MAJOR },
        },
        {
          kind: 'link',
          title: {
            en: 'Progressions by ear in the Quiz',
            ru: 'Последовательности на слух в тестах',
          },
          target: { opens: 'quiz', trainer: 'progressions-by-ear' },
        },
      ],
    },
  ],
}

export default chordFunctions
