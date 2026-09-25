import { definePiece } from '../../model/types'

export default definePiece({
  id: 'blues',
  kind: 'progression',
  title: 'Блюз, 12 тактов',
  titleEn: '12-bar blues',
  key: 'G',
  meter: '4/4',
  tempo: 72,
  pattern: 'blues',
  voicing: { default: 'sevenths', choosable: true },
  progression: 'I:dom:16 IV:dom:8 I:dom:8 V:dom:4 IV:dom:4 I:dom:4 V:dom:4',
  note: { en: 'Great with the blues scale on top.', ru: 'Хорошо звучит с блюзовой гаммой сверху.' },
})
