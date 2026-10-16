import type { Lesson } from '@/entities/lesson'

/** Reading drill: the left hand moves up to C3, finger 5 on C, 4 on D and 3 on E, mid-staff. */
const bassEDC: Lesson = {
  id: 'bass-e-d-c',
  title: { en: 'E, D and C on the bass staff', ru: 'Ми, ре и до на басовом стане' },
  summary: {
    en: 'Move the left hand up the bass staff and read C, D and E with fingers 5, 4 and 3.',
    ru: 'Перенести левую руку выше по басовому стану и читать до, ре и ми пятым, четвёртым и третьим пальцами.',
  },
  sections: [
    {
      heading: { en: 'A new position: finger 5 on C3', ru: 'Новая позиция: пятый палец на до' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Move the left hand up. Finger 5 on C3, the second space. Finger 4 on D3, the middle line. Finger 3 on E3, the third space.',
            ru: 'Переместите левую руку выше. Пятый палец на до во втором промежутке, четвёртый на ре на средней линейке, третий на ми в третьем промежутке.',
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
            en: 'Before, the thumb played C3. Now finger 5 plays it. Read the note on the staff, not the finger you remember.',
            ru: 'Раньше до играл первый палец, теперь его играет пятый. Читайте ноту на стане, а не палец, к которому привыкли.',
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
            en: 'C3 to E3 is a skip, from the second space to the third. Fingers 5 and 3 play it. Finger 4 waits over D.',
            ru: 'До — ми — скачок из второго промежутка в третий. Его играют пятый и третий пальцы, а четвёртый ждёт над ре.',
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
            en: 'Count aloud as you read, and hold each long note for all of its beats. The second line is in 3/4.',
            ru: 'Считайте вслух, пока читаете, и держите каждую долгую ноту все её доли. Вторая строка — в размере 3/4.',
          },
        },
        { kind: 'notes', clef: 'bass', notes: 'E3 E3 D3 D3 C3/2. D3 E3/2 E3/2 C3/1' },
        { kind: 'notes', clef: 'bass', meter: '3/4', notes: 'C3 C3 D3 E3/2 E3 D3 D3 C3 C3/2.' },
      ],
    },
    {
      heading: { en: 'Sight-reading', ru: 'Чтение с листа' },
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
            en: 'Play the note on the bass staff’s middle line.',
            ru: 'Сыграйте ноту на средней линейке басового стана.',
          },
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
            ru: 'Сыграйте ноту на средней линейке, затем скачком вниз — на второй.',
          },
          answer: { notes: ['D', 'B'] },
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

export default bassEDC
