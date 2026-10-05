import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { selectTakesOf, takeSounds, useTakes, type TakeId } from '@/entities/take'
import { usePlayback } from '@/shared/lib/services'
import { useScoreEditorContext } from '../model/editor-context'
import { TakeRow } from './TakeRow'

/** The piece's takes, the newest first, each played (Stop while it sounds) or opened to write or delete. */
export function TakeList({
  onWrite,
  onDelete,
}: {
  onWrite: (id: TakeId) => void
  onDelete: (id: TakeId) => void
}) {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const list = useTakes(useShallow((state) => selectTakesOf(state, takes.pieceId)))
  const playback = usePlayback<TakeId>()
  if (list.length === 0) return <p className="text-muted-foreground">{t('recorder.none')}</p>
  return (
    <ul aria-label={t('recorder.title')} className="flex flex-col divide-y divide-hairline">
      {list.map((take) => (
        <TakeRow
          key={take.id}
          take={take}
          playing={playback.playing === take.id}
          onPlay={() => playback.toggle(take.id, () => takeSounds(take))}
          onWrite={() => onWrite(take.id)}
          onDelete={() => onDelete(take.id)}
        />
      ))}
    </ul>
  )
}
