# B3 and B1: report

## Built

**B3, Explore** (commits `a3e7c5fd`, `75fba8dd`)
- Songs' bar: **My songs · Explore** (`?view=`, remembered alone in `pt-views` through a new `remembered(..., only)`). The Public library row and `/songs/public` are gone; the item page keeps `/songs/public/$itemId`, its parent `/songs?view=explore`.
- Explore (`pages/songs/ui/Explore*`): search, chips All · Classical · Folk · Pop · Studies · Patterns (`?cat=`), shelves New / Most saved / Top rated with See all (`?shelf=`, a row swiped on a phone, five across on a laptop), a grid with its sort, grey cards, offline, no match with Clear, nothing published.
- `ExploreCard` (`widgets/song-preview`): the first four bars drawn small from the chart's first line, title, author (public name, else "Piano Trainer learner"), ★ average over 3+ ratings, saves.
- Item page: "From Explore · not in your library", Shared by, rating with the learner's own five stars (Sign in to rate for a guest), About, key/time, chart; **Add to my library**, then **Open in my library** (an own song keeps `publicId`; a pattern matches its figures).
- Port: `PublicEntry` gains `category`, `rating`, `authorAvatar`, `opening`; `rate`, `myRating`; `browse` by category and `rated`. Fake, Supabase adapter and contract test alike.
- **CategoryPicker** (`widgets/song-preview`) for the Publish page: `PublishScreen` takes a `fields` slot and `PublishItem` a `category` (forwarded). **To wire (B6):** in `pages/piece/ui/PublishPage.tsx`, hold `category` state, pass `<CategoryPicker value onChange />` as `fields` and `category` in the item; count a category change as a change for Publish new version.

**B1, the Profile** (commit below)
- `shared/api/profile` (port, Supabase adapter, fake, contract test), `shared/lib/image` (square 256 WebP ≤ 200 KB), `ProfileProvider`/`useLearnerProfile` (offline first), `createProfile()`.
- `pt-progress` v5: `seconds`, `keys`, `earned`, `firsts`; `milestones.ts` (level n at n²×10 min), `notices.ts`, `withEarned`; Scale Master counts keys (3·8·15·24). `pt-notifications` (synced, table `notifications`). `useTrackAchievements` in `RootLayout`; `usePracticeClock` in the Player, walks and trainers; keys recorded by the walk Player; First published recorded on publish.
- Pages: Profile (hero, bell with count, Edit photo, tiles, Almost there, Badges and Achievements previews with See all, guest, skeleton), Badges, a badge, Achievements (records, milestones), a milestone, Streak (replaces Activity, ‹ › months), Notifications (groups, ×/swipe, Mark all read, Clear all asked). Settings: Edit profile (12 built-in pictures, upload, handle check, bio, email link, Save in the bar, offline read-only), Change password, Privacy; Delete account typed DELETE/УДАЛИТЬ through `deleteAccountMachine`.

## Rulings (cost if wrong)
- Categories Classical, Folk, Pop, Studies; Russian "Фактуры" per the glossary, not the plan's "Паттерны" (a word).
- Level from practice minutes; level 0 under 10 min (a label).
- "A perfect take" counts a 100 % trainer run: takes carry no accuracy yet (rename when B8 scores takes).
- `public_authors` gives null for a private profile; the app says "Piano Trainer learner" in the learner's language.
- Top rated = 3+ ratings by average, then the rest newest.
- Delete account stays a dialog (typed word), not a sheet.
- Edit profile's name also renames the account; the Account page's name field is replaced by an Edit profile row.

## Left
- First MIDI session is defined but nothing records a connected piano's minute yet (needs the MIDI service; one `recordFirst(progress, 'midi')`).
- A chord explorer's key isn't recorded (only the walk Player's).
- Screenshots beside Noji/Quizlet/memory-palaces not composed side by side; ours are in `shots/after/b3-*`, `b1-*`.

## Migrations to apply (none applied)
- `20261104120000_public_ratings.sql`: `public_items.category`, `public_ratings`, `rate_public_item`, `public_item_ratings`.
- `20261104120100_public_authors.sql`: the `public_authors` view.
- `20261104120200_notifications.sql`: the synced `notifications` table and `push_documents` taking it.
- Then `supabase/tests/public-access.sql` (expected line updated).
