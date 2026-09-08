# Profile — IVO Company_Division reference sample

- Source: `reference-sources\ivo\Company_Division\company division.csv`
- Schema: `reference-sources\ivo\Company_Division\company_division.json`
- Rows: 38
- Columns: 12
- Generated: 2026-08-19T12:59:30.475Z

## Pruning

| | Count | Share |
| --- | ---: | ---: |
| Columns in export | 12 | 100% |
| Never populated | 0 | 0.0% |
| Constant (one value) | 4 | 33.3% |
| **Carrying information** | **8** | **66.7%** |

## Schema reconciliation

- Columns declared in schema: 12
- Columns **not** in schema: 0
- Schema fields absent from export: 0

## Questions — schema and data disagree

_These are the conflicts that today surface during testing._

- **`isDeleted`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`deletedByUserId`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.
- **`updatedByUserId`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.

## Review — needs a decision

_Mappable, but the transform depends on an answer._

- **`divisionName`** — [PLACEHOLDER_NULL] 1 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`deletedTimestampUtc`** — [PLACEHOLDER_NULL] 38 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`deletedByUserId`** — [PLACEHOLDER_NULL] 38 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`updatedTimestampUtc`** — [PLACEHOLDER_NULL] 32 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`updatedTimestampUtc`** — [MIXED_FORMAT] Mixed observed formats: string 84.2%, date 15.8%.
- **`updatedByUserId`** — [PLACEHOLDER_NULL] 32 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`updatedByUserId`** — [MIXED_FORMAT] Mixed observed formats: string 84.2%, integer 15.8%.

## Candidate keys

- `divisionId` (integer)
- `divisionName` (string)
- `divisionDescription` (string)
- `createdTimestampUtc` (date)

## Field detail

| Field | Fill | Distinct | Type | Len | Top value |
| --- | ---: | ---: | --- | ---: | --- |
| `divisionId` | 100.0% | 38 | integer | 3–3 | `634` 2.6% |
| `companyId` | 100.0% | 1 | integer | 3–3 | `265` 100.0% |
| `divisionName` | 100.0% | 38 | string | 4–34 | `None` 2.6% |
| `divisionDescription` | 100.0% | 38 | string | 4–45 | `No Division` 2.6% |
| `createdTimestampUtc` | 100.0% | 38 | date | 19–19 | `2026-04-21 13:22:36` 2.6% |
| `createdByUserId` | 100.0% | 2 | integer | 2–5 | `45` 97.4% |
| `isDeleted` | 100.0% | 2 | integer | 1–1 | `1` 81.6% |
| `deletedTimestampUtc` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `deletedByUserId` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `updatedTimestampUtc` | 100.0% | 7 | string | 4–19 | `NULL` 84.2% |
| `updatedByUserId` | 100.0% | 2 | string | 4–5 | `NULL` 84.2% |
| `uuid` | 100.0% | 1 | string | 3–3 | `...` 100.0% |
