// #!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const nerfDart = require('nerf-dart');
const { exec } = require('child_process');
const { LIB_DIR_NAME, DIST_DIR } = require('./constants');
const { checkNpmToken, readPkgJson, getChannel, getRegistry } = require('./utils');

const [version, channel] = process.argv.slice(2);

function setUpNpmAuth(dir, registry) {
  const npmrc = path.resolve(dir, '.npmrc');

  checkNpmToken();
  fs.writeFileSync(npmrc, nerfDart(registry) + ':_authToken=${NPM_TOKEN}');
}

function getPublishCmd(npmrc, distTag, registry) {
  return `npm publish --userconfig ${npmrc} --tag ${distTag} --registry ${registry}`;
}

function publishCallback(error) {
  if (error) {
    console.error('Unable to publish package: ', error);
    return process.exit(1);
  }
}

const baseDir = path.resolve(DIST_DIR, LIB_DIR_NAME);
const npmrc = path.resolve(baseDir, '.npmrc');
const pkg = readPkgJson(baseDir);
const registry = getRegistry(baseDir);
const distTag = getChannel(channel);
const publishCmd = getPublishCmd(npmrc, distTag, registry);

console.log(
  `Publishing version ${version} of ${LIB_DIR_NAME} to npm registry on dist-tag ${distTag}`,
);

setUpNpmAuth(baseDir, registry);
exec(publishCmd, { cwd: baseDir }, publishCallback);

console.log(`Published ${pkg.name}@${version} to dist-tag @${distTag} on ${registry}`);
