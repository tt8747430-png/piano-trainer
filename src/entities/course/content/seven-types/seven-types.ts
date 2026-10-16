import type { Lesson } from '@/entities/lesson'

const sevenTypes: Lesson = {
  id: 'seven-types',
  title: { en: 'The seven types of accompaniment', ru: 'Семь видов аккомпанемента' },
  summary: {
    en: 'Play a hymn in N. V. Bobrova’s seven types, then mix them.',
    ru: 'Играйте гимн семью видами Н. В. Бобровой, затем сочетайте их.',
  },
  sections: [
    {
      heading: { en: 'One hymn, seven types', ru: 'Один гимн — семь видов' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A type of accompaniment', ru: 'Вид аккомпанемента' },
          text: {
            en: 'lays out the same chords in both hands. Bobrova plays all seven on one hymn. Types 1–3 play only the chords.',
            ru: '— способ изложить одни и те же аккорды двумя руками. Боброва играет все семь на одном гимне. Виды 1–3 играют только аккорды.',
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
            en: 'plays a chord’s notes one at a time, as a moving line. Type 4 runs it across both hands, its variant in the right hand over the bass.',
            ru: '— звуки аккорда по одному, движущейся линией. Четвёртый вид ведёт её через обе руки, его вариант — в правой руке над басом.',
          },
        },
        { kind: 'pattern', pattern: 'r4', piece: 'otche' },
        { kind: 'pattern', pattern: 'r4b', piece: 'otche' },
      ],
    },
    {
      heading: { en: 'Types 5–7, and mixing them', ru: 'Виды 5–7 и их сочетание' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The last three bring in the tune.',
            ru: 'Последние три вида вводят мелодию.',
          },
        },
        { kind: 'pattern', pattern: 'r5', piece: 'otche' },
        { kind: 'pattern', pattern: 'r6', piece: 'otche' },
        { kind: 'pattern', pattern: 'r7', piece: 'otche' },
        {
          kind: 'note',
          text: {
            en: 'Mix them in a hymn: type 1 at the start and end, figuration in the verse, the pulse in the chorus, the tune doubled for unsure singers.',
            ru: 'Сочетайте их в гимне: первый вид в начале и конце, фигурация в куплете, пульсация в припеве, дублированная мелодия там, где поющие неуверенны.',
          },
        },
        {
          kind: 'link',
          title: { en: 'The hymn in the Player', ru: 'Гимн в плеере' },
          target: { opens: 'piece', piece: 'otche' },
        },
      ],
    },
  ],
}

export default sevenTypes
