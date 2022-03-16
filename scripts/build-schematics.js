const fs = require('fs');
const path = require('path');
const { ncp } = require('ncp');
const { execSync } = require('child_process');
const { DIST_DIR, LOCAL_DIST_DIR, SOURCES_DIR, LIB_TRACKER } = require('./constants');

const isProd = process.argv.includes('--prod');
const distDir = path.resolve(isProd ? DIST_DIR : LOCAL_DIST_DIR, LIB_TRACKER);
const sourceDir = path.resolve(SOURCES_DIR, LIB_TRACKER);
const tsconfigPath = isProd ? 'tsconfig.schematics.prod.json' : 'tsconfig.schematics.json';

function build() {
  execSync(`"../../node_modules/.bin/tsc" -p ${tsconfigPath}`, {
    cwd: sourceDir,
    stdio: 'inherit',
  });
}

/**
 * @callback forEachSchematicsCallback
 * @param {string} entry
 */
/**
 * @param {forEachSchematicsCallback} callback
 */
function forEachSchematics(callback) {
  const baseDir = path.resolve(sourceDir, 'schematics');

  fs.readdirSync(baseDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .forEach(callback);
}

function copySchemas() {
  forEachSchematics(schematics => {
    const schema = path.resolve(sourceDir, 'schematics', schematics, 'schema.json');

    if (fs.existsSync(schema)) {
      const target = path.resolve(distDir, 'schematics', schematics, 'schema.json');

      createTargetSchematicsDir(schematics);
      fs.copyFileSync(schema, target);
    }
  });
}

function copyFiles() {
  forEachSchematics(schematics => {
    const filesDir = path.resolve(sourceDir, 'schematics', schematics, 'files');

    if (fs.existsSync(filesDir)) {
      const target = path.resolve(distDir, 'schematics', schematics, 'files');

      ncp(filesDir, target);
    }
  });
}

function copyCollection() {
  const source = path.resolve(sourceDir, 'schematics/collection.json');
  const target = path.resolve(distDir, 'schematics/collection.json');

  fs.copyFileSync(source, target);
}

/**
 *
 * @param {string} [subdir]
 */
function createTargetSchematicsDir(subdir) {
  const dir = path.resolve(distDir, 'schematics');

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  if (subdir) {
    const subdirPath = path.resolve(dir, subdir);

    if (!fs.existsSync(subdirPath)) {
      fs.mkdirSync(subdirPath);
    }
  }
}

console.log(`Building schematics for @ngx-matomo/tracker${isProd ? ' for production' : ''}`);
console.log(' > Compiling tsc...');
build();
console.log(' > Copying resources...');
createTargetSchematicsDir();
copySchemas();
copyFiles();
copyCollection();
console.log(' Done.');
