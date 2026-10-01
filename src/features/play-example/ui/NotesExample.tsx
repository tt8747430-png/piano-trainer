import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { keyFromParam, type KeyParam } from '@/shared/lib/music'
import { notate, type StaffId } from '@/shared/lib/notation'
import { noteLine, runSounds, type NoteLineMeter } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { LazyScoreView, PlayLabel, type ShownKeys } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { notesShown } from '../model/notes-example'

/** The tempo a lesson's line of notes plays at: slow enough to read along. */
const LINE_TEMPO = 72
const HAND_OF: Readonly<Record<StaffId, 'rh' | 'lh'>> = { treble: 'rh', bass: 'lh' }

/** A line of notes to read, on the staff it is read on, and Play, which plays it on the page's keys. */
export function NotesExample({
  notes,
  clef,
  meter,
  keyParam,
  onShow,
}: {
  notes: string
  clef: StaffId
  meter: NoteLineMeter
  keyParam: KeyParam
  onShow: (shown: ShownKeys) => void
}) {
  const { t } = useTranslation('learn')
  const playback = usePlayback<'line'>()
  const line = useMemo(
    () => noteLine(notes, { hand: HAND_OF[clef], meter, key: keyFromParam(keyParam) }),
    [notes, clef, meter, keyParam],
  )
  const score = useMemo(() => notate(line), [line])
  return (
    // Play beside the line where it fits, under it on a narrow screen.
    <figure className="flex flex-wrap items-center gap-x-6 gap-y-3 card p-4">
      <div className="max-w-full overflow-x-auto overscroll-x-contain scrollbar-none">
        <LazyScoreView score={score} staff={clef} />
      </div>
      <Button
        variant="soft"
        onClick={() => {
          onShow(notesShown(line))
          playback.toggle('line', () => runSounds(line, LINE_TEMPO))
        }}
      >
        <PlayLabel playing={playback.playing === 'line'}>{t('example.play')}</PlayLabel>
      </Button>
    </figure>
  )
}
