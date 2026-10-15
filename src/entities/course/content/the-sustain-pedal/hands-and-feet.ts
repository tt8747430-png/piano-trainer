import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const C_MAJOR = { tonic: note('C'), minor: false }

const handsAndFeet: Lesson = {
  id: 'hands-and-feet',
  title: { en: 'Coordinating hands and feet', ru: 'Согласование рук и ног' },
  summary: {
    en: 'The foot as a third hand: pedalling with the chords, holding a bass the hand has left, and practising foot and hands apart.',
    ru: 'Нога как третья рука: педаль вместе с аккордами, бас, который держит педаль, и отдельная работа ноги и рук.',
  },
  sections: [
    {
      heading: { en: 'Down with the hands', ru: 'Вместе с руками' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The rhythmic pedal', ru: 'Прямая педаль' },
          text: {
            en: 'goes down with each chord and up as the hands lift. It adds ring but leaves a small gap between chords.',
            ru: 'нажимается вместе с аккордом и снимается вместе с руками. Она добавляет звучности, но между аккордами остаётся щель.',
          },
        },
        { kind: 'chords', symbols: ['C', 'F', 'G', 'C'] },
        {
          kind: 'question',
          ask: {
            en: 'Play the F chord, pressing the pedal as the keys go down.',
            ru: 'Сыграйте аккорд F, нажимая педаль вместе с клавишами.',
          },
          answer: { chord: 'F' },
        },
      ],
    },
    {
      heading: { en: 'The foot alone', ru: 'Одна нога' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            { en: 'Count four beats aloud.', ru: 'Считайте вслух четыре доли.' },
            { en: 'Press the pedal on 1.', ru: 'На «раз» нажмите педаль.' },
            {
              en: 'Lift it on 4, then press again on the next 1.',
              ru: 'На «четыре» снимите, на следующий «раз» нажмите снова.',
            },
          ],
        },
        { kind: 'notes', clef: 'bass', notes: 'C3/1 F3/1 G3/1 C3/1' },
        {
          kind: 'note',
          text: {
            en: 'Then add the left hand, one bass note a bar.',
            ru: 'Затем добавьте левую руку, по басу на такт.',
          },
        },
      ],
    },
    {
      heading: { en: 'The pedal holds the bass', ru: 'Педаль держит бас' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A low bass and the notes above it lie too far apart for one hand. Catch the bass with the pedal, then let the hand climb.',
            ru: 'Низкий бас и звуки над ним слишком далеко друг от друга для одной руки. Поймайте бас педалью, и рука свободно пойдёт вверх.',
          },
        },
        {
          kind: 'notes',
          clef: 'bass',
          notes: 'C2 G2 E3/2 F2 C3 A3/2 G2 D3 B3/2 C2 G2 E3/2',
        },
        {
          kind: 'note',
          text: {
            en: 'Change the pedal at each new bass.',
            ru: 'Меняйте педаль на каждом новом басу.',
          },
        },
      ],
    },
    {
      heading: { en: 'Both hands and the foot', ru: 'Обе руки и нога' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Now the left hand plays the root and the right plays the chord. The foot follows both.',
            ru: 'Теперь левая рука играет основной тон, а правая — аккорд. Нога следует за обеими.',
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
      heading: { en: 'Listen, don’t look', ru: 'Слушайте, а не смотрите' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Practise the hands first, then the foot alone.',
              ru: 'Сначала учите руки, потом отдельно ногу.',
            },
            {
              en: 'Join them slowly, counting aloud.',
              ru: 'Соединяйте медленно, считая вслух.',
            },
            {
              en: 'Let the ear judge: a gap or a blur means the foot is early or late.',
              ru: 'Судите на слух: щель или грязь значит, что нога поспешила или опоздала.',
            },
          ],
        },
        { kind: 'progression', numerals: 'I IV V I', key: C_MAJOR },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Catch a low C with the pedal, then play E and G above it, one at a time.',
            ru: 'Поймайте педалью низкое до, затем сыграйте над ним по одной ми и соль.',
          },
          answer: { notes: ['C', 'E', 'G'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the G chord with the pedal going down as the keys do.',
            ru: 'Сыграйте аккорд G, нажимая педаль вместе с клавишами.',
          },
          answer: { chord: 'G' },
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
