import type { Lesson } from '@/entities/lesson'

/** Called to Play, level 2, lesson 3, «Размер 6/8 и 12/8»: what a meter says, the two compound meters, and the five ways in 6/8. */
const sixEightAndTwelveEight: Lesson = {
  id: 'six-eight-and-twelve-eight',
  title: { en: '6/8 and 12/8', ru: 'Размеры 6/8 и 12/8' },
  summary: {
    en: 'Read a time signature, count 6/8 and 12/8, and play the five ways in 6/8.',
    ru: 'Читайте размер, считайте 6/8 и 12/8 и играйте пять видов в 6/8.',
  },
  sections: [
    {
      heading: { en: 'What a time signature says', ru: 'Что показывает размер' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A time signature', ru: 'Размер' },
          text: {
            en: 'is two numbers at the start. The top one counts the beats in a bar. The bottom one is the note that gets a beat: 4 a quarter, 8 an eighth.',
            ru: '— это два числа в начале нот. Верхнее показывает, сколько долей в такте. Нижнее — какая нота равна доле: 4 — четверть, 8 — восьмая.',
          },
        },
        { kind: 'pattern', pattern: 'M1', piece: 'zemlya' },
      ],
    },
    {
      heading: { en: '6/8: two beats of three', ru: '6/8: две доли по три' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A bar of 6/8 holds six eighths, felt as two big beats of three. Count one-two-three, four-five-six, and lean on one and four.',
            ru: 'В такте 6/8 шесть восьмых, которые слышатся как две большие доли по три. Считайте: раз-два-три, четыре-пять-шесть, с опорой на «раз» и «четыре».',
          },
        },
        { kind: 'pattern', pattern: 'M1', piece: 'dveri' },
      ],
    },
    {
      heading: { en: '12/8: four beats of three', ru: '12/8: четыре доли по три' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A bar of 12/8 holds twelve eighths: four big beats of three. It is like two bars of 6/8 joined together.',
            ru: 'В такте 12/8 двенадцать восьмых: четыре большие доли по три. Это как два такта 6/8, соединённые вместе.',
          },
        },
        { kind: 'pattern', pattern: 'M1', piece: 'angely' },
      ],
    },
    {
      heading: { en: 'The five ways in 6/8', ru: 'Пять видов в 6/8' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Way 1 in 6/8 is above. Here are ways 2 to 5 of level 1, each fitted into a bar of 6/8.',
            ru: 'Первый вид в 6/8 звучит выше. Здесь виды 2–5 первого уровня, каждый в такте 6/8.',
          },
        },
        { kind: 'pattern', pattern: 'M2', piece: 'dveri' },
        { kind: 'pattern', pattern: 'M3', piece: 'dveri' },
        { kind: 'pattern', pattern: 'M4', piece: 'dveri' },
        { kind: 'pattern', pattern: 'M5', piece: 'dveri' },
      ],
    },
    {
      heading: { en: 'Practice', ru: 'Практика' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Play this row of chords in each way on its own.',
              ru: 'Играйте эту цепочку аккордов каждым видом отдельно.',
            },
            {
              en: 'Then change the way on every chord.',
              ru: 'Затем меняйте вид на каждом аккорде.',
            },
          ],
        },
        { kind: 'chords', symbols: ['C', 'Dm', 'G', 'C', 'F', 'C', 'G', 'C'] },
        {
          kind: 'link',
          title: {
            en: '“В двери закрытые” in the Player',
            ru: '«В двери закрытые» в плеере',
          },
          target: { opens: 'piece', piece: 'dveri' },
        },
        {
          kind: 'link',
          title: {
            en: '“Ангелы в небе Господа славят” in the Player',
            ru: '«Ангелы в небе Господа славят» в плеере',
          },
          target: { opens: 'piece', piece: 'angely' },
        },
      ],
    },
  ],
}

export default sixEightAndTwelveEight
