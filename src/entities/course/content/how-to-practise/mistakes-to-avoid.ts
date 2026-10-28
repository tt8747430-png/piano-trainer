import { C_MAJOR, note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const mistakesToAvoid: Lesson = {
  id: 'mistakes-to-avoid',
  after: ['speed-plan'],
  title: { en: 'Mistakes to avoid', ru: 'Ошибки, которых стоит избегать' },
  summary: {
    en: 'The habits that slow most learners down, and what to do instead.',
    ru: 'Привычки, которые тормозят большинство учеников, и что делать вместо них.',
  },
  sections: [
    {
      heading: { en: 'Too fast, too soon', ru: 'Слишком быстро, слишком рано' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Every wrong run teaches the wrong notes. It takes several right ones to undo it. Slow down until it is clean.',
            ru: 'Каждый неверный проигрыш закрепляет ошибку. Чтобы её стереть, нужно несколько верных. Замедлитесь, пока не станет чисто.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G4/2 E4/2 F4/2 D4/2 C4/1' },
      ],
      takeaway: {
        en: 'Practise slowly enough to play it right every time.',
        ru: 'Занимайтесь так медленно, чтобы каждый раз играть верно.',
      },
    },
    {
      heading: { en: 'Always from bar 1', ru: 'Всегда с первого такта' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Starting over each time polishes the opening and leaves the end weak. Start where it is hard.',
            ru: 'Если каждый раз начинать сначала, начало блестит, а конец остаётся слабым. Начинайте там, где трудно.',
          },
        },
        { kind: 'progression', numerals: 'I IV V I', key: C_MAJOR },
      ],
    },
    {
      heading: { en: 'Hands together from the start', ru: 'Сразу двумя руками' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Learn each hand alone first. Join them only when each is easy.',
            ru: 'Сначала выучите каждую руку отдельно. Соединяйте их, только когда каждая идёт легко.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4 D4 E4 F4 G4/1',
          bass: 'C3/2 G2/2 C3/1',
        },
      ],
    },
    {
      heading: { en: 'A different fingering each time', ru: 'Каждый раз другая аппликатура' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Choose a fingering, write it in, and keep it. The hand learns one way faster than many.',
            ru: 'Выберите аппликатуру, впишите её и не меняйте. Рука быстрее запоминает один путь, чем много.',
          },
        },
        { kind: 'scale', root: note('F'), scale: 'major' },
      ],
    },
    {
      heading: { en: 'Tension', ru: 'Зажатость' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Take three slow breaths before you play.',
              ru: 'Сделайте три медленных вдоха перед игрой.',
            },
            { en: 'Let the wrists hang loose.', ru: 'Опустите запястья свободно.' },
            { en: 'Rest 5 minutes after every 25.', ru: 'Отдыхайте 5 минут после каждых 25.' },
            { en: 'Stop at any pain.', ru: 'Остановитесь при любой боли.' },
          ],
        },
        { kind: 'chords', symbols: ['C', 'F', 'G', 'C'], apart: true },
      ],
      takeaway: {
        en: 'A loose hand is faster and safer than a tight one.',
        ru: 'Свободная рука быстрее и безопаснее зажатой.',
      },
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the F major scale up with one fingering, the same each time.',
            ru: 'Сыграйте гамму фа мажор вверх одной и той же аппликатурой.',
          },
          answer: { notes: ['F', 'G', 'A', 'B♭', 'C', 'D', 'E', 'F'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'The F major scale in the Player', ru: 'Гамма фа мажор в плеере' },
          target: { opens: 'exercise', exercise: 'scale', root: note('F'), kind: 'major' },
        },
      ],
    },
  ],
}

export default mistakesToAvoid
