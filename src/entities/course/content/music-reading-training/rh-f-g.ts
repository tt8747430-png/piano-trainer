import type { Lesson } from '@/entities/lesson'
import { note } from '@/shared/lib/music'

/** Reading drill: fingers 4 and 5 on F and G complete the right hand's C position. */
const rhFG: Lesson = {
  id: 'rh-f-g',
  title: { en: 'F and G in the right hand', ru: 'Фа и соль в правой руке' },
  summary: {
    en: 'Fingers 4 and 5 take F4 and G4, completing the C position. Read all five notes from C to G and play them on sight.',
    ru: 'Четвёртый и пятый пальцы берут фа и соль, и позиция до готова. Читайте все пять нот от до до соль и играйте с листа.',
  },
  sections: [
    {
      heading: { en: 'Five fingers, five notes', ru: 'Пять пальцев, пять нот' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Keep the thumb on middle C. Finger 4 takes F4 in the first space, finger 5 takes G4 on the second line.',
            ru: 'Первый палец остаётся на до. Четвёртый берёт фа в первом промежутке, пятый — соль на второй линейке.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4/1' },
        {
          kind: 'question',
          ask: {
            en: 'Play the five notes from C to G, one finger each.',
            ru: 'Сыграйте пять нот от до до соль, по пальцу на ноту.',
          },
          answer: { notes: ['C', 'D', 'E', 'F', 'G'], rising: true },
        },
      ],
    },
    {
      heading: { en: 'F and G on the staff', ru: 'Фа и соль на стане' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'F4 fills the first space, just above E on the bottom line. G4 sits on the second line, where the treble clef curls.',
            ru: 'Фа лежит в первом промежутке, прямо над ми на нижней линейке. Соль стоит на второй линейке, которую обвивает ключ.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4 F4 G4 F4 E4 F4 G4/2' },
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
      ],
    },
    {
      heading: { en: 'Steps up to G', ru: 'Шаги до соль' },
      blocks: [
        { kind: 'notes', clef: 'treble', notes: 'E4 F4 G4/2 G4 F4 E4/2 F4 G4 F4 E4 D4/1' },
        { kind: 'notes', clef: 'treble', notes: 'G4 F4 E4 D4 C4/2 E4/2 F4 E4 F4 G4 G4/1' },
        {
          kind: 'note',
          text: {
            en: 'Keep fingers 4 and 5 curved. They are the weakest, so let them play as firmly as the thumb.',
            ru: 'Держите четвёртый и пятый пальцы округлыми. Они самые слабые, пусть играют так же уверенно, как первый.',
          },
        },
      ],
    },
    {
      heading: { en: 'Skips in the position', ru: 'Скачки в позиции' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Line to line or space to space is a skip. C–E, E–G and D–F each leave one finger out.',
            ru: 'С линейки на линейку или из промежутка в промежуток — скачок. До — ми, ми — соль и ре — фа пропускают один палец.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 E4 G4/2 E4 G4 E4 C4 D4 F4 D4 F4 E4/1' },
        {
          kind: 'question',
          ask: { en: 'Play E, then skip up to G.', ru: 'Сыграйте ми, затем скачком соль.' },
          answer: { notes: ['E', 'G'], rising: true },
        },
      ],
    },
    {
      heading: { en: 'C to G', ru: 'От до к соль' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C to G spans the whole hand, thumb to finger 5. On the staff it goes from the ledger line to the second line.',
            ru: 'До — соль охватывает всю руку, от первого пальца до пятого. На стане — от добавочной линейки до второй.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4/2 G4/2 G4 E4 C4/2 C4 G4 F4 D4 C4/1' },
      ],
    },
    {
      heading: { en: 'Read on sight', ru: 'Чтение с листа' },
      blocks: [
        { kind: 'notes', clef: 'treble', notes: 'C4 E4 D4 F4 E4 G4 F4/2 G4 F4 E4 D4 C4/1' },
        { kind: 'notes', clef: 'treble', meter: '3/4', notes: 'G4 F4 E4 F4/2 D4 E4 C4 E4 G4/2.' },
        { kind: 'notes', clef: 'treble', notes: 'E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 E4/2 D4/2' },
        {
          kind: 'note',
          text: {
            en: 'Look a note ahead as you play. The eye leads, the hand follows.',
            ru: 'Смотрите на ноту вперёд. Глаз ведёт, рука следует.',
          },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play G with finger 5, then step down to C.',
            ru: 'Сыграйте соль пятым пальцем, затем шагами вниз до до.',
          },
          answer: { notes: ['G', 'F', 'E', 'D', 'C'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the first space, then skip down to the note under the staff.',
            ru: 'Сыграйте ноту в первом промежутке, затем скачком ноту под станом.',
          },
          answer: { notes: ['F', 'D'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play C, E and G: ledger line, bottom line, second line.',
            ru: 'Сыграйте до, ми и соль: добавочная, нижняя и вторая линейки.',
          },
          answer: { notes: ['C', 'E', 'G'], rising: true },
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
