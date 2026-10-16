import type { Lesson } from '@/entities/lesson'

const sevenTypes: Lesson = {
  id: 'seven-types',
  title: { en: 'The seven types of accompaniment', ru: 'Семь видов аккомпанемента' },
  summary: {
    en: 'Hear one hymn in N. V. Bobrova’s seven types, then mix them in a hymn.',
    ru: 'Послушайте один гимн в семи видах Н. В. Бобровой, затем сочетайте их в гимне.',
  },
  sections: [
    {
      heading: { en: 'Type 1: harmonic basis', ru: 'Вид 1: гармоническая основа' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A type of accompaniment', ru: 'Вид аккомпанемента' },
          text: {
            en: 'is one way to lay out the same chords in both hands. Bobrova plays all seven on one hymn. Type 1 plays chords and bass together in long, even notes.',
            ru: '— способ изложить одни и те же аккорды двумя руками. Боброва играет все семь на одном гимне. Вид 1: аккорды и бас вместе, долгими ровными нотами.',
          },
        },
        { kind: 'pattern', pattern: 'r1', piece: 'otche' },
      ],
    },
    {
      heading: { en: 'Type 2: bass and chord in turn', ru: 'Вид 2: бас и аккорд по очереди' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The bass takes the strong beats and the chord falls between them. Play the chords lightly.',
            ru: 'Бас звучит на сильных долях, аккорд между ними. Аккорды играйте легко.',
          },
        },
        { kind: 'pattern', pattern: 'r2', piece: 'otche' },
      ],
    },
    {
      heading: { en: 'Type 3: chord pulse', ru: 'Вид 3: аккордовая пульсация' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The right hand repeats the chord in eighths. The bass comes only on beats 1 and 3. Types 1 to 3 play only the chords.',
            ru: 'Правая рука повторяет аккорд восьмыми. Бас звучит только на 1-ю и 3-ю доли. Виды 1–3 играют только аккорды.',
          },
        },
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
            en: 'plays a chord’s notes one at a time, as a moving line. Type 4 runs it across both hands. Its variant keeps it in the right hand over the bass.',
            ru: '— звуки аккорда по одному, движущейся линией. Вид 4 ведёт её через обе руки. Его вариант оставляет её в правой руке над басом.',
          },
        },
        { kind: 'pattern', pattern: 'r4', piece: 'otche' },
        { kind: 'pattern', pattern: 'r4b', piece: 'otche' },
      ],
    },
    {
      heading: { en: 'Type 5: melody doubling', ru: 'Вид 5: дублирование мелодии' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Types 5 to 7 bring in the tune. In type 5 the right hand plays the tune and the left hand breaks the chord under it.',
            ru: 'Виды 5–7 вводят мелодию. В пятом виде правая рука играет мелодию, а левая разбивает аккорд под ней.',
          },
        },
        { kind: 'pattern', pattern: 'r5', piece: 'otche' },
      ],
    },
    {
      heading: { en: 'Type 6: elements of the melody', ru: 'Вид 6: с элементами мелодии' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The tune sounds only at the start and the end of each phrase. Figuration fills the rest.',
            ru: 'Мелодия звучит только в начале и в конце каждой фразы. Остальное заполняет фигурация.',
          },
        },
        { kind: 'pattern', pattern: 'r6', piece: 'otche' },
      ],
    },
    {
      heading: { en: 'Type 7, and mixing the types', ru: 'Вид 7 и сочетание видов' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The tune is on top, with chord notes under its long notes.',
            ru: 'Мелодия наверху, а под её долгими нотами звучат звуки аккорда.',
          },
        },
        { kind: 'pattern', pattern: 'r7', piece: 'otche' },
        {
          kind: 'note',
          text: {
            en: 'In a hymn, mix them: type 1 to open and close, figuration in verses, pulse in choruses, the tune doubled for unsure singers.',
            ru: 'Сочетайте их в гимне: первый вид в начале и в конце, фигурация в куплетах, пульсация в припевах, дублированная мелодия там, где поющие неуверенны.',
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
