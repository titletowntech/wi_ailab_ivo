# Connector Capabilities

What each connector can actually read and write, and where that is declared in this
repository. Confirm every object and action here before designing a step around it.

## Connected source systems

IVO is connected to five ERPs through App Xchange. Reference material has been captured for
only two of them so far:

| Source system | Connected | Reference material captured |
| --- | --- | --- |
| Vista (Viewpoint) | yes | Cache object schemas only |
| Spectrum | yes | Cache object schemas and write actions |
| Foundation | yes | **None yet** |
| Sage 100 Contractor | yes | **None yet** |
| Sage 300 CRE | yes | **None yet** |

For Foundation, Sage 100 Contractor, and Sage 300 CRE there is no captured schema in this
repository yet. Documentation is being gathered. Until it lands:

- Do not guess object names, module placement, or field names for these systems.
- The customer's own `customers/<KEY>/<object>/input/erp/schema.json` is the authoritative
  source for that customer — use it and say that is what you used.
- With no customer schema and no reference, stop and ask. Vista or Spectrum naming does not
  transfer.

Non-connected ERPs are built entirely outside App Xchange.

## Where capability is declared

| Connector | Cache object schema | Declared write actions |
| --- | --- | --- |
| Vista | `reference/vista/<Module>/<object>.json` | **Not captured.** See below |
| Spectrum | `reference/spectrum/<Module>/<Object>/<object>.json` | `reference/spectrum/<Module>/<Object>/Actions/<operation>.json` |
| Foundation | not captured | not captured |
| Sage 100 Contractor | not captured | not captured |
| Sage 300 CRE | not captured | not captured |
| IVO | `reference/ivo/<Object>/schema.json` | `reference-sources/ivo/<Object>/Actions/<operation>.json` |

Enumerate what exists rather than assuming:

```bash
ls reference/vista/                                    # Vista modules
ls "reference/vista/Equipment Management"/             # cacheable Vista objects
ls reference/spectrum/"Equipment Control"/             # Spectrum objects
ls reference/spectrum/"Equipment Control"/Equipment/Actions/   # its write actions
ls reference/ivo/                                      # IVO destination objects
ls reference-sources/ivo/Equipment/Actions/            # its write actions
```

`reference/` holds reusable, customer-independent contracts. `reference-sources/` preserves
the original supplied inputs. An object absent from both is unknown, not unavailable — say
so and ask rather than substituting a similar-looking object.

## The Vista/Spectrum asymmetry

This matters and is easy to miss:

- **Vista**: 266 captured object schemas across 18 modules, cache/read shape only
  (`$id` ends in `/cache.json`). **No action schemas are captured.** Treat writing back to
  Vista as unverified: do not author a Vista `queueactionv3` step without first confirming
  the action exists with the reviewer, and record it as a `reviewQuestion`.
- **Spectrum**: 258 captured schemas, each object in its own folder with an `Actions/`
  directory. Spectrum names its update operation **`change`**, not `update`. Read the actual
  action JSON — do not assume the Vista or IVO operation vocabulary transfers.

Both are native Trimble connectors covering cloud and on-prem, and both are where all
captured reference material sits today. Expect the same question — are write actions
declared, and what is the update operation called? — to need answering separately for
Foundation, Sage 100 Contractor, and Sage 300 CRE when their documentation arrives.

## Reading a source object schema

The schemas are JSON Schema draft-07. Useful facts they carry, and the traps:

- `type` as an array (`["string","null"]`) means nullable — the field can arrive absent.
- `maxLength` on the source is not the IVO limit. Check both and truncate deliberately.
- Vista encodes decimals as **strings** with a `pattern`
  (`^[-+]?[0-9]{1,8}(?:.[0-9]{0,2})?$`). Parse them; never assume a number arrives.
- Vista dates arrive as nullable strings with no declared format.
- `description` is frequently empty. An empty description is not permission to guess the
  semantics — the profile under `customers/<KEY>/<object>/output/erp-profile/` is the
  observed evidence, and disagreement between declared and observed is the highest-value
  signal to raise.
- Fields with **leading underscores** (including Vista UD tables shaped as
  `_custom_fields`) do not fire cache change detection, so they cannot drive a cache-event
  trigger. Custom fields are the main source of per-customer variance, so check for them.

## IVO as a destination

IVO's own system is an App Xchange connector, so flows read it with
`getdatafromcachev2` and write it with `queueactionv3` exactly like an ERP.

Each `reference/ivo/<Object>/` carries three files:

- `schema.json` — structural source of truth. A missing constraint means unknown, not
  unlimited.
- `field-catalog.csv` — business semantics, including `ownership`, `mapping_behavior`,
  `reference_object`, and a `status` column. **`status: confirm` means IVO has not confirmed
  the semantics.** Most Equipment fields are currently `confirm`.
- `validation-rules.json` — `blockingRules.requireMappedOrDefaulted` lists the fields a
  payload must supply; `warnings.writeOnlyFields` and
  `warnings.fieldsRequiringIVOConfirmation` list what to flag.

Available IVO operations per object are `add`, `update`, `remove`, and the `_many` batch
variants. Prefer the single-record operations: the existing flows are per-record, and an
action input is capped at 5 MB.

Never promote a constant, an empty field, or a lookup behavior observed at one customer into
a universal rule.

## IVO action paths

Action paths are **not declared anywhere in this repository.** The observed convention from
approved customer flows is:

```
ivo-systems/<module>/1/<kebab-case-object>/<operation>
```

Modules observed in use:

| Module | Objects observed |
| --- | --- |
| `company-management` | `division` |
| `employee-management` | `employee` |
| `equipment-management` | `equipment`, `equipment-group`, `equipment-code` |
| `project-management` | `job`, `item-code` |

Rules when you need a path:

1. Reuse an observed path verbatim when the object matches one above.
2. Otherwise derive it from the convention, cite
   `reference-sources/ivo/<Object>/Actions/<operation>.json` as the payload evidence, set
   `generation.confidence` no higher than 84, and add a `reviewQuestion` naming the derived
   path and asking the reviewer to confirm it.
3. Never present a derived path as verified.

The object name in the path is not always the IVO object name — `Job_Item_Code` is
`item-code`, `Equipment_Group` is `equipment-group`. Do not mechanically kebab-case the
reference folder name without checking the observed table first.

## Platform limits worth designing around

| Limit | Value |
| --- | --- |
| Single cached data object | 2 MB |
| One data object type per workspace | 20 GB |
| Action input | 5 MB |
| File | 1 GB |
| One flow run, until it completes | 2.5 GB — lookups and actions both accumulate |
| Trigger filter expression | 250 ms, 5 MB sandbox |
| Minimum schedule interval | 15 minutes |

Constrain every lookup filter and request only the properties later steps use. Do not pass
large datasets into a `callflow` or a for-each step.
