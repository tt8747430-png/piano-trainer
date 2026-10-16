import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const firstSteps: Lesson = {
  id: 'first-steps',
  title: { en: 'First steps', ru: 'Первые шаги' },
  summary: {
    en: 'Sit well at the piano, learn the finger numbers and put your right hand in the C position.',
    ru: 'Правильно сесть за инструмент, выучить номера пальцев и поставить правую руку в позицию до.',
  },
  sections: [
    {
      heading: { en: 'Sit at the piano', ru: 'Посадка' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Sit on the front half of the bench, facing the middle of the keys.',
              ru: 'Сядьте на переднюю половину банкетки, напротив середины клавиатуры.',
            },
            {
              en: 'Feet flat, forearms level with the keys.',
              ru: 'Стопы стоят на полу, предплечья на уровне клавиш.',
            },
            {
              en: 'Curve your fingers as if holding a ball, and play on the fingertips.',
              ru: 'Округлите пальцы, будто держите мяч. Играйте кончиками.',
            },
          ],
        },
        {
          kind: 'question',
          ask: {
            en: 'Keep the hand round and play C, E and G together.',
            ru: 'Не теряя округлости руки, сыграйте вместе до, ми и соль.',
          },
          answer: { chord: 'C' },
        },
      ],
    },
    {
      heading: { en: 'Find middle C', ru: 'Найдите до первой октавы' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Middle C', ru: 'До первой октавы' },
          text: {
            en: 'is the C nearest the middle of the keyboard. You can find every C the same way: the white key just left of two black keys.',
            ru: '— это до ближе всего к середине клавиатуры. Любое до легко найти: это белая клавиша слева от пары чёрных.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4/1' },
      ],
    },
    {
      heading: { en: 'Number your fingers', ru: 'Номера пальцев' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Finger numbers', ru: 'Номера пальцев' },
          text: {
            en: 'run from 1, the thumb, to 5, the little finger. Both hands use the same numbers.',
            ru: 'идут от 1 (большой палец) до 5 (мизинец). В обеих руках они одинаковые.',
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
            en: 'puts your right thumb on middle C and one finger on each white key up to G. Each finger keeps its key, so the hand stays still.',
            ru: '— большой палец правой руки на до, по пальцу на каждой белой клавише до соль. У каждого пальца своя клавиша, рука не двигается.',
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
          lead: { en: 'The beat', ru: 'Доля' },
          text: {
            en: 'is the steady pulse you count under the music. A quarter note lasts one beat, a half note two and a whole note four.',
            ru: '— ровный пульс, который вы считаете под музыку. Четверть длится одну долю, половинная — две, целая — четыре.',
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
            en: 'In the C position, play each finger in turn, from the thumb up to finger 5.',
            ru: 'В позиции до сыграйте по очереди каждым пальцем, от большого до пятого.',
          },
          answer: { notes: ['C', 'D', 'E', 'F', 'G'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Still in the C position, play the key under finger 3.',
            ru: 'Оставаясь в позиции до, сыграйте клавишу под третьим пальцем.',
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
