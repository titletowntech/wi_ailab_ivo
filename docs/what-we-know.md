# What We Know

Source: **IVO — Discovery and Architecture**, July 31 2026, 57 min.
Participants: Daniel Boehm, Ansuman Sasmal (MS) · Eric Christensen, Cody Hawkins, John McCall (IVO).

Everything here is from the transcript. Anything not stated there is marked `UNKNOWN`.

---

## 1. The baseline — where the time actually goes

Cody's own estimates, for a **typical** customer:

| Phase | Time | Share |
| --- | --- | --- |
| Discovery meetings | 2h typical (up to **30h** for Kramer North America) | ~2–15% |
| Sifting data / finding edge cases / planning the mapping | **~40h** ("a week to sift through all of the data to make sure we're not missing any edge cases") | ~25% |
| Building the flows | **~40h** | ~25% |
| **Test + debug + rework** | **1–2 days per flow × 7+ flows = 56–112h** | **~40–50%** |
| **Total** | **~140–220h per customer** | |

**7 flows minimum for a typical customer**: jobs, equipment, employees, job codes (+3).

### What this means

- **Discovery is the smallest bucket.** Even the pathological case (KNA, 30h) is a fraction of the 56–112h spent testing.
- **Test/debug is the single biggest bucket**, and it's driven by flow count × slow round-trip, not by difficulty.
- The 40h of "sifting through data" is largely **mechanical data profiling**, not analysis: nulls vs. empty strings, two phone number fields, which fields are actually populated, what formats come through.

### Business driver (Eric)

> "This is taking all of our development time to onboard new customers, so we're not doing new feature development."

**2 developers.** Onboarding consumes the whole engineering capacity. That's the actual problem.

Cody rated the value of better mapping tooling **8/10** — framed as *"at least something to start with… would probably accelerate the build process."* That's the bar. A starting point, not a transformation.

Secondary driver: existing customers are on an **old format**; migrating them is currently too time-consuming to justify.

---

## 2. Trimble App Xchange — confirmed capabilities

### Confirmed limits

| Finding | Detail |
| --- | --- |
| **No flow export/import** | Daniel: *"is there a way to export the list of the flows with all the flow configurations to JSON?"* → Cody: **No.** "Everything inside of here just kind of lives in the cache." |
| **No backup** | Confirmed — there is no backup of flow configuration at all. |
| **No known programmatic flow create/read API** | Cody: *"That I don't know… I don't think so. Most of this you have to do by hand."* → `UNKNOWN`, pending API docs. |
| **Extremely click-heavy** | Repeatedly confirmed. Eric: *"I don't think I really understood how many button clicks and different windows there are in here."* |

### Confirmed escape hatches — these matter

| Hatch | Detail | Why it matters |
| --- | --- | --- |
| **On-demand flow → CSV export** | Cody: *"If we did want to export any data, you have to create an on-demand flow to export that to CSV."* | **This is the data extraction path.** The generated CSV downloads locally and contains the full dataset, not a paginated subset. KNA samples are under `customers/KNA/`. |
| **Run logs contain flow structure** | *"It gives you the actual structure of the flow that ran at the time"* — with results and configurations. | A per-run **read** path to flow definitions. Possible route to backup/diff/documentation. |
| **Connector schemas available as JSON** | Connectors section exposes schemas and data objects with field descriptions, relations, and formatting notes. Cody: *"usually these have a description of what this is and what it relates to and any formatting that it comes in as."* | **The declared-semantics half of automated mapping.** Pairs with profiler output (observed semantics) — disagreements between the two are the highest-value signal. |
| **IVO's own system is an App Xchange connector** | Cody pointed a lookup step at IVO in the demo. | **Confirmed Aug 5:** its schema is retrievable as JSON in the same shape as the ERP connector schema. The shared Equipment contract is under `reference/ivo/equipment/`. |
| **App Xchange Connector SDK is in use** | Confirmed by Cody. | `UNKNOWN`: what it actually covers. Read the docs. |

### Platform mechanics

