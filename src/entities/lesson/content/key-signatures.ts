import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const keySignatures: Lesson = {
  id: 'key-signatures',
  title: { en: 'Key signatures and the circle of fifths', ru: 'Ключевые знаки и квинтовый круг' },
  summary: {
    en: 'How a key’s sharps or flats are written once, the order they come in, and the circle of fifths.',
    ru: 'Как знаки тональности пишут один раз, в каком порядке они идут и какой круг выстраивает тональности.',
  },
  level: 2,
  category: 'theory',
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'Sharps or flats, once a line', ru: 'Знаки в начале строки' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'D major has two sharps, F♯ and C♯. The music does not mark every F♯ and C♯.',
            ru: 'В ре мажоре два диеза: фа-диез и до-диез. Их не ставят перед каждой нотой.',
          },
        },
        {
          kind: 'text',
          lead: { en: 'The key signature', ru: 'Ключевые знаки' },
          text: {
            en: 'writes the key’s sharps once, at the start of each line.',
            ru: '— это знаки тональности, записанные один раз в начале каждой строки.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'A sharp in the signature holds for every note of that letter, in every octave. It holds until the signature changes.',
            ru: 'Ключевой знак действует на все ноты с этим названием во всех октавах. Он действует, пока ключевые знаки не сменятся.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Play the D major scale below: its F and C are sharp.',
            ru: 'Сыграйте гамму ре мажор ниже: фа и до в ней — с диезом.',
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
            en: 'Sharps always come in the same order: F C G D A E B. Each is a 5th above the last.',
            ru: 'Диезы всегда появляются в одном порядке: фа, до, соль, ре, ля, ми, си. Каждый — на квинту выше предыдущего.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'A sharp key’s tonic is a half step above its last sharp. F♯ and C♯ make D major.',
            ru: 'Тоника диезной тональности на полутон выше последнего диеза. Фа-диез и до-диез — это ре мажор.',
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
            en: 'Flats come in the reverse order: B E A D G C F.',
            ru: 'Бемоли идут в обратном порядке: си, ми, ля, ре, соль, до, фа.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'A flat key’s tonic is its second-last flat. B♭ E♭ A♭ make E♭ major.',
            ru: 'Тоника бемольной тональности — предпоследний бемоль. Си-бемоль, ми-бемоль, ля-бемоль — это ми-бемоль мажор.',
          },
        },
        {
          kind: 'note',
          text: {
            en: 'F major has one flat, B♭, so it has no second-last flat. Just remember it.',
            ru: 'В фа мажоре один бемоль, си-бемоль, и предпоследнего нет. Фа мажор надо просто запомнить.',
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
            en: 'Put the keys on a circle, a 5th apart. Each step up a 5th adds a sharp. Each step down adds a flat.',
            ru: 'Расположите тональности по кругу через квинту. Каждый шаг на квинту вверх добавляет диез, каждый шаг вниз — бемоль.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Each major key’s relative minor sits beside it on the circle.',
            ru: 'Рядом с каждым мажором на круге стоит его параллельный минор.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Neighbours on the circle differ by only one note. That is why music moves between them so easily.',
            ru: 'Соседние тональности на круге различаются одной нотой. Поэтому музыка так легко переходит между ними.',
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
