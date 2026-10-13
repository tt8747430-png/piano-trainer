import type { Lesson } from '../model/types'

const sevenTypes: Lesson = {
  id: 'seven-types',
  title: { en: 'The seven types of accompaniment', ru: 'Семь видов аккомпанемента' },
  summary: {
    en: 'Н. В. Боброва’s seven types on one hymn, and how to mix them.',
    ru: 'Семь видов аккомпанемента Н. В. Бобровой на одном гимне и как их сочетать.',
  },
  level: 2,
  module: 'seven-types',
  sections: [
    {
      heading: { en: 'One hymn, seven types', ru: 'Один гимн — семь видов' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A type of accompaniment', ru: 'Вид аккомпанемента' },
          text: {
            en: 'lays out the same chords in both hands. Боброва plays all seven on one hymn. Types 1–3 play only the chords.',
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
            en: 'Mix them in a hymn: figuration in the verse, the chord’s pulse in the chorus, type 1 at the start and end, the tune doubled for unsure singers.',
            ru: 'Сочетайте их в гимне: фигурация в куплете, аккордовая пульсация в припеве, первый вид в начале и конце, дублированная мелодия там, где поющие неуверенны.',
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
