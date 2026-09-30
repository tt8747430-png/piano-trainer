import { useNavigate, useSearch } from '@tanstack/react-router'
import { Dices } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { entriesInKey, shelfOf } from '@/entities/piece'
import { keyFromParam, keyParam, randomKey } from '@/shared/lib/music'
import { BackButton, RoundButton, ScreenHeader } from '@/shared/ui'
import { KeyExplorer, type KeyView } from '@/widgets/key-explorer'
import { PieceList } from '@/widgets/piece-list'

/** The Keys reference: a key's page with the circle of fifths to choose it, and the songs and studies written in it. */
export function KeysPage() {
  const { t } = useTranslation('learn')
  const view = useSearch({ from: '/shell/learn/keys' })
  const navigate = useNavigate({ from: '/learn/keys' })
  const songsId = useId()
  const key = keyFromParam(view.key)
  const inKey = entriesInKey(key)
  const songs = inKey.filter((entry) => shelfOf(entry.kind) === 'songs')
  const groups = [
    { id: 'songs-in-key', heading: t('keys.songs'), entries: songs },
    {
      id: 'studies-in-key',
      heading: t('keys.studies'),
      entries: inKey.filter((entry) => entry.kind === 'study'),
    },
  ].filter((group) => group.entries.length > 0)
  const onChange = (change: Partial<KeyView>) =>
    void navigate({ search: (prev) => ({ ...prev, ...change }), replace: true })
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('keys.title')}
        back={<BackButton fallback={{ to: '/learn' }} />}
        actions={
          <RoundButton
            label={t('keys.random')}
            icon={Dices}
            onClick={() => onChange({ key: keyParam(randomKey(Math.random, key)) })}
          />
        }
      />
      <KeyExplorer view={view} onChange={onChange} />
      {songs.length > 0 ? null : (
        <section aria-labelledby={songsId} className="flex flex-col gap-2">
          <h2 id={songsId} className="text-2xl">
            {t('keys.songs')}
          </h2>
          <p className="text-muted-foreground">{t('keys.noSongs')}</p>
        </section>
      )}
      {groups.length > 0 ? <PieceList groups={groups} /> : null}
    </div>
  )
}
