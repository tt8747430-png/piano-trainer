import type { LocaleResources } from '../../types'

export const songs: LocaleResources['songs'] = {
  title: 'Песни',
  search: 'Поиск песен',
  collection: 'Сборник',
  all: 'Все',
  noChart: 'Аккордов пока нет',
  learned: 'Выучено',
  empty: 'Ничего не найдено.',
  yours: 'Ваши песни',
  mineEmpty: {
    title: 'Своих песен пока нет',
    description: 'Запишите песню аккордами или сыграйте её на клавишах.',
  },
  newSong: 'Новая песня',
  making: {
    title: 'Новая песня',
    name: 'Название',
    meter: 'Размер',
    make: 'Создать',
    makeAndRecord: 'Записать',
  },
  withChords: 'С аккордами',
  clearFilters: 'Сбросить фильтры',
  shared: {
    title: 'Песня по ссылке',
    reading: 'Читаем песню…',
    facts: '{{key}} · {{meter}} · {{tempo}} уд/мин',
    add: 'Добавить к вашим песням',
    says: 'Добавьте её к вашим песням, чтобы разучивать.',
    none: 'В этой ссылке нет песни: возможно, она обрезана.',
    toSongs: 'К песням',
  },
}
