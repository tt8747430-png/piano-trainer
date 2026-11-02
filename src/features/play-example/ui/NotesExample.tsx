import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useElementSize, useFitZoom } from '@/shared/lib'
import { keyFromParam, type KeyParam } from '@/shared/lib/music'
import { notate, type StaffId } from '@/shared/lib/notation'
import { noteLine, runSounds, twoHands, type NoteLineMeter } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { PlayButton, SheetOption, type ShownKeys } from '@/shared/ui'
import { barOf, barShown, barsOf, rowsOf } from '../model/notes-example'
import { useStaffPlayhead } from '../model/use-staff-playhead'
import { TappableStaff } from './TappableStaff'

/** The tempo a lesson's line of notes plays at: slow enough to read along. */
const LINE_TEMPO = 72
/** The hand a staff's line is played with: the bass's the left, every treble's the right. */
const handOf = (staff: StaffId): 'rh' | 'lh' => (staff === 'bass' ? 'lh' : 'rh')

/**
 * A line of notes to read, on the staff it is read on (with a left hand's line under it, both hands
 * on one grand staff, played together), and Play beside it, which plays it on the
 * page's keys a bar at a time: each note marked on the staff as it sounds, the keys showing only the
 * bar it is in. Its notes' names show on the staff from its own toggle. Each bar it reaches goes to
 * `onFollow`, `onShow` unless given: the line moving on is not the learner's choice, so a lesson
 * keeps a question opened as it plays.
 */
/** What the card takes of its room beside its music: its padding, and its controls at its side. */
const CARD_ROOM = 140

/** The room a note struck takes on a row, in CSS px: how many a row of the card's width holds. */
const NOTE_ROOM = 34

/** A row drawn whole within the card's width, shrunk where it is wider. */
function FittedRow({ children }: { children: ReactNode }) {
  const room = useRef<HTMLDivElement>(null)
  const drawn = useRef<HTMLDivElement>(null)
  const zoom = useFitZoom(room, drawn)
  return (
    <div ref={room} className="min-w-0">
      <div ref={drawn} className="w-max" style={zoom < 1 ? { zoom } : undefined}>
        {children}
      </div>
    </div>
  )
}

export function NotesExample({
  notes,
  bass,
  clef,
  meter,
  keyParam,
  onShow,
  onFollow = onShow,
}: {
  notes: string
  /** The left hand's line, under the right's on the grand staff. */
  bass?: string
  clef: StaffId
  meter: NoteLineMeter
  keyParam: KeyParam
  onShow: (shown: ShownKeys) => void
  onFollow?: (shown: ShownKeys) => void
}) {
  const { t } = useTranslation('music')
  const playback = usePlayback<'line'>()
  const line = useMemo(() => {
    const key = keyFromParam(keyParam)
    if (bass === undefined) return noteLine(notes, { hand: handOf(clef), meter, key })
    return twoHands(
      noteLine(notes, { hand: 'rh', meter, key }),
      noteLine(bass, { hand: 'lh', meter, key }),
    )
  }, [notes, bass, clef, meter, keyParam])
  const score = useMemo(() => notate(line), [line])
  const [names, setNames] = useState(false)
  const follow = playback.playing === 'line' ? playback.handle : null
  const at = useStaffPlayhead(follow, line, LINE_TEMPO)
  // As the line plays the keys turn to each bar it reaches, once each.
  const bar = at === null ? null : barOf(line, at)
  const shownBar = useRef<number | null>(null)
  useEffect(() => {
    if (bar === null || bar === shownBar.current) return
    shownBar.current = bar
    onFollow(barShown(line, bar))
  }, [bar, line, onFollow])
  // The line laid in rows as a sheet lays them (round 28), as many bars a row as fit the card: a
  // phone shows the whole line, never its first bar alone.
  // The room the card may take (the page's column, not the card, which is as wide as its rows):
  // less the card's padding and, from sm up, its controls beside the music.
  const space = useRef<HTMLDivElement>(null)
  const width = useElementSize(space).width - CARD_ROOM
  const rows = useMemo(() => {
    const room = width > 0 ? Math.max(4, Math.floor(width / NOTE_ROOM)) : Number.POSITIVE_INFINITY
    return rowsOf(line, room).map(({ from, to }) => {
      const music = barsOf(line, from, to)
      return {
        from,
        start: line.bars[from]?.startTick ?? 0,
        end: line.bars[to]?.startTick ?? Number.POSITIVE_INFINITY,
        music,
        score: from === 0 && to === line.bars.length ? score : notate(music),
      }
    })
  }, [line, score, width])
  return (
    <div ref={space} className="w-full">
      <figure className="flex w-full max-w-full flex-col gap-2 card p-3 pl-4 sm:w-fit sm:flex-row sm:items-center sm:gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {rows.map((row) => (
            <FittedRow key={row.from}>
              <TappableStaff
                music={row.music}
                score={row.score}
                {...(bass === undefined ? { staff: clef } : {})}
                firstBar={row.from + 1}
              continues={row.from > 0}
                tempo={LINE_TEMPO}
                playhead={at !== null && at >= row.start && at < row.end ? at - row.start : null}
                names={names}
                onShow={onShow}
              />
            </FittedRow>
          ))}
        </div>
        <div className="flex items-center justify-end gap-4 sm:contents">
          <SheetOption
            glyph="C E"
            label={t('sheet.noteNames')}
            pressed={names}
            onPressedChange={setNames}
          />
          <PlayButton
            label={t('play')}
            playing={playback.playing === 'line'}
            onClick={() => {
              shownBar.current = 0
              onShow(barShown(line, 0))
              playback.toggle('line', () => runSounds(line, LINE_TEMPO))
            }}
          />
        </div>
      </figure>
    </div>
  )
}
