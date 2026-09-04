---
name: Samuel Chen — Working Papers
description: An audit workpaper on columnar analysis stock, where every measured figure carries the pencil tick that resolves to its source.
colors:
  stock: "#e9ede2"
  stock-band: "#d6e1c9"
  stock-raised: "#f2f5ec"
  stock-edge: "#dfe4d6"
  rule: "#a7b598"
  rule-strong: "#6c7a60"
  ink: "#14180f"
  ink-muted: "#4b5445"
  ink-faint: "#575f50"
  red: "#a6302a"
  red-wash: "#f0dfd9"
  blue: "#22528b"
  blue-wash: "#dce5f0"
  manila: "#b9954f"
typography:
  display:
    fontFamily: "Libre Franklin Variable, Libre Franklin, -apple-system, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 1.4rem + 6vw, 5.5rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "clamp(2.25rem, 1.5rem + 3.2vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.04em"
  title:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  subtitle:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body-sm:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Sometype Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: "0.14em"
    textTransform: "uppercase"
  data:
    fontFamily: "Sometype Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.04em"
    fontFeature: "'tnum' 1, 'zero' 1"
rounded:
  none: "0"
  hairline: "1px"
  stamp: "2px"
  tab: "3px 3px 0 0"
  pill: "99px"
spacing:
  s-1: "0.25rem"
  s-2: "0.5rem"
  s-3: "0.75rem"
  s-4: "1rem"
  s-5: "1.5rem"
  s-6: "2rem"
  s-7: "3rem"
  s-8: "4.5rem"
  s-9: "7rem"
components:
  figure:
    textColor: "{colors.ink}"
    typography: "{typography.data}"
    rounded: "{rounded.none}"
    padding: "0 0 1px"
  figure-hover:
    backgroundColor: "{colors.red-wash}"
    textColor: "{colors.ink}"
  cross-ref:
    textColor: "{colors.blue}"
    typography: "{typography.data}"
    rounded: "{rounded.none}"
    padding: "0"
  chip:
    backgroundColor: "{colors.stock}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "1px 0.5rem"
  action:
    textColor: "{colors.ink}"
    typography: "{typography.data}"
    rounded: "{rounded.none}"
    padding: "0 0 2px"
  action-primary:
    textColor: "{colors.red}"
    typography: "{typography.data}"
    rounded: "{rounded.none}"
    padding: "0 0 2px"
  download-button:
    backgroundColor: "transparent"
    textColor: "{colors.red}"
    typography: "{typography.data}"
    rounded: "{rounded.none}"
    padding: "0.5rem 1rem"
  download-button-hover:
    backgroundColor: "{colors.red-wash}"
    textColor: "{colors.red}"
  stamp:
    backgroundColor: "transparent"
    textColor: "{colors.red}"
    typography: "{typography.label}"
    rounded: "{rounded.stamp}"
    padding: "0.25rem 0.75rem"
  index-tab:
    textColor: "{colors.red}"
    typography: "{typography.data}"
    rounded: "{rounded.tab}"
    padding: "0.25rem 0.75rem"
  schedule-head:
    backgroundColor: "{colors.stock-band}"
    textColor: "{colors.ink}"
    typography: "{typography.data}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.5rem"
  schedule-row:
    backgroundColor: "{colors.stock-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "1rem 1.5rem"
  schedule-row-banded:
    backgroundColor: "{colors.stock-band}"
  disclosure-note:
    backgroundColor: "{colors.stock-band}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "1.5rem"
---

# Design System: Samuel Chen — Working Papers

## Overview

**Creative North Star: "The Audit Workpaper"**

This is not a portfolio of projects; it is the working papers behind them. The whole surface is
built as a physical document an auditor would have on the desk: columnar analysis stock, hairline
printed ruling, alternating green-bar bands, a folder tab carrying the sheet's index, and two
colors of wax pencil laid over the print. The thesis the world exists to serve is that **every
figure carries the pencil tick that resolves to the source it was agreed to** — the tick is not
decoration, it is the mechanic, and it is a real link.

The world is deliberately literal about its own materials. The sheet has edges (`--sheet` is
`min(1120px, 100% - 2.5rem)` and is bounded left and right by a hairline rule) because a working
paper is an object that sits on a desk rather than a page that bleeds off it. Rows are ruled and
banded because that is what the stock is. Schedules are titled and tallied and closed with an
accounting double rule because that convention genuinely means "this total is final." The dark
theme is not an inverted palette; it is the same sheet under a desk lamp at night, keeping the
green cast in the stock, the ruling, and the ink.

The category's default answer — a three-up grid of project cards — is refused outright. Structure
is a schedule with named columns, and a project's headline measurement sits in the money column,
right-aligned, in the data face, with its tick beside it. What makes the surface recognizable with
all content removed is exactly two things: the banded schedules and the margin index.

**Key Characteristics:**
- Bounded ruled sheet on bare stock, never a full-bleed page
- Green-bar banding on alternating rows; the band *is* the row, never a decorative stripe
- Two-color pencil vocabulary: red for agreed figures, blue for cross-references and caveats
- Every measured value set in the mono data face with tabular numerals
- Hairline printed ruling everywhere; no shadows, no gradients, no rounded cards
- A cross-reference index (`A-1`, `W-1`–`W-3`, `R-1`) that is the navigation, not a label on it

## Colors

A pale, slightly desaturated green-grey stock, printed in a green hairline, marked in two
saturated pencils: a brick red and an ink blue. Nothing else is on the desk.

### Primary
- **Wax Pencil Red** (`#a6302a` light / `#e4796a` dark): the auditor's agreeing hand. It marks a
  figure that was traced to its source and matched, the primary action (`Résumé (PDF)`, the
  résumé download button), the "prepared by" stamp, the sheet index on its folder tab, and the
  `role-proves` line that says what a finance role proves to an engineer. It is also the caret
  color. It appears on well under a tenth of any screen; that scarcity is what makes it read as a
  mark rather than a brand color.
- **Red Wash** (`#f0dfd9` light / `#33201c` dark): the only fill red ever takes — the hover ground
  under a figure and under the résumé download button. Never a text color.

### Secondary
- **Wax Pencil Blue** (`#22528b` light / `#86aee0` dark): the auditor's referring hand. Every
  cross-reference between sheets, every "not cleared" mark, every "see the note" pointer, the
  focus ring, prose links, and the source links in the margin rail. Blue never states a result; it
  points at one, or at a limit.
- **Blue Wash** (`#dce5f0` light / `#1a2430` dark): the text-selection ground. Themed selection is
  part of the system, not a browser default.

### Tertiary
- **Manila** (`#b9954f` light / `#c9a96e` dark): the folder. It appears in exactly one place — the
  sheet index's tab — and it appears on the *border*, mixed 70% into the rule, with the field only
  8% tinted. See The Manila Edge Rule.

### Neutral
- **Analysis Stock** (`#e9ede2` light / `#171b14` dark): the desk-level ground; the page body and
  the ground the sheet sits on. Also the fill inside chips and the legend panel, so those read as
  cut from the same pad.
- **Green Bar** (`#d6e1c9` light / `#1f2419` dark): the banded row. Every even schedule row, every
  schedule head, the sheet rail, the margin rail, the disclosure note, the sign-off block, and
  even-numbered rows of MDX tables. This is the single most load-bearing neutral in the system.
- **Raised Sheet** (`#f2f5ec` light / `#21261c` dark): the sheet's own field, one step brighter
  than the desk, which is what makes the bounded sheet read as sitting *on* something.
- **Printed Rule** (`#a7b598` light / `#39422f` dark): the hairline ruling of the pad. Every 1px
  divider, chip border, figure underline, scrollbar thumb.
- **Heavy Rule** (`#6c7a60` light / `#55604a` dark): the 2px structural rules, the schedule head's
  top and bottom edges, the double closing rule, the bullet dash on every list item.
- **Ink** (`#14180f` light / `#e6ebde` dark): body text and headings.
- **Muted Ink** (`#4b5445` light / `#a3ae97` dark): secondary prose — project answers, role
  bullets, table cells.
- **Faint Ink** (`#575f50` light / `#939e88` dark): labels, column heads, provenance lines,
  locations. Deliberately *not* a lighter tint of muted ink; see The Verified Floor Rule.

### Named Rules

**The Two Pencils Rule.** There are exactly two accent colors and each has one job. Red states a
measured result and the actions that lead to one. Blue points somewhere — a cross-reference, a
disclosure, a limit. A third accent, or red used to point and blue used to state, breaks the
world's grammar.

**The Band Is The Row Rule.** Green-bar banding is applied by `:nth-child(even)` on real schedule
rows and real table rows only. It marks the record boundary; it is never a decorative stripe, a
section background chosen for variety, or a highlight for emphasis.

**The Verified Floor Rule.** `--ink-faint` is `#575f50` light and `#939e88` dark specifically
because label and provenance text renders at 12–13px *on the green band*, and those values were
picked to clear 4.5:1 against `--stock-band`, not against the sheet. Any new faint-ink value must
be measured against the band, not the raised sheet.

**The Manila Edge Rule.** Manila carries the folder tab's *edge* (70% mixed into the rule), with
the field tinted only 8%. A heavily tinted manila field drops the red index below the contrast
floor — most sharply in the dark theme, where the mix resolves light. Measured on the shipped
tab: 5.80:1 light, 4.60:1 dark. Do not push the field tint up to make the tab "read as manila."

## Typography

**Display / Body Font:** Libre Franklin Variable (with `-apple-system`, `Segoe UI`, `system-ui`,
sans-serif)
**Data / Label Font:** Sometype Mono (with `ui-monospace`, `SFMono-Regular`, Menlo, monospace),
loaded at 400/500/600

**Character:** A plain, slightly condensed American grotesque doing the talking, and a squarish
typewriter mono doing the counting. The pairing is the document's own division of labor: prose is
set in the human voice, and anything that is a measurement, an index, a date, a column head, or a
stamp is set in the machine voice. `font-synthesis-weight: none` is on, so a weight either exists
in the file or is not used.

### Hierarchy
- **Display** (800, `clamp(2.75rem, 1.4rem + 6vw, 5.5rem)`, 0.95, `-0.04em`): the engagement name
  on A-1. One per site.
- **Headline** (800, `clamp(2.25rem, 1.5rem + 3.2vw, 3.75rem)`, 1.1, `-0.04em`): the sheet title
  on a project sheet or the résumé.
- **Title** (700, 1.875rem, 1.1, `-0.03em`): a Schedule A project title, an MDX `h2`, the sign-off
  heading.
- **Subtitle** (700, 1.125rem, 1.1, `-0.02em`): an organization name in a role row, an MDX `h3`.
- **Body** (400, 1rem, 1.6): the engagement scope line runs larger at 1.375rem/1.35; project
  answers and MDX paragraphs run at 1rem/1.55–1.65 in muted ink.
- **Body small** (400, 0.8125rem, 1.6–1.65): role bullets, disclosure prose, table cells, résumé
  points. This is the workhorse reading size on the site.
- **Label** (500, 0.75rem, `0.14em`, uppercase, mono): every `dt`, column head, rail caption,
  margin-block title, and provenance line. Column heads within a schedule loosen to `0.1em`.
- **Data** (600, 0.8125rem, `0.04em`, mono, `tnum`/`zero` on): indices, cross-references, dates,
  chips, and every measured figure. A headline measurement scales up to 1.375rem (Schedule A) or
  1.875rem (project sheet) but stays in the data face.

### Named Rules

**The Data Face Rule.** Anything a reader could copy into a spreadsheet — a figure, a date range,
an index, a GPA, a phone number — is set in Sometype Mono with tabular, slashed-zero numerals
(`.num`). Prose is never set in the mono; the mono is never used to add texture.

**The Declared Measure Rule.** `ch` resolves against the element's own `font-size`, so a `68ch`
measure declared on a 1rem container yields roughly 86 characters when the text inside renders at
0.8125rem. Every prose container therefore declares the size its text is actually set at:
`.prose-sm` sets `font-size: var(--t-sm)` alongside its `70ch` cap, and the per-surface caps
(58ch, 62ch, 68ch, 70ch, 72ch) are all stated on the element that carries the type size. Never
inherit a measure across a size change.

**The Balanced Head Rule.** All headings carry `text-wrap: balance` and `letter-spacing` tightening
from `-0.02em` at title size to `-0.04em` at display size. Large type is always tighter, never
looser.

## Layout

**The sheet.** One container variable, `--sheet: min(1120px, 100% - 2.5rem)`, tightening to
`100% - 1.5rem` below 720px. Everything lives inside `.sheet-body`, which paints the raised sheet
field and draws a 1px rule down each side. The sheet is never full-bleed; the desk ground shows
on both edges at every width.

**The schedule.** The repeating unit is: a banded schedule head (title left, tally right, hairline
above and below in the heavy rule) → an optional column-head row → a stack of ruled, banded rows →
a closing double rule. Rows are CSS grid with per-surface column templates:
- Schedule A work rows: `minmax(0, 1fr) 13.5rem 4.5rem` — narrative, money column, ref column.
- Role rows: `13rem minmax(0, 1fr)` — a when-column and the entry.
- Résumé entries: `11rem minmax(0, 1fr)`, the same shape at résumé density.

**The margin rail.** Project sheets split `minmax(0, 1fr) 17rem`: the transcribed prose on the
sheet, and a banded, sticky right-hand rail carrying the sheet's particulars, its sources, its
stack, and the "what is not done" note. The rail is the auditor's margin, and it is where
provenance lives.

**Spacing rhythm.** A nine-step ramp from `0.25rem` to `7rem`, roughly 1.5× at the low end and
1.5× again through the top. Row padding is `--s-4 --s-5` (1rem/1.5rem); section padding is
`--s-5`–`--s-6`; the sign-off closes on `--s-8`. Below 720px every horizontal padding drops one
step to `--s-4` in a single sweep, so the whole sheet narrows together.

**Breakpoints.** Three, each doing one structural job: **1000px** collapses the project sheet's
margin rail from a sticky column into an auto-fit horizontal band below the prose; **940px**
narrows Schedule A's money and ref columns and releases the legend panel's width clamp; **720px**
is the mobile fold — column heads are dropped, the work row re-flows into named grid areas
(`main` / `measured ref`), role rows and résumé entries collapse to one column with the when-line
running inline, the rotated stamp is hidden, and the sheet toggle drops its word for its icon.

### Named Rules

**The Bounded Sheet Rule.** Content never touches the viewport edge. A section that wants to span
the window is wrong for this world; widen the sheet or accept the edge.

**The Schedule, Not The Card Rule.** Grouped content is a schedule: a titled, tallied band of
ruled rows. Cards — a floating rounded box with its own padding and border — are the category
default this world exists to refuse, and are not used as page structure anywhere.

**The Wide Table Scrolls Itself Rule.** Prose in a project sheet caps at 62ch, but tables opt out
(`max-width: none`) because they are schedules, not prose. A table too wide for the sheet scrolls
inside `.table-wrap`; the page body never scrolls horizontally.

## Elevation & Depth

**There are no shadows in this system.** Not one `box-shadow` is declared anywhere in the build.
Depth is entirely material and tonal: the desk (`--stock`) sits behind the sheet
(`--stock-raised`), which is one step brighter and bounded by a hairline; within the sheet, bands
(`--stock-band`) sit one step *darker* to mark rows, rails, notes, and the sign-off. Three tones
and a 1px rule carry the entire spatial model.

The only depth effect in the build is the stamp's `mix-blend-mode: multiply` (switching to
`screen` in the dark theme) at 82% opacity, which makes the red or blue stamp sit *in* the paper
rather than on top of it — ink absorbed by stock, not a floating badge.

