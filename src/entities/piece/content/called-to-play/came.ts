import { definePiece } from '../../model/types'

export default definePiece({
  id: 'came',
  kind: 'song',
  title: 'You Came for Me, O Saviour',
  source: { book: 'called-to-play' },
  key: 'G',
  meter: '4/4',
  tempo: 80,
  pattern: 'M1',
  note: {
    en: 'The workbook leaves the plan for this song to you. Give each line a different way, using the earlier songs as a model.',
    ru: 'План для этой песни учебник оставляет вам. Дайте каждой строке свой способ, по образцу предыдущих песен.',
  },
  sections: [
    { kind: 'verse', lines: ['G C', 'D G', 'G C', 'D G'] },
    { kind: 'chorus', lines: ['G G', 'D G', 'G G', 'D G'] },
  ],
})
