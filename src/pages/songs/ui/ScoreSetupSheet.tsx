import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { SCORE_TEMPLATES, TEMPLATES, templateOf, type ScoreSetup } from '@/features/edit-piece'
import { Sheet, SheetContent, SwitchRow } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/**
 * What a new song's score holds (ADR 0072, 0091, 0094), its own sheet over New song: a template to
 * start from, as a notation app offers them, then its staves as the score names them: the melody's
 * and the piano's (hidden, a lead sheet). Its chord symbols are typed into it, shown by the View.
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
            <h3 id={ids.templates} className="text-sm font-semibold text-muted-foreground">
              {t('setup.templates')}
            </h3>
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
                  className="flex flex-col items-start gap-0.5 rounded-2xl border border-border bg-card p-3 text-left transition-colors hover:bg-chosen aria-checked:border-selected aria-checked:bg-selected/10"
                >
                  <span className="font-semibold">{t(`setup.template.${template}`)}</span>
                  <span className="text-sm text-muted-foreground">
                    {t(`setup.templateDetail.${template}`)}
                  </span>
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
              detail={t('setup.melodyDetail')}
              checked={setup.melody}
              onCheckedChange={(melody) => onChange({ ...setup, melody })}
            />
            <SwitchRow
              icon={<span className="font-music text-xl leading-none">𝄢</span>}
              label={t('setup.piano')}
              // The piano stays where no other staff would be in sight (ADR 0083).
              detail={pianoKept ? t('setup.pianoKept') : t('setup.pianoDetail')}
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
