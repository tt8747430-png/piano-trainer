import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const C_MAJOR = { tonic: note('C'), minor: false }

const pedalIntro: Lesson = {
  id: 'pedal-intro',
  title: { en: 'Introduction to the sustain pedal', ru: 'Знакомство с правой педалью' },
  summary: {
    en: 'Press the sustain pedal well and read its marks.',
    ru: 'Правильно нажимать правую педаль и читать её обозначения.',
  },
  sections: [
    {
      heading: { en: 'The pedal holds the sound', ru: 'Педаль продлевает звук' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The sustain pedal', ru: 'Правая педаль' },
          text: {
            en: 'is the rightmost pedal. Held down, it keeps notes ringing after the keys come up. Play this without it, then with it.',
            ru: '— крайняя правая. Пока она нажата, звуки тянутся и после отпущенных клавиш. Сыграйте без педали, затем с ней.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3 E3 G3 C4' },
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
            { en: 'Press with the ball of the foot.', ru: 'Нажимайте подушечкой стопы.' },
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
            en: 'under the bass staff means press. A star, or the end of a bracket line, means lift. Many songs give no marks: pedal by ear.',
            ru: 'под басовым станом — «нажать». Звёздочка или конец скобки — «снять». Во многих песнях знаков нет: педализируйте на слух.',
          },
        },
        { kind: 'chords', symbols: ['C', 'G'] },
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
