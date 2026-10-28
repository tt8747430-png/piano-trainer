import { C_MAJOR, note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const B_FLAT = { tonic: note('B', -1), minor: false }

/**
 * Rootless voicings: the left hand's four-note grips, Type A from the 3rd and Type B from the 7th,
 * through the ii–V–I, the 7th falling to the 3rd at each change so the hand stays put.
 */
const rootlessVoicings: Lesson = {
  id: 'rootless-voicings',
  after: ['jazz-voicings', 'guide-tones'],
  title: { en: 'Rootless voicings', ru: 'Расположения без основного тона' },
  summary: {
    en: 'Play the ii–V–I with four notes in the left hand and no root: Type A from the 3rd, Type B from the 7th.',
    ru: 'Играть ii–V–I четырьмя звуками в левой руке без основного тона: тип A от терции, тип B от септимы.',
  },
  sections: [
    {
      heading: { en: 'Leave the root out', ru: 'Без основного тона' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A rootless voicing', ru: 'Расположение без основного тона' },
          text: {
            en: 'drops the root and keeps the 3rd, 7th and two colours: the 9th, and the 5th or 13th. The bass player has the root.',
            ru: 'убирает основной тон и оставляет терцию, септиму и две краски: нону и квинту или терцдециму. Основной тон играет басист.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'Dm9', degrees: '♭3 5 ♭7 9', hands: 'F3 A3 C4 E4 |' },
            { symbol: 'Dm9', degrees: '♭7 9 ♭3 5', hands: 'C3 E3 F3 A3 |' },
          ],
        },
      ],
      takeaway: {
        en: 'Without the root, four notes carry the whole chord.',
        ru: 'Без основного тона четыре звука передают весь аккорд.',
      },
    },
    {
      heading: { en: 'Type A: from the 3rd', ru: 'Тип A: от терции' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Type A', ru: 'Тип A' },
          text: {
            en: 'starts ii and I on their 3rd, 3 5 7 9. V starts on its 7th: 7 9 3 13. The left hand barely moves.',
            ru: 'начинает ii и I с терции: 3 5 7 9. V начинается с септимы: 7 9 3 13. Левая рука почти не двигается.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'Dm9', caption: 'ii', degrees: '♭3 5 ♭7 9', hands: 'F3 A3 C4 E4 |' },
            { symbol: 'G13', caption: 'V', degrees: '♭7 9 3 13', hands: 'F3 A3 B3 E4 |' },
            { symbol: 'CMaj9', caption: 'I', degrees: '3 5 7 9', hands: 'E3 G3 B3 D4 |' },
          ],
        },
      ],
      takeaway: {
        en: 'Type A: 3 5 7 9 on ii and I, 7 9 3 13 on V.',
        ru: 'Тип A: 3 5 7 9 на ii и I, 7 9 3 13 на V.',
      },
    },
    {
      heading: { en: 'Type B: from the 7th', ru: 'Тип B: от септимы' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Type B', ru: 'Тип B' },
          text: {
            en: 'turns Type A over: ii and I start on their 7th, 7 9 3 5, and V on its 3rd, 3 13 7 9.',
            ru: 'переворачивает тип A: ii и I начинаются с септимы, 7 9 3 5, а V — с терции, 3 13 7 9.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'Dm9', caption: 'ii', degrees: '♭7 9 ♭3 5', hands: 'C3 E3 F3 A3 |' },
            { symbol: 'G13', caption: 'V', degrees: '3 13 ♭7 9', hands: 'B2 E3 F3 A3 |' },
            { symbol: 'CMaj9', caption: 'I', degrees: '7 9 3 5', hands: 'B2 D3 E3 G3 |' },
          ],
        },
      ],
      takeaway: {
        en: 'Type B starts where Type A leaves off: on the other guide tone.',
        ru: 'Тип B начинается с другого направляющего тона, чем тип A.',
      },
    },
    {
      heading: { en: 'The 7th falls to the 3rd', ru: 'Септима идёт в терцию' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'At each change, the 7th falls a half step to the next chord’s 3rd. The bottom note takes turns: 3rd, 7th, 3rd.',
            ru: 'На каждой смене септима спускается на полутон в терцию следующего аккорда. Нижний звук чередуется: терция, септима, терция.',
          },
        },
        {
          kind: 'variants',
          variants: [
            {
              label: { en: 'Type A', ru: 'Тип A' },
              caption: { en: 'C falls to B, then F to E', ru: 'до – си, затем фа – ми' },
              example: {
                kind: 'voicings',
                voicings: [
                  { symbol: 'Dm9', degrees: '♭3 5 ♭7 9', hands: 'F3 A3 C4 E4 |' },
                  { symbol: 'G13', degrees: '♭7 9 3 13', hands: 'F3 A3 B3 E4 |' },
                  { symbol: 'CMaj9', degrees: '3 5 7 9', hands: 'E3 G3 B3 D4 |' },
                ],
              },
            },
            {
              label: { en: 'Type B', ru: 'Тип B' },
              caption: { en: 'C falls to B, then F to E', ru: 'до – си, затем фа – ми' },
              example: {
                kind: 'voicings',
                voicings: [
                  { symbol: 'Dm9', degrees: '♭7 9 ♭3 5', hands: 'C3 E3 F3 A3 |' },
                  { symbol: 'G13', degrees: '3 13 ♭7 9', hands: 'B2 E3 F3 A3 |' },
                  { symbol: 'CMaj9', degrees: '7 9 3 5', hands: 'B2 D3 E3 G3 |' },
                ],
              },
            },
          ],
        },
      ],
      takeaway: {
        en: 'Pick the type whose first chord sits nearest, then keep it.',
        ru: 'Выберите тип, чей первый аккорд ближе, и держитесь его.',
      },
    },
    {
      heading: { en: 'In another key', ru: 'В другой тональности' },
      blocks: [
        {
          kind: 'progression',
          numerals: 'ii9 V13 IMaj9',
          key: B_FLAT,
        },
        {
          kind: 'text',
          text: {
            en: 'In B♭ the same shapes sit a whole step lower. Cm9 Type A is E♭ G B♭ D.',
            ru: 'В си-бемоль мажоре те же фигуры на тон ниже. Cm9 типа A — ми-бемоль, соль, си-бемоль, ре.',
          },
        },
        {
          kind: 'voicings',
          key: B_FLAT,
          voicings: [
            { symbol: 'Cm9', caption: 'ii', degrees: '♭3 5 ♭7 9', hands: 'E♭3 G3 B♭3 D4 |' },
            { symbol: 'F13', caption: 'V', degrees: '♭7 9 3 13', hands: 'E♭3 G3 A3 D4 |' },
            { symbol: 'B♭Maj9', caption: 'I', degrees: '3 5 7 9', hands: 'D3 F3 A3 C4 |' },
          ],
        },
      ],
      takeaway: {
        en: 'Learn one key’s grips, then move them through the cycle of 4ths.',
        ru: 'Выучите фигуры в одной тональности и ведите их по квартовому кругу.',
      },
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play Type A for Dm9 in the left hand, from F up.',
            ru: 'Сыграйте левой рукой тип A для Dm9 от фа вверх.',
          },
          answer: { notes: ['F', 'A', 'C', 'E'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play Type B for CMaj9, from B up.',
            ru: 'Сыграйте тип B для CMaj9 от си вверх.',
          },
          answer: { notes: ['B', 'D', 'E', 'G'], rising: true },
        },
        {
          kind: 'link',
          title: {
            en: 'ii–V–I through the keys in the Player',
            ru: 'ii–V–I по тональностям в плеере',
          },
          target: {
            opens: 'player',
            numerals: 'ii9 V13 IMaj9',
            key: C_MAJOR,
            walk: 'fifths',
          },
        },
      ],
    },
  ],
}

export default rootlessVoicings
