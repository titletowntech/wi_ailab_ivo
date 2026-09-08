'use strict';

// Flattens a draft-07 connector schema into one row per field.
// Nested arrays (e.g. Vista "Parts") are flattened with a dotted path and marked nested,
// since a flat CSV export won't contain them.
function flattenSchema(schema) {
  const fields = new Map();

  walk(schema, '', false);

  function walk(node, prefix, nested) {
    if (!node || node.type !== 'object' || !node.properties) return;
    const required = new Set(node.required || []);

    for (const [name, def] of Object.entries(node.properties)) {
      const path = prefix ? prefix + '.' + name : name;
      const types = Array.isArray(def.type) ? def.type : [def.type].filter(Boolean);

      if (types.includes('array') && def.items) {
        fields.set(path, entry(path, name, def, types, required.has(name), nested, true));
        walk(def.items, path, true);
        continue;
      }

      if (types.includes('object') && def.properties) {
        fields.set(path, entry(path, name, def, types, required.has(name), nested, false));
        walk(def, path, true);
        continue;
      }

      fields.set(path, entry(path, name, def, types, required.has(name), nested, false));
    }
  }

  function entry(path, name, def, types, isRequired, nested, isArray) {
    return {
      path,
      name,
      types: types.filter((t) => t !== 'null'),
      nullable: types.includes('null'),
      maxLength: def.maxLength ?? null,
      minLength: def.minLength ?? null,
      pattern: def.pattern ?? null,
      format: def.format ?? null,
      enum: def.enum ? def.enum.filter((v) => v !== null) : null,
      description: (def.description || '').trim(),
      required: isRequired,
      writeOnly: def.writeOnly === true,
      nested,
      isArray,
    };
  }

  return fields;
}

module.exports = { flattenSchema };
