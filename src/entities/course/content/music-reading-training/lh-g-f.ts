import type { Lesson } from '@/entities/lesson'

/** Reading drill: fingers 4 and 5 on G2 and F2 complete the left hand's position from F2 to C3. */
const lhGF: Lesson = {
  id: 'lh-g-f',
  title: { en: 'G and F in the left hand', ru: 'Соль и фа в левой руке' },
  summary: {
    en: 'Add G and F to fill the left hand’s position, one finger for each note from F up to C.',
    ru: 'Добавить соль и фа и занять всю позицию левой руки: по пальцу на каждую ноту от фа до до.',
  },
  sections: [
    {
      heading: { en: 'G and F on the staff', ru: 'Соль и фа на стане' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Keep the left thumb on C3. Finger 4 plays G, on the bottom line. Finger 5 plays F, just under the staff. Now each finger has its own note.',
            ru: 'Первый палец левой руки остаётся на до. Четвёртый играет соль на нижней линейке, пятый — фа прямо под станом. Теперь у каждого пальца своя нота.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'F2 G2 A2 B2 C3/1' },
      ],
    },
    {
      heading: { en: 'Steps down to F', ru: 'Шаги до фа' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Finger 5 plays the lowest note. Keep it curved and let it play as firmly as the thumb.',
            ru: 'Пятый палец играет самую низкую ноту. Держите его округлым и играйте им так же уверенно, как первым.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'A2 G2 F2/2 F2 G2 A2/2 G2 F2 G2 A2 B2/1' },
        { kind: 'notes', clef: 'bass', notes: 'C3 B2 A2 G2 F2/2 A2/2 G2 A2 G2 F2 F2/1' },
      ],
    },
    {
      heading: { en: 'Skips in the position', ru: 'Скачки в позиции' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'F to A and A to C go space to space. G to B goes line to line. Each skip leaves one finger out.',
            ru: 'Фа — ля и ля — до идут из промежутка в промежуток, соль — си — с линейки на линейку. Каждый скачок пропускает один палец.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'F2 A2 C3/2 A2 C3 A2 F2 G2 B2 G2 B2 A2/1' },
      ],
    },
    {
      heading: { en: 'F to C: the whole hand', ru: 'От фа к до: вся рука' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'F2 to C3 spans the whole hand, finger 5 to thumb. On the staff it goes from under the staff to the second space. Keep the hand still.',
            ru: 'Фа — до охватывает всю руку, от пятого пальца до первого. На стане это из-под стана во второй промежуток. Рука остаётся на месте.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'F2/2 C3/2 C3 A2 F2/2 F2 C3 B2 G2 F2/1' },
      ],
    },
    {
      heading: { en: 'Sight-reading', ru: 'Чтение с листа' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Keep your eyes on the music, not on your hand. Each finger already knows its key.',
            ru: 'Смотрите в ноты, а не на руку. Каждый палец уже знает свою клавишу.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3 A2 B2 G2 A2 F2 G2/2 F2 G2 A2 B2 C3/1' },
        { kind: 'notes', clef: 'bass', meter: '3/4', notes: 'F2 G2 A2 G2/2 F2 A2 C3 A2 F2/2.' },
        { kind: 'notes', clef: 'bass', notes: 'G2 G2 A2 B2 C3/2 A2/2 G2 F2 G2 A2 F2/1' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the note just under the bass staff.',
            ru: 'Сыграйте ноту прямо под басовым станом.',
          },
          answer: { notes: ['F'] },
        },
        {
          kind: 'question',
          ask: { en: 'Play G, then skip up to B.', ru: 'Сыграйте соль, затем скачком си.' },
          answer: { notes: ['G', 'B'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play C with the thumb, then step down to F.',
            ru: 'Сыграйте до первым пальцем, затем шагами вниз до фа.',
          },
          answer: { notes: ['C', 'B', 'A', 'G', 'F'], falling: true },
        },
        {
          kind: 'link',
          title: { en: 'Practise reading notes in the Quiz', ru: 'Чтение нот в тестах' },
          target: { opens: 'quiz', trainer: 'reading-notes' },
        },
      ],
    },
  ],
}

export default lhGF
