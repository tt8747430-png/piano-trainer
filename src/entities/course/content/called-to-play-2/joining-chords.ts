import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const C_MAJOR = { tonic: note('C'), minor: false }
const C_MINOR = { tonic: note('C'), minor: true }

/** Called to Play, level 2, lesson 8, «Соединение аккордов»: I, IV and V joined by their nearest notes, from three positions. */
const joiningChords: Lesson = {
  id: 'joining-chords',
  title: { en: 'Joining chords', ru: 'Соединение аккордов' },
  summary: {
    en: 'Move from I to IV to V by the nearest notes, starting from each position of the first chord.',
    ru: 'Переходите от I к IV и V через ближайшие звуки, начиная с каждого расположения первого аккорда.',
  },
  sections: [
    {
      heading: { en: 'The three main chords', ru: 'Три главных аккорда' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'I, the tonic: home, at rest.',
              ru: 'I, тоника: опора, покой.',
            },
            {
              en: 'IV, the subdominant: a step away from home, a preparation.',
              ru: 'IV, субдоминанта: шаг в сторону от опоры, подготовка.',
            },
            {
              en: 'V, the dominant: tension that wants to go home.',
              ru: 'V, доминанта: напряжение, которое стремится домой.',
            },
          ],
        },
        { kind: 'progression', numerals: 'I IV V I', key: C_MAJOR },
      ],
    },
    {
      heading: { en: 'Move to the nearest note', ru: 'Ведите в ближайший звук' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Move each right-hand note to the nearest note of the next chord. A shared note stays put: C, from C to F.',
            ru: 'Ведите каждый звук правой руки в ближайший звук следующего аккорда. Общий звук остаётся на месте: до при переходе от C к F.',
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
        {
          kind: 'note',
          text: {
            en: 'The hand barely moves, so the change sounds smooth.',
            ru: 'Рука почти не сдвигается, поэтому смена звучит плавно.',
          },
        },
      ],
    },
    {
      heading: { en: 'Start from each position', ru: 'Начните с каждого расположения' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Begin the same join with E at the bottom of the first chord, then with G. Each start gives the top voice a new line.',
            ru: 'Начните то же соединение с ми внизу первого аккорда, затем с соль. Каждое начало даёт верхнему голосу новую линию.',
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
              en: 'Play the three joins in other keys, major and minor, like C minor below.',
              ru: 'Играйте три вида соединения в других тональностях, мажорных и минорных, например в до миноре.',
            },
            {
              en: 'Play two songs in way 5, joining the chords by their nearest notes.',
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
