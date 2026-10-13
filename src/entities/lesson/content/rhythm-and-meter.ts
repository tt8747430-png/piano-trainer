import type { Lesson } from '../model/types'

const rhythmAndMeter: Lesson = {
  id: 'rhythm-and-meter',
  title: { en: 'Rhythm and meter', ru: 'Ритм и размер' },
  summary: {
    en: 'Feel the beat, read how long each note lasts, read a time signature and count aloud.',
    ru: 'Как чувствовать долю, читать длительности нот, понимать размер и считать вслух.',
  },
  level: 1,
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'The beat', ru: 'Доля' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The beat', ru: 'Доля' },
          text: {
            en: 'is the steady pulse you tap your foot to.',
            ru: '— ровный пульс музыки, под который отстукивают ногой.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C5 C5 C5 C5 C5 C5 C5 C5' },
        {
          kind: 'text',
          lead: { en: 'The tempo', ru: 'Темп' },
          text: {
            en: 'is how fast the beats go, in beats per minute (BPM).',
            ru: '— скорость долей, в ударах в минуту (BPM).',
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
            en: 'A whole note lasts four beats, a half note two, a quarter one, an eighth half a beat. A dot makes a note half as long again.',
            ru: 'Целая нота длится четыре доли, половинная — две, четвертная — одну, восьмая — половину доли. Точка удлиняет ноту наполовину.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C5/1 C5/2 C5/2 C5 C5 C5 C5 C5/8 C5/8 C5/8 C5/8 C5/8 C5/8 C5/8 C5/8',
        },
        { kind: 'notes', clef: 'treble', notes: 'C5/2. C5' },
      ],
    },
    {
      heading: { en: 'Time signatures', ru: 'Размер' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The time signature', ru: 'Размер' },
          text: {
            en: 'gives the beats in a bar on top, the note of one beat below: 4 is a quarter.',
            ru: '— сверху число долей в такте, снизу нота, которая считается долей: 4 — четвертная.',
          },
        },
        { kind: 'notes', clef: 'treble', meter: '3/4', notes: 'C4 E4 G4 C5/2.' },
        { kind: 'notes', clef: 'treble', meter: '2/4', notes: 'G4 G4 A4/2' },
        {
          kind: 'note',
          text: {
            en: 'Most songs are in 4/4. A waltz is in 3/4, a march in 2/4.',
            ru: 'Большинство песен — в 4/4. Вальс — в 3/4, марш — в 2/4.',
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
            en: 'Count aloud: “1 and 2 and”. A dotted quarter holds through “1 and 2”, then the eighth falls on “and”.',
            ru: 'Считайте вслух: «раз-и, два-и». Четвертная с точкой звучит «раз-и-два», а восьмая приходится на «и».',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G4/4. A4/8 B4/2' },
        {
          kind: 'note',
          text: {
            en: 'In 6/8 a bar has two beats, each a dotted quarter of three eighths.',
            ru: 'В 6/8 в такте две доли, каждая — четвертная с точкой из трёх восьмых.',
          },
        },
      ],
    },
  ],
}

export default rhythmAndMeter
