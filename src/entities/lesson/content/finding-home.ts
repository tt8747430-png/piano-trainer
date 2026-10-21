import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const findingHome: Lesson = {
  id: 'finding-home',
  title: { en: 'Finding your way on the keys', ru: 'Как ориентироваться на клавиатуре' },
  summary: {
    en: 'Use the groups of black keys to find any white key at a glance, without counting.',
    ru: 'Находите любую белую клавишу с первого взгляда по группам чёрных, не считая.',
  },
  sections: [
    {
      heading: { en: 'Find C and F by the black keys', ru: 'До и фа по чёрным клавишам' },
      blocks: [
        {
          kind: 'text',
          lead: {
            en: 'The black keys come in groups of two and three.',
            ru: 'Чёрные клавиши идут группами по две и по три.',
          },
          text: {
            en: 'C is the white key just left of each pair. F is the white key just left of each three.',
            ru: 'До — белая клавиша слева от каждой пары. Фа — белая клавиша слева от каждой тройки.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4/2 F4/2 C5/2 F5/2' },
        {
          kind: 'question',
          ask: { en: 'Play any C.', ru: 'Сыграйте любое до.' },
          answer: { notes: ['C'] },
        },
      ],
    },
    {
      heading: { en: 'Seven letters, round and round', ru: 'Семь букв по кругу' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'White keys are named with seven letters, A to G. After G the letters start again. Going up from C: C D E F G A B C.',
            ru: 'Белые клавиши называют семью нотами: до, ре, ми, фа, соль, ля, си. После си всё начинается снова. В буквах вверх от до: C D E F G A B C.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 A4 B4 C5' },
      ],
    },
    {
      heading: { en: 'Two gaps with no black key', ru: 'Два места без чёрной клавиши' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Most white keys have a black key between them. Two pairs do not: E and F, and B and C.',
            ru: 'Между большинством белых клавиш стоит чёрная. Между двумя парами её нет: ми и фа, си и до.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4/2 F4/2 B4/2 C5/2' },
      ],
    },
    {
      heading: { en: 'Middle C and the octave', ru: 'До первой октавы и октава' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Middle C (C4)', ru: 'До первой октавы (C4)' },
          text: {
            en: 'is the C nearest the middle of the piano. The next C to the right is C5. The distance from one C to the next is an octave.',
            ru: '— это до у середины клавиатуры. Следующее до справа — C5. Расстояние от одного до до следующего называют октавой.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'P8' },
      ],
    },
    {
      heading: { en: 'Higher to the right', ru: 'Вправо — выше' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Keys sound higher as you go right and lower as you go left. On the staff, higher notes sit higher up.',
            ru: 'Чем правее клавиша, тем выше звук, чем левее, тем ниже. На нотном стане высокие ноты и стоят выше.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 E4 G4 C5 C5 G4 E4 C4' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play any F.', ru: 'Сыграйте любое фа.' },
          answer: { notes: ['F'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play every white key from C up to G.',
            ru: 'Сыграйте подряд белые клавиши от до вверх до соль.',
          },
          answer: { notes: ['C', 'D', 'E', 'F', 'G'], rising: true },
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
          title: { en: 'Practise reading notes in the Quiz', ru: 'Чтение нот в тестах' },
          target: { opens: 'quiz', trainer: 'reading-notes' },
        },
      ],
    },
  ],
}

export default findingHome
