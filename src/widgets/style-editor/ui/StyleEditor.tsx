import { Check } from 'lucide-react'
import { useId, type CSSProperties, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import {
  BLOCK_PRESETS,
  presetOf,
  STYLE_LAYOUTS,
  STYLE_PADDINGS,
  STYLE_PAINTS,
  styleVars,
  type BlockPreset,
  type BlockStyle,
  type StylePaint,
} from '@/shared/lib/style'
import { Pinned, Segmented } from '@/shared/ui'

const PRESETS = Object.keys(BLOCK_PRESETS) as BlockPreset[]
const RADII = [0, 1, 2, 3, 4] as const
const RADIUS_NAMES = ['square', 'slight', 'medium', 'round', 'roundest'] as const
const STEPS = [0, 1, 2] as const
const BORDER_NAMES = ['none', 'thin', 'thick'] as const
const SHADOW_NAMES = ['none', 'low', 'high'] as const

/** A corner drawn at a radius: the Corner radius choice's picture, its name its label. */
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

/** Each paint as a fill: its wash, the card's own for Default. */
const FILL_SWATCH: Readonly<Record<StylePaint, string>> = {
  plain: 'bg-card',
  sand: 'bg-paint-sand',
  sky: 'bg-paint-sky',
  grass: 'bg-paint-grass',
  yellow: 'bg-paint-yellow',
  lilac: 'bg-paint-lilac',
}

/** Each paint as text: the ink that reads on its wash, never the pale wash itself (R31-S). */
const INK_SWATCH: Readonly<Record<StylePaint, string>> = {
  plain: 'bg-foreground text-background',
  sand: 'bg-on-paint-sand text-background',
  sky: 'bg-on-paint-sky text-background',
  grass: 'bg-on-paint-grass text-background',
  yellow: 'bg-on-paint-yellow text-background',
  lilac: 'bg-on-paint-lilac text-background',
}

/** A style's own look on a small card: what a preset's tile and a preview draw. */
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

/**
 * The style editor (R32-C, memory-palaces' card style; shared by a place's Card style and a lesson
 * block's Style). The preview is pinned: a pane of its own, of fixed height, under the bar on a phone
 * (at a sheet's top in a sheet), the left column on a laptop; it never moves and never covers a
 * control, the controls scrolling beneath it. The controls: Presets first, one strip of tiles that
 * scrolls sideways, each the preset drawn; then Layout, Spacing; Card (Corner radius, Border,
 * Shadow); Colours (Background, Text colour); then what the page adds (`children`). The page saves.
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
  /** What the style is shown on, live: the pane's whole content. */
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
        !inSheet && 'lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:items-start lg:gap-12',
      )}
    >
      {inSheet ? (
        <section
          aria-label={t('style.preview')}
          className="sticky top-0 z-10 -mx-5 h-44 overflow-hidden border-b border-hairline bg-muted px-5 py-4"
        >
          {preview}
        </section>
      ) : (
        <Pinned className="h-[clamp(13rem,34dvh,21rem)] overflow-hidden border-b border-hairline bg-muted pt-3 lg:top-[calc(var(--screen-bar,0px)+1rem)] lg:mx-0 lg:h-[30rem] lg:rounded-sheet lg:border lg:p-5">
          <section aria-label={t('style.preview')} className="h-full">
            {preview}
          </section>
        </Pinned>
      )}
      <div className="flex min-w-0 flex-col gap-7">
        <PresetStrip value={value} onChange={onChange} />
        {layouts ? (
          <StyleChoice title={t('style.layout')}>
            <div
              role="radiogroup"
              aria-label={t('style.layout')}
              className="grid grid-cols-3 gap-2"
            >
              {STYLE_LAYOUTS.map((layout) => (
                <button
                  key={layout}
                  type="button"
                  role="radio"
                  aria-checked={value.layout === layout}
                  onClick={() => set('layout', layout)}
                  className="choice flex min-h-20 flex-col items-center justify-center gap-2 rounded-card border border-border bg-card px-2 py-3 text-base focus-visible:-outline-offset-3"
                >
                  <RowsPicture layout={layout} />
                  {t(`style.layouts.${layout}.label`)}
                </button>
              ))}
            </div>
          </StyleChoice>
        ) : null}
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
        <StyleGroup title={t('style.card')}>
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
              options={STEPS.map((border) => ({
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
              options={STEPS.map((shadow) => ({
                value: shadow,
                label: t(`style.shadows.${SHADOW_NAMES[shadow]}`),
              }))}
              onChange={(shadow) => set('shadow', shadow)}
            />
          </StyleChoice>
        </StyleGroup>
        <StyleGroup title={t('style.colours')}>
          <ColourRow
            label={t('style.surface')}
            value={value.surface}
            swatches={FILL_SWATCH}
            onChange={(surface) => set('surface', surface)}
          />
          <ColourRow
            label={t('style.text')}
            value={value.text}
            swatches={INK_SWATCH}
            onChange={(text) => set('text', text)}
          />
        </StyleGroup>
        {children}
      </div>
    </div>
  )
}

/**
 * The presets (memory-palaces' PresetStrip): one strip of equal tiles that scrolls sideways, each the
 * preset drawn as a small card, the chosen one ringed; Custom stands last while the style is none of
 * them.
 */
function PresetStrip({
  value,
  onChange,
}: {
  value: BlockStyle
  onChange: (style: BlockStyle) => void
}) {
  const { t } = useTranslation('common')
  const chosen = presetOf(value)
  const tile =
    'flex w-24 shrink-0 snap-start flex-col items-center gap-1.5 rounded-card p-1 text-sm focus-visible:-outline-offset-3'
  const face =
    'grid h-18 w-full place-items-center rounded-card bg-muted ring-offset-2 ring-offset-background transition-shadow duration-200'
  return (
    <StyleChoice title={t('style.presets')}>
      <div
        role="radiogroup"
        aria-label={t('style.presets')}
        className="-mx-gutter flex snap-x snap-mandatory scroll-px-gutter gap-2 overflow-x-auto px-gutter py-1 scrollbar-none lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0"
      >
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            role="radio"
            aria-checked={chosen === preset}
            onClick={() => onChange(BLOCK_PRESETS[preset])}
            className={tile}
          >
            <span className={cn(face, chosen === preset && 'ring-2 ring-foreground')}>
              <StyledCard
                style={BLOCK_PRESETS[preset]}
                className="grid h-11 w-16 place-items-center font-display text-lg font-semibold"
              >
                <span aria-hidden>Aa</span>
              </StyledCard>
            </span>
            <span className={cn(chosen === preset && 'font-semibold')}>
              {t(`style.preset.${preset}`)}
            </span>
          </button>
        ))}
        {chosen === null ? (
          <button type="button" role="radio" aria-checked className={tile}>
            <span className={cn(face, 'ring-2 ring-foreground')}>
              <StyledCard
                style={value}
                className="grid h-11 w-16 place-items-center font-display text-lg font-semibold"
              >
                <span aria-hidden>Aa</span>
              </StyledCard>
            </span>
            <span className="font-semibold">{t('style.preset.custom')}</span>
          </button>
        ) : null}
      </div>
    </StyleChoice>
  )
}

