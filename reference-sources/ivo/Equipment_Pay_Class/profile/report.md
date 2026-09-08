# Profile — IVO Equipment_Pay_Class reference sample

- Source: `reference-sources\ivo\Equipment_Pay_Class\job equipment codes.csv`
- Schema: `reference-sources\ivo\Equipment_Pay_Class\equipment_code.json`
- Rows: 1918
- Columns: 12
- Generated: 2026-08-19T12:59:33.803Z

## Pruning

| | Count | Share |
| --- | ---: | ---: |
| Columns in export | 12 | 100% |
| Never populated | 0 | 0.0% |
| Constant (one value) | 6 | 50.0% |
| **Carrying information** | **6** | **50.0%** |

## Schema reconciliation

- Columns declared in schema: 12
- Columns **not** in schema: 0
- Schema fields absent from export: 0

## Questions — schema and data disagree

_These are the conflicts that today surface during testing._

- **`jobId`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.
- **`jobOperatorLaborCodeId`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.
- **`isActive`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`jobChargeRatePerHour`** — [TYPE_MISMATCH] Schema declares number; data looks like string.

## Review — needs a decision

_Mappable, but the transform depends on an answer._

- **`jobId`** — [PLACEHOLDER_NULL] 1918 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`createdTimestampUtc`** — [PLACEHOLDER_NULL] 1918 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`equipmentCode`** — [MIXED_FORMAT] Mixed observed formats: string 89.6%, integer 10.4%.
- **`accountingCode`** — [MIXED_FORMAT] Mixed observed formats: string 98.2%, integer 1.8%.
- **`estimatingCode`** — [PLACEHOLDER_NULL] 1918 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`jobOperatorLaborCodeId`** — [PLACEHOLDER_NULL] 1918 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`jobChargeRatePerHour`** — [PLACEHOLDER_NULL] 1918 value(s) look like textual nulls ("N/A", "NONE", ...).

## Candidate keys

- `equipmentCodeId` (integer)
- `uuid` (uuid)

## Field detail

| Field | Fill | Distinct | Type | Len | Top value |
| --- | ---: | ---: | --- | ---: | --- |
| `equipmentCodeId` | 100.0% | 1918 | integer | 4–4 | `2711` 0.1% |
| `jobId` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `createdTimestampUtc` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `createdByUserId` | 100.0% | 1 | integer | 2–2 | `45` 100.0% |
| `equipmentCode` | 100.0% | 821 | string | 6–8 | `560500` 0.3% |
| `description` | 99.8% | 608 | string | 4–60 | `CAT950 LOADER (Wagner)` 1.9% |
| `accountingCode` | 100.0% | 8 | string | 1–3 | `1O` 35.2% |
| `estimatingCode` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `jobOperatorLaborCodeId` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `isActive` | 100.0% | 2 | integer | 1–1 | `1` 99.9% |
| `jobChargeRatePerHour` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `uuid` | 100.0% | 1918 | uuid | 36–36 | `2a30f6b4-04cb-4e07-9013-671c68` 0.1% |
