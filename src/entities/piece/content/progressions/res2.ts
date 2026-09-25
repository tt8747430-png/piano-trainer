import { definePiece } from '../../model/types'

export default definePiece({
  id: 'res2',
  kind: 'progression',
  title: 'V7♭9 → IMaj9',
  key: 'G',
  meter: '4/4',
  tempo: 72,
  pattern: 'block',
  voicing: { default: 'ninths', choosable: false },
  progression: 'V:=b9:4 I:maj:4',
  note: {
    en: 'Resolving into major, option 2: the ♭9 adds tension and slides down to the 5th of the target.',
    ru: 'Разрешение в мажор, вариант 2: ♭9 добавляет напряжения и соскальзывает на квинту целевого аккорда.',
  },
})
