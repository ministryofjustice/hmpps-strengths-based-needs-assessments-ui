import testPractitionerAnalysis from '../../common/practitioner-analysis/testPractitionerAnalysis'
import sections from '../../../../../app/form/v1_0/config/sections'

const summaryPage = `/${sections.alcohol.subsections.background.stepUrls.backgroundSummary}`
const analysisPage = `/${sections.alcohol.subsections.practitionerAnalysis.stepUrls.analysis}`
const analysisSummaryPage = `/${sections.alcohol.subsections.practitionerAnalysis.stepUrls.analysisSummary}`

before(() => {
  cy.createAssessment().enterAssessment()

  cy.visitSection('Alcohol use').enterBackgroundSubsection()
  cy.getQuestion('Has Sam ever drunk alcohol?').getRadio('No').clickLabel()
  cy.saveAndContinue()
  cy.assertStepUrlIs(summaryPage)
  cy.assertResumeUrlIs('Alcohol use', 'Assessment', summaryPage)

  cy.captureAssessment()
})

beforeEach(() => {
  cy.cloneCapturedAssessment().enterAssessment()
  cy.visitStep(analysisPage)
  cy.hasAutosaveEnabled()
  cy.hasFeedbackLink()
})

testPractitionerAnalysis(analysisPage, analysisSummaryPage, 'alcohol use')
