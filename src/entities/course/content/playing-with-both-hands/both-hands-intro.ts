import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const bothHandsIntro: Lesson = {
  id: 'both-hands-intro',
  title: { en: 'Intro to playing with both hands', ru: 'Введение в игру двумя руками' },
  summary: {
    en: 'Both hands on the keys at once, taking turns: a tune passed from one hand to the other, with rests counted.',
    ru: 'Обе руки на клавиатуре по очереди: мелодия переходит из руки в руку, паузы считаются.',
  },
  sections: [
    {
      heading: { en: 'Two hands, two positions', ru: 'Две руки, две позиции' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The left hand takes the C position from the C below middle C. The right takes it from middle C. The thumbs nearly meet.',
            ru: 'Левая рука ставится в позицию до от до малой октавы, правая — от до первой октавы. Большие пальцы почти встречаются.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3 D3 E3 F3 G3/1' },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4/1' },
      ],
    },
    {
      heading: { en: 'Taking turns', ru: 'По очереди' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A rest', ru: 'Пауза' },
          text: {
            en: 'is a silent beat, counted like a note. While one hand plays, the other rests on its keys.',
            ru: '— беззвучная доля, её считают, как ноту. Пока одна рука играет, другая лежит на своих клавишах.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4 D4 C4/2 r/1 E4 D4 C4/2 r/1' },
        { kind: 'notes', clef: 'bass', notes: 'r/1 E3 D3 C3/2 r/1 E3 D3 C3/2' },
      ],
    },
    {
      heading: { en: 'Call and answer', ru: 'Вопрос и ответ' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'London Bridge passes its tune between the hands. The right hand calls, the left answers an octave lower with fingers 4 3 2 1.',
            ru: '«Лондонский мост» передаёт мелодию из руки в руку. Правая спрашивает, левая отвечает октавой ниже пальцами 4 3 2 1.',
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
      heading: { en: 'A note for the left thumb', ru: 'Нота для левого большого пальца' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Frère Jacques ends by dipping to the G below middle C. Let the left thumb play it while the right thumb stays on C.',
            ru: '«Братец Яков» в конце опускается к соль малой октавы. Её берёт большой палец левой руки, а правый остаётся на до.',
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
      heading: { en: 'Ready before the entry', ru: 'Готовность к вступлению' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Rest the waiting hand on its keys.',
              ru: 'Держите ожидающую руку на её клавишах.',
            },
            {
              en: 'Count through its rests aloud.',
              ru: 'Считайте её паузы вслух.',
            },
            {
              en: 'Play its first note exactly on the beat.',
              ru: 'Первую ноту играйте точно в долю.',
            },
          ],
        },
        {
          kind: 'question',
          ask: {
            en: 'With the left hand, play the answer’s first notes: D, E, F.',
            ru: 'Левой рукой сыграйте начало ответа: ре, ми, фа.',
          },
          answer: { notes: ['D', 'E', 'F'], rising: true },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the note the left thumb takes in Frère Jacques.',
            ru: 'Сыграйте ноту, которую в «Братце Якове» берёт большой палец левой руки.',
          },
          answer: { notes: ['G'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'With the left hand, play D, E, F, G from finger 4 to the thumb.',
            ru: 'Левой рукой сыграйте ре, ми, фа, соль от четвёртого пальца к большому.',
          },
          answer: { notes: ['D', 'E', 'F', 'G'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the notes of London Bridge’s first bar: G, A and F.',
            ru: 'Сыграйте ноты первого такта «Лондонского моста»: соль, ля и фа.',
          },
          answer: { notes: ['G', 'A', 'F'] },
        },
        {
          kind: 'link',
          title: { en: 'London Bridge in the Player', ru: '«Лондонский мост» в плеере' },
          target: { opens: 'piece', piece: 'london-bridge' },
        },
        {
          kind: 'link',
          title: { en: 'Frère Jacques in the Player', ru: '«Братец Яков» в плеере' },
          target: { opens: 'piece', piece: 'frere-jacques' },
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
