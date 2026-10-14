import type { Lesson } from '../model/types'

/** Called to Play's final exam: a song of the learner's own plan, sung by a soloist and recorded. */
const calledToPlayExam: Lesson = {
  id: 'called-to-play-exam',
  title: { en: 'Final exam', ru: 'Итоговый экзамен' },
  summary: {
    en: 'Two verses of «Long I Wandered in the Shadows» with your own plan, accompanying a singer.',
    ru: 'Два куплета «Long I Wandered in the Shadows» по своему плану, с солистом.',
  },
  level: 2,
  module: 'called-to-play',
  sections: [
    {
      heading: { en: 'The assignment', ru: 'Задание' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Prepare two verses of «Long I Wandered in the Shadows» with your own plan: its introduction, ways, dynamics and embellishments.',
            ru: 'Подготовьте два куплета «Long I Wandered in the Shadows» по своему плану: вступление, способы, динамику и украшения.',
          },
        },
        { kind: 'chords', symbols: ['Am', 'Dm', 'G', 'C', 'F', 'Dm', 'E'] },
        {
          kind: 'link',
          title: {
            en: 'Long I Wandered in the Shadows',
            ru: 'Long I Wandered in the Shadows',
          },
          target: { opens: 'piece', piece: 'wander' },
        },
      ],
    },
    {
      heading: { en: 'Play it with a singer', ru: 'Сыграйте с солистом' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Find a soloist: they sing, you accompany.',
              ru: 'Найдите солиста: он поёт, вы аккомпанируете.',
            },
            {
              en: 'Show the song’s meaning without covering the voice.',
              ru: 'Раскройте смысл песни, не заглушая голос.',
            },
            { en: 'Record a video of it.', ru: 'Запишите это на видео.' },
          ],
        },
        { kind: 'pattern', pattern: 'M4', piece: 'wander' },
      ],
    },
  ],
}

export default calledToPlayExam
