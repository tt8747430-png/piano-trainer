import { useNavigate } from '@tanstack/react-router'
import { LayoutGrid } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isMidiConnected, useMidiConnection } from '@/features/connect-midi'
import { useMetronome, type SongTime } from '@/features/metronome'
import { useFreeRecorder } from '@/features/record-take'
import { TunerSheet } from '@/widgets/tuner'
import { QuickTools } from './QuickTools'
import { ToolsSheet } from './ToolsSheet'

/**
 * The Tools button in a screen's bar (R29 B11): a lesson's, each explorer's. It opens the Tools sheet
 * over the page, which stays as it was: the quick Metronome (the Metronome's own tempo and time), the
 * Recorder (a free recording) and the Tuner, then All tools, Practice's Tools group. The Metronome and
 * the Recorder run on with the sheet closed, until the page is left.
 */
export function ToolsButton({
  song = null,
}: {
  /** The song's tempo and time, where the screen holds one (the score editor): the quick Metronome's. */
  song?: SongTime | null
} = {}) {
  const { t } = useTranslation(['practice', 'player'])
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [tuner, setTuner] = useState(false)
  const metronome = useMetronome(song)
  const recorder = useFreeRecorder()
  const { connection } = useMidiConnection()
  const piano = isMidiConnected(connection)
  return (
    <>
      <ToolsSheet
        bar
        open={open}
        onOpenChange={setOpen}
        quick={
          <QuickTools
            metronome={metronome}
            recorder={{
              ...recorder,
              unavailable: piano ? undefined : t('practice:tools.recorder.needsPiano'),
            }}
            onTuner={() => {
              setOpen(false)
              setTuner(true)
            }}
          />
        }
        groups={[
          {
            key: 'more',
            title: t('player:toolsSheet.more'),
            rows: [
              {
                key: 'all',
                kind: 'act',
                label: t('practice:tools.sheet.all'),
                icon: LayoutGrid,
                paint: 'sky',
                opens: true,
                onSelect: () => void navigate({ to: '/practice' }),
              },
            ],
          },
        ]}
      />
      <TunerSheet open={tuner} onOpenChange={setTuner} />
    </>
  )
}
