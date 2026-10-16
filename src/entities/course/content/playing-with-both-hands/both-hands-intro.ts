import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const bothHandsIntro: Lesson = {
  id: 'both-hands-intro',
  title: { en: 'One tune, two hands', ru: 'Одна мелодия на две руки' },
  summary: {
    en: 'Put both hands in the C position and pass a tune from one hand to the other, counting the rests.',
    ru: 'Поставить обе руки в позицию до и передавать мелодию из руки в руку, считая паузы.',
  },
  sections: [
    {
      heading: { en: 'Where the hands go', ru: 'Где стоят руки' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The C position', ru: 'Позиция до' },
          text: {
            en: 'puts each hand on five white keys, one finger per key. The left little finger takes the C below middle C. The right thumb takes middle C.',
            ru: '— каждая рука лежит на пяти белых клавишах, по пальцу на клавишу. Левый мизинец стоит на до малой октавы, правый большой палец на до первой.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3 D3 E3 F3 G3/1' },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4/1' },
      ],
    },
    {
      heading: { en: 'Counting the rests', ru: 'Считаем паузы' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A rest', ru: 'Пауза' },
          text: {
            en: 'is a beat of silence. Count it just like a note.',
            ru: '— доля тишины. Её считают так же, как ноту.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4 D4 C4/2 r/1 E4 D4 C4/2 r/1' },
        { kind: 'notes', clef: 'bass', notes: 'r/1 E3 D3 C3/2 r/1 E3 D3 C3/2' },
        {
          kind: 'steps',
          steps: [
            {
              en: 'Keep the waiting hand on its keys.',
              ru: 'Ожидающая рука лежит на своих клавишах.',
            },
            { en: 'Count its rests aloud.', ru: 'Считайте её паузы вслух.' },
            { en: 'Come in exactly on the beat.', ru: 'Вступайте точно в долю.' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Call and answer', ru: 'Вопрос и ответ' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Call and answer', ru: 'Вопрос и ответ' },
          text: {
            en: 'means one hand plays a phrase and the other replies. In London Bridge the right hand calls. The left answers an octave lower on fingers 4, 3, 2 and 1.',
            ru: '— одна рука играет фразу, другая ей отвечает. В «Лондонском мосте» спрашивает правая рука. Левая отвечает октавой ниже пальцами 4, 3, 2 и 1.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G4/4. A4/8 G4 F4 E4 F4 G4/2 r/1 r/1' },
        { kind: 'notes', clef: 'bass', notes: 'r/1 r/1 D3 E3 F3/2 E3 F3 G3/2' },
        {
          kind: 'link',
          title: { en: 'London Bridge in the Player', ru: '«Лондонский мост» в плеере' },
          target: { opens: 'piece', piece: 'london-bridge' },
        },
      ],
    },
    {
      heading: {
        en: 'A low note for the left thumb',
        ru: 'Низкая нота для левого большого пальца',
      },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Frère Jacques dips down to the G below middle C. The left thumb plays that G, and the right hand stays on C.',
            ru: '«Братец Яков» опускается к соль малой октавы. Эту соль берёт левый большой палец, а правая рука остаётся на до.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 G3 C4/2 C4 G3 C4/2' },
        {
          kind: 'link',
          title: { en: 'Frère Jacques in the Player', ru: '«Братец Яков» в плеере' },
          target: { opens: 'piece', piece: 'frere-jacques' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'With the left hand, play the first notes of the answer: D, E, F.',
            ru: 'Левой рукой сыграйте начало ответа: ре, ми, фа.',
          },
          answer: { notes: ['D', 'E', 'F'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the note the left thumb takes in Frère Jacques.',
            ru: 'Сыграйте ноту, которую в «Братце Якове» берёт левый большой палец.',
          },
          answer: { notes: ['G'] },
        },
        {
          kind: 'link',
          title: {
            en: 'The five-finger position in the Player',
            ru: 'Позиция пяти пальцев в плеере',
          },
          target: { opens: 'exercise', exercise: 'five-finger', root: note('C') },
        },
      ],
    },
  ],
}

export default bothHandsIntro
