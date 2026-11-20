import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTakesStoreApi, type Take } from '@/entities/take'
import { keepTakeBars } from '@/features/manage-takes'
import { barNumber } from '@/shared/lib/music'
import { ActionRow, SettingsGroup, Stepper } from '@/shared/ui'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/primitives/alert-dialog'
import { wholeTake, type KeptBars } from '../model/kept-bars'

/**
 * Keep bars, a titled card as its board draws it: the first and last bar to keep, each a stepper,
 * numbered as the piece numbers them, and Keep, which asks first: the other bars are deleted for
 * good. Keep waits for a choice that cuts something.
 */
export function KeepBars({
  take,
  kept,
  pickup,
  onChange,
}: {
  take: Take
  kept: KeptBars
  /** Whether the song opens on a pickup: its bars numbered from the first full one. */
  pickup: boolean
  onChange: (kept: KeptBars) => void
}) {
  const { t } = useTranslation('editor')
  const store = useTakesStoreApi()
  const [asking, setAsking] = useState(false)
  const whole = wholeTake(take)
  // The take's bar `k` as the score numbers it: `fromBar` counts the written bars from 1.
  const said = (k: number) => barNumber(take.fromBar - 1 + k, pickup)
  const numbered = { first: said(kept.first), last: said(kept.last) }
  const keep = () => {
    keepTakeBars(store, take.id, kept.first, kept.last)
    onChange({ first: 0, last: kept.last - kept.first })
    setAsking(false)
  }
  const rows = [
    {
      key: 'first',
      label: t('take.first'),
      value: kept.first,
      set: (first: number) => onChange({ first, last: Math.max(first, kept.last) }),
    },
    {
      key: 'last',
      label: t('take.last'),
      value: kept.last,
      set: (last: number) => onChange({ first: Math.min(kept.first, last), last }),
    },
  ] as const
  return (
    <SettingsGroup title={t('take.keep')} flush>
      {rows.map((row) => (
        <div
          key={row.key}
          className="flex min-h-14 items-center justify-between gap-3 py-1.5 ps-4 pe-3"
        >
          <span className="min-w-0">{row.label}</span>
          <Stepper
            label={row.label}
            value={take.fromBar + row.value}
            min={take.fromBar + whole.first}
            max={take.fromBar + whole.last}
            onChange={(bar) => row.set(bar - take.fromBar)}
            format={(bar) => String(barNumber(bar - 1, pickup))}
            decrease={`${row.label} −`}
            increase={`${row.label} +`}
          />
        </div>
      ))}
      <ActionRow
        title={t('take.keepIt', numbered)}
        disabled={kept.first === whole.first && kept.last === whole.last}
        onClick={() => setAsking(true)}
      />
      <AlertDialog open={asking} onOpenChange={setAsking}>
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
    </SettingsGroup>
  )
}
