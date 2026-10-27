import { Children, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { SWING_FEELS, type SwingFeel } from '@/shared/lib/schedule'
import { Labelled, MenuSection, PictureTiles } from '@/shared/ui'
import { SwingPicture } from './SwingPicture'

/**
 * How the Player plays, the Setup's last section (ADR 0085, 0115): Swing, how late the second of each
 * pair of 8ths comes, one of four tiles each drawing its beat (null where the meter cannot swing),
 * what it does its ⓘ; then the music's own (`children`: a piece's Melody). Nothing where it has
 * neither. The count-in and the click are the transport's Sound's (ADR 0105), what the sheet shows
 * the View menu's.
 */
export function PlayingSection({
  swing,
  onSwing,
  children,
}: {
  swing: SwingFeel | null
  onSwing: (feel: SwingFeel) => void
  children?: ReactNode
}) {
  const { t } = useTranslation('player')
  if (swing === null && Children.toArray(children).length === 0) return null
  return (
    <MenuSection title={t('playing')} className="gap-5">
      {swing === null ? null : (
        <Labelled label={t('swing.label')} info={t('swing.about')}>
          <PictureTiles
            label={t('swing.label')}
            value={swing}
            columns={4}
            tiles={SWING_FEELS.map((feel) => ({
              value: feel,
              label: t(`swing.${feel}`),
              picture: <SwingPicture feel={feel} />,
            }))}
            onChange={onSwing}
          />
        </Labelled>
      )}
      {children}
    </MenuSection>
  )
}
