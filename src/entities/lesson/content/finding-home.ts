import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const findingHome: Lesson = {
  id: 'finding-home',
  title: { en: 'Finding your way on the keys', ru: 'Как ориентироваться на клавиатуре' },
  summary: {
    en: 'The keyboard is one pattern of twelve keys, repeated. Find any key from the black keys, without counting.',
    ru: 'Клавиатура — один узор из двенадцати клавиш, повторённый много раз. Находите любую клавишу по чёрным, не считая.',
  },
  sections: [
    {
      heading: { en: 'C sits left of every two', ru: 'До — слева от каждой пары' },
      blocks: [
        {
          kind: 'text',
          lead: {
            en: 'The black keys come in twos and threes.',
            ru: 'Чёрные клавиши идут по две и по три.',
          },
          text: {
            en: 'C is the white key just left of every two. F is just left of every three.',
            ru: 'До — белая клавиша слева от каждой пары. Фа — слева от каждой тройки.',
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
            en: 'The white keys are named A to G, then the letters start again. Up from C: C D E F G A B C.',
            ru: 'Белые клавиши называют буквами от A до G, потом буквы идут сначала. Вверх от до: C D E F G A B C.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 A4 B4 C5' },
        {
          kind: 'note',
          text: {
            en: 'Singers say do re mi fa sol la si.',
            ru: 'В пении это до, ре, ми, фа, соль, ля, си.',
          },
        },
      ],
    },
    {
      heading: { en: 'E–F and B–C touch', ru: 'Ми–фа и си–до соседствуют' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Two pairs of white keys have no black key between them: E–F and B–C. Every scale you learn depends on them.',
            ru: 'Между двумя парами белых клавиш нет чёрной: ми–фа и си–до. От них зависит каждая гамма, которую вы выучите.',
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
            en: 'is the C nearest the middle of the piano. C5 is the next C up: an octave higher.',
            ru: '— до у середины клавиатуры. C5 — следующее до вверх, на октаву выше.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'P8' },
        {
          kind: 'note',
          text: {
            en: 'A full piano has 88 keys, from A0 to C8.',
            ru: 'У полного фортепиано 88 клавиш, от A0 до C8.',
          },
        },
      ],
    },
    {
      heading: { en: 'Higher to the right', ru: 'Вправо — выше' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Keys sound higher to the right and lower to the left. Notes climb the staff the same way.',
            ru: 'Вправо звук выше, влево ниже. Ноты на нотном стане поднимаются так же.',
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
          ask: { en: 'Play any B.', ru: 'Сыграйте любое си.' },
          answer: { notes: ['B'] },
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
          kind: 'question',
          ask: {
            en: 'Play a C, then the C an octave above it.',
            ru: 'Сыграйте до, а потом до октавой выше.',
          },
          answer: { notes: ['C', 'C'], rising: true },
        },
      ],
    },
  ],
}

export default findingHome
