import type { TFunction } from 'i18next'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  keyFromParam,
  noteName,
  pitchClass,
  spellInKey,
  type Key,
  type KeyParam,
  type Midi,
  type TimeSignature,
} from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { LazyScoreView } from '@/shared/ui'
import { xAtTick, type ScoreLayout } from '@/shared/ui/score'
import { useChordAbout } from '@/widgets/chord-finder'
import { liveName } from '../model/live-name'
import { BAR_TICKS, trailMusic } from '../model/trail'

/** Four beats a bar, never printed: each chord is a whole note on its own. */
const NO_TIME: TimeSignature = { count: 4, unit: 4 }

/** A chord played in words: its symbol over its bar, a line under it, and all of it for a screen reader. */
interface Said {
  readonly symbol: string
  readonly detail: string
  readonly heard: string
}

function said(
  keys: readonly Midi[],
  key: Key,
  t: TFunction<['practice', 'music']>,
  about: ReturnType<typeof useChordAbout>,
): Said {
  const name = liveName(keys, key)
  switch (name.kind) {
    case 'chord': {
      const detail = about(name.found).join(' · ')
      return { symbol: name.found.symbol, detail, heard: `${name.found.symbol} ${detail}`.trim() }
    }
    case 'interval':
      return {
        symbol: t(`music:interval.${name.interval}.short`),
        detail: '',
        heard: t(`music:interval.${name.interval}.name`),
      }
    case 'note':
      return { symbol: noteName(name.note), detail: '', heard: noteName(name.note) }
    case 'none':
      return {
        symbol: '',
        detail: '',
        heard: keys.map((each) => noteName(spellInKey(pitchClass(each), key))).join(' '),
      }
  }
}

/** Over each bar, its chord's name and the line under it. */
function BarNames({ layout, names }: { layout: ScoreLayout; names: readonly Said[] }) {
  return (
    <div aria-hidden className="absolute inset-x-0 bottom-full h-12">
      {names.map((name, i) => (
        <span
          key={i}
          className="absolute bottom-0.5 flex flex-col whitespace-nowrap"
          style={{ left: xAtTick(layout, i * BAR_TICKS) }}
        >
          <span className="font-display text-lg font-semibold">{name.symbol}</span>
          <span className="text-xs text-muted-foreground">{name.detail}</span>
        </span>
      ))}
    </div>
  )
}

/**
 * The live score (spec 2026-10-09 §5.1): the chords played, oldest first, each a whole note in a bar
 * of its own on a grand staff, spelled in the key chosen and named over its bar; for a screen reader,
 * the names in order and the newest said as it comes.
 */
export function LiveScore({
  chords,
  keyParam,
}: {
  chords: readonly (readonly Midi[])[]
  keyParam: KeyParam
}) {
  const { t } = useTranslation(['practice', 'music'])
  const about = useChordAbout()
  const key = useMemo(() => keyFromParam(keyParam), [keyParam])
  const names = useMemo(
    () => chords.map((keys) => said(keys, key, t, about)),
    [chords, key, t, about],
  )
  // Engraved again only when the chords, the key or their names change.
  const score = useMemo(
    () =>
      notate(
        trailMusic(
          chords,
          key,
          names.map((name) => name.symbol),
        ),
      ),
    [chords, key, names],
  )
  return (
    <section className="flex flex-col gap-2">
      <div className="max-w-full overflow-x-auto overscroll-x-contain pt-12 scrollbar-none">
        <LazyScoreView score={score} timeBefore={NO_TIME}>
          {(layout) => <BarNames layout={layout} names={names} />}
        </LazyScoreView>
      </div>
      {chords.length === 0 ? (
        <p className="text-muted-foreground">{t('practice:freePlay.empty')}</p>
      ) : null}
      <ol aria-label={t('practice:freePlay.score')} className="sr-only">
        {names.map((name, i) => (
          <li key={i}>{name.heard}</li>
        ))}
      </ol>
      <p role="status" className="sr-only">
        {names.at(-1)?.heard}
      </p>
    </section>
  )
}
