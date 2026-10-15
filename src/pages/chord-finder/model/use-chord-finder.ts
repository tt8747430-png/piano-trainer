import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useHeldKeys } from '@/features/connect-midi'
import { IN_PLACE, keyListParam, readKeyList, toggled, useWakeLock } from '@/shared/lib'
import { keyFromParam, type Key, type Midi } from '@/shared/lib/music'
import {
  EMPTY_LOG,
  findChord,
  logKeys,
  type ChordLog,
  type ChordSource,
  type Finding,
} from '@/widgets/chord-finder'
import type { ChordFinderView } from './chord-finder-view'

/** The Chord finder's state (ADR 0054): the keys shown, where they come from, and what they make. */
interface ChordFinder {
  /** The keys the chord shown is made of, lowest first. */
  readonly keys: readonly Midi[]
  /** The keys tapped: the keyboard's toggles. */
  readonly tapped: ReadonlySet<Midi>
  readonly source: ChordSource
  readonly musicKey: Key
  readonly finding: Finding
  /** The chords played, oldest first, the one shown last. */
  readonly played: readonly (readonly Midi[])[]
  /** The reading chosen among the chord's names. */
  readonly reading: number
  setReading(at: number): void
  tap(key: Midi): void
  readonly canClear: boolean
  clear(): void
}

const lowestFirst = (keys: Iterable<Midi>): Midi[] => [...keys].sort((a, b) => a - b)

/**
 * The chord a MIDI keyboard plays, as its keys went down, read on once they are let go; else the keys
 * tapped. Each change of the keys down is logged, so the staff writes the chords played in turn.
 */
export function useChordFinder(view: ChordFinderView): ChordFinder {
  // The screen stays on while the finder is open: a phone on the stand does not lock mid-chord.
  useWakeLock()
  const navigate = useNavigate({ from: '/practice/chord-finder' })
  const held = useHeldKeys()
  const tapped = readKeyList(view.keys)
  const down = held.size > 0 ? lowestFirst(held) : tapped
  const downKey = keyListParam(down)

  // The log hears each change of the keys down, as it happens (React's "adjust state on change").
  const [log, setLog] = useState<ChordLog>(EMPTY_LOG)
  const [heard, setHeard] = useState('')
  if (downKey !== heard) {
    setHeard(downKey)
    setLog((current) => logKeys(current, down))
  }

  // Held keys show the chord as it grew: letting it go key by key never renames it on the way.
  const last = log.chords.at(-1) ?? []
  const keys = held.size === 0 && tapped.length > 0 ? tapped : last
  const source: ChordSource = held.size > 0 ? 'held' : tapped.length > 0 ? 'tapped' : 'last'
  const musicKey = keyFromParam(view.key)

  // A reading chosen holds for the keys it was chosen on.
  const shownKey = keyListParam(keys)
  const [reading, setReading] = useState({ keys: shownKey, at: 0 })
  const at = reading.keys === shownKey ? reading.at : 0

  const write = (keysParam: string) =>
    void navigate({ search: (prev) => ({ ...prev, keys: keysParam }), ...IN_PLACE })

  return {
    keys,
    tapped: new Set(tapped),
    source,
    musicKey,
    finding: findChord(keys, musicKey),
    played: log.chords,
    reading: at,
    setReading: (next) => setReading({ keys: shownKey, at: next }),
    tap: (key) => write(keyListParam(toggled(tapped, key))),
    canClear: keys.length > 0 || log.chords.length > 0,
    clear: () => {
      // The keys down now are heard already: the log starts empty, not from them again.
      setLog(EMPTY_LOG)
      setHeard(downKey)
      write('')
    },
  }
}
