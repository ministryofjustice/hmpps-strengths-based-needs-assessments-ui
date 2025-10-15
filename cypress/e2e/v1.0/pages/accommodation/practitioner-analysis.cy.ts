import testPractitionerAnalysis from '../../common/practitioner-analysis/testPractitionerAnalysis'
import sections from '../../../../../app/form/v1_0/config/sections'

const backgroundSummaryPage = `/${sections.accommodation.subsections.background.stepUrls.backgroundSummary}`
const analysisPage = `/${sections.accommodation.subsections.practitionerAnalysis.stepUrls.analysis}`
const analysisSummaryPage = `/${sections.accommodation.subsections.practitionerAnalysis.stepUrls.analysisSummary}`

before(() => {
  cy.createAssessment().enterAssessment()

  cy.visitSection('Accommodation').enterBackgroundSubsection()
  cy.getQuestion('What type of accommodation does Sam currently have?').getRadio('Settled').clickLabel()
  cy.getQuestion('What type of accommodation does Sam currently have?')
    .getRadio('Settled')
    .getConditionalQuestion()
    .getRadio('Homeowner')
    .clickLabel()
  cy.saveAndContinue()

  cy.getQuestion('Who is Sam living with?').getCheckbox('Alone').clickLabel()
  cy.getQuestion("Is the location of Sam's accommodation suitable?").getRadio('Yes').clickLabel()
  cy.getQuestion("Is Sam's accommodation suitable?").getRadio('Yes').clickLabel()
  cy.getQuestion('Does Sam want to make changes to their accommodation?').getRadio('Not applicable').clickLabel()
  cy.saveAndContinue()

  cy.assertResumeUrlIs('Accommodation', 'Accommodation background', backgroundSummaryPage)
  cy.captureAssessment()
})

beforeEach(() => {
  cy.cloneCapturedAssessment().enterAssessment()
  cy.visitStep(analysisPage)
  cy.hasAutosaveEnabled()
  cy.hasFeedbackLink()
})

testPractitionerAnalysis(analysisPage, analysisSummaryPage, 'accommodation')
