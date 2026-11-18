import { useNavigate } from '@tanstack/react-router'
import { Archive, Palette, PencilLine, Settings, Users } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useFolderName, useLibraryLayout, type ShelvedFolder } from '@/entities/library'
import { ShareFolderSheet, useFolderShare } from '@/features/share-folder'
import { useForgetScreens, useMediaQuery, useUp } from '@/shared/lib'
import {
  BackButton,
  LIBRARY_PANES,
  MoreMenu,
  ScreenHeader,
  type EditAction,
  type MenuAction,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { PlaceBar } from '@/widgets/song-library'
import type { LibraryPage } from '../model/use-library-page'

/**
 * A list's bar (R72's LISTPAGE): Back, which goes up a level, named so; its title, All songs,
 * Favourites or the folder's name; Select, a word; in a folder the board's ··· (Rename, Colour, Share,
 * Archive folder, then its Settings). While Select is on, the count chosen is its title and Cancel
 * ends it. On a laptop it is the place's bar (`PlaceBar`): no Back, the sidebar holding the places,
 * the count beside the name and the search at its trailing edge.
 */
export function LibraryHeader({
  page,
  folder,
  all = false,
  edit,
  search,
  count,
}: {
  page: LibraryPage
  folder: ShelvedFolder | null
  /** All songs (R72): Back to Songs, its title (Favourites from My songs' card), Select in the bar. */
  all?: 'all' | 'favourites' | false
  /** The folder's Edit, where it may be renamed. */
  edit?: EditAction
  /** A laptop's search, at its bar's trailing edge (LPLACEBAR). */
  search?: ReactNode
  /** How many it lists, beside its name on a laptop. */
  count?: string | undefined
}) {
  const laptop = useMediaQuery(LIBRARY_PANES)
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
  // Select, a word as the boards' TB; Cancel while it is on, the count chosen then the title.
  const selectButton = select.on ? (
    <Button variant="bar" onClick={select.exit}>
      {t('select.cancel')}
    </Button>
  ) : chooses ? (
    <Button variant="bar" onClick={() => select.start()}>
      {t('select.start')}
    </Button>
  ) : null
  const chosenTitle = t('select.count', { count: select.count })
  if (select.on)
    return laptop ? (
      <PlaceBar title={chosenTitle} acts={selectButton} search={search} />
    ) : (
      <ScreenHeader title={chosenTitle} tools={selectButton} />
    )
  if (all) {
    const title = all === 'favourites' ? t('places.favourites') : t('all.title')
    return laptop ? (
      <PlaceBar title={title} count={count} acts={selectButton} search={search} />
    ) : (
      <ScreenHeader
        title={title}
        back={<BackButton label={t('folder.up', { name: t('title') })} onClick={up} />}
        tools={selectButton}
      />
    )
  }
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
  const more = edit?.editing ? null : (
    <MoreMenu
      label={t('folder.more', { name })}
      actions={actions.filter((action): action is MenuAction => action !== false)}
    />
  )
  return (
    <>
      {laptop ? (
        <PlaceBar
          title={name}
          count={count}
          acts={
            edit?.editing ? (
              <Button variant="bar" onClick={edit.onDone}>
                {t('select.done')}
              </Button>
            ) : (
              <>
                {more}
                {selectButton}
              </>
            )
          }
          search={search}
        />
      ) : (
        <ScreenHeader
          title={name}
          back={
            <BackButton
              label={t('folder.up', { name: above ? nameOf(above) : t('title') })}
              onClick={up}
            />
          }
          // While its name and colour are edited only Done stands beside its name.
          tools={edit?.editing ? null : selectButton}
          // The board's ···: Rename, Colour, Share, Archive folder, then its Settings.
          more={more}
          edit={edit?.editing ? edit : undefined}
        />
      )}
      <ShareFolderSheet open={sharing} onOpenChange={setSharing} folder={shareOf(folder)} />
    </>
  )
}
