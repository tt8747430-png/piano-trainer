import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const D_MINOR = { tonic: note('D'), minor: true }

const thinkingInDegrees: Lesson = {
  id: 'thinking-in-degrees',
  title: { en: 'Thinking in degrees', ru: 'Мышление ступенями' },
  summary: {
    en: 'Find a song’s key, name each chord by its degree, and play it in any key without working it out chord by chord.',
    ru: 'Найдите тональность песни, назовите каждый аккорд по ступени — и играйте её в любой тональности, не пересчитывая аккорд за аккордом.',
  },
  level: 2,
  category: 'accompaniment',
  module: 'accompaniment',
  sections: [
    {
      heading: { en: 'Find the key first', ru: 'Сначала найдите тональность' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'To move a song to another key quickly, think of its chords as degrees of its key, not as letters. So first find the key.',
            ru: 'Чтобы быстро переложить песню в другую тональность, думайте об аккордах как о ступенях тональности, а не как о буквах. Поэтому сначала найдите тональность.',
          },
        },
        {
          kind: 'steps',
          steps: [
            {
              en: 'Read the key signature: nine times in ten it names the key, major or its relative minor.',
              ru: 'Посмотрите на ключевые знаки: в девяти случаях из десяти они называют тональность — мажор или параллельный минор.',
            },
            {
              en: 'Look at the first and last chords: a song usually starts and ends at home.',
              ru: 'Посмотрите на первый и последний аккорды: песня обычно начинается и заканчивается дома.',
            },
            {
              en: 'Listen to where the melody’s last note comes to rest: that note is usually the tonic.',
              ru: 'Послушайте, где успокаивается последняя нота мелодии: обычно это тоника.',
            },
          ],
        },
      ],
    },
    {
      heading: { en: 'Name each chord by its degree', ru: 'Назовите каждый аккорд по ступени' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: '«Ромашковые поля» is in D minor and opens Dm7 Gm9 Asus4 Dm7: i7, iv9, Vsus4, i7. The numeral says the degree, its case says major or minor, and what follows says what is added.',
            ru: '«Ромашковые поля» — в ре миноре, и начинается песня с Dm7 Gm9 Asus4 Dm7: i7, iv9, Vsus4, i7. Цифра называет ступень, строчная или заглавная — минор или мажор, а то, что после неё, — добавленные звуки.',
          },
        },
        { kind: 'chords', symbols: ['Dm7', 'Gm9', 'Asus4', 'Dm7'] },
      ],
    },
    {
      heading: { en: 'Play it in any key', ru: 'Играйте в любой тональности' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The degrees stay; only the key changes. In G minor the same i7 iv9 Vsus4 i7 is Gm7 Cm9 Dsus4 Gm7.',
            ru: 'Ступени остаются, меняется только тональность. В соль миноре те же i7 iv9 Vsus4 i7 — это Gm7 Cm9 Dsus4 Gm7.',
          },
        },
        { kind: 'chords', symbols: ['Gm7', 'Cm9', 'Dsus4', 'Gm7'] },
        {
          kind: 'note',
          text: {
            en: 'Practise one progression in every key and the numerals become a habit: the Player’s Through the keys walks it for you.',
            ru: 'Сыграйте одну последовательность во всех тональностях — и ступени войдут в привычку: в плеере это делает «По тональностям».',
          },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: {
            en: 'Play the vi chord of G major.',
            ru: 'Сыграйте аккорд vi ступени соль мажора.',
          },
          answer: { chord: 'Em' },
        },
        {
          kind: 'quiz',
          ask: { en: 'Play the IV chord of D major.', ru: 'Сыграйте аккорд IV ступени ре мажора.' },
          answer: { chord: 'G' },
        },
        {
          kind: 'link',
          title: { en: '«Ромашковые поля» in the Player', ru: '«Ромашковые поля» в плеере' },
          target: { place: 'piece', piece: 'romashki' },
        },
        {
          kind: 'link',
          title: { en: 'D minor in Keys', ru: 'Ре минор в тональностях' },
          target: { place: 'keys', key: D_MINOR },
        },
      ],
    },
  ],
}

export default thinkingInDegrees
