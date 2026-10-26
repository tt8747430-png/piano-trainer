import { AudioLines } from 'lucide-react'
import { Children, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { MenuSection, ToggleGrid, ToggleTile } from '@/shared/ui'

/**
 * How the Player plays, the Setup's last section (ADR 0085), a grid of tiles: swing (null where the
 * meter cannot swing), and the music's own tiles after it (`children`: a piece's tune and recording);
 * `info`, why a tile of the music's is closed, beside its heading (ADR 0096); nothing where it has no
 * tile. The count-in and the click are the transport's Sound's (ADR 0105), what the sheet shows the
 * View menu's.
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
  if (swing === null && Children.toArray(children).length === 0) return null
  return (
    <MenuSection title={t('playing')} info={info}>
      <ToggleGrid label={t('playing')}>
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
