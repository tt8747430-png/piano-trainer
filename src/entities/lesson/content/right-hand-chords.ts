import type { Lesson } from '../model/types'

/** Called to Play's lesson 7: dotted chords, three chords up the keys, and inversions. */
const rightHandChords: Lesson = {
  id: 'right-hand-chords',
  title: {
    en: 'Right-hand techniques: chords up the keyboard',
    ru: 'Техники правой руки: аккорды вверх по клавиатуре',
  },
  summary: {
    en: 'A dotted chord, three chords up the keys, and a chord climbing through its inversions.',
    ru: 'Пунктирный аккорд, три аккорда вверх по клавиатуре и аккорд, который поднимается по обращениям.',
  },
  sections: [
    {
      heading: { en: 'Root position or inversions', ru: 'Основной вид или обращения' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A chord can be played in root position or in an inversion. These three techniques climb the keyboard with it.',
            ru: 'Аккорд можно играть в основном виде или в обращении. Эти три техники поднимаются с ним по клавиатуре.',
          },
        },
        { kind: 'pattern', pattern: 't5', piece: 'ex7' },
        { kind: 'pattern', pattern: 'c3', piece: 'ex7' },
        { kind: 'pattern', pattern: 'inv', piece: 'ex7' },
      ],
    },
    {
      heading: { en: 'Practice', ru: 'Практика' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Play Am – Dm – E – Am – G – F – E – Am with the three techniques.',
              ru: 'Сыграйте Am – Dm – E – Am – G – F – E – Am тремя техниками.',
            },
            {
              en: 'Learn «For Love, For Mercy, For Salvation» by its plan.',
              ru: 'Выучите «For Love, For Mercy, For Salvation» по плану.',
            },
          ],
        },
        { kind: 'chords', symbols: ['Am', 'Dm', 'E', 'Am', 'G', 'F', 'E', 'Am'] },
        {
          kind: 'link',
          title: { en: 'The lesson’s study', ru: 'Этюд урока' },
          target: { opens: 'piece', piece: 'ex7' },
        },
        {
          kind: 'link',
          title: {
            en: 'For Love, For Mercy, For Salvation',
            ru: 'For Love, For Mercy, For Salvation',
          },
          target: { opens: 'piece', piece: 'mercy' },
        },
        {
          kind: 'link',
          title: { en: 'Inversions', ru: 'Обращения' },
          target: { opens: 'lesson', lesson: 'inversions' },
        },
      ],
    },
  ],
}

export default rightHandChords
