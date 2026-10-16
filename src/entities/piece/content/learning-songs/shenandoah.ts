import { definePiece } from '../../model/types'

export default definePiece({
  id: 'shenandoah',
  kind: 'song',
  title: 'Shenandoah',
  credits: [{ role: 'music', names: 'Traditional' }],
  key: 'C',
  meter: '4/4',
  tempo: 72,
  pattern: 'ballad',
  note: {
    en: 'An American sea shanty. Its last bar has only three beats.',
    ru: 'Американская матросская песня. В её последнем такте только три доли.',
  },
  sections: [{ kind: 'verse', lines: ['C@1 C F@2-C@2 F C', 'Am F C G@1-C@3 G7@1-C@2'] }],
  melody:
    'G3/1 | C4/.5 C4/.5 C4/1.5 D4/.5 E4/.5 F4/.5 | A4/2 G4/1 C5/.5 B4/.5 | A4/2.5 G4/.5 A4/.5 G4/.5 | E4/.25 G4/2.25 r/1 G4/.5 | A4/.5 A4/.5 A4/1.5 E4/.5 G4/.5 E4/.5 | D4/1 C4/1.5 r/.5 C4/.5 D4/.5 | E4/2.5 C4/.5 E4/.5 A4/.5 | G4/1 C4/.5 D4/.5 E4/1.5 C4/.5 | D4/1 C4/2',
})
