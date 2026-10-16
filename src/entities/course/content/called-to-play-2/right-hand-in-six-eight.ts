import type { Lesson } from '@/entities/lesson'

/** Called to Play, level 2, lesson 4, «Виды игры для правой руки (6/8)»: ways 1 to 4. */
const rightHandInSixEight: Lesson = {
  id: 'right-hand-in-six-eight',
  title: { en: 'Right-hand ways in 6/8', ru: 'Виды игры правой рукой в 6/8' },
  summary: {
    en: 'Play the right hand’s first four ways in 6/8, then plan a song with them.',
    ru: 'Играйте первые четыре вида правой руки в 6/8, затем составьте с ними план песни.',
  },
  sections: [
    {
      heading: { en: 'Way 1: octave jumps', ru: 'Вид 1: скачки на октаву' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Level 2 calls the right-hand techniques ways and numbers them 1 to 10. Way 1 plays the chord, then its root an octave up and two octaves up.',
            ru: 'Во втором уровне техники правой руки называются видами и пронумерованы от 1 до 10. Вид 1: аккорд, затем его основной тон октавой и двумя октавами выше.',
          },
        },
        { kind: 'pattern', pattern: 't1', piece: 'idti' },
      ],
    },
    {
      heading: { en: 'Way 2: an arpeggio', ru: 'Вид 2: арпеджио' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The chord’s notes climb two octaves in eighths.',
            ru: 'Звуки аккорда поднимаются восьмыми на две октавы.',
          },
        },
        { kind: 'pattern', pattern: 't2', piece: 'idti' },
      ],
    },
    {
      heading: { en: 'Way 3: down to the root', ru: 'Вид 3: вниз к основному тону' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Take the 2nd and 5th together, then step down to the root. Play it high, then an octave lower.',
            ru: 'Возьмите вместе секунду и квинту, затем спуститесь к основному тону. Сыграйте высоко, затем октавой ниже.',
          },
        },
        { kind: 'pattern', pattern: 't3', piece: 'idti' },
      ],
    },
    {
      heading: { en: 'Way 4: a run up 1–2–3–5', ru: 'Вид 4: пассаж вверх 1–2–3–5' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Run the root, 2nd, 3rd and 5th up three octaves in sixteenths.',
            ru: 'Ведите основной тон, секунду, терцию и квинту шестнадцатыми вверх на три октавы.',
          },
        },
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
              en: 'Then write a plan of your own for the third.',
              ru: 'Затем составьте свой план для третьей.',
            },
          ],
        },
        { kind: 'chords', symbols: ['Dm', 'F', 'Gm', 'A', 'B♭', 'A', 'Dm'] },
        {
          kind: 'link',
          title: {
            en: '“Я хочу за Тобою идти” in the Player',
            ru: '«Я хочу за Тобою идти» в плеере',
          },
          target: { opens: 'piece', piece: 'idti' },
        },
        {
          kind: 'link',
          title: {
            en: '“Посмотри ты на Христа” in the Player',
            ru: '«Посмотри ты на Христа» в плеере',
          },
          target: { opens: 'piece', piece: 'posmotri' },
        },
        {
          kind: 'link',
          title: {
            en: '“В Боге одном лишь душа найдет” in the Player',
            ru: '«В Боге одном лишь душа найдет» в плеере',
          },
          target: { opens: 'piece', piece: 'vboge' },
        },
      ],
    },
  ],
}

export default rightHandInSixEight
