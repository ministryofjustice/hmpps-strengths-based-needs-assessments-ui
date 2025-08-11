import { AccessMode } from '../../support/commands/api'
import { Fixture } from '../../support/commands/fixture'

describe('Data privacy declaration', () => {
  before(() => {
    cy.loadFixture(Fixture.CompleteAssessment)
  })

  it('renders the page correctly', () => {
    cy.enterAssessment(AccessMode.READ_WRITE, {}, false)
    cy.get('title').contains(
      'Remember to close any other applications before starting an appointment - Strengths and needs',
    )
    cy.get('.govuk-heading-l').contains(
      'Remember to close any other applications before starting an appointment with Sam',
    )
    cy.get('.govuk-body').contains('For example, Outlook, Teams or NDelius.')
    cy.get('.govuk-body').contains('You must do this to avoid sharing sensitive information.')
    cy.get('.govuk-body').contains('You should not let Sam use your device either.')
    cy.get('.govuk-checkboxes').contains("I confirm I'll close any other applications before starting an appointment")
    cy.get('button[name="action"][value="confirm"]').contains('Confirm')
    cy.contains('a.govuk-link--no-visited-state', 'Return to OASys')
      .should('have.attr', 'href')
      .and('include', Cypress.env('OASYS_UI_URL'))
  })

  it('displays validation error when submitting form without checkbox=checked', () => {
    cy.enterAssessment(AccessMode.READ_WRITE, {}, false)
    cy.get('button[name="action"][value="confirm"]').click()
    cy.url().should('include', '/close-any-other-applications-before-appointment')
    cy.get('.govuk-error-summary').should(
      'contain',
      "Confirm you'll close any other applications before starting an appointment",
    )
    cy.get('#privacy_screen_declaration-error').should(
      'contain',
      "Confirm you'll close any other applications before starting an appointment",
    )
  })

  // Completed assessment will redirect to analysis instead of current accommodation
  it('submits the form - redirecting to accommodation-analysis', () => {
    cy.enterAssessment()
    cy.url().should('include', '/accommodation-analysis')
  })
})
