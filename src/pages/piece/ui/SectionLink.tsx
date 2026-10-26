import { Link } from '@tanstack/react-router'
import type { ComponentProps } from 'react'
import type { Piece } from '@/entities/piece'

/** The way to a section's page (its number from 1) on its piece's shelf: a song's, or a study's. */
export function SectionLink({
  piece,
  section,
  ...props
}: { piece: Pick<Piece, 'id' | 'kind'>; section: number } & Omit<ComponentProps<'a'>, 'href'>) {
  const params = { pieceId: piece.id, section: String(section + 1) }
  return piece.kind === 'study' ? (
    <Link
      to="/practice/accompaniment/studies/$pieceId/sections/$section"
      params={params}
      {...props}
    />
  ) : (
    <Link to="/songs/$pieceId/sections/$section" params={params} {...props} />
  )
}
