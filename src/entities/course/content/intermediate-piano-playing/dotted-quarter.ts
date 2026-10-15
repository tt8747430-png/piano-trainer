import type { Lesson } from '@/entities/lesson'

/** Intermediate Piano Playing, lesson 4: the dotted quarter and its eighth, long then short. */
const dottedQuarter: Lesson = {
  id: 'dotted-quarter',
  title: { en: 'The dotted quarter note', ru: 'Четверть с точкой' },
  summary: {
    en: 'A dot makes a note half as long again. A dotted quarter and an eighth fill two beats, long then short, counted «1 – 2 and».',
    ru: 'Точка удлиняет ноту наполовину. Четверть с точкой и восьмая занимают две доли, долго и коротко, и считаются «раз – два и».',
  },
  sections: [
    {
      heading: { en: 'What the dot adds', ru: 'Что добавляет точка' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Dot:', ru: 'Точка:' },
          text: {
            en: 'adds half a note’s value to it. A dotted half lasts three beats. A dotted quarter lasts one and a half.',
            ru: 'прибавляет к ноте половину её длительности. Половинная с точкой звучит три доли, четверть с точкой — полторы.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4/2. C4 C4/4. C4/8 C4/2' },
      ],
    },
    {
      heading: { en: 'Long, then short', ru: 'Долго, потом коротко' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A dotted quarter and an eighth fill two beats. Count «1 – 2 and»: the dotted quarter holds through beat 2, the eighth falls on its «and».',
            ru: 'Четверть с точкой и восьмая занимают две доли. Считайте «раз – два и»: четверть с точкой тянется через вторую долю, восьмая звучит на «и».',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4/4. D4/8 E4/2 E4/4. F4/8 G4/2' },
      ],
    },
    {
      heading: { en: 'Even, then dotted', ru: 'Ровно, затем с точкой' },
      blocks: [
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4/2 C4/4. D4/8 E4/2' },
        {
          kind: 'text',
          text: {
            en: 'Bar 1 plays two even quarters. Bar 2 plays the same notes dotted: the first grows longer and the second hurries into beat 3.',
            ru: 'В первом такте две ровные четверти. Во втором те же звуки с точкой: первый становится длиннее, а второй спешит к третьей доле.',
          },
        },
      ],
    },
    {
      heading: { en: 'Clap it first', ru: 'Сначала прохлопайте' },
      blocks: [
        { kind: 'notes', clef: 'treble', notes: 'G4/4. G4/8 G4 G4 G4/4. G4/8 G4/2' },
        {
          kind: 'steps',
          steps: [
            {
              en: 'Clap the rhythm, counting «1 – 2 and 3 4» aloud.',
              ru: 'Прохлопайте ритм, считая вслух «раз – два и три четыре».',
            },
            {
              en: 'Play it on one key, still counting.',
              ru: 'Сыграйте его на одной клавише, не переставая считать.',
            },
            { en: 'Then play the tune below.', ru: 'Затем сыграйте мелодию ниже.' },
          ],
        },
      ],
    },
    {
      heading: { en: 'In a tune', ru: 'В мелодии' },
      blocks: [
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4/4. D4/8 E4 C4 E4/4. F4/8 G4/2 A4/4. G4/8 F4 E4 D4/1',
        },
        {
          kind: 'text',
          text: {
            en: 'Three bars start with the same long-short pair. Keep the eighth light and let it lead on to the next note.',
            ru: 'Три такта начинаются одной и той же парой «долго – коротко». Играйте восьмую легко, пусть она ведёт к следующему звуку.',
          },
        },
      ],
    },
    {
      heading: { en: 'In the course’s songs', ru: 'В песнях курса' },
      blocks: [
        { kind: 'notes', clef: 'treble', notes: 'E4/4. E4/8 D4 C4 D4/4. E4/8 C4/2' },
        {
          kind: 'text',
          text: {
            en: 'Folk tunes love long-short pairs. Listen for them in Greensleeves and Scarborough Fair, then play along.',
            ru: 'Народные мелодии любят пары «долго – коротко». Найдите их на слух в «Гринсливз» и «Ярмарке в Скарборо», затем сыграйте вместе с плеером.',
          },
        },
        {
          kind: 'link',
          title: { en: 'Greensleeves in the Player', ru: '«Гринсливз» в плеере' },
          target: { opens: 'piece', piece: 'greensleeves' },
        },
        {
          kind: 'link',
          title: { en: 'Scarborough Fair in the Player', ru: '«Ярмарка в Скарборо» в плеере' },
          target: { opens: 'piece', piece: 'scarborough-fair' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the first bar of the tune: C long, D short, then E and C.',
            ru: 'Сыграйте первый такт мелодии: до долго, ре коротко, затем ми и до.',
          },
          answer: { notes: ['C', 'D', 'E'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play its third bar’s pair: A long, G short.',
            ru: 'Сыграйте пару из третьего такта: ля долго, соль коротко.',
          },
          answer: { notes: ['A', 'G'] },
        },
        {
          kind: 'link',
          title: { en: 'Read notes in the Quiz', ru: 'Чтение нот в тестах' },
          target: { opens: 'quiz', trainer: 'reading-notes' },
        },
        {
          kind: 'link',
          title: { en: 'Greensleeves in the Player', ru: '«Гринсливз» в плеере' },
          target: { opens: 'piece', piece: 'greensleeves' },
        },
      ],
    },
  ],
}

export default dottedQuarter
