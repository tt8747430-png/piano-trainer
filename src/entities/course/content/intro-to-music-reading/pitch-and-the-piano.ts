import type { Lesson } from '@/entities/lesson'
import { note } from '@/shared/lib/music'

/** Where reading starts: high and low on the keys, the seven letters, and the octave. */
const pitchAndThePiano: Lesson = {
  id: 'pitch-and-the-piano',
  title: { en: 'Pitch and the piano', ru: 'Высота звука и фортепиано' },
  summary: {
    en: 'Name every white key and find it in any octave.',
    ru: 'Называть любую белую клавишу и находить её в любой октаве.',
  },
  sections: [
    {
      heading: { en: 'High and low', ru: 'Высоко и низко' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Pitch', ru: 'Высота звука' },
          text: {
            en: 'is how high or low a note sounds. Keys to the right sound higher, keys to the left lower.',
            ru: '— насколько высоко или низко звучит нота. Клавиши правее звучат выше, левее — ниже.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 A4 B4 C5' },
      ],
    },
    {
      heading: { en: 'Seven letters', ru: 'Семь нот' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The musical alphabet', ru: 'Названия нот' },
          text: {
            en: 'has seven letters, A B C D E F G, one to each white key. After G it starts again on A.',
            ru: '— семь букв, A B C D E F G: ля, си, до, ре, ми, фа, соль. После соль снова ля.',
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
            en: 'The black keys come in twos and threes. C is just left of each two, F just left of each three.',
            ru: 'Чёрные клавиши идут по две и по три. До — слева от каждой пары, фа — слева от каждой тройки.',
          },
        },
        {
          kind: 'question',
          ask: { en: 'Play an F.', ru: 'Сыграйте фа.' },
          answer: { notes: ['F'] },
        },
      ],
    },
    {
      heading: { en: 'Octaves', ru: 'Октавы' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An octave', ru: 'Октава' },
          text: {
            en: 'spans from a note to the next of the same name, eight white keys up. The two sound alike.',
            ru: '— расстояние от ноты до следующей с тем же названием, на восемь белых клавиш выше. Они звучат похоже.',
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
            en: 'is the C nearest the middle of the keyboard, written C4. The number changes at each C, so the B below is B3.',
            ru: '— до у середины клавиатуры, в записи C4. Номер меняется на каждом до, поэтому си под ним — B3.',
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
            en: 'Play the seven letters from A upwards.',
            ru: 'Сыграйте семь нот от ля вверх.',
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
          title: { en: 'Octaves in the Intervals explorer', ru: 'Октава в разделе «Интервалы»' },
          target: { opens: 'intervals', root: note('C') },
        },
        {
          kind: 'link',
          title: {
            en: 'Hear high and low in Yankee Doodle',
            ru: 'Высокие и низкие звуки в «Янки Дудл»',
          },
          target: { opens: 'piece', piece: 'yankee-doodle' },
        },
      ],
    },
  ],
}

export default pitchAndThePiano
