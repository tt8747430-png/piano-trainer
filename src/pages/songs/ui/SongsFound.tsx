import { Link } from '@tanstack/react-router'
import { Search, SearchX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useFolderName } from '@/entities/library'
import { useSetSearch } from '@/shared/lib'
import { OpensMark, Said, SectionHead } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { FolderFace } from '@/widgets/song-library'
import type { SongsHome } from '../model/explore-view'
import type { LibraryPage } from '../model/use-library-page'
import { LibraryBrowse } from './LibraryBrowse'
import { LibrarySelect } from './LibrarySelect'
import { SelectionBar } from './SelectionBar'
import { FRESH } from './songs-fresh'

const ROW =
  'card flex min-h-14 min-w-0 items-center gap-3 py-2 pr-3 pl-4 text-foreground transition-colors duration-200 ease-out hover:bg-muted'

/**
 * What Songs' search found, on Songs itself (the Songs board's RESULTS; Apple Music's Library, Files:
 * the field filters where you stand, it opens no page): the songs as the library's cards, the folders
 * whose name holds the words, then "Search Explore for …", the same words in Explore. Nothing found
 * says so, with Clear search, and Explore still offered.
 */
export function SongsFound({
  page,
  query,
  onClear,
}: {
  page: LibraryPage
  query: string
  onClear: () => void
}) {
  const { t } = useTranslation('songs')
  const show = useSetSearch<SongsHome>()
  const nameOf = useFolderName()
  const wanted = query.toLocaleLowerCase()
  const folders = page.view.folders.filter(({ folder }) =>
    nameOf(folder).toLocaleLowerCase().includes(wanted),
  )
  const songs = page.view.groups.some((group) => group.entries.length > 0)
  return (
    <div className="flex flex-col gap-6">
      {!songs && folders.length === 0 ? (
        <Said
          quiet
          icon={SearchX}
          title={t('found.none', { query })}
          description={t('found.noneLine')}
          action={<Button onClick={onClear}>{t('found.clear')}</Button>}
        />
      ) : null}
      {songs ? (
        <section aria-labelledby="found-songs" className="flex flex-col gap-3">
          <SectionHead id="found-songs" title={t('found.songs')} />
          {page.select.on ? (
            <LibrarySelect page={page} folder={null}>
              <SelectionBar page={page} folder={null} />
            </LibrarySelect>
          ) : (
            <LibraryBrowse page={page} noFolders onClear={onClear} />
          )}
        </section>
      ) : null}
      {folders.length > 0 ? (
        <section aria-labelledby="found-folders" className="flex flex-col gap-3">
          <SectionHead id="found-folders" title={t('folder.list')} />
          <ul className="grid gap-3 lg:grid-cols-3">
            {folders.map(({ folder, ...holds }) => (
              <li key={folder.id} className="flex min-w-0">
                <Link
                  to="/songs/folders/$folderId"
                  params={{ folderId: folder.id }}
                  className={`${ROW} flex-1`}
                >
                  <FolderFace folder={folder} holds={holds} />
                  <OpensMark />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <section aria-labelledby="found-explore" className="flex flex-col gap-3">
        <SectionHead id="found-explore" title={t('found.inExplore')} />
        <button
          type="button"
          onClick={() => show({ ...FRESH, view: 'explore', q: query })}
          className={`${ROW} text-left lg:w-[calc((100%-1.5rem)/3)]`}
        >
          <Search aria-hidden className="size-5 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate text-base font-semibold">
            {t('found.searchExplore', { query })}
          </span>
          <OpensMark />
        </button>
      </section>
    </div>
  )
}
