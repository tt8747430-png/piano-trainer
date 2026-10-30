import { Link, useParams, useSearch } from '@tanstack/react-router'
import { useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  entryById,
  entryTitles,
  isDegreePiece,
  isPiece,
  selectOwnSong,
  usePieces,
  usePiecesStoreApi,
  type ChartPiece,
} from '@/entities/piece'
import { DraftActions, DraftStatus, useMadeSong, useOriginalDraft } from '@/features/edit-original'
import { useLocale } from '@/shared/i18n'
import { editsContent, useAccount } from '@/shared/lib/account'
import { ButtonLink, NotFound } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from '@/shared/ui/primitives/empty'
import { editorTarget, originalTarget } from '../model/editor-target'
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
  if (!target) return null
  if (gone)
    return (
      <NotFound>
        <ButtonLink render={<Link to="/songs" />}>{t('notFound.toSongs')}</ButtonLink>
      </NotFound>
    )
  return <ScoreEditor target={target} bar={bar} />
}

/** A screen in the editor's place saying why it is not open yet: its line, and what to do. */
function NotOpen({ line, children }: { line: string; children?: ReactNode }) {
  return (
    <Empty className="min-h-96">
      <EmptyHeader>
        <EmptyTitle>
          <p role="status" className="text-lg">
            {line}
          </p>
        </EmptyTitle>
      </EmptyHeader>
      {children ? <EmptyContent>{children}</EmptyContent> : null}
    </Empty>
  )
}

/** A built-in song's original, an editor's to change (ADR 0116): its draft opened, then edited. */
function EditingOriginal({ piece }: { piece: ChartPiece }) {
  const { t } = useTranslation('editor')
  const locale = useLocale()
  const { bar } = useSearch({ from: '/full-screen/edit/$pieceId' })
  const draft = useOriginalDraft(piece)
  const { load, save } = draft
  const target = useMemo(
    () => (load.state === 'ready' ? originalTarget(piece, load.value, save) : null),
    [load, piece, save],
  )
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
      head={
        // Where the draft stands, its menu and Publish, in the column's head: the score's bar has no
        // room for them beside its own tools on a phone.
        <div className="flex flex-col items-center gap-1">
          <div className="flex max-w-full items-center gap-1">
            <DraftStatus draft={draft} className="ps-2" />
            <DraftActions
              draft={draft}
              title={entryTitles(piece, locale).primary}
              unreadable={t('original.unreadable')}
              onReset={draft.reopen}
            />
          </div>
        </div>
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
 * The original of the route's piece, where it has one an editor changes: a built-in song or study
 * written as a chart, or a song an editor made and has not published yet.
 */
function OriginalOf({ id }: { id: string }) {
  const { t } = useTranslation('editor')
  const { account } = useAccount()
  const entry = entryById(id)
  const piece = entry && isPiece(entry) && !isDegreePiece(entry) ? entry : undefined
  if (!editsContent(account) || (entry && !piece))
    return (
      <NotOpen line={t('original.editorsOnly')}>
        <ButtonLink render={<Link to="/songs/$pieceId" params={{ pieceId: id }} />}>
          {t('original.toSong')}
        </ButtonLink>
      </NotOpen>
    )
  return piece ? <EditingOriginal piece={piece} /> : <MadeOriginal id={id} />
}

/**
 * The score editor over the route's piece: a catalog song's, study's or listing's version, or an own
 * song; or, an editor's, a built-in song's original.
 */
export function ScoreEditorPage() {
  const { pieceId } = useParams({ from: '/full-screen/edit/$pieceId' })
  const { original } = useSearch({ from: '/full-screen/edit/$pieceId' })
  return original ? (
    <OriginalOf key={pieceId} id={pieceId} />
  ) : (
    <Editing key={pieceId} id={pieceId} />
  )
}