### Named Rules

**The Flat Paper Rule.** No shadows, no gradients, no blurs, no glows. If an element needs to
separate from its surroundings, it gets a rule, a band, or a step in the stock tone — in that
order of preference.

## Shapes

Square by default, and aggressively so. Radius appears in exactly four places, all of them
justified by the physical metaphor: `1px` on the focus ring so the outline follows small inline
targets cleanly; `2px` on the stamp and inline code, the softness of a rubber stamp's edge and a
printed key; `3px 3px 0 0` on the index tab, which is a folder tab and therefore rounded only at
the top with an open bottom that runs into the sheet; and `99px` on the scrollbar thumb, which
belongs to the browser chrome rather than the paper.

Borders do the work radius would do elsewhere. The vocabulary is four weights: a 1px hairline
(`--rule`) for row and cell dividers, chip edges, and the figure's resting underline; a 2px
structural rule (`--rule-strong`) for schedule heads, section boundaries, and the active state of
a project-title underline; a 3px double rule closing a schedule; and a 2px solid border in an
accent color for the two boxed affordances (the stamp and the résumé download).

Icons are authored SVG at a single 2px stroke weight (1.5–1.8px for the smaller UI carets), drawn
with the slight irregularity of a wax pencil, `vector-effect: non-scaling-stroke` so a scaled mark
keeps its weight. There are no icon fonts and no unicode glyphs standing in for icons — even the
navigation caret and the download arrow are drawn paths.

