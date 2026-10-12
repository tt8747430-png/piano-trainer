import type { Lesson } from '../model/types'

const rhythmAndMeter: Lesson = {
  id: 'rhythm-and-meter',
  title: { en: 'Rhythm and meter', ru: 'Ритм и размер' },
  summary: {
    en: 'Feel the beat, read how long each note lasts, read a time signature and count aloud.',
    ru: 'Как чувствовать долю, читать длительности нот, понимать размер и считать вслух.',
  },
  level: 1,
  category: 'rhythm',
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'The beat', ru: 'Доля' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The beat', ru: 'Доля' },
          text: {
            en: 'is the steady pulse of music. It is what you tap your foot to.',
            ru: '— один удар ровного пульса музыки. Под доли отстукивают ногой.',
          },
        },
        {
          kind: 'text',
          lead: { en: 'The tempo', ru: 'Темп' },
          text: {
            en: 'is how fast the beats go. It is counted in beats per minute (BPM).',
            ru: '— скорость, с которой идут доли. Его считают в ударах в минуту (BPM).',
          },
        },
      ],
    },
    {
      heading: { en: 'Note values', ru: 'Длительности' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A note’s look tells you how many beats it lasts.',
            ru: 'По виду ноты понятно, сколько долей она длится.',
          },
        },
        {
          kind: 'steps',
          steps: [
            { en: 'A whole note lasts four beats.', ru: 'Целая нота длится четыре доли.' },
            { en: 'A half note lasts two beats.', ru: 'Половинная — две доли.' },
            { en: 'A quarter note lasts one beat.', ru: 'Четвертная — одну долю.' },
            { en: 'An eighth note lasts half a beat.', ru: 'Восьмая — половину доли.' },
          ],
        },
        {
          kind: 'text',
          text: {
            en: 'A dot after a note makes it half as long again. A dotted half note lasts three beats. Play the line below: a whole note, halves, quarters, then eighths.',
            ru: 'Точка после ноты удлиняет её наполовину. Половинная с точкой длится три доли. Сыграйте строку ниже: целая, половинные, четвертные, затем восьмые.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C5/1 C5/2 C5/2 C5 C5 C5 C5 C5/8 C5/8 C5/8 C5/8 C5/8 C5/8 C5/8 C5/8',
        },
      ],
    },
    {
      heading: { en: 'Time signatures', ru: 'Размер' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The time signature', ru: 'Размер' },
          text: {
            en: 'is the two numbers at the start of the music.',
            ru: '— две цифры в начале нот.',
          },
        },
        {
          kind: 'steps',
          steps: [
            {
              en: 'The top number says how many beats a bar holds. A bar is the stretch between two bar lines.',
              ru: 'Верхняя цифра говорит, сколько долей в такте. Такт — отрезок между двумя тактовыми чертами.',
            },
            {
              en: 'The bottom number says which note gets one beat. 4 means a quarter note.',
              ru: 'Нижняя цифра говорит, какая нота считается долей. 4 — четвертная.',
            },
          ],
        },
        {
          kind: 'text',
          text: {
            en: 'Most songs are in 4/4. 3/4 has three beats to a bar: a waltz and many hymns. 2/4 is a march. Play the 3/4 line below, then the 2/4 line.',
            ru: 'Большинство песен написано в 4/4. В 3/4 три доли в такте: это вальс и многие гимны. 2/4 — размер марша. Сыграйте строку в 3/4, затем в 2/4.',
          },
        },
        { kind: 'notes', clef: 'treble', meter: '3/4', notes: 'C4 E4 G4 C5/2.' },
        { kind: 'notes', clef: 'treble', meter: '2/4', notes: 'G4 G4 A4/2' },
      ],
    },
    {
      heading: { en: 'Counting', ru: 'Счёт' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Count the beats aloud: “1 2 3 4”. Eighth notes fall between the beats: “1 and 2 and”.',
            ru: 'Считайте доли вслух: «раз, два, три, четыре». Восьмые попадают между долями: «раз-и, два-и».',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Now a dotted quarter, then an eighth. The dotted quarter holds through “1, 2”. The eighth falls on “and”. Play the line below and count aloud.',
            ru: 'Теперь четвертная с точкой и восьмая. Четвертная с точкой звучит на «раз, два». Восьмая звучит на «и». Сыграйте строку ниже и считайте вслух.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G4/4. A4/8 B4/2' },
        {
          kind: 'note',
          text: {
            en: 'In 6/8 the beat is a dotted quarter note. A bar has two beats, each split into three eighths.',
            ru: 'В размере 6/8 доля — четвертная с точкой. В такте две доли, каждая делится на три восьмые.',
          },
        },
      ],
    },
  ],
}

export default rhythmAndMeter
