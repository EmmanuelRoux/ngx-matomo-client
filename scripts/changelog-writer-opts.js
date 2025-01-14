const compareFunc = require('compare-func');

// Copied from Angular preset:
// https://github.com/conventional-changelog/conventional-changelog/blob/21b73f974adc4490a318d9c892055655cb82c538/packages/conventional-changelog-angular/writer-opts.js
//
// Modified to allow custom section for "DEPRECATIONS"
// By default, only "BREAKING CHANGES" section is set

/**
 * Get commit type or `undefined` if commit should be discarded
 *
 * @param commit
 * @return {string}
 */
function getStandardCommitType(commit) {
  const discard = commit.notes.length === 0;

  if (commit.type === 'feat') {
    return 'Features';
  } else if (commit.type === 'fix') {
    return 'Bug Fixes';
  } else if (commit.type === 'perf') {
    return 'Performance Improvements';
  } else if (commit.type === 'revert' || commit.revert) {
    return 'Reverts';
  } else if (discard) {
    return undefined;
  } else if (commit.type === 'docs') {
    return 'Documentation';
  } else if (commit.type === 'style') {
    return 'Styles';
  } else if (commit.type === 'refactor') {
    return 'Code Refactoring';
  } else if (commit.type === 'test') {
    return 'Tests';
  } else if (commit.type === 'build') {
    return 'Build System';
  } else if (commit.type === 'ci') {
    return 'Continuous Integration';
  }

  return commit.type;
}

module.exports = {
  transform: (commit, context) => {
    const issues = [];
    const notes = commit.notes.map(note => {
      if (note.title.toUpperCase().includes('DEPRECAT')) {
        return { ...note, title: 'Deprecations' };
      } else {
        return { ...note, title: 'Breaking changes' };
      }
    });
    const type = getStandardCommitType(commit);

    if (!type) {
      // Discard commit
      return;
    }

    const scope = commit.scope === '*' ? '' : commit.scope;
    const shortHash =
      typeof commit.hash === 'string' ? commit.hash.substring(0, 7) : commit.shortHash;
    let subject = commit.subject;

    if (typeof commit.subject === 'string') {
      let url = context.repository
        ? `${context.host}/${context.owner}/${context.repository}`
        : context.repoUrl;
      if (url) {
        url = `${url}/issues/`;
        // Issue URLs.
        subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
          issues.push(issue);
          return `[#${issue}](${url}${issue})`;
        });
      }
      if (context.host) {
        // User URLs.
        subject = commit.subject.replace(/\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g, (_, username) => {
          if (username.includes('/')) {
            return `@${username}`;
          }

          return `[@${username}](${context.host}/${username})`;
        });
      }
    }

    // remove references that already appear in the subject
    const references = commit.references.filter(
      reference => issues.indexOf(reference.issue) === -1,
    );

    return {
      ...commit,
      notes,
      type,
      scope,
      subject,
      shortHash,
      references,
    };
  },
  groupBy: 'type',
  commitGroupsSort: 'title',
  commitsSort: ['scope', 'subject'],
  noteGroupsSort: 'title',
  notesSort: compareFunc,
};
