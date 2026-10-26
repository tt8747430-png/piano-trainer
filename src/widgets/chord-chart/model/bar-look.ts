import { printedSymbol } from '@/shared/lib/music'

/** A bar of the chart: a barline before it, its beats in a grid of their own. */
export const BAR = 'relative grid min-w-0 auto-rows-min border-l-2 border-foreground'

/** All a bar prints, as it prints it, for its name: its chords, and the notes under them. */
export const barWords = (symbols: readonly string[], notes: readonly string[]): string =>
  [symbols.map(printedSymbol).join(' '), ...notes].filter((said) => said !== '').join(' · ')
