import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const D_MINOR = { tonic: note('D'), minor: true }

const thinkingInDegrees: Lesson = {
  id: 'thinking-in-degrees',
  title: { en: 'Thinking in degrees', ru: 'Мышление ступенями' },
  summary: {
    en: 'Find a song’s key and name each chord by its degree. Then play it in any key without working out each chord.',
    ru: 'Найдите тональность песни и назовите каждый аккорд по ступени. Тогда её можно играть в любой тональности, не пересчитывая каждый аккорд.',
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
            en: 'Think of a song’s chords as degrees of its key, not as letters. Then you can move the song to another key quickly.',
            ru: 'Думайте об аккордах песни как о ступенях тональности, а не как о буквах. Тогда песню можно быстро переложить в другую тональность.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'So first find the key.',
            ru: 'Поэтому сначала найдите тональность.',
          },
        },
        {
          kind: 'steps',
          steps: [
            {
              en: 'Read the key signature. Nine times in ten it names the key: the major or its relative minor.',
              ru: 'Посмотрите на ключевые знаки. В девяти случаях из десяти они указывают тональность: мажор или параллельный минор.',
            },
            {
              en: 'Look at the first and last chords. A song usually starts and ends at home.',
              ru: 'Посмотрите на первый и последний аккорды. Песня обычно начинается и заканчивается дома.',
            },
            {
              en: 'Listen for the note the melody comes to rest on at the end. That note is usually the tonic.',
              ru: 'Послушайте, на какой ноте мелодия останавливается в конце. Обычно это тоника.',
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
            en: '«Ромашковые поля» is in D minor. It opens Dm7 Gm7 Asus4 Dm7: in degrees, i7, iv7, Vsus4, i7.',
            ru: '«Ромашковые поля» — в ре миноре. Песня начинается с Dm7 Gm7 Asus4 Dm7, по ступеням — i7, iv7, Vsus4, i7.',
          },
        },
        {
          kind: 'steps',
          steps: [
            { en: 'The numeral says the degree.', ru: 'Цифра называет ступень.' },
            {
              en: 'Its case says major or minor: upper case major, lower case minor.',
              ru: 'Заглавная или строчная цифра говорит, мажор это или минор.',
            },
            {
              en: 'What follows it says what is added or changed.',
              ru: 'То, что стоит после цифры, говорит, что добавлено или изменено.',
            },
          ],
        },
        {
          kind: 'text',
          text: {
            en: 'Tap the four chords below.',
            ru: 'Нажмите четыре аккорда ниже.',
          },
        },
        { kind: 'chords', symbols: ['Dm7', 'Gm7', 'Asus4', 'Dm7'] },
      ],
    },
    {
      heading: { en: 'Play it in any key', ru: 'Играйте в любой тональности' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The degrees stay the same. Only the key changes. In G minor, the same i7 iv7 Vsus4 i7 is Gm7 Cm7 Dsus4 Gm7.',
            ru: 'Ступени остаются те же, меняется только тональность. В соль миноре те же i7 iv7 Vsus4 i7 — это Gm7 Cm7 Dsus4 Gm7.',
          },
        },
        { kind: 'chords', symbols: ['Gm7', 'Cm7', 'Dsus4', 'Gm7'] },
        {
          kind: 'note',
          text: {
            en: 'Practise one progression in every key, and the numerals become a habit. The Player’s Through the keys walks it for you.',
            ru: 'Сыграйте одну последовательность во всех тональностях — и ступени войдут в привычку. В плеере это делает «По тональностям».',
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
