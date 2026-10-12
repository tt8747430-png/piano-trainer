import type { Lesson } from '../model/types'

const sevenTypes: Lesson = {
  id: 'seven-types',
  title: { en: 'The seven types of accompaniment', ru: 'Семь видов аккомпанемента' },
  summary: {
    en: 'Н. В. Боброва’s seven types, all on one hymn: what each is for, and how to mix them in a song.',
    ru: 'Семь видов аккомпанемента Н. В. Бобровой на одном гимне: для чего каждый и как сочетать их в песне.',
  },
  level: 2,
  category: 'accompaniment',
  module: 'seven-types',
  sections: [
    {
      heading: { en: 'One hymn, seven types', ru: 'Один гимн — семь видов' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A type of accompaniment', ru: 'Вид аккомпанемента' },
          text: {
            en: 'is one way to lay out the same chords in both hands.',
            ru: '— это фактура: способ изложить одни и те же аккорды двумя руками.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'In «Семь основных видов аккомпанемента» Боброва plays every type on one hymn, «О наш Отец на небесах».',
            ru: 'В книге «Семь основных видов аккомпанемента» Боброва играет каждый вид на одном гимне — «О наш Отец на небесах».',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'The chords stay the same. Two things change: how much the piano moves, and whether it plays the tune.',
            ru: 'Аккорды не меняются. Меняется другое: насколько подвижна фактура и звучит ли мелодия.',
          },
        },
      ],
    },
    {
      heading: { en: 'Types 1–3: chords', ru: 'Виды 1–3: аккорды' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The first three play only the chords. Type 1 holds them together with the bass. Type 2 takes bass and chord in turn. Type 3 repeats the chord over the bass.',
            ru: 'Первые три вида играют только аккорды. В первом аккорд звучит вместе с басом. Во втором бас и аккорд чередуются. В третьем аккорд повторяется над басом.',
          },
        },
        { kind: 'pattern', pattern: 'r1', piece: 'otche' },
        { kind: 'pattern', pattern: 'r2', piece: 'otche' },
        { kind: 'pattern', pattern: 'r3', piece: 'otche' },
      ],
    },
    {
      heading: { en: 'Type 4: figuration', ru: 'Вид 4: фигурация' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Figuration', ru: 'Фигурация' },
          text: {
            en: 'plays a chord’s notes one at a time, as a moving line.',
            ru: '— это звуки аккорда по одному, движущейся линией.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Type 4 runs that line across both hands. Its variant breaks the chord in the right hand over a bass of root and 5th.',
            ru: 'Четвёртый вид ведёт эту линию через обе руки. Его вариант — ломаное арпеджио правой руки над басом из основного тона и квинты.',
          },
        },
        { kind: 'pattern', pattern: 'r4', piece: 'otche' },
        { kind: 'pattern', pattern: 'r4b', piece: 'otche' },
      ],
    },
    {
      heading: { en: 'Types 5–7: with the melody', ru: 'Виды 5–7: с мелодией' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The last three bring in the tune. Type 5 doubles it in the right hand. Type 6 plays it only at the start and end of each phrase. Type 7 harmonises it, with chord notes under it.',
            ru: 'Последние три вида вводят мелодию. В пятом правая рука дублирует её. В шестом она звучит только в начале и в конце фраз. В седьмом мелодия гармонизована: под ней звучат звуки аккорда.',
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
            en: 'Don’t play a whole hymn in one type. The practicum suggests a type for each part:',
            ru: 'Не играйте весь гимн одним видом. Практикум советует вид для каждой части:',
          },
        },
        {
          kind: 'steps',
          steps: [
            {
              en: 'The verse: figuration (type 4).',
              ru: 'Куплет — фигурация (четвёртый вид).',
            },
            {
              en: 'The chorus: the chord’s pulse (type 3).',
              ru: 'Припев — аккордовая пульсация (третий вид).',
            },
            {
              en: 'The start and the end: the harmonic basis (type 1).',
              ru: 'Начало и конец — гармоническая основа (первый вид).',
            },
            {
              en: 'Where the singers are unsure: the melody doubled (type 5).',
              ru: 'Там, где поющие неуверенны, — дублирование мелодии (пятый вид).',
            },
          ],
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
