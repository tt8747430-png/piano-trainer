import type { Lesson } from '@/entities/lesson'

/** Counted silence, the quarter rest, and the tie that holds a note across a barline. */
const quarterRestAndTie: Lesson = {
  id: 'quarter-rest-and-tie',
  title: { en: 'Quarter rest and tie', ru: 'Четвертная пауза и лига' },
  summary: {
    en: 'Count silence as you count notes, with the quarter rest, and hold a note across the barline with a tie.',
    ru: 'Считайте тишину так же, как ноты, с четвертной паузой, и продлевайте ноту через тактовую черту лигой.',
  },
  sections: [
    {
      heading: { en: 'Silence counts', ru: 'Тишина тоже считается' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A rest', ru: 'Пауза' },
          text: {
            en: 'is a stretch of silence, counted like a note. Lift your hand from the key for it.',
            ru: '— отрезок тишины, который считают так же, как ноту. На паузе снимите руку с клавиши.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 r/4 E4 r/4 G4 r/4 G4/2' },
      ],
    },
    {
      heading: { en: 'The quarter rest', ru: 'Четвертная пауза' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A quarter rest', ru: 'Четвертная пауза' },
          text: {
            en: 'lasts one beat, as long as a quarter note. Its sign is an upright zigzag.',
            ru: 'длится одну долю, как четвертная нота. Её знак похож на вертикальный зигзаг.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4 F4 G4 r/4 G4 F4 E4 r/4' },
        {
          kind: 'note',
          text: {
            en: 'Say the count of a rest aloud, so it lasts its full beat.',
            ru: 'Произносите счёт паузы вслух, чтобы она длилась целую долю.',
          },
        },
      ],
    },
    {
      heading: { en: 'A rest on any beat', ru: 'Пауза на любой доле' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A rest can fall on any beat, even beat 1. Count it and come in on the next beat.',
            ru: 'Пауза может стоять на любой доле, даже на первой. Отсчитайте её и вступайте на следующую.',
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
            en: 'is a curve joining two notes of the same pitch. Play the first and hold it for both values.',
            ru: '— дуга между двумя нотами одной высоты. Сыграйте первую и держите её на обе длительности.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4 F4 G4/2~ G4/2 E4 C4' },
        {
          kind: 'note',
          text: {
            en: 'The G sounds once and lasts four beats.',
            ru: 'Соль звучит один раз и длится четыре доли.',
          },
        },
      ],
    },
    {
      heading: { en: 'Across the barline', ru: 'Через тактовую черту' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'One note cannot cross a barline, but a tie can. It carries the sound into the next bar.',
            ru: 'Одна нота не может пересечь тактовую черту, а лига может. Она переносит звук в следующий такт.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4~ F4 E4 D4 C4' },
        {
          kind: 'note',
          text: {
            en: 'Count it 1 2 3 4, (1) 2 3 4: the bracketed beat is held, not played.',
            ru: 'Считайте «раз, два, три, четыре, (раз), два, три, четыре»: доля в скобках выдерживается, а не играется.',
          },
        },
      ],
    },
    {
      heading: { en: 'Counting held notes', ru: 'Счёт долгих нот' },
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
            {
              en: 'Lift exactly on the rest that follows.',
              ru: 'Снимайте руку точно на следующей паузе.',
            },
          ],
        },
      ],
    },
    {
      heading: { en: 'Rests and ties in 3/4', ru: 'Паузы и лиги в 3/4' },
      blocks: [
        { kind: 'notes', clef: 'treble', meter: '3/4', notes: 'r/4 E4 G4~ G4 A4 G4 F4/2 D4 C4/2.' },
        {
          kind: 'text',
          text: {
            en: 'The line begins with a rest and ties G over the first barline. Count it in threes.',
            ru: 'Строка начинается с паузы, а соль залигована через первую тактовую черту. Считайте на три.',
          },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play C, rest a beat, then play E: count 1 2 3.',
            ru: 'Сыграйте до, выдержите паузу на долю и сыграйте ми: «раз, два, три».',
          },
          answer: { notes: ['C', 'E'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the tied G once and hold it four beats.',
            ru: 'Сыграйте залигованную соль один раз и держите четыре доли.',
          },
          answer: { notes: ['G'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play C, D, E, then F tied across the barline.',
            ru: 'Сыграйте до, ре, ми, затем фа, залигованную через тактовую черту.',
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
        {
          kind: 'link',
          title: { en: 'Count Auld Lang Syne', ru: 'Считайте доли в песне «Старая дружба»' },
          target: { opens: 'piece', piece: 'auld-lang-syne' },
        },
      ],
    },
  ],
}

export default quarterRestAndTie
