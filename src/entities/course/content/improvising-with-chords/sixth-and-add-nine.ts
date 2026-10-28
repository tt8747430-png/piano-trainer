import type { Lesson } from '@/entities/lesson'

/** Improvising with Chords, lesson 3: the 6th, the added 9th and the 6/9 as colours of a major chord. */
const sixthAndAddNine: Lesson = {
  id: 'sixth-and-add-nine',
  title: { en: 'Sixth and added ninth chords', ru: 'Аккорды с секстой и добавленной ноной' },
  summary: {
    en: 'Add a 6th, a 9th or both to a major chord, and hear how each one changes its colour.',
    ru: 'Добавьте к мажорному трезвучию сексту, нону или обе и услышьте, как меняется его окраска.',
  },
  sections: [
    {
      heading: { en: 'The added 6th', ru: 'Добавленная секста' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A sixth chord', ru: 'Аккорд с секстой' },
          text: {
            en: 'is a major triad with its 6th added. C6 is C, E, G and A. Compare it with plain C: it sounds sweet and settled.',
            ru: '— мажорное трезвучие с добавленной секстой. C6 — это до, ми, соль и ля. Сравните с простым C: звучит нежно и устойчиво.',
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
            en: 'C6 and Am7 have the same four notes. The bass decides which chord you hear. With C below it is C6, and with A below it is Am7.',
            ru: 'В C6 и Am7 одни и те же четыре звука. Какой аккорд вы слышите, решает бас. С до внизу это C6, с ля внизу — Am7.',
          },
        },
      ],
    },
    {
      heading: { en: 'The added 9th', ru: 'Добавленная нона' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An added 9th chord', ru: 'Аккорд с добавленной ноной' },
          text: {
            en: 'is a triad plus the 9th, with no 7th. The 9th of C is D. Play it on top or tucked under the 3rd. It sounds open and bright.',
            ru: '— трезвучие с ноной, но без септимы. Нона от до — это ре. Играйте её сверху или под терцией. Звучит открыто и светло.',
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
            en: 'C6/9 holds both colours: C, E, G, A and D. Spread it over two hands, with C and G in the left, so it rings.',
            ru: 'В C6/9 обе краски: до, ми, соль, ля и ре. Разложите его на две руки, до и соль в левой, и он зазвенит.',
          },
        },
        {
          kind: 'voicings',
          voicings: [{ symbol: 'C6/9', degrees: '1 5 | 3 6 9', hands: 'C3 G3 | E4 A4 D5' }],
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
            en: 'Use 6/9 for a song’s last chord in place of a plain triad. Try it at the end of Michael, Row the Boat Ashore.',
            ru: 'Возьмите 6/9 на последнем аккорде песни вместо простого трезвучия. Попробуйте в конце «Michael, Row the Boat Ashore».',
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
            en: 'Play C6’s notes over A in the bass.',
            ru: 'Сыграйте звуки C6 над ля в басу.',
          },
          answer: { chord: 'Am7' },
        },
        {
          kind: 'link',
          title: { en: 'C6/9 in Chords', ru: 'C6/9 в разделе «Аккорды»' },
          target: { opens: 'chords', chord: 'C6/9' },
        },
        {
          kind: 'link',
          title: { en: 'Build chords in the Quiz', ru: 'Построение аккордов в тестах' },
          target: { opens: 'quiz', trainer: 'chords', drill: 'entry' },
        },
      ],
    },
  ],
}

export default sixthAndAddNine
