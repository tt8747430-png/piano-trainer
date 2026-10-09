import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { selectMidi, useSettings } from '@/entities/settings'
import { selectTakesOf, takeSounds, useTakes, type TakeId } from '@/entities/take'
import { usePlayback } from '@/shared/lib/services'
import { useScoreEditorContext } from '../model/editor-context'
import { TakeRow } from './TakeRow'

/** The piece's takes, the newest first: one plays at a time (Stop while it sounds), heard through the Touch. */
export function TakeList() {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const list = useTakes(useShallow((state) => selectTakesOf(state, takes.pieceId)))
  const playback = usePlayback<TakeId>()
  const { touch } = useSettings(selectMidi)
  if (list.length === 0) return <p className="text-muted-foreground">{t('recorder.none')}</p>
  return (
    <ul aria-label={t('recorder.title')} className="flex flex-col divide-y divide-hairline">
      {list.map((take) => (
        <TakeRow
          key={take.id}
          take={take}
          playing={playback.playing === take.id}
          onPlay={() => playback.toggle(take.id, () => takeSounds(take, touch))}
        />
      ))}
    </ul>
  )
}
