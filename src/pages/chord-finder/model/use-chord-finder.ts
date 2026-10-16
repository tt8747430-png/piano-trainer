import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { selectChordFinder, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { useHeldKeys } from '@/features/connect-midi'
import { rememberChords, setChordFinder } from '@/features/set-preference'
import { IN_PLACE, keyListParam, readKeyList, toggled, useWakeLock } from '@/shared/lib'
import { keyFromParam, pitchClass, pitchClassOf, type Key, type Midi } from '@/shared/lib/music'
import {
  EMPTY_LOG,
  findChord,
  logKeys,
  namesChord,
  readingAt,
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
  /**
   * What the staff writes: the chords played, oldest first, where they are remembered; else the
   * chord down now alone, and nothing once it is let go.
   */
  readonly staff: readonly (readonly Midi[])[]
  /** Whether the chords played are remembered, on the staff and on the device. */
  readonly remember: boolean
  setRemember(on: boolean): void
  /** Whether the keys the chord is in are shown. */
  readonly inKeys: boolean
  setInKeys(on: boolean): void
  /** Whether an inversion is named over its bass. */
  readonly slash: boolean
  setSlash(on: boolean): void
  /** The reading chosen among the chord's names. */
  readonly reading: number
  setReading(at: number): void
  tap(key: Midi): void
  /** Whether there are keys down or tapped to clear. */
  readonly canClear: boolean
  /** Lets the keys tapped go; the chords played stay remembered. */
  clear(): void
  /** Whether there are chords played to forget. */
  readonly canForget: boolean
  /** Forgets the chords played, on the staff and on the device. */
  forget(): void
}

const lowestFirst = (keys: Iterable<Midi>): Midi[] => [...keys].sort((a, b) => a - b)

/**
 * The chord a MIDI keyboard plays, as its keys went down, read on once they are let go; else the keys
 * tapped. Each change of the keys down is logged; where the chords are remembered, the staff writes
 * them in turn and the device keeps them, else it writes the chord down now.
 */
export function useChordFinder(view: ChordFinderView): ChordFinder {
  // The screen stays on while the finder is open: a phone on the stand does not lock mid-chord.
  useWakeLock()
  const navigate = useNavigate({ from: '/practice/chord-finder' })
  const held = useHeldKeys()
  const store = useSettingsStoreApi()
  const settings = useSettings(selectChordFinder)
  const tapped = readKeyList(view.keys)
  const down = held.size > 0 ? lowestFirst(held) : tapped
  const downKey = keyListParam(down)

  // The log hears each change of the keys down, as it happens (React's "adjust state on change").
  // A page opened on the chord remembered last (a reload, Back) has heard it already: a key tapped
  // grows it.
  const [opened] = useState(
    () => settings.remember && keyListParam(settings.chords.at(-1) ?? []) === downKey,
  )
  const [log, setLog] = useState<ChordLog>(() =>
    !settings.remember
      ? EMPTY_LOG
      : opened
        ? { chords: settings.chords, held: down, letGo: false }
        : { ...EMPTY_LOG, chords: settings.chords },
  )
  const [heard, setHeard] = useState(opened ? downKey : '')
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

  // The device keeps the chords played that name one: not a note on the way to the next.
  const { remember } = settings
  useEffect(() => {
    if (remember) rememberChords(store, log.chords.filter(namesChord))
  }, [store, remember, log.chords])

  const forget = () => {
    // The keys down now are heard already: the log starts empty, not from them again.
    setLog(EMPTY_LOG)
    setHeard(downKey)
  }
  // The chord's root tapped again lets the whole chord go; any other key tapped comes or goes alone.
  const finding = findChord(keys, musicKey)
  const root =
    finding.kind === 'chord' ? pitchClassOf(readingAt(finding.readings, at).chord.root) : null
  const now = held.size > 0 ? [last] : tapped.length > 0 ? [tapped] : []

  const write = (keysParam: string) =>
    void navigate({ search: (prev) => ({ ...prev, keys: keysParam }), ...IN_PLACE })

  return {
    keys,
    tapped: new Set(tapped),
    source,
    musicKey,
    finding,
    staff: remember ? log.chords : now,
    remember,
    setRemember: (on) => {
      if (!on) forget()
      setChordFinder(store, { remember: on })
    },
    inKeys: settings.inKeys,
    setInKeys: (on) => setChordFinder(store, { inKeys: on }),
    slash: settings.slash,
    setSlash: (on) => setChordFinder(store, { slash: on }),
    reading: at,
    setReading: (next) => setReading({ keys: shownKey, at: next }),
    tap: (key) =>
      write(
        tapped.includes(key) && root !== null && pitchClass(key) === root
          ? ''
          : keyListParam(toggled(tapped, key)),
      ),
    canClear: tapped.length > 0,
    clear: () => write(''),
    canForget: remember && log.chords.length > 0,
    forget: () => {
      forget()
      rememberChords(store, [])
    },
  }
}
