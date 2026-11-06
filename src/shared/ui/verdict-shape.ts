/** How a written note was played: the verdicts a take's feedback, the sheet and the keys mark. */
export type VerdictMark = 'right' | 'wrong' | 'missed' | 'early' | 'late'

/**
 * Each verdict's shape, drawn beside its colour wherever a verdict is shown (DESIGN.md, Second Cue
 * Rule): early and late share an ink, so the shape alone tells them apart.
 */
export const VERDICT_SHAPE: Readonly<Record<VerdictMark, string>> = {
  right: '●',
  early: '◂',
  late: '▸',
  missed: '○',
  wrong: '×',
}

/** Each verdict's ink, as a CSS colour: right grass, wrong rose, early or late honey, missed faded. */
export const VERDICT_INK: Readonly<Record<VerdictMark, string>> = {
  right: 'var(--paint-full-grass)',
  wrong: 'var(--destructive)',
  early: 'var(--paint-full-yellow)',
  late: 'var(--paint-full-yellow)',
  missed: 'var(--muted-foreground)',
}
