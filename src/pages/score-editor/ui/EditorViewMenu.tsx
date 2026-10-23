import { Eye, Music, Piano } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  selectPaletteFolded,
  selectPaletteSide,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { setPaletteFolded, setPaletteSide } from '@/features/set-preference'
import { useFoldKeys } from '@/features/live-keyboard'
import { MenuSection, Segmented, SheetLayoutField, SwitchRow } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { useScoreEditorContext } from '../model/editor-context'
import { usePaletteBeside } from '../model/use-palette-beside'

/**
 * How the editor shows its work, the Player's View menu (`PlayerViewMenu`) in shape, order and
 * headings (ADR 0085): an eye in the bar opening the layout (down the screen, on pages or across,
 * ADR 0064), whether the keys and the palette are out, and, where the palette stands beside the
 * sheet, the side it stands on (ADR 0071). What the song holds is the Song sheet's; this is only how
 * it is seen, remembered for every song; the layout is the Player's too (ADR 0090).
 */
export function EditorViewMenu() {
  const { t } = useTranslation('editor')
  const { view, takes } = useScoreEditorContext()
  const store = useSettingsStoreApi()
  const keys = useFoldKeys()
  const palette = !useSettings(selectPaletteFolded)
  const side = useSettings(selectPaletteSide)
  const beside = usePaletteBeside()
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="surface"
            size="icon"
            aria-label={t('viewMenu.label')}
            title={t('viewMenu.label')}
            disabled={takes.stage !== 'idle'}
            className="lg:w-auto lg:gap-2 lg:px-4"
          />
        }
      >
        {/* An eye, as the Player's View: never read as the Song's gear beside it. */}
        <Eye aria-hidden />
        <span className="max-lg:sr-only">{t('viewMenu.label')}</span>
      </PopoverTrigger>
      <PopoverContent
        aria-label={t('viewMenu.label')}
        align="end"
        className="max-h-[80dvh] w-80 max-w-[calc(100vw-2rem)] gap-4 overflow-y-auto p-4"
      >
        <SheetLayoutField value={view.layout} onChange={view.setLayout} />
        <MenuSection title={t('viewMenu.show')} className="gap-0">
          <SwitchRow
            icon={<Music />}
            label={t('viewMenu.palette')}
            checked={palette}
            onCheckedChange={(on) => setPaletteFolded(store, !on)}
          />
          <SwitchRow
            icon={<Piano />}
            label={t('viewMenu.keys')}
            checked={!keys.folded}
            onCheckedChange={(on) => keys.fold(!on)}
            className="border-b-0"
          />
        </MenuSection>
        {beside ? (
          <MenuSection title={t('viewMenu.side')}>
            <Segmented
              label={t('viewMenu.side')}
              value={side}
              options={[
                { value: 'left', label: t('viewMenu.left') },
                { value: 'right', label: t('viewMenu.right') },
              ]}
              onChange={(next) => setPaletteSide(store, next)}
            />
          </MenuSection>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}
