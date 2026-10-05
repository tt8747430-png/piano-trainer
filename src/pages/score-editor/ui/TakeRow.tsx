import { Download, Play } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import type { Take } from '@/entities/take'
import { PlayLabel, RoundButton } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useScoreEditorContext } from '../model/editor-context'
import { DeleteTakeButton } from './DeleteTakeButton'
import { TakeName } from './TakeName'

/**
 * One take: when it was made, its length and tempo; Play (the list's: one plays at a time), Write into
 * the score, Download and Delete.
 */
export function TakeRow({
  take,
  playing,
  onPlay,
}: {
  take: Take
  playing: boolean
  onPlay: () => void
}) {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const name = useId()
  return (
    <li aria-labelledby={name} className="flex flex-col gap-3 py-4">
      <TakeName id={name} take={take} />
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="soft" onClick={onPlay}>
          <PlayLabel playing={playing}>
            <Play data-icon="inline-start" />
            {t('recorder.play')}
          </PlayLabel>
        </Button>
        <Button variant="soft" onClick={() => takes.show({ kind: 'write', id: take.id })}>
          {t('recorder.write')}
        </Button>
        <RoundButton
          label={t('recorder.download')}
          icon={Download}
          onClick={() => takes.download(take)}
        />
        <DeleteTakeButton take={take} />
      </div>
    </li>
  )
}
