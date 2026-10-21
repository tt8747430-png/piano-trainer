import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const C_MAJOR = { tonic: note('C'), minor: false }

const pedalIntro: Lesson = {
  id: 'pedal-intro',
  title: { en: 'Meet the sustain pedal', ru: 'Знакомство с правой педалью' },
  summary: {
    en: 'Learn what the sustain pedal does, how to press it, and how a score marks it.',
    ru: 'Узнать, что делает правая педаль, как её нажимать и как она обозначается в нотах.',
  },
  sections: [
    {
      heading: { en: 'The pedal keeps notes sounding', ru: 'Педаль продлевает звук' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The sustain pedal', ru: 'Правая педаль' },
          text: {
            en: 'is the pedal furthest to the right. While it is down, notes keep sounding after you let go of the keys.',
            ru: '— крайняя правая педаль. Пока она нажата, звуки продолжают звучать и после того, как вы отпустили клавиши.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3 E3 G3 C4' },
        {
          kind: 'text',
          text: {
            en: 'Play this line without the pedal, then with it, and listen.',
            ru: 'Сыграйте эту строчку без педали, затем с педалью и послушайте разницу.',
          },
        },
      ],
    },
    {
      heading: { en: 'How to press it', ru: 'Как нажимать педаль' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Keep your heel on the floor, in line with the pedal.',
              ru: 'Пятка стоит на полу напротив педали.',
            },
            { en: 'Press with the ball of your foot.', ru: 'Нажимайте подушечкой стопы.' },
            {
              en: 'Go all the way down and all the way up, without a knock.',
              ru: 'Опускайте и отпускайте педаль до конца, без стука.',
            },
          ],
        },
        {
          kind: 'question',
          ask: {
            en: 'Press the pedal, play the F chord, then lift your hand. Let it ring.',
            ru: 'Нажмите педаль, сыграйте аккорд F и снимите руку. Пусть звучит.',
          },
          answer: { chord: 'F' },
        },
      ],
    },
    {
      heading: { en: 'Pedal marks in a score', ru: 'Педаль в нотах' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Ped.', ru: 'Ped.' },
          text: {
            en: 'under the bass staff means press the pedal. A star, or the end of a bracket line, means lift it. Many songs have no marks, so you pedal by ear.',
            ru: 'под басовым нотоносцем значит «нажать». Звёздочка или конец скобки значат «снять». Во многих песнях знаков нет, и педаль берут на слух.',
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
            en: 'Hold the pedal down and play C, E and G one at a time, low to high.',
            ru: 'Держа педаль, сыграйте по одной до, ми и соль снизу вверх.',
          },
          answer: { notes: ['C', 'E', 'G'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the G chord with the pedal down, then lift your hand.',
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
