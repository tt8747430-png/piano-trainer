import { useTranslation } from 'react-i18next'
import { useFold } from '@/features/fold-section'
import { noteOnTop } from '@/features/play-example'
import {
  TENSION_GROUPS,
  tensionTones,
  type SpelledNote,
  type TensionChord,
  type TensionTone,
} from '@/shared/lib/music'
import { FoldSection, type ShownKeys } from '@/shared/ui'
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
  const { t } = useTranslation('practice')
  const fold = useFold('chords.tensions')
  const tones = tensionTones(root, quality)
  const chord = tensionChord(root, quality)
  return (
    <FoldSection title={t('chords.tensions.title')} fold={fold}>
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
    </FoldSection>
  )
}
