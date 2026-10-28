import { Link } from '@tanstack/react-router'
import { useKeyName } from '@/shared/i18n'
import { IN_PLACE } from '@/shared/lib'
import { keyScale, noteParam, type Key } from '@/shared/lib/music'
import { ButtonLink } from '@/shared/ui'

/** A key named as a link that shows it in place, its key's own scale, keeping the view's other choices. */
export function KeyLink({ value }: { value: Key }) {
  const keyName = useKeyName()
  return (
    <ButtonLink
      variant="link"
      className="px-0"
      render={
        <Link
          from="/practice/scales"
          to="/practice/scales"
          search={(prev) => ({ ...prev, root: noteParam(value.tonic), kind: keyScale(value) })}
          {...IN_PLACE}
        />
      }
    >
      {keyName(value)}
    </ButtonLink>
  )
}
