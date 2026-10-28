import { cn } from '@/shared/lib'
import { printedSymbol } from '@/shared/lib/music'

/** A symbol's root (`C`, `F♯`, `B♭`), its quality and extensions, and its bass after a slash. */
function symbolParts(symbol: string): {
  readonly root: string
  readonly quality: string
  readonly bass: string
} {
  const printed = printedSymbol(symbol)
  const [chord = '', bass = ''] = printed.split('/')
  const root = /^[A-G][♯♭#b𝄪𝄫]*/u.exec(chord)?.[0] ?? ''
  return { root, quality: chord.slice(root.length), bass: bass ? `/${bass}` : '' }
}

/**
 * A chord's symbol in a line of text, set as the reference app sets it: the root in soft ink, the
 * quality strong (`D m`, `C maj7`), its extensions raised, the bass after a slash soft again. Its
 * text is the symbol as printed (`C♯m7`), so it reads as one word.
 */
export function ChordText({ symbol, className }: { symbol: string; className?: string }) {
  const { root, quality, bass } = symbolParts(symbol)
  // The quality's letters on the line, its numbers and alterations raised: m7♭5 → m⁷♭⁵.
  const [, letters = '', raised = ''] = /^([a-zA-Z°ø+]*?)((?:[♯♭#b]?\d|\(|sus|add|alt).*)?$/u.exec(
    quality,
  ) ?? [quality, quality, '']
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
