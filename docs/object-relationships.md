# Object Relationships

How IVO objects relate to each other, how source ERP objects relate to them, and how that
graph decides which flows can be combined into a single flow that calls callable flows from
one cache trigger.

**Status: awaiting authoritative content.** The tables in sections 2 and 3 are seeded only
with relationships that an approved or generated flow already relies on. Everything else is
to be supplied by IVO. Do not treat an absent row as evidence that no relationship exists.

## Why this document exists

`reference/ivo/<Object>/field-catalog.csv` has a `reference_object` column intended to hold
exactly this information, and it is effectively empty — populated for 8 of 416 fields, and
those 8 turn out to be column-shift artifacts from unquoted commas in description text, not
real values. So the relationship graph has no machine-readable home yet.

This file is the interim home. Once the relationships here are confirmed, they can be
backfilled into `reference_object` and this document becomes the human-readable view.

Three things depend on the graph:

1. **Which lookups a flow needs.** Every foreign key the mapping populates is one
   `getdatafromcachev2` step.
2. **What order flows must run in.** A child object cannot be written before its parent
   exists in IVO.
3. **Which flows can share a cache trigger.** Covered in section 4.

---

## 1. How to record a relationship

One row per foreign key. Column meanings:

| Column | Content |
| --- | --- |
| `From object` | The IVO object holding the field, exactly as named under `reference/ivo/` |
| `Field` | The field name, exactly as in `schema.json` |
| `To object` | The IVO object the field points at, or an external system of record |
| `To key` | The field on the target that the value matches — usually the target's primary key |
| `Cardinality` | `one` or `many` from the perspective of `From object` |
| `Required` | `yes` if the target must exist before the record can be written |
| `Resolved by` | `lookup` (cache lookup), `configuration` (a flow config value), `constant`, or `none` |
| `Confirmed` | `IVO`, `flow`, `mockup`, or `derived` — defined under the table in section 2 |

`Resolved by` is the column that changes flow design, so fill it deliberately. See section 3
for why some fields can never be a lookup.

---

## 2. IVO internal relationships

Seeded rows only. **To be completed by IVO.**

| From object | Field | To object | To key | Cardinality | Required | Resolved by | Confirmed |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `Equipment` | `equipmentGroupId` | `Equipment_Group` | `equipmentGroupId` | one | | lookup | flow |
| `Equipment` | `equipmentManufacturerId` | `Equipment_Manufacturer` | `equipmentManufacturerId` | one | | lookup | flow |
| `Equipment` | `currentTrackVoJobId` | `Job` | `jobId` | one | no | lookup | flow |
| `Equipment` | `divisionId` | `Company_Division` | `divisionId` | one | | lookup | IVO |
| `Equipment` | `defaultEquipmentCodeId` | `Equipment_Pay_Class` | `equipmentCodeId` | one | | lookup | IVO |
| `Equipment` | `organizationId` | `Company_Organization` | `organizationId` | one | conditional | lookup | IVO |
| `Equipment` | `companyId` | — external — | | one | yes | configuration | flow |
| `Equipment` | `createdByUserId` | — external — | | one | | configuration | flow |
| `Employee` | `divisionId` | `Company_Division` | `divisionId` | one | | lookup | IVO |
| `Employee` | `employeeGroupId` | `Group` | `employeeGroupId` | one | | lookup | IVO |
| `Employee` | `defaultLaborCodeId` | `Employee_Pay_Class` | `laborCodeId` | one | | lookup | IVO |
| `Employee` | `assignedToUserId` | `Linked_User` | `id` | one | | lookup | IVO |
| `Job_Cost_Code` | `jobId` | `Job` | `jobId` | one | yes | lookup | IVO |
| `Job_Item_Code` | `jobId` | `Job` | `jobId` | one | yes | lookup | flow |
| `Job_Link_Code` | `jobId` | `Job` | `jobId` | one | yes | lookup | mockup |
| `Job_Link_Code` | `costCodeId` | `Job_Cost_Code` | `costCodeId` | one | yes | lookup | mockup |
| `Job_Link_Code` | `itemCodeId` | `Job_Item_Code` | `itemCodeId` | one | yes | lookup | mockup |
| `Linked_User` | `employeeId` | `Employee` | `employeeId` | one | yes | lookup | mockup |
| `WorkOrder_Status` | `workOrderId` | `WorkOrder` | `workOrderId` | one | yes | lookup | IVO |
| `WorkOrder_PM_Performed` | `workOrderId` | `WorkOrder` | `workOrderId` | one | yes | lookup | IVO |
| `Work_Order_Assignment` | `workOrderId` | `WorkOrder` | `workOrderId` | one | yes | lookup | IVO |
| `Equipment_PM_Performed` | `workOrderId` | `WorkOrder` | `workOrderId` | one | | lookup | IVO |

