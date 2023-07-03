const writerOpts = require('./scripts/changelog-writer-opts.js');

module.exports = {
  branches: [
    'main',
    // Force 'latest' channel for @ngx-matomo/tracker@4.x
    { name: '4.x', range: '4.x', channel: 'latest' },
    '+([0-9])?(.{+([0-9]),x}).x',
    {
      name: 'beta',
      prerelease: true,
    },
    {
      name: 'next',
      prerelease: true,
    },
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        releaseRules: [{ type: 'chore', scope: 'force-release', release: 'patch' }],
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'angular',
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'DEPRECATION'],
        },
        writerOpts: writerOpts,
      },
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
      },
    ],
    [
      '@semantic-release/exec',
      {
        verifyConditionsCmd: 'node ./scripts/verify-libs.js',
        prepareCmd: 'node ./scripts/prepare-libs.js ${nextRelease.version}',
        addChannelCmd:
          'node ./scripts/add-channel.js ${nextRelease.version} ${nextRelease.channel}',
        publishCmd: 'node ./scripts/publish-libs.js ${nextRelease.version} ${nextRelease.channel}',
      },
    ],
    '@semantic-release/github',
    [
      '@semantic-release/git',
      {
        message: 'chore(release): ${nextRelease.version}\n\n${nextRelease.notes}\n',
        assets: [
          'package.json',
          'package-lock.json',
          'projects/tracker/package.json',
          'projects/tracker/schematics/version.ts',
          'projects/router/package.json',
          'CHANGELOG.md',
        ],
        failComment: false,
      },
    ],
  ],
};
