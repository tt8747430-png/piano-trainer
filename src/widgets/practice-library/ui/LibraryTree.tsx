import { BookOpen, EyeOff, Heart, List, Music, UserRound, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSetSearch } from '@/shared/lib'
import { TreeHeading, TreeItem, TreeList } from '@/shared/ui'
import {
  ALL,
  FAVOURITES,
  HIDDEN,
  MINE,
  type LibraryGroup,
  type PracticeLibraryView,
} from '../model/library-view'
import type { GroupWord, LibraryKind } from '../model/library-words'

/** A book's picture in the tree, a style's: one picture, one meaning (the mockup's list for a style). */
const GROUP_ICON: Readonly<Record<GroupWord, LucideIcon>> = { book: BookOpen, style: List }

/**
 * A practice library as a tree, the laptop's left pane (R30-4, Songs' tree): All and Favourites,
 * the books (or styles) under their heading, then Mine where the learner makes rows of their own, and
 * Hidden while there are some. Each a place of the library with its count, a count of none left out;
 * the place open marked.
 */
export function LibraryTree({
  kind,
  place,
  groups,
  groupWord,
  mine,
  counts,
}: {
  kind: LibraryKind
  place: string
  groups: readonly LibraryGroup[]
  groupWord: GroupWord
  mine: boolean
  counts: Readonly<Record<string, number>>
}) {
  const { t } = useTranslation(['practice', 'common'])
  const set = useSetSearch<PracticeLibraryView>()
  const item = (id: string, label: string, icon: LucideIcon) => {
    const count = counts[id] ?? 0
    return (
      <TreeItem
        key={id}
        icon={icon}
        label={label}
        {...(count > 0 ? { count } : {})}
        current={place === id}
        render={<button type="button" onClick={() => set({ place: id })} />}
      />
    )
  }
  return (
    <nav aria-label={t(`practice:library.kinds.${kind}.tree`)} className="flex flex-col gap-1">
      <TreeList>
        {item(ALL, t('practice:library.all'), Music)}
        {item(FAVOURITES, t('common:library.favourites'), Heart)}
      </TreeList>
      <TreeHeading>{t(`practice:library.${groupWord}s`)}</TreeHeading>
      <TreeList>
        {groups.map((group) => item(group.id, group.name, GROUP_ICON[groupWord]))}
      </TreeList>
      {mine || (counts[HIDDEN] ?? 0) > 0 ? (
        <TreeList className="mt-4">
          {mine ? item(MINE, t('practice:library.mine'), UserRound) : null}
          {(counts[HIDDEN] ?? 0) > 0 ? item(HIDDEN, t('practice:library.hidden'), EyeOff) : null}
        </TreeList>
      ) : null}
    </nav>
  )
}
