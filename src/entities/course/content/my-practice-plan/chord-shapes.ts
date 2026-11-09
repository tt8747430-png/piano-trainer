import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

/** My Practice Plan, lesson 2: triads, one-note changes, 7ths and inversions as shapes in every key. */
const chordShapes: Lesson = {
  id: 'chord-shapes',
  title: { en: 'Chords as shapes', ru: 'Аккорды как фигуры' },
  summary: {
    en: 'Triads and 7th chords as shapes under the hand, each quality one note away from the next, through their inversions and all twelve keys.',
    ru: 'Трезвучия и септаккорды как фигуры под рукой, каждое качество в одном звуке от другого, с обращениями, во всех двенадцати тональностях.',
  },
  after: ['the-plan'],
  sections: [
    {
      heading: { en: 'The triad', ru: 'Трезвучие' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A triad', ru: 'Трезвучие' },
          text: {
            en: 'is a root with a 3rd and a 5th above it. Learn each as one shape under the hand, not as three letters.',
            ru: '— основной тон с терцией и квинтой над ним. Учите каждое как одну фигуру под рукой, а не как три буквы.',
          },
        },
        { kind: 'chords', symbols: ['C', 'F', 'G'], apart: true },
      ],
    },
    {
      heading: { en: 'One note changes the chord', ru: 'Один звук меняет аккорд' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Start on C major. Lower the 3rd for minor. Raise it to the 4th for sus4. Lower the 3rd and 5th for diminished. Raise the 5th for augmented.',
            ru: 'Начните с до мажора. Понизьте терцию — минор. Поднимите её до кварты — sus4. Понизьте терцию и квинту — уменьшённый. Повысьте квинту — увеличенный.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Cm', 'Csus4', 'C°', 'C+'], apart: true },
      ],
      takeaway: {
        en: 'Every quality is one or two notes away from the major triad.',
        ru: 'Любое качество в одном-двух звуках от мажорного трезвучия.',
      },
    },
    {
      heading: { en: 'Seventh chords', ru: 'Септаккорды' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A seventh chord', ru: 'Септаккорд' },
          text: {
            en: 'adds a 7th on top of the triad. Maj7, 7 and m7 are the three you will play most.',
            ru: 'добавляет септиму поверх трезвучия. Maj7, 7 и m7 — три, которые вы будете играть чаще всего.',
          },
        },
        { kind: 'chords', symbols: ['CMaj7', 'C7', 'Cm7'], apart: true },
      ],
    },
    {
      heading: { en: 'Inversions', ru: 'Обращения' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An inversion', ru: 'Обращение' },
          text: {
            en: 'puts the 3rd or the 5th at the bottom. Play each chord up through its three positions, then back down.',
            ru: 'ставит внизу терцию или квинту. Сыграйте каждый аккорд вверх через три положения и обратно вниз.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', degrees: '| 1 3 5', hands: '| C4 E4 G4' },
            { symbol: 'C/E', degrees: '| 3 5 1', hands: '| E4 G4 C5' },
            { symbol: 'C/G', degrees: '| 5 1 3', hands: '| G4 C5 E5' },
          ],
        },
      ],
    },
    {
      heading: { en: 'All twelve roots', ru: 'Все двенадцать тоник' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play the shape on every root, round the circle. Say each chord’s name aloud as you play it.',
            ru: 'Сыграйте фигуру от каждого звука по кругу. Называйте аккорд вслух, пока играете.',
          },
        },
        { kind: 'grid', quality: 'min' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play D minor.', ru: 'Сыграйте ре минор.' },
          answer: { chord: 'Dm' },
        },
        {
          kind: 'question',
          ask: { en: 'Play A♭ major.', ru: 'Сыграйте ля-бемоль мажор.' },
          answer: { chord: 'A♭' },
        },
        {
          kind: 'question',
          ask: { en: 'Play G7.', ru: 'Сыграйте G7.' },
          answer: { chord: 'G7' },
        },
        {
          kind: 'link',
          title: { en: 'Inversions in the Player', ru: 'Обращения в плеере' },
          target: { opens: 'exercise', exercise: 'inversions', root: note('C') },
        },
        {
          kind: 'link',
          title: { en: 'Name the chord: Quiz', ru: 'Назовите аккорд: викторина' },
          target: { opens: 'quiz', trainer: 'chords', drill: 'entry' },
        },
      ],
    },
  ],
}

export default chordShapes
