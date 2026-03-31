# @philiprehberger/safe-json

[![CI](https://github.com/philiprehberger/safe-json/actions/workflows/ci.yml/badge.svg)](https://github.com/philiprehberger/safe-json/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@philiprehberger/safe-json.svg)](https://www.npmjs.com/package/@philiprehberger/safe-json)
[![Last updated](https://img.shields.io/github/last-commit/philiprehberger/safe-json)](https://github.com/philiprehberger/safe-json/commits/main)

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

## API

| Export | Description |
|--------|-------------|
| `safeParse<T>(input)` | Parse JSON string, returns `{ ok, data?, error? }` |
| `safeStringify(value, options?)` | Stringify with circular/depth protection |

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

## Development

```bash
npm install
npm run build
npm test
```

## Support

If you find this project useful:

⭐ [Star the repo](https://github.com/philiprehberger/safe-json)

🐛 [Report issues](https://github.com/philiprehberger/safe-json/issues?q=is%3Aissue+is%3Aopen+label%3Abug)

💡 [Suggest features](https://github.com/philiprehberger/safe-json/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)

❤️ [Sponsor development](https://github.com/sponsors/philiprehberger)

🌐 [All Open Source Projects](https://philiprehberger.com/open-source-packages)

💻 [GitHub Profile](https://github.com/philiprehberger)

🔗 [LinkedIn Profile](https://www.linkedin.com/in/philiprehberger)

## License

[MIT](LICENSE)
