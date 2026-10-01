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
    en: 'Why a chord sounds like home, like leaving or like coming back: the three functions, and the chords that stand in for them.',
    ru: 'Почему один аккорд звучит как дом, другой — как уход из дома, а третий — как возвращение: три функции и аккорды, которые их заменяют.',
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
            en: 'Every chord of a key does one of three jobs. The tonic (I) is home: it rests. The subdominant (IV) unsettles: it leaves home. The dominant (V) pulls back: it wants to resolve to the tonic.',
            ru: 'Каждый аккорд тональности выполняет одну из трёх задач. Тоника (I) — дом: она звучит устойчиво. Субдоминанта (IV) вносит движение: она уводит от дома. Доминанта (V) тянет обратно: она хочет разрешиться в тонику.',
          },
        },
        { kind: 'chords', symbols: ['C', 'F', 'G'] },
        {
          kind: 'text',
          text: {
            en: 'Play them as a sentence: home, away, back, home. Nearly every song is built of this movement.',
            ru: 'Сыграйте их как фразу: дом, уход, возвращение, дом. Почти любая песня построена на этом движении.',
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
            en: 'The other chords of the key share notes with the three and take on their jobs. ii sounds like IV: Dm and F share F and A, so ii is a subdominant too.',
            ru: 'Остальные аккорды тональности имеют общие ноты с тремя главными и берут на себя их роль. ii звучит как IV: у Dm и F общие ноты фа и ля, поэтому ii — тоже субдоминанта.',
          },
        },
        { kind: 'chords', symbols: ['Dm', 'F'] },
        {
          kind: 'text',
          text: {
            en: 'vii° sounds like V: B° and G share B and D, the leading note among them, so vii° pulls home like a dominant.',
            ru: 'vii° звучит как V: у B° и G общие ноты си и ре, среди них вводный тон, поэтому vii° тянет к тонике, как доминанта.',
          },
        },
        { kind: 'chords', symbols: ['B°', 'G'] },
        {
          kind: 'text',
          text: {
            en: 'vi and iii are weaker: they take their colour from what comes around them. vi often stands for the tonic, a softer, sadder home.',
            ru: 'vi и iii слабее: их окраска зависит от окружения. vi часто заменяет тонику — более мягкий, грустный дом.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'So I–ii–V–I is the same sentence as I–IV–V–I, with the subdominant’s place taken by ii.',
            ru: 'Поэтому I–ii–V–I — та же фраза, что и I–IV–V–I, только место субдоминанты занимает ii.',
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
            en: 'Play the minor chord of C major that shares two notes with F.',
            ru: 'Сыграйте минорный аккорд до мажора, у которого две общие ноты с F.',
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
