/**
 * What of the score the View offers (ADR 0099): the sheet music's every part; the Player's other
 * views of the music have fewer.
 */
export const SCORE_PARTS = ['layout', 'staves', 'chordNames', 'lyrics', 'fingers'] as const
export type ScorePart = (typeof SCORE_PARTS)[number]
