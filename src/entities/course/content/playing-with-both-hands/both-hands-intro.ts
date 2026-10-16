import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const bothHandsIntro: Lesson = {
  id: 'both-hands-intro',
  title: { en: 'Intro to playing with both hands', ru: 'Введение в игру двумя руками' },
  summary: {
    en: 'Pass a tune between the hands, counting the rests.',
    ru: 'Передавать мелодию из руки в руку, считая паузы.',
  },
  sections: [
    {
      heading: { en: 'Two hands, two positions', ru: 'Две руки, две позиции' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The left hand takes the C position from the C below middle C, the right from middle C.',
            ru: 'Левая рука — в позиции до от до малой октавы, правая — от до первой.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3 D3 E3 F3 G3/1' },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4/1' },
      ],
    },
    {
      heading: { en: 'Rests', ru: 'Паузы' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A rest', ru: 'Пауза' },
          text: {
            en: 'is a silent beat, counted like a note. While one hand plays, the other waits on its keys.',
            ru: '— беззвучная доля, её считают, как ноту. Пока одна рука играет, другая ждёт на своих клавишах.',
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
            en: 'In London Bridge the right hand calls and the left answers an octave lower, fingers 4 3 2 1.',
            ru: 'В «Лондонском мосте» правая рука спрашивает, левая отвечает октавой ниже пальцами 4 3 2 1.',
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
            en: 'Frère Jacques dips to the G below middle C. The left thumb plays it while the right stays on C.',
            ru: '«Братец Яков» опускается к соль малой октавы. Её берёт левый большой палец, правый остаётся на до.',
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
          kind: 'steps',
          steps: [
            {
              en: 'Rest the waiting hand on its keys.',
              ru: 'Держите ожидающую руку на её клавишах.',
            },
            { en: 'Count through its rests aloud.', ru: 'Считайте её паузы вслух.' },
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
        {
          kind: 'question',
          ask: {
            en: 'Play the note the left thumb takes in Frère Jacques.',
            ru: 'Сыграйте ноту левого большого пальца в «Братце Якове».',
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