**`Equipment.organizationId` is conditional.** It is only used when the customer connects
more than one company through their ERP. For a single-company customer, leave it null rather
than resolving it, and confirm which case applies during discovery.

**Every object carrying a `workOrderId` links to `WorkOrder` on `workOrderId`.** The one
exception in the `WorkOrder_*` family is `WorkOrder_Substatus`, which has no `workOrderId` —
the relationship runs the other way, `WorkOrder.substatusId` pointing at it. Note that
`Equipment_PM_Performed` also carries `workOrderId` despite not being named `WorkOrder_*`.

`Confirmed` values in this table, weakest last:

- `IVO` — confirmed by IVO (Cody Hawkins, Sep 9 2026).
- `flow` — a flow in a customer workspace under `customers/*/workspace/draft.json` depends on
  it. Still generated evidence, not an IVO confirmation.
- `mockup` — appears only in `mockups/workspace-tree.html`, which encodes flows observed in a
  demo of IVO's existing integration. Real behavior, but transcribed by hand and not
  reviewed.
- `derived` — inferred from field naming alone. Treat as a question, not a fact.

Fields worth explicit rows because they are ambiguous from naming alone, and are currently
open review questions in the customer workspaces:

| Field | On | Open question |
| --- | --- | --- |
| `lastHourMeterId`, `lastOdometerId` | `Equipment` | Both point at `Meter.meterId`? Unresolved in KNA |
| `divisionId` | `Job`, `Linked_User` | Confirmed as `Company_Division` on `Equipment` and `Employee` — assume the same here, or confirm |
| `startStatusId`, `endStatusId` | `Equipment_Status` | `Company_Equipment_Status`? |
| `substatusId` | `WorkOrder` | `WorkOrder_Substatus.subStatusId`? |
| `jobId` | `Equipment_Pay_Class`, `Employee_Pay_Class` | `Job.jobId`? Both pay-class objects carry it |
| `jobOperatorLaborCodeId` | `Equipment_Pay_Class` | `Employee_Pay_Class.laborCodeId`, by analogy with `defaultLaborCodeId`? |
| `assignedToUserId` | `Work_Order_Assignment` | `Linked_User.id`, as confirmed for `Employee.assignedToUserId`? |
| `hourMeterId`, `odometerId` | `WorkOrder` | `Meter.meterId`? |
| `setupId` | `Equipment_PM_Performed`, `WorkOrder_PM_Performed` | `Equipment_PM_Setup.setupId`? |

---

## 3. Fields no cached object can resolve

`reference/ivo/` contains 28 objects. It has **no `Company` object and no `User` object**, so
`companyId` and `createdByUserId` cannot be resolved with a cache lookup no matter how the
graph is drawn.

That is exactly why every flow in every customer workspace carries `ivoCompanyId` and
`createdByUserId` as **configurations** rather than lookup steps.

The general rule: if an `*Id` field's owning object is not a cached IVO object, it must come
from a configuration, a constant, or be left null — never a lookup. When you add rows to
section 2, mark these `Resolved by: configuration` so nobody designs a lookup step for them.

Other `*Id` fields with no owning object in `reference/ivo/` today, which likely belong in
this category — **to be confirmed**: `companyRoleId`, `vendorId`, `jobTypeId`,
`equipmentClassId`, `pmTypeId`, `costCodeTemplateId`, `mshaEqInspectionTemplateId`,
`fromLocationId`, `toLocationId`, `assignedToUserId`, `updatedByUserId`, `deletedByUserId`.

---

## 4. Source ERP to IVO object mapping

Which source object feeds which IVO object, per connected system. This is what determines
trigger sharing, so it needs a row per source object actually in use.

IVO is connected to Vista, Spectrum, Foundation, Sage 100 Contractor, and Sage 300 CRE. Only
Vista and Spectrum have captured reference material.

