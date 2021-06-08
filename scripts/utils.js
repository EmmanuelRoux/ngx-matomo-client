const path = require('path');
const fs = require('fs');
const semver = require('semver');
const { DEFAULT_REGISTRY } = require('./constants');

function checkNpmToken() {
  if (!process.env.NPM_TOKEN) {
    console.error('Please set NPM_TOKEN environment variable!');
    process.exit(1);
  }
}

function readPkgJson(dir) {
  const pkgPath = path.resolve(dir, 'package.json');

  return JSON.parse(fs.readFileSync(pkgPath));
}

function writePkgJson(dir, pkg) {
  const pkgPath = path.resolve(dir, 'package.json');
  const pkgJson = JSON.stringify(pkg, null, 2);

  fs.writeFileSync(pkgPath, pkgJson + '\n');
}

function getChannel(channel) {
  return channel ? (semver.validRange(channel) ? `release-${channel}` : channel) : 'latest';
}

function getRegistry(pkgDir) {
  const pkg = readPkgJson(pkgDir);

  return (pkg.publishConfig || {}).registry || DEFAULT_REGISTRY;
}

function getPkgName(libName) {
  return `@ngx-matomo/${libName}`;
}

module.exports = {
  checkNpmToken,
  readPkgJson,
  writePkgJson,
  getChannel,
  getRegistry,
  getPkgName,
};