| Concept | Behaviour |
| --- | --- |
| **Triggers** | `cache event` (hourly batch; create/update; filterable; event origin selectable) · `on demand` (schema-less) · `work item request` (batched, with timeout + batch limit) |
| **Cache writers** | Pull ERP data on a schedule. First real connection test. Job history shows records pulled + inserts/updates/deletes; errors show a stack trace (commonly a missing UUID). |
| **Jobs** | Sequence numbers control order. Convention: IVO cache first, then Vista cache, so lookups have current data. Same sequence number = parallel. Cody offsets by ~15 min. |
| **Configurations** | Typed: string, string[], decimal, decimal[], integer, integer[], boolean. Support validations, defaults, options. Mapped to *named configurations* in the Integration Builder. **This is the built-in parameterization mechanism.** |
| **Features vs. Flow Templates** | Changes to **features** propagate to all connected customer workspaces automatically. Changes to **flow templates** do **not** — the customer must remove and re-add the feature, or you edit inside their workspace. |
| **Sync** | After any job/feature change: hit sync in the builder, **then** go into each customer account → Integrations → sync. Per-account, manual. |
| **Integration states** | `onboarding` (manual runs, cache writer doesn't fire events — the safe test mode) · `active` (job schedule running) · `maintenance` |
| **Versioning** | Flows have staging and main. A dropdown allows reverting. Staging only runs on manual runs; triggers fire against main. |
| **JS runtime** | JavaScript with **Lodash** and **DayJS** built in. |
| **Cache Explorer** | Where the devs "live all the time." Verifies what arrived, structure, actions performed, flows triggered. |
| **Debug path** | Flow → Runs → open the run → stack trace, exceptions, responses. Many clicks. |

### Systems

- **Vista Viewpoint** and **Spectrum** — native Trimble connectors, cloud and on-prem. Primary focus.
- **Sage 100 / 300** — also via App Xchange today, but Eric would consider moving off it eventually. Not now.
- Non-connected ERPs are built entirely outside App Xchange.

> **Update, Sep 9 2026 (Cody, not from the transcript):** IVO is currently connected to
> **five** ERPs through App Xchange — Vista, Spectrum, Foundation, Sage 100 Contractor, and
> Sage 300 CRE. Foundation was not mentioned in the July 31 meeting, and the "Sage 100 / 300"
> line above resolves to Sage 100 Contractor and Sage 300 CRE. Documentation for the three
> newly named systems is still being gathered; no reference material is captured for them
> yet. See [Connected source systems](../.claude/skills/appxchange-flow-design/references/connector-capabilities.md)
> for the current state.

---

## 3. Known traps (from IVO's experience)

| Trap | Example |
| --- | --- |
| **UI label ≠ backend field** | The screen says "job title" but the data actually lives in a phone number field. Screenshots don't map cleanly to the API. |
| **Custom fields** | Kramer North America has "tons of custom fields." Main source of per-customer variance. |
| **Undeclared user behaviour** | A PM copied and edited an existing job instead of creating a new one → broke the flow, because no create event fired. |
| **Hidden org structure** | *"Oh, actually we have three different companies in our system"* — for payroll, surfaced late, from people who weren't in the original meetings. |
| **The 25/75 problem (Eric)** | *"25% of what we see here… now let's talk about the other 75%."* Customers describe the happy path and don't know their own edge cases. |
| **Post-build changes** | Customers see real data and then want different fields — after the flow is built. |

---

## 4. Open items from the meeting

| Item | Owner | Status |
| --- | --- | --- |
| Isolated sandbox / dev access (must **not** expose IVO customer data) | Cody | Requested |
| App Xchange documentation link | Cody | Sent — **not yet reviewed** |
| Additional real examples (mappings, JS, failed runs) | Cody | Offered, not yet requested specifically |
| Next sync | All | **Wed Aug 5, 9:00 AM Central** |

---

## 5. Still `UNKNOWN` — worth answering, cheaply

| # | Question | Why | Effort |
| --- | --- | --- | --- |
| U-2 | Does any documented API expose cache data or flow definitions? | Would remove the CSV workaround | Read the docs Cody sent |
| U-3 | What does the Connector SDK actually cover? | May offer more than the UI suggests | Read the docs |
| U-6 | Can staging flows be run on demand with arbitrary input payloads? | Determines how fast the inner test loop can get | Ask Cody / test in sandbox |
| U-7 | What does the "old format" for existing customers mean concretely? | Sizes the migration opportunity Eric cares about | Ask Eric — 15 min |

### Resolved Aug 5

- **U-1:** On-demand CSV exports download locally. The supplied equipment files contain all data, not a page-limited sample.
- **U-8:** IVO connector schemas are retrievable as JSON in the same shape as ERP connector schemas. Cody supplied sample schemas for both sides.
- **U-4:** *"For most customers, the data is usually pretty consistent, but the workflows themselves are very different."* The 7 flows are **not** ~80% identical — the per-customer variance is in the workflow/orchestration logic, not the underlying data. This weakens the "typed Configurations templating" argument as the bigger lever, and supports staying focused on data-mapping tooling (`data-comparer`/`mapping-suggester`): the part that's actually consistent and reusable across customers is the mapping, not the flow logic.
- **U-5:** *"Thinking is much less. But when there is an error, it takes a long time to fix."* Most of the 1–2 days per flow is not spent thinking — it's the debug/fix cycle once something breaks. This confirms a fast local test loop (S7/S9) is the right lever: shrinking the "long time to fix" is exactly what running transforms against real exported rows in Node, instead of through App Xchange's click/sync/run-log path, would do.
