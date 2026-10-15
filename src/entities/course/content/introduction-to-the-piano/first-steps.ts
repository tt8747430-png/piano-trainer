import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const firstSteps: Lesson = {
  id: 'first-steps',
  title: { en: 'First steps', ru: 'Первые шаги' },
  summary: {
    en: 'Sit well at the keys, shape a round hand, learn the finger numbers, then find middle C and the C position.',
    ru: 'Правильная посадка, округлая рука, номера пальцев, до первой октавы и позиция до.',
  },
  sections: [
    {
      heading: { en: 'Sit at the piano', ru: 'Посадка за инструментом' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Sit on the front half of the bench, facing the middle.',
              ru: 'Сядьте на переднюю половину банкетки напротив середины клавиатуры.',
            },
            {
              en: 'Keep the forearms level with the keys.',
              ru: 'Предплечья на уровне клавиш.',
            },
            {
              en: 'Rest both feet flat on the floor. Let the shoulders hang loose.',
              ru: 'Обе стопы стоят на полу. Плечи свободны.',
            },
          ],
        },
        {
          kind: 'question',
          ask: {
            en: 'Sitting straight, play the C nearest the middle of the keyboard.',
            ru: 'Сидя ровно, сыграйте до, ближайшее к середине клавиатуры.',
          },
          answer: { notes: ['C'] },
        },
      ],
    },
    {
      heading: { en: 'Numbers for the fingers', ru: 'Номера пальцев' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Finger numbers', ru: 'Номера пальцев' },
          text: {
            en: 'count from the thumb: 1 thumb, 2 index, 3 middle, 4 ring, 5 little finger. Both hands use the same numbers.',
            ru: 'считаются от большого: 1 большой, 2 указательный, 3 средний, 4 безымянный, 5 мизинец. В обеих руках номера одни и те же.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4/1' },
        {
          kind: 'note',
          text: {
            en: 'A small number over a note is the finger that plays it.',
            ru: 'Маленькая цифра над нотой — палец, которым её играют.',
          },
        },
      ],
    },
    {
      heading: { en: 'A round hand', ru: 'Округлая рука' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A round hand', ru: 'Округлая рука' },
          text: {
            en: 'curves its fingers as if holding a ball. Play on the fingertips, the thumb on its side, the wrist level with the hand.',
            ru: 'держит пальцы так, будто в ладони мяч. Играйте кончиками пальцев, большой палец — на боковой стороне, запястье на уровне кисти.',
          },
        },
        {
          kind: 'question',
          ask: {
            en: 'With a round hand, play C, E and G together with fingers 1, 3 and 5.',
            ru: 'Округлой рукой сыграйте вместе до, ми и соль пальцами 1, 3 и 5.',
          },
          answer: { chord: 'C' },
        },
      ],
    },
    {
      heading: { en: 'Find middle C', ru: 'Найдите до первой октавы' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Middle C', ru: 'До первой октавы' },
          text: {
            en: 'is the C nearest the middle of the keyboard. Every C sits just left of a pair of black keys.',
            ru: '— до, ближайшее к середине клавиатуры. Каждое до стоит слева от пары чёрных клавиш.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4/1' },
        {
          kind: 'question',
          ask: {
            en: 'Find a pair of black keys and play the white key to its left.',
            ru: 'Найдите две чёрные клавиши рядом и сыграйте белую слева от них.',
          },
          answer: { notes: ['C'] },
        },
      ],
    },
    {
      heading: { en: 'The C position', ru: 'Позиция до' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The C position', ru: 'Позиция до' },
          text: {
            en: 'puts the right thumb on middle C and one finger on each white key up to G.',
            ru: '— большой палец правой руки на до первой октавы, по пальцу на каждой белой клавише до соль.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 F4 E4 D4 C4/1' },
        {
          kind: 'note',
          text: {
            en: 'Each finger keeps its own key. The hand stays still.',
            ru: 'У каждого пальца своя клавиша. Рука не сдвигается.',
          },
        },
      ],
    },
    {
      heading: { en: 'Count as you play', ru: 'Считайте вслух' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A beat', ru: 'Доля' },
          text: {
            en: 'is the steady count under music. A quarter note lasts one beat, a half note two, a whole note four.',
            ru: '— ровный счёт, на котором держится музыка. Четверть длится одну долю, половинная — две, целая — четыре.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4/2 G4/2 G4 F4 E4 D4 C4/1' },
        {
          kind: 'note',
          text: {
            en: 'Count “1 2 3 4” aloud in every bar.',
            ru: 'В каждом такте считайте вслух: «раз, два, три, четыре».',
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
            en: 'In the C position, play from the thumb up to finger 5.',
            ru: 'В позиции до сыграйте от большого пальца до пятого.',
          },
          answer: { notes: ['C', 'D', 'E', 'F', 'G'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the key under finger 3 in the C position.',
            ru: 'Сыграйте клавишу под третьим пальцем в позиции до.',
          },
          answer: { notes: ['E'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the keys under fingers 2 and 4 together.',
            ru: 'Сыграйте вместе клавиши под вторым и четвёртым пальцами.',
          },
          answer: { notes: ['D', 'F'] },
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
          title: { en: 'Reading notes in the Quiz', ru: 'Чтение нот в тестах' },
          target: { opens: 'quiz', trainer: 'reading-notes' },
        },
      ],
    },
  ],
}

export default firstSteps
