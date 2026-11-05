import { useEffect, useEffectEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  songFacts,
  usePiecesStoreApi,
  withSongFacts,
  type ChartPiece,
  type OwnSongId,
  type SongFacts,
} from '@/entities/piece'
import { useOriginalDraft } from '@/features/edit-original'
import { setSongFacts } from '@/features/edit-piece'
import { useLocale } from '@/shared/i18n'
import { DocText, NotOpen } from '@/widgets/content-editor'

/** The longest a title or a name is written on the page. */
const NAME_MAX = 80

/**
 * What a song's page says of itself, written in place in its Edit (R30, Noji's deck edited where it
 * reads): its title and what is said about it. Who wrote it is the score's, printed and edited there.
 */
function SongFactsForm({
  initial,
  onChange,
}: {
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
  return (
    <div className="flex w-full flex-col gap-4">
      <DocText
        label={t('facts.title')}
        size="title"
        locale={locale}
        value={text(facts.title)}
        placeholder={t('facts.titlePlaceholder')}
        onChange={(value) => change({ title: value[locale].slice(0, NAME_MAX) })}
      />
      <DocText
        label={t('facts.about')}
        locale={locale}
        value={text(facts.about)}
        placeholder={t('facts.aboutPlaceholder')}
        onChange={(value) => change({ about: value[locale] })}
        className="aria-invalid:text-muted-foreground"
      />
    </div>
  )
}

/** An own song's Details (Settings › Details, R29 1.2): each change saved as it is written. */
export function OwnSongDetails({ piece, id }: { piece: ChartPiece; id: OwnSongId }) {
  const locale = useLocale()
  const store = usePiecesStoreApi()
  return (
    <SongFactsForm
      initial={songFacts(piece, locale)}
      onChange={(facts) => setSongFacts(store, id, facts, locale)}
    />
  )
}

/**
 * A built-in song's Details, an editor's (ADR 0116): written into the song's draft with its music,
 * kept as the page is left; its status and Publish are the song's Settings' Unpublished changes.
 */
export function OriginalSongDetails({ piece }: { piece: ChartPiece }) {
  const { t } = useTranslation(['piece', 'editor'])
  const locale = useLocale()
  const draft = useOriginalDraft(piece)
  const { load, save } = draft
  // What was written is kept as the page is left.
  const flush = useEffectEvent(() => void draft.flush())
  useEffect(() => () => flush(), [])
  return load.state === 'ready' ? (
    <SongFactsForm
      key={draft.opened}
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
  )
}
