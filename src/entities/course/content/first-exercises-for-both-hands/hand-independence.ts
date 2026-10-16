import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const handIndependence: Lesson = {
  id: 'hand-independence',
  title: { en: 'Hand independence', ru: 'Независимость рук' },
  summary: {
    en: 'Give each hand its own touch and rhythm, then play Hanon.',
    ru: 'Дать каждой руке своё касание и ритм, затем сыграть Ганона.',
  },
  sections: [
    {
      heading: { en: 'Legato and staccato', ru: 'Легато и стаккато' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Legato', ru: 'Легато' },
          text: {
            en: 'joins notes: one key comes up as the next goes down. Staccato is short and detached, the key bouncing up at once.',
            ru: '— связная игра: клавиша поднимается, когда опускается следующая. Стаккато — коротко и отрывисто, клавиша сразу отскакивает.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4/1' },
        {
          kind: 'notes',
          clef: 'bass',
          notes: 'C3/8 r/8 D3/8 r/8 E3/8 r/8 F3/8 r/8 G3/8 r/8 r/4 r/2',
        },
      ],
    },
    {
      heading: { en: 'Smooth over short', ru: 'Связно над отрывистым' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Together: the right hand sings legato while the left plays short, light notes.',
            ru: 'Вместе: правая рука поёт легато, а левая играет коротко и легко.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4 F4 G4 E4 D4 E4 C4/2' },
        {
          kind: 'notes',
          clef: 'bass',
          notes: 'C3/8 r/8 G3/8 r/8 C3/8 r/8 G3/8 r/8 G3/8 r/8 G3/8 r/8 C3/8 r/8 r/4',
        },
      ],
    },
    {
      heading: { en: 'One holds, one moves', ru: 'Одна держит, другая движется' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The right hand holds a long note to the end of the bar while the left keeps moving.',
            ru: 'Правая рука держит долгую ноту до конца такта, а левая продолжает двигаться.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G4/1 E4/1' },
        { kind: 'notes', clef: 'bass', notes: 'C3 E3 G3 E3 C3 E3 G3 E3' },
      ],
    },
    {
      heading: { en: 'Two rhythms at once', ru: 'Два ритма одновременно' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The right hand plays eighths, two to a beat. The left plays quarters, one to a beat. Count “1 and 2 and”.',
            ru: 'Правая рука играет восьмыми, по две на долю, левая — четвертями. Считайте «раз-и, два-и».',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4/8 D4/8 E4/8 F4/8 G4/8 F4/8 E4/8 D4/8 C4/1',
        },
        { kind: 'notes', clef: 'bass', notes: 'C3 G3 C3 G3 C3/1' },
      ],
    },
    {
      heading: { en: 'Hanon’s first exercise', ru: 'Первое упражнение Ганона' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Hanon No. 1', ru: 'Ганон № 1' },
          text: {
            en: 'repeats one figure, a step higher each time, both hands an octave apart. It trains even, independent fingers.',
            ru: 'повторяет одну фигуру, каждый раз на ступень выше, руки в октаву. Оно развивает ровные, независимые пальцы.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4/8 E4/8 F4/8 G4/8 A4/8 G4/8 F4/8 E4/8 D4/8 F4/8 G4/8 A4/8 B4/8 A4/8 G4/8 F4/8',
        },
        {
          kind: 'notes',
          clef: 'bass',
          notes: 'C3/8 E3/8 F3/8 G3/8 A3/8 G3/8 F3/8 E3/8 D3/8 F3/8 G3/8 A3/8 B3/8 A3/8 G3/8 F3/8',
        },
        {
          kind: 'link',
          title: { en: 'Hanon No. 1 in the Player', ru: 'Ганон № 1 в плеере' },
          target: { opens: 'exercise', exercise: 'hanon', root: note('C') },
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
              en: 'Play each hand alone until it is easy.',
              ru: 'Играйте каждую руку отдельно, пока не станет легко.',
            },
            {
              en: 'Join them very slowly, listening to one hand at a time.',
              ru: 'Соединяйте очень медленно, слушая то одну, то другую руку.',
            },
            {
              en: 'Speed up only when both sound as you meant.',
              ru: 'Ускоряйтесь, только когда обе звучат как задумано.',
            },
          ],
        },
        {
          kind: 'question',
          ask: {
            en: 'Hold G in the right hand and play C, E, G below it.',
            ru: 'Держите соль в правой руке и сыграйте под ней до, ми, соль.',
          },
          answer: { notes: ['C', 'E', 'G'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the first five notes of Hanon No. 1 in C.',
            ru: 'Сыграйте пять первых нот Ганона № 1 от до.',
          },
          answer: { notes: ['C', 'E', 'F', 'G', 'A'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the note the figure starts on the second time.',
            ru: 'Сыграйте ноту, с которой фигура начинается во второй раз.',
          },
          answer: { notes: ['D'] },
        },
      ],
    },
  ],
}

export default handIndependence
