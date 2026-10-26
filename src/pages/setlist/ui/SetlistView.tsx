import { useSearch } from '@tanstack/react-router'
import { Copy, Ellipsis, ListPlus, PencilLine, Trash2 } from 'lucide-react'
import { useDeferredValue, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SETLIST_NAME_MAX, type Setlist } from '@/entities/library'
import { useViewChange } from '@/shared/lib'
import {
  ActionMenu,
  BackButton,
  EditableTitle,
  RoundButton,
  ScreenHeader,
  SearchField,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/shared/ui/primitives/empty'
import type { SetlistSearch } from '../model/setlist-search'
import { useSetlist } from '../model/use-setlist'
import { AddSongsSheet } from './AddSongsSheet'
import { DeleteSetlistAsk } from './DeleteSetlistAsk'
import { SetlistSongs } from './SetlistSongs'

/**
 * A setlist's page (ADR 0103): its bar (Back; its name, renamed where it is printed; Add songs and
 * More: Rename, Duplicate, and Delete, asked first), a search in it, and its songs in the learner's
 * order, each moved by its handle and taken out by its Remove; Add songs a sheet of the repertoire
 * by search. Empty, it says how to fill it.
 */
export function SetlistView({ setlist }: { setlist: Setlist }) {
  const { t } = useTranslation('songs')
  const search = useSearch({ from: '/shell/songs/setlists/$setlistId' })
  const set = useViewChange<SetlistSearch>()
  const query = useDeferredValue(search.q)
  const setlistActs = useSetlist(setlist, query)
  const [renaming, setRenaming] = useState(false)
  const [adding, setAdding] = useState(false)
  const [deleting, setDeleting] = useState(false)
  // More, which takes the focus back from the dialog it opened: the action chosen is folded away.
  const more = useRef<HTMLDivElement>(null)
  const searched = search.q.trim()
  return (
    <div className="flex flex-col gap-6 pb-4">
      <ScreenHeader
        title={setlist.name}
        heading={
          <EditableTitle
            value={setlist.name}
            label={t('library.setlistName')}
            hint={t('setlist.rename')}
            maxLength={SETLIST_NAME_MAX}
            editing={renaming}
            onEditingChange={setRenaming}
            onRename={setlistActs.rename}
          />
        }
        back={<BackButton fallback={{ to: '/songs', search: { collection: 'setlists' } }} />}
        actions={
          <>
            <RoundButton
              label={t('setlist.addSongs')}
              icon={ListPlus}
              onClick={() => setAdding(true)}
            />
            <div ref={more} className="contents">
              <ActionMenu
                label={t('setlist.more')}
                align="end"
                trigger={<Ellipsis aria-hidden />}
                render={
                  <Button
                    variant="surface"
                    size="icon"
                    className="rounded-full"
                    aria-label={t('setlist.more')}
                    title={t('setlist.more')}
                  />
                }
                actions={[
                  {
                    key: 'rename',
                    label: t('setlist.rename'),
                    icon: PencilLine,
                    onSelect: () => setRenaming(true),
                  },
                  {
                    key: 'duplicate',
                    label: t('setlist.duplicate'),
                    icon: Copy,
                    disabled: !setlistActs.room,
                    reason: t('library.full'),
                    onSelect: setlistActs.duplicate,
                  },
                  {
                    key: 'delete',
                    label: t('setlist.delete'),
                    icon: Trash2,
                    destructive: true,
                    onSelect: () => setDeleting(true),
                  },
                ]}
              />
            </div>
          </>
        }
      />
      {setlistActs.pieces.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{t('setlist.empty.title')}</EmptyTitle>
            <EmptyDescription>{t('setlist.empty.description')}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="soft" onClick={() => setAdding(true)}>
              <ListPlus data-icon="inline-start" aria-hidden />
              {t('setlist.addSongs')}
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <div className="lg:max-w-3xl">
            <SearchField
              value={search.q}
              onChange={(q) => set({ q })}
              label={t('setlist.search')}
              screen={setlist.name}
            />
          </div>
          {setlistActs.shown.length > 0 ? (
            <SetlistSongs
              pieces={setlistActs.shown}
              onMove={setlistActs.move}
              onRemove={setlistActs.remove}
            />
          ) : (
            <Empty>
              <EmptyHeader>
                {/* A long query breaks rather than run off the screen. */}
                <EmptyTitle className="break-words">
                  {t('setlist.emptyQuery', { query: searched })}
                </EmptyTitle>
              </EmptyHeader>
            </Empty>
          )}
        </>
      )}
      <AddSongsSheet setlist={setlist} open={adding} onOpenChange={setAdding} />
      <DeleteSetlistAsk
        name={setlist.name}
        open={deleting}
        onOpenChange={setDeleting}
        onDelete={setlistActs.delete}
        returnTo={more}
      />
    </div>
  )
}
