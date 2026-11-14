import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import {
  ARRANGER_NUMBERS,
  MAINS,
  type ArrangerNumber,
  type Into,
  type Main,
  type SectionMarks,
} from '@/shared/lib/arrangement'
import { Labelled, Segmented, Sheet, SheetContent } from '@/shared/ui'

const ROMAN: Readonly<Record<ArrangerNumber, string>> = { 1: 'I', 2: 'II', 3: 'III' }
type Pick<V extends string> = V | 'none'
const orNone = <V extends string>(value: V | null): Pick<V> => value ?? 'none'
const fromNone = <V extends string>(value: Pick<V>): V | null => (value === 'none' ? null : value)
const numbered = (value: ArrangerNumber | null) => (value === null ? 'none' : String(value))

/** A section's marks in a line, as its head's tag shows them: "Intro I · Main A, Main B · Fill in". */
export function marksLine(marks: SectionMarks, t: TFunction<'practice'>): string {
  const mains = marks.mains.filter((main): main is Main => main !== null)
  return [
    marks.intro === null ? null : t('chordPlayer.arranger.intro', { n: ROMAN[marks.intro] }),
    mains.length ? mains.map((main) => t('chordPlayer.arranger.main', { main })).join(', ') : null,
    marks.into === null ? null : t(`chordPlayer.arranger.into.${marks.into}`),
    marks.ending === null ? null : t('chordPlayer.arranger.ending', { n: ROMAN[marks.ending] }),
  ]
    .filter(Boolean)
    .join(' · ')
}

/**
 * A section on the arranger (canvas 171, the tag on its head): its Intro where it opens the sheet,
 * its Main for each time through, what leads into the next section (Fill in, Break), its Ending
 * where it closes the sheet. None sends nothing, so the arranger plays as its panel says.
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title={t('chordPlayer.arranger.title', { name })}>
        <div className="flex flex-col gap-5">
          {first ? (
            <Labelled label={t('chordPlayer.arranger.introLabel')}>
              <Segmented
                label={t('chordPlayer.arranger.introLabel')}
                value={numbered(marks.intro)}
                options={numberedOptions('intro')}
                onChange={(value) => onChange({ ...marks, intro: readNumber(value) })}
              />
            </Labelled>
          ) : null}
          <section className="flex flex-col gap-3">
            <Labelled
              label={t('chordPlayer.arranger.mains')}
              info={t('chordPlayer.arranger.noneInfo')}
            >
              <div className="flex flex-col gap-4">
                {Array.from({ length: repeats }, (_, pass) => (
                  <Labelled
                    key={pass}
                    label={t('chordPlayer.arranger.pass', { count: pass + 1, ordinal: true })}
                  >
                    <Segmented
                      label={t('chordPlayer.arranger.pass', { count: pass + 1, ordinal: true })}
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
                  </Labelled>
                ))}
              </div>
            </Labelled>
          </section>
          {last ? (
            <Labelled label={t('chordPlayer.arranger.endingLabel')}>
              <Segmented
                label={t('chordPlayer.arranger.endingLabel')}
                value={numbered(marks.ending)}
                options={numberedOptions('ending')}
                onChange={(value) => onChange({ ...marks, ending: readNumber(value) })}
              />
            </Labelled>
          ) : null}
          <Labelled label={t('chordPlayer.arranger.intoLabel')}>
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
          </Labelled>
        </div>
      </SheetContent>
    </Sheet>
  )
}
