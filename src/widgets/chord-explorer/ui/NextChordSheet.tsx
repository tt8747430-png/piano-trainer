import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { partsFromParams, qualityParams } from '@/shared/lib'
import { useKeyName } from '@/shared/i18n'
import { buildChord, noteFromParam, printedSymbol, writtenSymbol } from '@/shared/lib/music'
import { Listbox, Segmented, Sheet, SheetContent } from '@/shared/ui'
import { chordSteps, stepOf, type ChordStep, type ChordView } from '../model/chord-view'
import { nextChords, staffKey, type NextChord, type NextWay } from '../model/next-chords'
import { useChordTypes } from './use-chord-types'

/** A step's symbol as it prints: `Dm7`, `B♭maj7`. */
const symbolOf = (step: ChordStep): string =>
  printedSymbol(writtenSymbol(buildChord(noteFromParam(step.root), partsFromParams(step))))

/**
 * The canvas's Next chord sheet (B_NEXT), opened by the staff's + to add a chord, or by a chord's name
 * to change it ("Change Am7", with Remove): Diatonic · Chromatic; the key's chords or the chosen one's
 * type a step away, as 72-high tiles two across, the symbol over what it is; those on the staff left
 * out, and when none are left, a way to the other list; then All chords, a page of every type on the
 * chosen root. A pick adds (or changes) the chord and keeps the sheet open; Done closes it.
 */
export function NextChordSheet({
  open,
  onOpenChange,
  view,
  editing,
  onPick,
  onRemove,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  view: ChordView
  /** The chord being changed, by its place on the staff; null to add one after the last. */
  editing: number | null
  onPick: (step: ChordStep) => void
  onRemove: () => void
}) {
  const { t } = useTranslation('practice')
  const keyName = useKeyName()
  const [way, setWay] = useState<NextWay>('diatonic')
  const [all, setAll] = useState(false)
  const steps = chordSteps(view)
  const changing = editing === null ? undefined : steps[editing]
  const chosen = symbolOf(stepOf(view))
  const offered = nextChords(view, way)
  const key = keyName(staffKey(view))
  const types = useChordTypes(noteFromParam(view.root))
  const what = (each: NextChord) =>
    each.numeral ?? t(`chords.next.moves.${String(each.move ?? 1)}` as 'chords.next.moves.1')
  const close = (next: boolean) => {
    if (!next) setAll(false)
    onOpenChange(next)
  }
  return (
    <Sheet open={open} onOpenChange={close}>
      <SheetContent
        title={
          changing ? t('chords.next.change', { chord: symbolOf(changing) }) : t('chords.next.title')
        }
      >
        {all ? (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setAll(false)}
              className="-ms-2 flex min-h-11 items-center gap-1 self-start rounded-control px-2 text-base font-semibold text-link outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronLeft aria-hidden className="size-5" />
              {changing
                ? t('chords.next.change', { chord: symbolOf(changing) })
                : t('chords.next.title')}
            </button>
            <Listbox
              label={t('chords.next.all')}
              className="gap-0.5 [&_[role=group]>p]:px-3 [&_[role=group]>p]:pt-3 [&_[role=group]>p]:pb-1"
              optionClassName="min-h-11 rounded-control px-3 text-base"
              groups={types.map((group) => ({
                label: group.label,
                options: group.options.map((option) => ({
                  key: option.value,
                  selected: false,
                  content: (
                    <span className="flex min-w-0 items-center gap-2">
                      <span>{option.label}</span>
                      <span className="text-muted-foreground">{option.detail}</span>
                    </span>
                  ),
                  onChoose: () => {
                    setAll(false)
                    onPick({ root: view.root, ...qualityParams(option.value), inversion: 0 })
                  },
                })),
              }))}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Segmented
              label={t('chords.next.title')}
              value={way}
              options={(['diatonic', 'chromatic'] as const).map((each) => ({
                value: each,
                label: t(`chords.next.ways.${each}`),
              }))}
              onChange={setWay}
            />
            <p className="ms-1 text-sm font-semibold text-muted-foreground">
              {way === 'diatonic'
                ? t('chords.next.inKey', { key })
                : t('chords.next.from', { chord: chosen })}
            </p>
            {offered.length === 0 ? (
              <div className="flex min-h-58 flex-col items-center justify-center gap-3 text-center">
                <p className="text-[0.9375rem] text-muted-foreground">
                  {way === 'diatonic'
                    ? t('chords.next.allInKey', { key })
                    : t('chords.next.allMoves')}
                </p>
                <button
                  type="button"
                  onClick={() => setWay(way === 'diatonic' ? 'chromatic' : 'diatonic')}
                  className="h-11 rounded-pill bg-muted px-4.5 text-[0.9375rem] font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {way === 'diatonic' ? t('chords.next.toChromatic') : t('chords.next.toDiatonic')}
                </button>
              </div>
            ) : (
              <div
                role="group"
                aria-label={t('chords.next.title')}
                className="grid min-h-58 auto-rows-[4.5rem] grid-cols-2 content-start gap-2"
              >
                {offered.map((each) => {
                  const symbol = symbolOf(each.step)
                  return (
                    <button
                      key={symbol}
                      type="button"
                      aria-label={t(changing ? 'chords.next.changeTo' : 'chords.next.addThis', {
                        chord: symbol,
                        what: what(each),
                      })}
                      onClick={() => onPick(each.step)}
                      className="flex h-18 flex-col items-center justify-center gap-0.5 rounded-[14px] bg-card text-foreground ring-1 ring-border outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span
                        className={`font-display font-bold whitespace-nowrap ${way === 'diatonic' ? 'text-[1.375rem]' : 'text-xl'}`}
                      >
                        {symbol}
                      </span>
                      <span className="text-sm text-muted-foreground">{what(each)}</span>
                    </button>
                  )
                })}
              </div>
            )}
            <button
              type="button"
              onClick={() => setAll(true)}
              className="flex min-h-12 items-center justify-between gap-3 rounded-xl bg-card px-4 text-base text-foreground ring-1 ring-border outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t('chords.next.all')}
              <ChevronRight aria-hidden className="size-4.5 text-muted-foreground" />
            </button>
            {changing && steps.length > 1 ? (
              <button
                type="button"
                onClick={onRemove}
                className="flex h-12 items-center gap-2.5 rounded-[14px] bg-card px-4 text-base font-semibold text-destructive ring-1 ring-border outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Trash2 aria-hidden className="size-5" />
                {t('chords.next.remove', { chord: symbolOf(changing) })}
              </button>
            ) : null}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
