/**
 * Toggles @kapowaz/* dependencies between published versions and local
 * workspace links for development against the design-system monorepo.
 *
 * Usage:
 *   pnpm toggle-linked    # switch to link: deps (or back to published)
 */

import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

const DESIGN_SYSTEM_PATH = '../design-system/packages';

const KAPOWAZ_PACKAGES: Record<string, string> = {
  '@kapowaz/components': `link:${DESIGN_SYSTEM_PATH}/components`,
  '@kapowaz/design-tokens': `link:${DESIGN_SYSTEM_PATH}/design-tokens`,
  '@kapowaz/fonts': `link:${DESIGN_SYSTEM_PATH}/fonts`,
  '@kapowaz/football': `link:${DESIGN_SYSTEM_PATH}/football`,
  '@kapowaz/football-badges': `link:${DESIGN_SYSTEM_PATH}/football-badges`,
  '@kapowaz/icons': `link:${DESIGN_SYSTEM_PATH}/icons`,
};

const pkgPath = path.resolve(import.meta.dirname, '../package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

const deps = pkg.dependencies as Record<string, string>;

const isCurrentlyLinked = Object.keys(KAPOWAZ_PACKAGES).some(
  (name) => deps[name]?.startsWith('link:'),
);

if (isCurrentlyLinked) {
  // Switch to published: read versions from the linked packages
  console.log('Switching to published packages...\n');

  for (const name of Object.keys(KAPOWAZ_PACKAGES)) {
    const linkPath = KAPOWAZ_PACKAGES[name].replace('link:', '');
    const linkedPkgPath = path.resolve(
      import.meta.dirname,
      '..',
      linkPath,
      'package.json',
    );

    try {
      const linkedPkg = JSON.parse(
        fs.readFileSync(linkedPkgPath, 'utf-8'),
      );
      deps[name] = `^${linkedPkg.version}`;
      console.log(`  ${name}: ^${linkedPkg.version}`);
    } catch {
      console.warn(
        `  ${name}: could not read version from ${linkedPkgPath}, keeping current`,
      );
    }
  }
} else {
  // Switch to linked
  console.log('Switching to linked packages...\n');

  for (const [name, linkSpec] of Object.entries(KAPOWAZ_PACKAGES)) {
    deps[name] = linkSpec;
    console.log(`  ${name}: ${linkSpec}`);
  }
}

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log('\nUpdated package.json');

console.log('Running pnpm install...\n');
execSync('pnpm install', { stdio: 'inherit' });

console.log(
  `\nDone! Now using ${isCurrentlyLinked ? 'published' : 'linked'} packages.`,
);
