import { Link } from '@tanstack/react-router'
import { FilePen } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  songFacts,
  usePiecesStoreApi,
  withSongFacts,
  type ChartPiece,
  type OwnSongId,
  type SongFacts,
} from '@/entities/piece'
import { DraftActions, DraftStatus, useOriginalDraft } from '@/features/edit-original'
import { setSongFacts } from '@/features/edit-piece'
import { useLocale } from '@/shared/i18n'
import { RowLink, SettingsGroup } from '@/shared/ui'
import { DocText, Properties, PropertyRow, NotOpen } from '@/widgets/content-editor'
import { EditToggle } from '@/widgets/mode-switch'
import { PieceHeader } from './PieceHeader'

/** The longest a title or a name is written on the page. */
const NAME_MAX = 80

/**
 * What a song's page says of it, written in place (round 28, Flat's score credits, Noji's deck
 * edited where it reads): its title as the page's heading, who wrote its music and words as its
 * properties, what is said about it as a paragraph, and the way to its music on the score.
 */
function SongFactsForm({
  pieceId,
  initial,
  onChange,
}: {
  pieceId: string
  initial: SongFacts
  onChange: (facts: SongFacts) => void
}) {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  const [facts, setFacts] = useState(initial)
  const change = (patch: Partial<SongFacts>) => {
    const next = { ...facts, ...patch }
    setFacts(next)
    onChange(next)
  }
  // Each field writes one language's words: the other's are the song's as they are.
  const text = (value: string) => ({ en: value, ru: value })
  const line = (field: 'music' | 'words') => (
    <input
      aria-label={t(`facts.${field}`)}
      autoComplete="off"
      data-1p-ignore
      maxLength={NAME_MAX}
      value={facts[field]}
      placeholder={t('facts.add')}
      onChange={(event) => change({ [field]: event.target.value })}
      className="w-full min-w-0 rounded-lg bg-transparent px-2 py-2 text-right text-lg caret-primary outline-none placeholder:text-muted-foreground hover:bg-muted focus-visible:bg-muted"
    />
  )
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <DocText
        label={t('facts.title')}
        size="title"
        locale={locale}
        value={text(facts.title)}
        placeholder={t('facts.titlePlaceholder')}
        onChange={(value) => change({ title: value[locale].slice(0, NAME_MAX) })}
      />
      <Properties label={t('facts.credits')}>
        <PropertyRow name={t('facts.music')}>{line('music')}</PropertyRow>
        <PropertyRow name={t('facts.words')}>{line('words')}</PropertyRow>
      </Properties>
      <DocText
        label={t('facts.about')}
        locale={locale}
        value={text(facts.about)}
        placeholder={t('facts.aboutPlaceholder')}
        onChange={(value) => change({ about: value[locale] })}
        className="aria-invalid:text-muted-foreground"
      />
      <SettingsGroup flush>
        <RowLink
          title={t('facts.editMusic')}
          icon={FilePen}
          paint="lilac"
          render={<Link to="/edit/$pieceId" params={{ pieceId }} />}
        />
      </SettingsGroup>
    </div>
  )
}

/** An own song's page in Edit: each change saved as it is written. */
export function OwnSongEdit({
  piece,
  id,
  onDone,
}: {
  piece: ChartPiece
  id: OwnSongId
  onDone: () => void
}) {
  const locale = useLocale()
  const store = usePiecesStoreApi()
  return (
    <div className="flex flex-col gap-6 pb-8">
      <PieceHeader entry={piece} actions={<EditToggle editing onEdit={onDone} onDone={onDone} />} />
      <SongFactsForm
        pieceId={id}
        initial={songFacts(piece, locale)}
        onChange={(facts) => setSongFacts(store, id, facts, locale)}
      />
    </div>
  )
}

/**
 * A built-in song's page in Edit, an editor's (ADR 0116): what it says written into the song's draft
 * with its music, where it stands and its menu (Publish, Versions, Discard) in the bar by Done.
 */
export function OriginalSongEdit({ piece, onDone }: { piece: ChartPiece; onDone: () => void }) {
  const { t } = useTranslation(['piece', 'editor'])
  const locale = useLocale()
  const draft = useOriginalDraft(piece)
  const { load, save } = draft
  const done = () => {
    void draft.flush()
    onDone()
  }
  const toggle = <EditToggle editing onEdit={done} onDone={done} />
  return (
    <div className="flex flex-col gap-6 pb-8">
      <PieceHeader
        entry={piece}
        actions={
          load.state === 'ready' ? (
            <>
              <DraftStatus draft={draft} />
              <DraftActions
                draft={draft}
                title={songFacts(piece, locale).title}
                unreadable={t('editor:original.unreadable')}
                onReset={draft.reopen}
              />
              {toggle}
            </>
          ) : (
            toggle
          )
        }
      />
      {load.state === 'ready' ? (
        <SongFactsForm
          key={draft.opened}
          pieceId={piece.id}
          initial={songFacts(load.value, locale)}
          onChange={(facts) => save(withSongFacts(load.value, facts, locale))}
        />
      ) : (
        <NotOpen
          line={t(
            load.state === 'loading'
              ? 'editor:original.opening'
              : load.reason === 'offline'
                ? 'editor:original.offline'
                : 'editor:original.failed',
          )}
        />
      )}
    </div>
  )
}
