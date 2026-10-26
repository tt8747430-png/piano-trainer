import { useDeferredValue, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLibraryStoreApi, type Setlist } from '@/entities/library'
import { COLLECTIONS, entryWords, useRepertoire, type Piece } from '@/entities/piece'
import { addToSetlist, removeFromSetlist } from '@/features/manage-library'
import { localText, useLocale } from '@/shared/i18n'
import { matchesQuery } from '@/shared/lib'
import { MenuSection, RowCheck, SearchField, Sheet, SheetContent } from '@/shared/ui'
import { useEntryFace } from '@/widgets/piece-list'

/** A song to add: a check, on while it is in the setlist. */
function SongCheck({ piece, setlist }: { piece: Piece; setlist: Setlist }) {
  const store = useLibraryStoreApi()
  const { title, detail } = useEntryFace(piece).face
  return (
    <li>
      <RowCheck
        title={title}
        detail={detail}
        checked={setlist.pieces.includes(piece.id)}
        onCheckedChange={(on) =>
          (on ? addToSetlist : removeFromSetlist)(store, setlist.id, piece.id)
        }
      />
    </li>
  )
}

/**
 * Add songs (Chordify's add by search), a sheet over the setlist: a search over the repertoire, every
 * piece that plays by its shelf (the learner's own first), each a check that puts it in at the
 * setlist's end or takes it out.
 */
export function AddSongsSheet({
  setlist,
  open,
  onOpenChange,
}: {
  setlist: Setlist
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation('songs')
  const locale = useLocale()
  const repertoire = useRepertoire()
  const [query, setQuery] = useState('')
  const searched = useDeferredValue(query)
  const played = (entries: readonly { readonly id: string }[]) =>
    entries.flatMap((entry) => {
      const piece = repertoire.piece(entry.id)
      return piece ? [piece] : []
    })
  const groups = [
    { id: 'mine', name: t('yours'), pieces: repertoire.ownSongs },
    ...COLLECTIONS.map((collection) => ({
      id: collection.id,
      name: localText(collection.name, locale),
      pieces: played(collection.entries),
    })),
  ]
    .map((group) => ({
      ...group,
      pieces: group.pieces.filter((piece) => matchesQuery(entryWords(piece), searched)),
    }))
    .filter((group) => group.pieces.length > 0)
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title={t('setlist.addSongs')}>
        <div className="flex flex-col gap-5">
          <SearchField value={query} onChange={setQuery} label={t('search')} />
          {groups.length > 0 ? (
            groups.map((group) => (
              <MenuSection key={group.id} title={group.name}>
                <ul className="flex flex-col">
                  {group.pieces.map((piece) => (
                    <SongCheck key={piece.id} piece={piece} setlist={setlist} />
                  ))}
                </ul>
              </MenuSection>
            ))
          ) : (
            <p className="text-muted-foreground">{t('emptyQuery', { query: searched.trim() })}</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
