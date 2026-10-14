# ADR 0049 — Learn is one place: Continue, a Journey and Courses

- **Status:** accepted · **Date:** 2026-10-14 · **Supersedes:** ADR 0042 (Learn's tabs and folds) · **Amends:**
  ADR 0029 (the four places), ADR 0048 (the Path)

## Context

Since ADR 0048 the Path read the subjects' lessons as its steps, and Learn listed the same lessons by module: two
places for one curriculum, each with its own Continue. The owner asked for one view, after a courses app (a
carousel of courses, each a page of lessons) and a journey app (chapters as a map of nodes).

## Decision

- **Three places:** Learn (`/`), Songs, Practice. Alt and 1–3 go to them.
- **Learn** is Continue (the first step not learned), then **Journey · Courses** (`?view=`, remembered): the
  Path's levels as a map of nodes, or every module as a card on a Subjects shelf and a Courses shelf.
- **A course's page** is `/learn/$module`: its lessons in order with one honey Start or Continue.
- The Path's name, `/learn`'s tabs (`?tab=`, `?open=`), Learn's separate Continue and Hide learned are gone.

## Consequences

- A lesson's module link and a method book's lessons on Accompaniment open the course's page.
- The Path's levels keep their content (ADR 0048); only how they are drawn changes.
