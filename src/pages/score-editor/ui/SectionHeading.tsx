import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SONG_SECTION_KINDS, useSectionHeading } from '@/entities/piece'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { ActionMenu } from './ActionMenu'

/** A section's heading, opening a menu: name it as a song's part (Intro to Ending), or join it to the section before. */
export function SectionHeading({ section }: { section: number }) {
  const { t } = useTranslation(['editor', 'piece'])
  const { actions } = useScoreEditorContext()
  const heading = useEditorState((state) => state.draft.sections[section]?.heading)
  const named = useSectionHeading()
  if (!heading) return null
  return (
    <h2 className="text-xl">
      <ActionMenu
        label={t('editor:section.kind')}
        // A heading that opens its menu, as a notation app's section names: no field's box round it.
        render={
          <Button
            variant="ghost"
            className="-ml-2 h-auto gap-1 rounded-xl px-2 py-1 font-display text-xl font-semibold"
          />
        }
        trigger={
          <>
            {named({ ...heading, lines: [] })}
            <ChevronDown data-icon="inline-end" className="text-muted-foreground" />
          </>
        }
        actions={[
          ...SONG_SECTION_KINDS.filter((kind) => kind !== heading.kind).map((kind) => ({
            key: kind,
            label: t(`piece:section.${kind}`),
            onSelect: () => actions.dispatch({ type: 'sectionKind', section, kind }),
          })),
          ...(section > 0
            ? [
                {
                  key: 'join',
                  label: t('editor:section.join'),
                  onSelect: () => actions.dispatch({ type: 'joinSection', section }),
                },
              ]
            : []),
        ]}
      />
    </h2>
  )
}
