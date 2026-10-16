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
    en: 'Every chord in a key does one of three jobs. Learn the three, and which chords can stand in for each.',
    ru: 'Каждый аккорд в тональности выполняет одну из трёх задач. Узнайте их и какие аккорды могут друг друга заменять.',
  },
  sections: [
    {
      heading: { en: 'Rest, move away, pull back', ru: 'Покой, уход, возвращение' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A function', ru: 'Функция' },
          text: {
            en: 'is the job a chord does in its key. There are three.',
            ru: '— это задача, которую аккорд выполняет в тональности. Их три.',
          },
        },
        { kind: 'progression', numerals: 'I IV V I', key: C_MAJOR },
        {
          kind: 'steps',
          steps: [
            { en: 'Tonic, I: home, at rest.', ru: 'Тоника, I: дом, покой.' },
            { en: 'Subdominant, IV: moves away.', ru: 'Субдоминанта, IV: уход от дома.' },
            {
              en: 'Dominant, V: pulls back home.',
              ru: 'Доминанта, V: тянет обратно домой.',
            },
          ],
        },
      ],
    },
    {
      heading: { en: 'ii stands in for IV', ru: 'ii вместо IV' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A substitute', ru: 'Заместитель' },
          text: {
            en: 'shares notes with a main chord, so it can do the same job. Dm holds F and A, two of the three notes of F.',
            ru: '— это аккорд с общими нотами с главным, поэтому он может выполнять ту же задачу. В Dm есть фа и ля, две из трёх нот F.',
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
            en: 'B° is G7 without its root G. It keeps B, the leading note, a half step below C. So it still pulls up to C.',
            ru: 'B° — это G7 без основного тона соль. В нём остаётся си, вводный тон, на полутон ниже до. Поэтому он так же тянется вверх, к до.',
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
            en: 'Am shares C and E with the C chord, so it works as a softer home. After V the ear expects I, and Am surprises it.',
            ru: 'У Am с аккордом C общие до и ми, поэтому он звучит как более мягкий дом. После V слух ждёт I, а Am его удивляет.',
          },
        },
        { kind: 'progression', numerals: 'I IV V vi', key: C_MAJOR },
      ],
    },
    {
      heading: { en: 'All three groups', ru: 'Все три группы' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            { en: 'Tonic, home: I, vi and iii.', ru: 'Тоника, дом: I, vi и iii.' },
            { en: 'Subdominant, away: IV and ii.', ru: 'Субдоминанта, уход: IV и ii.' },
            { en: 'Dominant, pull home: V and vii°.', ru: 'Доминанта, тяготение домой: V и vii°.' },
          ],
        },
        { kind: 'progression', numerals: 'I vi ii V I', key: C_MAJOR },
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
            en: 'Play the minor chord of C major that stands in for F.',
            ru: 'Сыграйте минорный аккорд до мажора, который заменяет F.',
          },
          answer: { chord: 'Dm' },
        },
        {
          kind: 'link',
          title: { en: 'Name a chord’s function in the Quiz', ru: 'Функция аккорда в тестах' },
          target: { opens: 'quiz', trainer: 'chord-role' },
        },
        {
          kind: 'link',
          title: { en: 'See C major in Keys', ru: 'До мажор в тональностях' },
          target: { opens: 'key', key: C_MAJOR },
        },
      ],
    },
  ],
}

export default chordFunctions
