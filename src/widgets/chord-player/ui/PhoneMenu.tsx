import {
  ArrowUpDown,
  ChevronRight,
  Download,
  Drum,
  FileText,
  Gauge,
  ListMusic,
  ListPlus,
  Music2,
  Repeat,
  Cable,
  Share,
  Shuffle,
  Upload,
  Volume2,
  type LucideIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { BackButton, PhoneMenuButton, Sheet, SheetContent, type MenuAction } from '@/shared/ui'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'

/** ☰'s pages, each with ← back to ☰. */
export type PhonePage =
  'menu' | 'chords' | 'style' | 'key' | 'tempo' | 'repeats' | 'audio' | 'chart' | 'midi' | 'export'

/** A row of ☰ (the kit's `FROWS` in a menu: 48 high at 17): its glyph, its word, its value, ›. */
function MenuRow({
  icon: Icon,
  label,
  value,
  opens = true,
  onClick,
}: {
  icon: LucideIcon
  label: string
  value?: string
  opens?: boolean
  onClick(): void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-[10px] px-3 text-left text-[1.0625rem] text-foreground hover:bg-muted/60"
    >
      <Icon aria-hidden className="size-5.5 shrink-0" strokeWidth={2} />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {value ? <span className="shrink-0 text-base text-muted-foreground">{value}</span> : null}
      {opens ? (
        <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
      ) : null}
    </button>
  )
}

const RULE = <div role="separator" className="mx-3 my-1 h-px shrink-0 bg-border" />

/** The glyph each file act wears in ☰. */
const FILE_ICONS: Readonly<Record<string, LucideIcon>> = {
  share: Share,
  export: Download,
  'import-chart': Upload,
  randomize: Shuffle,
  'to-progressions': ListPlus,
  progressions: ListMusic,
}

/**
 * ☰ on a phone (canvas R77, `PHNAV77`): a card under the header from its ☰, 22 round on the page's
 * paper, the sheet's name centred over it; the sheet's places as rows (Chords, Style, Key, Tempo,
 * Repeats, Audio, Chart, MIDI), each opening its page with ← back to ☰ (`PHPAGES77`); then the file's
 * acts (Share…, Export ›, Import chart…, Randomize chords) and the progressions' two.
 */
export function PhoneMenu({
  page,
  onPage,
  name,
  rows,
  fileActs,
  bodies,
}: {
  page: PhonePage | null
  onPage(page: PhonePage | null): void
  name: string
  rows: {
    readonly styleName: string
    readonly keyName: string
    readonly tempo: string
    readonly repeats: string
    readonly chart: string
  }
  /** The file's acts doable here (Export opens its page). */
  fileActs: readonly MenuAction[]
  bodies: Readonly<Record<Exclude<PhonePage, 'menu'>, ReactNode>> & { readonly chordsTitle: string }
}) {
  const { t } = useTranslation(['practice', 'common'])
  const titles: Readonly<Record<Exclude<PhonePage, 'menu'>, string>> = {
    chords: bodies.chordsTitle,
    style: t('chordPlayer.style'),
    key: t('chordPlayer.dock.key'),
    tempo: t('chordPlayer.tempo'),
    repeats: t('common:playbackOptions'),
    audio: t('chordPlayer.rail.audio'),
    chart: t('chordPlayer.rail.chart'),
    midi: t('chordPlayer.settings.midi'),
    export: t('chordPlayer.exportMenu.label'),
  }
  const go = (next: Exclude<PhonePage, 'menu'>) => () => onPage(next)
  const inPage = page !== null && page !== 'menu' ? page : null
  // A page opened from the transport's speaker (Playback options) goes back to the sheet, not ☰.
  const back = () => onPage(inPage === 'repeats' ? null : 'menu')
  return (
    <>
      <Popover open={page === 'menu'} onOpenChange={(open) => onPage(open ? 'menu' : null)}>
        <PopoverTrigger render={<PhoneMenuButton open={page === 'menu'} />} />
        <PopoverContent
          align="end"
          sideOffset={8}
          aria-label={name}
          className="flex max-h-(--available-height) w-[calc(100vw-2rem)] max-w-sm flex-col gap-2 overflow-y-auto rounded-[22px] bg-background px-2 py-3 shadow-[0_0_0_1px_rgb(51_41_33/0.06),0_18px_48px_-12px_rgb(51_41_33/0.38)]"
        >
          <p className="px-3 pt-1 text-center font-sans text-[1.0625rem]/[22px] font-semibold">
            {name}
          </p>
          <div className="flex flex-col">
            <MenuRow icon={Music2} label={t('chordPlayer.rail.chords')} onClick={go('chords')} />
            <MenuRow
              icon={Drum}
              label={t('chordPlayer.style')}
              value={rows.styleName}
              onClick={go('style')}
            />
            <MenuRow
              icon={ArrowUpDown}
              label={t('chordPlayer.dock.key')}
              value={rows.keyName}
              onClick={go('key')}
            />
            <MenuRow
              icon={Gauge}
              label={t('chordPlayer.tempo')}
              value={rows.tempo}
              onClick={go('tempo')}
            />
            <MenuRow
              icon={Repeat}
              label={t('chordPlayer.dock.plays')}
              value={rows.repeats}
              onClick={go('repeats')}
            />
            <MenuRow icon={Volume2} label={t('chordPlayer.rail.audio')} onClick={go('audio')} />
            <MenuRow
              icon={FileText}
              label={t('chordPlayer.rail.chart')}
              value={rows.chart}
              onClick={go('chart')}
            />
            <MenuRow icon={Cable} label={t('chordPlayer.settings.midi')} onClick={go('midi')} />
          </div>
          {RULE}
          <div className="flex flex-col">
            {fileActs.map((act) => (
              <MenuRow
                key={act.key}
                icon={FILE_ICONS[act.key] ?? FileText}
                label={act.label}
                opens={act.items !== undefined}
                onClick={() => {
                  if (act.items) return onPage('export')
                  onPage(null)
                  act.onSelect()
                }}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <Sheet open={inPage !== null} onOpenChange={(open) => (open ? null : onPage(null))}>
        {inPage ? (
          <SheetContent title={titles[inPage]} full back={<BackButton onClick={back} />}>
            {bodies[inPage]}
          </SheetContent>
        ) : null}
      </Sheet>
    </>
  )
}
