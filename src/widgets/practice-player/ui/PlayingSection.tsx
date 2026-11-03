import { Children, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { SWING_FEELS, type SwingFeel } from '@/shared/lib/schedule'
import { Labelled, MenuSection, PictureTiles } from '@/shared/ui'
import { SwingPicture } from './SwingPicture'

/**
 * Swing (ADR 0115): how late the second of each pair of 8ths comes, one of four tiles each drawing its
 * beat, what it does its ⓘ.
 */
export function SwingField({
  swing,
  onSwing,
}: {
  swing: SwingFeel
  onSwing: (feel: SwingFeel) => void
}) {
  const { t } = useTranslation('player')
  return (
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
  )
}

/**
 * How the Player plays, a walk's, progression's or exercise's Setup's last section (ADR 0115): Swing
 * (null where the meter cannot swing), then the music's own (`children`). Nothing where it has
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
      {swing === null ? null : <SwingField swing={swing} onSwing={onSwing} />}
      {children}
    </MenuSection>
  )
}
