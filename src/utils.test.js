import { describe, it, expect } from 'vitest';
import { escHtml, safeUrl, fmt, formatDate } from './utils.js';

describe('escHtml', () => {
  it('passes through safe characters', () => {
    expect(escHtml('hello world')).toBe('hello world');
  });
  it('escapes ampersand first so subsequent entities are not double-escaped', () => {
    expect(escHtml('A & B')).toBe('A &amp; B');
    expect(escHtml('&lt;')).toBe('&amp;lt;');
  });
  it('escapes angle brackets', () => {
    expect(escHtml('<script>')).toBe('&lt;script&gt;');
  });
  it('neutralizes basic XSS attempts', () => {
    expect(escHtml('"><img onerror="alert(1)">')).toBe(
      '"&gt;&lt;img onerror="alert(1)"&gt;'
    );
  });
  it('coerces non-strings to string', () => {
    expect(escHtml(42)).toBe('42');
    expect(escHtml(null)).toBe('null');
  });
});

describe('safeUrl', () => {
  it('allows https URLs', () => {
    expect(safeUrl('https://example.com')).toBe('https://example.com');
  });
  it('allows http URLs', () => {
    expect(safeUrl('http://example.com/path?q=1')).toBe('http://example.com/path?q=1');
  });
  it('blocks the javascript: scheme', () => {
    expect(safeUrl('javascript:alert(1)')).toBe('#');
  });
  it('blocks the data: scheme', () => {
    expect(safeUrl('data:text/html,<script>')).toBe('#');
  });
  it('blocks malformed URLs', () => {
    expect(safeUrl('not a url')).toBe('#');
    expect(safeUrl('')).toBe('#');
  });
});

describe('fmt', () => {
  it('formats sub-1000 as plain integer', () => {
    expect(fmt(0)).toBe('0');
    expect(fmt(42)).toBe('42');
    expect(fmt(999)).toBe('999');
  });
  it('uses 1 decimal for thousands', () => {
    expect(fmt(1500)).toBe('1.5k');
    expect(fmt(12345)).toBe('12.3k');
  });
  it('trims trailing .0', () => {
    expect(fmt(1000)).toBe('1k');
    expect(fmt(2000)).toBe('2k');
    expect(fmt(10000)).toBe('10k');
  });
});

describe('formatDate', () => {
  it('formats ISO date as long en-US, treating as local midnight', () => {
    // The T00:00:00 suffix prevents the date from shifting under negative-offset timezones.
    expect(formatDate('2026-05-01')).toBe('May 1, 2026');
    expect(formatDate('2026-01-01')).toBe('January 1, 2026');
    expect(formatDate('2026-12-31')).toBe('December 31, 2026');
  });
});
