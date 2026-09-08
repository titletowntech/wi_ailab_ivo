# Profile — IVO WorkOrder_Substatus reference sample

- Source: `reference-sources\ivo\WorkOrder_Substatus\equipment work order substatus.csv`
- Schema: `reference-sources\ivo\WorkOrder_Substatus\workorder_substatus.json`
- Rows: 83
- Columns: 7
- Generated: 2026-08-19T12:59:39.836Z

## Pruning

| | Count | Share |
| --- | ---: | ---: |
| Columns in export | 7 | 100% |
| Never populated | 0 | 0.0% |
| Constant (one value) | 1 | 14.3% |
| **Carrying information** | **6** | **85.7%** |

## Schema reconciliation

- Columns declared in schema: 7
- Columns **not** in schema: 0
- Schema fields absent from export: 0

## Questions — schema and data disagree

_These are the conflicts that today surface during testing._

- **`isDeleted`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`deletedByUserId`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.

## Review — needs a decision

_Mappable, but the transform depends on an answer._

- **`deletedByUserId`** — [PLACEHOLDER_NULL] 81 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`deletedByUserId`** — [MIXED_FORMAT] Mixed observed formats: string 97.6%, integer 2.4%.
- **`deletedTimestampUtc`** — [PLACEHOLDER_NULL] 81 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`deletedTimestampUtc`** — [MIXED_FORMAT] Mixed observed formats: string 97.6%, date 2.4%.

## Candidate keys

- `subStatusId` (integer)
- `uuid` (uuid)

## Field detail

| Field | Fill | Distinct | Type | Len | Top value |
| --- | ---: | ---: | --- | ---: | --- |
| `subStatusId` | 100.0% | 83 | integer | 2–3 | `44` 1.2% |
| `subStatusName` | 100.0% | 81 | string | 3–39 | `ANNUAL DEFICIENCIES` 2.4% |
| `uuid` | 100.0% | 83 | uuid | 36–36 | `cebda4fc-0f46-4345-a839-3a0578` 1.2% |
| `companyId` | 100.0% | 1 | integer | 3–3 | `265` 100.0% |
| `isDeleted` | 100.0% | 2 | integer | 1–1 | `0` 97.6% |
| `deletedByUserId` | 100.0% | 2 | string | 4–5 | `NULL` 97.6% |
| `deletedTimestampUtc` | 100.0% | 3 | string | 4–19 | `NULL` 97.6% |
