# Profile — IVO Work_Order_Assignment reference sample

- Source: `reference-sources\ivo\Work_Order_Assignment\equipment work order assignment.csv`
- Schema: `reference-sources\ivo\Work_Order_Assignment\workorder_assignment.json`
- Rows: 104
- Columns: 9
- Generated: 2026-08-19T12:59:38.489Z

## Pruning

| | Count | Share |
| --- | ---: | ---: |
| Columns in export | 9 | 100% |
| Never populated | 0 | 0.0% |
| Constant (one value) | 0 | 0.0% |
| **Carrying information** | **9** | **100.0%** |

## Schema reconciliation

- Columns declared in schema: 9
- Columns **not** in schema: 0
- Schema fields absent from export: 0

## Questions — schema and data disagree

_These are the conflicts that today surface during testing._

- **`isDeleted`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`deletedByUserId`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.

## Review — needs a decision

_Mappable, but the transform depends on an answer._

- **`deletedByUserId`** — [PLACEHOLDER_NULL] 95 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`deletedByUserId`** — [MIXED_FORMAT] Mixed observed formats: string 91.3%, integer 8.7%.
- **`deletedTimestampUtc`** — [PLACEHOLDER_NULL] 95 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`deletedTimestampUtc`** — [MIXED_FORMAT] Mixed observed formats: string 91.3%, date 8.7%.

## Candidate keys

- `workOrderAssignmentId` (integer)
- `uuid` (uuid)

## Field detail

| Field | Fill | Distinct | Type | Len | Top value |
| --- | ---: | ---: | --- | ---: | --- |
| `workOrderAssignmentId` | 100.0% | 104 | integer | 5–5 | `44620` 1.0% |
| `workOrderId` | 100.0% | 87 | integer | 5–5 | `96563` 4.8% |
| `assignedToUserId` | 100.0% | 20 | integer | 5–5 | `15376` 12.5% |
| `createdTimestampUtc` | 100.0% | 92 | date | 19–19 | `2026-08-11 13:27:35` 4.8% |
| `createdByUserId` | 100.0% | 17 | integer | 5–5 | `16222` 58.7% |
| `isDeleted` | 100.0% | 2 | integer | 1–1 | `0` 91.3% |
| `deletedByUserId` | 100.0% | 3 | string | 4–5 | `NULL` 91.3% |
| `deletedTimestampUtc` | 100.0% | 10 | string | 4–19 | `NULL` 91.3% |
| `uuid` | 100.0% | 104 | uuid | 36–36 | `7df89c3d-1b6c-4ebe-8749-588594` 1.0% |
