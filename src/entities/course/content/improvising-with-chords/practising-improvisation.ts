import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const C_MAJOR = { tonic: note('C'), minor: false }
const LOOP = 'I vi IV V'

/** Improvising with Chords, lesson 4: a melody made up over I–vi–IV–V. */
const practisingImprovisation: Lesson = {
  id: 'practising-improvisation',
  title: { en: 'Practising improvisation', ru: 'Учимся импровизировать' },
  summary: {
    en: 'Make up a melody over a four-chord loop.',
    ru: 'Сочиняйте мелодию над кругом из четырёх аккордов.',
  },
  sections: [
    {
      heading: { en: 'The loop', ru: 'Гармонический круг' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play C, Am, F, G with the left hand, a bar each, until it plays itself.',
            ru: 'Играйте C, Am, F, G левой рукой, по такту на аккорд, пока рука не запомнит.',
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
          lead: { en: 'Pentatonic:', ru: 'Пентатоника:' },
          text: {
            en: 'a five-note scale with no semitones. C major pentatonic sounds good over every chord of the loop.',
            ru: 'гамма из пяти звуков без полутонов. Мажорная пентатоника от до хорошо звучит над каждым аккордом круга.',
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
          lead: { en: 'Chord tone:', ru: 'Аккордовый звук:' },
          text: {
            en: 'a note of the chord sounding now. End each bar on one and the line sounds sure.',
            ru: 'звук аккорда, который звучит сейчас. Заканчивайте каждый такт на нём, и линия звучит уверенно.',
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
          lead: { en: 'Call and response:', ru: 'Вопрос и ответ:' },
          text: {
            en: 'a short phrase, then one that answers it. The call climbs, the answer comes back down.',
            ru: 'короткая фраза и фраза, которая на неё отвечает. Вопрос поднимается, ответ возвращается вниз.',
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
            en: 'One rhythm in every bar, new notes each time. The repeat holds the line together.',
            ru: 'Один ритм в каждом такте, а звуки каждый раз новые. Повтор связывает линию.',
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
