import type { TypeSerializer, TypeHooks } from './types.js';

const TYPE_TAG = '__safeJson__';

export const dateSerializer: TypeSerializer = {
  type: 'Date',
  test: (value: unknown): boolean => value instanceof Date,
  serialize: (value: unknown): unknown => ({
    [TYPE_TAG]: 'Date',
    value: (value as Date).toISOString(),
  }),
  deserialize: (value: unknown): Date =>
    new Date((value as { value: string }).value),
};

export const bigIntSerializer: TypeSerializer = {
  type: 'BigInt',
  test: (value: unknown): boolean => typeof value === 'bigint',
  serialize: (value: unknown): unknown => ({
    [TYPE_TAG]: 'BigInt',
    value: (value as bigint).toString(),
  }),
  deserialize: (value: unknown): unknown =>
    BigInt((value as { value: string }).value),
};

export const setSerializer: TypeSerializer = {
  type: 'Set',
  test: (value: unknown): boolean => value instanceof Set,
  serialize: (value: unknown): unknown => ({
    [TYPE_TAG]: 'Set',
    value: Array.from(value as Set<unknown>),
  }),
  deserialize: (value: unknown): unknown =>
    new Set((value as { value: unknown[] }).value),
};

export const mapSerializer: TypeSerializer = {
  type: 'Map',
  test: (value: unknown): boolean => value instanceof Map,
  serialize: (value: unknown): unknown => ({
    [TYPE_TAG]: 'Map',
    value: Array.from((value as Map<string, unknown>).entries()),
  }),
  deserialize: (value: unknown): unknown =>
    new Map((value as { value: [string, unknown][] }).value),
};

export const builtInSerializers: TypeSerializer<unknown>[] = [
  dateSerializer,
  bigIntSerializer,
  setSerializer,
  mapSerializer,
];

export function createTypeHooks(
  serializers: TypeSerializer[] = builtInSerializers,
): TypeHooks {
  return { serializers };
}

export function serializeWithHooks(
  value: unknown,
  hooks: TypeHooks,
): unknown {
  for (const serializer of hooks.serializers) {
    if (serializer.test(value)) {
      return serializer.serialize(value);
    }
  }

  if (value === null || typeof value !== 'object') return value;

  if (Array.isArray(value)) {
    return value.map((item) => serializeWithHooks(item, hooks));
  }

  const result: Record<string, unknown> = {};
  for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
    result[key] = serializeWithHooks(v, hooks);
  }
  return result;
}

export function deserializeWithHooks(
  value: unknown,
  hooks: TypeHooks,
): unknown {
  if (value === null || typeof value !== 'object') return value;

  if (Array.isArray(value)) {
    return value.map((item) => deserializeWithHooks(item, hooks));
  }

  const record = value as Record<string, unknown>;
  if (TYPE_TAG in record) {
    const typeName = record[TYPE_TAG] as string;
    for (const serializer of hooks.serializers) {
      if (serializer.type === typeName) {
        return serializer.deserialize(record);
      }
    }
  }

  const result: Record<string, unknown> = {};
  for (const [key, v] of Object.entries(record)) {
    result[key] = deserializeWithHooks(v, hooks);
  }
  return result;
}
