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
import { say } from '@/shared/ui'
import { HIDDEN, MINE, type LibraryGroup, type LibraryItem } from './library-view'
import type { LibraryKind } from './library-words'

/** What is open over a library while it is arranged: one sheet at a time. */
export type ArrangeSheet =
  | { readonly kind: 'renameItem'; readonly id: string; readonly name: string }
  | { readonly kind: 'renamePlace'; readonly id: string; readonly name: string }
  | { readonly kind: 'move'; readonly id: string; readonly name: string; readonly home: string }
  | { readonly kind: 'newFolder' }

/** A library as the learner arranged it. */
export interface ArrangedLibraryView {
  /** Every place, in the learner's order, hidden ones too: Edit and Move to list them. */
  readonly places: readonly ArrangedPlace[]
  /** The places shown: the tree's and the phone's runs. */
  readonly groups: readonly LibraryGroup[]
  /** The rows, each where it stands, under its name, Hidden's while hidden; More with Rename, Move to, Hide. */
  readonly items: readonly LibraryItem[]
}

/**
 * A Practice library as the learner arranged it (R32): the books (or styles) and their own folders
 * in their order, renamed and hidden as set; each row in the place it was moved to, under its name,
 * hidden with its place or alone; each row's More adding Rename…, Move to…, Hide (Show under Hidden)
 * and, renamed, Restore original name. A row whose page keeps its own hiding (a pattern, which the
 * Player's picker leaves out) hides through it (`item.hide`).
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
  const arrangement = usePracticeLibrary(selectArrangement(kind))
  const places = arrangedPlaces(groups, arrangement)
  const links = new Map(groups.map((group) => [group.id, group.links]))
  const arranged = arrangedItems(
    // A row the page has hidden already stays Hidden's; the rest stand in their own place.
    items,
    places,
    arrangement,
  )
  const change = (apply: Parameters<typeof arrangeLibrary>[2]) => arrangeLibrary(store, kind, apply)
  const rows = arranged.map((item): LibraryItem => {
    const hiddenHere = item.hide ? item.hide.hidden : item.hidden
    const group = hiddenHere || item.home === HIDDEN ? HIDDEN : item.group
    const setHidden = (hidden: boolean) => {
      if (item.hide) item.hide.toggle()
      else change((each) => setItemHidden(each, item.id, hidden))
      say(t(hidden ? 'library.edit.hidden' : 'library.edit.shown', { name: item.name }), {
        label: t('library.edit.undo'),
        onClick: () =>
          item.hide ? item.hide.toggle() : change((each) => setItemHidden(each, item.id, !hidden)),
      })
    }
    return {
      ...item,
      group,
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
        group === HIDDEN
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
  return {
    places,
    groups: places
      .filter((place) => !place.hidden)
      .map((place) => {
        const placeLinks = links.get(place.id)
        return { id: place.id, name: place.name, ...(placeLinks ? { links: placeLinks } : {}) }
      }),
    items: rows,
  }
}

/** A row moved to another place, or home, with Undo in the toast. */
export function useMoveItem(kind: LibraryKind) {
  const { t } = useTranslation('practice')
  const store = usePracticeLibraryStoreApi()
  return (item: { id: string; name: string; home: string }, to: ArrangedPlace) => {
    const before = store.getState().arrangements[kind].placed[item.id] ?? item.home
    arrangeLibrary(store, kind, (each) => moveItem(each, item.id, to.id, item.home))
    say(t('library.edit.moved', { name: item.name, place: to.name }), {
      label: t('library.edit.undo'),
      onClick: () =>
        arrangeLibrary(store, kind, (each) => moveItem(each, item.id, before, item.home)),
    })
  }
}
