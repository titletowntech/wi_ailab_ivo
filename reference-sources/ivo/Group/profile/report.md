# Profile — IVO Group reference sample

- Source: `reference-sources\ivo\Group\employee groups.csv`
- Schema: `reference-sources\ivo\Group\employee_group.json`
- Rows: 34
- Columns: 15
- Generated: 2026-08-19T12:59:35.260Z

## Pruning

| | Count | Share |
| --- | ---: | ---: |
| Columns in export | 15 | 100% |
| Never populated | 0 | 0.0% |
| Constant (one value) | 11 | 73.3% |
| **Carrying information** | **4** | **26.7%** |

## Schema reconciliation

- Columns declared in schema: 15
- Columns **not** in schema: 0
- Schema fields absent from export: 0

## Questions — schema and data disagree

_These are the conflicts that today surface during testing._

- **`isActive`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isDeleted`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`canAccessEquipment`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`canAccessOtherEmployees`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`canAccessDailyJobNotes`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`canAccessOtherEmployeeDetails`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`canAccessJobInformation`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.

## Review — needs a decision

_Mappable, but the transform depends on an answer._

- **`employeeGroupDescription`** — [PLACEHOLDER_NULL] 33 value(s) look like textual nulls ("N/A", "NONE", ...).

## Candidate keys

- `employeeGroupId` (integer)
- `employeeGroupName` (string)
- `uuid` (uuid)

## Field detail

| Field | Fill | Distinct | Type | Len | Top value |
| --- | ---: | ---: | --- | ---: | --- |
| `employeeGroupId` | 100.0% | 34 | integer | 3–4 | `983` 2.9% |
| `employeeGroupName` | 100.0% | 34 | string | 6–29 | `Management` 2.9% |
| `employeeGroupDescription` | 97.1% | 1 | string | 4–4 | `NULL` 100.0% |
| `createdTimestampUtc` | 100.0% | 2 | date | 19–19 | `2026-07-16 18:00:20` 73.5% |
| `isActive` | 100.0% | 1 | integer | 1–1 | `1` 100.0% |
| `isDeleted` | 100.0% | 1 | integer | 1–1 | `0` 100.0% |
| `companyId` | 100.0% | 1 | integer | 3–3 | `265` 100.0% |
| `createdByUserId` | 100.0% | 1 | integer | 2–2 | `45` 100.0% |
| `canAccessEquipment` | 100.0% | 1 | integer | 1–1 | `1` 100.0% |
| `canAccessOtherEmployees` | 100.0% | 1 | integer | 1–1 | `1` 100.0% |
| `canAccessDailyJobNotes` | 100.0% | 1 | integer | 1–1 | `1` 100.0% |
| `canAccessOtherEmployeeDetails` | 100.0% | 1 | integer | 1–1 | `1` 100.0% |
| `canAccessJobInformation` | 100.0% | 1 | integer | 1–1 | `1` 100.0% |
| `employeeGroupColor` | 100.0% | 1 | string | 7–7 | `#f8f9fa` 100.0% |
| `uuid` | 100.0% | 34 | uuid | 36–36 | `35326165-6264-6265-2d34-336262` 2.9% |
