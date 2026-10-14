import type { Lesson } from '../model/types'

/** Called to Play, level 2, final exam: two songs with plans of the learner’s own, sung by a soloist and recorded. */
const calledToPlayTwoExam: Lesson = {
  id: 'called-to-play-two-exam',
  title: { en: 'Level 2 final exam', ru: 'Экзамен второго курса' },
  summary: {
    en: 'Called to Play 2’s exam: two songs with plans of your own, one in 4/4 and one in 6/8, accompanying a singer.',
    ru: 'Экзамен Called to Play 2: две песни по собственному плану, в 4/4 и в 6/8, с солистом.',
  },
  level: 3,
  module: 'called-to-play-2',
  sections: [
    {
      heading: { en: 'The assignment', ru: 'Задание' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Prepare two songs with your own plan for two verses: the introduction, the character, the dynamics, the ornaments and the ending.',
            ru: 'Подготовьте две песни по собственному плану на два куплета: вступление, характер, динамику, вставки и окончание.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Am', 'Dm', 'F', 'E'] },
        {
          kind: 'link',
          title: {
            en: '«Когда Христос меня простил» in the Player',
            ru: '«Когда Христос меня простил» в плеере',
          },
          target: { opens: 'piece', piece: 'prostil' },
        },
        {
          kind: 'link',
          title: {
            en: '«Твои небеса и Твоя земля» in the Player',
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
              en: 'Find a soloist: they sing, you accompany.',
              ru: 'Найдите солиста: он поёт, вы аккомпанируете.',
            },
            {
              en: 'Play it live and bright, never covering the voice.',
              ru: 'Играйте живо и бодро, не заглушая голос.',
            },
            {
              en: 'Record a video of it.',
              ru: 'Запишите это на видео.',
            },
          ],
        },
        { kind: 'pattern', pattern: 'M4', piece: 'nebesa' },
      ],
    },
  ],
}

export default calledToPlayTwoExam
