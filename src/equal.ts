import type { TypeHooks } from './types.js';

export interface SafeJsonEqualOptions {
  hooks?: TypeHooks;
}

export function safeJsonEqual(
  a: unknown,
  b: unknown,
  options: SafeJsonEqualOptions = {},
): boolean {
  const { hooks } = options;
  return compare(a, b, hooks, new WeakMap());
}

function compare(
  a: unknown,
  b: unknown,
  hooks: TypeHooks | undefined,
  seen: WeakMap<object, WeakSet<object>>,
): boolean {
  if (Object.is(a, b)) return true;

  if (hooks) {
    const aHook = matchHook(a, hooks);
    const bHook = matchHook(b, hooks);
    if (aHook && bHook) {
      if (aHook.type !== bHook.type) return false;
      return compare(aHook.serialize(a), bHook.serialize(b), hooks, seen);
    }
    if (aHook || bHook) return false;
  }

  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }

  const aObj = a as object;
  const bObj = b as object;

  let cycleSet = seen.get(aObj);
  if (cycleSet?.has(bObj)) return true;
  if (!cycleSet) {
    cycleSet = new WeakSet();
    seen.set(aObj, cycleSet);
  }
  cycleSet.add(bObj);

  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i += 1) {
      if (!compare(a[i], b[i], hooks, seen)) return false;
    }
    return true;
  }

  const aKeys = Object.keys(aObj as Record<string, unknown>);
  const bKeys = Object.keys(bObj as Record<string, unknown>);
  if (aKeys.length !== bKeys.length) return false;

  const aRec = aObj as Record<string, unknown>;
  const bRec = bObj as Record<string, unknown>;
  for (const key of aKeys) {
    if (!Object.prototype.hasOwnProperty.call(bRec, key)) return false;
    if (!compare(aRec[key], bRec[key], hooks, seen)) return false;
  }
  return true;
}

function matchHook(value: unknown, hooks: TypeHooks) {
  for (const serializer of hooks.serializers) {
    if (serializer.test(value)) return serializer;
  }
  return undefined;
}
