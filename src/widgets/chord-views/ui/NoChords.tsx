import { FileMusic } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SheetTitle } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/**
 * A view of the chords over music of no chord symbol (ADR 0094, 0099): under the title, one quiet
 * line saying so and the way to the sheet music (`onSheet`). The view chosen stays saved.
 */
export function NoChords({
  title,
  label,
  onSheet,
}: {
  title: string
  /** The view's name, its part of the screen's. */
  label: string
  onSheet: () => void
}) {
  const { t } = useTranslation('player')
  return (
    <section
      aria-label={label}
      className="flex h-full flex-col items-center gap-6 overflow-y-auto overscroll-contain text-center"
    >
      <SheetTitle title={title} place="lines" />
      <p className="text-muted-foreground">{t('noChords')}</p>
      <Button variant="soft" onClick={onSheet}>
        <FileMusic aria-hidden />
        {t('toSheet')}
      </Button>
    </section>
  )
}
