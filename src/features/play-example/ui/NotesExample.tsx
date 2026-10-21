import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { keyFromParam, type KeyParam } from '@/shared/lib/music'
import { notate, type StaffId } from '@/shared/lib/notation'
import { noteLine, runSounds, twoHands, type NoteLineMeter } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { PlayButton, SheetOption, type ShownKeys } from '@/shared/ui'
import { barOf, barShown } from '../model/notes-example'
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
  return (
    <figure className="flex w-fit max-w-full items-center gap-4 card p-3 pl-4">
      <div className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain scrollbar-none">
        <TappableStaff
          music={line}
          score={score}
          {...(bass === undefined ? { staff: clef } : {})}
          tempo={LINE_TEMPO}
          follow={follow}
          names={names}
          onShow={onShow}
        />
      </div>
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
    </figure>
  )
}
