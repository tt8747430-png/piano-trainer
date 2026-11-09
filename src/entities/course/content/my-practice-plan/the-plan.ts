import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const F_MAJOR = { tonic: note('F'), minor: false }

/** My Practice Plan, lesson 1: the day, the week, the tempo ladder and one focus at a time. */
const thePlan: Lesson = {
  id: 'the-plan',
  title: { en: 'How the plan works', ru: 'Как устроен план' },
  summary: {
    en: 'Forty minutes a day in five parts, one key a week round the circle, slow first and then the metronome ladder.',
    ru: 'Сорок минут в день в пяти частях, одна тональность в неделю по кругу, сначала медленно, потом лестница темпов.',
  },
  sections: [
    {
      heading: { en: 'Forty minutes in five parts', ru: 'Сорок минут в пяти частях' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Warm up, 5 minutes: the week’s scale and chords.',
              ru: 'Разминка, 5 минут: гамма и аккорды недели.',
            },
            { en: 'Chords and voicings, 10 minutes.', ru: 'Аккорды и расположения, 10 минут.' },
            { en: 'Rhythm and left hand, 10 minutes.', ru: 'Ритм и левая рука, 10 минут.' },
            {
              en: 'A song, 10 minutes, with what you learned.',
              ru: 'Песня, 10 минут, с тем, что вы выучили.',
            },
            { en: 'Ear and improvising, 5 minutes.', ru: 'Слух и импровизация, 5 минут.' },
          ],
        },
        { kind: 'scale', root: note('C'), scale: 'major' },
      ],
      takeaway: {
        en: 'Forty minutes every day beats three hours once a week.',
        ru: 'Сорок минут каждый день лучше трёх часов раз в неделю.',
      },
    },
    {
      heading: { en: 'One key a week', ru: 'Одна тональность в неделю' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The circle of fourths', ru: 'Квартовый круг' },
          text: {
            en: 'orders the keys so each changes one note: C, F, B♭, E♭, A♭, D♭, G♭, B, E, A, D, G. Play every drill of the week in its key.',
            ru: 'выстраивает тональности так, что каждая меняет один звук: до, фа, си♭, ми♭, ля♭, ре♭, соль♭, си, ми, ля, ре, соль. Все упражнения недели играйте в её тональности.',
          },
        },
        { kind: 'progression', numerals: 'I IV V I', key: F_MAJOR },
      ],
      takeaway: {
        en: 'A pattern you know in one key is only a twelfth learned.',
        ru: 'Оборот, выученный в одной тональности, выучен лишь на двенадцатую часть.',
      },
    },
    {
      heading: { en: 'Slow first, then the ladder', ru: 'Сначала медленно, потом лестница' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play each drill at 60 until it is clean three times running. Then climb: 90, 120, 150. When a mistake comes back, step down again.',
            ru: 'Играйте каждое упражнение на 60, пока оно трижды подряд не выйдет чисто. Затем вверх: 90, 120, 150. Ошибка вернулась — спуститесь на ступень.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4/8 D4/8 E4/8 F4/8 G4/8 A4/8 B4/8 C5/8 B4/8 A4/8 G4/8 F4/8 E4/8 D4/8 C4/4',
        },
      ],
      takeaway: {
        en: 'Never practise a mistake: slow down until it is gone.',
        ru: 'Не повторяйте ошибку: замедлитесь, пока она не уйдёт.',
      },
    },
    {
      heading: { en: 'One focus at a time', ru: 'Одна цель за раз' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Each session, pick one thing: the evenness, the left hand, the sound. Change one thing at a time. Record yourself once a week and listen back.',
            ru: 'В каждом занятии выберите одно: ровность, левую руку, звук. Меняйте что-то одно. Раз в неделю запишите себя и послушайте.',
          },
        },
        { kind: 'chords', symbols: ['C', 'F', 'G', 'C'] },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Week 2 is F major: play its scale up one octave.',
            ru: 'Вторая неделя — фа мажор: сыграйте его гамму на октаву вверх.',
          },
          answer: { notes: ['F', 'G', 'A', 'B♭', 'C', 'D', 'E', 'F'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'The scale routine in F', ru: 'Работа над гаммой фа мажор' },
          target: { opens: 'exercise', exercise: 'scale-routine', root: note('F') },
        },
      ],
    },
  ],
}

export default thePlan
