import type { Lesson } from '@/entities/lesson'
import { note } from '@/shared/lib/music'

/** Reading drill: fingers 4 and 5 on F and G complete the right hand's C position. */
const rhFG: Lesson = {
  id: 'rh-f-g',
  title: { en: 'F and G in the right hand', ru: 'Фа и соль в правой руке' },
  summary: {
    en: 'Add F and G to fill the right hand’s C position, one finger for each note from C to G.',
    ru: 'Добавить фа и соль и занять всю позицию до в правой руке: по пальцу на каждую ноту от до до соль.',
  },
  sections: [
    {
      heading: { en: 'F and G on the staff', ru: 'Фа и соль на стане' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Keep the thumb on middle C. Finger 4 plays F, in the first space. Finger 5 plays G, on the second line. Now each finger has its own note.',
            ru: 'Первый палец остаётся на до. Четвёртый играет фа в первом промежутке, пятый — соль на второй линейке. Теперь у каждого пальца своя нота.',
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
            en: 'Fingers 4 and 5 are the weakest. Keep them curved and play them as firmly as the thumb.',
            ru: 'Четвёртый и пятый пальцы самые слабые. Держите их округлыми и играйте ими так же уверенно, как первым.',
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
            en: 'A skip goes line to line or space to space, and skips one finger. C to E, E to G and D to F are skips.',
            ru: 'Скачок идёт с линейки на линейку или из промежутка в промежуток и пропускает один палец. До — ми, ми — соль и ре — фа — скачки.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 E4 G4/2 E4 G4 E4 C4 D4 F4 D4 F4 E4/1' },
      ],
    },
    {
      heading: { en: 'C to G: the whole hand', ru: 'От до к соль: вся рука' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C to G spans the whole hand, thumb to finger 5. On the staff it goes from the ledger line to the second line. Keep the hand still.',
            ru: 'До — соль охватывает всю руку, от первого пальца до пятого. На стане это от добавочной линейки до второй. Рука остаётся на месте.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4/2 G4/2 G4 E4 C4/2 C4 G4 F4 D4 C4/1' },
      ],
    },
    {
      heading: { en: 'Sight-reading', ru: 'Чтение с листа' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'As you play one note, look ahead to the next. Your eyes stay a little ahead of your hand.',
            ru: 'Играя одну ноту, смотрите уже на следующую. Глаза всегда чуть впереди руки.',
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
          answer: { notes: ['G', 'F', 'E', 'D', 'C'], falling: true },
        },
        {
          kind: 'link',
          title: { en: 'Practise reading notes in the Quiz', ru: 'Чтение нот в тестах' },
          target: { opens: 'quiz', trainer: 'reading-notes' },
        },
        {
          kind: 'link',
          title: { en: 'Play the C position in the Player', ru: 'Позиция до в плеере' },
          target: { opens: 'exercise', exercise: 'five-finger', root: note('C') },
        },
      ],
    },
  ],
}

export default rhFG