| Source system | Source object | IVO object written | Also needs cached | Confirmed |
| --- | --- | --- | --- | --- |
| Vista | `Equipment Management/equipment.json` | `Equipment` | `Equipment_Group`, `Equipment_Manufacturer`, `Job` | flow |
| Vista | `Equipment Management/categories.json` | `Equipment_Group` | | flow |
| Vista | `Equipment Management/departments.json` | `Company_Division` | | flow |
| Vista | `Equipment Management/revenue_codes.json` | `Equipment_Pay_Class` | | flow |
| Vista | `Job Cost/jobs.json` | `Job` | | flow |
| Vista | `Job Cost/contract_items.json` | `Job_Item_Code` | `Job` | flow |
| Spectrum | `Payroll/Employees/employees.json` | `Employee` | | flow |
| Foundation | | | | |
| Sage 100 Contractor | | | | |
| Sage 300 CRE | | | | |

---

## 5. What the graph decides

### Write order

A child cannot be written before its parent exists in IVO. The graph gives the order
directly:

- `Job` before `Job_Cost_Code` and `Job_Item_Code`, both before `Job_Link_Code`
- `Equipment_Group`, `Equipment_Manufacturer`, `Company_Division`, `Equipment_Pay_Class`, and
  `Company_Organization` before `Equipment`
- `Company_Division`, `Group`, `Employee_Pay_Class`, and `Linked_User` before `Employee`
- `Employee` before `Linked_User`
- `WorkOrder` before every object carrying a `workOrderId`

Note the cycle between `Employee` and `Linked_User`: `Linked_User.employeeId` needs the
employee, and `Employee.assignedToUserId` needs the linked user. Neither can be fully
populated on first write. Resolve it by writing the employee first, then the linked user,
then updating the employee's `assignedToUserId` — which is part of why the two are bundled
into one flow (section 6).

This is the same ordering that drives cache-writer service sequencing — see
[Service composition](service-composition.md). Reference data first, transactional data
after.

### Lookup count per flow

Count the `Resolved by: lookup` rows for the target object and add one for the
existing-record check. That is the number of `getdatafromcachev2` steps the flow needs, and
each one is memory against the 2.5 GB per-run limit, so constrain every filter.

---

## 6. Combining flows under one cache trigger

A cache-event trigger fires per **source data object**. Two IVO objects fed by the *same*
source object therefore compete for the same trigger, and that is the case this section
addresses.

The project rule: do not reuse one cache trigger for unrelated operations. Where operations
genuinely share a trigger, write **one triggered flow** that calls **named callable flows**
with explicit inputs, rather than two flows on the same trigger or one flow doing everything.

### When to combine

| Situation | Design |
| --- | --- |
| Two IVO objects, same source object, related in the graph (parent/child) | **Combine.** One triggered flow, callable flow per object, called in graph order |
| Two IVO objects, same source object, unrelated in the graph | **Combine the trigger only.** One triggered flow that calls each callable flow independently. Do not interleave their logic |
| Two IVO objects, different source objects | **Keep separate.** They have separate triggers and separate cadences |
| The same resolve-and-write work needed by two or more parent flows | **Extract a callable flow**, regardless of triggers |
| One source record fanning out to many child records | Triggered flow → **For Each in a List** → callable flow per item |

Start from the bundles below rather than deriving a grouping from scratch — they are what IVO
already does.

### Bundles IVO uses today

Confirmed by IVO, Sep 9 2026:

| Bundle | Why it bundles | Notes |
| --- | --- | --- |
| **Job codes** — `Job_Cost_Code`, `Job_Item_Code`, `Job_Link_Code` | Most of the data for each is already carried on the source job phase / project phase / cost code object, so one source record supplies all of them | The default. Run them created-or-updated together in one flow |
| **Employee + `Linked_User`** | `Linked_User` is *fully dependent* on the employee being created or updated first | Bundle these two. Do not give `Linked_User` its own trigger |
| **Equipment family** | One equipment source record supplies the related equipment objects | Bundleable, but read the cache-latency warning below before doing it |
| **Pay classes** — `Equipment_Pay_Class`, `Employee_Pay_Class` | When a customer uses pay classes, the relevant class must be resolved during the same run | These are **lookups, not writes**. Include the lookup in the run; do not bundle a write |

