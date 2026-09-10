# Loading IVO References

This is an IVO-owned publication process. Run it when IVO introduces an object or changes an existing contract. Do not run it as part of customer onboarding.

## Inputs

Preserve the original IVO-supplied files separately from the published contract:

```text
reference-sources/ivo/<object>/
  schema.json       # preferred; a single root JSON file is also accepted
  sample.csv        # optional; a single root CSV file is also accepted
  profile/          # generated evidence; never an original input
```

Treat `schema.json` and `sample.csv` as immutable source evidence. Replace them only with a newly dated delivery from IVO. The sample must contain IVO test or safely masked data, never records copied from a customer integration.

## Generate the Draft Contract

```powershell
$object = "equipment"
$source = "reference-sources/ivo/$object"
$reference = "reference/ivo/$object"

node tools/build-ivo-reference.js `
  --source $source `
  --object $object `
  --out $reference
```

The builder:

1. Reads the original `schema.json` without modifying it.
2. Profiles `sample.csv` when present and writes evidence to `profile/` beside the source files.
3. Copies the schema and creates `field-catalog.csv` and `validation-rules.json` under `reference/ivo/<object>/`.
4. Marks unsupported business semantics as `confirm` rather than treating sample observations as universal rules.

`data.csv` is accepted as a legacy alias for `sample.csv`.
When the preferred names are absent, the builder accepts exactly one root JSON file as the schema and exactly one root CSV file as the sample.

## Review and Publish

The first build creates a draft. IVO must review the three files under `reference/ivo/<object>/` and resolve required `confirm` items. Once approved, that folder is the static destination contract consumed by every customer mapping.

A new object is not listed in `modules.json`, so it groups under the manifest's `defaultModule` (Equipment Management). Add it to the correct module in both `reference/ivo/modules.json` and `reference-sources/ivo/modules.json` as part of publishing. See [the reference contract README](../reference/ivo/README.md#modulesjson).

The builder refuses to replace existing generated files. For a deliberate IVO contract update, build in a temporary folder and review the diff first. Only then rerun against the published folder with `--force yes`. Preserve manually confirmed semantics while applying structural changes.

Customer evidence must never be used to overwrite or silently update the published reference.
