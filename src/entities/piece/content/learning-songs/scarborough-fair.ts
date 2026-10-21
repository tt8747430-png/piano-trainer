import { definePiece } from '../../model/types'

export default definePiece({
  id: 'scarborough-fair',
  kind: 'song',
  title: 'Scarborough Fair',
  titleRu: 'Ярмарка в Скарборо',
  credits: [{ role: 'music', names: 'Traditional' }],
  key: 'Dm',
  meter: '3/4',
  tempo: 96,
  pattern: 'block',
  note: {
    en: 'An English ballad in the Dorian mode. Its B stays natural, so the chord on the fourth degree is G major, where D minor would have G minor.',
    ru: 'Английская баллада в дорийском ладу. Си в ней остаётся без бемоля, поэтому аккорд IV ступени — соль мажор, а не соль минор, как в ре миноре.',
  },
  sections: [
    {
      kind: 'verse',
      lines: ['Dm Dm C Dm', 'Dm Dm G Dm', 'Dm Dm F F', 'C C Dm C@2-F@1', 'C Dm Dm'],
    },
  ],
  melody:
    'D4/2 D4/1 | A4/2 A4/1 | E4/1.5 F4/.5 E4/1 | D4/4 A4/1 C5/1 | D5/2 C5/1 | A4/1 B4/1 G4/1 | A4/5 D5/1 | D5/2 D5/1 | C5/2 A4/1 | A4/1 G4/1 F4/1 | E4/1 C4/5 | D4/2 A4/1 | G4/2 F4/1 | E4/1 D4/1 C4/1 | D4/6',
})
