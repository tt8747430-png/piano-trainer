import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const inversions: Lesson = {
  id: 'inversions',
  title: { en: 'Inversions', ru: 'Обращения' },
  summary: {
    en: 'Play a chord with any of its notes at the bottom, and use that to move between chords smoothly.',
    ru: 'Играйте аккорд с любой его нотой внизу и плавно переходите так от аккорда к аккорду.',
  },
  sections: [
    {
      heading: { en: 'Root position', ru: 'Основной вид' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Root position', ru: 'Основной вид' },
          text: {
            en: 'means the chord’s root is its lowest note. C major in root position is C E G, from the bottom up.',
            ru: '— это когда основной тон звучит ниже всех. До мажор в основном виде снизу вверх: до, ми, соль.',
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
            en: 'is the same chord with another of its notes at the bottom. Move C up an octave to get E G C. Now the 3rd is lowest, written C/E.',
            ru: '— тот же аккорд с другой своей нотой внизу. Перенесите до на октаву вверх: ми, соль, до. Теперь внизу терция, это пишут C/E.',
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
            en: 'Now move E up an octave too, to get G C E. The 5th is lowest, written C/G.',
            ru: 'Теперь перенесите на октаву вверх и ми: соль, до, ми. Внизу квинта, это пишут C/G.',
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
            en: 'With inversions your hand barely moves between chords. Keep any note the two chords share. Move the other notes to the nearest notes of the next chord.',
            ru: 'С обращениями рука почти не сдвигается между аккордами. Общую ноту двух аккордов оставьте. Остальные переставьте на ближайшие ноты следующего аккорда.',
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
