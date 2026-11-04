import { useNavigate } from '@tanstack/react-router'
import {
  Download,
  MonitorCog,
  Piano,
  Printer,
  SlidersHorizontal,
  Timer,
  Volume2,
} from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useStaffNames, type PieceLayout, type ScoreHeader, type StaffName } from '@/entities/piece'
import { selectKeyboard, selectScoreView, useSettings } from '@/entities/settings'
import { MidiButton } from '@/features/connect-midi'
import { LiveKeyboard } from '@/features/live-keyboard'
import type { Performance } from '@/shared/lib/arrangement'
import type { Recording } from '@/shared/lib/schedule'
import type { MenuAction } from '@/shared/ui'
import { ChordView, shownView, viewNeeds } from '@/widgets/chord-views'
import {
  ClickButton,
  CountInBeat,
  HandsButton,
  LoopButton,
  PedalLamp,
  PlayerArea,
  PlayerScreen,
  BarTitle,
  KeysToggle,
  PlayerClose,
  PlayerDock,
  PlayerTools,
  ScoreBar,
  TempoButton,
  usePlayerShortcuts,
  WaitLine,
  type PracticePlayer,
  type PracticeView,
} from '@/widgets/practice-player'
import { SheetMusic } from '@/widgets/sheet-music'
import { SongPrint } from '@/widgets/song-print'
import { PlayerPlayback, PlayerVolumes, type VolumeTrack } from '@/widgets/player-settings'
import { ViewSection } from '@/widgets/score-view-menu'
import { SettingsExtrasContext, type SettingsExtras } from '@/widgets/player-setup'
import { useChordKeys } from '../model/use-chord-keys'
import { PlayerExport } from './PlayerExport'
import type { ExportShare, MusicXmlFormat } from '@/features/song-files'
import { PickView } from './PickView'

/** A walk or a progression: one section, named nowhere. */
const NO_HEADINGS: readonly string[] = []
/** A walk or a progression: the piano's staves alone. */
const NO_STAVES: readonly { readonly name?: StaffName }[] = []
/** A walk or a progression: no acts of its own. */
const NO_ACTS: readonly MenuAction[] = []

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
}: {
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
  /** Export…'s link: a piece's, as its page shares it. */
  share?: ExportShare | undefined
  /** What the screen says beside Wait mode's line: what a piece's Share said. */
  status?: ReactNode
  /** Display's own choices after the View's: a single-staff song's Clef (R29 B7). */
  display?: ReactNode
  /** The View open as the screen opens: a piece's, where the learner asks each time (ADR 0108). */
  openView?: boolean
}) {
  const { t } = useTranslation(['player', 'songs'])
  const navigate = useNavigate()
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
  // Print (ADR 0107): the music printed as the View shows it, while its render stands.
  const [printing, setPrinting] = useState(false)
  const [exporting, setExporting] = useState(false)
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
      {
        id: 'display',
        label: t('settingsPage.display'),
        icon: MonitorCog,
        content: (
          <>
            <ViewSection view={shown} words={needs.lyrics !== 'words'} />
            {display}
          </>
        ),
      },
    ],
    acts: [
      {
        key: 'metronome',
        group: 'play',
        label: t('settingsPage.metronome'),
        icon: Timer,
        onSelect: () => void navigate({ to: '/practice/metronome' }),
      },
      // Its one home is Settings' (rule 18): a way there, never a second control.
      {
        key: 'on-screen-piano',
        group: 'play',
        label: t('settingsPage.onScreenPiano'),
        icon: Piano,
        onSelect: () => void navigate({ to: '/settings/on-screen-piano' }),
      },
      ...more.flatMap(({ icon, ...act }) =>
        icon ? [{ ...act, icon, group: 'song' as const }] : [],
      ),
      {
        key: 'export',
        group: 'share',
        label: t('songs:export.action'),
        icon: Download,
        onSelect: () => setExporting(true),
      },
      {
        key: 'print',
        group: 'share',
        label: t('print'),
        icon: Printer,
        onSelect: () => setPrinting(true),
      },
    ],
  }
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
        outlined={chordKeys ? undefined : player.pedalKeys}
        railEnd={player.pedal === 'none' ? undefined : <PedalLamp down={player.pedal === 'down'} />}
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
        tools={
          <PlayerTools>
            <PickView shown={shown} needs={needs} openAtStart={openView} />
            {tools}
          </PlayerTools>
        }
      />
      {dock === 'top' ? keys : null}
      <PlayerArea area="sheet">
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
        {view.mode === 'wait' ? (
          <WaitLine feedback={player.feedback} onAgain={practice.play} onLoop={player.setLoop} />
        ) : null}
        {status}
      </PlayerArea>
      {/* On a phone held upright the transport may stand into the gutters: it floats over the
          sheet, and its seven controls (the tempo's value the longest) need the screen's width. */}
      <PlayerArea
        area="dock"
        className="flex justify-center max-sm:-mx-gutter landscape-phone:items-center"
      >
        <PlayerDock
          practice={practice}
          tempo={
            <TempoButton
              mode={view.mode}
              tempo={player.tempo}
              shownTempo={player.shownTempo}
              ownTempo={player.ownTempo}
              speedTraining={view.speedTraining}
              onWait={() => player.setMode('wait')}
              onTempo={player.listenAt}
              onSpeedTraining={player.setSpeedTraining}
            />
          }
          loop={<LoopButton looped={player.loop !== null} onToggle={player.toggleLoop} />}
          sound={<ClickButton on={player.click} onChange={player.setClick} />}
          hands={twoHands ? <HandsButton hands={view.hands} onChange={player.setHands} /> : null}
        />
      </PlayerArea>
      {dock === 'top' ? null : keys}
      <CountInBeat count={practice.counting} />
      <PlayerExport
        open={exporting}
        onOpenChange={setExporting}
        music={{ performance, title, tempo: player.tempo }}
        recording={recording}
        staves={names}
        musicXml={musicXml}
        share={share}
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