Whether a customer uses pay classes at all is a discovery question. Confirm it before adding
the lookup steps.

### The cache-latency trap

**A record this flow just created in IVO is not in the App Xchange cache yet.** The cache
only updates on the next cache-write run of that IVO object. So within a bundled flow — or in
any flow run before the next cache write — a lookup for a record the integration created
moments ago returns nothing.

This is the thing that breaks bundles. It bites when a subsequent source entry arrives
referencing a parent that exists in IVO but is not yet cached: the child lookup misses, and
the flow either creates a duplicate or fails.

Two ways to handle it, in order of preference:

1. **Pass the identifier forward inside the run.** Take the id from the creating step's
   `flow.step('add-x').actionResponse` and hand it to the dependent step or callable flow
   directly. Never re-look-up something you just wrote.
2. **Accept the gap deliberately.** If a later-arriving record cannot get its parent id from
   the same run, it will not resolve until the next cache write. Decide whether it should
   fail loudly with a Stop step, or be skipped and retried on the next run — and say which
   in the flow's description.

IVO's guidance is to **bundle at your own discretion**: the wider the bundle, the more
in-run dependencies you take on, and each one is a place this trap can appear.

### Shape of a combined flow

```
Trigger: cache event on <source object>, filtered to eligible records
  1. code      validate required source fields
  2. callflow  "Sync <parent object>"   -> returns parent id via its Stop step
  3. if        parent write succeeded
  4. callflow  "Sync <child object>"    -> input includes the parent id from step 2
  5. stop      explicit result status and message
```

The parent's id has to travel through the Call a Flow step's input for two reasons: a
callable flow cannot see the caller's steps, and the parent is not in the cache yet to be
looked up.

### Mechanics that constrain the design

These come from `docs/app-xchange-help-markdown/flows--callable-flows.md`,
`flows--flow-steps--call-a-flow-step.md`, `flows--flow-steps--for-each-in-a-list-flow-step.md`,
and `flows--triggers--add-a-cache-event-trigger.md`:

- A callable flow **sees nothing but its declared input.** It cannot read the parent's steps
  and it cannot read the parent's configurations. Give it its own configurations or pass the
  values in.
- Its input schema is **JSON Schema v7**, defined on its trigger as Custom Schema. Anything
  not in the schema does not arrive.
- It **returns data only through a Stop step** — Result Status, Message, and Details all flow
  back to the caller. Include a Stop step for **every** exit path or the caller gets nothing
  back. A Failure status surfaces as `__Status` 400.
- A callable flow **runs independently** of its caller.
- **For Each in a List** processes items in parallel and acts as a called flow for its
  children: nested steps can see only the For Each input, flow configurations, and other
  nested steps. Output order matches input order.
- **Pass as little as possible** into a Call a Flow or For Each step. Constrain the lookup
  that feeds it and return only the properties the callee uses.
- Put whole-record eligibility tests in the **trigger filter expression**, not a first `if`
  step — filtered runs never execute, so they cost nothing. The sandbox allows 250 ms and
  5 MB, requires an explicit `return`, and needs optional chaining because cache payloads
  vary.
- Fields with **leading underscores** never fire change detection, so they cannot drive a
  cache-event trigger. Adding a new property, however, triggers change detection on *every*
  record — expect a flood of flow runs after a schema change.

### Naming

Name a callable flow for what it does to one object, so its role is obvious at the call site:
`Resolve IVO linked user`, `Sync IVO job item code`. Name the triggered flow for the source
object it watches.

---

## 7. How to extend this file

- **Adding confirmed relationships**: fill in section 2, set `Confirmed` to `IVO`, and
  correct any seeded row that turns out to be wrong. Seeded rows are marked `flow` or
  `mockup`, meaning something depends on them — not that IVO confirmed them.
- **A new source system**: add its rows to section 4 once its objects are known.
- **A relationship that changed a flow's design**: note it in section 5 or 6, since that
  reasoning is invisible in the flow JSON.
- **Once section 2 is confirmed**, backfill `reference_object` in the field catalogs and note
  here that the CSV is authoritative. Parse those CSVs with `tools/csv.js` rather than
  splitting on commas — description text contains commas.

Never promote a relationship observed at one customer into a general rule.
