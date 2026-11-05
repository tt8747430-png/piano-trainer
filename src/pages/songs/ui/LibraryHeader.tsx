import { Link, useNavigate } from '@tanstack/react-router'
import { CheckCheck, ListChecks, ListX, Palette, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useFolderName, useLibraryLayout, type ShelvedFolder } from '@/entities/library'
import { useUp } from '@/shared/lib'
import {
  BackButton,
  MoreMenu,
  RoundButton,
  RoundLink,
  ScreenHeader,
  type EditAction,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import type { LibraryPage } from '../model/use-library-page'
import { ArchiveButton } from './ArchiveButton'
import { SongsSwitch } from './SongsSwitch'

/**
 * The library's bar (Mindscape's): its title says where the learner is, Songs at Home with its views
 * (My songs · Explore), the folder's name in one with its Edit beside it (its name and look, in place)
 * and Back, which goes up a level, named so; then Select, and at Home the Archive (its count) and More
 * (Card style), in a folder the gear to its Settings page (Share, Card style, Move to folder…, Archive
 * folder, Delete folder). While Select is on, the count chosen is its title, with Select all and Done.
 */
export function LibraryHeader({
  page,
  folder,
  edit,
}: {
  page: LibraryPage
  folder: ShelvedFolder | null
  /** The folder's Edit, where it may be renamed. */
  edit?: EditAction
}) {
  const { t } = useTranslation('songs')
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
  const name = folder ? nameOf(folder) : t('title')
  const above = folder?.parent ? folders.find((each) => each.id === folder.parent) : undefined
  // Home's bar has Songs' switch, My songs · Explore, in its title's place (D1).
  const place = folder
    ? ({ large: false } as const)
    : ({ large: true, switcher: <SongsSwitch value="mine" /> } as const)
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
            <RoundButton
              label={t('select.start')}
              icon={ListChecks}
              onClick={() => page.select.start()}
            />
            {folder ? null : <ArchiveButton />}
          </>
        )
      }
      // Home's Card style (R29 B9), Home's own: a folder's is on its Settings page.
      more={
        folder ? null : (
          <MoreMenu
            actions={[
              {
                key: 'card-style',
                label: t('cardStyle.open'),
                icon: Palette,
                onSelect: () => void navigate({ to: '/songs/card-style' }),
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
