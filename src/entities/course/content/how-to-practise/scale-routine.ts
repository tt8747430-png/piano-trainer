import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const scaleRoutine: Lesson = {
  id: 'scale-routine',
  after: ['daily-plan'],
  title: { en: 'Fifteen minutes of scales', ru: 'Пятнадцать минут гамм' },
  summary: {
    en: 'One key a session: warm up, climb a tempo ladder, join the hands, then vary the touch.',
    ru: 'Одна тональность за занятие: разминка, лестница темпов, две руки вместе, затем разные штрихи.',
  },
  sections: [
    {
      heading: { en: 'Minutes 0 to 2: warm up', ru: 'Минуты 0–2: разминка' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Hands separately, two octaves, at 60 beats a minute. Listen for even notes.',
            ru: 'Отдельными руками, две октавы, 60 ударов в минуту. Слушайте, ровны ли звуки.',
          },
        },
        { kind: 'scale', root: note('D'), scale: 'major' },
      ],
    },
    {
      heading: { en: 'Minutes 2 to 6: the tempo ladder', ru: 'Минуты 2–6: лестница темпов' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A tempo ladder', ru: 'Лестница темпов' },
          text: {
            en: 'climbs 60, 72, 84, 96, 108. Play four clean runs on a rung before the next. A slip sends you down one.',
            ru: '— это шаги 60, 72, 84, 96, 108. Четыре чистых проигрыша на ступени, затем следующая. Ошибка — на ступень ниже.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          key: { tonic: note('D'), minor: false },
          notes: 'D4/8 E4/8 F#4/8 G4/8 A4/8 B4/8 C#5/8 D5/8',
        },
      ],
      takeaway: {
        en: 'Earn each new tempo with four clean runs.',
        ru: 'Каждый новый темп нужно заслужить четырьмя чистыми проигрышами.',
      },
    },
    {
      heading: { en: 'Minutes 6 to 11: hands together', ru: 'Минуты 6–11: двумя руками' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Start about a third slower than your hands-separate tempo. Drill the moments where the thumbs pass, four notes at a time.',
            ru: 'Начните примерно на треть медленнее, чем отдельными руками. Отработайте места подкладывания большого пальца, по четыре ноты.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          key: { tonic: note('D'), minor: false },
          notes: 'D4 E4 F#4 G4 A4 B4 C#5 D5',
          bass: 'D3 E3 F#3 G3 A3 B3 C#4 D4',
        },
      ],
    },
    {
      heading: { en: 'Minutes 11 to 15: vary it', ru: 'Минуты 11–15: варианты' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            { en: 'Legato, then staccato.', ru: 'Легато, затем стаккато.' },
            { en: 'Forte, then pianissimo.', ru: 'Форте, затем пианиссимо.' },
            {
              en: 'Crescendo going up, diminuendo coming down.',
              ru: 'Крещендо вверх, диминуэндо вниз.',
            },
            {
              en: 'Last minute: improvise on the scale.',
              ru: 'Последняя минута: импровизация на гамме.',
            },
          ],
        },
        {
          kind: 'notes',
          clef: 'treble',
          key: { tonic: note('D'), minor: false },
          notes: 'D4/8. E4/16 F#4/8. G4/16 A4/8. B4/16 C#5/8. D5/16',
        },
      ],
      takeaway: {
        en: 'Change the touch, not only the speed. Play down as well as up.',
        ru: 'Меняйте штрих, а не только скорость. Играйте и вниз, и вверх.',
      },
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the D major scale up one octave.',
            ru: 'Сыграйте гамму ре мажор на октаву вверх.',
          },
          answer: { notes: ['D', 'E', 'F♯', 'G', 'A', 'B', 'C♯', 'D'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'The D major scale in the Player', ru: 'Гамма ре мажор в плеере' },
          target: { opens: 'exercise', exercise: 'scale', root: note('D'), kind: 'major' },
        },
      ],
    },
  ],
}

export default scaleRoutine
