# Profile — IVO WorkOrder reference sample

- Source: `reference-sources\ivo\WorkOrder\equipment work order.csv`
- Schema: `reference-sources\ivo\WorkOrder\workorder.json`
- Rows: 1737
- Columns: 27
- Generated: 2026-08-19T12:59:38.909Z

## Pruning

| | Count | Share |
| --- | ---: | ---: |
| Columns in export | 27 | 100% |
| Never populated | 0 | 0.0% |
| Constant (one value) | 8 | 29.6% |
| **Carrying information** | **19** | **70.4%** |

## Schema reconciliation

- Columns declared in schema: 27
- Columns **not** in schema: 0
- Schema fields absent from export: 0

## Questions — schema and data disagree

_These are the conflicts that today surface during testing._

- **`hourMeterId`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.
- **`odometerId`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.
- **`isDeleted`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isActive`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isPmPerformed`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`substatusId`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.

## Review — needs a decision

_Mappable, but the transform depends on an answer._

- **`hourMeterId`** — [PLACEHOLDER_NULL] 993 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`hourMeterId`** — [MIXED_FORMAT] Mixed observed formats: string 57.2%, integer 42.8%.
- **`odometerId`** — [PLACEHOLDER_NULL] 1671 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`odometerId`** — [MIXED_FORMAT] Mixed observed formats: string 96.2%, integer 3.8%.
- **`lastUpdatedByUserId`** — [PLACEHOLDER_NULL] 313 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`lastUpdatedByUserId`** — [MIXED_FORMAT] Mixed observed formats: integer 82.0%, string 18.0%.
- **`substatusId`** — [PLACEHOLDER_NULL] 1492 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`substatusId`** — [MIXED_FORMAT] Mixed observed formats: string 85.9%, integer 14.1%.
- **`externalCompanyCode`** — [PLACEHOLDER_NULL] 1737 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`externalWorkOrderNumber`** — [PLACEHOLDER_NULL] 1737 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`externalJobNumber`** — [PLACEHOLDER_NULL] 1736 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`externalCustomerNumber`** — [PLACEHOLDER_NULL] 1737 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`externalServiceStore`** — [PLACEHOLDER_NULL] 1737 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`estimatedArrivalDate`** — [PLACEHOLDER_NULL] 1737 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`completionDate`** — [PLACEHOLDER_NULL] 789 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`completionDate`** — [MIXED_FORMAT] Mixed observed formats: date 54.6%, string 45.4%.
- **`scheduledStart`** — [PLACEHOLDER_NULL] 1737 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`requestedDate`** — [PLACEHOLDER_NULL] 1737 value(s) look like textual nulls ("N/A", "NONE", ...).

## Transforms — deterministic

_Derivable from the data with no judgement call._

- **`note`** — [PADDED] 37 value(s) carry leading/trailing whitespace — needs .trim().

## Candidate keys

- `workOrderId` (integer)
- `uuid` (uuid)

## Field detail

| Field | Fill | Distinct | Type | Len | Top value |
| --- | ---: | ---: | --- | ---: | --- |
| `workOrderId` | 100.0% | 1737 | integer | 5–5 | `97133` 0.1% |
| `equipmentId` | 100.0% | 664 | integer | 5–5 | `55224` 2.1% |
| `datePerformed` | 100.0% | 490 | date | 10–10 | `2010-01-01` 13.2% |
| `hourMeterId` | 100.0% | 731 | string | 4–8 | `NULL` 57.2% |
| `odometerId` | 100.0% | 60 | string | 4–7 | `NULL` 96.2% |
| `note` | 99.7% | 236 | string | 2–1403 | `Imported by IVO Systems on 202` 85.0% |
| `createdTimestampUtc` | 100.0% | 580 | date | 19–19 | `2026-08-05 14:38:30` 2.4% |
| `createdByUserId` | 100.0% | 20 | integer | 2–5 | `45` 84.9% |
| `isDeleted` | 100.0% | 2 | integer | 1–1 | `0` 80.3% |
| `isActive` | 100.0% | 2 | integer | 1–1 | `1` 80.3% |
| `isPmPerformed` | 100.0% | 2 | integer | 1–1 | `1` 55.4% |
| `workOrderStatus` | 100.0% | 4 | integer | 1–1 | `3` 86.9% |
| `updatedTimestampUtc` | 100.0% | 264 | date | 19–19 | `2026-08-18 20:38:08` 84.9% |
| `sortOrder` | 100.0% | 1 | integer | 1–1 | `0` 100.0% |
| `lastUpdatedByUserId` | 100.0% | 9 | integer | 4–5 | `9236` 65.1% |
| `substatusId` | 100.0% | 48 | string | 1–4 | `NULL` 85.9% |
| `uuid` | 100.0% | 1737 | uuid | 36–36 | `65b3c4b7-8ae4-458f-8e40-643424` 0.1% |
| `externalCompanyCode` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `externalWorkOrderNumber` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `externalWorkOrderType` | 100.0% | 2 | string | 1–1 | `J` 84.9% |
| `externalJobNumber` | 100.0% | 2 | string | 3–4 | `NULL` 99.9% |
| `externalCustomerNumber` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `externalServiceStore` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `estimatedArrivalDate` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `completionDate` | 100.0% | 949 | date | 4–19 | `NULL` 45.4% |
| `scheduledStart` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `requestedDate` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
