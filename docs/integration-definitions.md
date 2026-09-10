# Integration Definitions

One App Xchange integration definition per ERP connector: its **features** (and the
cache-writer services on them), its **job schedules**, and its **integration
configurations**.

This is the layer above customer workspaces. A customer workspace holds the flows authored
for one customer; an integration definition holds the shared structure that syncs into every
customer workspace on that connector. Each ERP is a separate integration because each
connector exposes a different set of services.

Open it from the workbench home page, or directly at
`http://127.0.0.1:43129/integrations?connector=<connector-key>`.

## Where it lives

```text
integrations/
  vista/definition.json
  spectrum/definition.json
  foundation/definition.json
  sage-100-contractor/definition.json
  sage-300-cre/definition.json
```

Connectors are discovered from the captured object folders, preferring `reference/<system>/`
and falling back to `reference-sources/<system>/`. A connector with no captured objects does
not appear, and adding a folder is all it takes to add a sixth ERP.

A definition file is created on the first save. An ERP with no file yet opens as an empty
definition rather than an error.

## Definition shape

```json
{
  "schemaVersion": 1,
  "connector": { "key": "vista", "name": "Vista" },
  "name": "Vista integration",
  "description": "",
  "features": [
    {
      "name": "Equipment sync",
      "description": "Vista equipment into IVO equipment, resolving groups and divisions.",
      "status": "active",
      "services": [
        { "connector": "IVO", "module": "IVO", "object": "Equipment", "description": "Existing-record check", "template": false },
        { "connector": "Vista", "module": "Equipment Management", "object": "equipment", "description": "Trigger source", "template": true }
      ],
      "flows": ["Sync Vista equipment to IVO"]
    }
  ],
  "schedules": [
    {
      "name": "Hourly equipment sync",
      "interval": 1,
      "intervalType": "Hour",
      "activeOnSync": true,
      "jobs": [
        { "kind": "service", "connector": "IVO", "module": "IVO", "object": "Equipment", "flow": "", "sequence": 5 },
        { "kind": "service", "connector": "Vista", "module": "Equipment Management", "object": "equipment", "flow": "", "sequence": 10 },
        { "kind": "flow", "connector": "", "module": "", "object": "", "flow": "Sync Vista equipment to IVO", "sequence": 30 }
      ]
    }
  ],
  "configurations": [
    { "key": "ivoCompanyId", "title": "IVO company ID", "type": "integer", "description": "", "required": true, "options": "", "validation": "" }
  ],
  "updatedAt": "2026-09-09T01:52:52.531Z"
}
```

Features, schedules, and configurations are identified by `name`, `name`, and `key`
respectively — the same convention the workspace uses for flows. Renaming one is how you
rename it everywhere, so update any schedule job that references it.

### Features

`status` is one of `under-construction` (default), `active`, `deprecated`, or `archived`.
Only `archived` changes behavior: an archived feature does not sync to a workspace.

Services are cache writers only. Action processors are unmanaged — Real Time Action
Processing creates them when a flow runs a Connector Action step — so they are never listed
here. The service picker offers this connector's objects **and** IVO's, because every flow
does an IVO lookup to decide add versus update plus one per foreign key.

The picker narrows by **connector, then module, then data object**, and a service is
identified by all three (`IVO/Headquarters/Company_Division`). Connector first is not
cosmetic: IVO's modules are grouped by `reference/ivo/modules.json` into Equipment
Management, Headquarters, Payroll, and Project Management, and every one of those names is
also a Vista and Spectrum module name. Module alone is ambiguous — Vista's Headquarters holds
25 of its own objects and none of IVO's.

`flows` names the flows authored for the feature. It exists so schedules can reference
on-demand flows; the flow definitions themselves live in each customer workspace.

### Job schedules

Lower `sequence` runs first; equal numbers run in parallel. `interval` plus `intervalType`
(`Minute`, `Hour`, `Day`) set the cadence.

### Configurations

These are integration configurations, which customer flow configurations map onto. `key` is
immutable in App Xchange once flows are mapped to it, so treat renaming as creating a new
configuration. The seven App Xchange types are string, string[], decimal, decimal[], integer,
integer[], and boolean.

## What the workbench validates

Blocking findings mark the offending item in the rail and the editor. Warnings are advisory.
Findings are recomputed on every save; the Validation button opens the full list.

| Severity | Rule | Source |
| --- | --- | --- |
| Blocking | Feature, schedule, and configuration names/keys are required and unique | Workbench |
| Blocking | A service must name a data object the connector actually exposes | Workbench |
| Blocking | A feature must not add the same service twice | App Xchange docs |
| Blocking | A scheduled service must exist on a non-archived feature; a scheduled flow must be listed on a feature | App Xchange docs |
| Blocking | A schedule cannot run more often than every 15 minutes | App Xchange docs |
| Blocking | A configuration key must start with a letter and contain only letters, numbers, and underscores | App Xchange docs |
| Warning | A service cached by more than one feature — reuse one instead | App Xchange docs |
| Warning | ERP services sequenced at or below IVO services — cache IVO first | IVO convention, [Service composition](service-composition.md) |
| Warning | A feature with no services or flows; a schedule with no jobs; a configuration with no title | Workbench |

The ordering warning is the one worth reading twice. Every flow resolves IVO lookups against
the cache, so an ERP object cached before IVO produces duplicate records in production while
passing every test. See [Service composition](service-composition.md) for why.

## What this does not do

It records the intended integration structure; it does not talk to App Xchange. There is no
create or read API for flows, features, or schedules, so the definition is still entered by
hand in the Integration Builder. This file is the reviewable source of record and the
checklist for that entry — and the backup App Xchange does not provide.

Remember that changes to a **feature** propagate to connected customer workspaces
automatically, but changes to a **flow template** do not, and a schedule modified inside a
workspace is never overwritten by a later sync.
