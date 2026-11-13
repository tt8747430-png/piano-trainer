import { C_MAJOR, note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

/** Sixteen-Week Practice Plan, lesson 6: shells, guide tones, rootless voicings and drop 2. */
const voicings: Lesson = {
  id: 'voicings',
  title: { en: 'Shells and rootless voicings', ru: 'Шеллы и аккорды без баса' },
  summary: {
    en: 'A small set of voicings that serve everywhere: shells, the guide tones, rootless 3–5–7–9 and 7–9–3–5, and drop 2.',
    ru: 'Небольшой набор расположений на все случаи: шеллы, ведущие тоны, без баса 3–5–7–9 и 7–9–3–5, и drop 2.',
  },
  after: ['left-hand'],
  sections: [
    {
      heading: { en: 'Shells', ru: 'Шеллы' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A shell voicing', ru: 'Шелл' },
          text: {
            en: 'keeps the root, 3rd and 7th and leaves out the 5th. These three notes say what the chord is.',
            ru: '— бас, терция и септима без квинты. Эти три звука говорят, что за аккорд.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'Dm7', degrees: '1 7 | 3', hands: 'D3 C4 | F4' },
            { symbol: 'G7', degrees: '1 3 | 7', hands: 'G2 B2 | F4' },
            { symbol: 'CMaj7', degrees: '1 7 | 3', hands: 'C3 B3 | E4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'The guide tones', ru: 'Ведущие тоны' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Guide tones', ru: 'Ведущие тоны' },
          text: {
            en: 'are the 3rd and 7th. In ii – V – I they stay still or move a half step: C to B, then F to E.',
            ru: '— терция и септима. В ii – V – I они стоят или сдвигаются на полтона: до в си, потом фа в ми.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'Dm7', degrees: '| 3 7', hands: '| F4 C5' },
            { symbol: 'G7', degrees: '| 7 3', hands: '| F4 B4' },
            { symbol: 'CMaj7', degrees: '| 3 7', hands: '| E4 B4' },
          ],
        },
      ],
      takeaway: {
        en: 'Two notes moving by half steps are the sound of ii – V – I.',
        ru: 'Два звука, идущие полутонами, — это и есть звук ii – V – I.',
      },
    },
    {
      heading: { en: 'Rootless voicings', ru: 'Аккорды без баса' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A rootless voicing', ru: 'Аккорд без баса' },
          text: {
            en: 'leaves the root to the bass and plays 3, 5, 7, 9 or 7, 9, 3, 5. Alternate them so the hand barely moves.',
            ru: 'оставляет основной тон басу и играет 3, 5, 7, 9 или 7, 9, 3, 5. Чередуйте их, и рука почти не двигается.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'Dm9', degrees: '1 | 3 5 7 9', hands: 'D2 | F3 A3 C4 E4' },
            { symbol: 'G9', degrees: '1 | 7 9 3 5', hands: 'G2 | F3 A3 B3 D4' },
            { symbol: 'CMaj9', degrees: '1 | 3 5 7 9', hands: 'C3 | E3 G3 B3 D4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Drop 2', ru: 'Drop 2' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Drop 2', ru: 'Drop 2' },
          text: {
            en: 'takes the second note from the top of a close chord down an octave. The chord opens out and sings.',
            ru: 'опускает второй сверху звук тесного аккорда на октаву. Аккорд раскрывается и поёт.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'CMaj7', degrees: '| 1 3 5 7', hands: '| C4 E4 G4 B4' },
            { symbol: 'CMaj7', degrees: '| 5 1 3 7', hands: '| G3 C4 E4 B4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'One colour at a time', ru: 'По одной краске' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Add colour one note at a time: the 9th first, then the 13th. Loop one ii – V – I with it for a week before the next.',
            ru: 'Добавляйте краски по одному звуку: сначала нону, потом терцдециму. Неделю крутите с ней один ii – V – I, прежде чем брать следующую.',
          },
        },
        { kind: 'progression', numerals: 'ii V I', key: C_MAJOR, size: 'ninths' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the shell of G7, up from G: G, B and F.',
            ru: 'Сыграйте шелл G7 вверх от соль: соль, си и фа.',
          },
          answer: { notes: ['G', 'B', 'F'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the guide tones of C7: E and B♭.',
            ru: 'Сыграйте ведущие тоны C7: ми и си-бемоль.',
          },
          answer: { notes: ['E', 'B♭'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'Drop 2 in the Player', ru: 'Drop 2 в плеере' },
          target: { opens: 'exercise', exercise: 'drop-two', root: note('C') },
        },
        {
          kind: 'link',
          title: {
            en: 'ii – V – I in ninths round the circle',
            ru: 'ii – V – I нонаккордами по кругу',
          },
          target: {
            opens: 'player',
            numerals: 'ii V I',
            key: C_MAJOR,
            size: 'ninths',
            walk: 'fifths',
          },
        },
      ],
    },
  ],
}

export default voicings
