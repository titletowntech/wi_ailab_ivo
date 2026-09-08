# Profile — IVO WorkOrder_PM_Performed reference sample

- Source: `reference-sources\ivo\WorkOrder_PM_Performed\equipment work order pm performed.csv`
- Schema: `reference-sources\ivo\WorkOrder_PM_Performed\workorder_pm_performed.json`
- Rows: 1351
- Columns: 10
- Generated: 2026-08-19T12:59:39.195Z

## Pruning

| | Count | Share |
| --- | ---: | ---: |
| Columns in export | 10 | 100% |
| Never populated | 0 | 0.0% |
| Constant (one value) | 2 | 20.0% |
| **Carrying information** | **8** | **80.0%** |

## Schema reconciliation

- Columns declared in schema: 10
- Columns **not** in schema: 0
- Schema fields absent from export: 0

## Questions — schema and data disagree

_These are the conflicts that today surface during testing._

- **`isDeleted`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`deletedByUserId`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.
- **`isCompleted`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isActive`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.

## Review — needs a decision

_Mappable, but the transform depends on an answer._

- **`deletedByUserId`** — [PLACEHOLDER_NULL] 1351 value(s) look like textual nulls ("N/A", "NONE", ...).

## Candidate keys

- `workOrderPmId` (integer)
- `uuid` (uuid)

## Field detail

| Field | Fill | Distinct | Type | Len | Top value |
| --- | ---: | ---: | --- | ---: | --- |
| `workOrderPmId` | 100.0% | 1351 | integer | 5–5 | `35771` 0.1% |
| `setupId` | 100.0% | 1258 | integer | 5–5 | `34595` 0.2% |
| `workOrderId` | 100.0% | 959 | integer | 5–5 | `98163` 0.4% |
| `createdTimestampUtc` | 100.0% | 1350 | date | 19–19 | `2026-08-10 16:11:58` 0.1% |
| `createdByUserId` | 100.0% | 6 | integer | 4–5 | `9236` 89.5% |
| `isDeleted` | 100.0% | 1 | integer | 1–1 | `0` 100.0% |
| `deletedByUserId` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `isCompleted` | 100.0% | 2 | integer | 1–1 | `1` 94.4% |
| `isActive` | 100.0% | 2 | integer | 1–1 | `0` 94.4% |
| `uuid` | 100.0% | 1351 | uuid | 36–36 | `60d50461-512a-4652-ad98-f2ca64` 0.1% |
