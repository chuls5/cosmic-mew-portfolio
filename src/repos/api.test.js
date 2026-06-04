import { describe, it, expect } from 'vitest';
import { isCacheFresh } from './api.js';

describe('isCacheFresh', () => {
  const TTL = 60 * 60 * 1000; // 1 hour
  const NOW = 1_000_000_000_000;

  it('returns false for null/undefined cached', () => {
    expect(isCacheFresh(null, NOW, TTL)).toBe(false);
    expect(isCacheFresh(undefined, NOW, TTL)).toBe(false);
  });

  it('returns true within TTL', () => {
    expect(isCacheFresh({ ts: NOW - 30_000 }, NOW, TTL)).toBe(true);
    expect(isCacheFresh({ ts: NOW - (TTL - 1) }, NOW, TTL)).toBe(true);
  });

  it('returns false at exact TTL boundary (strict less-than)', () => {
    expect(isCacheFresh({ ts: NOW - TTL }, NOW, TTL)).toBe(false);
  });

  it('returns false past TTL', () => {
    expect(isCacheFresh({ ts: NOW - TTL - 1 }, NOW, TTL)).toBe(false);
    expect(isCacheFresh({ ts: 0 }, NOW, TTL)).toBe(false);
  });

  it('returns false for object with missing ts (NaN comparison short-circuits)', () => {
    expect(isCacheFresh({}, NOW, TTL)).toBe(false);
  });
});
