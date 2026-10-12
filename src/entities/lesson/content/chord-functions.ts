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
    en: 'Why one chord sounds like home, one like leaving and one like coming back. The three functions, and the chords that stand in for them.',
    ru: 'Почему один аккорд звучит как дом, другой — как уход, третий — как возвращение. Три функции и аккорды, которые их заменяют.',
  },
  level: 2,
  category: 'theory',
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'Rest, unsettle, pull', ru: 'Покой, движение, тяготение' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Every chord of a key does one of three jobs. These jobs are called functions.',
            ru: 'Каждый аккорд тональности выполняет одну из трёх задач. Эти задачи называют функциями.',
          },
        },
        {
          kind: 'steps',
          steps: [
            {
              en: 'The tonic (I) is home. It sounds at rest.',
              ru: 'Тоника (I) — дом. Она звучит устойчиво.',
            },
            {
              en: 'The subdominant (IV) leaves home. It sounds unsettled.',
              ru: 'Субдоминанта (IV) уводит от дома. Она вносит движение.',
            },
            {
              en: 'The dominant (V) pulls back. It wants to resolve, that is, to move on to the tonic.',
              ru: 'Доминанта (V) тянет обратно. Она хочет разрешиться, то есть перейти в тонику.',
            },
          ],
        },
        { kind: 'chords', symbols: ['C', 'F', 'G'] },
        {
          kind: 'text',
          text: {
            en: 'Play them as a sentence: home, away, back, home. Most hymns and folk songs are built on it.',
            ru: 'Сыграйте их как фразу: дом, уход, возвращение, дом. На этом движении построено большинство гимнов и народных песен.',
          },
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
            en: 'The other chords of the key share notes with these three. So they can take on their jobs.',
            ru: 'Остальные аккорды тональности имеют общие ноты с тремя главными. Поэтому они могут брать на себя их роль.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'ii sounds like IV. Dm and F share F and A, so ii is a subdominant too. Play both below.',
            ru: 'ii звучит как IV. У Dm и F общие ноты фа и ля, поэтому ii — тоже субдоминанта. Сыграйте оба ниже.',
          },
        },
        { kind: 'chords', symbols: ['Dm', 'F'] },
        {
          kind: 'text',
          text: {
            en: 'vii° sounds like V. B° and G share B and D. B is the leading note, a half step below the tonic. So vii° pulls home like a dominant.',
            ru: 'vii° звучит как V. У B° и G общие ноты си и ре. Си — вводный тон, на полутон ниже тоники. Поэтому vii° тянет к тонике, как доминанта.',
          },
        },
        { kind: 'chords', symbols: ['B°', 'G'] },
        {
          kind: 'text',
          text: {
            en: 'vi and iii are weaker. Their sound depends on the chords around them. vi often stands in for the tonic: a softer, sadder home.',
            ru: 'vi и iii слабее. Их окраска зависит от соседних аккордов. vi часто заменяет тонику — это более мягкий, грустный дом.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'So I–ii–V–I is the same sentence as I–IV–V–I. Only ii takes the subdominant’s place. Play it below.',
            ru: 'Поэтому I–ii–V–I — та же фраза, что и I–IV–V–I. Только место субдоминанты занимает ii. Сыграйте её ниже.',
          },
        },
        { kind: 'progression', numerals: 'I ii V I', key: C_MAJOR },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: { en: 'Play the subdominant of G major.', ru: 'Сыграйте субдоминанту соль мажора.' },
          answer: { chord: 'C' },
        },
        {
          kind: 'quiz',
          ask: {
            en: 'Play the minor chord of C major that shares F and A with F.',
            ru: 'Сыграйте минорный аккорд до мажора, у которого с F общие ноты фа и ля.',
          },
          answer: { chord: 'Dm' },
        },
        {
          kind: 'link',
          title: { en: 'C major in Keys', ru: 'До мажор в тональностях' },
          target: { place: 'keys', key: C_MAJOR },
        },
      ],
    },
  ],
}

export default chordFunctions
