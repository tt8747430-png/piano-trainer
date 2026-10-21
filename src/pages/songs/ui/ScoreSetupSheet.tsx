import { Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  MOST_PARTS,
  SCORE_TEMPLATES,
  type ScoreSetup,
  type ScoreTemplate,
} from '@/features/edit-piece'
import { INSTRUMENT_FAMILIES, instrumentsIn, type Instrument } from '@/shared/lib/music'
import { Dropdown, Sheet, SheetContent, SwitchRow } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

const TEMPLATES = Object.keys(SCORE_TEMPLATES) as ScoreTemplate[]

/** The template a setup is, where it is one. */
const templateOf = (setup: ScoreSetup): ScoreTemplate | undefined =>
  TEMPLATES.find((each) => {
    const template: ScoreSetup = SCORE_TEMPLATES[each]
    return (
      template.chordNames === setup.chordNames &&
      template.melody === setup.melody &&
      setup.parts.length === 0
    )
  })

/**
 * What a new song's score holds (ADR 0072), its own sheet over New song: a template to start from,
 * as a notation app offers them, then each row on or off and up to three more parts, each on an
 * instrument chosen by family.
 */
export function ScoreSetupSheet({
  open,
  onOpenChange,
  setup,
  onChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  setup: ScoreSetup
  onChange: (setup: ScoreSetup) => void
}) {
  const { t } = useTranslation(['songs', 'music'])
  const chosen = templateOf(setup)
  const setPart = (index: number, part: Instrument | null) =>
    onChange({
      ...setup,
      parts:
        part === null
          ? setup.parts.filter((_, i) => i !== index)
          : setup.parts.map((each, i) => (i === index ? part : each)),
    })
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        title={t('songs:setup.title')}
        footer={
          <Button size="lg" className="w-full" onClick={() => onOpenChange(false)}>
            {t('songs:setup.done')}
          </Button>
        }
      >
        <div className="flex flex-col gap-6">
          <section aria-labelledby="setup-templates" className="flex flex-col gap-2">
            <h3 id="setup-templates" className="text-sm font-semibold text-muted-foreground">
              {t('songs:setup.templates')}
            </h3>
            <div
              role="radiogroup"
              aria-labelledby="setup-templates"
              className="grid gap-2 sm:grid-cols-3"
            >
              {TEMPLATES.map((template) => (
                <button
                  key={template}
                  type="button"
                  role="radio"
                  aria-checked={chosen === template}
                  onClick={() => onChange(SCORE_TEMPLATES[template])}
                  className="flex flex-col items-start gap-0.5 rounded-2xl border border-border bg-card p-3 text-left transition-colors hover:bg-chosen aria-checked:border-selected aria-checked:bg-selected/10"
                >
                  <span className="font-semibold">{t(`songs:setup.template.${template}`)}</span>
                  <span className="text-sm text-muted-foreground">
                    {t(`songs:setup.templateDetail.${template}`)}
                  </span>
                </button>
              ))}
            </div>
          </section>
          <section aria-labelledby="setup-rows" className="flex flex-col">
            <h3 id="setup-rows" className="text-sm font-semibold text-muted-foreground">
              {t('songs:setup.rows')}
            </h3>
            <SwitchRow
              icon={<span className="font-display text-base font-semibold">C⁷</span>}
              label={t('songs:setup.chordNames')}
              checked={setup.chordNames}
              onCheckedChange={(chordNames) => onChange({ ...setup, chordNames })}
            />
            <SwitchRow
              icon={<span className="font-music text-xl leading-none">𝄞</span>}
              label={t('songs:setup.melody')}
              detail={t('songs:setup.melodyDetail')}
              checked={setup.melody}
              onCheckedChange={(melody) => onChange({ ...setup, melody })}
            />
          </section>
          <section aria-labelledby="setup-parts" className="flex flex-col gap-2">
            <h3 id="setup-parts" className="text-sm font-semibold text-muted-foreground">
              {t('songs:setup.parts')}
            </h3>
            {setup.parts.map((part, index) => {
              const label = t('songs:setup.part', { n: index + 1 })
              return (
                <div key={index} className="flex items-end gap-2">
                  <div className="min-w-0 flex-1">
                    <Dropdown<Instrument>
                      label={label}
                      value={part}
                      groups={INSTRUMENT_FAMILIES.map((family) => ({
                        label: t(`music:instrumentFamily.${family}`),
                        options: instrumentsIn(family).map((each) => ({
                          value: each,
                          label: t(`music:instrument.${each}`),
                        })),
                      }))}
                      onChange={(next) => setPart(index, next)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    aria-label={t('songs:setup.removePart', { part: label })}
                    onClick={() => setPart(index, null)}
                  >
                    <Trash2 aria-hidden />
                  </Button>
                </div>
              )
            })}
            {setup.parts.length < MOST_PARTS ? (
              <Button
                variant="soft"
                className="self-start"
                onClick={() => onChange({ ...setup, parts: [...setup.parts, 'voice'] })}
              >
                <Plus data-icon="inline-start" aria-hidden />
                {t('songs:setup.addPart')}
              </Button>
            ) : null}
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}
