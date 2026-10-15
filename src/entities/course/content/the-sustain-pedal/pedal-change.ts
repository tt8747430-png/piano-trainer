import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const C_MAJOR = { tonic: note('C'), minor: false }

const pedalChange: Lesson = {
  id: 'pedal-change',
  title: { en: 'The pedal change', ru: 'Смена педали' },
  summary: {
    en: 'The legato pedal: play the new chord, then lift and press again, so chords join without a gap or a blur.',
    ru: 'Запаздывающая педаль: сначала новый аккорд, потом снять и снова нажать, чтобы аккорды связывались без щели и грязи.',
  },
  sections: [
    {
      heading: { en: 'Two chords, one pedal', ru: 'Два аккорда на одной педали' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Hold the pedal through C and then G, and the two chords ring into each other. The sound turns muddy.',
            ru: 'Держите педаль через C и G, и аккорды наплывают друг на друга. Звук становится грязным.',
          },
        },
        { kind: 'chords', symbols: ['C', 'G'] },
      ],
    },
    {
      heading: { en: 'Change after the chord', ru: 'Смена после аккорда' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The legato pedal', ru: 'Запаздывающая педаль' },
          text: {
            en: 'changes just after the new chord sounds. Play the chord, then lift the pedal and press it again at once.',
            ru: 'меняется сразу после нового аккорда. Возьмите аккорд, затем снимите педаль и тут же нажмите снова.',
          },
        },
        { kind: 'chords', symbols: ['C', 'F', 'G', 'C'] },
        {
          kind: 'note',
          text: {
            en: 'Say it as you play: “chord, up, down”.',
            ru: 'Проговаривайте: «аккорд, вверх, вниз».',
          },
        },
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
              en: 'Lift with the chord, and the old one bleeds in.',
              ru: 'Снимете вместе с аккордом — старый просочится в новый.',
            },
            {
              en: 'Lift just after it, and the sound joins cleanly.',
              ru: 'Снимете сразу после — звук свяжется чисто.',
            },
          ],
        },
        { kind: 'progression', numerals: 'I IV V I', key: C_MAJOR },
      ],
    },
    {
      heading: { en: 'Counting the change', ru: 'Смена по счёту' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'With a chord a bar, play on “1”, lift on “and”, press again by “2”. Meanwhile the hands keep the chord down.',
            ru: 'Если аккорд на такт: играйте на «раз», снимайте на «и», нажимайте снова к «двум». Руки тем временем держат звук.',
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
      heading: { en: 'A full lift', ru: 'Полное снятие' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Lift far enough for the dampers to touch the strings. A half lift leaves a haze of the old chord. Keep the heel down.',
            ru: 'Снимайте настолько, чтобы демпферы легли на струны. Неполное снятие оставляет призвук старого аккорда. Пятка остаётся на полу.',
          },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the Am chord, then change the pedal while you hold it.',
            ru: 'Сыграйте аккорд Am и смените педаль, держа его.',
          },
          answer: { chord: 'Am' },
        },
      ],
    },
    {
      heading: { en: 'In a song', ru: 'В песне' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Shenandoah moves slowly, a chord or two a bar. Change after each new chord and let the tune sing over it.',
            ru: '«Шенандоа» движется медленно, один-два аккорда в такте. Меняйте педаль после каждого нового аккорда, и мелодия запоёт.',
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
            en: 'Play C, then F, changing the pedal just after F.',
            ru: 'Сыграйте C, затем F и смените педаль сразу после F.',
          },
          answer: { chord: 'F' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play G with B on top, then change the pedal.',
            ru: 'Сыграйте G с си наверху и смените педаль.',
          },
          answer: { chord: 'G' },
        },
        {
          kind: 'link',
          title: { en: 'Shenandoah in the Player', ru: '«Шенандоа» в плеере' },
          target: { opens: 'piece', piece: 'shenandoah' },
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
