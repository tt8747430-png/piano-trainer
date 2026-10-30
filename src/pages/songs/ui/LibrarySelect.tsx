import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useFolderName, type ShelvedFolder } from '@/entities/library'
import type { Entry, PieceId } from '@/entities/piece'
import { useEntryFace } from '@/widgets/piece-list'
import { RowFace } from '@/shared/ui'
import {
  FavouriteMark,
  FolderFace,
  LibraryDnd,
  RowInHand,
  SelectRow,
  SortableRows,
} from '@/widgets/song-library'
import { folderKey, songKey, type Chosen, type LibraryPage } from '../model/use-library-page'

/** A song's face in Select, as its row shows it, its ♡ where it is a favourite. */
function SongFace({ entry, favourite }: { entry: Entry; favourite: boolean }) {
  const { face } = useEntryFace(entry)
  return (
    <>
      <RowFace {...face} />
      {favourite ? <FavouriteMark /> : null}
    </>
  )
}

/**
 * The library while Select is on (Mindscape's `LibrarySelectList`): the rows on screen, each chosen
 * by a tap; in the Manual order with nothing hidden, each moved by its handle, folders among folders
 * and songs among songs, by a finger, a mouse or the keyboard; and in any order, each carried by its
 * face (with every row chosen, where it is chosen) into a folder, or onto Select's bar's places.
 */
export function LibrarySelect({
  page,
  folder,
  children,
}: {
  page: LibraryPage
  /** The folder open, whose place a row carried out goes to; Home, none. */
  folder: ShelvedFolder | null
  /** Select's bar, in the same drag: its places take what is carried. */
  children: ReactNode
}) {
  const { t } = useTranslation('songs')
  const nameOf = useFolderName()
  const { view, select, sortable } = page
  const folders = new Map(view.folders.map((each) => [each.folder.id, each]))
  const entries = new Map(
    view.groups.flatMap((group) => group.entries.map((entry) => [entry.id, entry] as const)),
  )
  const folderName = (id: string) => {
    const each = folders.get(id as never)
    return each ? nameOf(each.folder) : ''
  }
  const songName = (id: PieceId) => page.titleOf(id)
  const keyName = (key: string) =>
    key.startsWith('folder:')
      ? folderName(key.slice('folder:'.length))
      : songName(key.slice('song:'.length))
  const face = (key: string) => {
    if (key.startsWith('folder:')) {
      const each = folders.get(key.slice('folder:'.length) as never)
      return each ? <FolderFace folder={each.folder} holds={each} /> : null
    }
    const entry = entries.get(key.slice('song:'.length))
    return entry ? <SongFace entry={entry} favourite={page.favourites.includes(entry.id)} /> : null
  }
  // Any folder by name, one out of sight too: the place a folder open stands in.
  const anyFolderName = (id: string) => {
    const found = page.layout.folders.find((each) => each.id === id)
    return found ? nameOf(found) : ''
  }
  const placeName = folder?.parent ? anyFolderName(folder.parent) : t('library.home')
  return (
    <LibraryDnd
      carried={(key) => select.carried(key as Chosen)}
      nameOf={keyName}
      targetName={(target) =>
        'into' in target
          ? anyFolderName(target.into)
          : target.zone === 'out'
            ? placeName
            : t('drag.archive')
      }
      inHand={(keys) => {
        const [first] = keys
        return first ? (
          <RowInHand checked={select.chosen.has(first as Chosen)} count={keys.length} carried>
            {face(first)}
          </RowInHand>
        ) : null
      }}
      onCarry={(keys, target) => select.carry(keys as Chosen[], target)}
    >
      <div className="flex flex-col gap-6">
        {view.folders.length > 0 ? (
          <SortableRows
            label={t('folder.list')}
            ids={view.folders.map((each) => each.folder.id)}
            nameOf={folderName}
            onMove={page.orderFolders}
            row={(id) => {
              const each = folders.get(id)
              return each ? (
                <SelectRow
                  key={id}
                  id={id}
                  name={folderName(id)}
                  checked={select.chosen.has(folderKey(id))}
                  onToggle={() => select.toggle(folderKey(id))}
                  sortable={sortable}
                  carry={folderKey(id)}
                  into={id}
                >
                  <FolderFace folder={each.folder} holds={each} />
                </SelectRow>
              ) : null
            }}
            inHand={(id) => {
              const each = folders.get(id)
              return each ? (
                <RowInHand checked={select.chosen.has(folderKey(id))}>
                  <FolderFace folder={each.folder} holds={each} />
                </RowInHand>
              ) : null
            }}
          />
        ) : null}
        {view.groups.map((group) =>
          group.entries.length === 0 ? null : (
            <section key={group.key} className="flex flex-col gap-3">
              {group.heading ? <h2 className="text-2xl">{group.heading}</h2> : null}
              <SortableRows
                label={group.heading ?? t('title')}
                ids={group.entries.map((entry) => entry.id)}
                nameOf={songName}
                onMove={page.orderSongs}
                row={(id) => {
                  const entry = entries.get(id)
                  return entry ? (
                    <SelectRow
                      key={id}
                      id={id}
                      name={songName(id)}
                      checked={select.chosen.has(songKey(id))}
                      onToggle={() => select.toggle(songKey(id))}
                      sortable={sortable}
                      carry={songKey(id)}
                    >
                      <SongFace entry={entry} favourite={page.favourites.includes(entry.id)} />
                    </SelectRow>
                  ) : null
                }}
                inHand={(id) => {
                  const entry = entries.get(id)
                  return entry ? (
                    <RowInHand checked={select.chosen.has(songKey(id))}>
                      <SongFace entry={entry} favourite={page.favourites.includes(entry.id)} />
                    </RowInHand>
                  ) : null
                }}
              />
            </section>
          ),
        )}
      </div>
      {children}
    </LibraryDnd>
  )
}
