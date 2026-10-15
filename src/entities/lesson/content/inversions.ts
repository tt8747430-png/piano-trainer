import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const inversions: Lesson = {
  id: 'inversions',
  title: { en: 'Inversions', ru: 'Обращения' },
  summary: {
    en: 'Which note of a chord is lowest, how a chord symbol writes it, and why accompanists use inversions.',
    ru: 'Какая нота аккорда звучит внизу, как это пишет буквенное обозначение и зачем обращения аккомпаниатору.',
  },
  sections: [
    {
      heading: { en: 'Root position', ru: 'Основной вид' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Root position', ru: 'Основной вид' },
          text: {
            en: 'means the root is the lowest note.',
            ru: '— это когда основной тон звучит ниже всех.',
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
            en: 'puts another chord note at the bottom. Move C up an octave and the 3rd is lowest: the first inversion, written C/E.',
            ru: '— тот же аккорд с другой нотой внизу. Перенесите до на октаву вверх, и внизу окажется терция: первое обращение, пишется C/E.',
          },
        },
        { kind: 'chords', symbols: ['C/E'] },
        {
          kind: 'text',
          text: {
            en: 'Classical theory calls it a sixth chord.',
            ru: 'В классической теории это секстаккорд.',
          },
        },
      ],
    },
    {
      heading: { en: 'Second inversion', ru: 'Второе обращение' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Move the 3rd up an octave too. Now the 5th is lowest: C/G. Classical theory calls it a six-four chord.',
            ru: 'Перенесите вверх и терцию. Теперь внизу квинта: C/G. В классической теории это квартсекстаккорд.',
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
            en: 'Inversions let the hand change chords while barely moving. Keep the shared note where it is and move the others by step.',
            ru: 'Обращения позволяют руке менять аккорды, почти не сдвигаясь. Общую ноту оставьте на месте, остальные сдвиньте на шаг.',
          },
        },
        { kind: 'chords', symbols: ['C', 'F/C', 'G/B', 'C'] },
        {
          kind: 'link',
          title: { en: 'Name chords in the Quiz', ru: 'Названия аккордов в тестах' },
          target: { opens: 'quiz', trainer: 'name-chord' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the notes of F major, in any inversion.',
            ru: 'Сыграйте ноты фа мажора в любом обращении.',
          },
          answer: { chord: 'F' },
        },
        {
          kind: 'link',
          title: { en: 'Inversions in Chords', ru: 'Обращения в аккордах' },
          target: { opens: 'chords', chord: 'C' },
        },
        {
          kind: 'link',
          title: { en: 'Climb C through its inversions', ru: 'До мажор по обращениям' },
          target: { opens: 'exercise', exercise: 'inversions', root: note('C'), quality: 'maj' },
        },
      ],
    },
  ],
}

export default inversions
