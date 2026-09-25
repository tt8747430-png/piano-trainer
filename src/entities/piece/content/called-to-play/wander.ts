import { definePiece } from '../../model/types'

export default definePiece({
  id: 'wander',
  kind: 'song',
  title: 'Long I Wandered in the Shadows',
  source: { book: 'called-to-play' },
  key: 'Am',
  meter: '4/4',
  tempo: 76,
  pattern: 'M4',
  note: {
    en: 'The final exam song. Plan your own introduction, methods and dynamics for 2 verses, then play it with a singer.',
    ru: 'Песня выпускного экзамена. Спланируйте своё вступление, способы и динамику на 2 куплета, затем сыграйте её с певцом.',
  },
  sections: [
    { kind: 'verse', lines: ['Am Dm G C', 'F Dm E E', 'Am Dm G C', 'F Dm E E'] },
    { kind: 'chorus', lines: ['Am Dm G C', 'F Dm E Am'] },
  ],
})
