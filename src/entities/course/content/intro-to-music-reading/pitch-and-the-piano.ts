import type { Lesson } from '@/entities/lesson'
import { note } from '@/shared/lib/music'

/** Where reading starts: high and low on the keys, the seven letters, and the octave. */
const pitchAndThePiano: Lesson = {
  id: 'pitch-and-the-piano',
  title: { en: 'Pitch and the piano', ru: 'Высота звука и фортепиано' },
  summary: {
    en: 'Hear high and low on the keys, name the white keys A to G, and find the same note in every octave.',
    ru: 'Услышьте высокие и низкие звуки на клавиатуре, назовите белые клавиши от ля до соль и найдите один и тот же звук в каждой октаве.',
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
            ru: '— это то, насколько высоко или низко звучит нота. Каждая клавиша правее звучит выше, каждая левее — ниже.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 A4 B4 C5' },
        {
          kind: 'note',
          text: {
            en: 'The left hand mostly plays low keys, the right hand high ones.',
            ru: 'Левая рука обычно играет низкие клавиши, правая — высокие.',
          },
        },
      ],
    },
    {
      heading: { en: 'Black keys in twos and threes', ru: 'Чёрные клавиши по две и по три' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The black keys come in groups of two and three, all the way along. They are the map for finding every white key.',
            ru: 'Чёрные клавиши идут группами по две и по три по всей клавиатуре. По ним находят любую белую клавишу.',
          },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the two black keys of one group of two.',
            ru: 'Сыграйте две чёрные клавиши одной группы из двух.',
          },
          answer: { notes: ['C#', 'D#'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the three black keys of one group of three.',
            ru: 'Сыграйте три чёрные клавиши одной группы из трёх.',
          },
          answer: { notes: ['F#', 'G#', 'A#'] },
        },
      ],
    },
    {
      heading: { en: 'Seven letters', ru: 'Семь нот' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The musical alphabet', ru: 'Названия нот' },
          text: {
            en: 'has only seven letters: A B C D E F G. After G it starts again on A. Each white key takes one letter.',
            ru: '— это всего семь букв: A B C D E F G, то есть ля, си, до, ре, ми, фа, соль. После соль снова идёт ля.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'A4 B4 C5 D5 E5 F5 G5 A5' },
      ],
    },
    {
      heading: { en: 'Finding C and F', ru: 'Как найти до и фа' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C is the white key just left of each group of two black keys. F is just left of each group of three.',
            ru: 'До — белая клавиша слева от каждой группы из двух чёрных. Фа — слева от каждой группы из трёх.',
          },
        },
        {
          kind: 'question',
          ask: { en: 'Play a C.', ru: 'Сыграйте до.' },
          answer: { notes: ['C'] },
        },
        {
          kind: 'question',
          ask: { en: 'Play an F.', ru: 'Сыграйте фа.' },
          answer: { notes: ['F'] },
        },
        {
          kind: 'note',
          text: {
            en: 'From C and F, count up the alphabet to any white key.',
            ru: 'От до и фа отсчитывайте по алфавиту до любой другой белой клавиши.',
          },
        },
      ],
    },
    {
      heading: { en: 'The other white keys', ru: 'Остальные белые клавиши' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the white key between the two black keys of a pair.',
            ru: 'Сыграйте белую клавишу между двумя чёрными в паре.',
          },
          answer: { notes: ['D'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the white key just right of a group of three black keys.',
            ru: 'Сыграйте белую клавишу справа от группы из трёх чёрных.',
          },
          answer: { notes: ['B'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the white key just right of a group of two black keys.',
            ru: 'Сыграйте белую клавишу справа от группы из двух чёрных.',
          },
          answer: { notes: ['E'] },
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
            en: 'is the span from one note to the next of the same name, eight white keys up. The two sound alike, one higher.',
            ru: '— расстояние от ноты до следующей с тем же названием, на восемь белых клавиш выше. Они звучат похоже, одна выше другой.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'P8' },
        { kind: 'notes', clef: 'treble', notes: 'C4/2 C5/2 C6/1' },
      ],
    },
    {
      heading: { en: 'Middle C', ru: 'До первой октавы' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Middle C', ru: 'До первой октавы' },
          text: {
            en: 'is the C nearest the middle of the keyboard. Its octave number is 4, so we write it C4.',
            ru: '— это до ближе всего к середине клавиатуры. В записи с номерами октав её пишут C4.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4/1' },
        {
          kind: 'note',
          text: {
            en: 'The number changes at each C. The B just below middle C is B3.',
            ru: 'Номер меняется на каждой до. Си сразу под до первой октавы — это B3.',
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
            en: 'Play the seven letters from A upwards, one white key each.',
            ru: 'Сыграйте семь нот от ля вверх, по одной белой клавише.',
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
          kind: 'question',
          ask: {
            en: 'Play a G: the white key between the first and second black keys of a three.',
            ru: 'Сыграйте соль: она между первой и второй чёрными клавишами группы из трёх.',
          },
          answer: { notes: ['G'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play an A: the white key between the second and third black keys of a three.',
            ru: 'Сыграйте ля: она между второй и третьей чёрными клавишами группы из трёх.',
          },
          answer: { notes: ['A'] },
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
