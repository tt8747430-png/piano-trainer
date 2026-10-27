import { useTempoText } from './use-tempo-text'

/** A piece's tempo as its facts say it, where a component shows it among others (`useTempoText`). */
export function TempoText({ piece }: { piece: Parameters<typeof useTempoText>[0] }) {
  return useTempoText(piece)
}
