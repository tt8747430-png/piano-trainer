/** The words sung in a beat of a bar (ADR 0108): a word the next beat goes on with hyphened. */
export interface BeatWords {
  /** The beat they start in, from 0. */
  readonly beat: number
  readonly text: string
}

/** A bar's words under its beats, verse by verse, verse 1 first: a verse sung nowhere there empty. */
export type BarWords = readonly (readonly BeatWords[])[]
