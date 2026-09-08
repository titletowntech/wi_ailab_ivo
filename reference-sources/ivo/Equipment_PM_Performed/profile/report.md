# Profile — IVO Equipment_PM_Performed reference sample

- Source: `reference-sources\ivo\Equipment_PM_Performed\equipment pm performed.csv`
- Schema: `reference-sources\ivo\Equipment_PM_Performed\equipment_pm_performed.json`
- Rows: 1283
- Columns: 12
- Generated: 2026-08-19T12:59:34.086Z

## Pruning

| | Count | Share |
| --- | ---: | ---: |
| Columns in export | 12 | 100% |
| Never populated | 0 | 0.0% |
| Constant (one value) | 0 | 0.0% |
| **Carrying information** | **12** | **100.0%** |

## Schema reconciliation

- Columns declared in schema: 12
- Columns **not** in schema: 0
- Schema fields absent from export: 0

## Questions — schema and data disagree

_These are the conflicts that today surface during testing._

- **`isDeleted`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`odometerPerformed`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.

## Review — needs a decision

_Mappable, but the transform depends on an answer._

- **`hoursPerformed`** — [PLACEHOLDER_NULL] 262 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`hoursPerformed`** — [MIXED_FORMAT] Mixed observed formats: integer 79.6%, string 20.4%.
- **`odometerPerformed`** — [PLACEHOLDER_NULL] 1189 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`odometerPerformed`** — [MIXED_FORMAT] Mixed observed formats: string 92.7%, integer 7.3%.
- **`workOrderId`** — [PLACEHOLDER_NULL] 4 value(s) look like textual nulls ("N/A", "NONE", ...).

## Candidate keys

- `performedId` (integer)
- `uuid` (uuid)

## Field detail

| Field | Fill | Distinct | Type | Len | Top value |
| --- | ---: | ---: | --- | ---: | --- |
| `performedId` | 100.0% | 1283 | integer | 5–5 | `47375` 0.1% |
| `equipmentId` | 100.0% | 602 | integer | 5–5 | `53373` 0.9% |
| `setupId` | 100.0% | 1231 | integer | 5–5 | `36709` 0.2% |
| `isDeleted` | 100.0% | 2 | integer | 1–1 | `0` 99.7% |
| `createdByUserId` | 100.0% | 7 | integer | 4–5 | `9236` 91.6% |
| `datePerformed` | 100.0% | 458 | date | 10–10 | `2026-02-16` 1.9% |
| `hoursPerformed` | 100.0% | 681 | integer | 1–5 | `NULL` 20.4% |
| `odometerPerformed` | 100.0% | 59 | string | 3–6 | `NULL` 92.7% |
| `workOrderId` | 100.0% | 908 | integer | 4–5 | `98163` 0.5% |
| `createdTimestampUtc` | 100.0% | 946 | date | 19–19 | `2026-08-10 16:12:46` 0.5% |
| `note` | 99.9% | 2 | string | 13–21 | `Added from Work Order` 99.8% |
| `uuid` | 100.0% | 1283 | uuid | 36–36 | `f89b5a88-d45d-43db-9ba7-d207ad` 0.1% |
