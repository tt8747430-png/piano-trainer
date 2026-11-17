import { useNavigate } from '@tanstack/react-router'
import {
  Archive,
  CheckCheck,
  ListChecks,
  ListX,
  Palette,
  PencilLine,
  Settings,
  Users,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useFolderName, useLibraryLayout, type ShelvedFolder } from '@/entities/library'
import { ShareFolderSheet, useFolderShare } from '@/features/share-folder'
import { useForgetScreens, useUp } from '@/shared/lib'
import {
  BackButton,
  MoreMenu,
  RoundButton,
  ScreenHeader,
  type EditAction,
  type MenuAction,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import type { LibraryPage } from '../model/use-library-page'

/**
 * A list's bar (R72's LISTPAGE): Back, which goes up a level, named so; its title, All songs,
 * Favourites or the folder's name; Select, and New on a laptop; in a folder the board's ··· (Rename,
 * Colour, Share, Archive folder, then its Settings). While Select is on, the count chosen is its
 * title, with Select all and Done.
 */
export function LibraryHeader({
  page,
  folder,
  all = false,
  edit,
  add,
}: {
  page: LibraryPage
  folder: ShelvedFolder | null
  /** All songs (R72): Back to Songs, its title (Favourites from My songs' card), Select in the bar. */
  all?: 'all' | 'favourites' | false
  /** The folder's Edit, where it may be renamed. */
  edit?: EditAction
  /** New, on a laptop: the primary action, last of the tools (`NewMenu`). */
  add?: ReactNode
}) {
  const { t } = useTranslation('songs')
  const nameOf = useFolderName()
  const { folders } = useLibraryLayout()
  const { select } = page
  const up = useUp()
  const navigate = useNavigate()
  const forget = useForgetScreens()
  const shareOf = useFolderShare()
  const [sharing, setSharing] = useState(false)
  // Select only where there is something to choose.
  const chooses = page.view.shown > 0 || page.view.folders.length > 0
  if (select.on)
    return (
      <ScreenHeader
        title={t('select.count', { count: select.count })}
        // Round, as Select was: the bar keeps its one row at 320px, the rows under it still.
        tools={
          <RoundButton
            label={t(select.all ? 'select.none' : 'select.all')}
            icon={select.all ? ListX : CheckCheck}
            onClick={select.toggleAll}
          />
        }
        // Done ends Select at the bar's very end, where Edit's Done stands (A3).
        more={
          <Button variant="soft" onClick={select.exit}>
            {t('select.done')}
          </Button>
        }
      />
    )
  if (all)
    return (
      <ScreenHeader
        title={all === 'favourites' ? t('places.favourites') : t('all.title')}
        back={<BackButton label={t('folder.up', { name: t('title') })} onClick={up} />}
        tools={
          <>
            {chooses ? (
              <RoundButton
                label={t('select.start')}
                icon={ListChecks}
                onClick={() => page.select.start()}
              />
            ) : null}
            {add}
          </>
        }
      />
    )
  if (!folder) return null
  const name = nameOf(folder)
  const above = folder.parent ? folders.find((each) => each.id === folder.parent) : undefined
  // Out of the library (archived): to where it stood, its folder or Home; its screens gone for Back.
  const leave = () => {
    forget(`/songs/folders/${folder.id}`)
    return above
      ? navigate({ to: '/songs/folders/$folderId', params: { folderId: above.id }, replace: true })
      : navigate({ to: '/songs', replace: true })
  }
  const actions: (MenuAction | false)[] = [
    // Its name and its colour, both edited in place under the bar (`FolderEditPanel`).
    edit !== undefined && {
      key: 'rename',
      label: t('folder.rename'),
      icon: PencilLine,
      onSelect: edit.onEdit,
    },
    edit !== undefined && {
      key: 'colour',
      label: t('folder.colour'),
      icon: Palette,
      onSelect: edit.onEdit,
    },
    { key: 'share', label: t('groups.share'), icon: Users, onSelect: () => setSharing(true) },
    page.mayOnFolder('archiveFolder', folder) && {
      key: 'archive',
      label: t('folder.archive'),
      icon: Archive,
      destructive: true,
      onSelect: () => {
        page.acts.archiveFolder(folder)
        void leave()
      },
    },
    {
      key: 'settings',
      label: t('folder.settings'),
      icon: Settings,
      onSelect: () =>
        void navigate({ to: '/songs/folders/$folderId/settings', params: { folderId: folder.id } }),
    },
  ]
  return (
    <>
      <ScreenHeader
        title={name}
        back={
          <BackButton
            label={t('folder.up', { name: above ? nameOf(above) : t('title') })}
            onClick={up}
          />
        }
        // While its name and colour are edited only Done stands beside its name.
        tools={
          edit?.editing ? null : (
            <>
              {chooses ? (
                <RoundButton
                  label={t('select.start')}
                  icon={ListChecks}
                  onClick={() => page.select.start()}
                />
              ) : null}
              {add}
            </>
          )
        }
        // The board's ···: Rename, Colour, Share, Archive folder, then its Settings (Card style, Move, Delete).
        more={
          edit?.editing ? null : (
            <MoreMenu
              label={t('folder.more', { name })}
              actions={actions.filter((action): action is MenuAction => action !== false)}
            />
          )
        }
        edit={edit?.editing ? edit : undefined}
      />
      <ShareFolderSheet open={sharing} onOpenChange={setSharing} folder={shareOf(folder)} />
    </>
  )
}
