import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const C_MAJOR = { tonic: note('C'), minor: false }
const LOOP = 'I vi IV V'

/** Improvising with Chords, lesson 4: a melody made up over I–vi–IV–V. */
const practisingImprovisation: Lesson = {
  id: 'practising-improvisation',
  title: { en: 'Practising improvisation', ru: 'Учимся импровизировать' },
  summary: {
    en: 'Loop four chords, take five safe notes, land on the chord, ask and answer: a way to make up a melody from the first minute.',
    ru: 'Зациклите четыре аккорда, возьмите пять надёжных звуков, опирайтесь на аккорд, спрашивайте и отвечайте: так мелодия рождается с первой минуты.',
  },
  sections: [
    {
      heading: { en: 'The loop', ru: 'Гармонический круг' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Improvising starts with a loop. Play C, Am, F, G with the left hand, a bar each, until it plays itself.',
            ru: 'Импровизация начинается с повторяющейся гармонии. Играйте C, Am, F, G левой рукой, по такту на аккорд, пока рука не запомнит.',
          },
        },
        { kind: 'progression', numerals: LOOP, key: C_MAJOR },
        {
          kind: 'link',
          title: { en: 'The loop on Progressions', ru: 'Этот круг в разделе «Прогрессии»' },
          target: { opens: 'progressions', numerals: LOOP, key: C_MAJOR },
        },
      ],
    },
    {
      heading: { en: 'Five safe notes', ru: 'Пять надёжных звуков' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Pentatonic:', ru: 'Пентатоника:' },
          text: {
            en: 'a five-note scale with no semitones. C major pentatonic, C D E G A, sits well over every chord of the loop.',
            ru: 'гамма из пяти звуков без полутонов. Мажорная пентатоника от до, до-ре-ми-соль-ля, хорошо звучит над каждым аккордом круга.',
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
            en: 'a note of the chord sounding now. End each bar on one and the line sounds sure of itself.',
            ru: 'звук аккорда, который звучит сейчас. Заканчивайте каждый такт на нём, и линия звучит уверенно.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G4 A4 G4 E4 D4 E4 C4/2 C4 D4 A4/2 G4 E4 D4/2' },
        { kind: 'chords', symbols: ['C', 'Am', 'F', 'G'], apart: true },
      ],
    },
    {
      heading: { en: 'Call and response', ru: 'Вопрос и ответ' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Call and response:', ru: 'Вопрос и ответ:' },
          text: {
            en: 'a short phrase, then a phrase that answers it. The call climbs, the answer comes back down to rest.',
            ru: 'короткая фраза и фраза, которая на неё отвечает. Вопрос поднимается, ответ возвращается вниз и успокаивается.',
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
            en: 'One rhythm in every bar, new notes each time. The repeat holds the line together. The long notes are chord tones.',
            ru: 'Один и тот же ритм в каждом такте, а звуки каждый раз новые. Повтор связывает линию. Долгие звуки — аккордовые.',
          },
        },
      ],
    },
    {
      heading: { en: 'Over the loop in the Player', ru: 'Над кругом в плеере' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Let the Player keep the loop. Improvise with the right hand, two bars of call and two of answer.',
            ru: 'Пусть плеер держит гармонию. Импровизируйте правой рукой: два такта вопроса и два такта ответа.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Am', 'F', 'G', 'C', 'Am', 'F', 'G'] },
        {
          kind: 'link',
          title: { en: 'I–vi–IV–V in the Player', ru: 'I–vi–IV–V в плеере' },
          target: { opens: 'player', numerals: LOOP, key: C_MAJOR },
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
            en: 'Play the three notes of the loop’s V chord upwards.',
            ru: 'Сыграйте вверх три звука аккорда V ступени из круга.',
          },
          answer: { notes: ['G', 'B', 'D'], rising: true },
        },
        {
          kind: 'link',
          title: {
            en: 'C major pentatonic in Scales',
            ru: 'Пентатоника до мажор в разделе «Гаммы»',
          },
          target: { opens: 'scales', root: note('C'), scale: 'pent' },
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
        {
          kind: 'link',
          title: {
            en: 'Improvise over Michael, Row the Boat',
            ru: 'Импровизация над «Michael, Row the Boat»',
          },
          target: { opens: 'piece', piece: 'michael-row' },
        },
      ],
    },
  ],
}

export default practisingImprovisation
