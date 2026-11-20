import { Link, useNavigate, useParams, useSearch } from '@tanstack/react-router'
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
  DraftRows,
  DraftSaid,
  draftWithMusic,
  useMadeSong,
  useOriginalDraft,
} from '@/features/edit-original'
import { useLocale } from '@/shared/i18n'
import { OPEN_PUBLISH } from '@/shared/lib'
import { editsContent, useAccount } from '@/shared/lib/account'
import { ButtonLink, NotFound } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { editorTarget, originalTarget } from '../model/editor-target'
import { NotOpen } from '@/widgets/content-editor'
import { ScoreEditor } from './ScoreEditor'
import { EditorGate } from './EditorGate'

function Editing({ id }: { id: string }) {
  const { t } = useTranslation('common')
  // The bar the caret opens on, as printed: the Player's cursor's, where Edit came from it (ADR 0115).
  const { bar, credits } = useSearch({ from: '/full-screen/edit/$pieceId' })
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
  return <ScoreEditor target={target} bar={bar} credits={credits} />
}

/** A built-in song's original, an editor's to change (ADR 0116): its draft opened, then edited. */
function EditingOriginal({ piece }: { piece: ChartPiece }) {
  const { t } = useTranslation('editor')
  const locale = useLocale()
  const { bar, credits } = useSearch({ from: '/full-screen/edit/$pieceId' })
  const draft = useOriginalDraft(piece)
  const navigate = useNavigate()
  const { load, save } = draft
  // Its Publish (R29 B6), a page in the song's Settings' window, the rights ticked there each time:
  // the song's page opens with the window turned to it.
  const toPublish = {
    to: '/songs/$pieceId',
    params: { pieceId: piece.id },
    state: OPEN_PUBLISH,
  } as const
  const publishPage = {
    link: <Link {...toPublish} />,
    open: () => void draft.flush().then(() => navigate(toPublish)),
  }
  // The score writes the draft's music; the rest of the song (what its page says) stays the draft's.
  const target = useMemo(() => {
    if (load.state !== 'ready') return null
    const opened = load.value
    return originalTarget(piece, musicOf(opened), (music) => save(draftWithMusic(opened, music)))
  }, [load, piece, save])
  if (load.state === 'loading')
    return (
      <EditorGate>
        <NotOpen kind="opening" line={t('original.opening')} />
      </EditorGate>
    )
  if (load.state === 'failed' || !target)
    return (
      <EditorGate>
        <NotOpen
          kind={load.state === 'failed' && load.reason === 'offline' ? 'offline' : 'failed'}
          line={t(
            load.state === 'failed' && load.reason === 'offline'
              ? 'original.offline'
              : 'original.failed',
          )}
        >
          <Button onClick={draft.reopen}>{t('original.retry')}</Button>
        </NotOpen>
      </EditorGate>
    )
  return (
    <ScoreEditor
      key={draft.opened}
      target={target}
      bar={bar}
      credits={credits}
      // Where the draft stands, beside the gear's title, and its acts, the gear's last group (R31-E):
      // never over the music, never beside Done.
      draft={{
        status: <DraftSaid draft={draft} />,
        versions: (
          <DraftRows
            part="versions"
            draft={draft}
            title={entryTitles(piece, locale).primary}
            unreadable={t('original.unreadable')}
            onReset={draft.reopen}
            publishPage={publishPage}
          />
        ),
        rows: (
          <DraftRows
            part="publishing"
            draft={draft}
            title={entryTitles(piece, locale).primary}
            unreadable={t('original.unreadable')}
            onReset={draft.reopen}
            publishPage={publishPage}
          />
        ),
      }}
    />
  )
}

/** A song an editor made and has not published: its draft read from the server, then edited. */
function MadeOriginal({ id }: { id: string }) {
  const { t } = useTranslation('editor')
  const load = useMadeSong(id)
  if (load.state === 'loading')
    return (
      <EditorGate>
        <NotOpen kind="opening" line={t('original.opening')} />
      </EditorGate>
    )
  if (load.state === 'failed')
    return (
      <EditorGate>
        <NotOpen
          kind={load.reason === 'offline' ? 'offline' : 'failed'}
          line={t(load.reason === 'offline' ? 'original.offline' : 'original.failed')}
        />
      </EditorGate>
    )
  if (load.state === 'none')
    return (
      <EditorGate>
        <NotOpen kind="missing" line={t('original.gone')}>
          <ButtonLink render={<Link to="/songs" />}>{t('original.toSongs')}</ButtonLink>
        </NotOpen>
      </EditorGate>
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
