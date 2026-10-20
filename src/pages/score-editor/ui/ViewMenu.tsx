import { Eye, Settings } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MidiButton } from '@/features/connect-midi'
import { SHEET_VIEWS } from '@/shared/lib'
import { Labelled, Segmented, SwitchRow } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/**
 * What the score shows and how (ADR 0064), from the bar: its staves (the tune's, added over the grand
 * staff or taken away with its notes; the chord names' row) and its layout, down the screen, on A4
 * pages or as one line. On a phone, where the bar has no room for it, the song's settings too.
 */
export function ViewMenu() {
  const { t } = useTranslation('editor')
  const { actions, view, takes } = useScoreEditorContext()
  const melodyStaff = useEditorState((state) => state.draft.melodyStaff)
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="surface"
            size="icon"
            className="lg:w-auto lg:gap-2 lg:px-4"
            aria-label={t('viewMenu.open')}
            title={t('viewMenu.open')}
            disabled={takes.stage !== 'idle'}
          />
        }
      >
        <Eye aria-hidden />
        <span className="max-lg:sr-only">{t('viewMenu.label')}</span>
      </PopoverTrigger>
      <PopoverContent aria-label={t('viewMenu.label')} align="end" className="w-80 gap-4 p-4">
        <section aria-label={t('viewMenu.staves')} className="flex flex-col">
          <h2 className="text-sm font-semibold text-muted-foreground">{t('viewMenu.staves')}</h2>
          <SwitchRow
            label={t('viewMenu.melody')}
            detail={t('viewMenu.melodyDetail')}
            checked={melodyStaff}
            onCheckedChange={(on) => actions.dispatch({ type: 'melodyStaff', on })}
          />
          <SwitchRow
            label={t('chordNames')}
            checked={view.chordNames}
            onCheckedChange={view.showChordNames}
            className="border-b-0"
          />
        </section>
        <Labelled label={t('layout.label')}>
          <Segmented
            label={t('layout.label')}
            value={view.layout}
            options={SHEET_VIEWS.map((each) => ({ value: each, label: t(`layout.${each}`) }))}
            onChange={view.setLayout}
          />
        </Labelled>
        <div className="flex items-center justify-between gap-2 sm:hidden">
          <span className="text-sm font-semibold text-muted-foreground">{t('viewMenu.midi')}</span>
          <MidiButton />
        </div>
        <Button
          variant="outline"
          className="lg:hidden"
          onClick={() => {
            setOpen(false)
            view.openSettings(true)
          }}
        >
          <Settings data-icon="inline-start" aria-hidden />
          {t('settings')}
        </Button>
      </PopoverContent>
    </Popover>
  )
}
