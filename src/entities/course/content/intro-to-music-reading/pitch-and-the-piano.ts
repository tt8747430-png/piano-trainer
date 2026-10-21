import type { Lesson } from '@/entities/lesson'
import { note } from '@/shared/lib/music'

/** Where reading starts: high and low on the keys, the seven letters, and the octave. */
const pitchAndThePiano: Lesson = {
  id: 'pitch-and-the-piano',
  title: { en: 'Pitch and the piano', ru: 'Высота звука и фортепиано' },
  summary: {
    en: 'Learn the names of the white keys and find each one in every octave.',
    ru: 'Выучите названия белых клавиш и находите каждую в любой октаве.',
  },
  sections: [
    {
      heading: { en: 'High and low', ru: 'Высокие и низкие звуки' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Pitch', ru: 'Высота звука' },
          text: {
            en: 'is how high or low a note sounds. Keys to the right sound higher, keys to the left sound lower. Play these from left to right.',
            ru: '— это то, насколько высоко или низко звучит нота. Клавиши правее звучат выше, левее — ниже. Сыграйте эти ноты слева направо.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 A4 B4 C5' },
      ],
    },
    {
      heading: { en: 'The names of the white keys', ru: 'Названия белых клавиш' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The musical alphabet', ru: 'Названия нот' },
          text: {
            en: 'is seven letters, A B C D E F G, one for each white key. After G it starts again from A. Say each name as you play.',
            ru: '— семь букв A B C D E F G: ля, си, до, ре, ми, фа, соль. После соль снова идёт ля. Называйте каждую ноту, когда играете.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'A4 B4 C5 D5 E5 F5 G5 A5' },
      ],
    },
    {
      heading: { en: 'Find C and F', ru: 'Как найти до и фа' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The black keys come in groups of two and three. C is the white key just left of each pair. F is just left of each three.',
            ru: 'Чёрные клавиши идут группами по две и по три. До — белая клавиша слева от каждой пары. Фа — слева от каждой тройки.',
          },
        },
        {
          kind: 'question',
          ask: {
            en: 'Find a group of three black keys and play the F.',
            ru: 'Найдите тройку чёрных клавиш и сыграйте фа.',
          },
          answer: { notes: ['F'] },
        },
      ],
    },
    {
      heading: { en: 'The octave', ru: 'Октава' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An octave', ru: 'Октава' },
          text: {
            en: 'is the distance from a note to the next note of the same name, eight white keys up. The two sound alike, one higher.',
            ru: '— расстояние от ноты до ближайшей ноты с тем же названием, на восемь белых клавиш выше. Они звучат похоже, только одна выше.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'P8' },
      ],
    },
    {
      heading: { en: 'Middle C', ru: 'До первой октавы' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Middle C', ru: 'До первой октавы' },
          text: {
            en: 'is the C nearest the middle of the keyboard, written C4. The number goes up at every C, so the B just below it is B3.',
            ru: '— это до в середине клавиатуры, в записи C4. Цифра меняется на каждом до, поэтому си прямо под ним — B3.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4/1' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the seven letters from A upwards, saying each name.',
            ru: 'Сыграйте семь нот от ля вверх, называя каждую.',
          },
          answer: { notes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play a C, then the C an octave higher.',
            ru: 'Сыграйте до, затем до октавой выше.',
          },
          answer: { notes: ['C', 'C'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'See the octave in Intervals', ru: 'Октава в разделе «Интервалы»' },
          target: { opens: 'intervals', root: note('C') },
        },
        {
          kind: 'link',
          title: {
            en: 'Hear high and low notes in Yankee Doodle',
            ru: 'Высокие и низкие звуки в «Янки Дудл»',
          },
          target: { opens: 'piece', piece: 'yankee-doodle' },
        },
      ],
    },
  ],
}

export default pitchAndThePiano
