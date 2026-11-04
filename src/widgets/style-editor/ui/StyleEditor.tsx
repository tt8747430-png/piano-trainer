import { Check } from 'lucide-react'
import { useId, type CSSProperties, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import {
  BLOCK_PRESETS,
  STYLE_LAYOUTS,
  STYLE_PADDINGS,
  STYLE_PAINTS,
  styleVars,
  type BlockPreset,
  type BlockStyle,
} from '@/shared/lib/style'
import { ChoiceCard, Segmented, SettingsGroup, Stepper } from '@/shared/ui'

const PRESETS = Object.keys(BLOCK_PRESETS) as BlockPreset[]
const RADII = [0, 1, 2, 3, 4] as const
const RADIUS_NAMES = ['square', 'slight', 'medium', 'round', 'roundest'] as const
const SHADOW_NAMES = ['none', 'low', 'medium', 'high'] as const

const same = (a: BlockStyle, b: BlockStyle) =>
  (Object.keys(a) as (keyof BlockStyle)[]).every((key) => a[key] === b[key])

/** A style's own look on a small card: what a preset chip and the preview draw. */
export function StyledCard({
  style,
  className,
  children,
}: {
  style: BlockStyle
  className?: string
  children: ReactNode
}) {
  return (
    <div data-card-look="" style={styleVars(style) as CSSProperties} className="contents">
      <div className={cn('card', className)}>{children}</div>
    </div>
  )
}

/** A colour: the paints as round swatches, then a custom colour (`#rrggbb`). */
function ColourRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: BlockStyle['surface']
  onChange: (value: BlockStyle['surface']) => void
}) {
  const { t } = useTranslation('common')
  const id = useId()
  const custom = value.startsWith('#')
  return (
    <div role="group" aria-labelledby={id} className="flex flex-col gap-2 px-5 py-4">
      <h3 id={id} className="text-base font-semibold">
        {label}
      </h3>
      <div className="flex flex-wrap items-center gap-2">
        {STYLE_PAINTS.map((paint) => (
          <button
            key={paint}
            type="button"
            aria-pressed={value === paint}
            aria-label={t(`style.paints.${paint}`)}
            title={t(`style.paints.${paint}`)}
            onClick={() => onChange(paint)}
            className={cn(
              'grid size-11 place-items-center rounded-pill border border-border',
              paint === 'plain' ? 'bg-card' : `bg-paint-${paint}`,
            )}
          >
            {value === paint ? <Check aria-hidden className="size-4" /> : null}
          </button>
        ))}
        <label
          className={cn(
            'relative grid size-11 cursor-pointer place-items-center overflow-hidden rounded-pill border border-border',
          )}
          title={t('style.custom')}
          style={custom ? { backgroundColor: value } : undefined}
        >
          <span
            aria-hidden
            className={cn(
              'size-full',
              !custom && 'bg-[conic-gradient(red,yellow,lime,aqua,blue,magenta,red)] opacity-80',
            )}
          />
          {custom ? (
            <Check aria-hidden className="absolute size-4 text-white mix-blend-difference" />
          ) : null}
          <input
            type="color"
            aria-label={`${label}: ${t('style.custom')}`}
            value={custom ? value : '#888888'}
            onChange={(event) => onChange(event.target.value as `#${string}`)}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>
      </div>
    </div>
  )
}

/**
 * The style editor (R29 B9, memory-palaces' deck card style): the presets as picture chips, then
 * each part of the style with its control: Roundness, Border, Shadow, Fill and Text colour, Padding,
 * Layout. `preview` sits at the top and stays in sight while the page scrolls; the page saves.
 */
export function StyleEditor({
  value,
  onChange,
  preview,
  layouts = true,
}: {
  value: BlockStyle
  onChange: (style: BlockStyle) => void
  /** What the style is shown on, live. */
  preview: ReactNode
  /** Whether Layout is offered: a place's rows have one, a block has none. */
  layouts?: boolean
}) {
  const { t } = useTranslation('common')
  const set = <K extends keyof BlockStyle>(key: K, next: BlockStyle[K]) =>
    onChange({ ...value, [key]: next })
  return (
    <div className="flex flex-col gap-6">
      <section
        aria-label={t('style.preview')}
        className="sticky top-[calc(var(--bar-height,4rem)+0.5rem)] z-10 rounded-card bg-background/90 py-2 backdrop-blur"
      >
        {preview}
      </section>
      <section aria-labelledby="style-presets" className="flex flex-col gap-2">
        <h2 id="style-presets" className="px-1 text-sm font-semibold text-muted-foreground">
          {t('style.presets')}
        </h2>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              aria-pressed={same(value, BLOCK_PRESETS[preset])}
              onClick={() => onChange(BLOCK_PRESETS[preset])}
              className="choice flex shrink-0 flex-col items-center gap-1.5 rounded-card p-2"
            >
              <StyledCard style={BLOCK_PRESETS[preset]} className="h-10 w-16">
                <span className="sr-only">{t(`style.preset.${preset}`)}</span>
              </StyledCard>
              <span aria-hidden className="text-sm">
                {t(`style.preset.${preset}`)}
              </span>
            </button>
          ))}
        </div>
      </section>
      <SettingsGroup>
        <div className="flex flex-col gap-2 px-5 py-4">
          <Segmented
            label={t('style.radius')}
            value={value.radius}
            options={RADII.map((radius) => ({
              value: radius,
              label: t(`style.radii.${RADIUS_NAMES[radius]}`),
            }))}
            onChange={(radius) => set('radius', radius)}
          />
        </div>
        <div className="flex items-center justify-between gap-3 px-5 py-3">
          <span className="font-semibold">{t('style.border')}</span>
          <Stepper
            label={t('style.border')}
            value={value.border}
            min={0}
            max={3}
            format={(width) =>
              width === 0 ? t('style.borderNone') : t('style.borderWidth', { count: width })
            }
            onChange={(width) => set('border', width as BlockStyle['border'])}
            decrease={t('style.thinner')}
            increase={t('style.thicker')}
          />
        </div>
        <div className="flex items-center justify-between gap-3 px-5 py-3">
          <span className="font-semibold">{t('style.shadow')}</span>
          <Stepper
            label={t('style.shadow')}
            value={value.shadow}
            min={0}
            max={3}
            format={(shadow) => t(`style.shadows.${SHADOW_NAMES[shadow as BlockStyle['shadow']]}`)}
            onChange={(shadow) => set('shadow', shadow as BlockStyle['shadow'])}
            decrease={t('style.lower')}
            increase={t('style.higher')}
          />
        </div>
      </SettingsGroup>
      <SettingsGroup>
        <ColourRow
          label={t('style.surface')}
          value={value.surface}
          onChange={(surface) => set('surface', surface)}
        />
        <ColourRow
          label={t('style.text')}
          value={value.text}
          onChange={(text) => set('text', text)}
        />
      </SettingsGroup>
      <ChoiceCard
        title={t('style.padding')}
        value={value.padding}
        options={STYLE_PADDINGS.map((padding) => ({
          value: padding,
          label: t(`style.paddings.${padding}.label`),
          example: t(`style.paddings.${padding}.example`),
        }))}
        onChange={(padding) => set('padding', padding)}
      />
      {layouts ? (
        <ChoiceCard
          title={t('style.layout')}
          value={value.layout}
          options={STYLE_LAYOUTS.map((layout) => ({
            value: layout,
            label: t(`style.layouts.${layout}.label`),
            example: t(`style.layouts.${layout}.example`),
          }))}
          onChange={(layout) => set('layout', layout)}
        />
      ) : null}
    </div>
  )
}
