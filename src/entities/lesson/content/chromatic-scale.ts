import type { Lesson } from '../model/types'

const chromaticScale: Lesson = {
  id: 'chromatic-scale',
  title: { en: 'The chromatic scale', ru: 'Хроматическая гамма' },
  summary: {
    en: 'Every key in turn: how it is written going up and coming down, why it has no key, and how it is fingered.',
    ru: 'Все клавиши подряд: как её пишут вверх и вниз, почему у неё нет тональности и какая у неё аппликатура.',
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
          text: {
            en: 'The chromatic scale plays every key, white and black, a half step at a time: twelve half steps to the octave.',
            ru: 'Хроматическая гамма проходит все клавиши, белые и чёрные, по полутонам: двенадцать полутонов до октавы.',
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
            en: 'Going up, a black key is usually written as the sharp of the note below; coming down, as the flat of the note above. Each note then leads the way it moves.',
            ru: 'Вверх чёрную клавишу обычно пишут как диез нижней ноты, вниз — как бемоль верхней. Так каждая нота ведёт туда, куда движется мелодия.',
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
            en: 'With every key equally in it, the chromatic scale has no tonic and so no key. It is “a chromatic scale starting on E”, never “a chromatic scale in E”.',
            ru: 'В хроматической гамме все клавиши равны, поэтому у неё нет тоники, а значит и тональности. Говорят «хроматическая гамма от ми», но не «в ми».',
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
            en: 'Put the 3rd finger on every black key and the thumb on every white key; where two white keys meet (E–F, B–C) play them 1 2. The hand then barely moves.',
            ru: 'Третий палец — на каждую чёрную клавишу, большой — на каждую белую; где встречаются две белые (ми–фа, си–до), играйте их 1 2. Рука при этом почти не двигается.',
          },
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
            ru: 'Сыграйте хроматическую гамму от ми до ля.',
          },
          answer: { notes: ['E', 'F', 'F#', 'G', 'G#', 'A'] },
        },
      ],
    },
  ],
}

export default chromaticScale
