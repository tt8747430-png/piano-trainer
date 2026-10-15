import type { Lesson } from '../model/types'

/** Called to Play, level 2, lesson 4, «Виды игры для правой руки (6/8)»: ways 1 to 4. */
const rightHandInSixEight: Lesson = {
  id: 'right-hand-in-six-eight',
  title: { en: 'Right-hand ways in 6/8', ru: 'Виды игры правой рукой в 6/8' },
  summary: {
    en: 'The right hand’s first four ways, each in a bar of 6/8.',
    ru: 'Первые четыре вида игры правой рукой, каждый в такте 6/8.',
  },
  sections: [
    {
      heading: { en: 'Ways 1 and 2', ru: 'Виды 1 и 2' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Way 1 plays the chord, then its octave and the octave above. Way 2 runs the chord’s notes up two octaves in eighths.',
            ru: 'Вид 1: аккорд, затем его октава и октава выше. Вид 2: звуки аккорда восьмыми вверх на две октавы.',
          },
        },
        { kind: 'pattern', pattern: 't1', piece: 'idti' },
        { kind: 'pattern', pattern: 't2', piece: 'idti' },
      ],
    },
    {
      heading: { en: 'Ways 3 and 4', ru: 'Виды 3 и 4' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Way 3 takes the 2nd and 5th together, then steps down to the root, high and then low. Way 4 runs 1–2–3–5 up three octaves in sixteenths.',
            ru: 'Вид 3: секунда и квинта вместе, затем вниз к основному тону — высоко, потом ниже. Вид 4: 1–2–3–5 шестнадцатыми вверх на три октавы.',
          },
        },
        { kind: 'pattern', pattern: 't3', piece: 'idti' },
        { kind: 'pattern', pattern: 't4', piece: 'idti' },
      ],
    },
    {
      heading: { en: 'Practice', ru: 'Практика' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Play this row of chords with each of the four ways.',
              ru: 'Сыграйте эту цепочку аккордов каждым из четырёх видов.',
            },
            {
              en: 'Learn two songs by their plans.',
              ru: 'Выучите две песни по плану.',
            },
            {
              en: 'Then make a plan of your own for a third.',
              ru: 'Затем составьте свой план для третьей.',
            },
          ],
        },
        { kind: 'chords', symbols: ['Dm', 'F', 'Gm', 'A', 'B♭', 'A', 'Dm'] },
        {
          kind: 'link',
          title: {
            en: '«Я хочу за Тобою идти» in the Player',
            ru: '«Я хочу за Тобою идти» в плеере',
          },
          target: { opens: 'piece', piece: 'idti' },
        },
        {
          kind: 'link',
          title: {
            en: '«Посмотри ты на Христа» in the Player',
            ru: '«Посмотри ты на Христа» в плеере',
          },
          target: { opens: 'piece', piece: 'posmotri' },
        },
        {
          kind: 'link',
          title: {
            en: '«В Боге одном лишь душа найдет» in the Player',
            ru: '«В Боге одном лишь душа найдет» в плеере',
          },
          target: { opens: 'piece', piece: 'vboge' },
        },
      ],
    },
  ],
}

export default rightHandInSixEight
