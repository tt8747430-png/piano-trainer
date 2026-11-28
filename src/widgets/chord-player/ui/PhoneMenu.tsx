import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpDown,
  ArrowUpFromLine,
  Cable,
  Drum,
  FileText,
  Gauge,
  Link,
  ListMusic,
  ListPlus,
  Music,
  Repeat,
  Shuffle,
  Volume2,
  type LucideIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useMidiSummary } from '@/features/connect-midi'
import { PhoneMenuButton, PhonePage, useClearsToast, type MenuAction } from '@/shared/ui'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'

/** ☰'s pages, each with ← back to ☰. */
export type PhonePage =
  'menu' | 'chords' | 'style' | 'key' | 'tempo' | 'repeats' | 'audio' | 'chart' | 'midi' | 'export'

/**
 * A row of ☰ (the kit's `FROW` in a menu: 48 high at 17, 12 in, its parts 16 apart): its glyph, its word, its
 * value at 15 in soft ink, and the ink → of a row that opens a page (none on a row that acts where it stands).
 */
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
      className="flex min-h-12 w-full cursor-pointer items-center gap-4 rounded-thumb px-3 text-left text-[1.0625rem] text-foreground hover:bg-muted/60"
    >
      <Icon aria-hidden className="size-6 shrink-0" strokeWidth={2} />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {value ? (
        <span className="shrink-0 text-[0.9375rem] text-muted-foreground tabular-nums">
          {value}
        </span>
      ) : null}
      {opens ? <ArrowRight aria-hidden className="size-5.5 shrink-0" strokeWidth={2} /> : null}
    </button>
  )
}

const RULE = <div role="separator" className="mx-3 my-1 h-px shrink-0 bg-border" />

/** The progressions' two acts, after their own hairline as the board's third group. */
const PROGRESSION_ACTS = new Set(['to-progressions', 'progressions'])

/** The glyph each file act wears in ☰ (the board's: a link for Share…, a line under Export's arrow, over Import's). */
const FILE_ICONS: Readonly<Record<string, LucideIcon>> = {
  share: Link,
  export: ArrowDownToLine,
  'import-chart': ArrowUpFromLine,
  randomize: Shuffle,
  'to-progressions': ListPlus,
  progressions: ListMusic,
}

/**
 * ☰ on a phone (canvas R77, `PHNAV77`): a card under the header from its ☰, 22 round on the page's
 * paper, the sheet's name centred over it; the sheet's places as rows (Chords, Style, Key, Tempo,
 * Repeats, Audio, Chart, MIDI), each opening its page with ← back to ☰ (`PHPAGES77`, a `PhonePage`); then the file's
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
  const midi = useMidiSummary()
  useClearsToast(page === 'menu')
  const titles: Readonly<Record<Exclude<PhonePage, 'menu'>, string>> = {
    chords: bodies.chordsTitle,
    style: t('chordPlayer.style'),
    key: t('chordPlayer.playback.key'),
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
          className="flex max-h-(--available-height) w-[calc(100vw-2rem)] max-w-sm flex-col gap-2 overflow-y-auto rounded-sheet bg-background px-2 py-3 shadow-(--elevation-menu)!"
        >
          <p className="px-3 pt-1 text-center font-sans text-[1.0625rem]/[22px] font-semibold">
            {name}
          </p>
          <div className="flex flex-col">
            <MenuRow icon={Music} label={t('chordPlayer.rail.chords')} onClick={go('chords')} />
            <MenuRow
              icon={Drum}
              label={t('chordPlayer.style')}
              value={rows.styleName}
              onClick={go('style')}
            />
            <MenuRow
              icon={ArrowUpDown}
              label={t('chordPlayer.playback.key')}
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
              label={t('chordPlayer.playback.plays')}
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
            <MenuRow
              icon={Cable}
              label={t('chordPlayer.settings.midi')}
              value={midi}
              onClick={go('midi')}
            />
          </div>
          {[
            fileActs.filter((act) => !PROGRESSION_ACTS.has(act.key)),
            fileActs.filter((act) => PROGRESSION_ACTS.has(act.key)),
          ].map((group, at) =>
            group.length === 0 ? null : (
              <div key={at} className="contents">
                {RULE}
                <div className="flex flex-col">
                  {group.map((act) => (
                    <MenuRow
                      key={act.key}
                      icon={FILE_ICONS[act.key] ?? FileText}
                      label={act.label}
                      // Export opens its page; Open in Progressions goes to another place: both carry →.
                      opens={act.items !== undefined || act.key === 'progressions'}
                      onClick={() => {
                        if (act.items) return onPage('export')
                        onPage(null)
                        act.onSelect()
                      }}
                    />
                  ))}
                </div>
              </div>
            ),
          )}
        </PopoverContent>
      </Popover>
      {inPage ? (
        <PhonePage
          open
          title={titles[inPage]}
          onBack={back}
          onOpenChange={(open) => (open ? null : onPage(null))}
        >
          {bodies[inPage]}
        </PhonePage>
      ) : null}
    </>
  )
}
