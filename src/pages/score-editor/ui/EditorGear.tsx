import { Circle } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { selectScoreView, useSettings } from '@/entities/settings'
import { selectTakesOf, useTakes } from '@/entities/take'
import type { Piece } from '@/entities/piece'
import { MidiControl, useMidiConnection } from '@/features/connect-midi'
import { useOpenShortcuts } from '@/features/shortcuts-help'
import { SongExportSheet } from '@/features/song-files'
import { useKeyName } from '@/shared/i18n'
import { hasFinePointer, LAPTOP, useMediaQuery } from '@/shared/lib'
import { useAccount } from '@/shared/lib/account'
import {
  BackButton,
  RowButton,
  RowLink,
  RowTrigger,
  SettingsGroup,
  Sheet,
  SheetContent,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { PRINTED_PARTS, SheetLayoutTools, SheetViewFields } from '@/widgets/score-view-menu'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { gearBack, type GearPage } from '../model/gear-pages'
import { usePalettePanel } from '../model/use-palette-panel'
import { useRecordTake } from '../model/use-record-take'
import { TAKES_PAGE } from '../model/use-editor-takes'
import { CreditsPage } from './CreditsPage'
import { EditorPrint } from './EditorPrint'
import { EditorTranspose } from './EditorTranspose'
import { ScorePageBody } from './ScoreSettingsPages'

/** An original's draft in the gear (ADR 0116, R31-E): where it stands, and its acts' rows. */
export interface EditorDraft {
  /** Where it stands: the line under the menu's title on a phone, beside Close on a laptop. */
  readonly status: ReactNode
  /** Versions: the first group's last row. */
  readonly versions: ReactNode
  /** Publish…, Discard changes: the gear's last group. */
  readonly rows: ReactNode
}

/** A recorder's red dot, as every recorder's Record wears. */
const RECORD_DOT = 'fill-current text-destructive'

/** A page's title in the sheet's head: the song's name on the first page, as the boards' menu. */
function useTitle(page: GearPage): string {
  const { t } = useTranslation('editor')
  const { meta } = useScoreEditorContext()
  switch (page) {
    case 'main':
      return meta.title
    case 'view':
    case 'transpose':
    case 'record':
      return t(`scoreSettings.acts.${page}`)
    default:
      return t(`scoreSettings.pages.${page}`)
  }
}

/**
 * The View's page: the sheet music's layout and what it shows. On a phone held upright the layout is
 * chosen here, the sheet's foot left to the music (R34); elsewhere it is the sheet's pill's.
 */
function ViewPage() {
  const { t } = useTranslation('music')
  const panel = usePalettePanel()
  return (
    <div className="flex flex-col gap-5">
      {panel ? null : (
        <SettingsGroup title={t('sheet.layout.label')}>
          <div className="flex justify-center px-3 py-3">
            <SheetLayoutTools />
          </div>
        </SettingsGroup>
      )}
      <SheetViewFields parts={PRINTED_PARTS} />
    </div>
  )
}

/** Record a take's page: what it needs, a MIDI keyboard or room in the takes, and Record once it can. */
function RecordPage() {
  const { t } = useTranslation('editor')
  const { connected, room, record } = useRecordTake()
  if (!room) return <p>{t('recorder.full')}</p>
  return (
    <div className="flex flex-col gap-4">
      {connected ? null : <p>{t('recorder.needsMidi')}</p>}
      <MidiControl />
      {connected ? (
        <Button className="self-start" onClick={record}>
          <Circle data-icon="inline-start" aria-hidden className={RECORD_DOT} />
          {t('recorder.record')}
        </Button>
      ) : null}
    </div>
  )
}

/**
 * The gear's first page (R32-B, Flat's document menu): the score's acts, View, Transpose and Takes
 * (Record a take is the note band's, beside Play, as the Editor boards draw it); then its Settings, each one tap from here with a line saying what it does:
 * Instruments, Layout, Note input, Recording; then an original's draft's acts. What the score prints
 * (the title, key, time, clef, tempo) is set where it prints (ADR 0114), never here. A lesson's
 * example is shown and moved alone: no takes, no Settings.
 */
function MainPage({
  draft,
  own,
  onExport,
  onPrint,
}: {
  draft: EditorDraft | undefined
  own: Piece | undefined
  onExport: () => void
  onPrint: () => void
}) {
  const { t } = useTranslation(['editor', 'music', 'songs', 'player', 'common'])
  const openShortcuts = useOpenShortcuts()
  const { meta, takes, view } = useScoreEditorContext()
  const keyName = useKeyName()
  const layout = useSettings((state) => selectScoreView(state).layout)
  const key = useEditorState((state) => state.draft.key)
  // Each instrument once: every single staff, and the piano where it is in sight.
  const staffCount = useEditorState(
    (state) => state.draft.staves.length + (state.draft.leadSheet ? 0 : 1),
  )
  const count = useTakes((state) => selectTakesOf(state, takes.pieceId).length)
  // The keyboard connected, by its name, as the boards' MIDI keyboard row says; None while none is.
  const { connection } = useMidiConnection()
  const midi =
    connection.kind === 'ready' && connection.status.state === 'connected'
      ? connection.status.devices.join(', ')
      : t('noMidi')
  const example = meta.kind === 'example'
  return (
    <div className="flex flex-col gap-5">
      <SettingsGroup flush>
        {example ? null : (
          <RowTrigger
            title={t('scoreSettings.pages.credits')}
            value={meta.title}
            onClick={() => view.setGear('credits')}
          />
        )}
        <RowTrigger
          title={t('scoreSettings.acts.view')}
          value={t(`music:sheet.layout.${layout}`)}
          onClick={() => view.setGear('view')}
        />
        <RowTrigger
          title={t('scoreSettings.acts.transpose')}
          value={keyName(key)}
          onClick={() => view.setGear('transpose')}
        />
        {example ? null : (
          <>
            {count > 0 ? (
              <RowTrigger
                title={t('scoreSettings.acts.takes')}
                value={String(count)}
                onClick={() => {
                  view.setGear(null)
                  takes.show(TAKES_PAGE)
                }}
              />
            ) : null}
          </>
        )}
        {draft?.versions}
      </SettingsGroup>
      {example ? null : (
        <SettingsGroup flush>
          <RowTrigger
            title={t('scoreSettings.pages.instruments')}
            value={String(staffCount)}
            onClick={() => view.setGear('instruments')}
          />
          <RowTrigger
            title={t('scoreSettings.pages.layout')}
            onClick={() => view.setGear('layout')}
          />
          <RowTrigger
            title={t('scoreSettings.pages.input')}
            onClick={() => view.setGear('input')}
          />
          <RowTrigger
            title={t('scoreSettings.pages.recording')}
            onClick={() => view.setGear('recording')}
          />
          {/* A MIDI keyboard has one home too, Settings › Connect a piano (its canvas's row). */}
          <RowLink
            title={t('scoreSettings.pages.midi')}
            value={midi}
            render={<Link to="/settings/connect-piano" />}
          />
          {/* Its shortcuts, where keys type them (F23, Flat's rail ending with Shortcuts). */}
          {hasFinePointer() ? (
            <RowTrigger
              title={t('common:shortcuts.title')}
              value="?"
              onClick={() => {
                view.setGear(null)
                openShortcuts()
              }}
            />
          ) : null}
        </SettingsGroup>
      )}
      {example ? null : (
        <SettingsGroup flush>
          {own ? (
            <RowTrigger
              title={t('songs:export.action')}
              value={t('exportFormats')}
              onClick={onExport}
            />
          ) : null}
          <RowButton title={t('player:print')} onClick={onPrint} />
        </SettingsGroup>
      )}
      {draft ? <SettingsGroup flush>{draft.rows}</SettingsGroup> : null}
    </div>
  )
}

/** A page's body, under its Back. */
function PageBody({ page }: { page: Exclude<GearPage, 'main'> }) {
  const { view } = useScoreEditorContext()
  const back = () => view.setGear(gearBack(page))
  switch (page) {
    case 'view':
      return <ViewPage />
    case 'transpose':
      return <EditorTranspose onDone={back} />
    case 'record':
      return <RecordPage />
    case 'credits':
      return <CreditsPage />
    default:
      return <ScorePageBody page={page} />
  }
}

/**
 * The editor's one gear (R31-E, Flat's one menu; ADR 0115): a sheet from the foot on a phone, a
 * card hung under the bar's ··· on a laptop (EditorLaptop's popover), closed by a click outside. Its first page holds the score's
 * acts and its Settings; each row turns to its page in the same sheet, every page with Back to the
 * first, so a sheet never opens over a sheet; Title and credits, opened from the title on the score,
 * stands alone. An original's draft says where it stands
 * beside the title.
 */
export function EditorGear({
  draft,
  own,
}: {
  draft: EditorDraft | undefined
  /** The learner's own song or version, which Export writes. */
  own?: Piece | undefined
}) {
  const { t } = useTranslation('editor')
  const { account } = useAccount()
  const [exporting, setExporting] = useState(false)
  const [printing, setPrinting] = useState(false)
  const { view } = useScoreEditorContext()
  const laptop = useMediaQuery(LAPTOP)
  const page = view.gear ?? 'main'
  const title = useTitle(page)
  return (
    <>
      <Sheet
        swipeDirection={laptop ? 'right' : 'down'}
        modal={!laptop}
        open={view.gear !== null}
        onOpenChange={(open) => view.setGear(open ? page : null)}
      >
        <SheetContent
          title={title}
          description={
            // On a laptop the bar says it beside Close (the EditorLaptop board), so the menu does not.
            page !== 'main' || laptop
              ? undefined
              : draft
                ? draft.status
                : own
                  ? t(account ? 'savedAccount' : 'savedHere')
                  : undefined
          }
          back={
            page === 'main' || gearBack(page) === null ? undefined : (
              <BackButton onClick={() => view.setGear(gearBack(page))} />
            )
          }
        >
          {page === 'main' ? (
            <MainPage
              draft={draft}
              own={own}
              onExport={() => {
                view.setGear(null)
                setExporting(true)
              }}
              onPrint={() => {
                view.setGear(null)
                setPrinting(true)
              }}
            />
          ) : (
            <PageBody page={page} />
          )}
        </SheetContent>
      </Sheet>
      <SongExportSheet piece={exporting ? (own ?? null) : null} onOpenChange={setExporting} />
      {printing ? <EditorPrint onDone={() => setPrinting(false)} /> : null}
    </>
  )
}
