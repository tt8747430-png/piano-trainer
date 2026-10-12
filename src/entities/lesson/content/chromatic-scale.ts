import type { Lesson } from '../model/types'

const chromaticScale: Lesson = {
  id: 'chromatic-scale',
  title: { en: 'The chromatic scale', ru: 'Хроматическая гамма' },
  summary: {
    en: 'All twelve keys in turn: how to write it up and down, why it has no tonic, and how to finger it.',
    ru: 'Все двенадцать клавиш подряд: как её пишут вверх и вниз, почему у неё нет тоники и как её играть.',
  },
  level: 1,
  category: 'scales',
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'Every key in turn', ru: 'Все клавиши подряд' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The chromatic scale', ru: 'Хроматическая гамма' },
          text: {
            en: 'plays every key, white and black, a half step at a time. An octave holds twelve half steps. Play it below.',
            ru: 'проходит все клавиши подряд, белые и чёрные, по полутонам. В октаве двенадцать полутонов. Сыграйте её ниже.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4/8 C#4/8 D4/8 D#4/8 E4/8 F4/8 F#4/8 G4/8 G#4/8 A4/8 A#4/8 B4/8 C5/2',
        },
      ],
    },
    {
      heading: { en: 'Sharps going up, flats coming down', ru: 'Вверх с диезами, вниз с бемолями' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Going up, a black key is usually written as the sharp of the note below. Coming down, it is the flat of the note above. So each name points the way the line moves. Play the scale coming down below.',
            ru: 'Вверх чёрную клавишу обычно пишут как диез нижней ноты. Вниз — как бемоль верхней. Так имя ноты показывает, куда идёт мелодия. Сыграйте ниже гамму вниз.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C5/8 B4/8 B♭4/8 A4/8 A♭4/8 G4/8 G♭4/8 F4/8 E4/8 E♭4/8 D4/8 D♭4/8 C4/2',
        },
      ],
    },
    {
      heading: { en: 'Starting on any note', ru: 'От любой ноты' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Every key counts the same in the chromatic scale. So it has no tonic, and it is in no key. Call it “a chromatic scale starting on E”, never “a chromatic scale in E”.',
            ru: 'В хроматической гамме все клавиши равны. Поэтому у неё нет тоники, а значит, нет и тональности. Говорят «хроматическая гамма от ми», но не «в ми».',
          },
        },
      ],
    },
    {
      heading: { en: 'Fingering', ru: 'Аппликатура' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Two fingers play most of the scale, so the hand barely moves.',
            ru: 'Гамму играют в основном два пальца, и рука почти не двигается.',
          },
        },
        {
          kind: 'steps',
          steps: [
            {
              en: 'Play every black key with the 3rd finger.',
              ru: 'Каждую чёрную клавишу играйте третьим пальцем.',
            },
            {
              en: 'Play every white key with the thumb.',
              ru: 'Каждую белую клавишу играйте большим пальцем.',
            },
            {
              en: 'Where two white keys meet (E–F, B–C), going up, the right hand plays them 1 2. The left hand plays them 2 1.',
              ru: 'Где встречаются две белые (ми–фа, си–до), вверх правая рука играет их 1 2. Левая рука играет их 2 1.',
            },
          ],
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: {
            en: 'Play the chromatic scale from E up to A.',
            ru: 'Сыграйте хроматическую гамму от ми вверх до ля.',
          },
          answer: { notes: ['E', 'F', 'F#', 'G', 'G#', 'A'], rising: true },
        },
      ],
    },
  ],
}

export default chromaticScale
