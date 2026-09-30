# 73. Learn writes its nine reference and tool rows out by hand

Status: done
Severity: P3
Tier: 4
Rule: CODE_STYLE §1 (a page with little markup of its own)
Where: `src/pages/learn/ui/LearnPage.tsx:20-86`

## What is wrong

Nine `<li><RowLink … render={<Link to=…/>} /></li>` blocks; Practice's rows come from a table.

## The test that shows it

Structural: `LearnPage.test.tsx`, green before and after.

## The fix

`REFERENCES` and `TOOLS`, each row its page, title and tile; the page maps them (91 → 61 lines).

## Comments
