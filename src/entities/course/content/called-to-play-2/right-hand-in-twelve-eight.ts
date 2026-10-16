import type { Lesson } from '@/entities/lesson'

/** Called to Play, level 2, lesson 6, «Виды игры для правой руки (12/8)»: ways 7 to 10, 5.1 to 5.3 and 3 chords. */
const rightHandInTwelveEight: Lesson = {
  id: 'right-hand-in-twelve-eight',
  title: { en: 'Right-hand ways in 12/8', ru: 'Виды игры правой рукой в 12/8' },
  summary: {
    en: 'Fill a bar of 12/8 with ways 7 to 10.',
    ru: 'Заполняйте такт 12/8 видами 7–10.',
  },
  sections: [
    {
      heading: { en: 'Ways 7 and 8', ru: 'Виды 7 и 8' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Way 7, 5.1, plays the chord twice, then twice over its ♭7. Way 8, 5.2, lets the root fall 1–7–♭7–6.',
            ru: 'Вид 7, 5.1: аккорд дважды, затем дважды с ♭7 под ним. Вид 8, 5.2: основной тон опускается 1–7–♭7–6.',
          },
        },
        { kind: 'pattern', pattern: 'p51', piece: 'vyshina' },
        { kind: 'pattern', pattern: 'p52', piece: 'vyshina' },
        {
          kind: 'note',
          text: {
            en: 'On a major chord, play only the first three chords of way 8.',
            ru: 'На мажорном аккорде играйте только первые три аккорда вида 8.',
          },
        },
      ],
    },
    {
      heading: { en: 'Ways 9 and 10', ru: 'Виды 9 и 10' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Way 9, 5.3, moves the 3rd: 3–2–4–3. Way 10 is 3 chords, an octave apart, the last one held.',
            ru: 'Вид 9, 5.3: движется терция, 3–2–4–3. Вид 10 — 3 аккорда через октаву, последний выдержан.',
          },
        },
        { kind: 'pattern', pattern: 'p53', piece: 'vyshina' },
        { kind: 'pattern', pattern: 'c3', piece: 'vyshina' },
      ],
    },
    {
      heading: { en: 'Practice', ru: 'Практика' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Play this row of chords with the new ways.',
              ru: 'Сыграйте эту цепочку аккордов новыми видами.',
            },
            {
              en: 'Learn two songs by their plans.',
              ru: 'Выучите две песни по плану.',
            },
          ],
        },
        { kind: 'chords', symbols: ['Em', 'C', 'Am', 'B', 'C', 'D', 'Em'] },
        {
          kind: 'link',
          title: {
            en: '“Там, в вышине бесконечной” in the Player',
            ru: '«Там, в вышине бесконечной» в плеере',
          },
          target: { opens: 'piece', piece: 'vyshina' },
        },
        {
          kind: 'link',
          title: {
            en: '“Христос, для многих Ты людей – легенда” in the Player',
            ru: '«Христос, для многих Ты людей – легенда» в плеере',
          },
          target: { opens: 'piece', piece: 'legenda' },
        },
      ],
    },
  ],
}

export default rightHandInTwelveEight
