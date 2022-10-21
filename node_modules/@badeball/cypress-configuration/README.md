# cypress-configuration

[![Build status](https://github.com/badeball/cypress-configuration/actions/workflows/build.yml/badge.svg)](https://github.com/badeball/cypress-configuration/actions/workflows/build.yml)
[![Npm package weekly downloads](https://badgen.net/npm/dw/@badeball/cypress-configuration)](https://npmjs.com/package/@badeball/cypress-configuration)

A re-implementation of Cypress' configuration resolvement and search for test files. These mechanisms
[aren't exposed][issue] by Cypress, but are nonetheless necessary for EG.
[@badeball/cypress-cucumber-preprocessor][cypress-cucumber-preprocessor],
[@badeball/cypress-parallel][cypress-parallel] and the upcoming VSCode extention for the Cypress + Cucumber integration.

[issue]: https://github.com/cypress-io/cypress/issues/9014
[cypress-cucumber-preprocessor]: https://github.com/badeball/cypress-cucumber-preprocessor
[cypress-parallel]: https://github.com/badeball/cypress-parallel

## Installation

```
$ npm install @badeball/cypress-configuration
```

## Usage

```ts
import { getConfiguration } from "@badeball/cypress-configuration";

const { fixturesFolder, integrationFolder } = getConfiguration({
  cwd: process.cwd(),
  env: process.env,
  argv: ["--config", "integrationFolder=cypress/custom-location"]
});

console.log(fixturesFolder); // => "cypress/fixtures"
console.log(integrationFolder); // => "cypress/custom-location"
```
