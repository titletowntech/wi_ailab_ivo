---
name: appxchange-flow-design
description: Design and author Trimble App Xchange flows for an IVO customer onboarding. Use when creating, extending, or reviewing flows in customers/<KEY>/workspace/draft.json; deciding which cache-writer services and job sequence an integration needs; choosing triggers, step topology, or callable flows; or checking what a source ERP connector (Vista, Spectrum) and IVO can actually provide. Triggers on "build a flow", "add a flow", "flow design", "which services do we need", "cache event trigger", "callable flow", "sync <object> to IVO".
---

# App Xchange Flow Design

Author flows for one customer as canonical workspace JSON so the local workbench can
validate them and a reviewer can approve them. The JSON is the deliverable; App Xchange
has no flow import, so a human rebuilds the approved flow in the UI by hand.

## Non-negotiable rules

1. **Never invent a source field, IVO field, or connector action.** Every one must trace to
   a file under `reference/`, `reference-sources/`, or the customer's approved mapping.
2. **Generated evidence and reviewer decisions stay separate.** Write to
   `customers/<KEY>/workspace/draft.json`. Never edit `generated.json`, `approved.json`, or
   anything in `revisions/`.
3. **Unresolved decisions become `reviewQuestions`, not guesses.** A plausible default that
   nobody confirmed is a question. Say what you assumed and why it needs confirmation.
4. **Do not change customer CSVs, mapping evidence, or reference contracts** while authoring
   flows.

## Step 1 — Establish customer context

Read, in this order, and stop to ask if any is missing:

| Source | What it tells you |
| --- | --- |
| `customers/<KEY>/workspace/draft.json` | Flows that already exist, their naming and step conventions, open review questions |
| `customers/<KEY>/*/output/approved-mapping/mapping.csv` | The only authoritative field mappings. Absent means the object is not ready for a flow |
| `customers/<KEY>/*/output/mapping-proposal/questions.md` | Unresolved fields you must carry into `reviewQuestions` |
| `customers/<KEY>/*/output/mapping-proposal/context-review.md` | Business rules from discovery documents and transcripts |
| `customers/<KEY>/*/input/context/`, `customers/<KEY>/input/context/` | Customer-specific behavior no schema shows |
| `docs/object-relationships.md` | How IVO objects relate, write order, and which fields are configurations rather than lookups |
| `docs/what-we-know.md` | Platform constraints and known traps confirmed with IVO |

Identify the source ERP from the existing flow triggers and the object schemas under
`customers/<KEY>/*/input/erp/schema.json`. Vista and Spectrum behave differently — see
`references/connector-capabilities.md`.

**Do not author a flow for an object with no approved mapping.** Report which objects are
ready and which are blocked, then build the ready ones.

## Step 2 — Inventory what the connectors can do

Before designing anything, confirm each object you intend to read or write actually exists
on the relevant connector. Read `references/connector-capabilities.md` for the lookup
paths, the Vista/Spectrum asymmetry, and how to handle IVO action paths.

A flow you cannot support with a declared object and a declared action is a finding to
report, not a flow to write.

## Step 3 — Decide services and the job sequence

Flows do not read the ERP directly; they read the App Xchange cache, which a **cache-writer
service** fills on a schedule. Getting the service split and sequence wrong is the most
common cause of flows that pass tests and fail in production.

Read `docs/service-composition.md` — the project knowledge base for how services are
composed for IVO customers. It carries the composition rules, the standard IVO service set,
and per-customer observed practice.

Append what you learn to that file whenever you discover a new customer's service layout, a
sequencing constraint, or a service that had to be split or combined. It is a living record.

## Step 4 — Decide flow topology

Read `docs/object-relationships.md` first. The object graph decides how many lookups a flow
needs, what order objects must be written in, and which flows can share a cache trigger. It
also records which foreign keys can never be resolved by a lookup because no cached IVO
object owns them — `companyId` and `createdByUserId` are configurations for that reason.

- **One flow per source object per direction.** Keep it narrowly targeted; unrelated actions
  belong in different flows.
- **Never reuse one cache trigger for unrelated operations.** If two operations must share a
  trigger, write one triggered flow that calls named callable flows with explicit inputs.
  `docs/object-relationships.md` section 6 has the decision table and the combined-flow
  shape.
- **Extract a callable flow** when the same resolve-and-write work appears in two or more
  flows (linked users, job cost codes, and job link codes are the usual candidates). A
  callable flow has its own input schema and its own configurations — it inherits nothing
  from its caller — so pass everything it needs explicitly, and give it a Stop step on every
  exit path or the caller gets nothing back.
