import { drugDetailsInjectedBefore, drugDetailsInjectedBeforeEach } from './common/drug-details-injected-setup'

describe('/drug-details-injected accessibility', () => {
  before(drugDetailsInjectedBefore())
  beforeEach(drugDetailsInjectedBeforeEach())

  it('Should have no accessibility violations', () => {
    cy.checkAccessibility()
  })
})
