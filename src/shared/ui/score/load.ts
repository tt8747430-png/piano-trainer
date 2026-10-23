/** The score view's module, loaded on its own the first time a staff is shown, its engraver warming as it loads. */
export const loadScoreView = () =>
  Promise.all([
    import('./ScoreView'),
    import('./verovio/engine').then((engine) => engine.warmEngraver()),
  ]).then(([module]) => module)
