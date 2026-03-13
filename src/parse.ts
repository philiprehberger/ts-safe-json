import type { SafeParseResult, StringifyOptions } from './types.js';

export function safeParse<T = unknown>(input: string): SafeParseResult<T> {
  try {
    const data = JSON.parse(input) as T;
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

export function safeStringify(
  value: unknown,
  options: StringifyOptions = {},
): string {
  const { maxDepth, replacer, space } = options;
  const seen = new WeakSet<object>();

  function serialize(val: unknown, depth: number): unknown {
    if (val === null || typeof val !== 'object') return val;

    if (seen.has(val as object)) return '[Circular]';
    seen.add(val as object);

    if (maxDepth !== undefined && depth >= maxDepth) return '[MaxDepth]';

    if (Array.isArray(val)) {
      const arr: unknown[] = [];
      for (const item of val) {
        arr.push(serialize(item, depth + 1));
      }
      seen.delete(val as object);
      return arr;
    }

    const obj: Record<string, unknown> = {};
    for (const [key, v] of Object.entries(val as Record<string, unknown>)) {
      obj[key] = serialize(v, depth + 1);
    }
    seen.delete(val as object);
    return obj;
  }

  try {
    const safe = serialize(value, 0);
    return JSON.stringify(safe, replacer as (key: string, value: unknown) => unknown, space);
  } catch (error) {
    return JSON.stringify({ error: 'Failed to stringify value' });
  }
}
