import type { Lesson } from '../model/types'

const rhythmAndMeter: Lesson = {
  id: 'rhythm-and-meter',
  title: { en: 'Rhythm and meter', ru: 'Ритм и размер' },
  summary: {
    en: 'The beat, how long each note lasts, what a time signature says, and how to count.',
    ru: 'Доля, длительности нот, что говорит размер и как считать.',
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
          text: {
            en: 'Music moves on a steady pulse, the beat: what you tap your foot to. How fast it goes is the tempo, counted in beats per minute (BPM).',
            ru: 'Музыка движется ровной пульсацией — долями: под них отстукивают ногой. Скорость их смены — темп, его считают в ударах в минуту (BPM).',
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
            en: 'A whole note lasts four beats, a half note two, a quarter note one, and an eighth note half a beat. A dot after a note makes it half as long again: a dotted half note lasts three beats.',
            ru: 'Целая нота длится четыре доли, половинная — две, четвертная — одну, восьмая — половину доли. Точка после ноты удлиняет её на половину: половинная с точкой длится три доли.',
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
          text: {
            en: 'The two numbers at the start of the music are the time signature. The top one says how many beats a bar holds, the bottom one which note gets a beat (4 is a quarter note). 4/4 is most songs; 3/4, three beats to a bar, is a waltz and many hymns; 2/4 is a march.',
            ru: 'Две цифры в начале нот — размер. Верхняя говорит, сколько долей в такте, нижняя — какая нота считается долей (4 — четвертная). 4/4 — большинство песен; 3/4, три доли в такте, — вальс и многие гимны; 2/4 — марш.',
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
            en: 'Count the beats aloud, “1 2 3 4”. Eighth notes fall between them: “1 and 2 and”. A dotted quarter and an eighth: the first holds through “1, 2”, the second falls on “and”.',
            ru: 'Считайте доли вслух: «раз, два, три, четыре». Восьмые попадают между ними: «раз-и, два-и». Четвертная с точкой и восьмая: первая звучит на «раз, два», вторая — на «и».',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G4/4. A4/8 B4/2' },
        {
          kind: 'note',
          text: {
            en: 'In 6/8 the beat is a dotted quarter note: two beats to a bar, each split in three eighths.',
            ru: 'В размере 6/8 доля — четвертная с точкой: две доли в такте, каждая делится на три восьмые.',
          },
        },
      ],
    },
  ],
}

export default rhythmAndMeter
