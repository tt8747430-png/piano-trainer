import { definePiece } from '../../model/types'

export default definePiece({
  id: 'minuet-g',
  kind: 'song',
  title: 'Minuet in G',
  titleRu: 'Менуэт соль мажор',
  credits: [{ role: 'music', names: 'Christian Petzold' }],
  key: 'G',
  meter: '3/4',
  tempo: 100,
  pattern: 'block',
  note: {
    en: 'BWV Anh. 114, from the Notebook for Anna Magdalena Bach. It was long credited to Bach. Here you play its first part twice.',
    ru: 'BWV Anh. 114 из Нотной тетради Анны Магдалены Бах. Долгое время его считали сочинением Баха. Здесь его первая часть звучит дважды.',
  },
  sections: [
    { kind: 'part', label: 'A', lines: ['G G C G', 'Am G D@1-G@2 D'] },
    { kind: 'part', label: 'A', lines: ['G G C G', 'Am G D G'] },
  ],
  melody:
    'D5/1 G4/.5 A4/.5 B4/.5 C5/.5 | D5/1 G4/1 G4/1 | E5/1 C5/.5 D5/.5 E5/.5 F#5/.5 | G5/1 G4/1 G4/1 | C5/1 D5/.5 C5/.5 B4/.5 A4/.5 | B4/1 C5/.5 B4/.5 A4/.5 G4/.5 | F#4/1 G4/.5 A4/.5 B4/.5 G4/.5 | A4/3 | D5/1 G4/.5 A4/.5 B4/.5 C5/.5 | D5/1 G4/1 G4/1 | E5/1 C5/.5 D5/.5 E5/.5 F#5/.5 | G5/1 G4/1 G4/1 | C5/1 D5/.5 C5/.5 B4/.5 A4/.5 | B4/1 C5/.5 B4/.5 A4/.5 G4/.5 | A4/1 B4/.5 A4/.5 G4/.5 F#4/.5 | G4/3',
})
