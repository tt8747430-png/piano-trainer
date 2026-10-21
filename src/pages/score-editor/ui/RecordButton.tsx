import { CircleDot } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectRoomLeft, useTakes } from '@/entities/take'
import { isMidiConnected, useMidiConnection } from '@/features/connect-midi'
import { Button } from '@/shared/ui/primitives/button'
import { useScoreEditorContext } from '../model/editor-context'

/** Record, the takes' one action, in their sheet's footer: with a MIDI keyboard connected and room in the takes. */
export function RecordButton() {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const room = useTakes(selectRoomLeft)
  const { connection } = useMidiConnection()
  return (
    <Button size="lg" disabled={!isMidiConnected(connection) || room === 0} onClick={takes.record}>
      <CircleDot data-icon="inline-start" />
      {t('recorder.record')}
    </Button>
  )
}
