import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const inversions: Lesson = {
  id: 'inversions',
  title: { en: 'Inversions', ru: 'Обращения' },
  summary: {
    en: 'Put any note of a chord lowest and change chords smoothly.',
    ru: 'Ставить внизу любую ноту аккорда и плавно менять аккорды.',
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
            en: 'puts another chord note lowest. Move C up an octave and the 3rd is lowest: C/E.',
            ru: '— тот же аккорд с другой нотой внизу. Перенесите до на октаву вверх, и внизу окажется терция: C/E.',
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
            en: 'Move the 3rd up an octave too. Now the 5th is lowest: C/G.',
            ru: 'Перенесите вверх и терцию. Теперь внизу квинта: C/G.',
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
            en: 'Inversions let the hand change chords while barely moving. Keep the shared note and move the others by step.',
            ru: 'Обращения позволяют менять аккорды, почти не сдвигая руку. Общую ноту оставьте, остальные сдвиньте на шаг.',
          },
        },
        { kind: 'chords', symbols: ['C', 'F/C', 'G/B', 'C'] },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play F major in any inversion.',
            ru: 'Сыграйте фа мажор в любом обращении.',
          },
          answer: { chord: 'F' },
        },
        {
          kind: 'link',
          title: { en: 'Climb C through its inversions', ru: 'До мажор по обращениям' },
          target: { opens: 'exercise', exercise: 'inversions', root: note('C'), quality: 'maj' },
        },
        {
          kind: 'link',
          title: { en: 'Name chords in the Quiz', ru: 'Названия аккордов в тестах' },
          target: { opens: 'quiz', trainer: 'name-chord' },
        },
      ],
    },
  ],
}

export default inversions
