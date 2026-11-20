import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useElementSize } from '@/shared/lib'
import { keyFromParam, type KeyParam } from '@/shared/lib/music'
import { notate, type StaffId } from '@/shared/lib/notation'
import { noteLine, runSounds, twoHands, type NoteLineMeter } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { PlayButton, type ShownKeys } from '@/shared/ui'
import { barsOf, lineLetters, rowsOf } from '../model/notes-example'
import { useStaffPlayhead } from '../model/use-staff-playhead'
import { FittedRow } from './FittedRow'
import { TappableStaff } from './TappableStaff'

/** The tempo a lesson's line of notes plays at: slow enough to read along. */
const LINE_TEMPO = 72
/** The hand a staff's line is played with: the bass's the left, every treble's the right. */
const handOf = (staff: StaffId): 'rh' | 'lh' => (staff === 'bass' ? 'lh' : 'rh')

/** The room a note struck takes on a row, in CSS px: how many a row of the column's width holds. */
const NOTE_ROOM = 34

/**
 * A line of notes to read (the Lesson boards' notes block): its notes by name 17 bold on a 44 row
 * with Play at its end, and under it the line on the staff it is read on (with a left hand's line
 * under it, both hands on one grand staff, played together), laid in rows as a sheet lays them, as
 * many bars a row as the column holds. Play marks each note on the staff as it sounds; a note tapped
 * sounds and goes to `onShow`.
 */
export function NotesExample({
  notes,
  bass,
  clef,
  meter,
  keyParam,
  onShow,
}: {
  notes: string
  /** The left hand's line, under the right's on the grand staff. */
  bass?: string
  clef: StaffId
  meter: NoteLineMeter
  keyParam: KeyParam
  onShow: (shown: ShownKeys) => void
}) {
  const { t } = useTranslation('music')
  const playback = usePlayback<'line'>()
  const { line, letters } = useMemo(() => {
    const key = keyFromParam(keyParam)
    const lead = noteLine(notes, { hand: bass === undefined ? handOf(clef) : 'rh', meter, key })
    return {
      line: bass === undefined ? lead : twoHands(lead, noteLine(bass, { hand: 'lh', meter, key })),
      letters: lineLetters(lead),
    }
  }, [notes, bass, clef, meter, keyParam])
  const score = useMemo(() => notate(line), [line])
  const follow = playback.playing === 'line' ? playback.handle : null
  const at = useStaffPlayhead(follow, line, LINE_TEMPO)
  const space = useRef<HTMLDivElement>(null)
  const width = useElementSize(space).width
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
    <figure ref={space} className="mt-2 flex w-full flex-col gap-1">
      <div className="flex min-h-11 items-center gap-2">
        <figcaption className="flex-1 text-[1.0625rem] font-bold">{letters}</figcaption>
        <PlayButton
          label={t('play')}
          playing={playback.playing === 'line'}
          onClick={() => playback.toggle('line', () => runSounds(line, LINE_TEMPO))}
        />
      </div>
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
            onShow={onShow}
          />
        </FittedRow>
      ))}
    </figure>
  )
}