/** A colour: the paints as round swatches, then a custom colour (`#rrggbb`). */
function ColourRow({
  label,
  value,
  swatches,
  onChange,
}: {
  label: string
  value: BlockStyle['surface']
  /** How each paint is drawn: as a fill, or as the ink that reads on it. */
  swatches: Readonly<Record<StylePaint, string>>
  onChange: (value: BlockStyle['surface']) => void
}) {
  const { t } = useTranslation('common')
  const id = useId()
  const custom = value.startsWith('#')
  return (
    <div role="group" aria-labelledby={id} className="flex flex-col gap-2">
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
              'grid size-11 place-items-center rounded-pill border border-border transition-shadow duration-200 aria-pressed:ring-2 aria-pressed:ring-foreground aria-pressed:ring-offset-2 aria-pressed:ring-offset-background',
              swatches[paint],
            )}
          >
            {value === paint ? <Check aria-hidden className="size-4" /> : null}
          </button>
        ))}
        <label
          className="relative grid size-11 cursor-pointer place-items-center overflow-hidden rounded-pill border border-border"
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

/** A layout in miniature: rows down the width, cards side by side, or a grid of tiles. */
function RowsPicture({ layout }: { layout: (typeof STYLE_LAYOUTS)[number] }) {
  const cells = layout === 'list' ? 3 : layout === 'card' ? 2 : 4
  return (
    <span
      aria-hidden
      className={cn(
        'grid h-6 w-10 gap-0.5',
        layout === 'list' ? 'grid-rows-3' : 'grid-cols-2',
        layout === 'grid' && 'grid-rows-2',
      )}
    >
      {Array.from({ length: cells }, (_, cell) => (
        <span key={cell} className="rounded-pill bg-current opacity-60" />
      ))}
    </span>
  )
}

/** A part of the style under its heading, its choices stacked. */
function StyleGroup({ title, children }: { title: string; children: ReactNode }) {
  const id = useId()
  return (
    <section aria-labelledby={id} className="flex flex-col gap-5">
      <h2 id={id} className="font-display text-xl font-semibold">
        {title}
      </h2>
      {children}
    </section>
  )
}

/** One choice of the style: its name over its control. */
function StyleChoice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-base font-semibold">{title}</h3>
      {children}
    </div>
  )
}