### Named Rules

**The Square Corner Rule.** New elements get `border-radius: 0`. A radius must be argued for from
the physical metaphor (a stamp's bite, a folder tab's fold), never chosen for softness.

**The Drawn Mark Rule.** No glyph icons, no icon font, no `→` or `✓` as a character. Every mark is
an authored SVG path at the world's stroke weight.

## Components

### Figure (signature component)

The site's whole mechanic. A measured value in the data face, a pencil tick beside it, and a
resting hairline underline — rendered as a real `<a>` to the public source, so the audit trail
works with the keyboard, works with JavaScript off, and works when the page is a printout.

- **Resting:** value at 600 weight in mono; tick at 55% opacity; 1px `--rule` underline.
- **Hover / focus-visible:** underline goes red, the ground fills `--red-wash`, and the tick
  rises to full opacity with `scale(1.15) rotate(-4deg)` over 0.2s — the pencil pressing down.
- **Provenance:** the source name is printed beneath the figure as a mono label (`.provenance`),
  right-aligned in Schedule A's money column, and *additionally* carried inside the link's
  accessible name via `.sr-only` ("— agreed to source: …"). Not a `title` attribute: a tooltip is
  never announced reliably and never appears on touch, and the thesis rests on this association.
- **Kinds:** `agreed` (red check), `notCleared` (blue circle-slash), `note` (blue asterisk).

