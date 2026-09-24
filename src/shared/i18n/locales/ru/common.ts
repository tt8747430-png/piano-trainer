import type { LocaleResources } from '../../types'

export const common: LocaleResources['common'] = {
  appName: 'Тренажёр фортепиано',
  nav: {
    label: 'Основная навигация',
    path: 'Путь',
    songs: 'Песни',
    theory: 'Теория',
    settings: 'Настройки',
  },
  errors: { title: 'Что-то пошло не так', reload: 'Перезагрузить' },
  notFound: { title: 'Страница не найдена', toSongs: 'К песням' },
  update: { available: 'Готова новая версия', update: 'Обновить', later: 'Позже' },
}
