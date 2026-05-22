import { escHtml } from '../utils.js';

// Intentionally minimal markdown parser — enough for blog posts, no more.
// Supports: # ## ### headings, `- ` bullets, ```fenced``` code, **bold**, *em*, `code`, [link](url).
// Anything else (tables, blockquotes, images, nested lists) renders as plain <p>.

function inlineMd(s) {
  return s
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

export function mdToHtml(md) {
  const lines = md.split('\n');
  const out = [];
  let inCode = false;
  let inList = false;

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCode) {
        out.push('</code></pre>');
        inCode = false;
      } else {
        if (inList) {
          out.push('</ul>');
          inList = false;
        }
        out.push('<pre><code>');
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      out.push(escHtml(line));
      continue;
    }
    if (!line.startsWith('- ') && inList) {
      out.push('</ul>');
      inList = false;
    }
    if (line.startsWith('### ')) {
      out.push(`<h3>${inlineMd(line.slice(4))}</h3>`);
    } else if (line.startsWith('## ')) {
      out.push(`<h2>${inlineMd(line.slice(3))}</h2>`);
    } else if (line.startsWith('# ')) {
      out.push(`<h1>${inlineMd(line.slice(2))}</h1>`);
    } else if (line.startsWith('- ')) {
      if (!inList) {
        out.push('<ul>');
        inList = true;
      }
      out.push(`<li>${inlineMd(line.slice(2))}</li>`);
    } else if (line.trim() === '') {
      out.push('');
    } else {
      out.push(`<p>${inlineMd(line)}</p>`);
    }
  }
  if (inList) out.push('</ul>');
  if (inCode) out.push('</code></pre>');
  return out.join('\n');
}
