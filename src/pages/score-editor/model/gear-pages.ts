/**
 * The pages of the editor's one gear (R31-E, Flat's one menu): its first page (`main`) with the
 * score's acts, then the pages they and its Settings turn to, each with Back to the page it came
 * from (`GEAR_PARENTS`).
 */
export const GEAR_PAGES = [
  'main',
  'view',
  'transpose',
  'record',
  'credits',
  'music',
  'staves',
  'key',
  'time',
  'tempo',
  'bars',
  'howItWorks',
  'layout',
  'input',
  'recording',
] as const
export type GearPage = (typeof GEAR_PAGES)[number]

/** The page a page's Back goes to: Music's and How the editor works' own pages go back to them. */
export const GEAR_PARENTS: Readonly<Record<Exclude<GearPage, 'main'>, GearPage>> = {
  view: 'main',
  transpose: 'main',
  record: 'main',
  credits: 'main',
  music: 'main',
  staves: 'music',
  key: 'music',
  time: 'music',
  tempo: 'music',
  bars: 'music',
  howItWorks: 'main',
  layout: 'howItWorks',
  input: 'howItWorks',
  recording: 'howItWorks',
}

/** Where Back goes from a page: the page it was turned from, or the sheet shut from its first. */
export const gearBack = (page: GearPage): GearPage | null =>
  page === 'main' ? null : GEAR_PARENTS[page]
