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
  module: 'accompaniment',
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
      heading: { en: 'Runs down', ru: 'Пассажи вниз' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'From the top of the chord, run down through the 3rd and the 2nd to the root, then again an octave lower.',
            ru: 'От верхнего звука аккорда спуститесь через терцию и секунду к основному тону, затем ещё раз октавой ниже.',
          },
        },
        { kind: 'pattern', pattern: 't3', piece: 'ex6' },
      ],
    },
    {
      heading: { en: 'Dotted chords', ru: 'Пунктирные аккорды' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The chord in root position, then its 1st and 2nd inversion, in a dotted rhythm over a wide left-hand arpeggio.',
            ru: 'Аккорд в основном виде, затем в 1-м и 2-м обращении, в пунктирном ритме над широким арпеджио левой руки.',
          },
        },
        { kind: 'pattern', pattern: 't5', piece: 'ex7' },
      ],
    },
    {
      heading: { en: 'Moving voices', ru: 'Движущиеся голоса' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Keep the chord and move one voice: the root steps down a whole tone (Dm becomes Dm7), the lowest voice falls by half steps, or the 3rd turns 3–2–4–3.',
            ru: 'Держите аккорд и двигайте один голос: основной тон спускается на целый тон (Dm становится Dm7), нижний голос спускается по полутонам или терция движется 3–2–4–3.',
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
            en: 'Parallel sixths climb or fall to the chord over a 1–5–8–5 bass: two voices a sixth apart, moving together.',
            ru: 'Параллельные сексты поднимаются или спускаются к аккорду над басом 1–5–8–5: два голоса на расстоянии сексты движутся вместе.',
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
