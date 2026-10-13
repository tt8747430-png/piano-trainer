import type { Lesson } from '../model/types'

/**
 * Called to Play's lesson 10, with the pages the book prints round it: the song introductions and the
 * table of embellishments, and the songs to learn by their plan.
 */
const artOfAccompaniment: Lesson = {
  id: 'art-of-accompaniment',
  title: { en: 'The art of accompaniment', ru: 'Искусство аккомпанемента' },
  summary: {
    en: 'Called to Play, lesson 10: never get in the singer’s way, fill the long notes, open a song with an introduction, and choose from the twelve techniques.',
    ru: 'Called to Play, урок 10: не мешать пению, заполнять долгие ноты, начинать песню со вступления и выбирать из двенадцати техник.',
  },
  level: 2,
  module: 'called-to-play',
  sections: [
    {
      heading: { en: 'Never in the singer’s way', ru: 'Не мешать пению' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The golden rule: the accompaniment never gets in the singer’s way. It supports the song and draws no attention away from it.',
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
            en: 'Place techniques and embellishments where the voice holds a long note or rests. There the pianist has room.',
            ru: 'Ставьте техники и украшения туда, где голос тянет долгую ноту или молчит. Там у пианиста есть место.',
          },
        },
        { kind: 'pattern', pattern: 't3', piece: 'soon' },
      ],
    },
    {
      heading: { en: 'An accompanist, not a soloist', ru: 'Аккомпаниатор, а не солист' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            { en: 'Listen more than you show.', ru: 'Больше слушайте, чем показывайте себя.' },
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
      heading: { en: 'Song introductions', ru: 'Вступления к песням' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'An introduction sets the tempo, key and mood. Play the chorus’s melody, or its last two lines.',
            ru: 'Вступление задаёт темп, тональность и настроение. Сыграйте мелодию припева или две его последние строки.',
          },
        },
        { kind: 'pattern', pattern: 'r5', piece: 'otche' },
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
