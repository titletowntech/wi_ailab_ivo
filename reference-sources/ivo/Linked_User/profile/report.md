# Profile — IVO Linked_User reference sample

- Source: `reference-sources\ivo\Linked_User\users.csv`
- Schema: `reference-sources\ivo\Linked_User\employee_linked_user.json`
- Rows: 1118
- Columns: 19
- Generated: 2026-08-19T12:59:37.037Z

## Pruning

| | Count | Share |
| --- | ---: | ---: |
| Columns in export | 19 | 100% |
| Never populated | 0 | 0.0% |
| Constant (one value) | 2 | 10.5% |
| **Carrying information** | **17** | **89.5%** |

## Schema reconciliation

- Columns declared in schema: 19
- Columns **not** in schema: 0
- Schema fields absent from export: 0

## Questions — schema and data disagree

_These are the conflicts that today surface during testing._

- **`isActive`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isDeleted`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isMechanic`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isDriver`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`vendorId`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.

## Review — needs a decision

_Mappable, but the transform depends on an answer._

- **`phoneNumber`** — [PLACEHOLDER_NULL] 10 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`phoneNumber`** — [MIXED_FORMAT] Mixed observed formats: integer 99.0%, string 0.9%, phone 0.1%.
- **`divisionId`** — [PLACEHOLDER_NULL] 1 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`vendorId`** — [PLACEHOLDER_NULL] 1118 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`uuid`** — [PLACEHOLDER_NULL] 1 value(s) look like textual nulls ("N/A", "NONE", ...).

## Transforms — deterministic

_Derivable from the data with no judgement call._

- **`phoneNumber`** — [NUMERIC_AS_STRING] Declared string, observed numeric. Do not cast if leading zeros matter.

## Candidate keys

- `id` (integer)
- `uuid` (uuid)

## Field detail

| Field | Fill | Distinct | Type | Len | Top value |
| --- | ---: | ---: | --- | ---: | --- |
| `id` | 100.0% | 1118 | integer | 5–5 | `15419` 0.1% |
| `email` | 100.0% | 1112 | email | 13–44 | `hrrep@kraemerna.com` 0.4% |
| `username` | 100.0% | 1116 | string | 7–22 | `kna_90642` 0.2% |
| `first_name` | 100.0% | 504 | string | 1–12 | `Jose` 2.3% |
| `last_name` | 100.0% | 950 | string | 2–22 | `Smith` 1.1% |
| `companyId` | 100.0% | 1 | integer | 3–3 | `265` 100.0% |
| `companyRoleId` | 100.0% | 9 | integer | 1–2 | `15` 53.2% |
| `isActive` | 100.0% | 2 | integer | 1–1 | `1` 94.1% |
| `isDeleted` | 100.0% | 2 | integer | 1–1 | `0` 99.8% |
| `timezone` | 100.0% | 8 | string | 14–28 | `America/Denver` 52.2% |
| `createdTimestampUtc` | 100.0% | 222 | date | 19–19 | `2026-07-20 01:58:39` 1.3% |
| `updatedTimestampUtc` | 100.0% | 348 | date | 19–19 | `2026-08-14 17:59:53` 1.3% |
| `phoneNumber` | 94.2% | 1042 | integer | 4–12 | `NULL` 0.9% |
| `employeeId` | 100.0% | 1116 | integer | 5–5 | `18483` 0.2% |
| `isMechanic` | 100.0% | 2 | integer | 1–1 | `0` 98.2% |
| `isDriver` | 100.0% | 2 | integer | 1–1 | `0` 99.9% |
| `divisionId` | 100.0% | 19 | integer | 1–4 | `685` 61.7% |
| `vendorId` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `uuid` | 100.0% | 1118 | uuid | 4–36 | `937808b2-d044-497e-aa92-6c9de1` 0.1% |
