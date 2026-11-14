import { Copy, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  SECTION_KINDS,
  SECTION_REPEATS,
  type SheetSection as Section,
  type Variation,
} from '@/shared/lib/arrangement'
import { Labelled, MenuPicker, Segmented, Sheet, SheetContent, Stepper } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/**
 * A section's sheet, opened from its head (canvas 171): its name, how many times it plays, the
 * style's variation where it has more than one; Duplicate and Delete at the foot (Delete at once,
 * with Undo in its toast).
 */
export function SectionSheet({
  open,
  onOpenChange,
  section,
  variations,
  canDuplicate,
  onChange,
  onDuplicate,
  onDelete,
}: {
  open: boolean
  onOpenChange(open: boolean): void
  section: Section
  /** The style's variations: none drawn but one. */
  variations: readonly Variation[]
  canDuplicate: boolean
  onChange(change: Partial<Section>): void
  onDuplicate(): void
  onDelete(): void
}) {
  const { t } = useTranslation('practice')
  const name = t(`chordPlayer.sections.${section.kind}`)
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        title={name}
        footer={
          <div className="flex flex-col gap-2">
            {canDuplicate ? (
              <Button variant="outline" size="lg" onClick={onDuplicate}>
                <Copy aria-hidden />
                {t('chordPlayer.duplicateSection')}
              </Button>
            ) : null}
            <Button variant="destructive" size="lg" onClick={onDelete}>
              <Trash2 aria-hidden />
              {t('chordPlayer.deleteSection')}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-5">
          <Labelled label={t('chordPlayer.section')}>
            <MenuPicker
              label={t('chordPlayer.section')}
              value={section.kind}
              options={SECTION_KINDS.map((kind) => ({
                value: kind,
                label: t(`chordPlayer.sections.${kind}`),
              }))}
              onChange={(kind) => onChange({ kind })}
            />
          </Labelled>
          <Labelled label={t('chordPlayer.repeat')}>
            <Stepper
              label={t('chordPlayer.repeat')}
              value={section.repeats}
              min={SECTION_REPEATS.min}
              max={SECTION_REPEATS.max}
              format={(count) => t('chordPlayer.times', { count })}
              decrease={t('chordPlayer.fewer')}
              increase={t('chordPlayer.moreTimes')}
              onChange={(repeats) => onChange({ repeats })}
            />
          </Labelled>
          {variations.length > 1 ? (
            <Segmented
              label={t('chordPlayer.variation')}
              value={Math.min(section.variation, variations.length) as Variation}
              options={variations.map((value) => ({ value, label: String(value) }))}
              onChange={(variation) => onChange({ variation })}
            />
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
