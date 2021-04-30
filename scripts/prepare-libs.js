// #!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {DIST_DIR, SOURCES_DIR} = require('./constants');
const {readPkgJson, writePkgJson} = require('./utils');
const [version] = process.argv.slice(2);

function updatePkgVersion(pkgDir) {
  const pkg = readPkgJson(pkgDir)

  pkg.version = version;

  console.log('Write version %s to package.json in %s', version, pkgDir);
  writePkgJson(pkgDir, pkg);
}

function updateLibVersion(libName) {
  const sourceDir = path.resolve(SOURCES_DIR, libName);
  const distDir = path.resolve(DIST_DIR, libName);

  updatePkgVersion(sourceDir);
  updatePkgVersion(distDir);
}

function copyReadmeTo(libName) {
  const target = path.resolve(DIST_DIR, libName, 'README.md');

  console.log('Copy root README.md to tracker package at %s', target);
  fs.copyFileSync('README.md', target);
}

console.log('Preparing version %s of libraries', version);

// Copy README to main library
copyReadmeTo('tracker');

// Update package.json version number
updateLibVersion('tracker');
updateLibVersion('router');
