import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const findingHome: Lesson = {
  id: 'finding-home',
  title: { en: 'Finding your way on the keys', ru: 'Как ориентироваться на клавиатуре' },
  summary: {
    en: 'Find any key by the black keys, name the white keys, find middle C, number your fingers.',
    ru: 'Найти клавишу по чёрным, назвать белые, найти до первой октавы, пронумеровать пальцы.',
  },
  level: 1,
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'Black keys in twos and threes', ru: 'Чёрные клавиши по две и по три' },
      blocks: [
        {
          kind: 'text',
          lead: {
            en: 'The black keys come in twos and threes.',
            ru: 'Чёрные клавиши идут по две и по три.',
          },
          text: {
            en: 'C is the white key just left of each two, F just left of each three, all the way up.',
            ru: 'До — белая клавиша слева от каждых двух, фа — слева от каждых трёх, по всей клавиатуре.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 F4 C5 F5' },
      ],
    },
    {
      heading: { en: 'Seven letters', ru: 'Семь букв' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The white keys are named A to G, then the letters start again. From C, singers call them do, re, mi, fa, sol, la, si.',
            ru: 'Белые клавиши называют буквами от A до G, потом буквы идут сначала. От C в пении это до, ре, ми, фа, соль, ля, си.',
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
          lead: { en: 'Middle C (C4)', ru: 'До первой октавы (C4)' },
          text: {
            en: 'is the C nearest the middle of the piano. An octave up is C5: the same name, eight letters and twelve keys higher.',
            ru: '— до у середины клавиатуры. Октавой выше — C5: то же имя, на восемь букв и двенадцать клавиш выше.',
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
            en: 'Fingers are numbered 1 to 5 from the thumb. Right thumb on middle C, left little finger on the C below.',
            ru: 'Пальцы нумеруют от 1 до 5, начиная с большого. Правый большой — на до первой октавы, левый мизинец — на до ниже.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4/1' },
        { kind: 'notes', clef: 'bass', notes: 'C3 D3 E3 F3 G3/1' },
        {
          kind: 'note',
          text: {
            en: 'Keep the fingers curved and the wrist level with the keys.',
            ru: 'Пальцы округлые, запястье на уровне клавиш.',
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
