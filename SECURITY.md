# Security policy

## Reporting a problem

If you find a security issue, such as a way to make the page run code it shouldn't or an unsafe dependency, please report it privately through [GitHub's private vulnerability reporting](https://github.com/ShazMoghaddam/knok-matrix/security/advisories/new) rather than opening a public issue.

You can expect a reply within a week.

## What's in scope

KNOK Matrix / Mono is a single static HTML page. It has no server, no accounts, no cookies and no analytics, and it sends nothing anywhere. The only data it keeps is your display settings, saved in your own browser's `localStorage`.

The npm packages in `package.json` are only used to test the page and build the README images. None of them ship in the page itself.

## Supported versions

Only the latest version on `main` is supported.
