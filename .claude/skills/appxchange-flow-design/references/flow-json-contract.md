# Canonical Workspace Flow JSON

The contract `customers/<KEY>/workspace/draft.json` must satisfy, and how to reach for a
flow step the existing flows have not used yet.

Enforced by `validateWorkspace` in `tools/workbench-server.js`; blocking findings prevent
approval.

## Workspace shape

```json
{
  "schemaVersion": 1,
  "customer": { "key": "KNA", "name": "KNA" },
  "name": "KNA workspace",
  "description": "Vista ERP to IVO integration blueprint for equipment and contract items",
  "provenance": {
    "generatedAt": "2026-09-08T18:21:02.312Z",
    "generator": "IVO workspace generator",
    "generatorVersion": "1.0",
    "sourceData": "customers/KNA/*/input/erp/*.csv",
    "sourceSchema": "customers/KNA/*/input/erp/*.json",
    "connectorReference": "reference/ivo/*/schema.json",
    "connectorSchemaVersion": "Repository snapshot at generation",
    "mappingEvidence": "customers/KNA/*/output/approved-mapping/mapping.csv"
  },
  "review": { "status": "generated" },
  "flows": [],
  "updatedAt": "2026-09-08T18:28:44.132Z"
}
```

`schemaVersion` must be `1` and `flows` must be a non-empty array. Keep `provenance`
accurate — it is how a reviewer traces a step back to its evidence. Leave `review.status`
as `generated` on anything you author; only the reviewer approves.

## Flow shape

```json
{
  "name": "Sync Vista equipment to IVO",
  "trigger": "On-demand: one Vista equipment record",
  "review": { "status": "generated" },
  "configurations": [],
  "reviewQuestions": [],
  "steps": []
}
```

`name` is required and unique across the workspace. `trigger` is required and is a
human-readable description, not a structured object. `steps` must be non-empty.

## Step shape

```json
{
  "id": "eq-check",
  "name": "Find existing IVO equipment",
  "type": "getdatafromcachev2",
  "description": "Preserve IVO identifiers when an equipment record already exists.",
  "details": { "Object": "Equipment", "Expected results": "Zero or one" },
  "connector": "IVO",
  "generation": {
    "confidence": 91,
    "rationale": "Generated from connector object relationships and observed source identifiers.",
    "sources": "ERP CSV profile + connector schemas"
  }
}
```

Required on **every** step regardless of type: `id` (unique within the flow), `name`,
`type`, and `connector`. `connector` is the system the step acts on — `IVO`, `Vista`,
`Spectrum`, or `App Xchange` for platform-only steps.

`details` is a free-form label/value map the workbench renders for the reviewer. It carries
everything a human needs to rebuild the step in the App Xchange UI that the canonical fields
cannot express. **This is the extension point** — a step type with no dedicated field in the
contract is still fully representable through `details`.

## Step types the validator knows

| `type` | App Xchange step | Required beyond the common fields |
| --- | --- | --- |
| `getdatafromcachev2` | Lookup | `filter` with non-empty `property`, `operator`, `value` |
| `code` | Code | `code` string |
| `if` | Conditional | `code` string returning a boolean |
| `queueactionv3` | Connector Action | `code` string returning the payload |
| `stop` | Stop Flow | none |
| `callflow` | Call a Flow | `details["Called flow"]` naming a flow in this workspace; `inputCode` string |

Every `code` and `inputCode` string must parse as a JavaScript function body — the validator
runs `new Function(script)` and a syntax error is blocking.

### Lookup filter

```json
"filter": {
  "property": "accountingCode",
  "operator": "Equals",
  "value": "return String(flow.trigger.data.Equipment).trim();"
}
```

`value` is a JavaScript expression string with an explicit `return`. Put the data object,
expected result count, properties to return, and any secondary filter in `details`.

### Connector action

```json
{
  "type": "queueactionv3",
  "details": {
    "Action path": "ivo-systems/equipment-management/1/equipment/add",
    "Use existing body": "map-equipment",
    "Wait for response": "Yes"
  },
  "code": "return flow.step('map-equipment').output;"
}
```

Build the payload once in a separate step and have both the add and update actions return
it. That leaves one mapping to review instead of two.

### Call a flow

```json
{
  "type": "callflow",
  "details": { "Called flow": "Resolve IVO linked user" },
  "inputCode": "return { employeeId: flow.step('lk-emp').output[0].employeeId };"
}
```

A missing or unknown `Called flow` is blocking; a missing `inputCode` is a warning. Supply
it anyway — a callable flow receives nothing but what you pass and cannot read the caller's
configurations.

## Using a step type not listed above

The six types above are what the workspace has used so far, **not** the platform's step
catalog. App Xchange has roughly thirty step types, each documented in
`docs/app-xchange-help-markdown/flows--flow-steps--<name>-flow-step.md`. Read the relevant
doc before designing around a step.

```bash
ls docs/app-xchange-help-markdown/flows--flow-steps--*
```

The validator only enforces type-specific rules for the six known types, so a documented
step is already representable. To add one:

