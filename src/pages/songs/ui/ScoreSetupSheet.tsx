import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { SCORE_SETUPS, type ScoreSetup } from '@/features/edit-piece'
import { InfoTip, Segmented, Sheet, SheetContent } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/**
 * The staves a new song's score starts with (ADR 0072, 0091, 0097), its own sheet over New song, as
 * a notation app's new score asks: the piano, a staff over it, or a staff alone (a lead sheet). More
 * are added, named and taken away on the score. What each holds is the ⓘ beside the choice's name
 * (ADR 0096).
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
  const staves = useId()
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
        <section aria-labelledby={staves} className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <h3 id={staves} className="text-sm font-semibold text-muted-foreground">
              {t('setup.staves')}
            </h3>
            {/* What each choice holds, out of the way until asked for (ADR 0096). */}
            <InfoTip name={t('setup.staves')}>
              <dl className="flex flex-col gap-2">
                {SCORE_SETUPS.map((choice) => (
                  <div key={choice}>
                    <dt className="font-semibold">{t(`setup.choice.${choice}`)}</dt>
                    <dd className="text-muted-foreground">{t(`setup.choiceDetail.${choice}`)}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2">{t('setup.more')}</p>
            </InfoTip>
          </div>
          <Segmented
            label={t('setup.staves')}
            value={setup}
            options={SCORE_SETUPS.map((choice) => ({
              value: choice,
              label: t(`setup.choice.${choice}`),
            }))}
            onChange={onChange}
          />
        </section>
      </SheetContent>
    </Sheet>
  )
}
