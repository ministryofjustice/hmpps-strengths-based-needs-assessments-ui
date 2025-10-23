import { Fixture } from '../../support/commands/fixture'
import { AccessMode } from '../../support/commands/api'
import { backgroundSubsectionName } from './journeys/common'

describe('read-only mode', () => {
  before(() => {
    cy.loadFixture(Fixture.CompleteAssessment)
    cy.lockAssessment()
    cy.enterAssessment()
    cy.sectionHasCompletionBlueTick('Finance')
    cy.visitStep('/finance')
    cy.getQuestion('Does Sam want to make changes to their finances?')
      .getRadio('I am actively making changes')
      .clickLabel()
    cy.getQuestion('Does Sam want to make changes to their finances?')
      .getRadio('I am actively making changes')
      .getConditionalQuestion()
      .enterText('This is the latest version')
    cy.saveAndContinue()
    cy.sectionHasCompletionBlueTick('Finance')
  })

  it('latest assessment version is accessed in read-only mode', () => {
    cy.enterAssessment(AccessMode.READ_ONLY, {}, false)
    cy.get('.offender-details__top [data-previous-versions-link]').should('contain.text', 'View previous versions')
    cy.visitSection('Finance').enterBackgroundSubsection()
    cy.getSummary('Does Sam want to make changes to their finances?')
      .getAnswer('I am actively making changes')
      .hasSecondaryAnswer('This is the latest version')
  })

  it('previous assessment version is accessed in read-only mode', () => {
    cy.enterAssessment(AccessMode.READ_ONLY, { assessmentVersion: 0 }, false)
    cy.sectionHasCompletionBlueTick('Finance')
    cy.visitSection('Finance').enterBackgroundSubsection()
    cy.get('html').contains('This is the latest version').should('not.exist')
    cy.contains('.govuk-button', 'Return to OASys').should('be.visible')
  })

  it('part-complete assessment is accessed in read-only mode', () => {
    cy.enterAssessment()
    cy.sectionHasCompletionBlueTick('Drug use')

    cy.visitSection('Drug use').enterBackgroundSubsection()
    cy.getSummary('Has Sam ever misused drugs?').clickChange()
    cy.getQuestion('Has Sam ever misused drugs?').getRadio('Yes').clickLabel()
    cy.saveAndContinue()

    cy.sectionDoesNotHaveCompletionBlueTick('Drug use')
    cy.assertResumeUrlIs('Drug use', backgroundSubsectionName, '/add-drugs')

    cy.enterAssessment(AccessMode.READ_ONLY, {}, false)
    cy.sectionDoesNotHaveCompletionBlueTick('Drug use')
    cy.visitSection('Drug use').enterPractitionerAnalysisSubsection()
    cy.assertStepUrlIs('/drug-use-analysis-summary')
    cy.contains('.govuk-button', 'Return to OASys').should('be.visible')
  })

  it('latest version is no longer accessible when soft-deleted', () => {
    cy.softDeleteAssessment(1)

    Array.of(AccessMode.READ_ONLY, AccessMode.READ_WRITE).forEach(accessMode => {
      if (accessMode === AccessMode.READ_WRITE) {
        cy.enterAssessment(accessMode)
      } else {
        cy.enterAssessment(accessMode, {}, false)
      }
      cy.sectionHasCompletionBlueTick('Finance')
      cy.visitSection('Finance').enterBackgroundSubsection()
      cy.get('html').contains('This is the latest version').should('not.exist')
    })
  })
})
