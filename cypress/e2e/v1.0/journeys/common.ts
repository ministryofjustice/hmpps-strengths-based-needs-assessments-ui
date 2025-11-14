export const backgroundSubsectionName = 'Information'
export const practitionerAnalysisSubsectionName = 'Practitioner analysis'

const fillBackgroundQuestions = (sectionName: string, checkDrugUseMotivation = false) => {
  const sectionNameLowerCase = sectionName.toLowerCase()
  const subjectPrefix = sectionNameLowerCase.endsWith('s') ? 'Are' : 'Is'

  Array.of(
    `Are there any strengths or protective factors related to Sam's ${sectionName.toLowerCase()}?`,
    `${subjectPrefix} Sam's ${sectionNameLowerCase} linked to risk of serious harm?`,
    `${subjectPrefix} Sam's ${sectionNameLowerCase} linked to risk of reoffending?`,
  ).forEach(question => {
    cy.getQuestion(question).getRadio('No').clickLabel()
  })

  if (sectionName === 'Drug use' && checkDrugUseMotivation) {
    cy.getQuestion('Does Sam seem motivated to stop or reduce their drug use?').getRadio('Unknown').clickLabel()
  }
}

export const completePractitionerAnalysisBeforeBackground = (sectionName: string, origin: string) => {
  describe(`Completing PA first does not mark section as complete`, () => {
    it(`Completing PA`, () => {
      cy.visitStep(origin)

      fillBackgroundQuestions(sectionName, sectionName === 'Drug use')

      cy.saveAndContinue()
      cy.sectionCompleteTagIsIncompleteAndNoBlueTick(sectionName)
    })
  })
}

export const testPractitionerAnalysis = (
  sectionName: string,
  origin: string,
  destinationSubsection: string,
  destination: string,
  changesDrugUseStateToYes?: boolean,
) => {
  describe(`Destination: ${destination}`, () => {
    it(`routes to ${destination}`, () => {
      cy.visitStep(origin)

      cy.get('a').contains('Continue to practitioner analysis').click()

      // If there is a 'Change' link on this page then we are on a summary page, so click it to get back to the questions.
      // We have to use this convoluted method because if we used `get` to look for the link, the whole test would fail
      // if it wasn't there.
      cy.get('body').then($body => {
        if ($body.find('.analysis-summary__item .govuk-link').length > 0) {
          cy.get('.analysis-summary__item .govuk-link').filter(':contains(Change)').first().click()
        }
      })

      fillBackgroundQuestions(sectionName, changesDrugUseStateToYes)

      cy.markAsComplete()

      cy.assertStepUrlIs(destination)
      cy.assertResumeUrlIs(sectionName, destinationSubsection, destination)
      cy.sectionHasCompleteTagAndBlueTick(sectionName)

      // Check editing a background question does not remove the complete status
      cy.visitStep(origin)
      cy.get('.govuk-summary-list__actions .govuk-link').filter(':contains(Change)').last().click()
      cy.saveAndContinue()
      cy.assertStepUrlIs(origin)

      // when the first questions in Drug use is changed this marks the section as incomplete
      if (sectionName === 'Drug use' && !changesDrugUseStateToYes) {
        cy.sectionCompleteTagIsIncompleteAndNoBlueTick(sectionName)
      } else {
        cy.sectionHasCompleteTagAndBlueTick(sectionName)
      }
    })
  })
}
