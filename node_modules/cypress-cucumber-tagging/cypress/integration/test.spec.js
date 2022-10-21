it('Test case 1', { tags: ['@config', '@unit'] }, () => {
  cy.log(Cypress.env('tags'))
  expect(true).to.be.true
})

it('Test case 2', { tags: ['@config'] }, () => {
  expect(true).to.be.true
})

describe('block with config tag', { tags: ['@smoke'] }, () => {

  it('dummy1', () => {}) // the tag from describe will be applicable for this as well

  it('dummy2', { tags: ['@config'] }, () => {}) // the tag from describe will be applicable for this as well
})
