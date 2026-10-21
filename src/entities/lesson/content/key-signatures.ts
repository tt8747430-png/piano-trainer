import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const keySignatures: Lesson = {
  id: 'key-signatures',
  title: { en: 'Key signatures and the circle of fifths', ru: 'Ключевые знаки и квинтовый круг' },
  summary: {
    en: 'Read a key from the sharps or flats at the start of a line, and find it on the circle of fifths.',
    ru: 'Узнавать тональность по диезам или бемолям в начале строки и находить её на квинтовом круге.',
  },
  sections: [
    {
      heading: { en: 'Sharps written once', ru: 'Знаки пишут один раз' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A key signature', ru: 'Ключевые знаки' },
          text: {
            en: 'is the sharps or flats at the start of each line. D major has F♯ and C♯: every F and C is sharp.',
            ru: '— это диезы или бемоли в начале каждой строки. В ре мажоре фа-диез и до-диез: все фа и до играются с диезом.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          key: { tonic: note('D'), minor: false },
          notes: 'D4 E4 F#4 G4 A4 B4 C#5 D5',
        },
        {
          kind: 'text',
          text: {
            en: 'Play it and find the two black keys.',
            ru: 'Сыграйте строчку. Найдите две чёрные клавиши.',
          },
        },
      ],
    },
    {
      heading: { en: 'Sharp keys: up a half step', ru: 'Диезные тональности: полутон вверх' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Sharps always come in this order: F C G D A E B. The key is a half step above the last sharp. D♯ gives E major.',
            ru: 'Диезы всегда идут в одном порядке: фа, до, соль, ре, ля, ми, си. Тоника на полутон выше последнего диеза. Ре-диез даёт ми мажор.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          key: { tonic: note('E'), minor: false },
          notes: 'E4 F#4 G#4 A4 B4 C#5 D#5 E5',
        },
        {
          kind: 'text',
          text: { en: 'Play E major: four sharps.', ru: 'Сыграйте ми мажор: четыре диеза.' },
        },
      ],
    },
    {
      heading: {
        en: 'Flat keys: the second-last flat',
        ru: 'Бемольные тональности: предпоследний бемоль',
      },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Flats come in reverse order: B E A D G C F. The second-last flat names the key. B♭ E♭ A♭ give E♭ major.',
            ru: 'Бемоли идут в обратном порядке: си, ми, ля, ре, соль, до, фа. Предпоследний бемоль и есть тоника. Си-, ми-, ля-бемоль дают ми-бемоль мажор.',
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
            en: 'F major has one flat, B♭. Learn it by heart.',
            ru: 'У фа мажора один бемоль, си-бемоль. Его надо запомнить.',
          },
        },
      ],
    },
    {
      heading: { en: 'The circle of fifths', ru: 'Квинтовый круг' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The circle of fifths', ru: 'Квинтовый круг' },
          text: {
            en: 'puts the keys round a circle, a 5th apart. Each 5th up adds a sharp. Each 5th down adds a flat.',
            ru: '— это тональности по кругу через квинту. Каждая квинта вверх добавляет диез, каждая квинта вниз — бемоль.',
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
