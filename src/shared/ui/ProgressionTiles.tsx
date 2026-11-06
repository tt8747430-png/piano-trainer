import { chordRole, numeralsLine, numeralText, type Numeral } from '@/shared/lib/music'
import { cn } from '@/shared/lib'
import { Glyph } from './Glyph'
import { PAINT, ROLE_PAINT } from './paint'

/**
 * A progression's chords as small tiles, each tinted by its role in the key (A23, DESIGN.md, Harmony:
 * home grass, away sand, tension lilac), the picture of a progression's row in place of a list icon.
 * Read out once, as its numerals.
 */
export function ProgressionTiles({
  numerals,
  minor,
}: {
  numerals: readonly Numeral[]
  minor: boolean
}) {
  return (
    <span role="img" aria-label={numeralsLine(numerals)} className="flex flex-wrap gap-1">
      {numerals.map((numeral, at) => {
        const look = PAINT[ROLE_PAINT[chordRole(numeral, minor).role]]
        return (
          <Glyph
            key={at}
            text={numeralText(numeral)}
            className={cn(
              'grid h-7 min-w-8 place-items-center rounded-control px-1.5 text-sm font-semibold',
              look.fill,
              look.ink,
            )}
          />
        )
      })}
    </span>
  )
}
