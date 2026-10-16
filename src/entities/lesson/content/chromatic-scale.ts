import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const chromaticScale: Lesson = {
  id: 'chromatic-scale',
  title: { en: 'The chromatic scale', ru: 'Хроматическая гамма' },
  summary: {
    en: 'Play every key in turn, with a fingering that works from any note.',
    ru: 'Играйте все клавиши подряд с аппликатурой, которая подходит от любой ноты.',
  },
  sections: [
    {
      heading: { en: 'Every key in turn', ru: 'Все клавиши подряд' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The chromatic scale', ru: 'Хроматическая гамма' },
          text: {
            en: 'plays every key in order, white and black. Each step is a half step, the smallest on the piano. An octave has twelve of them.',
            ru: 'проходит все клавиши подряд, белые и чёрные. Каждый шаг — полутон, самый маленький на фортепиано. В октаве их двенадцать.',
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
      heading: { en: 'Fingering', ru: 'Аппликатура' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            { en: 'Black keys: finger 3.', ru: 'Чёрные клавиши: третий палец.' },
            { en: 'White keys: the thumb.', ru: 'Белые клавиши: большой палец.' },
            {
              en: 'Except where two white keys sit together, E F or B C. Going up, play them right hand 1 2, left hand 2 1.',
              ru: 'Кроме двух белых рядом: ми фа или си до. Вверх их играют правой рукой 1 2, левой 2 1.',
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
      heading: { en: 'Sharps going up, flats coming down', ru: 'Вверх с диезами, вниз с бемолями' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A black key has two names. Going up, it is usually written as a sharp of the note below. Coming down, as a flat of the note above.',
            ru: 'У чёрной клавиши два имени. Вверх её обычно пишут как диез нижней ноты. Вниз — как бемоль верхней.',
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
            en: 'All twelve keys are equal here, so the scale has no home note. You can start it on any key. This one starts on E.',
            ru: 'Все двенадцать клавиш здесь равны, поэтому у гаммы нет тоники. Начинать можно с любой клавиши. Эта начинается с ми.',
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
          title: { en: 'Count half steps in Intervals', ru: 'Полутоны и все интервалы' },
          target: { opens: 'intervals', root: note('C') },
        },
        {
          kind: 'link',
          title: { en: 'Hear scales in the Quiz', ru: 'Гаммы на слух в тестах' },
          target: { opens: 'quiz', trainer: 'scales-by-ear' },
        },
      ],
    },
  ],
}

export default chromaticScale
