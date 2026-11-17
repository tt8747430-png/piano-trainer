# R63: the research's remaining takeaways

Canvas: https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH

## The rulings as they stand

- **Rest days (built, v375):** a streak earns a rest day every 7 days in a row, at most 2; a missed day spends one.
  Streak page: the month rings a rested day, Rest days n of 2 with ⓘ. Logic in `entities/progress/model/days.ts` (`streakOf`).
- Rejected by earlier rulings (r61's list) and not drawn: falling notes, timing colours, cursor settings.
- **Pauses (built, v376):** a Wait step over 2 beats is a pause for its bar, shown beside the slips on Played through, never scored; a tie between weakest bars goes to more pauses (`practice-machine.ts` `pause`, `use-practice.ts` `PAUSE_BEATS`).
- Left: the Scale Runner and Tiny Instrument items, each decided against the rulings.
