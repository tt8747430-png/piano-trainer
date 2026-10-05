import { AudioLines, Hand, Metronome, Timer, Type, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  PLAYING_TOGGLES,
  selectPractice,
  useSettings,
  useSettingsStoreApi,
  type PracticeToggle,
} from '@/entities/settings'
import { setPracticeToggle } from '@/features/set-preference'
import { ToggleTile } from '@/shared/ui'

/** What each saved toggle looks like on its tile. */
const TOGGLE_ICON: Readonly<Record<(typeof PLAYING_TOGGLES)[number], LucideIcon>> = {
  fingerNumbers: Hand,
  namedNotes: Type,
  metronome: Metronome,
  countIn: Timer,
} satisfies Partial<Record<PracticeToggle, LucideIcon>>

/**
 * How the Player plays, as tiles for the Setup's grid: swing (null where the meter cannot swing),
 * and the saved toggles (finger numbers, named notes, the metronome, the count-in).
 */
export function PlayingToggles({
  swing,
  onSwing,
}: {
  swing: boolean | null
  onSwing: (on: boolean) => void
}) {
  const { t } = useTranslation('player')
  const settings = useSettingsStoreApi()
  const toggles = useSettings(selectPractice)
  return (
    <>
      {PLAYING_TOGGLES.map((toggle) => (
        <ToggleTile
          key={toggle}
          label={t(`toggles.${toggle}`)}
          icon={TOGGLE_ICON[toggle]}
          pressed={toggles[toggle]}
          onPressedChange={(on) => setPracticeToggle(settings, toggle, on)}
        />
      ))}
      {swing === null ? null : (
        <ToggleTile
          label={t('toggles.swing')}
          icon={AudioLines}
          pressed={swing}
          onPressedChange={onSwing}
        />
      )}
    </>
  )
}
