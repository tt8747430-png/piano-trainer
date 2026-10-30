import { Link } from '@tanstack/react-router'
import { LogIn } from 'lucide-react'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DESCRIPTION_MAX, type PublicEntry } from '@/shared/api/public-library'
import { useLocale } from '@/shared/i18n'
import { ButtonLink, RowFace, Sheet, SheetContent } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Textarea } from '@/shared/ui/primitives/textarea'
import { DESCRIPTION_MIN, descriptionOf, describes } from '../model/use-publish'
import { publicFace } from './public-face'

/** What is published, as its row in the Public library will show it. */
export type PublishPreview = Pick<PublicEntry, 'kind' | 'title' | 'meta'> & {
  /** What its tile's paint is drawn from, as its row's will be: its own id among the learner's. */
  readonly id: string
}

/**
 * Publish to the Public library as its own sheet (Noji's Publish in library): signed in, what others
 * will read of it (a description of at least `DESCRIPTION_MIN` characters, its count said as it is
 * typed), its row as others will see it, the rights it takes in a line, and one Publish at the foot,
 * greyed until the description says enough; why publish behind the ⓘ by its title. Once published
 * (`update`), it edits the description and publishes the newer version. Signed out, Sign in.
 */
export function PublishSheet({
  open,
  onOpenChange,
  item,
  authorName,
  signedIn,
  busy,
  update = false,
  description = '',
  onPublish,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: PublishPreview
  authorName: string
  signedIn: boolean
  busy: boolean
  /** In the library already: Update, its description as it stands. */
  update?: boolean
  description?: string
  onPublish: (description: string) => void
}) {
  const { t } = useTranslation('songs')
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {signedIn ? (
        <PublishForm
          // Each opening starts from the description as it stands.
          key={`${String(open)}-${description}`}
          item={item}
          authorName={authorName}
          busy={busy}
          update={update}
          description={description}
          onPublish={onPublish}
        />
      ) : (
        <SheetContent
          title={t('public.publish')}
          description={t('public.publishSignIn')}
          info={<WhyPublish />}
          footer={
            <ButtonLink size="lg" render={<Link to="/account/sign-in" />}>
              <LogIn data-icon="inline-start" aria-hidden />
              {t('public.signIn')}
            </ButtonLink>
          }
        >
          <Preview item={item} authorName="" />
        </SheetContent>
      )}
    </Sheet>
  )
}

function PublishForm({
  item,
  authorName,
  busy,
  update,
  description,
  onPublish,
}: {
  item: PublishPreview
  authorName: string
  busy: boolean
  update: boolean
  description: string
  onPublish: (description: string) => void
}) {
  const { t } = useTranslation('songs')
  const id = useId()
  const [text, setText] = useState(description)
  const length = descriptionOf(text).length
  const ready = describes(text)
  return (
    <SheetContent
      title={t(update ? 'public.update' : 'public.publish')}
      info={<WhyPublish />}
      tall
      footer={
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">{t('public.rights')}</p>
          <Button size="lg" disabled={!ready || busy} onClick={() => onPublish(text)}>
            {t(update ? 'public.updateConfirm' : 'public.publishConfirm')}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={id} className="text-sm text-muted-foreground">
            {t('public.description')}
          </label>
          <Textarea
            id={id}
            value={text}
            maxLength={DESCRIPTION_MAX}
            rows={4}
            placeholder={t(item.kind === 'pattern' ? 'public.aboutPattern' : 'public.aboutSong')}
            aria-describedby={`${id}-count`}
            onChange={(event) => setText(event.target.value)}
            className="min-h-28 rounded-2xl bg-card px-3.5 py-3 text-base md:text-base"
          />
          <p
            id={`${id}-count`}
            aria-live="polite"
            className="px-1 text-sm text-muted-foreground tabular-nums"
          >
            {ready
              ? t('public.descriptionCount', { count: length, max: DESCRIPTION_MAX })
              : t('public.descriptionLeft', { count: DESCRIPTION_MIN - length })}
          </p>
        </div>
        <Preview item={item} authorName={authorName} />
      </div>
    </SheetContent>
  )
}

/** Its row as others will see it in the Public library. */
function Preview({ item, authorName }: { item: PublishPreview; authorName: string }) {
  const { t } = useTranslation('songs')
  const locale = useLocale()
  const face = publicFace({ ...item, authorName }, locale)
  return (
    <section aria-label={t('public.preview')} className="flex flex-col gap-2">
      <h3 className="px-1 text-sm font-semibold text-muted-foreground">{t('public.preview')}</h3>
      <div className="card p-1.5">
        <div className="flex min-h-16 items-center gap-3 py-2 pr-3 pl-2">
          <RowFace {...face} />
        </div>
      </div>
    </section>
  )
}

/** Why publish, behind the sheet's ⓘ (Noji's "Why should I publish my deck?"). */
function WhyPublish() {
  const { t } = useTranslation('songs')
  return (
    <div className="flex flex-col gap-2">
      <p className="font-semibold">{t('public.why')}</p>
      <ul className="flex list-disc flex-col gap-1.5 ps-5 marker:text-muted-foreground">
        <li>{t('public.whyFound')}</li>
        <li>{t('public.whyCredit')}</li>
        <li>{t('public.whyYours')}</li>
      </ul>
    </div>
  )
}
