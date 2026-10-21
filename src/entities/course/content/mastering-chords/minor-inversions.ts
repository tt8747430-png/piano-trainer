import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const A_MINOR = { tonic: note('A'), minor: true }

/** Mastering Chords, lesson 4: a minor chord's three positions, told apart and joined smoothly. */
const minorInversions: Lesson = {
  id: 'minor-inversions',
  title: { en: 'Minor chord inversions', ru: 'Обращения минорного аккорда' },
  summary: {
    en: 'Play a minor chord in its three positions, tell it from a major one and join chords smoothly.',
    ru: 'Играйте минорное трезвучие в трёх видах, отличайте его от мажорного и плавно соединяйте аккорды.',
  },
  sections: [
    {
      heading: { en: 'A minor three ways', ru: 'Ля минор тремя способами' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A minor chord inverts just as a major one does. Put each of its notes at the bottom in turn: the root A, the 3rd C, then the 5th E.',
            ru: 'Минорное трезвучие обращается так же, как мажорное. Поставьте вниз по очереди каждый его звук: основной тон ля, терцию до, затем квинту ми.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'Am', degrees: '1 ♭3 5', hands: 'A3 C4 E4' },
            { symbol: 'Am/C', degrees: '♭3 5 1', hands: 'C4 E4 A4' },
            { symbol: 'Am/E', degrees: '5 1 ♭3', hands: 'E4 A4 C5' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Find the root', ru: 'Найдите основной тон' },
      blocks: [
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'Dm', degrees: '1 ♭3 5', hands: 'D4 F4 A4' },
            { symbol: 'Dm/F', degrees: '♭3 5 1', hands: 'F4 A4 D5' },
            { symbol: 'Dm/A', degrees: '5 1 ♭3', hands: 'A3 D4 F4' },
          ],
        },
        {
          kind: 'text',
          text: {
            en: 'The 4th works here too. In both inversions of D minor, find the 4th from A to D. Its upper note, D, is the root.',
            ru: 'Кварта помогает и здесь. В обоих обращениях ре минора найдите кварту ля — ре. Её верхний звук, ре, и есть основной тон.',
          },
        },
      ],
    },
    {
      heading: { en: 'Minor or major?', ru: 'Минор или мажор?' },
      blocks: [
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C/E', degrees: '3 5 1', hands: 'E4 G4 C5' },
            { symbol: 'Am/E', degrees: '5 1 ♭3', hands: 'E4 A4 C5' },
          ],
        },
        {
          kind: 'text',
          text: {
            en: 'Both chords have E at the bottom and C on top. To tell them apart, find the root and count up to its 3rd. Four semitones is major, three is minor.',
            ru: 'В обоих аккордах внизу ми, а сверху до. Чтобы различить их, найдите основной тон и отсчитайте до терции. Четыре полутона — мажор, три — минор.',
          },
        },
      ],
    },
    {
      heading: { en: 'The nearest inversion', ru: 'Ближайшее обращение' },
      blocks: [
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'Am', degrees: '1 | 1 ♭3 5', hands: 'A2 | A3 C4 E4' },
            { symbol: 'Dm', degrees: '1 | 5 1 ♭3', hands: 'D3 | A3 D4 F4' },
            { symbol: 'E', degrees: '1 | 3 5 1', hands: 'E2 | G♯3 B3 E4' },
            { symbol: 'Am', degrees: '1 | 1 ♭3 5', hands: 'A2 | A3 C4 E4' },
          ],
          key: A_MINOR,
        },
        {
          kind: 'text',
          text: {
            en: 'Here the right hand barely moves. It holds A through Am and Dm, then slips down a semitone to G♯ for E major.',
            ru: 'Здесь правая рука почти не двигается. Она держит ля в Am и Dm, затем опускается на полутон к соль-диезу в ми мажоре.',
          },
        },
        {
          kind: 'link',
          title: { en: 'i–iv–V–i in the Player', ru: 'i–iv–V–i в плеере' },
          target: { opens: 'player', numerals: 'i iv V i', key: A_MINOR },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play A minor in first inversion.',
            ru: 'Сыграйте ля минор в первом обращении.',
          },
          answer: { notes: ['C', 'E', 'A'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play D minor in second inversion.',
            ru: 'Сыграйте ре минор во втором обращении.',
          },
          answer: { notes: ['A', 'D', 'F'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play C minor in second inversion.',
            ru: 'Сыграйте до минор во втором обращении.',
          },
          answer: { notes: ['G', 'C', 'Eb'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'Inversions of A minor in the Player', ru: 'Обращения ля минора в плеере' },
          target: { opens: 'exercise', exercise: 'inversions', root: note('A'), quality: 'min' },
        },
        {
          kind: 'link',
          title: { en: 'Name chords in the Quiz', ru: 'Названия аккордов в тестах' },
          target: { opens: 'quiz', trainer: 'name-chord' },
        },
      ],
    },
  ],
}

export default minorInversions
