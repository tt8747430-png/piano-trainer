import { cn } from '@/shared/lib'
import { symbolParts } from '@/shared/lib/music'

/**
 * A chord's symbol in a line of text, set as the reference app sets it: the root in soft ink, the
 * quality strong (`D m`, `C maj7`), its extensions raised, the bass after a slash soft again. Its
 * text is the symbol as printed (`C♯m7`), so it reads as one word.
 */
export function ChordText({ symbol, className }: { symbol: string; className?: string }) {
  const { root, letters, raised, bass } = symbolParts(symbol)
  return (
    <span className={cn('whitespace-nowrap', className)}>
      <span className="text-muted-foreground">{root}</span>
      <span className="font-semibold text-foreground">
        {letters}
        {raised ? <sup className="text-[0.7em]">{raised}</sup> : null}
      </span>
      {bass ? <span className="text-muted-foreground">{bass}</span> : null}
    </span>
  )
}
