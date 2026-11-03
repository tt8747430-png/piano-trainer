import { useState } from 'react'
import { OpensMark } from '../NavMarks'
import { useTranslation } from 'react-i18next'
import { useKeyName } from '@/shared/i18n'
import { keySignature, signatureKey, type Key } from '@/shared/lib/music'
import { Button } from '../primitives/button'
import { RowCheck } from '../RowCheck'
import { Sheet, SheetContent, SheetTrigger } from '../Sheet'

/** The 15 signatures in Chord Trainer's order: none, one to seven sharps, one to seven flats. */
const SIGNATURES: readonly number[] = [0, 1, 2, 3, 4, 5, 6, 7, -1, -2, -3, -4, -5, -6, -7]

/**
 * Several keys (a drill's Custom keys, Chord Trainer's Keys sheet): a row naming how many are chosen,
 * opening a sheet of the 15 key signatures, each a row "C major / A minor" with its check, Select
 * all · Clear all over them and Apply at the foot. The keys are each signature's major; Apply waits
 * for one at least, so a run always asks something.
 */
export function KeysChecklist({
  label,
  value,
  onChange,
}: {
  label: string
  value: readonly Key[]
  onChange: (keys: Key[]) => void
}) {
  const { t } = useTranslation('common')
  const name = useKeyName()
  const [open, setOpen] = useState(false)
  const chosen = new Set(value.map(keySignature))
  const [draft, setDraft] = useState<ReadonlySet<number>>(chosen)
  const turn = (count: number, on: boolean) => {
    const next = new Set(draft)
    if (on) next.add(count)
    else next.delete(count)
    setDraft(next)
  }
  return (
    <div>
      <Sheet
        open={open}
        onOpenChange={(next) => {
          if (next) setDraft(new Set(value.map(keySignature)))
          setOpen(next)
        }}
      >
        <SheetTrigger
          render={
            <button
              type="button"
              className="-mx-2 flex min-h-11 w-[calc(100%+1rem)] items-center justify-between gap-3 rounded-control px-2 text-left transition-colors duration-200 ease-out hover:bg-muted"
            />
          }
        >
          <span className="min-w-0 text-foreground">{label}</span>
          <span className="flex shrink-0 items-center gap-1 text-muted-foreground tabular-nums">
            {t('picker.chosen', { count: chosen.size, total: SIGNATURES.length })}
            <OpensMark />
          </span>
        </SheetTrigger>
        <SheetContent
          title={label}
          footer={
            <Button
              className="w-full"
              disabled={draft.size === 0}
              onClick={() => {
                onChange(
                  SIGNATURES.filter((count) => draft.has(count)).map((count) =>
                    signatureKey(count, false),
                  ),
                )
                setOpen(false)
              }}
            >
              {t('picker.apply')}
            </Button>
          }
        >
          <div className="flex gap-4 pb-2">
            <Button
              variant="link"
              className="h-11 px-0 text-base text-link"
              onClick={() => setDraft(new Set(SIGNATURES))}
            >
              {t('picker.selectAll')}
            </Button>
            <Button
              variant="link"
              className="h-11 px-0 text-base text-link"
              onClick={() => setDraft(new Set())}
            >
              {t('picker.clearAll')}
            </Button>
          </div>
          <ul className="card divide-y divide-hairline overflow-hidden">
            {SIGNATURES.map((count) => (
              <li key={count}>
                <RowCheck
                  title={t('picker.keyPair', {
                    major: name(signatureKey(count, false)),
                    minor: name(signatureKey(count, true)),
                  })}
                  checked={draft.has(count)}
                  onCheckedChange={(on) => turn(count, on)}
                />
              </li>
            ))}
          </ul>
        </SheetContent>
      </Sheet>
    </div>
  )
}
