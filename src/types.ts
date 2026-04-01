export interface SafeParseResult<T> {
  ok: boolean;
  data?: T;
  error?: Error;
}

export interface StringifyOptions {
  maxDepth?: number;
  replacer?: (key: string, value: unknown) => unknown;
  space?: number;
  onError?: ErrorHandler;
}

export type ErrorHandler = (error: Error) => void;

export interface TypeSerializer<T = unknown> {
  type: string;
  test: (value: unknown) => boolean;
  serialize: (value: T) => unknown;
  deserialize: (value: unknown) => T;
}

export interface TypeHooks {
  serializers: TypeSerializer[];
}

export interface SafeParseOptions {
  hooks?: TypeHooks;
  onError?: ErrorHandler;
}

export interface SafeStringifyOptions extends StringifyOptions {
  hooks?: TypeHooks;
}

export interface SafeCloneOptions {
  hooks?: TypeHooks;
  onError?: ErrorHandler;
}

export interface SafeMergeOptions {
  onError?: ErrorHandler;
}