### Mark

Three authored SVGs on an 18×18 viewBox, 2px stroke, `currentColor`, defaulting to red. Decorative
by default (`aria-hidden`), promoted to `role="img"` with a `<title>` only when given one. Each
kind declares its approximate path length as `--len`, which is what the draw-on animation uses as
its dash length.

**Motion.** The tick legend on A-1 is the site's **single authored motion**. Its three marks draw
themselves once with the `draw-on` keyframe — 0.6s on the `--ease` curve
(`cubic-bezier(0.16, 1, 0.3, 1)`), staggered 0 / 140 / 280ms, `animation-fill-mode: both` —
**on load, not on scroll into view**, and only under `prefers-reduced-motion: no-preference`. This
is deliberate and hard-won: an earlier IntersectionObserver implementation was removed because it
failed *closed* — when the observer did not fire, the marks stayed permanently invisible. The
resting state is now a fully drawn mark and no script participates, so the animation can only ever
replay the drawing of a stroke that is already there. Every other mark on the site is static
state.

### Cross-reference

Blue pencil, mono, 600 weight, an index (`A-1`, `W-2`, `R-1`) with an optional muted label and a
drawn caret. Transparent bottom border that goes blue on hover/focus; the caret translates 2px in
its direction of travel. **Every link between sheets is one of these** — the index scheme is the
navigation, not a decoration layered on top of one. `A-1` is the homepage, `W-1`–`W-3` are the
project sheets in schedule order, `R-1` is the résumé.

