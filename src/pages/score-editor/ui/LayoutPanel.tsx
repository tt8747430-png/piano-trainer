import { useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BARS_PER_LINE,
  fullLayout,
  HIDE_EMPTY,
  MARGIN_CM,
  MARGIN_SIDES,
  MEASURE_NUMBERS,
  MUSIC_FONTS,
  NOTE_SPACING,
  ORIENTATIONS,
  PAGE_SIZES,
  STAFF_MM,
  STAFF_SPACE,
  SYSTEM_SPACE,
  useStaffNames,
  type PieceLayout,
} from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { singleStaff, type StaffId } from '@/shared/lib/notation'
import { ChoiceCard, ConfirmDialog, FoldSection, Segmented, Stepper } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'
import { ScorePage, useStaffLabels } from '@/shared/ui/score'
import { wholeScore } from '@/widgets/score-sheet'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { pageSetup } from '../model/page-setup'
import { useStaffHeads } from '../model/use-staff-heads'

/** The Layout's groups (A40, Flat's); Pages opens first. */
type Group = 'pages' | 'staves' | 'hideEmpty' | 'measures' | 'measureNumbers' | 'font'

/** A number in the learner's language, at most one decimal. */
const useNumber = () => {
  const locale = useLocale()
  return (value: number) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 1, minimumFractionDigits: 0 }).format(
      value,
    )
}

/** A slider with its name and value over it: dragged, it is one change as it is let go. */
function LayoutSlider({
  label,
  value,
  min,
  max,
  step,
  shown,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  shown: (value: number) => string
  onChange: (value: number) => void
}) {
  const [held, setHeld] = useState<number | null>(null)
  return (
    <Slider
      min={min}
      max={max}
      step={step}
      value={held ?? value}
      onValueChange={(next) => setHeld(next)}
      onValueCommitted={(next) => {
        setHeld(null)
        if (next !== value) onChange(next)
      }}
      className="flex flex-col gap-2 py-1"
    >
      <div className="flex justify-between gap-3">
        <SliderLabel>{label}</SliderLabel>
        <span className="text-muted-foreground tabular-nums">{shown(held ?? value)}</span>
      </div>
    </Slider>
  )
}

/** A margin typed in centimetres: kept as it is left or Enter is pressed, in its range. */
function MarginField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  const [text, setText] = useState<string | null>(null)
  const keep = () => {
    if (text === null) return
    const read = Number.parseFloat(text.replace(',', '.'))
    if (Number.isFinite(read)) onChange(Math.min(MARGIN_CM.max, Math.max(MARGIN_CM.min, read)))
    setText(null)
  }
  return (
    <label className="flex flex-col gap-1 text-sm text-muted-foreground">
      {label}
      <Input
        aria-label={label}
        inputMode="decimal"
        enterKeyHint="done"
        value={text ?? String(value)}
        onChange={(event) => setText(event.target.value)}
        onBlur={keep}
        onKeyDown={(event) => {
          if (event.key === 'Enter') keep()
        }}
        className="h-11 text-base text-foreground tabular-nums"
      />
    </label>
  )
}

/** A group folded open or shut by its heading. */
function Group({
  group,
  open,
  onToggle,
  children,
}: {
  group: Group
  open: boolean
  onToggle: () => void
  children: ReactNode
}) {
  const { t } = useTranslation('editor')
  return (
    <FoldSection
      title={t(`layout.groups.${group}`)}
      level={3}
      headingClassName="text-base font-semibold"
      className="flex flex-col gap-3 border-b border-hairline py-3 last:border-b-0"
      fold={{ open, toggle: onToggle }}
    >
      {children}
    </FoldSection>
  )
}

/**
 * The editor's Layout (A40, Flat's): the score's first page as it prints, live, over its groups
 * (Pages, Staves, Hide empty staves, Measures, Measure numbers, Music font), each folded open or shut;
 * every change saved with the score as one Undo step; Reset, asked first, back to the standard.
 */
