import { Link } from '@tanstack/react-router'
import { Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ButtonLink, RowFace } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import type { PublishState } from '../model/use-publish'

/**
 * Where a published song or pattern stands, on its own page (Noji's published deck): Published,
 * how often it is saved, or that it changed since; then View in the library, Update while it has
 * changed (else Edit, its description), and Unpublish. Not in the library, nothing.
 */
export function PublishedCard({
  state,
  publicId,
  saves,
  busy,
  onEdit,
  onUnpublish,
}: {
  state: PublishState
  publicId: string | null
  saves: number
  busy: boolean
  /** Opens Publish over it again: its description, and the newer version where it changed. */
  onEdit: () => void
  onUnpublish: () => void
}) {
  const { t } = useTranslation('songs')
  if ((state !== 'published' && state !== 'changed') || !publicId) return null
  const changed = state === 'changed'
  return (
    <section aria-label={t('public.inLibrary')} className="card flex flex-col gap-3 p-3">
      <div className="flex min-h-12 items-center gap-3">
        <RowFace
          icon={Globe}
          paint="grass"
          title={t('public.inLibrary')}
          detail={
            changed
              ? t('public.changedSince')
              : saves > 0
                ? t('public.saves', { count: saves })
                : t('public.savesNone')
          }
        />
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(5.5rem,1fr))] gap-2">
        <ButtonLink
          variant="soft"
          render={<Link to="/songs/public/$itemId" params={{ itemId: publicId }} />}
        >
          {t('public.view')}
        </ButtonLink>
        <Button variant={changed ? 'default' : 'soft'} disabled={busy} onClick={onEdit}>
          {t(changed ? 'public.updateConfirm' : 'public.edit')}
        </Button>
        <Button variant="ghost" disabled={busy} onClick={onUnpublish}>
          {t('public.unpublishShort')}
        </Button>
      </div>
    </section>
  )
}
