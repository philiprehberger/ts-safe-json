export interface SafeParseResult<T> {
  ok: boolean;
  data?: T;
  error?: Error;
}

export interface StringifyOptions {
  maxDepth?: number;
  replacer?: (key: string, value: unknown) => unknown;
  space?: number;
}
