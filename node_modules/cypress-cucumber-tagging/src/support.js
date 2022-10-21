const parse = require('@cucumber/tag-expressions').default
const debug = require('debug')('cypress-cucumber-tagging')
debug.log = console.info.bind(console)

// preserve the real "it" & "describe" functions
const _it = it
const _describe = describe

const cypressTagGrep = () => {

  // list of "describe" suites for the current test
  // when we encounter a new suite, we push it to the stack
  // when the "describe" function exits, we pop it
  // Thus a test can look up the tags from its parent suites
  const suiteStack = []
  describe = function describeGrep (description, options, callback ) {
    if (typeof options === 'function') {
      // the test case has the format as --  describe('...', cb)
      callback = options
      options = {}
    }

    const stackItem = { description }
    suiteStack.push(stackItem)

    if (!callback) {
      // the pending suite by itself
      const result = _describe(name, options)
      suiteStack.pop()
      return result
    }

    const testTags = options ? options.tags : [] // tags provided for the test case/suite
    if (testTags && testTags.length) {
      // if the describe suite has explicit tags
      // store it up for future use
      stackItem.tags = testTags
    }

    // if the suite has its own tags or not, it can go ahead
    _describe(name, options, callback)
    suiteStack.pop()

    return
  }

  // redefine the implementation of it() to facilitate the addition of tags
  it = function itGrep (description, options, callback ) {
    if (typeof options === "function") {
      // the test case has the format as --  it('...', cb)
      callback = options
      options = {}
    }

    if (!callback) {
      // the pending test by itself
      return _it(name, options)
    }

    const configTags = options ? options.tags : [] // tags provided for the test case/suite
    // merge the tags available with the test case with the tags of the test suite
    // FYI, Boolean filter is just to cleanse the array
    const testTags = suiteStack.flatMap(item => item.tags).concat(configTags).filter(Boolean)

    const executionTags = Cypress.env('tags') // tags provided for test execution during the call

    if (!executionTags) return _it(description, options, callback)

    const expression = parse(executionTags)
    if (expression.evaluate(testTags)) {
      return _it(description, options, callback);
    }
  }

  // overwrite "specify" which is an alias to "it"
  specify = it

  // keep the ".skip", ".only" methods the same as before
  it.skip = _it.skip
  it.only = _it.only
  // preserve "it.each" method if found
  // https://github.com/cypress-io/cypress-grep/issues/72
  if (typeof _it.each === 'function') {
    it.each = _it.each
  }

  // overwrite "context" which is an alias to "describe"
  context = describe

  describe.skip = _describe.skip
  describe.only = _describe.only
  if (typeof _describe.each === 'function') {
    describe.each = _describe.each
  }
}

module.exports = cypressTagGrep
