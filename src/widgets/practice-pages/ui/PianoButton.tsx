import { useTranslation } from 'react-i18next'
import { useMidiSummary } from '@/features/connect-midi'
import { PianoSheet, useFoldKeys, type KeysScreen } from '@/features/live-keyboard'
import { RoundButton, KeysIcon } from '@/shared/ui'

/**
 * A Practice page's Piano (the canvas's TOP60: Settings, then Piano, both glass): it opens the one
 * Piano sheet, where the page's keys show or hide and the Sound and the MIDI keyboard are a tap away.
 * The keys are the page's input, so the sheet offers no hands.
 */
export function PianoButton({ screen = 'reading' }: { screen?: KeysScreen }) {
  const { t } = useTranslation('player')
  const { folded, fold } = useFoldKeys(screen)
  const midi = useMidiSummary()
  return (
    <PianoSheet
      midi={midi}
      keys={!folded}
      onKeys={(shown) => fold(!shown)}
      trigger={(open) => (
        <RoundButton
          label={t('pianoSheet.title')}
          icon={KeysIcon}
          aria-haspopup="dialog"
          onClick={open}
        />
      )}
    />
  )
}
