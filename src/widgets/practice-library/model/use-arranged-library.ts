import { Eye, EyeOff, FolderInput, PencilLine, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  arrangedItems,
  arrangedPlaces,
  moveItem,
  renameItem,
  selectArrangement,
  setItemHidden,
  usePracticeLibrary,
  usePracticeLibraryStoreApi,
  type ArrangedPlace,
} from '@/entities/practice-library'
import { arrangeLibrary } from '@/features/manage-practice-library'
import { sayUndo } from '@/shared/ui'
import { HIDDEN, MINE, type LibraryGroup, type LibraryItem } from './library-view'
import type { LibraryKind } from './library-words'

/** What is open over a library while it is arranged: one sheet at a time. */
export type ArrangeSheet =
  | { readonly kind: 'renameItem'; readonly id: string; readonly name: string }
  | { readonly kind: 'renamePlace'; readonly id: string; readonly name: string }
  | { readonly kind: 'move'; readonly id: string; readonly name: string; readonly home: string }
  | { readonly kind: 'newFolder' }

/** A library as the learner arranged it. */
interface ArrangedLibraryView {
  /** Every place, in the learner's order, hidden ones too: Edit and Move to list them. */
  readonly places: readonly ArrangedPlace[]
  /** The places shown: the tree's and the phone's runs. */
  readonly groups: readonly LibraryGroup[]
  /** The rows, each where it stands, under its name, Hidden's while hidden; More with Rename, Move to, Hide. */
  readonly items: readonly LibraryItem[]
}

/** A library's row as the learner placed it: where it stands, Hidden's while hidden. */
export type PlacedItem = LibraryItem & {
  /** Its own place, before any move. */
  readonly home: string
  readonly renamed: boolean
}

/**
 * A Practice library's places and rows as the learner arranged them (R32), with no acts: the books
 * (or styles) and their own folders in their order, renamed and hidden as set; each row in the
 * place it was moved to, under its name, Hidden's while hidden with its place or alone. A row whose
 * page keeps its own hiding (a pattern, which the Player's picker leaves out) hides through it
 * (`item.hide`). The library's page and the Player's Pattern sheet read it alike.
 */
export function useLibraryArrangement({
  kind,
  items,
  groups,
}: {
  kind: LibraryKind
  items: readonly LibraryItem[]
  groups: readonly LibraryGroup[]
}): {
  readonly places: readonly ArrangedPlace[]
  readonly groups: readonly LibraryGroup[]
  readonly items: readonly PlacedItem[]
} {
  const arrangement = usePracticeLibrary(selectArrangement(kind))
  const places = arrangedPlaces(groups, arrangement)
  const rows = arrangedItems(items, places, arrangement).map((item): PlacedItem => {
    const hiddenHere = item.hide ? item.hide.hidden : item.hidden
    return {
      ...item,
      group: hiddenHere || item.home === HIDDEN ? HIDDEN : item.group,
    }
  })
  return {
    places,
    groups: places
      .filter((place) => !place.hidden)
      .map((place) => ({ id: place.id, name: place.name })),
    items: rows,
  }
}

/**
 * A Practice library as the learner arranged it (`useLibraryArrangement`), each row's More adding
 * Rename…, Move to…, Hide (Show under Hidden) and, renamed, Restore original name.
 */
export function useArrangedLibrary({
  kind,
  items,
  groups,
  onSheet,
}: {
  kind: LibraryKind
  items: readonly LibraryItem[]
  groups: readonly LibraryGroup[]
  onSheet: (sheet: ArrangeSheet) => void
}): ArrangedLibraryView {
  const { t } = useTranslation('practice')
  const store = usePracticeLibraryStoreApi()
  const arranged = useLibraryArrangement({ kind, items, groups })
  const change = (apply: Parameters<typeof arrangeLibrary>[2]) => arrangeLibrary(store, kind, apply)
  const rows = arranged.items.map((item): LibraryItem => {
    const setHidden = (hidden: boolean) => {
      if (item.hide) item.hide.toggle()
      else change((each) => setItemHidden(each, item.id, hidden))
      sayUndo(t(hidden ? 'library.edit.hidden' : 'library.edit.shown', { name: item.name }), () =>
        item.hide ? item.hide.toggle() : change((each) => setItemHidden(each, item.id, !hidden)),
      )
    }
    return {
      ...item,
      actions: [
        ...item.actions,
        {
          key: 'rename',
          label: t('library.edit.rename'),
          icon: PencilLine,
          paint: 'sky',
          group: 'arrange',
          onSelect: () => onSheet({ kind: 'renameItem', id: item.id, name: item.name }),
        },
        ...(item.home === MINE || item.home === HIDDEN
          ? []
          : [
              {
                key: 'move',
                label: t('library.edit.move'),
                icon: FolderInput,
                paint: 'lilac' as const,
                group: 'arrange',
                onSelect: () =>
                  onSheet({ kind: 'move', id: item.id, name: item.name, home: item.home }),
              },
            ]),
        item.group === HIDDEN
          ? {
              key: 'show',
              label: t('library.edit.show'),
              icon: Eye,
              paint: 'grass' as const,
              group: 'arrange',
              onSelect: () => setHidden(false),
            }
          : {
              key: 'hide',
              label: t('library.edit.hide'),
              icon: EyeOff,
              paint: 'sand' as const,
              group: 'arrange',
              onSelect: () => setHidden(true),
            },
        ...(item.renamed
          ? [
              {
                key: 'restore',
                label: t('library.edit.restore'),
                icon: RotateCcw,
                paint: 'sky' as const,
                group: 'arrange',
                onSelect: () => change((each) => renameItem(each, item.id, '')),
              },
            ]
          : []),
      ],
    }
  })
  return { places: arranged.places, groups: arranged.groups, items: rows }
}

/** A row moved to another place, or home, with Undo in the toast. */
export function useMoveItem(kind: LibraryKind) {
  const { t } = useTranslation('practice')
  const store = usePracticeLibraryStoreApi()
  return (item: { id: string; name: string; home: string }, to: ArrangedPlace) => {
    const before = store.getState().arrangements[kind].placed[item.id] ?? item.home
    arrangeLibrary(store, kind, (each) => moveItem(each, item.id, to.id, item.home))
    sayUndo(t('library.edit.moved', { name: item.name, place: to.name }), () =>
      arrangeLibrary(store, kind, (each) => moveItem(each, item.id, before, item.home)),
    )
  }
}
