import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { useShownKeys } from '@/features/play-example'
import {
  chordInKey,
  keyFromParam,
  PASSING_CATEGORIES,
  passingChords,
  readChordSymbol,
} from '@/shared/lib/music'
import { KeyChoice, NO_KEYS } from '@/shared/ui'
import { Toggle } from '@/shared/ui/primitives/toggle'
import type { PassingView } from '../model/passing-view'
import { ChordField } from './ChordField'
import { SuggestionCard } from './SuggestionCard'

/**
 * Passing chords: two chords typed and a key; the ways between them by category (with In the key only,
 * those whose chords are all the key's), each row voice-led
 * and played, each chord of it played as the row voices it, on the keys pinned above.
 */
export function PassingChordsTool({
  view,
  onChange,
}: {
  view: PassingView
  onChange: (change: Partial<PassingView>) => void
}) {
  const { t } = useTranslation('practice')
  const id = useId()
  const key = keyFromParam(view.key)
  const from = readChordSymbol(view.from)
  const to = readChordSymbol(view.to)
  const inKey = (way: ReturnType<typeof passingChords>[number]) =>
    way.chords.every((chord) => chordInKey(chord, key))
  const ways = (from && to ? passingChords(from, to, key) : []).filter(
    (way) => !view.inKey || inKey(way),
  )
  const at = `${view.key} ${view.from} ${view.to}`
  const [shown, setShown] = useShownKeys(at, NO_KEYS)
  return (
    <div className="flex flex-col gap-6">
      <PinnedKeyboard shown={shown} />
      <div className="grid-fields gap-x-10 gap-y-6">
        <div className="grid grid-cols-2 items-start gap-3">
          <ChordField
            label={t('passing.from')}
            chord={view.from}
            onChange={(from) => onChange({ from })}
          />
          <ChordField label={t('passing.to')} chord={view.to} onChange={(to) => onChange({ to })} />
        </div>
        <KeyChoice value={view.key} onChange={(next) => onChange({ key: next })} />
      </div>
      <Toggle
        className="self-start"
        pressed={view.inKey}
        onPressedChange={(next) => onChange({ inKey: next })}
      >
        {t('passing.onlyInKey')}
      </Toggle>
      {from && to && ways.length === 0 ? (
        <p className="text-muted-foreground">{t('passing.noneInKey')}</p>
      ) : null}
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
                      inKey={inKey(way)}
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
