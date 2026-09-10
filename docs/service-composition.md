# Service Composition

How App Xchange services are composed for an IVO customer integration: what a service is,
how services are split, what order they must run in, and what each customer's layout looks
like today.

This is a living record. Append what you learn whenever you discover a customer's service
layout, a sequencing constraint, or a service that had to be split or combined. See
[How to extend this file](#how-to-extend-this-file).

Platform behavior cited here comes from `docs/app-xchange-help-markdown/`. IVO-specific
convention comes from `docs/what-we-know.md` and the customer workspaces.

---

## 1. Why services decide flow design

Flows never read the ERP directly. A **cache-writer service** replicates an ERP object onto
the App Xchange platform on a schedule, and flows read that cache. So before designing a
flow you must know:

- which cache-writer service supplies each object the flow reads;
- whether that service will have run *before* the flow needs it.

Getting this wrong produces flows that pass every test and fail in production, because a
lookup returns nothing for a record that exists in the ERP but has not been cached yet.

### The two service types

| Type | Managed? | How it appears |
| --- | --- | --- |
| **Cache writer** | Managed — you add it to a feature and toggle on the data object | Replicates ERP data onto the platform. Logs to Cache Write Logs |
| **Action processor** | Unmanaged — added automatically | Created by Real Time Action Processing when a flow runs a Connector Action step. Do not add manually |

Practical consequence: **you only ever add cache-writer services.** Every IVO write in the
existing flows is a `queueactionv3` Connector Action step, which brings its action processor
with it.

---

## 2. Composition rules

These come from the App Xchange documentation and hold for every customer.

1. **One data object per service.** Enable exactly one data object per cache-writer service.
   This is the only way to control run order in a schedule — two objects on one service
   cannot be sequenced relative to each other.
2. **Never add the same service to a feature twice.** Two services processing the same data
   is a defect.
3. **Reuse an existing service before creating a new one** when the object is already cached
   by another feature.
4. **Cache only what a flow actually reads.** Remove services for objects no longer needed
   once the flows are built.
5. **Sequence dependencies explicitly.** Lower sequence numbers run first; equal numbers run
   in parallel. Cache the object a flow depends on at a lower sequence than the flow that
   consumes it.
6. **Match cadence to the object's real rate of change.** Equipment may need a daily sync
   while equipment usage needs hourly. Set the interval to at least as long as the schedule
   takes to complete — if equipment takes 20 minutes to cache and trigger its flows, do not
   schedule it every 15.
7. **Schedules cannot run more often than every 15 minutes.**
8. **Make a service a template** when customers should reuse it but customize it. Like flow
   templates, post-sync changes to a template do not overwrite workspace-level values.

### Ordering convention for IVO

**Cache IVO first, then the ERP**, so ERP-triggered flows resolve their IVO lookups against
current IVO data. IVO's practice is to offset the two by roughly 15 minutes rather than rely
on sequence numbers alone.

This matters because every flow in the canonical pattern does an IVO lookup to decide add
versus update, plus one IVO lookup per foreign key. Stale IVO cache means duplicate records.

### Propagation and sync — easy to get wrong

- Changes to a **feature** propagate to all connected customer workspaces automatically.
- Changes to a **flow template** do **not**. The customer must remove and re-add the
  feature, or you edit inside their workspace.
- After any job or feature change: sync in the Integration Builder, **then** sync inside each
  customer account under Integrations. It is per-account and manual.
- Do not create or edit services and schedules inside a customer workspace except for
  testing. A locally modified schedule cadence is never overwritten by later syncs, which
  protects the customization but means global interval changes must be applied by hand in
  every workspace.

### Integration states

| State | Behavior |
| --- | --- |
| `onboarding` | Manual runs only; the cache writer does not fire events. **The safe test mode** |
| `active` | The job schedule runs |
| `maintenance` | — |

Because `onboarding` does not fire cache events, flows are authored and tested with
on-demand triggers first. That is why every flow currently in the workspaces has an
on-demand trigger.

---

## 3. Deriving the service set from the flows

Work backwards from the flows. For each flow, list every object it reads, then map each to
the service that must cache it.

| Flow reads | Needs a cache-writer service for |
| --- | --- |
| `flow.trigger.data` from an ERP object | That ERP object (also the trigger source once on a cache-event trigger) |
| An IVO object, to decide add vs. update | That IVO object |
| An IVO object, to resolve a foreign key | That IVO object |

A flow that resolves four foreign keys therefore depends on up to six cached objects. Each is
a separate service, and all of them must sit at a lower sequence than the flow.

Worked example — `Sync Vista equipment to IVO` (KNA, 10 steps):

| Object | System | Reference | Purpose |
| --- | --- | --- | --- |
| `equipment` | Vista | `reference/vista/Equipment Management/equipment.json` | Trigger source |
| `Equipment` | IVO | `reference/ivo/Equipment/` | Existing-record check |
| `Equipment_Manufacturer` | IVO | `reference/ivo/Equipment_Manufacturer/` | Resolve `equipmentManufacturerId` |
| `Equipment_Group` | IVO | `reference/ivo/Equipment_Group/` | Resolve `equipmentGroupId` |
| `Job` | IVO | `reference/ivo/Job/` | Resolve `currentTrackVoJobId` |

Five cache-writer services: four IVO at a low sequence, one Vista above them.

Note the chained dependency this creates. `Equipment_Group` is itself populated by
`Sync Vista equipment categories to IVO equipment groups`. So the equipment flow depends on
the equipment-group *flow* having run, not just on a cache write. Order the ERP source
services so that reference-data objects (categories, departments, revenue codes) cache and
sync before transactional objects (equipment, jobs) that look them up.

**Reference data before transactional data** is the general rule this produces.

---

## 4. The typical IVO customer

A typical customer needs **at least seven flows**: jobs, equipment, employees, job codes,
plus three more that vary. Data is usually fairly consistent between customers; the
*workflows* differ substantially, so treat the mapping as the reusable part and the
orchestration as per-customer.

Objects seen in use so far, with the IVO target each feeds. IVO is connected to five ERPs —
Vista, Spectrum, Foundation, Sage 100 Contractor, and Sage 300 CRE — but only Vista and
Spectrum have captured reference material, so only those two have columns here. Add columns
as the other systems are documented.

| Source object | Vista | Spectrum | IVO target |
| --- | --- | --- | --- |
| Equipment | `Equipment Management/equipment.json` | `Equipment Control/Equipment/equipment.json` | `Equipment` |
| Equipment categories / types | `Equipment Management/categories.json` | `Equipment Control/Equipment Type/` | `Equipment_Group` |
| Departments | `Equipment Management/departments.json` | `Payroll/Departments/` | `Company_Division` |
| Revenue codes | `Equipment Management/revenue_codes.json` | — | `Equipment_Pay_Class` |
| Jobs | `Job Cost/jobs.json` | `Job Cost/` | `Job` |
| Contract items | `Job Cost/contract_items.json` | — | `Job_Item_Code` |
| Employees | `Human Resources/` | `Payroll/Employees/employees.json` | `Employee` |

Confirm the exact object with the customer's `input/erp/schema.json` rather than trusting
this table — module placement varies and Vista has several `contracts.json` files in
different modules.

---

## 5. Per-customer observed practice

### KNA — Vista

Equipment and contract items. The 30-hour discovery outlier, with "tons of custom fields" —
the main source of per-customer variance.

| Flow | Steps | Source object | IVO target |
| --- | --- | --- | --- |
| `Sync Vista equipment to IVO` | 10 | `Equipment Management/equipment.json` | `Equipment` |
| `Sync Vista contract items to IVO job item codes` | 8 | `Job Cost/contract_items.json` | `Job_Item_Code` |

Notes: the contract-item flow resolves `Contract` to the IVO `Job.accountingCode`, which is
still an open review question. Its configurations list is empty — `createdByUserId` was not
recovered for this object.

### IGE — Vista

Integrity Grading & Excavating. The most complete workspace: five flows covering reference
data and transactional data.

| Flow | Steps | Source object | IVO target |
| --- | --- | --- | --- |
| `Sync Vista equipment categories to IVO equipment groups` | 7 | `Equipment Management/categories.json` | `Equipment_Group` |
| `Sync Vista departments to IVO company divisions` | 7 | `Equipment Management/departments.json` | `Company_Division` |
| `Sync Vista jobs to IVO jobs` | 7 | `Job Cost/jobs.json` | `Job` |
| `Sync Vista equipment to IVO equipment` | 10 | `Equipment Management/equipment.json` | `Equipment` |
| `Sync Vista revenue codes to IVO equipment pay classes` | 7 | `Equipment Management/revenue_codes.json` | `Equipment_Pay_Class` |

Notes: the three reference-data flows (categories, departments, revenue codes) must run
before the equipment flow, which looks up the groups they create. This is the clearest
example of the reference-data-first ordering rule.

### WDC — Spectrum

Employees only. The only Spectrum customer so far.

| Flow | Steps | Source object | IVO target |
| --- | --- | --- | --- |
| `Sync Spectrum employees to IVO employees` | 7 | `Payroll/Employees/employees.json` | `Employee` |

Notes: Spectrum places employees under Payroll, not Human Resources — Human Resources holds
only dependents and insurance. `Employees Lite` exists as a separate object and is a
candidate for constraining cache size if the full employee object approaches the 2 MB
per-object limit.

### Common shape across all three

- Every flow so far is one source object to one IVO object, one record per run, on-demand
  triggered.
- `ivoCompanyId` and `createdByUserId` are the recurring configurations. `ivoCompanyId` is
  consistently unconfirmed and carried as a review question; `createdByUserId` was recovered
  by observing an existing IVO add action.
- No customer has used a callable flow, a For Each step, or a cache-event trigger yet.

---

## 6. How to extend this file

When you learn something about services for a customer, add it here rather than leaving it in
a flow description:

- **New customer**: add a subsection under [Per-customer observed
  practice](#5-per-customer-observed-practice) with the ERP, the flow table, and the notes
  that would not be obvious from the flow JSON.
- **New sequencing constraint**: add it to the customer's notes, and to
  [Composition rules](#2-composition-rules) only if it holds generally.
- **A service that had to be split or combined**: record what forced it. This is the highest
  value thing to capture, because it is invisible in the flow JSON.
- **Source object placement that surprised you**: add a row to the object table in
  [The typical IVO customer](#4-the-typical-ivo-customer).

Mark anything not confirmed by IVO or the App Xchange documentation as unconfirmed, and never
promote one customer's layout into a general rule.
