import { Fixture } from '../../support/commands/fixture'
import { AccessMode } from '../../support/commands/api'

describe('read-only mode', () => {
  before(() => {
    cy.loadFixture(Fixture.CompleteAssessment)
    cy.lockAssessment()
    cy.enterAssessment().completePrivacyDeclaration()
    cy.sectionMarkedAsComplete('Finance')
    cy.visitStep('/finance')
    cy.getQuestion('Does Sam want to make changes to their finances?')
      .getRadio('I am actively making changes')
      .clickLabel()
    cy.getQuestion('Does Sam want to make changes to their finances?')
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
    cy.getSummary('Does Sam want to make changes to their finances?')
      .getAnswer('I am actively making changes')
      .hasSecondaryAnswer('This is the latest version')
  })

  it('previous assessment version is accessed in read-only mode', () => {
    cy.enterAssessment(AccessMode.READ_ONLY, { assessmentVersion: 0 })
    cy.sectionMarkedAsComplete('Finance')
    cy.visitSection('Finance')
    cy.get('html').contains('This is the latest version').should('not.exist')
  })

  it('part-complete assessment is accessed in read-only mode', () => {
    cy.enterAssessment().completePrivacyDeclaration()
    cy.sectionMarkedAsComplete('Drug use')

    cy.visitSection('Drug use')
    cy.getSummary('Has Sam ever misused drugs?').clickChange()
    cy.getQuestion('Has Sam ever misused drugs?').getRadio('Yes').clickLabel()
    cy.saveAndContinue()

    cy.sectionNotMarkedAsComplete('Drug use')
    cy.assertResumeUrlIs('Drug use', '/add-drugs')

    cy.enterAssessment(AccessMode.READ_ONLY)
    cy.sectionNotMarkedAsComplete('Drug use')
    cy.visitSection('Drug use')
    cy.assertStepUrlIs('/drug-use-analysis')
  })

  it('latest version is no longer accessible when soft-deleted', () => {
    cy.softDeleteAssessment(1)

    Array.of(AccessMode.READ_ONLY, AccessMode.READ_WRITE).forEach(accessMode => {
      cy.enterAssessment(accessMode)
      if (accessMode === AccessMode.READ_WRITE) {
          cy.completePrivacyDeclaration()
      }
      cy.sectionMarkedAsComplete('Finance')
      cy.visitSection('Finance')
      cy.get('html').contains('This is the latest version').should('not.exist')
    })
  })
})
