// Publica la carpeta en GitHub (Alan20111/portafolio, rama main) en UN solo commit usando la API de Git
// a través de `gh api`. Útil cuando `git` no está disponible. Uso: node src/publicar.mjs "mensaje"
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const REPO = 'Alan20111/portafolio', RAMA = 'main';
const raiz = new URL('..', import.meta.url).pathname;
const msg = process.argv[2] || 'Actualiza portafolio';
const gh = (args, input) => JSON.parse(execFileSync('gh', ['api', ...args], { input, maxBuffer: 64 * 1024 * 1024 }).toString());

const archivos = [];
(function walk(d) {
  for (const n of readdirSync(d)) {
    if (n.startsWith('.') || n === 'node_modules') continue;
    const p = join(d, n);
    statSync(p).isDirectory() ? walk(p) : archivos.push(relative(raiz, p));
  }
})(raiz);

const ref = gh([`repos/${REPO}/git/ref/heads/${RAMA}`]);
const base = ref.object.sha;
console.log(`base ${base.slice(0, 7)} · ${archivos.length} archivos`);

const tree = archivos.map((path) => {
  const content = readFileSync(join(raiz, path)).toString('base64');
  const blob = gh([`repos/${REPO}/git/blobs`, '--input', '-'], JSON.stringify({ content, encoding: 'base64' }));
  process.stdout.write(`  ${path}\n`);
  return { path, mode: '100644', type: 'blob', sha: blob.sha };
});
// Árbol nuevo sin base_tree: lo que no está en la carpeta se elimina del repo.
const t = gh([`repos/${REPO}/git/trees`, '--input', '-'], JSON.stringify({ tree }));
const c = gh([`repos/${REPO}/git/commits`, '--input', '-'], JSON.stringify({ message: msg, tree: t.sha, parents: [base] }));
gh([`repos/${REPO}/git/refs/heads/${RAMA}`, '-X', 'PATCH', '--input', '-'], JSON.stringify({ sha: c.sha, force: false }));
console.log(`✓ commit ${c.sha.slice(0, 7)} en ${REPO}@${RAMA}: ${msg}`);
