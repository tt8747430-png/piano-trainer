import { useTranslation } from 'react-i18next'
import type { DiagramChord } from '@/features/practice'
import { noteName } from '@/shared/lib/music'
import { KeyDiagram } from '@/shared/ui'

/**
 * A chord of the music drawn as its keys (ADR 0099), named for a screen reader by its symbol and the
 * notes it marks ("C#m7: B E G#"); `muted`, greyed (the next chord). It takes its container's width.
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
      label={t('chordDiagram', { symbol: chord.symbol, notes })}
      muted={muted}
      className={className}
    />
  )
}
