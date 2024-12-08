<p style="text-align: center" align="center">
  <a href="https://tsed.dev" target="_blank"><img src="https://tsed.dev/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
  <h1>Ts.ED - tsed-code-sandbox-template</h1>
  <br />
  <div align="center">
    <a href="https://cli.tsed.dev/">Website</a>
    <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://cli.tsed.dev/getting-started.html">Getting started</a>
    <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://slack.tsed.io">Slack</a>
    <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://twitter.com/TsED_io">Twitter</a>
  </div>
  <hr />
</div>

> An awesome project based on Ts.ED framework

## Getting started

> **Important!** Ts.ED requires Node >= 20, Express >= 4 and TypeScript >= 5.

```batch
# install dependencies
$ npm install

# serve
$ npm run start

# build for production
$ npm run build
$ npm run start:prod
```

## Regenerate project

You can regenerate the project with the following command:

```sh
npx --yes -p @tsed/cli tsed init .
```

## Docker

```
# build docker image
docker compose build

# start docker image
docker compose up
```

## Barrels

This project uses [barrels](https://www.npmjs.com/package/@tsed/barrels) to generate index files to import the controllers.

Edit `.barrels.json` to customize it:

```json
{
  "directory": [
    "./src/controllers/rest",
    "./src/controllers/pages"
  ],
  "exclude": [
    "**/__mock__",
    "**/__mocks__",
    "**/*.spec.ts"
  ],
  "delete": true
}
```
