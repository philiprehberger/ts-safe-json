# @philiprehberger/safe-json

[![CI](https://github.com/philiprehberger/ts-safe-json/actions/workflows/ci.yml/badge.svg)](https://github.com/philiprehberger/ts-safe-json/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@philiprehberger/safe-json.svg)](https://www.npmjs.com/package/@philiprehberger/safe-json)
[![Last updated](https://img.shields.io/github/last-commit/philiprehberger/ts-safe-json)](https://github.com/philiprehberger/ts-safe-json/commits/main)

Safe JSON parsing and serialization with circular detection and depth limiting

## Installation

```bash
npm install @philiprehberger/safe-json
```

## Usage

### Safe Parse

```ts
import { safeParse } from '@philiprehberger/safe-json';

const { ok, data, error } = safeParse<User>(jsonString);
if (ok) {
  console.log(data.name); // typed as User
} else {
  console.error(error.message);
}
```

### Safe Stringify

```ts
import { safeStringify } from '@philiprehberger/safe-json';

// Handles circular references
const obj: any = { name: 'test' };
obj.self = obj;
safeStringify(obj);
// {"name":"test","self":"[Circular]"}

// Depth limiting
safeStringify(deeplyNested, { maxDepth: 3 });
// Objects beyond depth 3 become "[MaxDepth]"

// Pretty print
safeStringify(data, { space: 2 });
```

### Custom Type Serialization Hooks

```ts
import {
  safeParse,
  safeStringify,
  createTypeHooks,
  builtInSerializers,
} from '@philiprehberger/safe-json';

// Create hooks with built-in serializers for Date, BigInt, Set, and Map
const hooks = createTypeHooks();

const data = {
  createdAt: new Date('2025-01-15'),
  bigNum: BigInt('99999999999999999'),
  tags: new Set(['a', 'b']),
  meta: new Map([['key', 'value']]),
};

const json = safeStringify(data, { hooks });
const { ok, data: restored } = safeParse(json, { hooks });
// restored.createdAt is a Date instance
// restored.tags is a Set instance
```

### Deep Clone with Type Preservation

```ts
import { safeJsonClone, createTypeHooks } from '@philiprehberger/safe-json';

const hooks = createTypeHooks();
const original = { date: new Date(), items: new Set([1, 2, 3]) };

const cloned = safeJsonClone(original, { hooks });
// cloned.date is a new Date instance with the same value
// cloned.items is a new Set with the same values
```

### Deep Merge

```ts
import { safeJsonMerge } from '@philiprehberger/safe-json';

const target = { a: 1, nested: { x: 10 }, tags: ['a'] };
const source = { b: 2, nested: { y: 20 }, tags: ['b'] };

const merged = safeJsonMerge(target, source);
// { a: 1, b: 2, nested: { x: 10, y: 20 }, tags: ['a', 'b'] }
```

### Structural Equality

```ts
import { safeJsonEqual, createTypeHooks } from '@philiprehberger/safe-json';

safeJsonEqual({ a: 1, items: [1, 2] }, { a: 1, items: [1, 2] }); // true

// Date / BigInt / Set / Map equality via hooks
const hooks = createTypeHooks();
safeJsonEqual({ at: new Date('2026-01-01') }, { at: new Date('2026-01-01') }, { hooks }); // true

// Circular references are tolerated
const a: any = { x: 1 }; a.self = a;
const b: any = { x: 1 }; b.self = b;
safeJsonEqual(a, b); // true
```

### Configurable Error Handler

```ts
import { safeParse, safeStringify, safeJsonClone } from '@philiprehberger/safe-json';

const onError = (err: Error) => console.error('JSON error:', err.message);

safeParse('invalid json', { onError });
safeStringify(value, { onError });
safeJsonClone(value, { onError });
```

## API

| Export | Description |
|--------|-------------|
| `safeParse<T>(input, options?)` | Parse JSON string, returns `{ ok, data?, error? }` |
| `safeStringify(value, options?)` | Stringify with circular/depth protection |
| `safeJsonClone<T>(value, options?)` | Deep clone via serialize/deserialize |
| `safeJsonMerge<T>(target, source, options?)` | Deep merge two objects safely |
| `safeJsonEqual(a, b, options?)` | Structural JSON-aware equality with circular safety and optional type hooks |
| `createTypeHooks(serializers?)` | Create a TypeHooks config (defaults to built-in serializers) |
| `builtInSerializers` | Array of built-in serializers for Date, BigInt, Set, Map |
| `dateSerializer` | Type serializer for Date |
| `bigIntSerializer` | Type serializer for BigInt |
| `setSerializer` | Type serializer for Set |
| `mapSerializer` | Type serializer for Map |

### `SafeParseResult<T>`

| Property | Type | Description |
|----------|------|-------------|
| `ok` | `boolean` | Whether parsing succeeded |
| `data` | `T` | Parsed value (if ok) |
| `error` | `Error` | Parse error (if not ok) |

### `StringifyOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxDepth` | `number` | — | Max nesting depth before `"[MaxDepth]"` |
| `replacer` | `(key, value) => unknown` | — | Custom replacer function |
| `space` | `number` | — | Indentation spaces |
| `onError` | `(error: Error) => void` | — | Error callback instead of silent failure |
| `hooks` | `TypeHooks` | — | Custom type serialization hooks |

### `SafeParseOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `hooks` | `TypeHooks` | — | Custom type deserialization hooks |
| `onError` | `(error: Error) => void` | — | Error callback |

### `TypeSerializer<T>`

| Property | Type | Description |
|----------|------|-------------|
| `type` | `string` | Unique type identifier |
| `test` | `(value: unknown) => boolean` | Returns true if value matches this type |
| `serialize` | `(value: T) => unknown` | Convert value to JSON-safe representation |
| `deserialize` | `(value: unknown) => T` | Restore value from JSON representation |

## Development

```bash
npm install
npm run build
npm test
```

## Support

If you find this project useful:

⭐ [Star the repo](https://github.com/philiprehberger/ts-safe-json)

🐛 [Report issues](https://github.com/philiprehberger/ts-safe-json/issues?q=is%3Aissue+is%3Aopen+label%3Abug)

💡 [Suggest features](https://github.com/philiprehberger/ts-safe-json/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)

❤️ [Sponsor development](https://github.com/sponsors/philiprehberger)

🌐 [All Open Source Projects](https://philiprehberger.com/open-source-packages)

💻 [GitHub Profile](https://github.com/philiprehberger)

🔗 [LinkedIn Profile](https://www.linkedin.com/in/philiprehberger)

## License

[MIT](LICENSE)
