import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const G_MINOR = { tonic: note('G'), minor: true }

/** Gorshkov's lesson 5, «Мелодическая фигурация»: a line of the accompaniment's own, on «Опять метель». */
const melodicFiguration: Lesson = {
  id: 'melodic-figuration',
  title: { en: 'Melodic figuration', ru: 'Мелодическая фигурация' },
  summary: {
    en: 'Weave a line into the accompaniment that moves through the chords and answers the melody.',
    ru: 'Вести в аккомпанементе линию, которая проходит через аккорды и отвечает мелодии.',
  },
  sections: [
    {
      heading: { en: 'A line through the chords', ru: 'Линия через аккорды' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Melodic figuration', ru: 'Мелодическая фигурация' },
          text: {
            en: 'is a line that moves through several chords, where harmonic figuration stays inside one. Its notes:',
            ru: '— линия, которая проходит через несколько аккордов, тогда как гармоническая остаётся внутри одного. Её звуки:',
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
            { en: 'The chord’s own notes.', ru: 'Звуки текущего аккорда.' },
            { en: 'Passing and neighbour notes.', ru: 'Проходящие и вспомогательные звуки.' },
            {
              en: 'The next chord’s notes, where the line is going.',
              ru: 'Звуки следующего аккорда, к которым идёт линия.',
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
            en: 'The 3rd and 7th say the most about a chord, so the line rests on them. The 5th and 9th help.',
            ru: 'Терция и септима больше всего говорят об аккорде, поэтому на них опирается линия. Помогают квинта и нона.',
          },
        },
        { kind: 'chords', symbols: ['Gm7', 'Cm7', 'D7'] },
        {
          kind: 'note',
          text: {
            en: 'In the line above, B♭ and F, Gm7’s 3rd and 7th, are the anchors.',
            ru: 'В линии выше опоры — си-бемоль и фа, терция и септима Gm7.',
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
              en: 'If the melody is busy, play the harmony.',
              ru: 'Мелодия активно движется: оставьте ей место и играйте гармонию.',
            },
            {
              en: 'If it stops, answer with a short figure.',
              ru: 'Мелодия остановилась: ответьте короткой фигурой.',
            },
            {
              en: 'If it holds a long note, draw a longer line.',
              ru: 'Мелодия держит долгую ноту: проведите длинную линию.',
            },
          ],
        },
        { kind: 'chords', symbols: ['Cm7', 'Dsus4', 'D', 'Gm9', 'Gm/F', 'E♭Maj7'] },
        {
          kind: 'link',
          title: { en: '“Опять метель” in the Player', ru: '«Опять метель» в плеере' },
          target: { opens: 'piece', piece: 'metel' },
        },
        {
          kind: 'note',
          text: {
            en: 'A pause allows a figure but never demands one.',
            ru: 'Пауза позволяет вставить фигуру, но не требует её.',
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
            en: 'Hold the chord through beats 1 and 2. On beats 3 and 4, run into the next bar.',
            ru: 'Держите аккорд на первой и второй долях. На третьей и четвёртой сделайте короткий пробег в следующий такт.',
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
            en: 'Run down the notes of a 7th or 9th chord from its top note.',
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
            en: 'One motif can repeat over a whole progression. In A minor’s i VI III VII, C and G start as Am7’s 3rd and 7th.',
            ru: 'Один мотив может повторяться на всей последовательности. В i–VI–III–VII ля минора до и соль сначала терция и септима Am7.',
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
              ru: 'Выберите опорный звук: прежде всего терцию или септиму.',
            },
            { en: 'Aim the line at a goal.', ru: 'Определите направление и точку назначения.' },
            {
              en: 'Join the anchors with passing notes.',
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
      ],
    },
  ],
}

export default melodicFiguration
