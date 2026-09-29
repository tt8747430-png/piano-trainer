import type { Lesson } from '../model/types'

const sevenTypes: Lesson = {
  id: 'seven-types',
  title: { en: 'The seven types of accompaniment', ru: 'Семь видов аккомпанемента' },
  summary: {
    en: 'Н. В. Боброва’s seven types on one hymn: what each is for, and how to mix them in a song.',
    ru: 'Семь видов аккомпанемента Н. В. Бобровой на одном гимне: для чего каждый и как сочетать их в песне.',
  },
  level: 2,
  category: 'accompaniment',
  module: 'accompaniment',
  sections: [
    {
      heading: { en: 'One hymn, seven ways', ru: 'Один гимн — семь способов' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'In «Семь основных видов аккомпанемента» Боброва plays every type on one hymn, «О наш Отец на небесах». The chords stay the same; what changes is how much the piano moves, and whether it plays the tune.',
            ru: 'В книге «Семь основных видов аккомпанемента» Боброва играет каждый вид на одном гимне — «О наш Отец на небесах». Аккорды остаются теми же; меняется то, насколько движется фортепиано и играет ли оно мелодию.',
          },
        },
      ],
    },
    {
      heading: { en: 'Chords', ru: 'Аккорды' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The first three keep to the chords: held together, taken in turn with the bass, or repeated over it.',
            ru: 'Первые три держатся аккордов: аккорды вместе с басом, по очереди с басом или повторяющиеся над ним.',
          },
        },
        { kind: 'pattern', pattern: 'r1', piece: 'otche' },
        { kind: 'pattern', pattern: 'r2', piece: 'otche' },
        { kind: 'pattern', pattern: 'r3', piece: 'otche' },
      ],
    },
    {
      heading: { en: 'Figuration', ru: 'Фигурация' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The fourth breaks the chord into a moving line across both hands, and its variant breaks it in the right hand over a walking bass.',
            ru: 'Четвёртый разбивает аккорд на движущуюся линию через обе руки, а его вариант — в правой руке над идущим басом.',
          },
        },
        { kind: 'pattern', pattern: 'r4', piece: 'otche' },
        { kind: 'pattern', pattern: 'r4b', piece: 'otche' },
      ],
    },
    {
      heading: { en: 'With the melody', ru: 'С мелодией' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The last three bring in the tune: doubled in the right hand, sounding only at the start and end of each phrase, or harmonised under it.',
            ru: 'Последние три вводят мелодию: она дублируется в правой руке, звучит только в начале и в конце фраз или гармонизуется снизу.',
          },
        },
        { kind: 'pattern', pattern: 'r5', piece: 'otche' },
        { kind: 'pattern', pattern: 'r6', piece: 'otche' },
        { kind: 'pattern', pattern: 'r7', piece: 'otche' },
      ],
    },
    {
      heading: { en: 'Mixing them', ru: 'Сочетайте их' },
      blocks: [
        {
          kind: 'note',
          text: {
            en: 'Don’t play a whole hymn in one type. The practicum suggests figuration in the verse and the chord’s pulse in the chorus, the harmonic basis to begin and to end, and the melody doubled where the singers are unsure.',
            ru: 'Не играйте весь гимн одним видом. Практикум советует фигурацию в куплете и аккордовую пульсацию в припеве, гармоническую основу в начале и в конце, а дублирование мелодии там, где поющие неуверенны.',
          },
        },
        {
          kind: 'link',
          title: { en: 'The hymn in the Player', ru: 'Гимн в плеере' },
          target: { place: 'piece', piece: 'otche' },
        },
      ],
    },
  ],
}

export default sevenTypes
