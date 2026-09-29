import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const findingHome: Lesson = {
  id: 'finding-home',
  title: { en: 'Finding your way on the keys', ru: 'Как ориентироваться на клавиатуре' },
  summary: {
    en: 'The black keys’ groups, the seven letters, middle C, and a hand’s five fingers.',
    ru: 'Группы чёрных клавиш, семь букв, до первой октавы и пять пальцев руки.',
  },
  level: 1,
  category: 'theory',
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'Twos and threes', ru: 'Двойки и тройки' },
      blocks: [
        {
          kind: 'text',
          lead: {
            en: 'The black keys come in groups of two and three,',
            ru: 'Чёрные клавиши идут группами по две и по три',
          },
          text: {
            en: 'all the way along the piano. They are how you find every other key.',
            ru: 'по всей клавиатуре. По ним находят все остальные клавиши.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'C is the white key just left of every group of two; F is the white key just left of every group of three.',
            ru: 'До — белая клавиша слева от каждой группы из двух чёрных; фа — слева от каждой группы из трёх.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4/2 C5/2' },
      ],
    },
    {
      heading: { en: 'Seven letters', ru: 'Семь букв' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The white keys are named with seven letters, A B C D E F G, and then the letters start again: after G comes A. Singers name the same notes do, re, mi, fa, sol, la, si, starting on C.',
            ru: 'Белые клавиши называют семью буквами — A B C D E F G, — а затем буквы повторяются: после G снова идёт A. Те же ноты поют как до, ре, ми, фа, соль, ля, си, начиная с C — до.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 A4 B4 C5' },
      ],
    },
    {
      heading: { en: 'Middle C and the octave', ru: 'До первой октавы и октава' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Middle C', ru: 'До первой октавы' },
          text: {
            en: 'is the C nearest the middle of the piano, written C4. The next C up is C5: an octave higher, eight letters and twelve keys away, the same note sounding higher.',
            ru: '(«среднее до») — ближайшее к середине клавиатуры до, его пишут C4. Следующее до вверх — C5: на октаву выше, через восемь букв и двенадцать клавиш; та же нота, только выше.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'P8' },
      ],
    },
    {
      heading: { en: 'Five fingers', ru: 'Пять пальцев' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Fingers are numbered from the thumb, 1 to 5, in each hand. In a relaxed five-finger position each finger rests on its own white key: the right thumb on middle C, the left little finger on the C below.',
            ru: 'Пальцы нумеруют от большого: 1–5 на каждой руке. В спокойной позиции пяти пальцев каждый палец лежит на своей белой клавише: большой палец правой руки — на до первой октавы, мизинец левой — на до ниже.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4/1' },
        { kind: 'notes', clef: 'bass', notes: 'C3 D3 E3 F3 G3/1' },
        {
          kind: 'note',
          text: {
            en: 'Keep the fingers curved, as if holding a ball, and let the wrist float level with the keys.',
            ru: 'Держите пальцы округлыми, как будто в ладони мяч, а запястье — на уровне клавиш.',
          },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: { en: 'Play any F.', ru: 'Сыграйте любое фа.' },
          answer: { notes: ['F'] },
        },
        {
          kind: 'quiz',
          ask: {
            en: 'Play every white key from C up to G.',
            ru: 'Сыграйте все белые клавиши от до до соль.',
          },
          answer: { notes: ['C', 'D', 'E', 'F', 'G'] },
        },
      ],
    },
  ],
}

export default findingHome
