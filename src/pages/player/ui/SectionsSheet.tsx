import { useTranslation } from 'react-i18next'
import { RowButton, Sheet, SheetContent } from '@/shared/ui'
import type { SectionStart } from '../model/section-starts'

/**
 * The Player's Sections (ADR 0107, Chordify's), from its More: the song's sections as rows, each by
 * its name with the bar it starts at, the one the cursor is in marked; a section tapped takes the
 * cursor to its first bar (`onGo`) and the sheet closes.
 */
export function SectionsSheet({
  starts,
  headings,
  current,
  open,
  onOpenChange,
  onGo,
}: {
  starts: readonly SectionStart[]
  /** Each section's name, by section. */
  headings: readonly string[]
  /** The section the cursor is in. */
  current: number | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
  /** A section's first bar, as written. */
  onGo: (bar: number) => void
}) {
  const { t } = useTranslation(['player', 'music'])
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title={t('player:sections.title')}>
        <ul className="flex flex-col gap-1">
          {starts.map(({ section, bar }) => (
            <li key={section}>
              <RowButton
                title={headings[section] ?? ''}
                detail={t('music:sheet.bar', { n: bar + 1 })}
                current={section === current}
                onClick={() => {
                  onGo(bar)
                  onOpenChange(false)
                }}
              />
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  )
}
