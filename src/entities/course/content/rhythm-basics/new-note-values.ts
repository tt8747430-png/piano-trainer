import type { Lesson } from '@/entities/lesson'

/** Eighth notes counted 1-and, beamed by the beat, and the dot that makes a half note three beats. */
const newNoteValues: Lesson = {
  id: 'new-note-values',
  title: { en: 'New note values', ru: 'Новые длительности' },
  summary: {
    en: 'Count eighth notes and hold dotted halves for three beats.',
    ru: 'Считать восьмые и выдерживать половинные с точкой три доли.',
  },
  sections: [
    {
      heading: { en: 'Eighth notes', ru: 'Восьмые' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An eighth note', ru: 'Восьмая нота' },
          text: {
            en: 'lasts half a beat, so two fill one beat. Alone it has a flag on its stem.',
            ru: 'длится полдоли: две восьмые заполняют долю. Одиночная восьмая пишется с флажком.',
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
      heading: { en: 'Count 1 and', ru: 'Счёт «раз-и»' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Count eighths with “and” between the numbers: 1 and 2 and. A note on “and” falls halfway between beats.',
            ru: 'Восьмые считайте с «и» между числами: «раз-и, два-и». Нота на «и» звучит ровно между долями.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 C4/8 D4/8 E4 E4/8 F4/8 G4/1' },
      ],
    },
    {
      heading: { en: 'Beamed by the beat', ru: 'Под ребром по долям' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A beam', ru: 'Ребро' },
          text: {
            en: 'joins eighth notes by their stems in place of flags, so each beat shows at a glance.',
            ru: 'соединяет штили восьмых вместо флажков, чтобы каждая доля была видна сразу.',
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
            en: 'after a note adds half its value again, so a dotted half lasts three beats. Count 1 2 3 on it, then play on 4.',
            ru: 'после ноты добавляет половину её длительности: половинная с точкой длится три доли. Считайте «раз, два, три», играйте на «четыре».',
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
            { en: 'Count the line aloud.', ru: 'Просчитайте строку вслух.' },
            { en: 'Clap it, saying the counts.', ru: 'Прохлопайте её, проговаривая счёт.' },
            { en: 'Play it slowly, still counting.', ru: 'Сыграйте медленно, продолжая считать.' },
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
