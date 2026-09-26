import type { LocaleResources } from '../../types'

export const settings: LocaleResources['settings'] = {
  title: 'Настройки',
  language: { label: 'Язык', en: 'English', ru: 'Русский' },
  theme: { label: 'Тема', system: 'Как в системе', light: 'Светлая', dark: 'Тёмная' },
  keyboard: 'Клавиатура',
  midi: 'MIDI-клавиатура',
  progress: {
    label: 'Прогресс',
    reset: 'Сбросить прогресс',
    title: 'Сбросить прогресс?',
    body: 'Выученные шаги, открытые песни и ответы теста на этом устройстве будут удалены.',
    cancel: 'Отмена',
    confirm: 'Сбросить',
  },
}
