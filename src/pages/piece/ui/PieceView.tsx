import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import { Link } from '@tanstack/react-router'
import { PencilLine, Play, Printer } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { pieceStepId } from '@/entities/step'
import {
  entryTitles,
  isDegreePiece,
  isOwnSongId,
  musicOf,
  selectHasVersion,
  usePieceHeadings,
  usePieces,
  type Piece,
} from '@/entities/piece'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { LearnedButton } from '@/features/mark-learned'
import { arrangePiece, ownChoice, playerRange } from '@/features/practice'
import { ShareSongButton } from '@/features/share-song'
import { audibleHands, barSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { useLocale } from '@/shared/i18n'
import { FabLink, FloatingActions, NO_KEYS, RoundButton, RoundLink } from '@/shared/ui'
import { ChordChart } from '@/widgets/chord-chart'
import { PieceChords } from '@/widgets/piece-chords'
import { PieceAbout } from './PieceAbout'
import { PieceFacts } from './PieceFacts'
import { OwnMusicActions } from './OwnMusicActions'
import { PieceHeader } from './PieceHeader'
import { OPEN_PLAINLY } from '@/shared/lib'

/**
 * A piece with a chart, in one column: Edit and Learned as round buttons in its bar, its facts, the
 * keyboard where the page's keys dock, showing what sounds, over the chords it plays and its chart,
 * each to tap and hear; then what is printed about it and, for the learner's own music, its way back.
 * Practise, to the Player, is the screen's one floating action.
 */
export function PieceView({ piece }: { piece: Piece }) {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  const playback = usePlayback<number>()
  const own = isOwnSongId(piece.id) ? piece.id : null
  const hasVersion = usePieces((state) => selectHasVersion(state, piece.id))
  const title = entryTitles(piece, locale).primary
  const performance = useMemo(
    () => arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS),
    [piece],
  )
  const headings = usePieceHeadings(piece)
  const toggleBar = (bar: number) =>
    playback.toggle(bar, () =>
      barSounds(performance, bar, { tempo: piece.tempo, hands: audibleHands('both') }),
    )

  return (
    <div className="flex flex-col gap-6 pb-4">
      <PieceHeader
        entry={piece}
        actions={
          <div className="flex gap-2 print:hidden">
            {isDegreePiece(piece) ? null : (
              <RoundLink
                label={t('edit')}
                icon={PencilLine}
                render={<Link to="/edit/$pieceId" params={{ pieceId: piece.id }} />}
              />
            )}
            {own ? null : <LearnedButton step={pieceStepId(piece.id)} round />}
          </div>
        }
      />
      <PieceFacts entry={piece} />
      <PinnedKeyboard shown={NO_KEYS} range={playerRange(performance)} />
      <div className="print:hidden">
        <PieceChords piece={piece} performance={performance} />
      </div>
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl">{t('chart')}</h2>
          {/* An installed app has no browser menu to print from. */}
          <RoundButton
            label={t('print')}
            title={t('print')}
            icon={Printer}
            className="print:hidden"
            onClick={() => window.print()}
          />
        </div>
        <ChordChart
          performance={performance}
          headings={headings}
          onBar={toggleBar}
          playing={playback.playing}
        />
      </section>
      <PieceAbout entry={piece} />
      {own ? (
        <div className="flex flex-wrap items-start gap-3 print:hidden">
          {isDegreePiece(piece) ? null : (
            <ShareSongButton song={{ title, music: musicOf(piece) }} />
          )}
          <OwnMusicActions piece={{ kind: 'song', id: own, title }} />
        </div>
      ) : hasVersion ? (
        <div className="flex print:hidden">
          <OwnMusicActions piece={{ kind: 'version', id: piece.id, title }} />
        </div>
      ) : null}
      {/* The screen's one way on: to the keys, in the Player. */}
      <FloatingActions>
        <FabLink
          label={t('practise')}
          icon={Play}
          render={<Link to="/play/$pieceId" params={{ pieceId: piece.id }} state={OPEN_PLAINLY} />}
        />
      </FloatingActions>
    </div>
  )
}
