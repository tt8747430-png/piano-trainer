import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { barOf, useSettings, useSettingsStoreApi, type BarSurface } from '@/entities/settings'
import { setBar } from '@/features/set-preference'
import { Segmented } from '@/shared/ui'
import { BarEditor } from '@/widgets/bar-editor'
import { SettingsScreen } from '@/widgets/settings-screen'

/** The rows a swipe acts on, each with its two sides. */
const KINDS = {
  songs: { right: 'swipe.songs.leading', left: 'swipe.songs.trailing' },
  folders: { right: 'swipe.folders.leading', left: 'swipe.folders.trailing' },
} as const satisfies Record<string, { right: BarSurface; left: BarSurface }>
type Kind = keyof typeof KINDS

/** One side of a swipe: its heading and its tiles, none to two. */
function Side({ surface, title }: { surface: BarSurface; title: string }) {
  const settings = useSettingsStoreApi()
  const bar = useSettings((state) => barOf(state.bars, surface))
  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-sans text-base font-semibold">{title}</h2>
      <BarEditor
        surface={surface}
        bar={bar}
        label={title}
        onChange={(acts) => setBar(settings, surface, acts)}
      />
    </section>
  )
}

/**
 * Settings › General › Swipe actions (R29 B10, memory-palaces'): for songs and for folders, what a
 * swipe right and a swipe left offer, up to two each. Archive and Delete still ask first (rule 17).
 */
export function SwipeActionsPage() {
  const { t } = useTranslation('settings')
  const [kind, setKind] = useState<Kind>('songs')
  return (
    <SettingsScreen title={t('bars.swipeActions')}>
      <Segmented
        label={t('bars.swipeActions')}
        value={kind}
        options={[
          { value: 'songs', label: t('bars.songRows') },
          { value: 'folders', label: t('bars.folderRows') },
        ]}
        onChange={setKind}
      />
      <Side key={`${kind}-right`} surface={KINDS[kind].right} title={t('bars.swipeRight')} />
      <Side key={`${kind}-left`} surface={KINDS[kind].left} title={t('bars.swipeLeft')} />
    </SettingsScreen>
  )
}
