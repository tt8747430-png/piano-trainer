import type { Lesson } from '@/entities/lesson'

/** The beat, and the quarter, half and whole notes counted over it in bars of 4/4. */
const noteValues: Lesson = {
  id: 'note-values',
  title: { en: 'Note value and rhythm', ru: 'Длительности и ритм' },
  summary: {
    en: 'Feel the beat, hold quarter, half and whole notes for their counts, and count bars of 4/4 aloud.',
    ru: 'Почувствуйте долю, выдерживайте четверти, половинные и целые на свой счёт и считайте вслух такты в размере 4/4.',
  },
  sections: [
    {
      heading: { en: 'The beat', ru: 'Доля' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The beat', ru: 'Доля' },
          text: {
            en: 'is the steady pulse you tap your foot to. Every note is placed on it and held for some of it.',
            ru: '— ровная пульсация, под которую хочется притопывать. Каждая нота встаёт на неё и длится какую-то её часть.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 C4 C4 C4 C4 C4 C4 C4' },
        {
          kind: 'note',
          text: {
            en: 'Tap along and count each beat aloud: 1, 2, 3, 4.',
            ru: 'Отстукивайте и считайте каждую долю вслух: раз, два, три, четыре.',
          },
        },
      ],
    },
    {
      heading: { en: 'The quarter note', ru: 'Четвертная нота' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A quarter note', ru: 'Четвертная нота' },
          text: {
            en: 'has a filled head and a stem. It lasts one beat.',
            ru: 'имеет закрашенную головку и штиль. Она длится одну долю.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 F4 E4 D4' },
        {
          kind: 'question',
          ask: {
            en: 'Play the line’s first bar: four quarter notes up from C.',
            ru: 'Сыграйте первый такт: четыре четверти вверх от до.',
          },
          answer: { notes: ['C', 'D', 'E', 'F'], rising: true },
        },
      ],
    },
    {
      heading: { en: 'The half note', ru: 'Половинная нота' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A half note', ru: 'Половинная нота' },
          text: {
            en: 'has a hollow head and a stem. It lasts two beats: play it on 1 and hold it through 2.',
            ru: 'имеет пустую головку и штиль. Она длится две доли: играйте на «раз» и держите на «два».',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4/2 G4/2 E4/2 C4/2' },
      ],
    },
    {
      heading: { en: 'The whole note', ru: 'Целая нота' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A whole note', ru: 'Целая нота' },
          text: {
            en: 'has a hollow head and no stem. It lasts four beats: play on 1 and hold through 2, 3 and 4.',
            ru: 'имеет пустую головку без штиля. Она длится четыре доли: играйте на «раз» и держите на «два, три, четыре».',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G4/1 C4/1' },
      ],
    },
    {
      heading: { en: 'Bars and 4/4', ru: 'Такты и размер 4/4' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A time signature', ru: 'Размер' },
          text: {
            en: 'says how many beats fill a bar. In 4/4 there are four, each a quarter note. Bar lines mark the bars off.',
            ru: 'показывает, сколько долей в такте. В 4/4 их четыре, каждая — четверть. Тактовые черты разделяют такты.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4 E4 G4/2 F4/2 D4/2 E4 D4 C4/2 C4/1',
          meter: '4/4',
        },
        {
          kind: 'note',
          text: {
            en: 'Every bar adds up to four beats.',
            ru: 'Каждый такт складывается в четыре доли.',
          },
        },
      ],
    },
    {
      heading: { en: 'Counting aloud', ru: 'Счёт вслух' },
      blocks: [
        { kind: 'notes', clef: 'treble', notes: 'G4/2 G4 A4 G4/1 E4 F4 G4/2 C4/1' },
        {
          kind: 'steps',
          steps: [
            {
              en: 'Count one empty bar: 1 2 3 4.',
              ru: 'Отсчитайте пустой такт: раз, два, три, четыре.',
            },
            {
              en: 'Keep counting every beat, played or held.',
              ru: 'Считайте каждую долю, сыгранную или выдержанную.',
            },
            {
              en: 'Lift off a long note exactly on the next count.',
              ru: 'Снимайте долгую ноту точно на следующий счёт.',
            },
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
            en: 'Play the whole note on the treble staff’s second line, holding it for four counts.',
            ru: 'Сыграйте целую ноту на второй линейке скрипичного стана и держите её четыре счёта.',
          },
          answer: { notes: ['G'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play two half notes, E then C, two counts each.',
            ru: 'Сыграйте две половинные, ми и до, по два счёта каждую.',
          },
          answer: { notes: ['E', 'C'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play four quarter notes down from G, one count each.',
            ru: 'Сыграйте четыре четверти вниз от соль, по одному счёту.',
          },
          answer: { notes: ['G', 'F', 'E', 'D'] },
        },
        {
          kind: 'link',
          title: {
            en: 'Count the beats of Auld Lang Syne',
            ru: 'Считайте доли в песне «Старая дружба»',
          },
          target: { opens: 'piece', piece: 'auld-lang-syne' },
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

export default noteValues
