import type { LocaleResources } from '../../types'

export const common: LocaleResources['common'] = {
  appName: 'Тренажёр фортепиано',
  back: 'Назад',
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
  close: 'Закрыть',
  level: 'Уровень {{level}}',
  levelName: { 1: 'Начальный', 2: 'Базовый', 3: 'Средний', 4: 'Продвинутый' },
  rating: { known: 'Знаю', gap: 'Пробел', unknown: 'Ещё не проверено' },
  roles: {
    root: 'Основной тон',
    '3rd': 'Терция',
    '5th': 'Квинта',
    '7th': 'Септима',
    '9th': 'Нона',
    '11th': 'Ундецима',
    '13th': 'Терцдецима',
  },
  hands: { both: 'Обе руки', rh: 'Правая рука', lh: 'Левая рука' },
  note: { natural: '{{letter}}{{octave}}', sharp: '{{letter}}-диез {{octave}}' },
  keyboard: 'Клавиатура',
}
