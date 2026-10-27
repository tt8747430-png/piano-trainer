import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { BarRange } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { useElementSize, type SheetView } from '@/shared/lib'
import type { Tick } from '@/shared/lib/music'
import type { StaffId } from '@/shared/lib/notation'
import { SheetTitle } from '@/shared/ui'
import { labelRow, ScoreView, scoreHeight, type Picked, type ScoreLayout } from '@/shared/ui/score'
import { engravedHeight, FINGERS, fitScale, widestBar } from '../model/fit-scale'
import { groupOfTick } from '../model/group-of-tick'
import { keepsLoop } from '../model/keeps-loop'
import { SheetLines } from './SheetLines'
import { SheetOverlay } from './SheetOverlay'
import { useSheetScore } from './use-sheet-score'

/**
 * How the sheet shows its score (ADR 0064): its layout, its chord names, the words under the staff
 * that sings them (ADR 0093), the staves hidden (ADR 0097).
 */
export interface SheetViewChoice {
  readonly layout: SheetView
  readonly chordNames: boolean
  readonly lyrics: boolean
  readonly hidden: readonly StaffId[]
}

/** As the Player always was: one line across, every staff, the chord names, the words. */
const ACROSS: SheetViewChoice = {
  layout: 'panorama',
  chordNames: true,
  lyrics: true,
  hidden: [],
}

/** No single staff named. */
const NO_NAMES: readonly (string | undefined)[] = []

/**
 * A bar measured this much wider or narrower than before engraves the staff again; less does not.
 * The engraving's height is its own at any size, so the least change of it counts.
 */
const CHANGE = { bar: 0.1, height: 0.02 } as const

/** The music's own measures once engraved, at scale 1: its widest bar and its height as read. */
interface Engraved {
  readonly bar?: number | undefined
  readonly height?: number | undefined
}

/** A measure kept where the new one is within `change` of it: the staff is not engraved again. */
const steady = (was: number | undefined, next: number | undefined, change: number) =>
  next === undefined || (was !== undefined && Math.abs(next - was) <= was * change) ? was : next

/**
 * Tells the music's own measures (`Engraved`) of each engraving as it is drawn: the next is scaled by
 * them. Read as a new engraving comes, at the scale it was drawn at; the one before stays up while
 * the next is drawn, under the new scale.
 */
function EngravedSize({
  layout,
  scale,
  staves,
  read,
  onEngraved,
}: {
  layout: ScoreLayout
  scale: number
  staves: readonly StaffId[]
  read: readonly StaffId[]
  onEngraved: (engraved: Engraved) => void
}) {
  const tell = useEffectEvent((engraving: ScoreLayout) =>
    onEngraved({
      bar: widestBar(engraving, scale),
      height: engravedHeight(engraving, staves, read, scale),
    }),
  )
  useEffect(() => tell(layout), [layout])
  return null
}

/**
 * A Performance as sheet music (spec §2.6): its title at its head, the page's heading (ADR 0094);
 * chord symbols over numbered bars, the playhead at the beat group now (moving with the music while
 * Listen plays, ADR 0096), the loop, bars to jump to; its single staves over the piano, each named by
 * its own name (ADR 0097), the piano's left out of a lead sheet, the staves the view hides left out.
 * Laid out across (the default), on one scrolling line under the title
 * that takes the height left and engraves the staff to fill it (`fitScale`) while two of its bars
 * still show, so music read from a stand is as large as the screen allows; or in the chart's lines,
 * down the screen or on A4 pages (`SheetLines`).
 */
