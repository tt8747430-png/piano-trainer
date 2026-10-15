import type { Lesson } from '@/entities/lesson'

/** Eighth notes counted 1-and, beamed by the beat, and the dot that makes a half note three beats. */
const newNoteValues: Lesson = {
  id: 'new-note-values',
  title: { en: 'New note values', ru: 'Новые длительности' },
  summary: {
    en: 'Split the beat into eighth notes counted 1 and 2 and, read them beamed, and hold the dotted half for three beats.',
    ru: 'Делите долю на восьмые со счётом «раз-и, два-и», читайте их под ребром и выдерживайте половинную с точкой три доли.',
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
            ru: 'длится половину доли, поэтому две восьмые заполняют одну долю. Одиночная восьмая пишется с флажком.',
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
      heading: { en: 'Counting 1 and', ru: 'Счёт «раз-и»' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Count eighths with “and” between the numbers: 1 and 2 and 3 and 4 and. A note on “and” falls halfway between beats.',
            ru: 'Восьмые считайте с «и» между числами: «раз-и, два-и, три-и, четыре-и». Нота на «и» звучит ровно между долями.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 C4/8 D4/8 E4 E4/8 F4/8 G4/1' },
        {
          kind: 'note',
          text: {
            en: 'Say “and” even under a quarter note, to keep the beat even.',
            ru: 'Говорите «и» даже под четвертью, чтобы доли оставались ровными.',
          },
        },
      ],
    },
    {
      heading: { en: 'Beamed by the beat', ru: 'Под ребром по долям' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A beam', ru: 'Ребро' },
          text: {
            en: 'joins eighth notes by their stems in place of flags. It groups them so each beat shows at a glance.',
            ru: 'соединяет штили восьмых вместо флажков. Оно группирует их так, чтобы каждая доля была видна сразу.',
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
      heading: { en: 'The dot', ru: 'Точка' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A dot', ru: 'Точка' },
          text: {
            en: 'after a note adds half its value again. A half note lasts two beats, so a dotted half lasts three.',
            ru: 'после ноты увеличивает её длительность на половину. Половинная длится две доли, значит, половинная с точкой — три.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4/2. D4 E4/2. C4' },
        {
          kind: 'note',
          text: {
            en: 'Count 1 2 3 on the dotted half, then play on 4.',
            ru: 'Считайте «раз, два, три» на половинной с точкой и играйте на «четыре».',
          },
        },
      ],
    },
    {
      heading: { en: 'Dotted halves in a tune', ru: 'Половинные с точкой в мелодии' },
      blocks: [
        { kind: 'notes', clef: 'treble', notes: 'E4/2. G4 A4/2. B4 C5/1' },
        {
          kind: 'text',
          text: {
            en: 'Hold each dotted half through three counts. The quarter on 4 leads on to the next bar.',
            ru: 'Держите каждую половинную с точкой три счёта. Четверть на «четыре» ведёт в следующий такт.',
          },
        },
      ],
    },
    {
      heading: { en: 'All the values together', ru: 'Все длительности вместе' },
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
              en: 'Count the line aloud before you play.',
              ru: 'Просчитайте строку вслух перед игрой.',
            },
            {
              en: 'Clap it, saying the counts.',
              ru: 'Прохлопайте её, проговаривая счёт.',
            },
            { en: 'Play it slowly, still counting.', ru: 'Сыграйте медленно, продолжая считать.' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
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
            en: 'Play E as a dotted half, counting three, then G on 4.',
            ru: 'Сыграйте ми половинной с точкой на три счёта, затем соль на «четыре».',
          },
          answer: { notes: ['E', 'G'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play G, F, E, D as eighths down the staff.',
            ru: 'Сыграйте соль, фа, ми, ре восьмыми вниз.',
          },
          answer: { notes: ['G', 'F', 'E', 'D'] },
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
