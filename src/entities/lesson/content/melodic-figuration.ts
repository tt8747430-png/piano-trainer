import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const G_MINOR = { tonic: note('G'), minor: true }

/** Gorshkov's lesson 5, «Мелодическая фигурация»: a line of the accompaniment's own, on «Опять метель». */
const melodicFiguration: Lesson = {
  id: 'melodic-figuration',
  title: { en: 'Melodic figuration', ru: 'Мелодическая фигурация' },
  summary: {
    en: 'A line of its own inside the accompaniment, answering the melody where it leaves room.',
    ru: 'Самостоятельная линия внутри аккомпанемента, которая отвечает мелодии там, где есть место.',
  },
  sections: [
    {
      heading: { en: 'A line, not a chord', ru: 'Линия, а не аккорд' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Harmonic figuration moves inside one chord. Melodic figuration is a line with a direction, joining several chords.',
            ru: 'Гармоническая фигурация движется внутри одного аккорда. Мелодическая — это линия с направлением, которая связывает несколько аккордов.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          key: G_MINOR,
          notes:
            'B♭4/8 A4/8 B♭4/8 F5/8 B♭4/8 A4/8 B♭4/8 F5/8 E♭4/8 D4/8 E♭4/8 B♭4/8 E♭4/8 D4/8 E♭4/8 B♭4/8 D4/8 C4/8 D4/8 A4/8 D4/8 C4/8 D4/8 A4/8',
        },
        {
          kind: 'steps',
          steps: [
            { en: 'Notes of the chord.', ru: 'Звуки текущего аккорда.' },
            { en: 'Passing and neighbour notes.', ru: 'Проходящие и вспомогательные звуки.' },
            {
              en: 'The next chord’s notes, where it is going.',
              ru: 'Звуки следующего аккорда — точка назначения.',
            },
          ],
        },
      ],
    },
    {
      heading: { en: 'Anchors: the 3rd and the 7th', ru: 'Опорные звуки: терция и септима' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The 3rd and 7th say most about a chord, so a line rests on them. The 5th and 9th help.',
            ru: 'Терция и септима больше всего говорят об аккорде, поэтому на них опирается линия. Помогают квинта и нона.',
          },
        },
        { kind: 'chords', symbols: ['Gm7', 'Cm7', 'D7'] },
        {
          kind: 'note',
          text: {
            en: 'Above, B♭ and F anchor Gm7, a 5th apart. Passing notes lead to the goal.',
            ru: 'Выше си-бемоль и фа — опоры Gm7, на квинту друг от друга. Проходящие звуки ведут к цели.',
          },
        },
      ],
    },
    {
      heading: { en: 'Watch the melody', ru: 'Следите за мелодией' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'It moves a lot: leave room, play the harmony.',
              ru: 'Мелодия активно движется: оставьте место, играйте гармонию.',
            },
            {
              en: 'It stops: answer with a short figure.',
              ru: 'Мелодия остановилась: ответьте короткой фигурой.',
            },
            {
              en: 'It holds a long note: draw a longer line.',
              ru: 'Мелодия держит долгую ноту: проведите длинную линию.',
            },
          ],
        },
        { kind: 'chords', symbols: ['Cm7', 'Dsus4', 'D', 'Gm9', 'Gm/F', 'E♭Maj7'] },
        {
          kind: 'link',
          title: { en: '«Опять метель» in the Player', ru: '«Опять метель» в плеере' },
          target: { opens: 'piece', piece: 'metel' },
        },
        {
          kind: 'note',
          text: {
            en: 'A pause is a chance, not a duty.',
            ru: 'Пауза — возможность, а не обязанность.',
          },
        },
      ],
    },
    {
      heading: { en: 'A run on beats 3 and 4', ru: 'Фигурация на третью и четвёртую доли' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Keep the chord on the strong beats, and lead into the next bar on beats 3 and 4.',
            ru: 'Держите аккорд на сильных долях, а на третьей и четвёртой дайте короткий выход в следующий такт.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          key: G_MINOR,
          notes: 'B♭4/2 A5/8 F5/8 D5/8 B♭4/8',
        },
        { kind: 'pattern', pattern: 'g6', piece: 'metel' },
        {
          kind: 'note',
          text: {
            en: 'Run down a 7th or a 9th chord from its top note.',
            ru: 'Спуститесь по звукам септ- или нонаккорда от верхнего звука.',
          },
        },
      ],
    },
    {
      heading: { en: 'A repeating line', ru: 'Повторяющаяся линия' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'One motif can run through a progression. Over A minor’s i–VI–III–VII, C and G are Am7’s 3rd and 7th, then other degrees of each chord.',
            ru: 'Один мотив может пронизывать всю последовательность. В i–VI–III–VII ля минора до и соль — терция и септима Am7, затем другие ступени каждого аккорда.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: Array.from({ length: 16 }, () => 'C5/16 B4/16 C5/16 G5/16').join(' '),
        },
        { kind: 'chords', symbols: ['Am7', 'FMaj7', 'C', 'G'] },
        {
          kind: 'note',
          text: {
            en: 'It suits pop and worship songs with few chords.',
            ru: 'Такой приём хорошо подходит для поп- и воршип-песен с небольшим числом аккордов.',
          },
        },
      ],
    },
    {
      heading: { en: 'The method', ru: 'Алгоритм' },
      blocks: [
        { kind: 'chords', symbols: ['Cm7', 'Dsus4', 'D7', 'Gm6'] },
        {
          kind: 'steps',
          steps: [
            { en: 'Listen to the melody.', ru: 'Сначала слушайте основную мелодию.' },
            {
              en: 'Find a rest or a long note.',
              ru: 'Найдите паузу, длинную ноту или конец фразы.',
            },
            {
              en: 'Anchor on the 3rd or the 7th.',
              ru: 'Выберите опорный звук: прежде всего 3 или 7.',
            },
            { en: 'Aim the line at a goal.', ru: 'Определите направление и точку назначения.' },
            {
              en: 'Join them with passing notes.',
              ru: 'Соедините опоры проходящими звуками.',
            },
            {
              en: 'Check it answers the melody.',
              ru: 'Проверьте: линия дополняет мелодию или спорит с ней?',
            },
          ],
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play the 3rd and the 7th of Am7.', ru: 'Сыграйте терцию и септиму Am7.' },
          answer: { notes: ['C', 'G'] },
        },
        {
          kind: 'question',
          ask: { en: 'Play Gm9.', ru: 'Сыграйте Gm9.' },
          answer: { chord: 'Gm9' },
        },
        {
          kind: 'link',
          title: { en: 'Chord pulse', ru: 'Аккордовая пульсация' },
          target: { opens: 'lesson', lesson: 'chord-pulse' },
        },
        {
          kind: 'link',
          title: {
            en: 'Called to Play: the art of accompaniment',
            ru: 'Called to Play: искусство аккомпанемента',
          },
          target: { opens: 'lesson', lesson: 'art-of-accompaniment' },
        },
      ],
    },
  ],
}

export default melodicFiguration