export function SheetMusic({
  performance,
  headings,
  current,
  clock,
  loop,
  playing = false,
  fingers,
  names,
  positions,
  muted,
  onJump,
  onLoopChange,
  view = ACROSS,
  title,
  piano = true,
  staffNames = NO_NAMES,
}: {
  view?: SheetViewChoice
  /** The piece's title, printed at the sheet's head in every layout: the page's heading (ADR 0094). */
  title: string
  /** Whether the piano's staves are written: not on a lead sheet (ADR 0083). */
  piano?: boolean
  /** Each single staff's name by its place, as printed at the first line's head (ADR 0097). */
  staffNames?: readonly (string | undefined)[]
  performance: Performance
  /** Each section's name, by section: shown at its first bar. */
  headings: readonly string[]
  /** The beat group the cursor is on: where the playhead stands. */
  current: number
  /** Where Listen's music is while it plays, read every frame: the playhead moves with it. */
  clock?: (() => Tick | null) | null | undefined
  loop: BarRange | null
  /** Whether the music plays (or waits on the keys): the playhead is shown in a loop then. */
  playing?: boolean
  fingers: boolean
  /** Each notehead carries its note's name. */
  names: boolean
  /** Each chord symbol says how the right hand plays it: its inversion. */
  positions: boolean
  /** The staff of the hand not heard or practised. */
  muted: StaffId | undefined
  onJump: (beatGroup: number) => void
  /** The loop chosen, or let go of (a note clicked, Escape). */
  onLoopChange: (loop: BarRange | null) => void
}) {
  const { t } = useTranslation('music')
  const { score, tempos, staves, labels } = useSheetScore(
    performance,
    { lyrics: view.lyrics, piano, hidden: view.hidden },
    staffNames,
  )
  const scroller = useRef<HTMLDivElement>(null)
  // The room under the title, the labels' row's and the engraving's to fill.
  const room = useElementSize(scroller)
  // The music's own measures, once engraved: a line of plain bars grows where a busy one cannot, and
  // a line whose notes go far over or under its staves (anywhere in the piece) is drawn smaller, so
  // its whole system is in the room, never under the keys (a phone on its side).
  const [own, setOwn] = useState<Engraved>({})
  const onEngraved = useMemo(
    () => (next: Engraved) =>
      setOwn((was) => {
        const bar = steady(was.bar, next.bar, CHANGE.bar)
        const height = steady(was.height, next.height, CHANGE.height)
        return bar === was.bar && height === was.height ? was : { bar, height }
      }),
    [],
  )
  // A muted staff may leave the height: its hand is not read. The verses under the tune stay in it.
  const read = staves.filter((staff) => staff !== muted)
  const reading = read.length > 0 ? read : staves
  // Before it is engraved, its staves' least room and the fingers'.
  const natural = own.height ?? scoreHeight(score, reading) + (fingers ? FINGERS : 0)
  // The labels' row over the staff, as the editor's lines draw it: as tall as what it holds (the
  // chord symbols' or the bars'), smaller with a staff drawn smaller.
  const rowAt = (size: number) => labelRow(view.chordNames, size)
  const scale = fitScale(room, natural, own.bar, rowAt)
  // Bars chosen as the editor chooses notes (ADR 0082, 0088), the loop: from the bar held or the
  // loop's start (else the cursor's bar) to the one reached, exactly.
  const anchor = useRef<number | null>(null)
  const group = performance.beatGroups[current]
  const onChoose = (at: number, extend: boolean) => {
    if (!extend) anchor.current = at
    const from = extend ? (anchor.current ?? loop?.first ?? group?.bar ?? at) : at
    onLoopChange({ first: Math.min(from, at), last: Math.max(from, at) })
  }
  // A note or a chord clicked, as the editor's click (ADR 0088): the cursor goes to its beat group and
  // it alone is marked until the cursor moves; the loop stays for a note inside it (`keepsLoop`).
  const [picked, setPicked] = useState<{ readonly picked: Picked; readonly group: number } | null>(
    null,
  )
  const onPick = (next: Picked) => {
    const at = groupOfTick(performance, next.tick)
    if (at === null) return
    anchor.current = null
    if (loop && !keepsLoop(loop, performance.beatGroups[at]?.bar)) onLoopChange(null)
    onJump(at)
    setPicked({ picked: next, group: at })
  }
  const here = picked?.group === current ? picked.picked : null
  // What is chosen, in the selection's colour (ADR 0096): the loop's notes, else the one clicked; the
  // notes the playhead is at are not chosen.
  const selected = useMemo(() => {
    const first = loop ? performance.bars[loop.first] : undefined
    if (loop && first)
      return {
        from: first.startTick,
        to: performance.bars[loop.last + 1]?.startTick ?? performance.totalTicks,
      }
    return here
      ? { staff: here.staff, from: here.tick, to: here.tick + 1, midi: here.midi }
      : undefined
  }, [loop, performance, here])
  // While the loop stands chosen and nothing moves, the loop is the mark, the playhead out of sight
  // (ADR 0088). Playing, or stepped on since, the playhead is where the music is.
  const loopKey = loop ? `${loop.first}-${loop.last}` : ''
  const [resting, setResting] = useState({ loop: loopKey, at: current })
  if (resting.loop !== loopKey) setResting({ loop: loopKey, at: current })
  const playheadShown = !loop || playing || current !== resting.at
  if (view.layout !== 'panorama')
    return (
      <SheetLines
        score={score}
        performance={performance}
        staves={staves}
        staffNames={labels}
        pages={view.layout === 'page'}
        title={title}
        headings={headings}
        current={current}
        clock={clock}
        loop={loop}
        fingers={fingers}
        names={names}
        positions={positions}
        chordNames={view.chordNames}
        tempos={tempos}
        muted={muted}
        onJump={onJump}
        onPick={onPick}
        onLoopChange={onLoopChange}
        onChoose={onChoose}
        selected={selected}
        playheadShown={playheadShown}
      />
    )
  return (
    // The title at the line's head (ADR 0094), the line scrolling sideways under it in the height left.
    <section aria-label={t('sheet.label')} className="flex h-full flex-col">
      <SheetTitle title={title} place="across" />
      <div
        ref={scroller}
        className="relative -mx-gutter min-h-0 flex-1 overflow-x-auto overscroll-x-contain px-gutter scrollbar-none landscape-phone:mx-0 landscape-phone:px-0"
      >
        <div className="w-max" style={{ paddingTop: rowAt(scale) }}>
          <ScoreView
            score={score}
            scale={scale}
            fingers={fingers}
            names={names}
            muted={muted}
            staves={staves}
            labels={labels}
            selected={selected}
          >
            {(layout) => (
              <>
                <EngravedSize
                  layout={layout}
                  scale={scale}
                  staves={staves}
                  read={reading}
                  onEngraved={onEngraved}
                />
                <SheetOverlay
                  layout={layout}
                  labelSize={scale}
                  scroller={scroller}
                  performance={performance}
                  headings={headings}
                  positions={positions}
                  chordNames={view.chordNames}
                  tempos={tempos}
                  current={current}
                  clock={clock}
                  loop={loop}
                  playheadShown={playheadShown}
                  onJump={onJump}
                  onPick={onPick}
                  onLoopChange={onLoopChange}
                  onChoose={onChoose}
                />
              </>
            )}
          </ScoreView>
        </div>
      </div>
    </section>
  )
}
