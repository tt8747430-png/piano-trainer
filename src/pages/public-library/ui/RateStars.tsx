import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import { Link } from '@tanstack/react-router'
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RATED_MIN, type PublicRating } from '@/shared/api/public-library'
import { cn } from '@/shared/lib'
import { useAccount } from '@/shared/lib/account'
import { usePublicLibrary } from '@/shared/lib/public-library'
import { say } from '@/shared/ui'

const STARS = [1, 2, 3, 4, 5] as const

/**
 * An item's rating (B3): its average and how many rated it; signed in, the learner's own five stars
 * to rate it with, once (a new choice replaces theirs); signed out, Sign in to rate.
 */
export function RateStars({
  itemId,
  rating,
  onRated,
}: {
  itemId: string
  rating: PublicRating | null
  onRated: (rating: PublicRating) => void
}) {
  const { t, i18n } = useTranslation('songs')
  const library = usePublicLibrary()
  const { account } = useAccount()
  const [mine, setMine] = useState<number | null>(null)
  const signedIn = account !== null
  useEffect(() => {
    if (!signedIn) return
    let current = true
    void library.myRating(itemId).then((result) => {
      if (current && result.ok) setMine(result.value)
    })
    return () => {
      current = false
    }
  }, [library, itemId, signedIn])
  const rate = (stars: number) => {
    const before = mine
    setMine(stars)
    void library.rate(itemId, stars).then((result) => {
      if (result.ok) return onRated(result.value)
      setMine(before)
      say(t('explore.rateFailed'))
    })
  }
  const count = rating?.count ?? 0
  const average =
    rating && count >= RATED_MIN
      ? rating.average.toLocaleString(i18n.language, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })
      : null
  return (
    <section
      aria-label={t('explore.yourRating')}
      className="flex flex-wrap items-center gap-x-4 gap-y-2"
    >
      <p className="flex items-center gap-1.5 text-sm text-muted-foreground tabular-nums">
        {average ? (
          <>
            <Star aria-hidden className="size-4 fill-current text-attention" />
            <span className="font-semibold text-foreground">{average}</span>
            <span aria-hidden>·</span>
          </>
        ) : null}
        {count > 0 ? t('explore.ratings', { count }) : t('explore.noRatings')}
      </p>
      {signedIn ? (
        <RadioGroup
          aria-label={t('explore.yourRating')}
          value={mine ?? 0}
          onValueChange={(stars) => {
            if (typeof stars === 'number' && stars !== mine) rate(stars)
          }}
          className="ml-auto flex"
        >
          {STARS.map((stars) => (
            <Radio.Root
              key={stars}
              value={stars}
              aria-label={t('explore.stars', { count: stars })}
              className="grid size-11 cursor-default place-items-center rounded-pill text-muted-foreground hover:bg-muted focus-visible:-outline-offset-3"
            >
              <Star
                aria-hidden
                className={cn(
                  'size-6',
                  mine !== null && stars <= mine && 'fill-current text-attention',
                )}
              />
            </Radio.Root>
          ))}
        </RadioGroup>
      ) : (
        <Link
          to="/account/sign-in"
          className="ml-auto text-sm font-semibold text-link underline-offset-4 hover:underline"
        >
          {t('explore.signInToRate')}
        </Link>
      )}
    </section>
  )
}
