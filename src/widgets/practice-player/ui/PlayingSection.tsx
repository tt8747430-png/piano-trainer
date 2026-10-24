import { AudioLines, Metronome, Timer, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  PLAYING_TOGGLES,
  selectPractice,
  useSettings,
  useSettingsStoreApi,
  type PracticeToggle,
} from '@/entities/settings'
import { setPracticeToggle } from '@/features/set-preference'
import { MenuSection, ToggleGrid, ToggleTile } from '@/shared/ui'

/** What each saved toggle looks like on its tile. */
const TOGGLE_ICON: Readonly<Record<(typeof PLAYING_TOGGLES)[number], LucideIcon>> = {
  metronome: Metronome,
  countIn: Timer,
} satisfies Partial<Record<PracticeToggle, LucideIcon>>

/**
 * How the Player plays, the Setup's last section (ADR 0085), a grid of tiles: the saved toggles
 * (the metronome, the count-in), swing (null where the meter cannot swing), and the music's own
 * tiles after them (`children`: a piece's melody and recording); `info`, why a tile of the music's is
 * closed, beside its heading (ADR 0096). What the sheet shows is the View menu's.
 */
export function PlayingSection({
  swing,
  onSwing,
  info,
  children,
}: {
  swing: boolean | null
  onSwing: (on: boolean) => void
  info?: ReactNode
  children?: ReactNode
}) {
  const { t } = useTranslation('player')
  const settings = useSettingsStoreApi()
  const toggles = useSettings(selectPractice)
  return (
    <MenuSection title={t('playing')} info={info}>
      <ToggleGrid label={t('playing')}>
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
        {children}
      </ToggleGrid>
    </MenuSection>
  )
}
