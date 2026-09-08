# Questions — IVO Equipment reference sample

Generated from the export. Every item needs a human answer before mapping.

## 1. `isActive`

Fill 100.0% · 2 distinct · observed integer

Sample values: `1` ×1820, `0` ×326

- **TYPE_MISMATCH** — Schema declares boolean; data looks like integer.

## 2. `isLocationTracked`

Fill 100.0% · 2 distinct · observed integer

Sample values: `1` ×2005, `0` ×141

- **TYPE_MISMATCH** — Schema declares boolean; data looks like integer.

## 3. `isScheduleable`

Fill 100.0% · 2 distinct · observed integer

Sample values: `1` ×2106, `0` ×40

- **TYPE_MISMATCH** — Schema declares boolean; data looks like integer.

## 4. `isRental`

Fill 100.0% · 2 distinct · observed integer

Sample values: `0` ×2022, `1` ×124

- **TYPE_MISMATCH** — Schema declares boolean; data looks like integer.

## 5. `accountingCode`

Fill 100.0% · 2145 distinct · observed integer

Sample values: `307100` ×1, `280400` ×1, `560100` ×1, `279900` ×1, `8009` ×1

- **REQUIRED_BUT_EMPTY** — Schema marks this required, but 0.0% of rows are empty.

## 6. `lastHourMeterId`

Fill 100.0% · 583 distinct · observed string

Sample values: `NULL` ×1564, `10016629` ×1, `10022273` ×1, `10023638` ×1, `10015978` ×1

- **TYPE_MISMATCH** — Schema declares integer; data looks like string.

## 7. `lastOdometerId`

Fill 100.0% · 481 distinct · observed string

Sample values: `NULL` ×1666, `5281521` ×1, `5206369` ×1, `5206363` ×1, `5279248` ×1

- **TYPE_MISMATCH** — Schema declares integer; data looks like string.

## 8. `isPlannable`

Fill 100.0% · 2 distinct · observed integer

Sample values: `0` ×1219, `1` ×927

- **TYPE_MISMATCH** — Schema declares boolean; data looks like integer.

## 9. `defaultEquipmentCodeId`

Fill 100.0% · 135 distinct · observed string

Sample values: `NULL` ×2012, `2793` ×1, `2788` ×1, `2732` ×1, `2743` ×1

- **TYPE_MISMATCH** — Schema declares integer; data looks like string.
