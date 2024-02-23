describe('Health endpoint', () => {
  it('is visible and healthy', () => {
    cy.request('/health').its('body.healthy').should('equal', true)
  })
})

describe('Ping endpoint', () => {
  it('is visible and UP', () => {
    cy.request('/ping').its('body.status').should('equal', 'UP')
  })
})
