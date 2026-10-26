import { C_MAJOR } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const handsAndFeet: Lesson = {
  id: 'hands-and-feet',
  title: { en: 'Hands and foot together', ru: 'Руки и нога вместе' },
  summary: {
    en: 'Press the pedal in time with the chords, then use it to hold a low bass note.',
    ru: 'Нажимать педаль вместе с аккордами, затем держать ею низкий бас.',
  },
  sections: [
    {
      heading: { en: 'Down with the chord', ru: 'Вместе с аккордом' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The rhythmic pedal', ru: 'Прямая педаль' },
          text: {
            en: 'goes down with each chord and comes up as the hands lift. It adds ring, but leaves a short gap between the chords.',
            ru: 'нажимается вместе с аккордом и снимается, когда поднимаются руки. Она добавляет звучности, но между аккордами остаётся короткая щель.',
          },
        },
        { kind: 'chords', symbols: ['C', 'F', 'G', 'C'] },
      ],
    },
    {
      heading: { en: 'The foot on its own', ru: 'Сначала одна нога' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            { en: 'Count four beats aloud.', ru: 'Считайте вслух четыре доли.' },
            {
              en: 'Press the pedal on 1 and lift it on 4.',
              ru: 'На «раз» нажмите педаль, на «четыре» снимите.',
            },
            {
              en: 'Then add the left hand, one bass note per bar.',
              ru: 'Затем добавьте левую руку, по одной басовой ноте на такт.',
            },
          ],
        },
        { kind: 'notes', clef: 'bass', notes: 'C3/1 F3/1 G3/1 C3/1' },
      ],
    },
    {
      heading: { en: 'The pedal holds the bass', ru: 'Педаль держит бас' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A low bass note sits too far from the notes above for one hand to hold. Catch it with the pedal and let the hand climb. Change at each new bass note.',
            ru: 'Низкий бас слишком далеко от звуков над ним, одна рука его не удержит. Поймайте его педалью, и рука пойдёт вверх. Меняйте педаль на каждом новом басу.',
          },
        },
        {
          kind: 'notes',
          clef: 'bass',
          notes: 'C2 G2 E3/2 F2 C3 A3/2 G2 D3 B3/2 C2 G2 E3/2',
        },
        {
          kind: 'question',
          ask: {
            en: 'Catch a low C with the pedal, then play E and G above it, one at a time.',
            ru: 'Поймайте педалью низкое до, затем сыграйте над ним по одной ми и соль.',
          },
          answer: { notes: ['C', 'E', 'G'], rising: true },
        },
      ],
    },
    {
      heading: { en: 'Both hands and the foot', ru: 'Обе руки и нога' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The left hand plays the root low down. The right hand plays the chord. The foot follows both.',
            ru: 'Левая рука играет основной тон внизу. Правая берёт аккорд. Нога следует за обеими.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', hands: 'C2 | E4 G4 C5' },
            { symbol: 'F', hands: 'F2 | F4 A4 C5' },
            { symbol: 'G', hands: 'G2 | D4 G4 B4' },
            { symbol: 'C', hands: 'C2 | E4 G4 C5' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Practise the hands first, then the foot alone.',
              ru: 'Сначала учите руки, потом отдельно ногу.',
            },
            { en: 'Join them slowly, counting aloud.', ru: 'Соединяйте медленно, считая вслух.' },
            {
              en: 'If you hear a gap or a blur, the foot came too early or too late.',
              ru: 'Если слышна щель или грязь, нога поспешила или опоздала.',
            },
          ],
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the F chord, pressing the pedal as the keys go down.',
            ru: 'Сыграйте аккорд F, нажимая педаль вместе с клавишами.',
          },
          answer: { chord: 'F' },
        },
        {
          kind: 'link',
          title: { en: 'Aura Lee in the Player', ru: '«Аура Ли» в плеере' },
          target: { opens: 'piece', piece: 'aura-lee' },
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

export default handsAndFeet
