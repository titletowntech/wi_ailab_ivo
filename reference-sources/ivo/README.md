# IVO Reference Sources

Store each original IVO reference delivery under its object name:

```text
reference-sources/ivo/
  modules.json      # groups objects into IVO modules; mirrors reference/ivo/modules.json
  <object>/
    schema.json     # preferred; a single root JSON file is also accepted
    sample.csv      # optional; a single root CSV file is also accepted
```

Do not edit source files during reference generation. The builder may add a `profile/` folder containing derived evidence. The reviewed, published contract belongs under `reference/ivo/<object>/`.

`modules.json` is kept identical to the published copy so an object that is profiled but not yet published still groups correctly. When the two disagree, `reference/ivo/modules.json` wins. See [its documentation](../../reference/ivo/README.md#modulesjson).

See [../../docs/loading-ivo-references.md](../../docs/loading-ivo-references.md) for the complete workflow.