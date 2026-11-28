import { Copy } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SECTION_KINDS, type SheetSection as Section } from '@/shared/lib/arrangement'
import { MenuPicker, Sheet, SheetContent, SwitchRow } from '@/shared/ui'
import { POP, SheetAct, SheetCard, SheetRow } from './sheet-parts'

/**
 * A section's sheet, opened from its name (canvas R77, `CP_SEC`): what its head cannot hold. One white
 * card, Section ⇕ (its name) and Loop this section; Duplicate section under it. How often it plays, its
 * variation and Delete stand on the head alone, the Genos marks on their own chip.
 */
export function SectionSheet({
  open,
  onOpenChange,
  section,
  canDuplicate,
  onChange,
  onDuplicate,
  looped,
  onLoop,
}: {
  open: boolean
  onOpenChange(open: boolean): void
  section: Section
  canDuplicate: boolean
  onChange(change: Partial<Section>): void
  onDuplicate(): void
  /** Whether Play goes round this section alone. */
  looped: boolean
  onLoop(on: boolean): void
}) {
  const { t } = useTranslation('practice')
  const name = t(`chordPlayer.sections.${section.kind}`)
  return (
    <Sheet at={{ width: 'w-95' }} open={open} onOpenChange={onOpenChange}>
      <SheetContent title={name}>
        <div className="flex flex-col gap-4">
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
            <SwitchRow
              label={t('chordPlayer.loopSection')}
              checked={looped}
              onCheckedChange={onLoop}
              className="min-h-14 pr-3 pl-4 text-base"
            />
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
