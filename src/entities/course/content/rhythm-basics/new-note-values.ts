import type { Lesson } from '@/entities/lesson'

/** Eighth notes counted 1-and, beamed by the beat, and the dot that makes a half note three beats. */
const newNoteValues: Lesson = {
  id: 'new-note-values',
  title: { en: 'New note values', ru: 'Новые длительности' },
  summary: {
    en: 'Count eighth notes, two to a beat, and hold dotted half notes for three beats.',
    ru: 'Считать восьмые, по две на долю, и выдерживать половинные с точкой три доли.',
  },
  sections: [
    {
      heading: { en: 'Eighth notes', ru: 'Восьмые' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An eighth note', ru: 'Восьмая нота' },
          text: {
            en: 'lasts half a beat, so two eighths fill one beat. A single eighth has a flag on its stem. Play these evenly, twice as fast as quarters.',
            ru: 'длится полдоли, поэтому две восьмые заполняют одну долю. Одиночная восьмая пишется с флажком. Играйте их ровно, вдвое быстрее четвертей.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4/8 D4/8 E4/8 F4/8 G4/2 G4/8 F4/8 E4/8 D4/8 C4/2',
        },
      ],
    },
    {
      heading: { en: 'Counting eighths: 1 and', ru: 'Счёт восьмых: «раз-и»' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Count eighths by saying “and” between the numbers: 1 and 2 and. The number falls on the beat. A note on “and” falls halfway between two beats.',
            ru: 'Восьмые считайте, вставляя «и» между числами: «раз-и, два-и». Число приходится на долю. Нота на «и» звучит ровно посередине между долями.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 C4/8 D4/8 E4 E4/8 F4/8 G4/1' },
      ],
    },
    {
      heading: { en: 'Beams group eighths by the beat', ru: 'Ребро группирует восьмые по долям' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A beam', ru: 'Ребро' },
          text: {
            en: 'is a thick line that joins the stems of eighth notes in place of their flags. Eighths are beamed by the beat, so you can see each beat at a glance.',
            ru: '— толстая черта, которая соединяет штили восьмых вместо флажков. Восьмые объединяют по долям, поэтому каждая доля видна сразу.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'G4/8 A4/8 G4/8 F4/8 E4/8 F4/8 G4/8 E4/8 D4/8 E4/8 F4/8 D4/8 C4/2',
        },
      ],
    },
    {
      heading: { en: 'The dotted half', ru: 'Половинная с точкой' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A dot', ru: 'Точка' },
          text: {
            en: 'after a note adds half its value again. A half note is two beats, so a dotted half lasts three. Hold it through 1 2 3, then play on 4.',
            ru: 'после ноты добавляет к ней ещё половину её длительности. Половинная — две доли, значит, половинная с точкой длится три. Держите её на «раз, два, три», играйте на «четыре».',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4/2. D4 E4/2. C4' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'E4 E4/8 F4/8 G4/2 G4/8 F4/8 E4/8 D4/8 C4/2 D4/2. E4/8 F4/8 E4/1',
        },
        {
          kind: 'steps',
          steps: [
            {
              en: 'Count the line aloud: 1 and 2 and.',
              ru: 'Просчитайте строку вслух: «раз-и, два-и».',
            },
            { en: 'Clap the rhythm while you count.', ru: 'Прохлопайте ритм, продолжая считать.' },
            {
              en: 'Play it slowly, still counting.',
              ru: 'Сыграйте медленно, не переставая считать.',
            },
          ],
        },
        {
          kind: 'question',
          ask: {
            en: 'Play four eighth notes up from C, counting 1 and 2 and.',
            ru: 'Сыграйте четыре восьмые вверх от до со счётом «раз-и, два-и».',
          },
          answer: { notes: ['C', 'D', 'E', 'F'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play E as a dotted half, then G on 4.',
            ru: 'Сыграйте ми половинной с точкой, затем соль на «четыре».',
          },
          answer: { notes: ['E', 'G'], rising: true },
        },
        {
          kind: 'link',
          title: {
            en: 'Hear eighths and longer notes in Auld Lang Syne',
            ru: 'Восьмые и долгие ноты в песне «Старая дружба»',
          },
          target: { opens: 'piece', piece: 'auld-lang-syne' },
        },
        {
          kind: 'link',
          title: {
            en: 'Count Red River Valley',
            ru: 'Считайте доли в песне «Долина Красной реки»',
          },
          target: { opens: 'piece', piece: 'red-river-valley' },
        },
      ],
    },
  ],
}

export default newNoteValues
