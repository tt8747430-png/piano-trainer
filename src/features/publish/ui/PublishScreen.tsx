import { Link } from '@tanstack/react-router'
import { BadgeCheck, Download, Info, LogIn, RefreshCw, Users } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ButtonLink,
  ConfirmDialog,
  ScreenHeader,
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { describes, descriptionOf, type usePublish } from '../model/use-publish'
import { PublishFields, type PublishPreview } from './PublishFields'
import { CopyLinkField, RightsCheck, StandingLine } from './PublishParts'
import { PublishSaid } from './PublishSaid'

/** Why publish, three reasons each under its picture (Noji's "Why should I publish my deck?"). */
const WHY = [
  { icon: Users, title: 'whyFoundTitle', line: 'whyFound' },
  { icon: BadgeCheck, title: 'whyCreditTitle', line: 'whyCredit' },
  { icon: RefreshCw, title: 'whyYoursTitle', line: 'whyYours' },
] as const

/** The bar's ⓘ: why publish, in a sheet of its own. */
function WhyPublish() {
  const { t } = useTranslation('songs')
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="bar"
            size="icon"
            className="rounded-pill"
            aria-label={t('public.why')}
            title={t('public.why')}
          />
        }
      >
        <Info aria-hidden />
      </SheetTrigger>
      <SheetContent title={t('public.why')}>
        <ul className="flex flex-col gap-6 pb-2">
          {WHY.map(({ icon: Icon, title, line }) => (
            <li key={title} className="flex flex-col gap-1">
              <span className="flex items-center gap-3 text-lg font-semibold">
                <Icon aria-hidden className="size-6 shrink-0 text-link" />
                {t(`public.${title}`)}
              </span>
              <span className="text-pretty text-muted-foreground">{t(`public.${line}`)}</span>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  )
}

/**
 * Publish in library, a page of its own for a song or a pattern (round 27, Noji's): why publish behind
 * the ⓘ in the bar, in a sheet.
 *
 * - Not yet published: what others will read of it (its description, its count said as it is typed)
 *   and its row as they will see it; the rights it takes in a line, and Publish at the foot, greyed
 *   until the description says enough.
 * - Published: "In the library" (or that it changed since), its link with Copy, View in library, how
 *   often it is saved, its description; at the foot Unpublish and Publish new version, live once it or
 *   its description changed.
 * - Signed out: Sign in.
 */
export function PublishScreen({
  item,
  publishing,
  back,
}: {
  item: PublishPreview
  publishing: ReturnType<typeof usePublish>
  /** The bar's way back: the song's Settings, the pattern's page. */
  back: ReactNode
}) {
  const { t } = useTranslation(['songs', 'editor'])
  return (
    <div className="flex min-h-screen-free flex-col gap-6">
      <ScreenHeader title={t('editor:publishPage.title')} back={back} actions={<WhyPublish />} />
      <PublishSaid said={publishing.said} />
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6">
        {publishing.signedIn ? (
          <PublishForm
            // Each version of its description, as the library holds it, starts the field afresh.
            key={publishing.description}
            item={item}
            publishing={publishing}
          />
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
  publishing,
}: {
  item: PublishPreview
  publishing: ReturnType<typeof usePublish>
}) {
  const { t } = useTranslation('songs')
  const [text, setText] = useState(publishing.description)
  // Unticked each time the page opens and after each publish (D3): the learner confirms every time.
  const [rights, setRights] = useState(false)
  const [unpublishing, setUnpublishing] = useState(false)
  const publish = async () => {
    await publishing.publish(text)
    setRights(false)
  }
  const live = publishing.state === 'published' || publishing.state === 'changed'
  const changed =
    publishing.state === 'changed' || descriptionOf(text) !== descriptionOf(publishing.description)
  return (
    <>
      {live ? null : <StandingLine standing="unpublished" />}
      {live && publishing.publicId ? (
        <>
          <StandingLine standing={publishing.state === 'published' ? 'published' : 'changed'} />
          <div className="-mt-3 flex flex-col gap-3">
            <CopyLinkField url={`${window.location.origin}/songs/public/${publishing.publicId}`} />
            <ButtonLink
              variant="outline"
              size="lg"
              render={<Link to="/songs/public/$itemId" params={{ itemId: publishing.publicId }} />}
            >
              {t('public.viewInLibrary')}
            </ButtonLink>
          </div>
          <section className="flex flex-col gap-2">
            <h2 className="px-1 font-sans text-sm font-semibold text-muted-foreground">
              {t('public.stats')}
            </h2>
            <p className="flex items-center gap-3 px-1">
              <Download aria-hidden className="size-5 text-muted-foreground" />
              {publishing.saves > 0
                ? t('public.saves', { count: publishing.saves })
                : t('public.savesNone')}
            </p>
          </section>
        </>
      ) : null}
      <PublishFields item={item} authorName={publishing.authorName} text={text} onText={setText} />
      {/* The page's foot: what is done to it, Noji's pair of full-width buttons. */}
      <div className="mt-auto flex flex-col gap-3 pt-4">
        {/* The rights, confirmed each time it is published (R29 D3): Publish waits for the tick. */}
        {!live || changed ? <RightsCheck checked={rights} onChange={setRights} /> : null}
        {live ? (
          <>
            <Button
              size="lg"
              disabled={publishing.busy || !changed || !describes(text) || !rights}
              onClick={() => void publish()}
            >
              {t('public.publishNew')}
            </Button>
            <Button
              size="lg"
              variant="soft"
              className="text-destructive"
              disabled={publishing.busy}
              onClick={() => setUnpublishing(true)}
            >
              {t('public.unpublishShort')}
            </Button>
          </>
        ) : (
          <Button
            size="lg"
            disabled={publishing.busy || !describes(text) || !rights}
            onClick={() => void publish()}
          >
            {t('public.publishConfirm')}
          </Button>
        )}
      </div>
      <ConfirmDialog
        open={unpublishing}
        onOpenChange={setUnpublishing}
        title={t('public.unpublishTitle')}
        body={t('public.unpublishBody')}
        action={t('public.unpublishShort')}
        onConfirm={() => void publishing.unpublish()}
      />
    </>
  )
}
