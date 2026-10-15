import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const handsAndFingers: Lesson = {
  id: 'hands-and-fingers',
  title: { en: 'Fingers, hand shape and the C position', ru: 'Пальцы, постановка и позиция до' },
  summary: {
    en: 'The finger numbers every score uses, a round hand over the keys, and your first melody without moving the hand.',
    ru: 'Номера пальцев из любых нот, округлая рука над клавишами и первая мелодия без перемещения руки.',
  },
  sections: [
    {
      heading: { en: 'Numbers for the fingers', ru: 'Номера пальцев' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Both hands count from the thumb: 1 thumb, 2 index, 3 middle, 4 ring, 5 little finger.',
            ru: 'Обе руки считают от большого пальца: 1 — большой, 2 — указательный, 3 — средний, 4 — безымянный, 5 — мизинец.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4/1' },
        { kind: 'notes', clef: 'bass', notes: 'C3 D3 E3 F3 G3/1' },
        {
          kind: 'note',
          text: {
            en: 'The small numbers over notes in a score are these fingers.',
            ru: 'Маленькие цифры над нотами — это и есть номера пальцев.',
          },
        },
      ],
    },
    {
      heading: { en: 'The C position', ru: 'Позиция до' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Put the right thumb on middle C, one finger on each key up to G. Five keys, five fingers, no stretching.',
            ru: 'Поставьте правый большой палец на до первой октавы, каждый палец на свою клавишу до соль. Пять клавиш, пять пальцев, без растяжки.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4/2 G4 F4 E4 D4 C4/2' },
        {
          kind: 'link',
          title: {
            en: 'The five-finger position in the Player',
            ru: 'Пятипальцевая позиция в плеере',
          },
          target: { opens: 'exercise', exercise: 'five-finger', root: note('C') },
        },
      ],
    },
    {
      heading: { en: 'A round hand, a level wrist', ru: 'Округлая рука, ровное запястье' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Curve the fingers', ru: 'Округлите пальцы' },
          text: {
            en: 'as if round a ball and play on their tips. Keep the wrist level with the hand.',
            ru: 'будто держите мяч, и играйте подушечками. Запястье на одной линии с кистью.',
          },
        },
        {
          kind: 'question',
          ask: {
            en: 'With fingers 1, 3 and 5, play C, E and G together.',
            ru: 'Пальцами 1, 3 и 5 сыграйте до, ми и соль вместе.',
          },
          answer: { chord: 'C' },
        },
        {
          kind: 'note',
          text: {
            en: 'Sit facing middle C, forearms level with the keys, shoulders loose.',
            ru: 'Сидите напротив до первой октавы, предплечья на уровне клавиш, плечи свободны.',
          },
        },
      ],
    },
    {
      heading: { en: 'Ode to Joy', ru: '«Ода к радости»' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Your first melody needs no hand move. Say the fingers aloud: 3 3 4 5, 5 4 3 2, 1 1 2 3, 3 2 2.',
            ru: 'Первая мелодия обходится без перемещения руки. Называйте пальцы вслух: 3 3 4 5, 5 4 3 2, 1 1 2 3, 3 2 2.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 E4/4. D4/8 D4/2',
        },
        {
          kind: 'link',
          title: { en: 'Ode to Joy in the Player', ru: '«Ода к радости» в плеере' },
          target: { opens: 'piece', piece: 'ode' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'In the C position, play the right hand’s keys from the thumb up.',
            ru: 'В позиции до сыграйте клавиши правой руки от большого пальца вверх.',
          },
          answer: { notes: ['C', 'D', 'E', 'F', 'G'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the opening of Ode to Joy without its repeats: E, F, G.',
            ru: 'Сыграйте начало «Оды к радости» без повторов: ми, фа, соль.',
          },
          answer: { notes: ['E', 'F', 'G'], rising: true },
        },
      ],
    },
  ],
}

export default handsAndFingers
