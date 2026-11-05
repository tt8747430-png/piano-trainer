import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { hasCredits, SheetCredits, SheetTitle, type TitlePlace } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/** The title: at the line's head across, else centred. */
const PLACED = { across: '', centred: 'text-center' } as const

/** A printed part of the score's head that opens Title and credits: a light wash on hover. */
const OPENS = 'rounded-control px-1 transition-colors duration-200 ease-out hover:bg-foreground/5'

/**
 * The title printed at the sheet's head and the credits under it (ADR 0114, R32-B), as Flat's: a
 * click on either opens Title and credits, the one place the title and every credit are typed.
 * Nothing is printed under it the learner did not write. A lesson's example has no credits: its
 * title is printed alone, named for its lesson.
 */
export function TitleField({ place }: { place: TitlePlace }) {
  const { t } = useTranslation('editor')
  const { meta, view } = useScoreEditorContext()
  const credits = useEditorState((state) => state.draft.header)
  const example = meta.kind === 'example'
  const open = () => view.setGear('credits')
  return (
    <div className={PLACED[place === 'across' ? 'across' : 'centred']}>
      <SheetTitle title={meta.title} place={place}>
        {example ? (
          meta.title
        ) : (
          <button
            type="button"
            title={t('scoreSettings.credits')}
            onClick={open}
            className={cn(
              'inline-flex min-h-11 max-w-full items-center justify-center text-balance wrap-break-word',
              OPENS,
            )}
          >
            {meta.title}
          </button>
        )}
      </SheetTitle>
      {place === 'across' || !hasCredits(credits) ? null : example ? (
        <SheetCredits credits={credits} />
      ) : (
        <button
          type="button"
          title={t('scoreSettings.credits')}
          onClick={open}
          className={cn('block w-full text-start', OPENS)}
        >
          <SheetCredits credits={credits} />
        </button>
      )}
    </div>
  )
}
