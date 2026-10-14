import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const D_MINOR = { tonic: note('D'), minor: true }

const thinkingInDegrees: Lesson = {
  id: 'thinking-in-degrees',
  title: { en: 'Thinking in degrees', ru: 'Мышление ступенями' },
  summary: {
    en: 'Find a song’s key, name each chord by its degree, and play it in any key.',
    ru: 'Найдите тональность песни, назовите аккорды по ступеням и играйте её в любой тональности.',
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
            en: 'Degrees carry a song to any key. First find its key.',
            ru: 'Ступени переносят песню в любую тональность, поэтому сначала найдите её тональность.',
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
              en: 'The signature: right nine times in ten.',
              ru: 'Ключевые знаки: верны в девяти случаях из десяти.',
            },
            {
              en: 'The melody’s last note: often the tonic.',
              ru: 'Последняя нота мелодии: обычно это тоника.',
            },
            {
              en: 'The first and last chords: usually home.',
              ru: 'Первый и последний аккорды: обычно это дом.',
            },
          ],
        },
        {
          kind: 'note',
          text: { en: 'Hints, not rules.', ru: 'Это подсказки, а не правила.' },
        },
      ],
    },
    {
      heading: { en: 'The key’s chords', ru: 'Аккорды тональности' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: '«Ромашковые поля» is in D minor. Each degree of its scale carries a chord, V with the raised 7th, C♯.',
            ru: '«Ромашковые поля» — в ре миноре. На каждой ступени его гаммы стоит аккорд, на V — с повышенной VII ступенью, до-диезом.',
          },
        },
        {
          kind: 'chords',
          symbols: ['Dm7', 'Em7♭5', 'FMaj7', 'Gm7', 'A7', 'B♭Maj7', 'C7'],
          apart: true,
        },
      ],
    },
    {
      heading: { en: 'Name each chord by its degree', ru: 'Назовите каждый аккорд по ступени' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Each chord takes its degree’s numeral: i7 iv9 Vsus4 i7.',
            ru: 'Каждый аккорд получает цифру своей ступени: i7 iv9 Vsus4 i7.',
          },
        },
        { kind: 'chords', symbols: ['Dm7', 'Gm9', 'Asus4', 'Dm7'] },
        {
          kind: 'steps',
          steps: [
            { en: 'The numeral is the degree.', ru: 'Цифра — это ступень.' },
            {
              en: 'Upper case means major, lower case minor.',
              ru: 'Заглавная — мажор, строчная — минор.',
            },
            { en: 'What follows names the rest.', ru: 'Остальное — после цифры.' },
          ],
        },
        {
          kind: 'note',
          text: {
            en: 'Gorshkov writes Im7 IVm9 Vsus4 Im7.',
            ru: 'Горшков пишет так: Im7 IVm9 Vsus4 Im7.',
          },
        },
      ],
    },
    {
      heading: { en: 'Play it in any key', ru: 'Играйте в любой тональности' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The degrees stay. Only the key changes: in G minor, i7 iv9 Vsus4 i7 is Gm7 Cm9 Dsus4 Gm7.',
            ru: 'Ступени остаются, меняется только тональность: в соль миноре i7 iv9 Vsus4 i7 — это Gm7 Cm9 Dsus4 Gm7.',
          },
        },
        { kind: 'chords', symbols: ['Gm7', 'Cm9', 'Dsus4', 'Gm7'] },
        {
          kind: 'note',
          text: {
            en: 'Practise one progression in every key, and the numerals become a habit.',
            ru: 'Сыграйте одну последовательность во всех тональностях — и ступени войдут в привычку.',
          },
        },
        {
          kind: 'link',
          title: { en: 'i7 iv9 Vsus4 i7 through the keys', ru: 'i7 iv9 Vsus4 i7 по тональностям' },
          target: { opens: 'player', numerals: 'i7 iv9 Vsus4 i7', key: D_MINOR, walk: 'fifths' },
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
          title: {
            en: '«Ромашковые поля»’s chords in any key',
            ru: 'Аккорды «Ромашковых полей» в любой тональности',
          },
          target: {
            opens: 'transpose',
            chords: 'Dm7 Gm9 Asus4 Dm9 Gm9 Csus4 Am7 D D/F# Gm7 Csus4 FMaj9 Bb Gm Em7b5 Asus4 A',
          },
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
