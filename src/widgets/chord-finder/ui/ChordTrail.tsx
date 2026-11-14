import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  pitchClass,
  printedSymbol,
  spellInKey,
  type Key,
  type Midi,
  printedNote,
} from '@/shared/lib/music'
import { keyListParam } from '@/shared/lib'
import { GroupChips } from '@/shared/ui'
import { findChord, readingAt, type Finding } from '../model/finding'
import { chordLabel, useChordAbout } from './use-chord-about'

/** A chord played in words: its symbol as the sheets print it (`C♯m7`), and all of it for a screen reader. */
interface Said {
  readonly symbol: string
  readonly detail: string
  readonly heard: string
}

/**
 * The chords played before the one shown (canvas 181's Played), oldest first, each its symbol in the
 * key chosen as a quiet chip, said in full to a screen reader. Nothing where none was played before.
 */
export function ChordTrail({
  chords,
  musicKey,
  slash,
  chosen,
}: {
  chords: readonly (readonly Midi[])[]
  musicKey: Key
  /** An inversion named over its bass; else by its root. */
  slash: boolean
  /** The reading chosen for the chord shown: the newest, where it holds those keys, is named so. */
  chosen?: { readonly keys: readonly Midi[]; readonly at: number }
}) {
  const chosenKeys = chosen ? keyListParam(chosen.keys) : undefined
  const chosenAt = chosen?.at ?? 0
  const { t } = useTranslation(['practice', 'music'])
  const about = useChordAbout()
  const shown = chords
  const names = useMemo(
    () =>
      shown.map((keys, i): Said => {
        const finding: Finding = findChord(keys, musicKey)
        switch (finding.kind) {
          case 'chord': {
            const newest = i === shown.length - 1 && keyListParam(keys) === chosenKeys
            const best = readingAt(finding.readings, newest ? chosenAt : 0)
            // Under its bar, what the chord is; how the keys lay it out is the name's to say.
            const detail = about(best, { slash }).join(' · ')
            const symbol = printedSymbol(chordLabel(best, slash))
            return { symbol, detail, heard: `${symbol} ${detail}`.trim() }
          }
          case 'interval':
            return {
              symbol: finding.power
                ? printedSymbol(finding.power)
                : t(`music:interval.${finding.interval}.short`),
              detail: '',
              heard: t(`music:interval.${finding.interval}.name`),
            }
          case 'note': {
            const symbol = printedNote(finding.note)
            return { symbol, detail: '', heard: symbol }
          }
          default:
            return {
              symbol: '',
              detail: '',
              heard: keys
                .map((each) => printedNote(spellInKey(pitchClass(each), musicKey)))
                .join(' '),
            }
        }
      }),
    [shown, musicKey, t, about, slash, chosenKeys, chosenAt],
  )
  // The newest is the chord on the page: the trail is what came before it.
  const before = names.slice(0, -1).filter((name) => name.symbol !== '')
  if (before.length === 0) return null
  return (
    <GroupChips label={t('practice:chordFinder.played')}>
      {before.map((name, i) => (
        <span
          key={i}
          aria-label={name.heard}
          className="flex h-8 items-center rounded-pill px-3 text-[0.9375rem] font-semibold"
        >
          {name.symbol}
        </span>
      ))}
    </GroupChips>
  )
}
