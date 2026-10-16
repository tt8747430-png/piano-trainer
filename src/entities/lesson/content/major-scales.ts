import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const majorScales: Lesson = {
  id: 'major-scales',
  title: { en: 'How major scales work', ru: 'Как устроена мажорная гамма' },
  summary: {
    en: 'Build a major scale on any note and finger C major.',
    ru: 'Строить мажорную гамму от любой ноты и играть до мажор с аппликатурой.',
  },
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
            en: 'climbs from its tonic by whole, whole, half, whole, whole, whole, half. From C that is the white keys.',
            ru: 'поднимается от тоники так: тон, тон, полутон, тон, тон, тон, полутон. От до это белые клавиши.',
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
            en: 'From G the 7th note needs F♯, from F the 4th needs B♭. Each letter comes once, so G major has F♯, not G♭.',
            ru: 'От соль седьмой ноте нужен фа-диез, от фа четвёртой — си-бемоль. Каждая буква встречается один раз, поэтому в соль мажоре фа-диез, а не соль-бемоль.',
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
              en: 'Right hand: 1 2 3, thumb under to F, 1 2 3 4 5.',
              ru: 'Правая рука: 1 2 3, большой палец под руку на фа, 1 2 3 4 5.',
            },
            {
              en: 'Left hand: 5 4 3 2 1, 3rd finger over to A, 3 2 1.',
              ru: 'Левая рука: 5 4 3 2 1, третий палец через большой на ля, 3 2 1.',
            },
            { en: 'Down: the same, in reverse.', ru: 'Вниз — то же в обратном порядке.' },
          ],
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 A4 B4 C5' },
        { kind: 'notes', clef: 'bass', notes: 'C3 D3 E3 F3 G3 A3 B3 C4' },
      ],
    },
    {
      heading: { en: 'Each note has a degree', ru: 'У каждой ноты своя ступень' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Scale degrees', ru: 'Ступени' },
          text: {
            en: 'number the notes 1 to 7 from the tonic. 1 is the tonic, 4 the subdominant, 5 the dominant.',
            ru: 'нумеруют ноты от 1 до 7 начиная с тоники. 1 — тоника, 4 — субдоминанта, 5 — доминанта.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 A4 B4 C5' },
        {
          kind: 'note',
          text: {
            en: 'Degree 7, the leading note, pulls up to the tonic.',
            ru: 'Седьмая ступень, вводный тон, тянется вверх к тонике.',
          },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play the notes of D major.', ru: 'Сыграйте ноты ре мажора.' },
          answer: { notes: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'] },
        },
        {
          kind: 'link',
          title: { en: 'Any scale in the Player', ru: 'Любая гамма в плеере' },
          target: { opens: 'exercise', exercise: 'scale', root: note('D') },
        },
        {
          kind: 'link',
          title: { en: 'Build scales in the Quiz', ru: 'Построение гамм в тестах' },
          target: { opens: 'quiz', trainer: 'build-scale' },
        },
      ],
    },
  ],
}

export default majorScales
