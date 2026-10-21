import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const C_MAJOR = { tonic: note('C'), minor: false }
const G_MAJOR = { tonic: note('G'), minor: false }

const simpleHarmonies: Lesson = {
  id: 'simple-harmonies',
  title: { en: 'Simple harmonies', ru: 'Простая гармонизация' },
  summary: {
    en: 'Play a tune in the right hand over I, IV and V in the left, first in C, then in G.',
    ru: 'Играть мелодию правой рукой над I, IV и V в левой, сначала в до мажоре, затем в соль мажоре.',
  },
  sections: [
    {
      heading: { en: 'A tune over a 5th', ru: 'Мелодия над квинтой' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The left hand holds C and G with fingers 5 and 1. Above it, the right hand plays E, D, C.',
            ru: 'Левая рука держит до и соль пятым и первым пальцами. Над ними правая играет ми, ре, до.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', hands: 'C3 G3 | E4' },
            { symbol: 'C', hands: 'C3 G3 | D4' },
            { symbol: 'C', hands: 'C3 G3 | C4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'I, IV and V', ru: 'I, IV и V' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The primary chords', ru: 'Главные трезвучия' },
          text: {
            en: 'are built on the 1st, 4th and 5th notes of the scale, written I, IV and V. In C major they are C, F and G.',
            ru: 'строятся на I, IV и V ступенях гаммы. В до мажоре это C, F и G.',
          },
        },
        { kind: 'progression', numerals: 'I IV V I', key: C_MAJOR },
        {
          kind: 'question',
          ask: { en: 'Play the IV chord in C.', ru: 'Сыграйте аккорд IV ступени в до мажоре.' },
          answer: { chord: 'F' },
        },
      ],
    },
    {
      heading: { en: 'Two notes for each chord', ru: 'Два звука на аккорд' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The left hand can play just two notes of each chord. For IV the thumb moves up to A. For V the little finger moves down to B.',
            ru: 'Левая рука может брать от аккорда всего два звука. Для IV большой палец переходит вверх на ля, для V мизинец опускается на си.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', degrees: '1 5 | 3', hands: 'C3 G3 | E4' },
            { symbol: 'F', degrees: '5 3 | 1', hands: 'C3 A3 | F4' },
            { symbol: 'G', degrees: '3 1 | 5', hands: 'B2 G3 | D4' },
            { symbol: 'C', degrees: '1 5 | 1', hands: 'C3 G3 | C4' },
          ],
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the left hand’s two notes for IV: C and A.',
            ru: 'Сыграйте два звука левой руки для IV: до и ля.',
          },
          answer: { notes: ['C', 'A'], rising: true },
        },
      ],
    },
    {
      heading: { en: 'Triads in the left hand', ru: 'Трезвучия в левой руке' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A triad', ru: 'Трезвучие' },
          text: {
            en: 'is a chord of three notes. Keep C at the bottom for C and F, and B for G7. Fingers: 5 3 1, 5 2 1, 5 2 1, 5 3 1.',
            ru: '— аккорд из трёх звуков. Для C и F внизу остаётся до, для G7 — си. Пальцы: 5 3 1, 5 2 1, 5 2 1, 5 3 1.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', hands: 'C3 E3 G3 | E4' },
            { symbol: 'F', hands: 'C3 F3 A3 | F4' },
            { symbol: 'G7', hands: 'B2 F3 G3 | D4' },
            { symbol: 'C', hands: 'C3 E3 G3 | C4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'The same in G', ru: 'То же в соль мажоре' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'In G major the chords are G, C and D7. The hand shapes stay the same, now built up from G.',
            ru: 'В соль мажоре аккорды G, C и D7. Формы руки те же, только теперь от соль.',
          },
        },
        {
          kind: 'voicings',
          key: G_MAJOR,
          voicings: [
            { symbol: 'G', hands: 'G2 B2 D3 | B3' },
            { symbol: 'C', hands: 'G2 C3 E3 | C4' },
            { symbol: 'D7', hands: 'F♯2 C3 D3 | A3' },
            { symbol: 'G', hands: 'G2 B2 D3 | G3' },
          ],
        },
        {
          kind: 'link',
          title: { en: 'I IV V7 I in G in the Player', ru: 'I IV V7 I в соль мажоре в плеере' },
          target: { opens: 'player', numerals: 'I IV V7 I', key: G_MAJOR },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play the V7 chord in C.', ru: 'Сыграйте аккорд V7 в до мажоре.' },
          answer: { chord: 'G7' },
        },
        {
          kind: 'link',
          title: { en: 'I IV V7 I in the Player', ru: 'I IV V7 I в плеере' },
          target: { opens: 'player', numerals: 'I IV V7 I', key: C_MAJOR },
        },
        {
          kind: 'link',
          title: { en: 'A chord’s role in the Quiz', ru: 'Функция аккорда в тестах' },
          target: { opens: 'quiz', trainer: 'chord-role' },
        },
      ],
    },
  ],
}

export default simpleHarmonies
