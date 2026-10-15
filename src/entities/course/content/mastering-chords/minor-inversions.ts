import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const C_MAJOR = { tonic: note('C'), minor: false }
const A_MINOR = { tonic: note('A'), minor: true }

/** Mastering Chords, lesson 4: a minor chord's three positions, told apart and joined smoothly. */
const minorInversions: Lesson = {
  id: 'minor-inversions',
  title: { en: 'Minor chord inversions', ru: 'Обращения минорного аккорда' },
  summary: {
    en: 'A minor chord inverts just as a major one does. Find its root in any position, tell it from its major neighbour, and join it smoothly.',
    ru: 'Минорный аккорд обращается так же, как мажорный. Находите его основной тон в любом виде, отличайте от мажорного соседа и соединяйте плавно.',
  },
  sections: [
    {
      heading: { en: 'A minor three ways', ru: 'Ля минор тремя способами' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Root position puts A at the bottom. First inversion puts the 3rd, C, at the bottom. Second inversion puts the 5th, E, there.',
            ru: 'В основном виде внизу ля. В первом обращении внизу терция, до. Во втором обращении внизу квинта, ми.',
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
      heading: {
        en: 'The 4th still points to the root',
        ru: 'Кварта по-прежнему указывает на основной тон',
      },
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
            en: 'In each inversion of D minor, find the 4th, A to D. Its upper note, D, is the root.',
            ru: 'В каждом обращении ре минора найдите кварту ля – ре. Её верхний звук, ре, и есть основной тон.',
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
            en: 'Both have E at the bottom and C on top. Find the root above the 4th, then count up to its 3rd: four semitones is major, three is minor.',
            ru: 'В обоих внизу ми, а сверху до. Найдите основной тон над квартой и отсчитайте до терции: четыре полутона — мажор, три — минор.',
          },
        },
      ],
    },
    {
      heading: { en: 'The nearest inversion in A minor', ru: 'Ближайшее обращение в ля миноре' },
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
            en: 'The right hand holds A over Am and Dm, then slips down to G♯ for E major. It hardly moves at all.',
            ru: 'Правая рука держит ля в Am и Dm, затем опускается на соль-диез в ми мажоре. Она почти не двигается.',
          },
        },
      ],
    },
    {
      heading: { en: 'Minor chords in a row', ru: 'Минорные аккорды в ряду' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A row of chords joins each by its nearest inversion. Listen to Am and Dm settle between C and G.',
            ru: 'В ряду аккорды соединяются ближайшими обращениями. Послушайте, как Am и Dm встают между C и G.',
          },
        },
        { kind: 'progression', numerals: 'I vi ii V', key: C_MAJOR },
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
            en: 'Play A minor in first inversion: C at the bottom.',
            ru: 'Сыграйте ля минор в первом обращении: до внизу.',
          },
          answer: { notes: ['C', 'E', 'A'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play D minor in second inversion: A at the bottom.',
            ru: 'Сыграйте ре минор во втором обращении: ля внизу.',
          },
          answer: { notes: ['A', 'D', 'F'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play E minor in first inversion.',
            ru: 'Сыграйте ми минор в первом обращении.',
          },
          answer: { notes: ['G', 'B', 'E'], rising: true },
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
        {
          kind: 'link',
          title: { en: 'A minor in Chords', ru: 'Ля минор в разделе «Аккорды»' },
          target: { opens: 'chords', chord: 'Am' },
        },
      ],
    },
  ],
}

export default minorInversions
