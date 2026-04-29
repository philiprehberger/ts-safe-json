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

  it('safeJsonEqual returns true for structurally equal objects', () => {
    assert.equal(mod.safeJsonEqual({ a: 1, b: [1, 2] }, { a: 1, b: [1, 2] }), true);
  });

  it('safeJsonEqual returns false for different objects', () => {
    assert.equal(mod.safeJsonEqual({ a: 1 }, { a: 2 }), false);
  });

  it('safeJsonEqual handles circular references', () => {
    const a: any = { x: 1 };
    a.self = a;
    const b: any = { x: 1 };
    b.self = b;
    assert.equal(mod.safeJsonEqual(a, b), true);
  });

  it('safeJsonEqual respects type hooks for Date equality', () => {
    const hooks = mod.createTypeHooks();
    const d1 = new Date('2026-01-01');
    const d2 = new Date('2026-01-01');
    assert.equal(mod.safeJsonEqual({ at: d1 }, { at: d2 }, { hooks }), true);
  });
});
