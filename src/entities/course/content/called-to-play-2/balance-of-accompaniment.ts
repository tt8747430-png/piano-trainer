import type { Lesson } from '@/entities/lesson'

/** Called to Play, level 2, lesson 10, «Искусство аккомпанемента»: the balance of bass, melody and what lies between. */
const balanceOfAccompaniment: Lesson = {
  id: 'balance-of-accompaniment',
  title: { en: 'The balance of accompaniment', ru: 'Баланс аккомпанемента' },
  summary: {
    en: 'Play the bass and the melody louder, and everything between them softer.',
    ru: 'Играйте бас и мелодию громче, а всё, что между ними, тише.',
  },
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
        { kind: 'pattern', pattern: 'M1', piece: 'derznovenie' },
        {
          kind: 'note',
          text: {
            en: 'With too much cream, nobody can eat the cake.',
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
            en: 'The bass and the melody always sound brighter. Play the chords, fills and ornaments 20 to 30 per cent quieter, as a background.',
            ru: 'Бас и мелодия всегда звучат ярче. Аккорды, заполнение и украшения играйте на 20–30 % тише, как фон.',
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
            en: 'A master is judged by the sound, more than by speed or the number of notes. Place light and shade as a painter does, and listen as you play.',
            ru: 'Мастера узнают по звуку больше, чем по скорости или количеству нот. Расставляйте свет и тень, как художник, и слушайте себя во время игры.',
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
              en: 'In each one, work on the balance and on a singing, connected sound.',
              ru: 'В каждой работайте над балансом и звуковедением.',
            },
          ],
        },
        { kind: 'chords', symbols: ['Gm', 'F', 'Cm', 'Gm', 'A7', 'D'] },
        {
          kind: 'link',
          title: {
            en: '“Боже, лишь на милость уповаю я Твою” in the Player',
            ru: '«Боже, лишь на милость уповаю я Твою» в плеере',
          },
          target: { opens: 'piece', piece: 'milost' },
        },
        {
          kind: 'link',
          title: {
            en: '“Я нуждаюсь в Тебе, мой Спаситель” in the Player',
            ru: '«Я нуждаюсь в Тебе, мой Спаситель» в плеере',
          },
          target: { opens: 'piece', piece: 'nuzhdayus' },
        },
        {
          kind: 'link',
          title: {
            en: '“Господи, вселенную премудро Ты создал!” in the Player',
            ru: '«Господи, вселенную премудро Ты создал!» в плеере',
          },
          target: { opens: 'piece', piece: 'vselennaya' },
        },
        {
          kind: 'link',
          title: {
            en: '“Так уж бывает летней порой” in the Player',
            ru: '«Так уж бывает летней порой» в плеере',
          },
          target: { opens: 'piece', piece: 'letom' },
        },
      ],
    },
  ],
}

export default balanceOfAccompaniment
