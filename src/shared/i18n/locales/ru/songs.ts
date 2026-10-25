import type { LocaleResources } from '../../types'

export const songs: LocaleResources['songs'] = {
  title: 'Песни',
  search: 'Поиск песен',
  collection: 'Сборник',
  all: 'Все',
  noChart: 'Аккордов пока нет',
  empty: 'Ничего не найдено.',
  emptyQuery: 'По запросу «{{query}}» ничего не найдено.',
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
  setup: {
    title: 'Партитура',
    customize: 'Настроить',
    done: 'Готово',
    staves: 'Нотоносцы',
    choice: {
      piano: 'Фортепиано',
      staffAndPiano: 'Нотоносец и фортепиано',
      staff: 'Нотоносец',
    },
    choiceDetail: {
      piano: 'Два нотоносца фортепиано',
      staffAndPiano: 'Нотоносец над фортепиано: для голоса или другой партии',
      staff: 'Лид-шит: один нотоносец с аккордовыми символами, фортепиано скрыто',
    },
    more: 'Нотоносцы добавляют, называют и убирают прямо в партитуре.',
  },

  withChords: 'С аккордами',
  stage: 'Уровень',
  anyStage: 'Любой',
  emptyStage: 'Здесь нет песен уровня «{{stage}}».',
  emptyQueryStage: 'По запросу «{{query}}» на уровне «{{stage}}» ничего не найдено.',
  clearFilters: 'Сбросить фильтры',
  shared: {
    title: 'Песня по ссылке',
    reading: 'Читаем песню…',
    facts: '{{key}} · {{meter}} · {{bpm}}',
    add: 'Добавить к вашим песням',
    says: 'Добавьте её к вашим песням, чтобы разучивать.',
    none: 'В этой ссылке нет песни: возможно, она обрезана.',
    toSongs: 'К песням',
  },
}
