import {
  drugDetailsInjectedBefore,
  drugDetailsInjectedBeforeEach,
  questions,
  stepUrl,
} from './common/drug-details-injected-setup'

describe('/drug-details-injected accessibility', () => {
  before(drugDetailsInjectedBefore())
  beforeEach(drugDetailsInjectedBeforeEach())

  it('Should have no accessibility violations', () => {
    cy.checkAccessibility()
  })
})
