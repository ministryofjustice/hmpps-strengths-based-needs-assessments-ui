import testPractitionerAnalysis from '../../common/practitioner-analysis/testPractitionerAnalysis'
import sections from '../../../../../app/form/v1_0/config/sections'

const summaryPage = `/${sections.finance.subsections.background.stepUrls.backgroundSummary}`
const analysisPage = `/${sections.finance.subsections.practitionerAnalysis.stepUrls.analysis}`
const analysisSummaryPage = `/${sections.finance.subsections.practitionerAnalysis.stepUrls.analysisSummary}`

before(() => {
  cy.createAssessment().enterAssessment()

  cy.visitSection('Finance').enterBackgroundSubsection()
  cy.getQuestion('Where does Sam currently get their money from?').getCheckbox('No money').clickLabel()
  cy.getQuestion('Does Sam have their own bank account?').getRadio('Unknown').clickLabel()
  cy.getQuestion('How good is Sam at managing their money?')
    .getRadio('Able to manage their money well and is a strength')
    .clickLabel()
  cy.getQuestion('Is Sam affected by gambling?').getCheckbox('Unknown').clickLabel()
  cy.getQuestion('Is Sam affected by debt?').getCheckbox('Unknown').clickLabel()
  cy.getQuestion('Does Sam want to make changes to their finances?').getRadio('Not applicable').clickLabel()
  cy.saveAndContinue()

  cy.assertStepUrlIs(summaryPage)
  cy.assertResumeUrlIs('Finance', 'Finances background', summaryPage)

  cy.captureAssessment()
})

beforeEach(() => {
  cy.cloneCapturedAssessment().enterAssessment()
  cy.visitStep(analysisPage)
  cy.hasAutosaveEnabled()
  cy.hasFeedbackLink()
})

testPractitionerAnalysis(analysisPage, analysisSummaryPage, 'finances')
