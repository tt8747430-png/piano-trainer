import { Link } from '@tanstack/react-router'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { useKeyName } from '@/shared/i18n'
import {
  keyScale,
  keysHolding,
  noteParam,
  numeralText,
  printedSymbol,
  type FoundChord,
} from '@/shared/lib/music'
import { PAGE_TILES, RowLink } from '@/shared/ui'

/**
 * The keys that hold the chord found, as piano.org's key finder lists them: each key with the chord's
 * numeral there (printed as the chord's symbol is), opening the key's view of Scales; nothing for a
 * chord the table does not name.
 */
export function ChordKeys({ found }: { found: FoundChord }) {
  const { t } = useTranslation('practice')
  const keyName = useKeyName()
  const id = useId()
  const { root, quality } = found.chord
  const keys = quality ? keysHolding(root, quality) : []
  if (keys.length === 0) return null
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="text-xl">
        {t('chordFinder.inKeys')}
      </h2>
      <ul className="grid-cards gap-2 *:card">
        {keys.map(({ key, numeral }) => (
          <li key={keyName(key)}>
            <RowLink
              title={keyName(key)}
              {...PAGE_TILES.key}
              trailing={
                <span className="shrink-0 font-display text-xl font-semibold">
                  {printedSymbol(numeralText(numeral))}
                </span>
              }
              render={
                <Link
                  to="/practice/scales"
                  search={{ root: noteParam(key.tonic), kind: keyScale(key), show: 'key' }}
                />
              }
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
