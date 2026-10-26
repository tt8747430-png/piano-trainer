import { C_MAJOR, note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const LOOP = 'I vi IV V'

/** Improvising with Chords, lesson 4: a melody made up over I–vi–IV–V. */
const practisingImprovisation: Lesson = {
  id: 'practising-improvisation',
  title: { en: 'Practising improvisation', ru: 'Учимся импровизировать' },
  summary: {
    en: 'Make up your own melody over a loop of four chords, using five safe notes and a few simple rules.',
    ru: 'Сочиняйте свою мелодию над кругом из четырёх аккордов: пять надёжных звуков и несколько простых правил.',
  },
  sections: [
    {
      heading: { en: 'Learn the loop', ru: 'Выучите круг' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A loop', ru: 'Гармонический круг' },
          text: {
            en: 'is a short row of chords played over and over. Play C, Am, F and G with the left hand, one bar each, until you no longer think about it.',
            ru: '— короткий ряд аккордов, который повторяется снова и снова. Играйте C, Am, F и G левой рукой, по такту на аккорд, пока рука не запомнит.',
          },
        },
        { kind: 'progression', numerals: LOOP, key: C_MAJOR },
      ],
    },
    {
      heading: { en: 'Five safe notes', ru: 'Пять надёжных звуков' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A pentatonic scale', ru: 'Пентатоника' },
          text: {
            en: 'has five notes and no semitones between them. C major pentatonic is C, D, E, G and A. Any of them sounds good over every chord of the loop.',
            ru: '— гамма из пяти звуков без полутонов между ними. Мажорная пентатоника от до: до, ре, ми, соль и ля. Любой из них хорошо звучит над каждым аккордом круга.',
          },
        },
        { kind: 'scale', root: note('C'), scale: 'pent' },
      ],
    },
    {
      heading: { en: 'Land on the chord', ru: 'Опора на аккорд' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A chord tone', ru: 'Аккордовый звук' },
          text: {
            en: 'is a note of the chord sounding right now. End each bar on one, and your melody will sound sure of itself.',
            ru: '— звук аккорда, который звучит в эту секунду. Заканчивайте каждый такт на таком звуке, и мелодия зазвучит уверенно.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G4 A4 G4 E4 D4 E4 C4/2 C4 D4 A4/2 G4 E4 D4/2' },
      ],
    },
    {
      heading: { en: 'Call and response', ru: 'Вопрос и ответ' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Call and response', ru: 'Вопрос и ответ' },
          text: {
            en: 'pairs a short phrase with a second one that answers it. Here the call climbs and the answer comes back down.',
            ru: '— короткая фраза и вторая, которая на неё отвечает. Здесь вопрос поднимается, а ответ возвращается вниз.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 G4 A4/2 G4/2 A4 G4 E4 D4 E4 D4/2.' },
      ],
    },
    {
      heading: { en: 'Keep the rhythm, change the notes', ru: 'Ритм прежний, звуки новые' },
      blocks: [
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'E4/8 G4/8 A4 G4/2 C5/8 A4/8 G4 E4/2 A4/8 G4/8 E4 C4/2 G4/8 A4/8 G4 D4/2',
        },
        {
          kind: 'text',
          text: {
            en: 'Every bar here has the same rhythm with new notes. Repeating a rhythm holds a melody together, so you can change the notes freely.',
            ru: 'Здесь в каждом такте один и тот же ритм, а звуки новые. Повтор ритма связывает мелодию, поэтому звуки можно менять свободно.',
          },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play C major pentatonic up from C.',
            ru: 'Сыграйте мажорную пентатонику от до вверх.',
          },
          answer: { notes: ['C', 'D', 'E', 'G', 'A'], rising: true },
        },
        {
          kind: 'question',
          ask: { en: 'Play the loop’s vi chord.', ru: 'Сыграйте аккорд VI ступени из круга.' },
          answer: { chord: 'Am' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the loop’s V chord upwards, note by note.',
            ru: 'Сыграйте аккорд V ступени из круга вверх, по звуку.',
          },
          answer: { notes: ['G', 'B', 'D'], rising: true },
        },
        {
          kind: 'link',
          title: {
            en: 'Improvise over I–vi–IV–V in the Player',
            ru: 'Импровизация над I–vi–IV–V в плеере',
          },
          target: { opens: 'player', numerals: LOOP, key: C_MAJOR },
        },
        {
          kind: 'link',
          title: { en: 'Improvise over Kumbaya', ru: 'Импровизация над «Кумбаей»' },
          target: { opens: 'piece', piece: 'kumbaya' },
        },
        {
          kind: 'link',
          title: { en: 'Improvise over Swing Low', ru: 'Импровизация над «Swing Low»' },
          target: { opens: 'piece', piece: 'swing-low' },
        },
      ],
    },
  ],
}

export default practisingImprovisation
