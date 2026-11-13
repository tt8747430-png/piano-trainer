import type { LocaleResources } from '../../types'

export const search: LocaleResources['search'] = {
  title: 'Поиск',
  field: 'Искать везде',
  placeholder: 'Песни, аккорды, гаммы, уроки…',
  none: 'По запросу «{{query}}» ничего не найдено',
  noneHint:
    'Проверьте написание или введите название песни, аккорд, например Cmaj7, или гамму, например ре минор.',
  clear: 'Очистить поиск',
  archived: 'В архиве',
  recent: 'Недавние запросы',
  suggested: 'Подсказки',
  hint: 'Стрелки вверх и вниз — по результатам, Enter открывает, Escape закрывает.',
  everywhere: 'Искать везде',
  groups: {
    practice: 'Практика',
    songs: 'Песни',
    folders: 'Папки',
    lessons: 'Уроки',
  },
}
