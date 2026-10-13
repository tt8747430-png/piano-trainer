import { useTranslation } from 'react-i18next'
import { followsInversion, usePatternBook } from '@/entities/pattern'
import { INVERSIONS, type Inversion } from '@/shared/lib/music'
import { INVERSION_NAMES, InversionGlyph, Segmented, SwitchRow } from '@/shared/ui'
import { useSetup } from './setup-context'

/** The glyphs show a 7th chord's four notes: the Player's chords reach a 3rd inversion. */
const GLYPH_NOTES = 4

/**
 * Where the right hand's chord stands: the first chord's inversion, Root to 3rd, each drawn as its
 * stack of notes; and Nearest, on unless turned off: each chord after the first moves to the nearest
 * voicing, else every one stays in the first one's inversion. Under a pattern that plays its own
 * shapes both show, faded, with a line saying why.
 */
export function InversionField() {
  const { t } = useTranslation(['player', 'music'])
  const { figures, onFigures } = useSetup()
  const follows = followsInversion(usePatternBook(), figures)
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-muted-foreground">{t('player:inversion.label')}</span>
      <Segmented<Inversion>
        label={t('player:inversion.label')}
        disabled={!follows}
        value={figures.inversion ?? 0}
        options={INVERSIONS.map((inversion) => ({
          value: inversion,
          label: t(`music:inversion.${INVERSION_NAMES[inversion]}`),
          icon: <InversionGlyph notes={GLYPH_NOTES} inversion={inversion} />,
        }))}
        onChange={(value) => onFigures({ inversion: value === 0 ? undefined : value })}
      />
      <SwitchRow
        className="border-b-0"
        label={t('player:inversion.nearest')}
        detail={t(figures.nearest ? 'player:inversion.nearestOn' : 'player:inversion.nearestOff')}
        checked={figures.nearest}
        disabled={!follows}
        onCheckedChange={(on) => onFigures({ nearest: on ? undefined : false })}
      />
      {follows ? null : (
        <p className="text-sm text-muted-foreground">{t('player:inversion.own')}</p>
      )}
    </div>
  )
}
