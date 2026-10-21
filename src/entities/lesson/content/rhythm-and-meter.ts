import type { Lesson } from '../model/types'

const rhythmAndMeter: Lesson = {
  id: 'rhythm-and-meter',
  title: { en: 'Rhythm and meter', ru: 'Ритм и размер' },
  summary: {
    en: 'Feel the beat, read how long each note lasts, and count a bar aloud while you play.',
    ru: 'Чувствовать долю, читать длительность каждой ноты и считать такт вслух во время игры.',
  },
  sections: [
    {
      heading: { en: 'The beat', ru: 'Доля' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The beat', ru: 'Доля' },
          text: {
            en: 'is the steady pulse you tap your foot to. Play one note on each beat.',
            ru: '— ровный пульс музыки, под который отстукивают ногой. Играйте по ноте на каждую долю.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C5 C5 C5 C5 C5 C5 C5 C5' },
        {
          kind: 'text',
          lead: { en: 'The tempo', ru: 'Темп' },
          text: {
            en: 'is how fast the beats go, in beats per minute (BPM).',
            ru: '— это скорость долей. Её измеряют в ударах в минуту (BPM).',
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
            en: 'A whole note lasts four beats. A half note lasts two, a quarter note one, an eighth note half a beat.',
            ru: 'Целая нота длится четыре доли. Половинная — две, четвертная — одну, восьмая — половину доли.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C5/1 C5/2 C5/2 C5 C5 C5 C5 C5/8 C5/8 C5/8 C5/8 C5/8 C5/8 C5/8 C5/8',
        },
        {
          kind: 'text',
          text: {
            en: 'Play it, counting to four in every bar.',
            ru: 'Сыграйте, считая до четырёх в каждом такте.',
          },
        },
      ],
    },
    {
      heading: { en: 'The dot', ru: 'Точка' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A dot', ru: 'Точка' },
          text: {
            en: 'after a note makes it half as long again. A dotted half note lasts three beats.',
            ru: 'после ноты удлиняет её наполовину. Половинная с точкой длится три доли.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C5/2. C5' },
        {
          kind: 'text',
          text: {
            en: 'Count 1 2 3 on the long note, then 4 on the short one.',
            ru: 'Считайте «раз, два, три» на долгой ноте и «четыре» на короткой.',
          },
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
            en: 'is the two numbers at the start. Top: beats per bar. Bottom: the note of one beat, 4 for a quarter.',
            ru: '— это два числа в начале. Верхнее — сколько долей в такте. Нижнее — какая нота длится долю: 4 — четвертная.',
          },
        },
        { kind: 'notes', clef: 'treble', meter: '3/4', notes: 'C4 E4 G4 C5/2.' },
        { kind: 'notes', clef: 'treble', meter: '2/4', notes: 'G4 G4 A4/2' },
        {
          kind: 'note',
          text: {
            en: 'Most songs are in 4/4. A waltz is in 3/4.',
            ru: 'Большинство песен — в 4/4. Вальс — в 3/4.',
          },
        },
      ],
    },
    {
      heading: { en: 'Counting', ru: 'Счёт' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'To count eighths, say “1 and 2 and” aloud. A dotted quarter holds through “1 and 2”. The eighth after it falls on “and”.',
            ru: 'Чтобы считать восьмые, говорите вслух «раз-и, два-и». Четвертная с точкой тянется «раз-и-два». Восьмая после неё приходится на «и».',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G4/4. A4/8 B4/2' },
      ],
    },
    {
      heading: { en: 'Keep a steady beat', ru: 'Держите ровную долю' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Set a slow click, about 60 beats a minute.',
              ru: 'Включите медленный метроном, около 60 ударов в минуту.',
            },
            { en: 'Count the bar aloud with the click.', ru: 'Считайте такт вслух вместе с ним.' },
            {
              en: 'Play the line below without stopping, even after a slip.',
              ru: 'Сыграйте строку ниже без остановок, даже если ошиблись.',
            },
          ],
        },
        { kind: 'notes', clef: 'treble', notes: 'C5/2 G4 G4 A4/4. B4/8 C5/2 G4/1' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play C, E, G, one beat each, counting 1 2 3.',
            ru: 'Сыграйте до, ми, соль по доле на каждую, считая «раз, два, три».',
          },
          answer: { notes: ['C', 'E', 'G'], rising: true },
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

export default rhythmAndMeter
