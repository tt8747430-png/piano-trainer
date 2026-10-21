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
    en: 'The workbook leaves the accompaniment plan for this song to you. Use the earlier songs as a model.',
    ru: 'План аккомпанемента для этой песни учебник оставляет вам. Возьмите за образец предыдущие песни.',
  },
  sections: [
    { kind: 'verse', lines: ['Dm Gm', 'A Dm', 'Dm Gm', 'C F-A'] },
    { kind: 'chorus', lines: ['Dm Gm', 'C F-A', 'Dm Gm', 'Dm-A Dm'] },
  ],
})
