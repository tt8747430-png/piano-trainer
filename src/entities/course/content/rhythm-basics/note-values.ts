import type { Lesson } from '@/entities/lesson'

/** The beat, and the quarter, half and whole notes counted over it in bars of 4/4. */
const noteValues: Lesson = {
  id: 'note-values',
  title: { en: 'Note value and rhythm', ru: 'Длительности и ритм' },
  summary: {
    en: 'Count the beat aloud in 4/4 and hold quarter, half and whole notes for their full length.',
    ru: 'Считать доли вслух в размере 4/4 и выдерживать четверти, половинные и целые до конца.',
  },
  sections: [
    {
      heading: { en: 'The beat', ru: 'Доля' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The beat', ru: 'Доля' },
          text: {
            en: 'is the steady pulse of the music, the one you tap your foot to. Play one C on each beat and count aloud: 1, 2, 3, 4.',
            ru: '— ровная пульсация музыки, под которую хочется притопывать. Играйте до на каждую долю и считайте вслух: раз, два, три, четыре.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 C4 C4 C4 C4 C4 C4 C4' },
      ],
    },
    {
      heading: { en: 'The quarter note', ru: 'Четвертная нота' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A quarter note', ru: 'Четвертная нота' },
          text: {
            en: 'has a filled-in head and a stem. It lasts one beat, so you play a new note on every count.',
            ru: 'имеет закрашенную головку и штиль. Она длится одну долю: на каждый счёт звучит новая нота.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 F4 E4 D4' },
      ],
    },
    {
      heading: { en: 'The half note', ru: 'Половинная нота' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A half note', ru: 'Половинная нота' },
          text: {
            en: 'has a hollow head and a stem. It lasts two beats. Play it on one count and keep holding it through the next.',
            ru: 'имеет пустую головку и штиль. Она длится две доли. Сыграйте её на один счёт и держите на следующий.',
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
            en: 'has a hollow head and no stem. It lasts four beats. Play it on 1 and hold it through 2, 3 and 4.',
            ru: 'имеет пустую головку без штиля. Она длится четыре доли. Сыграйте её на «раз» и держите на «два, три, четыре».',
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
            en: 'such as 4/4 says how many beats fill each bar, the space between two barlines. In 4/4 every bar holds four quarter-note beats.',
            ru: 'показывает, сколько долей в каждом такте, то есть между двумя тактовыми чертами. В размере 4/4 в такте четыре доли по четверти.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4 E4 G4/2 F4/2 D4/2 E4 D4 C4/2 C4/1',
          meter: '4/4',
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        { kind: 'notes', clef: 'treble', notes: 'G4/2 G4 A4 G4/1 E4 F4 G4/2 C4/1' },
        {
          kind: 'steps',
          steps: [
            {
              en: 'Before you play, count one empty bar: 1 2 3 4.',
              ru: 'Перед игрой отсчитайте пустой такт: раз, два, три, четыре.',
            },
            {
              en: 'Keep counting every beat, whether you play a note or hold one.',
              ru: 'Считайте каждую долю, играете вы новую ноту или держите прежнюю.',
            },
            {
              en: 'Let go of a long note exactly when the next note starts.',
              ru: 'Отпускайте долгую ноту точно тогда, когда начинается следующая.',
            },
          ],
        },
        {
          kind: 'question',
          ask: {
            en: 'Play four quarter notes up from C, one count each.',
            ru: 'Сыграйте четыре четверти вверх от до, по счёту на каждую.',
          },
          answer: { notes: ['C', 'D', 'E', 'F'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play two half notes, E then C, two counts each.',
            ru: 'Сыграйте две половинные, ми и до, по два счёта.',
          },
          answer: { notes: ['E', 'C'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play G as a whole note, holding it for four counts.',
            ru: 'Сыграйте соль целой нотой, держа её четыре счёта.',
          },
          answer: { notes: ['G'] },
        },
        {
          kind: 'link',
          title: {
            en: 'Count the beats of Auld Lang Syne',
            ru: 'Считайте доли в песне «Старая дружба»',
          },
          target: { opens: 'piece', piece: 'auld-lang-syne' },
        },
      ],
    },
  ],
}

export default noteValues
