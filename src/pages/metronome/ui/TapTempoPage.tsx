import { useNavigate } from '@tanstack/react-router'
import { Hand } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useMetronome, useTapTempo } from '@/features/metronome'
import { InfoTip } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { ToolPage } from '@/widgets/tool-page'
import { TempoWordTip } from './TempoWordTip'

/**
 * Tap tempo (R29 B11), a tool of its own: a large pad tapped in time, the tempo of the last taps over
 * it with its Italian word; Use in Metronome sets the Metronome to it and opens it. The taps are the
 * Metronome's own Tap button's (one piece of code); this is its larger pad.
 */
export function TapTempoPage() {
  const { t } = useTranslation('practice')
  const tapper = useTapTempo()
  const metronome = useMetronome()
  const navigate = useNavigate()
  const name = t('pages.tapTempo')
  return (
    <ToolPage
      title={name}
      actions={
        <InfoTip name={name} bar>
          {t('tools.tapTempo.info')}
        </InfoTip>
      }
      controls={
        <Button
          size="lg"
          className="mx-auto"
          disabled={tapper.bpm === null}
          onClick={() => {
            if (tapper.bpm === null) return
            metronome.setBpm(tapper.bpm)
            void navigate({ to: '/practice/metronome' })
          }}
        >
          {t('tools.tapTempo.use')}
        </Button>
      }
    >
      <output aria-live="polite" className="flex flex-col items-center gap-1">
        <span className="font-heading text-6xl font-semibold tabular-nums">
          {tapper.bpm === null ? '–' : t('tools.tapTempo.bpm', { bpm: tapper.bpm })}
        </span>
        {tapper.bpm === null ? (
          <span className="text-muted-foreground">{t('tools.tapTempo.none')}</span>
        ) : (
          <TempoWordTip bpm={tapper.bpm} />
        )}
      </output>
      <button
        type="button"
        // Timed as the finger lands; a key's press (a click of no pointer) by its click.
        onPointerDown={() => tapper.tap()}
        onClick={(event) => {
          if (event.detail === 0) tapper.tap()
        }}
        className="grid aspect-square w-full max-w-72 place-items-center rounded-pill bg-primary/10 text-primary ring-2 ring-primary/30 transition-transform select-none active:scale-95 active:bg-primary/20"
      >
        <span className="flex flex-col items-center gap-2 text-xl font-semibold">
          <Hand aria-hidden className="size-10" />
          {t('tools.tapTempo.pad')}
        </span>
      </button>
    </ToolPage>
  )
}
