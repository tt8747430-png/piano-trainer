import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { NO_KEYS, unmarked, type ShownKeys } from '@/features/play-example'
import {
  chordInKey,
  keyFromParam,
  PASSING_CATEGORIES,
  passingChords,
  voiceLead,
  type Midi,
} from '@/shared/lib/music'
import { chordSounds, walkSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { KeyDropdown } from '@/shared/ui'
import type { PassingView } from '../model/passing-view'
import { readChord } from '../model/read-chord'
import { ChordField } from './ChordField'
import { SuggestionCard } from './SuggestionCard'

/** How fast a row of chords walks, a chord each two beats. */
const ROW_TEMPO = 84

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
  const playback = usePlayback<string>()
  const [shown, setShown] = useState<ShownKeys>(NO_KEYS)
  const key = keyFromParam(view.key)
  const from = readChord(view.from)
  const to = readChord(view.to)
  const ways = from && to ? passingChords(from, to) : []
  const at = `${view.key} ${view.from} ${view.to}`
  const playKeys = (keys: readonly Midi[], id: string) => {
    setShown(unmarked(keys))
    playback.toggle(id, chordSounds(keys, { arpeggio: false }))
  }
  return (
    <div className="flex flex-col gap-6">
      <ExplorerKeyboard keys={shown.keys} marks={shown.marks} />
      <div className="flex flex-wrap items-end gap-3">
        <ChordField
          label={t('passing.from')}
          value={view.from}
          readable={from !== null}
          onChange={(typed) => onChange({ from: typed })}
        />
        <ChordField
          label={t('passing.to')}
          value={view.to}
          readable={to !== null}
          onChange={(typed) => onChange({ to: typed })}
        />
        <KeyDropdown value={view.key} onChange={(next) => onChange({ key: next })} />
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
                <div className="grid gap-4 lg:grid-cols-2">
                  {inCategory.map((way) => {
                    const cardId = `${at} ${way.kind}`
                    const voiced = voiceLead([from, ...way.chords, to])
                    return (
                      <SuggestionCard
                        key={way.kind}
                        way={way}
                        from={from}
                        to={to}
                        inKey={way.chords.every((chord) => chordInKey(chord, key))}
                        isPlaying={(what) => playback.playing === `${cardId} ${what}`}
                        onPlayChord={(place) => playKeys(voiced[place] ?? [], `${cardId} ${place}`)}
                        onPlayRow={() => {
                          setShown(unmarked(voiced.flat()))
                          playback.toggle(
                            `${cardId} row`,
                            walkSounds(voiced, { arpeggio: false, tempo: ROW_TEMPO }),
                          )
                        }}
                      />
                    )
                  })}
                </div>
              </section>
            ) : null
          })
        : null}
    </div>
  )
}
