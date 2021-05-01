const path = require('path');
const fs = require('fs');

function checkNpmToken() {
  if (!process.env.NPM_TOKEN) {
    console.error('Please set NPM_TOKEN environment variable!');
    process.exit(1);
  }
}

function readPkgJson(dir) {
  const pkgPath = path.resolve(dir, 'package.json');

  return JSON.parse(fs.readFileSync(pkgPath))
}

function writePkgJson(dir, pkg) {
  const pkgPath = path.resolve(dir, 'package.json');

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}

module.exports = {checkNpmToken, readPkgJson, writePkgJson};
