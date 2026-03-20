import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const mod = await import('../../dist/index.js');

describe('safe-json', () => {
  it('should export safeParse', () => {
    assert.ok(mod.safeParse);
  });

  it('should export safeStringify', () => {
    assert.ok(mod.safeStringify);
  });
});
