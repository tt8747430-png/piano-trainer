import type { Lesson } from '@/entities/lesson'

/** Reading drill: the left hand moves up to C3, finger 5 on C, 4 on D and 3 on E, mid-staff. */
const bassEDC: Lesson = {
  id: 'bass-e-d-c',
  title: { en: 'E, D and C on the bass staff', ru: 'Ми, ре и до на басовом стане' },
  summary: {
    en: 'Read and play C, D and E mid-staff, finger 5 on C.',
    ru: 'Читать и играть до, ре и ми в середине стана, пятый палец на до.',
  },
  sections: [
    {
      heading: { en: 'Finger 5 on C3', ru: 'Пятый палец на до' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Move the left hand up: finger 5 on C3 in the second space, 4 on D3 on the middle line, 3 on E3 in the third space.',
            ru: 'Переместите левую руку выше: пятый палец на до во втором промежутке, четвёртый на ре на средней линейке, третий на ми в третьем промежутке.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3 D3 E3 D3 C3/1' },
      ],
    },
    {
      heading: { en: 'Same letters, new fingers', ru: 'Те же ноты, другие пальцы' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C3 was the thumb’s note before. Now finger 5 plays it, so read the note, not the finger.',
            ru: 'Раньше до играл первый палец. Теперь его играет пятый: читайте ноту, а не палец.',
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
            en: 'C3 to E3 skips from the second space to the third. Fingers 5 and 3 play it, 4 waits over D.',
            ru: 'До — ми — скачок из второго промежутка в третий. Его играют пятый и третий пальцы, четвёртый ждёт над ре.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'C3 E3 C3 E3 D3/2 C3/2 E3 C3 D3 E3 C3/1' },
      ],
    },
    {
      heading: { en: 'Repeats and long notes', ru: 'Повторы и долгие ноты' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Count the long notes aloud while you read.',
            ru: 'Считайте долгие ноты вслух, пока читаете.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'E3 E3 D3 D3 C3/2. D3 E3/2 E3/2 C3/1' },
        { kind: 'notes', clef: 'bass', meter: '3/4', notes: 'C3 C3 D3 E3/2 E3 D3 D3 C3 C3/2.' },
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
        {
          kind: 'question',
          ask: {
            en: 'Play the middle line, then skip down to the second line.',
            ru: 'Сыграйте среднюю линейку, затем скачком вторую линейку.',
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
