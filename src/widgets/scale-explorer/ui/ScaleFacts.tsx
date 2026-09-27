import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  noteParam,
  relatedScale,
  scaleGaps,
  type ScaleKind,
  type SpelledNote,
  type Tone,
} from '@/shared/lib/music'
import { useScaleName } from '@/shared/i18n'
import { ButtonLink, Fact } from '@/shared/ui'

/** What a scale is made of, and the scale it shares its notes with: its relative, or a mode's parent major. */
export function ScaleFacts({
  root,
  kind,
  tones,
}: {
  root: SpelledNote
  kind: ScaleKind
  tones: readonly Tone[]
}) {
  const { t } = useTranslation(['learn', 'music'])
  const scaleName = useScaleName()
  const related = relatedScale(root, kind)
  return (
    <dl className="flex flex-col gap-2">
      <Fact term={t('learn:about.formula')}>{tones.map((tone) => tone.degree).join(' ')}</Fact>
      <Fact term={t('learn:about.gaps')}>
        {scaleGaps(kind)
          .map((gap) => t(`music:gap.${gap}`))
          .join(' ')}
      </Fact>
      {related ? (
        <Fact
          term={t(related.relation === 'parent' ? 'learn:about.modeOf' : 'learn:about.relative')}
        >
          <ButtonLink
            variant="link"
            className="px-0"
            render={
              <Link
                from="/learn/scales"
                to="/learn/scales"
                search={(prev) => ({ ...prev, root: noteParam(related.root), kind: related.kind })}
                replace
              />
            }
          >
            {scaleName(related.root, related.kind)}
          </ButtonLink>
        </Fact>
      ) : null}
    </dl>
  )
}
