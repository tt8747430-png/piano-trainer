import { ArrowUpDown, Circle, Eye, ListMusic, Mic, Music2, Piano, Ruler } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { selectScoreView, useSettings } from '@/entities/settings'
import { selectTakesOf, useTakes } from '@/entities/take'
import { MidiControl } from '@/features/connect-midi'
import { useKeyName } from '@/shared/i18n'
import { LAPTOP, useMediaQuery } from '@/shared/lib'
import { BackButton, RowButton, RowTrigger, SettingsGroup, Sheet, SheetContent } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { PRINTED_PARTS, SheetViewFields } from '@/widgets/score-view-menu'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { gearBack, type GearPage } from '../model/gear-pages'
import { useRecordTake } from '../model/use-record-take'
import { TAKES_PAGE } from '../model/use-editor-takes'
import { CreditsPage } from './CreditsPage'
import { EditorTranspose } from './EditorTranspose'
import { ScorePageBody } from './ScoreSettingsPages'

/** An original's draft in the gear (ADR 0116, R31-E): where it stands, and its acts' rows. */
export interface EditorDraft {
  /** Saved, saving or not saved: beside the gear's title. */
  readonly status: ReactNode
  /** Publish…, Versions, Discard changes: the gear's last group. */
  readonly rows: ReactNode
}

/** A recorder's red dot, as every recorder's Record wears. */
const RECORD_DOT = 'fill-current text-destructive'

/** A page's title in the sheet's head. */
function useTitle(page: GearPage): string {
  const { t } = useTranslation('editor')
  switch (page) {
    case 'main':
      return t('scoreSettings.score')
    case 'view':
    case 'transpose':
    case 'record':
      return t(`scoreSettings.acts.${page}`)
    default:
      return t(`scoreSettings.pages.${page}`)
  }
}

/** The View's page: the sheet music's layout and what it shows. */
function ViewPage() {
  return (
    <div className="flex flex-col gap-5">
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
 * The gear's first page (R32-B, Flat's document menu): the score's acts, View, Transpose, Record a
 * take and Takes; then its Settings, each one tap from here with a line saying what it does:
 * Instruments, Layout, Note input, Recording; then an original's draft's acts. What the score prints
 * (the title, key, time, clef, tempo) is set where it prints (ADR 0114), never here. A lesson's
 * example is shown and moved alone: no takes, no Settings.
 */
function MainPage({ draft }: { draft: EditorDraft | undefined }) {
  const { t } = useTranslation(['editor', 'music'])
  const { meta, takes, view } = useScoreEditorContext()
  const keyName = useKeyName()
  const layout = useSettings((state) => selectScoreView(state).layout)
  const key = useEditorState((state) => state.draft.key)
  // Each instrument once: every single staff, and the piano where it is in sight.
  const staffCount = useEditorState(
    (state) => state.draft.staves.length + (state.draft.leadSheet ? 0 : 1),
  )
  const count = useTakes((state) => selectTakesOf(state, takes.pieceId).length)
  const { record } = useRecordTake()
  const example = meta.kind === 'example'
  return (
    <div className="flex flex-col gap-5">
      <SettingsGroup flush>
        <RowTrigger
          title={t('scoreSettings.acts.view')}
          icon={Eye}
          paint="sky"
          value={t(`music:sheet.layout.${layout}`)}
          onClick={() => view.setGear('view')}
        />
        <RowTrigger
          title={t('scoreSettings.acts.transpose')}
          icon={ArrowUpDown}
          paint="lilac"
          value={keyName(key)}
          onClick={() => view.setGear('transpose')}
        />
        {example ? null : (
          <>
            <RowButton
              title={t('scoreSettings.acts.record')}
              icon={Circle}
              paint="sand"
              onClick={record}
            />
            <RowButton
              title={t('scoreSettings.acts.takes')}
              icon={ListMusic}
              paint="yellow"
              value={String(count)}
              disabled={count === 0}
              reason={t('recorder.noTakes')}
              onClick={() => {
                view.setGear(null)
                takes.show(TAKES_PAGE)
              }}
            />
          </>
        )}
      </SettingsGroup>
      {example ? null : (
        <SettingsGroup flush title={t('scoreSettings.acts.settings')}>
          <RowTrigger
            title={t('scoreSettings.pages.instruments')}
            detail={t('scoreSettings.details.instruments')}
            icon={Music2}
            paint="lilac"
            value={String(staffCount)}
            onClick={() => view.setGear('instruments')}
          />
          <RowTrigger
            title={t('scoreSettings.pages.layout')}
            detail={t('scoreSettings.details.layout')}
            icon={Ruler}
            paint="grass"
            onClick={() => view.setGear('layout')}
          />
          <RowTrigger
            title={t('scoreSettings.pages.input')}
            detail={t('scoreSettings.details.input')}
            icon={Piano}
            paint="yellow"
            onClick={() => view.setGear('input')}
          />
          <RowTrigger
            title={t('scoreSettings.pages.recording')}
            detail={t('scoreSettings.details.recording')}
            icon={Mic}
            paint="sand"
            onClick={() => view.setGear('recording')}
          />
        </SettingsGroup>
      )}
      {draft ? (
        <SettingsGroup flush title={t('original.more')}>
          {draft.rows}
        </SettingsGroup>
      ) : null}
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
 * panel at the right on a laptop with the music in sight beside it. Its first page holds the score's
 * acts and its Settings; each row turns to its page in the same sheet, every page with Back to the
 * first, so a sheet never opens over a sheet; Title and credits, opened from the title on the score,
 * stands alone. An original's draft says where it stands
 * beside the title.
 */
export function EditorGear({ draft }: { draft: EditorDraft | undefined }) {
  const { view } = useScoreEditorContext()
  const laptop = useMediaQuery(LAPTOP)
  const page = view.gear ?? 'main'
  const title = useTitle(page)
  return (
    <Sheet
      swipeDirection={laptop ? 'right' : 'down'}
      modal={!laptop}
      // Beside the music it stays open as the music plays: Close, Escape and the gear close it.
      disablePointerDismissal={laptop}
      open={view.gear !== null}
      onOpenChange={(open) => view.setGear(open ? page : null)}
    >
      <SheetContent title={title} status={page === 'main' ? draft?.status : undefined}>
        {page === 'main' ? (
          <MainPage draft={draft} />
        ) : (
          <div className="flex flex-col gap-5">
            {/* Title and credits opens from the title on the score: its sheet's Close shuts it. */}
            {gearBack(page) === null ? null : (
              <BackButton onClick={() => view.setGear(gearBack(page))} />
            )}
            <PageBody page={page} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
