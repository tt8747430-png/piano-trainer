import { useTranslation } from 'react-i18next'
import type { DegreeName } from '@/shared/lib/music'

/**
 * A scale's degrees in a row that wraps: each one's number, its function's name (tonic … leading
 * tone) under it in small soft ink, where the scale has seven notes to name (the Key view's table
 * names a key's).
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
            <span className="text-xs font-normal text-muted-foreground">{t(`degree.${name}`)}</span>
          ) : null}
        </li>
      ))}
    </ol>
  )
}
