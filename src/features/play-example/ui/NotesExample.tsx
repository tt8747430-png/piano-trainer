import { Square } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { keyFromParam, type KeyParam } from '@/shared/lib/music'
import { notate, type StaffId } from '@/shared/lib/notation'
import { noteLine, runSounds, type NoteLineMeter } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { LazyScoreView } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { notesShown } from '../model/notes-example'
import type { ShownKeys } from '../model/shown'

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
  const { t } = useTranslation(['learn', 'common'])
  const playback = usePlayback<'line'>()
  const line = useMemo(
    () => noteLine(notes, { hand: HAND_OF[clef], meter, key: keyFromParam(keyParam) }),
    [notes, clef, meter, keyParam],
  )
  const score = useMemo(() => notate(line), [line])
  return (
    // Play beside the line where it fits, under it on a narrow screen.
    <figure className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-3xl border border-border bg-card p-4">
      <div className="max-w-full overflow-x-auto overscroll-x-contain scrollbar-none">
        <LazyScoreView score={score} scale={1} fingers={false} staff={clef} />
      </div>
      <Button
        variant="soft"
        onClick={() => {
          onShow(notesShown(line))
          playback.toggle('line', runSounds(line, LINE_TEMPO))
        }}
      >
        {playback.playing === 'line' ? (
          <>
            <Square data-icon="inline-start" />
            {t('common:stop')}
          </>
        ) : (
          t('learn:example.play')
        )}
      </Button>
    </figure>
  )
}
