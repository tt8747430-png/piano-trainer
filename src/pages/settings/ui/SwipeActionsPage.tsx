import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { barOf, useSettings, useSettingsStoreApi, type BarSurface } from '@/entities/settings'
import { setBar } from '@/features/set-preference'
import { Segmented, SettingsGroup } from '@/shared/ui'
import { BarEditor } from '@/widgets/bar-editor'
import { SettingsScreen } from '@/widgets/settings-screen'

/** The rows a swipe acts on, each with its two sides. */
const KINDS = {
  songs: { right: 'swipe.songs.leading', left: 'swipe.songs.trailing' },
  folders: { right: 'swipe.folders.leading', left: 'swipe.folders.trailing' },
} as const satisfies Record<string, { right: BarSurface; left: BarSurface }>
type Kind = keyof typeof KINDS

/** One side of a swipe: its heading and its tiles, none to two. */
function Side({
  surface,
  title,
  footnote,
}: {
  surface: BarSurface
  title: string
  footnote?: string
}) {
  const settings = useSettingsStoreApi()
  const bar = useSettings((state) => barOf(state.bars, surface))
  return (
    <SettingsGroup bare title={title} footnote={footnote}>
      <BarEditor
        surface={surface}
        bar={bar}
        label={title}
        onChange={(acts) => setBar(settings, surface, acts)}
      />
    </SettingsGroup>
  )
}

/**
 * Settings › Library › Swipe actions (R29 B10, R32; memory-palaces', iOS Mail's Swipe Options): for
 * songs and for folders, what the leading (right) and trailing (left) swipe offer, up to two each.
 * Archive and Delete still ask first (rule 17), as the footnote says.
 */
export function SwipeActionsPage() {
  const { t } = useTranslation('settings')
  const [kind, setKind] = useState<Kind>('songs')
  return (
    <SettingsScreen title={t('pages.swipeActions')}>
      <Segmented
        label={t('pages.swipeActions')}
        value={kind}
        options={[
          { value: 'songs', label: t('bars.songRows') },
          { value: 'folders', label: t('bars.folderRows') },
        ]}
        onChange={setKind}
      />
      <Side key={`${kind}-right`} surface={KINDS[kind].right} title={t('bars.swipeRight')} />
      <Side
        key={`${kind}-left`}
        surface={KINDS[kind].left}
        title={t('bars.swipeLeft')}
        footnote={t('bars.swipeFootnote')}
      />
    </SettingsScreen>
  )
}
