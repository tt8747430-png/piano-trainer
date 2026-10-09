import { Link } from '@tanstack/react-router'
import { Download, Play } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import type { Take } from '@/entities/take'
import { PlayLabel, RoundButton } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useScoreEditorContext } from '../model/editor-context'
import { DeleteTakeButton } from './DeleteTakeButton'
import { useTakeTitle } from '../model/use-take-title'
import { TakeName } from './TakeName'

/**
 * One take: its name (a link to its page), its length and tempo; Play (the list's: one plays at a
 * time), Write into the score, Download and Delete.
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
  const title = useTakeTitle(take)
  return (
    <li aria-labelledby={name} className="flex flex-col gap-3 py-4">
      <TakeName
        take={take}
        title={
          <Link
            id={name}
            to="/edit/$pieceId/takes/$takeId"
            params={{ pieceId: take.pieceId, takeId: take.id }}
            className="text-link underline-offset-4 transition-colors ease-out hover:underline focus-visible:rounded-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {title}
          </Link>
        }
      />
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
