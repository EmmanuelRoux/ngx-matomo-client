# Contributing to ngx-matomo

<!-- prettier-ignore-start -->

<!-- toc -->

- [Found a Bug?](#found-a-bug)
- [Missing a Feature?](#missing-a-feature)
- [Submission Guidelines](#submission-guidelines)
  * [Submitting an Issue](#submitting-an-issue)
  * [Submitting a Pull Request (PR)](#submitting-a-pull-request-pr)
- [Coding Rules](#coding-rules)
- [Commit Message Format](#commit-message-format)
- [License](#license)

<!-- tocstop -->

<!-- prettier-ignore-end -->

## Found a Bug?

If you find a bug in the source code, you can help by [submitting an issue](#submitting-an-issue) to this repository.
Even better, you can [submit a Pull Request](#submitting-a-pull-request-pr) with a fix.

## Missing a Feature?

You can request a new feature by [submitting an issue](#submitting-an-issue) to this repository.

**Note:** small features can be crafted and directly [submitted as a Pull Request](#submitting-a-pull-request-pr).

## Submission Guidelines

### Submitting an Issue

In order to reproduce bugs, please provide a minimal reproduction.

### Submitting a Pull Request (PR)

Before you submit your Pull Request (PR) consider the following guidelines:

1. Please follow [Coding Rules](#coding-rules).

2. Run tests using `npm run test`

3. Check coding rules using `npm run lint`

4. Commit your changes using a descriptive commit message that follows
   our [commit message conventions](#commit-message-format). This is strictly necessary because release notes are
   automatically generated from commit messages.

## Coding Rules

To ensure consistency throughout the source code, keep these rules in mind as you are working:

- All features or bug fixes **must be tested** by one or more specs (unit-tests).
- Coding rules and format are checked using `npm run lint`.
- Prettier is used to format code. You can format your code using `npm run format`.

## Commit Message Format

You must follow
the [Angular Commit Message Conventions](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-format)
.

Commit message header should look like that:

```
<type>(<scope>): <short summary>
  │       │
  │       └─⫸ Usually 'tracker' or 'router'
  │
  └─⫸ Usually 'fix' or 'feat'
```

Commit footer can contain information about breaking changes and deprecations and is also the place to reference GitHub
issues or PRs that this commit closes or is related to. For example:

```
BREAKING CHANGE: <breaking change summary>
<BLANK LINE>
<breaking change description + migration instructions>
<BLANK LINE>
<BLANK LINE>
Fixes #<issue number>
```

or

```
DEPRECATED: <what is deprecated>
<BLANK LINE>
<deprecation description + recommended update path>
<BLANK LINE>
<BLANK LINE>
Closes #<pr number>
```

Reminder:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

## License

By contributing, you agree that your contributions will be licensed under [MIT License](LICENSE).
