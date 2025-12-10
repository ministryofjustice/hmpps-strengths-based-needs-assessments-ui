import {
  drugDetailsInjectedBefore,
  drugDetailsInjectedBeforeEach,
  questions,
  stepUrl,
} from './common/drug-details-injected-setup'

describe('/drug-details-injected accessibility', () => {
  before(drugDetailsInjectedBefore(stepUrl, questions))
  beforeEach(drugDetailsInjectedBeforeEach(stepUrl))

  it('Should have no accessibility violations', () => {
    cy.checkAccessibility()
  })
})
