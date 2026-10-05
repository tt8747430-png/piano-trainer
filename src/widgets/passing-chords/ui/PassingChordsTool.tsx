import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { useShownKeys } from '@/features/play-example'
import {
  chordInKey,
  keyFromParam,
  PASSING_CATEGORIES,
  passingChords,
  readChordSymbol,
} from '@/shared/lib/music'
import { KeyPicker, NO_KEYS, TypedField } from '@/shared/ui'
import type { PassingView } from '../model/passing-view'
import { SuggestionCard } from './SuggestionCard'

/**
 * Passing chords: two chords typed and a key; the ways between them by category, each row voice-led
 * and played, each chord of it played as the row voices it, on the keys pinned above.
 */
export function PassingChordsTool({
  view,
  onChange,
}: {
  view: PassingView
  onChange: (change: Partial<PassingView>) => void
}) {
  const { t } = useTranslation('learn')
  const id = useId()
  const key = keyFromParam(view.key)
  const from = readChordSymbol(view.from)
  const to = readChordSymbol(view.to)
  const ways = from && to ? passingChords(from, to) : []
  const at = `${view.key} ${view.from} ${view.to}`
  const [shown, setShown] = useShownKeys(at, NO_KEYS)
  return (
    <div className="flex flex-col gap-6">
      <ExplorerKeyboard shown={shown} />
      <div className="grid-fields gap-x-10 gap-y-6">
        <div className="grid grid-cols-2 items-start gap-3">
          <TypedField
            label={t('passing.from')}
            value={view.from}
            error={from === null ? t('passing.unread') : null}
            onChange={(typed) => onChange({ from: typed })}
          />
          <TypedField
            label={t('passing.to')}
            value={view.to}
            error={to === null ? t('passing.unread') : null}
            onChange={(typed) => onChange({ to: typed })}
          />
        </div>
        <KeyPicker value={view.key} onChange={(next) => onChange({ key: next })} />
      </div>
      {from && to
        ? PASSING_CATEGORIES.map((category) => {
            const inCategory = ways.filter((way) => way.category === category)
            return inCategory.length > 0 ? (
              <section
                key={category}
                aria-labelledby={`${id}-${category}`}
                className="flex flex-col gap-3"
              >
                <h2 id={`${id}-${category}`} className="text-2xl">
                  {t(`passing.category.${category}`)}
                </h2>
                <div className="grid-fields gap-4">
                  {inCategory.map((way) => (
                    <SuggestionCard
                      key={way.kind}
                      way={way}
                      from={from}
                      to={to}
                      inKey={way.chords.every((chord) => chordInKey(chord, key))}
                      onShow={setShown}
                    />
                  ))}
                </div>
              </section>
            ) : null
          })
        : null}
    </div>
  )
}
