import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const majorScales: Lesson = {
  id: 'major-scales',
  title: { en: 'How major scales work', ru: 'Как устроена мажорная гамма' },
  summary: {
    en: 'One pattern of whole and half steps builds a major scale from any note. Then how to finger C major.',
    ru: 'Одна схема тонов и полутонов строит мажорную гамму от любой ноты. И аппликатура до мажора.',
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
          lead: { en: 'A major scale', ru: 'Мажорная гамма' },
          text: {
            en: 'climbs from its tonic to the tonic an octave up. The tonic is the note the scale starts on and is named after.',
            ru: 'поднимается от тоники до тоники октавой выше. Тоника — нота, с которой гамма начинается и по которой названа.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Its steps always follow one pattern: whole, whole, half, whole, whole, whole, half.',
            ru: 'Её шаги всегда идут по одной схеме: тон, тон, полутон, тон, тон, тон, полутон.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'From C, the pattern lands on white keys only. Its two half steps fall where white keys meet: E–F and B–C. Play C major below.',
            ru: 'От до схема ложится только на белые клавиши. Оба полутона приходятся на стык белых клавиш: ми–фа и си–до. Сыграйте до мажор ниже.',
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
            en: 'Start the pattern on G, and the 7th note needs F♯. Start it on F, and the 4th note needs B♭.',
            ru: 'Начните схему с соль — седьмой ноте понадобится фа-диез. Начните с фа — четвёртой ноте понадобится си-бемоль.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'A scale uses every letter once, each note on its own letter. That is why G major has F♯ and not G♭. Play both scales below.',
            ru: 'Гамма проходит каждую букву по одному разу, у каждой ноты своя буква. Поэтому в соль мажоре фа-диез, а не соль-бемоль. Сыграйте обе гаммы ниже.',
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
              en: 'Right hand, going up: play 1 2 3 on C D E. Pass the thumb under to F, then play 1 2 3 4 5 up to the top C.',
              ru: 'Правая рука вверх: сыграйте 1 2 3 на до, ре, ми. Подложите большой палец на фа и сыграйте 1 2 3 4 5 до верхнего до.',
            },
            {
              en: 'Left hand, going up: play 5 4 3 2 1 from C to G. Cross the 3rd finger over to A, then play 3 2 1 up to the top C.',
              ru: 'Левая рука вверх: сыграйте 5 4 3 2 1 от до до соль. Переложите третий палец на ля и сыграйте 3 2 1 до верхнего до.',
            },
            {
              en: 'Coming down, play the same fingers in reverse with each hand.',
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
