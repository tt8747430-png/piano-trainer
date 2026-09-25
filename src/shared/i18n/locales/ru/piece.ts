import type { LocaleResources } from '../../types'

export const piece: LocaleResources['piece'] = {
  title: 'Песня',
  credit: {
    authors: 'Авторы',
    'words-and-music': 'Слова и музыка',
    words: 'Слова',
    music: 'Музыка',
    'russian-text': 'Русский текст',
    harmony: 'Гармонизация',
    accompaniment: 'Аккомпанемент',
    unknown: 'Автор неизвестен',
  },
  source: { number: '№ {{n}}', page: 'с. {{n}}' },
  section: {
    intro: 'Вступление',
    verse: 'Куплет',
    verseNumbered: '{{n}}-й куплет',
    chorus: 'Припев',
    lastChorus: 'Последний припев',
    ending: 'Окончание',
    lastEnding: 'Последнее окончание',
    practice: 'Упражнение',
    hymn: 'Гимн',
    part: 'Часть',
    partLabelled: 'Часть {{label}}',
  },
}
