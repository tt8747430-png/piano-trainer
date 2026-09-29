import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const majorScales: Lesson = {
  id: 'major-scales',
  title: { en: 'How major scales work', ru: 'Как устроена мажорная гамма' },
  summary: {
    en: 'The pattern of whole and half steps, the same from any note, and how C major is fingered.',
    ru: 'Порядок тонов и полутонов, одинаковый от любой ноты, и аппликатура до мажора.',
  },
  level: 1,
  category: 'scales',
  module: 'fundamentals',
  sections: [
    {
      heading: {
        en: 'Whole, whole, half, whole, whole, whole, half',
        ru: 'Тон, тон, полутон, тон, тон, тон, полутон',
      },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A major scale climbs from its tonic to the tonic an octave up by one pattern of steps: whole, whole, half, whole, whole, whole, half. From C the pattern lands on white keys only, since the two half steps fall where the white keys meet: E–F and B–C.',
            ru: 'Мажорная гамма поднимается от тоники к тонике октавой выше по одной схеме шагов: тон, тон, полутон, тон, тон, тон, полутон. От до схема ложится только на белые клавиши: оба полутона приходятся на ми–фа и си–до.',
          },
        },
        { kind: 'scale', root: note('C'), scale: 'major' },
      ],
    },
    {
      heading: { en: 'The same pattern from G and F', ru: 'Та же схема от соль и от фа' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Start the pattern on G and the 7th step needs F♯; start it on F and the 4th needs B♭. Each note keeps its own letter, so a scale uses every letter once: that is why it is F♯ and not G♭.',
            ru: 'Начните схему с соль — и седьмой ступени понадобится фа-диез; с фа — четвёртой понадобится си-бемоль. Каждая нота сохраняет свою букву, и гамма проходит каждую букву по разу: поэтому фа-диез, а не соль-бемоль.',
          },
        },
        { kind: 'scale', root: note('G'), scale: 'major' },
        { kind: 'scale', root: note('F'), scale: 'major' },
      ],
    },
    {
      heading: { en: 'Fingering C major', ru: 'Аппликатура до мажора' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Right hand, going up: 1 2 3 on C D E, then the thumb passes under to F: 1 2 3 4 5 to the top C.',
              ru: 'Правая рука вверх: 1 2 3 на до, ре, ми, затем большой палец подкладывается на фа: 1 2 3 4 5 до верхнего до.',
            },
            {
              en: 'Left hand, going up: 5 4 3 2 1 from C to G, then the 3rd finger crosses over to A: 3 2 1 to the top C.',
              ru: 'Левая рука вверх: 5 4 3 2 1 от до до соль, затем третий палец перекладывается на ля: 3 2 1 до верхнего до.',
            },
            {
              en: 'Coming down, each hand plays the same fingers backwards.',
              ru: 'Вниз каждая рука играет те же пальцы в обратном порядке.',
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
          ask: { en: 'Play the notes of D major.', ru: 'Сыграйте ноты ре мажора.' },
          answer: { notes: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'] },
        },
        {
          kind: 'link',
          title: { en: 'C major in Scales', ru: 'До мажор в гаммах' },
          target: { place: 'scales', root: note('C'), scale: 'major' },
        },
      ],
    },
  ],
}

export default majorScales
