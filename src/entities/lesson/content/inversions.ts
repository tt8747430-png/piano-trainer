import type { Lesson } from '../model/types'

const inversions: Lesson = {
  id: 'inversions',
  title: { en: 'Inversions', ru: 'Обращения' },
  summary: {
    en: 'Which note of a chord is lowest, how a slash chord names it, and why accompanists use them.',
    ru: 'Какая нота аккорда внизу, как её называет аккорд через дробь и зачем обращения аккомпаниатору.',
  },
  level: 2,
  category: 'chords',
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'Root position', ru: 'Основной вид' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A chord is in root position when its root is the lowest note: C E G.',
            ru: 'Аккорд в основном виде, когда его основной тон — самая нижняя нота: до, ми, соль.',
          },
        },
        { kind: 'chords', symbols: ['C'] },
      ],
    },
    {
      heading: { en: 'First inversion', ru: 'Первое обращение' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Move the root up an octave and the 3rd is lowest: E G C. A chord symbol writes the bass after a slash, C/E; classical theory calls it a sixth chord.',
            ru: 'Перенесите основной тон на октаву вверх — внизу окажется терция: ми, соль, до. Буквенное обозначение пишет бас через дробь, C/E; классическая теория называет его секстаккордом.',
          },
        },
        { kind: 'chords', symbols: ['C/E'] },
      ],
    },
    {
      heading: { en: 'Second inversion', ru: 'Второе обращение' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Move the 3rd up too and the 5th is lowest: G C E, written C/G; classical theory calls it a six-four chord.',
            ru: 'Перенесите вверх и терцию — внизу окажется квинта: соль, до, ми, пишется C/G; в классической теории это квартсекстаккорд.',
          },
        },
        { kind: 'chords', symbols: ['C/G'] },
      ],
    },
    {
      heading: { en: 'Moving smoothly', ru: 'Плавное голосоведение' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Going from C to F, keep the note they share, C, and move the others by step: C E G becomes C F A. Inversions let a hand change chords while it barely moves, which is how accompanists play.',
            ru: 'Переходя от C к F, оставьте общую ноту до на месте, а остальные сдвиньте на шаг: до-ми-соль становится до-фа-ля. Обращения позволяют руке менять аккорды почти не сдвигаясь — так и играют аккомпаниаторы.',
          },
        },
        { kind: 'chords', symbols: ['C', 'F/C', 'G/B', 'C'] },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: {
            en: 'Play the notes of F major, in any inversion.',
            ru: 'Сыграйте ноты фа мажора в любом обращении.',
          },
          answer: { chord: 'F' },
        },
        {
          kind: 'link',
          title: { en: 'Inversions in Chords', ru: 'Обращения в аккордах' },
          target: { place: 'chords', chord: 'C' },
        },
      ],
    },
  ],
}

export default inversions
