import type { Lesson } from '@/entities/lesson'
import { note } from '@/shared/lib/music'

/** Reading drill: fingers 4 and 5 on F and G complete the right hand's C position. */
const rhFG: Lesson = {
  id: 'rh-f-g',
  title: { en: 'F and G in the right hand', ru: 'Фа и соль в правой руке' },
  summary: {
    en: 'Read and play the five notes from C to G on sight.',
    ru: 'Читать с листа и играть пять нот от до до соль.',
  },
  sections: [
    {
      heading: { en: 'F and G on the staff', ru: 'Фа и соль на стане' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Thumb on middle C. Finger 4 takes F4 in the first space, finger 5 takes G4 on the second line.',
            ru: 'Первый палец на до. Четвёртый берёт фа в первом промежутке, пятый — соль на второй линейке.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4/1' },
      ],
    },
    {
      heading: { en: 'Steps up to G', ru: 'Шаги до соль' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Keep fingers 4 and 5 curved and let them play as firmly as the thumb.',
            ru: 'Держите четвёртый и пятый пальцы округлыми, пусть играют так же уверенно, как первый.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4 F4 G4/2 G4 F4 E4/2 F4 G4 F4 E4 D4/1' },
        { kind: 'notes', clef: 'treble', notes: 'G4 F4 E4 D4 C4/2 E4/2 F4 E4 F4 G4 G4/1' },
      ],
    },
    {
      heading: { en: 'Skips in the position', ru: 'Скачки в позиции' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Line to line or space to space is a skip. C–E, E–G and D–F each leave one finger out.',
            ru: 'С линейки на линейку или из промежутка в промежуток — скачок. До — ми, ми — соль и ре — фа пропускают палец.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 E4 G4/2 E4 G4 E4 C4 D4 F4 D4 F4 E4/1' },
      ],
    },
    {
      heading: { en: 'C to G', ru: 'От до к соль' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C to G spans the whole hand, thumb to finger 5: ledger line to second line.',
            ru: 'До — соль охватывает всю руку, от первого пальца до пятого: от добавочной линейки до второй.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4/2 G4/2 G4 E4 C4/2 C4 G4 F4 D4 C4/1' },
      ],
    },
    {
      heading: { en: 'Read on sight', ru: 'Чтение с листа' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Look a note ahead as you play. The eye leads, the hand follows.',
            ru: 'Смотрите на ноту вперёд. Глаз ведёт, рука следует.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 E4 D4 F4 E4 G4 F4/2 G4 F4 E4 D4 C4/1' },
        { kind: 'notes', clef: 'treble', meter: '3/4', notes: 'G4 F4 E4 F4/2 D4 E4 C4 E4 G4/2.' },
        { kind: 'notes', clef: 'treble', notes: 'E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 E4/2 D4/2' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the note in the first space.',
            ru: 'Сыграйте ноту в первом промежутке.',
          },
          answer: { notes: ['F'] },
        },
        {
          kind: 'question',
          ask: { en: 'Play the note on the second line.', ru: 'Сыграйте ноту на второй линейке.' },
          answer: { notes: ['G'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play G with finger 5, then step down to C.',
            ru: 'Сыграйте соль пятым пальцем, затем шагами вниз до до.',
          },
          answer: { notes: ['G', 'F', 'E', 'D', 'C'] },
        },
        {
          kind: 'link',
          title: { en: 'Reading notes in the Quiz', ru: 'Чтение нот в тестах' },
          target: { opens: 'quiz', trainer: 'reading-notes' },
        },
        {
          kind: 'link',
          title: { en: 'The C position in the Player', ru: 'Позиция до в плеере' },
          target: { opens: 'exercise', exercise: 'five-finger', root: note('C') },
        },
      ],
    },
  ],
}

export default rhFG
