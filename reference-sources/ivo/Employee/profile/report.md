# Profile — IVO Employee reference sample

- Source: `reference-sources\ivo\Employee\employees.csv`
- Schema: `reference-sources\ivo\Employee\employee.json`
- Rows: 1116
- Columns: 35
- Generated: 2026-08-19T12:59:31.941Z

## Pruning

| | Count | Share |
| --- | ---: | ---: |
| Columns in export | 35 | 100% |
| Never populated | 0 | 0.0% |
| Constant (one value) | 22 | 62.9% |
| **Carrying information** | **13** | **37.1%** |

## Schema reconciliation

- Columns declared in schema: 35
- Columns **not** in schema: 0
- Schema fields absent from export: 0

## Questions — schema and data disagree

_These are the conflicts that today surface during testing._

- **`isActive`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isDeleted`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isLocationTracked`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isScheduleable`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isVendor`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`canViewOtherEmployees`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`canViewOtherVendors`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`canViewJobNotes`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`canViewEquipment`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`canViewOtherEmployeeNotes`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`canViewOtherVendorNotes`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isTrucking`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isAssigned`** — [TYPE_MISMATCH] Schema declares boolean; data looks like string.
- **`isForeman`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.

## Review — needs a decision

_Mappable, but the transform depends on an answer._

- **`nickname`** — [PLACEHOLDER_NULL] 1116 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`mobilePhone`** — [PLACEHOLDER_NULL] 76 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`mobilePhone`** — [MIXED_FORMAT] Mixed observed formats: integer 93.1%, string 6.8%, phone 0.1%.
- **`emergencyContactName`** — [PLACEHOLDER_NULL] 1116 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`emergencyContactNumber`** — [PLACEHOLDER_NULL] 1116 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`employeeGroupId`** — [PLACEHOLDER_NULL] 40 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`employeeGroupId`** — [MIXED_FORMAT] Mixed observed formats: integer 96.4%, string 3.6%.
- **`vendorName`** — [PLACEHOLDER_NULL] 1116 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`isAssigned`** — [PLACEHOLDER_NULL] 1116 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`assignedCount`** — [PLACEHOLDER_NULL] 1116 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`assignedToUserId`** — [PLACEHOLDER_NULL] 6 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`employeeCode`** — [PLACEHOLDER_NULL] 1116 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`defaultLaborCodeId`** — [PLACEHOLDER_NULL] 346 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`defaultLaborCodeId`** — [MIXED_FORMAT] Mixed observed formats: integer 69.0%, string 31.0%.
- **`overrideEmployeeGroupColor`** — [PLACEHOLDER_NULL] 1116 value(s) look like textual nulls ("N/A", "NONE", ...).

## Transforms — deterministic

_Derivable from the data with no judgement call._

- **`mobilePhone`** — [NUMERIC_AS_STRING] Declared string, observed numeric. Do not cast if leading zeros matter.
- **`accountingCode`** — [NUMERIC_AS_STRING] Declared string, observed numeric. Do not cast if leading zeros matter.

## Candidate keys

- `employeeId` (integer)
- `accountingCode` (integer)
- `uuid` (uuid)

## Field detail

| Field | Fill | Distinct | Type | Len | Top value |
| --- | ---: | ---: | --- | ---: | --- |
| `employeeId` | 100.0% | 1116 | integer | 5–5 | `16467` 0.1% |
| `firstName` | 100.0% | 503 | string | 1–12 | `Jose` 2.3% |
| `lastName` | 100.0% | 950 | string | 2–22 | `Smith` 1.1% |
| `nickname` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `mobilePhone` | 100.0% | 1041 | integer | 4–14 | `NULL` 6.8% |
| `emergencyContactName` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `emergencyContactNumber` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `employeeGroupId` | 100.0% | 26 | integer | 3–4 | `986` 20.2% |
| `createdTimestampUtc` | 100.0% | 1101 | date | 19–19 | `2026-07-31 17:32:27` 0.3% |
| `isActive` | 100.0% | 2 | integer | 1–1 | `1` 93.8% |
| `isDeleted` | 100.0% | 1 | integer | 1–1 | `0` 100.0% |
| `createdByUserId` | 100.0% | 1 | integer | 2–2 | `45` 100.0% |
| `currentTrackVoJobId` | 100.0% | 1 | integer | 5–5 | `25137` 100.0% |
| `companyId` | 100.0% | 1 | integer | 3–3 | `265` 100.0% |
| `isLocationTracked` | 100.0% | 1 | integer | 1–1 | `1` 100.0% |
| `isScheduleable` | 100.0% | 1 | integer | 1–1 | `1` 100.0% |
| `divisionId` | 100.0% | 17 | integer | 3–3 | `685` 67.1% |
| `accountingCode` | 100.0% | 1116 | integer | 3–5 | `820` 0.1% |
| `isVendor` | 100.0% | 1 | integer | 1–1 | `0` 100.0% |
| `vendorName` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `canViewOtherEmployees` | 100.0% | 1 | integer | 1–1 | `1` 100.0% |
| `canViewOtherVendors` | 100.0% | 1 | integer | 1–1 | `1` 100.0% |
| `canViewJobNotes` | 100.0% | 1 | integer | 1–1 | `1` 100.0% |
| `canViewEquipment` | 100.0% | 1 | integer | 1–1 | `1` 100.0% |
| `canViewOtherEmployeeNotes` | 100.0% | 1 | integer | 1–1 | `1` 100.0% |
| `canViewOtherVendorNotes` | 100.0% | 1 | integer | 1–1 | `1` 100.0% |
| `isTrucking` | 100.0% | 1 | integer | 1–1 | `0` 100.0% |
| `isAssigned` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `assignedCount` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `assignedToUserId` | 100.0% | 1111 | integer | 4–5 | `NULL` 0.5% |
| `employeeCode` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `isForeman` | 100.0% | 2 | integer | 1–1 | `0` 99.6% |
| `defaultLaborCodeId` | 100.0% | 272 | integer | 4–4 | `NULL` 31.0% |
| `uuid` | 100.0% | 1116 | uuid | 36–36 | `5e3e2c5b-10f2-4545-8028-7869f9` 0.1% |
| `overrideEmployeeGroupColor` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
