import type { Lesson } from '../model/types'

/** Called to Play, level 2, lesson 5, «Виды игры для правой руки (6/8), продолжение»: ways 5 and 6. */
const chordsAndInversionsInSixEight: Lesson = {
  id: 'chords-and-inversions-in-six-eight',
  title: { en: 'Chords and inversions in 6/8', ru: 'Аккорды и обращения в 6/8' },
  summary: {
    en: 'Two more right-hand ways in 6/8, the chord with its octave and the chord in two positions.',
    ru: 'Ещё два вида для правой руки в 6/8 — аккорд с октавой и аккорд в двух расположениях.',
  },
  level: 2,
  module: 'called-to-play-2',
  sections: [
    {
      heading: { en: 'Way 5: the chord, then higher', ru: 'Вид 5: аккорд, затем выше' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The chord with its octave, then the same an octave up, short and held. The left hand climbs under it.',
            ru: 'Аккорд с октавой, затем он же октавой выше — коротко и с выдержкой. Левая рука поднимается под ним.',
          },
        },
        { kind: 'pattern', pattern: 't5', piece: 'brat' },
      ],
    },
    {
      heading: { en: 'Way 6: inversions', ru: 'Вид 6: обращения' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Root position on the first beat, the first inversion on the second. The left hand climbs 1–5–8–10–12–15.',
            ru: 'Основной вид на первую долю, первое обращение на вторую. Левая рука поднимается 1–5–8–10–12–15.',
          },
        },
        { kind: 'pattern', pattern: 'inv', piece: 'brat' },
      ],
    },
    {
      heading: { en: 'Practice', ru: 'Практика' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Play this row of chords with both ways.',
              ru: 'Сыграйте эту цепочку аккордов обоими видами.',
            },
            {
              en: 'Learn two songs by their plans.',
              ru: 'Выучите две песни по плану.',
            },
          ],
        },
        { kind: 'chords', symbols: ['Dm', 'Gm', 'A', 'B♭', 'C', 'Dm'] },
        {
          kind: 'link',
          title: {
            en: '«Брат, напомни мне опять» in the Player',
            ru: '«Брат, напомни мне опять» в плеере',
          },
          target: { opens: 'piece', piece: 'brat' },
        },
        {
          kind: 'link',
          title: {
            en: '«Прости меня, Боже» in the Player',
            ru: '«Прости меня, Боже» в плеере',
          },
          target: { opens: 'piece', piece: 'prosti' },
        },
      ],
    },
  ],
}

export default chordsAndInversionsInSixEight
