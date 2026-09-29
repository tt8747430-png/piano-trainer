import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const keySignatures: Lesson = {
  id: 'key-signatures',
  title: { en: 'Key signatures and the circle of fifths', ru: 'Ключевые знаки и квинтовый круг' },
  summary: {
    en: 'A key’s sharps or flats written once, the order they come in, and the circle that orders the keys.',
    ru: 'Знаки тональности, записанные один раз, порядок их появления и круг, упорядочивающий тональности.',
  },
  level: 2,
  category: 'theory',
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'Sharps or flats, once', ru: 'Знаки один раз' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Rather than mark every F♯ in D major, the music writes the key’s sharps once at the start of each line, the key signature. They hold for every note of that letter, in every octave, until the signature changes.',
            ru: 'Чтобы не ставить диез перед каждым фа в ре мажоре, знаки тональности пишут один раз в начале каждой строки — это ключевые знаки. Они действуют на все ноты с этой буквой во всех октавах, пока ключевые знаки не сменятся.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          key: { tonic: note('D'), minor: false },
          notes: 'D4 E4 F#4 G4 A4 B4 C#5 D5',
        },
      ],
    },
    {
      heading: { en: 'The order of sharps', ru: 'Порядок диезов' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Sharps always come in the same order, F C G D A E B, each a 5th above the last. A sharp key’s tonic is a half step above its last sharp: F♯ and C♯ make D major.',
            ru: 'Диезы всегда появляются в одном порядке — фа, до, соль, ре, ля, ми, си, — каждый на квинту выше предыдущего. Тоника диезной тональности на полутон выше последнего диеза: фа-диез и до-диез — это ре мажор.',
          },
        },
      ],
    },
    {
      heading: { en: 'The order of flats', ru: 'Порядок бемолей' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Flats come in the reverse order, B E A D G C F. A flat key’s tonic is its second-last flat: B♭ E♭ A♭ make E♭ major. F major, with one flat, B♭, is the one to remember.',
            ru: 'Бемоли идут в обратном порядке — си, ми, ля, ре, соль, до, фа. Тоника бемольной тональности — предпоследний бемоль: си-бемоль, ми-бемоль, ля-бемоль — это ми-бемоль мажор. Фа мажор с одним бемолем, си-бемолем, надо просто запомнить.',
          },
        },
      ],
    },
    {
      heading: { en: 'The circle of fifths', ru: 'Квинтовый круг' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Put the keys on a circle a 5th apart: each step up a 5th adds a sharp, each step down a flat, and each major key’s relative minor sits beside it. Neighbours on the circle share all but one note, which is why music moves between them so easily.',
            ru: 'Расположите тональности по кругу через квинту: каждый шаг на квинту вверх добавляет диез, вниз — бемоль, а рядом с каждым мажором стоит его параллельный минор. Соседи по кругу различаются одной нотой, поэтому музыка так легко переходит между ними.',
          },
        },
        {
          kind: 'link',
          title: { en: 'The circle of fifths in Keys', ru: 'Квинтовый круг в тональностях' },
          target: { place: 'keys', key: { tonic: note('C'), minor: false } },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: {
            en: 'Play the sharps of A major’s signature.',
            ru: 'Сыграйте ключевые диезы ля мажора.',
          },
          answer: { notes: ['F#', 'C#', 'G#'] },
        },
      ],
    },
  ],
}

export default keySignatures
