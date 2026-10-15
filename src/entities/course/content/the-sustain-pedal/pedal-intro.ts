import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const C_MAJOR = { tonic: note('C'), minor: false }

const pedalIntro: Lesson = {
  id: 'pedal-intro',
  title: { en: 'Introduction to the sustain pedal', ru: 'Знакомство с правой педалью' },
  summary: {
    en: 'What the right pedal does to the strings, how the foot presses it, and how a score asks for it.',
    ru: 'Что правая педаль делает со струнами, как на неё нажимать и как её обозначают в нотах.',
  },
  sections: [
    {
      heading: { en: 'The pedal holds the sound', ru: 'Педаль продлевает звук' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The sustain pedal', ru: 'Правая педаль' },
          text: {
            en: 'is the rightmost pedal. Hold it down and notes keep ringing after the keys come up.',
            ru: '— крайняя правая. Пока она нажата, звуки тянутся и после того, как клавиши отпущены.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3 E3 G3 C4' },
        {
          kind: 'note',
          text: {
            en: 'Play it without, then with the pedal. With it, the notes join into a chord.',
            ru: 'Сыграйте без педали, затем с педалью. С ней звуки сливаются в аккорд.',
          },
        },
      ],
    },
    {
      heading: { en: 'Dampers', ru: 'Демпферы' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A damper', ru: 'Демпфер' },
          text: {
            en: 'is a felt pad on a string. Letting go of a key drops it and stops the note. The pedal lifts every damper at once.',
            ru: '— войлочная подушечка на струне. Отпущенная клавиша опускает её, и звук гаснет. Педаль поднимает все демпферы сразу.',
          },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the C chord and let go without the pedal. The sound stops at once.',
            ru: 'Сыграйте аккорд C и отпустите без педали. Звук сразу гаснет.',
          },
          answer: { chord: 'C' },
        },
      ],
    },
    {
      heading: { en: 'A fuller sound', ru: 'Более полный звук' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'With the dampers up, untouched strings ring in sympathy. Even one low note sounds rounder and longer.',
            ru: 'Когда демпферы подняты, незадетые струны звучат в резонанс. Даже одна низкая нота звучит круглее и дольше.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C2/1' },
      ],
    },
    {
      heading: { en: 'Heel down, ball of the foot', ru: 'Пятка на полу, нажим подушечкой' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Heel on the floor, in line with the pedal.',
              ru: 'Пятка стоит на полу напротив педали.',
            },
            {
              en: 'Press with the ball of the foot.',
              ru: 'Нажимайте подушечкой стопы.',
            },
            {
              en: 'Go all the way down and up, without a knock.',
              ru: 'Нажимайте и отпускайте до конца, без стука.',
            },
          ],
        },
        {
          kind: 'question',
          ask: {
            en: 'Press the pedal, play the F chord, then lift the hand. Let it ring.',
            ru: 'Нажмите педаль, сыграйте аккорд F и снимите руку. Пусть звучит.',
          },
          answer: { chord: 'F' },
        },
      ],
    },
    {
      heading: { en: 'Pedal in a score', ru: 'Педаль в нотах' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Ped.', ru: 'Ped.' },
          text: {
            en: 'under the bass staff means press. A star, or the end of a bracket line, means lift.',
            ru: 'под басовым станом означает «нажать». Звёздочка или конец скобки означает «снять».',
          },
        },
        { kind: 'chords', symbols: ['C', 'G'] },
        {
          kind: 'note',
          text: {
            en: 'Many songs give no marks at all. The player pedals by ear.',
            ru: 'Во многих песнях знаков педали нет совсем. Пианист педализирует на слух.',
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
            en: 'Hold the pedal and play C, E and G one at a time, low to high.',
            ru: 'Держа педаль, сыграйте по одной до, ми и соль снизу вверх.',
          },
          answer: { notes: ['C', 'E', 'G'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the G chord under the pedal, then lift the hand.',
            ru: 'Сыграйте аккорд G на педали и снимите руку.',
          },
          answer: { chord: 'G' },
        },
        {
          kind: 'link',
          title: { en: 'Brahms’ Lullaby in the Player', ru: '«Колыбельная» Брамса в плеере' },
          target: { opens: 'piece', piece: 'brahms-lullaby' },
        },
        {
          kind: 'link',
          title: { en: 'I IV V I in the Player', ru: 'I IV V I в плеере' },
          target: { opens: 'player', numerals: 'I IV V I', key: C_MAJOR },
        },
      ],
    },
  ],
}

export default pedalIntro
