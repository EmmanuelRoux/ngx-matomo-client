// #!/usr/bin/env node
const {version} = require('../package.json');
const fs = require('fs');
const path = require('path');
const {DIST_DIR, SOURCES_DIR} = require('./constants');
const {readPkgJson, writePkgJson} = require('./utils');

function updatePkgVersion(pkgDir) {
  const pkg = readPkgJson(pkgDir)

  pkg.version = version;

  writePkgJson(pkgDir, pkg);
}

function updateLibVersion(libName) {
  const sourceDir = path.resolve(SOURCES_DIR, libName);
  const distDir = path.resolve(DIST_DIR, libName);

  updatePkgVersion(sourceDir);
  updatePkgVersion(distDir);
}

function copyReadmeTo(libName) {
  fs.copyFileSync('README.md', path.resolve(DIST_DIR, libName, 'README.md'));
}

// Copy README to main library
copyReadmeTo('tracker');

// Update package.json version number
updateLibVersion('tracker');
updateLibVersion('router');
