import { useTranslation } from 'react-i18next'
import type { DegreeName } from '@/shared/lib/music'

/**
 * A scale's degrees in a row that wraps: each one's note or number, its function's name (tonic …
 * leading note) under it in small soft ink, where the scale has seven notes to name.
 */
export function DegreeList({
  items,
}: {
  items: readonly { readonly top: string; readonly name?: DegreeName | undefined }[]
}) {
  const { t } = useTranslation('music')
  return (
    <ol className="flex flex-wrap gap-x-3 gap-y-1">
      {items.map(({ top, name }, at) => (
        <li key={at} className="flex flex-col">
          <span>{top}</span>
          {name ? (
            <span className="text-xs font-normal text-muted-foreground">
              {t(`degreeName.${name}`)}
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  )
}
