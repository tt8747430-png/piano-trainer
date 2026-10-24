import { C_MAJOR } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const pedalChange: Lesson = {
  id: 'pedal-change',
  title: { en: 'Changing the pedal', ru: 'Смена педали' },
  summary: {
    en: 'Change the pedal just after each new chord, so the chords join with no gap and no blur.',
    ru: 'Менять педаль сразу после нового аккорда, чтобы аккорды связывались без щели и без грязи.',
  },
  sections: [
    {
      heading: { en: 'Two chords on one pedal', ru: 'Два аккорда на одной педали' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Keep the pedal down through C and then G. The two chords ring into each other, and the sound turns muddy.',
            ru: 'Держите педаль через C и G. Аккорды наплывают друг на друга, и звук становится грязным.',
          },
        },
        { kind: 'chords', symbols: ['C', 'G'] },
      ],
    },
    {
      heading: { en: 'Change just after the chord', ru: 'Смена сразу после аккорда' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The legato pedal', ru: 'Запаздывающая педаль' },
          text: {
            en: 'is changed just after the new chord sounds. Play the chord, lift the pedal, then press it again at once. Say it aloud: “chord, up, down”.',
            ru: 'меняется сразу после нового аккорда. Возьмите аккорд, снимите педаль и тут же нажмите снова. Проговаривайте: «аккорд, вверх, вниз».',
          },
        },
        { kind: 'progression', numerals: 'I IV V I', key: C_MAJOR },
      ],
    },
    {
      heading: { en: 'Why after, not with', ru: 'Почему после, а не вместе' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Lift before the chord, and you hear a gap.',
              ru: 'Снимете до аккорда — услышите щель.',
            },
            {
              en: 'Lift with the chord, and the old chord bleeds into the new one.',
              ru: 'Снимете вместе с аккордом — старый аккорд просочится в новый.',
            },
            {
              en: 'Lift just after it, all the way up, and the sound joins cleanly.',
              ru: 'Снимете сразу после, до конца, — звук свяжется чисто.',
            },
          ],
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the Am chord, then change the pedal while you hold it.',
            ru: 'Сыграйте аккорд Am и смените педаль, не отпуская его.',
          },
          answer: { chord: 'Am' },
        },
      ],
    },
    {
      heading: { en: 'Counting the change', ru: 'Смена по счёту' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'With one chord per bar, play the chord on “1”, lift the pedal on “and”, and press it again by “2”. Your hands hold the chord all along.',
            ru: 'Если аккорд один на такт, играйте его на «раз», снимайте педаль на «и» и нажимайте снова к «двум». Руки всё это время держат аккорд.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', hands: 'C3 | E4 G4 C5' },
            { symbol: 'Am', hands: 'A2 | E4 A4 C5' },
            { symbol: 'F', hands: 'F2 | F4 A4 C5' },
            { symbol: 'G', hands: 'G2 | D4 G4 B4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'In a song', ru: 'В песне' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Shenandoah moves slowly, with one or two chords per bar. Change the pedal just after each new chord.',
            ru: '«Шенандоа» движется медленно, один-два аккорда на такт. Меняйте педаль сразу после каждого нового аккорда.',
          },
        },
        { kind: 'chords', symbols: ['C', 'F', 'C', 'G'] },
        {
          kind: 'link',
          title: { en: 'Shenandoah in the Player', ru: '«Шенандоа» в плеере' },
          target: { opens: 'piece', piece: 'shenandoah' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play C, then F, and change the pedal just after F.',
            ru: 'Сыграйте C, затем F и смените педаль сразу после F.',
          },
          answer: { chord: 'F' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play G, then change the pedal while you hold it.',
            ru: 'Сыграйте G и смените педаль, не отпуская аккорд.',
          },
          answer: { chord: 'G' },
        },
        {
          kind: 'link',
          title: { en: 'I vi IV V in the Player', ru: 'I vi IV V в плеере' },
          target: { opens: 'player', numerals: 'I vi IV V', key: C_MAJOR },
        },
      ],
    },
  ],
}

export default pedalChange
