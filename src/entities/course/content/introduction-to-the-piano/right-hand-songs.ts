import type { Lesson } from '@/entities/lesson'

const rightHandSongs: Lesson = {
  id: 'right-hand-songs',
  title: { en: 'Easy songs for the right hand', ru: 'Простые песни для правой руки' },
  summary: {
    en: 'Play three first tunes in the C position, with eighth notes, steps and skips.',
    ru: 'Сыграть три первые мелодии в позиции до: восьмые, шаги и скачки.',
  },
  sections: [
    {
      heading: { en: 'Hot Cross Buns', ru: '«Горячие булочки»' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'This tune uses three notes: E, D and C. Play them with fingers 3, 2 and 1 in the C position.',
            ru: 'В этой мелодии три ноты: ми, ре и до. Играйте их пальцами 3, 2 и 1 в позиции до.',
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
            en: 'lasts half a beat, so two fit in one count. Say “1 and 2 and” as you play to keep them even.',
            ru: 'длится полдоли, поэтому на один счёт приходится две. Считайте вслух «раз-и, два-и», чтобы они шли ровно.',
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
      heading: { en: 'Steps and skips', ru: 'Шаги и скачки' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A step', ru: 'Шаг' },
          text: {
            en: 'moves to the next white key. A skip jumps over one key. On the staff a skip goes from line to line or space to space.',
            ru: '— переход на соседнюю белую клавишу. Скачок перепрыгивает через одну. На нотном стане он идёт с линейки на линейку или с промежутка на промежуток.',
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
            en: 'C, D and E with fingers 1, 2 and 3. The notes repeat or move by step, except one skip from C to E in the third bar.',
            ru: 'До, ре и ми пальцами 1, 2 и 3. Ноты повторяются или идут шагами, кроме одного скачка от до к ми в третьем такте.',
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
      heading: { en: 'Mary Had a Little Lamb', ru: '«У Мэри был барашек»' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'This tune adds G, played by finger 5. For repeated notes, let the key rise and press it again without lifting the finger high.',
            ru: 'Здесь добавляется соль, её играет пятый палец. На повторах дайте клавише подняться и нажмите снова, не замахиваясь пальцем.',
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
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Before you play, say the finger numbers aloud.',
              ru: 'Перед игрой проговорите номера пальцев вслух.',
            },
            {
              en: 'Play slowly and count every beat.',
              ru: 'Играйте медленно и считайте каждую долю.',
            },
            {
              en: 'Speed up only when the tune sounds even.',
              ru: 'Ускоряйтесь, только когда мелодия звучит ровно.',
            },
          ],
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the four notes Mary Had a Little Lamb uses.',
            ru: 'Сыграйте четыре ноты, из которых состоит «У Мэри был барашек».',
          },
          answer: { notes: ['C', 'D', 'E', 'G'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Starting with the thumb, play the keys under fingers 1, 3 and 5.',
            ru: 'Начиная с большого пальца, сыграйте клавиши под пальцами 1, 3 и 5.',
          },
          answer: { notes: ['C', 'E', 'G'], rising: true },
        },
      ],
    },
  ],
}

export default rightHandSongs
