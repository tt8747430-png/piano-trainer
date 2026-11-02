import { useNavigate } from '@tanstack/react-router'
import { EditToggle } from './EditToggle'

/**
 * A piece's score in Edit or not (ADR 0115, round 26): the Player's pencil opens the editor, the
 * editor's check the Player, each at `bar` (as printed, from 1: the Player's cursor's, the editor's
 * caret's), in place of the other in the history, so Close still goes back where the learner came
 * from. While a take records, the way out waits for Stop (`disabled`). An editor's original is
 * edited from the song's Settings.
 */
export function ScoreEditToggle({
  pieceId,
  editing,
  bar,
  disabled = false,
}: {
  pieceId: string
  editing: boolean
  bar: number
  disabled?: boolean
}) {
  const navigate = useNavigate()
  // The first bar is where either opens: a URL never says so.
  const at = bar > 1 ? { bar } : {}
  return (
    <EditToggle
      editing={editing}
      variant="tool"
      disabled={disabled}
      onEdit={() =>
        void navigate({ to: '/edit/$pieceId', params: { pieceId }, search: at, replace: true })
      }
      onDone={() =>
        void navigate({ to: '/play/$pieceId', params: { pieceId }, search: at, replace: true })
      }
    />
  )
}
