import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { SCORE_TEMPLATES, TEMPLATES, templateOf, type ScoreSetup } from '@/features/edit-piece'
import { InfoTip, Sheet, SheetContent, SwitchRow } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/**
 * What a new song's score holds (ADR 0072, 0091, 0094), its own sheet over New song: a template to
 * start from, as a notation app offers them, then its staves as the score names them: the melody's
 * and the piano's (hidden, a lead sheet). Its chord symbols are typed into it, shown by the View.
 * What each template and staff holds is an ⓘ beside its name (ADR 0096).
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
  const { t } = useTranslation('songs')
  const chosen = templateOf(setup)
  // No tune: the piano is the only staff, kept.
  const pianoKept = !setup.melody
  const id = useId()
  const ids = { templates: `${id}-templates`, staves: `${id}-staves` }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        title={t('setup.title')}
        footer={
          <Button size="lg" className="w-full" onClick={() => onOpenChange(false)}>
            {t('setup.done')}
          </Button>
        }
      >
        <div className="flex flex-col gap-6">
          <section aria-labelledby={ids.templates} className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <h3 id={ids.templates} className="text-sm font-semibold text-muted-foreground">
                {t('setup.templates')}
              </h3>
              {/* What each template holds, out of the way until asked for (ADR 0096). */}
              <InfoTip name={t('setup.templates')}>
                <dl className="flex flex-col gap-2">
                  {TEMPLATES.map((template) => (
                    <div key={template}>
                      <dt className="font-semibold">{t(`setup.template.${template}`)}</dt>
                      <dd className="text-muted-foreground">
                        {t(`setup.templateDetail.${template}`)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </InfoTip>
            </div>
            <div
              role="radiogroup"
              aria-labelledby={ids.templates}
              className="grid gap-2 sm:grid-cols-2"
            >
              {TEMPLATES.map((template) => (
                <button
                  key={template}
                  type="button"
                  role="radio"
                  aria-checked={chosen === template}
                  onClick={() => onChange(SCORE_TEMPLATES[template])}
                  className="flex min-h-14 items-center rounded-2xl border border-border bg-card px-3 py-2 text-left font-semibold transition-colors hover:bg-chosen aria-checked:border-selected aria-checked:bg-selected/10"
                >
                  {t(`setup.template.${template}`)}
                </button>
              ))}
            </div>
          </section>
          <section aria-labelledby={ids.staves} className="flex flex-col">
            <h3 id={ids.staves} className="text-sm font-semibold text-muted-foreground">
              {t('setup.staves')}
            </h3>
            <SwitchRow
              icon={<span className="font-music text-xl leading-none">𝄞</span>}
              label={t('setup.melody')}
              info={t('setup.melodyDetail')}
              checked={setup.melody}
              onCheckedChange={(melody) => onChange({ ...setup, melody })}
            />
            <SwitchRow
              icon={<span className="font-music text-xl leading-none">𝄢</span>}
              label={t('setup.piano')}
              // The piano stays where no other staff would be in sight (ADR 0083).
              info={pianoKept ? t('setup.pianoKept') : t('setup.pianoDetail')}
              checked={setup.piano || pianoKept}
              disabled={pianoKept}
              onCheckedChange={(piano) => onChange({ ...setup, piano })}
            />
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}
