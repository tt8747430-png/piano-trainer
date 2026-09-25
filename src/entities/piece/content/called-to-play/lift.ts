import { definePiece } from '../../model/types'

export default definePiece({
  id: 'lift',
  kind: 'song',
  title: 'I Lift My Eyes to Heaven',
  source: { book: 'called-to-play' },
  key: 'Dm',
  meter: '4/4',
  tempo: 76,
  pattern: 'M1',
  note: {
    en: 'The workbook asks you to make your own accompaniment plan for this song, based on the earlier songs.',
    ru: 'Учебник предлагает составить свой план аккомпанемента для этой песни по образцу предыдущих.',
  },
  sections: [
    { kind: 'verse', lines: ['Dm Gm', 'A Dm', 'Dm Gm', 'C F-A'] },
    { kind: 'chorus', lines: ['Dm Gm', 'C F-A', 'Dm Gm', 'Dm-A Dm'] },
  ],
})
