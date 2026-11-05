import { useLocale } from '@/shared/i18n'
import {
  Download,
  Link2,
  Ellipsis,
  Gauge,
  ListMusic,
  MessageSquareText,
  Mic,
  MonitorCog,
  Piano,
  Printer,
  SlidersHorizontal,
  Volume2,
} from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useStaffNames, type PieceLayout, type ScoreHeader, type StaffName } from '@/entities/piece'
import {
  selectKeyboard,
  selectScoreView,
  selectTipSeen,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { retireTip } from '@/features/set-preference'
import { isMidiConnected, MidiButton, useMidiConnection } from '@/features/connect-midi'
import { KeyboardSettingsFields, LiveKeyboard } from '@/features/live-keyboard'
import type { Performance } from '@/shared/lib/arrangement'
import type { Recording } from '@/shared/lib/schedule'
import { ActionMenu, type MenuAction } from '@/shared/ui'
import { ChordView, shownView, viewNeeds } from '@/widgets/chord-views'
import {
  ClickButton,
  CountInBeat,
  FootTool,
  LoopButton,
  MODE_LOOK,
  ModesSheet,
  PlayerFoot,
  PlayerArea,
  PlayerScreen,
  BarTitle,
  KeysToggle,
  PlayerClose,
  PlayerDock,
  ScoreBar,
  TempoButton,
  usePlayerShortcuts,
  hasVoiceCommands,
  useVoiceCommands,
  WaitLine,
  type PracticePlayer,
  type PracticeView,
} from '@/widgets/practice-player'
import { SheetMusic } from '@/widgets/sheet-music'
import { SongPrint } from '@/widgets/song-print'
import {
  PlayerDisplay,
  PlayerPlayback,
  PlayerVolumes,
  type VolumeTrack,
} from '@/widgets/player-settings'
import { ViewSection } from '@/widgets/score-view-menu'
import { SettingsExtrasContext, type SettingsExtras } from '@/widgets/player-setup'
import { useChordKeys } from '../model/use-chord-keys'
import { PlayerExport } from './PlayerExport'
import type { MusicXmlFormat } from '@/features/song-files'
import { PickView } from './PickView'
import { CoachLine } from './CoachLine'
import { FeedbackCard } from './FeedbackCard'
import { RecordingsSheet } from './RecordingsSheet'
import type { PlayerTakes } from '../model/use-player-takes'
import { TunerSheet } from '@/widgets/tuner'
import { notePlace, type ScoreAnnotation } from '@/shared/lib/notation'

/** A walk or a progression: one section, named nowhere. */
const NO_HEADINGS: readonly string[] = []
/** A walk or a progression: the piano's staves alone. */
const NO_STAVES: readonly { readonly name?: StaffName }[] = []
/** A walk or a progression: no acts of its own. */
const NO_ACTS: readonly MenuAction[] = []
/** A walk or a progression: no tools of its own. */
const NO_ACTS_MORE: readonly MoreAct[] = []

/** A row of the Tools sheet a screen adds, and the group it joins. */
/** One of the music's acts in the foot's More (R31-P), in its part: practice, tools or listening. */
export type MoreAct = MenuAction & { readonly part: 'practice' | 'tools' | 'listening' }

/**
 * The Player's screen over any Performance (Flowkey's shape, ADR 0061): its bar (`ScoreBar`, ADR
 * 0115, R29: Close, the title and Edit; Piano keys, MIDI and the one gear, the Player's Settings with the
 * music's acts, Flat's one menu; its tools, ADR 0108: the View,
 * named by the view shown, then the music's own tools, a piece's Transpose and Simplify, ADR 0105);
 * the music under its title (ADR 0114) as the View
 * shows it (ADR 0108: the sheet music, Chords over lyrics, Diagrams or the Grid), Wait mode's line,
 * the transport floating under it (the tempo, ‹ ▶ ›, the loop, the metronome and the hands), the
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
  tools,
  modes,
  piano = true,
  staves = NO_STAVES,
  recording,
  more = NO_ACTS,
  musicXml,
  share,
  status,
  openView = false,
  display,
  tracks,
  moreActs = NO_ACTS_MORE,
  takes,
  annotations,
  annotating,
}: {
  /** The learner's typed marks, written on the score (R29 B8); none for a walk. */
  annotations?: readonly ScoreAnnotation[] | undefined
  /** The Annotate bar over the score while it is on (R29 B8). */
  annotating?: ReactNode
  /** The music's own acts in the foot's More (R31-P): a piece's Annotate, the Rhythm game. */
  moreActs?: readonly MoreAct[]
  /** A song's takes (R29 B8): the Recorder, My recordings and Feedback; none for a walk. */
  takes?: PlayerTakes | undefined
  /** The volumes the Settings' Audio playback lists: a piece's tracks; none for a walk. */
  tracks?: readonly VolumeTrack[] | undefined
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
  /** The tools row's after the View: a piece's Transpose and Simplify (ADR 0105); none for a walk. */
  tools?: ReactNode
  /** Edit (ADR 0115, round 26), at the bar's end: a piece's own, none for a walk. */
  modes?: ReactNode
  /** The music's own acts in Settings, before Print: a piece's Song information and Sections (ADR 0107). */
  more?: readonly MenuAction[] | undefined
  /** Export…'s MusicXML: a piece's music as written (ADR 0107). */
  musicXml?: ((format?: MusicXmlFormat) => void) | undefined
  /** Share link: a piece's, as its page shares it; its own act, never Export's row (R31-S). */
  share?: { readonly onSelect: () => void } | undefined
  /** What the screen says beside Wait mode's line: what a piece's Share said. */
  status?: ReactNode
  /** Display's own choices after the View's: a single-staff song's Clef (R29 B7). */
  display?: ReactNode
  /** The View open as the screen opens: a piece's, where the learner asks each time (ADR 0108). */
  openView?: boolean
}) {
  const { t } = useTranslation(['player', 'songs', 'settings'])
  const { practice } = player
  const dock = useSettings((state) => selectKeyboard(state).dock)
  const scoreView = useSettings(selectScoreView)
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
  // The Modes sheet (R29 B8), from the foot bar's Modes.
  const [modesOpen, setModesOpen] = useState(false)
  const { connection } = useMidiConnection()
  const playable = isMidiConnected(connection) || player.keys
  // Print (ADR 0107): the music printed as the View shows it, while its render stands.
  const [printing, setPrinting] = useState(false)
  const [exporting, setExporting] = useState(false)
  // Settings opened at a page (the piano's ⚙, the View's Display settings…).
  const [settingsAt, setSettingsAt] = useState<{ readonly page: string } | null>(null)
  const [tunerOpen, setTunerOpen] = useState(false)
  // The coach's line (R29 B8, R31-P): shown until put away by its × or done (Play pressed in
  // Listen), remembered for good.
  const settingsStore = useSettingsStoreApi()
  const tip = `coach.${view.mode}`
  const coached = useSettings(selectTipSeen(tip))
  const playing = practice.state.playing
  useEffect(() => {
    if (playing && view.mode === 'listen') retireTip(settingsStore, tip)
  }, [playing, view.mode, settingsStore, tip])
  // Voice commands (R29 B8), on for the visit where the browser hears speech.
  const [voice, setVoice] = useState(false)
  const locale = useLocale()
  useVoiceCommands(voice, locale, (command) => {
    const step = (share: number) =>
      player.setTempo(
        Math.round(
          Math.min(player.ownTempo * 2, Math.max(player.ownTempo / 2, player.tempo * share)),
        ),
      )
    if (command === 'play') practice.play()
    else if (command === 'stop') practice.stop()
    else if (command === 'again') {
      practice.restart()
      practice.play()
    } else if (command === 'slower') step(0.9)
    else if (command === 'faster') step(1.1)
    else if (command === 'next') practice.next()
    else practice.prev()
  })
  const groups = performance.beatGroups.length
  const progress = groups > 1 ? practice.state.beatGroup / (groups - 1) : 0
  const [recordingsOpen, setRecordingsOpen] = useState(false)
  // A take's feedback on the score (R29 B8): the take shown, its verdicts by where each note plays.
  const feedback = takes?.feedback ?? null
  const verdicts = useMemo(
    () =>
      feedback
        ? new Map(feedback.notes.map((note) => [notePlace(note.tick, note.midi), note.verdict]))
        : undefined,
    [feedback],
  )
  // The Player's one Settings (R29, Flat's one menu): how the Player works, then the acts on this
  // music: its own (a piece's Sections and Song information), Export… and Print.
  const extras: SettingsExtras = {
    pages: [
      ...(tracks
        ? [
            {
              id: 'audio',
              label: t('settingsPage.audio'),
              icon: Volume2,
              content: <PlayerVolumes tracks={tracks} />,
            },
          ]
        : []),
      {
        id: 'playback',
        label: t('settingsPage.playback'),
        icon: SlidersHorizontal,
        content: <PlayerPlayback />,
      },
      // The piano's own page, here in the sheet (R31-P): the app's On-screen piano page, the
      // same fields, never a second set; opened from the piano's ⚙ too.
      {
        id: 'piano',
        label: t('settingsPage.onScreenPiano'),
        icon: Piano,
        content: <KeyboardSettingsFields />,
      },
      {
        id: 'display',
        label: t('settingsPage.display'),
        icon: MonitorCog,
        content: (
          <>
            <ViewSection view={shown} words={needs.lyrics !== 'words'} />
            {display}
            <PlayerDisplay />
          </>
        ),
      },
    ],
    // Its acts are More's (R31-P): the sheet holds how the Player works, never what it does.
    acts: [],
    request: settingsAt,
  }
  // The foot's More (R31-P): the music's acts only, in parts: the song's, practice's, the tools,
  // listening, sharing. Every setting is the gear's.
  const moreMenu: MenuAction[] = (
    [
      ...more.map((act) => ({ ...act, group: 'song' })),
      ...(takes
        ? [
            {
              key: 'recordings',
              group: 'practice',
              label: t('recordings.title'),
              icon: ListMusic,
              onSelect: () => setRecordingsOpen(true),
            },
            {
              key: 'feedback',
              group: 'practice',
              label: t('feedback.howDidIPlay'),
              icon: MessageSquareText,
              disabled: takes.list.length === 0,
              ...(takes.list.length === 0 ? { reason: t('feedback.none') } : {}),
              onSelect: () => takes.show(takes.list[0]?.id ?? null),
            },
          ]
        : []),
      ...moreActs
        .filter((act) => act.part === 'practice')
        .map((act) => ({ ...act, group: 'practice' })),
      {
        key: 'print',
        group: 'tools',
        label: t('print'),
        icon: Printer,
        onSelect: () => setPrinting(true),
      },
      {
        key: 'tuner',
        group: 'tools',
        label: t('tuner.title'),
        icon: Gauge,
        onSelect: () => setTunerOpen(true),
      },
      ...moreActs.filter((act) => act.part === 'tools').map((act) => ({ ...act, group: 'tools' })),
      {
        key: 'voice',
        group: 'listening',
        label: t('voice.label'),
        icon: Mic,
        checked: voice,
        disabled: !hasVoiceCommands(),
        ...(hasVoiceCommands() ? {} : { reason: t('voice.unavailable') }),
        onSelect: () => setVoice(!voice),
      },
      ...moreActs
        .filter((act) => act.part === 'listening')
        .map((act) => ({ ...act, group: 'listening' })),
      ...(share
        ? [
            {
              key: 'share-link',
              group: 'share',
              label: t('songs:library.shareLink'),
              icon: Link2,
              onSelect: share.onSelect,
            },
          ]
        : []),
      {
        key: 'export',
        group: 'share',
        label: t('songs:export.action'),
        icon: Download,
        onSelect: () => setExporting(true),
      },
    ] satisfies MenuAction[]
  ).map((act): MenuAction => ({ ...act, unnamed: true }))
  // A chord view's keys in Listen: the chord sounding as its diagram draws it (ADR 0108); a pattern
  // lesson's, each note as it sounds, whatever the view (ADR 0111).
  const chordKeys = useChordKeys(
    performance,
    practice.state,
    shown !== 'sheet' && view.keys !== true,
  )
  const keys = !player.keys ? null : (
    <PlayerArea area="keys">
      <LiveKeyboard
        range={player.range}
        inView={chordKeys ? chordKeys.inView : player.inView}
        // Wait mode's chord across both hands is all in sight, the keys narrowing to hold it.
        fitInView
        marks={chordKeys?.marks ?? player.marks}
        wrong={player.wrong}
        // Keys the pedal alone holds, ringed apart from a hand's (A27); the lamp at the rail's end.
        // The score's pedal and the keys it holds while the music sounds; stopped, nothing hangs (R31-P).
        outlined={chordKeys || !playing ? undefined : player.pedalKeys}
        // Its ⚙ opens the piano's page in this sheet, never the app's (R31-P).
        onSettings={() => setSettingsAt({ page: 'piano' })}
        // The drawn pedal goes down with the score's while the music plays; stopped, it is up.
        sustained={playing && player.pedalDown}
        onKeyPress={player.tapKey}
        // Space is Play here: the pedal is the rail's, or a MIDI keyboard's.
        spacePedal={false}
      />
    </PlayerArea>
  )
  return (
    // While Diagrams plays, the bar and the tools row step aside (ADR 0108).
    <PlayerScreen keys={dock} aside={shown === 'diagrams' && practice.state.playing}>
      {/* The score's bar, the editor's in shape (ADR 0115): Close, then Practise · Edit;
          Piano keys, MIDI and Settings; the View and the music's tools. The loop is the transport's (ADR
          0108). */}
      <ScoreBar
        lead={
          <>
            <PlayerClose onClose={onClose} />
            <BarTitle title={title} />
            {modes}
          </>
        }
        actions={
          <>
            <KeysToggle shown={player.keys} onShow={player.setKeys} />
            <MidiButton variant="tool" />
            <SettingsExtrasContext value={extras}>{setup}</SettingsExtrasContext>
          </>
        }
      />
      {dock === 'top' ? keys : null}
      <PlayerArea area="sheet" className="relative">
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
        {feedback && takes?.shown ? (
          <FeedbackCard feedback={feedback} onClose={() => takes.show(null)} />
        ) : null}
        {shown === 'sheet' ? (
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
            clock={player.cursor === 'continuous' ? practice.clock : null}
            cursor={player.cursor !== 'none'}
            loop={player.loop}
            fingers={player.fingers}
            names={player.names}
            positions={player.positions}
            muted={player.muted}
            onJump={practice.jumpToBeatGroup}
            playing={practice.state.playing}
            onLoopChange={player.setLoop}
            verdicts={verdicts}
            annotations={annotations}
          />
        ) : (
          <ChordView
            view={shown}
            title={title}
            performance={performance}
            headings={headings}
            practice={practice}
            loop={player.loop}
            words={scoreView.lyrics}
            mode={scoreView.diagrams}
            pinned={scoreView.pinned}
            textSize={scoreView.textSize}
          />
        )}
      </PlayerArea>
      <PlayerArea
        area="status"
        className="text-center landscape-phone:max-w-[45vw] landscape-phone:self-center"
      >
        {!coached && !practice.state.playing && !annotating && !takes?.shown ? (
          <CoachLine mode={view.mode} onClose={() => retireTip(settingsStore, tip)} />
        ) : null}
        {view.mode !== 'listen' ? (
          <WaitLine feedback={player.feedback} onAgain={practice.play} onLoop={player.setLoop} />
        ) : null}
        {status}
      </PlayerArea>
      {dock === 'top' ? null : keys}
      {/* The transport in its own row at the foot (R31-P): never floating over the music. */}
      <PlayerArea area="transport" className="-mx-gutter border-t border-hairline px-gutter">
        <div className="mx-auto w-full max-w-xl">
          <PlayerDock
            practice={practice}
            loop={<LoopButton looped={player.loop !== null} onToggle={player.toggleLoop} />}
            tempo={
              <TempoButton
                mode={view.mode}
                tempo={player.tempo}
                shownTempo={player.shownTempo}
                ownTempo={player.ownTempo}
                speedTraining={view.speedTraining}
                onTempo={player.setTempo}
                onSpeedTraining={player.setSpeedTraining}
              />
            }
            sound={<ClickButton on={player.click} onChange={player.setClick} />}
          />
        </div>
      </PlayerArea>
      {/* The song's tools (R31-P): View, the music's own (Key, Version), Mode, then More. */}
      <PlayerFoot>
        <PickView shown={shown} needs={needs} openAtStart={openView} />
        {tools}
        <FootTool
          icon={MODE_LOOK[view.mode].icon}
          label={t(`modes.${view.mode}.name`)}
          aria-haspopup="dialog"
          onClick={() => setModesOpen(true)}
        />
        <ActionMenu
          label={t('settings:bars.more')}
          align="end"
          trigger={null}
          render={<FootTool icon={Ellipsis} label={t('settings:bars.more')} />}
          actions={moreMenu}
        />
      </PlayerFoot>
      <ModesSheet
        open={modesOpen}
        onOpenChange={setModesOpen}
        mode={view.mode}
        hands={view.hands}
        twoHands={twoHands}
        piano={playable}
        onMode={player.setMode}
        onHands={player.setHands}
      />
      <CountInBeat count={practice.counting} />
      <TunerSheet open={tunerOpen} onOpenChange={setTunerOpen} />
      {takes ? (
        <RecordingsSheet
          takes={takes}
          piano={isMidiConnected(connection)}
          open={recordingsOpen}
          onOpenChange={setRecordingsOpen}
        />
      ) : null}
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
