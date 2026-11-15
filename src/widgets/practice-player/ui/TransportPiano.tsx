import { EyeOff, Hand, Piano } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useMidiSummary } from '@/features/connect-midi'
import { PianoSheet } from '@/features/live-keyboard'
import { SONG_RANGES, type CameraAngle, type SongRange } from '@/shared/lib'
import type { KeyRange } from '@/shared/lib/music'
import { FloatingBarButton } from '@/shared/ui'
import { DOCK_CAPTIONED } from './dock-sizes'

/**
 * The transport's Keyboard, opening the Piano sheet: its button says what stands in the keys' place
 * (2D · 3D · Off) under its picture.
 */
export function TransportPiano({
  keys,
  hands,
  onKeys,
  onHands,
  stage,
  range,
}: {
  keys: boolean
  hands: boolean
  onKeys: (shown: boolean) => void
  onHands: (shown: boolean) => void
  /** The 3D piano's own rows, in its card while it is chosen: Angle, Hands on the keys. */
  stage: {
    readonly angle: CameraAngle
    readonly onAngle: (angle: CameraAngle) => void
    readonly handsOnKeys: boolean
    readonly onHandsOnKeys: (shown: boolean) => void
  }
  /** How many keys stand in the keys' place (Range), and the keys that makes. */
  range: {
    readonly value: SongRange
    readonly keys: KeyRange
    readonly onChange: (range: SongRange) => void
  }
}) {
  const { t } = useTranslation(['common', 'player'])
  const midi = useMidiSummary()
  const Icon = !keys ? EyeOff : hands ? Hand : Piano
  return (
    <PianoSheet
      keys={keys}
      hands={hands}
      onKeys={onKeys}
      onHands={onHands}
      stage={stage}
      range={{
        value: range.value,
        options: SONG_RANGES.map((each) => ({
          value: each,
          label: t(`player:pianoSheet.songRanges.${each}`),
        })),
        low: range.keys.from,
        high: range.keys.to,
        onChange: range.onChange,
      }}
      midi={midi}
      trigger={(open) => (
        <FloatingBarButton
          label={t('common:keyboardTools.keyboard')}
          caption={t(`common:keyboardTools.short.${keys ? (hands ? 'hands' : 'keys') : 'off'}`)}
          aria-haspopup="dialog"
          className={DOCK_CAPTIONED}
          onClick={open}
        >
          <Icon aria-hidden />
        </FloatingBarButton>
      )}
    />
  )
}
