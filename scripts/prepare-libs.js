// #!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { DIST_DIR, SOURCES_DIR, LIB_DIR_NAME, LIB_NAME } = require('./constants');
const { readPkgJson, writePkgJson } = require('./utils');
const [version] = process.argv.slice(2);

function updatePkgVersion(pkgDir) {
  const pkg = readPkgJson(pkgDir);

  pkg.version = version;

  if (pkg.peerDependencies && pkg.peerDependencies[LIB_NAME]) {
    pkg.peerDependencies[LIB_NAME] = version;
  }

  console.log('Write version %s to package.json in %s', version, pkgDir);
  writePkgJson(pkgDir, pkg);
}

function updateSchematicsVersion(rootDir) {
  const versionPath = path.resolve(rootDir, 'schematics/version.ts');
  const versionExpr = `^${version}`;

  fs.writeFileSync(versionPath, `export const version = '${versionExpr}';\n`);
}

function updateLibVersion() {
  const sourceDir = path.resolve(SOURCES_DIR, LIB_DIR_NAME);
  const distDir = path.resolve(DIST_DIR, LIB_DIR_NAME);

  updatePkgVersion(sourceDir);
  updatePkgVersion(distDir);
  updateSchematicsVersion(sourceDir);

  // Schematics .ts file should be recompiled to .js (not as simple as overwriting version in dist .js file)
  // So updateSchematicsVersion(distDir) would not be sufficient
  execSync('npm run build:prod:schematics', { stdio: 'inherit' });
}

function copyReadme() {
  const target = path.resolve(DIST_DIR, LIB_DIR_NAME, 'README.md');

  console.log('Copy root README.md to %s package at %s', LIB_DIR_NAME, target);
  fs.copyFileSync('README.md', target);
}

console.log('Preparing version %s of libraries', version);

// Copy README to main library
copyReadme();

// Update package.json version number
updateLibVersion();
