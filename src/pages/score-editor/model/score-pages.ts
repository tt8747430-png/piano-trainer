/** The score's Settings' own pages (R29, mockup 3.3–3.10), each opened from its row. */
export const SCORE_PAGES = [
  'credits',
  'staves',
  'key',
  'time',
  'tempo',
  'bars',
  'layout',
  'input',
  'recording',
] as const
export type ScorePage = (typeof SCORE_PAGES)[number]
