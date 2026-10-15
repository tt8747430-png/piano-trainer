import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const C_MAJOR = { tonic: note('C'), minor: false }

const whenToChange: Lesson = {
  id: 'when-to-change',
  title: { en: 'When to change the pedal', ru: 'Когда менять педаль' },
  summary: {
    en: 'Change with the harmony, not with every note: chords take the pedal, runs and low notes take less.',
    ru: 'Меняйте педаль со сменой гармонии, а не с каждой нотой: аккордам педаль нужна, пассажам и басам — меньше.',
  },
  sections: [
    {
      heading: { en: 'Change with the harmony', ru: 'Смена с гармонией' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Harmony', ru: 'Гармония' },
          text: {
            en: 'is the chord under the music. Notes of one chord may ring together, so change only when the chord changes.',
            ru: '— аккорд, на котором стоит музыка. Звуки одного аккорда могут звучать вместе, поэтому меняйте педаль только со сменой аккорда.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4 E4 G4 E4 F4 A4 C5 A4 G4 B4 D5 B4 C5/1',
        },
        {
          kind: 'note',
          text: {
            en: 'One pedal for each bar: C, F, G, C.',
            ru: 'Одна педаль на такт: C, F, G, C.',
          },
        },
      ],
    },
    {
      heading: { en: 'A tune inside one chord', ru: 'Мелодия внутри аккорда' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'This tune uses only C, E and G. It can all sound under one pedal, since every note belongs to the C chord.',
            ru: 'Эта мелодия состоит только из до, ми и соль. Её можно играть на одной педали: все ноты входят в аккорд C.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4 G4 C5 G4 E4/2 C4/2' },
      ],
    },
    {
      heading: { en: 'Steps blur', ru: 'Поступенное движение смазывается' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A passing note', ru: 'Проходящий звук' },
          text: {
            en: 'steps between chord notes from outside the chord. Under a held pedal a run of steps turns to a blur, so scales take little or no pedal.',
            ru: 'соединяет звуки аккорда, не входя в него. На педали поступенный пассаж превращается в пятно, поэтому гаммы играют почти без педали.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 A4 B4 C5' },
      ],
    },
    {
      heading: { en: 'Low notes ring longest', ru: 'Низкие звуки тянутся дольше' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The same chord sounds thick low down and clear up high. In the bass, change more often or use less pedal.',
            ru: 'Один и тот же аккорд внизу звучит густо, а наверху прозрачно. В басу меняйте педаль чаще или берите её мельче.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', hands: 'C2 E2 G2 |' },
            { symbol: 'C', hands: '| C5 E5 G5' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Two chords in a bar', ru: 'Два аккорда в такте' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'When the chord changes twice a bar, so does the pedal. Find the changes before you play.',
            ru: 'Если аккорд меняется дважды в такте, педаль тоже. Найдите смены заранее.',
          },
        },
        { kind: 'progression', numerals: 'I vi IV V', key: C_MAJOR },
        {
          kind: 'link',
          title: { en: 'I vi IV V in the Player', ru: 'I vi IV V в плеере' },
          target: { opens: 'player', numerals: 'I vi IV V', key: C_MAJOR },
        },
      ],
    },
    {
      heading: { en: 'Read the song', ru: 'Прочитайте песню' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Mark each chord change in the song.',
              ru: 'Отметьте в песне каждую смену аккорда.',
            },
            {
              en: 'Change the pedal just after each mark.',
              ru: 'Меняйте педаль сразу после каждой отметки.',
            },
            {
              en: 'Over a run, lift or take less.',
              ru: 'На пассаже снимайте или берите мельче.',
            },
          ],
        },
        { kind: 'chords', symbols: ['C', 'Am', 'F', 'G'] },
        {
          kind: 'link',
          title: { en: 'Aura Lee in the Player', ru: '«Аура Ли» в плеере' },
          target: { opens: 'piece', piece: 'aura-lee' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the notes that can share one pedal over the C chord.',
            ru: 'Сыграйте звуки, которые могут звучать на одной педали над аккордом C.',
          },
          answer: { notes: ['C', 'E', 'G'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the chord that comes after C in I vi IV V.',
            ru: 'Сыграйте аккорд, который идёт после C в I vi IV V.',
          },
          answer: { chord: 'Am' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the passing note between C and E.',
            ru: 'Сыграйте проходящий звук между до и ми.',
          },
          answer: { notes: ['D'] },
        },
        {
          kind: 'link',
          title: { en: 'Aura Lee in the Player', ru: '«Аура Ли» в плеере' },
          target: { opens: 'piece', piece: 'aura-lee' },
        },
        {
          kind: 'link',
          title: { en: 'Shenandoah in the Player', ru: '«Шенандоа» в плеере' },
          target: { opens: 'piece', piece: 'shenandoah' },
        },
        {
          kind: 'link',
          title: { en: 'Brahms’ Lullaby in the Player', ru: '«Колыбельная» Брамса в плеере' },
          target: { opens: 'piece', piece: 'brahms-lullaby' },
        },
      ],
    },
  ],
}

export default whenToChange
