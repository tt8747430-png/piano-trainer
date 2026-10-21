import type { Lesson } from '@/entities/lesson'

/** Called to Play's final exam: a song of the learner's own plan, sung by a soloist and recorded. */
const calledToPlayExam: Lesson = {
  id: 'called-to-play-exam',
  title: { en: 'Final exam', ru: 'Итоговый экзамен' },
  summary: {
    en: 'Write your own plan for a song and accompany a singer with it.',
    ru: 'Составьте свой план песни и аккомпанируйте по нему солисту.',
  },
  sections: [
    {
      heading: { en: 'The assignment', ru: 'Задание' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Prepare two verses of “Long I Wandered in the Shadows” with a plan of your own. Choose its introduction, ways, dynamics and embellishments.',
            ru: 'Подготовьте два куплета «Long I Wandered in the Shadows» по собственному плану. Выберите вступление, способы, динамику и украшения.',
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
              en: 'Find a soloist to sing while you accompany.',
              ru: 'Найдите солиста: он поёт, вы аккомпанируете.',
            },
            {
              en: 'Bring out the meaning of the song without covering the voice.',
              ru: 'Раскройте смысл песни, не заглушая голос.',
            },
            { en: 'Record a video of your performance.', ru: 'Запишите исполнение на видео.' },
          ],
        },
        { kind: 'pattern', pattern: 'M4', piece: 'wander' },
      ],
    },
  ],
}

export default calledToPlayExam
