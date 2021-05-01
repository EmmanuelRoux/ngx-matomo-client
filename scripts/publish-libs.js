// #!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const nerfDart = require('nerf-dart');
const {exec} = require('child_process');
const {DIST_DIR, DEFAULT_REGISTRY} = require('./constants');
const {readPkgJson} = require('./utils');
const {checkNpmToken} = require('./utils');

function setUpNpmAuth(dir, registry) {
  const npmrc = path.resolve(dir, '.npmrc');

  checkNpmToken();
  fs.writeFileSync(npmrc, nerfDart(registry) + ':_authToken=${NPM_TOKEN}');
}

function getPublishCmd(npmrc, registry) {
  return `npm publish --userconfig ${npmrc} --tag latest --registry ${registry}`;
}

function getRegistry(pkgDir) {
  const pkg = readPkgJson(pkgDir);

  return (pkg.publishConfig || {}).registry || DEFAULT_REGISTRY;
}

function publishCallback(error) {
  if (error) {
    console.error('Unable to publish package: ', error);
    return process.exit(1);
  }
}

function publishLib(libName) {
  const baseDir = path.resolve(DIST_DIR, libName);
  const npmrc = path.resolve(baseDir, '.npmrc');
  const registry = getRegistry(baseDir);
  const publishCmd = getPublishCmd(npmrc, registry);

  setUpNpmAuth(baseDir, registry);
  exec(publishCmd, {cwd: baseDir}, publishCallback);
}

publishLib('tracker');
publishLib('router');