1. Read its doc page and list its actual Step Inputs.
2. Set `type` to the platform type string **only if you can verify it**; the six known
   strings are the only verified ones. Otherwise use the documented step name in lower
   kebab-case and record `details["Step type unverified"]` with the doc filename.
3. Put every Step Input the doc names into `details`, using the doc's own field labels.
4. Add a `code` string when the step's inputs are JavaScript expressions, so the reviewer
   sees the logic and the validator syntax-checks it.
5. Cite the doc file in `generation.sources`, cap `generation.confidence` at 84, and add a
   `reviewQuestion` asking the reviewer to confirm the step configuration.

## Prefer the simpler platform step

The current flows hand-write JavaScript for work the platform can do declaratively. Fewer
lines of custom JS means less to test and less to maintain, so when a documented step
replaces code, propose it — as a `reviewQuestion`, since it changes what the reviewer
approves rather than something to swap in silently.

| Instead of | Consider | Why |
| --- | --- | --- |
| A `code` step assembling the IVO payload field by field | **Map JSON List or Object** (`flows--flow-steps--map-json-list-or-object-flow-step.md`) | The platform's declarative field mapper. Field-by-field mapping becomes reviewable configuration instead of a 40-line string, and the MiniMap makes it auditable |
| JS that filters a lookup result array | **Filter** (`flows--flow-steps--filter-flow-step.md`) | Keeps objects where a test expression on `flow.loopItem()` is true |
| Chained lookups walking a foreign key | **Lookup Related Data Objects** (`flows--flow-steps--lookup-related-data-objects-flow-step.md`) | Uses the connector's declared relationship instead of a hand-built join |
| JS deduplicating or aggregating a list | **Remove Duplicates**, **Group By** | Documented, no custom code |
| JS looping over records | **For Each in a List** | Runs items in parallel. It sees only its own input, flow configurations, and its nested steps — pass everything in |

Two cautions from the documentation:

- A **trigger filter expression** removes the need for an initial conditional step entirely,
  and is cheaper because filtered runs never execute. Push a whole-record eligibility test up
  into the trigger rather than into a first `if` step.
- **Assertion** steps are for testing and debugging only. Do not put them in a flow intended
  for main.
- The **Cache Write** step is a legacy feature for specific connectors. Schedule a
  cache-writer service instead.

## Configurations

```json
{
  "name": "createdByUserId",
  "type": "number",
  "required": true,
  "defaultValue": 45,
  "description": "Recovered from the observed IVO equipment add action."
}
```

`name` and `type` are required. **A `required: true` configuration with an empty
`defaultValue` is blocking** — if the value is genuinely unknown, set `required: false` and
raise it as a `reviewQuestion`.

App Xchange configuration types are string, string[], decimal, decimal[], integer,
integer[], and boolean; existing flows here use `number` for numeric values. Document each
as if training a new support person: what it is for, where the value comes from, whether it
is required. Configurations are scoped to their own flow.

## Step dependencies

Every step depends on the previous step returning `SUCCESSFUL` by default. The canonical JSON
has no dependency field, so when a step must run on a different condition, state it in
`details` for the reviewer to configure. Valid statuses are `SUCCESSFUL`, `FAILED`,
`ACTION_HANDLED_SUCCESS`, and `ACTION_HANDLED_FAILED`.

Express add/update branching in the `if` step's `details` as `True branch` and
`False branch` naming step ids, as the existing flows do.

## Flow runtime helpers

Verified accessors, for use in `code`, `filter.value`, and `inputCode`:

| Helper | Use |
| --- | --- |
| `flow.trigger.data`, `flow.trigger.event` | The triggering record and its event metadata |
| `flow.trigger.isCacheCreate()` / `isCacheUpdate()` / `isCacheDelete()` | Branch on the cache event type |
| `flow.step('step-id').output` | A previous step's output |
| `flow.step('step-id').actionResponse` / `.actionRequest` | A connector action's response or request |
| `flow.step('step-id').isActionSuccess()` / `isActionFail()` / `isQueueActionSuccess()` | Inspect an action outcome after a `queueactionv3` step |
| `flow.config.myProperty` | A flow configuration value |
| `flow.loopItem()` / `flow.mapItem()` | The current item inside a Filter, For Each, or Map step |
| `workspace.info().id` / `.name` | Workspace identity |
| `flow.todo('message')` | Force an exception with a message. Use only where writing an unconfirmed value would be worse than failing |

Lodash and DayJS are available in the runtime.

## Generation metadata

| Confidence | Meaning |
| --- | --- |
| 91 | Derived from the source profile, connector schemas, and the approved mapping |
| 84 | Connector action with a derived action path, or a step type whose configuration is unverified |

Lower it further when evidence is thinner; never raise it to make a flow look finished.
`sources` should name the actual evidence, for example
`Approved mapping + IVO action schema`, or the doc filename for a newly introduced step.

## Naming

Steps follow `<action><system><object>` — `Find existing IVO equipment`,
`Resolve equipment manufacturer`. Step ids are short, stable, kebab-case, and referenced
from other steps' code, so changing an id means updating every reference to it.
