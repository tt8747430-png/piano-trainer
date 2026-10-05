import { Link } from '@tanstack/react-router'
import type { ComponentProps } from 'react'
import type { Entry } from '../model/types'

/** The way to an entry's page, on its shelf: a song or listing on Songs, a study on Practice. */
export function PieceLink({
  entry,
  ...props
}: { entry: Pick<Entry, 'id' | 'kind'> } & Omit<ComponentProps<'a'>, 'href'>) {
  const params = { pieceId: entry.id }
  switch (entry.kind) {
    case 'study':
      return <Link to="/practice/studies/$pieceId" params={params} {...props} />
    case 'song':
    case 'listing':
      return <Link to="/songs/$pieceId" params={params} {...props} />
  }
}
