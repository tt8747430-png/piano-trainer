import type { Lesson } from '@/entities/lesson'

/** Intermediate Piano Playing, lesson 4: the dotted quarter and its eighth, long then short. */
const dottedQuarter: Lesson = {
  id: 'dotted-quarter',
  title: { en: 'The dotted quarter note', ru: 'Четверть с точкой' },
  summary: {
    en: 'Count and play a dotted quarter and an eighth: long, then short.',
    ru: 'Считать и играть четверть с точкой и восьмую: долго, затем коротко.',
  },
  sections: [
    {
      heading: { en: 'What the dot adds', ru: 'Что добавляет точка' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A dot', ru: 'Точка' },
          text: {
            en: 'after a note makes it half as long again. A dotted half lasts three beats. A dotted quarter lasts one and a half.',
            ru: 'после ноты удлиняет её на половину. Половинная с точкой длится три доли, четверть с точкой — полторы.',
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
            en: 'A dotted quarter and an eighth fill two beats. Count “1 2 and”: hold through 1 and 2, and play the eighth on “and”. Bar 1 is even, bar 2 dotted.',
            ru: 'Четверть с точкой и восьмая занимают две доли. Считайте «раз, два и»: держите звук на «раз» и «два», а восьмую играйте на «и». Первый такт ровный, второй с точкой.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4/2 C4/4. D4/8 E4/2' },
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
              en: 'Clap the rhythm, counting “1 2 and 3 4” aloud.',
              ru: 'Прохлопайте ритм, считая вслух «раз, два и, три, четыре».',
            },
            {
              en: 'Play it on G, still counting.',
              ru: 'Сыграйте его на соль, продолжая считать.',
            },
          ],
        },
      ],
    },
    {
      heading: { en: 'In a tune', ru: 'В мелодии' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Three bars start with the same long-short pair. Play the eighth lightly and let it lead into the next note.',
            ru: 'Три такта начинаются одной и той же парой «долго, коротко». Играйте восьмую легко, пусть она ведёт к следующему звуку.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4/4. D4/8 E4 C4 E4/4. F4/8 G4/2 A4/4. G4/8 F4 E4 D4/1',
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the tune’s first three notes: C long, D short, then E.',
            ru: 'Сыграйте первые три звука мелодии: до долго, ре коротко, затем ми.',
          },
          answer: { notes: ['C', 'D', 'E'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the pair that starts bar 3: A long, G short.',
            ru: 'Сыграйте пару, которой начинается третий такт: ля долго, соль коротко.',
          },
          answer: { notes: ['A', 'G'] },
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
  ],
}

export default dottedQuarter
