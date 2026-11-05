import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { Lock, PencilLine, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { entryTitles, pieceKey, useRepertoire } from '@/entities/piece'
import { readSharedEntries, useGroupsData } from '@/features/share-folder'
import { songLinkData } from '@/features/share-song'
import { useLocale } from '@/shared/i18n'
import { keySymbol, printedSymbol } from '@/shared/lib/music'
import { BackButton, RowButton, RowLink, ScreenHeader, SettingsGroup } from '@/shared/ui'

/**
 * A folder shared with one of the learner's groups (R30 S6): its name, who shared it and for which
 * group, whether the learner may edit it, and its songs. One of the app's songs opens its own page; a
 * learner's own song opens as a shared song does, where Save to my songs keeps a copy.
 */
export function SharedFolderPage() {
  const { t } = useTranslation('songs')
  const locale = useLocale()
  const repertoire = useRepertoire()
  const navigate = useNavigate()
  const { sharedId } = useParams({ from: '/shell/songs/shared-folders/$sharedId' })
  const { data } = useGroupsData()
  const folder =
    data.kind === 'ready' ? data.shared.find((each) => each.id === sharedId) : undefined
  const group =
    data.kind === 'ready' ? data.groups.find((each) => each.id === folder?.groupId) : undefined
  if (!folder)
    return (
      <div className="flex flex-col gap-6">
        <ScreenHeader title={t('groups.sharedWithMe')} back={<BackButton />} />
        <p className="text-muted-foreground">
          {data.kind === 'ready'
            ? t('groups.notFound')
            : data.kind === 'failed'
              ? t(data.reason === 'offline' ? 'groups.offline' : 'groups.failed')
              : t('groups.loading')}
        </p>
      </div>
    )
  const entries = readSharedEntries(folder.songs)
  const by = folder.mine
    ? t('groups.yours', { group: group?.name ?? '' })
    : t('groups.sharedBy', { name: folder.ownerName, group: group?.name ?? '' })
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 pb-8">
      <ScreenHeader title={folder.name} back={<BackButton />} />
      <div className="flex items-center gap-3 text-muted-foreground">
        <Users aria-hidden className="size-5" />
        <span>{by}</span>
        <span aria-hidden>·</span>
        <span className="inline-flex items-center gap-1.5">
          {folder.canEdit ? (
            <PencilLine aria-hidden className="size-4" />
          ) : (
            <Lock aria-hidden className="size-4" />
          )}
          {folder.canEdit ? t('groups.mayEdit') : t('groups.viewOnly')}
        </span>
      </div>
      <SettingsGroup flush title={t('folder.songCount', { count: entries.length })}>
        {entries.map((entry, index) => {
          if (entry.kind === 'built-in') {
            const piece = repertoire.entry(entry.id)
            if (!piece) return null
            return (
              <RowLink
                key={`${entry.id}-${index}`}
                title={entryTitles(piece, locale).primary}
                value={printedSymbol(keySymbol(pieceKey(piece)))}
                render={<Link to="/songs/$pieceId" params={{ pieceId: piece.id }} />}
              />
            )
          }
          return (
            <RowButton
              key={`own-${index}`}
              title={entry.song.title}
              onClick={() =>
                void songLinkData(entry.song).then((song) => {
                  if (song) void navigate({ to: '/songs/shared', search: { song } })
                })
              }
            />
          )
        })}
      </SettingsGroup>
    </div>
  )
}
