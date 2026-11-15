import { selectIsFavourite, useLibrary, useLibraryStoreApi } from '@/entities/library'
import type { PieceId } from '@/entities/piece'
import { SwitchRow } from '@/shared/ui'
import { toggleFavourite } from '../toggle-favourite'

/** A song's Favourite on its Settings page (the board's Library group): the ♡'s switch, the same command. */
export function FavouriteSwitch({ piece, label }: { piece: PieceId; label: string }) {
  const store = useLibraryStoreApi()
  const favourite = useLibrary(selectIsFavourite(piece))
  return (
    <SwitchRow
      label={label}
      checked={favourite}
      onCheckedChange={(on) => {
        if (on !== favourite) toggleFavourite(store, piece)
      }}
    />
  )
}
