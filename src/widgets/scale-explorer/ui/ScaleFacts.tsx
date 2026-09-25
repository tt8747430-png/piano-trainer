import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  noteName,
  noteParam,
  relativeScale,
  scaleGaps,
  type ScaleKind,
  type SpelledNote,
  type Tone,
} from '@/shared/lib/music'
import { ButtonLink } from '@/shared/ui'

function Fact({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline gap-4">
      <dt className="w-28 shrink-0 text-muted-foreground">{term}</dt>
      <dd className="font-semibold">{children}</dd>
    </div>
  )
}

/** What a scale is made of, and its relative major or minor. */
export function ScaleFacts({
  root,
  kind,
  tones,
}: {
  root: SpelledNote
  kind: ScaleKind
  tones: readonly Tone[]
}) {
  const { t } = useTranslation('theory')
  const relative = relativeScale(root, kind)
  return (
    <dl className="flex flex-col gap-2">
      <Fact term={t('about.formula')}>{tones.map((tone) => tone.degree).join(' ')}</Fact>
      <Fact term={t('about.gaps')}>
        {scaleGaps(kind)
          .map((gap) => t(`gap.${gap}`))
          .join(' ')}
      </Fact>
      {relative ? (
        <Fact term={t('about.relative')}>
          <ButtonLink
            variant="link"
            className="px-0"
            render={
              <Link
                from="/theory/scales"
                to="/theory/scales"
                search={(prev) => ({
                  ...prev,
                  root: noteParam(relative.root),
                  kind: relative.kind,
                })}
                replace
              />
            }
          >
            {`${noteName(relative.root)} ${t(`scaleName.${relative.kind}`)}`}
          </ButtonLink>
        </Fact>
      ) : null}
    </dl>
  )
}
