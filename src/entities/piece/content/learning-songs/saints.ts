import { definePiece } from '../../model/types'

export default definePiece({
  id: 'saints',
  kind: 'song',
  title: 'When the Saints Go Marching In',
  titleRu: 'Когда святые маршируют',
  credits: [{ role: 'music', names: 'Traditional' }],
  key: 'C',
  meter: '4/4',
  tempo: 112,
  pattern: 'gospel',
  sections: [{ kind: 'verse', lines: ['C@3 C C C C', 'C C G G7', 'C C7 F F', 'C C-G7 C'] }],
  melody:
    'C4/1 E4/1 F4/1 | G4/4 | r/1 C4/1 E4/1 F4/1 | G4/4 | r/1 C4/1 E4/1 F4/1 | G4/2 E4/2 | C4/2 E4/2 | D4/4 | r/1 E4/1 E4/1 D4/1 | C4/4 | E4/2 G4/2 | G4/1 F4/3 | r/2 E4/1 F4/1 | G4/2 E4/2 | C4/2 D4/2 | C4/4',
})
