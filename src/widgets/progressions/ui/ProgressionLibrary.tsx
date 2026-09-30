import { Link } from '@tanstack/react-router'
import { ListMusic } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PROGRESSION_LIBRARY, PROGRESSION_STYLES } from '@/entities/progression-library'
import { localText, useLocale } from '@/shared/i18n'
import {
  keyParam,
  numeralsParam,
  numeralText,
  parseNumerals,
  type Key,
  type ChordSize,
} from '@/shared/lib/music'
import { RowGroup, RowLink } from '@/shared/ui'

/** The library by style: each progression a row that opens it in the tool, in the same tonic's key. */
export function ProgressionLibrary({ musicKey, size }: { musicKey: Key; size: ChordSize }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  return (
    <div className="flex flex-col gap-8">
      {PROGRESSION_STYLES.map((style) => (
        <RowGroup key={style} title={t(`progressions.style.${style}`)}>
          {PROGRESSION_LIBRARY.filter((each) => each.style === style).map((each) => {
            const numerals = parseNumerals(each.numerals) ?? []
            return (
              <li key={each.id}>
                <RowLink
                  title={localText(each.name, locale)}
                  detail={numerals.map(numeralText).join('–')}
                  icon={ListMusic}
                  paint="grass"
                  render={
                    <Link
                      to="/learn/progressions"
                      search={{
                        key: keyParam({ tonic: musicKey.tonic, minor: each.minor }),
                        p: numeralsParam(numerals),
                        size,
                      }}
                    />
                  }
                />
              </li>
            )
          })}
        </RowGroup>
      ))}
    </div>
  )
}
