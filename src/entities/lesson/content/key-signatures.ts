import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const keySignatures: Lesson = {
  id: 'key-signatures',
  title: { en: 'Key signatures and the circle of fifths', ru: 'Ключевые знаки и квинтовый круг' },
  summary: {
    en: 'Name a key from its signature and find it on the circle.',
    ru: 'Узнавать тональность по ключевым знакам и находить её на круге.',
  },
  sections: [
    {
      heading: { en: 'Sharps or flats, once a line', ru: 'Знаки в начале строки' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The key signature', ru: 'Ключевые знаки' },
          text: {
            en: 'writes a key’s sharps or flats once, at the start of each line. D major’s F♯ and C♯ hold for every F and C.',
            ru: '— знаки тональности, записанные один раз в начале каждой строки. Фа-диез и до-диез ре мажора действуют на все фа и до.',
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
            en: 'Sharps come in one order: F C G D A E B. The key is a half step above the last sharp: D♯ gives E major.',
            ru: 'Диезы идут в одном порядке: фа, до, соль, ре, ля, ми, си. Тоника на полутон выше последнего диеза: ре-диез даёт ми мажор.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          key: { tonic: note('E'), minor: false },
          notes: 'E4 F#4 G#4 A4 B4 C#5 D#5 E5',
        },
      ],
    },
    {
      heading: { en: 'The order of flats', ru: 'Порядок бемолей' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Flats come in the reverse order: B E A D G C F. The key is the second-last flat: B♭ E♭ A♭ give E♭ major.',
            ru: 'Бемоли идут в обратном порядке: си, ми, ля, ре, соль, до, фа. Тоника — предпоследний бемоль: си-, ми-, ля-бемоль дают ми-бемоль мажор.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          key: { tonic: note('E', -1), minor: false },
          notes: 'E♭4 F4 G4 A♭4 B♭4 C5 D5 E♭5',
        },
        {
          kind: 'note',
          text: {
            en: 'F major’s one flat, B♭, has no second-last: remember it.',
            ru: 'У фа мажора один бемоль, си-бемоль, и предпоследнего нет: его надо запомнить.',
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
            en: 'Set the keys round a circle, a 5th apart. Each 5th up adds a sharp, each 5th down a flat.',
            ru: 'Расположите тональности по кругу через квинту. Каждая квинта вверх добавляет диез, каждая квинта вниз — бемоль.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'P5' },
        {
          kind: 'link',
          title: { en: 'The circle of fifths in Keys', ru: 'Квинтовый круг в тональностях' },
          target: { opens: 'key', key: { tonic: note('C'), minor: false } },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the sharps of A major’s signature.',
            ru: 'Сыграйте ключевые диезы ля мажора.',
          },
          answer: { notes: ['F#', 'C#', 'G#'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the flats of B♭ major’s signature.',
            ru: 'Сыграйте ключевые бемоли си-бемоль мажора.',
          },
          answer: { notes: ['B♭', 'E♭'] },
        },
        {
          kind: 'link',
          title: { en: 'Key signatures in the Quiz', ru: 'Ключевые знаки в тестах' },
          target: { opens: 'quiz', trainer: 'key-signatures' },
        },
      ],
    },
  ],
}

export default keySignatures