export function LayoutPanel() {
  const { t } = useTranslation(['editor', 'music'])
  const number = useNumber()
  const { actions, view, meta } = useScoreEditorContext()
  const draft = useEditorState((state) => state.draft)
  const layout = fullLayout(draft.layout)
  const [open, setOpen] = useState<ReadonlySet<Group>>(new Set(['pages']))
  const [resetting, setResetting] = useState(false)
  const score = useMemo(() => wholeScore(draft, view.lyrics), [draft, view.lyrics])
  const heads = useStaffHeads()
  const names = useStaffNames(heads)
  const staves: StaffId[] = [
    ...heads.map((_, place) => singleStaff(place)),
    ...(draft.leadSheet ? [] : (['treble', 'bass'] as const)),
  ]
  const kept = staves.filter((staff) => !view.hidden.includes(staff))
  const drawn = kept.length > 0 ? kept : staves
  const labels = useStaffLabels(
    drawn,
    names.map((text) => (text === undefined ? undefined : { text })),
  )
  const set = (change: PieceLayout & { readonly barsPerLine?: number | undefined }) => {
    const next: Record<string, unknown> = { ...draft.layout, ...change }
    if (next.barsPerLine === undefined) delete next.barsPerLine
    actions.dispatch({ type: 'layout', layout: next as PieceLayout })
  }
  const toggle = (group: Group) =>
    setOpen((was) => {
      const next = new Set(was)
      if (!next.delete(group)) next.add(group)
      return next
    })
  const fold = (group: Group, children: ReactNode) => (
    <Group key={group} group={group} open={open.has(group)} onToggle={() => toggle(group)}>
      {children}
    </Group>
  )
  const mm = (value: number) => t('layout.mm', { value: number(value) })
  const spaces = (value: number) => t('layout.spaces', { value: number(value) })
  return (
    <div className="flex flex-col gap-3">
      {/* The first page, live, over the groups: small enough to leave them room on a phone. */}
      <div className="pb-1">
        <div className="mx-auto w-full max-w-36">
          {score ? (
            <ScorePage
              score={score}
              staves={drawn}
              labels={labels}
              title={meta.title}
              page={pageSetup(draft.layout)}
            />
          ) : null}
        </div>
      </div>
      <div className="flex flex-col">
        {fold(
          'pages',
          <>
            <Segmented
              label={t('layout.orientation')}
              value={layout.orientation}
              options={ORIENTATIONS.map((each) => ({
                value: each,
                label: t(`layout.orientations.${each}`),
              }))}
              onChange={(orientation) => set({ orientation })}
            />
            <Segmented
              label={t('layout.pageSize')}
              value={layout.pageSize}
              options={PAGE_SIZES.map((each) => ({
                value: each,
                label: t(`layout.pageSizes.${each}`),
              }))}
              onChange={(pageSize) => set({ pageSize })}
            />
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 font-semibold">{t('layout.margins')}</legend>
              <div className="grid grid-cols-2 gap-2">
                {MARGIN_SIDES.map((side) => (
                  <MarginField
                    key={`${side}-${layout.margins[side]}`}
                    label={t(`layout.marginSides.${side}`)}
                    value={layout.margins[side]}
                    onChange={(value) => set({ margins: { ...layout.margins, [side]: value } })}
                  />
                ))}
              </div>
            </fieldset>
          </>,
        )}
        {fold(
          'staves',
          <>
            <LayoutSlider
              label={t('layout.staffSize')}
              {...STAFF_MM}
              value={layout.staffSize}
              shown={mm}
              onChange={(staffSize) => set({ staffSize })}
            />
            <LayoutSlider
              label={t('layout.staffSpace')}
              {...STAFF_SPACE}
              value={layout.staffSpace}
              shown={spaces}
              onChange={(staffSpace) => set({ staffSpace })}
            />
            <LayoutSlider
              label={t('layout.systemSpace')}
              {...SYSTEM_SPACE}
              value={layout.systemSpace}
              shown={spaces}
              onChange={(systemSpace) => set({ systemSpace })}
            />
          </>,
        )}
        {fold(
          'hideEmpty',
          <ChoiceCard
            title={t('layout.groups.hideEmpty')}
            info={t('layout.hideEmptyInfo')}
            value={layout.hideEmpty}
            options={HIDE_EMPTY.map((each) => ({
              value: each,
              label: t(`layout.hideEmptyChoices.${each}`),
            }))}
            onChange={(hideEmpty) => set({ hideEmpty })}
          />,
        )}
        {fold(
          'measures',
          <>
            <LayoutSlider
              label={t('layout.noteSpacing')}
              {...NOTE_SPACING}
              value={layout.noteSpacing}
              shown={(value) =>
                value <= NOTE_SPACING.min + 10
                  ? t('layout.compact')
                  : value >= NOTE_SPACING.max - 10
                    ? t('layout.wide')
                    : number(value)
              }
              onChange={(noteSpacing) => set({ noteSpacing })}
            />
            <div className="flex items-center justify-between gap-3">
              <span>{t('layout.barsPerLine')}</span>
              <Stepper
                label={t('layout.barsPerLine')}
                value={layout.barsPerLine ?? 0}
                min={0}
                max={BARS_PER_LINE.max}
                format={(value) => (value === 0 ? t('layout.auto') : String(value))}
                onChange={(most) => set({ barsPerLine: most === 0 ? undefined : most })}
                decrease={t('layout.fewerBars')}
                increase={t('layout.moreBars')}
              />
            </div>
          </>,
        )}
        {fold(
          'measureNumbers',
          <ChoiceCard
            title={t('layout.groups.measureNumbers')}
            value={layout.measureNumbers}
            options={MEASURE_NUMBERS.map((each) => ({
              value: each,
              label: t(`layout.measureNumberChoices.${each}`),
            }))}
            onChange={(measureNumbers) => set({ measureNumbers })}
          />,
        )}
        {fold(
          'font',
          <ChoiceCard
            title={t('layout.groups.font')}
            value={layout.font}
            options={MUSIC_FONTS.map((each) => ({ value: each, label: each }))}
            onChange={(font) => set({ font })}
          />,
        )}
      </div>
      <Button
        variant="outline"
        disabled={draft.layout === undefined}
        onClick={() => setResetting(true)}
      >
        {t('layout.reset')}
      </Button>
      <ConfirmDialog
        open={resetting}
        onOpenChange={setResetting}
        title={t('layout.resetTitle')}
        body={t('layout.resetBody')}
        action={t('layout.reset')}
        onConfirm={() => {
          setResetting(false)
          actions.dispatch({ type: 'layout', layout: {} })
        }}
      />
    </div>
  )
}
