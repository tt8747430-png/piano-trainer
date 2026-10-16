import type { Lesson } from '../model/types'

const rhythmAndMeter: Lesson = {
  id: 'rhythm-and-meter',
  title: { en: 'Rhythm and meter', ru: 'Ритм и размер' },
  summary: {
    en: 'Count the beat and read note values and time signatures.',
    ru: 'Считать доли и читать длительности нот и размер.',
  },
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
            en: 'Most songs are in 4/4, a waltz in 3/4.',
            ru: 'Большинство песен — в 4/4, вальс — в 3/4.',
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
