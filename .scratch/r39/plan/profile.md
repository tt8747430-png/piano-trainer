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

## Practice history, built (loop round 10)

- **Built:** every trainer run is kept in the progress store (`history`, the latest 200, `withRun`), its
  key, accuracy, count answered, best run in a row, time per answer and when. Profile's right column
  (the phone's foot) has Practice history: the last three runs (`HistoryPreview`, `RunRow`: the trainer
  and level, "7:20 PM · 12 answered", the accuracy bold at the end), See all to `/profile/history`.
  `/profile/history` (`HistoryPage`): the last 30 days as a bar chart (the total, the change on the 30
  days before, a minutes scale with its half line, today in the strong sand), then the runs by day
  (Today, Yesterday, then the date), and where it is kept, truly, for a guest and for an account.
  `/profile/history/$runId` (`RunPage`, PracticeResult): the mark (a check, a star for a perfect run),
  the name, "11 of 12 correct · date", three tiles (Accuracy, In a row, Per answer), the personal best,
  and Retry, docked at the foot on a phone, opening the trainer at that level and drill.
- **Differs from the canvas, kept:** the canvas's Timing and Tempo tiles need a run's timing and tempo,
  which a trainer's answer does not have: In a row and Per answer take their places. The run on the staff
  and Practise mistakes wait for the trainer to keep each answer.
- **Fixed on the way:** a drill's record key (`chords:quiz:c-main`) failed the saved store's check and was
  dropped on reload; the check now allows the drill.

- Canvas 128 (2026-11-11): Profile drawn on the one canvas, phone and laptop.
- Loop round 1 (2026-11-13): the week, the next badge as a ring and the laptop's two columns built in the app (`WeekCard`, `NextMilestone` on `ProgressRing`'s new `track`).
