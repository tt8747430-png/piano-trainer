import { Link } from '@tanstack/react-router'
import { Archive, ChevronDown, Heart, Music, type LucideIcon } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  childFolders,
  folderPath,
  FOLDER_PICTURE_ICONS,
  useFolderName,
  useLibrary,
  useLibraryLayout,
  type FolderId,
  type ShelvedFolder,
} from '@/entities/library'
import { cn } from '@/shared/lib'
import { PAINT } from '@/shared/ui'

/** Where the learner is in the library, as the tree marks it. */
export type TreePlace = 'all' | 'favourites' | FolderId

const ITEM =
  'flex min-h-10 min-w-0 flex-1 items-center gap-2.5 rounded-control px-2 text-[0.9375rem] font-medium text-foreground transition-colors duration-200 hover:bg-muted focus-visible:-outline-offset-3 aria-[current=page]:bg-chosen aria-[current=page]:font-semibold'

/** A count at a row's end, in soft ink. */
const Count = ({ n }: { n: number }) => (
  <span className="ms-auto ps-2 text-sm font-normal text-muted-foreground tabular-nums">{n}</span>
)

/** A small tile of a folder's picture on its paint, the tree's size. */
function FolderSwatch({ folder }: { folder: ShelvedFolder }) {
  const Icon = FOLDER_PICTURE_ICONS[folder.picture]
  return (
    <span
      aria-hidden
      className={cn(
        'grid size-6 shrink-0 place-items-center rounded-pill',
        PAINT[folder.paint].fill,
        PAINT[folder.paint].ink,
      )}
    >
      <Icon className="size-3.5" />
    </span>
  )
}

function Place({
  to,
  favourites = false,
  icon: Icon,
  label,
  count,
  current,
}: {
  to: '/songs' | '/songs/archive'
  favourites?: boolean
  icon: LucideIcon
  label: string
  count: number
  current: boolean
}) {
  return (
    <li className="flex">
      <Link
        to={to}
        search={to === '/songs' ? (favourites ? { favourites: true } : {}) : undefined}
        // The tree marks the place itself: the router's own mark would light All songs in a folder.
        activeOptions={{ exact: true, includeSearch: true }}
        activeProps={{}}
        aria-current={current ? 'page' : undefined}
        className={ITEM}
      >
        <Icon aria-hidden className="size-4.5 shrink-0 text-muted-foreground" />
        <span className="min-w-0 truncate">{label}</span>
        <Count n={count} />
      </Link>
    </li>
  )
}

/**
 * The library as a tree, the laptop's left pane (Mindscape's and Apple Music's sidebar): All songs and
 * Favourites, the learner's folders nested and folded (a folder holding folders has a disclosure, the
 * path to the folder open unfolded), and the Archive at its foot. Each row a link to its place,
 * the place open marked.
 */
export function LibraryTree({ current, extra }: { current: TreePlace; extra?: ReactNode }) {
  const { t } = useTranslation('songs')
  const layout = useLibraryLayout()
  const nameOf = useFolderName()
  const favourites = useLibrary((state) => state.favourites.length)
  const songs = new Set(layout.folders.flatMap((folder) => folder.songs))
  for (const id of layout.home) songs.add(id)
  // The folders on the way to the one open stand unfolded.
  const path =
    current === 'all' || current === 'favourites'
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
    return (
      <ul className="flex flex-col gap-0.5">
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
                ) : (
                  <span aria-hidden className="size-6 shrink-0" />
                )}
                <Link
                  to="/songs/folders/$folderId"
                  params={{ folderId: folder.id }}
                  aria-current={current === folder.id ? 'page' : undefined}
                  className={ITEM}
                >
                  <FolderSwatch folder={folder} />
                  <span className="min-w-0 truncate">{name}</span>
                  <Count n={folder.songs.length} />
                </Link>
              </div>
              {unfolded ? branch(folder.id, depth + 1) : null}
            </li>
          )
        })}
      </ul>
    )
  }
  return (
    <nav aria-label={t('tree.label')} className="flex flex-col gap-1">
      <ul className="flex flex-col gap-0.5">
        <Place
          to="/songs"
          icon={Music}
          label={t('tree.all')}
          count={songs.size}
          current={current === 'all'}
        />
        <Place
          to="/songs"
          favourites
          icon={Heart}
          label={t('favourites')}
          count={favourites}
          current={current === 'favourites'}
        />
      </ul>
      <h2 className="px-2 pt-4 pb-1 font-sans text-xs font-semibold text-muted-foreground">
        {t('tree.folders')}
      </h2>
      {branch(null, 0)}
      {extra}
      <ul className="mt-4 flex flex-col gap-0.5">
        <Place
          to="/songs/archive"
          icon={Archive}
          label={t('archive.title')}
          count={layout.archive.length}
          current={false}
        />
      </ul>
    </nav>
  )
}
