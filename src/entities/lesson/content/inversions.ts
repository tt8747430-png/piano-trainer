import type { Lesson } from '../model/types'

const inversions: Lesson = {
  id: 'inversions',
  title: { en: 'Inversions', ru: 'Обращения' },
  summary: {
    en: 'Which note of a chord is lowest, how a chord symbol writes it, and why accompanists use inversions.',
    ru: 'Какая нота аккорда звучит внизу, как это пишет буквенное обозначение и зачем обращения аккомпаниатору.',
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
          lead: { en: 'Root position', ru: 'Основной вид' },
          text: {
            en: 'means the root is the lowest note. Tap C below: C E G, with C at the bottom.',
            ru: '— это когда основной тон звучит ниже всех. Нажмите C ниже: до, ми, соль, и до — самая нижняя.',
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
          lead: { en: 'An inversion', ru: 'Обращение' },
          text: {
            en: 'is the same chord with another of its notes at the bottom.',
            ru: '— тот же аккорд, но внизу у него звучит не основной тон.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Move the root up an octave. Now the 3rd is lowest: E G C. This is the first inversion.',
            ru: 'Перенесите основной тон на октаву вверх. Теперь внизу терция: ми, соль, до. Это первое обращение.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'A chord symbol writes the bass after a slash: C/E. Classical theory calls it a sixth chord.',
            ru: 'В буквенном обозначении бас пишут через дробь: C/E. В классической теории это секстаккорд.',
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
            en: 'Move the 3rd up an octave too. Now the 5th is lowest: G C E, written C/G. Classical theory calls it a six-four chord.',
            ru: 'Перенесите вверх и терцию. Теперь внизу квинта: соль, до, ми, пишется C/G. В классической теории это квартсекстаккорд.',
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
            en: 'Inversions let a hand change chords while it barely moves. This is how accompanists play.',
            ru: 'Обращения позволяют руке менять аккорды, почти не сдвигаясь. Так играют аккомпаниаторы.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Going from C to F, keep their shared note, C, where it is. Move the other notes by step: C E G becomes C F A.',
            ru: 'При переходе от C к F оставьте общую ноту до на месте. Остальные сдвиньте на шаг: до-ми-соль становится до-фа-ля.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Play the row below: the hand hardly moves from C to F, to G and back to C.',
            ru: 'Сыграйте ряд ниже: рука почти не сдвигается от C к F, к G и обратно к C.',
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
