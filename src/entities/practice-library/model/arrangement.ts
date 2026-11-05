/**
 * How the learner arranges a Practice library (R32): its places (the built-in books or styles and
 * their own folders) in their order, renamed or hidden, and its items moved to another place,
 * renamed, hidden or put in an order of their own. It is an overlay over the catalog: nothing built in
 * changes by it, and "Restore original name" undoes a name.
 */

/** The libraries a learner arranges. */
export const ARRANGED_LIBRARIES = ['exercises', 'accompaniment', 'progressions'] as const
export type ArrangedLibrary = (typeof ARRANGED_LIBRARIES)[number]

/** A folder of the learner's own: `folder-` and its number, never reused. */
export type LibraryFolderId = `folder-${number}`

/** The longest name a place or an item takes. */
export const ARRANGED_NAME_MAX = 60

export interface LibraryFolder {
  readonly id: LibraryFolderId
  readonly name: string
}

/** One library's arrangement. */
export interface Arrangement {
  /** The places in the learner's order; a place not listed comes after, in the catalog's order. */
  readonly order: readonly string[]
  /** A place's name of the learner's, by its id. */
  readonly placeNames: Readonly<Record<string, string>>
  /** The places hidden: their items show only under Hidden. */
  readonly hiddenPlaces: readonly string[]
  /** The learner's folders, in the order made. */
  readonly folders: readonly LibraryFolder[]
  /** An item moved to another place: its id, and the place's. */
  readonly placed: Readonly<Record<string, string>>
  /** An item's name of the learner's, by its id. */
  readonly itemNames: Readonly<Record<string, string>>
  /** The items hidden. */
  readonly hiddenItems: readonly string[]
  /** A place's items in the learner's order; one not listed comes after, in the catalog's order. */
  readonly sequence: Readonly<Record<string, readonly string[]>>
}

export const EMPTY_ARRANGEMENT: Arrangement = {
  order: [],
  placeNames: {},
  hiddenPlaces: [],
  folders: [],
  placed: {},
  itemNames: {},
  hiddenItems: [],
  sequence: {},
}

export const libraryFolderId = (number: number): LibraryFolderId => `folder-${number}`
export const isLibraryFolderId = (value: unknown): value is LibraryFolderId =>
  typeof value === 'string' && /^folder-[1-9]\d*$/.test(value)

/** A name as kept: trimmed, 1 to 60 characters; null for one that is not. */
export function arrangedName(name: string): string | null {
  const kept = name.trim()
  return kept.length > 0 && kept.length <= ARRANGED_NAME_MAX ? kept : null
}

const without = <T>(list: readonly T[], value: T): T[] => list.filter((each) => each !== value)
const omit = <V>(record: Readonly<Record<string, V>>, key: string): Record<string, V> =>
  Object.fromEntries(Object.entries(record).filter(([each]) => each !== key))

/** A place renamed; an empty name, or its own, gives it back its own. */
export function renamePlace(arrangement: Arrangement, place: string, name: string): Arrangement {
  const kept = arrangedName(name)
  const folder = arrangement.folders.find((each) => each.id === place)
  if (folder)
    return kept
      ? {
          ...arrangement,
          folders: arrangement.folders.map((each) =>
            each.id === place ? { ...each, name: kept } : each,
          ),
        }
      : arrangement
  return {
    ...arrangement,
    placeNames: kept
      ? { ...arrangement.placeNames, [place]: kept }
      : omit(arrangement.placeNames, place),
  }
}

/** A place hidden, or shown again. */
export const setPlaceHidden = (
  arrangement: Arrangement,
  place: string,
  hidden: boolean,
): Arrangement => ({
  ...arrangement,
  hiddenPlaces: hidden
    ? [...without(arrangement.hiddenPlaces, place), place]
    : without(arrangement.hiddenPlaces, place),
})

/** The places in a new order (a drop's). */
export const orderPlaces = (arrangement: Arrangement, order: readonly string[]): Arrangement => ({
  ...arrangement,
  order: [...new Set(order)],
})

/** A folder of the learner's own made, last among the places. */
export function addFolder(
  arrangement: Arrangement,
  id: LibraryFolderId,
  name: string,
): Arrangement {
  const kept = arrangedName(name)
  if (!kept || arrangement.folders.some((each) => each.id === id)) return arrangement
  return { ...arrangement, folders: [...arrangement.folders, { id, name: kept }] }
}

/** A folder of the learner's own deleted: what was moved into it goes back to its own place. */
export function deleteFolder(arrangement: Arrangement, id: LibraryFolderId): Arrangement {
  return {
    ...arrangement,
    folders: arrangement.folders.filter((each) => each.id !== id),
    order: without(arrangement.order, id),
    hiddenPlaces: without(arrangement.hiddenPlaces, id),
    placed: Object.fromEntries(Object.entries(arrangement.placed).filter(([, to]) => to !== id)),
    sequence: omit(arrangement.sequence, id),
  }
}

