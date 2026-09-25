import { definePiece } from '../../model/types'

export default definePiece({
  id: 'bz15',
  kind: 'song',
  title: 'Ты Христос, умирая',
  titleEn: 'Christ, as You were dying',
  credits: [
    { role: 'words', names: 'Vera Võlegžanina' },
    { role: 'music', names: 'Edvard Vedzis' },
  ],
  source: { book: 'bozhe-spasibo', number: 15, page: 43 },
  key: 'Am',
  meter: '12/8',
  tempo: 56,
  pattern: 'r1',
  sections: [
    { kind: 'verse', lines: ['Am7-F/A G-Em/G F-Bdim Esus4-E7', 'Am7-F/A G-Em/G F-Bdim Esus4-E7'] },
    { kind: 'chorus', lines: ['Am G Dm-Bdim Esus4-E7', 'Am G Dm-Bdim Esus4-E7'] },
    { kind: 'ending', lines: ['Am-F/A G-Em/G F-Bdim Esus4-E7'] },
  ],
})
