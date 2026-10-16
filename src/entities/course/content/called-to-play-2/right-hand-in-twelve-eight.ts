import type { Lesson } from '@/entities/lesson'

/** Called to Play, level 2, lesson 6, «Виды игры для правой руки (12/8)»: ways 7 to 10, 5.1 to 5.3 and 3 chords. */
const rightHandInTwelveEight: Lesson = {
  id: 'right-hand-in-twelve-eight',
  title: { en: 'Right-hand ways in 12/8', ru: 'Виды игры правой рукой в 12/8' },
  summary: {
    en: 'Fill a bar of 12/8 with ways 7 to 10: the techniques 5.1, 5.2, 5.3 and 3 chords.',
    ru: 'Заполняйте такт 12/8 видами 7–10: техниками 5.1, 5.2, 5.3 и тремя аккордами.',
  },
  sections: [
    {
      heading: {
        en: 'Way 7 (5.1): the ♭7 under the root',
        ru: 'Вид 7 (5.1): ♭7 под основным тоном',
      },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play the chord twice, then twice more with its ♭7 added under it.',
            ru: 'Сыграйте аккорд дважды, затем ещё дважды с ♭7 под ним.',
          },
        },
        { kind: 'pattern', pattern: 'p51', piece: 'vyshina' },
      ],
    },
    {
      heading: { en: 'Way 8 (5.2): a falling line', ru: 'Вид 8 (5.2): нисходящая линия' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The root falls by semitones: 1, 7, ♭7, 6.',
            ru: 'Основной тон спускается по полутонам: 1, 7, ♭7, 6.',
          },
        },
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
      heading: { en: 'Way 9 (5.3): the 3rd moves', ru: 'Вид 9 (5.3): движется терция' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The 3rd moves 3–2–4–3: down to the 2nd, up to the 4th, then back.',
            ru: 'Терция движется 3–2–4–3: вниз во вторую ступень, вверх в четвёртую и обратно.',
          },
        },
        { kind: 'pattern', pattern: 'p53', piece: 'vyshina' },
      ],
    },
    {
      heading: { en: 'Way 10: 3 chords', ru: 'Вид 10: 3 аккорда' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play the chord three times, each an octave higher, and hold the last one.',
            ru: 'Сыграйте аккорд три раза, каждый раз октавой выше, последний выдержите.',
          },
        },
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
              en: 'Play this row of chords with each of ways 7 to 10.',
              ru: 'Сыграйте эту цепочку аккордов каждым из видов 7–10.',
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