- **Never look up a record the same run just created.** The App Xchange cache does not update
  until the next cache-write run of that object, so the lookup returns nothing and the flow
  duplicates or fails. Take the id from the creating step's `actionResponse` and pass it
  forward. This is the main risk in any bundled flow — `docs/object-relationships.md` covers
  it and lists the bundles IVO already uses (job codes together, employee with linked user,
  pay classes as lookups only).
- **Trigger choice:** author with an on-demand trigger first. Integration state `onboarding`
  runs flows manually and does not fire cache events, so on-demand is the safe test mode and
  matches the existing repo convention (`"On-demand: one Vista equipment record"`). Move to a
  cache-event trigger only when the reviewer confirms the production trigger, and record the
  intended production trigger as a `reviewQuestion`.

Name flows the way the customer's existing flows are named — currently
`Sync <source system> <source object> to IVO <target object>`. Consistency with the
workspace beats consistency with the App Xchange documentation's longer convention.

## Step 5 — Author the flow

Follow the canonical step sequence the existing flows use. It exists because App Xchange
best practice forbids blind connector actions and because an exception terminates a flow
immediately, skipping every remaining step including the Stop step.

1. **`code` — validate required source fields.** Throw with the names of the missing fields.
   This is the only place an early throw is correct.
2. **`getdatafromcachev2` — find the existing IVO record** by its stable business key
   (usually `accountingCode`). Expect zero or one.
3. **`getdatafromcachev2` — one lookup per foreign key** the mapping resolves (manufacturer,
   group, job, division, pay class). Constrain the filter and request only the properties
   later steps use.
4. **`code` — build the payload.** Apply the approved mapping only. Preserve identifiers
   from step 2 so an update does not orphan the record. Coerce and defend every value.
5. **`if` — choose add or update.** Zero matches means add, one means update, more than one
   is a data problem you must throw on.
6. **`queueactionv3` — add or update in IVO,** returning the step-4 payload.
7. **`stop` — end with an explicit result status and message** for every exit path.

Write the JSON exactly to the canonical contract in `references/flow-json-contract.md`,
including `connector`, `details`, and honest `generation.confidence` on every step.

This sequence is the current convention, not the limit of the platform. App Xchange has
around thirty step types documented in
`docs/app-xchange-help-markdown/flows--flow-steps--*.md`, and several would replace
hand-written JavaScript with reviewable configuration — the Map step for payload building,
Filter for narrowing a lookup result, Lookup Related Data Objects for foreign keys. Less
custom code is less to test and maintain, so when a documented step makes the flow simpler,
propose it as a `reviewQuestion` rather than swapping it in silently.
`references/flow-json-contract.md` covers how to represent a step type the workspace has not
used before and which substitutions are worth making.

Payload code must code defensively — trigger data is external data:

```javascript
const source = flow.trigger.data;
const existing = flow.step('eq-check').output?.[0] ?? {};
const group = flow.step('lk-grp').output?.[0];
const text = (value) => value == null ? null : String(value).trim();
const year = Number.parseInt(text(source.ModelYr), 10);
return {
  uuid: existing.uuid ?? null,
  equipmentGroupId: group?.equipmentGroupId ?? null,
  equipmentYear: Number.isNaN(year) || year === 0 ? null : year,
  companyId: Number(flow.config.ivoCompanyId) || null,
};
```

Optional chaining on every step output, `??` for every default, an explicit `return`, and no
assumption that a lookup matched. Lodash and DayJS are available in the runtime.

## Step 6 — Record uncertainty honestly

- Every field the mapping left open, every unverified action path, and every constant that
  needs a customer answer goes in that flow's `reviewQuestions`.
- `generation.confidence` must reflect real evidence. Existing flows use ~91 for steps
  derived from schemas plus approved mappings and ~84 for connector actions whose paths are
  derived rather than verified. Do not inflate.
- A `configuration` marked `required` must carry a non-empty `defaultValue` or the workspace
  cannot be approved. If you do not know the value, mark it not required and ask.

## Step 7 — Validate

Save the draft, then check it against the workbench's own validator rather than by eye:

```bash
node tools/workbench-server.js > /tmp/workbench.log 2>&1 &
sleep 2
curl -s http://127.0.0.1:43129/api/customers/<KEY>/workspace \
  | node -e "let s='';process.stdin.on('data',c=>s+=c).on('end',()=>console.log(JSON.stringify(JSON.parse(s).validation,null,2)))"
pkill -f workbench-server.js
```

An empty array means the draft is clean. Resolve every `blocking` finding — they prevent
approval — and report the `warning` findings to the reviewer. `pkill` is the reliable way to
stop the server; `kill %1` will not find it from a different shell.

Then state plainly which flows you added, which objects you skipped and why, and what the
reviewer must answer before approval.
