# Profile — IVO Equipment_Status reference sample

- Source: `reference-sources\ivo\Equipment_Status\equipment status.csv`
- Schema: `reference-sources\ivo\Equipment_Status\equipment_status.json`
- Rows: 2273
- Columns: 12
- Generated: 2026-08-19T12:59:34.973Z

## Pruning

| | Count | Share |
| --- | ---: | ---: |
| Columns in export | 12 | 100% |
| Never populated | 0 | 0.0% |
| Constant (one value) | 1 | 8.3% |
| **Carrying information** | **11** | **91.7%** |

## Schema reconciliation

- Columns declared in schema: 12
- Columns **not** in schema: 0
- Schema fields absent from export: 0

## Questions — schema and data disagree

_These are the conflicts that today surface during testing._

- **`endStatusId`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.
- **`isDeleted`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isActive`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.

## Review — needs a decision

_Mappable, but the transform depends on an answer._

- **`endTime`** — [PLACEHOLDER_NULL] 2102 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`endTime`** — [MIXED_FORMAT] Mixed observed formats: string 92.5%, date 7.5%.
- **`endStatusId`** — [PLACEHOLDER_NULL] 2103 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`endStatusId`** — [MIXED_FORMAT] Mixed observed formats: string 92.5%, integer 7.5%.

## Candidate keys

- `equipmentStatusId` (integer)
- `uuid` (uuid)

## Field detail

| Field | Fill | Distinct | Type | Len | Top value |
| --- | ---: | ---: | --- | ---: | --- |
| `equipmentStatusId` | 100.0% | 2273 | integer | 5–5 | `13841` 0.0% |
| `equipmentId` | 100.0% | 2083 | integer | 5–5 | `51976` 0.3% |
| `startTime` | 100.0% | 351 | date | 19–19 | `2026-07-22 13:38:05` 11.9% |
| `endTime` | 100.0% | 39 | string | 4–19 | `NULL` 92.5% |
| `startStatusId` | 100.0% | 5 | integer | 4–4 | `1309` 50.5% |
| `endStatusId` | 100.0% | 6 | string | 4–4 | `NULL` 92.5% |
| `createdTimestampUtc` | 100.0% | 676 | date | 19–19 | `2026-07-22 13:38:05` 11.9% |
| `createdByUserId` | 100.0% | 4 | integer | 2–5 | `45` 99.6% |
| `statusNote` | 99.8% | 16 | string | 5–135 | `AppXchange` 94.9% |
| `isDeleted` | 100.0% | 1 | integer | 1–1 | `0` 100.0% |
| `isActive` | 100.0% | 2 | integer | 1–1 | `1` 92.3% |
| `uuid` | 100.0% | 2273 | uuid | 36–36 | `64f2c2d3-f174-4d03-af1d-36b93c` 0.0% |
