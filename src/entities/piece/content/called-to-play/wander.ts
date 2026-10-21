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
    en: 'The final exam song. Make your own plan for two verses: the introduction, the ways and the dynamics. Then play it with a singer.',
    ru: 'Песня выпускного экзамена. Составьте свой план на два куплета: вступление, способы и динамику. Затем сыграйте её вместе с певцом.',
  },
  sections: [
    { kind: 'verse', n: 1, lines: ['Am Dm G C', 'F Dm E E', 'Am Dm G C', 'F Dm E E'] },
    { kind: 'chorus', lines: ['Am Dm G C', 'F Dm E Am'] },
    { kind: 'verse', n: 2, lines: ['Am Dm G C', 'F Dm E E', 'Am Dm G C', 'F Dm E E'] },
  ],
})
