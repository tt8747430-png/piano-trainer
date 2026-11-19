import { cn } from '@/shared/lib'
import { printedSymbol, type PlacedScaleChord } from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { LeadSymbol, MiniKeys } from '@/shared/ui'

/** A chord's play is its own: after the scale changes, no chord of the new ones is pressed. */
const idOf = (placed: PlacedScaleChord) =>
  `${placed.chord.degree} ${placed.symbol} ${placed.tones.map((tone) => tone.midi).join('-')}`

/**
 * A scale's chords as cards (the Scales board's SCCARDS, the songs' CHORDS_ROW): each its keys over its
 * symbol and its numeral, all on one stretch of keys; a tap plays it, ringed in honey while it sounds.
 * One column a degree (a minor key's V stacks over its v); on a phone a strip that scrolls sideways, from
 * 40rem the seven in a row.
 */
export function ScaleChordGrid({ chords }: { chords: readonly PlacedScaleChord[] }) {
  const playback = usePlayback<string>()
  const columns = chords.reduce<PlacedScaleChord[][]>((all, placed) => {
    const last = all.at(-1)
    if (last?.[0]?.chord.degree === placed.chord.degree) last.push(placed)
    else all.push([placed])
    return all
  }, [])
  if (chords.length === 0) return null
  return (
    <div className="-mx-gutter flex gap-2 overflow-x-auto px-gutter py-0.5 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-7 sm:overflow-visible sm:p-0">
      {columns.map((column) => (
        <div key={column.map(idOf).join('|')} className="flex shrink-0 flex-col gap-2">
          {column.map((placed) => {
            const id = idOf(placed)
            const playing = playback.playing === id
            const symbol = printedSymbol(placed.symbol)
            const keys = placed.tones.map((tone) => tone.midi)
            return (
              <button
                key={id}
                type="button"
                aria-pressed={playing}
                aria-label={`${symbol}, ${placed.numeral}`}
                onClick={() => playback.toggle(id, () => chordSounds(keys, { arpeggio: false }))}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-card bg-card p-3 ring-1 ring-border transition-colors duration-150 ease-out hover:bg-muted/50',
                  playing && 'ring-2 ring-primary',
                )}
              >
                <MiniKeys keys={keys} sounding={playing} className="sm:w-full" />
                <span className="flex flex-col items-center">
                  <span className="text-base font-bold">
                    <LeadSymbol text={symbol} />
                  </span>
                  <span className="-mt-0.5 text-[0.8125rem] text-muted-foreground">
                    {placed.numeral}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
