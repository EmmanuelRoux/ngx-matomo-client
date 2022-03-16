// #!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { LIBRARIES, DIST_DIR, SOURCES_DIR, LIB_TRACKER } = require('./constants');
const { readPkgJson, writePkgJson, getPkgName } = require('./utils');
const [version] = process.argv.slice(2);

function updatePkgVersion(pkgDir) {
  const pkg = readPkgJson(pkgDir);

  pkg.version = version;

  LIBRARIES.forEach(libName => {
    const pkgName = getPkgName(libName);

    if (pkg.peerDependencies && pkg.peerDependencies[pkgName]) {
      pkg.peerDependencies[pkgName] = version;
    }
  });

  console.log('Write version %s to package.json in %s', version, pkgDir);
  writePkgJson(pkgDir, pkg);
}

function updateSchematicsVersion(rootDir) {
  const versionPath = path.resolve(rootDir, 'schematics/version.ts');
  const versionExpr = `^${version}`;

  fs.writeFileSync(versionPath, `export const version = '${versionExpr}';\n`);
}

function updateLibVersion(libName) {
  const sourceDir = path.resolve(SOURCES_DIR, libName);
  const distDir = path.resolve(DIST_DIR, libName);

  updatePkgVersion(sourceDir);
  updatePkgVersion(distDir);

  if (libName === LIB_TRACKER) {
    updateSchematicsVersion(sourceDir);
    // Schematics .ts file should be recompiled to .js (not as simple as overwriting version in dist .js file)
    // So updateSchematicsVersion(distDir) would not be sufficient
    execSync('npm run build:prod:schematics', { stdio: 'inherit' });
  }
}

function copyReadmeTo(libName) {
  const target = path.resolve(DIST_DIR, libName, 'README.md');

  console.log('Copy root README.md to tracker package at %s', target);
  fs.copyFileSync('README.md', target);
}

console.log('Preparing version %s of libraries', version);

// Copy README to main library
copyReadmeTo(LIB_TRACKER);

// Update package.json version number
LIBRARIES.forEach(updateLibVersion);
