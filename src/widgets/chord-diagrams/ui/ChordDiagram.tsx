import { useTranslation } from 'react-i18next'
import { DIAGRAM_KEYS, type DiagramChord } from '@/features/practice'
import { noteName, printedSymbol } from '@/shared/lib/music'
import { KeyDiagram } from '@/shared/ui'

/**
 * A chord of the music drawn on the diagram's keys, F3 to B4 (ADR 0108), a bass it has not a ring;
 * named for a screen reader by its symbol as printed and the notes it marks ("C♯m7: G# B C# E");
 * `muted`, greyed (the next chord). It takes its container's width.
 */
export function ChordDiagram({
  chord,
  muted = false,
  className,
}: {
  chord: DiagramChord
  muted?: boolean
  className?: string
}) {
  const { t } = useTranslation('music')
  const notes = chord.notes.map(noteName).join(' ')
  return (
    <KeyDiagram
      keys={chord.keys}
      range={DIAGRAM_KEYS}
      ring={chord.ring ?? undefined}
      label={t('chordDiagram', { symbol: printedSymbol(chord.symbol), notes })}
      muted={muted}
      className={className}
    />
  )
}
