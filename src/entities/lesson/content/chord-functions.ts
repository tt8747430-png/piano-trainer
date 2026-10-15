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
      heading: { en: 'Chords that stand in', ru: 'Аккорды-заместители' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Other chords share notes with these three and take on their jobs. ii does IV’s.',
            ru: 'Остальные аккорды имеют общие ноты с этими тремя и берут на себя их роль. ii заменяет IV.',
          },
        },
        { kind: 'chords', symbols: ['Dm', 'F'] },
        {
          kind: 'text',
          text: {
            en: 'vii° does V’s: its B, the leading note, pulls home.',
            ru: 'vii° заменяет V: его си, вводный тон, тянет к тонике.',
          },
        },
        { kind: 'chords', symbols: ['B°', 'G'] },
        {
          kind: 'text',
          text: {
            en: 'vi often does I’s: a softer home.',
            ru: 'vi часто заменяет I — это более мягкий дом.',
          },
        },
        { kind: 'chords', symbols: ['Am', 'C'] },
        { kind: 'progression', numerals: 'I ii V I', key: C_MAJOR },
        {
          kind: 'link',
          title: { en: 'A chord’s role in the Quiz', ru: 'Функция аккорда в тестах' },
          target: { opens: 'quiz', trainer: 'chord-role' },
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
      ],
    },
  ],
}

export default chordFunctions
