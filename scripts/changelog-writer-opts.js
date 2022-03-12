const compareFunc = require('compare-func');

// Copied from Angular preset:
// https://github.com/conventional-changelog/conventional-changelog/blob/21b73f974adc4490a318d9c892055655cb82c538/packages/conventional-changelog-angular/writer-opts.js
//
// Modified to allow custom section for "DEPRECATIONS"
// By default, only "BREAKING CHANGES" section is set

module.exports = {
  transform: (commit, context) => {
    let discard = true;
    const issues = [];

    commit.notes.forEach(note => {
      if (note.title.toUpperCase().includes('DEPRECAT')) {
        note.title = 'Deprecations';
      } else {
        note.title = 'Breaking changes';
      }
      discard = false;
    });

    if (commit.type === 'feat') {
      commit.type = 'Features';
    } else if (commit.type === 'fix') {
      commit.type = 'Bug Fixes';
    } else if (commit.type === 'perf') {
      commit.type = 'Performance Improvements';
    } else if (commit.type === 'revert' || commit.revert) {
      commit.type = 'Reverts';
    } else if (discard) {
      return;
    } else if (commit.type === 'docs') {
      commit.type = 'Documentation';
    } else if (commit.type === 'style') {
      commit.type = 'Styles';
    } else if (commit.type === 'refactor') {
      commit.type = 'Code Refactoring';
    } else if (commit.type === 'test') {
      commit.type = 'Tests';
    } else if (commit.type === 'build') {
      commit.type = 'Build System';
    } else if (commit.type === 'ci') {
      commit.type = 'Continuous Integration';
    }

    if (commit.scope === '*') {
      commit.scope = '';
    }

    if (typeof commit.hash === 'string') {
      commit.shortHash = commit.hash.substring(0, 7);
    }

    if (typeof commit.subject === 'string') {
      let url = context.repository
        ? `${context.host}/${context.owner}/${context.repository}`
        : context.repoUrl;
      if (url) {
        url = `${url}/issues/`;
        // Issue URLs.
        commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
          issues.push(issue);
          return `[#${issue}](${url}${issue})`;
        });
      }
      if (context.host) {
        // User URLs.
        commit.subject = commit.subject.replace(
          /\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g,
          (_, username) => {
            if (username.includes('/')) {
              return `@${username}`;
            }

            return `[@${username}](${context.host}/${username})`;
          }
        );
      }
    }

    // remove references that already appear in the subject
    commit.references = commit.references.filter(reference => {
      if (issues.indexOf(reference.issue) === -1) {
        return true;
      }

      return false;
    });

    return commit;
  },
  groupBy: 'type',
  commitGroupsSort: 'title',
  commitsSort: ['scope', 'subject'],
  noteGroupsSort: 'title',
  notesSort: compareFunc,
};
