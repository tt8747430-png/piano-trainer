import { Link } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  childFolders,
  folderPath,
  useFolderName,
  useLibraryLayout,
  type FolderId,
  type ShelvedFolder,
} from '@/entities/library'
import { cn } from '@/shared/lib'
import { PAINT, TREE_ITEM, TreeCount, TreeHeading, TreeItem, TreeList } from '@/shared/ui'

/** Where the learner is in the library, as the tree marks it. */
/** A place of the tree: All songs, a filter's own (Favourites, Learning, Learned), or a folder. */
export type TreePlace = 'all' | 'favourites' | 'learning' | 'learned' | FolderId

/** The places that filter All songs (canvas 133's Places), each its search. */
const FILTERED = {
  all: {},
  favourites: { favourites: true },
  learning: { learned: 'no' },
  learned: { learned: 'yes' },
} as const

/** A folder's mark in the pane, the board's: a 10px square of its paint, 3 round. */
const FolderSwatch = ({ folder }: { folder: ShelvedFolder }) => (
  <span aria-hidden className={cn('size-2.5 shrink-0 rounded-[3px]', PAINT[folder.paint].fill)} />
)

/** A place, as the board's pane names it: its word alone, the open one in bold on its wash. */
function Place({
  place = 'all',
  label,
  current,
}: {
  /** The filter of All songs it is. */
  place?: keyof typeof FILTERED
  label: string
  current: boolean
}) {
  return (
    <TreeItem
      label={label}
      current={current}
      render={
        <Link
          to="/songs"
          search={FILTERED[place]}
          // The tree marks the place itself: the router's own mark would light All songs in a folder.
          activeOptions={{ exact: true, includeSearch: true }}
          activeProps={{}}
        />
      }
    />
  )
}

/**
 * The library as a tree, the laptop's left pane as the board draws it (`r41_lib`): Places (All,
 * Favourites, Learning, Learned) by their words alone, then the learner's folders, each a dot of its
 * paint and its count, nested and folded (a folder holding folders has a disclosure, the path to the
 * folder open unfolded). The Archive is the bar's, the Trash its ···. Each row a link to its place,
 * the place open marked.
 */
export function LibraryTree({ current, extra }: { current: TreePlace; extra?: ReactNode }) {
  const { t } = useTranslation('songs')
  const layout = useLibraryLayout()
  const nameOf = useFolderName()
  // The folders on the way to the one open stand unfolded.
  const path =
    current === 'all' || current === 'favourites' || current === 'learning' || current === 'learned'
      ? []
      : folderPath(layout.folders, current).map((folder) => folder.id)
  const [open, setOpen] = useState<ReadonlySet<FolderId>>(() => new Set(path))
  const toggle = (id: FolderId) =>
    setOpen((was) => {
      const next = new Set(was)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  const branch = (parent: FolderId | null, depth: number): ReactNode => {
    const folders = childFolders(layout.folders, parent)
    if (folders.length === 0) return null
    // The disclosure's room is kept only where a folder of this run holds folders, so a flat
    // library's folders stand on the places' edge, as the board's.
    const disclosing = folders.some((each) => childFolders(layout.folders, each.id).length > 0)
    return (
      <TreeList>
        {folders.map((folder) => {
          const nested = childFolders(layout.folders, folder.id).length > 0
          const unfolded = nested && (open.has(folder.id) || path.includes(folder.id))
          const name = nameOf(folder)
          return (
            <li key={folder.id}>
              <div
                className="flex items-center"
                style={{ paddingInlineStart: `${depth * 1.25}rem` }}
              >
                {nested ? (
                  <button
                    type="button"
                    aria-expanded={unfolded}
                    aria-label={t(unfolded ? 'tree.fold' : 'tree.unfold', { name })}
                    onClick={() => toggle(folder.id)}
                    className="grid size-6 shrink-0 place-items-center rounded-control text-muted-foreground hover:bg-muted"
                  >
                    {/* A disclosure, not a way somewhere: one chevron, turned while folded. */}
                    <ChevronDown
                      aria-hidden
                      className={cn(
                        'size-4 transition-transform duration-200',
                        !unfolded && '-rotate-90',
                      )}
                    />
                  </button>
                ) : disclosing ? (
                  <span aria-hidden className="size-6 shrink-0" />
                ) : null}
                <Link
                  to="/songs/folders/$folderId"
                  params={{ folderId: folder.id }}
                  aria-current={current === folder.id ? 'page' : undefined}
                  className={TREE_ITEM}
                >
                  <FolderSwatch folder={folder} />
                  <span className="min-w-0 truncate">{name}</span>
                  <TreeCount n={folder.songs.length} />
                </Link>
              </div>
              {unfolded ? branch(folder.id, depth + 1) : null}
            </li>
          )
        })}
      </TreeList>
    )
  }
  return (
    <nav aria-label={t('tree.label')} className="flex flex-col">
      <TreeHeading first>{t('tree.places')}</TreeHeading>
      <TreeList>
        <Place label={t('places.all')} current={current === 'all'} />
        <Place
          place="favourites"
          label={t('places.favourites')}
          current={current === 'favourites'}
        />
        <Place place="learning" label={t('places.learning')} current={current === 'learning'} />
        <Place place="learned" label={t('places.learned')} current={current === 'learned'} />
      </TreeList>
      <TreeHeading>{t('tree.folders')}</TreeHeading>
      {branch(null, 0)}
      {extra}
    </nav>
  )
}
