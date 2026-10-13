import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const D_MINOR = { tonic: note('D'), minor: true }

const thinkingInDegrees: Lesson = {
  id: 'thinking-in-degrees',
  title: { en: 'Thinking in degrees', ru: 'Мышление ступенями' },
  summary: {
    en: 'Gorshkov’s lesson 3: find a song’s key, name each chord by its degree, and play it in any key.',
    ru: 'Урок 3 Горшкова: найдите тональность песни, назовите аккорды по ступеням и играйте её в любой тональности.',
  },
  level: 2,
  module: 'gorshkov',
  sections: [
    {
      heading: { en: 'Find the key first', ru: 'Сначала найдите тональность' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Chords named by degree move to any key. So first find the key.',
            ru: 'Аккорды, названные по ступеням, переносятся в любую тональность. Поэтому сначала найдите тональность.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          key: D_MINOR,
          notes: 'A4 G4 F4 E4 D4/1',
        },
        {
          kind: 'steps',
          steps: [
            {
              en: 'The signature: its major or relative minor.',
              ru: 'Ключевые знаки: их мажор или параллельный минор.',
            },
            {
              en: 'The first and last chords: usually home.',
              ru: 'Первый и последний аккорды: обычно это дом.',
            },
            {
              en: 'The melody’s last note: usually the tonic.',
              ru: 'Последняя нота мелодии: обычно это тоника.',
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
            en: '«Ромашковые поля» is in D minor. Its opening in degrees: i7 iv7 Vsus4 i7.',
            ru: '«Ромашковые поля» — в ре миноре. Начало по ступеням: i7 iv7 Vsus4 i7.',
          },
        },
        { kind: 'chords', symbols: ['Dm7', 'Gm7', 'Asus4', 'Dm7'] },
        {
          kind: 'steps',
          steps: [
            { en: 'The numeral is the degree.', ru: 'Цифра — это ступень.' },
            {
              en: 'Upper case means major, lower case minor.',
              ru: 'Заглавная — мажор, строчная — минор.',
            },
            {
              en: 'What follows says what is added or changed.',
              ru: 'То, что после цифры, говорит, что добавлено или изменено.',
            },
          ],
        },
      ],
    },
    {
      heading: { en: 'Play it in any key', ru: 'Играйте в любой тональности' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The degrees stay. Only the key changes: in G minor, i7 iv7 Vsus4 i7 is Gm7 Cm7 Dsus4 Gm7.',
            ru: 'Ступени остаются, меняется только тональность: в соль миноре i7 iv7 Vsus4 i7 — это Gm7 Cm7 Dsus4 Gm7.',
          },
        },
        { kind: 'chords', symbols: ['Gm7', 'Cm7', 'Dsus4', 'Gm7'] },
        {
          kind: 'note',
          text: {
            en: 'Practise one progression in every key, and the numerals become a habit.',
            ru: 'Сыграйте одну последовательность во всех тональностях — и ступени войдут в привычку.',
          },
        },
        {
          kind: 'link',
          title: { en: 'i7 iv7 Vsus4 i7 through the keys', ru: 'i7 iv7 Vsus4 i7 по тональностям' },
          target: { opens: 'player', numerals: 'i7 iv7 Vsus4 i7', key: D_MINOR, walk: 'fifths' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the vi chord of G major.',
            ru: 'Сыграйте аккорд vi ступени соль мажора.',
          },
          answer: { chord: 'Em' },
        },
        {
          kind: 'question',
          ask: { en: 'Play the IV chord of D major.', ru: 'Сыграйте аккорд IV ступени ре мажора.' },
          answer: { chord: 'G' },
        },
        {
          kind: 'link',
          title: { en: '«Ромашковые поля» in the Player', ru: '«Ромашковые поля» в плеере' },
          target: { opens: 'piece', piece: 'romashki' },
        },
        {
          kind: 'link',
          title: { en: 'D minor in Keys', ru: 'Ре минор в тональностях' },
          target: { opens: 'key', key: D_MINOR },
        },
        {
          kind: 'link',
          title: {
            en: 'Chord functions: tonic, subdominant, dominant',
            ru: 'Функции аккордов: тоника, субдоминанта, доминанта',
          },
          target: { opens: 'lesson', lesson: 'chord-functions' },
        },
      ],
    },
  ],
}

export default thinkingInDegrees
