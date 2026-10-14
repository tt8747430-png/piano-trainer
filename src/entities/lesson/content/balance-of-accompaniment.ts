import type { Lesson } from '../model/types'

/** Called to Play, level 2, lesson 10, «Искусство аккомпанемента»: the balance of bass, melody and what lies between. */
const balanceOfAccompaniment: Lesson = {
  id: 'balance-of-accompaniment',
  title: { en: 'The balance of accompaniment', ru: 'Баланс аккомпанемента' },
  summary: {
    en: 'Called to Play 2, lesson 10: bass and melody louder, everything between them softer, the “musical cake”.',
    ru: 'Called to Play 2, урок 10: бас и мелодия громче, всё между ними тише — «музыкальный торт».',
  },
  level: 3,
  module: 'called-to-play-2',
  sections: [
    {
      heading: { en: 'The musical cake', ru: 'Музыкальный торт' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'The bottom layer is the bass.',
              ru: 'Нижний корж — это бас.',
            },
            {
              en: 'The top layer is the melody.',
              ru: 'Верхний корж — это мелодия.',
            },
            {
              en: 'The cream between them is the accompaniment.',
              ru: 'Прослойка крема между ними — аккомпанемент.',
            },
          ],
        },
        { kind: 'pattern', pattern: 'r7', piece: 'derznovenie' },
        {
          kind: 'note',
          text: {
            en: 'Too much cream, and the cake cannot be eaten.',
            ru: 'Если крема слишком много, торт невозможно есть.',
          },
        },
      ],
    },
    {
      heading: { en: 'Louder and softer', ru: 'Громче и тише' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Bass and melody always sound brighter. Chords, filling and ornaments stay softer, a background. Play them 20 to 30 per cent quieter.',
            ru: 'Бас и мелодия всегда звучат ярче. Аккорды, заполнение и украшения — мягче, как фон. Играйте их на 20–30 % тише.',
          },
        },
        { kind: 'pattern', pattern: 'M3', piece: 'milost' },
      ],
    },
    {
      heading: { en: 'Quality of sound', ru: 'Качество звука' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A master is known by the sound, not by speed or the number of notes. Like a painter, place light and shade. And listen.',
            ru: 'Мастера узнают по звуку, а не по скорости или количеству нот. Как художник, расставляйте свет и тень. И слушайте.',
          },
        },
        { kind: 'pattern', pattern: 'M4', piece: 'nuzhdayus' },
      ],
    },
    {
      heading: { en: 'Practice', ru: 'Практика' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Learn four songs by their plans: two in 4/4, two in 6/8.',
              ru: 'Выучите четыре песни по плану: две в 4/4 и две в 6/8.',
            },
            {
              en: 'Work on the balance and on how the sound is led.',
              ru: 'Работайте над балансом и звуковедением.',
            },
          ],
        },
        { kind: 'chords', symbols: ['Gm', 'F', 'Cm', 'Gm', 'A7', 'D'] },
        {
          kind: 'link',
          title: {
            en: '«Боже, лишь на милость уповаю я Твою» in the Player',
            ru: '«Боже, лишь на милость уповаю я Твою» в плеере',
          },
          target: { opens: 'piece', piece: 'milost' },
        },
        {
          kind: 'link',
          title: {
            en: '«Я нуждаюсь в Тебе, мой Спаситель» in the Player',
            ru: '«Я нуждаюсь в Тебе, мой Спаситель» в плеере',
          },
          target: { opens: 'piece', piece: 'nuzhdayus' },
        },
        {
          kind: 'link',
          title: {
            en: '«Господи, вселенную премудро Ты создал!» in the Player',
            ru: '«Господи, вселенную премудро Ты создал!» в плеере',
          },
          target: { opens: 'piece', piece: 'vselennaya' },
        },
        {
          kind: 'link',
          title: {
            en: '«Так уж бывает летней порой» in the Player',
            ru: '«Так уж бывает летней порой» в плеере',
          },
          target: { opens: 'piece', piece: 'letom' },
        },
      ],
    },
  ],
}

export default balanceOfAccompaniment
