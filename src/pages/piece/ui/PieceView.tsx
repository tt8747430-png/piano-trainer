import { Link } from '@tanstack/react-router'
import { PencilLine, Play, Printer, RotateCcw, Share2, Target, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
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
import { ShareSaid, useShareSong } from '@/features/share-song'
import { OPEN_PLAINLY } from '@/shared/lib'
import { audibleHands, barSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { useLocale } from '@/shared/i18n'
import { FabLink, FloatingActions, NO_KEYS, SpeedDial, SpeedDialAction } from '@/shared/ui'
import { ChordChart } from '@/widgets/chord-chart'
import { PieceChords } from '@/widgets/piece-chords'
import { PieceAbout } from './PieceAbout'
import { PieceFacts } from './PieceFacts'
import { OwnMusicAsk } from './OwnMusicAsk'
import { PieceHeader } from './PieceHeader'

/**
 * A piece with a chart, in one column: Learned in its bar, its facts, the chords it plays and its
 * chart, each to tap and hear on its keys, docked as the keyboard settings say; then what is printed
 * about it. Practise floats in the thumb's reach, the rest folded beside it in More actions: Edit,
 * Check these chords, Print, and for the learner's own music Share and its way back, asked first.
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
  const shared = useShareSong()
  const [asking, setAsking] = useState(false)
  const step = pieceStepId(piece.id)
  const toggleBar = (bar: number) =>
    playback.toggle(bar, () =>
      barSounds(performance, bar, { tempo: piece.tempo, hands: audibleHands('both') }),
    )
  const ownMusic = own
    ? ({ kind: 'song', id: own, title } as const)
    : hasVersion
      ? ({ kind: 'version', id: piece.id, title } as const)
      : null

  return (
    <div className="flex flex-col gap-6 pb-4">
      <PieceHeader entry={piece} actions={own ? null : <LearnedButton step={step} round />} />
      <PieceFacts entry={piece} />
      <ShareSaid said={shared.said} />
      <PinnedKeyboard shown={NO_KEYS} range={playerRange(performance)} className="print:hidden" />
      <div className="print:hidden">
        <PieceChords performance={performance} />
      </div>
      <section className="flex flex-col gap-3">
        <h2 className="text-2xl">{t('chart')}</h2>
        <ChordChart
          performance={performance}
          headings={headings}
          onBar={toggleBar}
          playing={playback.playing}
        />
      </section>
      <PieceAbout entry={piece} />
      {ownMusic ? <OwnMusicAsk piece={ownMusic} open={asking} onOpenChange={setAsking} /> : null}
      <FloatingActions>
        <SpeedDial>
          {ownMusic ? (
            <SpeedDialAction
              label={t(ownMusic.kind === 'song' ? 'delete' : 'reset')}
              icon={ownMusic.kind === 'song' ? Trash2 : RotateCcw}
              onClick={() => setAsking(true)}
            />
          ) : null}
          {own && !isDegreePiece(piece) ? (
            <SpeedDialAction
              label={t('share')}
              icon={Share2}
              onClick={() => shared.share({ title, music: musicOf(piece) })}
            />
          ) : null}
          {/* An installed app has no browser menu to print from. */}
          <SpeedDialAction label={t('print')} icon={Printer} onClick={() => window.print()} />
          <SpeedDialAction
            label={t('checkChords')}
            icon={Target}
            render={<Link to="/check" search={{ of: step }} />}
          />
          {isDegreePiece(piece) ? null : (
            <SpeedDialAction
              label={t('edit')}
              icon={PencilLine}
              render={<Link to="/edit/$pieceId" params={{ pieceId: piece.id }} />}
            />
          )}
        </SpeedDial>
        <FabLink
          label={t('practise')}
          icon={Play}
          render={<Link to="/play/$pieceId" params={{ pieceId: piece.id }} state={OPEN_PLAINLY} />}
        />
      </FloatingActions>
    </div>
  )
}
