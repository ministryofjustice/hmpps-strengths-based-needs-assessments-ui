import { Fixture } from '../../support/commands/fixture'
import { AccessMode } from '../../support/commands/api'

describe('read-only mode', () => {
  before(() => {
    cy.loadFixture(Fixture.CompleteAssessment)
    cy.lockAssessment()
    cy.enterAssessment()
    cy.sectionMarkedAsComplete('Finance')
    cy.visitStep('/finance')
    cy.getQuestion('Does Sam want to make changes to their finance?')
      .getRadio('I am actively making changes')
      .clickLabel()
    cy.getQuestion('Does Sam want to make changes to their finance?')
      .getRadio('I am actively making changes')
      .getConditionalQuestion()
      .enterText('This is the latest version')
    cy.saveAndContinue()
    cy.sectionNotMarkedAsComplete('Finance')
  })

  it('latest assessment version is accessed in read-only mode', () => {
    cy.enterAssessment(AccessMode.READ_ONLY)
    cy.sectionNotMarkedAsComplete('Finance')
    cy.visitSection('Finance')
    cy.getSummary('Does Sam want to make changes to their finance?')
      .getAnswer('I am actively making changes')
      .hasSecondaryAnswer('This is the latest version')
  })

  it('previous assessment version is accessed in read-only mode', () => {
    cy.enterAssessment(AccessMode.READ_ONLY, { assessmentVersion: 0 })
    cy.sectionMarkedAsComplete('Finance')
    cy.visitSection('Finance')
    cy.get('html').contains('This is the latest version').should('not.exist')
  })
})
