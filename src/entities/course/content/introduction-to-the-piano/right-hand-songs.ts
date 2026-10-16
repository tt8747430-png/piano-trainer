import type { Lesson } from '@/entities/lesson'

const rightHandSongs: Lesson = {
  id: 'right-hand-songs',
  title: { en: 'Easy songs for the right hand', ru: 'Простые песни для правой руки' },
  summary: {
    en: 'Play three first tunes in the C position.',
    ru: 'Сыграть три первые мелодии в позиции до.',
  },
  sections: [
    {
      heading: { en: 'Hot Cross Buns', ru: '«Горячие булочки»' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Three notes, E, D and C, with fingers 3, 2 and 1.',
            ru: 'Три ноты — ми, ре и до, пальцы 3, 2 и 1.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'E4 D4 C4/2 E4 D4 C4/2 C4/8 C4/8 C4/8 C4/8 D4/8 D4/8 D4/8 D4/8 E4 D4 C4/2',
        },
        {
          kind: 'link',
          title: { en: 'Hot Cross Buns in the Player', ru: '«Горячие булочки» в плеере' },
          target: { opens: 'piece', piece: 'hot-cross-buns' },
        },
      ],
    },
    {
      heading: { en: 'Eighth notes', ru: 'Восьмые' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An eighth note', ru: 'Восьмая' },
          text: {
            en: 'lasts half a beat, so two fit in one count. Say “1 and 2 and” to keep them even.',
            ru: 'длится полдоли: две на один счёт. Считайте «раз-и, два-и», чтобы шли ровно.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4/8 C4/8 C4/8 C4/8 D4/8 D4/8 D4/8 D4/8 E4 D4 C4/2',
        },
      ],
    },
    {
      heading: { en: 'Mary Had a Little Lamb', ru: '«У Мэри был барашек»' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'This tune adds G, finger 5. Play repeated notes from the key, not from above it.',
            ru: 'Здесь добавляется соль, пятый палец. Повторы играйте с клавиши, без замаха.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes:
            'E4 D4 C4 D4 E4 E4 E4/2 D4 D4 D4/2 E4 G4 G4/2 E4 D4 C4 D4 E4 E4 E4 E4 D4 D4 E4 D4 C4/1',
        },
        {
          kind: 'link',
          title: {
            en: 'Mary Had a Little Lamb in the Player',
            ru: '«У Мэри был барашек» в плеере',
          },
          target: { opens: 'piece', piece: 'mary-lamb' },
        },
      ],
    },
    {
      heading: { en: 'Steps and skips', ru: 'Шаги и скачки' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A step', ru: 'Шаг' },
          text: {
            en: 'moves to the next key. A skip jumps over one key, from line to line or space to space.',
            ru: '— переход на соседнюю клавишу. Скачок — через одну: с линейки на линейку или с промежутка на промежуток.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 C4 E4 G4/2' },
        {
          kind: 'question',
          ask: { en: 'Play the skip from C up to E.', ru: 'Сыграйте скачок от до вверх к ми.' },
          answer: { notes: ['C', 'E'], rising: true },
        },
      ],
    },
    {
      heading: { en: 'Au clair de la lune', ru: '«При лунном свете»' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C, D and E, with one skip from C to E in the third bar, fingers 1 to 3.',
            ru: 'До, ре и ми, в третьем такте скачок от до к ми, пальцы 1 и 3.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 C4 C4 D4 E4/2 D4/2 C4 E4 D4 D4 C4/1' },
        {
          kind: 'link',
          title: { en: 'Au clair de la lune in the Player', ru: '«При лунном свете» в плеере' },
          target: { opens: 'piece', piece: 'au-clair' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            { en: 'Say the finger numbers aloud.', ru: 'Проговорите номера пальцев вслух.' },
            {
              en: 'Play slowly, counting every beat.',
              ru: 'Играйте медленно, считая каждую долю.',
            },
            {
              en: 'Speed up only once it sounds even.',
              ru: 'Ускоряйтесь, только когда звучит ровно.',
            },
          ],
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the four notes of Mary Had a Little Lamb.',
            ru: 'Сыграйте четыре ноты «У Мэри был барашек».',
          },
          answer: { notes: ['C', 'D', 'E', 'G'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the keys under fingers 1, 3 and 5, from the thumb.',
            ru: 'Сыграйте по очереди клавиши под пальцами 1, 3 и 5, от большого.',
          },
          answer: { notes: ['C', 'E', 'G'], rising: true },
        },
      ],
    },
  ],
}

export default rightHandSongs
