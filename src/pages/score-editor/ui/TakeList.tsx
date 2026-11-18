import { Music } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectMidi, useSettingsStoreApi } from '@/entities/settings'
import { takeSounds, type Take, type TakeId } from '@/entities/take'
import { usePlayback } from '@/shared/lib/services'
import { Said } from '@/shared/ui'
import { TakeRow } from './TakeRow'

/**
 * The piece's takes, the newest first, in one card on hairlines (the Takes board's TKLIST): one plays
 * at a time (Stop while it sounds), heard through the Touch. While Select is on (`picked`), a tap
 * chooses a take. None yet: the one empty state, saying where takes come from.
 */
export function TakeList({
  list,
  picked,
  onChoose,
}: {
  list: readonly Take[]
  /** The takes chosen while Select is on; null while it is off. */
  picked: ReadonlySet<TakeId> | null
  onChoose: (id: TakeId) => void
}) {
  const { t } = useTranslation('editor')
  const playback = usePlayback<TakeId>()
  const settings = useSettingsStoreApi()
  if (list.length === 0)
    return <Said icon={Music} title={t('recorder.none')} description={t('recorder.noneLine')} />
  return (
    <ul
      aria-label={t('recorder.title')}
      className="flex flex-col overflow-hidden card rows-hairline"
    >
      {list.map((take) => (
        <TakeRow
          key={take.id}
          take={take}
          playing={playback.playing === take.id}
          onPlay={() =>
            playback.toggle(take.id, () => takeSounds(take, selectMidi(settings.getState()).touch))
          }
          {...(picked ? { chosen: picked.has(take.id) } : {})}
          onChoose={() => onChoose(take.id)}
        />
      ))}
    </ul>
  )
}
