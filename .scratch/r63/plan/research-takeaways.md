# R63: the research's remaining takeaways

Canvas: https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH

## The rulings as they stand

- **Rest days (built, v375):** a streak earns a rest day every 7 days in a row, at most 2; a missed day spends one.
  Streak page: the month rings a rested day, Rest days n of 2 with ⓘ. Logic in `entities/progress/model/days.ts` (`streakOf`).
- Rejected by earlier rulings (r61's list) and not drawn: falling notes, timing colours, cursor settings.
- **Pauses (built, v376):** a Wait step over 2 beats is a pause for its bar, shown beside the slips on Played through, never scored; a tie between weakest bars goes to more pauses (`practice-machine.ts` `pause`, `use-practice.ts` `PAUSE_BEATS`).
- Left: the Scale Runner and Tiny Instrument items, each decided against the rulings.
- **Streak line true to the day (built, v377)** and **badges' next tier in its own unit over a bar (built, v378):** Scale Runner 11's honest copy, Tiny Instrument 3's locked-badge progress.
- **Last 7 days:** a day practised with no timed minutes counts and shows as a stub; the empty line only for a week with none.

## Decided against the rulings, not built

- Scale Runner 8 (chord latch): Build chord already toggles keys and checks; nothing to add.
- Scale Runner 9 (weakness analytics), 13 (mode guide): Practise mistakes on a run's results and the first-run tips already do it.
- Scale Runner 10 / Tiny Instrument 1–2 (scores, XP, levels, ranks): a second ladder beside badges and the streak; "fewer things that say the same" (owner-way, question every part).
- Scale Runner 12 (three reminders): needs Web Push and its keys, a security and hosting decision, the owner's.
- Tiny Instrument 4 (daily and weekly challenges): a second goal system beside the streak; not drawn.
- Tiny Instrument 13 (falling notes, strictness): ruled out in r61.
- Tiny Instrument 21 (app text size, contrast): the system's settings carry them; the score keeps its own text size.
- Tiny Instrument 23 (solfège note names): a Russian-wide change of every note name, checked only in English; left for a ruling.
- Tiny Instrument 24 (no caches in `dist/`): Vite's build ships none; nothing to add.
