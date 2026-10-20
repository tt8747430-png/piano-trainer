import { ArrowDown, ArrowUp, ChevronsDown, ChevronsUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ToolKey } from '@/shared/ui'
import { useScoreEditorContext } from '../model/editor-context'

/** The Pitch tab: the notes at the caret a semitone or an octave up or down, or spelled the other way. */
export function PitchKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const shift = (semitones: number) => actions.dispatch({ type: 'shift', semitones })
  return (
    <>
      <ToolKey label={t('up')} onClick={() => shift(1)}>
        <ArrowUp aria-hidden />
      </ToolKey>
      <ToolKey label={t('down')} onClick={() => shift(-1)}>
        <ArrowDown aria-hidden />
      </ToolKey>
      <ToolKey label={t('octaveUp')} onClick={() => shift(12)}>
        <ChevronsUp aria-hidden />
      </ToolKey>
      <ToolKey label={t('octaveDown')} onClick={() => shift(-12)}>
        <ChevronsDown aria-hidden />
      </ToolKey>
      <ToolKey label={t('respell')} onClick={() => actions.dispatch({ type: 'respell' })}>
        <span aria-hidden className="text-xl font-semibold tracking-tight">
          ♯♭
        </span>
      </ToolKey>
    </>
  )
}
