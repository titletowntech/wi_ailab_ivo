# Profile — IVO Equipment reference sample

- Source: `reference-sources\ivo\Equipment\equipment.csv`
- Schema: `reference-sources\ivo\Equipment\equipment_data_object.json`
- Rows: 2146
- Columns: 44
- **Rows quarantined**: 12 (field count never reached the header count — excluded from all statistics below)
- Generated: 2026-08-19T12:59:32.662Z

## Pruning

| | Count | Share |
| --- | ---: | ---: |
| Columns in export | 44 | 100% |
| Never populated | 0 | 0.0% |
| Constant (one value) | 18 | 40.9% |
| **Carrying information** | **26** | **59.1%** |

## Schema reconciliation

- Columns declared in schema: 44
- Columns **not** in schema: 0
- Schema fields absent from export: 1

  `organizationId`

## Questions — schema and data disagree

_These are the conflicts that today surface during testing._

- **`isDeleted`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isActive`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isLocationTracked`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isScheduleable`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isScheduleVo`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isInventory`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isRental`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isAttachment`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isWarranty`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isVehicle`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isTrailer`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isSmallEquipment`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`attachedTo`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.
- **`attachedToType`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.
- **`accountingCode`** — [REQUIRED_BUT_EMPTY] Schema marks this required, but 0.0% of rows are empty.
- **`lastHourMeterId`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.
- **`lastOdometerId`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.
- **`pmSetupCompleted`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`maintenanceSetupComplete`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`isPlannable`** — [TYPE_MISMATCH] Schema declares boolean; data looks like integer.
- **`defaultEquipmentCodeId`** — [TYPE_MISMATCH] Schema declares integer; data looks like string.

## Review — needs a decision

_Mappable, but the transform depends on an answer._

- **`equipmentName`** — [MIXED_FORMAT] Mixed observed formats: integer 93.6%, string 6.4%.
- **`equipmentYear`** — [PLACEHOLDER_NULL] 414 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`equipmentYear`** — [MIXED_FORMAT] Mixed observed formats: integer 80.7%, string 19.3%.
- **`equipmentManufacturerId`** — [PLACEHOLDER_NULL] 226 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`equipmentManufacturerId`** — [MIXED_FORMAT] Mixed observed formats: integer 89.5%, string 10.5%.
- **`equipmentModel`** — [MIXED_FORMAT] Mixed observed formats: string 90.5%, integer 9.5%.
- **`serialNumber`** — [PLACEHOLDER_NULL] 1 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`serialNumber`** — [MIXED_FORMAT] Mixed observed formats: string 72.2%, integer 27.6%, decimal 0.1%, date 0.1%.
- **`vinNumber`** — [SPARSE] Only 32.1% populated (689 of 2146 rows) — destination default/null handling required.
- **`currentTrackVoJobId`** — [PLACEHOLDER_NULL] 2 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`attachedTo`** — [PLACEHOLDER_NULL] 2146 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`attachedToType`** — [PLACEHOLDER_NULL] 2146 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`accountingCode`** — [MIXED_FORMAT] Mixed observed formats: integer 93.7%, string 6.3%.
- **`displayNote`** — [PLACEHOLDER_NULL] 2144 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`plateNumber`** — [PLACEHOLDER_NULL] 2144 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`licenseNumber`** — [PLACEHOLDER_NULL] 505 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`licenseNumber`** — [MIXED_FORMAT] Mixed observed formats: string 87.1%, integer 12.9%.
- **`color`** — [PLACEHOLDER_NULL] 2144 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`equipmentDetailNote`** — [PLACEHOLDER_NULL] 2144 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`lastHourMeterId`** — [PLACEHOLDER_NULL] 1564 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`lastHourMeterId`** — [MIXED_FORMAT] Mixed observed formats: string 72.9%, integer 27.1%.
- **`lastOdometerId`** — [PLACEHOLDER_NULL] 1666 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`lastOdometerId`** — [MIXED_FORMAT] Mixed observed formats: string 77.6%, integer 22.4%.
- **`defaultEquipmentCodeId`** — [PLACEHOLDER_NULL] 2012 value(s) look like textual nulls ("N/A", "NONE", ...).
- **`defaultEquipmentCodeId`** — [MIXED_FORMAT] Mixed observed formats: string 93.8%, integer 6.2%.
- **`overrideEquipmentGroupColor`** — [PLACEHOLDER_NULL] 2146 value(s) look like textual nulls ("N/A", "NONE", ...).

## Transforms — deterministic

_Derivable from the data with no judgement call._

- **`equipmentName`** — [NUMERIC_AS_STRING] Declared string, observed numeric. Do not cast if leading zeros matter.
- **`equipmentModel`** — [WHITESPACE_NULL] 685 value(s) are whitespace-only, not empty. "" vs " " will not compare equal.
- **`serialNumber`** — [WHITESPACE_NULL] 810 value(s) are whitespace-only, not empty. "" vs " " will not compare equal.
- **`vinNumber`** — [WHITESPACE_NULL] 1439 value(s) are whitespace-only, not empty. "" vs " " will not compare equal.
- **`accountingCode`** — [NUMERIC_AS_STRING] Declared string, observed numeric. Do not cast if leading zeros matter.

## Candidate keys

- `equipmentId` (integer)
- `equipmentName` (integer)
- `uuid` (uuid)

## Field detail

| Field | Fill | Distinct | Type | Len | Top value |
| --- | ---: | ---: | --- | ---: | --- |
| `equipmentId` | 100.0% | 2146 | integer | 5–5 | `51862` 0.0% |
| `equipmentName` | 100.0% | 2146 | integer | 3–8 | `307100` 0.0% |
| `equipmentYear` | 100.0% | 59 | integer | 1–4 | `NULL` 19.3% |
| `equipmentManufacturerId` | 100.0% | 125 | integer | 4–5 | `10429` 18.8% |
| `equipmentModel` | 67.7% | 538 | string | 2–22 | `F250 XL` 2.4% |
| `equipmentDescription` | 100.0% | 1395 | string | 12–60 | `BARGE-SHUGART 40' x 10' x 5'` 2.2% |
| `serialNumber` | 60.4% | 1275 | string | 3–39 | `1201975611` 0.3% |
| `vinNumber` | 32.1% | 689 | string | 17–17 | `3FMCR9BN0TRE34306` 0.1% |
| `equipmentGroupId` | 100.0% | 209 | integer | 4–4 | `4292` 6.0% |
| `createdTimestampUtc` | 100.0% | 771 | date | 19–19 | `2026-07-16 17:51:58` 0.7% |
| `companyId` | 100.0% | 1 | integer | 3–3 | `265` 100.0% |
| `currentTrackVoJobId` | 100.0% | 56 | integer | 4–5 | `25018` 21.6% |
| `isDeleted` | 100.0% | 1 | integer | 1–1 | `0` 100.0% |
| `createdByUserId` | 100.0% | 2 | integer | 2–5 | `45` 100.0% |
| `isActive` | 100.0% | 2 | integer | 1–1 | `1` 84.8% |
| `isLocationTracked` | 100.0% | 2 | integer | 1–1 | `1` 93.4% |
| `isScheduleable` | 100.0% | 2 | integer | 1–1 | `1` 98.1% |
| `isScheduleVo` | 100.0% | 1 | integer | 1–1 | `0` 100.0% |
| `isInventory` | 100.0% | 1 | integer | 1–1 | `0` 100.0% |
| `isRental` | 100.0% | 2 | integer | 1–1 | `0` 94.2% |
| `isAttachment` | 100.0% | 1 | integer | 1–1 | `0` 100.0% |
| `isWarranty` | 100.0% | 1 | integer | 1–1 | `0` 100.0% |
| `isVehicle` | 100.0% | 1 | integer | 1–1 | `0` 100.0% |
| `isTrailer` | 100.0% | 1 | integer | 1–1 | `0` 100.0% |
| `isSmallEquipment` | 100.0% | 1 | integer | 1–1 | `0` 100.0% |
| `attachedTo` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `attachedToType` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
| `divisionId` | 100.0% | 3 | integer | 3–3 | `699` 99.9% |
| `mshaEqInspectionTemplateId` | 100.0% | 1 | integer | 1–1 | `0` 100.0% |
| `accountingCode` | 100.0% | 2145 | integer | 3–8 | `307100` 0.0% |
| `displayNote` | 100.0% | 2 | string | 4–36 | `NULL` 100.0% |
| `plateNumber` | 99.9% | 1 | string | 4–4 | `NULL` 100.0% |
| `licenseNumber` | 67.0% | 911 | string | 2–10 | `NULL` 23.6% |
| `color` | 99.9% | 1 | string | 4–4 | `NULL` 100.0% |
| `equipmentDetailNote` | 99.9% | 1 | string | 4–4 | `NULL` 100.0% |
| `lastHourMeterId` | 100.0% | 583 | string | 4–8 | `NULL` 72.9% |
| `lastOdometerId` | 100.0% | 481 | string | 4–7 | `NULL` 77.6% |
| `pmSetupCompleted` | 100.0% | 1 | integer | 1–1 | `0` 100.0% |
| `maintenanceSetupComplete` | 100.0% | 1 | integer | 1–1 | `0` 100.0% |
| `activeWorkOrders` | 100.0% | 5 | integer | 1–1 | `0` 93.8% |
| `isPlannable` | 100.0% | 2 | integer | 1–1 | `0` 56.8% |
| `defaultEquipmentCodeId` | 100.0% | 135 | string | 4–4 | `NULL` 93.8% |
| `uuid` | 100.0% | 2146 | uuid | 36–36 | `6b40b473-91f9-434f-a53c-104c16` 0.0% |
| `overrideEquipmentGroupColor` | 100.0% | 1 | string | 4–4 | `NULL` 100.0% |
