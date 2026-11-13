import { Download, Eye, Hand, Piano, Printer, SlidersHorizontal } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useStaffNames, type PieceLayout, type ScoreHeader, type StaffName } from '@/entities/piece'
import {
  selectKeyboard,
  selectOtherHand,
  selectScoreView,
  selectTipSeen,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { retireTip, setScoreView } from '@/features/set-preference'
import {
  isMidiConnected,
  MidiButton,
  useHeldKeys,
  useMidiConnection,
} from '@/features/connect-midi'
import { KeyboardStrip, KeysPlace, LiveKeyboard } from '@/features/live-keyboard'
import { cn } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import { TICKS_PER_BEAT } from '@/shared/lib/music'
import type { Recording } from '@/shared/lib/schedule'
import { SheetPill, SheetToolsContext, type MenuAction } from '@/shared/ui'
import { ChordView, shownView, viewNeeds } from '@/widgets/chord-views'
import {
  HandsButton,
  KeyboardButton,
  CountInBeat,
  HandsSheet,
  LoopButton,
  PracticeSheet,
  PlayerArea,
  PlayerScreen,
  PlayerClose,
  PlayerDock,
  ScoreBar,
  usePlayerShortcuts,
  WaitLine,
  type PracticePlayer,
  type PracticeView,
} from '@/widgets/practice-player'
import { SheetMusic } from '@/widgets/sheet-music'
import { SongPrint } from '@/widgets/song-print'
import { PianoHands } from '@/widgets/piano-hands'
import { PlayerHands, PlayerPlayback } from '@/widgets/player-settings'
import { SheetLayoutTools, ViewSection } from '@/widgets/score-view-menu'
import {
  SettingsExtrasContext,
  type SettingsExtras,
  type SettingsPageRow,
} from '@/widgets/player-setup'
import { useChordKeys } from '../model/use-chord-keys'
import { PlayerExport } from './PlayerExport'
import type { MusicXmlFormat } from '@/features/song-files'
import { PickView } from './PickView'
import { SongHead } from './SongHead'
import { CoachLine } from './CoachLine'
import type { ScoreAnnotation } from '@/shared/lib/notation'

/** A walk or a progression: one section, named nowhere. */
const NO_HEADINGS: readonly string[] = []
/** A walk or a progression: the piano's staves alone. */
const NO_STAVES: readonly { readonly name?: StaffName }[] = []
/** A walk or a progression: no acts of its own. */
const NO_ACTS: readonly MenuAction[] = []
/** A walk or a progression: no tools of its own. */
const NO_ACTS_MORE: readonly MenuAction[] = []
/** A walk or a progression: no pages of its own in the Settings. */
const NO_PAGES: readonly SettingsPageRow[] = []

/**
 * The Player's screen over any Performance (Flowkey's shape, ADR 0061): its bar (`ScoreBar`, ADR
 * 0115, R29: Close, the title and Edit; Piano keys, MIDI and the one gear, the Player's Settings with the
 * music's acts, Flat's one menu; its tools, ADR 0108: the View,
 * named by the view shown, then the music's own tools, a piece's Transpose and Simplify, ADR 0105);
 * the music under its title (ADR 0114) as the View
 * shows it (ADR 0108: the sheet music, Chords over lyrics, Diagrams or the Grid), Wait mode's line,
 * the transport under it (the loop, Restart, ‹ ▶ ›, Pace and the metronome, R36), the
 * count-in's beat large over it all while Listen counts in (ADR 0105), and the keys at the
 * foot, or under the tools row where the keyboard settings dock them at the top; the computer's keys
 * drive it (`usePlayerShortcuts`). Settings' Print puts the music as the View shows it in print
 * (`SongPrint`, ADR 0107).
 */
export function PlayerLayout({
  title,
  credits,
  layout,
  onClose,
  view,
  player,
  performance,
  headings = NO_HEADINGS,
  setup,
  pages: musicPages = NO_PAGES,
  onEdit,
  piano = true,
  staves = NO_STAVES,
  recording,
  more = NO_ACTS,
  musicXml,
  share,
  status,
  display,
  playback,
  moreActs = NO_ACTS_MORE,
  annotations,
  annotating,
}: {
  /** The learner's typed marks, written on the score (R29 B8); none for a walk. */
  annotations?: readonly ScoreAnnotation[] | undefined
  /** The Annotate bar over the score while it is on (R29 B8). */
  annotating?: ReactNode
  /** The music's own acts in the foot's More (R31-P): a piece's Annotate. */
  moreActs?: readonly MenuAction[]
  /** The music's own on the Settings' Playback page (R31-P): a score's Swing. */
  playback?: ReactNode
  /**
   * Whether the sheet writes the piano's staves: not for a song that hides them, a lead sheet (ADR
   * 0114). The keys and what plays are the same.
   */
  piano?: boolean
  /** The piece's single staves, top down, each printed and switched in the View by its name (ADR 0097). */
  staves?: readonly { readonly name?: StaffName }[]
  /**
   * The piece's recording: the Sound offers its volume (ADR 0105), Export… its MIDI time aligned to it
   * (ADR 0107).
   */
  recording?: Recording | undefined
  title: string
  /** Printed under the title on the sheet (ADR 0114): a piece's subtitle, composer, lyricist, arranger. */
  credits?: ScoreHeader | undefined
  /** The score's staff size and the most bars a line holds (ADR 0114): a piece's. */
  layout?: PieceLayout | undefined
  onClose: () => void
  view: PracticeView
  player: PracticePlayer
  performance: Performance
  /** Each section's name, by section: shown at its first bar; none for music with one section. */
  headings?: readonly string[]
  /** The Settings: its gear, in the bar, and the sheet it opens (`SettingsSheet`). */
  setup: ReactNode
  /** The music's own pages of the Settings: a piece's Transpose and Version; none for a walk. */
  pages?: readonly SettingsPageRow[]
  /** Edit score, in the Settings' head under the song (its canvas): a piece's own, none for a walk. */
  onEdit?: (() => void) | undefined
  /** The music's own acts in Settings, before Print: a piece's Song information and Sections (ADR 0107). */
  more?: readonly MenuAction[] | undefined
  /** Export…'s MusicXML: a piece's music as written (ADR 0107). */
  musicXml?: ((format?: MusicXmlFormat) => void) | undefined
  /** Share link: a piece's, as its page shares it; its own act, never Export's row (R31-S). */
  share?: { readonly onSelect: () => void } | undefined
  /** What the screen says beside Wait mode's line, only while it says something: what a piece's Share said. */
  status?: ReactNode
  /** Display's own choices after the View's: a single-staff song's Clef (R29 B7). */
  display?: ReactNode
}) {
  const { t } = useTranslation(['player', 'songs', 'settings', 'music', 'common'])
  const { practice } = player
  const dock = useSettings((state) => selectKeyboard(state).dock)
  const keySize = useSettings((state) => selectKeyboard(state).keySize)
  const scoreView = useSettings(selectScoreView)
  const otherHand = useSettings((state) => selectOtherHand(state).look)
  const held = useHeldKeys()
  const { hidden } = player
  const sheetView = useMemo(() => ({ ...scoreView, hidden }), [scoreView, hidden])
  const names = useStaffNames(staves)
  // The view saved, where the music can show it, else the one it falls back to (ADR 0108).
  const needs = useMemo(() => viewNeeds(performance), [performance])
  const shown = shownView(scoreView.music, needs)
  // The hands button where the music has both hands: none for a one-hand line (R29).
  const twoHands = useMemo(() => {
    const hands = new Set(performance.notes.map((note) => note.hand))
    return hands.has('rh') && hands.has('lh')
  }, [performance])
  // With no hands button, a hand chosen before (a song edited down to one) is forgotten: both play.
  const { hands: chosenHands } = view
  const { setHands } = player
  useEffect(() => {
    if (!twoHands && chosenHands !== 'both') setHands('both')
  }, [twoHands, chosenHands, setHands])
  usePlayerShortcuts(player, view, onClose)
  // The Hands sheet (R36), from the foot bar's Hands.
  const [handsOpen, setHandsOpen] = useState(false)
  const { connection } = useMidiConnection()
  // The keys play at a tap; the hands at the keys are watched (R36).
  const playable = isMidiConnected(connection) || (player.keys && !scoreView.hands)
  // Print (ADR 0107): the music printed as the View shows it, while its render stands.
  const [printing, setPrinting] = useState(false)
  const [exporting, setExporting] = useState(false)
  // The Settings open as a panel beside the music (a laptop): the screen ends where it starts.
  const [panel, setPanel] = useState(false)
  // The coach's line (R29 B8, R31-P): shown until put away by its × or done (Play pressed in
  // Listen), remembered for good.
  const settingsStore = useSettingsStoreApi()
  const tip = `coach.${view.mode}`
  const coached = useSettings(selectTipSeen(tip))
  const playing = practice.state.playing
  useEffect(() => {
    if (playing && view.mode === 'listen') retireTip(settingsStore, tip)
  }, [playing, view.mode, settingsStore, tip])
  const groups = performance.beatGroups.length
  const progress = groups > 1 ? practice.state.beatGroup / (groups - 1) : 0
  // The Settings' head's ··· (its canvas): the music's acts only, in parts: the song's, practice's,
  // the tools, sharing. Every setting is the gear's; Share link is the head's own button.
  const moreMenu: MenuAction[] = (
    [
      ...more.map((act) => ({ ...act, group: 'song' })),
      ...moreActs.map((act) => ({ ...act, group: 'practice' })),
      {
        key: 'print',
        group: 'tools',
        label: t('print'),
        icon: Printer,
        onSelect: () => setPrinting(true),
      },
      {
        key: 'export',
        group: 'share',
        label: t('songs:export.action'),
        icon: Download,
        onSelect: () => setExporting(true),
      },
    ] satisfies MenuAction[]
  ).map((act): MenuAction => ({ ...act, unnamed: true }))
  // The Player's one Settings (R29, Flat's one menu): how the Player works, then the acts on this
  // music: its own (a piece's Sections and Song information), Export… and Print.
  const extras: SettingsExtras = {
    head: (
      <SongHead
        title={title}
        detail={t('music:bpm', { tempo: player.tempo })}
        share={share?.onSelect}
        acts={moreMenu}
        onEdit={onEdit}
      />
    ),
    pages: [
      ...musicPages,
      {
        id: 'playback',
        label: t('settingsPage.playback'),
        icon: SlidersHorizontal,
        content: <PlayerPlayback>{playback}</PlayerPlayback>,
      },
      {
        id: 'hands',
        label: t('settingsPage.hands'),
        icon: Hand,
        value: t(`settingsPage.otherHand.${otherHand}`),
        content: <PlayerHands />,
      },
      {
        id: 'display',
        label: t('settingsPage.display'),
        icon: Eye,
        value: shown === 'sheet' ? t(`music:sheet.layout.${scoreView.layout}`) : undefined,
        content: (
          <>
            <ViewSection view={shown} words={needs.lyrics !== 'words'} />
            {display}
          </>
        ),
      },
    ],
    // The on-screen piano's settings have one home, Settings › On-screen piano (owner, 2026-11-12:
    // "I dont want keyboard settings in three places"): a row to it, ranked among the pages.
    links: [
      {
        id: 'piano',
        label: t('settingsPage.onScreenPiano'),
        icon: Piano,
        value: t(`common:keyboardSettings.keySize.${keySize}`),
        render: <Link to="/settings/on-screen-piano" />,
      },
    ],
    // Its acts are More's (R31-P): the sheet holds how the Player works, never what it does.
    acts: [],
    onPanel: setPanel,
  }
  // A chord view's keys in Listen: the chord sounding as its diagram draws it (ADR 0108); a pattern
  // lesson's, each note as it sounds, whatever the view (ADR 0111).
  const chordKeys = useChordKeys(
    performance,
    practice.state,
    shown !== 'sheet' && view.keys !== true,
  )
  // Where the music stands: the notes awaited, or where Listen stopped.
  const cursorTick = performance.beatGroups[practice.state.beatGroup]?.tick ?? 0
  const keys = !player.keys ? (
    // Hidden, a thin strip where they stood brings them back at a tap (R34, Songscription's).
    <PlayerArea area="keys" className="-mx-gutter">
      <KeyboardStrip
        edge={dock === 'top' ? 'below' : 'above'}
        onShow={() => player.setKeys(true)}
      />
    </PlayerArea>
  ) : scoreView.hands ? (
    // The hands at the keys in the keys' place (R36, flowkey's), edge to edge: watched, never tapped.
    <PlayerArea area="keys" className="-mx-gutter">
      <KeysPlace divider={dock === 'top' ? 'below' : 'above'}>
        {(height) => (
          <PianoHands
            height={height}
            notes={performance.notes}
            perSecond={(player.shownTempo * TICKS_PER_BEAT) / 60}
            now={() => practice.clock?.() ?? cursorTick}
            playing={practice.clock !== null}
            held={held}
            marks={player.marks}
            wrong={player.wrong}
            faded={player.practised === 'both' ? null : player.practised === 'rh' ? 'lh' : 'rh'}
            range={{ low: player.range.from, high: player.range.to }}
            onShowKeys={() => setScoreView(settingsStore, { hands: false })}
          />
        )}
      </KeysPlace>
    </PlayerArea>
  ) : (
    // Edge to edge (R34, Songscription's): the keys reach both sides of the screen.
    <PlayerArea area="keys" className="-mx-gutter">
      <LiveKeyboard
        range={player.range}
        inView={chordKeys ? chordKeys.inView : player.inView}
        // Wait mode's chord across both hands is all in sight, the keys narrowing to hold it.
        fitInView
        marks={chordKeys?.marks ?? player.marks}
        wrong={player.wrong}
        // Keys the pedal alone holds, ringed apart from a hand's (A27): the score's pedal and the keys
        // it holds while the music sounds; stopped, nothing hangs (R31-P).
        outlined={chordKeys || !playing ? undefined : player.pedalKeys}
        onKeyPress={player.tapKey}
        // Space is Play here: the pedal is the bar's Sustain, or a MIDI keyboard's.
        spacePedal={false}
        divider={dock === 'top' ? 'below' : 'above'}
      />
    </PlayerArea>
  )
  return (
    // While Diagrams plays, the bar and the tools row step aside (ADR 0108).
    <PlayerScreen
      keys={dock}
      aside={shown === 'diagrams' && practice.state.playing}
      panel={panel}
      docked
    >
      {/* The score's bar, the editor's in shape (ADR 0115): Close, then Practise · Edit;
          Piano keys, MIDI and Settings; the View and the music's tools. The loop is the transport's (ADR
          0108). */}
      <ScoreBar
        lead={<PlayerClose onClose={onClose} />}
        middle={<PickView shown={shown} needs={needs} />}
        actions={
          <>
            {/* MIDI only while a keyboard is connected or connecting (R31-P, R32); it is
                connected from Settings › Connect a piano. */}
            {isMidiConnected(connection) || connection.kind === 'connecting' ? (
              <MidiButton variant="tool" />
            ) : null}
            <SettingsExtrasContext value={extras}>{setup}</SettingsExtrasContext>
          </>
        }
      />
      {dock === 'top' ? keys : null}
      <PlayerArea area="sheet" className="relative">
        {/* The tip floats over the music's foot, taking no row and covering no control (R32). */}
        {!coached && !practice.state.playing && !annotating ? (
          <CoachLine mode={view.mode} onClose={() => retireTip(settingsStore, tip)} />
        ) : null}
        {/* How far through the music the cursor is: a thin line along the score's head. */}
        <div
          role="progressbar"
          aria-label={t('progress')}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          className="absolute inset-x-0 top-0 z-10 h-0.5 bg-hairline"
        >
          <div className="h-full bg-primary" style={{ width: `${progress * 100}%` }} />
        </div>
        {annotating}
        {shown === 'sheet' ? (
          // The sheet's one pill at its foot (R34, Songscription's): the layout, and in Page view the
          // canvas's zoom beside it.
          <SheetToolsContext value={<SheetLayoutTools />}>
            <SheetMusic
              view={sheetView}
              piano={piano}
              staffNames={names}
              title={title}
              credits={credits}
              layout={layout}
              // The pedal as it plays (A27): its Ped. marks the ones heard, lit as they pass.
              performance={player.performance}
              headings={headings}
              current={practice.state.beatGroup}
              loop={player.loop}
              fingers={player.fingers}
              names={player.names}
              positions={player.positions}
              muted={player.muted}
              onJump={practice.jumpToBeatGroup}
              playing={practice.state.playing}
              onLoopChange={player.setLoop}
              annotations={annotations}
            />
            {scoreView.layout === 'page' ? null : (
              <SheetPill>
                <SheetLayoutTools />
              </SheetPill>
            )}
          </SheetToolsContext>
        ) : (
          <ChordView
            view={shown}
            title={title}
            performance={performance}
            headings={headings}
            practice={practice}
            loop={player.loop}
            onLoopChange={player.setLoop}
            words={scoreView.lyrics}
            mode={scoreView.diagrams}
            pinned={scoreView.pinned}
            textSize={scoreView.textSize}
          />
        )}
      </PlayerArea>
      {/* Wait mode's line and what the screen says: room only while there is something to say,
          so nothing reserves a band between the music and the keys (R32). Before Play, Wait mode's
          line is kept for a screen reader, taking no room until it speaks. */}
      {view.mode !== 'listen' || status ? (
        <PlayerArea
          area="status"
          className={cn(
            'text-center landscape-phone:max-w-[45vw] landscape-phone:self-center',
            (player.feedback !== null || Boolean(status)) && 'py-1 landscape-phone:py-0',
          )}
        >
          {view.mode !== 'listen' ? (
            <WaitLine feedback={player.feedback} onAgain={practice.play} onLoop={player.setLoop} />
          ) : null}
          {status}
        </PlayerArea>
      ) : null}
      {dock === 'top' ? null : keys}
      {/* The transport in its own row at the foot (R31-P): never floating over the music. Under
          360px its gutter is 12px, so Pace's three-digit tempo fits beside the other six. */}
      <PlayerArea
        area="transport"
        className="-mx-gutter border-t border-hairline px-gutter narrow-phone:px-3 xl:border-t-0"
      >
        <div className="mx-auto w-full max-w-xl lg:w-fit">
          <PlayerDock
            practice={practice}
            loop={<LoopButton looped={player.loop !== null} onToggle={player.toggleLoop} />}
            pace={
              <PracticeSheet
                mode={view.mode}
                tempo={player.tempo}
                ownTempo={player.ownTempo}
                piano={playable}
                handsAtKeys={player.keys && scoreView.hands}
                click={player.click}
                onWait={() => player.setMode('wait')}
                onPlay={player.listenAt}
                onTempo={player.setTempo}
                onClick={player.setClick}
              />
            }
            hands={
              twoHands ? <HandsButton hands={view.hands} onOpen={() => setHandsOpen(true)} /> : null
            }
            keyboard={
              <KeyboardButton
                keys={player.keys}
                hands={scoreView.hands}
                onKeys={player.setKeys}
                onHands={(hands: boolean) => setScoreView(settingsStore, { hands })}
              />
            }
          />
        </div>
      </PlayerArea>
      <HandsSheet
        open={handsOpen}
        onOpenChange={setHandsOpen}
        hands={view.hands}
        onHands={player.setHands}
      />
      <CountInBeat count={practice.counting} />
      <PlayerExport
        open={exporting}
        onOpenChange={setExporting}
        music={{ performance, title, tempo: player.tempo }}
        recording={recording}
        staves={names}
        musicXml={musicXml}
      />
      {printing ? (
        <SongPrint
          view={shown}
          title={title}
          performance={performance}
          headings={headings}
          sheet={{
            view: sheetView,
            piano,
            staffNames: names,
            fingers: player.fingers,
            names: player.names,
            positions: player.positions,
          }}
          onDone={() => setPrinting(false)}
        />
      ) : null}
    </PlayerScreen>
  )
}
