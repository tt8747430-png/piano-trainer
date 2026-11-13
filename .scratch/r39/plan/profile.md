# Profile (canvas 128)

Premium for Profile means memory-palaces' ProfilePage and Noji: the learner, three figures, the week, the next badge.

## The rulings as they stand

- **memory-palaces' Profile** (feedback log, Profile and Settings): the initial with a camera button to change the
  photo, the name, "@ana · Joined 2025", then three figures as values first: 12 Day streak, 4 Songs learned,
  2 h 5 min Practice time. Each figure is a link to its page.
- **The week as a picture** (canvas 128): "This week · 152 min · 6 of 7 days", one bar a day, today in the strong
  terracotta and the empty day a flat line. It links to the Streak page's month.
- **The next badge as a ring:** "Almost there · 2 more days to your next Streak Keeper badge · Gold · 14-day streak",
  12/14 drawn as a ring.
- **Badges and Achievements:** rows with a medal in the tier's colour (Bronze, Silver, Gold, Platinum) and its line;
  an achievement earned shows a check and "Earned 3 November 2026", one not earned is grey with "Not earned yet".
  "See all" on each.
- **Bar:** the bell with its unread count, and Settings. The laptop sidebar's foot is the learner's own row
  ("Ana Popescu · Profile"), the place it opens from.
- **Laptop:** two columns: the learner, the figures, the week and the next badge left; Badges and Achievements right.
- A guest's Profile (canvas 136, as the app's test holds it): a plain figure, Exploring as a guest, one line that their practice is kept on this device, and Sign in; their own figures, week, badges and achievements below as for anyone. Loading is a skeleton of the same shapes.

- **Practice history** (canvas 160): every practice run kept on Profile, by day, newest first: the exercise's name
  ("Cmaj7 · Inversions"), its tempo and time ("72 BPM · 14:20"); each row opens its results (PracticeResult: a
  verdict, "11 of 12 correct · 72 BPM", Accuracy, Timing, Tempo, the run on the staff, Practise mistakes and Retry).

## Practice history, to build (loop round 10)

- **Today:** a trainer's run (`features/trainer`, `useTrainer`) is kept only as bests per level
  (`entities/progress` `trainers`, `recordRun`); nothing keeps each run, and Profile has no history.
- **Will build:** a saved store of runs (`entities/practice-runs`, `createSavedStore`, capped at the last 200):
  each run its trainer and level key, title, accuracy, the count right of all, tempo where it has one, and when.
  `useTrainer` appends one as it records the bests. Profile's right column gets a Practice history section
  (SectionHead, See all to `/profile/history`) of the last three; `/profile/history` lists them by day; a row opens
  `/profile/history/$runId`, the results page drawn on PracticeResult (Accuracy · the count · Tempo; Retry opens
  the trainer at that level). The run on the staff and Practise mistakes wait for the trainer to keep each
  answer, noted in the port table.


- Canvas 128 (2026-11-11): Profile drawn on the one canvas, phone and laptop.
- Loop round 1 (2026-11-13): the week, the next badge as a ring and the laptop's two columns built in the app (`WeekCard`, `NextMilestone` on `ProgressRing`'s new `track`).