### Chip

A stack or coursework tag: mono at 0.75rem, `0.04em` tracking, muted ink, 1px `--rule` border,
square, `1px 0.5rem` padding, filled with the desk stock so it reads as a small card cut from the
pad and laid on the sheet. A `--tool` variant drops to faint ink for the longer languages-and-tools
run. Chips are static labels; they are never interactive, never selected, never filters.

### Actions and buttons

There is no filled button in the system. Three affordance shapes only:
- **Text action** (`.action`): mono, uppercase, `0.06em`, ink, with a `--rule-strong` underline
  that goes red — along with the text — on hover/focus. The `--primary` variant starts red and at
  600 weight.
- **Boxed action** (`.download`): the résumé PDF button, a 2px red border with transparent fill
  that takes `--red-wash` on hover. The only bordered button on the site.
- **Ghost toggle** (`.sheet-toggle`): faint mono in the sheet rail with a drawn sun icon; goes to
  full ink on hover, drops its word below 720px.

### Sheet rail and index tab

Every page is wrapped in `Sheet`, which paints the bounded field and prints a banded rail across
the top: a caption on the left (truncating with ellipsis), the theme toggle and the index tab on
the right, closed by a 2px heavy rule. The index tab is seated on the rail's bottom edge with a
negative `--s-2` margin so its open bottom runs into the sheet, the way a real folder tab does.

### Schedule

A titled section with an optional right-hand tally. The schedule label *is* the heading element
(`h2` by default, `h3` available) rather than a label sitting above one, because "Schedule A —
Selected work" and "3 sheets" are both real information.

### Disclosure note

The banded block that carries what a repository itself says did not work. `--stock-band` ground,
heavy rule above, a `notCleared` mark beside its heading, a rotated "Not cleared" stamp pinned
top-right (hidden below 720px, where the rotation has no room), and body prose at `.prose-sm`.
Structurally identical to a schedule row so it reads as part of the record, and placed immediately
after Schedule A rather than at the foot of the page.

