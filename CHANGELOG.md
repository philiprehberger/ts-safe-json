# Changelog

## 0.2.0

- Add custom type serialization hooks for Date, BigInt, Set, and Map
- Add safeJsonClone() for deep cloning with type preservation
- Add safeJsonMerge() for safe deep object merging
- Add configurable error handler callback

## 0.1.6

- Standardize README to 3-badge format with emoji Support section
- Update CI actions to v5 for Node.js 24 compatibility
- Add GitHub issue templates, dependabot config, and PR template

## 0.1.5

- Republish under new npm package name

## 0.1.4

- Add Development section to README
- Fix CI badge to reference publish.yml
- Add test script to package.json

## 0.1.0
- Initial release
- `safeParse()` for safe JSON parsing without throwing
- `safeStringify()` with circular reference detection and max depth
