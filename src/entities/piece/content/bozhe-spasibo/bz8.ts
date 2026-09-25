import { definePiece } from '../../model/types'

export default definePiece({
  id: 'bz8',
  kind: 'song',
  title: 'Есть Тот, Чьею силой Вселенная дышит',
  titleEn: 'There is One whose power keeps the universe alive',
  credits: [
    { role: 'words', names: 'А. Кетлер, А. В. Зименс' },
    { role: 'music', names: 'А. В. Зименс' },
  ],
  source: { book: 'bozhe-spasibo', number: 8, page: 24 },
  key: 'Gm',
  meter: '3/4',
  tempo: 100,
  pattern: 'r2',
  sections: [
    { kind: 'verse', lines: ['Gm D/F# Cm/Eb Gm/D', 'Cm Gm/Bb A D', 'Gm G G C7', 'Cm Gm D7 Gm'] },
    { kind: 'chorus', lines: ['G7 G7 G7 Cm', 'F F F Bb', 'Cm D Gm Eb', 'Cm D G G'] },
    { kind: 'ending', last: true, lines: ['Ab D G G'] },
  ],
})
