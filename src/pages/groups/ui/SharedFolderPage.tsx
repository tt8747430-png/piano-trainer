import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { Lock, PencilLine } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { entryTitles, pieceKey, useRepertoire } from '@/entities/piece'
import { GroupMark, readSharedEntries, useGroupsData } from '@/features/share-folder'
import { songLinkData } from '@/features/share-song'
import { useLocale } from '@/shared/i18n'
import { useGroups } from '@/shared/lib/groups'
import { keySymbol, printedSymbol } from '@/shared/lib/music'
import {
  BackButton,
  ConfirmDialog,
  DangerGroup,
  DangerRow,
  RowButton,
  RowLink,
  ScreenHeader,
  SettingsGroup,
} from '@/shared/ui'
import { GroupsState, RowsLoading } from './GroupsState'

/**
 * A folder shared with one of the learner's groups (R30 S6, R32-C): its picture on its paint, who
 * shared it and with which group, whether the learner may edit it; its songs, one of the app's opening
 * its own page, a learner's own opening as a shared song does (Save to my songs). The learner's own
 * share ends with Stop sharing, asked first. While it is read, failed, offline or gone, it says so.
 */
export function SharedFolderPage() {
  const { t } = useTranslation('songs')
  const locale = useLocale()
  const repertoire = useRepertoire()
  const navigate = useNavigate()
  const port = useGroups()
  const { sharedId } = useParams({ from: '/shell/songs/shared-folders/$sharedId' })
  const { data, reload } = useGroupsData()
  const [asking, setAsking] = useState(false)
  const [failed, setFailed] = useState(false)
  const folder =
    data.kind === 'ready' ? data.shared.find((each) => each.id === sharedId) : undefined
  const group =
    data.kind === 'ready' ? data.groups.find((each) => each.id === folder?.groupId) : undefined
  if (!folder)
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <ScreenHeader title={t('groups.sharedWithMe')} back={<BackButton />} />
        {data.kind === 'loading' ? (
          <RowsLoading label={t('groups.loading')} />
        ) : data.kind === 'ready' ? (
          <p className="text-muted-foreground">{t('groups.notFound')}</p>
        ) : (
          <GroupsState data={data} onRetry={reload} />
        )}
      </div>
    )
  const entries = readSharedEntries(folder.songs)
  const groupName = group?.name ?? ''
  const stop = async () => {
    const done = await port.unshare(folder.groupId, folder.folderKey)
    if (!done.ok) return setFailed(true)
    reload()
    void navigate({
      to: '/songs/groups/$groupId',
      params: { groupId: folder.groupId },
      replace: true,
    })
  }
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 pb-8">
      <ScreenHeader title={folder.name} large back={<BackButton />} />
      <div className="flex items-center gap-4">
        <GroupMark look={folder} />
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-pretty">
            {folder.mine
              ? t('groups.yours', { group: groupName })
              : t('groups.sharedBy', { name: folder.ownerName, group: groupName })}
          </p>
          <p className="inline-flex items-center gap-1.5 text-muted-foreground">
            {folder.canEdit ? (
              <PencilLine aria-hidden className="size-4" />
            ) : (
              <Lock aria-hidden className="size-4" />
            )}
            {t(folder.canEdit ? 'groups.mayEdit' : 'groups.viewOnly')}
          </p>
        </div>
      </div>
      {failed ? (
        <p role="alert" className="text-sm text-destructive">
          {t('groups.failed')}
        </p>
      ) : null}
      <SettingsGroup flush title={t('folder.songCount', { count: entries.length })}>
        {entries.map((entry, index) => {
          if (entry.kind === 'built-in') {
            const piece = repertoire.entry(entry.id)
            if (!piece) return null
            const titles = entryTitles(piece, locale)
            return (
              <RowLink
                key={`${entry.id}-${index}`}
                title={titles.primary}
                detail={titles.secondary || undefined}
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
      {folder.mine ? (
        <DangerGroup footnote={t('groups.stopBody', { group: groupName })}>
          <DangerRow title={t('groups.stopSharing')} onClick={() => setAsking(true)} />
        </DangerGroup>
      ) : null}
      <ConfirmDialog
        open={asking}
        onOpenChange={setAsking}
        title={t('groups.stopTitle', { name: folder.name })}
        body={t('groups.stopBody', { group: groupName })}
        action={t('groups.stopSharing')}
        onConfirm={() => void stop()}
      />
    </div>
  )
}
