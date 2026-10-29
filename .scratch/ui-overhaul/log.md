# UI overhaul log

- 2026-10-29 Round 1, sync: the logs showed a third of pushes refused (400) with "unsupported Unicode escape
  sequence": a NUL in a save (a MIDI track name padded with NUL bytes, kept as a song's title). Fixed at the sync
  boundary (no NUL sent) and at the source (`plainText` for MIDI names and song titles). On `main`.
- 2026-10-29 Round 2, the bar: one row of one height everywhere, the title cut short, soft round actions; the
  places' large titles with the bar's echo; Learn's Lessons · Courses as tabs; Search and the Profile in the
  places' bars (Settings from the Profile); the title-size setting removed (settings v16). The song page: Edit,
  ♡, More; Learned beside Practise; "Check these chords" removed with the Check's song branch; Edit the original
  out of More, an editor switching Mine · The original inside the one editor.
- 2026-10-29 Round 3, Settings and the Profile: Settings one grouped list (the account; General's language, theme
  and floating buttons chosen in place; Playing; Sync and data; Help with the version); the Preferences and Help
  pages and routes gone; Settings goes back to the Profile. The Profile: avatar, name and email (a guest's Sign in),
  the record as one card of six figures.
