import { useTranslation } from 'react-i18next'
import { followsInversion, usePatternBook } from '@/entities/pattern'
import { PositionField } from '@/shared/ui'
import { useSetup } from './setup-context'

/** The Player's chords reach a 3rd inversion: its choice shows a 7th chord's four notes. */
const NOTES = 4

/**
 * Where the right hand's chord stands: the first chord's inversion (Root unless the URL says), and
 * Nearest (on unless the URL says). Under a pattern that plays its own shapes both show, faded,
 * with a line saying why.
 */
export function InversionField() {
  const { t } = useTranslation('player')
  const { figures, onFigures } = useSetup()
  const follows = followsInversion(usePatternBook(), figures)
  return (
    <div className="flex flex-col gap-2">
      <PositionField
        notes={NOTES}
        position={{ inversion: figures.inversion ?? 0, nearest: figures.nearest }}
        disabled={!follows}
        onChange={({ inversion, nearest }) =>
          onFigures(
            inversion === undefined
              ? { nearest: nearest ? undefined : false }
              : { inversion: inversion === 0 ? undefined : inversion },
          )
        }
      />
      {follows ? null : <p className="text-sm text-muted-foreground">{t('inversion.own')}</p>}
    </div>
  )
}
