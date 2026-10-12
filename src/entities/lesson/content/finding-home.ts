import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const findingHome: Lesson = {
  id: 'finding-home',
  title: { en: 'Finding your way on the keys', ru: 'Как ориентироваться на клавиатуре' },
  summary: {
    en: 'Find any key by the black keys, name the white keys, find middle C and number your fingers.',
    ru: 'Как найти клавишу по чёрным, назвать белые клавиши, найти до первой октавы и пронумеровать пальцы.',
  },
  level: 1,
  category: 'theory',
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'Black keys in twos and threes', ru: 'Чёрные клавиши по две и по три' },
      blocks: [
        {
          kind: 'text',
          lead: {
            en: 'The black keys come in groups of two and three.',
            ru: 'Чёрные клавиши идут группами по две и по три.',
          },
          text: {
            en: 'The groups repeat along the whole piano. Use them to find every other key.',
            ru: 'Группы повторяются по всей клавиатуре. По ним находят все остальные клавиши.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'C is the white key just left of each group of two. F is the white key just left of each group of three. Play the two Cs below.',
            ru: 'До — белая клавиша слева от каждой группы из двух чёрных. Фа — белая клавиша слева от каждой группы из трёх. Сыграйте два до ниже.',
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
            en: 'The white keys are named with seven letters: A B C D E F G. After G, the letters start again from A.',
            ru: 'Белые клавиши называют семью буквами: A B C D E F G. После G буквы начинаются снова с A.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Singers name the same notes do, re, mi, fa, sol, la, si, starting on C. Play the row below, from C up to the next C.',
            ru: 'В пении те же ноты называют до, ре, ми, фа, соль, ля, си, начиная с C. Сыграйте ряд ниже: от до вверх до следующего до.',
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
            en: 'is the C nearest the middle of the piano. It is written C4.',
            ru: '(«среднее до») — до, ближайшее к середине клавиатуры. Его пишут C4.',
          },
        },
        {
          kind: 'text',
          lead: { en: 'An octave', ru: 'Октава' },
          text: {
            en: 'is the distance to the next note with the same name: eight letters and twelve keys. The next C up is C5, the same note an octave higher. Play the example below.',
            ru: '— расстояние до следующей ноты с тем же именем: восемь букв и двенадцать клавиш. Следующее до вверх — C5, та же нота на октаву выше. Сыграйте пример ниже.',
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
            en: 'Fingers are numbered 1 to 5 in each hand, starting from the thumb. In a relaxed five-finger position, each finger rests on its own white key.',
            ru: 'Пальцы на каждой руке нумеруют от 1 до 5, начиная с большого. В спокойной позиции пяти пальцев каждый палец лежит на своей белой клавише.',
          },
        },
        {
          kind: 'steps',
          steps: [
            {
              en: 'Right hand: put the thumb on middle C and play the upper line.',
              ru: 'Правая рука: поставьте большой палец на до первой октавы и сыграйте верхнюю строку.',
            },
            {
              en: 'Left hand: put the little finger on the C below and play the lower line.',
              ru: 'Левая рука: поставьте мизинец на до ниже и сыграйте нижнюю строку.',
            },
          ],
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4/1' },
        { kind: 'notes', clef: 'bass', notes: 'C3 D3 E3 F3 G3/1' },
        {
          kind: 'note',
          text: {
            en: 'Keep the fingers curved, as if holding a ball. Keep the wrist level with the keys.',
            ru: 'Держите пальцы округлыми, будто в ладони мяч. Запястье держите на уровне клавиш.',
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
            ru: 'Сыграйте подряд белые клавиши от до вверх до соль.',
          },
          answer: { notes: ['C', 'D', 'E', 'F', 'G'], rising: true },
        },
      ],
    },
  ],
}

export default findingHome
