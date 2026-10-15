import { definePiece } from '../../model/types'

export default definePiece({
  id: 'twinkle',
  kind: 'song',
  title: 'Twinkle, Twinkle, Little Star',
  titleRu: 'Мерцай, мерцай, звёздочка',
  credits: [
    { role: 'words', names: 'Jane Taylor' },
    { role: 'music', names: 'Traditional' },
  ],
  key: 'C',
  meter: '4/4',
  tempo: 92,
  pattern: 'block',
  note: {
    en: 'The French tune «Ah ! vous dirai-je, maman», which Mozart wrote his variations on.',
    ru: 'Французская мелодия «Ah ! vous dirai-je, maman», на которую Моцарт написал вариации.',
  },
  sections: [
    { kind: 'part', label: 'A', lines: ['C F-C F-C G-C'] },
    { kind: 'part', label: 'B', lines: ['C-F C-G C-F C-G'] },
    { kind: 'part', label: 'A', lines: ['C F-C F-C G-C'] },
  ],
  melody:
    'C4/1 C4/1 G4/1 G4/1 | A4/1 A4/1 G4/2 | F4/1 F4/1 E4/1 E4/1 | D4/1 D4/1 C4/2 | G4/1 G4/1 F4/1 F4/1 | E4/1 E4/1 D4/2 | G4/1 G4/1 F4/1 F4/1 | E4/1 E4/1 D4/2 | C4/1 C4/1 G4/1 G4/1 | A4/1 A4/1 G4/2 | F4/1 F4/1 E4/1 E4/1 | D4/1 D4/1 C4/2',
})
