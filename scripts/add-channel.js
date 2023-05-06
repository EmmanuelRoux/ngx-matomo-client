const path = require('path');
const { exec } = require('child_process');
const { DIST_DIR } = require('./constants');
const { readPkgJson, getRegistry, getChannel } = require('./utils');
const [version, channel] = process.argv.slice(2);

function getAddTagCmd(pkgName, distTag, registry, npmrc) {
  return `npm dist-tag add ${pkgName}@${version} ${distTag} --userconfig ${npmrc} --registry ${registry}`;
}

const baseDir = path.resolve(DIST_DIR, 'tracker');
const npmrc = path.resolve(baseDir, '.npmrc');
const pkg = readPkgJson(baseDir);
const registry = getRegistry(baseDir);
const distTag = getChannel(channel);
const addTagCmd = getAddTagCmd(pkg.name, distTag, registry, npmrc);

console.log(
  `Adding version ${version} of ngx-matomo-client to npm registry on dist-tag ${distTag}`
);

exec(addTagCmd, { cwd: baseDir });

console.log(`Added ${pkg.name}@${version} to dist-tag @${distTag} on ${registry}`);
