import { useTranslation } from 'react-i18next'
import {
  ARRANGER_NUMBERS,
  MAINS,
  type ArrangerNumber,
  type Into,
  type Main,
  type SectionMarks,
} from '@/shared/lib/arrangement'
import { Segmented, Sheet, SheetContent } from '@/shared/ui'
import { ROMAN } from './marks-line'
import { SheetSection } from './sheet-parts'

type Pick<V extends string> = V | 'none'
const orNone = <V extends string>(value: V | null): Pick<V> => value ?? 'none'
const fromNone = <V extends string>(value: Pick<V>): V | null => (value === 'none' ? null : value)
const numbered = (value: ArrangerNumber | null) => (value === null ? 'none' : String(value))

/**
 * A section on the arranger (the board's `CP_TAG`, the tag on its head): its Intro where it opens the
 * sheet, its Main for each time through (Main, 1st time), what leads into the next section (Fill in,
 * Break), its Ending where it closes the sheet; each a head over its segmented control, 24 apart.
 * None sends nothing, so the arranger plays as its panel says.
 */
export function ArrangerSheet({
  open,
  onOpenChange,
  name,
  marks,
  repeats,
  first,
  last,
  onChange,
}: {
  open: boolean
  onOpenChange(open: boolean): void
  /** The section's name. */
  name: string
  marks: SectionMarks
  /** How many times it plays: a Main for each. */
  repeats: number
  first: boolean
  last: boolean
  onChange(marks: SectionMarks): void
}) {
  const { t } = useTranslation('practice')
  const none = { value: 'none', label: t('chordPlayer.arranger.none') } as const
  const numberedOptions = (kind: 'intro' | 'ending') => [
    none,
    ...ARRANGER_NUMBERS.map((n) => ({
      value: String(n),
      label: t(`chordPlayer.arranger.${kind}`, { n: ROMAN[n] }),
    })),
  ]
  const readNumber = (value: string): ArrangerNumber | null => {
    const n = Number(value)
    return ARRANGER_NUMBERS.find((each) => each === n) ?? null
  }
  return (
    <Sheet at={{ width: 'w-115' }} open={open} onOpenChange={onOpenChange}>
      <SheetContent title={t('chordPlayer.arranger.title', { name })}>
        <div className="flex flex-col gap-6">
          {first ? (
            <SheetSection title={t('chordPlayer.arranger.introLabel')}>
              <Segmented
                label={t('chordPlayer.arranger.introLabel')}
                value={numbered(marks.intro)}
                options={numberedOptions('intro')}
                onChange={(value) => onChange({ ...marks, intro: readNumber(value) })}
              />
            </SheetSection>
          ) : null}
          {Array.from({ length: repeats }, (_, pass) => {
            const title = t('chordPlayer.arranger.pass', { count: pass + 1, ordinal: true })
            return (
              <SheetSection key={pass} title={title}>
                <Segmented
                  label={title}
                  value={orNone<Main>(marks.mains[pass] ?? null)}
                  options={[none, ...MAINS.map((main) => ({ value: main, label: main }))]}
                  onChange={(value) =>
                    onChange({
                      ...marks,
                      mains: Array.from({ length: repeats }, (_, at) =>
                        at === pass ? fromNone<Main>(value) : (marks.mains[at] ?? null),
                      ),
                    })
                  }
                />
              </SheetSection>
            )
          })}
          <SheetSection title={t('chordPlayer.arranger.intoLabel')}>
            <Segmented
              label={t('chordPlayer.arranger.intoLabel')}
              value={orNone<Into>(marks.into)}
              options={[
                none,
                { value: 'fill', label: t('chordPlayer.arranger.into.fill') },
                { value: 'break', label: t('chordPlayer.arranger.into.break') },
              ]}
              onChange={(value) => onChange({ ...marks, into: fromNone<Into>(value) })}
            />
          </SheetSection>
          {last ? (
            <SheetSection title={t('chordPlayer.arranger.endingLabel')}>
              <Segmented
                label={t('chordPlayer.arranger.endingLabel')}
                value={numbered(marks.ending)}
                options={numberedOptions('ending')}
                onChange={(value) => onChange({ ...marks, ending: readNumber(value) })}
              />
            </SheetSection>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
