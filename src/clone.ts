import type { SafeCloneOptions } from './types.js';
import { serializeWithHooks, deserializeWithHooks } from './hooks.js';

export function safeJsonClone<T>(value: T, options: SafeCloneOptions = {}): T | undefined {
  const { hooks, onError } = options;

  try {
    if (hooks) {
      const serialized = serializeWithHooks(value, hooks);
      const json = JSON.stringify(serialized);
      const parsed = JSON.parse(json);
      return deserializeWithHooks(parsed, hooks) as T;
    }

    return JSON.parse(JSON.stringify(value)) as T;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    if (onError) {
      onError(err);
      return undefined;
    }
    return undefined;
  }
}