### Stamp

Uppercase Libre Franklin at 800 weight, `0.2em` tracking, a 2px accent border, 2px radius, rotated
`-2.2deg`, 82% opacity, blended into the stock. Three variants: red (default, "Prepared by S.
Chen"), blue ("Not cleared"), and muted. A stamp is applied to a document, never used as a button
or a chip.

### MDX prose (project sheets)

Body prose capped at 62ch in muted ink; `h2` at title size with a 2px heavy underline; `h3` at
subtitle size; list bullets drawn as a 6×1px dash in `--rule-strong` rather than a disc — the same
bullet used by role rows and résumé points, so all three read as one list style. Inline code takes
the band ground with a hairline border. **Tables are rendered as schedules**: mono uppercase
column heads at faint ink over a heavy rule, banded even rows, tabular numerals, and every column
after the first right-aligned and set in the data face.

### Browser surfaces

The browser's own chrome is part of the design, not left to defaults. Themed `::selection`
(`--blue-wash` ground, ink text); `caret-color: var(--red)`; `accent-color: var(--blue)`; a 12px
custom scrollbar with a `--rule` thumb inset 3px in the stock and a `--rule-strong` hover, plus
`scrollbar-color` for Firefox; a 2px `--blue` `:focus-visible` ring at 3px offset with a 1px
radius; `text-underline-offset: 3px` and 1px underline thickness on prose links; and
`theme-color` meta declared for both schemes. A skip link is parked offscreen and lands at
`--s-4` on focus.

### Theming

Light is the default because that is where the sheet lives; dark is the same sheet under a desk
lamp. Both are implemented as full token redefinitions — never filters, never inversion. The
mechanism is three-state: bare `:root` holds the complete light palette; a
`@media (prefers-color-scheme: dark)` block guarded as `:root:not([data-theme='light'])` handles
system preference; and `:root[data-theme='dark']` lets an explicit choice win. The choice is
restored from `localStorage` by an inline head script before first paint, and the toggle carries
`aria-pressed`.

## Do's and Don'ts

### Do:
- **Do** put every measurement in the data face with tabular numerals, and give it a `Figure` that
  links to the public source it was transcribed from.
- **Do** transcribe figures exactly. `22.5 pts`, `−$188,718`, `0.219 ft`, `10.9%`, `16,009 rows` —
  nothing is rounded, embellished, or inferred, and nothing appears on the page that a linked
  repository, live report, or the résumé does not state.
- **Do** carry a source in the accessible name via `.sr-only`, not in a `title` attribute.
- **Do** keep the audit vocabulary consistent: *schedule*, *engagements*, *sign-off*, *prepared
  by*, *not cleared*, *tally*, *index*, and the closing double rule. This is a considered decision,
  reviewed and kept. Splitting it — engineering saying "roles" while markets says "engagements" —
  would break the world's single addressing language to dodge the lowest-salience text on the
  page. The audit-versus-accounting frame is carried by the figures, which point the right way.
- **Do** declare a prose container's `font-size` on the same element as its `ch` measure.
- **Do** state a new prohibition's contrast against `--stock-band` when the text will sit on a
  banded row, which most small text does.
- **Do** address new pages with an index (`A-`, `W-`, `R-` families) and reach them with a
  `CrossRef`.
- **Do** keep limits and caveats in the record. The disclosure note and the margin rail's "what is
  not done" are content, not disclaimers, and are never collapsed, faded, or moved to a footer.

### Don't:
- **Don't** use cards, a three-up project grid, or any floating rounded box as page structure.
- **Don't** add a shadow, gradient, blur, or glow. Depth comes from three stock tones and a rule.
- **Don't** introduce a third accent color, or use red to point and blue to state.
- **Don't** band a section for visual variety. Banding marks a record row.
- **Don't** use a unicode glyph or an icon font where a mark belongs; draw the path.
- **Don't** make a mark's visibility depend on a script or an observer. Marks rest fully drawn;
  animation may only replay a stroke that is already there.
- **Don't** animate anything beyond the tick legend's draw-on and the small state transitions
  already in the system (0.18–0.2s border, color, opacity, and the figure tick's press).
- **Don't** tint the index tab's field to strengthen the manila; the tab's color lives on its
  border for a measured contrast reason.
- **Don't** let content bleed to the viewport edge, and don't let the page scroll horizontally —
  a wide table scrolls inside its own wrapper.
