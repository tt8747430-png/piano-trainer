import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { noteOnTop } from '@/features/play-example'
import {
  TENSION_GROUPS,
  tensionTones,
  type SpelledNote,
  type TensionChord,
  type TensionTone,
} from '@/shared/lib/music'
import type { ShownKeys } from '@/shared/ui'
import { tensionChord, tensionMark } from '../model/tension-keys'
import { TensionGroupCard } from './TensionGroupCard'

/**
 * What a 7th chord takes on top: its twelve notes in the owner's table's four groups (weak, strong,
 * tensions, avoid), each a chip that plays the chord in root position with that note over it.
 */
export function ChordTensions({
  root,
  quality,
  isPlaying,
  onPlay,
}: {
  root: SpelledNote
  quality: TensionChord
  isPlaying: (tone: TensionTone) => boolean
  /** A note chosen: the chord with it on top, as the page's keys show it. */
  onPlay: (tone: TensionTone, shown: ShownKeys) => void
}) {
  const { t } = useTranslation('learn')
  const id = useId()
  const tones = tensionTones(root, quality)
  const chord = tensionChord(root, quality)
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="text-2xl">
        {t('tensions.title')}
      </h2>
      <div className="grid-fields gap-4">
        {TENSION_GROUPS.map((group) => (
          <TensionGroupCard
            key={group}
            group={group}
            tones={tones.filter((tone) => tone.group === group)}
            isPlaying={isPlaying}
            onPlay={(tone) => onPlay(tone, noteOnTop(chord, tone.pitchClass, tensionMark(tone)))}
          />
        ))}
      </div>
    </section>
  )
}
