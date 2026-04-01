import type {
  SafeParseResult,
  SafeStringifyOptions,
  SafeParseOptions,
  StringifyOptions,
  ErrorHandler,
} from './types.js';
import { serializeWithHooks, deserializeWithHooks } from './hooks.js';

export function safeParse<T = unknown>(
  input: string,
  options?: SafeParseOptions,
): SafeParseResult<T> {
  const onError = options?.onError;
  const hooks = options?.hooks;

  try {
    let data = JSON.parse(input) as T;
    if (hooks) {
      data = deserializeWithHooks(data, hooks) as T;
    }
    return { ok: true, data };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    if (onError) {
      onError(err);
    }
    return {
      ok: false,
      error: err,
    };
  }
}

export function safeStringify(
  value: unknown,
  options: SafeStringifyOptions | StringifyOptions = {},
): string {
  const { maxDepth, replacer, space, onError } = options as SafeStringifyOptions;
  const hooks = (options as SafeStringifyOptions).hooks;
  const seen = new WeakSet<object>();

  function serialize(val: unknown, depth: number): unknown {
    if (hooks) {
      for (const serializer of hooks.serializers) {
        if (serializer.test(val)) {
          return serializer.serialize(val);
        }
      }
    }

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
    const err = error instanceof Error ? error : new Error(String(error));
    if (onError) {
      onError(err);
    }
    return JSON.stringify({ error: 'Failed to stringify value' });
  }
}
