# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
yarn
```text

## Local Development

```bash
yarn start
```text

This command starts a local development server and opens up a browser window. Most changes are reflected live without
having to restart the server.

## Build

```bash
yarn build
```text

This command generates static content into the `build` directory and can be served using any static contents hosting
service.

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```text

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```text

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the
`gh-pages` branch.
