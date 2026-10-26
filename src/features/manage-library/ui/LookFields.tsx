import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import { useTranslation } from 'react-i18next'
import {
  FOLDER_PAINTS,
  FOLDER_PICTURE_ICONS,
  FOLDER_PICTURES,
  type FolderLook,
  type FolderPaint,
  type FolderPicture,
} from '@/entities/library'
import { cn } from '@/shared/lib'
import { PAINT } from '@/shared/ui'

const CHOICE =
  'grid size-12 cursor-default place-items-center rounded-2xl border-2 border-transparent transition-[border-color,scale] duration-200 ease-out active:scale-95 data-checked:border-foreground [&_svg]:size-5'

/**
 * A folder's look, chosen (Mindscape's appearance fields): its picture among the pictures of music,
 * each drawn on the paint chosen, then its paint among the theme's; each a radio group, the arrows
 * moving through it.
 */
export function LookFields({
  look,
  onChange,
}: {
  look: FolderLook
  onChange: (look: FolderLook) => void
}) {
  const { t } = useTranslation('songs')
  const paint = PAINT[look.paint]
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span aria-hidden className="text-sm text-muted-foreground">
          {t('folder.picture')}
        </span>
        <RadioGroup
          aria-label={t('folder.picture')}
          value={look.picture}
          onValueChange={(picture: FolderPicture) => onChange({ ...look, picture })}
          // Six to a row where they fit, two even rows, never one left over.
          className="flex max-w-82 flex-wrap gap-2"
        >
          {FOLDER_PICTURES.map((picture) => {
            const Icon = FOLDER_PICTURE_ICONS[picture]
            return (
              <Radio.Root
                key={picture}
                value={picture}
                aria-label={t(`folder.pictures.${picture}`)}
                title={t(`folder.pictures.${picture}`)}
                className={cn(CHOICE, paint.fill, paint.ink)}
              >
                <Icon aria-hidden />
              </Radio.Root>
            )
          })}
        </RadioGroup>
      </div>
      <div className="flex flex-col gap-2">
        <span aria-hidden className="text-sm text-muted-foreground">
          {t('folder.paint')}
        </span>
        <RadioGroup
          aria-label={t('folder.paint')}
          value={look.paint}
          onValueChange={(next: FolderPaint) => onChange({ ...look, paint: next })}
          className="flex flex-wrap gap-2"
        >
          {FOLDER_PAINTS.map((each) => (
            <Radio.Root
              key={each}
              value={each}
              aria-label={t(`folder.paints.${each}`)}
              title={t(`folder.paints.${each}`)}
              className={cn(CHOICE, 'rounded-full', PAINT[each].fill)}
            />
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}
