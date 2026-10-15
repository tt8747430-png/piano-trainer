import type { Lesson } from '@/entities/lesson'

/** Improvising with Chords, lesson 3: the 6th, the added 9th and the 6/9 as colours of a major chord. */
const sixthAndAddNine: Lesson = {
  id: 'sixth-and-add-nine',
  title: { en: 'Sixth and added ninth chords', ru: 'Аккорды с секстой и добавленной ноной' },
  summary: {
    en: 'Three colours for a major chord with no 7th: the sweet 6th, the open add9 and the ringing 6/9, and why C6 and Am7 are twins.',
    ru: 'Три краски мажорного аккорда без септимы: нежная секста, открытая add9 и звонкий 6/9, а также почему C6 и Am7 — близнецы.',
  },
  sections: [
    {
      heading: { en: 'The added 6th', ru: 'Добавленная секста' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Sixth chord:', ru: 'Аккорд с секстой:' },
          text: {
            en: 'a major triad with its 6th added. C6 is C, E, G, A. It sounds sweet and settled, a classic last chord.',
            ru: 'мажорное трезвучие с добавленной секстой. C6 — это до, ми, соль, ля. Звучит нежно и устойчиво, классический заключительный аккорд.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', degrees: '1 | 3 5 1', hands: 'C3 | E4 G4 C5' },
            { symbol: 'C6', degrees: '1 | 3 5 6', hands: 'C3 | E4 G4 A4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'C6 or Am7?', ru: 'C6 или Am7?' },
      blocks: [
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C6', degrees: '1 | 3 5 6', hands: 'C3 | E4 G4 A4' },
            { symbol: 'Am7', degrees: '1 | ♭3 5 ♭7', hands: 'A2 | C4 E4 G4' },
          ],
        },
        {
          kind: 'text',
          text: {
            en: 'C6 and Am7 share the same four notes: C, E, G, A. The bass decides. C below makes C6, A below makes Am7.',
            ru: 'В C6 и Am7 одни и те же четыре звука: до, ми, соль, ля. Решает бас. До внизу даёт C6, ля внизу — Am7.',
          },
        },
      ],
    },
    {
      heading: { en: 'The added 9th', ru: 'Добавленная нона' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Added 9th:', ru: 'Аккорд с добавленной ноной:' },
          text: {
            en: 'a triad with the 9th, D over C, and no 7th. Open and bright, it is a favourite of pop ballads.',
            ru: 'трезвучие с ноной, ре над до, без септимы. Открытый и светлый, он любим в поп-балладах.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'Cadd9', degrees: '1 | 3 5 9', hands: 'C3 | E4 G4 D5' },
            { symbol: 'Cadd9', degrees: '1 | 9 3 5', hands: 'C3 | D4 E4 G4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Both at once: 6/9', ru: 'Оба сразу: 6/9' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C6/9 holds both colours: C, E, G, A, D. Spread it over two hands and it rings like a bell.',
            ru: 'В C6/9 обе краски: до, ми, соль, ля, ре. Разложите его на две руки, и он зазвенит, как колокол.',
          },
        },
        {
          kind: 'voicings',
          voicings: [{ symbol: 'C6/9', degrees: '1 5 | 3 6 9', hands: 'C3 G3 | E4 A4 D5' }],
        },
      ],
    },
    {
      heading: { en: 'One root, four colours', ru: 'Один бас, четыре краски' },
      blocks: [
        { kind: 'chords', symbols: ['C', 'C6', 'Cadd9', 'C6/9'], apart: true },
        {
          kind: 'text',
          text: {
            en: 'Play each in turn, then choose one for a song’s last chord. Each colours the ending in its own way.',
            ru: 'Сыграйте каждый по очереди, затем выберите один для последнего аккорда песни. Каждый по-своему окрашивает окончание.',
          },
        },
      ],
    },
    {
      heading: { en: 'A brighter ending', ru: 'Более светлое окончание' },
      blocks: [
        { kind: 'chords', symbols: ['F', 'G7', 'C6/9'] },
        {
          kind: 'text',
          text: {
            en: 'End a song on 6/9 instead of a plain triad. Try it on the last chord of Michael, Row the Boat Ashore.',
            ru: 'Закончите песню на 6/9 вместо простого трезвучия. Попробуйте на последнем аккорде «Michael, Row the Boat Ashore».',
          },
        },
        {
          kind: 'link',
          title: {
            en: 'Michael, Row the Boat Ashore in the Player',
            ru: '«Michael, Row the Boat Ashore» в плеере',
          },
          target: { opens: 'piece', piece: 'michael-row' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play C6.', ru: 'Сыграйте C6.' },
          answer: { chord: 'C6' },
        },
        {
          kind: 'question',
          ask: { en: 'Play Cadd9.', ru: 'Сыграйте Cadd9.' },
          answer: { chord: 'Cadd9' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play C6’s twin with A in the bass.',
            ru: 'Сыграйте близнеца C6 с ля в басу.',
          },
          answer: { chord: 'Am7' },
        },
        {
          kind: 'question',
          ask: { en: 'Play F6: F, A, C and D.', ru: 'Сыграйте F6: фа, ля, до и ре.' },
          answer: { chord: 'F6' },
        },
        {
          kind: 'link',
          title: { en: 'C6/9 in Chords', ru: 'C6/9 в разделе «Аккорды»' },
          target: { opens: 'chords', chord: 'C6/9' },
        },
        {
          kind: 'link',
          title: { en: 'Build chords in the Quiz', ru: 'Построение аккордов в тестах' },
          target: { opens: 'quiz', trainer: 'build-chord' },
        },
        {
          kind: 'link',
          title: { en: 'Kumbaya in the Player', ru: '«Кумбая» в плеере' },
          target: { opens: 'piece', piece: 'kumbaya' },
        },
      ],
    },
  ],
}

export default sixthAndAddNine
