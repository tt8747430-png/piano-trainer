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
    en: 'The workbook asks you to make your own plan for this song: a different method on each line, with the earlier songs as a model.',
    ru: 'Учебник предлагает составить свой план для этой песни: на каждой строке новый способ, по образцу предыдущих песен.',
  },
  sections: [
    { kind: 'verse', lines: ['G C', 'D G', 'G C', 'D G'] },
    { kind: 'chorus', lines: ['G G', 'D G', 'G G', 'D G'] },
  ],
})
