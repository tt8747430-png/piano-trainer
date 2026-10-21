import type { Lesson } from '@/entities/lesson'

/** Called to Play's lesson 8: the techniques 5.1, 5.2 and 5.3, a voice moving inside the chord. */
const rightHandFive: Lesson = {
  id: 'right-hand-five',
  title: {
    en: 'Right-hand techniques: 5.1, 5.2 and 5.3',
    ru: 'Техники правой руки: 5.1, 5.2 и 5.3',
  },
  summary: {
    en: 'Keep way 5’s dotted bass and move one note inside the right hand’s chord.',
    ru: 'Сохраняйте пунктирный бас пятого способа и ведите один звук внутри аккорда правой руки.',
  },
  sections: [
    {
      heading: { en: '5.1: the ♭7 under the root', ru: '5.1: ♭7 под основным тоном' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'All three techniques keep way 5’s dotted bass. In 5.1, a note a whole tone (two semitones) below the root joins the chord: Dm becomes Dm7.',
            ru: 'Все три техники сохраняют пунктирный бас пятого способа. В 5.1 к аккорду добавляется звук на целый тон (два полутона) ниже основного: Dm становится Dm7.',
          },
        },
        { kind: 'pattern', pattern: 'p51', piece: 'ex8' },
      ],
    },
    {
      heading: { en: '5.2: a falling line', ru: '5.2: нисходящая линия' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The root slides down by semitones under the rest of the chord: 1, 7, ♭7, 6.',
            ru: 'Основной тон спускается по полутонам под остальными звуками аккорда: 1, 7, ♭7, 6.',
          },
        },
        { kind: 'pattern', pattern: 'p52', piece: 'ex8' },
        {
          kind: 'note',
          text: {
            en: 'On a major chord, 5.2 plays only its first three chords.',
            ru: 'На мажорном аккорде 5.2 играет только первые три аккорда.',
          },
        },
      ],
    },
    {
      heading: { en: '5.3: the 3rd moves', ru: '5.3: движется терция' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The 3rd steps down to the 2nd, up to the 4th, then back home: Dm, Dsus2, Dsus4, Dm.',
            ru: 'Терция уходит вниз во вторую ступень, вверх в четвёртую и возвращается: Dm, Dsus2, Dsus4, Dm.',
          },
        },
        { kind: 'pattern', pattern: 'p53', piece: 'ex8' },
      ],
    },
    {
      heading: { en: 'Practice', ru: 'Практика' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Play this row of chords with 5.1, then 5.2, then 5.3.',
              ru: 'Сыграйте эту цепочку аккордов техникой 5.1, затем 5.2, затем 5.3.',
            },
            { en: 'Play the lesson’s study.', ru: 'Сыграйте этюд урока.' },
            {
              en: 'Learn both verses of “Heaven Awaits Me” by its plan.',
              ru: 'Выучите оба куплета «Heaven Awaits Me» по плану.',
            },
          ],
        },
        { kind: 'chords', symbols: ['Dm', 'Gm', 'A', 'Dm', 'D', 'Gm', 'A', 'Dm'] },
        {
          kind: 'link',
          title: { en: 'The lesson’s study', ru: 'Этюд урока' },
          target: { opens: 'piece', piece: 'ex8' },
        },
        {
          kind: 'link',
          title: { en: 'Heaven Awaits Me', ru: 'Heaven Awaits Me' },
          target: { opens: 'piece', piece: 'heaven' },
        },
      ],
    },
  ],
}

export default rightHandFive
