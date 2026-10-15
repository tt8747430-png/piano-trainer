import type { Lesson } from '@/entities/lesson'

/** Improvising with Chords, lesson 1: four ways to play the same chords under a tune. */
const accompanimentPatterns: Lesson = {
  id: 'accompaniment-patterns',
  title: { en: 'Accompaniment patterns', ru: 'Фактуры аккомпанемента' },
  summary: {
    en: 'The same chords, four ways: struck together, broken, as an Alberti bass, or as a bass note answered by the chord.',
    ru: 'Одни и те же аккорды четырьмя способами: вместе, разложенными, альбертиевыми басами или басом, на который отвечает аккорд.',
  },
  sections: [
    {
      heading: { en: 'Block chords', ru: 'Аккорды целиком' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Block chords:', ru: 'Аккордовая фактура:' },
          text: {
            en: 'every note of the chord struck together. On each beat or each bar, they sound steady and full under a spiritual.',
            ru: 'все звуки аккорда берутся одновременно. На каждую долю или на каждый такт они звучат ровно и полно под спиричуэлс.',
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
          lead: { en: 'Broken chord:', ru: 'Разложенный аккорд:' },
          text: {
            en: 'the chord’s notes played one after another. Up and back down in eighths, C and then F, it flows like water.',
            ru: 'звуки аккорда играются один за другим. Вверх и обратно восьмыми, сначала до мажор, затем фа мажор, — и музыка течёт.',
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
          lead: { en: 'Alberti bass:', ru: 'Альбертиевы басы:' },
          text: {
            en: 'a chord broken low, high, middle, high, in even eighths. The classical sonata’s favourite left hand.',
            ru: 'аккорд, разложенный в порядке «низ, верх, середина, верх», ровными восьмыми. Любимая левая рука классической сонаты.',
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
            en: 'The bass plays the root on beat 1 and the 5th on beat 3. The right hand answers with the chord on beats 2 and 4.',
            ru: 'Бас играет основной тон на первую долю и квинту на третью. Правая рука отвечает аккордом на вторую и четвёртую доли.',
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
            en: 'Hear one song with a plain pattern of block chords. Then open it in the Player and try each way from this lesson.',
            ru: 'Послушайте песню с простой аккордовой фактурой. Затем откройте её в плеере и попробуйте каждый способ из этого урока.',
          },
        },
        { kind: 'pattern', pattern: 'block', piece: 'kumbaya' },
        {
          kind: 'link',
          title: { en: 'Kumbaya in the Player', ru: '«Кумбая» в плеере' },
          target: { opens: 'piece', piece: 'kumbaya', pattern: 'block' },
        },
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
          kind: 'question',
          ask: {
            en: 'Play G7, the chord that leads back to C.',
            ru: 'Сыграйте G7, аккорд, ведущий обратно к C.',
          },
          answer: { chord: 'G7' },
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
