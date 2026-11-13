#!/usr/bin/env node
// Bundles the game into ONE self-contained file: dist/hexkeep.html (works from file://).
//
// No dependencies. The approach is deliberately simple: every module is concatenated in
// dependency order inside one function scope, with `import` lines removed and the `export`
// keyword stripped. That only works if no two modules declare the same top-level name, so
// the script checks for that and fails loudly (rename one of them if it does).
//
// Usage:  node tools/build.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve, relative, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const entry = join(root, 'src/main.js');

const IMPORT_RE = /^import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"];?[ \t]*\n?/gm;

const order = [];            // module paths, dependencies first
const sources = new Map();   // path -> source with imports stripped
const seen = new Set();

function visit(file) {
  if (seen.has(file)) return;
  seen.add(file);
  const src = readFileSync(file, 'utf8');
  const deps = [];
  const body = src.replace(IMPORT_RE, (m, spec, from) => {
    if (/\*\s*as\b/.test(spec) || /\bas\b/.test(spec)) throw new Error(`${relative(root, file)}: "import * as" / "as" aliases are not supported by the bundler`);
    if (!from.startsWith('.')) throw new Error(`${relative(root, file)}: only relative imports are supported (${from})`);
    deps.push(resolve(dirname(file), from));
    return '';
  });
  if (/^import\s*['"(]/m.test(body)) throw new Error(`${relative(root, file)}: unsupported import form`);
  deps.forEach(visit);
  sources.set(file, body.replace(/^export\s+(?=(?:async\s+)?(?:function|const|let|class)\b)/gm, ''));
  if (/^export\s/m.test(sources.get(file))) throw new Error(`${relative(root, file)}: unsupported export form`);
  order.push(file);
}
visit(entry);

// ---- duplicate top-level name check
function topLevelNames(src) {
  const names = [];
  for (const m of src.matchAll(/^(?:async\s+)?(function|const|let|class)\s+([A-Za-z_$][\w$]*)([^\n]*)/gm)) {
    names.push(m[2]);
    if (m[1] === 'const' || m[1] === 'let') { // `const a=1, b=2;` on one line
      let depth = 0, rest = m[3], inStr = null;
      for (let i = 0; i < rest.length; i++) {
        const ch = rest[i];
        if (inStr) { if (ch === '\\') i++; else if (ch === inStr) inStr = null; continue; }
        if (ch === '"' || ch === "'" || ch === '`') inStr = ch;
        else if ('([{'.includes(ch)) depth++;
        else if (')]}'.includes(ch)) depth--;
        else if (ch === ',' && depth === 0) { const n = /^\s*([A-Za-z_$][\w$]*)\s*=/.exec(rest.slice(i + 1)); if (n) names.push(n[1]); }
      }
    }
  }
  return names;
}
const owner = new Map();
for (const file of order) for (const n of topLevelNames(sources.get(file))) {
  if (owner.has(n) && owner.get(n) !== file) throw new Error(`Name "${n}" is declared in both ${relative(root, owner.get(n))} and ${relative(root, file)}; rename one.`);
  owner.set(n, file);
}

// ---- assemble
const code = order.map(f => `// ===== ${relative(root, f).replace(/\\/g, '/')} =====\n${sources.get(f).trim()}\n`).join('\n');
if (/<\/script/i.test(code)) throw new Error('Source contains "</script"; cannot inline.');
const css = readFileSync(join(root, 'src/style.css'), 'utf8').trim();
let html = readFileSync(join(root, 'index.html'), 'utf8');
const linkTag = '<link rel="stylesheet" href="src/style.css">';
const scriptTag = '<script type="module" src="src/main.js"></script>';
if (!html.includes(linkTag) || !html.includes(scriptTag)) throw new Error('index.html changed shape; update tools/build.mjs');
html = html.replace(linkTag, () => `<style>\n${css}\n</style>`);
html = html.replace(scriptTag, () => `<script>\n(function () {\n"use strict";\n${code}\n})();\n</script>`);

mkdirSync(join(root, 'dist'), { recursive: true });
const out = join(root, 'dist/hexkeep.html');
writeFileSync(out, html);
console.log(`Built ${relative(root, out)}: ${order.length} modules, ${(html.length / 1024).toFixed(1)} KB`);
