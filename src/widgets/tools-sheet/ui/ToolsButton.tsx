import { useNavigate } from '@tanstack/react-router'
import { LayoutGrid } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMetronome } from '@/features/metronome'
import { TunerSheet } from '@/widgets/tuner'
import { QuickTools } from './QuickTools'
import { ToolsSheet } from './ToolsSheet'

/**
 * The Tools button in a screen's bar (R29 B11): a lesson's, each explorer's. It opens the Tools sheet
 * over the page, which stays as it was: the quick Metronome (the Metronome's own tempo and time), the
 * Tuner, then All tools, Practice's Tools group. The Metronome runs on with the sheet closed, until
 * the page is left.
 */
export function ToolsButton() {
  const { t } = useTranslation(['practice', 'player'])
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [tuner, setTuner] = useState(false)
  const metronome = useMetronome()
  return (
    <>
      <ToolsSheet
        bar
        open={open}
        onOpenChange={setOpen}
        quick={
          <QuickTools
            metronome={metronome}
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
