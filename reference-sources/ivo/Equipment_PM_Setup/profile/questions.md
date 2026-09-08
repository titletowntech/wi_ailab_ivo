# Questions — IVO Equipment_PM_Setup reference sample

Generated from the export. Every item needs a human answer before mapping.

## 1. `isDeleted`

Fill 100.0% · 2 distinct · observed integer

Sample values: `0` ×1657, `1` ×85

- **TYPE_MISMATCH** — Schema declares boolean; data looks like integer.

## 2. `isActive`

Fill 100.0% · 2 distinct · observed integer

Sample values: `1` ×1649, `0` ×93

- **TYPE_MISMATCH** — Schema declares boolean; data looks like integer.

## 3. `intervalDays`

Fill 100.0% · 4 distinct · observed string

Sample values: `NULL` ×1375, `365` ×210, `90` ×146, `1825` ×11

- **TYPE_MISMATCH** — Schema declares integer; data looks like string.

## 4. `intervalOdometer`

Fill 100.0% · 9 distinct · observed string

Sample values: `NULL` ×1625, `6000` ×40, `20000` ×35, `1000` ×13, `2000` ×12

- **TYPE_MISMATCH** — Schema declares integer; data looks like string.

## 5. `fixedHours`

Fill 100.0% · 9 distinct · observed string

Sample values: `NULL` ×1669, `1000` ×52, `40` ×7, `50` ×6, `100` ×3

- **TYPE_MISMATCH** — Schema declares integer; data looks like string.

## 6. `triggerDays`

Fill 100.0% · 5 distinct · observed string

Sample values: `NULL` ×1372, `7` ×342, `5` ×15, `30` ×11, `0` ×2

- **TYPE_MISMATCH** — Schema declares integer; data looks like string.

## 7. `triggerOdometer`

Fill 100.0% · 4 distinct · observed string

Sample values: `NULL` ×1625, `200` ×79, `40` ×37, `30` ×1

- **TYPE_MISMATCH** — Schema declares integer; data looks like string.
