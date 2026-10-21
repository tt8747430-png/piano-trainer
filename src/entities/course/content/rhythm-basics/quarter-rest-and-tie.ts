import type { Lesson } from '@/entities/lesson'

/** Counted silence, the quarter rest, and the tie that holds a note across a barline. */
const quarterRestAndTie: Lesson = {
  id: 'quarter-rest-and-tie',
  title: { en: 'Quarter rest and tie', ru: 'Четвертная пауза и лига' },
  summary: {
    en: 'Count a beat of silence with the quarter rest, and hold a note longer with a tie.',
    ru: 'Отсчитывать долю тишины на четвертной паузе и удлинять ноту с помощью лиги.',
  },
  sections: [
    {
      heading: { en: 'The quarter rest', ru: 'Четвертная пауза' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A quarter rest', ru: 'Четвертная пауза' },
          text: {
            en: 'is one beat of silence. You count it like a note. On the rest, lift your hand from the key and still say the count aloud.',
            ru: '— одна доля тишины. Её считают так же, как ноту. На паузе снимите руку с клавиши, но продолжайте считать вслух.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4 F4 G4 r/4 G4 F4 E4 r/4' },
      ],
    },
    {
      heading: { en: 'A rest on any beat', ru: 'Пауза на любой доле' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A rest can fall on any beat, even beat 1. Count the rest, then come in exactly on the next beat.',
            ru: 'Пауза может стоять на любой доле, даже на первой. Отсчитайте паузу и вступайте точно на следующей доле.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'r/4 C4 D4 E4 r/4 E4 F4 G4 r/4 G4 F4 E4 C4/2. r/4',
        },
      ],
    },
    {
      heading: { en: 'The tie', ru: 'Лига' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A tie', ru: 'Лига' },
          text: {
            en: 'is a curved line joining two notes of the same pitch. Play the first note once and hold it for both values. This tied G lasts four beats.',
            ru: '— дуга между двумя нотами одной высоты. Сыграйте первую ноту один раз и держите её на обе длительности. Эта соль под лигой длится четыре доли.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4 F4 G4/2~ G4/2 E4 C4' },
      ],
    },
    {
      heading: { en: 'A tie across the barline', ru: 'Лига через тактовую черту' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A tie can carry a note into the next bar. Count 1 2 3 4, (1) 2 3 4. On the beat in brackets you hold F and play nothing new.',
            ru: 'Лига может перенести звук в следующий такт. Считайте «раз, два, три, четыре, (раз), два, три, четыре». На доле в скобках держите фа и ничего не играйте заново.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4~ F4 E4 D4 C4' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        { kind: 'notes', clef: 'treble', notes: 'C4/2 E4/2~ E4 r/4 G4/2~ G4/2. r/4' },
        {
          kind: 'steps',
          steps: [
            { en: 'Count every beat aloud.', ru: 'Считайте вслух каждую долю.' },
            {
              en: 'Hold a tied note through all of its beats.',
              ru: 'Держите ноту под лигой все её доли.',
            },
            {
              en: 'Lift your hand exactly when a rest begins.',
              ru: 'Снимайте руку точно в начале паузы.',
            },
          ],
        },
        {
          kind: 'question',
          ask: {
            en: 'Play C, rest a beat, then play E.',
            ru: 'Сыграйте до, выдержите паузу на долю и сыграйте ми.',
          },
          answer: { notes: ['C', 'E'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play C, D, E, then F tied across the barline.',
            ru: 'Сыграйте до, ре, ми, затем фа под лигой через тактовую черту.',
          },
          answer: { notes: ['C', 'D', 'E', 'F'], rising: true },
        },
        {
          kind: 'link',
          title: {
            en: 'Hold the long notes of Red River Valley',
            ru: 'Выдерживайте долгие ноты в песне «Долина Красной реки»',
          },
          target: { opens: 'piece', piece: 'red-river-valley' },
        },
      ],
    },
  ],
}

export default quarterRestAndTie
