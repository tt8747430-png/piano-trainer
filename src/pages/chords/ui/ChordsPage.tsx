import { useSearch } from '@tanstack/react-router'
import { Piano } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  selectChords,
  selectScoreView,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { PianoSheet, useFoldKeys } from '@/features/live-keyboard'
import { setChords, setScoreView } from '@/features/set-preference'
import { useSetSearch } from '@/shared/lib'
import { BackButton, RoundButton, ScreenHeader } from '@/shared/ui'
import { ChordExplorer, type ChordView } from '@/widgets/chord-explorer'
import { StepPanel } from '@/widgets/step-panel'

/**
 * Chords, as its canvas board: a bar of glass over the stage (Back, the title, Piano opening the
 * Piano sheet), any chord built on any root, with its path step's panel when opened from one.
 */
export function ChordsPage() {
  const { t } = useTranslation(['practice', 'player'])
  const { step, ...chord } = useSearch({ from: '/shell/practice/chords' })
  const onChange = useSetSearch<ChordView>()
  const { folded, fold } = useFoldKeys()
  const { hands } = useSettings(selectScoreView)
  const { labels } = useSettings(selectChords)
  const settings = useSettingsStoreApi()
  return (
    <div className="flex flex-col gap-4">
      <ScreenHeader
        title={t('pages.chords')}
        back={<BackButton variant="glass" />}
        tools={
          <PianoSheet
            keys={!folded}
            hands={hands}
            onKeys={(shown) => fold(!shown)}
            onHands={(shown) => setScoreView(settings, { hands: shown })}
            labels={{ value: labels, onChange: (next) => setChords(settings, { labels: next }) }}
            trigger={(open) => (
              <RoundButton
                variant="glass"
                label={t('player:pianoSheet.title')}
                icon={Piano}
                aria-haspopup="dialog"
                onClick={open}
              />
            )}
          />
        }
      />
      {step ? <StepPanel step={step} /> : null}
      <ChordExplorer chord={chord} onChange={onChange} />
    </div>
  )
}
