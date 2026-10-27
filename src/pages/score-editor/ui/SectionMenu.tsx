import type { ComponentProps, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { SONG_SECTION_KINDS } from '@/entities/piece'
import { ActionMenu } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/**
 * A section's menu, opened from its name printed at its first bar (ADR 0097): name it as a song's
 * part (Intro to Ending), or join it to the section before. The song's form, nothing else (ADR 0114);
 * the palette's Bar starts a new section.
 */
export function SectionMenu({
  section,
  trigger,
}: {
  section: number
  trigger: ReactElement<ComponentProps<'button'>>
}) {
  const { t } = useTranslation(['editor', 'piece'])
  const { actions } = useScoreEditorContext()
  const kind = useEditorState((state) => state.draft.sections[section]?.heading.kind)
  if (!kind) return trigger
  return (
    <ActionMenu
      label={t('editor:section.kind')}
      render={trigger}
      trigger={null}
      actions={[
        ...SONG_SECTION_KINDS.filter((each) => each !== kind).map((each) => ({
          key: each,
          label: t(`piece:section.${each}`),
          onSelect: () => actions.dispatch({ type: 'sectionKind', section, kind: each }),
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
  )
}
