import { describe, it, expect } from 'vitest';
import { mdToHtml } from './markdown.js';

describe('mdToHtml — block elements', () => {
  it('renders h1, h2, h3', () => {
    expect(mdToHtml('# Big')).toContain('<h1>Big</h1>');
    expect(mdToHtml('## Medium')).toContain('<h2>Medium</h2>');
    expect(mdToHtml('### Small')).toContain('<h3>Small</h3>');
  });

  it('renders bullet lists wrapped in <ul>', () => {
    const out = mdToHtml('- one\n- two');
    expect(out).toContain('<ul>');
    expect(out).toContain('<li>one</li>');
    expect(out).toContain('<li>two</li>');
    expect(out).toContain('</ul>');
  });

  it('closes the <ul> when a non-list line appears', () => {
    const out = mdToHtml('- item\n\nAfter');
    expect(out).toContain('</ul>');
    expect(out).toContain('<p>After</p>');
  });

  it('wraps unmatched lines in <p>', () => {
    expect(mdToHtml('Just text.')).toContain('<p>Just text.</p>');
  });

  it('renders fenced code blocks', () => {
    const out = mdToHtml('```\nconst x = 1;\n```');
    expect(out).toContain('<pre><code>');
    expect(out).toContain('const x = 1;');
    expect(out).toContain('</code></pre>');
  });

  it('escapes HTML inside fenced code (XSS guard)', () => {
    const out = mdToHtml('```\n<script>alert(1)</script>\n```');
    expect(out).toContain('&lt;script&gt;');
    expect(out).not.toMatch(/<script>(?!alert)/);
  });
});

describe('mdToHtml — inline elements', () => {
  it('renders **bold** and *em*', () => {
    expect(mdToHtml('**bold**')).toContain('<strong>bold</strong>');
    expect(mdToHtml('*em*')).toContain('<em>em</em>');
  });

  it('renders inline `code`', () => {
    expect(mdToHtml('`code`')).toContain('<code>code</code>');
  });

  it('renders links with safe target/rel attributes', () => {
    const out = mdToHtml('[example](https://example.com)');
    expect(out).toContain('href="https://example.com"');
    expect(out).toContain('target="_blank"');
    expect(out).toContain('rel="noopener noreferrer"');
  });

  it('composes inline formatting inside list items', () => {
    const out = mdToHtml('- **bold** and *em* and `code`');
    expect(out).toContain('<strong>bold</strong>');
    expect(out).toContain('<em>em</em>');
    expect(out).toContain('<code>code</code>');
  });
});
