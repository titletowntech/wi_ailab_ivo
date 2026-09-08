# Profile — IVO Equipment_PM_Setup reference sample

- Source: `reference-sources\ivo\Equipment_PM_Setup\equipment pm setup.csv`
- Schema: `reference-sources\ivo\Equipment_PM_Setup\equipment_pm_setup.json`
- Rows: 1742
- Columns: 25
- Generated: 2026-08-19T12:59:34.551Z

## Pruning

| | Count | Share |
| --- | ---: | ---: |
| Columns in export | 25 | 100% |
| Never populated | 0 | 0.0% |
| Constant (one value) | 3 | 12.0% |
| **Carrying information** | **22** | **88.0%** |

## Schema reconciliation

- Columns declared in schema: 25
- Columns **not** in schema: 0
- Schema fields absent from export: 0

## Questions — schema and data disagree

_These are the conflicts that today surface during testing._

- **`isDeleted`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isActive`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`intervalDays`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.
- **`intervalOdometer`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.
- **`beginningHours`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.
- **`beginningOdometer`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.
- **`fixedHours`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.
- **`fixedOdometer`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.
- **`triggerDays`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.
- **`triggerOdometer`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.

## Review — needs a decision

_Mappable, but the transform depends on an answer._

- **`intervalHours`** — [PLACEHOLDER_NULL] 498 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`intervalHours`** — [MIXED_FORMAT] Mixed observed formats: integer 71.4%, string 28.6%.
- **`intervalDays`** — [PLACEHOLDER_NULL] 1375 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`intervalDays`** — [MIXED_FORMAT] Mixed observed formats: string 78.9%, integer 21.1%.
- **`intervalOdometer`** — [PLACEHOLDER_NULL] 1625 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`intervalOdometer`** — [MIXED_FORMAT] Mixed observed formats: string 93.3%, integer 6.7%.
- **`beginningHours`** — [PLACEHOLDER_NULL] 1742 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`beginningDate`** — [PLACEHOLDER_NULL] 1739 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`beginningOdometer`** — [PLACEHOLDER_NULL] 1742 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`fixedDate`** — [PLACEHOLDER_NULL] 1739 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`fixedHours`** — [PLACEHOLDER_NULL] 1669 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`fixedHours`** — [MIXED_FORMAT] Mixed observed formats: string 95.8%, integer 4.2%.
- **`fixedOdometer`** — [PLACEHOLDER_NULL] 1742 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`triggerDays`** — [PLACEHOLDER_NULL] 1372 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`triggerDays`** — [MIXED_FORMAT] Mixed observed formats: string 78.8%, integer 21.2%.
- **`triggerHours`** — [PLACEHOLDER_NULL] 478 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`triggerHours`** — [MIXED_FORMAT] Mixed observed formats: integer 72.6%, string 27.4%.
- **`triggerOdometer`** — [PLACEHOLDER_NULL] 1625 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`triggerOdometer`** — [MIXED_FORMAT] Mixed observed formats: string 93.3%, integer 6.7%.
- **`lastPmPerformedId`** — [PLACEHOLDER_NULL] 513 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`lastPmPerformedId`** — [MIXED_FORMAT] Mixed observed formats: integer 70.6%, string 29.4%.
- **`companyEquipmentPmTemplateId`** — [PLACEHOLDER_NULL] 8 value(s) look like textual nulls ("N/A", "NONE", ...).

## Transforms — deterministic

_Derivable from the data with no judgement call._

- **`partsNote`** — [PADDED] 1052 value(s) carry leading/trailing whitespace — needs .trim().
- **`partsNote`** — [WHITESPACE_NULL] 14 value(s) are whitespace-only, not empty. "" vs " " will not compare equal.
- **`workNote`** — [PADDED] 1021 value(s) carry leading/trailing whitespace — needs .trim().

## Candidate keys

- `setupId` (integer)
- `uuid` (uuid)

## Field detail

| Field | Fill | Distinct | Type | Len | Top value |
| --- | ---: | ---: | --- | ---: | --- |
| `setupId` | 100.0% | 1742 | integer | 5–5 | `34719` 0.1% |
| `equipmentId` | 100.0% | 682 | integer | 5–5 | `55224` 1.0% |
| `createdTimestampUtc` | 100.0% | 1240 | date | 19–19 | `2026-07-30 19:13:14` 0.2% |
| `pmTypeId` | 100.0% | 5 | integer | 1–1 | `1` 70.9% |
| `isDeleted` | 100.0% | 2 | integer | 1–1 | `0` 95.1% |
| `isActive` | 100.0% | 2 | integer | 1–1 | `1` 94.7% |
| `pmName` | 100.0% | 213 | string | 3–60 | `CALIBRATION - (WELDER) - 365 D` 4.8% |
| `intervalHours` | 100.0% | 10 | integer | 3–5 | `NULL` 28.6% |
| `intervalDays` | 100.0% | 4 | string | 2–4 | `NULL` 78.9% |
| `intervalOdometer` | 100.0% | 9 | string | 3–5 | `NULL` 93.3% |
| `beginningHours` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `beginningDate` | 100.0% | 3 | string | 4–10 | `NULL` 99.8% |
| `beginningOdometer` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `fixedDate` | 100.0% | 3 | string | 4–10 | `NULL` 99.8% |
| `fixedHours` | 100.0% | 9 | string | 2–4 | `NULL` 95.8% |
| `fixedOdometer` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `partsNote` | 80.9% | 3 | string | 33–59 | `SEE EQUIPMENT DETAILS - PARTS ` 97.4% |
| `workNote` | 99.8% | 131 | string | 24–1394 | `SUBMIT WEVR PAPERWORK. WORK OR` 16.6% |
| `createdByUserId` | 100.0% | 2 | integer | 4–5 | `1288` 88.8% |
| `triggerDays` | 100.0% | 5 | string | 1–4 | `NULL` 78.8% |
| `triggerHours` | 100.0% | 8 | integer | 1–4 | `40` 66.3% |
| `triggerOdometer` | 100.0% | 4 | string | 2–4 | `NULL` 93.3% |
| `lastPmPerformedId` | 100.0% | 1230 | integer | 4–5 | `NULL` 29.4% |
| `companyEquipmentPmTemplateId` | 100.0% | 207 | integer | 4–4 | `2755` 4.8% |
| `uuid` | 100.0% | 1742 | uuid | 36–36 | `266987d5-c6e4-4116-9585-0d4eba` 0.1% |
