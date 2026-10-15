import type { Lesson } from '@/entities/lesson'

/** Called to Play, level 2, lesson 3, «Размер 6/8 и 12/8»: what a meter says, the two compound meters, and the five ways in 6/8. */
const sixEightAndTwelveEight: Lesson = {
  id: 'six-eight-and-twelve-eight',
  title: { en: '6/8 and 12/8', ru: 'Размеры 6/8 и 12/8' },
  summary: {
    en: 'What a meter says, how 6/8 and 12/8 are counted, and the five ways in 6/8.',
    ru: 'Что показывает размер, как считать 6/8 и 12/8 и пять видов в 6/8.',
  },
  sections: [
    {
      heading: { en: 'What a meter says', ru: 'Что показывает размер' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The top number is how many beats a bar holds. The bottom one is the note that counts as a beat: 4 a quarter, 8 an eighth.',
            ru: 'Верхнее число показывает, сколько долей в такте. Нижнее — какая нота равна одной доле: 4 — четверть, 8 — восьмая.',
          },
        },
        { kind: 'pattern', pattern: 'M1', piece: 'zemlya' },
        {
          kind: 'note',
          text: {
            en: 'Level 1 kept to 4/4.',
            ru: 'На первом уровне все песни были в 4/4.',
          },
        },
      ],
    },
    {
      heading: { en: '6/8: two beats of three', ru: '6/8: две доли по три' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Six eighths, felt as two big beats, each of three. Count one-two-three, four-five-six. It rocks gently.',
            ru: 'Шесть восьмых, которые слышатся как две большие доли по три. Считайте: раз-два-три, четыре-пять-шесть. Это плавное покачивание.',
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
            en: 'Twelve eighths: four big beats of three, or two bars of 6/8 together.',
            ru: 'Двенадцать восьмых: четыре большие доли по три, или два такта 6/8 вместе.',
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
            en: 'The five ways of level 1, each in a bar of 6/8.',
            ru: 'Пять видов первого уровня, каждый в такте 6/8.',
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
              en: 'Play each way on its own over this row of chords.',
              ru: 'Играйте каждый вид отдельно по этой цепочке аккордов.',
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
            en: '«В двери закрытые» in the Player',
            ru: '«В двери закрытые» в плеере',
          },
          target: { opens: 'piece', piece: 'dveri' },
        },
        {
          kind: 'link',
          title: {
            en: '«Ангелы в небе Господа славят» in the Player',
            ru: '«Ангелы в небе Господа славят» в плеере',
          },
          target: { opens: 'piece', piece: 'angely' },
        },
      ],
    },
  ],
}

export default sixEightAndTwelveEight
