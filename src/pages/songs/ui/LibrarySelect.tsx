import { useTranslation } from 'react-i18next'
import { useFolderName } from '@/entities/library'
import type { Entry, PieceId } from '@/entities/piece'
import { useEntryFace } from '@/widgets/piece-list'
import { RowFace } from '@/shared/ui'
import { FolderFace, RowInHand, SelectRow, SortableRows } from '@/widgets/song-library'
import { folderKey, songKey, type LibraryPage } from '../model/use-library-page'

/** A song's face in Select, as its row shows it. */
function SongFace({ entry }: { entry: Entry }) {
  const { face } = useEntryFace(entry)
  return <RowFace {...face} />
}

/**
 * The library while Select is on (Mindscape's `LibrarySelectList`): the rows on screen, each chosen
 * by a tap; in the Manual order with nothing hidden, each moved by its handle, folders among folders
 * and songs among songs, by a finger, a mouse or the keyboard.
 */
export function LibrarySelect({ page }: { page: LibraryPage }) {
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
  return (
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
                  >
                    <SongFace entry={entry} />
                  </SelectRow>
                ) : null
              }}
              inHand={(id) => {
                const entry = entries.get(id)
                return entry ? (
                  <RowInHand checked={select.chosen.has(songKey(id))}>
                    <SongFace entry={entry} />
                  </RowInHand>
                ) : null
              }}
            />
          </section>
        ),
      )}
    </div>
  )
}
