import { definePiece } from '../../model/types'

export default definePiece({
  id: 'minor251',
  kind: 'progression',
  title: 'iiø–V7♭9–i',
  key: 'Gm',
  meter: '4/4',
  tempo: 72,
  pattern: 'jazz',
  voicing: { default: 'ninths', choosable: true },
  progression: 'ii:hd:4 V:domb9:4 i:min:8',
  note: {
    en: 'The minor cadence. The ♭9 of the dominant belongs to the minor key, so it pulls into the minor chord.',
    ru: 'Минорная каденция. ♭9 доминанты принадлежит минорной тональности, поэтому тянет в минорный аккорд.',
  },
})
