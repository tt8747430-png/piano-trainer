import type { Lesson } from '../model/types'

/** Called to Play's lesson 8: the techniques 5.1, 5.2 and 5.3, a voice moving inside the chord. */
const rightHandFive: Lesson = {
  id: 'right-hand-five',
  title: {
    en: 'Right-hand techniques: 5.1, 5.2 and 5.3',
    ru: 'Техники правой руки: 5.1, 5.2 и 5.3',
  },
  summary: {
    en: 'Way 5 with a voice moving inside the chord. The ♭7 under the root, a falling line, a moving 3rd.',
    ru: 'Пятый способ с голосом, который движется внутри аккорда. ♭7 под основным тоном, нисходящая линия, движущаяся терция.',
  },
  level: 2,
  module: 'called-to-play',
  sections: [
    {
      heading: { en: 'A voice inside the chord', ru: 'Голос внутри аккорда' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Each keeps way 5’s dotted bass, while one note of the chord moves.',
            ru: 'Каждая сохраняет пунктирный бас пятого способа, а один звук аккорда движется.',
          },
        },
        { kind: 'pattern', pattern: 'p51', piece: 'ex8' },
        { kind: 'pattern', pattern: 'p52', piece: 'ex8' },
        {
          kind: 'note',
          text: {
            en: 'On a major chord, 5.2 plays only its first three chords.',
            ru: 'На мажорном аккорде 5.2 играет только первые три аккорда.',
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
              en: 'Play Dm – Gm – A – Dm – D – Gm – A – Dm with the three techniques.',
              ru: 'Сыграйте Dm – Gm – A – Dm – D – Gm – A – Dm тремя техниками.',
            },
            {
              en: 'Learn both verses of «Heaven Awaits Me» by its plan.',
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
