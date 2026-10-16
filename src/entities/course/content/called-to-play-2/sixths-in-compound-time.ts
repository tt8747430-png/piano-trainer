import type { Lesson } from '@/entities/lesson'

/** Called to Play, level 2, lesson 7, «Сексты (6th)»: sixths in 6/8 and in 12/8. */
const sixthsInCompoundTime: Lesson = {
  id: 'sixths-in-compound-time',
  title: { en: 'Sixths in 6/8 and 12/8', ru: 'Сексты в 6/8 и 12/8' },
  summary: {
    en: 'Play rising and falling sixths in 6/8 and 12/8.',
    ru: 'Играйте восходящие и нисходящие сексты в 6/8 и 12/8.',
  },
  sections: [
    {
      heading: { en: 'Sixths in 6/8', ru: 'Сексты в 6/8' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Two notes a 6th apart move by step: a quarter, an eighth, then a long one. The left hand rocks 1–5–8–10–8–5.',
            ru: 'Два звука в сексту движутся по ступеням: четверть, восьмая, затем долгий. Левая рука качается 1–5–8–10–8–5.',
          },
        },
        { kind: 'pattern', pattern: 's6u', piece: 'vboge' },
        { kind: 'pattern', pattern: 's6d', piece: 'vboge' },
      ],
    },
    {
      heading: { en: 'Sixths in 12/8', ru: 'Сексты в 12/8' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A bar of 12/8 takes the figure twice.',
            ru: 'В такте 12/8 фигура звучит дважды.',
          },
        },
        { kind: 'pattern', pattern: 's6u', piece: 'ktoya' },
      ],
    },
    {
      heading: { en: 'Practice', ru: 'Практика' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Play this row of chords with sixths, up and down.',
              ru: 'Сыграйте эту цепочку аккордов секстами, вверх и вниз.',
            },
            {
              en: 'Learn three songs by their plans.',
              ru: 'Выучите три песни по плану.',
            },
          ],
        },
        { kind: 'chords', symbols: ['Am', 'G', 'Dm', 'Am', 'C', 'G', 'Dm', 'E', 'Am'] },
        {
          kind: 'link',
          title: {
            en: '“Кто я в этом мире, что Ты помнишь меня?” in the Player',
            ru: '«Кто я в этом мире, что Ты помнишь меня?» в плеере',
          },
          target: { opens: 'piece', piece: 'ktoya' },
        },
        {
          kind: 'link',
          title: {
            en: '“В Боге одном лишь душа найдет” in the Player',
            ru: '«В Боге одном лишь душа найдет» в плеере',
          },
          target: { opens: 'piece', piece: 'vboge' },
        },
        {
          kind: 'link',
          title: {
            en: '“Если в бурях жизни дух твой удручён” in the Player',
            ru: '«Если в бурях жизни дух твой удручён» в плеере',
          },
          target: { opens: 'piece', piece: 'buri' },
        },
      ],
    },
  ],
}

export default sixthsInCompoundTime
