# IVO Reference Sources

Store each original IVO reference delivery under its object name:

```text
reference-sources/ivo/<object>/
  schema.json       # preferred; a single root JSON file is also accepted
  sample.csv        # optional; a single root CSV file is also accepted
```

Do not edit source files during reference generation. The builder may add a `profile/` folder containing derived evidence. The reviewed, published contract belongs under `reference/ivo/<object>/`.

See [../../docs/loading-ivo-references.md](../../docs/loading-ivo-references.md) for the complete workflow.