import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const dailyPlan: Lesson = {
  id: 'daily-plan',
  title: { en: 'A daily plan', ru: 'План на каждый день' },
  summary: {
    en: 'Split half an hour into five parts, and work a hard passage in five steps.',
    ru: 'Разделить полчаса на пять частей и разучивать трудное место в пять шагов.',
  },
  sections: [
    {
      heading: { en: 'Thirty minutes in five parts', ru: 'Тридцать минут в пяти частях' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            { en: 'Warm up: 5 minutes, a slow scale.', ru: 'Разминка: 5 минут, медленная гамма.' },
            {
              en: 'Technique: 5 minutes, five-finger patterns.',
              ru: 'Техника: 5 минут, позиция пяти пальцев.',
            },
            { en: 'Reading: 5 minutes, something new.', ru: 'Чтение: 5 минут, что-то новое.' },
            {
              en: 'Pieces: 10 minutes, the hardest bars first.',
              ru: 'Пьесы: 10 минут, сначала самые трудные такты.',
            },
            { en: 'Play: 5 minutes, just for fun.', ru: 'Игра: 5 минут, для удовольствия.' },
          ],
        },
        { kind: 'scale', root: note('C'), scale: 'major' },
      ],
      takeaway: {
        en: 'A short plan every day beats a long session once a week.',
        ru: 'Короткий план каждый день лучше долгого занятия раз в неделю.',
      },
    },
    {
      heading: { en: 'A longer day: fifty minutes', ru: 'День подлиннее: пятьдесят минут' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Warm up 5: today’s key, scale and arpeggio.',
              ru: 'Разминка 5: тональность дня, гамма и арпеджио.',
            },
            { en: 'Technique 10.', ru: 'Техника 10.' },
            {
              en: 'Reading 5, two levels below your pieces.',
              ru: 'Чтение 5, на два уровня проще пьес.',
            },
            { en: 'Section work 15.', ru: 'Работа по фрагментам 15.' },
            { en: 'A run-through 10, without stopping.', ru: 'Проигрывание 10, без остановок.' },
            { en: 'Theory or ear 5.', ru: 'Теория или слух 5.' },
          ],
        },
        { kind: 'scale', root: note('G'), scale: 'major' },
      ],
    },
    {
      heading: { en: 'Section work in five steps', ru: 'Работа по фрагментам в пять шагов' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Find the smallest problem: 2 to 4 bars.',
              ru: 'Найдите самое трудное место: 2–4 такта.',
            },
            {
              en: 'Hands separately, at half tempo.',
              ru: 'Отдельными руками, в половинном темпе.',
            },
            {
              en: 'Hands together, still at half tempo.',
              ru: 'Двумя руками, всё ещё в половинном темпе.',
            },
            { en: 'Add the bar before and after.', ru: 'Добавьте такт до и после.' },
            {
              en: 'Play a longer section without stopping.',
              ru: 'Сыграйте больший кусок без остановок.',
            },
          ],
        },
        { kind: 'notes', clef: 'treble', notes: 'E4 D4 C4 D4 E4 E4 E4/2' },
      ],
      takeaway: {
        en: 'Spend most of your time on the hardest few bars.',
        ru: 'Больше всего времени отдавайте нескольким самым трудным тактам.',
      },
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Warm up: play the C major scale up one octave, slowly.',
            ru: 'Разминка: сыграйте гамму до мажор на октаву вверх, медленно.',
          },
          answer: { notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'Five-finger patterns in the Player', ru: 'Позиция пяти пальцев в плеере' },
          target: { opens: 'exercise', exercise: 'five-finger', root: note('C') },
        },
      ],
    },
  ],
}

export default dailyPlan
