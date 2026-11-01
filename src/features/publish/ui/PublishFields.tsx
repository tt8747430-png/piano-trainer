import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { DESCRIPTION_MAX, type PublicEntry } from '@/shared/api/public-library'
import { useLocale } from '@/shared/i18n'
import { RowFace } from '@/shared/ui'
import { Textarea } from '@/shared/ui/primitives/textarea'
import { DESCRIPTION_MIN, descriptionOf, describes } from '../model/use-publish'
import { publicFace } from './public-face'

/** What is published, as its row in the Public library will show it. */
export type PublishPreview = Pick<PublicEntry, 'kind' | 'title' | 'meta'> & {
  /** What its tile's paint is drawn from, as its row's will be: its own id among the learner's. */
  readonly id: string
}

/**
 * What others will read of it: its description (at least `DESCRIPTION_MIN` characters, its count said
 * as it is typed) and its row as they will see it, on the Publish screen.
 */
export function PublishFields({
  item,
  authorName,
  text,
  onText,
}: {
  item: PublishPreview
  authorName: string
  text: string
  onText: (text: string) => void
}) {
  const { t } = useTranslation('songs')
  const id = useId()
  const length = descriptionOf(text).length
  return (
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
          onChange={(event) => onText(event.target.value)}
          className="min-h-28 rounded-2xl bg-card px-3.5 py-3 text-base md:text-base"
        />
        <p
          id={`${id}-count`}
          aria-live="polite"
          className="px-1 text-sm text-muted-foreground tabular-nums"
        >
          {describes(text)
            ? t('public.descriptionCount', { count: length, max: DESCRIPTION_MAX })
            : t('public.descriptionLeft', { count: DESCRIPTION_MIN - length })}
        </p>
      </div>
      <Preview item={item} authorName={authorName} />
    </div>
  )
}

/** Its row as others will see it in the Public library. */
function Preview({ item, authorName }: { item: PublishPreview; authorName: string }) {
  const { t } = useTranslation('songs')
  const locale = useLocale()
  const face = publicFace({ ...item, authorName }, locale)
  return (
    <section aria-label={t('public.preview')} className="flex flex-col gap-2">
      <h3 className="px-1 font-sans text-sm font-semibold text-muted-foreground">
        {t('public.preview')}
      </h3>
      <div className="card p-1.5">
        <div className="flex min-h-16 items-center gap-3 py-2 pr-3 pl-2">
          <RowFace {...face} />
        </div>
      </div>
    </section>
  )
}
