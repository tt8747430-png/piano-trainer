import { Copy } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SECTION_KINDS, type SheetSection as Section } from '@/shared/lib/arrangement'
import { MenuPicker, Sheet, SheetContent } from '@/shared/ui'
import { POP, SheetAct, SheetCard, SheetRow } from './sheet-parts'

/**
 * A section's sheet, opened from its name (canvas R77, `CP_SEC`): what its head cannot hold. One white
 * card, Section ⇕ (its name); Duplicate section under it. How often it plays, its variation and Delete
 * stand on the head alone, Loop on the bar's transport (one way to each act), the Genos marks on their chip.
 */
export function SectionSheet({
  open,
  onOpenChange,
  section,
  canDuplicate,
  onChange,
  onDuplicate,
}: {
  open: boolean
  onOpenChange(open: boolean): void
  section: Section
  canDuplicate: boolean
  onChange(change: Partial<Section>): void
  onDuplicate(): void
}) {
  const { t } = useTranslation('practice')
  const name = t(`chordPlayer.sections.${section.kind}`)
  return (
    <Sheet at={{ width: 'w-95' }} open={open} onOpenChange={onOpenChange}>
      <SheetContent title={name}>
        <div className="flex flex-col gap-4 lg:gap-3">
          <SheetCard>
            <SheetRow label={t('chordPlayer.section')}>
              <MenuPicker
                label={t('chordPlayer.section')}
                bare
                className={`${POP} min-w-34`}
                value={section.kind}
                options={SECTION_KINDS.map((kind) => ({
                  value: kind,
                  label: t(`chordPlayer.sections.${kind}`),
                }))}
                onChange={(kind) => onChange({ kind })}
              />
            </SheetRow>
          </SheetCard>
          {canDuplicate ? (
            <div className="flex">
              <SheetAct icon={<Copy aria-hidden className="size-5" />} onClick={onDuplicate}>
                {t('chordPlayer.duplicateSection')}
              </SheetAct>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
