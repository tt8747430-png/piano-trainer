import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { InfoTip } from '@/shared/ui'
import type { IntervalSongs, SongTitles } from '../model/interval-songs'

/**
 * The songs an interval opens, behind the ⓘ by its row: those it rises in, then those it falls in,
 * each a short list of titles in the learner's language; the unison's one list.
 */
export function IntervalSongsTip({ name, songs }: { name: string; songs: IntervalSongs }) {
  const { t } = useTranslation('practice')
  return (
    <InfoTip name={name}>
      <div className="flex flex-col gap-3">
        <SongList
          label={songs.down ? t('intervals.way.up') : t('intervals.songs')}
          titles={songs.up}
        />
        {songs.down ? <SongList label={t('intervals.way.down')} titles={songs.down} /> : null}
      </div>
    </InfoTip>
  )
}

function SongList({ label, titles }: { label: string; titles: SongTitles }) {
  const locale = useLocale()
  return (
    <div className="flex flex-col gap-1">
      <p className="font-semibold">{label}</p>
      <ul aria-label={label} className="flex flex-col gap-0.5 text-muted-foreground">
        {titles[locale].map((title) => (
          <li key={title}>{title}</li>
        ))}
      </ul>
    </div>
  )
}
