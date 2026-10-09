import { useTranslation } from 'react-i18next'
import { DIAGRAM_COLOURS, type DiagramColour } from '@/shared/lib'
import { FINGERS, type Finger } from '@/shared/lib/music'
import { NamedSegmented } from '@/shared/ui'

/** No finger on a key marked. */
const NO_FINGER = 0

/** Mark's tools: the colour and the finger the next key tapped takes. */
export function MarkTools({
  colour,
  finger,
  onColour,
  onFinger,
}: {
  colour: DiagramColour
  finger: Finger | null
  onColour: (colour: DiagramColour) => void
  onFinger: (finger: Finger | null) => void
}) {
  const { t } = useTranslation('practice')
  return (
    <>
      <NamedSegmented
        label={t('freePlay.colour.label')}
        value={colour}
        options={DIAGRAM_COLOURS.map((value) => ({ value, label: t(`freePlay.colour.${value}`) }))}
        onChange={onColour}
      />
      <NamedSegmented
        label={t('freePlay.finger.label')}
        value={finger ?? NO_FINGER}
        options={[
          { value: NO_FINGER, label: t('freePlay.finger.none') },
          ...FINGERS.map((value) => ({ value, label: String(value) })),
        ]}
        onChange={(value) => onFinger(FINGERS.find((each) => each === value) ?? null)}
      />
    </>
  )
}
