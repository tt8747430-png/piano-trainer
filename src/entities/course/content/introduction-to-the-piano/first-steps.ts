import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const firstSteps: Lesson = {
  id: 'first-steps',
  title: { en: 'First steps', ru: 'Первые шаги' },
  summary: {
    en: 'Sit well, number your fingers and find the C position.',
    ru: 'Сесть за инструмент, знать номера пальцев и найти позицию до.',
  },
  sections: [
    {
      heading: { en: 'Sit and shape the hand', ru: 'Посадка и рука' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Sit on the front half of the bench, facing the middle, feet flat.',
              ru: 'Сядьте на край банкетки напротив середины, стопы на полу.',
            },
            {
              en: 'Keep the forearms level with the keys.',
              ru: 'Предплечья — на уровне клавиш.',
            },
            {
              en: 'Curve the fingers as if holding a ball. Play on the fingertips.',
              ru: 'Округлите пальцы, будто держите мяч. Играйте кончиками.',
            },
          ],
        },
        {
          kind: 'question',
          ask: {
            en: 'With a round hand, play C, E and G together.',
            ru: 'Округлой рукой сыграйте вместе до, ми и соль.',
          },
          answer: { chord: 'C' },
        },
      ],
    },
    {
      heading: { en: 'Middle C', ru: 'До первой октавы' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Middle C', ru: 'До первой октавы' },
          text: {
            en: 'is the C nearest the middle of the keyboard. Every C sits just left of a pair of black keys.',
            ru: '— до у середины клавиатуры. Каждое до стоит слева от пары чёрных клавиш.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4/1' },
      ],
    },
    {
      heading: { en: 'Finger numbers', ru: 'Номера пальцев' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Finger numbers', ru: 'Номера пальцев' },
          text: {
            en: 'count from the thumb, 1, to the little finger, 5. Both hands use the same numbers.',
            ru: 'идут от большого (1) к мизинцу (5). В обеих руках они одинаковы.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4/1' },
      ],
    },
    {
      heading: { en: 'The C position', ru: 'Позиция до' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The C position', ru: 'Позиция до' },
          text: {
            en: 'puts the right thumb on middle C and one finger on each white key up to G. The hand stays still.',
            ru: '— большой палец правой руки на до, по пальцу на каждой белой клавише до соль. Рука не сдвигается.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 F4 E4 D4 C4/1' },
      ],
    },
    {
      heading: { en: 'Count the beat', ru: 'Считайте доли' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A beat', ru: 'Доля' },
          text: {
            en: 'is the steady count under music. A quarter note lasts one beat, a half note two, a whole note four.',
            ru: '— ровный счёт музыки. Четверть длится долю, половинная — две, целая — четыре.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4/2 G4/2 G4 F4 E4 D4 C4/1' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'In the C position, play from the thumb up to finger 5.',
            ru: 'В позиции до сыграйте от большого пальца до пятого.',
          },
          answer: { notes: ['C', 'D', 'E', 'F', 'G'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the key under finger 3.',
            ru: 'Сыграйте клавишу под третьим пальцем.',
          },
          answer: { notes: ['E'] },
        },
        {
          kind: 'link',
          title: {
            en: 'The five-finger position in the Player',
            ru: 'Позиция пяти пальцев в плеере',
          },
          target: { opens: 'exercise', exercise: 'five-finger', root: note('C') },
        },
        {
          kind: 'link',
          title: { en: 'Reading notes in the Quiz', ru: 'Чтение нот в тестах' },
          target: { opens: 'quiz', trainer: 'reading-notes' },
        },
      ],
    },
  ],
}

export default firstSteps
