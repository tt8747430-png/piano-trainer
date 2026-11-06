import { useTranslation } from 'react-i18next'
import {
  modeVamp,
  printedChord,
  scaleChordAt,
  type ScaleKind,
  type SpelledNote,
} from '@/shared/lib/music'
import { usePlayback } from '@/shared/lib/services'
import { PlayButton } from '@/shared/ui'
import { vampSounds } from '../model/vamp'

/**
 * A mode's vamp (A43, *The Secret of Modes*): the two or three chords that make it sound itself,
 * named and played round twice. Nothing for a scale with no vamp of its own.
 */
export function ModeVamp({ root, kind }: { root: SpelledNote; kind: ScaleKind }) {
  const { t } = useTranslation('practice')
  const playback = usePlayback<'vamp'>()
  const degrees = modeVamp(kind)
  if (degrees.length === 0) return null
  const chords = degrees
    .map((degree) => printedChord(scaleChordAt(root, kind, degree, 3)))
    .join(' – ')
  return (
    <div className="flex items-center gap-3">
      <PlayButton
        label={t('scales.vamp.play', { chords })}
        playing={playback.playing === 'vamp'}
        onClick={() => playback.toggle('vamp', () => vampSounds(root, kind))}
      />
      <p className="flex min-w-0 flex-col">
        <span className="font-semibold">{t('scales.vamp.label')}</span>
        <span className="text-sm text-muted-foreground">{chords}</span>
      </p>
    </div>
  )
}
