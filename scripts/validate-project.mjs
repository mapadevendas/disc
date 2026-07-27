import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const walk = (dir) => fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((entry) => {
  const rel = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(rel) : [rel];
});

const sourceFiles = walk('src').filter((file) => /\.(ts|tsx)$/.test(file));
const errors = [];

for (const file of sourceFiles) {
  const content = read(file);
  const imports = [...content.matchAll(/from ['"](@\/[^'"]+)['"]/g)].map((match) => match[1]);
  for (const specifier of imports) {
    const target = specifier.replace('@/', 'src/');
    const candidates = [target, `${target}.ts`, `${target}.tsx`, `${target}.js`, path.join(target, 'index.ts'), path.join(target, 'index.tsx')];
    if (!candidates.some(exists)) errors.push(`Broken import in ${file}: ${specifier}`);
  }
  if (/use(State|Effect|Memo|Ref)|onClick=|onChange=|draggable/.test(content) && !content.startsWith("'use client';") && !content.startsWith('"use client";')) {
    const isServerSafe = file.includes('/app/api/') || file.endsWith('layout.tsx') || file.endsWith('page.tsx') && !/use(State|Effect|Memo|Ref)|window\./.test(content);
    if (!isServerSafe) errors.push(`Potential Client Component missing 'use client': ${file}`);
  }
}

const routes = walk('src/app').filter((file) => file.endsWith('page.tsx'));
if (routes.length < 25) errors.push(`Expected at least 25 app routes, found ${routes.length}`);

const pkg = JSON.parse(read('package.json'));
const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
for (const required of ['next', 'react', 'react-dom', 'typescript', 'tailwindcss', 'framer-motion', 'lucide-react', 'react-hook-form', 'zod']) {
  if (!allDeps[required]) errors.push(`Missing dependency: ${required}`);
}
if (pkg.dependencies?.['@radix-ui/react-slot']) errors.push('Unused dependency still present: @radix-ui/react-slot');
if (pkg.dependencies?.['@hookform/resolvers']) errors.push('Removed resolver dependency should not be present');

const tsconfig = JSON.parse(read('tsconfig.json'));
if (tsconfig.compilerOptions.ignoreDeprecations !== '6.0') errors.push('tsconfig should silence TS 6 baseUrl deprecation with ignoreDeprecations 6.0');
if (!exists('eslint.config.mjs')) errors.push('Missing ESLint flat config for modern ESLint');
if (!exists('supabase/schema.sql')) errors.push('Missing Supabase schema');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, sourceFiles: sourceFiles.length, appRoutes: routes.length, dependencies: Object.keys(pkg.dependencies ?? {}).length, devDependencies: Object.keys(pkg.devDependencies ?? {}).length }, null, 2));
