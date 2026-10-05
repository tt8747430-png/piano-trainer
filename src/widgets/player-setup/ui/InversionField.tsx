import { ChevronsDownUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { followsInversion, usePatternBook } from '@/entities/pattern'
import { INVERSIONS, type Inversion } from '@/shared/lib/music'
import { INVERSION_NAMES, InversionGlyph, Segmented } from '@/shared/ui'
import { useSetup } from './setup-context'

/** No inversion kept: each chord voiced nearest the last. */
const NEAREST = 'nearest'
/** The glyphs show a 7th chord's four notes: the Player's chords reach a 3rd inversion. */
const GLYPH_NOTES = 4

/**
 * The inversion the right hand's chord keeps: Nearest (each chord nearest the last), or Root to 3rd
 * every time, each drawn as its stack of notes. Under a pattern that plays its own shapes it shows,
 * faded, with a line saying why.
 */
export function InversionField() {
  const { t } = useTranslation(['player', 'music'])
  const { figures, onFigures } = useSetup()
  const follows = followsInversion(usePatternBook(), figures)
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-muted-foreground">{t('music:inversion.label')}</span>
      <Segmented<Inversion | typeof NEAREST>
        label={t('music:inversion.label')}
        disabled={!follows}
        value={figures.inversion ?? NEAREST}
        options={[
          {
            value: NEAREST,
            label: t('player:inversion.nearest'),
            icon: <ChevronsDownUp aria-hidden className="size-7" />,
          },
          ...INVERSIONS.map((inversion) => ({
            value: inversion,
            label: t(`music:inversion.${INVERSION_NAMES[inversion]}`),
            icon: <InversionGlyph notes={GLYPH_NOTES} inversion={inversion} />,
          })),
        ]}
        onChange={(value) => onFigures({ inversion: value === NEAREST ? undefined : value })}
      />
      {follows ? null : (
        <p className="text-sm text-muted-foreground">{t('player:inversion.own')}</p>
      )}
    </div>
  )
}
