import type { Lesson } from '@/entities/lesson'

/** Improvising with Chords, lesson 1: four ways to play the same chords under a tune. */
const accompanimentPatterns: Lesson = {
  id: 'accompaniment-patterns',
  title: { en: 'Accompaniment patterns', ru: 'Фактуры аккомпанемента' },
  summary: {
    en: 'Play the same chords four different ways under a song: block, broken, Alberti bass, and bass and chord.',
    ru: 'Играйте одни и те же аккорды под песню четырьмя способами: целиком, разложенными, альбертиевыми басами и «бас и аккорд».',
  },
  sections: [
    {
      heading: { en: 'Block chords', ru: 'Аккорды целиком' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Block chords', ru: 'Аккордовая фактура' },
          text: {
            en: 'strike every note of the chord together, once a beat or once a bar. They sound steady and full. Here the left hand adds the root and 5th.',
            ru: '— все звуки аккорда берутся вместе, раз в долю или раз в такт. Звучит ровно и плотно. Левая рука здесь добавляет приму и квинту.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', degrees: '1 5 | 3 5 1', hands: 'C3 G3 | E4 G4 C5' },
            { symbol: 'F', degrees: '1 5 | 1 3 5', hands: 'F2 C3 | F4 A4 C5' },
            { symbol: 'G7', degrees: '1 5 | 5 ♭7 3', hands: 'G2 D3 | D4 F4 B4' },
            { symbol: 'C', degrees: '1 5 | 3 5 1', hands: 'C3 G3 | E4 G4 C5' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Broken chords', ru: 'Разложенные аккорды' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A broken chord', ru: 'Разложенный аккорд' },
          text: {
            en: 'plays the chord’s notes one after another. Here the left hand plays C major, then F major, up and back down in eighth notes.',
            ru: '— звуки аккорда берутся по одному. Здесь левая рука играет до мажор, затем фа мажор, вверх и вниз восьмыми.',
          },
        },
        {
          kind: 'notes',
          clef: 'bass',
          notes: 'C3/8 E3/8 G3/8 C4/8 G3/8 E3/8 C3/8 E3/8 F2/8 A2/8 C3/8 F3/8 C3/8 A2/8 F2/8 A2/8',
        },
      ],
    },
    {
      heading: { en: 'Alberti bass', ru: 'Альбертиевы басы' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Alberti bass', ru: 'Альбертиевы басы' },
          text: {
            en: 'breaks a chord in a fixed order: lowest, highest, middle, highest. Play it in even eighth notes and keep the lowest note a little stronger.',
            ru: '— аккорд, разложенный в постоянном порядке: нижний, верхний, средний, верхний звук. Играйте ровными восьмыми, нижний звук чуть ярче.',
          },
        },
        {
          kind: 'notes',
          clef: 'bass',
          notes: 'C3/8 G3/8 E3/8 G3/8 C3/8 G3/8 E3/8 G3/8 B2/8 G3/8 D3/8 G3/8 C3/8 G3/8 E3/8 G3/8',
        },
      ],
    },
    {
      heading: { en: 'Bass and chord', ru: 'Бас и аккорд' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Split the chord between the hands. The left hand plays the root on beat 1 and the 5th on beat 3. The right hand answers with the chord on beats 2 and 4.',
            ru: 'Разделите аккорд между руками. Левая играет основной тон на первую долю и квинту на третью. Правая отвечает аккордом на вторую и четвёртую.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3 r/4 G2 r/4 F2 r/4 C3 r/4' },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', degrees: '1 | 3 5 1', hands: 'C3 | E4 G4 C5' },
            { symbol: 'C', degrees: '5 | 3 5 1', hands: 'G2 | E4 G4 C5' },
            { symbol: 'F', degrees: '1 | 5 1 3', hands: 'F2 | C4 F4 A4' },
            { symbol: 'F', degrees: '5 | 5 1 3', hands: 'C3 | C4 F4 A4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Under a song', ru: 'Под песню' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Listen to Kumbaya in block chords. Then open the songs below in the Player and try each pattern under the melody.',
            ru: 'Послушайте «Кумбаю» с аккордами целиком. Затем откройте песни ниже в плеере и попробуйте каждую фактуру под мелодию.',
          },
        },
        { kind: 'pattern', pattern: 'block', piece: 'kumbaya' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the chord the Alberti bass breaks first.',
            ru: 'Сыграйте аккорд, который альбертиевы басы раскладывают первым.',
          },
          answer: { chord: 'C' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play F major as a broken chord, up from F.',
            ru: 'Сыграйте фа мажор разложенным аккордом вверх от фа.',
          },
          answer: { notes: ['F', 'A', 'C'], rising: true },
        },
        {
          kind: 'link',
          title: {
            en: 'Swing Low, Sweet Chariot in the Player',
            ru: '«Swing Low, Sweet Chariot» в плеере',
          },
          target: { opens: 'piece', piece: 'swing-low', pattern: 'ballad' },
        },
        {
          kind: 'link',
          title: {
            en: 'Michael, Row the Boat Ashore in the Player',
            ru: '«Michael, Row the Boat Ashore» в плеере',
          },
          target: { opens: 'piece', piece: 'michael-row', pattern: 'country' },
        },
        {
          kind: 'link',
          title: { en: 'Kumbaya in the Player', ru: '«Кумбая» в плеере' },
          target: { opens: 'piece', piece: 'kumbaya', pattern: 'flow' },
        },
      ],
    },
  ],
}

export default accompanimentPatterns
