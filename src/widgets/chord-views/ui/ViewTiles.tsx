import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import { useTranslation } from 'react-i18next'
import { MUSIC_VIEWS, type MusicView } from '@/entities/settings'
import { ViewPicture } from './ViewPicture'

/**
 * The Player's views of the music as tiles (ADR 0099), the top of its View: each a picture of the
 * view drawn in its own style over its name, two by two, the one shown pressed. One choice of four,
 * a radio group: the arrows move to a view and show it.
 */
export function ViewTiles({
  value,
  onChange,
}: {
  value: MusicView
  onChange: (view: MusicView) => void
}) {
  const { t } = useTranslation('player')
  return (
    <RadioGroup
      aria-label={t('views.label')}
      value={value}
      onValueChange={(next) => {
        const view = MUSIC_VIEWS.find((each) => each === next)
        if (view && view !== value) onChange(view)
      }}
      className="grid grid-cols-2 gap-2"
    >
      {MUSIC_VIEWS.map((view) => (
        <Radio.Root
          key={view}
          value={view}
          aria-label={t(`views.${view}`)}
          className="flex min-h-11 cursor-default flex-col items-center gap-1.5 rounded-2xl border border-input bg-card px-2 py-2.5 text-center text-sm leading-tight font-medium text-muted-foreground transition-colors duration-200 ease-out select-none hover:bg-muted data-checked:border-foreground data-checked:bg-muted data-checked:text-foreground"
        >
          <ViewPicture view={view} />
          <span>{t(`views.${view}`)}</span>
        </Radio.Root>
      ))}
    </RadioGroup>
  )
}
