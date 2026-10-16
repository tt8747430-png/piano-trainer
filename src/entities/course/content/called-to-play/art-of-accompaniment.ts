import type { Lesson } from '@/entities/lesson'

/**
 * Called to Play's lesson 10, with the pages the book prints round it: the song introductions and the
 * table of embellishments, and the songs to learn by their plan.
 */
const artOfAccompaniment: Lesson = {
  id: 'art-of-accompaniment',
  title: { en: 'The art of accompaniment', ru: 'Искусство аккомпанемента' },
  summary: {
    en: 'Support a singer, fill the long notes, introduce the song.',
    ru: 'Поддерживайте пение, заполняйте долгие ноты, начинайте со вступления.',
  },
  sections: [
    {
      heading: { en: 'Never in the singer’s way', ru: 'Не мешать пению' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The golden rule: the accompaniment never gets in the singer’s way. It supports the song and draws no attention from it.',
            ru: 'Золотое правило: аккомпанемент не мешает пению. Он поддерживает песню и не отвлекает от неё внимание.',
          },
        },
        { kind: 'pattern', pattern: 'M1', piece: 'wonder' },
      ],
    },
    {
      heading: { en: 'Fill the long notes', ru: 'Заполняйте долгие ноты' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Place techniques and embellishments where the voice holds a long note or rests.',
            ru: 'Ставьте техники и украшения туда, где голос тянет долгую ноту или молчит.',
          },
        },
        { kind: 'pattern', pattern: 't3', piece: 'soon' },
      ],
    },
    {
      heading: { en: 'Song introductions', ru: 'Вступления к песням' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'An introduction sets the tempo, key and mood. Play the chorus’s melody, or its last two lines.',
            ru: 'Вступление задаёт темп, тональность и настроение. Сыграйте мелодию припева или две его последние строки.',
          },
        },
        { kind: 'pattern', pattern: 'M1', piece: 'house' },
        {
          kind: 'steps',
          steps: [
            { en: 'One voice in the right hand.', ru: 'Одноголосно, правой рукой.' },
            { en: 'The melody in octaves.', ru: 'Мелодия октавами.' },
            {
              en: 'Add a second voice in sixths or thirds.',
              ru: 'Добавьте второй голос секстами или терциями.',
            },
          ],
        },
      ],
    },
    {
      heading: { en: 'An accompanist, not a soloist', ru: 'Аккомпаниатор, а не солист' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            { en: 'Listen more than you show off.', ru: 'Больше слушайте, чем показывайте себя.' },
            { en: 'Read the lyrics first.', ru: 'Сначала прочитайте слова песни.' },
            {
              en: 'Let their meaning choose the dynamics, the character and the embellishments.',
              ru: 'Пусть их смысл подскажет динамику, характер и украшения.',
            },
          ],
        },
        { kind: 'pattern', pattern: 's6u', piece: 'together' },
      ],
    },
    {
      heading: { en: 'The table of techniques', ru: 'Таблица приёмов' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Keep the table beside a song’s chords to choose what to add where.',
            ru: 'Держите таблицу рядом с аккордами песни, чтобы выбирать, что и где добавить.',
          },
        },
        { kind: 'pattern', pattern: 'c3', piece: 'wonder' },
        {
          kind: 'steps',
          steps: [
            { en: '♪♩', ru: '♪♩' },
            { en: '♪♪♪♪', ru: '♪♪♪♪' },
            { en: '♬', ru: '♬' },
            { en: '♫', ru: '♫' },
            { en: '♩.♪♩', ru: '♩.♪♩' },
            { en: '3 chords', ru: '3 аккорда' },
            { en: 'Inversions', ru: 'Обращения' },
            { en: '5.1', ru: '5.1' },
            { en: '5.2', ru: '5.2' },
            { en: '5.3', ru: '5.3' },
            { en: 'Sixths up', ru: 'Сексты вверх' },
            { en: 'Sixths down', ru: 'Сексты вниз' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Two songs by their plan', ru: 'Две песни по плану' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Learn two of these songs by their plan.',
            ru: 'Выучите две из этих песен по плану.',
          },
        },
        { kind: 'pattern', pattern: 'p52', piece: 'soon' },
        {
          kind: 'link',
          title: { en: 'Soon, Soon Our Savior Will Come', ru: 'Soon, Soon Our Savior Will Come' },
          target: { opens: 'piece', piece: 'soon' },
        },
        {
          kind: 'link',
          title: { en: 'A Three-Story Old House', ru: 'A Three-Story Old House' },
          target: { opens: 'piece', piece: 'house' },
        },
        {
          kind: 'link',
          title: { en: 'Together We Believed', ru: 'Together We Believed' },
          target: { opens: 'piece', piece: 'together' },
        },
        {
          kind: 'link',
          title: {
            en: 'How Wonderful Is All That’s Yours',
            ru: 'How Wonderful Is All That’s Yours',
          },
          target: { opens: 'piece', piece: 'wonder' },
        },
      ],
    },
  ],
}

export default artOfAccompaniment
