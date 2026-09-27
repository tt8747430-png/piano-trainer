import { useNavigate, useSearch } from '@tanstack/react-router'
import { ArrowLeft, Dices } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { entriesInKey } from '@/entities/piece'
import { useGoBack } from '@/shared/lib'
import { keyFromParam, keyParam, randomKey } from '@/shared/lib/music'
import { RoundButton, ScreenHeader } from '@/shared/ui'
import { KeyExplorer, type KeyView } from '@/widgets/key-explorer'
import { PieceList } from '@/widgets/piece-list'

/** The Keys reference: a key's page with the circle of fifths to choose it, and the songs written in it. */
export function KeysPage() {
  const { t } = useTranslation(['learn', 'common'])
  const view = useSearch({ from: '/shell/learn/keys' })
  const navigate = useNavigate({ from: '/learn/keys' })
  const back = useGoBack({ to: '/learn' })
  const songsId = useId()
  const key = keyFromParam(view.key)
  const songs = entriesInKey(key)
  const onChange = (change: Partial<KeyView>) =>
    void navigate({ search: (prev) => ({ ...prev, ...change }), replace: true })
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('learn:keys.title')}
        back={<RoundButton label={t('common:back')} icon={ArrowLeft} onClick={back} />}
        actions={
          <RoundButton
            label={t('learn:keys.random')}
            icon={Dices}
            onClick={() => onChange({ key: keyParam(randomKey(Math.random, key)) })}
          />
        }
      />
      <KeyExplorer view={view} onChange={onChange} />
      {songs.length > 0 ? (
        <PieceList groups={[{ id: 'in-key', heading: t('learn:keys.songs'), entries: songs }]} />
      ) : (
        <section aria-labelledby={songsId} className="flex flex-col gap-2">
          <h2 id={songsId} className="text-2xl">
            {t('learn:keys.songs')}
          </h2>
          <p className="text-muted-foreground">{t('learn:keys.noSongs')}</p>
        </section>
      )}
    </div>
  )
}
