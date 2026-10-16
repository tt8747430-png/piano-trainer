import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const C_MAJOR = { tonic: note('C'), minor: false }
const C_MINOR = { tonic: note('C'), minor: true }

/** Called to Play, level 2, lesson 8, «Соединение аккордов»: I, IV and V joined by their nearest notes, from three positions. */
const joiningChords: Lesson = {
  id: 'joining-chords',
  title: { en: 'Joining chords', ru: 'Соединение аккордов' },
  summary: {
    en: 'Join I, IV and V by their nearest notes.',
    ru: 'Соединяйте I, IV и V через ближайшие звуки.',
  },
  sections: [
    {
      heading: { en: 'Three main chords', ru: 'Три главных аккорда' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'I, the tonic: the centre, at rest.',
              ru: 'I, тоника: опора, центр звучания.',
            },
            {
              en: 'IV, the subdominant: a move aside, a preparation.',
              ru: 'IV, субдоминанта: движение в сторону, подготовка.',
            },
            {
              en: 'V, the dominant: tension, wanting home.',
              ru: 'V, доминанта: напряжение, стремление вернуться домой.',
            },
          ],
        },
        { kind: 'progression', numerals: 'I IV V I', key: C_MAJOR },
      ],
    },
    {
      heading: { en: 'The nearest note', ru: 'Ближайший звук' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Move each note to its nearest neighbour, never jumping across the keyboard. The join sounds smooth.',
            ru: 'Ведите каждый звук в ближайший соседний, не прыгая через клавиатуру. Соединение звучит плавно.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', hands: 'C3 | C4 E4 G4' },
            { symbol: 'F', hands: 'F2 | C4 F4 A4' },
            { symbol: 'G', hands: 'G2 | B3 D4 G4' },
            { symbol: 'C', hands: 'C3 | C4 E4 G4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Three positions', ru: 'Три вида соединения' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The same join starts from each position of the first chord.',
            ru: 'То же соединение начинают с каждого расположения первого аккорда.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', hands: 'C3 | E4 G4 C5' },
            { symbol: 'F', hands: 'F2 | F4 A4 C5' },
            { symbol: 'G', hands: 'G2 | D4 G4 B4' },
            { symbol: 'C', hands: 'C3 | E4 G4 C5' },
          ],
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', hands: 'C3 | G4 C5 E5' },
            { symbol: 'F', hands: 'F2 | A4 C5 F5' },
            { symbol: 'G', hands: 'G2 | G4 B4 D5' },
            { symbol: 'C', hands: 'C3 | G4 C5 E5' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Practice', ru: 'Практика' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Play the three joins in other keys, major and minor.',
              ru: 'Играйте три вида соединения в других тональностях, мажорных и минорных.',
            },
            {
              en: 'Play two songs with way 5, joining the chords by their nearest notes.',
              ru: 'Сыграйте две песни 5-м видом, соединяя аккорды через ближайшие звуки.',
            },
          ],
        },
        { kind: 'progression', numerals: 'i iv V i', key: C_MINOR },
        {
          kind: 'link',
          title: {
            en: '“Буду жить под защитой Твоих крыл” in the Player',
            ru: '«Буду жить под защитой Твоих крыл» в плеере',
          },
          target: { opens: 'piece', piece: 'kryl' },
        },
        {
          kind: 'link',
          title: {
            en: '“Благословений потоки” in the Player',
            ru: '«Благословений потоки» в плеере',
          },
          target: { opens: 'piece', piece: 'potoki' },
        },
      ],
    },
  ],
}

export default joiningChords
