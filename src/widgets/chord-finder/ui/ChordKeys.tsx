import { Link } from '@tanstack/react-router'
import { useKeyName } from '@/shared/i18n'
import {
  keyScale,
  noteParam,
  numeralText,
  printedSymbol,
  type FoundChord,
} from '@/shared/lib/music'
import { PAGE_TILES, RowLink } from '@/shared/ui'
import { useKeysHolding } from './use-keys-holding'

/**
 * The keys that hold the chord found, as piano.org's key finder lists them, in the sheet In these keys
 * opens (canvas 181): each key with the chord's numeral there (printed as the chord's symbol is),
 * opening the key's view of Scales.
 */
export function ChordKeys({ found }: { found: FoundChord }) {
  const keyName = useKeyName()
  const keys = useKeysHolding(found)
  return (
    <ul className="flex flex-col rows-line overflow-hidden rounded-control bg-card">
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
                search={{ root: noteParam(key.tonic), kind: keyScale(key) }}
              />
            }
          />
        </li>
      ))}
    </ul>
  )
}
