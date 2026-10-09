import type { Lesson } from '../model/types'

const rightHandTechniques: Lesson = {
  id: 'right-hand-techniques',
  title: { en: 'Right-hand techniques', ru: 'Техники правой руки' },
  summary: {
    en: 'Called to Play’s ways to decorate a chord while the left hand keeps the bass, each on its own lesson’s study.',
    ru: 'Приёмы Called to Play, которые украшают аккорд, пока левая рука держит бас, — каждый на этюде своего урока.',
  },
  level: 2,
  category: 'accompaniment',
  module: 'called-to-play',
  sections: [
    {
      heading: { en: 'Decorating a chord', ru: 'Украшение аккорда' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Each technique keeps the chord and gives the right hand something to do between its changes. Each is taught on its own lesson’s study: try it there first, then on your own charts.',
            ru: 'Каждая техника сохраняет аккорд и даёт правой руке занятие между сменами. Каждую изучают на этюде своего урока: попробуйте её там, потом в своих песнях.',
          },
        },
      ],
    },
    {
      heading: { en: 'Octave jumps', ru: 'Скачки на октаву' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Strike the chord, then play its root one and two octaves higher and come back: the chord rings on, and the top of the keyboard answers it.',
            ru: 'Возьмите аккорд, затем сыграйте основной тон на одну и на две октавы выше и вернитесь: аккорд звучит, а верх клавиатуры ему отвечает.',
          },
        },
        { kind: 'pattern', pattern: 't1', piece: 'ex5' },
      ],
    },
    {
      heading: { en: 'Up two octaves', ru: 'Вверх на две октавы' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The same study’s second technique runs the arpeggio 1–3–5–8 up two octaves, fingers 1–2–3–5, over the left hand’s octave.',
            ru: 'Вторая техника того же этюда ведёт арпеджио 1–3–5–8 вверх на две октавы, пальцами 1–2–3–5, над октавой левой руки.',
          },
        },
        { kind: 'pattern', pattern: 't2', piece: 'ex5' },
      ],
    },
    {
      heading: { en: 'Runs down, runs up', ru: 'Пассажи вниз и вверх' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Take the 2nd and the 5th together, then run down 3–2–1 to the root, and the same an octave lower. The same study turns it round: the root, 2nd, 3rd and 5th climb two octaves, fingers 1–2–3–5 each time.',
            ru: 'Возьмите вместе секунду и квинту, затем спуститесь 3–2–1 к основному тону, и то же октавой ниже. Тот же этюд поворачивает это вспять: основной тон, секунда, терция и квинта поднимаются на две октавы, каждый раз пальцами 1–2–3–5.',
          },
        },
        { kind: 'pattern', pattern: 't3', piece: 'ex6' },
        { kind: 'pattern', pattern: 't4', piece: 'ex6' },
      ],
    },
    {
      heading: { en: 'Chords up the keyboard', ru: 'Аккорды вверх по клавиатуре' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Over a wide left-hand arpeggio the chord moves up: dotted, then an octave higher; as three chords an octave apart; or through its inversions, root position, then the 1st and 2nd.',
            ru: 'Над широким арпеджио левой руки аккорд движется вверх: с точкой, затем октавой выше; тремя аккордами через октаву; или по обращениям — основной вид, затем 1-е и 2-е.',
          },
        },
        { kind: 'pattern', pattern: 't5', piece: 'ex7' },
        { kind: 'pattern', pattern: 'c3', piece: 'ex7' },
        { kind: 'pattern', pattern: 'inv', piece: 'ex7' },
      ],
    },
    {
      heading: { en: 'Moving voices', ru: 'Движущиеся голоса' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Keep the chord and move one voice: the ♭7 joins under the root (Dm becomes Dm7), the root falls by half steps, or the 3rd turns 3–2–4–3.',
            ru: 'Держите аккорд и двигайте один голос: ♭7 добавляется под основным тоном (Dm становится Dm7), основной тон спускается по полутонам или терция движется 3–2–4–3.',
          },
        },
        { kind: 'pattern', pattern: 'p51', piece: 'ex8' },
        { kind: 'pattern', pattern: 'p52', piece: 'ex8' },
        { kind: 'pattern', pattern: 'p53', piece: 'ex8' },
      ],
    },
    {
      heading: { en: 'Sixths', ru: 'Сексты' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Parallel sixths climb or fall along the scale over a 1–5–8–5 bass: two voices a sixth apart, moving together between the chord’s 3rd and 5th.',
            ru: 'Параллельные сексты поднимаются или спускаются по гамме над басом 1–5–8–5: два голоса на расстоянии сексты движутся вместе между терцией и квинтой аккорда.',
          },
        },
        { kind: 'pattern', pattern: 's6u', piece: 'ex9' },
        { kind: 'pattern', pattern: 's6d', piece: 'ex9' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: {
            en: 'Play the sixth from E up to C.',
            ru: 'Сыграйте сексту от ми вверх до до.',
          },
          answer: { notes: ['E', 'C'] },
        },
      ],
    },
  ],
}

export default rightHandTechniques
