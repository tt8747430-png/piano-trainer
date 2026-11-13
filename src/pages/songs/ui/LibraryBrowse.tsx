import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { DEFAULT_CARD_LOOK, useFolderName, useLibrary, type CardPlace } from '@/entities/library'
import {
  CardLookProvider,
  cardLookProps,
  FolderRow,
  LibraryRows,
  SongRow,
} from '@/widgets/song-library'
import { folderKey, songKey, type LibraryPage } from '../model/use-library-page'
import { folderActions, songActions } from './row-actions'
import { SongTable } from './SongTable'
import { FilteredNotice, FoldSection, type Fold } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** How many of Home's every song show before Show all. */
const FOLDED = 10

/**
 * The library as it is read (Mindscape's browse): the place's folders, each a row to its page, then
 * its songs, each a row to its own; while the filters look through it, the songs under their
 * folders' paths, and how many they hide.
 */
export function LibraryBrowse({
  page,
  place,
  table = false,
  moreFolders,
  onClear,
}: {
  page: LibraryPage
  /** Where it is: its look is this place's Card style (R29 B9). */
  place: CardPlace
  /** A laptop's right pane (R30 S2), the folders the tree's: its songs a table in the List layout. */
  table?: boolean
  /** Rows at the foot of the folders: a phone's Home's Shared with me (canvas 133). */
  moreFolders?: ReactNode
  onClear: () => void
}) {
  const { t } = useTranslation(['songs', 'common'])
  const nameOf = useFolderName()
  const look = useLibrary((state) => state.cardLooks[place])
  const { view } = page
  const styled = cardLookProps(look)
  // A laptop's pane draws its songs as a table in List, as the style's cards in Cards and Grid.
  const asTable = table && (look?.style.layout ?? 'list') === 'list'
  // Home's every song folds after its first (a calm page, never thousands of pixels): Show all n.
  const [unfolded, setUnfolded] = useState(false)
  const headed = view.groups.some((group) => group.key === 'all')
  // Which of Home's sections are folded, while the page is open.
  const [folded, setFolded] = useState<ReadonlySet<string>>(new Set())
  const fold = (key: string): Fold => ({
    open: !folded.has(key),
    toggle: () =>
      setFolded((now) => {
        const next = new Set(now)
        if (!next.delete(key)) next.add(key)
        return next
      }),
  })
  const folderRows = (
    <LibraryRows look={look}>
      {view.folders.map(({ folder, ...holds }) => (
        <FolderRow
          key={folder.id}
          folder={folder}
          holds={holds}
          actions={folderActions(folder, nameOf(folder), page, t)}
          onSelect={() => page.select.start(folderKey(folder.id))}
        />
      ))}
      {moreFolders}
    </LibraryRows>
  )
  return (
    <CardLookProvider value={look ?? DEFAULT_CARD_LOOK}>
      <div className="flex flex-col gap-6">
        <FilteredNotice shown={view.shown} hidden={view.hidden} onClear={onClear} />
        {view.folders.length > 0 || moreFolders ? (
          headed ? (
            // Headed beside Continue and the songs, a phone's Home's sections (canvas 133), folding.
            <FoldSection
              title={t('folder.list')}
              count={view.folders.length}
              fold={fold('folders')}
            >
              {folderRows}
            </FoldSection>
          ) : (
            <section aria-label={t('folder.list')}>{folderRows}</section>
          )
        ) : null}
        {asTable ? (
          // List on a laptop is the table, inside one card in the place's style (R32-C).
          look ? (
            <div {...styled}>
              <div className="card overflow-hidden px-2">
                <SongTable entries={view.groups.flatMap((group) => group.entries)} page={page} />
              </div>
            </div>
          ) : (
            <SongTable entries={view.groups.flatMap((group) => group.entries)} page={page} />
          )
        ) : null}
        {(asTable ? [] : view.groups).map((group) => {
          if (group.entries.length === 0) return null
          const folds = group.key === 'all' && !unfolded && group.entries.length > FOLDED
          const rows = (
            <>
              <LibraryRows look={look}>
                {(folds ? group.entries.slice(0, FOLDED) : group.entries).map((entry) => (
                  <SongRow
                    key={entry.id}
                    entry={entry}
                    actions={songActions(entry, page, t)}
                    onSelect={() => page.select.start(songKey(entry.id))}
                  />
                ))}
              </LibraryRows>
              {folds ? (
                <Button variant="soft" className="self-start" onClick={() => setUnfolded(true)}>
                  {t('library.showAll', { count: group.entries.length })}
                </Button>
              ) : null}
            </>
          )
          return group.heading ? (
            <FoldSection
              key={group.key}
              title={group.heading}
              count={group.entries.length}
              fold={fold(group.key)}
            >
              {rows}
            </FoldSection>
          ) : (
            <section key={group.key} aria-label={t('title')} className="flex flex-col gap-3">
              {rows}
            </section>
          )
        })}
      </div>
    </CardLookProvider>
  )
}
