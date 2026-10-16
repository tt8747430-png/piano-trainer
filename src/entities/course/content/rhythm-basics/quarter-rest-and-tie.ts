import type { Lesson } from '@/entities/lesson'

/** Counted silence, the quarter rest, and the tie that holds a note across a barline. */
const quarterRestAndTie: Lesson = {
  id: 'quarter-rest-and-tie',
  title: { en: 'Quarter rest and tie', ru: 'Четвертная пауза и лига' },
  summary: {
    en: 'Count quarter rests and hold tied notes across the barline.',
    ru: 'Считать четвертные паузы и держать ноты под лигой через такт.',
  },
  sections: [
    {
      heading: { en: 'The quarter rest', ru: 'Четвертная пауза' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A quarter rest', ru: 'Четвертная пауза' },
          text: {
            en: 'is one beat of silence, counted like a note. Lift the hand from the key and say the count aloud.',
            ru: '— доля тишины, её считают, как ноту. Снимите руку с клавиши и произнесите счёт вслух.',
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
            en: 'A rest can fall on any beat, even beat 1. Count it and come in on the next beat.',
            ru: 'Пауза может стоять на любой доле, даже на первой. Отсчитайте её и вступайте на следующей.',
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
            en: 'is a curve joining two notes of the same pitch. Play once and hold for both: this G lasts four beats.',
            ru: '— дуга между двумя нотами одной высоты. Сыграйте один раз и держите обе: эта соль длится четыре доли.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4 F4 G4/2~ G4/2 E4 C4' },
      ],
    },
    {
      heading: { en: 'Across the barline', ru: 'Через тактовую черту' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A tie carries a note into the next bar. Count 1 2 3 4, (1) 2 3 4: the bracketed beat is held.',
            ru: 'Лига переносит звук в следующий такт. Считайте «раз, два, три, четыре, (раз), два, три, четыре»: доля в скобках выдерживается.',
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
              en: 'Hold a tied note through all its beats.',
              ru: 'Держите залигованную ноту на все её доли.',
            },
            { en: 'Lift exactly on the rest.', ru: 'Снимайте руку точно на паузе.' },
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
