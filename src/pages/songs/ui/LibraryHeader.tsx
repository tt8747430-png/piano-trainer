import { Link, useNavigate } from '@tanstack/react-router'
import { CheckCheck, ListChecks, ListX, Settings, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useFolderName, useLibraryLayout, type ShelvedFolder } from '@/entities/library'
import { useUp } from '@/shared/lib'
import {
  BackButton,
  MoreMenu,
  RoundButton,
  RoundLink,
  ScreenHeader,
  TitleTabs,
  type EditAction,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import type { LibraryPage } from '../model/use-library-page'
import { ArchiveButton } from './ArchiveButton'
import { useSongsViews } from './SongsSwitch'

/**
 * The library's bar (Mindscape's): its title says where the learner is, Songs at Home with its views
 * (My songs · Explore), the folder's name in one with its Edit beside it (its name and look, in place)
 * and Back, which goes up a level, named so; at Home the Archive (its count) and More (Select, Card
 * style), in a folder Select and in a folder the gear to its Settings page (Share, Card style, Move to folder…, Archive
 * folder, Delete folder). While Select is on, the count chosen is its title, with Select all and Done.
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
  const views = useSongsViews('mine')
  const nameOf = useFolderName()
  const { folders } = useLibraryLayout()
  const { select } = page
  const up = useUp()
  const navigate = useNavigate()
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
            <RoundButton
              label={t('select.start')}
              icon={ListChecks}
              onClick={() => page.select.start()}
            />
            {add}
          </>
        }
      />
    )
  const name = folder ? nameOf(folder) : t('title')
  const above = folder?.parent ? folders.find((each) => each.id === folder.parent) : undefined
  // Home's bar has Songs' switch, My songs · Explore, in its title's place (D1).
  const place = folder
    ? ({ large: false } as const)
    : ({ large: true, views: <TitleTabs {...views} /> } as const)
  return (
    <ScreenHeader
      title={name}
      {...place}
      back={
        folder ? (
          <BackButton
            label={t('folder.up', { name: above ? nameOf(above) : t('title') })}
            onClick={up}
          />
        ) : undefined
      }
      // While the folder is in Edit only Done stands beside its name: Select and its Settings wait.
      tools={
        edit?.editing ? null : (
          <>
            {/* At Home Select is in More (canvas 133); a folder's bar has no More. */}
            {folder ? (
              <RoundButton
                label={t('select.start')}
                icon={ListChecks}
                onClick={() => page.select.start()}
              />
            ) : null}
            {/* The Archive is the bar's at Home, on a phone and a laptop alike (the boards'). */}
            {folder ? null : <ArchiveButton />}
            {add}
          </>
        )
      }
      more={
        folder ? null : (
          <MoreMenu
            actions={[
              {
                key: 'select',
                label: t('select.start'),
                icon: ListChecks,
                onSelect: () => page.select.start(),
              },
              // The board's ···: Select, then the Trash (deleted songs wait there, out of Archive).
              {
                key: 'trash',
                label: t('trash.title'),
                icon: Trash2,
                onSelect: () => void navigate({ to: '/songs/trash' }),
              },
            ]}
          />
        )
      }
      edit={edit}
      // A folder's own settings (name, look, place, Archive, Delete) are its Settings page.
      settings={
        folder && !edit?.editing ? (
          <RoundLink
            label={t('folder.openSettings', { name })}
            icon={Settings}
            render={
              <Link to="/songs/folders/$folderId/settings" params={{ folderId: folder.id }} />
            }
          />
        ) : null
      }
    />
  )
}
