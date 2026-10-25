import { useTranslation } from 'react-i18next'
import { followsInversion, usePatternBook } from '@/entities/pattern'
import { PositionField } from '@/shared/ui'
import { useSetup } from './setup-context'

/** The Player's chords reach a 3rd inversion: its choice shows a 7th chord's four notes. */
const NOTES = 4

/**
 * Where the right hand's chord stands: the first chord's inversion (Root unless the URL says), and
 * Nearest (on unless the URL says). Under a pattern that plays its own shapes both show, faded,
 * the ⓘ beside the first chord's name saying why (ADR 0096).
 */
export function InversionField() {
  const { t } = useTranslation('player')
  const { figures, fit, onFigures } = useSetup()
  const follows = followsInversion(usePatternBook(), figures, fit.chart)
  return (
    <PositionField
      notes={NOTES}
      position={{ inversion: figures.inversion ?? 0, nearest: figures.nearest }}
      disabled={!follows}
      info={follows ? undefined : t('inversion.own')}
      onChange={({ inversion, nearest }) =>
        onFigures(
          inversion === undefined
            ? { nearest: nearest ? undefined : false }
            : { inversion: inversion === 0 ? undefined : inversion },
        )
      }
    />
  )
}
