import type { Lesson } from '@/entities/lesson'

/** Called to Play, level 2, final exam: two songs with plans of the learner’s own, sung by a soloist and recorded. */
const calledToPlayTwoExam: Lesson = {
  id: 'called-to-play-two-exam',
  title: { en: 'Level 2 final exam', ru: 'Экзамен второго курса' },
  summary: {
    en: 'Write your own plans for two songs and accompany a singer with them.',
    ru: 'Составьте свои планы для двух песен и аккомпанируйте по ним солисту.',
  },
  sections: [
    {
      heading: { en: 'The assignment', ru: 'Задание' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Prepare two songs, two verses each, with plans of your own. Choose the introduction, character, dynamics, ornaments and ending.',
            ru: 'Подготовьте две песни, по два куплета, по собственным планам. Выберите вступление, характер, динамику, вставки и окончание.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Am', 'Dm', 'F', 'E'] },
        {
          kind: 'link',
          title: {
            en: '“Когда Христос меня простил” in the Player',
            ru: '«Когда Христос меня простил» в плеере',
          },
          target: { opens: 'piece', piece: 'prostil' },
        },
        {
          kind: 'link',
          title: {
            en: '“Твои небеса и Твоя земля” in the Player',
            ru: '«Твои небеса и Твоя земля» в плеере',
          },
          target: { opens: 'piece', piece: 'nebesa' },
        },
      ],
    },
    {
      heading: { en: 'Every ornament you have', ru: 'Все ваши украшения' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The workbook’s table lists sixteen: the five rhythm ways, 3 chords, inversions, 5.1 to 5.3, sixths up and down, octaves, chords, 7th chords and sixths with the melody.',
            ru: 'В таблице тетради их шестнадцать: пять ритмических видов, 3 аккорда, обращения, 5.1–5.3, сексты вверх и вниз, октавы, аккорды, септаккорды и сексты с мелодией.',
          },
        },
        { kind: 'pattern', pattern: 'oct', piece: 'prostil' },
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
              en: 'Play with life and energy, but never cover the voice.',
              ru: 'Играйте живо и бодро, не заглушая голос.',
            },
            {
              en: 'Record a video of your performance.',
              ru: 'Запишите исполнение на видео.',
            },
          ],
        },
        { kind: 'pattern', pattern: 'M4', piece: 'nebesa' },
      ],
    },
  ],
}

export default calledToPlayTwoExam
