import { Link, useParams, useSearch } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  entryById,
  entryTitles,
  isDegreePiece,
  isPiece,
  musicOf,
  selectOwnSong,
  usePieces,
  usePiecesStoreApi,
  type ChartPiece,
} from '@/entities/piece'
import {
  DraftActions,
  DraftStatus,
  draftWithMusic,
  useMadeSong,
  useOriginalDraft,
} from '@/features/edit-original'
import { useLocale } from '@/shared/i18n'
import { editsContent, useAccount } from '@/shared/lib/account'
import { ButtonLink, NotFound } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { editorTarget, originalTarget } from '../model/editor-target'
import { NotOpen } from './NotOpen'
import { ScoreEditor } from './ScoreEditor'

function Editing({ id }: { id: string }) {
  const { t } = useTranslation('common')
  // The bar the caret opens on, as printed: the Player's cursor's, where Edit came from it (ADR 0115).
  const { bar } = useSearch({ from: '/full-screen/edit/$pieceId' })
  // The visit opens on what the store holds now; the editor saves into it from there.
  const pieces = usePiecesStoreApi()
  const [target] = useState(() => editorTarget(pieces.getState(), id))
  // An own song deleted in another tab: nothing is left to write into.
  const gone = usePieces(
    (state) => target?.kind === 'song' && selectOwnSong(state, target.id) === undefined,
  )
  if (!target || gone)
    return (
      <NotFound>
        <ButtonLink render={<Link to="/songs" />}>{t('notFound.toSongs')}</ButtonLink>
      </NotFound>
    )
  return <ScoreEditor target={target} bar={bar} />
}

/** A built-in song's original, an editor's to change (ADR 0116): its draft opened, then edited. */
function EditingOriginal({ piece }: { piece: ChartPiece }) {
  const { t } = useTranslation('editor')
  const locale = useLocale()
  const { bar } = useSearch({ from: '/full-screen/edit/$pieceId' })
  const draft = useOriginalDraft(piece)
  const { load, save } = draft
  // The score writes the draft's music; the rest of the song (what its page says) stays the draft's.
  const target = useMemo(() => {
    if (load.state !== 'ready') return null
    const opened = load.value
    return originalTarget(piece, musicOf(opened), (music) => save(draftWithMusic(opened, music)))
  }, [load, piece, save])
  if (load.state === 'loading') return <NotOpen line={t('original.opening')} />
  if (load.state === 'failed' || !target)
    return (
      <NotOpen
        line={t(
          load.state === 'failed' && load.reason === 'offline'
            ? 'original.offline'
            : 'original.failed',
        )}
      >
        <Button onClick={draft.reopen}>{t('original.retry')}</Button>
      </NotOpen>
    )
  return (
    <ScoreEditor
      key={draft.opened}
      target={target}
      bar={bar}
      draft={
        // Where the draft stands and its menu (Publish first), in the score's bar by Done: never
        // over the music (round 26).
        <>
          <DraftStatus draft={draft} className="px-1 max-[359px]:sr-only" />
          <DraftActions
            draft={draft}
            title={entryTitles(piece, locale).primary}
            unreadable={t('original.unreadable')}
            onReset={draft.reopen}
            publishInMenu
            variant="tool"
          />
        </>
      }
    />
  )
}

/** A song an editor made and has not published: its draft read from the server, then edited. */
function MadeOriginal({ id }: { id: string }) {
  const { t } = useTranslation('editor')
  const load = useMadeSong(id)
  if (load.state === 'loading') return <NotOpen line={t('original.opening')} />
  if (load.state === 'failed')
    return <NotOpen line={t(load.reason === 'offline' ? 'original.offline' : 'original.failed')} />
  if (load.state === 'none')
    return (
      <NotOpen line={t('original.failed')}>
        <ButtonLink render={<Link to="/songs" />}>{t('original.toSongs')}</ButtonLink>
      </NotOpen>
    )
  return <EditingOriginal piece={load.song} />
}

/**
 * The score editor over the route's piece. An editor edits the song everyone sees (ADR 0116): a
 * built-in song or study written as a chart, or a song an editor made and has not published yet,
 * its draft the server's. Anyone else edits their own song, or their version of a catalog song,
 * study or listing.
 */
export function ScoreEditorPage() {
  const { pieceId } = useParams({ from: '/full-screen/edit/$pieceId' })
  const { account } = useAccount()
  const pieces = usePiecesStoreApi()
  if (editsContent(account)) {
    const entry = entryById(pieceId)
    if (entry && isPiece(entry) && !isDegreePiece(entry))
      return <EditingOriginal key={pieceId} piece={entry} />
    if (!entry && !selectOwnSong(pieces.getState(), pieceId))
      return <MadeOriginal key={pieceId} id={pieceId} />
  }
  return <Editing key={pieceId} id={pieceId} />
}
