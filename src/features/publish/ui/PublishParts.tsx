import { Link } from '@tanstack/react-router'
import { Copy } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { say } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Checkbox } from '@/shared/ui/primitives/checkbox'

/**
 * The rights, ticked each time an item is published (R29 D3): Publish waits for the tick. One box
 * for every Publish page, Explore's and the app's.
 */
export function RightsCheck({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  const { t } = useTranslation('songs')
  return (
    <label className="flex cursor-pointer items-start gap-3 px-1 text-sm">
      <Checkbox
        className="mt-0.5"
        checked={checked}
        onCheckedChange={(on) => onChange(on === true)}
      />
      <span>
        {t('public.rights')}{' '}
        <Link to="/legal/terms" className="text-link underline-offset-2 hover:underline">
          {t('public.terms')}
        </Link>
      </span>
    </label>
  )
}

/** An item's address, in a field with Copy (Noji's). */
export function CopyLinkField({ url }: { url: string }) {
  const { t } = useTranslation('songs')
  return (
    <div className="flex min-h-14 items-center gap-2 rounded-control bg-muted pr-1.5 pl-4">
      <span className="min-w-0 flex-1 truncate text-muted-foreground select-text">{url}</span>
      <Button
        variant="ghost"
        size="icon"
        className="size-11 shrink-0 rounded-control"
        aria-label={t('public.copyLink')}
        title={t('public.copyLink')}
        onClick={() =>
          void navigator.clipboard
            ?.writeText(url)
            .then(() => say(t('public.linkCopied')))
            .catch(() => say(t('public.linkNotCopied')))
        }
      >
        <Copy aria-hidden />
      </Button>
    </div>
  )
}

/** Where an item stands: not published, published, or changed since it was (a dot and its words). */
export type PublishStanding = 'unpublished' | 'published' | 'changed'

export function StandingLine({ standing }: { standing: PublishStanding }) {
  const { t } = useTranslation('editor')
  return (
    <p
      className={cn(
        'flex items-center gap-2 px-1 font-semibold',
        standing === 'published' ? 'text-link' : 'text-foreground',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'size-2.5 rounded-pill',
          standing === 'published'
            ? 'bg-link'
            : standing === 'changed'
              ? 'bg-paint-sand'
              : 'bg-muted-foreground',
        )}
      />
      {t(`publishPage.standing.${standing}`)}
    </p>
  )
}
