import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTakesStoreApi, type Take } from '@/entities/take'
import { keepTakeBars } from '@/features/manage-takes'
import { Dropdown, Labelled } from '@/shared/ui'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/primitives/alert-dialog'
import { Button } from '@/shared/ui/primitives/button'
import { wholeTake, type KeptBars } from '../model/kept-bars'

/**
 * Keep bars (spec 2026-10-09 §4.3): the first and last bar to keep, numbered as the piece numbers
 * them, and Keep, which asks first: the other bars are deleted for good. Keep waits for a choice
 * that cuts something.
 */
export function KeepBars({
  take,
  kept,
  onChange,
}: {
  take: Take
  kept: KeptBars
  onChange: (kept: KeptBars) => void
}) {
  const { t } = useTranslation('editor')
  const store = useTakesStoreApi()
  const [asking, setAsking] = useState(false)
  const whole = wholeTake(take)
  const bars = Array.from({ length: whole.last + 1 }, (_, bar) => ({
    value: bar,
    label: String(take.fromBar + bar),
  }))
  const numbered = { first: take.fromBar + kept.first, last: take.fromBar + kept.last }
  const keep = () => {
    keepTakeBars(store, take.id, kept.first, kept.last)
    onChange({ first: 0, last: kept.last - kept.first })
    setAsking(false)
  }
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl">{t('take.keep')}</h2>
      <div className="flex flex-wrap items-end gap-3">
        <Labelled label={t('take.first')}>
          <Dropdown
            label={t('take.first')}
            bare
            value={kept.first}
            options={bars}
            onChange={(first) => onChange({ first, last: Math.max(first, kept.last) })}
          />
        </Labelled>
        <Labelled label={t('take.last')}>
          <Dropdown
            label={t('take.last')}
            bare
            value={kept.last}
            options={bars}
            onChange={(last) => onChange({ first: Math.min(kept.first, last), last })}
          />
        </Labelled>
        <AlertDialog open={asking} onOpenChange={setAsking}>
          <AlertDialogTrigger
            render={<Button variant="outline" />}
            disabled={kept.first === whole.first && kept.last === whole.last}
          >
            {t('take.keepIt')}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('take.keeping.title', numbered)}</AlertDialogTitle>
              <AlertDialogDescription>{t('take.keeping.body')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('take.keeping.cancel')}</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={keep}>
                {t('take.keeping.confirm')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </section>
  )
}
