import type { SafeMergeOptions } from './types.js';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...target };

  for (const key of Object.keys(source)) {
    const targetVal = target[key];
    const sourceVal = source[key];

    if (Array.isArray(targetVal) && Array.isArray(sourceVal)) {
      result[key] = [...targetVal, ...sourceVal];
    } else if (isPlainObject(targetVal) && isPlainObject(sourceVal)) {
      result[key] = deepMerge(targetVal, sourceVal);
    } else {
      result[key] = sourceVal;
    }
  }

  return result;
}

export function safeJsonMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>,
  options: SafeMergeOptions = {},
): T | undefined {
  const { onError } = options;

  try {
    if (!isPlainObject(target) || !isPlainObject(source)) {
      throw new TypeError('Both target and source must be plain objects');
    }

    return deepMerge(target, source) as T;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    if (onError) {
      onError(err);
      return undefined;
    }
    return undefined;
  }
}
