import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useSettingsStoreApi } from '@/entities/settings'
import { setDrone } from '@/features/set-preference'
import {
  modeVamp,
  pitchClassOf,
  printedNote,
  printedChord,
  scaleChordAt,
  type ScaleKind,
  type SpelledNote,
} from '@/shared/lib/music'
import { usePlayback } from '@/shared/lib/services'
import { ButtonLink, PlayButton } from '@/shared/ui'
import { vampSounds } from '../model/vamp'

/**
 * A mode's vamp (A43, *The Secret of Modes*): the two or three chords that make it sound itself,
 * named and played round twice; and the Drone, its tonic held to play the mode over. Nothing for a
 * scale with no vamp of its own.
 */
export function ModeVamp({ root, kind }: { root: SpelledNote; kind: ScaleKind }) {
  const { t } = useTranslation('practice')
  const playback = usePlayback<'vamp'>()
  const store = useSettingsStoreApi()
  const degrees = modeVamp(kind)
  if (degrees.length === 0) return null
  const chords = degrees
    .map((degree) => printedChord(scaleChordAt(root, kind, degree, 3)))
    .join(' – ')
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
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
      {/* The tonic held under the mode: the Drone opens on it, its kind and octave as left. */}
      <ButtonLink
        variant="soft"
        className="rounded-pill"
        onClick={() => setDrone(store, { root: pitchClassOf(root) })}
        render={<Link to="/practice/drone" />}
      >
        {t('scales.vamp.drone', { note: printedNote(root) })}
      </ButtonLink>
    </div>
  )
}