/** An item moved to a place; to its own place, it simply goes home. */
export const moveItem = (
  arrangement: Arrangement,
  item: string,
  to: string,
  home: string,
): Arrangement => ({
  ...arrangement,
  placed: to === home ? omit(arrangement.placed, item) : { ...arrangement.placed, [item]: to },
})

/** An item renamed; an empty name gives it back its own. */
export function renameItem(arrangement: Arrangement, item: string, name: string): Arrangement {
  const kept = arrangedName(name)
  return {
    ...arrangement,
    itemNames: kept
      ? { ...arrangement.itemNames, [item]: kept }
      : omit(arrangement.itemNames, item),
  }
}

/** An item hidden, or shown again. */
export const setItemHidden = (
  arrangement: Arrangement,
  item: string,
  hidden: boolean,
): Arrangement => ({
  ...arrangement,
  hiddenItems: hidden
    ? [...without(arrangement.hiddenItems, item), item]
    : without(arrangement.hiddenItems, item),
})

/** A place's items in a new order (a drop's). */
export const orderItems = (
  arrangement: Arrangement,
  place: string,
  order: readonly string[],
): Arrangement => ({
  ...arrangement,
  sequence: { ...arrangement.sequence, [place]: [...new Set(order)] },
})

/** A built-in place as the catalog has it. */
export interface CatalogPlace {
  readonly id: string
  readonly name: string
}

/** A place as the library shows it. */
export interface ArrangedPlace {
  readonly id: string
  readonly name: string
  /** One of the catalog's books or styles, not the learner's folder. */
  readonly builtIn: boolean
  /** Named by the learner (a built-in one's own name restorable). */
  readonly renamed: boolean
  readonly hidden: boolean
}

/** The places in the learner's order: the catalog's (renamed, hidden as set), then their folders. */
export function arrangedPlaces(
  catalog: readonly CatalogPlace[],
  arrangement: Arrangement,
): ArrangedPlace[] {
  const all: ArrangedPlace[] = [
    ...catalog.map((place) => ({
      id: place.id,
      name: arrangement.placeNames[place.id] ?? place.name,
      builtIn: true,
      renamed: place.id in arrangement.placeNames,
      hidden: arrangement.hiddenPlaces.includes(place.id),
    })),
    ...arrangement.folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      builtIn: false,
      renamed: false,
      hidden: arrangement.hiddenPlaces.includes(folder.id),
    })),
  ]
  const rank = (id: string) => {
    const at = arrangement.order.indexOf(id)
    return at < 0 ? arrangement.order.length + all.findIndex((place) => place.id === id) : at
  }
  return all.toSorted((a, b) => rank(a.id) - rank(b.id))
}

/** What an item is as the catalog has it: its id, its own place, its own name. */
export interface CatalogItem {
  readonly id: string
  readonly group: string
  readonly name: string
}

/** An item as the library shows it: where it stands, what it is called, and whether it is hidden. */
export type ArrangedItem<T extends CatalogItem> = T & {
  /** Its own place, before any move. */
  readonly home: string
  /** Its name as the catalog gives it. */
  readonly ownName: string
  readonly renamed: boolean
  readonly hidden: boolean
}

/**
 * The items as arranged: each in the place it was moved to (its own where that place is gone), under
 * its name of the learner's, hidden as set, or with its place; then in each place's order of the
 * learner's, the rest in the catalog's.
 */
export function arrangedItems<T extends CatalogItem>(
  items: readonly T[],
  places: readonly ArrangedPlace[],
  arrangement: Arrangement,
): ArrangedItem<T>[] {
  const known = new Set(places.map((place) => place.id))
  const hiddenPlaces = new Set(places.filter((place) => place.hidden).map((place) => place.id))
  const arranged = items.map((item): ArrangedItem<T> => {
    const moved = arrangement.placed[item.id]
    const group = moved !== undefined && known.has(moved) ? moved : item.group
    const name = arrangement.itemNames[item.id]
    return {
      ...item,
      group,
      home: item.group,
      ownName: item.name,
      name: name ?? item.name,
      renamed: name !== undefined,
      hidden: arrangement.hiddenItems.includes(item.id) || hiddenPlaces.has(group),
    }
  })
  const catalogAt = new Map(items.map((item, at) => [item.id, at]))
  const rank = (item: ArrangedItem<T>) => {
    const sequence = arrangement.sequence[item.group] ?? []
    const at = sequence.indexOf(item.id)
    return at < 0 ? sequence.length + (catalogAt.get(item.id) ?? 0) : at
  }
  const placeAt = new Map(places.map((place, at) => [place.id, at]))
  const placeRank = (item: ArrangedItem<T>) => placeAt.get(item.group) ?? places.length
  return arranged.toSorted((a, b) => placeRank(a) - placeRank(b) || rank(a) - rank(b))
}
