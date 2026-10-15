import type { Lesson } from '@/entities/lesson'

/** Reading drill: the left hand moves up to C3, finger 5 on C, 4 on D and 3 on E, mid-staff. */
const bassEDC: Lesson = {
  id: 'bass-e-d-c',
  title: { en: 'E, D and C on the bass staff', ru: 'Ми, ре и до на басовом стане' },
  summary: {
    en: 'A new left-hand position, finger 5 on C3: read C3, D3 and E3 in the middle of the bass staff and play them on sight.',
    ru: 'Новая позиция левой руки, пятый палец на до малой октавы: читайте до, ре и ми в середине басового стана и играйте с листа.',
  },
  sections: [
    {
      heading: { en: 'Finger 5 on C3', ru: 'Пятый палец на до' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Move the left hand up so finger 5 sits on C3. Fingers 4 and 3 fall on D3 and E3.',
            ru: 'Переместите левую руку выше, чтобы пятый палец встал на до малой октавы. Четвёртый и третий ложатся на ре и ми.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3/2 D3/2 E3/1' },
        {
          kind: 'question',
          ask: {
            en: 'Play C3, D3 and E3 with fingers 5, 4 and 3.',
            ru: 'Сыграйте до, ре и ми пятым, четвёртым и третьим пальцами.',
          },
          answer: { notes: ['C', 'D', 'E'], rising: true },
        },
      ],
    },
    {
      heading: { en: 'Where each note sits', ru: 'Где стоит каждая нота' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C3 is in the second space. D3 sits on the middle line, E3 in the third space.',
            ru: 'До — во втором промежутке. Ре — на средней линейке, ми — в третьем промежутке.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3 D3 E3 D3 C3/1' },
        {
          kind: 'question',
          ask: { en: 'Play the note on the middle line.', ru: 'Сыграйте ноту на средней линейке.' },
          answer: { notes: ['D'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the note in the third space.',
            ru: 'Сыграйте ноту в третьем промежутке.',
          },
          answer: { notes: ['E'] },
        },
      ],
    },
    {
      heading: { en: 'Same letters, new fingers', ru: 'Те же ноты, другие пальцы' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C3 was the thumb’s note before. Now finger 5 plays it, so read the note, not the finger.',
            ru: 'Раньше до играл первый палец. Теперь его играет пятый, поэтому читайте ноту, а не палец.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3 D3 E3/2 E3 D3 C3/2 D3 E3 D3 C3 E3/1' },
        { kind: 'notes', clef: 'bass', notes: 'E3 D3 C3 D3 E3/2 E3/2 D3 D3 E3 D3 C3/1' },
      ],
    },
    {
      heading: { en: 'The skip from C to E', ru: 'Скачок от до к ми' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C3 to E3 is a skip, second space to third. Fingers 5 and 3 play it, finger 4 waiting over D.',
            ru: 'До — ми — скачок из второго промежутка в третий. Его играют пятый и третий пальцы, четвёртый ждёт над ре.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3 E3 C3 E3 D3/2 C3/2 E3 C3 D3 E3 C3/1' },
      ],
    },
    {
      heading: { en: 'Repeats and long notes', ru: 'Повторы и долгие ноты' },
      blocks: [
        { kind: 'notes', clef: 'bass', notes: 'E3 E3 D3 D3 C3/2. D3 E3/2 E3/2 C3/1' },
        { kind: 'notes', clef: 'bass', meter: '3/4', notes: 'C3 C3 D3 E3/2 E3 D3 D3 C3 C3/2.' },
        {
          kind: 'note',
          text: {
            en: 'Count the long notes aloud while you read.',
            ru: 'Считайте долгие ноты вслух, пока читаете.',
          },
        },
      ],
    },
    {
      heading: { en: 'Read on sight', ru: 'Чтение с листа' },
      blocks: [
        { kind: 'notes', clef: 'bass', notes: 'D3 E3 D3 C3 E3 E3 D3/2 C3 D3 E3 D3 C3/1' },
        { kind: 'notes', clef: 'bass', meter: '3/4', notes: 'E3 D3 C3 D3/2 E3 C3 E3 D3 C3/2.' },
        { kind: 'notes', clef: 'bass', notes: 'C3/2 E3/2 D3 C3 D3 E3 C3 E3 D3 D3 C3/1' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the second space, the middle line and the third space.',
            ru: 'Сыграйте второй промежуток, среднюю линейку и третий промежуток.',
          },
          answer: { notes: ['C', 'D', 'E'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play E, then step down twice.',
            ru: 'Сыграйте ми, затем два шага вниз.',
          },
          answer: { notes: ['E', 'D', 'C'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the middle line, then skip down to the note on the second line.',
            ru: 'Сыграйте среднюю линейку, затем скачком ноту на второй линейке.',
          },
          answer: { notes: ['D', 'B'] },
        },
        {
          kind: 'link',
          title: { en: 'Reading notes in the Quiz', ru: 'Чтение нот в тестах' },
          target: { opens: 'quiz', trainer: 'reading-notes' },
        },
      ],
    },
  ],
}

export default bassEDC
