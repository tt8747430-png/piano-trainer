import { Link, useParams } from '@tanstack/react-router'
import { LogIn } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useRepertoire, type Piece } from '@/entities/piece'
import {
  PublishedCard,
  PublishFields,
  PublishSaid,
  WhyPublish,
  describes,
  type PublishItem,
} from '@/features/publish'
import { BackButton, ButtonLink, InfoTip, NotFound, ScreenHeader } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useSongPublish } from '../model/use-song-publish'

/** The route's song, or the way back where it is gone or cannot be published. */
export function PublishPage() {
  const { t } = useTranslation('common')
  const { pieceId } = useParams({ from: '/shell/songs/$pieceId/publish' })
  const piece = useRepertoire().piece(pieceId)
  if (!piece)
    return (
      <NotFound>
        <ButtonLink render={<Link to="/songs" />}>{t('notFound.toSongs')}</ButtonLink>
      </NotFound>
    )
  return <Publish key={piece.id} piece={piece} />
}

/**
 * Publish in library (round 26, Noji's page): a page of its own, reached from the song's Settings.
 * Signed in, what others will read of it (its description, its count said as it is typed) and its
 * row as they will see it, the rights it takes in a line and Publish at the foot, greyed until the
 * description says enough; why publish behind the ⓘ in the bar. Once published, where it stands (how
 * often it is saved, or that it changed since) with View, and Unpublish; Publish becomes Update.
 * Signed out, Sign in.
 */
function Publish({ piece }: { piece: Piece }) {
  const { t } = useTranslation('songs')
  const { item, title, publishing } = useSongPublish(piece)
  const back = (
    <BackButton fallback={{ to: '/songs/$pieceId/settings', params: { pieceId: piece.id } }} />
  )
  if (!item)
    return (
      <NotFound>
        <ButtonLink render={<Link to="/songs/$pieceId" params={{ pieceId: piece.id }} />}>
          {title}
        </ButtonLink>
      </NotFound>
    )
  return (
    <div className="flex flex-col gap-6 pb-8">
      <ScreenHeader
        title={t('public.publishIn')}
        back={back}
        actions={
          <InfoTip bar name={t('public.publishIn')}>
            <WhyPublish />
          </InfoTip>
        }
      />
      <PublishSaid said={publishing.said} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        {publishing.signedIn ? (
          <PublishForm
            key={publishing.description}
            item={item}
            authorName={publishing.authorName}
            update={publishing.state === 'published' || publishing.state === 'changed'}
            description={publishing.description}
            busy={publishing.busy}
            onPublish={(description) => void publishing.publish(description)}
          >
            <PublishedCard
              state={publishing.state}
              publicId={publishing.publicId}
              saves={publishing.saves}
              busy={publishing.busy}
              onUnpublish={() => void publishing.unpublish()}
            />
          </PublishForm>
        ) : (
          <div className="flex flex-col items-start gap-3 card p-4">
            <p className="text-pretty text-muted-foreground">{t('public.publishSignIn')}</p>
            <ButtonLink render={<Link to="/account/sign-in" />}>
              <LogIn data-icon="inline-start" aria-hidden />
              {t('public.signIn')}
            </ButtonLink>
          </div>
        )}
      </div>
    </div>
  )
}

function PublishForm({
  item,
  authorName,
  update,
  description,
  busy,
  onPublish,
  children,
}: {
  item: PublishItem
  authorName: string
  update: boolean
  description: string
  busy: boolean
  onPublish: (description: string) => void
  /** Where it stands once published, over the form. */
  children: ReactNode
}) {
  const { t } = useTranslation('songs')
  const [text, setText] = useState(description)
  return (
    <>
      {children}
      <PublishFields
        item={{ id: item.sourceId, kind: item.kind, title: item.title, meta: item.meta }}
        authorName={authorName}
        text={text}
        onText={setText}
      />
      <p className="px-1 text-sm text-muted-foreground">{t('public.rights')}</p>
      <Button size="lg" disabled={busy || !describes(text)} onClick={() => onPublish(text)}>
        {t(update ? 'public.updateConfirm' : 'public.publishConfirm')}
      </Button>
    </>
  )
}
