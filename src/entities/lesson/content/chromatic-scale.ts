import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const chromaticScale: Lesson = {
  id: 'chromatic-scale',
  title: { en: 'The chromatic scale', ru: 'Хроматическая гамма' },
  summary: {
    en: 'All twelve keys in turn: how to write it up and down, why it has no tonic, and how to finger it.',
    ru: 'Все двенадцать клавиш подряд: как её пишут вверх и вниз, почему у неё нет тоники и как её играть.',
  },
  sections: [
    {
      heading: { en: 'Every key in turn', ru: 'Все клавиши подряд' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The chromatic scale', ru: 'Хроматическая гамма' },
          text: {
            en: 'plays every key, white and black, a half step at a time: twelve to the octave.',
            ru: 'проходит все клавиши подряд, белые и чёрные, по полутонам: двенадцать в октаве.',
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
            en: 'Going up, a black key is usually the sharp of the note below. Coming down, it is the flat of the note above.',
            ru: 'Вверх чёрную клавишу обычно пишут как диез нижней ноты, вниз — как бемоль верхней.',
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
            en: 'Every key counts the same, so the scale has no tonic and no key. Say “a chromatic scale starting on E”, never “in E”.',
            ru: 'Все клавиши в ней равны, поэтому у неё нет тоники и тональности. Говорят «хроматическая гамма от ми», но не «в ми».',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'E4/8 F4/8 F#4/8 G4/8 G#4/8 A4/8 A#4/8 B4/8 C5/8 C#5/8 D5/8 D#5/8 E5/2',
        },
      ],
    },
    {
      heading: { en: 'Fingering', ru: 'Аппликатура' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            { en: 'Black keys: the 3rd finger.', ru: 'Чёрные клавиши — третий палец.' },
            { en: 'White keys: the thumb.', ru: 'Белые клавиши — большой палец.' },
            {
              en: 'Two white keys together (E–F, B–C), going up: right hand 1 2, left hand 2 1.',
              ru: 'Две белые подряд (ми–фа, си–до) вверх: правая рука 1 2, левая 2 1.',
            },
          ],
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'D4/8 D#4/8 E4/8 F4/8 F#4/8 G4/8 G#4/8 A4/8',
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the chromatic scale from E up to A.',
            ru: 'Сыграйте хроматическую гамму от ми вверх до ля.',
          },
          answer: { notes: ['E', 'F', 'F#', 'G', 'G#', 'A'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'Half steps and every interval', ru: 'Полутоны и все интервалы' },
          target: { opens: 'intervals', root: note('C') },
        },
        {
          kind: 'link',
          title: { en: 'Scales by ear in the Quiz', ru: 'Гаммы на слух в тестах' },
          target: { opens: 'quiz', trainer: 'scales-by-ear' },
        },
      ],
    },
  ],
}

export default chromaticScale
