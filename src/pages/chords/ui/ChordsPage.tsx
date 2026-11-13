import { useSearch } from '@tanstack/react-router'
import { Piano } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  selectChords,
  selectScoreView,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { useMidiSummary } from '@/features/connect-midi'
import { PianoSheet, useFoldKeys } from '@/features/live-keyboard'
import { setChords, setScoreView } from '@/features/set-preference'
import { useSetSearch } from '@/shared/lib'
import { BackButton, RoundButton, ScreenHeader } from '@/shared/ui'
import { ChordExplorer, framedChord, RANGE_WHITES, type ChordView } from '@/widgets/chord-explorer'
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
  const { labels, range, rangeFrom, angle, handsOnKeys } = useSettings(selectChords)
  const framed = framedChord(chord, range, rangeFrom)
  const settings = useSettingsStoreApi()
  const midi = useMidiSummary()
  return (
    <div className="flex flex-col gap-4">
      <ScreenHeader
        title={t('pages.chords')}
        back={<BackButton variant="glass" />}
        tools={
          <PianoSheet
            midi={midi}
            keys={!folded}
            hands={hands}
            onKeys={(shown) => fold(!shown)}
            onHands={(shown) => setScoreView(settings, { hands: shown })}
            labels={{ value: labels, onChange: (next) => setChords(settings, { labels: next }) }}
            stage={{
              angle,
              onAngle: (next) => setChords(settings, { angle: next }),
              handsOnKeys,
              onHandsOnKeys: (shown) => setChords(settings, { handsOnKeys: shown }),
            }}
            range={{
              value: range,
              low: framed.low,
              high: framed.high,
              // Fit the chord forgets where the strip was dragged; a drag on it shows two octaves.
              onChange: (next) =>
                setChords(
                  settings,
                  next === 'chord' ? { range: next, rangeFrom: null } : { range: next },
                ),
              whites: RANGE_WHITES[range === 'chord' ? 'two' : range],
              onMove: (from) =>
                setChords(settings, { range: range === 'chord' ? 'two' : range, rangeFrom: from }),
            }}
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
