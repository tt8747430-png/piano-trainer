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
import { Pinned, Segmented, SettingsGroup } from '@/shared/ui'

const PRESETS = Object.keys(BLOCK_PRESETS) as BlockPreset[]
const RADII = [0, 1, 2, 3, 4] as const
const RADIUS_NAMES = ['square', 'slight', 'medium', 'round', 'roundest'] as const
const BORDERS = [0, 1, 2, 3] as const
const BORDER_NAMES = ['none', 'thin', 'medium', 'thick'] as const
const SHADOWS = [0, 1, 2, 3] as const
const SHADOW_NAMES = ['none', 'low', 'medium', 'high'] as const

/** A corner drawn at a radius: the Corners choice's picture, its name its label. */
const Corner = ({ radius }: { radius: number }) => {
  const r = [0, 3, 6, 10, 16][radius] ?? 0
  return (
    <svg
      aria-hidden
      viewBox="0 0 22 22"
      className="size-5.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
    >
      <path d={r ? `M4 20V${4 + r}Q4 4 ${4 + r} 4H20` : 'M4 20V4H20'} />
    </svg>
  )
}

/** Each paint as text: the ink that reads on its wash, never the pale wash itself (R31-S). */
const INK_SWATCH: Readonly<Record<(typeof STYLE_PAINTS)[number], string>> = {
  plain: 'bg-foreground text-background',
  sand: 'bg-on-paint-sand text-background',
  sky: 'bg-on-paint-sky text-background',
  grass: 'bg-on-paint-grass text-background',
  yellow: 'bg-on-paint-yellow text-background',
  lilac: 'bg-on-paint-lilac text-background',
}

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
  ink = false,
}: {
  label: string
  value: BlockStyle['surface']
  onChange: (value: BlockStyle['surface']) => void
  /** Text: each paint as the ink that reads on it, never its pale fill (R31-S). */
  ink?: boolean
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
              ink ? INK_SWATCH[paint] : paint === 'plain' ? 'bg-card' : `bg-paint-${paint}`,
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
 * The style editor (R29 B9, R31-S; memory-palaces' deck card style). The preview has a place of its
 * own and never hangs over a control: on a phone a pane pinned under the bar, solid, the page's width,
 * its controls scrolling below it; from a laptop's width a column beside them. The controls: Style
 * (the presets, a grid of equal tiles), Corners, Border and Shadow (a row of choices each), Fill and
 * Text colour, Spacing, Layout; then what the page adds (`children`: what a card shows, where the
 * style goes). The page saves.
 */
export function StyleEditor({
  value,
  onChange,
  preview,
  layouts = true,
  inSheet = false,
  children,
}: {
  value: BlockStyle
  onChange: (style: BlockStyle) => void
  /** What the style is shown on, live. */
  preview: ReactNode
  /** Whether Layout is offered: a place's rows have one, a block has none. */
  layouts?: boolean
  /** In a sheet (a lesson block's style): the preview pinned to the sheet's top, one column. */
  inSheet?: boolean
  /** The page's own controls, after the style's. */
  children?: ReactNode
}) {
  const { t } = useTranslation('common')
  const set = <K extends keyof BlockStyle>(key: K, next: BlockStyle[K]) =>
    onChange({ ...value, [key]: next })
  return (
    <div
      className={cn(
        'flex flex-col gap-6',
        !inSheet && 'lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-10',
      )}
    >
      {inSheet ? (
        <section
          aria-label={t('style.preview')}
          className="sticky top-0 z-10 max-h-[38svh] overflow-hidden border-b border-hairline bg-background py-3"
        >
          {preview}
        </section>
      ) : (
        // Pinned under the bar as it slides, never a band of controls above it (R31-S).
        <Pinned className="max-h-[38svh] overflow-hidden border-b border-hairline pt-3 lg:top-[calc(var(--screen-bar,0px)+1rem)] lg:mx-0 lg:max-h-none lg:rounded-card lg:border lg:bg-muted lg:p-4">
          <section aria-label={t('style.preview')}>{preview}</section>
        </Pinned>
      )}
      <div className="flex min-w-0 flex-col gap-6">
        <section aria-labelledby="style-presets" className="flex flex-col gap-2">
          <h2 id="style-presets" className="px-1 text-sm font-semibold text-muted-foreground">
            {t('style.presets')}
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                aria-pressed={same(value, BLOCK_PRESETS[preset])}
                onClick={() => onChange(BLOCK_PRESETS[preset])}
                className="choice flex min-w-0 flex-col items-stretch gap-1.5 rounded-card p-2"
              >
                <StyledCard style={BLOCK_PRESETS[preset]} className="h-10">
                  <span className="sr-only">{t(`style.preset.${preset}`)}</span>
                </StyledCard>
                <span aria-hidden className="truncate text-center text-sm">
                  {t(`style.preset.${preset}`)}
                </span>
              </button>
            ))}
          </div>
        </section>
        <SettingsGroup>
          <div className="flex flex-col gap-4 px-5 py-4">
            <StyleChoice title={t('style.radius')}>
              <Segmented
                label={t('style.radius')}
                value={value.radius}
                options={RADII.map((radius) => ({
                  value: radius,
                  label: '',
                  title: t(`style.radii.${RADIUS_NAMES[radius]}`),
                  icon: <Corner radius={radius} />,
                }))}
                onChange={(radius) => set('radius', radius)}
              />
            </StyleChoice>
            <StyleChoice title={t('style.border')}>
              <Segmented
                label={t('style.border')}
                value={value.border}
                options={BORDERS.map((border) => ({
                  value: border,
                  label: t(`style.borders.${BORDER_NAMES[border]}`),
                }))}
                onChange={(border) => set('border', border)}
              />
            </StyleChoice>
            <StyleChoice title={t('style.shadow')}>
              <Segmented
                label={t('style.shadow')}
                value={value.shadow}
                options={SHADOWS.map((shadow) => ({
                  value: shadow,
                  label: t(`style.shadows.${SHADOW_NAMES[shadow]}`),
                }))}
                onChange={(shadow) => set('shadow', shadow)}
              />
            </StyleChoice>
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
            ink
          />
        </SettingsGroup>
        <SettingsGroup>
          <div className="flex flex-col gap-4 px-5 py-4">
            <StyleChoice title={t('style.padding')}>
              <Segmented
                label={t('style.padding')}
                value={value.padding}
                options={STYLE_PADDINGS.map((padding) => ({
                  value: padding,
                  label: t(`style.paddings.${padding}.label`),
                }))}
                onChange={(padding) => set('padding', padding)}
              />
            </StyleChoice>
            {layouts ? (
              <StyleChoice title={t('style.layout')}>
                <Segmented
                  label={t('style.layout')}
                  value={value.layout}
                  options={STYLE_LAYOUTS.map((layout) => ({
                    value: layout,
                    label: t(`style.layouts.${layout}.label`),
                    icon: <RowsPicture layout={layout} />,
                  }))}
                  onChange={(layout) => set('layout', layout)}
                />
              </StyleChoice>
            ) : null}
          </div>
        </SettingsGroup>
        {children}
      </div>
    </div>
  )
}

/** A layout in miniature: rows down the width, cards side by side, or a grid of tiles. */
function RowsPicture({ layout }: { layout: (typeof STYLE_LAYOUTS)[number] }) {
  const cells = layout === 'list' ? 3 : layout === 'card' ? 2 : 4
  return (
    <span
      aria-hidden
      className={cn(
        'grid h-5 w-8 gap-0.5',
        layout === 'list' ? 'grid-rows-3' : 'grid-cols-2',
        layout === 'grid' && 'grid-rows-2',
      )}
    >
      {Array.from({ length: cells }, (_, cell) => (
        <span key={cell} className="rounded-pill bg-current opacity-70" />
      ))}
    </span>
  )
}

/** One part of the style: its name over its row of choices. */
function StyleChoice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-base font-semibold">{title}</h3>
      {children}
    </div>
  )
}
