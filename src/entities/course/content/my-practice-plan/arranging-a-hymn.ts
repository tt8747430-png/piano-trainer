import { C_MAJOR, note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const F_MAJOR = { tonic: note('F'), minor: false }

/** My Practice Plan, lesson 8: a hymn arranged in five steps, and playing under singers. */
const arrangingAHymn: Lesson = {
  id: 'arranging-a-hymn',
  title: { en: 'Arranging a hymn in five steps', ru: 'Обработка гимна в пять шагов' },
  summary: {
    en: 'Build a hymn up step by step: melody over chords, a left-hand pattern, fills, passing chords, then dynamics and room for the singers.',
    ru: 'Постройте гимн шаг за шагом: мелодия над аккордами, фигура левой руки, заполнения, проходящие аккорды, затем динамика и место для певцов.',
  },
  after: ['passing-chords'],
  sections: [
    {
      heading: { en: 'Step 1: melody over chords', ru: 'Шаг 1: мелодия над аккордами' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play the melody on top in the right hand. The left hand holds each chord’s root. Get this clean before adding anything.',
            ru: 'Мелодия наверху в правой руке. Левая держит бас каждого аккорда. Добейтесь чистоты, прежде чем что-то добавлять.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'E4 E4 F4 G4 G4 F4 E4 D4',
          bass: 'C3/1 G2/1',
        },
      ],
    },
    {
      heading: { en: 'Step 2: a left-hand pattern', ru: 'Шаг 2: фигура левой руки' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Swap the held root for a pattern from the left hand’s ladder. Here it is 1, 5, 8 in eighths.',
            ru: 'Замените выдержанный бас фигурой с лестницы левой руки. Здесь это 1, 5, 8 восьмыми.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'E4 E4 F4 G4 G4 F4 E4 D4',
          bass: 'C3/8 G3/8 C4/8 G3/8 C3/8 G3/8 C4/8 G3/8 G2/8 D3/8 G3/8 D3/8 G2/8 D3/8 G3/8 D3/8',
        },
      ],
    },
    {
      heading: { en: 'Step 3: fills', ru: 'Шаг 3: заполнения' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A fill', ru: 'Заполнение' },
          text: {
            en: 'plays in the gap where the melody holds or rests. Land it on a note of the next chord.',
            ru: 'звучит там, где мелодия тянет звук или молчит. Приводите его к звуку следующего аккорда.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'G4/2 r/8 C5/8 B4/8 A4/8 G4/1',
          bass: 'C3/1 C3/1',
        },
      ],
    },
    {
      heading: { en: 'Step 4: a passing chord', ru: 'Шаг 4: проходящий аккорд' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Add one passing chord where the melody holds a long note. A secondary dominant before IV is the safest start.',
            ru: 'Добавьте один проходящий аккорд там, где мелодия тянет долгий звук. Побочная доминанта перед IV — самое надёжное начало.',
          },
        },
        { kind: 'chords', symbols: ['C', 'C7', 'F'] },
      ],
    },
    {
      heading: { en: 'Step 5: dynamics and singers', ru: 'Шаг 5: динамика и певцы' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play the first verse soft and simple and the last one full. Under singers, play softly and keep out of their range.',
            ru: 'Первый куплет тихо и просто, последний — полно. Под певцами играйте мягко и не заходите в их диапазон.',
          },
        },
        { kind: 'progression', numerals: 'I IV I V', key: F_MAJOR },
      ],
      takeaway: {
        en: 'A hymn grows verse by verse. Save the fullest sound for the end.',
        ru: 'Гимн растёт от куплета к куплету. Самое полное звучание — к концу.',
      },
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'The tune starts on E in C major. Play the chord I under it.',
            ru: 'Мелодия начинается с ми в до мажоре. Сыграйте под ней аккорд I.',
          },
          answer: { chord: 'C' },
        },
        {
          kind: 'link',
          title: { en: 'Harmonise E in C major', ru: 'Гармонизовать ми в до мажоре' },
          target: { opens: 'harmonise', key: C_MAJOR, note: note('E') },
        },
        {
          kind: 'link',
          title: { en: 'I – IV – I – V in the Player', ru: 'I – IV – I – V в плеере' },
          target: { opens: 'player', numerals: 'I IV I V', key: F_MAJOR },
        },
      ],
    },
  ],
}

export default arrangingAHymn
