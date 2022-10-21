const debug = require('debug')('cypress-cucumber-tagging')
const fs = require('fs')
const globby = require('globby')
const path = require('path')
const { getTestNames } = require('find-test-names')
const parse = require('@cucumber/tag-expressions').default

function GrepSpecOnTag (config) {
  // do nothing if the tags are not passed
  if (!config.env.tags) return config
  console.log(`The Tag expression input for testing: "${config.env.tags.trim()}"`)
  // find the path of spec files
  const specBasePath = (config.testingType === 'e2e') ? config.integrationFolder : config.componentFolder
  const specFiles = globby.sync(config.testFiles, {
    cwd: specBasePath,
    ignore: config.ignoreTestFiles,
    absolute: false,
  })
  // filter the spec files based on the tag expression
  const specsWithText = specFiles.filter((specFile) => {
    const text = fs.readFileSync(
      path.join(specBasePath, specFile),
      'utf8',
    )
    try {
      const testInfo = getTestNames(text)
      const expression = parse(config.env.tags)
      return testInfo.tests.some((info) => {
        return info.tags && expression.evaluate(info.tags)
      })
    } catch (err) {
      console.error('Could not determine test names in file: %s', specFile)
      console.error('Will run it to let the grep filter the tests')
      return true
    }
  })
  debug('found %d spec files', specsWithText.length)
  // update the config with the updated spec file list
  config.testFiles = specsWithText
}

module.exports = GrepSpecOnTag
