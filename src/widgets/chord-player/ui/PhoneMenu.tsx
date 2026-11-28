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
  Shuffle,
  type LucideIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useMidiSummary } from '@/features/connect-midi'
import { BackButton, PhoneMenuButton, Sheet, SheetContent, type MenuAction } from '@/shared/ui'

/** ☰'s list and its pages, each in the one drawer, ‹ back to the list; Playback options opens from the transport. */
export type PhonePage = 'menu' | 'style' | 'key' | 'tempo' | 'repeats' | 'chart' | 'midi' | 'export'

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
 * ☰ on a phone: a drawer from the foot (a choice made over the chart keeps the chart in sight), the
 * sheet's name its title; the sheet's places as rows (Style, Key, Tempo, Chart, MIDI), each opening in
 * the same drawer with ‹ back to the list; then the file's acts (Share…, Export ›, Import chart…,
 * Randomize chords) and the progressions' two. Playback options, sound included, opens from the
 * transport's speaker alone; the chart's + and a chord's Suggested chords add chords, so no palette.
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
    readonly chart: string
  }
  /** The file's acts doable here (Export opens its page). */
  fileActs: readonly MenuAction[]
  bodies: Readonly<Record<Exclude<PhonePage, 'menu'>, ReactNode>>
}) {
  const { t } = useTranslation(['practice', 'common'])
  const midi = useMidiSummary()
  const titles: Readonly<Record<Exclude<PhonePage, 'menu'>, string>> = {
    style: t('chordPlayer.style'),
    key: t('chordPlayer.playback.key'),
    tempo: t('chordPlayer.tempo'),
    repeats: t('common:playbackOptions'),
    chart: t('chordPlayer.rail.chart'),
    midi: t('chordPlayer.settings.midi'),
    export: t('chordPlayer.exportMenu.label'),
  }
  const go = (next: Exclude<PhonePage, 'menu'>) => () => onPage(next)
  const inPage = page !== null && page !== 'menu' ? page : null
  // Playback options opens from the transport, not ☰: it has no way back to the list.
  const back =
    inPage && inPage !== 'repeats' ? <BackButton onClick={() => onPage('menu')} /> : undefined
  return (
    <>
      <PhoneMenuButton open={page !== null} onClick={() => onPage('menu')} />
      <Sheet open={page !== null} onOpenChange={(open) => (open ? null : onPage(null))}>
        <SheetContent title={inPage ? titles[inPage] : name} back={back}>
          {inPage ? (
            bodies[inPage]
          ) : (
            <div className="-mx-2 flex flex-col gap-2">
              <div className="flex flex-col">
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
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
