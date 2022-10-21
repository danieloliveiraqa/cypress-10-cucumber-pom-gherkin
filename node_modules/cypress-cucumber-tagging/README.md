# cypress-cucumber-tagging
Node Module to help in cucumber based tag expression for executing Cypress test suite/case based on given tag expression.

The intention of this package is for helping the execution of test cases/suites specific to a feature or a scenario identified based on tags. \
This is achieved by logically grouping tag expressions (cucumber styled tag expression)

This can extensively be used in cypress BDD as well.

## Install

Assuming you have Cypress installed, add this module as a dev dependency

```shell
# using NPM
npm i -D cypress-cucumber-tagging
# using Yarn
yarn add -D cypress-cucumber-tagging
```
### Support file

**required:** load this module from the [support file](https://on.cypress.io/writing-and-organizing-tests#Support-file) or at the top of the spec file if not using the support file.

```js
// cypress/support/index.js
// load and register the tag feature
// https://github.com/RSMuthu/cypress-cucumber-tagging
require('cypress-cucumber-tagging/src/support')()
```

### Plugin file

**required:** load and register this module from the [plugin file](https://on.cypress.io/writing-and-organizing-tests#Plugins-file)

```js
// cypress/plugins/index.js
module.exports = (on, config) => {
  // https://github.com/RSMuthu/cypress-cucumber-tagging
  require('cypress-cucumber-tagging/src/plugin')(config)
  // make sure to return the config object
  // as it might have been modified by the plugin
  return config
}
```

After loading this module from the plugin file, it allows the `cypress-cucumber-tagging` to print a little message on load, for example

```shell
$ npx cypress run --env tags="not (@unit or @config)"
The Tag expression input for testing: "not (@unit or @config)"

```

## Use
```shell
# run only the tests with tag "@unit"
$ npx cypress run --env tags=@unit
# run only the tests with tag "@unit" or "@config"
$ npx cypress run --env tags="@unit or @config"
# run only the tests with tags "@unit" and "@config"
$ npx cypress run --env tags="@unit and @config"
# run only the tests with tags "@unit" and "@config" or the tests with tag "@smoke"
$ npx cypress run --env tags="(@unit and @config) or @smoke"
# run any the tests with tags neither "@unit" nor "@config"
$ npx cypress run --env tags="not (@unit or @config)"
```
For more cucumber styled tag expressions: [https://cucumber.io/docs/cucumber/api/#tag-expressions](https://cucumber.io/docs/cucumber/api/#tag-expressions)

### Tags in the test config object

Every Cypress tests can have their own test config object ([Refer Here](https://on.cypress.io/configuration#Test-Configuration)), and you can put the test tags under this test config object, either as a single tag string or as an array of tags.

**Note**: The tags can be added to test config to either of `it()` or `describe()`.

```js
it('Test case 1', { tags: ['@config', '@unit'] }, () => {
  expect(true).to.be.true
})

describe('Test Suite 1', { tags: ['@smoke', '@config'] }, () => {
  it('Test case 2', () => {
    expect(true).to.be.true
  })
})
```

You can run both of these test cases using `--env tags=@config` string. (all the tags of `describe()` are inherited by the `it()` wrapped under that `describe()`)

As a _**best practice**_, please use the `'@'` symbol as prefix to the tag word used in any test.

Author: Muthu Kumaran R &lt;rsmuthu@duck.com&gt;
