// #!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const nerfDart = require('nerf-dart');
const { exec } = require('child_process');
const { LIB_DIR_NAME, DIST_DIR } = require('./constants');
const { checkNpmToken, readPkgJson, getChannel, getRegistry } = require('./utils');

const [version, channel] = process.argv.slice(2);

function getPublishCmd(distTag, registry) {
  return `npm publish --tag ${distTag} --registry ${registry}`;
}

function publishCallback(error) {
  if (error) {
    console.error('Unable to publish package: ', error);
    return process.exit(1);
  }
}

const baseDir = path.resolve(DIST_DIR, LIB_DIR_NAME);
const pkg = readPkgJson(baseDir);
const registry = getRegistry(baseDir);
const distTag = getChannel(channel);
const publishCmd = getPublishCmd(distTag, registry);

console.log(
  `Publishing version ${version} of ${LIB_DIR_NAME} to npm registry on dist-tag ${distTag}`,
);

exec(publishCmd, { cwd: baseDir }, publishCallback);

console.log(`Published ${pkg.name}@${version} to dist-tag @${distTag} on ${registry}`);
